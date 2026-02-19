import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface FillRequest {
    rows: string[][]
    headers: string[]
    contextColumns: string[]
    targetColumn: string
    prompt: string
    model: string
    batchIndex: number
}

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'ANTHROPIC_API_KEY が設定されていません' },
                { status: 500 }
            )
        }

        const body: FillRequest = await request.json()
        const { rows, headers, contextColumns, targetColumn, prompt, model } = body

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { error: 'データが空です' },
                { status: 400 }
            )
        }

        const client = new Anthropic({ apiKey })

        // コンテキスト列のインデックスを取得
        const contextIndices = contextColumns.map(col => headers.indexOf(col)).filter(i => i >= 0)

        // 各行のコンテキスト情報を整形
        const rowsText = rows.map((row, i) => {
            const context = contextIndices.map(ci => `${headers[ci]}: ${row[ci] || '(空)'}`).join(', ')
            return `行${i}: ${context}`
        }).join('\n')

        const systemPrompt = `あなたはデータ入力の専門家です。与えられた各行について、コンテキスト情報を元にWeb検索を行い、「${targetColumn}」列の値を特定してください。

ユーザーの指示:
${prompt}

必ず以下のJSON形式で結果を返してください。
【重要】JSON以外のテキストは含めないでください。マークダウンのコードブロックで囲まないでください。純粋なJSONのみ出力してください。

{"results":[{"rowIndex":0,"value":"検索で見つけた値","confidence":"high","source":"参照URL","note":"補足情報"}]}

confidenceの基準:
- high: 信頼できる情報源から確認できた
- medium: 情報源はあるが確実性にやや欠ける
- low: 推測を含む、または情報が見つからなかった

valueが見つからない場合は空文字 "" を設定し、confidenceを "low"、noteに理由を記載してください。`

        const userContent = `## 対象データ（${rows.length}件）\n\n対象列: ${targetColumn}\n\n${rowsText}`

        // Claude API呼出パラメータ
        const streamParams: Anthropic.MessageCreateParamsNonStreaming = {
            model: model || 'claude-sonnet-4-5-20250929',
            max_tokens: 16384,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userContent },
                { role: 'assistant', content: '{' },
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tools: [
                {
                    type: 'web_search_20250305',
                    name: 'web_search',
                    max_uses: rows.length * 3,
                },
            ] as any,
        }

        const messageStream = client.messages.stream(streamParams)

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                controller.enqueue(encoder.encode('{'))
                try {
                    for await (const event of messageStream) {
                        if (
                            event.type === 'content_block_delta' &&
                            event.delta.type === 'text_delta'
                        ) {
                            controller.enqueue(encoder.encode(event.delta.text))
                        }
                    }
                    controller.close()
                } catch (error) {
                    const errMsg = error instanceof Error ? error.message : '不明なエラー'
                    const isRateLimit = errMsg.includes('rate_limit') || errMsg.includes('429')
                    try {
                        controller.enqueue(encoder.encode('\n{"__stream_error":"' + errMsg.replace(/["\\\n]/g, ' ') + '","__status":' + (isRateLimit ? 429 : 500) + '}'))
                    } catch { /* controller closed */ }
                    try { controller.close() } catch { /* already closed */ }
                }
            }
        })

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                'X-Accel-Buffering': 'no',
            },
        })
    } catch (error) {
        console.error('Fill column error:', error)
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429
            : errMsg.includes('overloaded') || errMsg.includes('529') ? 529
            : 500
        return NextResponse.json({ error: errMsg }, { status })
    }
}

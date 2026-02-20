import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface TargetColumnDef {
    column: string
    description: string
}

interface FillRequest {
    rows: string[][]
    headers: string[]
    contextColumns: string[]
    targetColumns: TargetColumnDef[]
    prompt: string
    model: string
    batchIndex: number
    preCheckContext?: string
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
        const { rows, headers, contextColumns, targetColumns, prompt, model, preCheckContext } = body

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

        const preCheckSection = preCheckContext
            ? `\n\n## 事前確認の要約（この内容を踏まえて入力してください）\n${preCheckContext}\n`
            : ''

        const targetColumnsDesc = targetColumns.map(tc =>
            `- 「${tc.column}」: ${tc.description || '（説明なし）'}`
        ).join('\n')

        const valuesExample = targetColumns.map(tc =>
            `"${tc.column}":"値"`
        ).join(',')

        const systemPrompt = `あなたはデータ入力の専門家です。与えられた各行について、コンテキスト情報を元にWeb検索を行い、以下の列の値を特定してください。

## 入力対象列
${targetColumnsDesc}

ユーザーの指示:
${prompt}${preCheckSection}

必ず以下のJSON形式で結果を返してください。
【重要】JSON以外のテキストは含めないでください。マークダウンのコードブロックで囲まないでください。純粋なJSONのみ出力してください。

{"results":[{"rowIndex":0,"values":{${valuesExample}},"confidence":"high","note":"補足情報"}]}

confidenceの基準:
- high: 信頼できる情報源から確認できた
- medium: 情報源はあるが確実性にやや欠ける
- low: 推測を含む、または情報が見つからなかった

値が見つからない場合は空文字 "" を設定し、confidenceを "low"、noteに理由を記載してください。`

        const targetColumnNames = targetColumns.map(tc => tc.column).join(', ')
        const userContent = `## 対象データ（${rows.length}件）\n\n対象列: ${targetColumnNames}\n\n${rowsText}`

        // Claude API呼出パラメータ
        const streamParams: Anthropic.MessageCreateParamsNonStreaming = {
            model: model || 'claude-sonnet-4-6',
            max_tokens: 16384,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userContent },
            ],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tools: [
                {
                    type: 'web_search_20250305',
                    name: 'web_search',
                    max_uses: Math.min(rows.length * 2, 40),
                },
            ] as any,
        }

        const messageStream = client.messages.stream(streamParams)

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
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

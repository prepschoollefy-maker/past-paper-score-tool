import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface ValidateRequest {
    rows: string[][]
    headers: string[]
    prompt: string
    mode: 'web' | 'pdf'
    pdfBase64?: string
    model: string
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

        const body: ValidateRequest = await request.json()
        const { rows, headers, prompt, mode, pdfBase64, model, preCheckContext } = body

        if (!rows || rows.length === 0) {
            return NextResponse.json(
                { error: '検証データが空です' },
                { status: 400 }
            )
        }

        const client = new Anthropic({ apiKey })

        // データをテーブル形式に整形
        const tableHeader = headers.join(' | ')
        const tableRows = rows.map((row, i) =>
            `行${i + 1}: ${row.join(' | ')}`
        ).join('\n')

        const dataText = `## データ（${rows.length}件）\n\nヘッダー: ${tableHeader}\n\n${tableRows}`

        const systemPrompt = `あなたはデータ検証の専門家です。与えられたデータの各行について、ユーザーの指示に従って正確性を確認してください。

必ず以下のJSON形式で結果を返してください。
【重要】JSON以外のテキストは含めないでください。マークダウンのコードブロック(\`\`\`json ... \`\`\`)で囲まないでください。純粋なJSONのみ出力してください。

{"results":[{"rowIndex":0,"status":"OK","details":"説明","corrections":[{"column":"ヘッダー名","original":"現在の値","corrected":"修正後の値"}],"sources":["URL"]}]}

ステータスの基準:
- OK: データが正確であることを確認できた
- NG: 明らかな誤りを発見した（具体的に何が間違っているか記載）
- WARN: 確認できなかった、または疑わしい点がある（理由を記載）

NGまたはWARNの場合、修正が必要な列ごとにcorrections配列で具体的な修正内容を返してください。columnにはヘッダー名を、originalには現在の値を、correctedには修正後の値を指定してください。`

        // 事前確認コンテキストがある場合、追加
        const preCheckSection = preCheckContext
            ? `\n\n## 事前確認で合意した検証方針\n${preCheckContext}`
            : ''

        // メッセージコンテンツを構築
        const userContent: Anthropic.ContentBlockParam[] = []

        // PDFモードの処理
        if (mode === 'pdf' && pdfBase64) {
            userContent.push({
                type: 'document',
                source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: pdfBase64,
                },
            })
            userContent.push({
                type: 'text',
                text: `## 検証指示\n${prompt}\n\n上記のPDFは原本データです。以下のデータがPDFの内容と一致しているか照合してください。\n\n${dataText}`,
            })
        } else {
            userContent.push({
                type: 'text',
                text: `## 検証指示\n${prompt}\n\n${dataText}`,
            })
        }

        // Claude API呼出パラメータ
        const streamParams: Anthropic.MessageCreateParamsNonStreaming = {
            model: model || 'claude-sonnet-4-6',
            max_tokens: 16384,
            system: systemPrompt + preCheckSection,
            messages: [{ role: 'user', content: userContent }],
        }

        // Webモードの場合、web_searchツールを有効化
        if (mode === 'web') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (streamParams as any).tools = [
                {
                    type: 'web_search_20250305',
                    name: 'web_search',
                    max_uses: rows.length * 2,
                },
            ]
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
                    // エラーをJSONとして送信（クライアントが検出可能）
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
        console.error('Validate data error:', error)
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429
            : errMsg.includes('overloaded') || errMsg.includes('529') ? 529
            : 500
        return NextResponse.json({ error: errMsg }, { status })
    }
}

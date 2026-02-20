import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface PreCheckRequest {
    headers: string[]
    sampleRows: string[][]
    prompt: string
    mode: 'web' | 'pdf'
    pdfBase64?: string
    model: string
    messages: { role: 'user' | 'assistant'; content: string }[]
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

        const body: PreCheckRequest = await request.json()
        const { headers, sampleRows, prompt, mode, pdfBase64, model, messages } = body

        const client = new Anthropic({ apiKey })

        const tableHeader = headers.join(' | ')
        const tableRows = sampleRows.map((row, i) =>
            `行${i + 1}: ${row.join(' | ')}`
        ).join('\n')

        const isPdf = mode === 'pdf' && pdfBase64

        const systemPrompt = `あなたはデータ検証の準備をしている専門家です。

ユーザーがテーブルデータ（CSV/Excelからインポートされた表形式データ）の検証をAIに依頼しようとしています。

重要な指示：
- PDFが添付されている場合、必ずPDFの内容を実際に読み取って確認してから質問してください
- PDFに何が書かれているかを自分で確認し、その内容を踏まえた具体的な質問をしてください
- 「PDFはどのような形式ですか？」のようなPDFを読めばわかる質問はしないでください
- データの各列とPDFのどの部分が対応するか、自分で分析してから不明点のみ質問してください

検証を正確に行うために、以下を確認してください：
1. データの内容と各列の意味を正しく理解できているか
2. 検証プロンプトの意図を正しく理解できているか
3. 何をもってOK/NG/WARNと判定するか基準が明確か
4. 曖昧な点や確認すべきことがないか

必ず以下のJSON形式で回答してください。
【重要】JSON以外のテキストは含めないでください。マークダウンのコードブロック(\`\`\`json ... \`\`\`)で囲まないでください。純粋なJSONのみ出力してください。

{"message":"要約","questions":[{"id":"q1","question":"質問内容"}],"ready":false}

- message: 1-2文で簡潔に。箇条書きや詳細説明は不要。
- questions: 確認したい質問のリスト。各質問は{"id":"q1","question":"質問内容"}の形式。質問がなければ空配列。
- ready: すべて明確で検証開始できる状態ならtrue。

回答は日本語でお願いします。`

        const buildFirstContent = (): Anthropic.ContentBlockParam[] => {
            const content: Anthropic.ContentBlockParam[] = []

            if (isPdf) {
                content.push({
                    type: 'document',
                    source: {
                        type: 'base64',
                        media_type: 'application/pdf',
                        data: pdfBase64,
                    },
                })
            }

            content.push({
                type: 'text',
                text: `以下のデータの検証を依頼します。事前に確認・質問があればお願いします。

## 検証プロンプト（最重要：この内容に基づいて質問してください）
${prompt}

## 検証モード
${isPdf ? 'PDF原本との照合（※上記に添付されたPDFが照合対象の原本です）' : 'Web検索で事実確認'}

## データ（サンプル ${sampleRows.length}行 / 全体はもっと多い可能性あり）

ヘッダー: ${tableHeader}

${tableRows}`,
            })

            return content
        }

        const apiMessages: Anthropic.MessageParam[] = []
        apiMessages.push({ role: 'user', content: buildFirstContent() })

        if (messages.length > 0) {
            for (const msg of messages) {
                apiMessages.push({ role: msg.role, content: msg.content })
            }
        }

        const messageStream = client.messages.stream({
            model: model || 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: systemPrompt,
            messages: apiMessages,
        })

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
                    try {
                        controller.enqueue(encoder.encode('\n{"__stream_error":"' + errMsg.replace(/["\\\n]/g, ' ') + '"}'))
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
        console.error('Pre-check error:', error)
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429
            : errMsg.includes('overloaded') || errMsg.includes('529') ? 529
            : 500
        return NextResponse.json({ error: errMsg }, { status })
    }
}

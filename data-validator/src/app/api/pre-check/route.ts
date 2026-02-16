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

        // サンプルデータをテーブル形式に
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

必ず以下のJSON形式で回答してください。JSON以外のテキストは含めないでください。

{
  "message": "状況の説明や理解した内容の要約（任意）",
  "questions": [
    { "id": "q1", "question": "質問内容" },
    { "id": "q2", "question": "質問内容" }
  ],
  "ready": false,
  "pdfExtract": "（PDFモード時のみ）PDFから読み取った全データをテキスト形式で記載"
}

- questions: 確認したい質問のリスト。質問がなければ空配列。
- ready: すべて明確で検証開始できる状態ならtrue、まだ確認が必要ならfalse。
- readyがtrueの場合、messageに検証方針の要約を記載してください。
${isPdf ? `- pdfExtract: 【PDF照合モード・非常に重要】readyがtrueの場合、PDFから読み取った全データ（数値・テキスト・表）を省略なくテキスト形式で記載してください。このテキストが後続の検証で原本データとして使用されます。PDFの内容を正確かつ網羅的に抽出してください。` : '- pdfExtract: 空文字で構いません。'}

回答は日本語でお願いします。`

        // 初回メッセージを構築する共通関数
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

        // 初回メッセージ
        apiMessages.push({ role: 'user', content: buildFirstContent() })

        // 継続会話の場合、履歴を追加
        if (messages.length > 0) {
            for (const msg of messages) {
                apiMessages.push({ role: msg.role, content: msg.content })
            }
        }

        // ストリーミングレスポンスでVercelタイムアウトを回避
        // 最初の1バイト送信後はタイムアウト制限が解除される
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                // ハートビートを5秒ごとに送信（接続維持）
                const heartbeat = setInterval(() => {
                    try { controller.enqueue(encoder.encode(' ')) } catch { /* stream closed */ }
                }, 5000)

                try {
                    const response = await client.messages.create({
                        model: model || 'claude-sonnet-4-5-20250929',
                        max_tokens: 8192,
                        system: systemPrompt,
                        messages: apiMessages,
                    })

                    clearInterval(heartbeat)

                    const textBlock = response.content.find(
                        (block): block is Anthropic.TextBlock => block.type === 'text'
                    )

                    if (!textBlock) {
                        controller.enqueue(encoder.encode(JSON.stringify({
                            message: '',
                            questions: [],
                            ready: false,
                            pdfExtract: '',
                            error: 'AIからの応答がありませんでした',
                        })))
                        controller.close()
                        return
                    }

                    // JSONパース
                    let result
                    try {
                        let jsonText = textBlock.text.trim()
                        const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)```/)
                        if (jsonMatch) {
                            jsonText = jsonMatch[1].trim()
                        }
                        const firstBrace = jsonText.indexOf('{')
                        if (firstBrace > 0) {
                            jsonText = jsonText.substring(firstBrace)
                        }
                        const parsed = JSON.parse(jsonText)
                        result = {
                            message: parsed.message || '',
                            questions: parsed.questions || [],
                            ready: parsed.ready || false,
                            pdfExtract: parsed.pdfExtract || '',
                        }
                    } catch {
                        result = {
                            message: textBlock.text,
                            questions: [],
                            ready: false,
                            pdfExtract: '',
                        }
                    }

                    controller.enqueue(encoder.encode(JSON.stringify(result)))
                    controller.close()
                } catch (error) {
                    clearInterval(heartbeat)
                    const errMsg = error instanceof Error ? error.message : '不明なエラー'
                    controller.enqueue(encoder.encode(JSON.stringify({
                        message: '',
                        questions: [],
                        ready: false,
                        pdfExtract: '',
                        error: errMsg,
                    })))
                    controller.close()
                }
            }
        })

        return new Response(readable, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
    } catch (error) {
        console.error('Pre-check error:', error)

        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429 : 500

        return NextResponse.json(
            { error: errMsg },
            { status }
        )
    }
}

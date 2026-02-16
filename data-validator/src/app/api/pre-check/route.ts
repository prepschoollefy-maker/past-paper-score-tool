import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

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

        const systemPrompt = `あなたはデータ検証の準備をしている専門家です。

ユーザーがテーブルデータ（CSV/Excelからインポートされた表形式データ）の検証をAIに依頼しようとしています。
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
  "ready": false
}

- questions: 確認したい質問のリスト。質問がなければ空配列。
- ready: すべて明確で検証開始できる状態ならtrue、まだ確認が必要ならfalse。
- readyがtrueの場合、messageに検証方針の要約を記載してください。

回答は日本語でお願いします。`

        // 初回メッセージを構築する共通関数
        const buildFirstContent = (): Anthropic.ContentBlockParam[] => {
            const content: Anthropic.ContentBlockParam[] = []

            if (mode === 'pdf' && pdfBase64) {
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

## データ（サンプル ${sampleRows.length}行 / 全体はもっと多い可能性あり）

ヘッダー: ${tableHeader}

${tableRows}

## 検証モード
${mode === 'pdf' && pdfBase64 ? 'PDF原本との照合（※上記に添付されたPDFが照合対象の原本です）' : 'Web検索で事実確認'}

## 検証プロンプト
${prompt}`,
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

        const response = await client.messages.create({
            model: model || 'claude-sonnet-4-5-20250929',
            max_tokens: 1024,
            system: systemPrompt,
            messages: apiMessages,
        })

        const textBlock = response.content.find(
            (block): block is Anthropic.TextBlock => block.type === 'text'
        )

        if (!textBlock) {
            return NextResponse.json(
                { error: 'AIからの応答がありませんでした' },
                { status: 500 }
            )
        }

        // JSONパース
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
            return NextResponse.json({
                message: parsed.message || '',
                questions: parsed.questions || [],
                ready: parsed.ready || false,
            })
        } catch {
            // JSONパース失敗時はフォールバック
            return NextResponse.json({
                message: textBlock.text,
                questions: [],
                ready: false,
            })
        }
    } catch (error) {
        console.error('Pre-check error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '不明なエラー' },
            { status: 500 }
        )
    }
}

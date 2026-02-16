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

ユーザーがCSVデータの検証をAIに依頼しようとしています。
検証を正確に行うために、以下を確認してください：

1. データの内容と各列の意味を正しく理解できているか
2. 検証プロンプトの意図を正しく理解できているか
3. 何をもってOK/NG/WARNと判定するか基準が明確か
4. 曖昧な点や確認すべきことがないか

質問がある場合は簡潔に質問してください。
すべて明確になった場合は「検証準備完了です。検証を開始できます。」と伝えてください。
回答は日本語で、簡潔にお願いします。`

        // 初回メッセージ（サンプルデータ＋プロンプト）を構築
        const apiMessages: Anthropic.MessageParam[] = []

        if (messages.length === 0) {
            // 初回: サンプルデータとプロンプトを含むメッセージを生成
            const userContent: Anthropic.ContentBlockParam[] = []

            if (mode === 'pdf' && pdfBase64) {
                userContent.push({
                    type: 'document',
                    source: {
                        type: 'base64',
                        media_type: 'application/pdf',
                        data: pdfBase64,
                    },
                })
            }

            userContent.push({
                type: 'text',
                text: `以下のCSVデータの検証を依頼します。事前に確認・質問があればお願いします。

## CSVデータ（サンプル ${sampleRows.length}行 / 全体はもっと多い可能性あり）

ヘッダー: ${tableHeader}

${tableRows}

## 検証モード
${mode === 'web' ? 'Web検索で事実確認' : 'PDF原本との照合'}

## 検証プロンプト
${prompt}`,
            })

            apiMessages.push({ role: 'user', content: userContent })
        } else {
            // 継続: 初回メッセージ + 履歴を構築
            const firstContent: Anthropic.ContentBlockParam[] = []

            if (mode === 'pdf' && pdfBase64) {
                firstContent.push({
                    type: 'document',
                    source: {
                        type: 'base64',
                        media_type: 'application/pdf',
                        data: pdfBase64,
                    },
                })
            }

            firstContent.push({
                type: 'text',
                text: `以下のCSVデータの検証を依頼します。事前に確認・質問があればお願いします。

## CSVデータ（サンプル ${sampleRows.length}行 / 全体はもっと多い可能性あり）

ヘッダー: ${tableHeader}

${tableRows}

## 検証モード
${mode === 'web' ? 'Web検索で事実確認' : 'PDF原本との照合'}

## 検証プロンプト
${prompt}`,
            })

            apiMessages.push({ role: 'user', content: firstContent })

            // 残りの会話履歴
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

        return NextResponse.json({ reply: textBlock.text })
    } catch (error) {
        console.error('Pre-check error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '不明なエラー' },
            { status: 500 }
        )
    }
}

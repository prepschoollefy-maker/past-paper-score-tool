import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface FillPreCheckRequest {
    headers: string[]
    sampleRows: string[][]
    contextColumns: string[]
    targetColumn: string
    prompt: string
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

        const body: FillPreCheckRequest = await request.json()
        const { headers, sampleRows, contextColumns, targetColumn, prompt, model, messages } = body

        const client = new Anthropic({ apiKey })

        const contextIndices = contextColumns.map(col => headers.indexOf(col)).filter(i => i >= 0)
        const tableRows = sampleRows.map((row, i) => {
            const context = contextIndices.map(ci => `${headers[ci]}: ${row[ci] || '(空)'}`).join(', ')
            const targetIdx = headers.indexOf(targetColumn)
            const targetVal = targetIdx >= 0 ? row[targetIdx] || '(空)' : '(列なし)'
            return `行${i + 1}: ${context} → ${targetColumn}: ${targetVal}`
        }).join('\n')

        const systemPrompt = `あなたはデータ入力タスクの事前確認を行う専門家です。

ユーザーがテーブルデータの空欄列をAI Web検索で自動入力しようとしています。

入力タスクを正確に行うために、以下を確認してください：
1. 対象列「${targetColumn}」に何を入力するか正しく理解できているか
2. 参照列の情報（${contextColumns.join('、')}）から目的の情報を特定できるか
3. 検索する情報の粒度・形式（数値、テキスト、URL等）が明確か
4. 曖昧な点や、入力精度を上げるために確認すべきことがないか

必ず以下のJSON形式で回答してください。
【重要】JSON以外のテキストは含めないでください。マークダウンのコードブロック(\`\`\`json ... \`\`\`)で囲まないでください。純粋なJSONのみ出力してください。

{"message":"要約","questions":[{"id":"q1","question":"質問内容"}],"ready":false}

- message: 1-2文で簡潔に。箇条書きや詳細説明は不要。
- questions: 確認したい質問のリスト。各質問は{"id":"q1","question":"質問内容"}の形式。質問がなければ空配列。
- ready: すべて明確で入力開始できる状態ならtrue。

回答は日本語でお願いします。`

        const apiMessages: Anthropic.MessageParam[] = []
        apiMessages.push({
            role: 'user',
            content: `以下のデータの列自動入力を依頼します。事前に確認・質問があればお願いします。

## 入力プロンプト（最重要：この内容に基づいて質問してください）
${prompt}

## 対象列
${targetColumn}

## 参照列
${contextColumns.join(', ')}

## データ（サンプル ${sampleRows.length}行 / 全体はもっと多い可能性あり）

${tableRows}`,
        })

        if (messages.length > 0) {
            for (const msg of messages) {
                apiMessages.push({ role: msg.role, content: msg.content })
            }
        }

        // assistantプリフィルで「{」から開始させ、コードブロックを防止
        apiMessages.push({ role: 'assistant', content: '{' })

        const messageStream = client.messages.stream({
            model: model || 'claude-sonnet-4-5-20250929',
            max_tokens: 4096,
            system: systemPrompt,
            messages: apiMessages,
        })

        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                // プリフィルの「{」をストリーム先頭に追加
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
        console.error('Fill pre-check error:', error)
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429
            : errMsg.includes('overloaded') || errMsg.includes('529') ? 529
            : 500
        return NextResponse.json({ error: errMsg }, { status })
    }
}

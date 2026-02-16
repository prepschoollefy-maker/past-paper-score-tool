import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface ValidateRequest {
    rows: string[][]
    headers: string[]
    prompt: string
    mode: 'web' | 'pdf'
    pdfBase64?: string
    model: string
    preCheckContext?: string
}

interface ValidationResult {
    rowIndex: number
    status: 'OK' | 'NG' | 'WARN'
    details: string
    correction?: string
    sources?: string[]
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

必ず以下のJSON形式で結果を返してください。JSON以外のテキストは含めないでください。

{
  "results": [
    {
      "rowIndex": 0,
      "status": "OK" | "NG" | "WARN",
      "details": "検証結果の具体的な説明",
      "correction": "NGの場合、正しいと思われる値（任意）",
      "sources": ["参照元URL（任意）"]
    }
  ]
}

ステータスの基準:
- OK: データが正確であることを確認できた
- NG: 明らかな誤りを発見した（具体的に何が間違っているか記載）
- WARN: 確認できなかった、または疑わしい点がある（理由を記載）`

        // 事前確認コンテキストがある場合、追加
        const preCheckSection = preCheckContext
            ? `\n\n## 事前確認で合意した検証方針\n${preCheckContext}`
            : ''

        // メッセージコンテンツを構築
        const userContent: Anthropic.ContentBlockParam[] = []

        // PDFモードの場合、PDFを添付
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

        // Claude API呼出
        const messageParams: Anthropic.MessageCreateParams = {
            model: model || 'claude-sonnet-4-5-20250929',
            max_tokens: 4096,
            system: systemPrompt + preCheckSection,
            messages: [{ role: 'user', content: userContent }],
        }

        // Webモードの場合、web_searchツールを有効化
        if (mode === 'web') {
            messageParams.tools = [
                {
                    type: 'web_search_20250305',
                    name: 'web_search',
                    max_uses: rows.length * 2,
                },
            ]
        }

        const response = await client.messages.create(messageParams)

        // レスポンスからテキストを抽出
        const textBlock = response.content.find(
            (block): block is Anthropic.TextBlock => block.type === 'text'
        )

        if (!textBlock) {
            return NextResponse.json(
                { error: 'AIからのレスポンスにテキストが含まれていませんでした' },
                { status: 500 }
            )
        }

        // JSONをパース
        let results: ValidationResult[]
        try {
            // JSONブロックを抽出（```json ... ``` で囲まれている場合も対応）
            let jsonText = textBlock.text.trim()
            const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)```/)
            if (jsonMatch) {
                jsonText = jsonMatch[1].trim()
            }
            // { で始まらない場合、最初の { を探す
            const firstBrace = jsonText.indexOf('{')
            if (firstBrace > 0) {
                jsonText = jsonText.substring(firstBrace)
            }
            const parsed = JSON.parse(jsonText)
            results = parsed.results || parsed
        } catch {
            // JSONパースに失敗した場合、テキストをそのまま返す
            return NextResponse.json({
                results: rows.map((_, i) => ({
                    rowIndex: i,
                    status: 'WARN' as const,
                    details: `AIレスポンスの解析に失敗しました。生テキスト: ${textBlock.text.substring(0, 200)}...`,
                })),
            })
        }

        return NextResponse.json({ results })
    } catch (error) {
        console.error('Validate data error:', error)

        // Anthropic SDKのレートリミットエラーを429として返す
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429 : 500

        return NextResponse.json(
            { error: errMsg },
            { status }
        )
    }
}

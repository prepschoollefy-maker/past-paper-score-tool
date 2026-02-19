import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const VISION_PROMPT = `あなたは中学受験の入試結果一覧PDF（四谷大塚）の画像からデータを抽出する専門家です。

この画像は入試結果一覧表の一部（短冊切り）です。表から各学校・試験回のデータを抽出し、JSON形式で返してください。

## PDFの表構造（重要！よく読んでください）

この表は横長のテーブルで、各学校×試験回ごとに**必ず3行セット**で構成されています:

| 学校名 | 回 | 国語 | 算数 | 社会 | 理科 | (英語) | 合計/総合 |
|--------|-----|------|------|------|------|--------|-----------|
| ○○中学校 | 1回 | **100** | **100** | **50** | **50** | | **300** | ← 1行目: **配点**（各教科の満点）
| | | **72.5** | **68.3** | **35.2** | **40.1** | | **216.1** | ← 2行目: **合格者平均点**
| | | **65.8** | **55.2** | **30.1** | **35.6** | | **186.7** | ← 3行目: **受験者平均点**

- 1行目（配点行）: 学校名・回が書かれている行。各教科の満点と、右端に合計の配点・合格最低点などがある
- 2行目（合格者平均点行）: 学校名は空欄。各教科の合格者の平均点、右端に合計の合格者平均点がある
- 3行目（受験者平均点行）: 学校名は空欄。各教科の受験者の平均点、右端に合計の受験者平均点がある

**3行を1つのJSONオブジェクトに統合**してください。

### 右端の「合計」列について
右端エリアには複数の数値が並んでいます:
- 配点行の合計列: 合計配点、合格最低点、（場合によって合格最高点）
- 合格者平均行の合計列: 合格者平均点
- 受験者平均行の合計列: 受験者平均点

これらを以下にマッピングしてください:
- 「総合合格者最低点」= 配点行の合格最低点（配点合計とは別の値）
- 「総合合格最高点」= 配点行の合格最高点（あれば）
- 「総合合格者平均点」= 合格者平均行の合計値
- 「総合受験者平均点」= 受験者平均行の合計値

### 男女・クラス別の扱い
- 同じ学校で男女別データがある場合 → 別々のオブジェクトとして出力
  - 「回」に性別を含める（例: "1回（男）", "1回（女）"）
- クラス別（東大クラス等）がある場合 → 別オブジェクト
  - 「回」にクラスを含める（例: "1回(東大クラス)", "特待選抜(東大クラス)"）

## 出力形式
以下のJSONスキーマで返してください:

{
  "rows": [
    {
      "学校名": {"value": "○○中学校", "confidence": "high"},
      "回": {"value": "1回", "confidence": "high"},
      "国語配点": {"value": "100", "confidence": "high"},
      "算数配点": {"value": "100", "confidence": "high"},
      "社会配点": {"value": "50", "confidence": "high"},
      "理科配点": {"value": "50", "confidence": "high"},
      "英語配点": {"value": "", "confidence": "high"},
      "国語合格者平均点": {"value": "72.5", "confidence": "high"},
      "国語受験者平均点": {"value": "65.8", "confidence": "high"},
      "算数合格者平均点": {"value": "68.3", "confidence": "high"},
      "算数受験者平均点": {"value": "55.2", "confidence": "high"},
      "社会合格者平均点": {"value": "35.2", "confidence": "high"},
      "社会受験者平均点": {"value": "30.1", "confidence": "high"},
      "理科合格者平均点": {"value": "40.1", "confidence": "high"},
      "理科受験者平均点": {"value": "35.6", "confidence": "high"},
      "英語合格者平均点": {"value": "", "confidence": "high"},
      "英語受験者平均点": {"value": "", "confidence": "high"},
      "総合合格者最低点": {"value": "200", "confidence": "high"},
      "総合合格者最低点※2": {"value": "", "confidence": "high"},
      "総合合格最高点": {"value": "", "confidence": "high"},
      "総合合格者平均点": {"value": "216.1", "confidence": "high"},
      "総合受験者平均点": {"value": "186.7", "confidence": "high"},
      "備考": {"value": "", "confidence": "high"}
    }
  ],
  "warnings": []
}

## ルール
1. PDFに値がないセルは空文字 "" にする
2. 数値は小数点以下もそのまま保持（例: "65.3"）
3. **配点（1行目）と合格者平均点（2行目）と受験者平均点（3行目）を絶対に混同しないこと**
4. 合格者平均点 ≧ 受験者平均点 が一般的（逆になっていたら要注意）
5. confidenceは "high" / "medium" / "low" の3段階
6. medium/lowの場合はreasonを必ず付けること
7. 画像の端で切れている学校データも可能な限り抽出（confidenceをlowにする）
8. 総合合格者最低点※2は、別基準の最低点（東大クラス合格点など）がある場合に使用
9. 必ず有効なJSONのみを返してください（説明文やマークダウンは不要）`

interface OcrStripRequest {
    imageBase64: string
    model: string
    pageNum: number
    stripNum: number
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

        const body: OcrStripRequest = await request.json()
        const { imageBase64, model, pageNum, stripNum } = body

        if (!imageBase64) {
            return NextResponse.json(
                { error: '画像データが空です' },
                { status: 400 }
            )
        }

        const client = new Anthropic({ apiKey })

        const messageStream = client.messages.stream({
            model: model || 'claude-haiku-4-5-20251001',
            max_tokens: 16384,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/png',
                                data: imageBase64,
                            },
                        },
                        {
                            type: 'text',
                            text: VISION_PROMPT,
                        },
                    ],
                },
                {
                    role: 'assistant',
                    content: '{',
                },
            ],
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
                        controller.enqueue(encoder.encode(`\n{"__stream_error":"${errMsg.replace(/["\\\n]/g, ' ')}"}`))
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
        console.error(`OCR strip error (p${request.headers.get('x-page') ?? '?'}-s${request.headers.get('x-strip') ?? '?'}):`, error)
        const errMsg = error instanceof Error ? error.message : '不明なエラー'
        const status = errMsg.includes('rate_limit') || errMsg.includes('429') ? 429
            : errMsg.includes('overloaded') || errMsg.includes('529') ? 529
            : 500
        return NextResponse.json({ error: errMsg }, { status })
    }
}

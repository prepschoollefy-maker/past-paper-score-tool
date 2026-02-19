# 教育特化型 PDF→CSV変換ツール：技術仕様書

## 目的

中学受験業界で使われる「入試結果一覧PDF」（四谷大塚など）を、高精度でCSV化するPythonツールを構築する。

---

## 背景と課題

### 対象PDF の特徴
- 1ページに大量の学校・試験回データが凝縮（高密度レイアウト）
- 横に長い表構造（学校名〜偏差値・合格点まで20列以上）
- 結合セル、複数値が同一セルに存在するケースあり
- 13ページ以上、600行超のデータ量

### 従来手法の問題点（実体験に基づく）
1. **PDF全ページをAI（Claude API / Sonnet）に丸投げ** → 行ズレ、数値読み違い多発
2. **CSVを10行ずつPDF画像と照合** → 照合側AIも同じPDFを読んで間違えるため、精度が低い
3. **pdfplumber等のテキスト抽出** → 結合セルや複雑な表構造を維持できない

### 根本原因
- AI（Vision）に大きな画像を投げるとリサイズされ、細かい文字・罫線が潰れる
- 横に長い表ではAIのアテンションが「左端の学校名」と「右端の偏差値」の行関係を見失う
- 「AIの結果をAIでチェック」は、同じソース（PDF画像）に依存する限り精度向上に限界がある

---

## 技術アプローチ：3段構成パイプライン

核心思想：**「AIに頑張って読ませる」のではなく「AIが読みやすい形にプログラムが前処理する」**

### Phase 1：短冊切り＋オーバーラップによる高精度抽出（抽出A）

#### 1-1. PDF → 高解像度画像化
```python
from pdf2image import convert_from_path

# 300dpi以上で画像化（解像度劣化を防ぐ）
images = convert_from_path("input.pdf", dpi=300)
```

#### 1-2. オーバーラップ付き短冊切り分割
1ページを丸ごと投げず、10〜20行ずつの短冊状に画像を分割してAIに渡す。
AIの視野（アテンション）を限定させ、解像度劣化を防ぐ。

```python
def split_with_overlap(image, strip_height=300, overlap=80):
    """短冊切り＋オーバーラップで画像を分割"""
    width, height = image.size
    strips = []
    y = 0
    while y < height:
        bottom = min(y + strip_height, height)
        strip = image.crop((0, y, width, bottom))
        strips.append((y, strip))  # (開始位置, 画像) を保持
        y += strip_height - overlap  # overlapぶん戻して次へ
    return strips
```

- `strip_height` と `overlap` は対象PDFの行高さに応じてチューニング
- 初期値目安：`strip_height=300px, overlap=80px`（300dpiの場合）

#### 1-3. 各短冊をAI（Claude API）でOCR → JSON取得

```
以下の表画像からデータを抽出してJSON形式で返してください。

各セルについて以下の形式で返すこと：
{
  "rows": [
    {
      "学校名": {"value": "開成", "confidence": "high"},
      "偏差値": {"value": "72", "confidence": "high"},
      "合格者数": {"value": "396", "confidence": "medium",
                    "reason": "3と8の判別が曖昧"}
    }
  ],
  "warnings": ["3行目と4行目の間に罫線が不明瞭で行ズレの可能性あり"]
}

confidenceはhigh / medium / lowの3段階。
medium以下の場合は必ずreasonを付けること。
```

#### 1-4. 重複排除しながらCSV結合

```python
import pandas as pd

def merge_strips(dataframes):
    """重複行を排除しながら結合"""
    merged = pd.DataFrame()
    for df in dataframes:
        if merged.empty:
            merged = df
            continue
        overlap_rows = find_overlap(merged.tail(5), df.head(5))
        if overlap_rows > 0:
            df = df.iloc[overlap_rows:]
        merged = pd.concat([merged, df], ignore_index=True)
    return merged

def find_overlap(tail_df, head_df):
    """学校名（最も一意性が高いカラム）で重複行数を判定"""
    for n in range(len(tail_df), 0, -1):
        tail_keys = tail_df.iloc[-n:]['学校名'].tolist()
        head_keys = head_df.iloc[:n]['学校名'].tolist()
        if tail_keys == head_keys:
            return n
    return 0
```

### Phase 2：別手法による第二の抽出（抽出B）

同じPDFをpdfplumber等で**テキストベース抽出**する。
Vision AI と異なるアプローチで抽出することで、クロスチェックの信頼性を担保する。

```python
import pdfplumber

def extract_with_pdfplumber(pdf_path):
    """pdfplumberでテキストベース抽出"""
    all_tables = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                all_tables.extend(table)
    return all_tables
```

### Phase 3：プログラムによる機械的突合＋差分レポート

**照合はAIにやらせない。** 抽出Aと抽出Bをプログラムで機械的に比較する。

```python
def cross_check(df_vision, df_text):
    """2つの抽出結果を機械的に突合し、差分レポートを生成"""
    discrepancies = []
    for idx in range(min(len(df_vision), len(df_text))):
        for col in df_vision.columns:
            val_v = str(df_vision.iloc[idx].get(col, ""))
            val_t = str(df_text.iloc[idx].get(col, ""))
            if val_v != val_t:
                discrepancies.append({
                    "row": idx + 1,
                    "column": col,
                    "vision_value": val_v,
                    "text_value": val_t,
                    "confidence": df_vision.iloc[idx].get(f"{col}_confidence", "unknown")
                })
    return discrepancies
```

不一致セルだけを：
- 人間が目視確認
- または、セル単位で画像切り出し → AI再OCR（1セルだけなら精度が高い）

---

## 出力形式

### メインCSV
PDFの1行（＝1学校×1試験回）をCSVの1行とする。

列構成：
```
学校名, 別名, 年度, 回, 区分,
国語配点, 算数配点, 社会配点, 理科配点, 英語配点,
国語合格者平均点, 国語受験者平均点,
算数合格者平均点, 算数受験者平均点,
社会合格者平均点, 社会受験者平均点,
理科合格者平均点, 理科受験者平均点,
英語合格者平均点, 英語受験者平均点,
合格者最低点, 合格者平均点, 受験者平均点, 備考
```

### 品質レポート（差分レポート）
- 不一致セルの一覧（行番号、列名、Vision値、Text値）
- confidence が medium/low のセル一覧
- AIが出したwarnings一覧

---

## 開発手順（推奨）

1. **Phase 1のみでMVP作成**：四谷大塚PDF 1ページで短冊切り抽出を試す
2. **strip_height / overlap のチューニング**：精度を確認しながら調整
3. **Phase 2追加**：pdfplumberによる第二抽出を追加
4. **Phase 3追加**：クロスチェック＋差分レポート生成
5. **エンドツーエンドテスト**：13ページ全体で精度検証

---

## 技術スタック

- Python 3.11+
- pdf2image（PDF→画像変換）
- Pillow（画像分割処理）
- pdfplumber（テキストベース抽出）
- Claude API（Vision OCR）— モデル: claude-sonnet-4-20250514
- pandas（データ結合・突合）
- OpenCV（将来的なセル単位切り出し用、Phase 1では不要）

## 動作環境

- Windows（開発者はWindowsユーザー）
- Claude Code（claude agent）で開発

---

## 注意事項

- API呼び出し回数を意識する（13ページ × 短冊数 = 相応のコスト）
- 最初は1ページでテストし、精度とコストのバランスを確認してからスケール
- confidenceベースの「要確認フラグ」は将来的にSaaS化する際の最大の差別化ポイント

import ExcelJS from 'exceljs'

interface ColumnCorrection {
    column: string
    columnIndex: number
    original: string
    corrected: string
}

interface ValidationResult {
    rowIndex: number
    status: 'OK' | 'NG' | 'WARN'
    details: string
    correction?: string
    corrections?: ColumnCorrection[]
    sources?: string[]
}

const COLOR_NG = 'FFFFCCCC'   // 薄赤
const COLOR_WARN = 'FFFFFFCC' // 薄黄
const COLOR_HEADER = 'FFD9D9D9' // グレー
const COLOR_CORRECTED = 'FFD4EDDA' // 薄緑

function applyRowFill(row: ExcelJS.Row, status: string) {
    if (status === 'NG') {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_NG } }
        })
    } else if (status === 'WARN') {
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_WARN } }
        })
    }
}

function applyHeaderStyle(row: ExcelJS.Row, colCount: number) {
    for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_HEADER } }
        cell.font = { bold: true }
        cell.border = {
            bottom: { style: 'thin', color: { argb: 'FF999999' } },
        }
    }
}

export async function downloadExcel(
    csvHeaders: string[],
    csvRows: string[][],
    allResults: ValidationResult[],
    appliedCorrections?: Map<string, string>
): Promise<void> {
    const wb = new ExcelJS.Workbook()

    // 行ごとの検証結果マップ
    const resultMap = new Map<number, ValidationResult>()
    for (const r of allResults) {
        resultMap.set(r.rowIndex, r)
    }

    // ===== シート1: 元データ =====
    const ws1 = wb.addWorksheet('元データ')

    const s1Headers = ['#', ...csvHeaders, 'ステータス', 'AI指摘', '修正案']
    const headerRow1 = ws1.addRow(s1Headers)
    applyHeaderStyle(headerRow1, s1Headers.length)

    for (let i = 0; i < csvRows.length; i++) {
        const r = resultMap.get(i)
        const rowData = [
            i + 1,
            ...csvRows[i],
            r?.status ?? '',
            r?.details ?? '',
            r?.correction ?? '',
        ]
        const row = ws1.addRow(rowData)

        if (r) {
            applyRowFill(row, r.status)
        }
    }

    // 列幅自動調整
    ws1.columns.forEach((col) => {
        let maxLen = 10
        col.eachCell?.({ includeEmpty: false }, (cell) => {
            const len = String(cell.value ?? '').length
            if (len > maxLen) maxLen = len
        })
        col.width = Math.min(maxLen + 2, 50)
    })

    // ===== シート2: 確認リスト =====
    const ws2 = wb.addWorksheet('確認リスト')

    const s2Headers = ['チェック', '行番号', 'ステータス', 'データ要約', '問題内容', '修正案', '修正詳細', '参照元']
    const headerRow2 = ws2.addRow(s2Headers)
    applyHeaderStyle(headerRow2, s2Headers.length)

    // NG → WARN の順
    const issueResults = allResults
        .filter(r => r.status === 'NG' || r.status === 'WARN')
        .sort((a, b) => {
            if (a.status === b.status) return a.rowIndex - b.rowIndex
            return a.status === 'NG' ? -1 : 1
        })

    for (const r of issueResults) {
        const summary = csvRows[r.rowIndex]?.slice(0, 4).join(' / ') ?? ''
        const sources = r.sources?.join('\n') ?? ''
        const correctionDetails = r.corrections
            ?.map(c => `${c.column}: ${c.original} → ${c.corrected}`)
            .join('\n') ?? ''
        const row = ws2.addRow([
            '',           // チェック欄
            r.rowIndex + 1,
            r.status,
            summary,
            r.details,
            r.correction ?? '',
            correctionDetails,
            sources,
        ])
        applyRowFill(row, r.status)
    }

    // 列幅
    ws2.getColumn(1).width = 10  // チェック
    ws2.getColumn(2).width = 8   // 行番号
    ws2.getColumn(3).width = 12  // ステータス
    ws2.getColumn(4).width = 40  // データ要約
    ws2.getColumn(5).width = 50  // 問題内容
    ws2.getColumn(6).width = 40  // 修正案
    ws2.getColumn(7).width = 40  // 修正詳細
    ws2.getColumn(8).width = 40  // 参照元

    // ===== シート3: 修正済みデータ（修正がある場合のみ） =====
    if (appliedCorrections && appliedCorrections.size > 0) {
        const ws3 = wb.addWorksheet('修正済みデータ')

        const s3Headers = ['#', ...csvHeaders, '修正箇所']
        const headerRow3 = ws3.addRow(s3Headers)
        applyHeaderStyle(headerRow3, s3Headers.length)

        // 修正されたセルの逆引きマップ: rowIndex → Set<colIndex>
        const correctedCells = new Map<number, Set<number>>()
        for (const key of appliedCorrections.keys()) {
            const [rowStr, colStr] = key.split('-')
            const rowIdx = Number(rowStr)
            const colIdx = Number(colStr)
            if (!correctedCells.has(rowIdx)) correctedCells.set(rowIdx, new Set())
            correctedCells.get(rowIdx)!.add(colIdx)
        }

        for (let i = 0; i < csvRows.length; i++) {
            const correctedColIndices = correctedCells.get(i)
            const rowValues = csvRows[i].map((val, colIdx) => {
                const key = `${i}-${colIdx}`
                return appliedCorrections.get(key) ?? val
            })

            // 修正箇所列
            const correctedColNames = correctedColIndices
                ? [...correctedColIndices].map(ci => csvHeaders[ci] ?? `列${ci + 1}`).join(', ')
                : ''

            const row = ws3.addRow([i + 1, ...rowValues, correctedColNames])

            // 修正セルを緑ハイライト
            if (correctedColIndices) {
                for (const colIdx of correctedColIndices) {
                    // +2: 1 for '#' column, 1 for 1-based index
                    const cell = row.getCell(colIdx + 2)
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_CORRECTED } }
                    cell.font = { bold: true }
                }
            }
        }

        // 列幅自動調整
        ws3.columns.forEach((col) => {
            let maxLen = 10
            col.eachCell?.({ includeEmpty: false }, (cell) => {
                const len = String(cell.value ?? '').length
                if (len > maxLen) maxLen = len
            })
            col.width = Math.min(maxLen + 2, 50)
        })
    }

    // ダウンロード
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `validation_results_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
}

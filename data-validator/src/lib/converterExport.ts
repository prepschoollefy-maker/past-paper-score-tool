/**
 * 変換結果を25列XLSX形式でエクスポート（ExcelJS使用）
 */

import ExcelJS from 'exceljs'
import type { Row, CellValue, ConfidenceIssue } from './stripMerger'

// 出力XLSXの25列（2025_test.xlsx形式）
export const OUTPUT_COLUMNS = [
    '学校名',
    '別名（略称）',
    '年度',
    '回',
    '国語配点',
    '算数配点',
    '社会配点',
    '理科配点',
    '英語配点',
    '国語合格者平均点',
    '国語受験者平均点',
    '算数合格者平均点',
    '算数受験者平均点',
    '社会合格者平均点',
    '社会受験者平均点',
    '理科合格者平均点',
    '理科受験者平均点',
    '英語合格者平均点',
    '英語受験者平均点',
    '総合合格者最低点',
    '総合合格者最低点※2',
    '総合合格最高点',
    '総合合格者平均点',
    '総合受験者平均点',
    '備考',
] as const

// 数値列のインデックス範囲（国語配点～総合受験者平均点）
const NUMERIC_START = 4
const NUMERIC_END = 24

const COLOR_HEADER = 'FFD9D9D9'
const COLOR_HIGH = 'FFDFF0D8'    // 薄緑
const COLOR_MEDIUM = 'FFFFFFCC'  // 薄黄
const COLOR_LOW = 'FFFFCCCC'     // 薄赤

function getCellValue(cell: unknown): string {
    if (cell && typeof cell === 'object' && 'value' in cell) {
        return String((cell as CellValue).value ?? '')
    }
    if (cell == null) return ''
    return String(cell)
}

function getCellConfidence(cell: unknown): string {
    if (cell && typeof cell === 'object' && 'confidence' in cell) {
        return (cell as CellValue).confidence || 'unknown'
    }
    return 'unknown'
}

function applyHeaderStyle(row: ExcelJS.Row, colCount: number) {
    for (let c = 1; c <= colCount; c++) {
        const cell = row.getCell(c)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_HEADER } }
        cell.font = { bold: true }
        cell.border = { bottom: { style: 'thin', color: { argb: 'FF999999' } } }
    }
}

/**
 * マージ済みRow[]をXLSXとしてダウンロード
 */
export async function downloadConverterExcel(
    mergedRows: Row[],
    year: string,
    confidenceIssues: ConfidenceIssue[],
    warnings: string[],
): Promise<void> {
    const wb = new ExcelJS.Workbook()

    // ===== シート1: 抽出データ =====
    const ws1 = wb.addWorksheet('抽出データ')
    const headerRow = ws1.addRow([...OUTPUT_COLUMNS])
    applyHeaderStyle(headerRow, OUTPUT_COLUMNS.length)

    for (const row of mergedRows) {
        const school = getCellValue(row['学校名'])
        if (!school || school === 'nan') continue

        const values: (string | number)[] = []
        for (const col of OUTPUT_COLUMNS) {
            if (col === '別名（略称）') {
                values.push('')
            } else if (col === '年度') {
                values.push(year || '')
            } else {
                const val = getCellValue(row[col])
                // 数値列は数値に変換
                const colIdx = OUTPUT_COLUMNS.indexOf(col)
                if (colIdx >= NUMERIC_START && colIdx < NUMERIC_END && val !== '') {
                    const num = Number(val)
                    values.push(isNaN(num) ? val : num)
                } else {
                    values.push(val)
                }
            }
        }

        const excelRow = ws1.addRow(values)

        // confidence色分け
        for (let colIdx = 0; colIdx < OUTPUT_COLUMNS.length; colIdx++) {
            const col = OUTPUT_COLUMNS[colIdx]
            if (col === '別名（略称）' || col === '年度') continue
            const conf = getCellConfidence(row[col])
            const cell = excelRow.getCell(colIdx + 1)
            if (conf === 'medium') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_MEDIUM } }
            } else if (conf === 'low') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_LOW } }
            }
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

    // ===== シート2: 品質レポート =====
    const ws2 = wb.addWorksheet('品質レポート')
    const qHeaders = ['行', '学校名', '回', '列名', '値', 'confidence', '理由']
    const qHeaderRow = ws2.addRow(qHeaders)
    applyHeaderStyle(qHeaderRow, qHeaders.length)

    for (const issue of confidenceIssues) {
        const row = ws2.addRow([
            issue.row,
            issue.school,
            issue.round,
            issue.column,
            issue.value,
            issue.confidence,
            issue.reason,
        ])
        const confCell = row.getCell(6)
        if (issue.confidence === 'medium') {
            confCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_MEDIUM } }
        } else if (issue.confidence === 'low') {
            confCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_LOW } }
        }
    }

    ws2.getColumn(1).width = 6
    ws2.getColumn(2).width = 20
    ws2.getColumn(3).width = 12
    ws2.getColumn(4).width = 20
    ws2.getColumn(5).width = 15
    ws2.getColumn(6).width = 12
    ws2.getColumn(7).width = 40

    // ===== シート3: Warnings =====
    const ws3 = wb.addWorksheet('Warnings')
    const wHeaders = ['#', 'Warning']
    const wHeaderRow = ws3.addRow(wHeaders)
    applyHeaderStyle(wHeaderRow, wHeaders.length)

    for (let i = 0; i < warnings.length; i++) {
        ws3.addRow([i + 1, warnings[i]])
    }

    ws3.getColumn(1).width = 6
    ws3.getColumn(2).width = 80

    // ダウンロード
    const buffer = await wb.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pdf_converted_${year || 'data'}_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
}

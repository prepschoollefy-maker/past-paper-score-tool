import ExcelJS from 'exceljs'

interface ValidationResult {
    rowIndex: number
    status: 'OK' | 'NG' | 'WARN'
    details: string
    correction?: string
    sources?: string[]
}

const COLOR_NG = 'FFFFCCCC'   // 薄赤
const COLOR_WARN = 'FFFFFFCC' // 薄黄
const COLOR_HEADER = 'FFD9D9D9' // グレー

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
    allResults: ValidationResult[]
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

    const s2Headers = ['チェック', '行番号', 'ステータス', 'データ要約', '問題内容', '修正案', '参照元']
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
        const row = ws2.addRow([
            '',           // チェック欄
            r.rowIndex + 1,
            r.status,
            summary,
            r.details,
            r.correction ?? '',
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
    ws2.getColumn(7).width = 40  // 参照元

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

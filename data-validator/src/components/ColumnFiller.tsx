'use client'

import { useState, useRef, useCallback } from 'react'
import {
    Upload,
    FileSpreadsheet,
    Play,
    Square,
    Download,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Search,
    Columns,
} from 'lucide-react'
import ExcelJS from 'exceljs'

// --- 型定義 ---

interface FillResult {
    rowIndex: number
    value: string
    confidence: 'high' | 'medium' | 'low'
    source: string
    note: string
}

interface BatchResult {
    batchIndex: number
    results: FillResult[]
    error?: string
}

type FilterStatus = 'ALL' | 'FILLED' | 'EMPTY' | 'LOW'

// --- JSON修復パーサー ---
function sanitizeJsonString(text: string): string {
    let result = ''
    let inString = false
    let escape = false
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (escape) {
            result += ch
            escape = false
            continue
        }
        if (ch === '\\' && inString) {
            result += ch
            escape = true
            continue
        }
        if (ch === '"') {
            inString = !inString
            result += ch
            continue
        }
        if (inString) {
            if (ch === '\n') { result += '\\n'; continue }
            if (ch === '\r') { result += '\\r'; continue }
            if (ch === '\t') { result += '\\t'; continue }
        }
        result += ch
    }
    return result
}

function tryParseJson(text: string): unknown | null {
    let input = text.trim()
    if (input.startsWith('{{')) {
        input = input.substring(1)
    }

    try { return JSON.parse(input) } catch { /* continue */ }

    let cleaned = sanitizeJsonString(input)
    try { return JSON.parse(cleaned) } catch { /* continue */ }

    const codeMatch = cleaned.match(/```json\s*([\s\S]*?)```/)
    if (codeMatch) {
        cleaned = codeMatch[1].trim()
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, '')
    }
    const firstBrace = cleaned.indexOf('{')
    if (firstBrace > 0) cleaned = cleaned.substring(firstBrace)
    if (firstBrace < 0) return null

    try { return JSON.parse(cleaned) } catch { /* continue */ }

    let repaired = cleaned.replace(/\\+$/, m => m.length % 2 === 0 ? m : m.slice(0, -1))
    repaired = repaired.replace(/,\s*$/, '')
    for (const suffix of ['"}', '"}]', '"}}', '"}]}', '}', ']}', ']}}', '"]}]', '"]}}', ']}]', '}]}']) {
        try { return JSON.parse(repaired + suffix) } catch { /* continue */ }
    }
    const lastComplete = Math.max(repaired.lastIndexOf('},'), repaired.lastIndexOf('}]'), repaired.lastIndexOf(',"'))
    if (lastComplete > 0) {
        let truncated: string
        if (repaired[lastComplete] === ',') {
            truncated = repaired.substring(0, lastComplete)
        } else {
            truncated = repaired.substring(0, lastComplete + (repaired[lastComplete + 1] === ']' ? 2 : 1))
        }
        for (const suffix of ['', '}', ']}', '}}', ']}}', ']}]', '}]}']) {
            try { return JSON.parse(truncated + suffix) } catch { /* continue */ }
        }
    }

    return null
}

// --- 定数 ---

const FILL_PRESETS = [
    {
        label: '四谷大塚 80偏差値を検索して入力',
        prompt: '各学校の四谷大塚80%偏差値（合格可能性80%ライン）をWeb検索して入力してください。男子・女子で異なる場合は両方をスラッシュ区切り（例: 58/62）で記載してください。',
    },
    {
        label: '学校の公式サイトURLを検索して入力',
        prompt: '各学校の公式Webサイトのトップページ URL をWeb検索して入力してください。公式サイトが見つからない場合は空文字にしてください。',
    },
    {
        label: 'カスタム（自由入力）',
        prompt: '',
    },
]

const MODELS = [
    { value: 'claude-sonnet-4-5-20250929', label: 'Sonnet 4.5（推奨）' },
    { value: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5（高速・低コスト）' },
]

const BATCH_SIZES = [10, 20, 30, 50]

// --- Excel セル値取得 ---
const getCellText = (cell: ExcelJS.Cell): string => {
    const value = cell.value
    if (value === null || value === undefined) return ''

    if (value instanceof Date) {
        if (isNaN(value.getTime())) return ''
        const y = value.getFullYear()
        const m = String(value.getMonth() + 1).padStart(2, '0')
        const d = String(value.getDate()).padStart(2, '0')
        return `${y}/${m}/${d}`
    }

    if (typeof value === 'number' && cell.numFmt) {
        const cleanFmt = cell.numFmt.replace(/"[^"]*"/g, '').replace(/\\./g, '')
        if (/[yYdD]/.test(cleanFmt)) {
            const epoch = new Date(Date.UTC(1899, 11, 30))
            const date = new Date(epoch.getTime() + value * 86400000)
            const y = date.getFullYear()
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const d = String(date.getDate()).padStart(2, '0')
            return `${y}/${m}/${d}`
        }
    }

    if (typeof value === 'object' && 'richText' in value) {
        return (value as { richText: { text: string }[] }).richText.map(rt => rt.text).join('')
    }

    if (typeof value === 'object' && 'result' in value) {
        const result = (value as { result: unknown }).result
        if (result instanceof Date) {
            const y = result.getFullYear()
            const m = String(result.getMonth() + 1).padStart(2, '0')
            const d = String(result.getDate()).padStart(2, '0')
            return `${y}/${m}/${d}`
        }
        return String(result ?? '')
    }

    return String(value)
}

// --- メインコンポーネント ---

export default function ColumnFiller() {
    // ファイル状態
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvRows, setCsvRows] = useState<string[][]>([])

    // 設定
    const [targetColumn, setTargetColumn] = useState('')
    const [newColumnName, setNewColumnName] = useState('')
    const [contextColumns, setContextColumns] = useState<string[]>([])
    const [prompt, setPrompt] = useState(FILL_PRESETS[0].prompt)
    const [selectedPreset, setSelectedPreset] = useState(0)
    const [batchSize, setBatchSize] = useState(30)
    const [model, setModel] = useState(MODELS[0].value)
    const [skipExisting, setSkipExisting] = useState(true)

    // 実行状態
    const [isRunning, setIsRunning] = useState(false)
    const [currentBatch, setCurrentBatch] = useState(0)
    const [totalBatches, setTotalBatches] = useState(0)
    const [filledCount, setFilledCount] = useState(0)
    const [batchResults, setBatchResults] = useState<BatchResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef(false)

    // 結果フィルター
    const [filter, setFilter] = useState<FilterStatus>('ALL')

    // --- CSV解析 ---
    const parseCSV = useCallback((text: string) => {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length < 2) return

        const headers = lines[0].split(',').map(h => h.trim())
        const rows = lines.slice(1).map(line =>
            line.split(',').map(v => v.trim())
        )

        setCsvHeaders(headers)
        setCsvRows(rows)
    }, [])

    // --- Excel解析 ---
    const parseExcel = useCallback(async (file: File) => {
        const buffer = await file.arrayBuffer()
        const wb = new ExcelJS.Workbook()
        await wb.xlsx.load(buffer)

        const ws = wb.worksheets[0]
        if (!ws || ws.rowCount < 2) return

        const headers: string[] = []
        ws.getRow(1).eachCell({ includeEmpty: false }, (cell) => {
            headers.push(getCellText(cell).trim())
        })

        const rows: string[][] = []
        for (let r = 2; r <= ws.rowCount; r++) {
            const row = ws.getRow(r)
            const values: string[] = []
            for (let c = 1; c <= headers.length; c++) {
                values.push(getCellText(row.getCell(c)).trim())
            }
            if (values.some(v => v !== '')) {
                rows.push(values)
            }
        }

        setCsvHeaders(headers)
        setCsvRows(rows)
    }, [])

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setCsvFile(f)
        setBatchResults([])
        setError(null)
        setTargetColumn('')
        setNewColumnName('')
        setContextColumns([])

        if (f.name.endsWith('.xlsx') || f.name.endsWith('.xls')) {
            await parseExcel(f)
        } else {
            const text = await f.text()
            parseCSV(text)
        }
    }, [parseCSV, parseExcel])

    // --- 対象列の実効名 ---
    const effectiveTargetColumn = targetColumn === '__new__' ? newColumnName : targetColumn
    const targetColumnIndex = csvHeaders.indexOf(effectiveTargetColumn)

    // 空欄列候補（50%以上空欄の列）
    const emptyColumnCandidates = csvHeaders.filter((header) => {
        const colIdx = csvHeaders.indexOf(header)
        const emptyCount = csvRows.filter(row => !row[colIdx]?.trim()).length
        return emptyCount > csvRows.length * 0.3
    })

    // スキップ対象行を除いた処理対象行
    const targetRows = csvRows.map((row, i) => ({ row, originalIndex: i })).filter(({ row }) => {
        if (!skipExisting || targetColumnIndex < 0) return true
        return !row[targetColumnIndex]?.trim()
    })

    // --- プリセット選択 ---
    const handlePresetChange = useCallback((index: number) => {
        setSelectedPreset(index)
        const preset = FILL_PRESETS[index]
        if (preset.prompt) {
            setPrompt(preset.prompt)
        }
    }, [])

    // --- コンテキスト列の切り替え ---
    const toggleContextColumn = useCallback((header: string) => {
        setContextColumns(prev =>
            prev.includes(header)
                ? prev.filter(h => h !== header)
                : [...prev, header]
        )
    }, [])

    // --- 実行 ---
    const runFill = useCallback(async () => {
        if (targetRows.length === 0 || !effectiveTargetColumn || contextColumns.length === 0) return

        setIsRunning(true)
        setError(null)
        setBatchResults([])
        setFilledCount(0)
        abortRef.current = false

        const batches: { row: string[]; originalIndex: number }[][] = []
        for (let i = 0; i < targetRows.length; i += batchSize) {
            batches.push(targetRows.slice(i, i + batchSize))
        }
        setTotalBatches(batches.length)

        let totalFilled = 0

        for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
            if (abortRef.current) break

            setCurrentBatch(batchIdx + 1)

            // バッチ間ディレイ
            if (batchIdx > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000))
            }

            let retries = 0
            const maxRetries = 3

            while (retries <= maxRetries) {
                if (abortRef.current) break

                try {
                    const batchRows = batches[batchIdx].map(item => item.row)

                    const res = await fetch('/api/fill-column', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            rows: batchRows,
                            headers: csvHeaders,
                            contextColumns,
                            targetColumn: effectiveTargetColumn,
                            prompt,
                            model,
                            batchIndex: batchIdx,
                        }),
                    })

                    if (!res.ok) {
                        let errMsg = `HTTP ${res.status}`
                        try {
                            const errData = await res.json()
                            errMsg = errData.error || errMsg
                        } catch {
                            const text = await res.text().catch(() => '')
                            if (text) errMsg = text.slice(0, 200)
                        }
                        const isRetryable = res.status === 429 || res.status === 529 || errMsg.includes('overloaded')
                        if (isRetryable && retries < maxRetries) {
                            retries++
                            const waitSec = 30 * retries
                            setError(`レートリミット - ${waitSec}秒待機中... (リトライ ${retries}/${maxRetries})`)
                            await new Promise(resolve => setTimeout(resolve, waitSec * 1000))
                            setError(null)
                            continue
                        }
                        setBatchResults(prev => [...prev, {
                            batchIndex: batchIdx,
                            results: [],
                            error: errMsg,
                        }])
                        break
                    }

                    const rawText = await res.text()

                    // ストリームエラーチェック
                    const streamErrorMatch = rawText.match(/"__stream_error"\s*:\s*"([^"]*)"/)
                    if (streamErrorMatch) {
                        const errMsg = streamErrorMatch[1]
                        const statusMatch = rawText.match(/"__status"\s*:\s*(\d+)/)
                        const status = statusMatch ? Number(statusMatch[1]) : 500
                        const isRetryable = status === 429 || errMsg.includes('overloaded')
                        if (isRetryable && retries < maxRetries) {
                            retries++
                            const waitSec = 30 * retries
                            setError(`レートリミット - ${waitSec}秒待機中... (リトライ ${retries}/${maxRetries})`)
                            await new Promise(resolve => setTimeout(resolve, waitSec * 1000))
                            setError(null)
                            continue
                        }
                        setBatchResults(prev => [...prev, {
                            batchIndex: batchIdx,
                            results: [],
                            error: errMsg,
                        }])
                        break
                    }

                    const trimmed = rawText.trim()
                    if (!trimmed) {
                        setBatchResults(prev => [...prev, {
                            batchIndex: batchIdx,
                            results: [],
                            error: 'AIからの応答がありませんでした',
                        }])
                        break
                    }

                    const parsedObj = tryParseJson(trimmed) as Record<string, unknown> | null
                    if (!parsedObj || typeof parsedObj !== 'object') {
                        setBatchResults(prev => [...prev, {
                            batchIndex: batchIdx,
                            results: [],
                            error: `AIレスポンスの解析に失敗: ${trimmed.slice(0, 200)}`,
                        }])
                        break
                    }

                    const parsedResults: FillResult[] =
                        Array.isArray(parsedObj.results) ? parsedObj.results as FillResult[] : []

                    // rowIndexをグローバルインデックスに変換
                    const globalResults: FillResult[] = parsedResults.map(
                        (r: FillResult) => ({
                            ...r,
                            rowIndex: batches[batchIdx][r.rowIndex]?.originalIndex ?? r.rowIndex,
                        })
                    )

                    const filledInBatch = globalResults.filter(r => r.value?.trim()).length
                    totalFilled += filledInBatch
                    setFilledCount(totalFilled)

                    setBatchResults(prev => [...prev, {
                        batchIndex: batchIdx,
                        results: globalResults,
                    }])
                    break
                } catch (err) {
                    if (retries < maxRetries) {
                        retries++
                        await new Promise(resolve => setTimeout(resolve, 10000))
                        continue
                    }
                    setBatchResults(prev => [...prev, {
                        batchIndex: batchIdx,
                        results: [],
                        error: err instanceof Error ? err.message : '通信エラー',
                    }])
                    break
                }
            }
        }

        setIsRunning(false)
    }, [targetRows, effectiveTargetColumn, contextColumns, csvHeaders, prompt, model, batchSize])

    const stopFill = useCallback(() => {
        abortRef.current = true
    }, [])

    // --- 結果集約 ---
    const allResults = batchResults.flatMap(br => br.results)
    const filteredResults = (() => {
        switch (filter) {
            case 'FILLED': return allResults.filter(r => r.value?.trim())
            case 'EMPTY': return allResults.filter(r => !r.value?.trim())
            case 'LOW': return allResults.filter(r => r.confidence === 'low')
            default: return allResults
        }
    })()

    const counts = {
        filled: allResults.filter(r => r.value?.trim()).length,
        empty: allResults.filter(r => !r.value?.trim()).length,
        high: allResults.filter(r => r.confidence === 'high').length,
        medium: allResults.filter(r => r.confidence === 'medium').length,
        low: allResults.filter(r => r.confidence === 'low').length,
    }
    const errors = batchResults.filter(br => br.error)

    // --- Excelダウンロード ---
    const downloadResultExcel = useCallback(async () => {
        const wb = new ExcelJS.Workbook()

        // 結果マップ
        const resultMap = new Map<number, FillResult>()
        for (const r of allResults) {
            resultMap.set(r.rowIndex, r)
        }

        // 出力ヘッダー: 元ヘッダー + 新列（存在しない場合）
        const outputHeaders = [...csvHeaders]
        let targetColIdx = csvHeaders.indexOf(effectiveTargetColumn)
        if (targetColIdx < 0) {
            outputHeaders.push(effectiveTargetColumn)
            targetColIdx = outputHeaders.length - 1
        }

        // シート1: 入力済みデータ
        const ws1 = wb.addWorksheet('入力済みデータ')
        const headerRow = ws1.addRow(outputHeaders)
        for (let c = 1; c <= outputHeaders.length; c++) {
            const cell = headerRow.getCell(c)
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }
            cell.font = { bold: true }
            cell.border = { bottom: { style: 'thin', color: { argb: 'FF999999' } } }
        }

        for (let i = 0; i < csvRows.length; i++) {
            const rowValues = [...csvRows[i]]
            // 新列の場合は空文字を埋める
            while (rowValues.length < outputHeaders.length) {
                rowValues.push('')
            }

            const result = resultMap.get(i)
            if (result && result.value?.trim()) {
                rowValues[targetColIdx] = result.value
            }

            const excelRow = ws1.addRow(rowValues)

            // 入力されたセルを色分け
            if (result && result.value?.trim()) {
                const cell = excelRow.getCell(targetColIdx + 1)
                const color = result.confidence === 'high' ? 'FFDFF0D8'
                    : result.confidence === 'medium' ? 'FFFFFFCC'
                    : 'FFFFCCCC'
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
            }
        }

        ws1.columns.forEach((col) => {
            let maxLen = 10
            col.eachCell?.({ includeEmpty: false }, (cell) => {
                const len = String(cell.value ?? '').length
                if (len > maxLen) maxLen = len
            })
            col.width = Math.min(maxLen + 2, 50)
        })

        // シート2: 入力詳細
        const ws2 = wb.addWorksheet('入力詳細')
        const detailHeaders = ['行番号', ...contextColumns, effectiveTargetColumn, 'confidence', '参照元', '備考']
        const detailHeaderRow = ws2.addRow(detailHeaders)
        for (let c = 1; c <= detailHeaders.length; c++) {
            const cell = detailHeaderRow.getCell(c)
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }
            cell.font = { bold: true }
        }

        for (const r of allResults) {
            const row = csvRows[r.rowIndex]
            if (!row) continue
            const contextValues = contextColumns.map(col => {
                const idx = csvHeaders.indexOf(col)
                return idx >= 0 ? row[idx] : ''
            })
            const excelRow = ws2.addRow([
                r.rowIndex + 1,
                ...contextValues,
                r.value || '',
                r.confidence,
                r.source || '',
                r.note || '',
            ])

            // confidence色分け
            const confCell = excelRow.getCell(contextColumns.length + 3)
            const color = r.confidence === 'high' ? 'FFDFF0D8'
                : r.confidence === 'medium' ? 'FFFFFFCC'
                : 'FFFFCCCC'
            confCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
        }

        ws2.columns.forEach((col) => {
            let maxLen = 10
            col.eachCell?.({ includeEmpty: false }, (cell) => {
                const len = String(cell.value ?? '').length
                if (len > maxLen) maxLen = len
            })
            col.width = Math.min(maxLen + 2, 50)
        })

        const buffer = await wb.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `column_fill_${effectiveTargetColumn}_${new Date().toISOString().slice(0, 10)}.xlsx`
        a.click()
        URL.revokeObjectURL(url)
    }, [allResults, csvHeaders, csvRows, effectiveTargetColumn, contextColumns])

    // --- confidence色 ---
    const confidenceColor = (conf: string) => {
        switch (conf) {
            case 'high': return 'text-green-400'
            case 'medium': return 'text-yellow-400'
            case 'low': return 'text-red-400'
            default: return 'text-slate-400'
        }
    }

    const confidenceBg = (conf: string) => {
        switch (conf) {
            case 'high': return 'bg-green-900/30 border-green-700/50'
            case 'medium': return 'bg-yellow-900/30 border-yellow-700/50'
            case 'low': return 'bg-red-900/30 border-red-700/50'
            default: return ''
        }
    }

    return (
        <div className="space-y-6">
            {/* ヘッダー */}
            <div>
                <h1 className="text-2xl font-bold text-white">列自動入力</h1>
                <p className="text-sm text-slate-400 mt-0.5">空欄列をAI Web検索で自動入力します</p>
            </div>

            {/* Step 1: ファイルアップロード */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-white mb-1">1. データファイルをアップロード</h2>
                        <p className="text-sm text-slate-400 mb-3">CSVまたはExcelファイルを選択してください</p>
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-600/20 file:text-blue-400
                                hover:file:bg-blue-600/30
                                cursor-pointer"
                        />
                        {csvFile && (
                            <p className="text-sm text-slate-400 mt-2">
                                {csvFile.name} - {csvHeaders.length}列, {csvRows.length}行
                            </p>
                        )}
                    </div>
                </div>

                {/* プレビュー */}
                {csvRows.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-700/50">
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">#</th>
                                    {csvHeaders.map((h, i) => (
                                        <th key={i} className="px-3 py-2 text-left text-xs font-medium text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {csvRows.slice(0, 3).map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2 text-slate-500 text-xs">{i + 1}</td>
                                        {row.map((val, j) => (
                                            <td key={j} className="px-3 py-2 text-xs text-slate-300 max-w-[200px] truncate">
                                                {val || <span className="text-slate-600">(空)</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {csvRows.length > 3 && (
                            <p className="text-xs text-slate-500 mt-2 px-3">...他 {csvRows.length - 3}行</p>
                        )}
                    </div>
                )}
            </div>

            {/* Step 2: 入力タスク設定 */}
            {csvRows.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Columns className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="font-semibold text-white mb-1">2. 入力タスク設定</h2>
                                <p className="text-sm text-slate-400">対象列・参照列・プロンプトを設定してください</p>
                            </div>

                            {/* 対象列 */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">入力対象列</label>
                                <select
                                    value={targetColumn}
                                    onChange={(e) => setTargetColumn(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">選択してください...</option>
                                    {emptyColumnCandidates.length > 0 && (
                                        <optgroup label="空欄が多い列">
                                            {emptyColumnCandidates.map(h => {
                                                const colIdx = csvHeaders.indexOf(h)
                                                const emptyCount = csvRows.filter(row => !row[colIdx]?.trim()).length
                                                return (
                                                    <option key={h} value={h}>
                                                        {h}（{emptyCount}/{csvRows.length}行が空欄）
                                                    </option>
                                                )
                                            })}
                                        </optgroup>
                                    )}
                                    <optgroup label="全ての列">
                                        {csvHeaders.map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </optgroup>
                                    <option value="__new__">+ 新規列を追加</option>
                                </select>
                                {targetColumn === '__new__' && (
                                    <input
                                        type="text"
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                        placeholder="新しい列名を入力..."
                                        className="mt-2 w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                )}
                            </div>

                            {/* 参照列 */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">
                                    参照列（AIに渡すコンテキスト情報）
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {csvHeaders.map(h => (
                                        <button
                                            key={h}
                                            onClick={() => toggleContextColumn(h)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                                contextColumns.includes(h)
                                                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                                    : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                                            }`}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                                {contextColumns.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        選択中: {contextColumns.join(', ')}
                                    </p>
                                )}
                            </div>

                            {/* プリセット */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">プロンプトプリセット</label>
                                <select
                                    value={selectedPreset}
                                    onChange={(e) => handlePresetChange(Number(e.target.value))}
                                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {FILL_PRESETS.map((t, i) => (
                                        <option key={i} value={i}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* プロンプト */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">入力プロンプト</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                                    placeholder="AIへの指示を入力..."
                                />
                            </div>

                            {/* バッチサイズ・モデル・スキップ */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">バッチサイズ</label>
                                    <select
                                        value={batchSize}
                                        onChange={(e) => setBatchSize(Number(e.target.value))}
                                        className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {BATCH_SIZES.map(s => (
                                            <option key={s} value={s}>{s}件ずつ</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">AIモデル</label>
                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {MODELS.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">既存値</label>
                                    <button
                                        onClick={() => setSkipExisting(!skipExisting)}
                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                            skipExisting
                                                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                                                : 'bg-slate-700/50 border-slate-600 text-slate-400'
                                        }`}
                                    >
                                        {skipExisting ? 'スキップ' : '上書き'}
                                    </button>
                                </div>
                            </div>

                            {/* 処理見積もり */}
                            {effectiveTargetColumn && (
                                <p className="text-xs text-slate-500">
                                    処理対象: {targetRows.length}行 / {batchSize}件ずつ = {Math.ceil(targetRows.length / batchSize)}バッチ
                                    {' / '}
                                    目安: 約{(() => {
                                        const numBatches = Math.ceil(targetRows.length / batchSize)
                                        const secPerBatch = 30
                                        const delay = 5
                                        const totalSec = numBatches * secPerBatch + Math.max(0, numBatches - 1) * delay
                                        return totalSec < 60
                                            ? `${totalSec}秒`
                                            : `${Math.ceil(totalSec / 60)}分`
                                    })()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: 実行・進捗 */}
            {csvRows.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center gap-4">
                        {!isRunning ? (
                            <button
                                onClick={runFill}
                                disabled={!effectiveTargetColumn || contextColumns.length === 0 || !prompt.trim() || targetRows.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                <Play className="w-5 h-5" />
                                入力開始（{targetRows.length}行）
                            </button>
                        ) : (
                            <button
                                onClick={stopFill}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                            >
                                <Square className="w-5 h-5" />
                                中断
                            </button>
                        )}

                        {isRunning && (
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                                    <span className="text-sm text-slate-300">
                                        バッチ {currentBatch} / {totalBatches} 処理中... ({filledCount}件入力済み)
                                    </span>
                                </div>
                                <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(currentBatch / totalBatches) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {!isRunning && allResults.length > 0 && (
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-green-400">入力済み: {counts.filled}</span>
                                <span className="text-slate-400">未入力: {counts.empty}</span>
                                <span className="text-yellow-400">medium: {counts.medium}</span>
                                <span className="text-red-400">low: {counts.low}</span>
                            </div>
                        )}
                    </div>

                    {/* バッチエラー */}
                    {errors.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {errors.map((br, i) => (
                                <div key={i} className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-2 text-sm text-red-300">
                                    バッチ{br.batchIndex + 1} エラー: {br.error}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* エラー表示 */}
            {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 flex items-center gap-3 text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Step 4: 結果テーブル */}
            {allResults.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white">入力結果（{allResults.length}件）</h2>
                        <div className="flex items-center gap-3">
                            {/* フィルター */}
                            <div className="flex gap-1">
                                {([
                                    { key: 'ALL' as FilterStatus, label: '全件' },
                                    { key: 'FILLED' as FilterStatus, label: `入力済み (${counts.filled})` },
                                    { key: 'EMPTY' as FilterStatus, label: `未入力 (${counts.empty})` },
                                    { key: 'LOW' as FilterStatus, label: `low (${counts.low})` },
                                ]).map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => setFilter(f.key)}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            filter === f.key
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Excelダウンロード */}
                            <button
                                onClick={downloadResultExcel}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Excel
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {filteredResults.map((r, i) => (
                            <div
                                key={i}
                                className={`border rounded-lg px-4 py-3 ${confidenceBg(r.confidence)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {r.value?.trim() ? (
                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${confidenceColor(r.confidence)}`} />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-slate-500" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-slate-500">行{r.rowIndex + 1}</span>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                                r.confidence === 'high' ? 'bg-green-800/50 text-green-300' :
                                                r.confidence === 'medium' ? 'bg-yellow-800/50 text-yellow-300' :
                                                'bg-red-800/50 text-red-300'
                                            }`}>
                                                {r.confidence}
                                            </span>
                                        </div>
                                        {/* コンテキスト情報 */}
                                        <p className="text-xs text-slate-500 mb-1 truncate">
                                            {contextColumns.map(col => {
                                                const idx = csvHeaders.indexOf(col)
                                                return idx >= 0 ? csvRows[r.rowIndex]?.[idx] : ''
                                            }).filter(Boolean).join(' / ')}
                                        </p>
                                        {/* 入力値 */}
                                        <p className="text-sm text-slate-200 font-medium">
                                            {effectiveTargetColumn}: {r.value || <span className="text-slate-500">(未入力)</span>}
                                        </p>
                                        {/* 補足 */}
                                        {r.note && (
                                            <p className="text-xs text-slate-400 mt-1">{r.note}</p>
                                        )}
                                        {/* 参照元 */}
                                        {r.source && (
                                            <a
                                                href={r.source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-400 hover:underline truncate block mt-1 max-w-[400px]"
                                            >
                                                {r.source}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

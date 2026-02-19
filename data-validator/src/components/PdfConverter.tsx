'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Play, Square, Download, FileText, AlertTriangle } from 'lucide-react'
import { loadPdf, renderPageStrips, estimateTotalStrips } from '@/lib/pdfRenderer'
import { mergeStripResults, collectWarnings, collectConfidenceIssues, type StripResult, type Row, type MergeStats, type ConfidenceIssue } from '@/lib/stripMerger'
import { downloadConverterExcel, OUTPUT_COLUMNS } from '@/lib/converterExport'
import type { PDFDocumentProxy } from 'pdfjs-dist'

type ProcessState = 'idle' | 'processing' | 'done' | 'error' | 'cancelled'

function getCellValue(cell: unknown): string {
    if (cell && typeof cell === 'object' && 'value' in cell) {
        return String((cell as { value: string }).value ?? '')
    }
    if (cell == null) return ''
    return String(cell)
}

function getCellConfidence(cell: unknown): string {
    if (cell && typeof cell === 'object' && 'confidence' in cell) {
        return String((cell as { confidence: string }).confidence ?? 'unknown')
    }
    return 'unknown'
}

export default function PdfConverter() {
    // Step 1: PDF upload
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
    const [totalPages, setTotalPages] = useState(0)

    // Step 2: Settings
    const [model, setModel] = useState('claude-haiku-4-5-20251001')
    const [year, setYear] = useState('2025')
    const [pageRangeMode, setPageRangeMode] = useState<'all' | 'custom'>('all')
    const [pageRangeStart, setPageRangeStart] = useState(1)
    const [pageRangeEnd, setPageRangeEnd] = useState(1)

    // Step 3: Processing
    const [state, setState] = useState<ProcessState>('idle')
    const [currentPage, setCurrentPage] = useState(0)
    const [currentStrip, setCurrentStrip] = useState(0)
    const [totalStrips, setTotalStrips] = useState(0)
    const [processedStrips, setProcessedStrips] = useState(0)
    const [extractedRows, setExtractedRows] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const abortRef = useRef(false)

    // Step 4: Results
    const [mergedRows, setMergedRows] = useState<Row[]>([])
    const [mergeStats, setMergeStats] = useState<MergeStats | null>(null)
    const [confidenceIssues, setConfidenceIssues] = useState<ConfidenceIssue[]>([])
    const [warnings, setWarnings] = useState<string[]>([])

    // PDF読み込み
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setPdfFile(file)
        setState('idle')
        setMergedRows([])
        setMergeStats(null)

        try {
            const { totalPages: pages, pdf: pdfDoc } = await loadPdf(file)
            setPdf(pdfDoc)
            setTotalPages(pages)
            setPageRangeEnd(pages)
        } catch (err) {
            setErrorMessage(`PDF読み込みエラー: ${err instanceof Error ? err.message : '不明'}`)
            setState('error')
        }
    }, [])

    // OCR処理
    const handleProcess = useCallback(async () => {
        if (!pdf) return

        abortRef.current = false
        setState('processing')
        setErrorMessage('')
        setProcessedStrips(0)
        setExtractedRows(0)

        const pageRange: number[] = []
        if (pageRangeMode === 'all') {
            for (let i = 1; i <= totalPages; i++) pageRange.push(i)
        } else {
            for (let i = pageRangeStart; i <= Math.min(pageRangeEnd, totalPages); i++) pageRange.push(i)
        }

        // 短冊数見積もり
        const estimate = await estimateTotalStrips(pdf, pageRange)
        setTotalStrips(estimate.total)

        const allStripResults: StripResult[] = []
        let processed = 0
        let rowCount = 0

        try {
            for (const pageNum of pageRange) {
                if (abortRef.current) break
                setCurrentPage(pageNum)

                const strips = await renderPageStrips(pdf, pageNum)

                for (let i = 0; i < strips.length; i++) {
                    if (abortRef.current) break
                    setCurrentStrip(i + 1)

                    const strip = strips[i]

                    // API呼び出し
                    const response = await fetch('/api/ocr-strip', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imageBase64: strip.base64,
                            model,
                            pageNum: strip.pageNum,
                            stripNum: strip.stripNum,
                        }),
                    })

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({ error: response.statusText }))
                        throw new Error(errData.error || `HTTP ${response.status}`)
                    }

                    // ストリーム読み取り → テキスト全体を取得
                    const text = await response.text()

                    // ストリームエラーチェック
                    if (text.includes('"__stream_error"')) {
                        const errorMatch = text.match(/"__stream_error"\s*:\s*"([^"]*)"/)
                        throw new Error(errorMatch?.[1] || 'ストリームエラー')
                    }

                    // JSON解析
                    let result: StripResult
                    try {
                        result = JSON.parse(text)
                    } catch {
                        console.warn(`JSON解析失敗 (p${strip.pageNum}-s${strip.stripNum}):`, text.slice(0, 200))
                        result = { rows: [], warnings: [`JSON parse error at p${strip.pageNum}-s${strip.stripNum}`] }
                    }

                    result._meta = { page: strip.pageNum, strip: strip.stripNum, y_offset: strip.yOffset }
                    allStripResults.push(result)

                    processed++
                    rowCount += (result.rows?.length ?? 0)
                    setProcessedStrips(processed)
                    setExtractedRows(rowCount)
                }
            }

            if (abortRef.current) {
                setState('cancelled')
                // 中止でも結果があれば表示
                if (allStripResults.length > 0) {
                    finalize(allStripResults)
                }
                return
            }

            finalize(allStripResults)
            setState('done')
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : '不明なエラー')
            setState('error')
            // エラーでも結果があれば表示
            if (allStripResults.length > 0) {
                finalize(allStripResults)
            }
        }
    }, [pdf, model, totalPages, pageRangeMode, pageRangeStart, pageRangeEnd])

    const finalize = (allStripResults: StripResult[]) => {
        const { rows, stats } = mergeStripResults(allStripResults)
        const warns = collectWarnings(allStripResults)
        const issues = collectConfidenceIssues(rows)
        setMergedRows(rows)
        setMergeStats(stats)
        setWarnings(warns)
        setConfidenceIssues(issues)
    }

    const handleCancel = useCallback(() => {
        abortRef.current = true
    }, [])

    const handleDownload = useCallback(async () => {
        await downloadConverterExcel(mergedRows, year, confidenceIssues, warnings)
    }, [mergedRows, year, confidenceIssues, warnings])

    // 結果テーブルで表示する列（別名・年度を除く）
    const displayColumns = OUTPUT_COLUMNS.filter(c => c !== '別名（略称）' && c !== '年度')

    return (
        <div className="space-y-6">
            {/* Step 1: PDF Upload */}
            <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF アップロード
                </h2>

                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-400 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-sm text-slate-400">
                        {pdfFile ? `${pdfFile.name} (${totalPages}ページ)` : 'PDFファイルを選択'}
                    </span>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </section>

            {/* Step 2: Settings */}
            {pdf && (
                <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                    <h2 className="text-base font-semibold text-white mb-3">設定</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* モデル選択 */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">モデル</label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm border border-slate-600"
                                disabled={state === 'processing'}
                            >
                                <option value="claude-haiku-4-5-20251001">Haiku 4.5（高速・低コスト）</option>
                                <option value="claude-sonnet-4-5-20250929">Sonnet 4.5（高精度）</option>
                            </select>
                        </div>

                        {/* 年度 */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">年度</label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm border border-slate-600"
                                disabled={state === 'processing'}
                            />
                        </div>

                        {/* ページ範囲 */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">ページ範囲</label>
                            <div className="flex items-center gap-2">
                                <select
                                    value={pageRangeMode}
                                    onChange={(e) => setPageRangeMode(e.target.value as 'all' | 'custom')}
                                    className="bg-slate-700 text-white rounded px-2 py-2 text-sm border border-slate-600"
                                    disabled={state === 'processing'}
                                >
                                    <option value="all">全ページ</option>
                                    <option value="custom">指定</option>
                                </select>
                                {pageRangeMode === 'custom' && (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            min={1}
                                            max={totalPages}
                                            value={pageRangeStart}
                                            onChange={(e) => setPageRangeStart(Number(e.target.value))}
                                            className="w-14 bg-slate-700 text-white rounded px-2 py-2 text-sm border border-slate-600 text-center"
                                            disabled={state === 'processing'}
                                        />
                                        <span className="text-slate-400 text-sm">-</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={totalPages}
                                            value={pageRangeEnd}
                                            onChange={(e) => setPageRangeEnd(Number(e.target.value))}
                                            className="w-14 bg-slate-700 text-white rounded px-2 py-2 text-sm border border-slate-600 text-center"
                                            disabled={state === 'processing'}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Step 3: Processing */}
            {pdf && (
                <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-white">処理</h2>
                        <div className="flex gap-2">
                            {state !== 'processing' ? (
                                <button
                                    onClick={handleProcess}
                                    disabled={!pdf}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white text-sm rounded-md transition-colors"
                                >
                                    <Play className="w-3.5 h-3.5" />
                                    開始
                                </button>
                            ) : (
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md transition-colors"
                                >
                                    <Square className="w-3.5 h-3.5" />
                                    中止
                                </button>
                            )}
                        </div>
                    </div>

                    {state !== 'idle' && (
                        <div className="space-y-2">
                            {/* プログレスバー */}
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${state === 'error' ? 'bg-red-500' : state === 'cancelled' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: totalStrips > 0 ? `${(processedStrips / totalStrips) * 100}%` : '0%' }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-slate-400">
                                <span>
                                    {state === 'processing' && `ページ ${currentPage} — 短冊 ${currentStrip}`}
                                    {state === 'done' && '完了'}
                                    {state === 'cancelled' && '中止'}
                                    {state === 'error' && 'エラー'}
                                </span>
                                <span>
                                    {processedStrips}/{totalStrips} 短冊 — {extractedRows} 行抽出
                                </span>
                            </div>

                            {errorMessage && (
                                <div className="mt-2 p-3 bg-red-900/30 border border-red-700 rounded text-sm text-red-300">
                                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Step 4: Results */}
            {mergedRows.length > 0 && (
                <section className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-white">
                            結果 ({mergedRows.length} 行)
                            {mergeStats && (
                                <span className="ml-2 text-xs text-slate-400 font-normal">
                                    全{mergeStats.totalRaw}行 → {mergeStats.finalCount}行（{mergeStats.duplicatesMerged}件マージ）
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            XLSX ダウンロード
                        </button>
                    </div>

                    {/* confidence サマリー */}
                    {confidenceIssues.length > 0 && (
                        <div className="mb-3 p-2 bg-yellow-900/20 border border-yellow-700/50 rounded text-xs text-yellow-300">
                            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                            {confidenceIssues.filter(i => i.confidence === 'low').length} 件 low /
                            {' '}{confidenceIssues.filter(i => i.confidence === 'medium').length} 件 medium confidence
                        </div>
                    )}

                    {/* 横スクロール テーブル */}
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="min-w-max text-xs text-slate-300 border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-700">
                                    <th className="px-2 py-1.5 text-left font-medium border-b border-slate-600">#</th>
                                    {displayColumns.map((col) => (
                                        <th key={col} className="px-2 py-1.5 text-left font-medium border-b border-slate-600 whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {mergedRows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-700/50 border-b border-slate-700/50">
                                        <td className="px-2 py-1 text-slate-500">{idx + 1}</td>
                                        {displayColumns.map((col) => {
                                            const conf = getCellConfidence(row[col])
                                            const bgClass = conf === 'low' ? 'bg-red-900/30'
                                                : conf === 'medium' ? 'bg-yellow-900/20'
                                                    : ''
                                            return (
                                                <td key={col} className={`px-2 py-1 whitespace-nowrap ${bgClass}`}>
                                                    {getCellValue(row[col])}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <details className="mt-3">
                            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                                AI Warnings ({warnings.length}件)
                            </summary>
                            <ul className="mt-1 text-xs text-slate-500 space-y-0.5 max-h-40 overflow-y-auto">
                                {warnings.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </details>
                    )}
                </section>
            )}
        </div>
    )
}

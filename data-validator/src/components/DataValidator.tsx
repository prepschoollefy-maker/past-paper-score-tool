'use client'

import { useState, useRef, useCallback } from 'react'
import {
    Upload,
    FileSpreadsheet,
    FileText,
    Search,
    Play,
    Square,
    Download,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    X,
    MessageCircle,
    Send,
    Check,
    Undo2,
    ArrowRight,
} from 'lucide-react'
import { downloadExcel } from '@/lib/excelExport'
import ExcelJS from 'exceljs'

// --- 型定義 ---

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

interface BatchResult {
    batchIndex: number
    results: ValidationResult[]
    error?: string
}

type FilterStatus = 'ALL' | 'OK' | 'NG' | 'WARN'

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

interface PreCheckQuestion {
    id: string
    question: string
}

interface PreCheckResponse {
    message: string
    questions: PreCheckQuestion[]
    ready: boolean
    pdfExtract: string
}

// --- プロンプトテンプレート ---

const PROMPT_TEMPLATES = [
    {
        label: '学校の住所・郵便番号を検証',
        prompt: '各行の学校名をWeb検索し、住所と郵便番号が正しいか確認してください。学校の公式サイトやGoogle Mapsの情報と照合してください。',
        mode: 'web' as const,
    },
    {
        label: '学校の偏差値を検証',
        prompt: '各行の学校名と偏差値をWeb検索し、四谷大塚の80%偏差値として正しいか確認してください。',
        mode: 'web' as const,
    },
    {
        label: 'PDFの数値とCSVを照合',
        prompt: '添付されたPDFに記載されている数値と、CSVの各行のデータが一致しているか照合してください。特に合格最低点、合格者平均、受験者平均、各科目の平均点に注目してください。',
        mode: 'pdf' as const,
    },
    {
        label: 'カスタム（自由入力）',
        prompt: '',
        mode: 'web' as const,
    },
]

const MODELS = [
    { value: 'claude-sonnet-4-5-20250929', label: 'Sonnet 4.5（推奨）' },
    { value: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5（高速・低コスト）' },
]

const BATCH_SIZES = [3, 5, 10]

// --- メインコンポーネント ---

export default function DataValidator() {
    // ファイル状態
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvRows, setCsvRows] = useState<string[][]>([])
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [pdfBase64, setPdfBase64] = useState<string>('')

    // 設定
    const [mode, setMode] = useState<'web' | 'pdf'>('web')
    const [prompt, setPrompt] = useState(PROMPT_TEMPLATES[0].prompt)
    const [selectedTemplate, setSelectedTemplate] = useState(0)
    const [batchSize, setBatchSize] = useState(5)
    const [model, setModel] = useState(MODELS[0].value)

    // 実行状態
    const [isRunning, setIsRunning] = useState(false)
    const [currentBatch, setCurrentBatch] = useState(0)
    const [totalBatches, setTotalBatches] = useState(0)
    const [batchResults, setBatchResults] = useState<BatchResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef(false)

    // 結果フィルター
    const [filter, setFilter] = useState<FilterStatus>('ALL')

    // 修正適用
    const [appliedCorrections, setAppliedCorrections] = useState<Map<string, string>>(new Map())

    // 事前確認
    const [preCheckMessages, setPreCheckMessages] = useState<ChatMessage[]>([])
    const [isPreChecking, setIsPreChecking] = useState(false)
    const [preCheckReady, setPreCheckReady] = useState(false)
    const [currentQuestions, setCurrentQuestions] = useState<PreCheckQuestion[]>([])
    const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({})
    const [preCheckSummary, setPreCheckSummary] = useState('')
    const [pdfExtract, setPdfExtract] = useState('')

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
            headers.push(String(cell.value ?? '').trim())
        })

        const rows: string[][] = []
        for (let r = 2; r <= ws.rowCount; r++) {
            const row = ws.getRow(r)
            const values: string[] = []
            for (let c = 1; c <= headers.length; c++) {
                values.push(String(row.getCell(c).value ?? '').trim())
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
        setAppliedCorrections(new Map())

        if (f.name.endsWith('.xlsx') || f.name.endsWith('.xls')) {
            await parseExcel(f)
        } else {
            const text = await f.text()
            parseCSV(text)
        }
    }, [parseCSV, parseExcel])

    const handlePdfChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setPdfFile(f)

        // base64に変換
        const buffer = await f.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        setPdfBase64(btoa(binary))
    }, [])

    // --- テンプレート選択 ---
    const handleTemplateChange = useCallback((index: number) => {
        setSelectedTemplate(index)
        const template = PROMPT_TEMPLATES[index]
        if (template.prompt) {
            setPrompt(template.prompt)
        }
    }, [])

    // --- 事前確認 ---
    const callPreCheck = useCallback(async (messages: ChatMessage[]) => {
        setIsPreChecking(true)
        setError(null)

        try {
            const res = await fetch('/api/pre-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    headers: csvHeaders,
                    sampleRows: csvRows.slice(0, 100),
                    prompt,
                    mode,
                    pdfBase64: mode === 'pdf' ? pdfBase64 : undefined,
                    model,
                    messages,
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
                setError(errMsg)
                return
            }

            const data: PreCheckResponse = await res.json()

            // AIの応答をJSON文字列として会話履歴に追加
            const assistantContent = JSON.stringify({
                message: data.message,
                questions: data.questions,
                ready: data.ready,
            })
            setPreCheckMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])

            if (data.ready) {
                setPreCheckReady(true)
                setPreCheckSummary(data.message)
                if (data.pdfExtract) setPdfExtract(data.pdfExtract)
                setCurrentQuestions([])
            } else {
                setCurrentQuestions(data.questions)
                setQuestionAnswers({})
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '通信エラー')
        } finally {
            setIsPreChecking(false)
        }
    }, [csvHeaders, csvRows, prompt, mode, pdfBase64, model])

    const startPreCheck = useCallback(() => {
        if (csvRows.length === 0 || !prompt.trim()) return
        setPreCheckMessages([])
        setPreCheckReady(false)
        setPreCheckSummary('')
        setPdfExtract('')
        callPreCheck([])
    }, [csvRows, prompt, callPreCheck])

    const submitAnswers = useCallback(() => {
        // 回答をまとめたテキストを作成
        const answerText = currentQuestions
            .map(q => `${q.question}\n→ ${questionAnswers[q.id] || '（未回答）'}`)
            .join('\n\n')

        const newUserMsg: ChatMessage = { role: 'user', content: answerText }
        const updatedMessages = [...preCheckMessages, newUserMsg]
        setPreCheckMessages(updatedMessages)
        setCurrentQuestions([])
        setQuestionAnswers({})
        callPreCheck(updatedMessages)
    }, [currentQuestions, questionAnswers, preCheckMessages, callPreCheck])

    // 事前確認コンテキスト（最終要約のみ送信してトークン節約）
    const buildPreCheckContext = useCallback((): string | undefined => {
        if (!preCheckSummary) return undefined
        return preCheckSummary
    }, [preCheckSummary])

    // --- 検証実行 ---
    const runValidation = useCallback(async () => {
        if (csvRows.length === 0) return
        if (mode === 'pdf' && !pdfBase64) {
            setError('PDFモードではPDFファイルをアップロードしてください')
            return
        }

        setIsRunning(true)
        setError(null)
        setBatchResults([])
        setAppliedCorrections(new Map())
        abortRef.current = false

        const batches: string[][][] = []
        for (let i = 0; i < csvRows.length; i += batchSize) {
            batches.push(csvRows.slice(i, i + batchSize))
        }
        setTotalBatches(batches.length)

        for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
            if (abortRef.current) break

            setCurrentBatch(batchIdx + 1)

            // バッチ間ディレイ（レートリミット対策）
            if (batchIdx > 0) {
                await new Promise(resolve => setTimeout(resolve, 5000))
            }

            let retries = 0
            const maxRetries = 3

            while (retries <= maxRetries) {
                if (abortRef.current) break

                try {
                    const res = await fetch('/api/validate-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            rows: batches[batchIdx],
                            headers: csvHeaders,
                            prompt,
                            mode,
                            // PDF抽出済みならPDF本体は送らない（トークン節約）
                            pdfBase64: mode === 'pdf' && !pdfExtract ? pdfBase64 : undefined,
                            pdfExtract: pdfExtract || undefined,
                            model,
                            preCheckContext: buildPreCheckContext(),
                        }),
                    })

                    if (res.status === 429 && retries < maxRetries) {
                        retries++
                        const waitSec = 30 * retries
                        setError(`レートリミット - ${waitSec}秒待機中... (リトライ ${retries}/${maxRetries})`)
                        await new Promise(resolve => setTimeout(resolve, waitSec * 1000))
                        setError(null)
                        continue
                    }

                    if (!res.ok) {
                        let errMsg = `HTTP ${res.status}`
                        try {
                            const errData = await res.json()
                            errMsg = errData.error || errMsg
                        } catch {
                            const text = await res.text().catch(() => '')
                            if (text) errMsg = text.slice(0, 200)
                        }
                        setBatchResults(prev => [...prev, {
                            batchIndex: batchIdx,
                            results: [],
                            error: errMsg,
                        }])
                        break
                    }

                    const data = await res.json()

                    // rowIndexをグローバルインデックスに変換
                    const globalResults: ValidationResult[] = (data.results || []).map(
                        (r: ValidationResult) => ({
                            ...r,
                            rowIndex: batchIdx * batchSize + r.rowIndex,
                        })
                    )

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
    }, [csvRows, csvHeaders, prompt, mode, pdfBase64, pdfExtract, batchSize, model, buildPreCheckContext])

    const stopValidation = useCallback(() => {
        abortRef.current = true
    }, [])

    // --- 結果集約 ---
    const allResults = batchResults.flatMap(br => br.results)
    const filteredResults = filter === 'ALL'
        ? allResults
        : allResults.filter(r => r.status === filter)

    const counts = {
        OK: allResults.filter(r => r.status === 'OK').length,
        NG: allResults.filter(r => r.status === 'NG').length,
        WARN: allResults.filter(r => r.status === 'WARN').length,
    }
    const errors = batchResults.filter(br => br.error)

    // --- 修正適用ヘルパー ---
    const getEffectiveValue = (rowIndex: number, colIndex: number): string => {
        const key = `${rowIndex}-${colIndex}`
        return appliedCorrections.get(key) ?? csvRows[rowIndex]?.[colIndex] ?? ''
    }

    const getEffectiveRow = (rowIndex: number): string[] => {
        const row = csvRows[rowIndex]
        if (!row) return []
        return row.map((_, colIndex) => getEffectiveValue(rowIndex, colIndex))
    }

    const isCellCorrected = (rowIndex: number, colIndex: number): boolean => {
        return appliedCorrections.has(`${rowIndex}-${colIndex}`)
    }

    const applyRowCorrections = (result: ValidationResult) => {
        if (!result.corrections) return
        setAppliedCorrections(prev => {
            const next = new Map(prev)
            for (const c of result.corrections!) {
                next.set(`${result.rowIndex}-${c.columnIndex}`, c.corrected)
            }
            return next
        })
    }

    const undoRowCorrections = (result: ValidationResult) => {
        if (!result.corrections) return
        setAppliedCorrections(prev => {
            const next = new Map(prev)
            for (const c of result.corrections!) {
                next.delete(`${result.rowIndex}-${c.columnIndex}`)
            }
            return next
        })
    }

    const isRowCorrected = (result: ValidationResult): boolean => {
        if (!result.corrections || result.corrections.length === 0) return false
        return result.corrections.some(c => appliedCorrections.has(`${result.rowIndex}-${c.columnIndex}`))
    }

    const correctableResults = allResults.filter(r => r.corrections && r.corrections.length > 0)

    const applyAllCorrections = () => {
        setAppliedCorrections(prev => {
            const next = new Map(prev)
            for (const r of correctableResults) {
                for (const c of r.corrections!) {
                    next.set(`${r.rowIndex}-${c.columnIndex}`, c.corrected)
                }
            }
            return next
        })
    }

    const resetAllCorrections = () => {
        setAppliedCorrections(new Map())
    }

    // --- CSV出力 ---
    const downloadResultsCsv = useCallback(() => {
        const header = '行番号,ステータス,CSVデータ,修正後データ,検証結果,修正案,参照元'
        const lines = allResults.map(r => {
            const rowData = csvRows[r.rowIndex]
                ? csvRows[r.rowIndex].join(' / ')
                : ''
            const effectiveData = getEffectiveRow(r.rowIndex).join(' / ')
            return [
                r.rowIndex + 1,
                r.status,
                `"${rowData.replace(/"/g, '""')}"`,
                `"${effectiveData.replace(/"/g, '""')}"`,
                `"${(r.details || '').replace(/"/g, '""')}"`,
                `"${(r.correction || '').replace(/"/g, '""')}"`,
                `"${(r.sources || []).join('; ').replace(/"/g, '""')}"`,
            ].join(',')
        })

        const csv = '\uFEFF' + [header, ...lines].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `validation_results_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }, [allResults, csvRows, appliedCorrections])

    // --- ステータスアイコン ---
    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'OK':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />
            case 'NG':
                return <AlertCircle className="w-5 h-5 text-red-400" />
            case 'WARN':
                return <AlertTriangle className="w-5 h-5 text-yellow-400" />
            default:
                return null
        }
    }

    const statusBgClass = (status: string) => {
        switch (status) {
            case 'OK': return 'bg-green-900/30 border-green-700/50'
            case 'NG': return 'bg-red-900/30 border-red-700/50'
            case 'WARN': return 'bg-yellow-900/30 border-yellow-700/50'
            default: return ''
        }
    }

    return (
        <div className="space-y-6">
            {/* ヘッダー */}
            <div>
                <h1 className="text-2xl font-bold text-white">データ検証</h1>
                <p className="text-sm text-slate-400 mt-0.5">CSVデータをAIがWeb検索やPDF照合で検証します</p>
            </div>

            {/* Step 1: CSVアップロード */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-white mb-1">1. データファイルをアップロード</h2>
                        <p className="text-sm text-slate-400 mb-3">検証したいCSVまたはExcelファイルを選択してください</p>
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
                                {csvFile.name} - {csvRows.length}行
                            </p>
                        )}
                    </div>
                </div>

                {/* CSVプレビュー */}
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
                                {csvRows.slice(0, 5).map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2 text-slate-500 text-xs">{i + 1}</td>
                                        {row.map((_, j) => {
                                            const corrected = isCellCorrected(i, j)
                                            const value = getEffectiveValue(i, j)
                                            return (
                                                <td
                                                    key={j}
                                                    className={`px-3 py-2 text-xs max-w-[200px] truncate ${
                                                        corrected ? 'bg-green-900/30 text-green-300 font-medium' : 'text-slate-300'
                                                    }`}
                                                >
                                                    {value}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {csvRows.length > 5 && (
                            <p className="text-xs text-slate-500 mt-2 px-3">...他 {csvRows.length - 5}行</p>
                        )}
                    </div>
                )}
            </div>

            {/* Step 2: PDF（任意） */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-white mb-1">2. PDFファイル（任意）</h2>
                        <p className="text-sm text-slate-400 mb-3">PDF照合モードで使用する原本PDFをアップロード</p>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-purple-600/20 file:text-purple-400
                                hover:file:bg-purple-600/30
                                cursor-pointer"
                        />
                        {pdfFile && (
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-sm text-slate-400">
                                    {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)
                                </p>
                                <button
                                    onClick={() => { setPdfFile(null); setPdfBase64('') }}
                                    className="text-slate-500 hover:text-red-400"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Step 3: 検証設定 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Search className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="font-semibold text-white mb-1">3. 検証設定</h2>
                            <p className="text-sm text-slate-400">検証方法とプロンプトを設定してください</p>
                        </div>

                        {/* モード選択 */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setMode('web')}
                                className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                    mode === 'web'
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <Search className="w-4 h-4 inline mr-2" />
                                Web検索で検証
                            </button>
                            <button
                                onClick={() => setMode('pdf')}
                                className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                    mode === 'pdf'
                                        ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                        : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <FileText className="w-4 h-4 inline mr-2" />
                                PDF照合で検証
                            </button>
                        </div>

                        {/* テンプレート選択 */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">プロンプトテンプレート</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => handleTemplateChange(Number(e.target.value))}
                                className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {PROMPT_TEMPLATES.map((t, i) => (
                                    <option key={i} value={i}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* プロンプト入力 */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">検証プロンプト</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                                placeholder="検証の指示を入力..."
                            />
                        </div>

                        {/* バッチサイズ・モデル */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">バッチサイズ</label>
                                <select
                                    value={batchSize}
                                    onChange={(e) => setBatchSize(Number(e.target.value))}
                                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                    className="w-full bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    {MODELS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 推定バッチ数 */}
                        {csvRows.length > 0 && (
                            <p className="text-xs text-slate-500">
                                {csvRows.length}行 / {batchSize}件ずつ = {Math.ceil(csvRows.length / batchSize)}バッチ
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Step 4: 事前確認 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-teal-400" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="font-semibold text-white mb-1">4. 事前確認（推奨）</h2>
                            <p className="text-sm text-slate-400">検証前にAIとデータの内容・チェック方針を擦り合わせます</p>
                        </div>

                        {/* 初期状態: 開始ボタン */}
                        {preCheckMessages.length === 0 && !isPreChecking && (
                            <button
                                onClick={startPreCheck}
                                disabled={csvRows.length === 0 || !prompt.trim()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                <MessageCircle className="w-4 h-4" />
                                事前確認を開始
                            </button>
                        )}

                        {/* ローディング */}
                        {isPreChecking && (
                            <div className="flex items-center gap-3 py-4">
                                <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                                <span className="text-sm text-slate-300">AIが確認事項を整理中...</span>
                            </div>
                        )}

                        {/* 準備完了 */}
                        {preCheckReady && (
                            <div className="bg-teal-900/30 border border-teal-700/50 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                                    <span className="text-sm font-medium text-teal-300">事前確認完了</span>
                                </div>
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{preCheckSummary}</p>
                            </div>
                        )}

                        {/* 質問カード */}
                        {!isPreChecking && currentQuestions.length > 0 && (
                            <>
                                {/* AIメッセージ（あれば） */}
                                {preCheckMessages.length > 0 && (() => {
                                    const lastAssistant = [...preCheckMessages].reverse().find(m => m.role === 'assistant')
                                    if (!lastAssistant) return null
                                    try {
                                        const parsed = JSON.parse(lastAssistant.content)
                                        if (parsed.message) {
                                            return (
                                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{parsed.message}</p>
                                            )
                                        }
                                    } catch { /* ignore */ }
                                    return null
                                })()}

                                <div className="space-y-3">
                                    {currentQuestions.map((q) => (
                                        <div key={q.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                            <label className="block text-sm text-slate-200 mb-2">{q.question}</label>
                                            <input
                                                type="text"
                                                value={questionAnswers[q.id] || ''}
                                                onChange={(e) => setQuestionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                placeholder="回答を入力..."
                                                className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={submitAnswers}
                                        disabled={currentQuestions.some(q => !questionAnswers[q.id]?.trim())}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        <Send className="w-4 h-4" />
                                        回答を送信
                                    </button>
                                </div>
                            </>
                        )}

                        {/* リセットボタン */}
                        {(preCheckMessages.length > 0 || preCheckReady) && !isPreChecking && (
                            <button
                                onClick={() => {
                                    setPreCheckMessages([])
                                    setPreCheckReady(false)
                                    setPreCheckSummary('')
                                    setPdfExtract('')
                                    setCurrentQuestions([])
                                    setQuestionAnswers({})
                                }}
                                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                            >
                                リセットしてやり直す
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 実行・進捗 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-4">
                    {!isRunning ? (
                        <button
                            onClick={runValidation}
                            disabled={csvRows.length === 0 || !prompt.trim()}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            <Play className="w-5 h-5" />
                            検証開始{preCheckMessages.length === 0 ? '（事前確認スキップ）' : ''}
                        </button>
                    ) : (
                        <button
                            onClick={stopValidation}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                        >
                            <Square className="w-5 h-5" />
                            中断
                        </button>
                    )}

                    {isRunning && (
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                                <span className="text-sm text-slate-300">
                                    バッチ {currentBatch} / {totalBatches} 処理中...
                                </span>
                            </div>
                            <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentBatch / totalBatches) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {!isRunning && allResults.length > 0 && (
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-400">OK: {counts.OK}</span>
                            <span className="text-red-400">NG: {counts.NG}</span>
                            <span className="text-yellow-400">WARN: {counts.WARN}</span>
                        </div>
                    )}
                </div>

                {/* バッチエラー表示 */}
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

            {/* エラー表示 */}
            {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 flex items-center gap-3 text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* 結果テーブル */}
            {allResults.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white">検証結果（{allResults.length}件）</h2>
                        <div className="flex items-center gap-3">
                            {/* フィルター */}
                            <div className="flex gap-1">
                                {(['ALL', 'NG', 'WARN', 'OK'] as FilterStatus[]).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            filter === f
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                        }`}
                                    >
                                        {f === 'ALL' ? '全件' : f}
                                        {f !== 'ALL' && ` (${counts[f]})`}
                                    </button>
                                ))}
                            </div>

                            {/* CSVダウンロード */}
                            <button
                                onClick={downloadResultsCsv}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                            >
                                <Download className="w-4 h-4" />
                                CSV
                            </button>
                            {/* Excelダウンロード */}
                            <button
                                onClick={() => downloadExcel(csvHeaders, csvRows, allResults, appliedCorrections)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Excel
                            </button>
                        </div>
                    </div>

                    {/* 一括修正ツールバー */}
                    {correctableResults.length > 0 && (
                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/50 rounded-lg">
                            <button
                                onClick={applyAllCorrections}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-medium"
                            >
                                <Check className="w-4 h-4" />
                                全修正を適用（{correctableResults.length}件）
                            </button>
                            <button
                                onClick={resetAllCorrections}
                                disabled={appliedCorrections.size === 0}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Undo2 className="w-4 h-4" />
                                全リセット
                            </button>
                            {appliedCorrections.size > 0 && (
                                <span className="text-sm text-green-400 ml-auto">
                                    {appliedCorrections.size}セル修正済み
                                </span>
                            )}
                        </div>
                    )}

                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {filteredResults.map((r, i) => (
                            <div
                                key={i}
                                className={`border rounded-lg px-4 py-3 ${statusBgClass(r.status)}`}
                            >
                                <div className="flex items-start gap-3">
                                    <StatusIcon status={r.status} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-slate-500">行{r.rowIndex + 1}</span>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                                r.status === 'OK' ? 'bg-green-800/50 text-green-300' :
                                                r.status === 'NG' ? 'bg-red-800/50 text-red-300' :
                                                'bg-yellow-800/50 text-yellow-300'
                                            }`}>
                                                {r.status}
                                            </span>
                                        </div>
                                        {/* CSVデータ要約 */}
                                        <p className="text-xs text-slate-500 mb-1 truncate">
                                            {csvRows[r.rowIndex]?.slice(0, 4).join(' / ')}
                                        </p>
                                        {/* 検証結果 */}
                                        <p className="text-sm text-slate-200">{r.details}</p>
                                        {/* 構造化修正案 */}
                                        {r.corrections && r.corrections.length > 0 ? (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                    {r.corrections.map((c, ci) => (
                                                        <span key={ci} className="text-xs">
                                                            <span className="text-slate-400">{c.column}: </span>
                                                            <span className="text-red-400 line-through">{c.original}</span>
                                                            <ArrowRight className="w-3 h-3 inline mx-1 text-slate-500" />
                                                            <span className="text-green-400 font-medium">{c.corrected}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 mt-1.5">
                                                    {!isRowCorrected(r) ? (
                                                        <button
                                                            onClick={() => applyRowCorrections(r)}
                                                            className="flex items-center gap-1 px-2.5 py-1 bg-green-600/80 text-white rounded text-xs hover:bg-green-500 transition-colors"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            適用
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => undoRowCorrections(r)}
                                                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-600 text-slate-300 rounded text-xs hover:bg-slate-500 transition-colors"
                                                        >
                                                            <Undo2 className="w-3 h-3" />
                                                            元に戻す
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : r.correction ? (
                                            <p className="text-sm text-orange-300 mt-1">
                                                修正案: {r.correction}
                                            </p>
                                        ) : null}
                                        {/* 参照元 */}
                                        {r.sources && r.sources.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {r.sources.map((url, j) => (
                                                    <a
                                                        key={j}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-400 hover:underline truncate max-w-[300px]"
                                                    >
                                                        {url}
                                                    </a>
                                                ))}
                                            </div>
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

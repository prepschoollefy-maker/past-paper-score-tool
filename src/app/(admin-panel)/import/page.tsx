'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Download, FileSpreadsheet, Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ParsedRow {
    schoolName: string
    alias: string
    year: number
    sessionLabel: string
    subjects: { name: string; maxScore: number }[]
    officialData: {
        passingMin?: number
        passingAvg?: number
        applicantAvg?: number
        subjectData: { subject: string; passingAvg?: number; applicantAvg?: number }[]
    }
}

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<ParsedRow[]>([])
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [progress, setProgress] = useState(0)

    const supabase = createClient()

    function parseCSV(text: string): ParsedRow[] {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length < 2) return []

        const headers = lines[0].split(',').map(h => h.trim())
        const rows: ParsedRow[] = []

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim())
            const getValue = (colName: string) => {
                const idx = headers.indexOf(colName)
                return idx >= 0 ? values[idx] : ''
            }
            const getNumber = (colName: string) => {
                const v = getValue(colName)
                return v ? parseFloat(v) : undefined
            }

            const subjects: { name: string; maxScore: number }[] = []
            const subjectData: { subject: string; passingAvg?: number; applicantAvg?: number }[] = []

            // 科目配点
            const subjectCols = [
                { name: '国語', scoreCol: '国語配点', passCol: '国語合平均', appCol: '国語受平均' },
                { name: '算数', scoreCol: '算数配点', passCol: '算数合平均', appCol: '算数受平均' },
                { name: '社会', scoreCol: '社会配点', passCol: '社会合平均', appCol: '社会受平均' },
                { name: '理科', scoreCol: '理科配点', passCol: '理科合平均', appCol: '理科受平均' },
                { name: '英語', scoreCol: '英語配点', passCol: '英語合平均', appCol: '英語受平均' },
            ]

            for (const col of subjectCols) {
                const maxScore = getNumber(col.scoreCol)
                if (maxScore) {
                    subjects.push({ name: col.name, maxScore })
                    const passAvg = getNumber(col.passCol)
                    const appAvg = getNumber(col.appCol)
                    if (passAvg || appAvg) {
                        subjectData.push({ subject: col.name, passingAvg: passAvg, applicantAvg: appAvg })
                    }
                }
            }

            const yearStr = getValue('年度')
            if (!yearStr) continue

            rows.push({
                schoolName: getValue('学校名'),
                alias: getValue('別名'),
                year: parseInt(yearStr),
                sessionLabel: getValue('回'),
                subjects,
                officialData: {
                    passingMin: getNumber('合格最低点'),
                    passingAvg: getNumber('合格者平均'),
                    applicantAvg: getNumber('受験者平均'),
                    subjectData,
                },
            })
        }

        return rows
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setResult(null)

        const text = await f.text()
        const parsed = parseCSV(text)
        setParsedData(parsed)
    }

    async function handleImport() {
        if (parsedData.length === 0) return

        setImporting(true)
        setResult(null)
        setProgress(0)

        try {
            const schoolCache: Record<string, string> = {}
            let processed = 0

            for (const row of parsedData) {
                // 1. 学校の取得または作成
                let schoolId = schoolCache[row.schoolName]
                if (!schoolId) {
                    const { data: existingSchool } = await supabase
                        .from('schools')
                        .select('id')
                        .eq('name', row.schoolName)
                        .single()

                    if (existingSchool) {
                        schoolId = existingSchool.id
                    } else {
                        const { data: newSchool, error } = await supabase
                            .from('schools')
                            .insert({ name: row.schoolName })
                            .select('id')
                            .single()

                        if (error) throw new Error(`学校作成エラー: ${row.schoolName}`)
                        schoolId = newSchool.id

                        // 別名を追加
                        if (row.alias) {
                            await supabase.from('school_aliases').insert({
                                school_id: schoolId,
                                alias: row.alias,
                            })
                        }
                    }
                    schoolCache[row.schoolName] = schoolId
                }

                // 2. 試験回の取得または作成
                const { data: existingSession } = await supabase
                    .from('exam_sessions')
                    .select('id')
                    .eq('school_id', schoolId)
                    .eq('year', row.year)
                    .eq('session_label', row.sessionLabel)
                    .single()

                let sessionId: string
                if (existingSession) {
                    sessionId = existingSession.id
                    // 既存の科目と公式データを削除して再作成
                    await supabase.from('required_subjects').delete().eq('exam_session_id', sessionId)
                    await supabase.from('official_data').delete().eq('exam_session_id', sessionId)
                } else {
                    const { data: newSession, error } = await supabase
                        .from('exam_sessions')
                        .insert({
                            school_id: schoolId,
                            year: row.year,
                            session_label: row.sessionLabel,
                        })
                        .select('id')
                        .single()

                    if (error) throw new Error(`試験回作成エラー: ${row.schoolName} ${row.year} ${row.sessionLabel}`)
                    sessionId = newSession.id
                }

                // 3. 科目配点を追加
                if (row.subjects.length > 0) {
                    await supabase.from('required_subjects').insert(
                        row.subjects.map(s => ({
                            exam_session_id: sessionId,
                            subject: s.name,
                            max_score: s.maxScore,
                        }))
                    )
                }

                // 4. 公式データを追加（総合）
                const officialRows: {
                    exam_session_id: string
                    subject: string
                    passing_min?: number
                    passer_avg?: number
                    applicant_avg?: number
                }[] = []

                if (row.officialData.passingMin || row.officialData.passingAvg || row.officialData.applicantAvg) {
                    officialRows.push({
                        exam_session_id: sessionId,
                        subject: '総合',
                        passing_min: row.officialData.passingMin,
                        passer_avg: row.officialData.passingAvg,
                        applicant_avg: row.officialData.applicantAvg,
                    })
                }

                // 科目別公式データ
                for (const sd of row.officialData.subjectData) {
                    officialRows.push({
                        exam_session_id: sessionId,
                        subject: sd.subject,
                        passer_avg: sd.passingAvg,
                        applicant_avg: sd.applicantAvg,
                    })
                }

                if (officialRows.length > 0) {
                    await supabase.from('official_data').insert(officialRows)
                }

                processed++
                setProgress(Math.round((processed / parsedData.length) * 100))
            }

            setResult({ success: true, message: `${parsedData.length}件のデータをインポートしました` })
        } catch (err) {
            setResult({ success: false, message: err instanceof Error ? err.message : 'エラーが発生しました' })
        } finally {
            setImporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin-panel" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">データインポート</h1>
            </div>

            {/* インポート方式の説明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">データ上書き方式について</p>
                        <p>
                            インポートは<strong>上書き方式</strong>です。
                            <strong>「学校名」「年度」「回」</strong>の組み合わせをキーとして、
                            既存データがある場合は科目配点と公式データを完全に削除して再作成します。
                        </p>
                    </div>
                </div>
            </div>

            {/* テンプレートダウンロード */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 mb-1">1. テンプレートをダウンロード</h2>
                        <p className="text-sm text-slate-500 mb-3">
                            ExcelまたはGoogleスプレッドシートで編集し、CSV形式で保存してください
                        </p>
                        <a
                            href="/template_school_data.csv"
                            download="template_school_data.csv"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            テンプレートをダウンロード
                        </a>
                    </div>
                </div>
            </div>

            {/* ファイルアップロード */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 mb-1">2. CSVファイルをアップロード</h2>
                        <p className="text-sm text-slate-500 mb-3">
                            編集したCSVファイルを選択してください
                        </p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-600
                                hover:file:bg-blue-100
                                cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* プレビュー */}
            {parsedData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">
                        プレビュー（{parsedData.length}件）
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">学校名</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">年度</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">回</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">科目</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">合格最低点</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {parsedData.slice(0, 10).map((row, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2 text-slate-800">{row.schoolName}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.year}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.sessionLabel}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.subjects.map(s => s.name).join('・')}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.officialData.passingMin || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parsedData.length > 10 && (
                            <p className="text-sm text-slate-500 mt-2">...他 {parsedData.length - 10}件</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            {importing ? `インポート中... ${progress}%` : 'インポート実行'}
                        </button>
                    </div>
                </div>
            )}

            {/* 結果表示 */}
            {result && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${result.success
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {result.success ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {result.message}
                </div>
            )}
        </div>
    )
}

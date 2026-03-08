'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, Download, FileSpreadsheet, Check, AlertCircle, CalendarDays, BookOpen } from 'lucide-react'
import Link from 'next/link'
import * as XLSX from 'xlsx'

// ============================================================
// 共通
// ============================================================

type Tab = 'scores' | 'schedule'

// ============================================================
// 成績データ型
// ============================================================

interface ParsedScoreRow {
    schoolName: string
    alias: string
    year: number
    sessionLabel: string
    subjects: { name: string; maxScore: number }[]
    officialData: {
        passingMin?: number
        passingMin2?: number
        passingMax?: number
        passingAvg?: number
        applicantAvg?: number
        subjectData: { subject: string; passingAvg?: number; applicantAvg?: number }[]
    }
}

// ============================================================
// スケジュールデータ型
// ============================================================

interface ParsedScheduleRow {
    schoolName: string
    year: number
    sessionLabel: string
    testDate: string
    timePeriod: '午前' | '午後'
    genderType: '男子校' | '女子校' | '共学'
    assemblyTime: string
    yotsuya80?: number
    resultAnnouncement?: string
    enrollmentFee?: number
    // optional
    estimatedEndTime?: string
    examSubjectsLabel?: string
    enrollmentDeadline?: string
    deferralAvailable?: boolean
    deferralDeposit?: number
}

// ============================================================
// メインページ
// ============================================================

export default function ImportPage() {
    const [tab, setTab] = useState<Tab>('schedule')

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin-panel" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">データインポート</h1>
            </div>

            {/* タブ */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => setTab('schedule')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        tab === 'schedule'
                            ? 'bg-white text-teal-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <CalendarDays className="w-4 h-4" />
                    受験スケジュール
                </button>
                <button
                    onClick={() => setTab('scores')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        tab === 'scores'
                            ? 'bg-white text-teal-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    成績データ (CSV)
                </button>
            </div>

            {tab === 'schedule' ? <ScheduleImport /> : <ScoreImport />}
        </div>
    )
}

// ============================================================
// スケジュールインポート (Excel)
// ============================================================

function ScheduleImport() {
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<ParsedScheduleRow[]>([])
    const [errors, setErrors] = useState<string[]>([])
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [progress, setProgress] = useState(0)
    const supabase = createClient()

    function parseExcel(data: ArrayBuffer): { rows: ParsedScheduleRow[]; errors: string[] } {
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { range: 1 }) // skip description row

        const rows: ParsedScheduleRow[] = []
        const errs: string[] = []

        for (let i = 0; i < raw.length; i++) {
            const r = raw[i]
            const lineNum = i + 3 // header=1, description=2, data starts at 3

            const str = (key: string) => {
                const v = r[key]
                return v != null ? String(v).trim() : ''
            }
            const num = (key: string) => {
                const v = r[key]
                if (v == null || v === '') return undefined
                const n = Number(v)
                return isNaN(n) ? undefined : n
            }

            // 必須チェック
            const schoolName = str('学校名')
            const yearVal = num('年度')
            const sessionLabel = str('回次')
            const testDate = normalizeDate(str('試験日'))
            const timePeriod = str('午前午後')
            const genderType = str('性別区分')
            const assemblyTime = normalizeTime(str('集合時間'))
            const resultAnnouncement = normalizeDatetime(str('合格発表日時'))
            const enrollmentDeadline = normalizeDatetime(str('入学手続き締切'))
            const enrollmentFee = num('入学金')
            const yotsuya80 = num('四谷80偏差値')

            const missing: string[] = []
            if (!schoolName) missing.push('学校名')
            if (!yearVal) missing.push('年度')
            if (!sessionLabel) missing.push('回次')
            if (!testDate) missing.push('試験日')
            if (!timePeriod || (timePeriod !== '午前' && timePeriod !== '午後')) missing.push('午前午後')
            if (!genderType || !['男子校', '女子校', '共学'].includes(genderType)) missing.push('性別区分')
            if (!assemblyTime) missing.push('集合時間')

            if (missing.length > 0) {
                errs.push(`行${lineNum}: ${missing.join(', ')} が不正です (${schoolName || '学校名なし'})`)
                continue
            }

            rows.push({
                schoolName,
                year: yearVal!,
                sessionLabel,
                testDate: testDate!,
                timePeriod: timePeriod as '午前' | '午後',
                genderType: genderType as '男子校' | '女子校' | '共学',
                assemblyTime: assemblyTime!,
                yotsuya80,
                resultAnnouncement: resultAnnouncement || undefined,
                enrollmentFee,
                estimatedEndTime: normalizeTime(str('終了予定')) || undefined,
                examSubjectsLabel: str('科目') || str('科目区分') || undefined,
                enrollmentDeadline: enrollmentDeadline || undefined,
                deferralAvailable: str('延納可否') === '可' ? true :
                    str('延納可否') === '否' ? false :
                    str('延納可否').toUpperCase() === 'TRUE' ? true :
                    str('延納可否').toUpperCase() === 'FALSE' ? false : undefined,
                deferralDeposit: num('延納金'),
            })
        }

        return { rows, errors: errs }
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setResult(null)
        setErrors([])

        const buf = await f.arrayBuffer()
        const { rows, errors: errs } = parseExcel(buf)
        setParsedData(rows)
        setErrors(errs)
    }

    async function handleImport() {
        if (parsedData.length === 0) return
        setImporting(true)
        setResult(null)
        setProgress(0)

        try {
            const schoolCache: Record<string, string> = {}
            let created = 0
            let updated = 0

            for (let i = 0; i < parsedData.length; i++) {
                const row = parsedData[i]

                // 1. 学校の取得/作成
                let schoolId = schoolCache[row.schoolName]
                if (!schoolId) {
                    const { data: existing } = await supabase
                        .from('schools').select('id').eq('name', row.schoolName).single()

                    if (existing) {
                        schoolId = existing.id
                    } else {
                        const { data: created, error } = await supabase
                            .from('schools').insert({ name: row.schoolName }).select('id').single()
                        if (error) throw new Error(`学校作成エラー: ${row.schoolName} - ${error.message}`)
                        schoolId = created.id
                    }
                    schoolCache[row.schoolName] = schoolId
                }

                // 2. exam_session upsert
                const sessionData = {
                    school_id: schoolId,
                    year: row.year,
                    session_label: row.sessionLabel,
                    test_date: row.testDate,
                    time_period: row.timePeriod,
                    gender_type: row.genderType,
                    assembly_time: row.assemblyTime,
                    estimated_end_time: row.estimatedEndTime || null,
                    exam_subjects_label: row.examSubjectsLabel || null,
                    result_announcement: row.resultAnnouncement || null,
                    enrollment_deadline: row.enrollmentDeadline || null,
                    enrollment_fee: row.enrollmentFee ?? null,
                    deferral_available: row.deferralAvailable ?? null,
                    deferral_deposit: row.deferralDeposit ?? null,
                    yotsuya_80: row.yotsuya80 ?? null,
                }

                // 既存チェック
                const { data: existingSession } = await supabase
                    .from('exam_sessions')
                    .select('id')
                    .eq('school_id', schoolId)
                    .eq('year', row.year)
                    .eq('session_label', row.sessionLabel)
                    .single()

                if (existingSession) {
                    const { error } = await supabase
                        .from('exam_sessions')
                        .update(sessionData)
                        .eq('id', existingSession.id)
                    if (error) throw new Error(`更新エラー: ${row.schoolName} ${row.sessionLabel} - ${error.message}`)
                    updated++
                } else {
                    const { error } = await supabase
                        .from('exam_sessions')
                        .insert(sessionData)
                    if (error) throw new Error(`作成エラー: ${row.schoolName} ${row.sessionLabel} - ${error.message}`)
                    created++
                }

                setProgress(Math.round(((i + 1) / parsedData.length) * 100))
            }

            setResult({
                success: true,
                message: `完了: ${created}件作成, ${updated}件更新 (全${parsedData.length}件)`,
            })
        } catch (err) {
            setResult({
                success: false,
                message: err instanceof Error ? err.message : 'エラーが発生しました',
            })
        } finally {
            setImporting(false)
        }
    }

    return (
        <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Excelインポート（upsert方式）</p>
                        <p>
                            <strong>「学校名」「年度」「回次」</strong>の組み合わせをキーとして、
                            既存データがあれば更新、なければ新規作成します。
                            学校マスタも自動で作成されます。
                        </p>
                    </div>
                </div>
            </div>

            {/* テンプレートDL */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 mb-1">1. テンプレートをダウンロード</h2>
                        <p className="text-sm text-slate-500 mb-3">
                            Excelで開いてデータを入力してください。1行目=ヘッダー、2行目=説明（灰色行）、3行目以降=データです。サンプル3行は削除してください。
                        </p>
                        <a
                            href="/template_schedule_data.xlsx"
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            テンプレート (.xlsx)
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
                        <h2 className="font-semibold text-slate-800 mb-1">2. Excelファイルをアップロード</h2>
                        <p className="text-sm text-slate-500 mb-3">
                            .xlsx または .xls ファイルを選択
                        </p>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-600
                                hover:file:bg-blue-100 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* バリデーションエラー */}
            {errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-700 mb-2">
                        {errors.length}件のスキップ行
                    </p>
                    <ul className="text-xs text-amber-600 space-y-1 max-h-32 overflow-y-auto">
                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </div>
            )}

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
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">回次</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">試験日</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">時間</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">性別</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Y80</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">入学金</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">発表</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {parsedData.slice(0, 20).map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-slate-800 font-medium">{row.schoolName}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.sessionLabel}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.testDate}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.timePeriod}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.genderType}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.yotsuya80 ?? '-'}</td>
                                        <td className="px-3 py-2 text-slate-600">{row.enrollmentFee ? `¥${row.enrollmentFee.toLocaleString()}` : '-'}</td>
                                        <td className="px-3 py-2 text-slate-600 text-xs">{row.resultAnnouncement || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parsedData.length > 20 && (
                            <p className="text-sm text-slate-500 mt-2 px-3">...他 {parsedData.length - 20}件</p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            <Upload className="w-5 h-5" />
                            {importing ? `インポート中... ${progress}%` : `${parsedData.length}件をインポート`}
                        </button>
                        {importing && (
                            <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-xs">
                                <div
                                    className="bg-teal-500 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 結果 */}
            {result && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    result.success
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                    {result.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-medium">{result.message}</span>
                </div>
            )}
        </>
    )
}

// ============================================================
// 成績インポート (CSV) - 既存機能
// ============================================================

function ScoreImport() {
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<ParsedScoreRow[]>([])
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
    const [progress, setProgress] = useState(0)
    const supabase = createClient()

    function parseCSV(text: string): ParsedScoreRow[] {
        const lines = text.split('\n').filter(line => line.trim())
        if (lines.length < 2) return []
        const headers = lines[0].split(',').map(h => h.trim())
        const rows: ParsedScoreRow[] = []

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
                    passingMin2: getNumber('合格最低点※'),
                    passingMax: getNumber('合格最高点'),
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
        setParsedData(parseCSV(text))
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
                let schoolId = schoolCache[row.schoolName]
                if (!schoolId) {
                    const { data: existing } = await supabase
                        .from('schools').select('id').eq('name', row.schoolName).single()
                    if (existing) {
                        schoolId = existing.id
                    } else {
                        const { data: created, error } = await supabase
                            .from('schools').insert({ name: row.schoolName }).select('id').single()
                        if (error) throw new Error(`学校作成エラー: ${row.schoolName}`)
                        schoolId = created.id
                        if (row.alias) {
                            await supabase.from('school_aliases').insert({ school_id: schoolId, alias: row.alias })
                        }
                    }
                    schoolCache[row.schoolName] = schoolId
                }

                const { data: existingSession } = await supabase
                    .from('exam_sessions').select('id')
                    .eq('school_id', schoolId).eq('year', row.year).eq('session_label', row.sessionLabel).single()

                let sessionId: string
                if (existingSession) {
                    sessionId = existingSession.id
                    await supabase.from('required_subjects').delete().eq('exam_session_id', sessionId)
                    await supabase.from('official_data').delete().eq('exam_session_id', sessionId)
                } else {
                    const { data: newSession, error } = await supabase
                        .from('exam_sessions').insert({ school_id: schoolId, year: row.year, session_label: row.sessionLabel })
                        .select('id').single()
                    if (error) throw new Error(`試験回作成エラー: ${row.schoolName} ${row.year} ${row.sessionLabel}`)
                    sessionId = newSession.id
                }

                if (row.subjects.length > 0) {
                    await supabase.from('required_subjects').insert(
                        row.subjects.map(s => ({ exam_session_id: sessionId, subject: s.name, max_score: s.maxScore }))
                    )
                }

                const officialRows: Record<string, unknown>[] = []
                if (row.officialData.passingMin || row.officialData.passingMin2 || row.officialData.passingMax || row.officialData.passingAvg || row.officialData.applicantAvg) {
                    officialRows.push({
                        exam_session_id: sessionId, subject: '総合',
                        passing_min: row.officialData.passingMin, passing_min_2: row.officialData.passingMin2,
                        passing_max: row.officialData.passingMax, passer_avg: row.officialData.passingAvg,
                        applicant_avg: row.officialData.applicantAvg,
                    })
                }
                for (const sd of row.officialData.subjectData) {
                    officialRows.push({
                        exam_session_id: sessionId, subject: sd.subject,
                        passer_avg: sd.passingAvg, applicant_avg: sd.applicantAvg,
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
        <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">CSV上書き方式</p>
                        <p>
                            <strong>「学校名」「年度」「回」</strong>をキーとして、
                            既存データがある場合は科目配点と公式データを削除して再作成します。
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 mb-1">1. テンプレートをダウンロード</h2>
                        <p className="text-sm text-slate-500 mb-3">CSV形式で保存してください</p>
                        <a href="/template_school_data.csv" download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
                            <Download className="w-5 h-5" />テンプレート (.csv)
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 mb-1">2. CSVファイルをアップロード</h2>
                        <input type="file" accept=".csv" onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" />
                    </div>
                </div>
            </div>

            {parsedData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">プレビュー（{parsedData.length}件）</h2>
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
                        {parsedData.length > 10 && <p className="text-sm text-slate-500 mt-2">...他 {parsedData.length - 10}件</p>}
                    </div>
                    <div className="mt-6">
                        <button onClick={handleImport} disabled={importing}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            {importing ? `インポート中... ${progress}%` : 'インポート実行'}
                        </button>
                    </div>
                </div>
            )}

            {result && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                    {result.success ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {result.message}
                </div>
            )}
        </>
    )
}

// ============================================================
// 日付・時刻の正規化ヘルパー
// ============================================================

/** "2026-02-01" or "2026/02/01" or Excel serial → "YYYY-MM-DD" */
function normalizeDate(v: string): string | null {
    if (!v) return null
    // Excel serial number
    if (/^\d{5}$/.test(v)) {
        const d = new Date((parseInt(v) - 25569) * 86400000)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
    // YYYY-MM-DD or YYYY/MM/DD
    const m = v.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
    if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`
    return null
}

/** "8:00" or "08:00:00" → "HH:MM" */
function normalizeTime(v: string): string | null {
    if (!v) return null
    // Excel decimal (0.333... = 8:00)
    const dec = parseFloat(v)
    if (!isNaN(dec) && dec >= 0 && dec < 1) {
        const total = Math.round(dec * 1440)
        const h = Math.floor(total / 60)
        const m = total % 60
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
    const m = v.match(/(\d{1,2}):(\d{2})/)
    if (m) return `${m[1].padStart(2, '0')}:${m[2]}`
    return null
}

/** "2026-02-01 12:00" or "2026/2/1 12:00" → ISO timestamp */
function normalizeDatetime(v: string): string | null {
    if (!v) return null
    // Excel serial with time
    const dec = parseFloat(v)
    if (!isNaN(dec) && dec > 40000 && dec < 60000) {
        const d = new Date((dec - 25569) * 86400000)
        return d.toISOString()
    }
    const m = v.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})\s+(\d{1,2}):(\d{2})/)
    if (m) {
        const iso = `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}T${m[4].padStart(2, '0')}:${m[5]}:00+09:00`
        return iso
    }
    // Date only
    const d = normalizeDate(v)
    if (d) return `${d}T00:00:00+09:00`
    return null
}

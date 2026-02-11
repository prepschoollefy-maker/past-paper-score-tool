'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Plus, Download, Trash2, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import Link from 'next/link'

interface FlattenedRow {
    sessionId: string
    schoolId: string
    schoolName: string
    alias: string
    year: number
    sessionLabel: string
    // 科目配点
    算数配点?: number
    国語配点?: number
    理科配点?: number
    社会配点?: number
    英語配点?: number
    // 総合データ
    合格最低点?: number
    '合格最低点※'?: number
    合格最高点?: number
    合格者平均?: number
    受験者平均?: number
    // 科目別平均
    算数合平均?: number
    算数受平均?: number
    国語合平均?: number
    国語受平均?: number
    理科合平均?: number
    理科受平均?: number
    社会合平均?: number
    社会受平均?: number
    英語合平均?: number
    英語受平均?: number
    // Allow dynamic assignment
    [key: string]: string | number | undefined
}

interface SchoolGroup {
    schoolId: string
    schoolName: string
    alias: string
    sessions: FlattenedRow[]
}

const SUBJECT_FIELDS = [
    { key: '国語配点', label: '国語配点' },
    { key: '算数配点', label: '算数配点' },
    { key: '社会配点', label: '社会配点' },
    { key: '理科配点', label: '理科配点' },
    { key: '英語配点', label: '英語配点' },
    { key: '国語合平均', label: '国語合平均' },
    { key: '国語受平均', label: '国語受平均' },
    { key: '算数合平均', label: '算数合平均' },
    { key: '算数受平均', label: '算数受平均' },
    { key: '社会合平均', label: '社会合平均' },
    { key: '社会受平均', label: '社会受平均' },
    { key: '理科合平均', label: '理科合平均' },
    { key: '理科受平均', label: '理科受平均' },
    { key: '英語合平均', label: '英語合平均' },
    { key: '英語受平均', label: '英語受平均' },
    { key: '合格最低点', label: '合格最低点' },
    { key: '合格最低点※', label: '合格最低点※' },
    { key: '合格最高点', label: '合格最高点' },
    { key: '合格者平均', label: '合格者平均' },
    { key: '受験者平均', label: '受験者平均' },
] as const

export default function EditPage() {
    const [data, setData] = useState<FlattenedRow[]>([])
    const [searchSchoolName, setSearchSchoolName] = useState('')
    const [searchYear, setSearchYear] = useState('')
    const [searchSession, setSearchSession] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingCell, setSavingCell] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set())
    const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())
    const [addingSessionForSchool, setAddingSessionForSchool] = useState<string | null>(null)
    const [newSessionData, setNewSessionData] = useState<Partial<FlattenedRow>>({})
    const [showNewSchoolModal, setShowNewSchoolModal] = useState(false)
    const [newSchoolName, setNewSchoolName] = useState('')

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        setError(null)

        try {
            // 1. 全試験回をページネーションで取得
            let allSessions: any[] = []
            let pageSize = 1000
            let page = 0
            let hasMore = true

            while (hasMore) {
                const start = page * pageSize
                const end = start + pageSize - 1

                const { data: sessions, error: sessionsError } = await supabase
                    .from('exam_sessions')
                    .select(`
                        id,
                        year,
                        session_label,
                        schools(id, name),
                        required_subjects(subject, max_score),
                        official_data(subject, passing_min, passing_min_2, passing_max, passer_avg, applicant_avg)
                    `)
                    .range(start, end)

                if (sessionsError) throw sessionsError

                if (!sessions || sessions.length === 0) {
                    hasMore = false
                } else {
                    allSessions = [...allSessions, ...sessions]
                    if (sessions.length < pageSize) {
                        hasMore = false
                    } else {
                        page++
                    }
                }
            }

            // 2. 学校の別名を取得
            const { data: aliases, error: aliasesError } = await supabase
                .from('school_aliases')
                .select('school_id, alias')

            if (aliasesError) throw aliasesError

            // 3. 別名マップを作成
            const aliasMap: Record<string, string> = {}
            aliases?.forEach(a => {
                aliasMap[a.school_id] = a.alias
            })

            // 4. フラット化
            const flattened: FlattenedRow[] = (allSessions || []).map((session: any) => {
                const school = Array.isArray(session.schools) ? session.schools[0] : session.schools
                const subjects = Array.isArray(session.required_subjects) ? session.required_subjects : []
                const officialData = Array.isArray(session.official_data) ? session.official_data : []

                const row: FlattenedRow = {
                    sessionId: session.id,
                    schoolId: school?.id || '',
                    schoolName: school?.name || '',
                    alias: aliasMap[school?.id] || '',
                    year: session.year,
                    sessionLabel: session.session_label,
                }

                // 科目配点
                subjects.forEach((s: any) => {
                    const key = `${s.subject}配点` as keyof FlattenedRow
                    row[key] = s.max_score as unknown as number
                })

                // 総合データ
                const overall = officialData.find((d: any) => d.subject === '総合')
                if (overall) {
                    row['合格最低点'] = overall.passing_min as unknown as number
                    row['合格最低点※'] = overall.passing_min_2 as unknown as number
                    row['合格最高点'] = overall.passing_max as unknown as number
                    row['合格者平均'] = overall.passer_avg as unknown as number
                    row['受験者平均'] = overall.applicant_avg as unknown as number
                }

                // 科目別平均データ
                const subjectNames = ['国語', '算数', '社会', '理科', '英語']
                subjectNames.forEach(subj => {
                    const subjData = officialData.find((d: any) => d.subject === subj)
                    if (subjData) {
                        const passKey = `${subj}合平均` as keyof FlattenedRow
                        const appKey = `${subj}受平均` as keyof FlattenedRow
                        row[passKey] = subjData.passer_avg as unknown as number
                        row[appKey] = subjData.applicant_avg as unknown as number
                    }
                })

                return row
            })

            setData(flattened)

            // 初期状態は全て閉じた状態
        } catch (err) {
            setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    function toggleSchool(schoolId: string) {
        const newExpanded = new Set(expandedSchools)
        if (newExpanded.has(schoolId)) {
            newExpanded.delete(schoolId)
        } else {
            newExpanded.add(schoolId)
        }
        setExpandedSchools(newExpanded)
    }

    function toggleSession(sessionId: string) {
        const newExpanded = new Set(expandedSessions)
        if (newExpanded.has(sessionId)) {
            newExpanded.delete(sessionId)
        } else {
            newExpanded.add(sessionId)
        }
        setExpandedSessions(newExpanded)
    }

    async function handleCellEdit(sessionId: string, columnKey: string, newValue: string) {
        const row = data.find(r => r.sessionId === sessionId)
        if (!row) return

        const cellKey = `${sessionId}-${columnKey}`
        setSavingCell(cellKey)

        try {
            // 学校名の更新
            if (columnKey === 'schoolName') {
                if (!newValue.trim()) {
                    throw new Error('学校名を入力してください')
                }
                await supabase
                    .from('schools')
                    .update({ name: newValue.trim() })
                    .eq('id', row.schoolId)
            }
            // 別名の更新
            else if (columnKey === 'alias') {
                await supabase
                    .from('school_aliases')
                    .delete()
                    .eq('school_id', row.schoolId)

                if (newValue.trim()) {
                    await supabase
                        .from('school_aliases')
                        .insert({
                            school_id: row.schoolId,
                            alias: newValue.trim()
                        })
                }
            }
            // 年度の更新
            else if (columnKey === 'year') {
                const yearValue = parseInt(newValue)
                if (isNaN(yearValue) || yearValue < 2000 || yearValue > 2099) {
                    throw new Error('有効な年度を入力してください（2000-2099）')
                }
                await supabase
                    .from('exam_sessions')
                    .update({ year: yearValue })
                    .eq('id', row.sessionId)
            }
            // 回ラベルの更新
            else if (columnKey === 'sessionLabel') {
                if (!newValue.trim()) {
                    throw new Error('回ラベルを入力してください')
                }
                await supabase
                    .from('exam_sessions')
                    .update({ session_label: newValue.trim() })
                    .eq('id', row.sessionId)
            }

            const numValue = newValue === '' ? null : parseFloat(newValue)

            // 配点の更新
            if (columnKey.endsWith('配点')) {
                const subject = columnKey.replace('配点', '')

                await supabase
                    .from('required_subjects')
                    .delete()
                    .eq('exam_session_id', row.sessionId)
                    .eq('subject', subject)

                if (numValue !== null) {
                    await supabase
                        .from('required_subjects')
                        .insert({
                            exam_session_id: row.sessionId,
                            subject,
                            max_score: numValue,
                        })
                }
            }
            // 総合データの更新
            else if (['合格最低点', '合格最低点※', '合格最高点', '合格者平均', '受験者平均'].includes(columnKey)) {
                const fieldMap = {
                    '合格最低点': 'passing_min',
                    '合格最低点※': 'passing_min_2',
                    '合格最高点': 'passing_max',
                    '合格者平均': 'passer_avg',
                    '受験者平均': 'applicant_avg',
                } as const

                const dbField = fieldMap[columnKey as keyof typeof fieldMap]

                const { data: existing } = await supabase
                    .from('official_data')
                    .select('id')
                    .eq('exam_session_id', row.sessionId)
                    .eq('subject', '総合')
                    .single()

                if (existing) {
                    await supabase
                        .from('official_data')
                        .update({ [dbField]: numValue })
                        .eq('id', existing.id)
                } else {
                    await supabase
                        .from('official_data')
                        .insert({
                            exam_session_id: row.sessionId,
                            subject: '総合',
                            [dbField]: numValue,
                        })
                }
            }
            // 科目別平均の更新
            else {
                const subjects = ['国語', '算数', '社会', '理科', '英語']
                const subject = subjects.find(s => columnKey.startsWith(s))

                if (subject) {
                    const isPasserAvg = columnKey.endsWith('合平均')
                    const dbField = isPasserAvg ? 'passer_avg' : 'applicant_avg'

                    const { data: existing } = await supabase
                        .from('official_data')
                        .select('id')
                        .eq('exam_session_id', row.sessionId)
                        .eq('subject', subject)
                        .single()

                    if (existing) {
                        await supabase
                            .from('official_data')
                            .update({ [dbField]: numValue })
                            .eq('id', existing.id)
                    } else {
                        await supabase
                            .from('official_data')
                            .insert({
                                exam_session_id: row.sessionId,
                                subject,
                                [dbField]: numValue,
                            })
                    }
                }
            }

            // ローカルデータを更新
            const updatedData = [...data]
            const actualRowIndex = data.findIndex(r => r.sessionId === row.sessionId)
            if (actualRowIndex !== -1) {
                let finalValue: string | number | undefined
                if (columnKey === 'year') {
                    finalValue = parseInt(newValue)
                } else if (['schoolName', 'alias', 'sessionLabel'].includes(columnKey)) {
                    finalValue = newValue
                } else {
                    finalValue = numValue === null ? undefined : numValue
                }

                updatedData[actualRowIndex] = {
                    ...updatedData[actualRowIndex],
                    [columnKey]: finalValue,
                }
                setData(updatedData)
            }

            setSuccessMessage('保存しました')
            setTimeout(() => setSuccessMessage(null), 2000)

        } catch (err) {
            setError(err instanceof Error ? err.message : '更新に失敗しました')
        } finally {
            setSavingCell(null)
        }
    }

    async function handleAddSession(schoolId: string) {
        if (!newSessionData.year || !newSessionData.sessionLabel) {
            setError('年度と回を入力してください')
            return
        }

        setSavingCell('new-session')
        try {
            // exam_sessionを作成
            const { data: newSession, error: sessionError } = await supabase
                .from('exam_sessions')
                .insert({
                    school_id: schoolId,
                    year: newSessionData.year,
                    session_label: newSessionData.sessionLabel
                })
                .select('id')
                .single()

            if (sessionError) throw sessionError

            // 科目配点を追加
            const subjectScores = ['国語配点', '算数配点', '社会配点', '理科配点', '英語配点']
            const requiredSubjects = subjectScores
                .map(key => {
                    const value = newSessionData[key]
                    if (value) {
                        return {
                            exam_session_id: newSession.id,
                            subject: key.replace('配点', ''),
                            max_score: value as number
                        }
                    }
                    return null
                })
                .filter(Boolean)

            if (requiredSubjects.length > 0) {
                await supabase.from('required_subjects').insert(requiredSubjects)
            }

            // リフレッシュ
            await fetchData()
            setAddingSessionForSchool(null)
            setNewSessionData({})
            setSuccessMessage('新しい試験回を追加しました')
            setTimeout(() => setSuccessMessage(null), 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : '追加に失敗しました')
        } finally {
            setSavingCell(null)
        }
    }

    async function handleAddNewSchool() {
        if (!newSchoolName.trim()) {
            setError('学校名を入力してください')
            return
        }

        setSavingCell('new-school')
        try {
            // 学校を作成
            const { data: newSchool, error: schoolError } = await supabase
                .from('schools')
                .insert({ name: newSchoolName.trim() })
                .select('id')
                .single()

            if (schoolError) throw schoolError

            // リフレッシュ
            await fetchData()
            setShowNewSchoolModal(false)
            setNewSchoolName('')
            setSuccessMessage('新しい学校を追加しました')
            setTimeout(() => setSuccessMessage(null), 2000)

            // 新しい学校を自動展開
            setExpandedSchools(prev => new Set([...prev, newSchool.id]))
        } catch (err) {
            setError(err instanceof Error ? err.message : '追加に失敗しました')
        } finally {
            setSavingCell(null)
        }
    }

    async function handleDeleteSession(sessionId: string, schoolName: string) {
        const confirmed = window.confirm(
            `${schoolName}のこのデータを削除してもよろしいですか？\n\nこの操作は取り消せません。`
        )

        if (!confirmed) return

        setSavingCell(sessionId)

        try {
            const { error: deleteError } = await supabase
                .from('exam_sessions')
                .delete()
                .eq('id', sessionId)

            if (deleteError) throw deleteError

            const updatedData = data.filter(row => row.sessionId !== sessionId)
            setData(updatedData)

            setSuccessMessage('データを削除しました')
            setTimeout(() => setSuccessMessage(null), 2000)
        } catch (err) {
            setError(err instanceof Error ? err.message : '削除に失敗しました')
        } finally {
            setSavingCell(null)
        }
    }

    function handleExportCSV() {
        const headers = [
            '学校名', '別名', '年度', '回',
            '国語配点', '算数配点', '社会配点', '理科配点', '英語配点',
            '国語合平均', '国語受平均', '算数合平均', '算数受平均',
            '社会合平均', '社会受平均', '理科合平均', '理科受平均',
            '英語合平均', '英語受平均',
            '合格最低点', '合格最低点※', '合格最高点', '合格者平均', '受験者平均'
        ]

        const rows = filteredGroups.flatMap(group =>
            group.sessions.map(row => [
                row.schoolName,
                row.alias || '',
                row.year,
                row.sessionLabel,
                row['国語配点'] ?? '',
                row['算数配点'] ?? '',
                row['社会配点'] ?? '',
                row['理科配点'] ?? '',
                row['英語配点'] ?? '',
                row['国語合平均'] ?? '',
                row['国語受平均'] ?? '',
                row['算数合平均'] ?? '',
                row['算数受平均'] ?? '',
                row['社会合平均'] ?? '',
                row['社会受平均'] ?? '',
                row['理科合平均'] ?? '',
                row['理科受平均'] ?? '',
                row['英語合平均'] ?? '',
                row['英語受平均'] ?? '',
                row['合格最低点'] ?? '',
                row['合格最低点※'] ?? '',
                row['合格最高点'] ?? '',
                row['合格者平均'] ?? '',
                row['受験者平均'] ?? ''
            ])
        )

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const bom = '\uFEFF'
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `school_data_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    // 学校ごとにグループ化
    const schoolGroups = data.reduce((acc, row) => {
        if (!acc[row.schoolId]) {
            acc[row.schoolId] = {
                schoolId: row.schoolId,
                schoolName: row.schoolName,
                alias: row.alias,
                sessions: []
            }
        }
        acc[row.schoolId].sessions.push(row)
        return acc
    }, {} as Record<string, SchoolGroup>)

    // 学校を名前順でソート
    const sortedGroups = Object.values(schoolGroups).sort((a, b) =>
        a.schoolName.localeCompare(b.schoolName, 'ja')
    )

    // 各学校内のセッションをソート（年度降順 → 回昇順）
    sortedGroups.forEach(group => {
        group.sessions.sort((a, b) => {
            const yearDiff = b.year - a.year
            if (yearDiff !== 0) return yearDiff
            return a.sessionLabel.localeCompare(b.sessionLabel, 'ja')
        })
    })

    // 検索フィルター適用
    const filteredGroups = sortedGroups.filter(group => {
        // 学校名フィルター
        if (searchSchoolName.trim()) {
            const lower = searchSchoolName.toLowerCase()
            if (!group.schoolName.toLowerCase().includes(lower) &&
                !group.alias.toLowerCase().includes(lower)) {
                return false
            }
        }

        // セッションフィルター
        const matchingSessions = group.sessions.filter(session => {
            if (searchYear.trim() && !session.year.toString().includes(searchYear)) {
                return false
            }
            if (searchSession.trim() && !session.sessionLabel.toLowerCase().includes(searchSession.toLowerCase())) {
                return false
            }
            return true
        })

        return matchingSessions.length > 0
    }).map(group => ({
        ...group,
        sessions: group.sessions.filter(session => {
            if (searchYear.trim() && !session.year.toString().includes(searchYear)) {
                return false
            }
            if (searchSession.trim() && !session.sessionLabel.toLowerCase().includes(searchSession.toLowerCase())) {
                return false
            }
            return true
        })
    }))

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">過去問得点データ編集</h1>
                    {successMessage && (
                        <span className="text-sm text-green-600 font-medium">
                            {successMessage}
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNewSchoolModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        新しい学校を追加
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        CSV出力
                    </button>
                </div>
            </div>

            {/* 検索ボックス */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="text"
                        placeholder="学校名で検索..."
                        value={searchSchoolName}
                        onChange={(e) => setSearchSchoolName(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="年度で検索..."
                        value={searchYear}
                        onChange={(e) => setSearchYear(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="回で検索..."
                        value={searchSession}
                        onChange={(e) => setSearchSession(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {(searchSchoolName || searchYear || searchSession) && (
                    <p className="text-sm text-slate-500 mt-2">
                        {filteredGroups.length}校 ({filteredGroups.reduce((sum, g) => sum + g.sessions.length, 0)}件) が見つかりました
                    </p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* 学校グループリスト */}
            <div className="space-y-4">
                {filteredGroups.map(group => {
                    const isExpanded = expandedSchools.has(group.schoolId)

                    return (
                        <div
                            key={group.schoolId}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            {/* 学校ヘッダー */}
                            <button
                                onClick={() => toggleSchool(group.schoolId)}
                                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-800">
                                            {group.schoolName}
                                        </h2>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            {group.sessions.length}件
                                        </span>
                                    </div>
                                    {group.alias && (
                                        <p className="text-sm text-slate-500 mt-1">別名: {group.alias}</p>
                                    )}
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>

                            {/* セッションリスト */}
                            {isExpanded && (
                                <div className="border-t border-slate-200">
                                    {/* 新しい試験回を追加ボタン */}
                                    <div className="p-4 border-b border-slate-100">
                                        {addingSessionForSchool === group.schoolId ? (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-slate-500 mb-1">年度 *</label>
                                                        <input
                                                            type="number"
                                                            placeholder="2025"
                                                            value={newSessionData.year || ''}
                                                            onChange={(e) => setNewSessionData(prev => ({ ...prev, year: parseInt(e.target.value) || undefined }))}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-500 mb-1">回 *</label>
                                                        <input
                                                            type="text"
                                                            placeholder="第1回"
                                                            value={newSessionData.sessionLabel || ''}
                                                            onChange={(e) => setNewSessionData(prev => ({ ...prev, sessionLabel: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAddSession(group.schoolId)}
                                                        disabled={savingCell === 'new-session'}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {savingCell === 'new-session' ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Plus className="w-4 h-4" />
                                                        )}
                                                        追加
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setAddingSessionForSchool(null)
                                                            setNewSessionData({})
                                                        }}
                                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                                    >
                                                        キャンセル
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingSessionForSchool(group.schoolId)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                新しい試験回を追加
                                            </button>
                                        )}
                                    </div>
                                    {group.sessions.map(session => {
                                        const isSessionExpanded = expandedSessions.has(session.sessionId)

                                        return (
                                            <div
                                                key={session.sessionId}
                                                className="border-b border-slate-100 last:border-b-0"
                                            >
                                                <div className="p-4 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-slate-800">
                                                                        {session.year}年度
                                                                    </span>
                                                                    <span className="text-slate-600">
                                                                        {session.sessionLabel}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => toggleSession(session.sessionId)}
                                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                            >
                                                                {isSessionExpanded ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSession(session.sessionId, session.schoolName)}
                                                                disabled={savingCell === session.sessionId}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 詳細編集フォーム */}
                                                    {isSessionExpanded && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                            {SUBJECT_FIELDS.map(field => {
                                                                const value = session[field.key as keyof FlattenedRow]
                                                                const cellKey = `${session.sessionId}-${field.key}`
                                                                const isSaving = savingCell === cellKey

                                                                return (
                                                                    <div key={field.key}>
                                                                        <label className="block text-xs text-slate-500 mb-1">
                                                                            {field.label}
                                                                        </label>
                                                                        <div className="relative">
                                                                            <input
                                                                                type="text"
                                                                                defaultValue={value ?? ''}
                                                                                onBlur={(e) => handleCellEdit(session.sessionId, field.key, e.target.value)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        e.currentTarget.blur()
                                                                                    }
                                                                                }}
                                                                                className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                            />
                                                                            {isSaving && (
                                                                                <Loader2 className="w-3 h-3 animate-spin text-blue-600 absolute right-2 top-1/2 -translate-y-1/2" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {filteredGroups.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">データが見つかりませんでした</p>
                </div>
            )}

            {/* 新しい学校追加モーダル */}
            {showNewSchoolModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">新しい学校を追加</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-600 mb-2">学校名 *</label>
                                <input
                                    type="text"
                                    placeholder="開成中学校"
                                    value={newSchoolName}
                                    onChange={(e) => setNewSchoolName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddNewSchool()
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddNewSchool}
                                    disabled={savingCell === 'new-school'}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {savingCell === 'new-school' ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    追加
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewSchoolModal(false)
                                        setNewSchoolName('')
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import AddDataModal from '@/components/AddDataModal'

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

const COLUMNS = [
    { key: 'schoolName', label: '学校名', editable: false },
    { key: 'alias', label: '別名', editable: false },
    { key: 'year', label: '年度', editable: false },
    { key: 'sessionLabel', label: '回', editable: false },
    { key: '算数配点', label: '算数配点', editable: true },
    { key: '国語配点', label: '国語配点', editable: true },
    { key: '理科配点', label: '理科配点', editable: true },
    { key: '社会配点', label: '社会配点', editable: true },
    { key: '英語配点', label: '英語配点', editable: true },
    { key: '合格最低点', label: '合格最低点', editable: true },
    { key: '合格者平均', label: '合格者平均', editable: true },
    { key: '受験者平均', label: '受験者平均', editable: true },
    { key: '算数合平均', label: '算数合平均', editable: true },
    { key: '算数受平均', label: '算数受平均', editable: true },
    { key: '国語合平均', label: '国語合平均', editable: true },
    { key: '国語受平均', label: '国語受平均', editable: true },
    { key: '理科合平均', label: '理科合平均', editable: true },
    { key: '理科受平均', label: '理科受平均', editable: true },
    { key: '社会合平均', label: '社会合平均', editable: true },
    { key: '社会受平均', label: '社会受平均', editable: true },
    { key: '英語合平均', label: '英語合平均', editable: true },
    { key: '英語受平均', label: '英語受平均', editable: true },
] as const

export default function EditPage() {
    const [data, setData] = useState<FlattenedRow[]>([])
    const [filteredData, setFilteredData] = useState<FlattenedRow[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingCell, setSavingCell] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [showAddDataModal, setShowAddDataModal] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        setError(null)

        try {
            // 1. 全試験回を取得（ソートなし、後でクライアントサイドでソート）
            const { data: sessions, error: sessionsError } = await supabase
                .from('exam_sessions')
                .select(`
                    id,
                    year,
                    session_label,
                    schools(id, name),
                    required_subjects(subject, max_score),
                    official_data(subject, passing_min, passer_avg, applicant_avg)
                `)

            if (sessionsError) throw sessionsError

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
            const flattened: FlattenedRow[] = (sessions || []).map(session => {
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
                subjects.forEach(s => {
                    const key = `${s.subject}配点` as keyof FlattenedRow
                    row[key] = s.max_score as unknown as number
                })

                // 総合データ
                const overall = officialData.find(d => d.subject === '総合')
                if (overall) {
                    row['合格最低点'] = overall.passing_min as unknown as number
                    row['合格者平均'] = overall.passer_avg as unknown as number
                    row['受験者平均'] = overall.applicant_avg as unknown as number
                }

                // 科目別平均データ
                const subjectNames = ['算数', '国語', '理科', '社会', '英語']
                subjectNames.forEach(subj => {
                    const subjData = officialData.find(d => d.subject === subj)
                    if (subjData) {
                        const passKey = `${subj}合平均` as keyof FlattenedRow
                        const appKey = `${subj}受平均` as keyof FlattenedRow
                        row[passKey] = subjData.passer_avg as unknown as number
                        row[appKey] = subjData.applicant_avg as unknown as number
                    }
                })

                return row
            })

            // ソート: 学校名 → 年度 → 回
            const sorted = flattened.sort((a, b) => {
                // 1. 学校名で比較
                const schoolCompare = a.schoolName.localeCompare(b.schoolName, 'ja')
                if (schoolCompare !== 0) return schoolCompare

                // 2. 年度で比較
                const yearCompare = a.year - b.year
                if (yearCompare !== 0) return yearCompare

                // 3. 回で比較
                return a.sessionLabel.localeCompare(b.sessionLabel, 'ja')
            })

            setData(sorted)
            setFilteredData(sorted)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    function applySearch(query: string, dataToFilter: FlattenedRow[] = data) {
        if (!query.trim()) {
            setFilteredData(dataToFilter)
            return
        }

        const lowerQuery = query.toLowerCase()
        const filtered = dataToFilter.filter(row => {
            return (
                row.schoolName.toLowerCase().includes(lowerQuery) ||
                row.alias.toLowerCase().includes(lowerQuery) ||
                row.year.toString().includes(lowerQuery) ||
                row.sessionLabel.toLowerCase().includes(lowerQuery)
            )
        })
        setFilteredData(filtered)
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value
        setSearchQuery(query)
        applySearch(query)
    }

    async function handleCellEdit(sessionId: string, columnKey: string, newValue: string) {
        const row = data.find(r => r.sessionId === sessionId)
        if (!row) return

        const cellKey = `${sessionId}-${columnKey}`
        setSavingCell(cellKey)

        try {
            const numValue = newValue === '' ? null : parseFloat(newValue)

            // 配点の更新
            if (columnKey.endsWith('配点')) {
                const subject = columnKey.replace('配点', '')

                // 既存の科目を削除して再作成
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
            else if (['合格最低点', '合格者平均', '受験者平均'].includes(columnKey)) {
                const fieldMap = {
                    '合格最低点': 'passing_min',
                    '合格者平均': 'passer_avg',
                    '受験者平均': 'applicant_avg',
                } as const

                const dbField = fieldMap[columnKey as keyof typeof fieldMap]

                // 総合データのレコードを探す
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
                const subjects = ['算数', '国語', '理科', '社会', '英語']
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
                updatedData[actualRowIndex] = {
                    ...updatedData[actualRowIndex],
                    [columnKey]: numValue === null ? undefined : numValue,
                }
                setData(updatedData)
                // 検索フィルターを再適用
                applySearch(searchQuery, updatedData)
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : '更新に失敗しました')
        } finally {
            setSavingCell(null)
        }
    }

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
                </div>
                <button
                    onClick={() => setShowAddDataModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    試験データ追加
                </button>
            </div>

            {/* 検索ボックス */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <input
                    type="text"
                    placeholder="学校名、別名、年度、回で検索..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                    <p className="text-sm text-slate-500 mt-2">
                        {filteredData.length}件の結果が見つかりました
                    </p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                {COLUMNS.map(col => (
                                    <th
                                        key={col.key}
                                        className="px-3 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap border-b border-slate-200"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredData.map((row, rowIndex) => (
                                <tr key={row.sessionId} className="hover:bg-slate-50">
                                    {COLUMNS.map(col => {
                                        const value = row[col.key as keyof FlattenedRow]
                                        const cellKey = `${row.sessionId}-${col.key}`
                                        const isSaving = savingCell === cellKey

                                        return (
                                            <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                                                {col.editable ? (
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            defaultValue={value ?? ''}
                                                            onBlur={(e) => handleCellEdit(row.sessionId, col.key, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.currentTarget.blur()
                                                                }
                                                            }}
                                                            className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        {isSaving && (
                                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600 absolute right-2 top-1/2 -translate-y-1/2" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-800">{value ?? '-'}</span>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        {searchQuery ? '検索結果が見つかりませんでした' : 'データがありません'}
                    </div>
                )}
            </div>

            {/* モーダル */}
            <AddDataModal
                isOpen={showAddDataModal}
                onClose={() => setShowAddDataModal(false)}
                onSuccess={() => fetchData()}
            />
        </div>
    )
}

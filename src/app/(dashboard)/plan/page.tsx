'use client'

import { Fragment, useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection } from '@/types/database'
import {
    Search, Plus, X, GitBranch, CheckCircle, XCircle
} from 'lucide-react'

// ============================================================
// ユーティリティ
// ============================================================

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

function formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    const m = d.getMonth() + 1
    const day = d.getDate()
    const dow = DAY_NAMES[d.getDay()]
    return `${m}/${day}(${dow})`
}

// ============================================================
// 型定義
// ============================================================

interface FlowRow {
    id: string
    label: string
    branchSourceId: string | null
    depth: number
}

type SearchModalState = {
    mode: 'global' | 'date' | 'branch'
    dateFilter?: string
    sourceId?: string
    conditionType?: 'pass' | 'fail'
}

// ============================================================
// メインページ
// ============================================================

export default function PlanPage() {
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [searchModal, setSearchModal] = useState<SearchModalState | null>(null)
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        const [sessionsRes, selectionsRes] = await Promise.all([
            supabase
                .from('exam_sessions')
                .select('*, school:schools(*)')
                .not('test_date', 'is', null)
                .order('test_date'),
            supabase
                .from('user_exam_selections')
                .select('*, exam_session:exam_sessions(*, school:schools(*))')
                .order('created_at'),
        ])
        if (sessionsRes.data) setExamSessions(sessionsRes.data)
        if (selectionsRes.data) setMySelections(selectionsRes.data)
        setLoading(false)
    }, [supabase])

    useEffect(() => { fetchData() }, [fetchData])

    // ===== 再帰削除 =====
    const deleteRecursive = useCallback(async (selectionId: string, selections: UserExamSelection[]) => {
        const children = selections.filter(s => s.condition_source_id === selectionId)
        for (const child of children) {
            await deleteRecursive(child.id, selections)
        }
        await supabase.from('user_exam_selections').delete().eq('id', selectionId)
    }, [supabase])

    // ===== CRUD =====
    const addSchool = async (examSessionId: string) => {
        if (mySelections.find(s => s.exam_session_id === examSessionId)) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('user_exam_selections').insert({
            user_id: user.id,
            exam_session_id: examSessionId,
        })
        fetchData()
        setSearchModal(null)
    }

    const addToBranch = async (examSessionId: string, sourceId: string, conditionType: 'pass' | 'fail') => {
        const existing = mySelections.find(s => s.exam_session_id === examSessionId)
        if (existing) {
            await supabase.from('user_exam_selections')
                .update({ condition_source_id: sourceId, condition_type: conditionType })
                .eq('id', existing.id)
        } else {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            await supabase.from('user_exam_selections').insert({
                user_id: user.id,
                exam_session_id: examSessionId,
                condition_source_id: sourceId,
                condition_type: conditionType,
            })
        }
        fetchData()
        setSearchModal(null)
    }

    const handleRemove = async (selectionId: string) => {
        await deleteRecursive(selectionId, mySelections)
        fetchData()
    }

    const toggleBranching = async (selectionId: string, currentAction: string) => {
        const newAction = currentAction === 'end' ? 'continue' : 'end'
        if (newAction === 'continue') {
            const children = mySelections.filter(s => s.condition_source_id === selectionId)
            for (const child of children) {
                await deleteRecursive(child.id, mySelections)
            }
        }
        await supabase.from('user_exam_selections')
            .update({ on_pass_action: newAction })
            .eq('id', selectionId)
        fetchData()
    }

    // ===== 年度判定 =====
    const examYear = useMemo(() => {
        for (const sel of mySelections) {
            if (sel.exam_session?.year) return sel.exam_session.year
        }
        for (const s of examSessions) {
            if (s.year) return s.year
        }
        const now = new Date()
        return now.getMonth() <= 2 ? now.getFullYear() : now.getFullYear() + 1
    }, [mySelections, examSessions])

    // ===== 日付列生成 =====
    const dateColumns = useMemo(() => {
        const dates = new Set<string>()

        // 1月: exam_sessionsに存在する日付のみ
        for (const s of examSessions) {
            if (s.test_date) {
                const d = new Date(s.test_date + 'T00:00:00')
                if (d.getMonth() === 0) dates.add(s.test_date)
            }
        }

        // 2月1-5日は固定
        for (let day = 1; day <= 5; day++) {
            dates.add(`${examYear}-02-0${day}`)
        }

        // 2/6以降: exam_sessionsまたは選択に存在すれば追加
        for (const s of examSessions) {
            if (s.test_date && s.test_date > `${examYear}-02-05`) {
                dates.add(s.test_date)
            }
        }
        for (const sel of mySelections) {
            const d = sel.exam_session?.test_date
            if (d) dates.add(d)
        }

        return Array.from(dates).sort().map(d => ({
            key: d,
            label: formatDateLabel(d),
        }))
    }, [examSessions, mySelections, examYear])

    // ===== フロー行構築 =====
    const flowRows = useMemo(() => {
        const rows: FlowRow[] = [{ id: 'main', label: '', branchSourceId: null, depth: 0 }]

        function addBranchRows(parentSelections: UserExamSelection[], depth: number) {
            for (const sel of parentSelections) {
                if (sel.on_pass_action === 'end') {
                    const schoolName = sel.exam_session?.school?.name || '?'
                    const rowId = `fail-${sel.id}`
                    if (rows.find(r => r.id === rowId)) continue

                    rows.push({
                        id: rowId,
                        label: `${schoolName}×`,
                        branchSourceId: sel.id,
                        depth: depth + 1,
                    })

                    const failChildren = mySelections.filter(
                        s => s.condition_source_id === sel.id && s.condition_type === 'fail'
                    )
                    if (failChildren.length > 0) {
                        addBranchRows(failChildren, depth + 1)
                    }
                }
            }
        }

        const roots = mySelections.filter(s => !s.condition_source_id)
        addBranchRows(roots, 0)

        return rows
    }, [mySelections])

    // ===== 行×日付 → セルデータ =====
    const gridData = useMemo(() => {
        const data = new Map<string, Map<string, UserExamSelection[]>>()
        for (const row of flowRows) {
            data.set(row.id, new Map())
        }

        for (const sel of mySelections) {
            const date = sel.exam_session?.test_date
            if (!date) continue

            let rowId = 'main'
            if (sel.condition_source_id && sel.condition_type === 'fail') {
                const targetRow = `fail-${sel.condition_source_id}`
                if (data.has(targetRow)) rowId = targetRow
            }

            const rowData = data.get(rowId)!
            if (!rowData.has(date)) rowData.set(date, [])
            rowData.get(date)!.push(sel)
        }

        // AM→PM順にソート
        for (const [, rowData] of data) {
            for (const [, sels] of rowData) {
                sels.sort((a, b) => {
                    const pA = a.exam_session?.time_period === '午後' ? 1 : 0
                    const pB = b.exam_session?.time_period === '午後' ? 1 : 0
                    return pA - pB
                })
            }
        }

        return data
    }, [mySelections, flowRows])

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">受験スケジュール</h1>

            {/* グローバル検索ボタン */}
            <button
                onClick={() => setSearchModal({ mode: 'global' })}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-teal-300 rounded-xl text-teal-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-colors"
            >
                <Search className="w-5 h-5" />
                <span className="text-sm">学校を検索して追加...</span>
            </button>

            {/* フローチャートグリッド */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-300">
                <div
                    className="min-w-fit"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `100px repeat(${dateColumns.length}, minmax(160px, 1fr))`,
                    }}
                >
                    {/* ===== ヘッダー行 ===== */}
                    <div className="bg-gray-100 border-b-2 border-r border-gray-300 px-2 py-3 sticky left-0 z-10" />
                    {dateColumns.map(col => {
                        const d = new Date(col.key + 'T00:00:00')
                        const isJanuary = d.getMonth() === 0
                        return (
                            <div
                                key={`h-${col.key}`}
                                className={`border-b-2 border-r border-gray-300 px-2 py-3 text-center text-sm font-bold ${
                                    isJanuary ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                                }`}
                            >
                                {col.label}
                            </div>
                        )
                    })}

                    {/* ===== フロー行 ===== */}
                    {flowRows.map(row => {
                        const isMain = row.id === 'main'

                        return (
                            <Fragment key={row.id}>
                                {/* 行ラベル */}
                                <div className={`border-b border-r border-gray-300 px-2 py-2 sticky left-0 z-10 flex items-start ${
                                    isMain ? 'bg-white' : 'bg-red-50/50'
                                }`}>
                                    {row.label ? (
                                        <span className="text-[11px] font-bold text-red-500 leading-tight flex items-center gap-0.5 mt-1">
                                            <XCircle className="w-3 h-3 flex-shrink-0" />
                                            {row.label}
                                        </span>
                                    ) : (
                                        <span className="text-[11px] text-gray-400 mt-1">メイン</span>
                                    )}
                                </div>

                                {/* 日付セル */}
                                {dateColumns.map(col => {
                                    const cellSels = gridData.get(row.id)?.get(col.key) || []

                                    // 分岐行では、元の学校の日付以前はセルを無効化
                                    let showAdd = true
                                    if (!isMain && row.branchSourceId) {
                                        const srcSel = mySelections.find(s => s.id === row.branchSourceId)
                                        const srcDate = srcSel?.exam_session?.test_date
                                        if (srcDate && col.key <= srcDate) showAdd = false
                                    }

                                    return (
                                        <div
                                            key={`${row.id}-${col.key}`}
                                            className={`border-b border-r border-gray-200 p-1.5 min-h-[80px] ${
                                                isMain ? 'bg-white' : 'bg-red-50/20'
                                            } ${!showAdd && cellSels.length === 0 ? 'bg-gray-50/50' : ''}`}
                                        >
                                            {cellSels.map(sel => (
                                                <SchoolCard
                                                    key={sel.id}
                                                    selection={sel}
                                                    allSelections={mySelections}
                                                    onToggleBranch={toggleBranching}
                                                    onAddToBranch={(sourceId, ct) =>
                                                        setSearchModal({ mode: 'branch', sourceId, conditionType: ct })
                                                    }
                                                    onRemove={handleRemove}
                                                />
                                            ))}

                                            {showAdd && (
                                                <button
                                                    onClick={() => {
                                                        if (isMain) {
                                                            setSearchModal({ mode: 'date', dateFilter: col.key })
                                                        } else {
                                                            setSearchModal({
                                                                mode: 'branch',
                                                                sourceId: row.branchSourceId!,
                                                                conditionType: 'fail',
                                                                dateFilter: col.key,
                                                            })
                                                        }
                                                    }}
                                                    className="w-full py-1.5 border border-dashed border-gray-300 rounded text-gray-400 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50/30 transition-colors flex items-center justify-center"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </Fragment>
                        )
                    })}
                </div>
            </div>

            {/* 検索モーダル */}
            {searchModal && (
                <SearchModal
                    state={searchModal}
                    examSessions={examSessions}
                    mySelections={mySelections}
                    onSelect={(examSessionId) => {
                        if (searchModal.mode === 'branch' && searchModal.sourceId) {
                            addToBranch(examSessionId, searchModal.sourceId, searchModal.conditionType || 'fail')
                        } else {
                            addSchool(examSessionId)
                        }
                    }}
                    onClose={() => setSearchModal(null)}
                />
            )}
        </div>
    )
}

// ============================================================
// 学校カード
// ============================================================

function SchoolCard({
    selection,
    allSelections,
    onToggleBranch,
    onAddToBranch,
    onRemove,
}: {
    selection: UserExamSelection
    allSelections: UserExamSelection[]
    onToggleBranch: (selectionId: string, currentAction: string) => void
    onAddToBranch: (sourceId: string, conditionType: 'pass' | 'fail') => void
    onRemove: (selectionId: string) => void
}) {
    const session = selection.exam_session!
    const hasBranching = selection.on_pass_action === 'end'
    const hasFailChildren = allSelections.some(
        s => s.condition_source_id === selection.id && s.condition_type === 'fail'
    )

    return (
        <div className={`rounded-lg p-2 mb-1.5 text-xs ${
            hasBranching
                ? 'bg-amber-50 border border-amber-300 shadow-sm'
                : 'bg-gray-50 border border-gray-200'
        }`}>
            <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-800 truncate leading-tight">
                        {session.school?.name}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 flex-wrap">
                        <span className={`font-semibold ${
                            session.time_period === '午後' ? 'text-indigo-500' : 'text-amber-600'
                        }`}>
                            {session.time_period || '午前'}
                        </span>
                        <span>{session.session_label}</span>
                        {session.yotsuya_80 != null && (
                            <span className="text-teal-600 font-medium">Y{session.yotsuya_80}</span>
                        )}
                        {session.exam_subjects_label && <span>{session.exam_subjects_label}</span>}
                        {session.gender_type && (
                            <span className={
                                session.gender_type === '男子校' ? 'text-blue-500' :
                                session.gender_type === '女子校' ? 'text-pink-500' : 'text-purple-500'
                            }>
                                {session.gender_type === '共学' ? '共' : session.gender_type[0]}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                        onClick={() => onToggleBranch(selection.id, selection.on_pass_action)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            hasBranching
                                ? 'bg-amber-400 text-white hover:bg-amber-500'
                                : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'
                        }`}
                        title={hasBranching ? '分岐を解除' : '合否で分岐'}
                    >
                        <GitBranch className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onRemove(selection.id)}
                        className="w-6 h-6 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="削除"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {hasBranching && (
                <div className="mt-1.5 pt-1.5 border-t border-amber-200 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-green-600">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium">○ 合格 → 受験終了</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-red-500">
                        <XCircle className="w-3 h-3 flex-shrink-0" />
                        {hasFailChildren ? (
                            <span className="font-medium">× 不合格 → 下の行を参照</span>
                        ) : (
                            <button
                                onClick={() => onAddToBranch(selection.id, 'fail')}
                                className="font-medium underline decoration-dashed hover:text-red-700 transition-colors"
                            >
                                × 不合格の場合を追加
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 検索モーダル
// ============================================================

function SearchModal({
    state,
    examSessions,
    mySelections,
    onSelect,
    onClose,
}: {
    state: SearchModalState
    examSessions: ExamSession[]
    mySelections: UserExamSelection[]
    onSelect: (examSessionId: string) => void
    onClose: () => void
}) {
    const [searchQuery, setSearchQuery] = useState('')

    const selectedIds = new Set(mySelections.map(s => s.exam_session_id))
    const alreadyOnBranch = state.sourceId ? new Set(
        mySelections
            .filter(s => s.condition_source_id === state.sourceId && s.condition_type === state.conditionType)
            .map(s => s.exam_session_id)
    ) : new Set<string>()

    const sourceSelection = state.sourceId
        ? mySelections.find(s => s.id === state.sourceId)
        : null

    const filtered = useMemo(() => {
        let sessions = examSessions

        // 日付フィルタ
        if (state.dateFilter) {
            sessions = sessions.filter(s => s.test_date === state.dateFilter)
        }

        // 分岐モードで日付指定なし → ソース日付以降のみ
        if (state.mode === 'branch' && sourceSelection && !state.dateFilter) {
            const srcDate = sourceSelection.exam_session?.test_date
            if (srcDate) {
                sessions = sessions.filter(s => s.test_date && s.test_date > srcDate)
            }
        }

        // テキスト検索
        const q = searchQuery.toLowerCase()
        if (q) {
            sessions = sessions.filter(s => {
                const name = s.school?.name || ''
                const label = s.session_label || ''
                return name.toLowerCase().includes(q) || label.toLowerCase().includes(q)
            })
        }

        // このパスに既に追加済みのものを除外
        sessions = sessions.filter(s => !alreadyOnBranch.has(s.id))

        // 通常モード: 選択済みを除外
        if (state.mode !== 'branch') {
            sessions = sessions.filter(s => !selectedIds.has(s.id))
        }

        // ソース自身を除外
        if (sourceSelection) {
            sessions = sessions.filter(s => s.id !== sourceSelection.exam_session_id)
        }

        return sessions
    }, [examSessions, state, searchQuery, alreadyOnBranch, selectedIds, sourceSelection])

    // 日付別グループ
    const grouped = useMemo(() => {
        const groups: { key: string; label: string; sessions: ExamSession[] }[] = []
        const map = new Map<string, ExamSession[]>()
        for (const s of filtered) {
            const key = s.test_date!
            if (!map.has(key)) {
                map.set(key, [])
                groups.push({ key, label: formatDateLabel(key), sessions: map.get(key)! })
            }
            map.get(key)!.push(s)
        }
        return groups
    }, [filtered])

    // ヘッダー
    let headerTitle: string
    if (state.mode === 'branch' && sourceSelection) {
        const condLabel = state.conditionType === 'pass' ? '合格' : '不合格'
        headerTitle = `${sourceSelection.exam_session?.school?.name} ${condLabel}の場合`
        if (state.dateFilter) {
            headerTitle += ` (${formatDateLabel(state.dateFilter)})`
        }
    } else if (state.dateFilter) {
        headerTitle = `${formatDateLabel(state.dateFilter)} に追加`
    } else {
        headerTitle = '学校を追加'
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {state.mode === 'branch' && (
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="text-base font-bold text-gray-800">{headerTitle}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="学校名で検索..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 text-sm">
                            {searchQuery ? '該当する学校がありません' : 'この日程の試験データがありません'}
                        </p>
                    ) : (
                        grouped.map(group => (
                            <div key={group.key}>
                                <div className="px-4 py-1.5 bg-gray-50 text-xs font-bold text-gray-500 sticky top-0 border-b border-gray-100">
                                    {group.label}
                                </div>
                                {group.sessions.map(session => {
                                    const isAlreadySelected = selectedIds.has(session.id)
                                    return (
                                        <button
                                            key={session.id}
                                            onClick={() => onSelect(session.id)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3 border-b border-gray-50"
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                                                session.time_period === '午後'
                                                    ? 'bg-indigo-100 text-indigo-600'
                                                    : 'bg-amber-100 text-amber-600'
                                            }`}>
                                                {session.time_period === '午後' ? '午後' : '午前'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-gray-700 text-sm truncate">
                                                        {session.school?.name}
                                                    </span>
                                                    {isAlreadySelected && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full flex-shrink-0">
                                                            選択済
                                                        </span>
                                                    )}
                                                    {session.gender_type && (
                                                        <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                                                            session.gender_type === '男子校'
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : session.gender_type === '女子校'
                                                                ? 'bg-pink-100 text-pink-600'
                                                                : 'bg-purple-100 text-purple-600'
                                                        }`}>
                                                            {session.gender_type === '共学' ? '共' : session.gender_type[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    <span>{session.session_label}</span>
                                                    {session.exam_subjects_label && (
                                                        <span>{session.exam_subjects_label}</span>
                                                    )}
                                                    {session.yotsuya_80 != null && (
                                                        <span className="text-teal-600">Y{session.yotsuya_80}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Plus className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                        </button>
                                    )
                                })}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

// ============================================================
// ローディング
// ============================================================

function Loading() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" />
        </div>
    )
}

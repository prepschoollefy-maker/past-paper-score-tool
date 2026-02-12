'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection } from '@/types/database'
import {
    Search, Plus, Check, CalendarDays, ListChecks,
    CheckCircle, XCircle, ChevronDown, ChevronRight, X, MapPin, Clock, GitBranch
} from 'lucide-react'

type Tab = 'selections' | 'schedule'

export default function PlanPage() {
    const [activeTab, setActiveTab] = useState<Tab>('schedule')

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">受験計画</h1>

            {/* タブ切り替え */}
            <div className="flex bg-white rounded-xl shadow-md border border-teal-200 p-1">
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === 'schedule'
                            ? 'bg-teal-400 text-white shadow-sm'
                            : 'text-teal-600 hover:bg-teal-50'
                    }`}
                >
                    <CalendarDays className="w-4 h-4" />
                    スケジュール
                </button>
                <button
                    onClick={() => setActiveTab('selections')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === 'selections'
                            ? 'bg-teal-400 text-white shadow-sm'
                            : 'text-teal-600 hover:bg-teal-50'
                    }`}
                >
                    <ListChecks className="w-4 h-4" />
                    受験校リスト
                </button>
            </div>

            {activeTab === 'selections' ? <SelectionsTab /> : <ScheduleTab />}
        </div>
    )
}

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

function getDateGroup(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    const m = d.getMonth() + 1
    const day = d.getDate()
    if (m === 1) return '1月入試'
    return `${m}/${day}`
}

function formatDateTime(d?: string | null): string | null {
    if (!d) return null
    const date = new Date(d)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// ============================================================
// 受験校リストタブ
// ============================================================

function SelectionsTab() {
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [expandedDetail, setExpandedDetail] = useState<string | null>(null)
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

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

    const selectedIds = new Set(mySelections.map(s => s.exam_session_id))

    const handleAdd = async (examSessionId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { error } = await supabase.from('user_exam_selections').insert({
            user_id: user.id,
            exam_session_id: examSessionId,
        })
        if (!error) fetchData()
    }

    const handleRemove = async (selectionId: string) => {
        const { error } = await supabase.from('user_exam_selections').delete().eq('id', selectionId)
        if (!error) setMySelections(prev => prev.filter(s => s.id !== selectionId))
    }

    // 検索フィルタ
    const filteredSessions = useMemo(() => {
        const q = searchQuery.toLowerCase()
        return examSessions.filter(s => {
            const name = s.school?.name || ''
            const label = s.session_label || ''
            return name.toLowerCase().includes(q) || label.toLowerCase().includes(q)
        })
    }, [examSessions, searchQuery])

    // 日程でグルーピング
    const groupedSessions = useMemo(() => {
        const groups: { key: string; sessions: ExamSession[] }[] = []
        const map = new Map<string, ExamSession[]>()
        for (const s of filteredSessions) {
            const key = getDateGroup(s.test_date!)
            if (!map.has(key)) {
                map.set(key, [])
                groups.push({ key, sessions: map.get(key)! })
            }
            map.get(key)!.push(s)
        }
        return groups
    }, [filteredSessions])

    const toggleGroup = (key: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            {/* 選択済みチップ */}
            {mySelections.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-4">
                    <div className="text-xs font-semibold text-teal-400 mb-2">
                        選択済み（{mySelections.length}校）
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {mySelections.map(sel => (
                            <button
                                key={sel.id}
                                onClick={() => handleRemove(sel.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm text-teal-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors group"
                            >
                                <span className="truncate max-w-[150px]">
                                    {sel.exam_session?.school?.name} {sel.exam_session?.session_label}
                                </span>
                                <X className="w-3.5 h-3.5 flex-shrink-0 text-teal-300 group-hover:text-red-400" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 検索 */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="学校名で検索..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-teal-200 rounded-xl shadow-sm text-teal-700 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
            </div>

            {/* 日程グループ */}
            {groupedSessions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-8 text-center text-teal-300">
                    {searchQuery ? '該当する学校がありません' : 'スケジュールデータのある学校がありません'}
                </div>
            ) : (
                groupedSessions.map(group => {
                    const isCollapsed = collapsedGroups.has(group.key)
                    const selectedCount = group.sessions.filter(s => selectedIds.has(s.id)).length

                    return (
                        <div key={group.key} className="bg-white rounded-xl shadow-md border border-teal-200 overflow-hidden">
                            <button
                                onClick={() => toggleGroup(group.key)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-teal-50 hover:bg-teal-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {isCollapsed
                                        ? <ChevronRight className="w-4 h-4 text-teal-400" />
                                        : <ChevronDown className="w-4 h-4 text-teal-400" />
                                    }
                                    <span className="font-bold text-teal-700">{group.key}</span>
                                    <span className="text-xs text-teal-400">{group.sessions.length}件</span>
                                </div>
                                {selectedCount > 0 && (
                                    <span className="text-xs px-2 py-0.5 bg-teal-400 text-white rounded-full">
                                        {selectedCount}選択
                                    </span>
                                )}
                            </button>

                            {!isCollapsed && (
                                <div className="divide-y divide-teal-100">
                                    {group.sessions.map(session => (
                                        <SessionRow
                                            key={session.id}
                                            session={session}
                                            isSelected={selectedIds.has(session.id)}
                                            isExpanded={expandedDetail === session.id}
                                            onToggle={() => {
                                                if (selectedIds.has(session.id)) {
                                                    const sel = mySelections.find(s => s.exam_session_id === session.id)
                                                    if (sel) handleRemove(sel.id)
                                                } else {
                                                    handleAdd(session.id)
                                                }
                                            }}
                                            onToggleDetail={() => setExpandedDetail(prev => prev === session.id ? null : session.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })
            )}
        </div>
    )
}

// ============================================================
// セッション行
// ============================================================

function SessionRow({
    session, isSelected, isExpanded, onToggle, onToggleDetail,
}: {
    session: ExamSession; isSelected: boolean; isExpanded: boolean
    onToggle: () => void; onToggleDetail: () => void
}) {
    return (
        <div>
            <div className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50/50 transition-colors">
                <button
                    onClick={onToggle}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-teal-400 text-white' : 'bg-teal-50 text-teal-300 hover:bg-teal-100 hover:text-teal-500'
                    }`}
                >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                <button onClick={onToggleDetail} className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-teal-700 truncate text-sm">{session.school?.name}</span>
                        {session.gender_type && (
                            <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                                session.gender_type === '男子校' ? 'bg-blue-100 text-blue-600' :
                                session.gender_type === '女子校' ? 'bg-pink-100 text-pink-600' :
                                'bg-purple-100 text-purple-600'
                            }`}>
                                {session.gender_type === '共学' ? '共' : session.gender_type[0]}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-teal-500 mt-0.5">
                        <span>{session.session_label}</span>
                        <span>{session.time_period}</span>
                        {session.exam_subjects_label && <span>{session.exam_subjects_label}</span>}
                        {session.yotsuya_80 != null && <span className="text-teal-400">Y{session.yotsuya_80}</span>}
                    </div>
                </button>
                <ChevronDown
                    className={`w-4 h-4 text-teal-300 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    onClick={onToggleDetail}
                />
            </div>
            {isExpanded && (
                <div className="px-4 pb-3 ml-10 text-xs text-teal-600 space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-teal-50/70 rounded-lg p-3">
                        {session.assembly_time && <DetailItem icon={<Clock className="w-3 h-3" />} label="集合" value={session.assembly_time.slice(0, 5)} />}
                        {session.estimated_end_time && <DetailItem icon={<Clock className="w-3 h-3" />} label="終了予想" value={session.estimated_end_time.slice(0, 5)} />}
                        {session.nearest_station && <DetailItem icon={<MapPin className="w-3 h-3" />} label="最寄駅" value={session.nearest_station} />}
                        {session.exam_fee != null && <DetailItem label="受験料" value={`¥${session.exam_fee.toLocaleString()}`} />}
                        {session.enrollment_fee != null && <DetailItem label="入学金" value={`¥${session.enrollment_fee.toLocaleString()}`} />}
                        {session.deferral_available && <DetailItem label="延納" value={session.deferral_deadline ? `〜${formatDateTime(session.deferral_deadline)}` : '可'} />}
                        {session.yotsuya_80 != null && <DetailItem label="四谷80%" value={String(session.yotsuya_80)} />}
                        {session.yotsuya_50 != null && <DetailItem label="四谷50%" value={String(session.yotsuya_50)} />}
                        {session.sapix != null && <DetailItem label="SAPIX" value={String(session.sapix)} />}
                        {session.nichinoken_r4 != null && <DetailItem label="日能研R4" value={String(session.nichinoken_r4)} />}
                        {session.result_announcement && <DetailItem label="合格発表" value={formatDateTime(session.result_announcement)!} />}
                        {session.enrollment_deadline && <DetailItem label="手続締切" value={formatDateTime(session.enrollment_deadline)!} />}
                    </div>
                </div>
            )}
        </div>
    )
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-1">
            {icon}
            <span className="text-teal-400">{label}:</span>
            <span className="font-medium text-teal-700">{value}</span>
        </div>
    )
}

// ============================================================
// スケジュールタブ（日程カラム型）
// ============================================================

type AddModalState = {
    dateFilter?: string
    sourceId?: string
    conditionType?: 'pass' | 'fail'
} | null

function ScheduleTab() {
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [addModal, setAddModal] = useState<AddModalState>(null)
    const supabase = createClient()

    const fetchSelections = useCallback(async () => {
        const { data } = await supabase
            .from('user_exam_selections')
            .select('*, exam_session:exam_sessions(*, school:schools(*))')
            .order('created_at')
        if (data) setMySelections(data)
        setLoading(false)
    }, [supabase])

    useEffect(() => { fetchSelections() }, [fetchSelections])

    // 学校を追加（通常）
    const addSchool = async (examSessionId: string) => {
        if (mySelections.find(s => s.exam_session_id === examSessionId)) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('user_exam_selections').insert({
            user_id: user.id,
            exam_session_id: examSessionId,
        })
        fetchSelections()
        setAddModal(null)
    }

    // 分岐パスに学校を追加
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
        fetchSelections()
        setAddModal(null)
    }

    // 学校を削除
    const handleRemove = async (selectionId: string) => {
        await supabase.from('user_exam_selections')
            .update({ condition_source_id: null, condition_type: null })
            .eq('condition_source_id', selectionId)
        await supabase.from('user_exam_selections').delete().eq('id', selectionId)
        fetchSelections()
    }

    // 分岐ON/OFF
    const toggleBranching = async (selectionId: string, currentAction: string) => {
        const newAction = currentAction === 'end' ? 'continue' : 'end'
        if (newAction === 'continue') {
            await supabase.from('user_exam_selections')
                .update({ condition_source_id: null, condition_type: null })
                .eq('condition_source_id', selectionId)
        }
        await supabase.from('user_exam_selections')
            .update({ on_pass_action: newAction })
            .eq('id', selectionId)
        fetchSelections()
    }

    // 条件を解除
    const removeCondition = async (selectionId: string) => {
        await supabase.from('user_exam_selections')
            .update({ condition_source_id: null, condition_type: null })
            .eq('id', selectionId)
        fetchSelections()
    }

    // 年度判定
    const examYear = useMemo(() => {
        for (const sel of mySelections) {
            if (sel.exam_session?.year) return sel.exam_session.year
        }
        const now = new Date()
        return now.getMonth() <= 2 ? now.getFullYear() : now.getFullYear() + 1
    }, [mySelections])

    // 日程カラム生成
    const dateColumns = useMemo(() => {
        const cols: { key: string; label: string }[] = [
            { key: 'january', label: '1月入試' },
        ]
        for (let day = 1; day <= 5; day++) {
            const d = `${examYear}-02-0${day}`
            const dow = DAY_NAMES[new Date(d + 'T00:00:00').getDay()]
            cols.push({ key: d, label: `2/${day}(${dow})` })
        }
        const extraDates = new Set<string>()
        mySelections.forEach(s => {
            const d = s.exam_session?.test_date
            if (d && d > `${examYear}-02-05`) extraDates.add(d)
        })
        Array.from(extraDates).sort().forEach(d => {
            cols.push({ key: d, label: formatDateLabel(d) })
        })
        return cols
    }, [mySelections, examYear])

    // 日付別グループ
    const selectionsByDate = useMemo(() => {
        const map = new Map<string, UserExamSelection[]>()
        for (const sel of mySelections) {
            const d = sel.exam_session?.test_date
            if (!d) continue
            const key = d < `${examYear}-02-01` ? 'january' : d
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(sel)
        }
        for (const [, sels] of map) {
            sels.sort((a, b) => {
                const pA = a.exam_session?.time_period === '午後' ? 1 : 0
                const pB = b.exam_session?.time_period === '午後' ? 1 : 0
                return pA - pB
            })
        }
        return map
    }, [mySelections, examYear])

    if (loading) return <Loading />

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-md border border-teal-200 px-4 py-3">
                <p className="text-xs text-teal-500">
                    各日程の「+」から学校を追加。
                    <GitBranch className="w-3 h-3 inline mx-0.5 text-amber-500" />
                    で合否分岐を設定できます。
                </p>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-fit px-1 py-2">
                    {dateColumns.map(col => {
                        const sels = selectionsByDate.get(col.key) || []
                        const isJanuary = col.key === 'january'
                        const amSels = sels.filter(s => s.exam_session?.time_period !== '午後')
                        const pmSels = sels.filter(s => s.exam_session?.time_period === '午後')

                        return (
                            <div key={col.key} className="w-44 flex-shrink-0 bg-white rounded-xl border-2 border-teal-200 shadow-sm overflow-hidden flex flex-col">
                                <div className={`px-3 py-2 text-center border-b border-teal-200 ${isJanuary ? 'bg-amber-50' : 'bg-teal-50'}`}>
                                    <div className={`font-bold text-sm ${isJanuary ? 'text-amber-700' : 'text-teal-700'}`}>
                                        {col.label}
                                    </div>
                                </div>

                                <div className="p-2 flex-1 flex flex-col">
                                    {isJanuary ? (
                                        sels.map(sel => (
                                            <SchoolCard
                                                key={sel.id}
                                                selection={sel}
                                                allSelections={mySelections}
                                                showDate
                                                onToggleBranch={toggleBranching}
                                                onAddToBranch={(sid, ct) => setAddModal({ sourceId: sid, conditionType: ct })}
                                                onRemoveCondition={removeCondition}
                                                onRemove={handleRemove}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            {amSels.length > 0 && (
                                                <div className="mb-1">
                                                    <div className="text-[10px] text-amber-500 font-bold mb-0.5">午前</div>
                                                    {amSels.map(sel => (
                                                        <SchoolCard
                                                            key={sel.id}
                                                            selection={sel}
                                                            allSelections={mySelections}
                                                            onToggleBranch={toggleBranching}
                                                            onAddToBranch={(sid, ct) => setAddModal({ sourceId: sid, conditionType: ct })}
                                                            onRemoveCondition={removeCondition}
                                                            onRemove={handleRemove}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {pmSels.length > 0 && (
                                                <div className="mb-1">
                                                    <div className="text-[10px] text-indigo-500 font-bold mb-0.5">午後</div>
                                                    {pmSels.map(sel => (
                                                        <SchoolCard
                                                            key={sel.id}
                                                            selection={sel}
                                                            allSelections={mySelections}
                                                            onToggleBranch={toggleBranching}
                                                            onAddToBranch={(sid, ct) => setAddModal({ sourceId: sid, conditionType: ct })}
                                                            onRemoveCondition={removeCondition}
                                                            onRemove={handleRemove}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <button
                                        onClick={() => setAddModal({ dateFilter: col.key })}
                                        className="mt-auto py-2 border-2 border-dashed border-teal-200 rounded-lg text-xs text-teal-400 hover:border-teal-400 hover:text-teal-600 transition-colors"
                                    >
                                        + 学校を追加
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {addModal && (
                <AddSchoolModal
                    dateFilter={addModal.dateFilter}
                    sourceId={addModal.sourceId}
                    conditionType={addModal.conditionType}
                    mySelections={mySelections}
                    onSelect={addModal.sourceId
                        ? (eid) => addToBranch(eid, addModal.sourceId!, addModal.conditionType!)
                        : addSchool
                    }
                    onClose={() => setAddModal(null)}
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
    showDate,
    onToggleBranch,
    onAddToBranch,
    onRemoveCondition,
    onRemove,
}: {
    selection: UserExamSelection
    allSelections: UserExamSelection[]
    showDate?: boolean
    onToggleBranch: (selectionId: string, currentAction: string) => void
    onAddToBranch: (sourceId: string, conditionType: 'pass' | 'fail') => void
    onRemoveCondition: (selectionId: string) => void
    onRemove: (selectionId: string) => void
}) {
    const session = selection.exam_session!
    const hasBranching = selection.on_pass_action === 'end'
        || allSelections.some(s => s.condition_source_id === selection.id)
    const isConditional = !!selection.condition_source_id
    const sourceSelection = isConditional
        ? allSelections.find(s => s.id === selection.condition_source_id)
        : null

    return (
        <div className={`rounded-lg p-2 mb-1.5 ${
            hasBranching ? 'bg-amber-50 border border-amber-200' : 'bg-teal-50/50 border border-teal-100'
        }`}>
            {isConditional && sourceSelection && (
                <div className={`text-[9px] px-1.5 py-0.5 rounded mb-1 inline-block ${
                    selection.condition_type === 'pass'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-500'
                }`}>
                    {sourceSelection.exam_session?.school?.name?.slice(0, 4)}
                    {selection.condition_type === 'pass' ? '○' : '✗'}なら
                </div>
            )}

            <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-teal-800 text-xs truncate">
                        {session.school?.name}
                    </div>
                    <div className="text-[10px] text-teal-500">
                        {showDate && session.test_date && `${formatDateLabel(session.test_date)} `}
                        {session.session_label}
                        {session.exam_subjects_label && ` ${session.exam_subjects_label}`}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-teal-400">
                        {session.yotsuya_80 != null && <span>Y{session.yotsuya_80}</span>}
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

                <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button
                        onClick={() => onToggleBranch(selection.id, hasBranching ? 'end' : 'continue')}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            hasBranching
                                ? 'bg-amber-400 text-white'
                                : 'text-teal-300 hover:text-amber-500'
                        }`}
                        title={hasBranching ? '分岐を解除' : '合否で分岐'}
                    >
                        <GitBranch className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => isConditional ? onRemoveCondition(selection.id) : onRemove(selection.id)}
                        className="w-5 h-5 rounded text-teal-300 hover:text-red-500 flex items-center justify-center transition-colors"
                        title={isConditional ? '条件を解除' : '削除'}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {hasBranching && (
                <div className="mt-1.5 pt-1 border-t border-amber-200 flex gap-1">
                    <button
                        onClick={() => onAddToBranch(selection.id, 'pass')}
                        className="flex-1 py-1 rounded text-[10px] bg-green-50 text-green-500 hover:bg-green-100 flex items-center justify-center gap-0.5 transition-colors"
                    >
                        <CheckCircle className="w-2.5 h-2.5" />合格→
                    </button>
                    <button
                        onClick={() => onAddToBranch(selection.id, 'fail')}
                        className="flex-1 py-1 rounded text-[10px] bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center gap-0.5 transition-colors"
                    >
                        <XCircle className="w-2.5 h-2.5" />不合格→
                    </button>
                </div>
            )}
        </div>
    )
}

// ============================================================
// 学校追加モーダル
// ============================================================

function AddSchoolModal({
    dateFilter,
    sourceId,
    conditionType,
    mySelections,
    onSelect,
    onClose,
}: {
    dateFilter?: string
    sourceId?: string
    conditionType?: 'pass' | 'fail'
    mySelections: UserExamSelection[]
    onSelect: (examSessionId: string) => void
    onClose: () => void
}) {
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchSessions = async () => {
            const { data } = await supabase
                .from('exam_sessions')
                .select('*, school:schools(*)')
                .not('test_date', 'is', null)
                .order('test_date')
            if (data) setExamSessions(data)
            setLoading(false)
        }
        fetchSessions()
    }, [supabase])

    const sourceSelection = sourceId ? mySelections.find(s => s.id === sourceId) : null
    const sourceExamSessionId = sourceSelection?.exam_session_id
    const selectedIds = new Set(mySelections.map(s => s.exam_session_id))
    const alreadyOnThisPath = sourceId ? new Set(
        mySelections
            .filter(s => s.condition_source_id === sourceId && s.condition_type === conditionType)
            .map(s => s.exam_session_id)
    ) : new Set<string>()

    const filtered = useMemo(() => {
        let sessions = examSessions

        // 日付フィルタ
        if (dateFilter === 'january') {
            sessions = sessions.filter(s => new Date(s.test_date! + 'T00:00:00').getMonth() === 0)
        } else if (dateFilter) {
            sessions = sessions.filter(s => s.test_date === dateFilter)
        }

        const q = searchQuery.toLowerCase()
        return sessions.filter(s => {
            if (sourceExamSessionId && s.id === sourceExamSessionId) return false
            if (alreadyOnThisPath.has(s.id)) return false
            if (!sourceId && selectedIds.has(s.id)) return false
            const name = s.school?.name || ''
            const label = s.session_label || ''
            return name.toLowerCase().includes(q) || label.toLowerCase().includes(q)
        })
    }, [examSessions, dateFilter, searchQuery, sourceExamSessionId, alreadyOnThisPath, sourceId, selectedIds])

    const grouped = useMemo(() => {
        const groups: { key: string; sessions: ExamSession[] }[] = []
        const map = new Map<string, ExamSession[]>()
        for (const s of filtered) {
            const key = getDateGroup(s.test_date!)
            if (!map.has(key)) {
                map.set(key, [])
                groups.push({ key, sessions: map.get(key)! })
            }
            map.get(key)!.push(s)
        }
        return groups
    }, [filtered])

    // ヘッダー
    let headerTitle: React.ReactNode
    let headerSub: string | null = null
    if (sourceId && sourceSelection) {
        headerTitle = conditionType === 'pass'
            ? <><CheckCircle className="w-5 h-5 text-green-500" />合格の場合</>
            : <><XCircle className="w-5 h-5 text-red-500" />不合格の場合</>
        headerSub = `${sourceSelection.exam_session?.school?.name} の結果に応じて受験する学校`
    } else if (dateFilter === 'january') {
        headerTitle = '1月入試 − 学校を追加'
    } else if (dateFilter) {
        headerTitle = `${formatDateLabel(dateFilter)} − 学校を追加`
    } else {
        headerTitle = '学校を追加'
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-teal-100">
                    <div>
                        <h3 className="text-lg font-bold text-teal-700 flex items-center gap-2">
                            {headerTitle}
                        </h3>
                        {headerSub && <p className="text-xs text-teal-400 mt-0.5">{headerSub}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-teal-300 hover:text-teal-500 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-teal-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-300" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="学校名で検索..."
                            className="w-full pl-9 pr-4 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="text-teal-300 text-center py-8 text-sm">
                            {searchQuery ? '該当する学校がありません' : 'この日程の試験データがありません'}
                        </p>
                    ) : (
                        grouped.map(group => (
                            <div key={group.key}>
                                {(!dateFilter || dateFilter === 'january' || sourceId) && (
                                    <div className="px-4 py-1.5 bg-teal-50/80 text-xs font-bold text-teal-500 sticky top-0">
                                        {group.key}
                                    </div>
                                )}
                                {group.sessions.map(session => {
                                    const isAlreadySelected = selectedIds.has(session.id)
                                    return (
                                        <button
                                            key={session.id}
                                            onClick={() => onSelect(session.id)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3 border-b border-teal-50"
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                                                session.time_period === '午後' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                                {session.time_period === '午後' ? '午後' : '午前'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-teal-700 text-sm truncate">{session.school?.name}</span>
                                                    {isAlreadySelected && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-teal-100 text-teal-500 rounded-full flex-shrink-0">選択済</span>
                                                    )}
                                                    {session.gender_type && (
                                                        <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                                                            session.gender_type === '男子校' ? 'bg-blue-100 text-blue-600' :
                                                            session.gender_type === '女子校' ? 'bg-pink-100 text-pink-600' :
                                                            'bg-purple-100 text-purple-600'
                                                        }`}>
                                                            {session.gender_type === '共学' ? '共' : session.gender_type[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-teal-400 flex items-center gap-1.5">
                                                    <span>{session.session_label}</span>
                                                    <span>{session.exam_subjects_label}</span>
                                                    {session.yotsuya_80 != null && <span>Y{session.yotsuya_80}</span>}
                                                </div>
                                            </div>
                                            <Plus className="w-5 h-5 text-teal-300 flex-shrink-0" />
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

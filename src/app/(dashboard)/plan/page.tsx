'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection, SchedulePlan, ScheduleEntry, ConditionType } from '@/types/database'
import {
    Search, Plus, Check, Trash2, CalendarDays, ListChecks,
    CheckCircle, XCircle, ChevronDown, ChevronRight, X, MapPin, Clock, TrendingUp, GitBranch
} from 'lucide-react'

type Tab = 'selections' | 'schedule'

export default function PlanPage() {
    const [activeTab, setActiveTab] = useState<Tab>('selections')

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">受験計画</h1>

            {/* タブ切り替え */}
            <div className="flex bg-white rounded-xl shadow-md border border-teal-200 p-1">
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

function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.getMonth() + 1}/${d.getDate()}`
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
                            {/* グループヘッダー */}
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

                            {/* セッション一覧 */}
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
// セッション行（コンパクト）
// ============================================================

function SessionRow({
    session,
    isSelected,
    isExpanded,
    onToggle,
    onToggleDetail,
}: {
    session: ExamSession
    isSelected: boolean
    isExpanded: boolean
    onToggle: () => void
    onToggleDetail: () => void
}) {
    return (
        <div>
            <div className="flex items-center gap-2 px-4 py-3 hover:bg-teal-50/50 transition-colors">
                {/* 追加/削除ボタン */}
                <button
                    onClick={onToggle}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                            ? 'bg-teal-400 text-white'
                            : 'bg-teal-50 text-teal-300 hover:bg-teal-100 hover:text-teal-500'
                    }`}
                >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>

                {/* メイン情報 */}
                <button onClick={onToggleDetail} className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-teal-700 truncate text-sm">
                            {session.school?.name}
                        </span>
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
                        {session.sapix != null && (
                            <span className="text-teal-400">S{session.sapix}</span>
                        )}
                    </div>
                </button>

                {/* 展開アイコン */}
                <ChevronDown
                    className={`w-4 h-4 text-teal-300 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    onClick={onToggleDetail}
                />
            </div>

            {/* 詳細展開 */}
            {isExpanded && (
                <div className="px-4 pb-3 ml-10 text-xs text-teal-600 space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-teal-50/70 rounded-lg p-3">
                        {session.assembly_time && (
                            <DetailItem icon={<Clock className="w-3 h-3" />} label="集合" value={session.assembly_time.slice(0, 5)} />
                        )}
                        {session.estimated_end_time && (
                            <DetailItem icon={<Clock className="w-3 h-3" />} label="終了予想" value={session.estimated_end_time.slice(0, 5)} />
                        )}
                        {session.nearest_station && (
                            <DetailItem icon={<MapPin className="w-3 h-3" />} label="最寄駅" value={session.nearest_station} />
                        )}
                        {session.exam_fee != null && (
                            <DetailItem label="受験料" value={`¥${session.exam_fee.toLocaleString()}`} />
                        )}
                        {session.enrollment_fee != null && (
                            <DetailItem label="入学金" value={`¥${session.enrollment_fee.toLocaleString()}`} />
                        )}
                        {session.deferral_available && (
                            <DetailItem label="延納" value={session.deferral_deadline ? `〜${formatDateTime(session.deferral_deadline)}` : '可'} />
                        )}
                        {session.yotsuya_80 != null && <DetailItem label="四谷80%" value={String(session.yotsuya_80)} />}
                        {session.yotsuya_50 != null && <DetailItem label="四谷50%" value={String(session.yotsuya_50)} />}
                        {session.sapix != null && <DetailItem label="SAPIX" value={String(session.sapix)} />}
                        {session.nichinoken_r4 != null && <DetailItem label="日能研R4" value={String(session.nichinoken_r4)} />}
                        {session.result_announcement && (
                            <DetailItem label="合格発表" value={formatDateTime(session.result_announcement)!} />
                        )}
                        {session.enrollment_deadline && (
                            <DetailItem label="手続締切" value={formatDateTime(session.enrollment_deadline)!} />
                        )}
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
// スケジュールボードタブ（カレンダー型）
// ============================================================

function ScheduleTab() {
    const [plans, setPlans] = useState<SchedulePlan[]>([])
    const [activePlanId, setActivePlanId] = useState<string | null>(null)
    const [entries, setEntries] = useState<ScheduleEntry[]>([])
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [addTarget, setAddTarget] = useState<{ date: string; period: string; conditionType: ConditionType; conditionSourceId: string | null }>({ date: '', period: '午前', conditionType: 'default', conditionSourceId: null })
    const [newPlanName, setNewPlanName] = useState('')
    const [showNewPlanInput, setShowNewPlanInput] = useState(false)

    const supabase = createClient()

    const fetchPlans = useCallback(async () => {
        const { data } = await supabase
            .from('schedule_plans')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) {
            setPlans(data)
            if (data.length > 0 && !activePlanId) {
                const active = data.find(p => p.is_active) || data[0]
                setActivePlanId(active.id)
            }
        }
    }, [supabase, activePlanId])

    const fetchEntries = useCallback(async (planId: string) => {
        const { data } = await supabase
            .from('schedule_entries')
            .select('*, exam_session:exam_sessions(*, school:schools(*))')
            .eq('plan_id', planId)
            .order('slot_date')
            .order('slot_period')
        if (data) setEntries(data)
    }, [supabase])

    const fetchSelections = useCallback(async () => {
        const { data } = await supabase
            .from('user_exam_selections')
            .select('*, exam_session:exam_sessions(*, school:schools(*))')
            .order('created_at')
        if (data) setMySelections(data)
    }, [supabase])

    useEffect(() => {
        Promise.all([fetchPlans(), fetchSelections()]).then(() => setLoading(false))
    }, [fetchPlans, fetchSelections])

    useEffect(() => {
        if (activePlanId) fetchEntries(activePlanId)
    }, [activePlanId, fetchEntries])

    const createPlan = async () => {
        const name = newPlanName.trim()
        if (!name) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
            .from('schedule_plans')
            .insert({ user_id: user.id, name, is_active: plans.length === 0 })
            .select()
            .single()
        if (data) {
            setPlans(prev => [data, ...prev])
            setActivePlanId(data.id)
            setEntries([])
            setNewPlanName('')
            setShowNewPlanInput(false)
        }
    }

    const deletePlan = async (planId: string) => {
        if (!confirm('このプランを削除しますか？')) return
        await supabase.from('schedule_plans').delete().eq('id', planId)
        setPlans(prev => prev.filter(p => p.id !== planId))
        if (activePlanId === planId) {
            const remaining = plans.filter(p => p.id !== planId)
            setActivePlanId(remaining.length > 0 ? remaining[0].id : null)
            setEntries([])
        }
    }

    const openAddModal = (date: string, period: string, conditionType: ConditionType, conditionSourceId: string | null) => {
        setAddTarget({ date, period, conditionType, conditionSourceId })
        setShowAddModal(true)
    }

    const addEntry = async (examSessionId: string) => {
        if (!activePlanId) return
        const { error } = await supabase.from('schedule_entries').insert({
            plan_id: activePlanId,
            slot_date: addTarget.date,
            slot_period: addTarget.period,
            exam_session_id: examSessionId,
            condition_type: addTarget.conditionType,
            condition_source_id: addTarget.conditionSourceId,
        })
        if (!error) {
            fetchEntries(activePlanId)
            setShowAddModal(false)
        }
    }

    const addNoteEntry = async (date: string, period: string, note: string, conditionType: ConditionType, conditionSourceId: string | null) => {
        if (!activePlanId) return
        await supabase.from('schedule_entries').insert({
            plan_id: activePlanId,
            slot_date: date,
            slot_period: period,
            exam_session_id: null,
            condition_type: conditionType,
            condition_source_id: conditionSourceId,
            note,
        })
        fetchEntries(activePlanId)
    }

    const removeEntry = async (entryId: string) => {
        await supabase.from('schedule_entries').delete().eq('id', entryId)
        if (activePlanId) fetchEntries(activePlanId)
    }

    const toggleBranching = async (entryId: string, current: boolean) => {
        await supabase.from('schedule_entries').update({ has_branching: !current }).eq('id', entryId)
        if (activePlanId) fetchEntries(activePlanId)
    }

    // カレンダー日付を生成
    const calendarDates = useMemo(() => {
        const dateSet = new Set<string>()
        // 選択校の日付
        mySelections.forEach(s => {
            if (s.exam_session?.test_date) dateSet.add(s.exam_session.test_date)
        })
        // エントリの日付
        entries.forEach(e => dateSet.add(e.slot_date))
        // 標準日程（2月1日〜5日）
        const year = new Date().getFullYear()
        for (let d = 1; d <= 5; d++) {
            dateSet.add(`${year}-02-${String(d).padStart(2, '0')}`)
        }
        return Array.from(dateSet).sort()
    }, [mySelections, entries])

    // 分岐ソース（has_branching=trueのエントリ）を取得
    const branchingSources = useMemo(() => {
        return entries.filter(e => e.has_branching)
    }, [entries])

    // 特定スロットのエントリを取得
    const getSlotEntries = useCallback((date: string, period: string): ScheduleEntry[] => {
        return entries.filter(e => e.slot_date === date && e.slot_period === period)
    }, [entries])

    // 特定スロットより前の分岐ソースを取得
    const getActiveBranchingSources = useCallback((date: string, period: string): ScheduleEntry[] => {
        return branchingSources.filter(e => {
            if (e.slot_date < date) return true
            if (e.slot_date === date && period === '午後' && e.slot_period === '午前') return true
            return false
        })
    }, [branchingSources])

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            {/* プラン管理 */}
            <div className="bg-white rounded-xl shadow-md border border-teal-200 p-4">
                {plans.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex-1">
                            <select
                                value={activePlanId || ''}
                                onChange={e => setActivePlanId(e.target.value)}
                                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-2.5 pr-10 text-teal-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
                        </div>
                        {activePlanId && (
                            <button
                                onClick={() => deletePlan(activePlanId)}
                                className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
                {showNewPlanInput ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newPlanName}
                            onChange={e => setNewPlanName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && createPlan()}
                            placeholder="プラン名（例: 安全重視プラン）"
                            className="flex-1 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2.5 text-sm text-teal-700 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            autoFocus
                        />
                        <button onClick={createPlan} disabled={!newPlanName.trim()} className="px-4 py-2.5 bg-teal-400 text-white rounded-lg text-sm hover:bg-teal-500 disabled:opacity-50 transition-colors">作成</button>
                        <button onClick={() => { setShowNewPlanInput(false); setNewPlanName('') }} className="p-2.5 text-teal-300 hover:text-teal-500"><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <button onClick={() => setShowNewPlanInput(true)} className="w-full py-2.5 border-2 border-dashed border-teal-200 rounded-lg text-teal-400 text-sm hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />新しいプランを作成
                    </button>
                )}
            </div>

            {/* カレンダー */}
            {activePlanId && (
                <>
                    {mySelections.length === 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                            先に「受験校リスト」タブで受験校を選択してください
                        </div>
                    )}

                    <div className="space-y-3">
                        {calendarDates.map(date => (
                            <div key={date} className="bg-white rounded-xl shadow-md border border-teal-200 overflow-hidden">
                                {/* 日付ヘッダー */}
                                <div className="bg-teal-50 px-4 py-2.5 border-b border-teal-200">
                                    <span className="font-bold text-teal-700">{formatDateLabel(date)}</span>
                                </div>

                                {/* 午前・午後 */}
                                {(['午前', '午後'] as const).map(period => {
                                    const slotEntries = getSlotEntries(date, period)
                                    const defaultEntries = slotEntries.filter(e => e.condition_type === 'default')
                                    const activeSources = getActiveBranchingSources(date, period)

                                    return (
                                        <div key={period} className="border-b border-teal-100 last:border-b-0">
                                            <div className="px-4 py-3">
                                                {/* 時間帯ラベル */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                        period === '午前' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                                                    }`}>{period}</span>
                                                </div>

                                                {/* デフォルトエントリ */}
                                                {defaultEntries.map(entry => (
                                                    <EntryCard
                                                        key={entry.id}
                                                        entry={entry}
                                                        onRemove={removeEntry}
                                                        onToggleBranching={toggleBranching}
                                                    />
                                                ))}

                                                {/* 分岐条件付きエントリ */}
                                                {activeSources.map(source => {
                                                    const sourceName = source.exam_session?.school?.name || 'この学校'
                                                    const passEntries = slotEntries.filter(e => e.condition_type === 'if_pass' && e.condition_source_id === source.id)
                                                    const failEntries = slotEntries.filter(e => e.condition_type === 'if_fail' && e.condition_source_id === source.id)

                                                    // この分岐ソースに対する条件エントリがまだなければスキップ
                                                    // ただし、分岐ONにしたばかりで空の場合は追加ボタンを表示
                                                    const hasAny = passEntries.length > 0 || failEntries.length > 0

                                                    return (
                                                        <div key={source.id} className="mt-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
                                                            <div className="text-xs text-gray-500 font-medium">
                                                                {sourceName}（{formatShortDate(source.slot_date)} {source.slot_period}）の結果次第:
                                                            </div>

                                                            {/* 合格の場合 */}
                                                            <div className="border-l-[3px] border-green-400 pl-3">
                                                                <div className="flex items-center gap-1 text-xs font-semibold text-green-600 mb-1">
                                                                    <CheckCircle className="w-3.5 h-3.5" />合格なら
                                                                </div>
                                                                {passEntries.map(e => (
                                                                    <EntryCard key={e.id} entry={e} onRemove={removeEntry} onToggleBranching={toggleBranching} compact />
                                                                ))}
                                                                {passEntries.length === 0 && (
                                                                    <div className="flex gap-1.5">
                                                                        <button
                                                                            onClick={() => openAddModal(date, period, 'if_pass', source.id)}
                                                                            className="flex-1 py-1.5 border border-dashed border-green-200 rounded text-xs text-green-400 hover:border-green-400 hover:text-green-600 transition-colors"
                                                                        >+ 学校を追加</button>
                                                                        <button
                                                                            onClick={() => addNoteEntry(date, period, '受験なし', 'if_pass', source.id)}
                                                                            className="py-1.5 px-2 border border-dashed border-green-200 rounded text-xs text-green-400 hover:border-green-400 hover:text-green-600 transition-colors"
                                                                        >受験なし</button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* 不合格の場合 */}
                                                            <div className="border-l-[3px] border-red-400 pl-3">
                                                                <div className="flex items-center gap-1 text-xs font-semibold text-red-500 mb-1">
                                                                    <XCircle className="w-3.5 h-3.5" />不合格なら
                                                                </div>
                                                                {failEntries.map(e => (
                                                                    <EntryCard key={e.id} entry={e} onRemove={removeEntry} onToggleBranching={toggleBranching} compact />
                                                                ))}
                                                                {failEntries.length === 0 && (
                                                                    <div className="flex gap-1.5">
                                                                        <button
                                                                            onClick={() => openAddModal(date, period, 'if_fail', source.id)}
                                                                            className="flex-1 py-1.5 border border-dashed border-red-200 rounded text-xs text-red-300 hover:border-red-400 hover:text-red-500 transition-colors"
                                                                        >+ 学校を追加</button>
                                                                        <button
                                                                            onClick={() => addNoteEntry(date, period, '受験なし', 'if_fail', source.id)}
                                                                            className="py-1.5 px-2 border border-dashed border-red-200 rounded text-xs text-red-300 hover:border-red-400 hover:text-red-500 transition-colors"
                                                                        >受験なし</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                                {/* 空スロット（デフォルトエントリもなく、条件付きエントリもない場合） */}
                                                {defaultEntries.length === 0 && activeSources.length === 0 && (
                                                    <button
                                                        onClick={() => openAddModal(date, period, 'default', null)}
                                                        className="w-full py-3 border-2 border-dashed border-teal-200 rounded-lg text-sm text-teal-300 hover:border-teal-400 hover:text-teal-500 transition-colors flex items-center justify-center gap-1.5"
                                                    >
                                                        <Plus className="w-4 h-4" />学校を追加
                                                    </button>
                                                )}

                                                {/* デフォルトエントリはあるが追加したい場合（分岐なしスロットでも追加ボタン） */}
                                                {defaultEntries.length > 0 && activeSources.length === 0 && (
                                                    <button
                                                        onClick={() => openAddModal(date, period, 'default', null)}
                                                        className="mt-1 text-xs text-teal-300 hover:text-teal-500 transition-colors flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3 h-3" />追加
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* 学校追加モーダル */}
            {showAddModal && (
                <AddSlotModal
                    selections={mySelections}
                    conditionType={addTarget.conditionType}
                    onSelect={addEntry}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    )
}

// ============================================================
// エントリカード
// ============================================================

function EntryCard({
    entry,
    onRemove,
    onToggleBranching,
    compact,
}: {
    entry: ScheduleEntry
    onRemove: (id: string) => void
    onToggleBranching: (id: string, current: boolean) => void
    compact?: boolean
}) {
    // メモだけのエントリ（受験なし等）
    if (!entry.exam_session_id && entry.note) {
        return (
            <div className="flex items-center justify-between py-1.5 px-2 bg-gray-100 rounded text-xs text-gray-500 mb-1">
                <span>{entry.note}</span>
                <button onClick={() => onRemove(entry.id)} className="text-red-200 hover:text-red-500 ml-2"><Trash2 className="w-3 h-3" /></button>
            </div>
        )
    }

    return (
        <div className={`flex items-center justify-between gap-2 rounded-lg border-2 bg-white mb-1 ${
            entry.has_branching ? 'border-amber-300' : 'border-teal-200'
        } ${compact ? 'p-2' : 'p-3'}`}>
            <div className="flex-1 min-w-0">
                <div className={`font-bold text-teal-800 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                    {entry.exam_session?.school?.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-teal-500 mt-0.5">
                    <span>{entry.exam_session?.session_label}</span>
                    {entry.exam_session?.exam_subjects_label && <span>{entry.exam_session.exam_subjects_label}</span>}
                    {entry.exam_session?.sapix != null && <span>S{entry.exam_session.sapix}</span>}
                    {!compact && entry.exam_session?.exam_fee != null && <span>¥{entry.exam_session.exam_fee.toLocaleString()}</span>}
                </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                    onClick={() => onToggleBranching(entry.id, entry.has_branching)}
                    className={`p-1.5 rounded-lg transition-colors ${
                        entry.has_branching
                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                            : 'text-teal-200 hover:text-amber-500 hover:bg-amber-50'
                    }`}
                    title={entry.has_branching ? '分岐を解除' : '合否で分岐する'}
                >
                    <GitBranch className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onRemove(entry.id)} className="p-1.5 text-red-200 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}

// ============================================================
// 学校追加モーダル
// ============================================================

function AddSlotModal({
    selections,
    conditionType,
    onSelect,
    onClose,
}: {
    selections: UserExamSelection[]
    conditionType: ConditionType
    onSelect: (examSessionId: string) => void
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-teal-100">
                    <h3 className="text-lg font-bold text-teal-700">
                        {conditionType === 'if_pass' ? (
                            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" />合格の場合</span>
                        ) : conditionType === 'if_fail' ? (
                            <span className="flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" />不合格の場合</span>
                        ) : '学校を選択'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-teal-300 hover:text-teal-500 rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-y-auto p-3 space-y-1.5">
                    {selections.length === 0 ? (
                        <p className="text-teal-300 text-center py-8 text-sm">受験校リストが空です</p>
                    ) : (
                        selections.map(sel => (
                            <button
                                key={sel.id}
                                onClick={() => onSelect(sel.exam_session_id)}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                                    sel.exam_session?.time_period === '午後' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {sel.exam_session?.test_date ? formatShortDate(sel.exam_session.test_date) : '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-teal-700 text-sm truncate">{sel.exam_session?.school?.name}</div>
                                    <div className="text-xs text-teal-400">
                                        {sel.exam_session?.session_label} {sel.exam_session?.time_period}
                                        {sel.exam_session?.exam_subjects_label && ` / ${sel.exam_session.exam_subjects_label}`}
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-teal-300 flex-shrink-0" />
                            </button>
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

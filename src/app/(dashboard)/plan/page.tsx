'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection, SchedulePlan, ScheduleSlot, BranchCondition } from '@/types/database'
import {
    Search, Plus, Check, Trash2, CalendarDays, ListChecks,
    CheckCircle, XCircle, ChevronDown, X, MapPin, Clock, TrendingUp
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
// 受験校リストタブ
// ============================================================

function SelectionsTab() {
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [expandedDetail, setExpandedDetail] = useState<string | null>(null)

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

    useEffect(() => {
        fetchData()
    }, [fetchData])

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

    const filteredSessions = examSessions.filter(s => {
        const name = s.school?.name || ''
        const label = s.session_label || ''
        const q = searchQuery.toLowerCase()
        return name.toLowerCase().includes(q) || label.toLowerCase().includes(q)
    })

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            {/* 選択済みリスト */}
            <section className="bg-white rounded-xl shadow-md border border-teal-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-teal-700 mb-4">
                    選択した受験校（{mySelections.length}件）
                </h2>
                {mySelections.length === 0 ? (
                    <p className="text-teal-300 text-center py-6">
                        下の学校マスターから受験校を追加してください
                    </p>
                ) : (
                    <div className="space-y-3">
                        {mySelections.map(sel => (
                            <ExamCard
                                key={sel.id}
                                session={sel.exam_session!}
                                isSelected
                                onToggle={() => handleRemove(sel.id)}
                                isExpanded={expandedDetail === sel.id}
                                onToggleDetail={() => setExpandedDetail(prev => prev === sel.id ? null : sel.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 検索 & 学校マスター */}
            <section className="bg-white rounded-xl shadow-md border border-teal-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-teal-700 mb-4">学校マスター</h2>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="学校名で検索..."
                        className="w-full pl-10 pr-4 py-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-700 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                {filteredSessions.length === 0 ? (
                    <p className="text-teal-300 text-center py-6">
                        {searchQuery ? '該当する学校がありません' : 'スケジュールデータのある学校がありません'}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {filteredSessions.map(session => (
                            <ExamCard
                                key={session.id}
                                session={session}
                                isSelected={selectedIds.has(session.id)}
                                onToggle={() => {
                                    if (selectedIds.has(session.id)) {
                                        const sel = mySelections.find(s => s.exam_session_id === session.id)
                                        if (sel) handleRemove(sel.id)
                                    } else {
                                        handleAdd(session.id)
                                    }
                                }}
                                isExpanded={expandedDetail === session.id}
                                onToggleDetail={() => setExpandedDetail(prev => prev === session.id ? null : session.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

// ============================================================
// 受験校カード
// ============================================================

function ExamCard({
    session,
    isSelected,
    onToggle,
    isExpanded,
    onToggleDetail,
}: {
    session: ExamSession
    isSelected: boolean
    onToggle: () => void
    isExpanded: boolean
    onToggleDetail: () => void
}) {
    const formatDate = (d?: string | null) => {
        if (!d) return null
        const date = new Date(d)
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    const formatDateTime = (d?: string | null) => {
        if (!d) return null
        const date = new Date(d)
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    return (
        <div className="border border-teal-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <button onClick={onToggleDetail} className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-teal-700">
                                {session.school?.name}
                            </span>
                            {session.gender_type && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    session.gender_type === '男子校' ? 'bg-blue-100 text-blue-700' :
                                    session.gender_type === '女子校' ? 'bg-pink-100 text-pink-700' :
                                    'bg-purple-100 text-purple-700'
                                }`}>
                                    {session.gender_type}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-teal-600">
                            <span className="font-medium">{session.session_label}</span>
                            {session.test_date && (
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {formatDate(session.test_date)} {session.time_period}
                                </span>
                            )}
                            {session.exam_subjects_label && (
                                <span>{session.exam_subjects_label}</span>
                            )}
                            {session.sapix != null && (
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    S{session.sapix}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={onToggle}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                                ? 'bg-teal-400 text-white'
                                : 'bg-teal-50 text-teal-400 hover:bg-teal-100'
                        }`}
                    >
                        {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* 詳細展開 */}
            {isExpanded && (
                <div className="border-t border-teal-100 bg-teal-50/50 px-4 py-3 text-sm text-teal-600 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        {session.assembly_time && (
                            <DetailItem icon={<Clock className="w-3.5 h-3.5" />} label="集合" value={session.assembly_time.slice(0, 5)} />
                        )}
                        {session.estimated_end_time && (
                            <DetailItem icon={<Clock className="w-3.5 h-3.5" />} label="終了予想" value={session.estimated_end_time.slice(0, 5)} />
                        )}
                        {session.nearest_station && (
                            <DetailItem icon={<MapPin className="w-3.5 h-3.5" />} label="最寄駅" value={session.nearest_station} />
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
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-teal-100">
                        {session.yotsuya_80 != null && <DetailItem label="四谷80%" value={String(session.yotsuya_80)} />}
                        {session.yotsuya_50 != null && <DetailItem label="四谷50%" value={String(session.yotsuya_50)} />}
                        {session.sapix != null && <DetailItem label="SAPIX" value={String(session.sapix)} />}
                        {session.nichinoken_r4 != null && <DetailItem label="日能研R4" value={String(session.nichinoken_r4)} />}
                    </div>
                    {session.result_announcement && (
                        <div className="pt-1 border-t border-teal-100">
                            <DetailItem label="合格発表" value={formatDateTime(session.result_announcement)!} />
                            {session.enrollment_deadline && (
                                <DetailItem label="入学手続締切" value={formatDateTime(session.enrollment_deadline)!} />
                            )}
                        </div>
                    )}
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
            <span className="font-medium">{value}</span>
        </div>
    )
}

// ============================================================
// スケジュールボードタブ
// ============================================================

function ScheduleTab() {
    const [plans, setPlans] = useState<SchedulePlan[]>([])
    const [activePlanId, setActivePlanId] = useState<string | null>(null)
    const [slots, setSlots] = useState<ScheduleSlot[]>([])
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [addTarget, setAddTarget] = useState<{ parentSlotId: string | null; branchCondition: BranchCondition | null }>({ parentSlotId: null, branchCondition: null })
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

    const fetchSlots = useCallback(async (planId: string) => {
        const { data } = await supabase
            .from('schedule_slots')
            .select('*, exam_session:exam_sessions(*, school:schools(*))')
            .eq('plan_id', planId)
            .order('slot_date')
            .order('slot_period')
            .order('sort_order')
        if (data) setSlots(data)
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
        if (activePlanId) fetchSlots(activePlanId)
    }, [activePlanId, fetchSlots])

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
            setSlots([])
            setNewPlanName('')
            setShowNewPlanInput(false)
        }
    }

    const deletePlan = async (planId: string) => {
        if (!confirm('このプランを削除しますか？スロットも全て削除されます。')) return
        await supabase.from('schedule_plans').delete().eq('id', planId)
        setPlans(prev => prev.filter(p => p.id !== planId))
        if (activePlanId === planId) {
            const remaining = plans.filter(p => p.id !== planId)
            setActivePlanId(remaining.length > 0 ? remaining[0].id : null)
            setSlots([])
        }
    }

    const openAddModal = (parentSlotId: string | null, branchCondition: BranchCondition | null) => {
        setAddTarget({ parentSlotId, branchCondition })
        setShowAddModal(true)
    }

    const addSlot = async (examSessionId: string) => {
        if (!activePlanId) return

        const session = mySelections.find(s => s.exam_session_id === examSessionId)?.exam_session
        if (!session) return

        const { error } = await supabase.from('schedule_slots').insert({
            plan_id: activePlanId,
            exam_session_id: examSessionId,
            slot_date: session.test_date!,
            slot_period: session.time_period || '午前',
            parent_slot_id: addTarget.parentSlotId,
            branch_condition: addTarget.branchCondition,
            continuation_type: 'continue',
        })

        if (!error) {
            fetchSlots(activePlanId)
            setShowAddModal(false)
        }
    }

    const removeSlot = async (slotId: string) => {
        if (!confirm('この枠を削除しますか？分岐先も全て削除されます。')) return
        await supabase.from('schedule_slots').delete().eq('id', slotId)
        if (activePlanId) fetchSlots(activePlanId)
    }

    const updateContinuationType = async (slotId: string, type: string) => {
        await supabase.from('schedule_slots').update({ continuation_type: type }).eq('id', slotId)
        if (activePlanId) fetchSlots(activePlanId)
    }

    // ツリー構築
    const buildTree = (parentId: string | null): ScheduleSlot[] => {
        return slots
            .filter(s => s.parent_slot_id === parentId)
            .sort((a, b) => {
                if (a.slot_date !== b.slot_date) return a.slot_date.localeCompare(b.slot_date)
                if (a.slot_period !== b.slot_period) return a.slot_period === '午前' ? -1 : 1
                return a.sort_order - b.sort_order
            })
    }

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
                                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 pr-10 text-teal-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 pointer-events-none" />
                        </div>
                        {activePlanId && (
                            <button
                                onClick={() => deletePlan(activePlanId)}
                                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="プランを削除"
                            >
                                <Trash2 className="w-5 h-5" />
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
                            className="flex-1 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            autoFocus
                        />
                        <button
                            onClick={createPlan}
                            disabled={!newPlanName.trim()}
                            className="px-4 py-3 bg-teal-400 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 transition-colors"
                        >
                            作成
                        </button>
                        <button
                            onClick={() => { setShowNewPlanInput(false); setNewPlanName('') }}
                            className="p-3 text-teal-400 hover:text-teal-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowNewPlanInput(true)}
                        className="w-full py-3 border-2 border-dashed border-teal-200 rounded-lg text-teal-400 hover:border-teal-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        新しいプランを作成
                    </button>
                )}
            </div>

            {/* スケジュールスロット */}
            {activePlanId && (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-teal-700">スケジュール</h2>
                        <button
                            onClick={() => openAddModal(null, null)}
                            className="text-sm px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            学校を追加
                        </button>
                    </div>

                    {mySelections.length === 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-700">
                            先に「受験校リスト」タブで受験校を選択してください
                        </div>
                    )}

                    {slots.length === 0 ? (
                        <p className="text-teal-300 text-center py-8">
                            まだスケジュールが空です。「学校を追加」から始めましょう。
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {buildTree(null).map(slot => (
                                <SlotNode
                                    key={slot.id}
                                    slot={slot}
                                    slots={slots}
                                    depth={0}
                                    buildTree={buildTree}
                                    onRemove={removeSlot}
                                    onUpdateType={updateContinuationType}
                                    onAddBranch={openAddModal}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 学校追加モーダル */}
            {showAddModal && (
                <AddSlotModal
                    selections={mySelections}
                    branchCondition={addTarget.branchCondition}
                    onSelect={addSlot}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    )
}

// ============================================================
// スロットノード（再帰コンポーネント）
// ============================================================

function SlotNode({
    slot,
    slots,
    depth,
    buildTree,
    onRemove,
    onUpdateType,
    onAddBranch,
}: {
    slot: ScheduleSlot
    slots: ScheduleSlot[]
    depth: number
    buildTree: (parentId: string | null) => ScheduleSlot[]
    onRemove: (id: string) => void
    onUpdateType: (id: string, type: string) => void
    onAddBranch: (parentSlotId: string | null, branchCondition: BranchCondition | null) => void
}) {
    const children = buildTree(slot.id)
    const hasPassChild = children.some(c => c.branch_condition === '合格')
    const hasFailChild = children.some(c => c.branch_condition === '不合格')

    const formatDate = (d: string) => {
        const date = new Date(d + 'T00:00:00')
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    return (
        <div style={{ marginLeft: `${depth * 1.25}rem` }}>
            <div className={`border rounded-lg p-3 sm:p-4 transition-shadow hover:shadow-md ${
                slot.continuation_type === 'end'
                    ? 'border-gray-200 bg-gray-50'
                    : slot.continuation_type === 'branch'
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-teal-200'
            }`}>
                {/* 分岐条件ラベル */}
                {slot.branch_condition && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded mb-2 ${
                        slot.branch_condition === '合格'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {slot.branch_condition === '合格' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {slot.branch_condition}の場合
                    </span>
                )}

                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-teal-700 truncate">
                            {slot.exam_session?.school?.name}
                        </div>
                        <div className="text-sm text-teal-500 flex flex-wrap gap-x-2">
                            <span>{formatDate(slot.slot_date)} {slot.slot_period}</span>
                            <span>{slot.exam_session?.session_label}</span>
                            {slot.exam_session?.exam_fee != null && (
                                <span>¥{slot.exam_session.exam_fee.toLocaleString()}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="relative">
                            <select
                                value={slot.continuation_type}
                                onChange={e => onUpdateType(slot.id, e.target.value)}
                                className={`text-xs appearance-none pl-2 pr-6 py-1.5 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                                    slot.continuation_type === 'branch'
                                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                                        : slot.continuation_type === 'end'
                                        ? 'bg-gray-100 border-gray-300 text-gray-600'
                                        : 'bg-teal-50 border-teal-200 text-teal-700'
                                }`}
                            >
                                <option value="continue">継続</option>
                                <option value="branch">分岐</option>
                                <option value="end">終了</option>
                            </select>
                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" />
                        </div>
                        <button
                            onClick={() => onRemove(slot.id)}
                            className="p-1.5 text-red-300 hover:text-red-500 transition-colors"
                            title="削除"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 分岐の子ノード追加ボタン */}
            {slot.continuation_type === 'branch' && (
                <div className="ml-5 mt-1 space-y-1">
                    {!hasPassChild && (
                        <button
                            onClick={() => onAddBranch(slot.id, '合格')}
                            className="flex items-center gap-1.5 text-xs text-green-500 hover:text-green-700 py-1 transition-colors"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            合格の場合を追加
                        </button>
                    )}
                    {!hasFailChild && (
                        <button
                            onClick={() => onAddBranch(slot.id, '不合格')}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 py-1 transition-colors"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            不合格の場合を追加
                        </button>
                    )}
                </div>
            )}

            {/* 子ノード再帰レンダリング */}
            {children.map(child => (
                <SlotNode
                    key={child.id}
                    slot={child}
                    slots={slots}
                    depth={depth + 1}
                    buildTree={buildTree}
                    onRemove={onRemove}
                    onUpdateType={onUpdateType}
                    onAddBranch={onAddBranch}
                />
            ))}
        </div>
    )
}

// ============================================================
// 学校追加モーダル
// ============================================================

function AddSlotModal({
    selections,
    branchCondition,
    onSelect,
    onClose,
}: {
    selections: UserExamSelection[]
    branchCondition: BranchCondition | null
    onSelect: (examSessionId: string) => void
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-teal-100">
                    <h3 className="text-lg font-bold text-teal-700">
                        {branchCondition
                            ? `${branchCondition === '合格' ? '合格' : '不合格'}の場合の学校を選択`
                            : '学校を選択'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-teal-400 hover:text-teal-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-2">
                    {selections.length === 0 ? (
                        <p className="text-teal-300 text-center py-8">
                            受験校リストが空です。先に学校を追加してください。
                        </p>
                    ) : (
                        selections.map(sel => (
                            <button
                                key={sel.id}
                                onClick={() => onSelect(sel.exam_session_id)}
                                className="w-full text-left p-3 border border-teal-200 rounded-lg hover:bg-teal-50 active:bg-teal-100 transition-colors"
                            >
                                <div className="font-semibold text-teal-700">
                                    {sel.exam_session?.school?.name}
                                </div>
                                <div className="text-sm text-teal-500">
                                    {sel.exam_session?.session_label} / {sel.exam_session?.test_date && (
                                        <>
                                            {new Date(sel.exam_session.test_date + 'T00:00:00').getMonth() + 1}/
                                            {new Date(sel.exam_session.test_date + 'T00:00:00').getDate()}
                                        </>
                                    )} {sel.exam_session?.time_period}
                                </div>
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

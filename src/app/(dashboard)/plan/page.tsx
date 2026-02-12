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
// フローチャート型定義 & ツリー構築
// ============================================================

type FlowNode = {
    type: 'exam'
    session: ExamSession
    selectionId: string
    branching: boolean
    passPath: FlowNode | null
    failPath: FlowNode | null
    next: FlowNode | null
} | {
    type: 'terminal'
    label: string
}

function buildFlowTree(selections: UserExamSelection[]): FlowNode | null {
    const sorted = [...selections]
        .filter(s => s.exam_session?.test_date)
        .sort((a, b) => {
            const dateA = a.exam_session!.test_date!
            const dateB = b.exam_session!.test_date!
            if (dateA !== dateB) return dateA.localeCompare(dateB)
            const pA = a.exam_session!.time_period === '午後' ? 1 : 0
            const pB = b.exam_session!.time_period === '午後' ? 1 : 0
            return pA - pB
        })
    return buildChain(sorted, 0)
}

function buildChain(sorted: UserExamSelection[], index: number): FlowNode | null {
    if (index >= sorted.length) return null
    const sel = sorted[index]
    const isBranching = sel.on_pass_action === 'end'

    if (isBranching) {
        return {
            type: 'exam',
            session: sel.exam_session!,
            selectionId: sel.id,
            branching: true,
            passPath: { type: 'terminal', label: '受験終了' },
            failPath: buildChain(sorted, index + 1),
            next: null,
        }
    }
    return {
        type: 'exam',
        session: sel.exam_session!,
        selectionId: sel.id,
        branching: false,
        passPath: null,
        failPath: null,
        next: buildChain(sorted, index + 1),
    }
}

// ============================================================
// スケジュールタブ（フローチャート）
// ============================================================

function ScheduleTab() {
    const [mySelections, setMySelections] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
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

    const toggleBranching = async (selectionId: string, currentAction: string) => {
        const newAction = currentAction === 'end' ? 'continue' : 'end'
        const { error } = await supabase
            .from('user_exam_selections')
            .update({ on_pass_action: newAction })
            .eq('id', selectionId)
        if (!error) {
            setMySelections(prev => prev.map(s =>
                s.id === selectionId ? { ...s, on_pass_action: newAction } : s
            ))
        }
    }

    const flowTree = useMemo(() => buildFlowTree(mySelections), [mySelections])

    if (loading) return <Loading />

    if (mySelections.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-teal-200 p-8 text-center">
                <CalendarDays className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <p className="text-teal-600 font-semibold mb-1">まだ受験校が選択されていません</p>
                <p className="text-sm text-teal-400">
                    「受験校リスト」タブで学校を選択すると<br />フローチャートが自動生成されます
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-md border border-teal-200 px-4 py-3">
                <p className="text-xs text-teal-500 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                    カードの右にある分岐ボタンをタップすると「合格したら受験終了」の分岐を追加できます
                </p>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-fit py-6 flex flex-col items-center">
                    {flowTree && <FlowNodeRenderer node={flowTree} onToggle={toggleBranching} />}
                </div>
            </div>
        </div>
    )
}

// ============================================================
// フローチャートノード描画
// ============================================================

function FlowNodeRenderer({
    node,
    onToggle,
}: {
    node: FlowNode
    onToggle: (selectionId: string, currentAction: string) => void
}) {
    if (node.type === 'terminal') {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl px-5 py-3 text-center shadow-sm">
                <div className="text-green-600 font-bold text-sm">{node.label}</div>
            </div>
        )
    }

    const { session, selectionId, branching, passPath, failPath, next } = node

    return (
        <div className="flex flex-col items-center">
            {/* 学校ノードカード */}
            <div className={`relative w-52 rounded-xl border-2 shadow-sm transition-colors ${
                branching ? 'border-amber-300 bg-amber-50/30' : 'border-teal-200 bg-white'
            }`}>
                <div className="p-3">
                    <div className="font-bold text-teal-800 text-sm truncate pr-4">
                        {session.school?.name}
                    </div>
                    <div className="text-xs text-teal-500 mt-0.5">
                        {session.session_label} · {formatDateLabel(session.test_date!)} {session.time_period}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-teal-400 mt-1">
                        {session.exam_subjects_label && <span>{session.exam_subjects_label}</span>}
                        {session.sapix != null && (
                            <span className="bg-teal-50 px-1 rounded">S{session.sapix}</span>
                        )}
                        {session.exam_fee != null && <span>¥{session.exam_fee.toLocaleString()}</span>}
                    </div>
                </div>
                {/* 分岐トグルボタン */}
                <button
                    onClick={() => onToggle(selectionId, branching ? 'end' : 'continue')}
                    className={`absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-sm transition-all ${
                        branching
                            ? 'bg-amber-400 border-amber-500 text-white hover:bg-amber-500'
                            : 'bg-white border-teal-200 text-teal-300 hover:border-amber-400 hover:text-amber-500'
                    }`}
                    title={branching ? '分岐を解除' : '合格したら受験終了'}
                >
                    <GitBranch className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* 分岐あり: フォーク表示 */}
            {branching && passPath ? (
                <>
                    {/* 幹の縦線 */}
                    <div className="w-0.5 h-5 bg-gray-300" />
                    {/* フォーク */}
                    <div className="flex">
                        {/* 合格パス */}
                        <div className="flex flex-col items-center min-w-[140px] px-3 relative">
                            <div className="absolute top-0 right-0 left-1/2 h-0.5 bg-gray-300" />
                            <div className="w-0.5 h-4 bg-green-400" />
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600 mb-2">
                                <CheckCircle className="w-3.5 h-3.5" />合格
                            </div>
                            <FlowNodeRenderer node={passPath} onToggle={onToggle} />
                        </div>
                        {/* 不合格パス */}
                        <div className="flex flex-col items-center min-w-[140px] px-3 relative">
                            <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-gray-300" />
                            <div className="w-0.5 h-4 bg-red-400" />
                            <div className="flex items-center gap-1 text-xs font-bold text-red-500 mb-2">
                                <XCircle className="w-3.5 h-3.5" />不合格
                            </div>
                            {failPath ? (
                                <FlowNodeRenderer node={failPath} onToggle={onToggle} />
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center">
                                    <div className="text-xs text-gray-400">全日程終了</div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : next ? (
                <>
                    {/* 次ノードへの縦線 */}
                    <div className="w-0.5 h-6 bg-gray-300" />
                    <FlowNodeRenderer node={next} onToggle={onToggle} />
                </>
            ) : null}
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

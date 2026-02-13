'use client'

import { Fragment, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection } from '@/types/database'
import {
    Search, Plus, X, GitBranch, CheckCircle, XCircle, Clock
} from 'lucide-react'

// ============================================================
// 定数 & ユーティリティ
// ============================================================

const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']

function fmtDate(d: string): string {
    const dt = new Date(d + 'T00:00:00')
    return `${dt.getMonth() + 1}/${dt.getDate()}(${DAY_NAMES[dt.getDay()]})`
}

function fmtTime(t: string | null | undefined): string {
    if (!t) return ''
    const m = t.match(/(\d{1,2}):(\d{2})/)
    return m ? `${m[1]}:${m[2]}` : t
}

function fmtAnnounce(v: string | null | undefined): string {
    if (!v) return ''
    try {
        const d = new Date(v)
        if (!isNaN(d.getTime())) {
            return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
        }
    } catch { /* ignore */ }
    return v
}

// 偏差値帯
const RANGES = [
    { key: '60-65', label: '60-65', min: 60, bg: 'bg-violet-50/50', badge: 'bg-violet-100 text-violet-700 ring-violet-300', labelBg: 'bg-violet-500' },
    { key: '55-60', label: '55-60', min: 55, bg: 'bg-blue-50/50', badge: 'bg-blue-100 text-blue-700 ring-blue-300', labelBg: 'bg-blue-500' },
    { key: '50-55', label: '50-55', min: 50, bg: 'bg-teal-100/40', badge: 'bg-teal-100 text-teal-700 ring-teal-300', labelBg: 'bg-teal-500' },
    { key: '45-50', label: '45-50', min: 45, bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-700 ring-emerald-300', labelBg: 'bg-emerald-500' },
    { key: '40-45', label: '40-45', min: 40, bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-700 ring-amber-300', labelBg: 'bg-amber-500' },
] as const

function rangeOf(v: number | null | undefined): string {
    if (v == null) return '45-50'
    if (v >= 60) return '60-65'
    if (v >= 55) return '55-60'
    if (v >= 50) return '50-55'
    if (v >= 45) return '45-50'
    return '40-45'
}

function rangeCfg(key: string) {
    return RANGES.find(r => r.key === key) ?? RANGES[3]
}

// ============================================================
// 型定義
// ============================================================

interface TimeCol { key: string; date: string; period: '午前' | '午後' }
interface DateGrp { date: string; label: string; cols: TimeCol[]; isJan: boolean }

type ModalState = {
    mode: 'global' | 'date' | 'branch'
    dateFilter?: string
    periodFilter?: '午前' | '午後'
    sourceId?: string
    conditionType?: 'pass' | 'fail'
}

// ============================================================
// メインページ
// ============================================================

export default function PlanPage() {
    const [sessions, setSessions] = useState<ExamSession[]>([])
    const [sels, setSels] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<ModalState | null>(null)
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        const [sr, slr] = await Promise.all([
            supabase.from('exam_sessions').select('*, school:schools(*)').not('test_date', 'is', null).order('test_date'),
            supabase.from('user_exam_selections').select('*, exam_session:exam_sessions(*, school:schools(*))').order('created_at'),
        ])
        if (sr.data) setSessions(sr.data)
        if (slr.data) setSels(slr.data)
        setLoading(false)
    }, [supabase])

    useEffect(() => { fetchData() }, [fetchData])

    // ===== 再帰削除 =====
    const delRec = useCallback(async (id: string, all: UserExamSelection[]) => {
        for (const c of all.filter(s => s.condition_source_id === id)) {
            await delRec(c.id, all)
        }
        await supabase.from('user_exam_selections').delete().eq('id', id)
    }, [supabase])

    // ===== CRUD =====
    const addSchool = async (esId: string) => {
        if (sels.find(s => s.exam_session_id === esId)) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('user_exam_selections').insert({ user_id: user.id, exam_session_id: esId })
        fetchData()
        setModal(null)
    }

    const addBranch = async (esId: string, srcId: string, ct: 'pass' | 'fail') => {
        const existing = sels.find(s => s.exam_session_id === esId)
        if (existing) {
            await supabase.from('user_exam_selections')
                .update({ condition_source_id: srcId, condition_type: ct })
                .eq('id', existing.id)
        } else {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            await supabase.from('user_exam_selections').insert({
                user_id: user.id,
                exam_session_id: esId,
                condition_source_id: srcId,
                condition_type: ct,
            })
        }
        fetchData()
        setModal(null)
    }

    const handleRemove = async (id: string) => {
        await delRec(id, sels)
        fetchData()
    }

    const toggleBranch = async (id: string, cur: string) => {
        const next = cur === 'end' ? 'continue' : 'end'
        if (next === 'continue') {
            for (const c of sels.filter(s => s.condition_source_id === id)) {
                await delRec(c.id, sels)
            }
        }
        await supabase.from('user_exam_selections')
            .update({ on_pass_action: next })
            .eq('id', id)
        fetchData()
    }

    // ===== 年度 =====
    const yr = useMemo(() => {
        for (const s of sels) { if (s.exam_session?.year) return s.exam_session.year }
        for (const s of sessions) { if (s.year) return s.year }
        const n = new Date()
        return n.getMonth() <= 2 ? n.getFullYear() : n.getFullYear() + 1
    }, [sels, sessions])

    // ===== 列生成 (日付 × 午前/午後) =====
    const { dateGroups, allCols } = useMemo(() => {
        const ds = new Set<string>()

        // 1月: exam_sessionsに存在する日付のみ
        for (const s of sessions) {
            if (s.test_date) {
                const d = new Date(s.test_date + 'T00:00:00')
                if (d.getMonth() === 0) ds.add(s.test_date)
            }
        }

        // 2月1-5日は固定
        for (let d = 1; d <= 5; d++) ds.add(`${yr}-02-0${d}`)

        // 2/6以降: exam_sessionsまたは選択に存在すれば追加
        for (const s of sessions) {
            if (s.test_date && s.test_date > `${yr}-02-05`) ds.add(s.test_date)
        }
        for (const s of sels) {
            if (s.exam_session?.test_date) ds.add(s.exam_session.test_date)
        }

        const sorted = Array.from(ds).sort()
        const groups: DateGrp[] = []
        const all: TimeCol[] = []

        for (const date of sorted) {
            const d = new Date(date + 'T00:00:00')
            const isJan = d.getMonth() === 0

            // この日に午後の試験があるか
            const hasPM = sessions.some(s => s.test_date === date && s.time_period === '午後') ||
                          sels.some(s => s.exam_session?.test_date === date && s.exam_session?.time_period === '午後')

            const cols: TimeCol[] = [{ key: `${date}_午前`, date, period: '午前' }]
            if (hasPM) cols.push({ key: `${date}_午後`, date, period: '午後' })

            groups.push({ date, label: fmtDate(date), cols, isJan })
            all.push(...cols)
        }

        return { dateGroups: groups, allCols: all }
    }, [sessions, sels, yr])

    // ===== グリッドデータ (偏差値帯 × 列 → セル) =====
    const grid = useMemo(() => {
        const m = new Map<string, Map<string, UserExamSelection[]>>()
        for (const r of RANGES) m.set(r.key, new Map())

        for (const s of sels) {
            const es = s.exam_session
            if (!es?.test_date) continue

            const rk = rangeOf(es.yotsuya_80)
            const ck = `${es.test_date}_${es.time_period || '午前'}`

            const rm = m.get(rk)
            if (!rm) continue
            if (!rm.has(ck)) rm.set(ck, [])
            rm.get(ck)!.push(s)
        }

        return m
    }, [sels])

    // ===== 矢印データ =====
    const arrowConns = useMemo(() =>
        sels
            .filter(s => s.condition_source_id && s.condition_type === 'fail')
            .map(s => ({ id: `a-${s.condition_source_id}-${s.id}`, from: s.condition_source_id!, to: s.id }))
    , [sels])

    // ===== 矢印描画 =====
    const contentRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef(new Map<string, HTMLDivElement>())
    const [svgArrows, setSvgArrows] = useState<{ id: string; d: string }[]>([])

    const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
        if (el) cardRefs.current.set(id, el)
        else cardRefs.current.delete(id)
    }, [])

    useEffect(() => {
        const c = contentRef.current
        if (!c) return

        const calc = () => {
            if (arrowConns.length === 0) { setSvgArrows([]); return }

            const cr = c.getBoundingClientRect()
            const paths: { id: string; d: string }[] = []

            for (const a of arrowConns) {
                const fe = cardRefs.current.get(a.from)
                const te = cardRefs.current.get(a.to)
                if (!fe || !te) continue

                const fr = fe.getBoundingClientRect()
                const tr = te.getBoundingClientRect()

                const fx = fr.right - cr.left + 4
                const fy = fr.top + fr.height / 2 - cr.top
                const tx = tr.left - cr.left - 4
                const ty = tr.top + tr.height / 2 - cr.top
                const dx = Math.abs(tx - fx)
                const cp = Math.max(dx * 0.35, 40)

                paths.push({
                    id: a.id,
                    d: `M${fx},${fy} C${fx + cp},${fy} ${tx - cp},${ty} ${tx},${ty}`,
                })
            }

            setSvgArrows(paths)
        }

        const raf = requestAnimationFrame(calc)

        const ro = new ResizeObserver(() => requestAnimationFrame(calc))
        ro.observe(c)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
        }
    }, [arrowConns, sels])

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-teal-700">併願パターン</h1>

            {/* グローバル検索 */}
            <button
                onClick={() => setModal({ mode: 'global' })}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-teal-300 rounded-xl text-teal-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-colors"
            >
                <Search className="w-5 h-5" />
                <span className="text-sm">学校を検索して追加...</span>
            </button>

            {/* ===== グリッド ===== */}
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                <div ref={contentRef} className="min-w-fit relative">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `72px repeat(${allCols.length}, minmax(150px, 1fr))`,
                        }}
                    >
                        {/* ─── ヘッダー行1: 日付グループ ─── */}
                        <div className="bg-gray-100 border-b border-r border-gray-200" />
                        {dateGroups.map(g => (
                            <div
                                key={`dg-${g.date}`}
                                className={`border-b border-r border-gray-200 px-2 py-2.5 text-center font-bold text-sm ${
                                    g.isJan ? 'bg-amber-50 text-amber-700' : 'bg-teal-600 text-white'
                                }`}
                                style={{ gridColumn: `span ${g.cols.length}` }}
                            >
                                {g.label}
                            </div>
                        ))}

                        {/* ─── ヘッダー行2: 偏差値ラベル + 午前/午後 ─── */}
                        <div className="bg-gray-100 border-b-2 border-r border-gray-300 px-1 py-1.5 flex items-center justify-center sticky left-0 z-20">
                            <span className="text-[10px] font-bold text-gray-400">偏差値</span>
                        </div>
                        {allCols.map(col => (
                            <div
                                key={`ph-${col.key}`}
                                className={`border-b-2 border-r border-gray-300 px-1 py-1.5 text-center text-xs font-semibold ${
                                    col.period === '午後'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'bg-gray-50 text-gray-500'
                                }`}
                            >
                                {col.period}
                            </div>
                        ))}

                        {/* ─── データ行 (偏差値帯ごと) ─── */}
                        {RANGES.map(range => (
                            <Fragment key={range.key}>
                                {/* 行ラベル */}
                                <div className={`${range.bg} border-b border-r border-gray-200 px-1 py-3 flex items-center justify-center sticky left-0 z-20`}>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${range.labelBg}`}>
                                        {range.label}
                                    </span>
                                </div>

                                {/* セル */}
                                {allCols.map(col => {
                                    const cells = grid.get(range.key)?.get(col.key) || []

                                    return (
                                        <div
                                            key={`${range.key}-${col.key}`}
                                            className={`${range.bg} border-b border-r border-gray-100 p-1 min-h-[110px] group`}
                                        >
                                            {cells.map(sel => (
                                                <SchoolCard
                                                    key={sel.id}
                                                    sel={sel}
                                                    allSels={sels}
                                                    onToggleBranch={toggleBranch}
                                                    onAddFail={(srcId) =>
                                                        setModal({ mode: 'branch', sourceId: srcId, conditionType: 'fail' })
                                                    }
                                                    onRemove={handleRemove}
                                                    setRef={setCardRef}
                                                />
                                            ))}

                                            {/* セル追加ボタン (hover時に表示) */}
                                            <button
                                                onClick={() => setModal({
                                                    mode: 'date',
                                                    dateFilter: col.date,
                                                    periodFilter: col.period,
                                                })}
                                                className="w-full mt-0.5 py-1 border border-dashed border-transparent rounded text-gray-300 opacity-0 group-hover:opacity-100 group-hover:border-gray-300 hover:!border-teal-400 hover:!text-teal-500 hover:!bg-teal-50/30 transition-all flex items-center justify-center"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </Fragment>
                        ))}
                    </div>

                    {/* ===== SVG 矢印オーバーレイ ===== */}
                    {svgArrows.length > 0 && (
                        <svg
                            className="absolute inset-0 pointer-events-none overflow-visible"
                            style={{ zIndex: 15 }}
                        >
                            <defs>
                                <marker
                                    id="ah-red"
                                    viewBox="0 0 10 7"
                                    refX="9"
                                    refY="3.5"
                                    markerWidth="8"
                                    markerHeight="6"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                </marker>
                            </defs>
                            {svgArrows.map(a => (
                                <path
                                    key={a.id}
                                    d={a.d}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth={2.5}
                                    strokeDasharray="8 4"
                                    markerEnd="url(#ah-red)"
                                    opacity={0.7}
                                />
                            ))}
                        </svg>
                    )}
                </div>
            </div>

            {/* ===== 検索モーダル ===== */}
            {modal && (
                <SearchModal
                    state={modal}
                    sessions={sessions}
                    sels={sels}
                    onSelect={(esId) => {
                        if (modal.mode === 'branch' && modal.sourceId) {
                            addBranch(esId, modal.sourceId, modal.conditionType || 'fail')
                        } else {
                            addSchool(esId)
                        }
                    }}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}

// ============================================================
// 学校カード
// ============================================================

function SchoolCard({
    sel,
    allSels,
    onToggleBranch,
    onAddFail,
    onRemove,
    setRef,
}: {
    sel: UserExamSelection
    allSels: UserExamSelection[]
    onToggleBranch: (id: string, cur: string) => void
    onAddFail: (srcId: string) => void
    onRemove: (id: string) => void
    setRef: (id: string, el: HTMLDivElement | null) => void
}) {
    const es = sel.exam_session!
    const hasBr = sel.on_pass_action === 'end'
    const hasFailKid = allSels.some(s => s.condition_source_id === sel.id && s.condition_type === 'fail')
    const rc = rangeCfg(rangeOf(es.yotsuya_80))

    // 分岐先か判定
    const isOnBranch = !!sel.condition_source_id
    const branchSrc = isOnBranch ? allSels.find(s => s.id === sel.condition_source_id) : null

    return (
        <div
            ref={el => setRef(sel.id, el)}
            className={`rounded-lg p-2 mb-1.5 text-xs bg-white shadow-sm border transition-shadow hover:shadow-md ${
                hasBr ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'
            } ${isOnBranch ? 'border-l-[3px] border-l-red-400' : ''}`}
        >
            {/* 分岐元表示 */}
            {isOnBranch && branchSrc && (
                <div className="text-[9px] text-red-400 mb-1 flex items-center gap-0.5 truncate">
                    <XCircle className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="truncate">{branchSrc.exam_session?.school?.name}</span>
                    <span className="flex-shrink-0">x 不合格時</span>
                </div>
            )}

            <div className="flex items-start gap-1.5">
                {/* 偏差値バッジ */}
                <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[11px] flex-shrink-0 ring-1 ring-inset ${rc.badge}`}>
                    {es.yotsuya_80 ?? '?'}
                </div>

                {/* 学校情報 */}
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-800 truncate leading-tight text-[11px]">
                        {es.school?.name}
                    </div>
                    <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5 flex-wrap">
                        <span>{es.session_label}</span>
                        {es.exam_subjects_label && (
                            <span className="text-gray-300">|</span>
                        )}
                        {es.exam_subjects_label && <span>{es.exam_subjects_label}</span>}
                        {es.gender_type && (
                            <span className={
                                es.gender_type === '男子校' ? 'text-blue-400' :
                                es.gender_type === '女子校' ? 'text-pink-400' : 'text-purple-400'
                            }>
                                {es.gender_type === '共学' ? '共' : es.gender_type[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                        onClick={() => onToggleBranch(sel.id, sel.on_pass_action)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            hasBr
                                ? 'bg-amber-400 text-white hover:bg-amber-500'
                                : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'
                        }`}
                        title={hasBr ? '分岐を解除' : '合否で分岐'}
                    >
                        <GitBranch className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onRemove(sel.id)}
                        className="w-5 h-5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="削除"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* 時間情報 */}
            {(es.assembly_time || es.result_announcement) && (
                <div className="mt-1.5 pt-1 border-t border-gray-100 text-[9px] text-gray-400 space-y-0.5">
                    {es.assembly_time && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 flex-shrink-0 text-gray-300" />
                            <span>
                                {fmtTime(es.assembly_time)}集合
                                {es.estimated_end_time && `-${fmtTime(es.estimated_end_time)}終了`}
                            </span>
                        </div>
                    )}
                    {es.result_announcement && (
                        <div className="truncate">
                            <span className="text-gray-300">発表</span> {fmtAnnounce(es.result_announcement)}
                        </div>
                    )}
                </div>
            )}

            {/* 分岐情報 */}
            {hasBr && (
                <div className="mt-1.5 pt-1 border-t border-amber-200 space-y-0.5">
                    <div className="flex items-center gap-1 text-[9px] text-green-600 font-medium">
                        <CheckCircle className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>合格 → 受験終了</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-red-500">
                        <XCircle className="w-2.5 h-2.5 flex-shrink-0" />
                        {hasFailKid ? (
                            <span className="font-medium">不合格 → 代替校あり</span>
                        ) : (
                            <button
                                onClick={() => onAddFail(sel.id)}
                                className="font-medium underline decoration-dashed hover:text-red-700 transition-colors"
                            >
                                不合格の場合を追加
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
    sessions,
    sels,
    onSelect,
    onClose,
}: {
    state: ModalState
    sessions: ExamSession[]
    sels: UserExamSelection[]
    onSelect: (esId: string) => void
    onClose: () => void
}) {
    const [q, setQ] = useState('')

    const selIds = new Set(sels.map(s => s.exam_session_id))
    const branchIds = state.sourceId
        ? new Set(
            sels
                .filter(s => s.condition_source_id === state.sourceId && s.condition_type === state.conditionType)
                .map(s => s.exam_session_id)
        )
        : new Set<string>()

    const srcSel = state.sourceId ? sels.find(s => s.id === state.sourceId) : null

    const filtered = useMemo(() => {
        let ss = sessions

        if (state.dateFilter) {
            ss = ss.filter(s => s.test_date === state.dateFilter)
        }

        if (state.periodFilter) {
            ss = ss.filter(s => (s.time_period || '午前') === state.periodFilter)
        }

        if (state.mode === 'branch' && srcSel && !state.dateFilter) {
            const sd = srcSel.exam_session?.test_date
            if (sd) ss = ss.filter(s => s.test_date && s.test_date > sd)
        }

        const lq = q.toLowerCase()
        if (lq) {
            ss = ss.filter(s =>
                (s.school?.name || '').toLowerCase().includes(lq) ||
                (s.session_label || '').toLowerCase().includes(lq)
            )
        }

        ss = ss.filter(s => !branchIds.has(s.id))
        if (state.mode !== 'branch') ss = ss.filter(s => !selIds.has(s.id))
        if (srcSel) ss = ss.filter(s => s.id !== srcSel.exam_session_id)

        return ss
    }, [sessions, state, q, branchIds, selIds, srcSel])

    const groups = useMemo(() => {
        const gs: { key: string; label: string; items: ExamSession[] }[] = []
        const m = new Map<string, ExamSession[]>()
        for (const s of filtered) {
            const k = s.test_date!
            if (!m.has(k)) {
                m.set(k, [])
                gs.push({ key: k, label: fmtDate(k), items: m.get(k)! })
            }
            m.get(k)!.push(s)
        }
        return gs
    }, [filtered])

    let title: string
    if (state.mode === 'branch' && srcSel) {
        const cl = state.conditionType === 'pass' ? '合格' : '不合格'
        title = `${srcSel.exam_session?.school?.name} ${cl}の場合`
        if (state.dateFilter) title += ` (${fmtDate(state.dateFilter)})`
    } else if (state.dateFilter) {
        title = `${fmtDate(state.dateFilter)}${state.periodFilter ? ` ${state.periodFilter}` : ''} に追加`
    } else {
        title = '学校を追加'
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {state.mode === 'branch' && (
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="text-base font-bold text-gray-800">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 検索バー */}
                <div className="px-4 py-3 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="学校名で検索..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            autoFocus
                        />
                    </div>
                </div>

                {/* 結果リスト */}
                <div className="overflow-y-auto flex-1">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center py-8 text-sm">
                            {q ? '該当する学校がありません' : 'この日程の試験データがありません'}
                        </p>
                    ) : (
                        groups.map(g => (
                            <div key={g.key}>
                                <div className="px-4 py-1.5 bg-gray-50 text-xs font-bold text-gray-500 sticky top-0 border-b border-gray-100">
                                    {g.label}
                                </div>
                                {g.items.map(es => {
                                    const already = selIds.has(es.id)
                                    const rc = rangeCfg(rangeOf(es.yotsuya_80))

                                    return (
                                        <button
                                            key={es.id}
                                            onClick={() => onSelect(es.id)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3 border-b border-gray-50"
                                        >
                                            {/* 偏差値バッジ */}
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-inset ${rc.badge}`}>
                                                {es.yotsuya_80 ?? '?'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-gray-700 text-sm truncate">
                                                        {es.school?.name}
                                                    </span>
                                                    <span className={`text-[10px] px-1 rounded ${
                                                        es.time_period === '午後'
                                                            ? 'bg-indigo-100 text-indigo-600'
                                                            : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                        {es.time_period || '午前'}
                                                    </span>
                                                    {already && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full flex-shrink-0">
                                                            選択済
                                                        </span>
                                                    )}
                                                    {es.gender_type && (
                                                        <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                                                            es.gender_type === '男子校'
                                                                ? 'bg-blue-100 text-blue-600'
                                                                : es.gender_type === '女子校'
                                                                ? 'bg-pink-100 text-pink-600'
                                                                : 'bg-purple-100 text-purple-600'
                                                        }`}>
                                                            {es.gender_type === '共学' ? '共' : es.gender_type[0]}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    <span>{es.session_label}</span>
                                                    {es.exam_subjects_label && (
                                                        <span>{es.exam_subjects_label}</span>
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

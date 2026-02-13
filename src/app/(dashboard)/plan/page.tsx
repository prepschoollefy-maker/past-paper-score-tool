'use client'

import { Fragment, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection } from '@/types/database'
import { Search, Plus, X, Clock, Printer } from 'lucide-react'

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
    mode: 'global' | 'date'
    dateFilter?: string
    periodFilter?: '午前' | '午後'
}

interface DragState {
    fromSelId: string
    type: 'pass' | 'fail'
    startX: number
    startY: number
    curX: number
    curY: number
}

interface ArrowConn {
    id: string
    from: string
    to: string
    type: 'pass' | 'fail'
}

// ============================================================
// メインページ
// ============================================================

export default function PlanPage() {
    const [sessions, setSessions] = useState<ExamSession[]>([])
    const [sels, setSels] = useState<UserExamSelection[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<ModalState | null>(null)
    const [drag, setDrag] = useState<DragState | null>(null)
    const [hoveredSelId, setHoveredSelId] = useState<string | null>(null)
    const [printMode, setPrintMode] = useState(false)
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

    // ===== データ操作 =====

    const addSchool = async (esId: string) => {
        if (sels.find(s => s.exam_session_id === esId)) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('user_exam_selections').insert({ user_id: user.id, exam_session_id: esId })
        fetchData()
        setModal(null)
    }

    const handleRemove = async (id: string) => {
        await supabase.from('user_exam_selections')
            .update({ condition_source_id: null, condition_type: null })
            .eq('condition_source_id', id)
        await supabase.from('user_exam_selections').delete().eq('id', id)
        fetchData()
    }

    const createConnection = async (fromSelId: string, toSelId: string, type: 'pass' | 'fail') => {
        await supabase.from('user_exam_selections')
            .update({ condition_source_id: fromSelId, condition_type: type })
            .eq('id', toSelId)
        fetchData()
    }

    const deleteConnection = async (targetSelId: string) => {
        await supabase.from('user_exam_selections')
            .update({ condition_source_id: null, condition_type: null })
            .eq('id', targetSelId)
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

        for (const s of sessions) {
            if (s.test_date) {
                const d = new Date(s.test_date + 'T00:00:00')
                if (d.getMonth() === 0) ds.add(s.test_date)
            }
        }

        for (let d = 1; d <= 5; d++) ds.add(`${yr}-02-0${d}`)

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

    // ===== 矢印データ (pass + fail) =====
    const arrowConns: ArrowConn[] = useMemo(() =>
        sels
            .filter(s => s.condition_source_id && s.condition_type)
            .map(s => ({
                id: `a-${s.condition_source_id}-${s.id}`,
                from: s.condition_source_id!,
                to: s.id,
                type: s.condition_type as 'pass' | 'fail',
            }))
    , [sels])

    // ===== ホバー関連 =====
    const hoveredConnIds = useMemo(() => {
        if (!hoveredSelId) return new Set<string>()
        const ids = new Set<string>([hoveredSelId])
        for (const a of arrowConns) {
            if (a.from === hoveredSelId || a.to === hoveredSelId) {
                ids.add(a.from)
                ids.add(a.to)
            }
        }
        return ids
    }, [hoveredSelId, arrowConns])

    const visibleArrows = useMemo(() => {
        if (printMode) return arrowConns
        if (!hoveredSelId) return []
        return arrowConns.filter(a => a.from === hoveredSelId || a.to === hoveredSelId)
    }, [hoveredSelId, arrowConns, printMode])

    // ===== 矢印描画 (ホバー時のみ) =====
    const contentRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef(new Map<string, HTMLDivElement>())
    const [svgArrows, setSvgArrows] = useState<{ id: string; d: string; type: 'pass' | 'fail' }[]>([])

    const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
        if (el) cardRefs.current.set(id, el)
        else cardRefs.current.delete(id)
    }, [])

    useEffect(() => {
        const c = contentRef.current
        if (!c) return

        const calc = () => {
            if (visibleArrows.length === 0) { setSvgArrows([]); return }

            const cr = c.getBoundingClientRect()
            const paths: { id: string; d: string; type: 'pass' | 'fail' }[] = []

            for (const a of visibleArrows) {
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
                const cp = Math.max(dx * 0.4, 50)

                // 隣接列で距離が近い場合、上にアーチさせて視認性を確保
                const arc = dx < 180 ? -(180 - dx) * 0.5 : 0

                paths.push({
                    id: a.id,
                    d: `M${fx},${fy} C${fx + cp},${fy + arc} ${tx - cp},${ty + arc} ${tx},${ty}`,
                    type: a.type,
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
    }, [visibleArrows, sels])

    // ===== ドラッグ操作 =====
    const createConnectionRef = useRef(createConnection)
    createConnectionRef.current = createConnection

    const startDrag = useCallback((selId: string, type: 'pass' | 'fail', e: React.PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const c = contentRef.current
        if (!c) return

        const cr = c.getBoundingClientRect()
        const hr = (e.currentTarget as HTMLElement).getBoundingClientRect()

        const initialDrag: DragState = {
            fromSelId: selId,
            type,
            startX: hr.left + hr.width / 2 - cr.left,
            startY: hr.top + hr.height / 2 - cr.top,
            curX: e.clientX - cr.left,
            curY: e.clientY - cr.top,
        }
        setDrag(initialDrag)

        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'

        const handleMove = (ev: PointerEvent) => {
            const cr2 = contentRef.current?.getBoundingClientRect()
            if (!cr2) return
            setDrag(prev => prev ? {
                ...prev,
                curX: ev.clientX - cr2.left,
                curY: ev.clientY - cr2.top,
            } : null)
        }

        const handleUp = (ev: PointerEvent) => {
            const elements = document.elementsFromPoint(ev.clientX, ev.clientY)
            for (const el of elements) {
                if (el instanceof SVGElement) continue
                const card = (el as HTMLElement).closest?.('[data-drop-sel-id]')
                if (card) {
                    const targetId = card.getAttribute('data-drop-sel-id')!
                    if (targetId !== selId) {
                        createConnectionRef.current(selId, targetId, type)
                        break
                    }
                }
            }

            setDrag(null)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
            document.removeEventListener('pointermove', handleMove)
            document.removeEventListener('pointerup', handleUp)
        }

        document.addEventListener('pointermove', handleMove)
        document.addEventListener('pointerup', handleUp)
    }, [])

    // ===== ヒント表示判定 =====
    const showHint = sels.length >= 2 && arrowConns.length === 0

    if (loading) return <Loading />

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-teal-700">併願パターン</h1>
                {arrowConns.length > 0 && (
                    <button
                        onClick={() => setPrintMode(p => !p)}
                        className={`print:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            printMode
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Printer className="w-3.5 h-3.5" />
                        {printMode ? '編集モードに戻る' : '印刷モード'}
                    </button>
                )}
            </div>

            {/* グローバル検索 */}
            {!printMode && (
                <button
                    onClick={() => setModal({ mode: 'global' })}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-teal-300 rounded-xl text-teal-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-colors print:hidden"
                >
                    <Search className="w-5 h-5" />
                    <span className="text-sm">学校を検索して追加...</span>
                </button>
            )}

            {/* ヒント */}
            {showHint && !printMode && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600 print:hidden">
                    <span>
                        カード右端の
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 mx-0.5 align-middle" />
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 mx-0.5 align-middle" />
                        をドラッグして別のカードに接続すると、合否フローを作成できます
                    </span>
                </div>
            )}

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
                                                    onRemove={handleRemove}
                                                    onDeleteConnection={deleteConnection}
                                                    onDragStart={startDrag}
                                                    isDragTarget={!!drag && drag.fromSelId !== sel.id}
                                                    isHighlighted={!printMode && hoveredConnIds.has(sel.id)}
                                                    isDimmed={!printMode && !!hoveredSelId && !hoveredConnIds.has(sel.id)}
                                                    onHover={setHoveredSelId}
                                                    setRef={setCardRef}
                                                    printMode={printMode}
                                                />
                                            ))}

                                            {!printMode && (
                                                <button
                                                    onClick={() => setModal({
                                                        mode: 'date',
                                                        dateFilter: col.date,
                                                        periodFilter: col.period,
                                                    })}
                                                    className="w-full mt-0.5 py-1 border border-dashed border-transparent rounded text-gray-300 opacity-0 group-hover:opacity-100 group-hover:border-gray-300 hover:!border-teal-400 hover:!text-teal-500 hover:!bg-teal-50/30 transition-all flex items-center justify-center print:hidden"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </Fragment>
                        ))}
                    </div>

                    {/* ===== SVG 矢印オーバーレイ (ホバー時のみ表示) ===== */}
                    <svg
                        className="absolute inset-0 pointer-events-none overflow-visible"
                        style={{ zIndex: 30 }}
                    >
                        <defs>
                            <marker id="ah-green" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                            </marker>
                            <marker id="ah-red" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                            </marker>
                        </defs>

                        {/* ホバー時の矢印 */}
                        {svgArrows.map(a => (
                            <g key={a.id}>
                                {/* 白アウトライン (視認性向上) */}
                                <path
                                    d={a.d}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth={5}
                                    strokeLinecap="round"
                                />
                                {/* カラー矢印 */}
                                <path
                                    d={a.d}
                                    fill="none"
                                    stroke={a.type === 'pass' ? '#22c55e' : '#ef4444'}
                                    strokeWidth={2.5}
                                    strokeDasharray={a.type === 'fail' ? '8 4' : 'none'}
                                    markerEnd={`url(#ah-${a.type === 'pass' ? 'green' : 'red'})`}
                                />
                            </g>
                        ))}

                        {/* ドラッグ中の一時線 */}
                        {drag && (
                            <line
                                x1={drag.startX}
                                y1={drag.startY}
                                x2={drag.curX}
                                y2={drag.curY}
                                stroke={drag.type === 'pass' ? '#22c55e' : '#ef4444'}
                                strokeWidth={2.5}
                                strokeDasharray="6 3"
                                opacity={0.8}
                            />
                        )}
                    </svg>
                </div>
            </div>

            {/* ===== フロー概要パネル ===== */}
            {arrowConns.length > 0 && (
                <FlowSummaryPanel
                    sels={sels}
                    arrowConns={arrowConns}
                    onDeleteConnection={deleteConnection}
                    hoveredSelId={hoveredSelId}
                    onHover={setHoveredSelId}
                    printMode={printMode}
                />
            )}

            {/* ===== 検索モーダル ===== */}
            {modal && (
                <SearchModal
                    state={modal}
                    sessions={sessions}
                    sels={sels}
                    onSelect={addSchool}
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
    onRemove,
    onDeleteConnection,
    onDragStart,
    isDragTarget,
    isHighlighted,
    isDimmed,
    onHover,
    setRef,
    printMode,
}: {
    sel: UserExamSelection
    allSels: UserExamSelection[]
    onRemove: (id: string) => void
    onDeleteConnection: (targetId: string) => void
    onDragStart: (selId: string, type: 'pass' | 'fail', e: React.PointerEvent) => void
    isDragTarget: boolean
    isHighlighted: boolean
    isDimmed: boolean
    onHover: (selId: string | null) => void
    setRef: (id: string, el: HTMLDivElement | null) => void
    printMode: boolean
}) {
    const es = sel.exam_session!
    const rc = rangeCfg(rangeOf(es.yotsuya_80))

    // 受信接続 (この学校への矢印)
    const incoming = sel.condition_source_id
        ? allSels.find(s => s.id === sel.condition_source_id)
        : null
    const incomingType = sel.condition_type

    // 送信接続 (この学校からの矢印)
    const outgoing = allSels.filter(s => s.condition_source_id === sel.id)
    const passTargets = outgoing.filter(s => s.condition_type === 'pass')
    const failTargets = outgoing.filter(s => s.condition_type === 'fail')

    return (
        <div
            ref={el => setRef(sel.id, el)}
            data-drop-sel-id={sel.id}
            onMouseEnter={() => onHover(sel.id)}
            onMouseLeave={() => onHover(null)}
            className={`relative rounded-lg p-2 ${printMode ? '' : 'pr-6'} mb-1.5 text-xs bg-white shadow-sm border transition-all hover:shadow-md ${
                isDragTarget ? 'ring-2 ring-blue-400/60 border-blue-300'
                : isHighlighted ? 'ring-2 ring-teal-400/60 border-teal-300 shadow-md'
                : 'border-gray-200'
            } ${isDimmed ? 'opacity-40' : ''} ${
                incoming ? (incomingType === 'pass' ? 'border-l-[3px] border-l-green-400' : 'border-l-[3px] border-l-red-400') : ''
            }`}
            style={{ zIndex: isHighlighted ? 25 : undefined }}
        >
            {/* ─── 接続ハンドル (右端) ─── */}
            {!printMode && (
                <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-1.5 w-5 opacity-50 hover:opacity-100 transition-opacity print:hidden">
                    <div
                        className="w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white shadow-sm cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                        title="合格 (ドラッグで接続)"
                        onPointerDown={e => onDragStart(sel.id, 'pass', e)}
                    />
                    <div
                        className="w-3.5 h-3.5 rounded-full bg-red-400 border-2 border-white shadow-sm cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                        title="不合格 (ドラッグで接続)"
                        onPointerDown={e => onDragStart(sel.id, 'fail', e)}
                    />
                </div>
            )}

            {/* ─── 受信接続ラベル ─── */}
            {incoming && (
                <div className={`mb-1 flex items-center gap-0.5 text-[9px] ${
                    incomingType === 'pass' ? 'text-green-500' : 'text-red-400'
                }`}>
                    <span className="flex-shrink-0">{incomingType === 'pass' ? '○' : 'x'}</span>
                    <span className="truncate">{incoming.exam_session?.school?.name}</span>
                    <span className="flex-shrink-0">{incomingType === 'pass' ? '合格時' : '不合格時'}</span>
                    {!printMode && (
                        <button
                            onClick={() => onDeleteConnection(sel.id)}
                            className="flex-shrink-0 ml-auto w-3.5 h-3.5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 print:hidden"
                            title="接続を削除"
                        >
                            <X className="w-2.5 h-2.5" />
                        </button>
                    )}
                </div>
            )}

            {/* ─── メインコンテンツ ─── */}
            <div className="flex items-start gap-1.5">
                <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[11px] flex-shrink-0 ring-1 ring-inset ${rc.badge}`}>
                    {es.yotsuya_80 ?? '?'}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-800 truncate leading-tight text-[11px]">
                        {es.school?.name}
                    </div>
                    <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5 flex-wrap">
                        <span>{es.session_label}</span>
                        {es.exam_subjects_label && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span>{es.exam_subjects_label}</span>
                            </>
                        )}
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

                {!printMode && (
                    <button
                        onClick={() => onRemove(sel.id)}
                        className="w-5 h-5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0 print:hidden"
                        title="削除"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* ─── 時間情報 ─── */}
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

            {/* ─── 送信接続ラベル ─── */}
            {(passTargets.length > 0 || failTargets.length > 0) && (
                <div className="mt-1.5 pt-1 border-t border-gray-100 space-y-0.5">
                    {passTargets.map(t => (
                        <div key={t.id} className="flex items-center gap-0.5 text-[9px] text-green-600">
                            <span className="flex-shrink-0 font-medium">○→</span>
                            <span className="truncate">{t.exam_session?.school?.name}</span>
                            {!printMode && (
                                <button
                                    onClick={() => onDeleteConnection(t.id)}
                                    className="flex-shrink-0 ml-auto w-3.5 h-3.5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 print:hidden"
                                    title="接続を削除"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            )}
                        </div>
                    ))}
                    {failTargets.map(t => (
                        <div key={t.id} className="flex items-center gap-0.5 text-[9px] text-red-500">
                            <span className="flex-shrink-0 font-medium">x→</span>
                            <span className="truncate">{t.exam_session?.school?.name}</span>
                            {!printMode && (
                                <button
                                    onClick={() => onDeleteConnection(t.id)}
                                    className="flex-shrink-0 ml-auto w-3.5 h-3.5 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 print:hidden"
                                    title="接続を削除"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ============================================================
// フロー概要パネル
// ============================================================

function FlowSummaryPanel({
    sels,
    arrowConns,
    onDeleteConnection,
    hoveredSelId,
    onHover,
    printMode,
}: {
    sels: UserExamSelection[]
    arrowConns: ArrowConn[]
    onDeleteConnection: (targetId: string) => void
    hoveredSelId: string | null
    onHover: (selId: string | null) => void
    printMode: boolean
}) {
    // 子マップ構築
    const childMap = useMemo(() => {
        const m = new Map<string, { sel: UserExamSelection; type: 'pass' | 'fail' }[]>()
        for (const s of sels) {
            if (s.condition_source_id && s.condition_type) {
                if (!m.has(s.condition_source_id)) m.set(s.condition_source_id, [])
                m.get(s.condition_source_id)!.push({ sel: s, type: s.condition_type as 'pass' | 'fail' })
            }
        }
        return m
    }, [sels])

    // ルートノード (接続元がないが、接続先を持つ)
    const roots = useMemo(() => {
        return sels.filter(s => !s.condition_source_id && childMap.has(s.id))
    }, [sels, childMap])

    const renderNode = (sel: UserExamSelection, type: 'pass' | 'fail' | null, depth: number, visited: Set<string>): React.ReactNode[] => {
        if (visited.has(sel.id)) return []
        visited.add(sel.id)

        const es = sel.exam_session
        const children = childMap.get(sel.id) || []
        const isHovered = hoveredSelId === sel.id
        const lines: React.ReactNode[] = []

        lines.push(
            <div
                key={sel.id}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors cursor-default ${
                    isHovered ? 'bg-teal-50' : 'hover:bg-gray-50'
                }`}
                style={{ paddingLeft: 8 + depth * 24 }}
                onMouseEnter={() => onHover(sel.id)}
                onMouseLeave={() => onHover(null)}
            >
                {type === 'pass' && (
                    <span className="text-green-500 font-bold text-xs flex-shrink-0">○→</span>
                )}
                {type === 'fail' && (
                    <span className="text-red-400 font-bold text-xs flex-shrink-0">×→</span>
                )}
                {!type && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                )}
                <span className="text-xs font-semibold text-gray-700">{es?.school?.name}</span>
                <span className="text-[10px] text-gray-400">{es?.session_label}</span>
                {es?.test_date && (
                    <span className="text-[10px] text-gray-300">{fmtDate(es.test_date)}</span>
                )}
                {type && !printMode && (
                    <button
                        onClick={() => onDeleteConnection(sel.id)}
                        className="ml-auto flex-shrink-0 w-4 h-4 rounded hover:bg-gray-200 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors print:hidden"
                        title="接続を削除"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        )

        // pass を先に、fail を後に
        const sorted = [...children].sort((a, b) => (a.type === 'pass' ? -1 : 1) - (b.type === 'pass' ? -1 : 1))
        for (const c of sorted) {
            lines.push(...renderNode(c.sel, c.type, depth + 1, visited))
        }

        return lines
    }

    const visited = new Set<string>()

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500">フロー概要</h3>
                {!printMode && <p className="text-[10px] text-gray-400 mt-0.5 print:hidden">グリッド上のカードにホバーすると矢印が表示されます</p>}
            </div>
            <div className="py-2">
                {roots.map(r => renderNode(r, null, 0, visited))}
            </div>
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

    const filtered = useMemo(() => {
        let ss = sessions

        if (state.dateFilter) {
            ss = ss.filter(s => s.test_date === state.dateFilter)
        }

        if (state.periodFilter) {
            ss = ss.filter(s => (s.time_period || '午前') === state.periodFilter)
        }

        const lq = q.toLowerCase()
        if (lq) {
            ss = ss.filter(s =>
                (s.school?.name || '').toLowerCase().includes(lq) ||
                (s.session_label || '').toLowerCase().includes(lq)
            )
        }

        ss = ss.filter(s => !selIds.has(s.id))

        return ss
    }, [sessions, state, q, selIds])

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
    if (state.dateFilter) {
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
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

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
                                    const rc = rangeCfg(rangeOf(es.yotsuya_80))

                                    return (
                                        <button
                                            key={es.id}
                                            onClick={() => onSelect(es.id)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3 border-b border-gray-50"
                                        >
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

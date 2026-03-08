'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExamSession, UserExamSelection } from '@/types/database'
import { Search, Plus, Printer, AlertTriangle, CalendarPlus, X } from 'lucide-react'
import ExamCard, { type FlowConn, type ConnectingState, type HighlightType } from './_components/ExamCard'
import ScenarioPanel from './_components/ScenarioPanel'
import SearchModal, { type ModalState } from './_components/SearchModal'

// ============================================================
// ユーティリティ
// ============================================================

const DAYS = ['日', '月', '火', '水', '木', '金', '土']
function fmtDate(d: string) { return `${new Date(d + 'T00:00:00').getMonth() + 1}/${new Date(d + 'T00:00:00').getDate()}` }
function fmtDow(d: string) { return DAYS[new Date(d + 'T00:00:00').getDay()] }
function fmtTime(v: string | null | undefined) {
    if (!v) return ''
    const m = v.match(/(\d{1,2}):(\d{2})/)
    return m ? `${m[1]}:${m[2]}` : v
}
function fmtDatetime(v: string | null | undefined) {
    if (!v) return ''
    try { const d = new Date(v); if (!isNaN(d.getTime())) return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}` } catch {}
    return v
}
function parseMinutes(t: string) { const m = t.match(/(\d{1,2}):(\d{2})/); return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0 }
function dateOfTs(v: string) { try { const d = new Date(v); if (!isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` } catch {} return '' }

// ============================================================
// 型
// ============================================================

interface DayData {
    date: string; isJan: boolean; dow: number
    am: UserExamSelection[]; pm: UserExamSelection[]
    events: { type: 'result' | 'deadline'; school: string; time: string }[]
}
interface ArrowConn { id: string; from: string; to: string; type: 'pass' | 'fail' }
interface ExamConnection { id: string; source_selection_id: string; target_selection_id: string; condition_type: 'pass' | 'fail'; user_id: string }
interface Warning { severity: 'error' | 'warning'; message: string }

// ============================================================
// メインページ
// ============================================================

export default function PlanPage() {
    const [sessions, setSessions] = useState<ExamSession[]>([])
    const [sels, setSels] = useState<UserExamSelection[]>([])
    const [conns, setConns] = useState<ExamConnection[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<ModalState | null>(null)
    const [connecting, setConnecting] = useState<ConnectingState | null>(null)
    const [printMode, setPrintMode] = useState(false)
    const [hoveredSelId, setHoveredSelId] = useState<string | null>(null)
    const supabase = createClient()

    const fetchData = useCallback(async () => {
        const [sr, slr, cr] = await Promise.all([
            supabase.from('exam_sessions').select('*, school:schools(*)').not('test_date', 'is', null).order('test_date'),
            supabase.from('user_exam_selections').select('*, exam_session:exam_sessions(*, school:schools(*))').order('created_at'),
            supabase.from('exam_connections').select('*'),
        ])
        if (sr.data) setSessions(sr.data)
        if (slr.data) setSels(slr.data)
        if (cr.data) setConns(cr.data)
        setLoading(false)
    }, [supabase])

    useEffect(() => { fetchData() }, [fetchData])

    // ===== CRUD =====
    const addSchool = async (esId: string) => {
        if (sels.find(s => s.exam_session_id === esId)) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('user_exam_selections').insert({ user_id: user.id, exam_session_id: esId })
        fetchData(); setModal(null)
    }
    const handleRemove = async (id: string) => {
        // 関連する接続も削除（source/targetどちらでも）
        await supabase.from('exam_connections').delete().eq('source_selection_id', id)
        await supabase.from('exam_connections').delete().eq('target_selection_id', id)
        await supabase.from('user_exam_selections').delete().eq('id', id)
        fetchData()
    }
    const createConnection = async (fromSelId: string, toSelId: string, type: 'pass' | 'fail') => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        // 同じsource+typeの既存接続を削除（1つのソースからpass/failそれぞれ1本）
        await supabase.from('exam_connections').delete()
            .eq('source_selection_id', fromSelId).eq('condition_type', type)
        await supabase.from('exam_connections').insert({
            user_id: user.id,
            source_selection_id: fromSelId,
            target_selection_id: toSelId,
            condition_type: type,
        })
        setConnecting(null); fetchData()
    }
    const deleteConnection = async (connId: string) => {
        await supabase.from('exam_connections').delete().eq('id', connId)
        fetchData()
    }

    // ===== 接続モード =====
    const startConnect = useCallback((selId: string, type: 'pass' | 'fail') => setConnecting({ fromSelId: selId, type }), [])
    const selectTarget = useCallback((targetSelId: string) => {
        if (!connecting) return
        createConnection(connecting.fromSelId, targetSelId, connecting.type)
    }, [connecting])
    const cancelConnect = useCallback(() => setConnecting(null), [])

    // ===== 年度 =====
    const yr = useMemo(() => {
        for (const s of sels) if (s.exam_session?.year) return s.exam_session.year
        for (const s of sessions) if (s.year) return s.year
        const n = new Date(); return n.getMonth() <= 2 ? n.getFullYear() : n.getFullYear() + 1
    }, [sels, sessions])

    // ===== フロー情報 =====
    const selMap = useMemo(() => {
        const m = new Map<string, UserExamSelection>()
        for (const s of sels) m.set(s.id, s)
        return m
    }, [sels])

    const flowMap = useMemo(() => {
        const m = new Map<string, FlowConn>()
        for (const s of sels) m.set(s.id, {})
        for (const c of conns) {
            const parent = m.get(c.source_selection_id)
            if (!parent) continue
            const target = selMap.get(c.target_selection_id)
            const name = target?.exam_session?.school?.name || ''
            if (c.condition_type === 'pass') parent.pass = { targetSelId: c.target_selection_id, schoolName: name, isEnd: false, connId: c.id }
            else parent.fail = { targetSelId: c.target_selection_id, schoolName: name, connId: c.id }
        }
        for (const s of sels) {
            const f = m.get(s.id)
            if (f && !f.pass && s.on_pass_action === 'end') f.pass = { targetSelId: s.id, schoolName: '', isEnd: true }
        }
        return m
    }, [sels, conns, selMap])

    // ===== 入力接続マップ（各カードへの入力接続情報） =====
    const incomingMap = useMemo(() => {
        const m = new Map<string, { sourceId: string; type: 'pass' | 'fail' }[]>()
        for (const c of conns) {
            if (!m.has(c.target_selection_id)) m.set(c.target_selection_id, [])
            m.get(c.target_selection_id)!.push({ sourceId: c.source_selection_id, type: c.condition_type })
        }
        return m
    }, [conns])

    // ===== 矢印データ =====
    const arrowConns: ArrowConn[] = useMemo(() =>
        conns.map(c => ({
            id: c.id,
            from: c.source_selection_id, to: c.target_selection_id,
            type: c.condition_type,
        }))
    , [conns])

    // ===== ホバーハイライトマップ =====
    const highlightMap = useMemo(() => {
        const m = new Map<string, HighlightType>()
        if (!hoveredSelId) return m
        for (const a of arrowConns) {
            if (a.from === hoveredSelId) m.set(a.to, a.type === 'pass' ? 'pass-target' : 'fail-target')
            if (a.to === hoveredSelId) m.set(a.from, a.type === 'pass' ? 'pass-source' : 'fail-source')
        }
        return m
    }, [hoveredSelId, arrowConns])

    // ===== SVGベジェ曲線 =====
    const contentRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef(new Map<string, HTMLDivElement>())
    const setCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
        if (el) cardRefs.current.set(id, el); else cardRefs.current.delete(id)
    }, [])

    const [curves, setCurves] = useState<{
        id: string; d: string; type: 'pass' | 'fail'
        fromSelId: string; toSelId: string
    }[]>([])

    useEffect(() => {
        const c = contentRef.current
        if (!c || arrowConns.length === 0) { setCurves([]); return }

        const calc = () => {
            const cr = c.getBoundingClientRect()
            const paths: typeof curves = []

            for (const a of arrowConns) {
                const fe = cardRefs.current.get(a.from)
                const te = cardRefs.current.get(a.to)
                if (!fe || !te) continue

                const fr = fe.getBoundingClientRect()
                const tr = te.getBoundingClientRect()

                const sx = fr.right - cr.left
                const sy = fr.top + (a.type === 'pass' ? fr.height * 0.35 : fr.height * 0.65) - cr.top
                const tx = tr.left - cr.left
                const ty = tr.top + tr.height / 2 - cr.top

                // 水平→垂直→水平のL字パス（フローチャート式）
                const mx = (sx + tx) / 2
                const d = `M${sx},${sy} H${mx} V${ty} H${tx}`

                paths.push({
                    id: a.id, d,
                    type: a.type,
                    fromSelId: a.from, toSelId: a.to,
                })
            }
            setCurves(paths)
        }

        const raf = requestAnimationFrame(calc)
        const ro = new ResizeObserver(() => requestAnimationFrame(calc))
        ro.observe(c)
        return () => { cancelAnimationFrame(raf); ro.disconnect() }
    }, [arrowConns, sels])

    // ===== 日データ =====
    const days = useMemo(() => {
        const dates = new Set<string>()
        for (const s of sels) if (s.exam_session?.test_date) dates.add(s.exam_session.test_date)
        if (dates.size === 0) return []
        const sorted = Array.from(dates).sort()
        const byKey = new Map<string, UserExamSelection[]>()
        for (const s of sels) {
            const es = s.exam_session; if (!es?.test_date) continue
            const k = `${es.test_date}_${es.time_period || '午前'}`
            if (!byKey.has(k)) byKey.set(k, []); byKey.get(k)!.push(s)
        }
        const evtByDate = new Map<string, DayData['events']>()
        for (const s of sels) {
            const es = s.exam_session; if (!es) continue
            if (es.result_announcement) {
                const d = dateOfTs(es.result_announcement)
                if (d && d !== es.test_date) { if (!evtByDate.has(d)) evtByDate.set(d, []); evtByDate.get(d)!.push({ type: 'result', school: es.school?.name || '', time: fmtDatetime(es.result_announcement)?.split(' ')[1] || '' }) }
            }
            if (es.enrollment_deadline) {
                const d = dateOfTs(es.enrollment_deadline)
                if (d) { if (!evtByDate.has(d)) evtByDate.set(d, []); evtByDate.get(d)!.push({ type: 'deadline', school: es.school?.name || '', time: fmtDatetime(es.enrollment_deadline)?.split(' ')[1] || '' }) }
            }
        }
        return sorted.map(date => {
            const d = new Date(date + 'T00:00:00')
            return { date, isJan: d.getMonth() === 0, dow: d.getDay(), am: byKey.get(`${date}_午前`) || [], pm: byKey.get(`${date}_午後`) || [], events: evtByDate.get(date) || [] } satisfies DayData
        })
    }, [sels])

    const janDays = useMemo(() => days.filter(d => d.isJan), [days])
    const febDays = useMemo(() => days.filter(d => !d.isJan), [days])

    // ===== 警告 =====
    const warnings = useMemo(() => {
        const w: Warning[] = []
        const byDate = new Map<string, { am: UserExamSelection[]; pm: UserExamSelection[] }>()
        for (const s of sels) {
            const es = s.exam_session; if (!es?.test_date) continue
            if (!byDate.has(es.test_date)) byDate.set(es.test_date, { am: [], pm: [] })
            ;(es.time_period === '午後' ? byDate.get(es.test_date)!.pm : byDate.get(es.test_date)!.am).push(s)
        }
        for (const [date, { am, pm }] of byDate) {
            if (am.length > 1) w.push({ severity: 'error', message: `${fmtDate(date)} 午前に${am.length}校が重複` })
            if (pm.length > 1) w.push({ severity: 'error', message: `${fmtDate(date)} 午後に${pm.length}校が重複` })
            if (am.length > 0 && pm.length > 0) {
                for (const a of am) { const endT = a.exam_session?.estimated_end_time; if (!endT) continue
                    for (const p of pm) { const startT = p.exam_session?.assembly_time; if (!startT) continue
                        const gap = parseMinutes(startT) - parseMinutes(endT)
                        if (gap < 90) w.push({ severity: gap < 60 ? 'error' : 'warning', message: `${fmtDate(date)}: ${a.exam_session?.school?.name}(~${fmtTime(endT)}) → ${p.exam_session?.school?.name}(${fmtTime(startT)}) 移動${gap}分` })
                    }
                }
            }
        }
        return w
    }, [sels])

    const handleHover = useCallback((selId: string | null) => setHoveredSelId(selId), [])

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400" /></div>

    if (sels.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mb-6"><CalendarPlus className="w-10 h-10 text-teal-400" /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">受験計画</h1>
            <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">受験校を追加して、併願パターンを組み立てましょう。<br />合否フローやシナリオ別の費用も自動で計算します。</p>
            <button onClick={() => setModal({ mode: 'global' })} className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"><Search className="w-5 h-5" />学校を追加する</button>
            {modal && <SearchModal state={modal} sessions={sessions} sels={sels} onSelect={addSchool} onClose={() => setModal(null)} />}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">受験計画</h1>
                    <p className="text-sm text-gray-400">{yr}年度 · {sels.length}校選択中</p>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                    {!printMode && <button onClick={() => setModal({ mode: 'global' })} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"><Plus className="w-4 h-4" />追加</button>}
                    {arrowConns.length > 0 && <button onClick={() => setPrintMode(p => !p)} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${printMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}><Printer className="w-4 h-4" /></button>}
                </div>
            </div>

            {/* 接続モードバナー */}
            {connecting && (
                <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl print:hidden">
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-sm ${connecting.type === 'pass' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{connecting.type === 'pass' ? '○' : '×'}</span>
                        {connecting.type === 'pass' ? '合格' : '不合格'}の接続先カードをクリック
                    </div>
                    <button onClick={cancelConnect} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-blue-500 hover:bg-blue-100 transition-colors"><X className="w-4 h-4" />キャンセル</button>
                </div>
            )}

            {/* 警告 */}
            {warnings.length > 0 && !printMode && (
                <div className="space-y-2 print:hidden">
                    {warnings.map((w, i) => (
                        <div key={i} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${w.severity === 'error' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />{w.message}
                        </div>
                    ))}
                </div>
            )}

            {/* タイムライン */}
            <div className="overflow-x-auto pb-2">
                <div ref={contentRef} className="min-w-fit relative">
                    {/* SVG矢印 */}
                    {curves.length > 0 && (
                        <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 10 }}>
                            <defs>
                                <marker id="ah-pass" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                                </marker>
                                <marker id="ah-fail" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                                </marker>
                            </defs>
                            {curves.map(r => {
                                const isPass = r.type === 'pass'
                                const col = isPass ? '#22c55e' : '#ef4444'
                                const hov = hoveredSelId && (r.fromSelId === hoveredSelId || r.toSelId === hoveredSelId)
                                const op = hoveredSelId ? (hov ? 1 : 0.1) : 0.55
                                return (
                                    <g key={r.id} opacity={op}>
                                        <path d={r.d} fill="none" stroke={col} strokeWidth={1.5}
                                            markerEnd={`url(#ah-${isPass ? 'pass' : 'fail'})`} />
                                    </g>
                                )
                            })}
                        </svg>
                    )}

                    <div className="flex items-start gap-5">
                        {janDays.length > 0 && (
                            <>
                                <div>
                                    <div className="text-xs font-bold text-amber-500 mb-3 px-1">お試し受験</div>
                                    <div className="flex gap-12">
                                        {janDays.map(day => <DayCol key={day.date} day={day} flowMap={flowMap} incomingMap={incomingMap} connecting={connecting} highlightMap={highlightMap} printMode={printMode} onAddClick={(d, p) => setModal({ mode: 'date', dateFilter: d, periodFilter: p })} onRemove={handleRemove} onStartConnect={startConnect} onSelectAsTarget={selectTarget} onDeleteConnection={deleteConnection} onHover={handleHover} setCardRef={setCardRef} />)}
                                    </div>
                                </div>
                                <div className="self-stretch flex items-center pt-8"><div className="w-px h-full bg-gray-200 min-h-[100px]" /></div>
                            </>
                        )}
                        {febDays.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-teal-600 mb-3 px-1">本番</div>
                                <div className="flex gap-12">
                                    {febDays.map(day => <DayCol key={day.date} day={day} flowMap={flowMap} incomingMap={incomingMap} connecting={connecting} highlightMap={highlightMap} printMode={printMode} onAddClick={(d, p) => setModal({ mode: 'date', dateFilter: d, periodFilter: p })} onRemove={handleRemove} onStartConnect={startConnect} onSelectAsTarget={selectTarget} onDeleteConnection={deleteConnection} onHover={handleHover} setCardRef={setCardRef} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* シナリオ */}
            <ScenarioPanel sels={sels} arrowConns={arrowConns} hoveredSelId={hoveredSelId} onHover={handleHover} printMode={printMode} />

            {/* モーダル */}
            {modal && <SearchModal state={modal} sessions={sessions} sels={sels} onSelect={addSchool} onClose={() => setModal(null)} />}
        </div>
    )
}

// ============================================================
// 日カラム
// ============================================================

function DayCol({
    day, flowMap, incomingMap, connecting, highlightMap, printMode,
    onAddClick, onRemove, onStartConnect, onSelectAsTarget, onDeleteConnection, onHover, setCardRef,
}: {
    day: DayData; flowMap: Map<string, FlowConn>; incomingMap: Map<string, { sourceId: string; type: 'pass' | 'fail' }[]>; connecting: ConnectingState | null; highlightMap: Map<string, HighlightType>; printMode: boolean
    onAddClick: (date: string, period: '午前' | '午後') => void
    onRemove: (id: string) => void
    onStartConnect: (selId: string, type: 'pass' | 'fail') => void
    onSelectAsTarget: (selId: string) => void
    onDeleteConnection: (connId: string) => void
    onHover: (selId: string | null) => void
    setCardRef: (id: string, el: HTMLDivElement | null) => void
}) {
    const dowCls = day.dow === 0 ? 'text-red-500' : day.dow === 6 ? 'text-blue-500' : 'text-gray-800'
    const hasPm = day.pm.length > 0
    const total = day.am.length + day.pm.length

    const renderCard = (sel: UserExamSelection) => (
        <div key={sel.id} ref={el => setCardRef(sel.id, el)}>
            <ExamCard sel={sel} flow={flowMap.get(sel.id) || {}}
                incoming={incomingMap.get(sel.id) || []}
                connecting={connecting}
                highlight={highlightMap.get(sel.id) || null}
                onRemove={onRemove} onStartConnect={onStartConnect} onSelectAsTarget={onSelectAsTarget}
                onDeleteConnection={onDeleteConnection} onHover={onHover} printMode={printMode} />
        </div>
    )

    return (
        <div className="w-[260px] min-w-[260px]">
            <div className="mb-3">
                <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black ${dowCls}`}>{fmtDate(day.date)}</span>
                    <span className={`text-sm font-bold ${dowCls}`}>{fmtDow(day.date)}</span>
                    <span className="text-xs text-gray-300 ml-1">{total}校</span>
                </div>
            </div>

            {day.am.length > 0 && (
                <div className="mb-1">
                    {(hasPm || !printMode) && <div className="text-[11px] font-bold text-gray-300 mb-1.5 uppercase tracking-widest">午前</div>}
                    {day.am.map(renderCard)}
                </div>
            )}
            {day.am.length === 0 && !printMode && (
                <div className="mb-1">
                    <div className="text-[11px] font-bold text-gray-300 mb-1.5 uppercase tracking-widest">午前</div>
                    <button onClick={() => onAddClick(day.date, '午前')} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-300 hover:border-teal-300 hover:text-teal-500 transition-colors flex items-center justify-center text-sm print:hidden"><Plus className="w-4 h-4" /></button>
                </div>
            )}

            {(hasPm || !printMode) && (
                <div className="mt-3">
                    <div className="text-[11px] font-bold text-indigo-300 mb-1.5 uppercase tracking-widest">午後</div>
                    {day.pm.map(renderCard)}
                    {day.pm.length === 0 && !printMode && (
                        <button onClick={() => onAddClick(day.date, '午後')} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-300 hover:border-indigo-300 hover:text-indigo-400 transition-colors flex items-center justify-center text-sm print:hidden"><Plus className="w-4 h-4" /></button>
                    )}
                </div>
            )}

            {day.events.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                    {day.events.map((evt, i) => (
                        <div key={i} className={`text-xs font-medium flex items-center gap-1.5 ${evt.type === 'result' ? 'text-orange-400' : 'text-red-400'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            <span className="truncate">{evt.school}</span>
                            <span className="flex-shrink-0">{evt.type === 'result' ? '発表' : '締切'} {evt.time}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

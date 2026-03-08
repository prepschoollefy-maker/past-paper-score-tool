'use client'

import { memo } from 'react'
import type { UserExamSelection } from '@/types/database'
import { X, Link2, Trash2 } from 'lucide-react'

const BADGE: Record<string, string> = {
    '65': 'bg-violet-500 text-white',
    '60': 'bg-blue-500 text-white',
    '55': 'bg-teal-500 text-white',
    '50': 'bg-emerald-500 text-white',
    '45': 'bg-amber-500 text-white',
    def: 'bg-gray-400 text-white',
}

function bk(v: number | null | undefined) {
    if (v == null) return 'def'
    if (v >= 65) return '65'
    if (v >= 60) return '60'
    if (v >= 55) return '55'
    if (v >= 50) return '50'
    if (v >= 45) return '45'
    return 'def'
}

function t(v: string | null | undefined) {
    if (!v) return ''
    const m = v.match(/(\d{1,2}):(\d{2})/)
    return m ? `${m[1]}:${m[2]}` : v
}

function dt(v: string | null | undefined) {
    if (!v) return ''
    try {
        const d = new Date(v)
        if (!isNaN(d.getTime()))
            return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    } catch { /* */ }
    return v
}

export interface FlowConn {
    pass?: { targetSelId: string; schoolName: string; isEnd: boolean; connId?: string }
    fail?: { targetSelId: string; schoolName: string; connId?: string }
}

export interface ConnectingState {
    fromSelId: string
    type: 'pass' | 'fail'
}

export type HighlightType = 'pass-source' | 'pass-target' | 'fail-source' | 'fail-target' | null

interface Props {
    sel: UserExamSelection
    flow: FlowConn
    incoming: { sourceId: string; type: 'pass' | 'fail' }[]
    connecting: ConnectingState | null
    highlight: HighlightType
    onRemove: (id: string) => void
    onStartConnect: (selId: string, type: 'pass' | 'fail') => void
    onSelectAsTarget: (selId: string) => void
    onDeleteConnection: (connId: string) => void
    onHover: (selId: string | null) => void
    printMode: boolean
}

export default memo(function ExamCard({
    sel, flow, incoming, connecting, highlight, onRemove, onStartConnect, onSelectAsTarget,
    onDeleteConnection, onHover, printMode,
}: Props) {
    const es = sel.exam_session!
    const badge = BADGE[bk(es.yotsuya_80)] ?? BADGE.def
    const hasIn = incoming.length > 0

    // このカードが接続先候補か
    const isTarget = connecting && connecting.fromSelId !== sel.id
    // このカードが接続元として選択中か
    const isSource = connecting?.fromSelId === sel.id

    // ハイライトスタイル
    const hlCls = highlight === 'pass-source' || highlight === 'pass-target'
        ? 'ring-2 ring-green-400 border-green-300 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
        : highlight === 'fail-source' || highlight === 'fail-target'
            ? 'ring-2 ring-red-400 border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
            : ''

    return (
        <div
            onMouseEnter={() => onHover(sel.id)}
            onMouseLeave={() => onHover(null)}
            onClick={isTarget ? () => onSelectAsTarget(sel.id) : undefined}
            className={[
                'group/card relative rounded-xl p-3 mb-2.5 bg-white border-2 transition-all duration-200',
                isTarget ? 'border-blue-300 bg-blue-50/50 cursor-pointer hover:border-blue-400 hover:shadow-lg ring-2 ring-blue-200' :
                    isSource ? 'border-teal-400 ring-2 ring-teal-200 shadow-md' :
                        hlCls ? hlCls :
                            'border-gray-100 hover:border-gray-200 hover:shadow-md',
                hasIn ? (incoming.some(i => i.type === 'pass')
                    ? 'border-l-4 border-l-green-400'
                    : 'border-l-4 border-l-red-400') : '',
            ].join(' ')}
        >
            {/* 接続先候補インジケーター */}
            {isTarget && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <Link2 className="w-3 h-3" />
                </div>
            )}

            {/* 条件ラベル (受信側) */}
            {hasIn && !printMode && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                    {incoming.map((inc, i) => (
                        <span key={i} className={`text-[10px] font-bold ${
                            inc.type === 'pass' ? 'text-green-500' : 'text-red-400'
                        }`}>
                            {inc.type === 'pass' ? '○合格' : '×不合格'}の場合
                        </span>
                    ))}
                </div>
            )}

            {/* ── ヘッダー: 偏差値 + 学校名 ── */}
            <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${badge}`}>
                    {es.yotsuya_80 ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 text-[15px] leading-tight truncate">
                        {es.school?.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                        {es.session_label}
                        {es.exam_subjects_label && ` · ${es.exam_subjects_label}`}
                        {es.gender_type && ` · ${es.gender_type === '共学' ? '共' : es.gender_type[0]}`}
                    </div>
                </div>
                {!printMode && !connecting && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(sel.id) }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-600 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all shadow-sm print:hidden"
                        title="この学校を削除"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* ── 時間 + 発表 ── */}
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                {es.assembly_time && (
                    <span className="font-medium">
                        {t(es.assembly_time)}
                        {es.estimated_end_time && `–${t(es.estimated_end_time)}`}
                    </span>
                )}
                {es.result_announcement && (
                    <span className="text-orange-500 font-medium">
                        発表 {dt(es.result_announcement)}
                    </span>
                )}
            </div>

            {/* ── フロー (合否の行先) ── */}
            {(flow.pass || flow.fail) && (
                <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5">
                    {flow.pass && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="w-5 h-5 rounded-md bg-green-100 text-green-600 flex items-center justify-center font-black text-[11px] flex-shrink-0">○</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-600 font-semibold truncate">
                                {flow.pass.isEnd ? '受験終了' : flow.pass.schoolName}
                            </span>
                            {!printMode && flow.pass.connId && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteConnection(flow.pass!.connId!) }}
                                    className="ml-auto w-5 h-5 rounded-md bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center flex-shrink-0 transition-colors print:hidden"
                                    title="この接続を削除"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                    {flow.fail && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <span className="w-5 h-5 rounded-md bg-red-100 text-red-500 flex items-center justify-center font-black text-[11px] flex-shrink-0">×</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-red-500 font-semibold truncate">
                                {flow.fail.schoolName}
                            </span>
                            {!printMode && flow.fail.connId && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteConnection(flow.fail!.connId!) }}
                                    className="ml-auto w-5 h-5 rounded-md bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center flex-shrink-0 transition-colors print:hidden"
                                    title="この接続を削除"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── フロー追加ボタン ── */}
            {!printMode && !connecting && (!flow.pass || !flow.fail) && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity print:hidden">
                    {!flow.pass && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onStartConnect(sel.id, 'pass') }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-500 hover:bg-green-100 text-[11px] font-semibold transition-colors"
                        >
                            ○合格→
                        </button>
                    )}
                    {!flow.fail && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onStartConnect(sel.id, 'fail') }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-400 hover:bg-red-100 text-[11px] font-semibold transition-colors"
                        >
                            ×不合格→
                        </button>
                    )}
                </div>
            )}
        </div>
    )
})

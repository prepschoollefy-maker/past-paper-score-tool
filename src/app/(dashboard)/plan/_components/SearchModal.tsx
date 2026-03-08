'use client'

import { useState, useMemo } from 'react'
import type { ExamSession, UserExamSelection } from '@/types/database'
import { Search, Plus, X } from 'lucide-react'

const DAYS = ['日', '月', '火', '水', '木', '金', '土']
function fmtDate(d: string) {
    const dt = new Date(d + 'T00:00:00')
    return `${dt.getMonth() + 1}/${dt.getDate()}(${DAYS[dt.getDay()]})`
}

const DEV_BADGE: Record<string, string> = {
    '65+': 'bg-violet-100 text-violet-700 ring-violet-300',
    '60': 'bg-blue-100 text-blue-700 ring-blue-300',
    '55': 'bg-teal-100 text-teal-700 ring-teal-300',
    '50': 'bg-emerald-100 text-emerald-700 ring-emerald-300',
    '45': 'bg-amber-100 text-amber-700 ring-amber-300',
    def: 'bg-gray-100 text-gray-600 ring-gray-300',
}
function devBadge(v: number | null | undefined) {
    if (v == null) return DEV_BADGE.def
    if (v >= 65) return DEV_BADGE['65+']
    if (v >= 60) return DEV_BADGE['60']
    if (v >= 55) return DEV_BADGE['55']
    if (v >= 50) return DEV_BADGE['50']
    if (v >= 45) return DEV_BADGE['45']
    return DEV_BADGE.def
}

export interface ModalState {
    mode: 'global' | 'date'
    dateFilter?: string
    periodFilter?: '午前' | '午後'
}

interface Props {
    state: ModalState
    sessions: ExamSession[]
    sels: UserExamSelection[]
    onSelect: (esId: string) => void
    onClose: () => void
}

export default function SearchModal({ state, sessions, sels, onSelect, onClose }: Props) {
    const [q, setQ] = useState('')
    const selIds = new Set(sels.map(s => s.exam_session_id))

    const filtered = useMemo(() => {
        let ss = sessions
        if (state.dateFilter) ss = ss.filter(s => s.test_date === state.dateFilter)
        if (state.periodFilter) ss = ss.filter(s => (s.time_period || '午前') === state.periodFilter)
        const lq = q.toLowerCase()
        if (lq) ss = ss.filter(s =>
            (s.school?.name || '').toLowerCase().includes(lq) ||
            (s.session_label || '').toLowerCase().includes(lq)
        )
        return ss.filter(s => !selIds.has(s.id))
    }, [sessions, state, q, selIds])

    const groups = useMemo(() => {
        const gs: { key: string; label: string; items: ExamSession[] }[] = []
        const m = new Map<string, ExamSession[]>()
        for (const s of filtered) {
            const k = s.test_date!
            if (!m.has(k)) { m.set(k, []); gs.push({ key: k, label: fmtDate(k), items: m.get(k)! }) }
            m.get(k)!.push(s)
        }
        return gs
    }, [filtered])

    const title = state.dateFilter
        ? `${fmtDate(state.dateFilter)}${state.periodFilter ? ` ${state.periodFilter}` : ''} に追加`
        : '学校を追加'

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-3 border-b border-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder="学校名で検索..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center py-12 text-sm">
                            {q ? '該当する学校がありません' : 'この日程の試験データがありません'}
                        </p>
                    ) : (
                        groups.map(g => (
                            <div key={g.key}>
                                <div className="px-5 py-1.5 bg-gray-50/80 text-[11px] font-bold text-gray-500 sticky top-0 border-b border-gray-100">
                                    {g.label}
                                </div>
                                {g.items.map(es => (
                                    <button
                                        key={es.id}
                                        onClick={() => onSelect(es.id)}
                                        className="w-full text-left px-5 py-3 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center gap-3 border-b border-gray-50"
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-inset ${devBadge(es.yotsuya_80)}`}>
                                            {es.yotsuya_80 ?? '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-gray-700 text-sm truncate">
                                                    {es.school?.name}
                                                </span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                                    es.time_period === '午後'
                                                        ? 'bg-indigo-100 text-indigo-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {es.time_period || '午前'}
                                                </span>
                                                {es.gender_type && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                                                        es.gender_type === '男子校' ? 'bg-blue-50 text-blue-500' :
                                                            es.gender_type === '女子校' ? 'bg-pink-50 text-pink-500' :
                                                                'bg-purple-50 text-purple-500'
                                                    }`}>
                                                        {es.gender_type === '共学' ? '共' : es.gender_type[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                <span>{es.session_label}</span>
                                                {es.exam_subjects_label && <span>{es.exam_subjects_label}</span>}
                                            </div>
                                        </div>
                                        <Plus className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

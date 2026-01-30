'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { PracticeRecord, ExamSession, School } from '@/types/database'
import { Plus, Edit2, Trash2, Calendar, FileText } from 'lucide-react'

interface RecordWithDetails extends Omit<PracticeRecord, 'exam_session' | 'practice_scores'> {
    exam_session?: ExamSession & { school?: School }
    practice_scores?: { subject: string; score: number; max_score: number }[]
}

export default function RecordsPage() {
    const [records, setRecords] = useState<RecordWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchRecords()
    }, [])

    async function fetchRecords() {
        const { data } = await supabase
            .from('practice_records')
            .select(`
        *,
        exam_session:exam_sessions(*, school:schools(*)),
        practice_scores(*)
      `)
            .order('practice_date', { ascending: false })

        if (data) {
            setRecords(data as RecordWithDetails[])
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('この演習記録を削除しますか？')) return

        setDeleting(id)
        try {
            await supabase.from('practice_records').delete().eq('id', id)
            setRecords(records.filter(r => r.id !== id))
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">演習履歴</h1>
                <Link
                    href="/records/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">新規入力</span>
                </Link>
            </div>

            {records.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">演習記録がまだありません</p>
                    <Link
                        href="/records/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        最初の記録を入力
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map(record => {
                        const scores = record.practice_scores || []
                        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
                        const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
                        const totalRate = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

                        return (
                            <div
                                key={record.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* 学校・試験情報 */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 text-lg">
                                            {record.exam_session?.school?.name}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {record.exam_session?.year}年度 {record.exam_session?.session_label}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(record.practice_date).toLocaleDateString('ja-JP')}
                                        </div>
                                    </div>

                                    {/* 得点 */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-blue-600">{totalRate}%</p>
                                            <p className="text-sm text-slate-500">
                                                {totalScore}/{totalMaxScore}
                                            </p>
                                        </div>

                                        {/* 操作ボタン */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/records/${record.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                disabled={deleting === record.id}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 科目別スコア */}
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-3">
                                        {scores.map(s => (
                                            <div key={s.subject} className="px-3 py-1 bg-slate-100 rounded-lg text-sm">
                                                <span className="text-slate-600">{s.subject}:</span>
                                                <span className="ml-1 font-medium text-slate-800">
                                                    {s.score}/{s.max_score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* メモ */}
                                {record.memo && (
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                        {record.memo}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

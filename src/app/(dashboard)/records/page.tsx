'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { PracticeRecord, ExamSession, School } from '@/types/database'
import { Plus, Edit2, Trash2, Calendar, FileText, ChevronDown, ChevronUp, TrendingUp, Award } from 'lucide-react'

interface RecordWithDetails extends Omit<PracticeRecord, 'exam_session' | 'practice_scores'> {
    exam_session?: ExamSession & { school?: School }
    practice_scores?: { subject: string; score: number; max_score: number }[]
}

interface SchoolGroup {
    school: School
    records: RecordWithDetails[]
    latestDate: string
    highestRate: number
    latestRate: number
}

export default function RecordsPage() {
    const [records, setRecords] = useState<RecordWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set())
    const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())

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

            // 初期状態で全ての学校を展開
            const schoolIds = new Set(data.map(r => r.exam_session?.school?.id).filter(Boolean) as string[])
            setExpandedSchools(schoolIds)
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

    function toggleSchool(schoolId: string) {
        const newExpanded = new Set(expandedSchools)
        if (newExpanded.has(schoolId)) {
            newExpanded.delete(schoolId)
        } else {
            newExpanded.add(schoolId)
        }
        setExpandedSchools(newExpanded)
    }

    function toggleRecord(recordId: string) {
        const newExpanded = new Set(expandedRecords)
        if (newExpanded.has(recordId)) {
            newExpanded.delete(recordId)
        } else {
            newExpanded.add(recordId)
        }
        setExpandedRecords(newExpanded)
    }

    // 学校ごとにグループ化
    const recordsBySchool = records.reduce((acc, record) => {
        const schoolId = record.exam_session?.school?.id
        if (!schoolId || !record.exam_session?.school) return acc

        const scores = record.practice_scores || []
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
        const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
        const rate = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0

        if (!acc[schoolId]) {
            acc[schoolId] = {
                school: record.exam_session.school,
                records: [],
                latestDate: record.practice_date,
                highestRate: rate,
                latestRate: rate
            }
        }

        acc[schoolId].records.push(record)

        // 最新日付を更新
        if (new Date(record.practice_date) > new Date(acc[schoolId].latestDate)) {
            acc[schoolId].latestDate = record.practice_date
            acc[schoolId].latestRate = rate
        }

        // 最高得点率を更新
        if (rate > acc[schoolId].highestRate) {
            acc[schoolId].highestRate = rate
        }

        return acc
    }, {} as Record<string, SchoolGroup>)

    // 学校を最新演習日順でソート
    const sortedSchools = Object.values(recordsBySchool).sort(
        (a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
    )

    // 各学校内の記録をソート（年度降順 → 回昇順）
    sortedSchools.forEach(group => {
        group.records.sort((a, b) => {
            const yearDiff = (b.exam_session?.year || 0) - (a.exam_session?.year || 0)
            if (yearDiff !== 0) return yearDiff
            return (a.exam_session?.session_label || '').localeCompare(
                b.exam_session?.session_label || '',
                'ja'
            )
        })
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
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
                    {sortedSchools.map(group => {
                        const isExpanded = expandedSchools.has(group.school.id)

                        return (
                            <div
                                key={group.school.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                {/* 学校ヘッダー */}
                                <button
                                    onClick={() => toggleSchool(group.school.id)}
                                    className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-slate-800">
                                                {group.school.name}
                                            </h2>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                {group.records.length}件
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(group.latestDate).toLocaleDateString('ja-JP')}</span>
                                        </div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </button>

                                {/* 記録リスト */}
                                {isExpanded && (
                                    <div className="border-t border-slate-200">
                                        {group.records.map(record => {
                                            const scores = record.practice_scores || []
                                            const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
                                            const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
                                            const totalRate = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
                                            const isRecordExpanded = expandedRecords.has(record.id)

                                            return (
                                                <div
                                                    key={record.id}
                                                    className="border-b border-slate-100 last:border-b-0"
                                                >
                                                    <div className="p-4 hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            {/* 年度・回 */}
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-slate-800">
                                                                        {record.exam_session?.year}年度
                                                                    </span>
                                                                    <span className="text-slate-600">
                                                                        {record.exam_session?.session_label}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(record.practice_date).toLocaleDateString('ja-JP')}
                                                                </div>
                                                            </div>

                                                            {/* 得点 */}
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold text-blue-600">
                                                                    {totalRate}%
                                                                </div>
                                                                <div className="text-sm text-slate-500">
                                                                    {totalScore}/{totalMaxScore}
                                                                </div>
                                                            </div>

                                                            {/* 操作ボタン */}
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => toggleRecord(record.id)}
                                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                                >
                                                                    {isRecordExpanded ? (
                                                                        <ChevronUp className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                                <Link
                                                                    href={`/records/${record.id}/edit`}
                                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(record.id)}
                                                                    disabled={deleting === record.id}
                                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* 科目別詳細 */}
                                                        {isRecordExpanded && (
                                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {scores.map(s => (
                                                                        <div
                                                                            key={s.subject}
                                                                            className="px-3 py-1 bg-slate-100 rounded-lg text-sm"
                                                                        >
                                                                            <span className="text-slate-600">{s.subject}:</span>
                                                                            <span className="ml-1 font-medium text-slate-800">
                                                                                {s.score}/{s.max_score}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {record.memo && (
                                                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                                                        {record.memo}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
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

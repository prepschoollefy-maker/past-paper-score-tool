'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { School, ExamSession, RequiredSubject, ScoreInput } from '@/types/database'
import { ChevronDown, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewRecordPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [selectedExamSessionId, setSelectedExamSessionId] = useState<string>('')
    const [requiredSubjects, setRequiredSubjects] = useState<RequiredSubject[]>([])
    const [practiceDate, setPracticeDate] = useState<string>(() => {
        return new Date().toISOString().split('T')[0]
    })
    const [scores, setScores] = useState<ScoreInput[]>([])
    const [memo, setMemo] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    // 学校一覧を取征E
    useEffect(() => {
        async function fetchSchools() {
            const { data } = await supabase
                .from('schools')
                .select('*')
                .order('name')
            if (data) setSchools(data)
            setLoading(false)
        }
        fetchSchools()
    }, [])

    // 学校選択時に試験回一覧を取征E
    useEffect(() => {
        if (!selectedSchoolId) {
            setExamSessions([])
            setSelectedExamSessionId('')
            return
        }
        async function fetchExamSessions() {
            const { data } = await supabase
                .from('exam_sessions')
                .select('*')
                .eq('school_id', selectedSchoolId)
                .order('year', { ascending: false })
            if (data) setExamSessions(data)
        }
        fetchExamSessions()
    }, [selectedSchoolId])

    // 試験回選択時に忁E��科目を取征E
    useEffect(() => {
        if (!selectedExamSessionId) {
            setRequiredSubjects([])
            setScores([])
            return
        }
        async function fetchRequiredSubjects() {
            const { data } = await supabase
                .from('required_subjects')
                .select('*')
                .eq('exam_session_id', selectedExamSessionId)
                .order('display_order')
            if (data) {
                setRequiredSubjects(data)
                // 初期値をセチE��
                setScores(data.map(s => ({
                    subject: s.subject,
                    score: 0,
                    max_score: s.max_score,
                })))
            }
        }
        fetchRequiredSubjects()
    }, [selectedExamSessionId])

    const handleScoreChange = (index: number, value: string) => {
        const newScores = [...scores]
        const numValue = parseInt(value) || 0
        newScores[index] = { ...newScores[index], score: numValue }
        setScores(newScores)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('ログインが忁E��でぁE)

            // 演習記録を作�E
            const { data: record, error: recordError } = await supabase
                .from('practice_records')
                .insert({
                    user_id: user.id,
                    exam_session_id: selectedExamSessionId,
                    practice_date: practiceDate,
                    memo: memo || null,
                })
                .select()
                .single()

            if (recordError) throw recordError

            // 科目別得点を作�E
            const scoreInserts = scores.map(s => ({
                practice_record_id: record.id,
                subject: s.subject,
                score: s.score,
                max_score: s.max_score,
            }))

            const { error: scoresError } = await supabase
                .from('practice_scores')
                .insert(scoreInserts)

            if (scoresError) throw scoresError

            router.push('/records')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存に失敗しました')
        } finally {
            setSaving(false)
        }
    }

    // 合計点の計箁E
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
    const totalRate = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/records" className="text-teal-300 hover:text-teal-400 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-teal-700">得点入劁E/h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 学校選抁E*/}
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6 space-y-4">
                    <h2 className="font-semibold text-teal-700">試験を選抁E/h2>

                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">学校</label>
                        <div className="relative">
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                required
                                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 pr-10 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">学校を選抁E..</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">試験回</label>
                        <div className="relative">
                            <select
                                value={selectedExamSessionId}
                                onChange={(e) => setSelectedExamSessionId(e.target.value)}
                                required
                                disabled={!selectedSchoolId}
                                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 pr-10 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
                            >
                                <option value="">試験回を選抁E..</option>
                                {examSessions.map(es => (
                                    <option key={es.id} value={es.id}>{es.year}年度 {es.session_label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">実施日</label>
                        <input
                            type="date"
                            value={practiceDate}
                            onChange={(e) => setPracticeDate(e.target.value)}
                            required
                            className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>

                {/* 得点入劁E*/}
                {requiredSubjects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6 space-y-4">
                        <h2 className="font-semibold text-teal-700">得点を�E劁E/h2>

                        <div className="space-y-4">
                            {scores.map((score, index) => (
                                <div key={score.subject} className="flex items-center gap-4">
                                    <label className="w-16 text-sm font-medium text-teal-700">
                                        {score.subject}
                                    </label>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max={score.max_score}
                                            value={score.score}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            required
                                            className="w-24 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-center text-lg font-semibold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                        <span className="text-teal-300">/</span>
                                        <span className="text-teal-800 font-medium">{score.max_score}</span>
                                        <span className="ml-auto text-sm text-teal-300">
                                            {score.max_score > 0 ? Math.round((score.score / score.max_score) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 合訁E*/}
                        <div className="pt-4 border-t border-teal-200">
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-sm font-bold text-teal-700">合訁E/span>
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="w-24 text-center text-xl font-bold text-teal-400">
                                        {totalScore}
                                    </span>
                                    <span className="text-teal-300">/</span>
                                    <span className="text-teal-800 font-medium">{totalMaxScore}</span>
                                    <span className="ml-auto text-lg font-bold text-teal-400">
                                        {totalRate}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* メモ */}
                {requiredSubjects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6">
                        <label className="block text-sm font-medium text-teal-700 mb-2">メモ�E�任意！E/label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            rows={3}
                            placeholder="気づぁE��ことなどをメモ..."
                            className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                        />
                    </div>
                )}

                {/* エラー表示 */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* 保存�Eタン */}
                {requiredSubjects.length > 0 && (
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 px-6 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? '保存中...' : '保存すめE}
                    </button>
                )}
            </form>
        </div>
    )
}

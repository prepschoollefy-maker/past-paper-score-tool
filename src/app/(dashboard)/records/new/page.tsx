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

    // 学校一覧を取得
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

    // 学校選択時に試験回一覧を取得
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

    // 試験回選択時に必要科目を取得
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
                // 初期値をセット
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
            if (!user) throw new Error('ログインが必要です')

            // 演習記録を作成
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

            // 科目別得点を作成
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

    // 合計点の計算
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
    const totalRate = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DB8C4]"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/records" className="text-[#7A9B9F] hover:text-[#4DB8C4] transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-[#1A3E42]">得点入力</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 学校選択 */}
                <div className="bg-white rounded-xl shadow-md border border-[#D9EEEF] p-6 space-y-4">
                    <h2 className="font-semibold text-[#1A3E42]">試験を選択</h2>

                    <div>
                        <label className="block text-sm font-medium text-[#1A3E42] mb-2">学校</label>
                        <div className="relative">
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                required
                                className="w-full appearance-none bg-[#F8FCFC] border border-[#D9EEEF] rounded-lg px-4 py-3 pr-10 text-[#1A3E42] focus:outline-none focus:ring-2 focus:ring-[#4DB8C4]"
                            >
                                <option value="">学校を選択...</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A9B9F] pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A3E42] mb-2">試験回</label>
                        <div className="relative">
                            <select
                                value={selectedExamSessionId}
                                onChange={(e) => setSelectedExamSessionId(e.target.value)}
                                required
                                disabled={!selectedSchoolId}
                                className="w-full appearance-none bg-[#F8FCFC] border border-[#D9EEEF] rounded-lg px-4 py-3 pr-10 text-[#1A3E42] focus:outline-none focus:ring-2 focus:ring-[#4DB8C4] disabled:opacity-50"
                            >
                                <option value="">試験回を選択...</option>
                                {examSessions.map(es => (
                                    <option key={es.id} value={es.id}>{es.year}年度 {es.session_label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A3E42] mb-2">実施日</label>
                        <input
                            type="date"
                            value={practiceDate}
                            onChange={(e) => setPracticeDate(e.target.value)}
                            required
                            className="w-full bg-[#F8FCFC] border border-[#D9EEEF] rounded-lg px-4 py-3 text-[#1A3E42] focus:outline-none focus:ring-2 focus:ring-[#4DB8C4]"
                        />
                    </div>
                </div>

                {/* 得点入力 */}
                {requiredSubjects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-[#D9EEEF] p-6 space-y-4">
                        <h2 className="font-semibold text-[#1A3E42]">得点を入力</h2>

                        <div className="space-y-4">
                            {scores.map((score, index) => (
                                <div key={score.subject} className="flex items-center gap-4">
                                    <label className="w-16 text-sm font-medium text-[#1A3E42]">
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
                                            className="w-24 bg-[#F8FCFC] border border-[#D9EEEF] rounded-lg px-4 py-3 text-center text-lg font-semibold text-[#1A3E42] focus:outline-none focus:ring-2 focus:ring-[#4DB8C4]"
                                        />
                                        <span className="text-[#7A9B9F]">/</span>
                                        <span className="text-[#4A6B6F] font-medium">{score.max_score}</span>
                                        <span className="ml-auto text-sm text-[#7A9B9F]">
                                            {score.max_score > 0 ? Math.round((score.score / score.max_score) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 合計 */}
                        <div className="pt-4 border-t border-[#D9EEEF]">
                            <div className="flex items-center gap-4">
                                <span className="w-16 text-sm font-bold text-[#1A3E42]">合計</span>
                                <div className="flex-1 flex items-center gap-2">
                                    <span className="w-24 text-center text-xl font-bold text-[#4DB8C4]">
                                        {totalScore}
                                    </span>
                                    <span className="text-[#7A9B9F]">/</span>
                                    <span className="text-[#4A6B6F] font-medium">{totalMaxScore}</span>
                                    <span className="ml-auto text-lg font-bold text-[#4DB8C4]">
                                        {totalRate}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* メモ */}
                {requiredSubjects.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-[#D9EEEF] p-6">
                        <label className="block text-sm font-medium text-[#1A3E42] mb-2">メモ（任意）</label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            rows={3}
                            placeholder="気づいたことなどをメモ..."
                            className="w-full bg-[#F8FCFC] border border-[#D9EEEF] rounded-lg px-4 py-3 text-[#1A3E42] focus:outline-none focus:ring-2 focus:ring-[#4DB8C4] resize-none"
                        />
                    </div>
                )}

                {/* エラー表示 */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* 保存ボタン */}
                {requiredSubjects.length > 0 && (
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 px-6 bg-gradient-to-r from-[#4DB8C4] to-[#3A9AA4] hover:from-[#3A9AA4] hover:to-[#2D8A94] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? '保存中...' : '保存する'}
                    </button>
                )}
            </form>
        </div>
    )
}

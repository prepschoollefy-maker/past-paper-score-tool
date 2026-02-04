'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { PracticeRecord, ExamSession, School, RequiredSubject, ScoreInput } from '@/types/database'
import { ChevronDown, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface RecordWithDetails extends Omit<PracticeRecord, 'practice_scores'> {
    exam_session?: ExamSession & { school?: School }
    practice_scores?: { id: string; subject: string; score: number; max_score: number; practice_record_id: string }[]
}

export default function EditRecordPage({ params }: { params: { id: string } }) {
    const [record, setRecord] = useState<RecordWithDetails | null>(null)
    const [requiredSubjects, setRequiredSubjects] = useState<RequiredSubject[]>([])
    const [practiceDate, setPracticeDate] = useState<string>('')
    const [scores, setScores] = useState<ScoreInput[]>([])
    const [memo, setMemo] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    // 記録の取得
    useEffect(() => {
        async function fetchRecord() {
            try {
                console.log('Fetching record with ID:', params.id)

                const { data, error } = await supabase
                    .from('practice_records')
                    .select(`
                        *,
                        exam_session:exam_sessions(*, school:schools(*)),
                        practice_scores(*)
                    `)
                    .eq('id', params.id)
                    .single()

                console.log('Fetched data:', data)
                console.log('Fetch error:', error)

                if (error) {
                    console.error('Database error:', error)
                    setError(`記録の読み込みに失敗しました: ${error.message}`)
                    setLoading(false)
                    return
                }

                if (!data) {
                    console.error('No data returned')
                    setError('記録が見つかりませんでした')
                    setLoading(false)
                    return
                }

                const recordData = data as RecordWithDetails
                console.log('Record data:', recordData)

                setRecord(recordData)
                setPracticeDate(recordData.practice_date)
                setMemo(recordData.memo || '')

                // 必要科目を取得
                const { data: subjects } = await supabase
                    .from('required_subjects')
                    .select('*')
                    .eq('exam_session_id', recordData.exam_session_id)
                    .order('display_order')

                if (subjects) {
                    setRequiredSubjects(subjects)

                    // スコアを初期化
                    const existingScores = recordData.practice_scores || []
                    setScores(subjects.map(s => {
                        const existing = existingScores.find(ps => ps.subject === s.subject)
                        return {
                            subject: s.subject,
                            score: existing?.score || 0,
                            max_score: s.max_score,
                        }
                    }))
                }
            } catch (err) {
                console.error('Unexpected error:', err)
                setError(`予期しないエラーが発生しました: ${err}`)
            } finally {
                setLoading(false)
            }
        }

        fetchRecord()
    }, [params.id])

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
            // 演習記録を更新
            const { error: recordError } = await supabase
                .from('practice_records')
                .update({
                    practice_date: practiceDate,
                    memo: memo || null,
                })
                .eq('id', params.id)

            if (recordError) throw recordError

            // 既存のスコアを削除
            const { error: deleteError } = await supabase
                .from('practice_scores')
                .delete()
                .eq('practice_record_id', params.id)

            if (deleteError) throw deleteError

            // 新しいスコアを挿入
            const scoreInserts = scores.map(s => ({
                practice_record_id: params.id,
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            </div>
        )
    }

    if (error || !record) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-12 text-center">
                    <p className="text-teal-700 font-semibold mb-2">
                        {error || '記録が見つかりませんでした'}
                    </p>
                    {error && (
                        <p className="text-sm text-teal-500 mb-4">ブラウザのコンソールで詳細を確認してください</p>
                    )}
                    <Link href="/records" className="mt-4 inline-block text-teal-400 hover:text-teal-500">
                        履歴に戻る
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/records" className="text-teal-300 hover:text-teal-400 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-teal-700">得点編集</h1>
            </div>

            {/* 試験情報（読み取り専用） */}
            <div className="bg-teal-100 rounded-xl border border-teal-200 p-6">
                <h2 className="font-semibold text-teal-700 mb-3">試験情報</h2>
                <div className="space-y-2 text-sm">
                    <p className="text-teal-800">
                        <span className="font-medium">学校:</span> {record.exam_session?.school?.name}
                    </p>
                    <p className="text-teal-800">
                        <span className="font-medium">年度・回:</span> {record.exam_session?.year}年度 {record.exam_session?.session_label}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 実施日 */}
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6">
                    <label className="block text-sm font-medium text-teal-700 mb-2">実施日</label>
                    <input
                        type="date"
                        value={practiceDate}
                        onChange={(e) => setPracticeDate(e.target.value)}
                        required
                        className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                {/* 得点入力 */}
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6 space-y-4">
                    <h2 className="font-semibold text-teal-700">得点を編集</h2>

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

                    {/* 合計 */}
                    <div className="pt-4 border-t border-teal-200">
                        <div className="flex items-center gap-4">
                            <span className="w-16 text-sm font-bold text-teal-700">合計</span>
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

                {/* メモ */}
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6">
                    <label className="block text-sm font-medium text-teal-700 mb-2">メモ（任意）</label>
                    <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        rows={3}
                        placeholder="気づいたことなどをメモ..."
                        className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                    />
                </div>

                {/* エラー表示 */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* 保存ボタン */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 px-6 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {saving ? '保存中...' : '保存する'}
                </button>
            </form>
        </div>
    )
}

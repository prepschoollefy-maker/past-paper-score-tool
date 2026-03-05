'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Target } from 'lucide-react'

interface SchoolSummary {
    schoolId: string
    schoolName: string
    latestScore: number | null
    latestMaxScore: number | null
    passingMin: number | null
    sessionLabel: string
    year: number
    attemptCount: number
}

export default function SchoolSummaryCards() {
    const [summaries, setSummaries] = useState<SchoolSummary[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchSummaries() {
            // ユーザーの全演習記録を取得
            const { data: records } = await supabase
                .from('practice_records')
                .select(`
                    id, practice_date, exam_session_id,
                    practice_scores(score, max_score),
                    exam_session:exam_sessions(
                        id, year, session_label, school_id,
                        school:schools(id, name),
                        official_data(subject, passing_min)
                    )
                `)
                .order('practice_date', { ascending: false })

            if (!records || records.length === 0) {
                setLoading(false)
                return
            }

            // 学校×回ごとに集約し、最新のレコードを使用
            const schoolMap = new Map<string, SchoolSummary>()

            for (const record of records) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const session = record.exam_session as any
                if (!session?.school) continue
                // Supabase nested select returns arrays for 1:1 joins in some cases
                const school = Array.isArray(session.school) ? session.school[0] : session.school
                const officialData = session.official_data || []
                if (!school) continue

                const key = `${school.id}-${session.session_label}`
                const scores = record.practice_scores || []
                const totalScore = scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                const totalMaxScore = scores.reduce((sum: number, s: { max_score: number }) => sum + s.max_score, 0)
                const totalOfficial = officialData.find((d: { subject: string }) => d.subject === '総合')

                const existing = schoolMap.get(key)
                if (existing) {
                    existing.attemptCount++
                } else {
                    schoolMap.set(key, {
                        schoolId: school.id,
                        schoolName: school.name,
                        latestScore: totalScore,
                        latestMaxScore: totalMaxScore,
                        passingMin: totalOfficial?.passing_min || null,
                        sessionLabel: session.session_label,
                        year: session.year,
                        attemptCount: 1,
                    })
                }
            }

            setSummaries(Array.from(schoolMap.values()))
            setLoading(false)
        }

        fetchSummaries()
    }, [])

    if (loading || summaries.length === 0) return null

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-teal-700 flex items-center gap-2">
                <Target className="w-5 h-5" />
                志望校サマリー
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {summaries.map((s) => {
                    const isPass = s.latestScore !== null && s.passingMin !== null && s.latestScore >= s.passingMin
                    const diff = s.latestScore !== null && s.passingMin !== null ? s.latestScore - s.passingMin : null

                    return (
                        <div
                            key={`${s.schoolId}-${s.sessionLabel}`}
                            className={`rounded-xl border p-4 ${isPass
                                ? 'bg-green-50 border-green-200'
                                : 'bg-white border-teal-200'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-teal-800 truncate">{s.schoolName}</h3>
                                    <p className="text-xs text-teal-400">{s.sessionLabel}</p>
                                </div>
                                {diff !== null && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPass
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {isPass ? '合格圏' : `あと${Math.abs(diff)}点`}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 flex items-baseline gap-2">
                                {s.latestScore !== null ? (
                                    <>
                                        <span className="text-2xl font-bold text-teal-700">{s.latestScore}</span>
                                        <span className="text-teal-300">/</span>
                                        <span className="text-sm text-teal-500">{s.latestMaxScore}</span>
                                        {s.passingMin !== null && (
                                            <span className="text-xs text-teal-400 ml-auto">
                                                最低点: {s.passingMin}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-teal-300">未実施</span>
                                )}
                            </div>
                            {s.attemptCount > 1 && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-teal-400">
                                    <TrendingUp className="w-3 h-3" />
                                    {s.attemptCount}回演習済み
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

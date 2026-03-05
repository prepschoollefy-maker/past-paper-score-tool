'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { School } from '@/types/database'
import { ChevronDown } from 'lucide-react'
import SchoolSummaryCards from '@/components/SchoolSummaryCards'
import ScoreChart, { type ChartDataPoint } from '@/components/ScoreChart'

interface ExamSessionWithData {
    id: string
    year: number
    session_label: string
    studentScore: number | null
    studentMaxScore: number | null
    studentBestScore: number | null
    attemptCount: number
    subjectScores: { subject: string; score: number; max_score: number }[]
    passingMin: number | null
    passingMin2: number | null
    passingMax: number | null
    passingAvg: number | null
    applicantAvg: number | null
    subjectOfficialData: { subject: string; passingMin: number | null; passingMin2: number | null; passingMax: number | null; passingAvg: number | null }[]
}

export default function DashboardPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [schoolSearchQuery, setSchoolSearchQuery] = useState<string>('')
    const [showSchoolDropdown, setShowSchoolDropdown] = useState<boolean>(false)
    const [sessionLabels, setSessionLabels] = useState<string[]>([])
    const [selectedSessionLabel, setSelectedSessionLabel] = useState<string>('')
    const [examData, setExamData] = useState<ExamSessionWithData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState<string>('総合')
    const [availableSubjects, setAvailableSubjects] = useState<string[]>(['総合'])

    const supabase = createClient()

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

    // 学校選択時に回ラベル一覧を取得
    useEffect(() => {
        if (!selectedSchoolId) {
            setSessionLabels([])
            setSelectedSessionLabel('')
            setExamData([])
            return
        }

        async function fetchSessionLabels() {
            const { data } = await supabase
                .from('exam_sessions')
                .select('session_label')
                .eq('school_id', selectedSchoolId)

            if (data) {
                // ユニークな回ラベルを取得
                const uniqueLabels = [...new Set(data.map(d => d.session_label))].filter(Boolean).sort()
                setSessionLabels(uniqueLabels)

                // 最初のラベルを自動選択
                if (uniqueLabels.length > 0) {
                    setSelectedSessionLabel(uniqueLabels[0])
                } else {
                    setSelectedSessionLabel('')
                }
            }
        }

        fetchSessionLabels()
    }, [selectedSchoolId])

    // 回ラベル選択時にデータを取得
    useEffect(() => {
        if (!selectedSchoolId) {
            setExamData([])
            return
        }

        // selectedSessionLabelが設定されるまで待機
        if (!selectedSessionLabel) {
            setExamData([])
            return
        }

        async function fetchExamData() {
            setLoading(true)

            // 試験回・公式データを1クエリでJOIN取得
            let query = supabase
                .from('exam_sessions')
                .select('id, year, session_label, required_subjects(*), official_data(*)')
                .eq('school_id', selectedSchoolId)
                .order('year', { ascending: true })

            if (selectedSessionLabel) {
                query = query.eq('session_label', selectedSessionLabel)
            }

            const { data: sessions } = await query

            if (!sessions || sessions.length === 0) {
                setExamData([])
                setAvailableSubjects(['総合'])
                setLoading(false)
                return
            }

            // 科目リストを取得
            const subjects = new Set<string>(['総合'])
            sessions.forEach(s => {
                (s.required_subjects || []).forEach((rs: { subject: string }) => subjects.add(rs.subject))
            })
            setAvailableSubjects(Array.from(subjects))

            // 演習記録を1クエリで一括取得（全セッション分）
            const sessionIds = sessions.map(s => s.id)
            const { data: allRecords } = await supabase
                .from('practice_records')
                .select('*, practice_scores(*)')
                .in('exam_session_id', sessionIds)

            // session_idでインデックス化
            const recordsBySession: Record<string, typeof allRecords> = {}
            if (allRecords) {
                for (const record of allRecords) {
                    if (!recordsBySession[record.exam_session_id]) {
                        recordsBySession[record.exam_session_id] = []
                    }
                    recordsBySession[record.exam_session_id]!.push(record)
                }
            }

            // 各試験回のデータを組み立て
            const examDataList: ExamSessionWithData[] = sessions.map(session => {
                const officialDataList = (session as { official_data?: { subject: string; passing_min: number | null; passing_min_2: number | null; passing_max: number | null; passer_avg: number | null; applicant_avg: number | null }[] }).official_data || []
                const totalOfficial = officialDataList.find(d => d.subject === '総合')
                const subjectOfficialData = officialDataList
                    .filter(d => d.subject !== '総合')
                    .map(d => ({
                        subject: d.subject,
                        passingMin: d.passing_min,
                        passingMin2: d.passing_min_2,
                        passingMax: d.passing_max,
                        passingAvg: d.passer_avg,
                    }))

                const records = recordsBySession[session.id]
                let studentScore: number | null = null
                let studentMaxScore: number | null = null
                let studentBestScore: number | null = null
                let attemptCount = 0
                let subjectScores: { subject: string; score: number; max_score: number }[] = []

                if (records && records.length > 0) {
                    attemptCount = records.length
                    // 最新の記録を使用（practice_dateの降順）
                    const sorted = [...records].sort((a, b) =>
                        new Date(b.practice_date).getTime() - new Date(a.practice_date).getTime()
                    )
                    const latestRecord = sorted[0]
                    const latestScores = latestRecord.practice_scores || []
                    studentScore = latestScores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                    studentMaxScore = latestScores.reduce((sum: number, s: { max_score: number }) => sum + s.max_score, 0)
                    subjectScores = latestScores.map((s: { subject: string; score: number; max_score: number }) => ({
                        subject: s.subject,
                        score: s.score,
                        max_score: s.max_score,
                    }))
                    // 最高点を計算
                    studentBestScore = Math.max(...records.map(r => {
                        const scores = r.practice_scores || []
                        return scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                    }))
                }

                return {
                    id: session.id,
                    year: session.year,
                    session_label: session.session_label,
                    studentScore,
                    studentMaxScore,
                    studentBestScore,
                    attemptCount,
                    subjectScores,
                    passingMin: totalOfficial?.passing_min || null,
                    passingMin2: totalOfficial?.passing_min_2 || null,
                    passingMax: totalOfficial?.passing_max || null,
                    passingAvg: totalOfficial?.passer_avg || null,
                    applicantAvg: totalOfficial?.applicant_avg || null,
                    subjectOfficialData,
                }
            })

            setExamData(examDataList)
            setLoading(false)
        }

        fetchExamData()
    }, [selectedSchoolId, selectedSessionLabel])

    // グラフ用データ（年度ごとに一意にする）
    const uniqueExamData = examData.reduce((acc, current) => {
        const existingIndex = acc.findIndex(item => item.year === current.year)
        if (existingIndex === -1) {
            // 新しい年度
            acc.push(current)
        } else {
            // 同じ年度が既にある場合は、より新しいデータ（ID順）を保持
            // またはデータがある方を優先
            const existing = acc[existingIndex]
            if (current.studentScore !== null && existing.studentScore === null) {
                acc[existingIndex] = current
            }
        }
        return acc
    }, [] as ExamSessionWithData[])

    const chartData: ChartDataPoint[] = uniqueExamData.map(d => {
        if (selectedSubject === '総合') {
            return {
                year: `${d.year}年`,
                score: d.studentScore,
                passingMin: d.passingMin,
                passingMin2: d.passingMin2,
                passingMax: d.passingMax,
                passingAvg: d.passingAvg,
            }
        } else {
            const subjectScore = d.subjectScores.find(s => s.subject === selectedSubject)
            const subjectOfficial = d.subjectOfficialData.find(s => s.subject === selectedSubject)
            return {
                year: `${d.year}年`,
                score: subjectScore?.score || null,
                passingMin: subjectOfficial?.passingMin || null,
                passingMin2: subjectOfficial?.passingMin2 || null,
                passingMax: subjectOfficial?.passingMax || null,
                passingAvg: subjectOfficial?.passingAvg || null,
            }
        }
    })

    // 条件付き列表示: データが1件でもあるか判定
    const hasPassingMin2 = chartData.some(d => d.passingMin2 != null)
    const hasPassingMax = chartData.some(d => d.passingMax != null)

    if (loading && schools.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-teal-700">ダッシュボード</h1>

            {/* 志望校サマリー */}
            <SchoolSummaryCards />

            {/* フィルター */}
            <div className="bg-white rounded-xl shadow-md border border-teal-200 p-4">
                <div className={`grid grid-cols-1 ${sessionLabels.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                    {/* 学校選択 */}
                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">学校</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={schoolSearchQuery}
                                onChange={(e) => {
                                    setSchoolSearchQuery(e.target.value)
                                    setShowSchoolDropdown(true)
                                }}
                                onFocus={() => setShowSchoolDropdown(true)}
                                onBlur={() => {
                                    // 少し遅延させてクリックイベントを処理できるようにする
                                    setTimeout(() => setShowSchoolDropdown(false), 200)
                                }}
                                placeholder="学校を検索..."
                                className="w-full bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            {showSchoolDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-teal-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {schools
                                        .filter(school =>
                                            school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
                                        )
                                        .map(school => (
                                            <button
                                                key={school.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSchoolId(school.id)
                                                    setSchoolSearchQuery(school.name)
                                                    setShowSchoolDropdown(false)
                                                    setSelectedSessionLabel('')
                                                    setSelectedSubject('総合')
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-teal-700"
                                            >
                                                {school.name}
                                            </button>
                                        ))
                                    }
                                    {schools.filter(school =>
                                        school.name.toLowerCase().includes(schoolSearchQuery.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-4 py-2 text-teal-300">該当する学校がありません</div>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 回ラベル選択（複数ある場合のみ） */}
                    {sessionLabels.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-teal-700 mb-2">回</label>
                            <div className="relative">
                                <select
                                    value={selectedSessionLabel}
                                    onChange={(e) => setSelectedSessionLabel(e.target.value)}
                                    className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 pr-10 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    {sessionLabels.map(label => (
                                        <option key={label} value={label}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ダッシュボード本体 */}
            {examData.length > 0 ? (
                <>
                    {/* 科目選択タブ */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {availableSubjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === subject
                                    ? 'bg-teal-400 text-white shadow-md'
                                    : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* グラフ */}
                    <ScoreChart
                        data={chartData}
                        title="グラフ推移"
                        subtitle={selectedSessionLabel && sessionLabels.length > 1 ? selectedSessionLabel : undefined}
                    />

                    {/* 詳細テーブル */}
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 overflow-hidden">
                        <div className="p-4 border-b border-teal-200 bg-teal-100">
                            <h2 className="text-lg font-semibold text-teal-700">表（詳細）</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: '600px' }}>
                                <thead className="bg-teal-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase whitespace-nowrap">年度</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">あなたの得点</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">合格最低点</th>
                                        {hasPassingMin2 && <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">特待最低点</th>}
                                        {hasPassingMax && <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">合格最高点</th>}
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">合格者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">受験者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">判定</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-teal-200">
                                    {examData.map(d => {
                                        let score: number | null = null
                                        let passingMin: number | null = null
                                        let passingMin2: number | null = null
                                        let passingMax: number | null = null
                                        let passingAvg: number | null = null
                                        let applicantAvg: number | null = null

                                        if (selectedSubject === '総合') {
                                            score = d.studentScore
                                            passingMin = d.passingMin
                                            passingMin2 = d.passingMin2
                                            passingMax = d.passingMax
                                            passingAvg = d.passingAvg
                                            applicantAvg = d.applicantAvg
                                        } else {
                                            const subjectScore = d.subjectScores.find(s => s.subject === selectedSubject)
                                            const subjectOfficial = d.subjectOfficialData.find(s => s.subject === selectedSubject)
                                            score = subjectScore?.score || null
                                            passingMin = subjectOfficial?.passingMin || null
                                            passingMin2 = subjectOfficial?.passingMin2 || null
                                            passingMax = subjectOfficial?.passingMax || null
                                            passingAvg = subjectOfficial?.passingAvg || null
                                        }

                                        return (
                                            <tr key={d.id} className="hover:bg-teal-50">
                                                <td className="px-4 py-3 text-sm font-medium text-teal-700 whitespace-nowrap">
                                                    {d.year}年{d.session_label && sessionLabels.length <= 1 && ` ${d.session_label}`}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-700 whitespace-nowrap">
                                                    {score !== null
                                                        ? <div>
                                                            <span className="font-bold text-teal-400">{score}点</span>
                                                            {d.attemptCount > 1 && (
                                                                <span className="ml-1 text-xs text-teal-300">
                                                                    ({d.attemptCount}回目)
                                                                </span>
                                                            )}
                                                            {d.studentBestScore !== null && d.studentBestScore > score && (
                                                                <div className="text-xs text-teal-300">
                                                                    最高: {d.studentBestScore}点
                                                                </div>
                                                            )}
                                                        </div>
                                                        : <span className="text-teal-300">未実施</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {passingMin !== null ? `${passingMin}点` : '-'}
                                                </td>
                                                {hasPassingMin2 && (
                                                    <td className="px-4 py-3 text-center text-sm text-blue-700 whitespace-nowrap">
                                                        {passingMin2 !== null ? `${passingMin2}点` : '-'}
                                                    </td>
                                                )}
                                                {hasPassingMax && (
                                                    <td className="px-4 py-3 text-center text-sm text-green-700 whitespace-nowrap">
                                                        {passingMax !== null ? `${passingMax}点` : '-'}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {passingAvg !== null ? `${passingAvg}点` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {applicantAvg !== null ? `${applicantAvg}点` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    {score !== null && passingMin !== null ? (
                                                        score >= passingMin ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                合格
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                                あと{passingMin - score}点
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-teal-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : selectedSchoolId ? (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-12 text-center">
                    <p className="text-teal-300">この学校の試験データがまだありません</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-12 text-center">
                    <p className="text-teal-300">学校を選択してください</p>
                </div>
            )}
        </div>
    )
}

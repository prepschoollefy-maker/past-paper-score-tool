'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { PracticeRecord, ExamSession, School, OfficialData } from '@/types/database'
import { TrendingUp, Target, Award, ChevronDown } from 'lucide-react'

interface DashboardData {
    school: School
    examSession: ExamSession
    records: PracticeRecord[]
    officialData: OfficialData[]
}

export default function DashboardPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [examSessions, setExamSessions] = useState<ExamSession[]>([])
    const [selectedExamSessionId, setSelectedExamSessionId] = useState<string>('')
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState<string>('総合')

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

    // 試験回選択時にダッシュボードデータを取得
    useEffect(() => {
        if (!selectedExamSessionId) {
            setDashboardData(null)
            return
        }
        async function fetchDashboardData() {
            setLoading(true)

            // 試験回情報
            const { data: examSession } = await supabase
                .from('exam_sessions')
                .select('*, school:schools(*), required_subjects(*)')
                .eq('id', selectedExamSessionId)
                .single()

            // 公式データ
            const { data: officialData } = await supabase
                .from('official_data')
                .select('*')
                .eq('exam_session_id', selectedExamSessionId)

            // 演習記録
            const { data: records } = await supabase
                .from('practice_records')
                .select('*, practice_scores(*)')
                .eq('exam_session_id', selectedExamSessionId)
                .order('practice_date', { ascending: true })

            if (examSession && examSession.school) {
                setDashboardData({
                    school: examSession.school,
                    examSession,
                    records: records || [],
                    officialData: officialData || [],
                })
            }
            setLoading(false)
        }
        fetchDashboardData()
    }, [selectedExamSessionId])

    // グラフ用データの生成
    const chartData = dashboardData?.records.map((record, index) => {
        const scores = record.practice_scores || []
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
        const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)

        const result: Record<string, number | string> = {
            name: `${index + 1}回目`,
            date: new Date(record.practice_date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
            総合: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
            総合点: totalScore,
        }

        scores.forEach(s => {
            result[s.subject] = s.max_score > 0 ? Math.round((s.score / s.max_score) * 100) : 0
            result[`${s.subject}点`] = s.score
        })

        return result
    }) || []

    // 合格最低点ライン
    const passingMinLine = dashboardData?.officialData.find(
        d => d.subject === selectedSubject && d.passing_min
    )?.passing_min

    // 合格最低点の得点率を計算
    const getPassingMinRate = () => {
        if (!passingMinLine || !dashboardData) return null
        const examSession = dashboardData.examSession
        const subjects = examSession.required_subjects || []
        const totalMax = subjects.reduce((sum, s) => sum + s.max_score, 0)
        if (totalMax === 0) return null
        return Math.round((passingMinLine / totalMax) * 100)
    }

    const passingMinRate = selectedSubject === '総合' ? getPassingMinRate() : null

    // 科目リスト
    const subjects = ['総合', ...(dashboardData?.examSession.required_subjects?.map(s => s.subject) || [])]

    // クリア回数の計算
    const clearedCount = chartData.filter(d => {
        const rate = d[selectedSubject] as number
        if (selectedSubject === '総合' && passingMinRate) {
            return rate >= passingMinRate
        }
        return false
    }).length

    if (loading && schools.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>

            {/* フィルター */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">学校</label>
                        <div className="relative">
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">学校を選択...</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">試験回</label>
                        <div className="relative">
                            <select
                                value={selectedExamSessionId}
                                onChange={(e) => setSelectedExamSessionId(e.target.value)}
                                disabled={!selectedSchoolId}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <option value="">試験回を選択...</option>
                                {examSessions.map(es => (
                                    <option key={es.id} value={es.id}>{es.year}年度 {es.session_label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ダッシュボード本体 */}
            {dashboardData && chartData.length > 0 ? (
                <>
                    {/* サマリーカード */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">演習回数</p>
                                    <p className="text-2xl font-bold text-slate-800">{chartData.length}回</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">最新得点率（総合）</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {chartData[chartData.length - 1]?.['総合']}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {passingMinRate && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <Award className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">合格ラインクリア</p>
                                        <p className="text-2xl font-bold text-slate-800">
                                            {clearedCount}/{chartData.length}回
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 科目選択タブ */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === subject
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* グラフ */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            {selectedSubject}の得点率推移
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value) => [`${value}%`, '得点率']}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey={selectedSubject}
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                    {selectedSubject === '総合' && passingMinRate && (
                                        <ReferenceLine
                                            y={passingMinRate}
                                            stroke="#f59e0b"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            label={{
                                                value: `合格最低点 ${passingMinRate}%`,
                                                position: 'right',
                                                fill: '#f59e0b',
                                                fontSize: 12,
                                            }}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 詳細テーブル */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800">演習履歴</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">回</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">日付</th>
                                        {dashboardData.examSession.required_subjects?.map(s => (
                                            <th key={s.subject} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                                                {s.subject}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">総合</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {dashboardData.records.map((record, index) => {
                                        const scores = record.practice_scores || []
                                        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
                                        const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)

                                        return (
                                            <tr key={record.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-sm text-slate-600">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-slate-800">
                                                    {new Date(record.practice_date).toLocaleDateString('ja-JP')}
                                                </td>
                                                {dashboardData.examSession.required_subjects?.map(s => {
                                                    const score = scores.find(sc => sc.subject === s.subject)
                                                    return (
                                                        <td key={s.subject} className="px-4 py-3 text-center text-sm text-slate-800">
                                                            {score ? `${score.score}/${score.max_score}` : '-'}
                                                        </td>
                                                    )
                                                })}
                                                <td className="px-4 py-3 text-center text-sm font-medium text-slate-800">
                                                    {totalScore}/{totalMaxScore}
                                                    <span className="ml-2 text-blue-600">
                                                        ({totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0}%)
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : dashboardData && chartData.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">この試験回の演習記録はまだありません</p>
                </div>
            ) : !selectedExamSessionId ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">学校と試験回を選択してください</p>
                </div>
            ) : null}
        </div>
    )
}

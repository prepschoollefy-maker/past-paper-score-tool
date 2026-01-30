'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { School } from '@/types/database'
import { TrendingUp, Target, Award, ChevronDown } from 'lucide-react'

interface ExamSessionWithData {
    id: string
    year: number
    session_label: string
    studentScore: number | null
    studentMaxScore: number | null
    passingMin: number | null
    passingAvg: number | null
    applicantAvg: number | null
}

export default function DashboardPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [sessionLabels, setSessionLabels] = useState<string[]>([])
    const [selectedSessionLabel, setSelectedSessionLabel] = useState<string>('')
    const [hasMultipleSessions, setHasMultipleSessions] = useState(false)
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
            setHasMultipleSessions(false)
            setExamData([])
            return
        }

        async function fetchSessionLabels() {
            const { data } = await supabase
                .from('exam_sessions')
                .select('session_label, year')
                .eq('school_id', selectedSchoolId)

            if (data) {
                // ユニークな回ラベルを取得
                const uniqueLabels = [...new Set(data.map(d => d.session_label))].filter(Boolean)

                // 同一年度に複数の回があるかチェック
                const yearCounts = new Map<number, number>()
                data.forEach(d => {
                    yearCounts.set(d.year, (yearCounts.get(d.year) || 0) + 1)
                })
                const hasMultiple = Array.from(yearCounts.values()).some(count => count > 1)

                setSessionLabels(uniqueLabels.sort())
                setHasMultipleSessions(hasMultiple)

                // 複数回がない場合は自動的に最初のラベルを選択（または空文字のまま進む）
                if (!hasMultiple && uniqueLabels.length <= 1) {
                    setSelectedSessionLabel(uniqueLabels[0] || '')
                } else {
                    setSelectedSessionLabel('')
                }
            }
        }

        fetchSessionLabels()
    }, [selectedSchoolId])

    // 回ラベル選択時（または自動選択時）にデータを取得
    useEffect(() => {
        if (!selectedSchoolId) {
            setExamData([])
            return
        }

        // 複数回がある場合は回を選択するまで待つ
        if (hasMultipleSessions && !selectedSessionLabel) {
            setExamData([])
            return
        }

        async function fetchExamData() {
            setLoading(true)

            // 試験回を取得（回ラベルでフィルタリング）
            let query = supabase
                .from('exam_sessions')
                .select('id, year, session_label, required_subjects(*)')
                .eq('school_id', selectedSchoolId)
                .order('year', { ascending: true })

            if (selectedSessionLabel) {
                query = query.eq('session_label', selectedSessionLabel)
            }

            const { data: sessions } = await query

            if (!sessions || sessions.length === 0) {
                setExamData([])
                setLoading(false)
                return
            }

            // 科目リストを取得
            const subjects = new Set<string>(['総合'])
            sessions.forEach(s => {
                (s.required_subjects || []).forEach((rs: { subject: string }) => subjects.add(rs.subject))
            })
            setAvailableSubjects(Array.from(subjects))

            // 各試験回のデータを取得
            const examDataList: ExamSessionWithData[] = []

            for (const session of sessions) {
                // 公式データを取得
                const { data: officialData } = await supabase
                    .from('official_data')
                    .select('*')
                    .eq('exam_session_id', session.id)
                    .eq('subject', '総合')
                    .single()

                // 生徒の演習記録を取得
                const { data: records } = await supabase
                    .from('practice_records')
                    .select('*, practice_scores(*)')
                    .eq('exam_session_id', session.id)

                let studentScore: number | null = null
                let studentMaxScore: number | null = null

                if (records && records.length > 0) {
                    const record = records[0]
                    const scores = record.practice_scores || []
                    studentScore = scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                    studentMaxScore = scores.reduce((sum: number, s: { max_score: number }) => sum + s.max_score, 0)
                }

                examDataList.push({
                    id: session.id,
                    year: session.year,
                    session_label: session.session_label,
                    studentScore,
                    studentMaxScore,
                    passingMin: officialData?.passing_min || null,
                    passingAvg: officialData?.passer_avg || null,
                    applicantAvg: officialData?.applicant_avg || null,
                })
            }

            setExamData(examDataList)
            setLoading(false)
        }

        fetchExamData()
    }, [selectedSchoolId, selectedSessionLabel, hasMultipleSessions])

    // グラフ用データ
    const chartData = examData.map(d => ({
        year: `${d.year}年`,
        生徒の得点: d.studentScore,
        合格最低点: d.passingMin,
        合格者平均: d.passingAvg,
        受験者平均: d.applicantAvg,
        満点: d.studentMaxScore,
    }))

    // 最高点（Y軸の上限用）
    const maxScore = Math.max(
        ...examData.map(d => Math.max(
            d.studentScore || 0,
            d.passingMin || 0,
            d.passingAvg || 0,
            d.studentMaxScore || 0
        ))
    )

    // 統計
    const latestData = examData[examData.length - 1]
    const recordCount = examData.filter(d => d.studentScore !== null).length

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
                <div className={`grid grid-cols-1 ${hasMultipleSessions ? 'md:grid-cols-2' : ''} gap-4`}>
                    {/* 学校選択 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">学校</label>
                        <div className="relative">
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => {
                                    setSelectedSchoolId(e.target.value)
                                    setSelectedSessionLabel('')
                                }}
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

                    {/* 回ラベル選択（複数回がある場合のみ表示） */}
                    {hasMultipleSessions && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">回</label>
                            <div className="relative">
                                <select
                                    value={selectedSessionLabel}
                                    onChange={(e) => setSelectedSessionLabel(e.target.value)}
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">回を選択...</option>
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
                    {/* サマリーカード */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">解いた年度数</p>
                                    <p className="text-2xl font-bold text-slate-800">{recordCount}年分</p>
                                </div>
                            </div>
                        </div>

                        {latestData?.studentScore !== null && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">最新年度の得点（{latestData.year}年）</p>
                                        <p className="text-2xl font-bold text-slate-800">
                                            {latestData.studentScore}/{latestData.studentMaxScore}点
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {latestData?.passingMin !== null && latestData?.studentScore !== null && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${latestData.studentScore >= latestData.passingMin
                                            ? 'bg-green-100'
                                            : 'bg-amber-100'
                                        }`}>
                                        <Award className={`w-6 h-6 ${latestData.studentScore >= latestData.passingMin
                                                ? 'text-green-600'
                                                : 'text-amber-600'
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">合格ラインとの差</p>
                                        <p className={`text-2xl font-bold ${latestData.studentScore >= latestData.passingMin
                                                ? 'text-green-600'
                                                : 'text-amber-600'
                                            }`}>
                                            {latestData.studentScore >= latestData.passingMin ? '+' : ''}
                                            {latestData.studentScore - latestData.passingMin}点
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* グラフ */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            年度別得点推移
                            {selectedSessionLabel && <span className="text-slate-500 ml-2">（{selectedSessionLabel}）</span>}
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barCategoryGap="20%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                                    <YAxis
                                        domain={[0, Math.ceil(maxScore * 1.1 / 10) * 10]}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        unit="点"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value, name) => [value !== null ? `${value}点` : '-', name]}
                                    />
                                    <Legend />

                                    {/* 生徒の得点（バー） */}
                                    <Bar
                                        dataKey="生徒の得点"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        name="あなたの得点"
                                    />

                                    {/* 合格最低点（水平線） */}
                                    {examData.some(d => d.passingMin) && (
                                        <ReferenceLine
                                            y={examData.find(d => d.passingMin)?.passingMin || 0}
                                            stroke="#ef4444"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            label={{
                                                value: '合格最低点',
                                                position: 'insideTopRight',
                                                fill: '#ef4444',
                                                fontSize: 12,
                                            }}
                                        />
                                    )}

                                    {/* 合格者平均（水平線） */}
                                    {examData.some(d => d.passingAvg) && (
                                        <ReferenceLine
                                            y={examData.find(d => d.passingAvg)?.passingAvg || 0}
                                            stroke="#10b981"
                                            strokeDasharray="3 3"
                                            strokeWidth={2}
                                            label={{
                                                value: '合格者平均',
                                                position: 'insideBottomRight',
                                                fill: '#10b981',
                                                fontSize: 12,
                                            }}
                                        />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 凡例 */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-slate-600">あなたの得点</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #ef4444' }}></div>
                                <span className="text-slate-600">合格最低点</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-green-500" style={{ borderTop: '2px dashed #10b981' }}></div>
                                <span className="text-slate-600">合格者平均</span>
                            </div>
                        </div>
                    </div>

                    {/* 詳細テーブル */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800">年度別詳細</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">年度</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">あなたの得点</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">合格最低点</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">合格者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">受験者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">判定</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {examData.map(d => (
                                        <tr key={d.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                                {d.year}年{d.session_label && ` ${d.session_label}`}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-slate-800">
                                                {d.studentScore !== null
                                                    ? <span className="font-bold text-blue-600">{d.studentScore}点</span>
                                                    : <span className="text-slate-400">未実施</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-slate-600">
                                                {d.passingMin !== null ? `${d.passingMin}点` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-slate-600">
                                                {d.passingAvg !== null ? `${d.passingAvg}点` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-slate-600">
                                                {d.applicantAvg !== null ? `${d.applicantAvg}点` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {d.studentScore !== null && d.passingMin !== null ? (
                                                    d.studentScore >= d.passingMin ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                            合格
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                            あと{d.passingMin - d.studentScore}点
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : selectedSchoolId && (!hasMultipleSessions || selectedSessionLabel) ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">この学校の試験データがまだありません</p>
                </div>
            ) : !selectedSchoolId ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">学校を選択してください</p>
                </div>
            ) : hasMultipleSessions && !selectedSessionLabel ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">回を選択してください</p>
                </div>
            ) : null}
        </div>
    )
}

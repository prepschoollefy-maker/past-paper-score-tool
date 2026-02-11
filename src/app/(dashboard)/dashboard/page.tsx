'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { School } from '@/types/database'
import { ChevronDown } from 'lucide-react'

interface ExamSessionWithData {
    id: string
    year: number
    session_label: string
    studentScore: number | null
    studentMaxScore: number | null
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

            // 試験回を取得
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

            // 各試験回のデータを取得
            const examDataList: ExamSessionWithData[] = []

            for (const session of sessions) {
                // 公式データを全科目取得
                const { data: officialDataList } = await supabase
                    .from('official_data')
                    .select('*')
                    .eq('exam_session_id', session.id)

                const totalOfficial = officialDataList?.find(d => d.subject === '総合')
                const subjectOfficialData = (officialDataList || [])
                    .filter(d => d.subject !== '総合')
                    .map(d => ({
                        subject: d.subject,
                        passingMin: d.passing_min,
                        passingMin2: d.passing_min_2,
                        passingMax: d.passing_max,
                        passingAvg: d.passer_avg,
                    }))

                // 生徒の演習記録を取得
                const { data: records } = await supabase
                    .from('practice_records')
                    .select('*, practice_scores(*)')
                    .eq('exam_session_id', session.id)

                let studentScore: number | null = null
                let studentMaxScore: number | null = null
                let subjectScores: { subject: string; score: number; max_score: number }[] = []

                if (records && records.length > 0) {
                    const record = records[0]
                    const scores = record.practice_scores || []
                    studentScore = scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                    studentMaxScore = scores.reduce((sum: number, s: { max_score: number }) => sum + s.max_score, 0)
                    subjectScores = scores.map((s: { subject: string; score: number; max_score: number }) => ({
                        subject: s.subject,
                        score: s.score,
                        max_score: s.max_score,
                    }))
                }

                examDataList.push({
                    id: session.id,
                    year: session.year,
                    session_label: session.session_label,
                    studentScore,
                    studentMaxScore,
                    subjectScores,
                    passingMin: totalOfficial?.passing_min || null,
                    passingMin2: totalOfficial?.passing_min_2 || null,
                    passingMax: totalOfficial?.passing_max || null,
                    passingAvg: totalOfficial?.passer_avg || null,
                    applicantAvg: totalOfficial?.applicant_avg || null,
                    subjectOfficialData,
                })
            }

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

    const chartData = uniqueExamData.map(d => {
        if (selectedSubject === '総合') {
            return {
                year: `${d.year}年`,
                あなたの得点: d.studentScore,
                合格最低点: d.passingMin,
                '合格最低点※': d.passingMin2,
                合格最高点: d.passingMax,
                合格者平均: d.passingAvg,
            }
        } else {
            const subjectScore = d.subjectScores.find(s => s.subject === selectedSubject)
            const subjectOfficial = d.subjectOfficialData.find(s => s.subject === selectedSubject)
            return {
                year: `${d.year}年`,
                あなたの得点: subjectScore?.score || null,
                合格最低点: subjectOfficial?.passingMin || null,
                '合格最低点※': subjectOfficial?.passingMin2 || null,
                合格最高点: subjectOfficial?.passingMax || null,
                合格者平均: subjectOfficial?.passingAvg || null,
            }
        }
    })

    // 条件付き列表示: データが1件でもあるか判定
    const hasPassingMin2 = chartData.some(d => d['合格最低点※'] != null)
    const hasPassingMax = chartData.some(d => d.合格最高点 != null)

    // 最高点（Y軸の上限用）
    const maxScore = Math.max(
        ...chartData.map(d => Math.max(
            (d.あなたの得点 as number) || 0,
            (d.合格最低点 as number) || 0,
            (d['合格最低点※'] as number) || 0,
            (d.合格最高点 as number) || 0,
            (d.合格者平均 as number) || 0
        )),
        100
    )

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
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6">
                        <h2 className="text-lg font-semibold text-teal-700 mb-4">
                            グラフ推移
                            {selectedSessionLabel && sessionLabels.length > 1 && (
                                <span className="text-teal-300 ml-2">（{selectedSessionLabel}）</span>
                            )}
                        </h2>
                        <div className="overflow-x-auto">
                            <div className="h-80" style={{ minWidth: `${Math.max(chartData.length * 80, 600)}px` }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData} barCategoryGap="20%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                                        <YAxis
                                            domain={[0, Math.ceil(maxScore * 1.1 / 10) * 10]}
                                            stroke="#94a3b8"
                                            fontSize={12}
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
                                            dataKey="あなたの得点"
                                            fill="#4DB8C4"
                                            radius={[4, 4, 0, 0]}
                                        />

                                        {/* 合格最低点（折れ線） */}
                                        <Line
                                            type="monotone"
                                            dataKey="合格最低点"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ fill: '#ef4444', r: 4 }}
                                            connectNulls
                                        />

                                        {/* 合格最低点※（折れ線・データがある場合のみ） */}
                                        {hasPassingMin2 && (
                                            <Line
                                                type="monotone"
                                                dataKey="合格最低点※"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={{ fill: '#2563eb', r: 4 }}
                                                connectNulls
                                            />
                                        )}

                                        {/* 合格最高点（折れ線・データがある場合のみ） */}
                                        {hasPassingMax && (
                                            <Line
                                                type="monotone"
                                                dataKey="合格最高点"
                                                stroke="#16a34a"
                                                strokeWidth={2}
                                                dot={{ fill: '#16a34a', r: 4 }}
                                                connectNulls
                                            />
                                        )}

                                        {/* 合格者平均（折れ線） */}
                                        <Line
                                            type="monotone"
                                            dataKey="合格者平均"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            dot={{ fill: '#7c3aed', r: 4 }}
                                            connectNulls
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

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
                                                        ? <span className="font-bold text-teal-400">{score}点</span>
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

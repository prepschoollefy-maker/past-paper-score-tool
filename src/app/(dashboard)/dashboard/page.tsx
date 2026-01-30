'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { ExamSession, School, OfficialData } from '@/types/database'
import { TrendingUp, Target, Award, ChevronDown } from 'lucide-react'

interface SessionLabel {
    label: string
    years: number[]
}

interface YearData {
    year: number
    examSessionId: string
    records: {
        id: string
        practice_date: string
        practice_scores: { subject: string; score: number; max_score: number }[]
    }[]
    officialData: OfficialData[]
    requiredSubjects: { subject: string; max_score: number }[]
}

export default function DashboardPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [sessionLabels, setSessionLabels] = useState<SessionLabel[]>([])
    const [selectedSessionLabel, setSelectedSessionLabel] = useState<string>('')
    const [availableYears, setAvailableYears] = useState<number[]>([])
    const [selectedYears, setSelectedYears] = useState<number[]>([])
    const [yearDataMap, setYearDataMap] = useState<Map<number, YearData>>(new Map())
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

    // 学校選択時に回ラベル一覧を取得（年度をグループ化）
    useEffect(() => {
        if (!selectedSchoolId) {
            setSessionLabels([])
            setSelectedSessionLabel('')
            return
        }
        async function fetchSessionLabels() {
            const { data } = await supabase
                .from('exam_sessions')
                .select('session_label, year')
                .eq('school_id', selectedSchoolId)
                .order('year', { ascending: false })

            if (data) {
                // 回ラベルでグループ化
                const labelMap = new Map<string, number[]>()
                data.forEach(d => {
                    const years = labelMap.get(d.session_label) || []
                    if (!years.includes(d.year)) {
                        years.push(d.year)
                    }
                    labelMap.set(d.session_label, years)
                })

                const labels: SessionLabel[] = []
                labelMap.forEach((years, label) => {
                    labels.push({ label, years: years.sort((a, b) => b - a) })
                })

                // 第1回、第2回...の順にソート
                labels.sort((a, b) => a.label.localeCompare(b.label, 'ja'))
                setSessionLabels(labels)
            }
        }
        fetchSessionLabels()
    }, [selectedSchoolId])

    // 回ラベル選択時に利用可能な年度を設定
    useEffect(() => {
        const label = sessionLabels.find(l => l.label === selectedSessionLabel)
        if (label) {
            setAvailableYears(label.years)
            // デフォルトで全年度を選択
            setSelectedYears(label.years)
        } else {
            setAvailableYears([])
            setSelectedYears([])
        }
    }, [selectedSessionLabel, sessionLabels])

    // 選択された年度のデータを取得
    useEffect(() => {
        if (!selectedSchoolId || !selectedSessionLabel || selectedYears.length === 0) {
            setYearDataMap(new Map())
            return
        }

        async function fetchYearData() {
            setLoading(true)
            const newMap = new Map<number, YearData>()

            for (const year of selectedYears) {
                // 試験回を取得
                const { data: examSession } = await supabase
                    .from('exam_sessions')
                    .select('id, required_subjects(*)')
                    .eq('school_id', selectedSchoolId)
                    .eq('session_label', selectedSessionLabel)
                    .eq('year', year)
                    .single()

                if (examSession) {
                    // 公式データを取得
                    const { data: officialData } = await supabase
                        .from('official_data')
                        .select('*')
                        .eq('exam_session_id', examSession.id)

                    // 演習記録を取得
                    const { data: records } = await supabase
                        .from('practice_records')
                        .select('id, practice_date, practice_scores(*)')
                        .eq('exam_session_id', examSession.id)
                        .order('practice_date', { ascending: true })

                    newMap.set(year, {
                        year,
                        examSessionId: examSession.id,
                        records: records || [],
                        officialData: officialData || [],
                        requiredSubjects: examSession.required_subjects || [],
                    })
                }
            }

            setYearDataMap(newMap)
            setLoading(false)
        }

        fetchYearData()
    }, [selectedSchoolId, selectedSessionLabel, selectedYears])

    // 年度選択のトグル
    const toggleYear = (year: number) => {
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(y => y !== year)
                : [...prev, year].sort((a, b) => b - a)
        )
    }

    // グラフ用データの生成（年度別に色分け）
    const chartData: { name: string;[key: string]: number | string }[] = []
    const yearColors: Record<number, string> = {}
    const colorPalette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

    // 最大演習回数を計算
    let maxRecordCount = 0
    yearDataMap.forEach(data => {
        if (data.records.length > maxRecordCount) {
            maxRecordCount = data.records.length
        }
    })

    // 年度ごとに色を割り当て
    selectedYears.forEach((year, idx) => {
        yearColors[year] = colorPalette[idx % colorPalette.length]
    })

    // 演習回数ごとのデータを作成
    for (let i = 0; i < maxRecordCount; i++) {
        const dataPoint: { name: string;[key: string]: number | string } = { name: `${i + 1}回目` }

        selectedYears.forEach(year => {
            const yearData = yearDataMap.get(year)
            if (yearData && yearData.records[i]) {
                const record = yearData.records[i]
                const scores = record.practice_scores || []
                const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
                const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)

                if (selectedSubject === '総合') {
                    dataPoint[`${year}年`] = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
                } else {
                    const subjectScore = scores.find(s => s.subject === selectedSubject)
                    if (subjectScore) {
                        dataPoint[`${year}年`] = subjectScore.max_score > 0
                            ? Math.round((subjectScore.score / subjectScore.max_score) * 100)
                            : 0
                    }
                }
            }
        })

        chartData.push(dataPoint)
    }

    // 公式データ（合格最低点・合格者平均）を取得
    const getOfficialDataForYear = (year: number) => {
        const yearData = yearDataMap.get(year)
        if (!yearData) return null

        const official = yearData.officialData.find(d => d.subject === selectedSubject)
        const totalMax = yearData.requiredSubjects.reduce((sum, s) => sum + s.max_score, 0)

        if (!official || totalMax === 0) return null

        return {
            passingMin: official.passing_min ? Math.round((official.passing_min / totalMax) * 100) : null,
            passingAvg: official.passer_avg ? Math.round((official.passer_avg / totalMax) * 100) : null,
            applicantAvg: official.applicant_avg ? Math.round((official.applicant_avg / totalMax) * 100) : null,
        }
    }

    // 科目リスト（最初の年度から取得）
    const subjects = ['総合']
    const firstYearData = yearDataMap.get(selectedYears[0])
    if (firstYearData) {
        firstYearData.requiredSubjects.forEach(s => subjects.push(s.subject))
    }

    // 統計計算
    const totalRecords = Array.from(yearDataMap.values()).reduce((sum, d) => sum + d.records.length, 0)
    const latestRecord = yearDataMap.get(selectedYears[0])?.records.slice(-1)[0]
    let latestScore = 0
    if (latestRecord) {
        const scores = latestRecord.practice_scores || []
        const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
        const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)
        latestScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0
    }

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* 回ラベル選択 */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">回</label>
                        <div className="relative">
                            <select
                                value={selectedSessionLabel}
                                onChange={(e) => setSelectedSessionLabel(e.target.value)}
                                disabled={!selectedSchoolId}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <option value="">回を選択...</option>
                                {sessionLabels.map(sl => (
                                    <option key={sl.label} value={sl.label}>{sl.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* 年度選択（チェックボックス） */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">年度（複数選択可）</label>
                        <div className="flex flex-wrap gap-2">
                            {availableYears.map(year => (
                                <button
                                    key={year}
                                    onClick={() => toggleYear(year)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedYears.includes(year)
                                        ? 'text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    style={selectedYears.includes(year) ? { backgroundColor: yearColors[year] } : {}}
                                >
                                    {year}年
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ダッシュボード本体 */}
            {yearDataMap.size > 0 && chartData.length > 0 ? (
                <>
                    {/* サマリーカード */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">総演習回数</p>
                                    <p className="text-2xl font-bold text-slate-800">{totalRecords}回</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">最新得点率（{selectedYears[0]}年）</p>
                                    <p className="text-2xl font-bold text-slate-800">{latestScore}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">比較年度数</p>
                                    <p className="text-2xl font-bold text-slate-800">{selectedYears.length}年分</p>
                                </div>
                            </div>
                        </div>
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
                            {selectedSubject}の得点率推移（年度比較）
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                        formatter={(value, name) => [`${value}%`, name]}
                                    />
                                    <Legend />

                                    {/* 年度ごとのライン */}
                                    {selectedYears.map(year => (
                                        <Line
                                            key={year}
                                            type="monotone"
                                            dataKey={`${year}年`}
                                            stroke={yearColors[year]}
                                            strokeWidth={3}
                                            dot={{ fill: yearColors[year], strokeWidth: 2, r: 5 }}
                                            activeDot={{ r: 8 }}
                                            connectNulls
                                        />
                                    ))}

                                    {/* 公式データのリファレンスライン */}
                                    {selectedSubject === '総合' && selectedYears.map(year => {
                                        const official = getOfficialDataForYear(year)
                                        if (!official) return null

                                        return (
                                            <React.Fragment key={`ref-${year}`}>
                                                {official.passingMin && (
                                                    <ReferenceLine
                                                        y={official.passingMin}
                                                        stroke={yearColors[year]}
                                                        strokeDasharray="5 5"
                                                        strokeWidth={2}
                                                        label={{
                                                            value: `${year}年合格最低${official.passingMin}%`,
                                                            position: 'insideTopRight',
                                                            fill: yearColors[year],
                                                            fontSize: 10,
                                                        }}
                                                    />
                                                )}
                                                {official.passingAvg && (
                                                    <ReferenceLine
                                                        y={official.passingAvg}
                                                        stroke={yearColors[year]}
                                                        strokeDasharray="2 2"
                                                        strokeWidth={1}
                                                        label={{
                                                            value: `${year}年合格者平均${official.passingAvg}%`,
                                                            position: 'insideBottomRight',
                                                            fill: yearColors[year],
                                                            fontSize: 10,
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 凡例（公式データ） */}
                        {selectedSubject === '総合' && (
                            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                {selectedYears.map(year => {
                                    const official = getOfficialDataForYear(year)
                                    if (!official) return null

                                    return (
                                        <div key={`legend-${year}`} className="flex items-center gap-2" style={{ color: yearColors[year] }}>
                                            <span className="font-medium">{year}年:</span>
                                            {official.passingMin && <span>最低{official.passingMin}%</span>}
                                            {official.passingAvg && <span>/ 合格者平均{official.passingAvg}%</span>}
                                            {official.applicantAvg && <span>/ 受験者平均{official.applicantAvg}%</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* 詳細テーブル（年度別タブ） */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex gap-2 overflow-x-auto">
                            {selectedYears.map(year => (
                                <span
                                    key={year}
                                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                    style={{ backgroundColor: yearColors[year] }}
                                >
                                    {year}年度
                                </span>
                            ))}
                        </div>

                        {selectedYears.map(year => {
                            const yearData = yearDataMap.get(year)
                            if (!yearData || yearData.records.length === 0) return null

                            return (
                                <div key={year} className="border-b border-slate-200 last:border-0">
                                    <div className="px-4 py-2 bg-slate-50">
                                        <h3 className="font-medium" style={{ color: yearColors[year] }}>{year}年度の演習履歴</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">回</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">日付</th>
                                                    {yearData.requiredSubjects.map(s => (
                                                        <th key={s.subject} className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">
                                                            {s.subject}
                                                        </th>
                                                    ))}
                                                    <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase">総合</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {yearData.records.map((record, index) => {
                                                    const scores = record.practice_scores || []
                                                    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
                                                    const totalMaxScore = scores.reduce((sum, s) => sum + s.max_score, 0)

                                                    return (
                                                        <tr key={record.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-2 text-sm text-slate-600">{index + 1}</td>
                                                            <td className="px-4 py-2 text-sm text-slate-800">
                                                                {new Date(record.practice_date).toLocaleDateString('ja-JP')}
                                                            </td>
                                                            {yearData.requiredSubjects.map(s => {
                                                                const score = scores.find(sc => sc.subject === s.subject)
                                                                return (
                                                                    <td key={s.subject} className="px-4 py-2 text-center text-sm text-slate-800">
                                                                        {score ? `${score.score}/${score.max_score}` : '-'}
                                                                    </td>
                                                                )
                                                            })}
                                                            <td className="px-4 py-2 text-center text-sm font-medium text-slate-800">
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
                            )
                        })}
                    </div>
                </>
            ) : yearDataMap.size > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">選択した年度の演習記録はまだありません</p>
                </div>
            ) : !selectedSessionLabel ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">学校と回を選択してください</p>
                </div>
            ) : null}
        </div>
    )
}

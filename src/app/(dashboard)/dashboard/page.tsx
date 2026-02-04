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
    passingAvg: number | null
    applicantAvg: number | null
    subjectOfficialData: { subject: string; passingMin: number | null; passingAvg: number | null }[]
}

export default function DashboardPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [sessionLabels, setSessionLabels] = useState<string[]>([])
    const [selectedSessionLabel, setSelectedSessionLabel] = useState<string>('')
    const [examData, setExamData] = useState<ExamSessionWithData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState<string>('邱丞粋')
    const [availableSubjects, setAvailableSubjects] = useState<string[]>(['邱丞粋'])

    const supabase = createClient()

    // 蟄ｦ譬｡荳隕ｧ繧貞叙蠕・
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

    // 蟄ｦ譬｡驕ｸ謚樊凾縺ｫ蝗槭Λ繝吶Ν荳隕ｧ繧貞叙蠕・
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
                // 繝ｦ繝九・繧ｯ縺ｪ蝗槭Λ繝吶Ν繧貞叙蠕・
                const uniqueLabels = [...new Set(data.map(d => d.session_label))].filter(Boolean).sort()
                setSessionLabels(uniqueLabels)

                // 譛蛻昴・繝ｩ繝吶Ν繧定・蜍暮∈謚・
                if (uniqueLabels.length > 0) {
                    setSelectedSessionLabel(uniqueLabels[0])
                } else {
                    setSelectedSessionLabel('')
                }
            }
        }

        fetchSessionLabels()
    }, [selectedSchoolId])

    // 蝗槭Λ繝吶Ν驕ｸ謚樊凾縺ｫ繝・・繧ｿ繧貞叙蠕・
    useEffect(() => {
        if (!selectedSchoolId) {
            setExamData([])
            return
        }

        // selectedSessionLabel縺瑚ｨｭ螳壹＆繧後ｋ縺ｾ縺ｧ蠕・ｩ・
        if (!selectedSessionLabel) {
            setExamData([])
            return
        }

        async function fetchExamData() {
            setLoading(true)

            // 隧ｦ鬨灘屓繧貞叙蠕・
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
                setAvailableSubjects(['邱丞粋'])
                setLoading(false)
                return
            }

            // 遘醍岼繝ｪ繧ｹ繝医ｒ蜿門ｾ・
            const subjects = new Set<string>(['邱丞粋'])
            sessions.forEach(s => {
                (s.required_subjects || []).forEach((rs: { subject: string }) => subjects.add(rs.subject))
            })
            setAvailableSubjects(Array.from(subjects))

            // 蜷・ｩｦ鬨灘屓縺ｮ繝・・繧ｿ繧貞叙蠕・
            const examDataList: ExamSessionWithData[] = []

            for (const session of sessions) {
                // 蜈ｬ蠑上ョ繝ｼ繧ｿ繧貞・遘醍岼蜿門ｾ・
                const { data: officialDataList } = await supabase
                    .from('official_data')
                    .select('*')
                    .eq('exam_session_id', session.id)

                const totalOfficial = officialDataList?.find(d => d.subject === '邱丞粋')
                const subjectOfficialData = (officialDataList || [])
                    .filter(d => d.subject !== '邱丞粋')
                    .map(d => ({
                        subject: d.subject,
                        passingMin: d.passing_min,
                        passingAvg: d.passer_avg,
                    }))

                // 逕溷ｾ偵・貍皮ｿ定ｨ倬鹸繧貞叙蠕・
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

    // 繧ｰ繝ｩ繝慕畑繝・・繧ｿ・亥ｹｴ蠎ｦ縺斐→縺ｫ荳諢上↓縺吶ｋ・・
    const uniqueExamData = examData.reduce((acc, current) => {
        const existingIndex = acc.findIndex(item => item.year === current.year)
        if (existingIndex === -1) {
            // 譁ｰ縺励＞蟷ｴ蠎ｦ
            acc.push(current)
        } else {
            // 蜷後§蟷ｴ蠎ｦ縺梧里縺ｫ縺ゅｋ蝣ｴ蜷医・縲√ｈ繧頑眠縺励＞繝・・繧ｿ・・D鬆・ｼ峨ｒ菫晄戟
            // 縺ｾ縺溘・繝・・繧ｿ縺後≠繧区婿繧貞━蜈・
            const existing = acc[existingIndex]
            if (current.studentScore !== null && existing.studentScore === null) {
                acc[existingIndex] = current
            }
        }
        return acc
    }, [] as ExamSessionWithData[])

    const chartData = uniqueExamData.map(d => {
        if (selectedSubject === '邱丞粋') {
            return {
                year: `${d.year}蟷ｴ`,
                縺ゅ↑縺溘・蠕礼せ: d.studentScore,
                蜷域ｼ譛菴守せ: d.passingMin,
                蜷域ｼ閠・ｹｳ蝮・ d.passingAvg,
            }
        } else {
            const subjectScore = d.subjectScores.find(s => s.subject === selectedSubject)
            const subjectOfficial = d.subjectOfficialData.find(s => s.subject === selectedSubject)
            return {
                year: `${d.year}蟷ｴ`,
                縺ゅ↑縺溘・蠕礼せ: subjectScore?.score || null,
                蜷域ｼ譛菴守せ: subjectOfficial?.passingMin || null,
                蜷域ｼ閠・ｹｳ蝮・ subjectOfficial?.passingAvg || null,
            }
        }
    })

    // 譛鬮倡せ・・霆ｸ縺ｮ荳企剞逕ｨ・・
    const maxScore = Math.max(
        ...chartData.map(d => Math.max(
            (d.縺ゅ↑縺溘・蠕礼せ as number) || 0,
            (d.蜷域ｼ譛菴守せ as number) || 0,
            (d.蜷域ｼ閠・ｹｳ蝮・as number) || 0
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
            <h1 className="text-2xl font-bold text-teal-700">繝繝・す繝･繝懊・繝・/h1>

            {/* 繝輔ぅ繝ｫ繧ｿ繝ｼ */}
            <div className="bg-white rounded-xl shadow-md border border-teal-200 p-4">
                <div className={`grid grid-cols-1 ${sessionLabels.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                    {/* 蟄ｦ譬｡驕ｸ謚・*/}
                    <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">蟄ｦ譬｡</label>
                        <div className="relative">
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => {
                                    setSelectedSchoolId(e.target.value)
                                    setSelectedSessionLabel('')
                                    setSelectedSubject('邱丞粋')
                                }}
                                className="w-full appearance-none bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 pr-10 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option value="">蟄ｦ譬｡繧帝∈謚・..</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300 pointer-events-none" />
                        </div>
                    </div>

                    {/* 蝗槭Λ繝吶Ν驕ｸ謚橸ｼ郁､・焚縺ゅｋ蝣ｴ蜷医・縺ｿ・・*/}
                    {sessionLabels.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-teal-700 mb-2">蝗・/label>
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

            {/* 繝繝・す繝･繝懊・繝画悽菴・*/}
            {examData.length > 0 ? (
                <>
                    {/* 遘醍岼驕ｸ謚槭ち繝・*/}
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

                    {/* 繧ｰ繝ｩ繝・*/}
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 p-6">
                        <h2 className="text-lg font-semibold text-teal-700 mb-4">
                            {selectedSubject}縺ｮ蟷ｴ蠎ｦ蛻･蠕礼せ謗ｨ遘ｻ
                            {selectedSessionLabel && sessionLabels.length > 1 && (
                                <span className="text-teal-300 ml-2">・・selectedSessionLabel}・・/span>
                            )}
                        </h2>
                        <div className="h-80">
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
                                        formatter={(value, name) => [value !== null ? `${value}轤ｹ` : '-', name]}
                                    />
                                    <Legend />

                                    {/* 逕溷ｾ偵・蠕礼せ・医ヰ繝ｼ・・*/}
                                    <Bar
                                        dataKey="縺ゅ↑縺溘・蠕礼せ"
                                        fill="#4DB8C4"
                                        radius={[4, 4, 0, 0]}
                                    />

                                    {/* 蜷域ｼ譛菴守せ・域釜繧檎ｷ夲ｼ・*/}
                                    <Line
                                        type="monotone"
                                        dataKey="蜷域ｼ譛菴守せ"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#ef4444', r: 4 }}
                                        connectNulls
                                    />

                                    {/* 蜷域ｼ閠・ｹｳ蝮・ｼ域釜繧檎ｷ夲ｼ・*/}
                                    <Line
                                        type="monotone"
                                        dataKey="蜷域ｼ閠・ｹｳ蝮・
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        connectNulls
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 隧ｳ邏ｰ繝・・繝悶Ν */}
                    <div className="bg-white rounded-xl shadow-md border border-teal-200 overflow-hidden">
                        <div className="p-4 border-b border-teal-200 bg-teal-100">
                            <h2 className="text-lg font-semibold text-teal-700">蟷ｴ蠎ｦ蛻･隧ｳ邏ｰ・・selectedSubject}・・/h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: '600px' }}>
                                <thead className="bg-teal-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase whitespace-nowrap">蟷ｴ蠎ｦ</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">縺ゅ↑縺溘・蠕礼せ</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">蜷域ｼ譛菴守せ</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">蜷域ｼ閠・ｹｳ蝮・/th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">蜿鈴ｨ楢・ｹｳ蝮・/th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-teal-800 uppercase whitespace-nowrap">蛻､螳・/th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-teal-200">
                                    {examData.map(d => {
                                        let score: number | null = null
                                        let passingMin: number | null = null
                                        let passingAvg: number | null = null
                                        let applicantAvg: number | null = null

                                        if (selectedSubject === '邱丞粋') {
                                            score = d.studentScore
                                            passingMin = d.passingMin
                                            passingAvg = d.passingAvg
                                            applicantAvg = d.applicantAvg
                                        } else {
                                            const subjectScore = d.subjectScores.find(s => s.subject === selectedSubject)
                                            const subjectOfficial = d.subjectOfficialData.find(s => s.subject === selectedSubject)
                                            score = subjectScore?.score || null
                                            passingMin = subjectOfficial?.passingMin || null
                                            passingAvg = subjectOfficial?.passingAvg || null
                                        }

                                        return (
                                            <tr key={d.id} className="hover:bg-teal-50">
                                                <td className="px-4 py-3 text-sm font-medium text-teal-700 whitespace-nowrap">
                                                    {d.year}蟷ｴ{d.session_label && sessionLabels.length <= 1 && ` ${d.session_label}`}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-700 whitespace-nowrap">
                                                    {score !== null
                                                        ? <span className="font-bold text-teal-400">{score}轤ｹ</span>
                                                        : <span className="text-teal-300">譛ｪ螳滓命</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {passingMin !== null ? `${passingMin}轤ｹ` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {passingAvg !== null ? `${passingAvg}轤ｹ` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-teal-800 whitespace-nowrap">
                                                    {applicantAvg !== null ? `${applicantAvg}轤ｹ` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    {score !== null && passingMin !== null ? (
                                                        score >= passingMin ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                蜷域ｼ
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                                                縺ゅ→{passingMin - score}轤ｹ
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
                    <p className="text-teal-300">縺薙・蟄ｦ譬｡縺ｮ隧ｦ鬨薙ョ繝ｼ繧ｿ縺後∪縺縺ゅｊ縺ｾ縺帙ｓ</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-teal-200 p-12 text-center">
                    <p className="text-teal-300">蟄ｦ譬｡繧帝∈謚槭＠縺ｦ縺上□縺輔＞</p>
                </div>
            )}
        </div>
    )
}

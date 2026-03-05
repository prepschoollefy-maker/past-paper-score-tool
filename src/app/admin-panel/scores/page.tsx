'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Users, ChevronDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import ScoreChart, { type ChartDataPoint } from '@/components/ScoreChart'

interface UserProfile {
    id: string
    email: string
    name: string | null
    student_last_name: string | null
    student_first_name: string | null
    grade: string | null
    cram_school: string | null
}

interface School {
    id: string
    name: string
}

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

export default function AdminScoreViewerPage() {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
    const [userSearchQuery, setUserSearchQuery] = useState('')
    const [showUserDropdown, setShowUserDropdown] = useState(false)

    const [schools, setSchools] = useState<School[]>([])
    const [userSchoolIds, setUserSchoolIds] = useState<string[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [sessionLabels, setSessionLabels] = useState<string[]>([])
    const [selectedSessionLabel, setSelectedSessionLabel] = useState<string>('')
    const [examData, setExamData] = useState<ExamSessionWithData[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingScores, setLoadingScores] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState<string>('総合')
    const [availableSubjects, setAvailableSubjects] = useState<string[]>(['総合'])

    const supabase = createClient()

    // ユーザー一覧と学校一覧を取得
    useEffect(() => {
        async function fetchInitialData() {
            const [{ data: profiles }, { data: schoolsData }] = await Promise.all([
                supabase.from('profiles').select('id, email, name, student_last_name, student_first_name, grade, cram_school').order('created_at', { ascending: false }),
                supabase.from('schools').select('id, name').order('name'),
            ])
            if (profiles) setUsers(profiles)
            if (schoolsData) setSchools(schoolsData)
            setLoading(false)
        }
        fetchInitialData()
    }, [])

    // ユーザー選択時：そのユーザーが得点を入力した学校一覧を取得
    useEffect(() => {
        if (!selectedUserId) {
            setUserSchoolIds([])
            setSelectedSchoolId('')
            setExamData([])
            return
        }

        async function fetchUserSchools() {
            setLoadingScores(true)
            // このユーザーのpractice_recordsからexam_session_idを取得
            const { data: records } = await supabase
                .from('practice_records')
                .select('exam_session_id')
                .eq('user_id', selectedUserId)

            if (records && records.length > 0) {
                const sessionIds = records.map(r => r.exam_session_id)
                // exam_sessionsからschool_idを取得
                const { data: sessions } = await supabase
                    .from('exam_sessions')
                    .select('school_id')
                    .in('id', sessionIds)

                if (sessions) {
                    const uniqueSchoolIds = [...new Set(sessions.map(s => s.school_id))]
                    setUserSchoolIds(uniqueSchoolIds)
                    if (uniqueSchoolIds.length > 0) {
                        setSelectedSchoolId(uniqueSchoolIds[0])
                    }
                }
            } else {
                setUserSchoolIds([])
            }
            setLoadingScores(false)
        }
        fetchUserSchools()
    }, [selectedUserId])

    // 学校選択時に回ラベル一覧を取得
    useEffect(() => {
        if (!selectedSchoolId || !selectedUserId) {
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
                const uniqueLabels = [...new Set(data.map(d => d.session_label))].filter(Boolean).sort()
                setSessionLabels(uniqueLabels)
                if (uniqueLabels.length > 0) {
                    setSelectedSessionLabel(uniqueLabels[0])
                } else {
                    setSelectedSessionLabel('')
                }
            }
        }
        fetchSessionLabels()
    }, [selectedSchoolId])

    // データ取得
    useEffect(() => {
        if (!selectedSchoolId || !selectedUserId || !selectedSessionLabel) {
            setExamData([])
            return
        }

        async function fetchExamData() {
            setLoadingScores(true)

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
                setLoadingScores(false)
                return
            }

            const subjects = new Set<string>(['総合'])
            sessions.forEach(s => {
                (s.required_subjects || []).forEach((rs: { subject: string }) => subjects.add(rs.subject))
            })
            setAvailableSubjects(Array.from(subjects))

            // 特定ユーザーの演習記録を1クエリで一括取得
            const sessionIds = sessions.map(s => s.id)
            const { data: allRecords } = await supabase
                .from('practice_records')
                .select('*, practice_scores(*)')
                .in('exam_session_id', sessionIds)
                .eq('user_id', selectedUserId)

            const recordsBySession: Record<string, typeof allRecords> = {}
            if (allRecords) {
                for (const record of allRecords) {
                    if (!recordsBySession[record.exam_session_id]) {
                        recordsBySession[record.exam_session_id] = []
                    }
                    recordsBySession[record.exam_session_id]!.push(record)
                }
            }

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

                return {
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
                }
            })

            setExamData(examDataList)
            setLoadingScores(false)
        }

        fetchExamData()
    }, [selectedSchoolId, selectedSessionLabel, selectedUserId])

    function getUserDisplayName(user: UserProfile) {
        if (user.student_last_name && user.student_first_name) {
            return `${user.student_last_name} ${user.student_first_name}`
        }
        return user.name || user.email.split('@')[0]
    }

    const filteredSchools = schools.filter(s => userSchoolIds.includes(s.id))

    // グラフ用データ
    const uniqueExamData = examData.reduce((acc, current) => {
        const existingIndex = acc.findIndex(item => item.year === current.year)
        if (existingIndex === -1) {
            acc.push(current)
        } else {
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

    // 条件付き表示
    const hasPassingMin2 = chartData.some(d => d.passingMin2 != null)
    const hasPassingMax = chartData.some(d => d.passingMax != null)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* ヘッダー */}
            <div className="flex items-center gap-4">
                <Link href="/admin-panel" className="text-slate-400 hover:text-slate-200 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">得点閲覧</h1>
                    <p className="text-sm text-slate-400">ユーザーの過去問得点を確認</p>
                </div>
            </div>

            {/* ユーザー選択 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <label className="block text-sm font-medium text-orange-400 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    ユーザーを選択
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => {
                            setUserSearchQuery(e.target.value)
                            setShowUserDropdown(true)
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                        placeholder="名前またはメールアドレスで検索..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {showUserDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {users
                                .filter(user => {
                                    const q = userSearchQuery.toLowerCase()
                                    return getUserDisplayName(user).toLowerCase().includes(q) ||
                                        user.email.toLowerCase().includes(q)
                                })
                                .map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedUserId(user.id)
                                            setSelectedUser(user)
                                            setUserSearchQuery(getUserDisplayName(user))
                                            setShowUserDropdown(false)
                                            setSelectedSchoolId('')
                                            setSelectedSubject('総合')
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-0"
                                    >
                                        <div className="text-white font-medium">{getUserDisplayName(user)}</div>
                                        <div className="text-xs text-slate-400">{user.email}{user.grade ? ` | ${user.grade}` : ''}</div>
                                    </button>
                                ))
                            }
                            {users.filter(user => {
                                const q = userSearchQuery.toLowerCase()
                                return getUserDisplayName(user).toLowerCase().includes(q) ||
                                    user.email.toLowerCase().includes(q)
                            }).length === 0 && (
                                    <div className="px-4 py-3 text-slate-400">該当するユーザーがいません</div>
                                )}
                        </div>
                    )}
                </div>
            </div>

            {/* ユーザー情報カード */}
            {selectedUser && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-slate-400">生徒名</span>
                            <p className="text-white font-medium">{getUserDisplayName(selectedUser)}</p>
                        </div>
                        <div>
                            <span className="text-slate-400">メール</span>
                            <p className="text-white text-xs">{selectedUser.email}</p>
                        </div>
                        <div>
                            <span className="text-slate-400">学年</span>
                            <p className="text-white">{selectedUser.grade || '-'}</p>
                        </div>
                        <div>
                            <span className="text-slate-400">通塾先</span>
                            <p className="text-white">{selectedUser.cram_school || '-'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 学校選択 */}
            {selectedUserId && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                    <div className={`grid grid-cols-1 ${sessionLabels.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                        <div>
                            <label className="block text-sm font-medium text-orange-400 mb-2">学校</label>
                            {filteredSchools.length > 0 ? (
                                <div className="relative">
                                    <select
                                        value={selectedSchoolId}
                                        onChange={(e) => {
                                            setSelectedSchoolId(e.target.value)
                                            setSelectedSubject('総合')
                                        }}
                                        className="w-full appearance-none bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        {filteredSchools.map(school => (
                                            <option key={school.id} value={school.id}>{school.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            ) : (
                                <p className="text-slate-400 py-3">このユーザーの演習データはありません</p>
                            )}
                        </div>

                        {sessionLabels.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-orange-400 mb-2">回</label>
                                <div className="relative">
                                    <select
                                        value={selectedSessionLabel}
                                        onChange={(e) => setSelectedSessionLabel(e.target.value)}
                                        className="w-full appearance-none bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            )}

            {/* ローディング */}
            {loadingScores && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            )}

            {/* 得点表示 */}
            {!loadingScores && examData.length > 0 && (
                <>
                    {/* 科目選択タブ */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {availableSubjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedSubject === subject
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    {/* グラフ */}
                    <ScoreChart
                        data={chartData}
                        title="得点推移"
                        subtitle={selectedSessionLabel && sessionLabels.length > 1 ? selectedSessionLabel : undefined}
                        theme="dark"
                        scoreLabel="得点"
                        barColor="#f97316"
                    />

                    {/* 詳細テーブル */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-600 bg-slate-700/50">
                            <h2 className="text-lg font-semibold text-white">詳細データ</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: '600px' }}>
                                <thead className="bg-slate-700/30">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase whitespace-nowrap">年度</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">得点</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">合格最低点</th>
                                        {hasPassingMin2 && <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">特待最低点</th>}
                                        {hasPassingMax && <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">合格最高点</th>}
                                        <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">合格者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">受験者平均</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-orange-400 uppercase whitespace-nowrap">判定</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
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
                                            <tr key={d.id} className="hover:bg-slate-700/30">
                                                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">
                                                    {d.year}年{d.session_label && sessionLabels.length <= 1 && ` ${d.session_label}`}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                                    {score !== null
                                                        ? <span className="font-bold text-orange-400">{score}点</span>
                                                        : <span className="text-slate-500">未実施</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-slate-300 whitespace-nowrap">
                                                    {passingMin !== null ? `${passingMin}点` : '-'}
                                                </td>
                                                {hasPassingMin2 && (
                                                    <td className="px-4 py-3 text-center text-sm text-blue-400 whitespace-nowrap">
                                                        {passingMin2 !== null ? `${passingMin2}点` : '-'}
                                                    </td>
                                                )}
                                                {hasPassingMax && (
                                                    <td className="px-4 py-3 text-center text-sm text-green-400 whitespace-nowrap">
                                                        {passingMax !== null ? `${passingMax}点` : '-'}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-center text-sm text-slate-300 whitespace-nowrap">
                                                    {passingAvg !== null ? `${passingAvg}点` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm text-slate-300 whitespace-nowrap">
                                                    {applicantAvg !== null ? `${applicantAvg}点` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    {score !== null && passingMin !== null ? (
                                                        score >= passingMin ? (
                                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                                                合格
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                                                あと{passingMin - score}点
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="text-slate-500">-</span>
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
            )}

            {!loadingScores && selectedUserId && filteredSchools.length > 0 && examData.length === 0 && selectedSchoolId && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                    <p className="text-slate-400">このユーザーのこの学校の演習データはありません</p>
                </div>
            )}
        </div>
    )
}

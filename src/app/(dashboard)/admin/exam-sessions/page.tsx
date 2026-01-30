'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { School, ExamSession, RequiredSubject, OfficialData, Subject, OfficialSubject } from '@/types/database'
import { Plus, Edit2, Trash2, ArrowLeft, ChevronDown, ChevronRight, Settings } from 'lucide-react'
import Link from 'next/link'

type ExamSessionWithDetails = ExamSession & {
    school: School
    required_subjects: RequiredSubject[]
    official_data: OfficialData[]
}

const SUBJECTS: Subject[] = ['算数', '国語', '理科', '社会', '英語']
const OFFICIAL_SUBJECTS: OfficialSubject[] = ['総合', '算数', '国語', '理科', '社会', '英語']

export default function ExamSessionsAdminPage() {
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
    const [examSessions, setExamSessions] = useState<ExamSessionWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    // 新規作成フォーム
    const [newYear, setNewYear] = useState<number>(new Date().getFullYear())
    const [newLabel, setNewLabel] = useState<string>('')
    const [newSubjects, setNewSubjects] = useState<{ subject: Subject; max_score: number }[]>([
        { subject: '算数', max_score: 100 },
        { subject: '国語', max_score: 100 },
    ])

    const [saving, setSaving] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        async function fetchSchools() {
            const { data } = await supabase.from('schools').select('*').order('name')
            if (data) setSchools(data)
            setLoading(false)
        }
        fetchSchools()
    }, [])

    useEffect(() => {
        if (!selectedSchoolId) {
            setExamSessions([])
            return
        }
        fetchExamSessions()
    }, [selectedSchoolId])

    async function fetchExamSessions() {
        const { data } = await supabase
            .from('exam_sessions')
            .select('*, school:schools(*), required_subjects(*), official_data(*)')
            .eq('school_id', selectedSchoolId)
            .order('year', { ascending: false })
        if (data) setExamSessions(data as ExamSessionWithDetails[])
    }

    async function handleAddExamSession(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedSchoolId || !newLabel.trim()) return

        setSaving(true)

        // 試験回を作成
        const { data: session, error: sessionError } = await supabase
            .from('exam_sessions')
            .insert({
                school_id: selectedSchoolId,
                year: newYear,
                session_label: newLabel.trim(),
            })
            .select()
            .single()

        if (sessionError || !session) {
            setSaving(false)
            return
        }

        // 必要科目を作成
        const subjectInserts = newSubjects.map((s, i) => ({
            exam_session_id: session.id,
            subject: s.subject,
            max_score: s.max_score,
            display_order: i,
        }))

        await supabase.from('required_subjects').insert(subjectInserts)

        setNewLabel('')
        fetchExamSessions()
        setSaving(false)
    }

    async function handleDeleteExamSession(id: string) {
        if (!confirm('この試験回を削除しますか？関連する演習記録もすべて削除されます。')) return
        await supabase.from('exam_sessions').delete().eq('id', id)
        fetchExamSessions()
    }

    async function handleUpdateOfficialData(
        examSessionId: string,
        subject: OfficialSubject,
        field: 'passing_min' | 'passer_avg' | 'applicant_avg',
        value: string
    ) {
        const numValue = value === '' ? null : parseFloat(value)

        // 既存のデータをチェック
        const existing = examSessions.find(es => es.id === examSessionId)?.official_data.find(od => od.subject === subject)

        if (existing) {
            await supabase
                .from('official_data')
                .update({ [field]: numValue })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('official_data')
                .insert({
                    exam_session_id: examSessionId,
                    subject,
                    [field]: numValue,
                })
        }

        fetchExamSessions()
    }

    function addSubject() {
        const usedSubjects = newSubjects.map(s => s.subject)
        const availableSubject = SUBJECTS.find(s => !usedSubjects.includes(s))
        if (availableSubject) {
            setNewSubjects([...newSubjects, { subject: availableSubject, max_score: 100 }])
        }
    }

    function removeSubject(index: number) {
        setNewSubjects(newSubjects.filter((_, i) => i !== index))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">試験回管理</h1>
            </div>

            {/* 学校選択 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">学校を選択</label>
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

            {selectedSchoolId && (
                <>
                    {/* 新規追加フォーム */}
                    <form onSubmit={handleAddExamSession} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                        <h2 className="font-semibold text-slate-800">新規試験回を追加</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">年度</label>
                                <input
                                    type="number"
                                    value={newYear}
                                    onChange={(e) => setNewYear(parseInt(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">回ラベル</label>
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="例: 第1回、午前、東大特待..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">必要科目</label>
                            <div className="space-y-2">
                                {newSubjects.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <select
                                            value={s.subject}
                                            onChange={(e) => {
                                                const updated = [...newSubjects]
                                                updated[i].subject = e.target.value as Subject
                                                setNewSubjects(updated)
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                                        >
                                            {SUBJECTS.map(sub => (
                                                <option key={sub} value={sub}>{sub}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={s.max_score}
                                            onChange={(e) => {
                                                const updated = [...newSubjects]
                                                updated[i].max_score = parseInt(e.target.value) || 0
                                                setNewSubjects(updated)
                                            }}
                                            placeholder="満点"
                                            className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-center"
                                        />
                                        <span className="text-slate-400 text-sm">点</span>
                                        {newSubjects.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(i)}
                                                className="p-1 text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {newSubjects.length < SUBJECTS.length && (
                                    <button
                                        type="button"
                                        onClick={addSubject}
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        科目を追加
                                    </button>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !newLabel.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            試験回を追加
                        </button>
                    </form>

                    {/* 試験回一覧 */}
                    <div className="space-y-4">
                        {examSessions.map(session => (
                            <div key={session.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div
                                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50"
                                    onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                                >
                                    {expandedId === session.id ? (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    )}
                                    <div className="flex-1">
                                        <span className="font-medium text-slate-800">
                                            {session.year}年度 {session.session_label}
                                        </span>
                                        <span className="ml-3 text-sm text-slate-500">
                                            {session.required_subjects.map(s => s.subject).join('・')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteExamSession(session.id) }}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {expandedId === session.id && (
                                    <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                                        <h3 className="font-medium text-slate-700 flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            公式データ（任意）
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-slate-500">
                                                        <th className="pb-2">科目</th>
                                                        <th className="pb-2">合格最低点</th>
                                                        <th className="pb-2">合格者平均</th>
                                                        <th className="pb-2">受験者平均</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {OFFICIAL_SUBJECTS.filter(s =>
                                                        s === '総合' || session.required_subjects.some(rs => rs.subject === s)
                                                    ).map(subject => {
                                                        const data = session.official_data.find(od => od.subject === subject)
                                                        return (
                                                            <tr key={subject}>
                                                                <td className="py-1 font-medium text-slate-700">{subject}</td>
                                                                <td className="py-1">
                                                                    <input
                                                                        type="number"
                                                                        value={data?.passing_min ?? ''}
                                                                        onChange={(e) => handleUpdateOfficialData(session.id, subject, 'passing_min', e.target.value)}
                                                                        placeholder="-"
                                                                        className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-center"
                                                                    />
                                                                </td>
                                                                <td className="py-1">
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={data?.passer_avg ?? ''}
                                                                        onChange={(e) => handleUpdateOfficialData(session.id, subject, 'passer_avg', e.target.value)}
                                                                        placeholder="-"
                                                                        className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-center"
                                                                    />
                                                                </td>
                                                                <td className="py-1">
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        value={data?.applicant_avg ?? ''}
                                                                        onChange={(e) => handleUpdateOfficialData(session.id, subject, 'applicant_avg', e.target.value)}
                                                                        placeholder="-"
                                                                        className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-center"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

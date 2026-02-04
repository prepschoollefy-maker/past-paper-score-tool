'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import { Loader2 } from 'lucide-react'

interface School {
    id: string
    name: string
}

interface AddDataModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function AddDataModal({ isOpen, onClose, onSuccess }: AddDataModalProps) {
    const [mode, setMode] = useState<'existing' | 'new'>('existing')
    const [schools, setSchools] = useState<School[]>([])
    const [selectedSchoolId, setSelectedSchoolId] = useState('')
    const [newSchoolName, setNewSchoolName] = useState('')
    const [newSchoolAlias, setNewSchoolAlias] = useState('')
    const [year, setYear] = useState(new Date().getFullYear())
    const [sessionLabel, setSessionLabel] = useState('')

    // 科目配点
    const [subjects, setSubjects] = useState({
        算数: 0,
        国語: 0,
        理科: 0,
        社会: 0,
        英語: 0,
    })

    // 総合データ
    const [passingMin, setPassingMin] = useState<number | ''>('')
    const [passerAvg, setPasserAvg] = useState<number | ''>('')
    const [applicantAvg, setApplicantAvg] = useState<number | ''>('')

    // 科目別平均
    const [subjectAvgs, setSubjectAvgs] = useState({
        算数合平均: 0,
        算数受平均: 0,
        国語合平均: 0,
        国語受平均: 0,
        理科合平均: 0,
        理科受平均: 0,
        社会合平均: 0,
        社会受平均: 0,
        英語合平均: 0,
        英語受平均: 0,
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    // 学校一覧を取得
    useEffect(() => {
        if (isOpen) {
            fetchSchools()
        }
    }, [isOpen])

    async function fetchSchools() {
        const { data } = await supabase
            .from('schools')
            .select('id, name')
            .order('name')

        if (data) {
            setSchools(data)
            if (data.length > 0) {
                setSelectedSchoolId(data[0].id)
            }
        }
    }

    function resetForm() {
        setMode('existing')
        setSelectedSchoolId(schools[0]?.id || '')
        setNewSchoolName('')
        setNewSchoolAlias('')
        setYear(new Date().getFullYear())
        setSessionLabel('')
        setSubjects({ 算数: 0, 国語: 0, 理科: 0, 社会: 0, 英語: 0 })
        setPassingMin('')
        setPasserAvg('')
        setApplicantAvg('')
        setSubjectAvgs({
            算数合平均: 0, 算数受平均: 0,
            国語合平均: 0, 国語受平均: 0,
            理科合平均: 0, 理科受平均: 0,
            社会合平均: 0, 社会受平均: 0,
            英語合平均: 0, 英語受平均: 0,
        })
        setError(null)
    }

    async function handleSave() {
        setLoading(true)
        setError(null)

        try {
            let schoolId = selectedSchoolId

            // 新しい学校を作成
            if (mode === 'new') {
                if (!newSchoolName.trim()) {
                    throw new Error('学校名を入力してください')
                }

                const { data: school, error: schoolError } = await supabase
                    .from('schools')
                    .insert({ name: newSchoolName.trim() })
                    .select()
                    .single()

                if (schoolError) throw schoolError
                schoolId = school.id

                // 別名があれば追加
                if (newSchoolAlias.trim()) {
                    await supabase
                        .from('school_aliases')
                        .insert({
                            school_id: schoolId,
                            alias: newSchoolAlias.trim()
                        })
                }
            }

            // バリデーション
            if (!sessionLabel.trim()) {
                throw new Error('回ラベルを入力してください')
            }

            // 試験回を作成
            const { data: session, error: sessionError } = await supabase
                .from('exam_sessions')
                .insert({
                    school_id: schoolId,
                    year,
                    session_label: sessionLabel.trim(),
                })
                .select()
                .single()

            if (sessionError) throw sessionError

            // 科目配点を追加（0より大きいもののみ）
            const subjectInserts = Object.entries(subjects)
                .filter(([_, score]) => score > 0)
                .map(([subject, max_score], index) => ({
                    exam_session_id: session.id,
                    subject,
                    max_score,
                    display_order: index,
                }))

            if (subjectInserts.length > 0) {
                const { error: subjectsError } = await supabase
                    .from('required_subjects')
                    .insert(subjectInserts)

                if (subjectsError) throw subjectsError
            }

            // 総合データを追加
            if (passingMin !== '' || passerAvg !== '' || applicantAvg !== '') {
                const { error: overallError } = await supabase
                    .from('official_data')
                    .insert({
                        exam_session_id: session.id,
                        subject: '総合',
                        passing_min: passingMin === '' ? null : passingMin,
                        passer_avg: passerAvg === '' ? null : passerAvg,
                        applicant_avg: applicantAvg === '' ? null : applicantAvg,
                    })

                if (overallError) throw overallError
            }

            // 科目別平均を追加
            const subjectNames = ['算数', '国語', '理科', '社会', '英語']
            for (const subj of subjectNames) {
                const passerKey = `${subj}合平均` as keyof typeof subjectAvgs
                const applicantKey = `${subj}受平均` as keyof typeof subjectAvgs
                const passerVal = subjectAvgs[passerKey]
                const applicantVal = subjectAvgs[applicantKey]

                if (passerVal > 0 || applicantVal > 0) {
                    await supabase
                        .from('official_data')
                        .insert({
                            exam_session_id: session.id,
                            subject: subj,
                            passer_avg: passerVal || null,
                            applicant_avg: applicantVal || null,
                        })
                }
            }

            // 成功
            resetForm()
            onSuccess()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    function handleClose() {
        if (!loading) {
            resetForm()
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="試験データ追加">
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* 1. 学校選択 */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">1. 学校選択</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={mode === 'existing'}
                                onChange={() => setMode('existing')}
                                className="w-4 h-4"
                            />
                            <span className="text-slate-700">既存の学校から選択</span>
                        </label>

                        {mode === 'existing' && (
                            <select
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={mode === 'new'}
                                onChange={() => setMode('new')}
                                className="w-4 h-4"
                            />
                            <span className="text-slate-700">新しい学校を追加</span>
                        </label>

                        {mode === 'new' && (
                            <div className="space-y-2 pl-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        学校名 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newSchoolName}
                                        onChange={(e) => setNewSchoolName(e.target.value)}
                                        placeholder="例: 開成中学校"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        別名（任意）
                                    </label>
                                    <input
                                        type="text"
                                        value={newSchoolAlias}
                                        onChange={(e) => setNewSchoolAlias(e.target.value)}
                                        placeholder="例: 開成"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. 試験情報 */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">2. 試験情報</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                年度 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                min="2000"
                                max="2099"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                回 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={sessionLabel}
                                onChange={(e) => setSessionLabel(e.target.value)}
                                placeholder="例: 第1回"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. 科目配点 */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">3. 科目配点</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {(['算数', '国語', '理科', '社会', '英語'] as const).map(subj => (
                            <div key={subj}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {subj}
                                </label>
                                <input
                                    type="number"
                                    value={subjects[subj] || ''}
                                    onChange={(e) => setSubjects({
                                        ...subjects,
                                        [subj]: parseInt(e.target.value) || 0
                                    })}
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. 総合データ */}
                <div>
                    <h3 className="font-semibold text-slate-800 mb-3">4. 総合データ（任意）</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                合格最低点
                            </label>
                            <input
                                type="number"
                                value={passingMin}
                                onChange={(e) => setPassingMin(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                合格者平均
                            </label>
                            <input
                                type="number"
                                value={passerAvg}
                                onChange={(e) => setPasserAvg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                受験者平均
                            </label>
                            <input
                                type="number"
                                value={applicantAvg}
                                onChange={(e) => setApplicantAvg(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="0"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. 科目別平均 */}
                <details className="border border-slate-200 rounded-lg p-4">
                    <summary className="font-semibold text-slate-800 cursor-pointer">
                        5. 科目別平均（任意・詳細）
                    </summary>
                    <div className="mt-4 space-y-4">
                        {(['算数', '国語', '理科', '社会', '英語'] as const).map(subj => (
                            <div key={subj} className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {subj}合格者平均
                                    </label>
                                    <input
                                        type="number"
                                        value={subjectAvgs[`${subj}合平均` as keyof typeof subjectAvgs] || ''}
                                        onChange={(e) => setSubjectAvgs({
                                            ...subjectAvgs,
                                            [`${subj}合平均`]: parseFloat(e.target.value) || 0
                                        })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {subj}受験者平均
                                    </label>
                                    <input
                                        type="number"
                                        value={subjectAvgs[`${subj}受平均` as keyof typeof subjectAvgs] || ''}
                                        onChange={(e) => setSubjectAvgs({
                                            ...subjectAvgs,
                                            [`${subj}受平均`]: parseFloat(e.target.value) || 0
                                        })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </details>

                {/* ボタン */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        保存
                    </button>
                </div>
            </div>
        </Modal>
    )
}

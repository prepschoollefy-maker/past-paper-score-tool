'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CRAM_SCHOOLS = [
    'SAPIX',
    '四谷大塚',
    '日能研',
    '希学園',
    '浜学園',
    'グノーブル',
    '早稲田アカデミー',
    'その他',
] as const

const GRADES = [
    { value: '小1', label: '小学1年生' },
    { value: '小2', label: '小学2年生' },
    { value: '小3', label: '小学3年生' },
    { value: '小4', label: '小学4年生' },
    { value: '小5', label: '小学5年生' },
    { value: '小6', label: '小学6年生' },
] as const

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        emailConfirm: '',
        password: '',
        passwordConfirm: '',
        parentLastName: '',
        parentFirstName: '',
        studentLastName: '',
        studentFirstName: '',
        grade: '',
        cramSchool: '',
        cramSchoolOther: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (formData.email !== formData.emailConfirm) {
            setError('メールアドレスが一致しません')
            return
        }
        if (formData.password !== formData.passwordConfirm) {
            setError('パスワードが一致しません')
            return
        }
        if (formData.password.length < 6) {
            setError('パスワードは6文字以上で入力してください')
            return
        }
        if (!formData.parentLastName || !formData.parentFirstName) {
            setError('保護者氏名を入力してください')
            return
        }
        if (!formData.studentLastName || !formData.studentFirstName) {
            setError('生徒名を入力してください')
            return
        }
        if (!formData.grade) {
            setError('学年を選択してください')
            return
        }
        if (!formData.cramSchool) {
            setError('通塾先を選択してください')
            return
        }
        if (formData.cramSchool === 'その他' && !formData.cramSchoolOther) {
            setError('通塾先を入力してください')
            return
        }

        setLoading(true)

        const studentName = `${formData.studentLastName} ${formData.studentFirstName}`

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: studentName,
                    student_last_name: formData.studentLastName,
                    student_first_name: formData.studentFirstName,
                    parent_last_name: formData.parentLastName,
                    parent_first_name: formData.parentFirstName,
                    grade: formData.grade,
                    cram_school: formData.cramSchool,
                    cram_school_other: formData.cramSchool === 'その他' ? formData.cramSchoolOther : null,
                },
            },
        })

        if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                setError('このメールアドレスは既に登録されています')
            } else {
                setError(`登録に失敗しました: ${signUpError.message}`)
            }
            setLoading(false)
        } else {
            // トリガーが対応しない場合に備えて、profilesテーブルを直接更新
            if (signUpData.user) {
                await supabase
                    .from('profiles')
                    .update({
                        name: studentName,
                        student_last_name: formData.studentLastName,
                        student_first_name: formData.studentFirstName,
                        parent_last_name: formData.parentLastName,
                        parent_first_name: formData.parentFirstName,
                        grade: formData.grade,
                        cram_school: formData.cramSchool,
                        cram_school_other: formData.cramSchool === 'その他' ? formData.cramSchoolOther : null,
                    })
                    .eq('id', signUpData.user.id)
            }
            router.push('/dashboard')
            router.refresh()
        }
    }

    const inputClass = "w-full px-4 py-3 bg-white border border-teal-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
    const labelClass = "block text-sm font-medium text-teal-800 mb-1.5"

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50 py-12 px-4">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-teal-700 mb-2">アカウント登録</h1>
                        <p className="text-slate-500 text-sm">過去問得点管理ツールを始めましょう</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* メールアドレス */}
                        <div>
                            <label className={labelClass}>
                                メールアドレス <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                required
                                className={inputClass}
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                メールアドレス確認 <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.emailConfirm}
                                onChange={(e) => updateField('emailConfirm', e.target.value)}
                                required
                                className={inputClass}
                                placeholder="メールアドレスを再入力"
                            />
                        </div>

                        {/* パスワード */}
                        <div>
                            <label className={labelClass}>
                                パスワード <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                required
                                className={inputClass}
                                placeholder="6文字以上"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                パスワード確認 <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={formData.passwordConfirm}
                                onChange={(e) => updateField('passwordConfirm', e.target.value)}
                                required
                                className={inputClass}
                                placeholder="パスワードを再入力"
                            />
                        </div>

                        {/* 区切り線 */}
                        <div className="border-t border-teal-100 pt-2"></div>

                        {/* 保護者氏名 */}
                        <div>
                            <label className={labelClass}>
                                保護者氏名 <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.parentLastName}
                                    onChange={(e) => updateField('parentLastName', e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="姓"
                                />
                                <input
                                    type="text"
                                    value={formData.parentFirstName}
                                    onChange={(e) => updateField('parentFirstName', e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="名"
                                />
                            </div>
                        </div>

                        {/* 生徒名 */}
                        <div>
                            <label className={labelClass}>
                                生徒名 <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.studentLastName}
                                    onChange={(e) => updateField('studentLastName', e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="姓"
                                />
                                <input
                                    type="text"
                                    value={formData.studentFirstName}
                                    onChange={(e) => updateField('studentFirstName', e.target.value)}
                                    required
                                    className={inputClass}
                                    placeholder="名"
                                />
                            </div>
                        </div>

                        {/* 学年 */}
                        <div>
                            <label className={labelClass}>
                                学年 <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => updateField('grade', e.target.value)}
                                required
                                className={inputClass + " appearance-none"}
                            >
                                <option value="">選択してください</option>
                                {GRADES.map(g => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* 通塾先 */}
                        <div>
                            <label className={labelClass}>
                                通塾先 <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.cramSchool}
                                onChange={(e) => updateField('cramSchool', e.target.value)}
                                required
                                className={inputClass + " appearance-none"}
                            >
                                <option value="">選択してください</option>
                                {CRAM_SCHOOLS.map(school => (
                                    <option key={school} value={school}>{school}</option>
                                ))}
                            </select>
                            {formData.cramSchool === 'その他' && (
                                <input
                                    type="text"
                                    value={formData.cramSchoolOther}
                                    onChange={(e) => updateField('cramSchoolOther', e.target.value)}
                                    className={inputClass + " mt-2"}
                                    placeholder="塾名を入力してください"
                                />
                            )}
                        </div>

                        {/* エラー */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '登録中...' : 'アカウントを作成'}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            既にアカウントをお持ちの方は{' '}
                            <Link href="/login" className="text-teal-600 hover:text-teal-500 underline transition-colors">
                                ログイン
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © 2026 過去問得点管理システム
                </p>
            </div>
        </div>
    )
}

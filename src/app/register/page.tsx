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

        // バリデーション
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

        const { error: signUpError } = await supabase.auth.signUp({
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
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="w-full max-w-lg">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">アカウント登録</h1>
                        <p className="text-slate-300 text-sm">過去問得点管理ツールを始めましょう</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* メールアドレス */}
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                メールアドレス <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="example@email.com"
                            />
                        </div>

                        {/* パスワード */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                    パスワード <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="6文字以上"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                    パスワード確認 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.passwordConfirm}
                                    onChange={(e) => updateField('passwordConfirm', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="再入力"
                                />
                            </div>
                        </div>

                        {/* 区切り線 */}
                        <div className="border-t border-white/10 pt-2"></div>

                        {/* 保護者氏名 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                保護者氏名 <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.parentLastName}
                                    onChange={(e) => updateField('parentLastName', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="姓"
                                />
                                <input
                                    type="text"
                                    value={formData.parentFirstName}
                                    onChange={(e) => updateField('parentFirstName', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="名"
                                />
                            </div>
                        </div>

                        {/* 生徒名 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                生徒名 <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={formData.studentLastName}
                                    onChange={(e) => updateField('studentLastName', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="姓"
                                />
                                <input
                                    type="text"
                                    value={formData.studentFirstName}
                                    onChange={(e) => updateField('studentFirstName', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="名"
                                />
                            </div>
                        </div>

                        {/* 学年 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                学年 <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.grade}
                                onChange={(e) => updateField('grade', e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="" className="bg-slate-800">選択してください</option>
                                {GRADES.map(g => (
                                    <option key={g.value} value={g.value} className="bg-slate-800">{g.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* 通塾先 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1.5">
                                通塾先 <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.cramSchool}
                                onChange={(e) => updateField('cramSchool', e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="" className="bg-slate-800">選択してください</option>
                                {CRAM_SCHOOLS.map(school => (
                                    <option key={school} value={school} className="bg-slate-800">{school}</option>
                                ))}
                            </select>
                            {formData.cramSchool === 'その他' && (
                                <input
                                    type="text"
                                    value={formData.cramSchoolOther}
                                    onChange={(e) => updateField('cramSchoolOther', e.target.value)}
                                    className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="塾名を入力してください"
                                />
                            )}
                        </div>

                        {/* エラー */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '登録中...' : 'アカウントを作成'}
                        </button>
                    </form>

                    {/* ログインリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            既にアカウントをお持ちの方は{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 underline transition-colors">
                                ログイン
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    © 2026 過去問得点管理システム
                </p>
            </div>
        </div>
    )
}

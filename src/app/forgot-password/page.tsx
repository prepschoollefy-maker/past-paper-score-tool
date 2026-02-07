'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
            setError('リセットメールの送信に失敗しました。メールアドレスを確認してください。')
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50">
            <div className="w-full max-w-md p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-teal-700 mb-2">パスワードの再設定</h1>
                        <p className="text-slate-500 text-sm">
                            登録したメールアドレスを入力してください
                        </p>
                    </div>

                    {success ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm">
                                <p className="font-semibold mb-1">メールを送信しました</p>
                                <p>パスワード再設定用のリンクを送信しました。メールを確認してリンクをクリックしてください。</p>
                            </div>
                            <Link
                                href="/login"
                                className="block text-center text-teal-600 hover:text-teal-500 underline transition-colors text-sm"
                            >
                                ログインページに戻る
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-teal-800 mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-teal-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                                    placeholder="example@email.com"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '送信中...' : 'リセットメールを送信'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-teal-600 hover:text-teal-500 underline transition-colors text-sm"
                                >
                                    ログインページに戻る
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-center text-slate-400 text-xs mt-6">
                    © 2026 過去問得点管理システム
                </p>
            </div>
        </div>
    )
}

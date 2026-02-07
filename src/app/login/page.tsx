'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError('メールアドレスまたはパスワードが正しくありません')
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50">
            <div className="w-full max-w-md p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-teal-700 mb-2">過去問得点管理</h1>
                        <p className="text-slate-500 text-sm">ログインして利用を開始</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-teal-800 mb-2">
                                パスワード
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white border border-teal-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                                placeholder="••••••••"
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
                            {loading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </form>

                    {/* パスワードを忘れた方 */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/forgot-password"
                            className="text-slate-400 hover:text-teal-500 text-sm transition-colors"
                        >
                            パスワードを忘れた方はこちら
                        </Link>
                    </div>

                    {/* 登録リンク */}
                    <div className="mt-3 text-center">
                        <p className="text-slate-500 text-sm">
                            アカウントをお持ちでない方は{' '}
                            <Link href="/register" className="text-teal-600 hover:text-teal-500 underline transition-colors">
                                新規登録
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

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

export default function AdminLoginPage() {
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
            if (error.message.includes('security purposes')) {
                setError('連続リクエストが制限されています。しばらく待ってから再度お試しください。')
            } else {
                setError('メールアドレスまたはパスワードが正しくありません')
            }
            setLoading(false)
            return
        }

        // 管理者かチェック
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'admin') {
                router.push('/admin-panel')
                router.refresh()
            } else {
                // 管理者でなければサインアウトしてエラー表示
                await supabase.auth.signOut()
                setError('管理者アカウントではありません')
                setLoading(false)
            }
        } else {
            setError('認証に失敗しました')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="w-full max-w-md p-8">
                <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-600 rounded-xl mb-4">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">管理者ログイン</h1>
                        <p className="text-slate-400 text-sm">Admin Panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                メールアドレス
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                パスワード
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'ログイン中...' : '管理者ログイン'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    &copy; 2026 過去問得点管理システム
                </p>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // セッションが有効か確認
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setSessionReady(true)
            } else {
                setError('セッションが無効です。もう一度パスワードリセットをお試しください。')
            }
        }
        checkSession()
    }, [supabase.auth])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== passwordConfirm) {
            setError('パスワードが一致しません')
            return
        }
        if (password.length < 6) {
            setError('パスワードは6文字以上で入力してください')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password,
        })

        if (error) {
            setError(`パスワードの更新に失敗しました: ${error.message}`)
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50">
            <div className="w-full max-w-md p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-teal-700 mb-2">新しいパスワードを設定</h1>
                        <p className="text-slate-500 text-sm">新しいパスワードを入力してください</p>
                    </div>

                    {success ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm">
                                <p className="font-semibold mb-1">パスワードを更新しました</p>
                                <p>ダッシュボードに移動します...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-teal-800 mb-2">
                                    新しいパスワード
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={!sessionReady}
                                    className="w-full px-4 py-3 bg-white border border-teal-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all disabled:opacity-50"
                                    placeholder="6文字以上"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-teal-800 mb-2">
                                    新しいパスワード（確認）
                                </label>
                                <input
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required
                                    disabled={!sessionReady}
                                    className="w-full px-4 py-3 bg-white border border-teal-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all disabled:opacity-50"
                                    placeholder="パスワードを再入力"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {error}
                                    {!sessionReady && (
                                        <div className="mt-2">
                                            <Link href="/forgot-password" className="text-teal-600 underline">
                                                パスワードリセットをやり直す
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !sessionReady}
                                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '更新中...' : 'パスワードを更新'}
                            </button>
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

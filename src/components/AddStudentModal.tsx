'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/Modal'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface AddStudentModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const supabase = createClient()

    function generatePassword() {
        // 8文字のランダムパスワード生成
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let pwd = ''
        for (let i = 0; i < 8; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setPassword(pwd)
    }

    function resetForm() {
        setEmail('')
        setPassword('')
        setShowPassword(false)
        setName('')
        setError(null)
        setSuccess(false)
    }

    async function handleSave() {
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // バリデーション
            if (!email.trim()) {
                throw new Error('メールアドレスを入力してください')
            }
            if (!password.trim()) {
                throw new Error('パスワードを入力してください')
            }
            if (password.length < 6) {
                throw new Error('パスワードは6文字以上にしてください')
            }

            // Supabase Authでユーザー作成
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: {
                        name: name.trim() || null,
                    }
                }
            })

            if (authError) throw authError

            if (!authData.user) {
                throw new Error('ユーザー作成に失敗しました')
            }

            // プロフィールを更新（roleをuserに設定）
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: 'user',
                    name: name.trim() || null,
                })
                .eq('id', authData.user.id)

            if (profileError) {
                console.error('Profile update error:', profileError)
                // プロフィール更新失敗は警告のみ
            }

            // 成功
            setSuccess(true)
            setTimeout(() => {
                resetForm()
                onSuccess()
                onClose()
            }, 2000)
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
        <Modal isOpen={isOpen} onClose={handleClose} title="生徒アカウント追加">
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        ✅ 生徒アカウントを作成しました！
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        名前（任意）
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="例: 山田太郎"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading || success}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading || success}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">
                            パスワード <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="text-sm text-blue-600 hover:text-blue-700"
                            disabled={loading || success}
                        >
                            自動生成
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6文字以上"
                            className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading || success}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            disabled={loading || success}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        このパスワードを生徒に伝えてください
                    </p>
                </div>

                {/* ボタン */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        onClick={handleClose}
                        disabled={loading || success}
                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        {success ? '閉じる' : 'キャンセル'}
                    </button>
                    {!success && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            作成
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

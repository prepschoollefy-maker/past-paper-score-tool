'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { Plus, Eye, ArrowLeft, UserPlus, Mail, User } from 'lucide-react'
import Link from 'next/link'

export default function StudentsAdminPage() {
    const [students, setStudents] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)

    // 新規作成フォーム
    const [newEmail, setNewEmail] = useState('')
    const [newName, setNewName] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchStudents()
    }, [])

    async function fetchStudents() {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'user')
            .order('name')
        if (data) setStudents(data)
        setLoading(false)
    }

    async function handleAddStudent(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setSaving(true)

        try {
            // Supabase Authでユーザー作成
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newEmail,
                    password: newPassword,
                    name: newName,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'ユーザー作成に失敗しました')
            }

            setSuccess(`${newName} さんのアカウントを作成しました`)
            setNewEmail('')
            setNewName('')
            setNewPassword('')
            setShowAddForm(false)
            fetchStudents()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました')
        } finally {
            setSaving(false)
        }
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
                <h1 className="text-2xl font-bold text-slate-800">生徒管理</h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    <span className="hidden sm:inline">新規生徒登録</span>
                </button>
            </div>

            {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-600">
                    {success}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
                    {error}
                </div>
            )}

            {/* 新規追加フォーム */}
            {showAddForm && (
                <form onSubmit={handleAddStudent} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <h2 className="font-semibold text-slate-800">新規生徒アカウント作成</h2>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                名前
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                                placeholder="山田太郎"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-1" />
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                placeholder="example@email.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                パスワード
                            </label>
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="6文字以上"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {saving ? '作成中...' : '作成'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            キャンセル
                        </button>
                    </div>
                </form>
            )}

            {/* 生徒一覧 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">名前</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">メール</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">登録日</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        登録されている生徒がいません
                                    </td>
                                </tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-800">{student.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{student.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(student.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/students/${student.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

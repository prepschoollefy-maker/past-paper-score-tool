'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, UserPlus, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AddStudentModal from '@/components/AddStudentModal'

interface UserProfile {
    id: string
    email: string
    name: string | null
    role: string
    student_last_name: string | null
    student_first_name: string | null
    parent_last_name: string | null
    parent_first_name: string | null
    grade: string | null
    cram_school: string | null
    cram_school_other: string | null
    created_at: string
}

export default function AdminUsersPage() {
    const [showModal, setShowModal] = useState(false)
    const [users, setUsers] = useState<UserProfile[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        setLoading(true)

        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (profiles) {
            setUsers(profiles as UserProfile[])
            setFilteredUsers(profiles as UserProfile[])
        }

        setLoading(false)
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (!query) {
            setFilteredUsers(users)
            return
        }

        const filtered = users.filter(user =>
            user.email.toLowerCase().includes(query) ||
            (user.student_last_name && user.student_last_name.toLowerCase().includes(query)) ||
            (user.student_first_name && user.student_first_name.toLowerCase().includes(query)) ||
            (user.parent_last_name && user.parent_last_name.toLowerCase().includes(query)) ||
            (user.parent_first_name && user.parent_first_name.toLowerCase().includes(query)) ||
            (user.name && user.name.toLowerCase().includes(query))
        )
        setFilteredUsers(filtered)
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    function getStudentName(user: UserProfile) {
        if (user.student_last_name && user.student_first_name) {
            return `${user.student_last_name} ${user.student_first_name}`
        }
        return user.name || '-'
    }

    function getParentName(user: UserProfile) {
        if (user.parent_last_name && user.parent_first_name) {
            return `${user.parent_last_name} ${user.parent_first_name}`
        }
        return '-'
    }

    function getCramSchool(user: UserProfile) {
        if (user.cram_school === 'その他' && user.cram_school_other) {
            return user.cram_school_other
        }
        return user.cram_school || '-'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin-panel" className="text-slate-400 hover:text-slate-200 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">ユーザー管理</h1>
                        <p className="text-sm text-slate-400">{users.length}件のユーザー</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    ユーザー追加
                </button>
            </div>

            {/* 検索ボックス */}
            <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-4">
                <input
                    type="text"
                    placeholder="メールアドレス、生徒名、保護者名で検索..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {searchQuery && (
                    <p className="text-sm text-slate-400 mt-2">
                        {filteredUsers.length}件の結果
                    </p>
                )}
            </div>

            {/* ユーザー一覧テーブル */}
            <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-700/50 border-b border-slate-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            生徒名
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            保護者名
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            メール
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            学年
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            通塾先
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            権限
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                                            登録日
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3 text-sm text-white font-medium">
                                                {getStudentName(user)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-300">
                                                {getParentName(user)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-300">
                                                <span className="text-xs">{user.email}</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-300">
                                                {user.grade || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-300">
                                                {getCramSchool(user)}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                        : 'bg-slate-600/50 text-slate-300 border border-slate-500/30'
                                                    }`}>
                                                    {user.role === 'admin' ? '管理者' : 'ユーザー'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-400">
                                                {formatDate(user.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                {searchQuery ? '検索結果が見つかりませんでした' : 'ユーザーがまだ登録されていません'}
                            </div>
                        )}
                    </>
                )}
            </div>

            <AddStudentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false)
                    fetchUsers()
                }}
            />
        </div>
    )
}

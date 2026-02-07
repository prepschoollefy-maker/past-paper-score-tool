'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AddStudentModal from '@/components/AddStudentModal'

interface Student {
    id: string
    email: string
    name: string | null
    created_at: string
}

export default function AdminStudentsPage() {
    const [showModal, setShowModal] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        fetchStudents()
    }, [])

    async function fetchStudents() {
        setLoading(true)

        // profilesテーブルから生徒（role='user'）を取得（emailも含む）
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, name, email, created_at')
            .eq('role', 'user')
            .order('created_at', { ascending: false })

        if (profiles) {
            setStudents(profiles as Student[])
            setFilteredStudents(profiles as Student[])
        }

        setLoading(false)
    }

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (!query) {
            setFilteredStudents(students)
            return
        }

        const filtered = students.filter(student =>
            student.email.toLowerCase().includes(query) ||
            (student.name && student.name.toLowerCase().includes(query))
        )
        setFilteredStudents(filtered)
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin-panel" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">生徒管理</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    生徒追加
                </button>
            </div>

            {/* 検索ボックス */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <input
                    type="text"
                    placeholder="メールアドレスまたは名前で検索..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchQuery && (
                    <p className="text-sm text-slate-500 mt-2">
                        {filteredStudents.length}件の結果が見つかりました
                    </p>
                )}
            </div>

            {/* 生徒一覧テーブル */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-purple-50 border-b border-purple-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                            メールアドレス
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                            名前
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                            作成日
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm text-slate-800">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-800">
                                                {student.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(student.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredStudents.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                {searchQuery ? '検索結果が見つかりませんでした' : '生徒がまだ登録されていません'}
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
                    fetchStudents() // 生徒追加後にリストを更新
                }}
            />
        </div>
    )
}

'use client'

import { useState } from 'react'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import AddStudentModal from '@/components/AddStudentModal'

export default function AdminStudentsPage() {
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">生徒追加</h1>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-purple-200 p-12 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <UserPlus className="w-10 h-10 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">
                        新規生徒アカウント作成
                    </h2>
                    <p className="text-slate-600">
                        生徒のメールアドレスとパスワードを設定して、新しいアカウントを作成します。
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
                    >
                        生徒アカウント作成
                    </button>
                </div>
            </div>

            <AddStudentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => setShowModal(false)}
            />
        </div>
    )
}

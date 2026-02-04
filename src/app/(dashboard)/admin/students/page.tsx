'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-slate-600">
                        新規生徒アカウントを作成します
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
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

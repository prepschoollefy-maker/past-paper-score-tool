'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { School, SchoolAlias } from '@/types/database'
import { Plus, Edit2, Trash2, X, Check, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'

export default function SchoolsAdminPage() {
    const [schools, setSchools] = useState<(School & { school_aliases?: SchoolAlias[] })[]>([])
    const [loading, setLoading] = useState(true)
    const [newSchoolName, setNewSchoolName] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [addingAliasId, setAddingAliasId] = useState<string | null>(null)
    const [newAlias, setNewAlias] = useState('')
    const [saving, setSaving] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchSchools()
    }, [])

    async function fetchSchools() {
        const { data } = await supabase
            .from('schools')
            .select('*, school_aliases(*)')
            .order('name')
        if (data) setSchools(data)
        setLoading(false)
    }

    async function handleAddSchool(e: React.FormEvent) {
        e.preventDefault()
        if (!newSchoolName.trim()) return

        setSaving(true)
        const { error } = await supabase
            .from('schools')
            .insert({ name: newSchoolName.trim() })

        if (!error) {
            setNewSchoolName('')
            fetchSchools()
        }
        setSaving(false)
    }

    async function handleUpdateSchool(id: string) {
        if (!editingName.trim()) return

        setSaving(true)
        const { error } = await supabase
            .from('schools')
            .update({ name: editingName.trim() })
            .eq('id', id)

        if (!error) {
            setEditingId(null)
            setEditingName('')
            fetchSchools()
        }
        setSaving(false)
    }

    async function handleDeleteSchool(id: string) {
        if (!confirm('この学校を削除しますか？関連する試験回もすべて削除されます。')) return

        await supabase.from('schools').delete().eq('id', id)
        fetchSchools()
    }

    async function handleAddAlias(schoolId: string) {
        if (!newAlias.trim()) return

        setSaving(true)
        const { error } = await supabase
            .from('school_aliases')
            .insert({ school_id: schoolId, alias: newAlias.trim() })

        if (!error) {
            setAddingAliasId(null)
            setNewAlias('')
            fetchSchools()
        }
        setSaving(false)
    }

    async function handleDeleteAlias(id: string) {
        await supabase.from('school_aliases').delete().eq('id', id)
        fetchSchools()
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
                <h1 className="text-2xl font-bold text-slate-800">学校管理</h1>
            </div>

            {/* 新規追加フォーム */}
            <form onSubmit={handleAddSchool} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                        placeholder="新しい学校名を入力..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={saving || !newSchoolName.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        追加
                    </button>
                </div>
            </form>

            {/* 学校一覧 */}
            <div className="space-y-4">
                {schools.map(school => (
                    <div key={school.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            {editingId === school.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleUpdateSchool(school.id)}
                                        disabled={saving}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { setEditingId(null); setEditingName('') }}
                                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 font-medium text-slate-800">{school.name}</span>
                                    <button
                                        onClick={() => { setEditingId(school.id); setEditingName(school.name) }}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSchool(school.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* 別名 */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2 items-center">
                                <Tag className="w-4 h-4 text-slate-400" />
                                {school.school_aliases?.map(alias => (
                                    <span
                                        key={alias.id}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm text-slate-600"
                                    >
                                        {alias.alias}
                                        <button
                                            onClick={() => handleDeleteAlias(alias.id)}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}

                                {addingAliasId === school.id ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="text"
                                            value={newAlias}
                                            onChange={(e) => setNewAlias(e.target.value)}
                                            placeholder="別名"
                                            className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleAddAlias(school.id)}
                                            disabled={saving}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => { setAddingAliasId(null); setNewAlias('') }}
                                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingAliasId(school.id)}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        別名追加
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

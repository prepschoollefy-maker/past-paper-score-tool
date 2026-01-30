import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, TrendingUp, Target } from 'lucide-react'

export default async function StudentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // 管理者チェック
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (adminProfile?.role !== 'admin') redirect('/dashboard')

    // 生徒情報を取得
    const { data: student } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (!student) redirect('/admin/students')

    // 生徒の演習記録を取得
    const { data: records } = await supabase
        .from('practice_records')
        .select(`
      *,
      exam_session:exam_sessions(*, school:schools(*)),
      practice_scores(*)
    `)
        .eq('user_id', id)
        .order('practice_date', { ascending: false })

    // 統計を計算
    const totalRecords = records?.length || 0
    const schoolsSet = new Set(records?.map(r => r.exam_session?.school?.name).filter(Boolean))
    const uniqueSchools = schoolsSet.size

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/students" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
                    <p className="text-sm text-slate-500">{student.email}</p>
                </div>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{totalRecords}</p>
                            <p className="text-sm text-slate-500">演習回数</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{uniqueSchools}</p>
                            <p className="text-sm text-slate-500">対象校数</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">
                                {records?.[0] ? new Date(records[0].practice_date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) : '-'}
                            </p>
                            <p className="text-sm text-slate-500">最終演習日</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 演習履歴 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">演習履歴</h2>
                </div>
                {records && records.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {records.map(record => {
                            const scores = record.practice_scores || []
                            const totalScore = scores.reduce((sum: number, s: { score: number }) => sum + s.score, 0)
                            const totalMaxScore = scores.reduce((sum: number, s: { max_score: number }) => sum + s.max_score, 0)
                            const totalRate = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

                            return (
                                <div key={record.id} className="p-4 hover:bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {record.exam_session?.school?.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {record.exam_session?.year}年度 {record.exam_session?.session_label}
                                            </p>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {new Date(record.practice_date).toLocaleDateString('ja-JP')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">{totalRate}%</p>
                                            <p className="text-sm text-slate-500">{totalScore}/{totalMaxScore}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {scores.map((s: { subject: string; score: number; max_score: number }) => (
                                            <span key={s.subject} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                                                {s.subject}: {s.score}/{s.max_score}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        まだ演習記録がありません
                    </div>
                )}
            </div>
        </div>
    )
}

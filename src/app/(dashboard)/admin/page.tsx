import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { School, Calendar, Users, Database, Upload } from 'lucide-react'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // 統計情報を取得
    const { count: schoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true })

    const { count: examSessionCount } = await supabase
        .from('exam_sessions')
        .select('*', { count: 'exact', head: true })

    const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user')

    const { count: recordCount } = await supabase
        .from('practice_records')
        .select('*', { count: 'exact', head: true })

    const menuItems = [
        {
            title: '学校管理',
            description: '学校マスタの追加・編集・別名登録',
            href: '/admin/schools',
            icon: School,
            count: schoolCount || 0,
            color: 'blue',
        },
        {
            title: '試験回管理',
            description: '年度・回ラベル・科目・公式データの設定',
            href: '/admin/exam-sessions',
            icon: Calendar,
            count: examSessionCount || 0,
            color: 'green',
        },
        {
            title: '生徒管理',
            description: '生徒アカウントの作成・一覧・詳細閲覧',
            href: '/admin/students',
            icon: Users,
            count: studentCount || 0,
            color: 'purple',
        },
        {
            title: 'データインポート',
            description: 'CSVから学校・試験データを一括登録',
            href: '/admin/import',
            icon: Upload,
            color: 'amber',
        },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">管理者メニュー</h1>

            {/* 統計 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <School className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{schoolCount || 0}</p>
                            <p className="text-sm text-slate-500">学校</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{examSessionCount || 0}</p>
                            <p className="text-sm text-slate-500">試験回</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{studentCount || 0}</p>
                            <p className="text-sm text-slate-500">生徒</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{recordCount || 0}</p>
                            <p className="text-sm text-slate-500">演習記録</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* メニュー */}
            <div className="grid md:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all group"
                    >
                        <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-1">{item.title}</h2>
                        <p className="text-sm text-slate-500">{item.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

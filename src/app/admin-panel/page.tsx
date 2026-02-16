import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Database, Upload, Users, BarChart3 } from 'lucide-react'

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

    const menuItems = [
        {
            title: 'ユーザー管理',
            description: '登録ユーザーの一覧確認・検索',
            href: '/admin-panel/students',
            icon: Users,
            gradient: 'from-purple-500 to-purple-700',
        },
        {
            title: '得点閲覧',
            description: 'ユーザーごとの過去問得点を確認',
            href: '/admin-panel/scores',
            icon: BarChart3,
            gradient: 'from-orange-500 to-orange-700',
        },
        {
            title: 'データ編集',
            description: '試験データの閲覧・編集・追加',
            href: '/admin-panel/edit',
            icon: Database,
            gradient: 'from-teal-500 to-teal-700',
        },
        {
            title: 'データ取込',
            description: 'CSVから学校・試験回・公式データを一括登録',
            href: '/admin-panel/import',
            icon: Upload,
            gradient: 'from-amber-500 to-amber-700',
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">管理者メニュー</h1>
                <p className="text-sm text-slate-400 mt-1">各機能を選択してください</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:shadow-xl hover:border-orange-500/50 transition-all group"
                    >
                        <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                            <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-1">{item.title}</h2>
                        <p className="text-sm text-slate-400">{item.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

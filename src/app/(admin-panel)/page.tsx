import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Upload, Edit, UserPlus } from 'lucide-react'

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
            title: '生徒追加',
            description: '新規生徒アカウントを作成',
            href: '/admin-panel/students',
            icon: UserPlus,
            color: 'purple',
        },
        {
            title: '過去問得点データインポート',
            description: 'CSVから学校・試験回・公式データを一括登録',
            href: '/admin-panel/import',
            icon: Upload,
            color: 'amber',
        },
        {
            title: '過去問得点データ編集',
            description: 'インポート済みの試験データを閲覧・編集・追加',
            href: '/admin-panel/edit',
            icon: Edit,
            color: 'indigo',
        },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">管理者メニュー</h1>

            {/* メニュー */}
            <div className="grid md:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 hover:shadow-xl hover:border-orange-500 transition-all group"
                    >
                        <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-1">{item.title}</h2>
                        <p className="text-sm text-slate-400">{item.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

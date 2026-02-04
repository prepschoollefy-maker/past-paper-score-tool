import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Upload, Edit } from 'lucide-react'

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
            title: 'データインポート',
            description: 'CSVから学校・試験データを一括登録',
            href: '/admin/import',
            icon: Upload,
            color: 'amber',
        },
        {
            title: 'データ編集',
            description: 'インポート済みデータの閲覧・編集',
            href: '/admin/edit',
            icon: Edit,
            color: 'indigo',
        },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">管理者メニュー</h1>

            {/* メニュー */}
            <div className="grid md:grid-cols-2 gap-4">
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

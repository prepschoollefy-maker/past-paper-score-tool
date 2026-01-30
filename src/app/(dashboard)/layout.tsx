import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, History, LayoutDashboard, Settings } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ヘッダー */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="text-xl font-bold text-slate-800">
                                過去問得点管理
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                ダッシュボード
                            </Link>
                            <Link href="/records" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <History className="w-4 h-4" />
                                履歴
                            </Link>
                            <Link href="/records/new" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <Plus className="w-4 h-4" />
                                得点入力
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                                    <Settings className="w-4 h-4" />
                                    管理
                                </Link>
                            )}
                        </nav>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500 hidden sm:block">
                                {profile?.name || user.email}
                            </span>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">ログアウト</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* モバイルナビゲーション */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
                <div className="flex justify-around py-2">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-slate-600">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-xs">ダッシュボード</span>
                    </Link>
                    <Link href="/records" className="flex flex-col items-center gap-1 p-2 text-slate-600">
                        <History className="w-5 h-5" />
                        <span className="text-xs">履歴</span>
                    </Link>
                    <Link href="/records/new" className="flex flex-col items-center gap-1 p-2 text-blue-600">
                        <div className="w-12 h-12 -mt-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs">入力</span>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="flex flex-col items-center gap-1 p-2 text-slate-600">
                            <Settings className="w-5 h-5" />
                            <span className="text-xs">管理</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
                {children}
            </main>
        </div>
    )
}

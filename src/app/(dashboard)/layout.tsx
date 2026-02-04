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
        <div className="min-h-screen bg-[#F8FCFC]">
            {/* ヘッダー */}
            <header className="bg-[#EBF6F7] border-b border-[#D9EEEF] sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="text-xl font-bold text-[#1A3E42]">
                                過去問得点管理
                            </Link>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="flex items-center gap-2 text-[#4A6B6F] hover:text-[#4DB8C4] transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                ダッシュボード
                            </Link>
                            <Link href="/records" className="flex items-center gap-2 text-[#4A6B6F] hover:text-[#4DB8C4] transition-colors">
                                <History className="w-4 h-4" />
                                履歴
                            </Link>
                            <Link href="/records/new" className="flex items-center gap-2 text-[#4A6B6F] hover:text-[#4DB8C4] transition-colors">
                                <Plus className="w-4 h-4" />
                                得点入力
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="flex items-center gap-2 text-[#4A6B6F] hover:text-[#4DB8C4] transition-colors">
                                    <Settings className="w-4 h-4" />
                                    管理
                                </Link>
                            )}
                        </nav>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#7A9B9F] hidden sm:block">
                                {profile?.name || user.email}
                            </span>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 text-[#4A6B6F] hover:text-red-500 transition-colors"
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#EBF6F7] border-t border-[#D9EEEF] z-50 shadow-lg">
                <div className="flex justify-around py-3">
                    <Link
                        href="/dashboard"
                        className="flex flex-col items-center gap-1 px-4 py-2 text-[#4A6B6F] hover:text-[#4DB8C4] active:bg-[#D9EEEF]/30 rounded-lg transition-all"
                    >
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-xs font-medium">ダッシュボード</span>
                    </Link>
                    <Link
                        href="/records"
                        className="flex flex-col items-center gap-1 px-4 py-2 text-[#4A6B6F] hover:text-[#4DB8C4] active:bg-[#D9EEEF]/30 rounded-lg transition-all"
                    >
                        <History className="w-6 h-6" />
                        <span className="text-xs font-medium">履歴</span>
                    </Link>
                    <Link
                        href="/records/new"
                        className="flex flex-col items-center gap-1 -mt-4"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-[#4DB8C4] to-[#3A9AA4] rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all">
                            <Plus className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-medium text-[#4DB8C4] mt-1">入力</span>
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="flex flex-col items-center gap-1 px-4 py-2 text-[#4A6B6F] hover:text-[#4DB8C4] active:bg-[#D9EEEF]/30 rounded-lg transition-all"
                        >
                            <Settings className="w-6 h-6" />
                            <span className="text-xs font-medium">管理</span>
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

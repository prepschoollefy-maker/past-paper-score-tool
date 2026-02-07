import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Database, Upload, Users, LayoutDashboard, Shield, BarChart3 } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export default async function AdminPanelLayout({
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

    // 管理者チェック
    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* ヘッダー */}
            <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-600 p-2 rounded-lg">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">管理者パネル</h1>
                                <p className="text-xs text-slate-400">Admin Panel</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/admin-panel" className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                ダッシュボード
                            </Link>
                            <Link href="/admin-panel/edit" className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                                <Database className="w-4 h-4" />
                                データ編集
                            </Link>
                            <Link href="/admin-panel/import" className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                                <Upload className="w-4 h-4" />
                                データ取込
                            </Link>
                            <Link href="/admin-panel/students" className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                                <Users className="w-4 h-4" />
                                ユーザー管理
                            </Link>
                            <Link href="/admin-panel/scores" className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors">
                                <BarChart3 className="w-4 h-4" />
                                得点閲覧
                            </Link>
                            <div className="h-6 w-px bg-slate-600"></div>
                            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-sm">
                                <LayoutDashboard className="w-4 h-4" />
                                ユーザー画面
                            </Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <span className="text-xs text-slate-500">管理者</span>
                                <p className="text-sm text-slate-300">{profile?.name || user.email}</p>
                            </div>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50 shadow-lg">
                <div className="flex justify-around py-3">
                    <Link
                        href="/admin-panel"
                        className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 hover:text-orange-400 active:bg-slate-700/30 rounded-lg transition-all"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-xs font-medium">ダッシュボード</span>
                    </Link>
                    <Link
                        href="/admin-panel/edit"
                        className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 hover:text-orange-400 active:bg-slate-700/30 rounded-lg transition-all"
                    >
                        <Database className="w-5 h-5" />
                        <span className="text-xs font-medium">編集</span>
                    </Link>
                    <Link
                        href="/admin-panel/import"
                        className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 hover:text-orange-400 active:bg-slate-700/30 rounded-lg transition-all"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="text-xs font-medium">取込</span>
                    </Link>
                    <Link
                        href="/admin-panel/students"
                        className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 hover:text-orange-400 active:bg-slate-700/30 rounded-lg transition-all"
                    >
                        <Users className="w-5 h-5" />
                        <span className="text-xs font-medium">ユーザー</span>
                    </Link>
                    <Link
                        href="/admin-panel/scores"
                        className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 hover:text-orange-400 active:bg-slate-700/30 rounded-lg transition-all"
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-xs font-medium">得点</span>
                    </Link>
                </div>
            </nav>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
                {children}
            </main>
        </div>
    )
}

import type { Metadata } from 'next'
import NavTabs from '@/components/NavTabs'
import './globals.css'

export const metadata: Metadata = {
    title: 'データ検証ツール',
    description: 'CSVデータをAIがWeb検索やPDF照合で検証します',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja">
            <body className="min-h-screen bg-slate-900">
                <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-14">
                            <h1 className="text-lg font-bold text-white">データ検証ツール</h1>
                            <span className="ml-3 text-xs text-slate-500">AI Data Validator</span>
                            <NavTabs />
                        </div>
                    </div>
                </header>
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </body>
        </html>
    )
}

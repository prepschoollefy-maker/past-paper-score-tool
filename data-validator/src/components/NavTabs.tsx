'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
    { href: '/', label: 'データ検証' },
    { href: '/convert', label: 'PDF→XLSX変換' },
    { href: '/fill', label: '列自動入力' },
]

export default function NavTabs() {
    const pathname = usePathname()

    return (
        <nav className="flex gap-1 ml-6">
            {tabs.map((tab) => {
                const isActive = tab.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(tab.href)

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isActive
                            ? 'bg-slate-600 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            }`}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </nav>
    )
}

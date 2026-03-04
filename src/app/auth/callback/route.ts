import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? null

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // nextパラメータがある場合はそちらへ（パスワードリセットなど）
            if (next) {
                return NextResponse.redirect(`${origin}${next}`)
            }

            // ロールに応じてリダイレクト先を決定
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                if (profile?.role === 'admin') {
                    return NextResponse.redirect(`${origin}/admin-panel`)
                }
            }
            return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    // エラー時はログインページにリダイレクト
    return NextResponse.redirect(`${origin}/login`)
}

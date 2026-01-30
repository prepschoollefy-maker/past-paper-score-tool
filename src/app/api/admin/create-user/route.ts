import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Service Role Keyがないと管理者用の認証操作はできないため、
// この機能は後でSupabase Admin APIを使って実装する必要がある
// 今はプレースホルダー

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json()

        // 現在のユーザーが管理者かチェック
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseServiceKey) {
            return NextResponse.json(
                { error: 'サーバー設定エラー: Service Role Keyが設定されていません。Supabase Dashboardで直接ユーザーを作成してください。' },
                { status: 500 }
            )
        }

        // Service Role Keyを使ってadmin clientを作成
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })

        // ユーザーを作成
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name, role: 'user' },
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ user: data.user })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '不明なエラー' },
            { status: 500 }
        )
    }
}

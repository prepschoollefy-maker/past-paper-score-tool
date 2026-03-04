import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            email, password, studentName,
            studentLastName, studentFirstName,
            parentLastName, parentFirstName,
            grade, cramSchool, cramSchoolOther,
        } = body

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseServiceKey) {
            return NextResponse.json(
                { error: 'サーバー設定エラー: Service Role Keyが設定されていません' },
                { status: 500 }
            )
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })

        // メール確認済みでユーザーを作成
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: studentName,
                student_last_name: studentLastName,
                student_first_name: studentFirstName,
                parent_last_name: parentLastName,
                parent_first_name: parentFirstName,
                grade,
                cram_school: cramSchool,
                cram_school_other: cramSchoolOther || null,
            },
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // profilesテーブルも更新
        if (data.user) {
            await supabaseAdmin
                .from('profiles')
                .update({
                    name: studentName,
                    student_last_name: studentLastName,
                    student_first_name: studentFirstName,
                    parent_last_name: parentLastName,
                    parent_first_name: parentFirstName,
                    grade,
                    cram_school: cramSchool,
                    cram_school_other: cramSchoolOther || null,
                })
                .eq('id', data.user.id)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '不明なエラー' },
            { status: 500 }
        )
    }
}

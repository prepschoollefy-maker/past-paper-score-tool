'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteRecord(recordId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    // ユーザーがこのレコードの所有者であることを確認
    const { data: record } = await supabase
        .from('practice_records')
        .select('id, user_id')
        .eq('id', recordId)
        .single()

    if (!record) {
        return { error: '記録が見つかりません' }
    }

    if (record.user_id !== user.id) {
        return { error: 'この記録を削除する権限がありません' }
    }

    // 子テーブル → 親テーブルの順に削除
    const { error: scoresError } = await supabase
        .from('practice_scores')
        .delete()
        .eq('practice_record_id', recordId)

    if (scoresError) {
        return { error: `得点データの削除に失敗しました: ${scoresError.message}` }
    }

    const { error: recordError } = await supabase
        .from('practice_records')
        .delete()
        .eq('id', recordId)

    if (recordError) {
        return { error: `記録の削除に失敗しました: ${recordError.message}` }
    }

    return { success: true }
}

export async function updateRecord(
    recordId: string,
    practiceDate: string,
    memo: string | null,
    scores: { subject: string; score: number; max_score: number }[]
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'ログインが必要です' }
    }

    // 所有者確認
    const { data: record } = await supabase
        .from('practice_records')
        .select('id, user_id')
        .eq('id', recordId)
        .single()

    if (!record) {
        return { error: '記録が見つかりません' }
    }

    if (record.user_id !== user.id) {
        return { error: 'この記録を編集する権限がありません' }
    }

    // 演習記録を更新
    const { error: recordError } = await supabase
        .from('practice_records')
        .update({
            practice_date: practiceDate,
            memo: memo || null,
        })
        .eq('id', recordId)

    if (recordError) {
        return { error: `記録の更新に失敗しました: ${recordError.message}` }
    }

    // 既存スコアを削除して再挿入
    const { error: deleteError } = await supabase
        .from('practice_scores')
        .delete()
        .eq('practice_record_id', recordId)

    if (deleteError) {
        return { error: `得点データの削除に失敗しました: ${deleteError.message}` }
    }

    const scoreInserts = scores.map(s => ({
        practice_record_id: recordId,
        subject: s.subject,
        score: s.score,
        max_score: s.max_score,
    }))

    const { error: scoresError } = await supabase
        .from('practice_scores')
        .insert(scoreInserts)

    if (scoresError) {
        return { error: `得点データの保存に失敗しました: ${scoresError.message}` }
    }

    return { success: true }
}

// データベース型定義

export type UserRole = 'admin' | 'user'

export interface Profile {
    id: string
    email: string
    name: string
    role: UserRole
    created_at: string
}

export interface School {
    id: string
    name: string
    created_at: string
}

export interface SchoolAlias {
    id: string
    school_id: string
    alias: string
}

export interface ExamSession {
    id: string
    school_id: string
    year: number
    session_label: string
    created_at: string
    // JOINで取得
    school?: School
    required_subjects?: RequiredSubject[]
    official_data?: OfficialData[]
}

export interface RequiredSubject {
    id: string
    exam_session_id: string
    subject: Subject
    max_score: number
    display_order: number
}

export type Subject = '算数' | '国語' | '理科' | '社会' | '英語'
export type OfficialSubject = '総合' | Subject

export interface OfficialData {
    id: string
    exam_session_id: string
    subject: OfficialSubject
    passing_min: number | null
    passer_avg: number | null
    applicant_avg: number | null
    source_note: string | null
}

export interface PracticeRecord {
    id: string
    user_id: string
    exam_session_id: string
    practice_date: string
    memo: string | null
    created_at: string
    // JOINで取得
    exam_session?: ExamSession
    practice_scores?: PracticeScore[]
}

export interface PracticeScore {
    id: string
    practice_record_id: string
    subject: Subject
    score: number
    max_score: number
}

// フォーム用の型
export interface ScoreInput {
    subject: Subject
    score: number
    max_score: number
}

export interface PracticeRecordInput {
    exam_session_id: string
    practice_date: string
    memo?: string
    scores: ScoreInput[]
}

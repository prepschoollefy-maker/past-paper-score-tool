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

export type TimePeriod = '午前' | '午後'
export type GenderType = '男子校' | '女子校' | '共学'

export interface ExamSession {
    id: string
    school_id: string
    year: number
    session_label: string
    created_at: string
    // スケジュール関連フィールド
    test_date?: string | null
    time_period?: TimePeriod | null
    assembly_time?: string | null
    estimated_end_time?: string | null
    exam_fee?: number | null
    exam_subjects_label?: string | null
    gender_type?: GenderType | null
    // 出願情報
    application_start?: string | null
    application_deadline?: string | null
    application_method?: string | null
    // 合格発表・手続き
    result_announcement?: string | null
    enrollment_deadline?: string | null
    enrollment_fee?: number | null
    deferral_available?: boolean | null
    deferral_deadline?: string | null
    deferral_deposit?: number | null
    // 所在地
    nearest_station?: string | null
    exam_venue?: string | null
    // 偏差値
    yotsuya_80?: number | null
    yotsuya_50?: number | null
    nichinoken_r4?: number | null
    sapix?: number | null
    prev_year_ratio?: number | null
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
    passing_min_2: number | null   // 合格最低点※
    passing_max: number | null     // 合格最高点
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

// 受験計画関連の型
export interface UserExamSelection {
    id: string
    user_id: string
    exam_session_id: string
    priority: number | null
    memo: string | null
    created_at: string
    // JOINで取得
    exam_session?: ExamSession
}

export type ContinuationType = 'branch' | 'continue' | 'end'
export type BranchCondition = '合格' | '不合格'

export interface SchedulePlan {
    id: string
    user_id: string
    name: string
    is_active: boolean
    created_at: string
    updated_at: string
    // JOINで取得
    slots?: ScheduleSlot[]
}

export interface ScheduleSlot {
    id: string
    plan_id: string
    exam_session_id: string
    slot_date: string
    slot_period: TimePeriod
    parent_slot_id: string | null
    branch_condition: BranchCondition | null
    continuation_type: ContinuationType
    sort_order: number
    created_at: string
    // JOINで取得
    exam_session?: ExamSession
}

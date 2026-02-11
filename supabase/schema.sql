-- 過去問得点管理ツール データベーススキーマ
-- Supabase SQL Editorで実行してください

-- ユーザープロファイル（Supabase Authと連携）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  student_last_name TEXT,
  student_first_name TEXT,
  parent_last_name TEXT,
  parent_first_name TEXT,
  grade TEXT,
  cram_school TEXT,
  cram_school_other TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 学校マスタ
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 学校別名（検索用）
CREATE TABLE school_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 試験回（学校 × 年度 × 回ラベル）
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  session_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (school_id, year, session_label)
);

-- 必要科目セット（試験回ごと）
CREATE TABLE required_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('算数', '国語', '理科', '社会', '英語')),
  max_score INTEGER NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 公式データ（試験回ごと、科目別 + 総合）
CREATE TABLE official_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('総合', '算数', '国語', '理科', '社会', '英語')),
  passing_min INTEGER,          -- 合格最低点（任意）
  passing_min_2 INTEGER,        -- 合格最低点※（任意）
  passing_max INTEGER,          -- 合格最高点（任意）
  passer_avg DECIMAL(5,1),      -- 合格者平均点（任意）
  applicant_avg DECIMAL(5,1),   -- 受験者平均点（任意）
  source_note TEXT,             -- 出典メモ（任意）
  UNIQUE (exam_session_id, subject)
);

-- 演習記録（ユーザーが解いた1回分）
CREATE TABLE practice_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 演習得点（科目別）
CREATE TABLE practice_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_record_id UUID NOT NULL REFERENCES practice_records(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (subject IN ('算数', '国語', '理科', '社会', '英語')),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL
);

-- Row Level Security (RLS) ポリシー

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- schools (誰でも閲覧可、管理者のみ編集)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schools" ON schools
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage schools" ON schools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- school_aliases
ALTER TABLE school_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view school_aliases" ON school_aliases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage school_aliases" ON school_aliases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- exam_sessions
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exam_sessions" ON exam_sessions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage exam_sessions" ON exam_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- required_subjects
ALTER TABLE required_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view required_subjects" ON required_subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage required_subjects" ON required_subjects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- official_data
ALTER TABLE official_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view official_data" ON official_data
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage official_data" ON official_data
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- practice_records
ALTER TABLE practice_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice_records" ON practice_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all practice_records" ON practice_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own practice_records" ON practice_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice_records" ON practice_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice_records" ON practice_records
  FOR DELETE USING (auth.uid() = user_id);

-- practice_scores
ALTER TABLE practice_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice_scores" ON practice_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM practice_records 
      WHERE practice_records.id = practice_scores.practice_record_id 
      AND practice_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all practice_scores" ON practice_scores
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert own practice_scores" ON practice_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM practice_records 
      WHERE practice_records.id = practice_scores.practice_record_id 
      AND practice_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own practice_scores" ON practice_scores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM practice_records 
      WHERE practice_records.id = practice_scores.practice_record_id 
      AND practice_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own practice_scores" ON practice_scores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM practice_records 
      WHERE practice_records.id = practice_scores.practice_record_id 
      AND practice_records.user_id = auth.uid()
    )
  );

-- トリガー: auth.usersに新規ユーザーが作成されたらprofilesにも自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

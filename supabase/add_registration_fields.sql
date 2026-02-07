-- ユーザー登録機能の追加: profiles テーブルに新しいカラムを追加
-- Supabase SQL Editorで実行してください

-- 1. 新しいカラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cram_school TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cram_school_other TEXT;

-- 2. handle_new_user トリガー関数を更新（メタデータから新フィールドを取得）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, name, role,
    student_last_name, student_first_name,
    parent_last_name, parent_first_name,
    grade, cram_school, cram_school_other
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'student_last_name',
    NEW.raw_user_meta_data->>'student_first_name',
    NEW.raw_user_meta_data->>'parent_last_name',
    NEW.raw_user_meta_data->>'parent_first_name',
    NEW.raw_user_meta_data->>'grade',
    NEW.raw_user_meta_data->>'cram_school',
    NEW.raw_user_meta_data->>'cram_school_other'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ユーザーが自分自身のプロフィールをINSERTできるRLSポリシーを追加
-- （サインアップ時にトリガーが実行されるため、SECURITY DEFINERで対応済み）
-- ユーザーが自分のプロフィールを更新できるポリシーを追加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

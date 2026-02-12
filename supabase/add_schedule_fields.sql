-- 受験スケジュール管理機能 スキーマ拡張
-- Supabase SQL Editorで実行してください

-- ============================================================
-- 1. exam_sessions テーブルにスケジュール関連カラムを追加
-- ============================================================

-- 試験情報
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS test_date DATE;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS time_period TEXT CHECK (time_period IN ('午前', '午後'));
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS assembly_time TIME;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS estimated_end_time TIME;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS exam_fee INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS exam_subjects_label TEXT;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS gender_type TEXT CHECK (gender_type IN ('男子校', '女子校', '共学'));

-- 出願情報
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS application_start TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS application_method TEXT;

-- 合格発表・手続き
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS result_announcement TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS enrollment_deadline TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS enrollment_fee INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS deferral_available BOOLEAN DEFAULT false;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS deferral_deadline TIMESTAMPTZ;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS deferral_deposit INTEGER;

-- 所在地
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS nearest_station TEXT;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS exam_venue TEXT;

-- 偏差値
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS yotsuya_80 INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS yotsuya_50 INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS nichinoken_r4 INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS sapix INTEGER;
ALTER TABLE exam_sessions ADD COLUMN IF NOT EXISTS prev_year_ratio DECIMAL(5,2);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_exam_sessions_test_date ON exam_sessions(test_date);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_test_date_period ON exam_sessions(test_date, time_period);

-- ============================================================
-- 2. user_exam_selections テーブル（ユーザーの受験校選択）
-- ============================================================

CREATE TABLE IF NOT EXISTS user_exam_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  priority INTEGER,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, exam_session_id)
);

ALTER TABLE user_exam_selections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own selections' AND tablename = 'user_exam_selections') THEN
    CREATE POLICY "Users can view own selections" ON user_exam_selections FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own selections' AND tablename = 'user_exam_selections') THEN
    CREATE POLICY "Users can insert own selections" ON user_exam_selections FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own selections' AND tablename = 'user_exam_selections') THEN
    CREATE POLICY "Users can update own selections" ON user_exam_selections FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own selections' AND tablename = 'user_exam_selections') THEN
    CREATE POLICY "Users can delete own selections" ON user_exam_selections FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_exam_selections_user ON user_exam_selections(user_id);

-- ============================================================
-- 3. schedule_plans テーブル（受験スケジュールプラン）
-- ============================================================

CREATE TABLE IF NOT EXISTS schedule_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE schedule_plans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own plans' AND tablename = 'schedule_plans') THEN
    CREATE POLICY "Users can view own plans" ON schedule_plans FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own plans' AND tablename = 'schedule_plans') THEN
    CREATE POLICY "Users can insert own plans" ON schedule_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own plans' AND tablename = 'schedule_plans') THEN
    CREATE POLICY "Users can update own plans" ON schedule_plans FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own plans' AND tablename = 'schedule_plans') THEN
    CREATE POLICY "Users can delete own plans" ON schedule_plans FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_schedule_plans_user ON schedule_plans(user_id);

-- ============================================================
-- 4. schedule_slots テーブル（スケジュールスロット / ツリー構造）
-- ============================================================

CREATE TABLE IF NOT EXISTS schedule_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES schedule_plans(id) ON DELETE CASCADE,
  exam_session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_period TEXT NOT NULL CHECK (slot_period IN ('午前', '午後')),
  parent_slot_id UUID REFERENCES schedule_slots(id) ON DELETE CASCADE,
  branch_condition TEXT CHECK (branch_condition IN ('合格', '不合格')),
  continuation_type TEXT NOT NULL DEFAULT 'continue' CHECK (continuation_type IN ('branch', 'continue', 'end')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE schedule_slots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own slots' AND tablename = 'schedule_slots') THEN
    CREATE POLICY "Users can view own slots" ON schedule_slots FOR SELECT USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_slots.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own slots' AND tablename = 'schedule_slots') THEN
    CREATE POLICY "Users can insert own slots" ON schedule_slots FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_slots.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own slots' AND tablename = 'schedule_slots') THEN
    CREATE POLICY "Users can update own slots" ON schedule_slots FOR UPDATE USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_slots.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own slots' AND tablename = 'schedule_slots') THEN
    CREATE POLICY "Users can delete own slots" ON schedule_slots FOR DELETE USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_slots.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_schedule_slots_plan ON schedule_slots(plan_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_parent ON schedule_slots(parent_slot_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_date ON schedule_slots(slot_date, slot_period);

-- ============================================================
-- 5. トリガー: schedule_slots 変更時に schedule_plans.updated_at を更新
-- ============================================================

CREATE OR REPLACE FUNCTION update_schedule_plan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE schedule_plans SET updated_at = NOW() WHERE id = OLD.plan_id;
    RETURN OLD;
  ELSE
    UPDATE schedule_plans SET updated_at = NOW() WHERE id = NEW.plan_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_schedule_slot_change ON schedule_slots;
CREATE TRIGGER on_schedule_slot_change
  AFTER INSERT OR UPDATE OR DELETE ON schedule_slots
  FOR EACH ROW EXECUTE FUNCTION update_schedule_plan_timestamp();

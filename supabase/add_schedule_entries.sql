-- schedule_entries テーブル（カレンダースロット型スケジュール管理）
-- add_schedule_fields.sql 実行済みの前提で実行してください

-- ============================================================
-- schedule_entries テーブル
-- ============================================================

CREATE TABLE IF NOT EXISTS schedule_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES schedule_plans(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_period TEXT NOT NULL CHECK (slot_period IN ('午前', '午後')),
  exam_session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  has_branching BOOLEAN NOT NULL DEFAULT false,
  condition_type TEXT NOT NULL DEFAULT 'default' CHECK (condition_type IN ('default', 'if_pass', 'if_fail')),
  condition_source_id UUID REFERENCES schedule_entries(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE schedule_entries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own entries' AND tablename = 'schedule_entries') THEN
    CREATE POLICY "Users can view own entries" ON schedule_entries FOR SELECT USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_entries.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own entries' AND tablename = 'schedule_entries') THEN
    CREATE POLICY "Users can insert own entries" ON schedule_entries FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_entries.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own entries' AND tablename = 'schedule_entries') THEN
    CREATE POLICY "Users can update own entries" ON schedule_entries FOR UPDATE USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_entries.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own entries' AND tablename = 'schedule_entries') THEN
    CREATE POLICY "Users can delete own entries" ON schedule_entries FOR DELETE USING (
      EXISTS (SELECT 1 FROM schedule_plans WHERE schedule_plans.id = schedule_entries.plan_id AND schedule_plans.user_id = auth.uid())
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_schedule_entries_plan ON schedule_entries(plan_id);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_slot ON schedule_entries(slot_date, slot_period);
CREATE INDEX IF NOT EXISTS idx_schedule_entries_source ON schedule_entries(condition_source_id);

-- schedule_entries 変更時に schedule_plans.updated_at を更新
DROP TRIGGER IF EXISTS on_schedule_entry_change ON schedule_entries;
CREATE TRIGGER on_schedule_entry_change
  AFTER INSERT OR UPDATE OR DELETE ON schedule_entries
  FOR EACH ROW EXECUTE FUNCTION update_schedule_plan_timestamp();

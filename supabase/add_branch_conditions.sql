-- user_exam_selections に条件分岐カラムを追加
-- 「この学校の合否に応じて受験する」を表現

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_exam_selections' AND column_name = 'condition_source_id'
  ) THEN
    ALTER TABLE user_exam_selections
      ADD COLUMN condition_source_id UUID REFERENCES user_exam_selections(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_exam_selections' AND column_name = 'condition_type'
  ) THEN
    ALTER TABLE user_exam_selections
      ADD COLUMN condition_type TEXT CHECK (condition_type IN ('pass', 'fail'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_exam_selections_condition ON user_exam_selections(condition_source_id);

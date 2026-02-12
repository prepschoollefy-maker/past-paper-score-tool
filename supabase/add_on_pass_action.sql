-- user_exam_selections に on_pass_action カラムを追加
-- 「合格したら受験終了」のフローチャート分岐に使用

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_exam_selections' AND column_name = 'on_pass_action'
  ) THEN
    ALTER TABLE user_exam_selections
      ADD COLUMN on_pass_action TEXT NOT NULL DEFAULT 'continue'
      CHECK (on_pass_action IN ('continue', 'end'));
  END IF;
END $$;

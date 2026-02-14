-- 学校マスターデータ拡張（jukenmap_schools_final.csv 取込用）
-- Supabase SQL Editorで実行してください
-- 実行順: schema.sql → add_schedule_fields.sql → add_school_master_fields.sql

-- ============================================================
-- schools テーブルに学校マスター情報カラムを追加
-- ============================================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS study_id TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mext_code TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS yotsuya_deviation_value INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS establishment TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS school_type TEXT CHECK (school_type IN ('男子校', '女子校', '共学校'));
ALTER TABLE schools ADD COLUMN IF NOT EXISTS area TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prefecture TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS study_url TEXT;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_schools_study_id ON schools(study_id);
CREATE INDEX IF NOT EXISTS idx_schools_prefecture ON schools(prefecture);
CREATE INDEX IF NOT EXISTS idx_schools_area ON schools(area);
CREATE INDEX IF NOT EXISTS idx_schools_school_type ON schools(school_type);
CREATE INDEX IF NOT EXISTS idx_schools_establishment ON schools(establishment);
CREATE INDEX IF NOT EXISTS idx_schools_yotsuya ON schools(yotsuya_deviation_value);

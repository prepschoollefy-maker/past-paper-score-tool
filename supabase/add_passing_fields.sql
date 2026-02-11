-- 合格最低点※と合格最高点を追加
-- Supabase SQL Editorで実行してください

ALTER TABLE official_data ADD COLUMN passing_min_2 INTEGER;  -- 合格最低点※
ALTER TABLE official_data ADD COLUMN passing_max INTEGER;     -- 合格最高点

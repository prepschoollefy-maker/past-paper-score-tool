-- 学校データと得点データをすべて削除
-- 実行前に必ずバックアップを取ることを推奨します
-- 注意: この操作は取り消せません

-- 外部キー制約を考慮して、依存テーブルから順に削除

-- 1. 演習得点を削除（科目別得点）
DELETE FROM practice_scores;

-- 2. 演習記録を削除（ユーザーの過去問実施記録）
DELETE FROM practice_records;

-- 3. 公式データを削除（合格最低点、平均点など）
DELETE FROM official_data;

-- 4. 必要科目セットを削除
DELETE FROM required_subjects;

-- 5. 試験回を削除（年度・回ラベル）
DELETE FROM exam_sessions;

-- 6. 学校別名を削除
DELETE FROM school_aliases;

-- 7. 学校マスタを削除
DELETE FROM schools;

-- 削除完了後、各テーブルのレコード数を確認
SELECT 'practice_scores' as table_name, COUNT(*) as count FROM practice_scores
UNION ALL
SELECT 'practice_records', COUNT(*) FROM practice_records
UNION ALL
SELECT 'official_data', COUNT(*) FROM official_data
UNION ALL
SELECT 'required_subjects', COUNT(*) FROM required_subjects
UNION ALL
SELECT 'exam_sessions', COUNT(*) FROM exam_sessions
UNION ALL
SELECT 'school_aliases', COUNT(*) FROM school_aliases
UNION ALL
SELECT 'schools', COUNT(*) FROM schools
ORDER BY table_name;

-- 受験スケジュール管理 サンプルデータ
-- add_schedule_fields.sql 実行後に実行してください
-- 既存の schools データとの重複はスキップされます

-- ============================================================
-- 1. 学校マスタ（10校）
-- ============================================================

INSERT INTO schools (name) VALUES
  ('開成中学校'),
  ('麻布中学校'),
  ('武蔵中学校'),
  ('桜蔭中学校'),
  ('女子学院中学校'),
  ('雙葉中学校'),
  ('渋谷教育学園渋谷中学校'),
  ('渋谷教育学園幕張中学校'),
  ('栄東中学校'),
  ('海城中学校')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. 試験回データ（2026年度）
-- ============================================================

-- 開成中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:30',
  28000, '4科', '男子校',
  320000, false,
  '西日暮里', 72, 68, 67,
  '2026-01-10 00:00:00+09', '2026-01-22 23:59:59+09',
  '2026-02-02 12:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '開成中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 麻布中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline, deferral_deposit,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:00',
  27000, '4科', '男子校',
  300000, true, '2026-02-11 15:00:00+09', 0,
  '広尾', 68, 64, 64,
  '2026-01-10 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-02 15:00:00+09', '2026-02-04 12:00:00+09'
FROM schools WHERE name = '麻布中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 武蔵中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:30',
  30000, '4科', '男子校',
  300000, true, '2026-02-10 12:00:00+09',
  '江古田', 65, 61, 60,
  '2026-01-06 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-02 10:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = '武蔵中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 桜蔭中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:30',
  25000, '4科', '女子校',
  380000, false,
  '水道橋', 71, 68, 62,
  '2026-01-06 00:00:00+09', '2026-01-15 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = '桜蔭中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 女子学院中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:00',
  25000, '4科', '女子校',
  380000, false,
  '市ヶ谷', 70, 66, 60,
  '2026-01-06 00:00:00+09', '2026-01-15 23:59:59+09',
  '2026-02-02 13:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = '女子学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 雙葉中学校 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '11:30',
  25000, '4科', '女子校',
  340000, false,
  '四ツ谷', 65, 61, 56,
  '2026-01-06 00:00:00+09', '2026-01-15 23:59:59+09',
  '2026-02-01 18:00:00+09', '2026-02-03 12:00:00+09'
FROM schools WHERE name = '雙葉中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 渋谷教育学園渋谷中学校 第1回 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:30',
  30000, '4科', '共学',
  300000, true, '2026-02-10 15:00:00+09',
  '渋谷', 67, 63, 60,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '渋谷教育学園渋谷中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 渋谷教育学園渋谷中学校 第2回 2/2 午後
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-02', '午後', '14:30', '16:30',
  30000, '4科', '共学',
  300000, true, '2026-02-10 15:00:00+09',
  '渋谷', 66, 62, 59,
  '2025-12-01 00:00:00+09', '2026-01-30 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '渋谷教育学園渋谷中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 渋谷教育学園幕張中学校 1次 1/22 午前（1月入試）
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '一次',
  '2026-01-22', '午前', '08:40', '12:30',
  25000, '4科', '共学',
  290000, true, '2026-02-10 12:00:00+09',
  '海浜幕張', 70, 66, 65,
  '2025-11-20 00:00:00+09', '2026-01-10 23:59:59+09',
  '2026-01-23 09:00:00+09', '2026-01-27 15:00:00+09'
FROM schools WHERE name = '渋谷教育学園幕張中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 栄東中学校 A日程 1/10 午前（1月入試）
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A日程',
  '2026-01-10', '午前', '08:30', '12:00',
  25000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '東大宮', 60, 56, 54,
  '2025-11-01 00:00:00+09', '2026-01-05 23:59:59+09',
  '2026-01-12 12:00:00+09', '2026-01-17 15:00:00+09'
FROM schools WHERE name = '栄東中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 栄東中学校 東大特待 1/12 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '東大特待',
  '2026-01-12', '午前', '08:30', '12:30',
  25000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '東大宮', 66, 62, 61,
  '2025-11-01 00:00:00+09', '2026-01-08 23:59:59+09',
  '2026-01-14 12:00:00+09', '2026-01-20 15:00:00+09'
FROM schools WHERE name = '栄東中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 海城中学校 第1回 2/1 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:30',
  25000, '4科', '男子校',
  300000, true, '2026-02-10 15:00:00+09',
  '新大久保', 67, 63, 60,
  '2025-12-20 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-02 16:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '海城中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 海城中学校 第2回 2/3 午前
INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80, yotsuya_50, sapix,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-03', '午前', '08:00', '12:30',
  25000, '4科', '男子校',
  300000, true, '2026-02-10 15:00:00+09',
  '新大久保', 68, 64, 62,
  '2025-12-20 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-04 00:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '海城中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- 神奈川県上位20校のシードデータ（2026年度入試）
-- 偏差値は四谷大塚80%偏差値のみ
-- seed_schedule_sample_data.sql 実行後に実行してください

-- ============================================================
-- 1. 学校マスタ（20校）
-- ============================================================

INSERT INTO schools (name) VALUES
  ('聖光学院中学校'),
  ('栄光学園中学校'),
  ('慶應義塾湘南藤沢中等部'),
  ('慶應義塾普通部'),
  ('洗足学園中学校'),
  ('フェリス女学院中学校'),
  ('浅野中学校'),
  ('サレジオ学院中学校'),
  ('逗子開成中学校'),
  ('法政大学第二中学校'),
  ('中央大学附属横浜中学校'),
  ('横浜雙葉中学校'),
  ('横浜共立学園中学校'),
  ('公文国際学園中等部'),
  ('鎌倉女学院中学校'),
  ('山手学院中学校'),
  ('湘南白百合学園中学校'),
  ('鎌倉学園中学校'),
  ('神奈川大学附属中学校'),
  ('桐蔭学園中等教育学校')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. 試験回データ（36回分）
-- ============================================================

-- ---- 聖光学院 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-02', '午前', '08:15', '12:30',
  30000, '4科', '男子校',
  300000, true, '2026-02-10 15:00:00+09',
  '山手', 70,
  '2025-12-15 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '聖光学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-04', '午前', '08:15', '12:30',
  30000, '4科', '男子校',
  300000, true, '2026-02-10 15:00:00+09',
  '山手', 70,
  '2025-12-15 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-05 09:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = '聖光学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 栄光学園 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-02', '午前', '08:30', '12:30',
  25000, '4科', '男子校',
  300000, true, '2026-02-10 12:00:00+09',
  '大船', 66,
  '2025-12-20 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-03 10:00:00+09', '2026-02-05 12:00:00+09'
FROM schools WHERE name = '栄光学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 慶應義塾湘南藤沢 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '一般',
  '2026-02-02', '午前', '08:30', '13:00',
  30000, '4科', '共学',
  340000, false,
  '湘南台', 64,
  '2025-12-16 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '慶應義塾湘南藤沢中等部'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 慶應義塾普通部 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:00',
  30000, '4科', '男子校',
  340000, false,
  '日吉', 64,
  '2025-12-16 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-02 16:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '慶應義塾普通部'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 洗足学園 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:30',
  25000, '4科', '女子校',
  250000, true, '2026-02-10 15:00:00+09',
  '溝の口', 65,
  '2025-12-01 00:00:00+09', '2026-01-22 23:59:59+09',
  '2026-02-01 20:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = '洗足学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-02', '午前', '08:30', '12:30',
  25000, '4科', '女子校',
  250000, true, '2026-02-10 15:00:00+09',
  '溝の口', 66,
  '2025-12-01 00:00:00+09', '2026-01-22 23:59:59+09',
  '2026-02-02 20:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '洗足学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第3回',
  '2026-02-05', '午前', '08:30', '12:30',
  25000, '4科', '女子校',
  250000, true, '2026-02-10 15:00:00+09',
  '溝の口', 67,
  '2025-12-01 00:00:00+09', '2026-01-22 23:59:59+09',
  '2026-02-05 20:00:00+09', '2026-02-07 15:00:00+09'
FROM schools WHERE name = '洗足学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- フェリス女学院 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:00',
  25000, '4科', '女子校',
  330000, false,
  '石川町', 65,
  '2025-12-16 00:00:00+09', '2026-01-18 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = 'フェリス女学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 浅野 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-03', '午前', '08:00', '12:30',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 15:00:00+09',
  '新子安', 64,
  '2025-12-10 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-04 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '浅野中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- サレジオ学院 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A',
  '2026-02-01', '午前', '08:30', '12:00',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 15:00:00+09',
  '北山田', 58,
  '2025-12-01 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-02 06:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = 'サレジオ学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'B',
  '2026-02-04', '午前', '08:30', '12:00',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 15:00:00+09',
  '北山田', 60,
  '2025-12-01 00:00:00+09', '2026-01-24 23:59:59+09',
  '2026-02-05 06:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = 'サレジオ学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 逗子開成 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:30',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '逗子', 57,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-01 22:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '逗子開成中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-03', '午前', '08:30', '12:30',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '逗子', 59,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-03 22:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '逗子開成中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第3回',
  '2026-02-05', '午前', '08:30', '12:30',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '逗子', 57,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-05 22:00:00+09', '2026-02-07 15:00:00+09'
FROM schools WHERE name = '逗子開成中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 法政大学第二 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-02', '午前', '08:30', '12:00',
  25000, '4科', '共学',
  300000, true, '2026-02-10 15:00:00+09',
  '武蔵小杉', 58,
  '2025-12-10 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-03 10:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '法政大学第二中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-04', '午前', '08:30', '12:00',
  25000, '4科', '共学',
  300000, true, '2026-02-10 15:00:00+09',
  '武蔵小杉', 60,
  '2025-12-10 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-05 10:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = '法政大学第二中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 中央大学附属横浜 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午後', '14:30', '16:30',
  25000, '2科', '共学',
  250000, true, '2026-02-10 15:00:00+09',
  'センター北', 58,
  '2025-12-10 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-02 10:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '中央大学附属横浜中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-02', '午後', '14:30', '17:00',
  25000, '4科', '共学',
  250000, true, '2026-02-10 15:00:00+09',
  'センター北', 59,
  '2025-12-10 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-03 10:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '中央大学附属横浜中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 横浜雙葉 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:00', '12:00',
  25000, '4科', '女子校',
  330000, false,
  '石川町', 58,
  '2025-12-10 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-03 15:00:00+09'
FROM schools WHERE name = '横浜雙葉中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 横浜共立学園 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A方式',
  '2026-02-01', '午前', '08:00', '12:00',
  22000, '4科', '女子校',
  300000, true, '2026-02-10 12:00:00+09',
  '石川町', 55,
  '2025-12-10 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '横浜共立学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'B方式',
  '2026-02-03', '午前', '08:00', '10:30',
  22000, '2科', '女子校',
  300000, true, '2026-02-10 12:00:00+09',
  '石川町', 56,
  '2025-12-10 00:00:00+09', '2026-01-20 23:59:59+09',
  '2026-02-04 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '横浜共立学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 公文国際学園 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A',
  '2026-02-01', '午前', '08:30', '12:00',
  25000, '4科', '共学',
  350000, true, '2026-02-10 12:00:00+09',
  '大船', 55,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-02 09:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '公文国際学園中等部'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'B',
  '2026-02-03', '午前', '08:30', '12:00',
  25000, '4科', '共学',
  350000, true, '2026-02-10 12:00:00+09',
  '大船', 55,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-04 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '公文国際学園中等部'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 鎌倉女学院 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-02', '午前', '08:30', '12:00',
  22000, '4科', '女子校',
  280000, true, '2026-02-10 12:00:00+09',
  '鎌倉', 52,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '鎌倉女学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-04', '午前', '08:30', '12:00',
  22000, '4科', '女子校',
  280000, true, '2026-02-10 12:00:00+09',
  '鎌倉', 52,
  '2025-12-01 00:00:00+09', '2026-01-25 23:59:59+09',
  '2026-02-05 09:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = '鎌倉女学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 山手学院 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A',
  '2026-02-02', '午前', '08:30', '12:00',
  22000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '港南台', 52,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-02 20:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '山手学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'B',
  '2026-02-06', '午後', '14:30', '16:30',
  22000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '港南台', 55,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-07 09:00:00+09', '2026-02-08 15:00:00+09'
FROM schools WHERE name = '山手学院中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 湘南白百合 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:00',
  25000, '4科', '女子校',
  300000, true, '2026-02-10 12:00:00+09',
  '片瀬山', 55,
  '2025-12-01 00:00:00+09', '2026-01-22 23:59:59+09',
  '2026-02-01 20:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '湘南白百合学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 鎌倉学園 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:00',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '北鎌倉', 52,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-01 20:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '鎌倉学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-02', '午後', '14:30', '16:30',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '北鎌倉', 56,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '鎌倉学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第3回',
  '2026-02-04', '午前', '08:30', '12:00',
  25000, '4科', '男子校',
  250000, true, '2026-02-10 12:00:00+09',
  '北鎌倉', 52,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-05 09:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = '鎌倉学園中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 神奈川大学附属 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'A',
  '2026-02-02', '午前', '08:30', '10:30',
  22000, '2科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '中山', 52,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-02 20:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '神奈川大学附属中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, 'B',
  '2026-02-03', '午後', '14:30', '16:30',
  22000, '2科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '中山', 54,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-04 09:00:00+09', '2026-02-06 15:00:00+09'
FROM schools WHERE name = '神奈川大学附属中学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ---- 桐蔭学園中等教育 ----

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第1回',
  '2026-02-01', '午前', '08:30', '12:00',
  23000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '市が尾', 50,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-01 20:00:00+09', '2026-02-04 15:00:00+09'
FROM schools WHERE name = '桐蔭学園中等教育学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

INSERT INTO exam_sessions (
  school_id, year, session_label,
  test_date, time_period, assembly_time, estimated_end_time,
  exam_fee, exam_subjects_label, gender_type,
  enrollment_fee, deferral_available, deferral_deadline,
  nearest_station, yotsuya_80,
  application_start, application_deadline,
  result_announcement, enrollment_deadline
) SELECT
  id, 2026, '第2回',
  '2026-02-02', '午後', '14:30', '16:30',
  23000, '4科', '共学',
  250000, true, '2026-02-10 12:00:00+09',
  '市が尾', 52,
  '2025-12-01 00:00:00+09', '2026-01-28 23:59:59+09',
  '2026-02-03 09:00:00+09', '2026-02-05 15:00:00+09'
FROM schools WHERE name = '桐蔭学園中等教育学校'
ON CONFLICT (school_id, year, session_label) DO NOTHING;

-- ============================================================
-- 3. 必要科目データ（required_subjects）
-- ============================================================

-- 聖光学院（算150/国150/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '聖光学院中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 栄光学園（算70/国70/理50/社50）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 70, 1), ('国語', 70, 2), ('理科', 50, 3), ('社会', 50, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '栄光学園中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 慶應SFC（算100/国100/理社=75/75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '慶應義塾湘南藤沢中等部' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 慶應普通部（算100/国100/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '慶應義塾普通部' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 洗足学園（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '洗足学園中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- フェリス（算100/国100/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = 'フェリス女学院中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 浅野（算120/国120/理80/社80）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 120, 1), ('国語', 120, 2), ('理科', 80, 3), ('社会', 80, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '浅野中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- サレジオ学院（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = 'サレジオ学院中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 逗子開成（算150/国150/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '逗子開成中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 法政二（算150/国150/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '法政大学第二中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 中大横浜 第1回（2科: 算150/国150）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2)) AS v(subject, max_score, display_order)
WHERE s.name = '中央大学附属横浜中学校' AND es.session_label = '第1回' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 中大横浜 第2回（4科: 算150/国150/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '中央大学附属横浜中学校' AND es.session_label = '第2回' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 横浜雙葉（算100/国100/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '横浜雙葉中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 横浜共立 A方式（4科: 算100/国100/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '横浜共立学園中学校' AND es.session_label = 'A方式' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 横浜共立 B方式（2科: 算100/国100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2)) AS v(subject, max_score, display_order)
WHERE s.name = '横浜共立学園中学校' AND es.session_label = 'B方式' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 公文国際（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '公文国際学園中等部' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 鎌倉女学院（算100/国100/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '鎌倉女学院中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 山手学院（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '山手学院中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 湘南白百合（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '湘南白百合学園中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 鎌倉学園（算150/国150/理100/社100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 150, 1), ('国語', 150, 2), ('理科', 100, 3), ('社会', 100, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '鎌倉学園中学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 神大附属 A（2科: 算100/国100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2)) AS v(subject, max_score, display_order)
WHERE s.name = '神奈川大学附属中学校' AND es.session_label = 'A' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 神大附属 B（2科: 算100/国100）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2)) AS v(subject, max_score, display_order)
WHERE s.name = '神奈川大学附属中学校' AND es.session_label = 'B' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

-- 桐蔭学園（算100/国100/理75/社75）
INSERT INTO required_subjects (exam_session_id, subject, max_score, display_order)
SELECT es.id, v.subject::text, v.max_score, v.display_order
FROM exam_sessions es JOIN schools s ON s.id = es.school_id
CROSS JOIN (VALUES ('算数', 100, 1), ('国語', 100, 2), ('理科', 75, 3), ('社会', 75, 4)) AS v(subject, max_score, display_order)
WHERE s.name = '桐蔭学園中等教育学校' AND es.year = 2026
AND NOT EXISTS (SELECT 1 FROM required_subjects rs WHERE rs.exam_session_id = es.id);

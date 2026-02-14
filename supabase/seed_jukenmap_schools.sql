-- jukenmap_schools_final.csv から生成された学校マスターデータ
-- 生成日: 2026-02-14
-- add_school_master_fields.sql を先に実行してください

-- ============================================================
-- 学校マスタ（322校）
-- ============================================================

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('筑波大学附属駒場中学校', 'B13N003', 'C113110000050', 73, '国立', '男子校', '東京23区', '東京都', '東京都世田谷区池尻４－７－１', '1540001', 'https://www.study1.jp/kanto/school/B13N003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('渋谷教育学園幕張中学校', 'B12P006', 'C112310000155', 72, '私立', '共学校', '千葉県', '千葉県', '千葉県千葉市美浜区若葉１－３', '2610014', 'https://www.study1.jp/kanto/school/B12P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桜蔭中学校', 'B13P009', 'C113310500033', 71, '私立', '女子校', '東京23区', '東京都', '東京都文京区本郷１－５－２５', '1130033', 'https://www.study1.jp/kanto/school/B13P009/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('開成中学校', 'B13P015', 'C113311800010', 71, '私立', '男子校', '東京23区', '東京都', '東京都荒川区西日暮里４－７－７', '1160013', 'https://www.study1.jp/kanto/school/B13P015/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('渋谷教育学園渋谷中学校', 'B13P046', 'C113311300051', 71, '私立', '共学校', '東京23区', '東京都', '東京都渋谷区渋谷１－２１－１８', '1500002', 'https://www.study1.jp/kanto/school/B13P046/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('慶應義塾中等部', 'B13P027', 'C113310300026', 70, '私立', '共学校', '東京23区', '東京都', '東京都港区三田２－１７－１０', '1080073', 'https://www.study1.jp/kanto/school/B13P027/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖光学院中学校', 'B15P024', 'C114310000082', 70, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県横浜市中区滝之上１００', '2310837', 'https://www.study1.jp/kanto/school/B15P024/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('筑波大学附属中学校', 'B13N002', 'C113110000041', 70, '国立', '共学校', '東京23区', '東京都', '東京都文京区大塚１－９－１', '1120012', 'https://www.study1.jp/kanto/school/B13N002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('豊島岡女子学園中学校', 'B13P100', 'C113311600049', 70, '私立', '女子校', '東京23区', '東京都', '東京都豊島区東池袋１－２５－２２', '1700013', 'https://www.study1.jp/kanto/school/B13P100/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('市川中学校', 'B12P001', 'C112310000048', 69, '私立', '共学校', '千葉県', '千葉県', '千葉県市川市本北方２－３８－１', '2720816', 'https://www.study1.jp/kanto/school/B12P001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('栄東中学校', 'B11P012', 'C111310400018', 69, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市見沼区砂町２－７７', '3370054', 'https://www.study1.jp/kanto/school/B11P012/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('女子学院中学校', 'B13P061', 'C113310100082', 69, '私立', '女子校', '東京23区', '東京都', '東京都千代田区一番町２２－１０', '1020082', 'https://www.study1.jp/kanto/school/B13P061/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立小石川中等教育学校', 'B13C004', 'D213299900022', 69, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都文京区本駒込２－２９－２９', '1130021', 'https://www.study1.jp/kanto/school/B13C004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('広尾学園中学校', 'B13P111', 'C113310300053', 69, '私立', '共学校', '東京23区', '東京都', '東京都港区南麻布５－１－１４', '1060047', 'https://www.study1.jp/kanto/school/B13P111/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('早稲田実業学校中等部', 'B14P045', 'C113321400013', 69, '私立', '共学校', '東京23区外', '東京都', '東京都国分寺市本町１－２－１', '1858505', 'https://www.study1.jp/kanto/school/B14P045/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('慶應義塾湘南藤沢中等部', 'B15P016', 'C114320500040', 68, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県藤沢市遠藤５４６６', '2520816', 'https://www.study1.jp/kanto/school/B15P016/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('早稲田中学校', 'B13P136', 'C113310400061', 68, '私立', '男子校', '東京23区', '東京都', '東京都新宿区馬場下町６２', '1628654', 'https://www.study1.jp/kanto/school/B13P136/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('雙葉中学校', 'B13P114', 'C113310100108', 67, '私立', '女子校', '東京23区', '東京都', '東京都千代田区六番町１４－１', '1028470', 'https://www.study1.jp/kanto/school/B13P114/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('栄光学園中学校', 'B15P003', 'C114320400014', 66, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県鎌倉市玉縄４－１－１', '2470071', 'https://www.study1.jp/kanto/school/B15P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('海城中学校', 'B13P014', 'C113310400016', 66, '私立', '男子校', '東京23区', '東京都', '東京都新宿区大久保３－６－１', '1690072', 'https://www.study1.jp/kanto/school/B13P014/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('駒場東邦中学校', 'B13P041', 'C113311200025', 66, '私立', '男子校', '東京23区', '東京都', '東京都世田谷区池尻４－５－１', '1540001', 'https://www.study1.jp/kanto/school/B13P041/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('昭和学院秀英中学校', 'B12P009', 'C112310000137', 66, '私立', '共学校', '千葉県', '千葉県', '千葉県千葉市美浜区若葉１－２', '2610014', 'https://www.study1.jp/kanto/school/B12P009/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('洗足学園中学校', 'B15P029', 'C114313000031', 66, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県川崎市高津区久本２－３－１', '2138580', 'https://www.study1.jp/kanto/school/B15P029/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜市立横浜サイエンスフロンティア高等学校附属中学校', 'B15C005', 'C114210020106', 66, '公立中高一貫', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市鶴見区小野町６', '2300046', 'https://www.study1.jp/kanto/school/B15C005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('青山学院中等部', 'B13P002', 'C113311300015', 65, '私立', '共学校', '東京23区', '東京都', '東京都渋谷区渋谷４－４－２５', '1508366', 'https://www.study1.jp/kanto/school/B13P002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('麻布中学校', 'B13P003', 'C113310300017', 65, '私立', '男子校', '東京23区', '東京都', '東京都港区元麻布２－３－２９', '1060046', 'https://www.study1.jp/kanto/school/B13P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('浦和明の星女子中学校', 'B11P001', 'C111310900013', 65, '私立', '女子校', '埼玉県', '埼玉県', '埼玉県さいたま市緑区東浦和６－４－１９', '3360926', 'https://www.study1.jp/kanto/school/B11P001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('鷗友学園女子中学校', 'B13P010', 'C113311200034', 65, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区宮坂１－５－３０', '1568551', 'https://www.study1.jp/kanto/school/B13P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('お茶の水女子大学附属中学校', 'B13N001', 'C113110000069', 65, '国立', '共学校', '東京23区', '東京都', '東京都文京区大塚２－１－１', '1128610', 'https://www.study1.jp/kanto/school/B13N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('吉祥女子中学校', 'B14P005', 'C113320300043', 65, '私立', '女子校', '東京23区外', '東京都', '東京都武蔵野市吉祥寺東町４－１２－２０', '1800002', 'https://www.study1.jp/kanto/school/B14P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('慶應義塾普通部', 'B15P017', 'C114310000199', 65, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県横浜市港北区日吉本町１－４５－１', '2230062', 'https://www.study1.jp/kanto/school/B15P017/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉県立千葉中学校', 'B12C001', 'C112210000521', 65, '公立中高一貫', '共学校', '千葉県', '千葉県', '千葉県千葉市中央区葛城１－５－２', '2600853', 'https://www.study1.jp/kanto/school/B12C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立武蔵高等学校附属中学校', 'B14C004', 'C113299900034', 65, '公立中高一貫', '共学校', '東京23区外', '東京都', '東京都武蔵野市境４－１３－２８', '1800022', 'https://www.study1.jp/kanto/school/B14C004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('武蔵中学校', 'B13P123', 'C113312000025', 65, '私立', '男子校', '東京23区', '東京都', '東京都練馬区豊玉上１－２６－１', '1768535', 'https://www.study1.jp/kanto/school/B13P123/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('早稲田大学高等学院中学部', 'B13P137', 'C113312000052', 65, '私立', '男子校', '東京23区', '東京都', '東京都練馬区上石神井３－３１－１', '1770044', 'https://www.study1.jp/kanto/school/B13P137/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('浅野中学校', 'B15P001', 'C114310000046', 64, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県横浜市神奈川区子安台１－３－１', '2210012', 'https://www.study1.jp/kanto/school/B15P001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('香蘭女学校中等科', 'B13P037', 'C113310900039', 64, '私立', '女子校', '東京23区', '東京都', '東京都品川区旗の台６－２２－２１', '1420064', 'https://www.study1.jp/kanto/school/B13P037/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('白百合学園中学校', 'B13P054', 'C113310100064', 64, '私立', '女子校', '東京23区', '東京都', '東京都千代田区九段北２－４－１', '1028185', 'https://www.study1.jp/kanto/school/B13P054/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('巣鴨中学校', 'B13P064', 'C113311600021', 64, '私立', '男子校', '東京23区', '東京都', '東京都豊島区上池袋１－２１－１', '1700012', 'https://www.study1.jp/kanto/school/B13P064/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東邦大学付属東邦中学校', 'B12P018', 'C112310000093', 64, '私立', '共学校', '千葉県', '千葉県', '千葉県習志野市泉町２－１－３７', '2758511', 'https://www.study1.jp/kanto/school/B12P018/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京農業大学第一高等学校中等部', 'B13P095', 'C113311200212', 64, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区桜３－３３－１', '1560053', 'https://www.study1.jp/kanto/school/B13P095/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立桜修館中等教育学校', 'B13C002', 'D213299900013', 64, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都目黒区八雲１－１－２', '1520023', 'https://www.study1.jp/kanto/school/B13C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立両国高等学校附属中学校', 'B13C007', 'C113299900025', 64, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都墨田区江東橋１－７－１４', '1300022', 'https://www.study1.jp/kanto/school/B13C007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('広尾学園小石川中学校', 'B13P139', 'C113310500140', 64, '私立', '共学校', '東京23区', '東京都', '東京都文京区本駒込２－２９－１', '1130021', 'https://www.study1.jp/kanto/school/B13P139/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('本郷中学校', 'B13P120', 'C113311600076', 64, '私立', '男子校', '東京23区', '東京都', '東京都豊島区駒込４－１１－１', '1700003', 'https://www.study1.jp/kanto/school/B13P120/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明治大学付属明治中学校', 'B14P041', 'C113320800011', 64, '私立', '共学校', '東京23区外', '東京都', '東京都調布市富士見町４－２３－２５', '1820033', 'https://www.study1.jp/kanto/school/B14P041/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('神奈川県立相模原中等教育学校', 'B15C002', 'D214215010015', 63, '公立中高一貫', '共学校', '神奈川県', '神奈川県', '神奈川県相模原市南区相模大野４－１－１', '2520303', 'https://www.study1.jp/kanto/school/B15C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('芝中学校', 'B13P044', 'C113310300044', 63, '私立', '男子校', '東京23区', '東京都', '東京都港区芝公園３－５－３７', '1050011', 'https://www.study1.jp/kanto/school/B13P044/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉県立東葛飾中学校', 'B12C003', 'C112210002912', 63, '公立中高一貫', '共学校', '千葉県', '千葉県', '千葉県柏市旭町３－２－１', '2778570', 'https://www.study1.jp/kanto/school/B12C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東洋英和女学院中学部', 'B13P098', 'C113310300099', 63, '私立', '女子校', '東京23区', '東京都', '東京都港区六本木５－１４－４０', '1068507', 'https://www.study1.jp/kanto/school/B13P098/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('フェリス女学院中学校', 'B15P045', 'C114310000091', 63, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市中区山手町１７８', '2318660', 'https://www.study1.jp/kanto/school/B15P045/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('三田国際科学学園中学校', 'B13P121', 'C113311200016', 63, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区用賀２－１６－１', '1580097', 'https://www.study1.jp/kanto/school/B13P121/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立並木中等教育学校', 'B08C001', 'D208222000011', 62, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県つくば市並木４－５－１', '3050044', 'https://www.study1.jp/kanto/school/B08C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('開智中学校', 'B11P006', 'C111311000010', 62, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市岩槻区徳力１８６', '3390004', 'https://www.study1.jp/kanto/school/B11P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('開智日本橋学園中学校', 'B13P016', 'C113310200018', 62, '私立', '共学校', '東京23区', '東京都', '東京都中央区日本橋馬喰町２－７－６', '1038384', 'https://www.study1.jp/kanto/school/B13P016/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('学習院女子中等科', 'B13P021', 'C113310400025', 62, '私立', '女子校', '東京23区', '東京都', '東京都新宿区戸山３－２０－１', '1628656', 'https://www.study1.jp/kanto/school/B13P021/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('淑徳与野中学校', 'B11P015', 'C111310500017', 62, '私立', '女子校', '埼玉県', '埼玉県', '埼玉県さいたま市中央区上落合５－１９－１８', '3380001', 'https://www.study1.jp/kanto/school/B11P015/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('頌栄女子学院中学校', 'B13P052', 'C113310300035', 62, '私立', '女子校', '東京23区', '東京都', '東京都港区白金台２－２６－５', '1080071', 'https://www.study1.jp/kanto/school/B13P052/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('田園調布学園中等部', 'B13P085', 'C113311200196', 62, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区東玉川２－２１－８', '1588512', 'https://www.study1.jp/kanto/school/B13P085/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('山手学院中学校', 'B15P051', 'C114310000233', 62, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市栄区上郷町４６０', '2470013', 'https://www.study1.jp/kanto/school/B15P051/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜市立南高等学校附属中学校', 'B15C004', 'C114210020446', 62, '公立中高一貫', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市港南区東永谷２－１－１', '2330011', 'https://www.study1.jp/kanto/school/B15C004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立水戸第一高等学校附属中学校', 'B08C013', 'C108220190018', 61, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県水戸市三の丸３－１０－１', '3100011', 'https://www.study1.jp/kanto/school/B08C013/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立土浦第一高等学校附属中学校', 'B08C009', 'C108220390016', 61, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県土浦市真鍋４－４－２', '3000051', 'https://www.study1.jp/kanto/school/B08C009/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('攻玉社中学校', 'B13P033', 'C113310900020', 61, '私立', '男子校', '東京23区', '東京都', '東京都品川区西五反田５－１４－２', '1410031', 'https://www.study1.jp/kanto/school/B13P033/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('さいたま市立浦和中学校', 'B11C002', 'C111210700053', 61, '公立中高一貫', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市浦和区元町１－２８－１７', '3300073', 'https://www.study1.jp/kanto/school/B11C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('サレジオ学院中学校', 'B15P019', 'C114310000313', 61, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県横浜市都筑区南山田３－４３－１', '2240029', 'https://www.study1.jp/kanto/school/B15P019/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('世田谷学園中学校', 'B13P077', 'C113311200132', 61, '私立', '男子校', '東京23区', '東京都', '東京都世田谷区三宿１－１６－３１', '1540005', 'https://www.study1.jp/kanto/school/B13P077/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('高輪中学校', 'B13P078', 'C113310300071', 61, '私立', '男子校', '東京23区', '東京都', '東京都港区高輪２－１－３２', '1080074', 'https://www.study1.jp/kanto/school/B13P078/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('中央大学附属横浜中学校', 'B15P033', 'C114310000322', 61, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市都筑区牛久保東１－１４－１', '2248515', 'https://www.study1.jp/kanto/school/B15P033/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都市大学等々力中学校', 'B13P093', 'C113311200150', 61, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区等々力８－１０－１', '1580082', 'https://www.study1.jp/kanto/school/B13P093/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都市大学付属中学校', 'B13P094', 'C113311200178', 61, '私立', '男子校', '東京23区', '東京都', '東京都世田谷区成城１－１３－１', '1578560', 'https://www.study1.jp/kanto/school/B13P094/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立大泉高等学校附属中学校', 'B13C003', 'C113299900052', 61, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都練馬区東大泉５－３－１', '1780063', 'https://www.study1.jp/kanto/school/B13C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桐朋中学校', 'B14P028', 'C113321500021', 61, '私立', '男子校', '東京23区外', '東京都', '東京都国立市中３－１－１０', '1860004', 'https://www.study1.jp/kanto/school/B14P028/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('青山学院横浜英和中学校', 'B15P054', 'C114310000144', 60, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市南区蒔田町１２４', '2328580', 'https://www.study1.jp/kanto/school/B15P054/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('江戸川学園取手中学校', 'B08P003', 'C108321700026', 60, '私立', '共学校', '茨城県', '茨城県', '茨城県取手市西１－３７－１', '3020025', 'https://www.study1.jp/kanto/school/B08P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('逗子開成中学校', 'B15P023', 'C114320800029', 60, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県逗子市新宿２－５－１', '2498510', 'https://www.study1.jp/kanto/school/B15P023/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('青稜中学校', 'B13P076', 'C113310900057', 60, '私立', '共学校', '東京23区', '東京都', '東京都品川区二葉１－６－６', '1428550', 'https://www.study1.jp/kanto/school/B13P076/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千代田区立九段中等教育学校', 'B13C001', 'D213210100018', 60, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都千代田区九段北２－２－１', '1020073', 'https://www.study1.jp/kanto/school/B13C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('中央大学附属中学校', 'B14P021', 'C113321000035', 60, '私立', '共学校', '東京23区外', '東京都', '東京都小金井市貫井北町３－２２－１', '1848575', 'https://www.study1.jp/kanto/school/B14P021/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立白鷗高等学校附属中学校', 'B13C005', 'C113299900016', 60, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都台東区元浅草３－１２－１２', '1110041', 'https://www.study1.jp/kanto/school/B13C005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立富士高等学校附属中学校', 'B13C006', 'C113299900043', 60, '公立中高一貫', '共学校', '東京23区', '東京都', '東京都中野区弥生町５－２１－１', '1640013', 'https://www.study1.jp/kanto/school/B13C006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立三鷹中等教育学校', 'B14C002', 'D213299900059', 60, '公立中高一貫', '共学校', '東京23区外', '東京都', '東京都三鷹市新川６－２１－２１', '1810004', 'https://www.study1.jp/kanto/school/B14C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('立教新座中学校', 'B11P029', 'C111323000015', 60, '私立', '男子校', '埼玉県', '埼玉県', '埼玉県新座市北野１－２－２５', '3528523', 'https://www.study1.jp/kanto/school/B11P029/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('立教池袋中学校', 'B13P133', 'C113311600085', 60, '私立', '男子校', '東京23区', '東京都', '東京都豊島区西池袋５－１６－５', '1710021', 'https://www.study1.jp/kanto/school/B13P133/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('神奈川大学附属中学校', 'B15P006', 'C114310000279', 59, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市緑区台村町８００', '2260014', 'https://www.study1.jp/kanto/school/B15P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('神奈川県立平塚中等教育学校', 'B15C003', 'D214220310012', 59, '公立中高一貫', '共学校', '神奈川県', '神奈川県', '神奈川県平塚市大原１－１３', '2540074', 'https://www.study1.jp/kanto/school/B15C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('品川女子学院中等部', 'B13P043', 'C113310900048', 59, '私立', '女子校', '東京23区', '東京都', '東京都品川区北品川３－３－１２', '1408707', 'https://www.study1.jp/kanto/school/B13P043/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('芝浦工業大学附属中学校', 'B13P045', 'C113310800030', 59, '私立', '共学校', '東京23区', '東京都', '東京都江東区豊洲６－２－７', '1358139', 'https://www.study1.jp/kanto/school/B13P045/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('城北中学校', 'B13P060', 'C113311900028', 59, '私立', '男子校', '東京23区', '東京都', '東京都板橋区東新町２－２８－１', '1748711', 'https://www.study1.jp/kanto/school/B13P060/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京学芸大学附属世田谷中学校', 'B13N005', 'C113110000014', 59, '国立', '共学校', '東京23区', '東京都', '東京都世田谷区深沢４－３－１', '1580081', 'https://www.study1.jp/kanto/school/B13N005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立立川国際中等教育学校', 'B14C001', 'D213299900031', 59, '公立中高一貫', '共学校', '東京23区外', '東京都', '東京都立川市曙町３－２９－３７', '1900012', 'https://www.study1.jp/kanto/school/B14C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京都立南多摩中等教育学校', 'B14C003', 'D213299900040', 59, '公立中高一貫', '共学校', '東京23区外', '東京都', '東京都八王子市明神町４－２０－１', '1928562', 'https://www.study1.jp/kanto/school/B14C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('法政大学中学校', 'B14P035', 'C113320400015', 59, '私立', '共学校', '東京23区外', '東京都', '東京都三鷹市牟礼４－３－１', '1810002', 'https://www.study1.jp/kanto/school/B14P035/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('法政大学第二中学校', 'B15P047', 'C114313000022', 59, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県川崎市中原区木月大町６－１', '2110031', 'https://www.study1.jp/kanto/school/B15P047/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明治大学付属中野中学校', 'B13P126', 'C113311400032', 59, '私立', '男子校', '東京23区', '東京都', '東京都中野区東中野３－３－４', '1640003', 'https://www.study1.jp/kanto/school/B13P126/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('山脇学園中学校', 'B13P132', 'C113310300124', 59, '私立', '女子校', '東京23区', '東京都', '東京都港区赤坂４－１０－３６', '1078371', 'https://www.study1.jp/kanto/school/B13P132/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('立教女学院中学校', 'B13P134', 'C113311500077', 59, '私立', '女子校', '東京23区', '東京都', '東京都杉並区久我山４－２９－６０', '1688616', 'https://www.study1.jp/kanto/school/B13P134/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('暁星中学校', 'B13P025', 'C113310100055', 58, '私立', '男子校', '東京23区', '東京都', '東京都千代田区富士見１－２－５', '1028133', 'https://www.study1.jp/kanto/school/B13P025/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('国学院大学久我山中学校', 'B13P038', 'C113311500095', 58, '私立', '共学校', '東京23区', '東京都', '東京都杉並区久我山１－９－１', '1680082', 'https://www.study1.jp/kanto/school/B13P038/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('芝浦工業大学柏中学校', 'B12P005', 'C112310000208', 58, '私立', '共学校', '千葉県', '千葉県', '千葉県柏市増尾７００番地', '2770033', 'https://www.study1.jp/kanto/school/B12P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('成蹊中学校', 'B14P017', 'C113320300025', 58, '私立', '共学校', '東京23区外', '東京都', '東京都武蔵野市吉祥寺北町３－１０－１３', '1808633', 'https://www.study1.jp/kanto/school/B14P017/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桐蔭学園中等教育学校', 'B15P037', 'D214310000025', 58, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市青葉区鉄町１６１４', '2258502', 'https://www.study1.jp/kanto/school/B15P037/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('富士見中学校', 'B13P112', 'C113312000016', 58, '私立', '女子校', '東京23区', '東京都', '東京都練馬区中村北４－８－２６', '1760023', 'https://www.study1.jp/kanto/school/B13P112/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('普連土学園中学校', 'B13P115', 'C113310300106', 58, '私立', '女子校', '東京23区', '東京都', '東京都港区三田４－１４－１６', '1080073', 'https://www.study1.jp/kanto/school/B13P115/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明治大学付属八王子中学校', 'B14P040', 'C113320100036', 58, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市戸吹町１１００', '1920001', 'https://www.study1.jp/kanto/school/B14P040/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜共立学園中学校', 'B15P055', 'C114310000108', 58, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市中区山手町２１２', '2318662', 'https://www.study1.jp/kanto/school/B15P055/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('大宮開成中学校', 'B11P005', 'C111310300019', 57, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市大宮区堀の内町１－６１５', '3308567', 'https://www.study1.jp/kanto/school/B11P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('大妻中学校', 'B13P011', 'C113310100019', 57, '私立', '女子校', '東京23区', '東京都', '東京都千代田区三番町１２', '1028357', 'https://www.study1.jp/kanto/school/B13P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('鎌倉学園中学校', 'B15P007', 'C114320400023', 57, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県鎌倉市山ノ内１１０', '2470062', 'https://www.study1.jp/kanto/school/B15P007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('川崎市立川崎高等学校附属中学校', 'B15C001', 'C114213020119', 57, '公立中高一貫', '共学校', '神奈川県', '神奈川県', '神奈川県川崎市川崎区中島３－３－１', '2100806', 'https://www.study1.jp/kanto/school/B15C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('さいたま市立大宮国際中等教育学校', 'B11C003', 'D211210300018', 57, '公立中高一貫', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市大宮区三橋４－９６', '3300856', 'https://www.study1.jp/kanto/school/B11C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('湘南白百合学園中学校', 'B15P021', 'C114320500022', 57, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県藤沢市片瀬目白山４－１', '2510034', 'https://www.study1.jp/kanto/school/B15P021/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉市立稲毛国際中等教育学校', 'B12C002', 'D212210000010', 57, '公立中高一貫', '共学校', '千葉県', '千葉県', '千葉県千葉市美浜区高浜３－１－１', '2610003', 'https://www.study1.jp/kanto/school/B12C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京学芸大学附属国際中等教育学校', 'B13N004', 'D213110000020', 57, '国立', '共学校', '東京23区', '東京都', '東京都練馬区東大泉５－２２－１', '1780063', 'https://www.study1.jp/kanto/school/B13N004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京学芸大学附属竹早中学校', 'B13N006', 'C113110000023', 57, '国立', '共学校', '東京23区', '東京都', '東京都文京区小石川４－２－１', '1120002', 'https://www.study1.jp/kanto/school/B13N006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学中学校', 'B15P043', 'C114310000206', 57, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市港北区箕輪町２－９－１', '2238566', 'https://www.study1.jp/kanto/school/B15P043/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜雙葉中学校', 'B15P061', 'C114310000126', 57, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市中区山手町８８', '2318653', 'https://www.study1.jp/kanto/school/B15P061/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立日立第一高等学校附属中学校', 'B08C002', 'C108220290017', 56, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県日立市若葉町３－１５－１', '3170063', 'https://www.study1.jp/kanto/school/B08C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立水海道第一高等学校附属中学校', 'B08C012', 'C108221190016', 56, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県常総市亀岡町２５４３', '3030025', 'https://www.study1.jp/kanto/school/B08C012/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立下妻第一高等学校附属中学校', 'B08C010', 'C108221090017', 56, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県下妻市下妻乙２２６－１', '3040067', 'https://www.study1.jp/kanto/school/B08C010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('学習院中等科', 'B13P020', 'C113311600058', 56, '私立', '男子校', '東京23区', '東京都', '東京都豊島区目白１－５－１', '1710031', 'https://www.study1.jp/kanto/school/B13P020/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('恵泉女学園中学校', 'B13P030', 'C113311200052', 56, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区船橋５－８－１', '1560055', 'https://www.study1.jp/kanto/school/B13P030/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('専修大学松戸中学校', 'B12P012', 'C112310000217', 56, '私立', '共学校', '千葉県', '千葉県', '千葉県松戸市上本郷２－３６２１', '2718585', 'https://www.study1.jp/kanto/school/B12P012/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('ドルトン東京学園中等部', 'B14P046', 'C113320800048', 56, '私立', '共学校', '東京23区外', '東京都', '東京都調布市入間町二丁目２８番２０号', '1820004', 'https://www.study1.jp/kanto/school/B14P046/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('安田学園中学校', 'B13P131', 'C113310700013', 56, '私立', '共学校', '東京23区', '東京都', '東京都墨田区横網２－２－２５', '1308615', 'https://www.study1.jp/kanto/school/B13P131/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('川口市立高等学校附属中学校', 'B11C004', 'C111220300289', 55, '公立中高一貫', '共学校', '埼玉県', '埼玉県', '埼玉県川口市上青木３－１－４０', '3330844', 'https://www.study1.jp/kanto/school/B11C004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('淑徳中学校', 'B13P048', 'C113311900019', 55, '私立', '共学校', '東京23区', '東京都', '東京都板橋区前野町５－１４－１', '1748643', 'https://www.study1.jp/kanto/school/B13P048/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('成城中学校', 'B13P069', 'C113310400043', 55, '私立', '男子校', '東京23区', '東京都', '東京都新宿区原町３－８７', '1628670', 'https://www.study1.jp/kanto/school/B13P069/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('栃木県立宇都宮東高等学校付属中学校', 'B09C001', 'C109210001525', 55, '公立中高一貫', '共学校', '栃木県', '栃木県', '栃木県宇都宮市石井町３３６０－１', '3210912', 'https://www.study1.jp/kanto/school/B09C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京女学館中学校', 'B13P089', 'C113311300033', 55, '私立', '女子校', '東京23区', '東京都', '東京都渋谷区広尾３－７－１６', '1500012', 'https://www.study1.jp/kanto/school/B13P089/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京大学教育学部附属中等教育学校', 'B13N007', 'D213110000011', 55, '国立', '共学校', '東京23区', '東京都', '東京都中野区南台１－１５－１', '1648654', 'https://www.study1.jp/kanto/school/B13N007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('公文国際学園中等部', 'B15P015', 'C114310000224', 54, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市戸塚区小雀町７７７', '2440004', 'https://www.study1.jp/kanto/school/B15P015/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('成城学園中学校', 'B13P070', 'C113311200105', 54, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区成城６－１－２０', '1578511', 'https://www.study1.jp/kanto/school/B13P070/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('帝京大学中学校', 'B14P022', 'C113320100090', 54, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市越野３２２', '1920361', 'https://www.study1.jp/kanto/school/B14P022/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('獨協中学校', 'B13P101', 'C113310500113', 54, '私立', '男子校', '東京23区', '東京都', '東京都文京区関口３－８－１', '1120014', 'https://www.study1.jp/kanto/school/B13P101/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明治大学付属世田谷中学校', 'B13P105', 'C113311400032', 54, '私立', '共学校', '東京23区', '東京都', '東京都中野区東中野３－３－４', '1640003', 'https://www.study1.jp/kanto/school/B13P105/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('青山学院大学系属浦和ルーテル学院中学校', 'B11P003', 'C111310900022', 53, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市緑区大字大崎３６４２', '3360974', 'https://www.study1.jp/kanto/school/B11P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('かえつ有明中学校', 'B13P017', 'C113310800012', 53, '私立', '共学校', '東京23区', '東京都', '東京都江東区東雲２－１６－１', '1358711', 'https://www.study1.jp/kanto/school/B13P017/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('関東学院中学校', 'B15P011', 'C114310000135', 53, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市南区三春台４', '2320002', 'https://www.study1.jp/kanto/school/B15P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('共立女子中学校', 'B13P024', 'C113310100037', 53, '私立', '女子校', '東京23区', '東京都', '東京都千代田区一ツ橋２－２－１', '1018433', 'https://www.study1.jp/kanto/school/B13P024/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('佼成学園中学校', 'B13P035', 'C113311500022', 53, '私立', '男子校', '東京23区', '東京都', '東京都杉並区和田２－６－２９', '1660012', 'https://www.study1.jp/kanto/school/B13P035/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('晃華学園中学校', 'B14P009', 'C113320800020', 53, '私立', '女子校', '東京23区外', '東京都', '東京都調布市佐須町５－２８－１', '1828550', 'https://www.study1.jp/kanto/school/B14P009/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('芝国際中学校', 'B13P091', 'C113310300080', 53, '私立', '共学校', '東京23区', '東京都', '東京都港区芝４－１－３０', '1080014', 'https://www.study1.jp/kanto/school/B13P091/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉大学教育学部附属中学校', 'B12N001', 'C112110000015', 53, '国立', '共学校', '千葉県', '千葉県', '千葉県千葉市稲毛区弥生町１－３３', '2638522', 'https://www.study1.jp/kanto/school/B12N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東洋大学京北中学校', 'B13P031', 'C113310500060', 53, '私立', '共学校', '東京23区', '東京都', '東京都文京区白山２－３６－５', '1128607', 'https://www.study1.jp/kanto/school/B13P031/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本女子大学附属中学校', 'B15P042', 'C114313000059', 53, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県川崎市多摩区西生田１－１－１', '2148565', 'https://www.study1.jp/kanto/school/B15P042/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('細田学園中学校', 'B11P030', 'C111322800019', 53, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県志木市本町２－７－１', '3530004', 'https://www.study1.jp/kanto/school/B11P030/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('三輪田学園中学校', 'B13P122', 'C113310100117', 53, '私立', '女子校', '東京23区', '東京都', '東京都千代田区九段北３－３－１５', '1020073', 'https://www.study1.jp/kanto/school/B13P122/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('麗澤中学校', 'B12P023', 'C112310000226', 53, '私立', '共学校', '千葉県', '千葉県', '千葉県柏市光ヶ丘２－１－１', '2778686', 'https://www.study1.jp/kanto/school/B12P023/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('国府台女子学院中学部', 'B12P003', 'C112310000011', 52, '私立', '女子校', '千葉県', '千葉県', '千葉県市川市菅野３－２４－１', '2728567', 'https://www.study1.jp/kanto/school/B12P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('埼玉県立伊奈学園中学校', 'B11C001', 'C111230100048', 52, '公立中高一貫', '共学校', '埼玉県', '埼玉県', '埼玉県北足立郡伊奈町学園４丁目１番地１', '3620813', 'https://www.study1.jp/kanto/school/B11C001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('昭和女子大学附属昭和中学校', 'B13P053', 'C113311200098', 52, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区太子堂１－７－５７', '1548533', 'https://www.study1.jp/kanto/school/B13P053/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学豊山中学校', 'B13P108', 'C113310500122', 52, '私立', '男子校', '東京23区', '東京都', '東京都文京区大塚５－４０－１０', '1120012', 'https://www.study1.jp/kanto/school/B13P108/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('森村学園中等部', 'B15P050', 'C114310000260', 52, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市緑区長津田町２６９５', '2260026', 'https://www.study1.jp/kanto/school/B15P050/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('大妻中野中学校', 'B13P012', 'C113311400041', 51, '私立', '女子校', '東京23区', '東京都', '東京都中野区上高田２－３－７', '1640002', 'https://www.study1.jp/kanto/school/B13P012/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('北里大学附属順天中学校', 'B13P058', 'C113311700093', 51, '私立', '共学校', '東京23区', '東京都', '東京都北区王子本町１－１７－１３', '1140022', 'https://www.study1.jp/kanto/school/B13P058/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('駒込中学校', 'B13P040', 'C113310500079', 51, '私立', '共学校', '東京23区', '東京都', '東京都文京区千駄木５－６－２５', '1130022', 'https://www.study1.jp/kanto/school/B13P040/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('清泉女学院中学校', 'B15P026', 'C114320400069', 51, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県鎌倉市城廻２００', '2470074', 'https://www.study1.jp/kanto/school/B15P026/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京学芸大学附属小金井中学校', 'B14N001', 'C113110000032', 51, '国立', '共学校', '東京23区外', '東京都', '東京都小金井市貫井北町４－１－１', '1848501', 'https://www.study1.jp/kanto/school/B14N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('宝仙学園中学校共学部理数インター', 'B13P119', 'C113311400023', 51, '私立', '共学校', '東京23区', '東京都', '東京都中野区中央２－２８－３', '1648628', 'https://www.study1.jp/kanto/school/B13P119/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茗溪学園中学校', 'B08P011', 'C108322000012', 51, '私立', '共学校', '茨城県', '茨城県', '茨城県つくば市稲荷前１－１', '3058502', 'https://www.study1.jp/kanto/school/B08P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('目黒日本大学中学校', 'B13P110', 'C113311000018', 51, '私立', '共学校', '東京23区', '東京都', '東京都目黒区目黒１－６－１５', '1530063', 'https://www.study1.jp/kanto/school/B13P110/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜国立大学教育学部附属横浜中学校', 'B15N002', 'C114110000022', 51, '国立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市南区大岡２－３１－３', '2320061', 'https://www.study1.jp/kanto/school/B15N002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('跡見学園中学校', 'B13P005', 'C113310500015', 50, '私立', '女子校', '東京23区', '東京都', '東京都文京区大塚１－５－９', '1128629', 'https://www.study1.jp/kanto/school/B13P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('郁文館中学校', 'B13P006', 'C113310500024', 50, '私立', '共学校', '東京23区', '東京都', '東京都文京区向丘２－１９－１', '1130023', 'https://www.study1.jp/kanto/school/B13P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立下館第一高等学校附属中学校', 'B08C008', 'C108222790018', 50, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県筑西市下中山５９０', '3080825', 'https://www.study1.jp/kanto/school/B08C008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立竜ヶ崎第一高等学校附属中学校', 'B08C007', 'C108220890011', 50, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県龍ケ崎市平畑２４８', '3010844', 'https://www.study1.jp/kanto/school/B08C007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('昭和学院中学校', 'B12P008', 'C112310000039', 50, '私立', '共学校', '千葉県', '千葉県', '千葉県市川市東菅野２－１７－１', '2720823', 'https://www.study1.jp/kanto/school/B12P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('実践女子学園中学校', 'B13P056', 'C113311300024', 50, '私立', '女子校', '東京23区', '東京都', '東京都渋谷区東１－１－１１', '1500011', 'https://www.study1.jp/kanto/school/B13P056/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('西武学園文理中学校', 'B11P020', 'C111321500014', 50, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県狭山市柏原新田３１１－１', '3501336', 'https://www.study1.jp/kanto/school/B11P020/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉日本大学第一中学校', 'B12P014', 'C112310000066', 50, '私立', '共学校', '千葉県', '千葉県', '千葉県船橋市習志野台８－３４－１', '2740063', 'https://www.study1.jp/kanto/school/B12P014/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桐光学園中学校男子部', 'B15P040', 'C114313000068', 50, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県川崎市麻生区栗木３－１２－１', '2158555', 'https://www.study1.jp/kanto/school/B15P040/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('星野学園中学校', 'B11P027', 'C111320100038', 50, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県川越市石原町２－７１－１１', '3500824', 'https://www.study1.jp/kanto/school/B11P027/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜女学院中学校', 'B15P056', 'C114310000117', 50, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市中区山手町２０３', '2318661', 'https://www.study1.jp/kanto/school/B15P056/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桜美林中学校', 'B14P003', 'C113320900038', 49, '私立', '共学校', '東京23区外', '東京都', '東京都町田市常盤町３７５８', '1940294', 'https://www.study1.jp/kanto/school/B14P003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('カリタス女子中学校', 'B15P010', 'C114313000040', 49, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県川崎市多摩区中野島４－６－１', '2140012', 'https://www.study1.jp/kanto/school/B15P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('光英VERITAS中学校', 'B12P010', 'C112310000128', 49, '私立', '共学校', '千葉県', '千葉県', '千葉県松戸市秋山６００', '2700023', 'https://www.study1.jp/kanto/school/B12P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('埼玉栄中学校', 'B11P010', 'C111310100011', 49, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市西区西大宮３丁目１１番地１', '3310078', 'https://www.study1.jp/kanto/school/B11P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('城北埼玉中学校', 'B11P019', 'C111320100047', 49, '私立', '男子校', '埼玉県', '埼玉県', '埼玉県川越市古市場５８５－１', '3500014', 'https://www.study1.jp/kanto/school/B11P019/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('淑徳巣鴨中学校', 'B13P050', 'C113311600094', 49, '私立', '共学校', '東京23区', '東京都', '東京都豊島区西巣鴨２－２２－１６', '1700001', 'https://www.study1.jp/kanto/school/B13P050/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('湘南学園中学校', 'B15P020', 'C114320500013', 49, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県藤沢市鵠沼松が岡３－４－２７', '2518505', 'https://www.study1.jp/kanto/school/B15P020/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学藤沢中学校', 'B15P044', 'C114320500068', 49, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県藤沢市亀井野１８６６', '2520885', 'https://www.study1.jp/kanto/school/B15P044/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('足立学園中学校', 'B13P004', 'C113312100015', 48, '私立', '男子校', '東京23区', '東京都', '東京都足立区千住旭町４０－２４', '1200026', 'https://www.study1.jp/kanto/school/B13P004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立古河中等教育学校', 'B08C003', 'D208220400011', 48, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県古河市磯部８４６', '3060225', 'https://www.study1.jp/kanto/school/B08C003/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('光塩女子学院中等科', 'B13P032', 'C113311500013', 48, '私立', '女子校', '東京23区', '東京都', '東京都杉並区高円寺南２－３３－２８', '1660003', 'https://www.study1.jp/kanto/school/B13P032/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('サレジアン国際学園世田谷中学校', 'B13P128', 'C113311200187', 48, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区大蔵２－８－１', '1570074', 'https://www.study1.jp/kanto/school/B13P128/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('城西川越中学校', 'B11P018', 'C111320100029', 48, '私立', '男子校', '埼玉県', '埼玉県', '埼玉県川越市山田東町１０４２', '3500822', 'https://www.study1.jp/kanto/school/B11P018/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('多摩大学目黒中学校', 'B13P081', 'C113311000054', 48, '私立', '共学校', '東京23区', '東京都', '東京都目黒区下目黒４－１０－２４', '1530064', 'https://www.study1.jp/kanto/school/B13P081/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京電機大学中学校', 'B14P026', 'C113321000026', 48, '私立', '共学校', '東京23区外', '東京都', '東京都小金井市梶野町４－８－１', '1848555', 'https://www.study1.jp/kanto/school/B14P026/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('八王子学園八王子中学校', 'B14P031', 'C113320100081', 48, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市台町４－３５－１', '1930931', 'https://www.study1.jp/kanto/school/B14P031/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明治学院中学校', 'B14P039', 'C113321300023', 48, '私立', '共学校', '東京23区外', '東京都', '東京都東村山市富士見町１－１２－３', '1890024', 'https://www.study1.jp/kanto/school/B14P039/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('八千代松陰中学校', 'B12P022', 'C112310000119', 48, '私立', '共学校', '千葉県', '千葉県', '千葉県八千代市村上７２７番地', '2760028', 'https://www.study1.jp/kanto/school/B12P022/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜創英中学校', 'B15P058', 'C114310000064', 48, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市神奈川区西大口２８', '2210004', 'https://www.study1.jp/kanto/school/B15P058/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城大学教育学部附属中学校', 'B08N001', 'C108110000011', 47, '国立', '共学校', '茨城県', '茨城県', '茨城県水戸市文京１－３－３２', '3100056', 'https://www.study1.jp/kanto/school/B08N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学第一中学校', 'B13P106', 'C113310700022', 47, '私立', '共学校', '東京23区', '東京都', '東京都墨田区横網１－５－２', '1300015', 'https://www.study1.jp/kanto/school/B13P106/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('穎明館中学校', 'B14P001', 'C113320100018', 46, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市館町２６００', '1930944', 'https://www.study1.jp/kanto/school/B14P001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('開智未来中学校', 'B11P007', 'C111321000019', 46, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県加須市麦倉１２３８番地', '3491212', 'https://www.study1.jp/kanto/school/B11P007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('春日部共栄中学校', 'B11P008', 'C111321400015', 46, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県春日部市上大増新田２１３', '3440037', 'https://www.study1.jp/kanto/school/B11P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('神奈川学園中学校', 'B15P005', 'C114310000055', 46, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市神奈川区沢渡１８', '2210844', 'https://www.study1.jp/kanto/school/B15P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('鎌倉女学院中学校', 'B15P008', 'C114320400032', 46, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県鎌倉市由比ガ浜２－１０－４', '2480014', 'https://www.study1.jp/kanto/school/B15P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('京華中学校', 'B13P028', 'C113310500042', 46, '私立', '男子校', '東京23区', '東京都', '東京都文京区白山５－６－６', '1128612', 'https://www.study1.jp/kanto/school/B13P028/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('埼玉大学教育学部附属中学校', 'B11N001', 'C111110000016', 46, '国立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市南区別所４－２－５', '3360021', 'https://www.study1.jp/kanto/school/B11N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桜丘中学校', 'B13P042', 'C113311700011', 46, '私立', '共学校', '東京23区', '東京都', '東京都北区滝野川１－５１－１２', '1148554', 'https://www.study1.jp/kanto/school/B13P042/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('実践学園中学校', 'B13P055', 'C113311400050', 46, '私立', '共学校', '東京23区', '東京都', '東京都中野区中央２－３４－２', '1640011', 'https://www.study1.jp/kanto/school/B13P055/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('十文字中学校', 'B13P057', 'C113311600030', 46, '私立', '女子校', '東京23区', '東京都', '東京都豊島区北大塚１－１０－３３', '1700004', 'https://www.study1.jp/kanto/school/B13P057/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖学院中学校', 'B13P067', 'C113311700020', 46, '私立', '男子校', '東京23区', '東京都', '東京都北区中里３－１２－１', '1148502', 'https://www.study1.jp/kanto/school/B13P067/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('創価中学校', 'B14P018', 'C113321100025', 46, '私立', '共学校', '東京23区外', '東京都', '東京都小平市小川町１－８６０', '1870032', 'https://www.study1.jp/kanto/school/B14P018/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('成田高等学校付属中学校', 'B12P019', 'C112310000084', 46, '私立', '共学校', '千葉県', '千葉県', '千葉県成田市成田２７', '2860023', 'https://www.study1.jp/kanto/school/B12P019/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学第二中学校', 'B13P107', 'C113311500068', 46, '私立', '共学校', '東京23区', '東京都', '東京都杉並区天沼１－４５－３３', '1670032', 'https://www.study1.jp/kanto/school/B13P107/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('浦和実業学園中学校', 'B11P002', 'C111310800014', 45, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県さいたま市南区文蔵３－９－１', '3360025', 'https://www.study1.jp/kanto/school/B11P002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('佼成学園女子中学校', 'B13P036', 'C113311200061', 45, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区給田２－１－１', '1570064', 'https://www.study1.jp/kanto/school/B13P036/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('昌平中学校', 'B11P016', 'C111346400012', 45, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県北葛飾郡杉戸町下野８５１', '3450044', 'https://www.study1.jp/kanto/school/B11P016/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('品川翔英中学校', 'B13P013', 'C113310900011', 45, '私立', '共学校', '東京23区', '東京都', '東京都品川区西大井１－６－１３', '1400015', 'https://www.study1.jp/kanto/school/B13P013/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('女子美術大学付属中学校', 'B13P063', 'C113311500031', 45, '私立', '女子校', '東京23区', '東京都', '東京都杉並区和田１－４９－８', '1668538', 'https://www.study1.jp/kanto/school/B13P063/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖セシリア女子中学校', 'B15P025', 'C114321300013', 45, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県大和市南林間３－１０－１', '2420006', 'https://www.study1.jp/kanto/school/B15P025/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('土浦日本大学中等教育学校', 'B08P008', 'D208320300010', 45, '私立', '共学校', '茨城県', '茨城県', '茨城県土浦市小松ヶ丘町４－４６', '3000826', 'https://www.study1.jp/kanto/school/B08P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本工業大学駒場中学校', 'B13P103', 'C113311000027', 45, '私立', '共学校', '東京23区', '東京都', '東京都目黒区駒場１－３５－３２', '1538508', 'https://www.study1.jp/kanto/school/B13P103/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日出学園中学校', 'B12P021', 'C112310000020', 45, '私立', '共学校', '千葉県', '千葉県', '千葉県市川市菅野３－２３－１', '2720824', 'https://www.study1.jp/kanto/school/B12P021/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖徳学園中学校', 'B14P013', 'C113320300016', 44, '私立', '共学校', '東京23区外', '東京都', '東京都武蔵野市境南町２－１１－８', '1808601', 'https://www.study1.jp/kanto/school/B14P013/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('清真学園中学校', 'B08P006', 'C108322200010', 44, '私立', '共学校', '茨城県', '茨城県', '茨城県鹿嶋市宮中伏見４４４８－５', '3140031', 'https://www.study1.jp/kanto/school/B08P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('西武台新座中学校', 'B11P021', 'C111323000024', 44, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県新座市中野２－９－１', '3528508', 'https://www.study1.jp/kanto/school/B11P021/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桐光学園中学校女子部', 'B15P039', 'C114313000068', 44, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県川崎市麻生区栗木３－１２－１', '2158555', 'https://www.study1.jp/kanto/school/B15P039/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('大妻嵐山中学校', 'B11P004', 'C111334200010', 43, '私立', '女子校', '埼玉県', '埼玉県', '埼玉県比企郡嵐山町菅谷５５８', '3550221', 'https://www.study1.jp/kanto/school/B11P004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('サレジアン国際学園中学校', 'B13P073', 'C113311700039', 43, '私立', '共学校', '東京23区', '東京都', '東京都北区赤羽台４－２－１４', '1158524', 'https://www.study1.jp/kanto/school/B13P073/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('女子聖学院中学校', 'B13P062', 'C113311700048', 43, '私立', '女子校', '東京23区', '東京都', '東京都北区中里３－１２－２', '1148574', 'https://www.study1.jp/kanto/school/B13P062/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('自修館中等教育学校', 'B15P022', 'D214321400019', 43, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県伊勢原市見附島４１１', '2591185', 'https://www.study1.jp/kanto/school/B15P022/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東海大学付属浦安高等学校中等部', 'B12P016', 'C112310000164', 43, '私立', '共学校', '千葉県', '千葉県', '千葉県浦安市東野３－１１－１', '2798558', 'https://www.study1.jp/kanto/school/B12P016/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('二松学舍大学附属柏中学校', 'B12P020', 'C112310000244', 43, '私立', '共学校', '千葉県', '千葉県', '千葉県柏市大井２５９０', '2770902', 'https://www.study1.jp/kanto/school/B12P020/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学第三中学校', 'B14P030', 'C113320900010', 43, '私立', '共学校', '東京23区外', '東京都', '東京都町田市図師町１１－２３７５', '1940203', 'https://www.study1.jp/kanto/school/B14P030/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('文教大学付属中学校', 'B13P118', 'C113310900066', 43, '私立', '共学校', '東京23区', '東京都', '東京都品川区旗の台３－２－１７', '1420064', 'https://www.study1.jp/kanto/school/B13P118/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('江戸川女子中学校', 'B13P008', 'C113312300022', 42, '私立', '女子校', '東京23区', '東京都', '東京都江戸川区東小岩５－２２－１', '1338552', 'https://www.study1.jp/kanto/school/B13P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('獨協埼玉中学校', 'B11P025', 'C111322200015', 42, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県越谷市恩間新田寺前３１６', '3430037', 'https://www.study1.jp/kanto/school/B11P025/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('中村中学校', 'B13P102', 'C113310800021', 42, '私立', '女子校', '東京23区', '東京都', '東京都江東区清澄２－３－１５', '1358404', 'https://www.study1.jp/kanto/school/B13P102/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明法中学校', 'B14P043', 'C113321300014', 42, '私立', '共学校', '東京23区外', '東京都', '東京都東村山市富士見町２－４－１２', '1890024', 'https://www.study1.jp/kanto/school/B14P043/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜国立大学教育学部附属鎌倉中学校', 'B15N001', 'C114110000013', 42, '国立', '共学校', '神奈川県', '神奈川県', '神奈川県鎌倉市雪ノ下３－５－１０', '2480005', 'https://www.study1.jp/kanto/school/B15N001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('大妻多摩中学校', 'B14P004', 'C113322400020', 41, '私立', '女子校', '東京23区外', '東京都', '東京都多摩市唐木田２－７－１', '2068540', 'https://www.study1.jp/kanto/school/B14P004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('神田女学園中学校', 'B13P019', 'C113310100028', 41, '私立', '女子校', '東京23区', '東京都', '東京都千代田区神田猿楽町２－３－６', '1010064', 'https://www.study1.jp/kanto/school/B13P019/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('啓明学園中学校', 'B14P008', 'C113320700012', 41, '私立', '共学校', '東京23区外', '東京都', '東京都昭島市拝島町５－１１－１５', '1960002', 'https://www.study1.jp/kanto/school/B14P008/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('麴町学園女子中学校', 'B13P034', 'C113310100046', 41, '私立', '女子校', '東京23区', '東京都', '東京都千代田区麹町３－８', '1020083', 'https://www.study1.jp/kanto/school/B13P034/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('工学院大学附属中学校', 'B14P010', 'C113320100063', 41, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市中野町２６４７－２', '1928622', 'https://www.study1.jp/kanto/school/B14P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖望学園中学校', 'B11P022', 'C111320900012', 41, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県飯能市中山２９２', '3570006', 'https://www.study1.jp/kanto/school/B11P022/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東海大学付属高輪台高等学校中等部', 'B13P086', 'C113310300115', 41, '私立', '共学校', '東京23区', '東京都', '東京都港区高輪２－２－１６', '1088587', 'https://www.study1.jp/kanto/school/B13P086/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京成徳大学中学校', 'B13P092', 'C113311700066', 41, '私立', '共学校', '東京23区', '東京都', '東京都北区豊島８－２６－９', '1148526', 'https://www.study1.jp/kanto/school/B13P092/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東海大学付属相模高等学校中等部', 'B15P038', 'C114315000036', 41, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県相模原市南区相南３－３３－１', '2520395', 'https://www.study1.jp/kanto/school/B15P038/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('文化学園大学杉並中学校', 'B13P116', 'C113311500040', 41, '私立', '共学校', '東京23区', '東京都', '東京都杉並区阿佐谷南３－４８－１６', '1660004', 'https://www.study1.jp/kanto/school/B13P116/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('文京学院大学女子中学校', 'B13P117', 'C113310500131', 41, '私立', '女子校', '東京23区', '東京都', '東京都文京区本駒込６－１８－３', '1138667', 'https://www.study1.jp/kanto/school/B13P117/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖園女学院中学校', 'B15P048', 'C114320500031', 41, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県藤沢市みその台１－４', '2510873', 'https://www.study1.jp/kanto/school/B15P048/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('武蔵野大学中学校', 'B14P037', 'C113322900025', 41, '私立', '共学校', '東京23区外', '東京都', '東京都西東京市新町１－１－２０', '2028585', 'https://www.study1.jp/kanto/school/B14P037/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城中学校', 'B08P001', 'C108320100015', 40, '私立', '共学校', '茨城県', '茨城県', '茨城県水戸市八幡町１６－１', '3100065', 'https://www.study1.jp/kanto/school/B08P001/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城県立勝田中等教育学校', 'B08C011', 'D208222100010', 40, '公立中高一貫', '共学校', '茨城県', '茨城県', '茨城県ひたちなか市足崎１４５８', '3120003', 'https://www.study1.jp/kanto/school/B08C011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('捜真女学校中学部', 'B15P030', 'C114310000073', 40, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県横浜市神奈川区中丸８', '2218720', 'https://www.study1.jp/kanto/school/B15P030/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('鶴見大学附属中学校', 'B15P034', 'C114310000037', 40, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市鶴見区鶴見２－２－１', '2300063', 'https://www.study1.jp/kanto/school/B15P034/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('栃木県立佐野高等学校附属中学校', 'B09C002', 'C109210001534', 40, '公立中高一貫', '共学校', '栃木県', '栃木県', '栃木県佐野市天神町７６１－１', '3270847', 'https://www.study1.jp/kanto/school/B09C002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京農業大学第三高等学校附属中学校', 'B11P024', 'C111321200017', 40, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県東松山市松山１４００－１', '3550005', 'https://www.study1.jp/kanto/school/B11P024/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京家政大学附属女子中学校', 'B13P088', 'C113311900037', 40, '私立', '女子校', '東京23区', '東京都', '東京都板橋区加賀１－１８－１', '1738602', 'https://www.study1.jp/kanto/school/B13P088/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('日本大学豊山女子中学校', 'B13P109', 'C113311900055', 40, '私立', '女子校', '東京23区', '東京都', '東京都板橋区中台３－１５－１', '1740064', 'https://www.study1.jp/kanto/school/B13P109/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('八雲学園中学校', 'B13P130', 'C113311000045', 40, '私立', '共学校', '東京23区', '東京都', '東京都目黒区八雲２－１４－１', '1520023', 'https://www.study1.jp/kanto/school/B13P130/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('和洋国府台女子中学校', 'B12P024', 'C112310000057', 40, '私立', '女子校', '千葉県', '千葉県', '千葉県市川市国府台２－３－１', '2728533', 'https://www.study1.jp/kanto/school/B12P024/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('狭山ヶ丘高等学校付属中学校', 'B11P013', 'C111322500012', 39, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県入間市下藤沢９８１', '3580011', 'https://www.study1.jp/kanto/school/B11P013/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('多摩大学附属聖ヶ丘中学校', 'B14P020', 'C113322400011', 39, '私立', '共学校', '東京23区外', '東京都', '東京都多摩市聖ヶ丘４－１－１', '2060022', 'https://www.study1.jp/kanto/school/B14P020/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('藤嶺学園藤沢中学校', 'B15P041', 'C114320500059', 39, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県藤沢市西富１－７－１', '2510001', 'https://www.study1.jp/kanto/school/B15P041/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('新島学園中学校', 'B10P002', 'C110310000022', 39, '私立', '共学校', '群馬県', '群馬県', '群馬県安中市安中３７０２', '3790116', 'https://www.study1.jp/kanto/school/B10P002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('武南中学校', 'B11P026', 'C111322300014', 39, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県蕨市塚越５－１０－２１', '3350002', 'https://www.study1.jp/kanto/school/B11P026/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('水戸英宏中学校', 'B08P010', 'C108320100024', 39, '私立', '共学校', '茨城県', '茨城県', '茨城県水戸市見川町字手負山２５８２－１５', '3100913', 'https://www.study1.jp/kanto/school/B08P010/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('立正大学付属立正中学校', 'B13P135', 'C113311100017', 39, '私立', '共学校', '東京23区', '東京都', '東京都大田区西馬込１－５－１', '1438557', 'https://www.study1.jp/kanto/school/B13P135/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('上野学園中学校', 'B13P007', 'C113310600014', 38, '私立', '共学校', '東京23区', '東京都', '東京都台東区東上野４－２４－１２', '1108642', 'https://www.study1.jp/kanto/school/B13P007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('常総学院中学校', 'B08P005', 'C108320300013', 38, '私立', '共学校', '茨城県', '茨城県', '茨城県土浦市中村西根１０１０', '3000849', 'https://www.study1.jp/kanto/school/B08P005/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('桐朋女子中学校', 'B14P029', 'C113320800039', 38, '私立', '女子校', '東京23区外', '東京都', '東京都調布市若葉町１－４１－１', '1828510', 'https://www.study1.jp/kanto/school/B14P029/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('北豊島中学校', 'B13P022', 'C113311800029', 37, '私立', '女子校', '東京23区', '東京都', '東京都荒川区東尾久６－３４－２４', '1168555', 'https://www.study1.jp/kanto/school/B13P022/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('共栄学園中学校', 'B13P023', 'C113312200014', 37, '私立', '共学校', '東京23区', '東京都', '東京都葛飾区お花茶屋２－６－１', '1240003', 'https://www.study1.jp/kanto/school/B13P023/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('京華女子中学校', 'B13P029', 'C113310500051', 37, '私立', '女子校', '東京23区', '東京都', '東京都文京区白山５－６－６', '1128612', 'https://www.study1.jp/kanto/school/B13P029/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('玉川聖学院中等部', 'B13P080', 'C113311200141', 37, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区奥沢７－１１－２２', '1580083', 'https://www.study1.jp/kanto/school/B13P080/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('和洋九段女子中学校', 'B13P138', 'C113310100126', 37, '私立', '女子校', '東京23区', '東京都', '東京都千代田区九段北１－１２－１２', '1020073', 'https://www.study1.jp/kanto/school/B13P138/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('関東学院六浦中学校', 'B15P012', 'C114310000171', 36, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市金沢区六浦東１－５０－１', '2368504', 'https://www.study1.jp/kanto/school/B15P012/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('共立女子第二中学校', 'B14P006', 'C113320100045', 36, '私立', '女子校', '東京23区外', '東京都', '東京都八王子市元八王子町１－７１０', '1938666', 'https://www.study1.jp/kanto/school/B14P006/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('玉川学園中学部', 'B14P019', 'C113320900047', 36, '私立', '共学校', '東京23区外', '東京都', '東京都町田市玉川学園６－１－１', '1948610', 'https://www.study1.jp/kanto/school/B14P019/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京純心女子中学校', 'B14P025', 'C113320100054', 36, '私立', '女子校', '東京23区外', '東京都', '東京都八王子市滝山町２－６００', '1920011', 'https://www.study1.jp/kanto/school/B14P025/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('本庄東高等学校附属中学校', 'B11P028', 'C111321100018', 36, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県本庄市西五十子大塚３１８', '3670025', 'https://www.study1.jp/kanto/school/B11P028/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明星中学校', 'B14P042', 'C113320600013', 36, '私立', '共学校', '東京23区外', '東京都', '東京都府中市栄町１－１', '1838531', 'https://www.study1.jp/kanto/school/B14P042/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('茨城キリスト教学園中学校', 'B08P002', 'C108320200014', 35, '私立', '共学校', '茨城県', '茨城県', '茨城県日立市大みか町６―１１－１', '3191295', 'https://www.study1.jp/kanto/school/B08P002/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('鎌倉国際文理中学校', 'B15P009', NULL, 35, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県鎌倉市岩瀬１５５０', '2470052', 'https://www.study1.jp/kanto/school/B15P009/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('国本女子中学校', 'B13P026', 'C113311200043', 35, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区喜多見８－１５－３３', '1570067', 'https://www.study1.jp/kanto/school/B13P026/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('秀明中学校', 'B11P014', 'C111320100010', 35, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県川越市笠幡４７９２番地', '3501175', 'https://www.study1.jp/kanto/school/B11P014/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('成立学園中学校', 'B13P075', 'C113311700100', 35, '私立', '共学校', '東京23区', '東京都', '東京都北区東十条６－９－１３', '1140001', 'https://www.study1.jp/kanto/school/B13P075/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖和学院中学校', 'B15P028', 'C114320800010', 35, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県逗子市久木２－２－１', '2490001', 'https://www.study1.jp/kanto/school/B15P028/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('作新学院中等部', 'B09P004', 'C109310000016', 34, '私立', '共学校', '栃木県', '栃木県', '栃木県宇都宮市一の沢１－１－４１', '3208525', 'https://www.study1.jp/kanto/school/B09P004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('西武台千葉中学校', 'B12P011', 'C112310000182', 34, '私立', '共学校', '千葉県', '千葉県', '千葉県野田市尾崎２２４１－２', '2700235', 'https://www.study1.jp/kanto/school/B12P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖ヨゼフ学園中学校', 'B15P027', 'C114310000019', 34, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市鶴見区東寺尾北台１１－１', '2300016', 'https://www.study1.jp/kanto/school/B15P027/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横須賀学院中学校', 'B15P052', 'C114320100026', 34, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横須賀市稲岡町８２', '2388511', 'https://www.study1.jp/kanto/school/B15P052/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜富士見丘学園中学校', 'B15P060', 'C114310000251', 34, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市旭区中沢１－２４－１', '2418502', 'https://www.study1.jp/kanto/school/B15P060/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('北鎌倉女子学園中学校', 'B15P014', 'C114320400041', 33, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県鎌倉市山ノ内９１３', '2470062', 'https://www.study1.jp/kanto/school/B15P014/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('相模女子大学中学部', 'B15P018', 'C114315000027', 33, '私立', '女子校', '神奈川県', '神奈川県', '神奈川県相模原市南区文京２－１－１', '2520383', 'https://www.study1.jp/kanto/school/B15P018/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('城西大学附属城西中学校', 'B13P059', 'C113311600067', 33, '私立', '共学校', '東京23区', '東京都', '東京都豊島区千早１－１０－２６', '1710044', 'https://www.study1.jp/kanto/school/B13P059/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('帝京中学校', 'B13P083', 'C113311900046', 33, '私立', '共学校', '東京23区', '東京都', '東京都板橋区稲荷台２７－１', '1738555', 'https://www.study1.jp/kanto/school/B13P083/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('トキワ松学園中学校', 'B13P099', 'C113311000036', 33, '私立', '女子校', '東京23区', '東京都', '東京都目黒区碑文谷４－１７－１６', '1520003', 'https://www.study1.jp/kanto/school/B13P099/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('明星学園中学校', 'B14P036', 'C113320400024', 33, '私立', '共学校', '東京23区外', '東京都', '東京都三鷹市井の頭５－７－７', '1810001', 'https://www.study1.jp/kanto/school/B14P036/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('目白研心中学校', 'B13P129', 'C113310400052', 33, '私立', '共学校', '東京23区', '東京都', '東京都新宿区中落合４－３１－１', '1618522', 'https://www.study1.jp/kanto/school/B13P129/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜翠陵中学校', 'B15P057', 'C114310000288', 33, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市緑区三保町１', '2260015', 'https://www.study1.jp/kanto/school/B15P057/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('横浜隼人中学校', 'B15P059', 'C114310000297', 33, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県横浜市瀬谷区阿久和南１－３－１', '2460026', 'https://www.study1.jp/kanto/school/B15P059/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('吉祥寺学園中等部', 'B14P038', NULL, 32, '私立', '共学校', '東京23区外', '東京都', '東京都武蔵野市吉祥寺南町４－１２－２０', '1800003', 'https://www.study1.jp/kanto/school/B14P038/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('国士舘中学校', 'B13P039', 'C113311200070', 32, '私立', '共学校', '東京23区', '東京都', '東京都世田谷区若林４－３２－１', '1548553', 'https://www.study1.jp/kanto/school/B13P039/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('相洋中学校', 'B15P031', 'C114320600012', 32, '私立', '共学校', '神奈川県', '神奈川県', '神奈川県小田原市城山４－１３－３３', '2500045', 'https://www.study1.jp/kanto/school/B15P031/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('千葉明徳中学校', 'B12P015', 'C112310000235', 32, '私立', '共学校', '千葉県', '千葉県', '千葉県千葉市中央区南生実町１４１２', '2608685', 'https://www.study1.jp/kanto/school/B12P015/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('和光中学校', 'B14P044', 'C113320900029', 32, '私立', '共学校', '東京23区外', '東京都', '東京都町田市真光寺町１２９１', '1950051', 'https://www.study1.jp/kanto/school/B14P044/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('川村中学校', 'B13P018', 'C113311600012', 31, '私立', '女子校', '東京23区', '東京都', '東京都豊島区目白２－２２－３', '1710031', 'https://www.study1.jp/kanto/school/B13P018/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('白梅学園清修中学校', 'B14P014', 'C113321100034', 31, '私立', '女子校', '東京23区外', '東京都', '東京都小平市小川町１－８３０', '1878570', 'https://www.study1.jp/kanto/school/B14P014/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('聖ドミニコ学園中学校', 'B13P072', 'C113311200123', 31, '私立', '女子校', '東京23区', '東京都', '東京都世田谷区岡本１－１０－１', '1570076', 'https://www.study1.jp/kanto/school/B13P072/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東海大学菅生高等学校中等部', 'B14P024', 'C113322800017', 31, '私立', '共学校', '東京23区外', '東京都', '東京都あきる野市菅生１４６８', '1970801', 'https://www.study1.jp/kanto/school/B14P024/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('富士見丘中学校', 'B13P113', 'C113311300042', 31, '私立', '女子校', '東京23区', '東京都', '東京都渋谷区笹塚３－１９－９', '1510073', 'https://www.study1.jp/kanto/school/B13P113/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('英明フロンティア中学校', 'B13P090', 'C113312000043', 30, '私立', '共学校', '東京23区', '東京都', '東京都練馬区関町北４－１６－１１', '1770051', 'https://www.study1.jp/kanto/school/B13P090/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('駒沢学園女子中学校', 'B14P011', 'C113322500010', 30, '私立', '女子校', '東京23区外', '東京都', '東京都稲城市坂浜２３８', '2068511', 'https://www.study1.jp/kanto/school/B14P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('埼玉平成中学校', 'B11P011', 'C111332600010', 30, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県入間郡毛呂山町下川原３７５', '3500435', 'https://www.study1.jp/kanto/school/B11P011/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('志学館中等部', 'B12P004', 'C112310000146', 30, '私立', '共学校', '千葉県', '千葉県', '千葉県木更津市真舟３－２９－１', '2928568', 'https://www.study1.jp/kanto/school/B12P004/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('秀明大学学校教師学部附属秀明八千代中学校', 'B12P007', 'C112310000100', 30, '私立', '共学校', '千葉県', '千葉県', '千葉県八千代市桑橋８０３番地', '2760007', 'https://www.study1.jp/kanto/school/B12P007/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('駿台学園中学校', 'B13P066', 'C113311700084', 30, '私立', '共学校', '東京23区', '東京都', '東京都北区王子６－１－１０', '1140002', 'https://www.study1.jp/kanto/school/B13P066/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('帝京八王子中学校', 'B14P023', 'C113320100072', 30, '私立', '共学校', '東京23区外', '東京都', '東京都八王子市上川町３７６６', '1920151', 'https://www.study1.jp/kanto/school/B14P023/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京成徳大学深谷中学校', 'B11P023', 'C111321800011', 30, '私立', '共学校', '埼玉県', '埼玉県', '埼玉県深谷市宿根５５９', '3660810', 'https://www.study1.jp/kanto/school/B11P023/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('東京家政学院中学校', 'B13P087', 'C113310100091', 30, '私立', '女子校', '東京23区', '東京都', '東京都千代田区三番町２２', '1028341', 'https://www.study1.jp/kanto/school/B13P087/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('新渡戸文化中学校', 'B13P104', 'C113311400014', 30, '私立', '共学校', '東京23区', '東京都', '東京都中野区本町６－３８－１', '1648638', 'https://www.study1.jp/kanto/school/B13P104/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('藤村女子中学校', 'B14P033', 'C113320300034', 30, '私立', '女子校', '東京23区外', '東京都', '東京都武蔵野市吉祥寺本町２－１６－３', '1808505', 'https://www.study1.jp/kanto/school/B14P033/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('武相中学校', 'B15P046', 'C114310000215', 30, '私立', '男子校', '神奈川県', '神奈川県', '神奈川県横浜市港北区仲手原２－３４－１', '2220023', 'https://www.study1.jp/kanto/school/B15P046/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)
VALUES ('目黒学院中学校', 'B13P127', 'C113311000063', 30, '私立', '共学校', '東京23区', '東京都', '東京都目黒区中目黒１－１－５０', '1538631', 'https://www.study1.jp/kanto/school/B13P127/')
ON CONFLICT (name) DO UPDATE SET
  study_id = EXCLUDED.study_id,
  mext_code = EXCLUDED.mext_code,
  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,
  establishment = EXCLUDED.establishment,
  school_type = EXCLUDED.school_type,
  area = EXCLUDED.area,
  prefecture = EXCLUDED.prefecture,
  address = EXCLUDED.address,
  postal_code = EXCLUDED.postal_code,
  study_url = EXCLUDED.study_url;

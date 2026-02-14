const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'jukenmap_schools_final.csv');
const outputPath = path.join(__dirname, '..', 'supabase', 'seed_jukenmap_schools.sql');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const header = lines[0].split(',');

// Verify header
console.log('Header:', header);
console.log(`Total rows: ${lines.length - 1}`);

function escapeSQL(str) {
  if (!str || str === '') return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

const sqlLines = [];
sqlLines.push('-- jukenmap_schools_final.csv から生成された学校マスターデータ');
sqlLines.push('-- 生成日: ' + new Date().toISOString().split('T')[0]);
sqlLines.push('-- add_school_master_fields.sql を先に実行してください');
sqlLines.push('');
sqlLines.push('-- ============================================================');
sqlLines.push('-- 学校マスタ（' + (lines.length - 1) + '校）');
sqlLines.push('-- ============================================================');
sqlLines.push('');

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // CSV parse (simple - no quoted fields with commas in this data)
  const cols = line.split(',');

  const study_id = cols[0];
  const mext_code = cols[1];
  const school_name = cols[2];
  const yotsuya = cols[3];
  const establishment = cols[4];
  const school_type = cols[5];
  const area = cols[6];
  const prefecture = cols[7];
  const address = cols[8];
  const postal_code = cols[9];
  const study_url = cols[10];

  sqlLines.push(`INSERT INTO schools (name, study_id, mext_code, yotsuya_deviation_value, establishment, school_type, area, prefecture, address, postal_code, study_url)`);
  sqlLines.push(`VALUES (${escapeSQL(school_name)}, ${escapeSQL(study_id)}, ${escapeSQL(mext_code)}, ${yotsuya || 'NULL'}, ${escapeSQL(establishment)}, ${escapeSQL(school_type)}, ${escapeSQL(area)}, ${escapeSQL(prefecture)}, ${escapeSQL(address)}, ${escapeSQL(postal_code)}, ${escapeSQL(study_url)})`);
  sqlLines.push(`ON CONFLICT (name) DO UPDATE SET`);
  sqlLines.push(`  study_id = EXCLUDED.study_id,`);
  sqlLines.push(`  mext_code = EXCLUDED.mext_code,`);
  sqlLines.push(`  yotsuya_deviation_value = EXCLUDED.yotsuya_deviation_value,`);
  sqlLines.push(`  establishment = EXCLUDED.establishment,`);
  sqlLines.push(`  school_type = EXCLUDED.school_type,`);
  sqlLines.push(`  area = EXCLUDED.area,`);
  sqlLines.push(`  prefecture = EXCLUDED.prefecture,`);
  sqlLines.push(`  address = EXCLUDED.address,`);
  sqlLines.push(`  postal_code = EXCLUDED.postal_code,`);
  sqlLines.push(`  study_url = EXCLUDED.study_url;`);
  sqlLines.push('');
}

fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf-8');
console.log(`Generated: ${outputPath}`);
console.log(`Total INSERT statements: ${lines.length - 1}`);

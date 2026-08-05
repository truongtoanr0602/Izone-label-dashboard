const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({ connectionString: 'postgresql://postgres:Izone%402026!@localhost:5432/izone_dashboard' });

async function run() {
  const migrationsDir = path.join(__dirname, '../database/migrations');
  const files = ['001_schema.sql', '002_seed_data.sql', '003_snapshot_data.sql', '004_contact_logs.sql'];
  
  for (const file of files) {
    console.log('Running ' + file);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
  }
  
  console.log('Seed completed successfully with UTF-8 encoding.');
  pool.end();
}

run().catch(err => {
  console.error('Error during seeding:', err);
  pool.end();
});

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:Izone%402026!@localhost:5432/izone_dashboard?schema=izone'
});

async function run() {
  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, '../database/migrations/004_contact_logs.sql'), 'utf-8');
  await client.query(sql);
  console.log('Migration 004 applied.');
  await client.end();
}
run().catch(console.error);

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('snapshot progress repair migration', () => {
  it('derives cumulative progress, audits old values, and updates only completed_sessions', () => {
    const migration = readFileSync(
      resolve(
        __dirname,
        '../../../database/migrations/006_repair_snapshot_completed_sessions.sql',
      ),
      'utf8',
    );

    expect(migration).toContain('r.class_id = s.class_id');
    expect(migration).toContain('r.record_date <= s.snapshot_date');
    expect(migration).toContain('LEAST(c.total_sessions');
    expect(migration).toContain('MAX(r.attendance_total)');
    expect(migration).toContain('MAX(r.homework_total)');
    expect(migration).toContain('class_snapshot_progress_repair_20260817');
    expect(migration).toMatch(/BEGIN;[\s\S]*COMMIT;/);
    expect(migration).toMatch(
      /UPDATE izone\.class_daily_snapshots[\s\S]*SET completed_sessions =/,
    );
    expect(migration).not.toMatch(/SET[\s\S]{0,200}progress_pct\s*=/);
  });
});

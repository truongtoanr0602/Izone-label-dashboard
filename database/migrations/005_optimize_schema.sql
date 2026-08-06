-- ============================================================
-- IZONE LABEL DASHBOARD — Schema Optimization Migration
-- Version: 1.1.0 | Date: 2026-08-06
-- Fixes: H2, H3, H4, M1, M3, M6, M7, M8, L1, L2
-- ============================================================

SET search_path TO izone, public;

-- ============================================================
-- FIX H3: Rename reserved keyword column `trigger` → `trigger_type`
-- ============================================================

ALTER TABLE contact_logs RENAME COLUMN "trigger" TO trigger_type;

-- Recreate the UNIQUE constraint with new column name
ALTER TABLE contact_logs DROP CONSTRAINT uq_contact_log;
ALTER TABLE contact_logs
  ADD CONSTRAINT uq_contact_log UNIQUE (student_id, class_id, trigger_type, checkpoint);


-- ============================================================
-- FIX H2: Change contact_id from SERIAL (INT) → BIGSERIAL (BIGINT)
-- for consistency with all other event/log tables
-- ============================================================

ALTER TABLE contact_logs
  ALTER COLUMN contact_id SET DATA TYPE BIGINT;


-- ============================================================
-- FIX H4: Fix GENERATED COLUMN progress_pct hardcoding 28 sessions
-- Add total_sessions to snapshot so generated column uses actual value
-- ============================================================

-- Must drop dependent views FIRST (they reference progress_pct)
DROP VIEW IF EXISTS v_class_latest CASCADE;
DROP VIEW IF EXISTS v_weekly_trend CASCADE;
DROP VIEW IF EXISTS v_monthly_trend CASCADE;

-- Drop the old generated column
ALTER TABLE class_daily_snapshots DROP COLUMN progress_pct;

-- Add total_sessions (denormalized from classes at snapshot time)
ALTER TABLE class_daily_snapshots
  ADD COLUMN total_sessions INTEGER NOT NULL DEFAULT 28;

-- Backfill total_sessions from classes table for existing data
UPDATE class_daily_snapshots s
SET total_sessions = c.total_sessions
FROM classes c
WHERE s.class_id = c.class_id;

-- Recreate the generated column using actual total_sessions
ALTER TABLE class_daily_snapshots
  ADD COLUMN progress_pct NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN completed_sessions > 0 THEN
      ROUND(completed_sessions * 100.0 / NULLIF(total_sessions, 0), 2)
    ELSE 0 END
  ) STORED;


-- ============================================================
-- FIX M1: Convert UUID-as-TEXT columns to native UUID type
-- Saves ~20 bytes per row, faster comparisons
-- ============================================================

-- label_change_logs.log_id
ALTER TABLE label_change_logs
  ALTER COLUMN log_id DROP DEFAULT;
ALTER TABLE label_change_logs
  ALTER COLUMN log_id SET DATA TYPE UUID USING log_id::uuid;
ALTER TABLE label_change_logs
  ALTER COLUMN log_id SET DEFAULT gen_random_uuid();

-- pass_reviews.review_id
ALTER TABLE pass_reviews
  ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE pass_reviews
  ALTER COLUMN review_id SET DATA TYPE UUID USING review_id::uuid;
ALTER TABLE pass_reviews
  ALTER COLUMN review_id SET DEFAULT gen_random_uuid();

-- system_logs.log_id
ALTER TABLE system_logs
  ALTER COLUMN log_id DROP DEFAULT;
ALTER TABLE system_logs
  ALTER COLUMN log_id SET DATA TYPE UUID USING log_id::uuid;
ALTER TABLE system_logs
  ALTER COLUMN log_id SET DEFAULT gen_random_uuid();


-- ============================================================
-- FIX M3: Add UNIQUE constraint for system_logs.log_id
-- (label_change_logs and pass_reviews already have it)
-- ============================================================

ALTER TABLE system_logs
  ADD CONSTRAINT uq_syslog_id UNIQUE (log_id);


-- ============================================================
-- FIX M6 + L1 + L2: Replace Vietnamese strings with English codes
-- in CHECK constraints and default values
-- ============================================================

-- class_daily_snapshots.health_status
ALTER TABLE class_daily_snapshots
  DROP CONSTRAINT IF EXISTS class_daily_snapshots_health_status_check;

UPDATE class_daily_snapshots SET health_status = 'normal'   WHERE health_status = 'Bình thường';
UPDATE class_daily_snapshots SET health_status = 'watch'    WHERE health_status = 'Cần theo dõi';
UPDATE class_daily_snapshots SET health_status = 'critical' WHERE health_status = 'Xử lý gấp';

ALTER TABLE class_daily_snapshots
  ADD CONSTRAINT class_daily_snapshots_health_status_check
  CHECK (health_status IN ('normal', 'watch', 'critical'));
ALTER TABLE class_daily_snapshots
  ALTER COLUMN health_status SET DEFAULT 'normal';

-- students.target_output_status
UPDATE students SET target_output_status = 'not_passed'  WHERE target_output_status = 'Chưa đạt';
UPDATE students SET target_output_status = 'passed'      WHERE target_output_status = 'Đã đạt';

ALTER TABLE students
  ALTER COLUMN target_output_status SET DEFAULT 'not_passed';

-- students.registration_status — already English, no change needed

-- pass_reviews.review_status
ALTER TABLE pass_reviews
  DROP CONSTRAINT IF EXISTS pass_reviews_review_status_check;

UPDATE pass_reviews SET review_status = 'pending_teacher'  WHERE review_status = 'Chờ GV';
UPDATE pass_reviews SET review_status = 'teacher_approved' WHERE review_status = 'GV Đồng ý';
UPDATE pass_reviews SET review_status = 'teacher_rejected' WHERE review_status = 'GV Từ chối';
UPDATE pass_reviews SET review_status = 'escalated_lead'   WHERE review_status = 'Quá hạn → Lead';

ALTER TABLE pass_reviews
  ADD CONSTRAINT pass_reviews_review_status_check
  CHECK (review_status IN ('pending_teacher', 'teacher_approved', 'teacher_rejected', 'escalated_lead'));
ALTER TABLE pass_reviews
  ALTER COLUMN review_status SET DEFAULT 'pending_teacher';

-- pass_reviews.pass_mem_group — keep Vietnamese for now (business domain terms)

-- student_daily_records.pass_chuan_status
UPDATE student_daily_records SET pass_chuan_status = 'no_data' WHERE pass_chuan_status = 'Chưa đủ DL';
-- (Other values can be migrated as they appear in production data)

-- ============================================================
-- FIX M7: Add missing index on teachers.khoi_id
-- (Used in nearly every lead-level query via JOINs)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_teachers_khoi ON teachers(khoi_id);


-- ============================================================
-- FIX M8: Create master table for khoi (blocks)
-- ============================================================

CREATE TABLE IF NOT EXISTS khoi (
    khoi_id    INTEGER PRIMARY KEY,
    khoi_name  VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE khoi IS 'Danh sách khối giảng dạy';

-- Seed existing khoi
INSERT INTO khoi (khoi_id, khoi_name) VALUES (34, 'Khối 34')
ON CONFLICT (khoi_id) DO NOTHING;

-- Add FK constraint
ALTER TABLE teachers
  ADD CONSTRAINT fk_teachers_khoi
  FOREIGN KEY (khoi_id) REFERENCES khoi(khoi_id);


-- ============================================================
-- Recreate affected VIEWS (they reference columns that changed)
-- ============================================================

-- v_class_latest: include total_sessions from snapshot
CREATE OR REPLACE VIEW v_class_latest AS
SELECT DISTINCT ON (s.class_id)
    c.class_id, c.class_name, c.course_id,
    t.teacher_id, t.teacher_name, t.teacher_email,
    c.status, c.schedule, c.location,
    c.opening_date, c.ending_date, c.total_sessions,
    s.completed_sessions, s.progress_pct, s.total_sessions AS snapshot_total_sessions,
    s.active_students, s.on_hold_students,
    s.dropped_students, s.transferred_students,
    s.attendance_avg, s.homework_avg,
    s.pass_chuan_rate, s.pass_mem_rate,
    s.label_yellow, s.label_red, s.label_grey, s.label_no_data,
    s.risk_pct, s.is_alarm_triggered, s.health_status,
    s.snapshot_date, s.scraped_at
FROM class_daily_snapshots s
JOIN classes c ON c.class_id = s.class_id
JOIN teachers t ON t.teacher_id = c.teacher_id
ORDER BY s.class_id, s.snapshot_date DESC;

COMMENT ON VIEW v_class_latest IS 'Trạng thái mới nhất của mỗi lớp — thay thế Sheet 01';

-- v_student_latest (unchanged from original)
CREATE OR REPLACE VIEW v_student_latest AS
SELECT DISTINCT ON (r.student_id)
    st.student_id, st.student_code, st.full_name,
    st.phone, st.email, st.class_id,
    c.class_name, st.registration_status,
    r.record_date,
    r.attendance_pct, r.attendance_present, r.attendance_total,
    r.homework_pct, r.homework_done, r.homework_total,
    r.test_1, r.test_2, r.test_3, r.test_4, r.test_5, r.test_6,
    r.tests_taken, r.test_average,
    r.current_label, r.previous_label, r.benchmark_label,
    r.has_label_changed, r.label_change_direction,
    r.pass_chuan_status, r.pass_mem_status, r.pass_mem_group,
    r.flag_attendance_drop, r.flag_homework_drop,
    r.flag_cheating, r.flag_needs_review,
    r.teacher_note, r.teacher_temp_label
FROM student_daily_records r
JOIN students st ON st.student_id = r.student_id
JOIN classes c ON c.class_id = st.class_id
ORDER BY r.student_id, r.record_date DESC;

COMMENT ON VIEW v_student_latest IS 'Trạng thái mới nhất của mỗi HV — thay thế Sheet 02';

-- v_weekly_trend (unchanged from original)
CREATE OR REPLACE VIEW v_weekly_trend AS
SELECT
    class_id,
    DATE_TRUNC('week', snapshot_date)::date AS week_start,
    ROUND(AVG(attendance_avg), 2)           AS avg_attendance,
    ROUND(AVG(homework_avg), 2)             AS avg_homework,
    ROUND(AVG(pass_chuan_rate), 2)          AS avg_pass_chuan,
    ROUND(AVG(pass_mem_rate), 2)            AS avg_pass_mem,
    ROUND(AVG(risk_pct), 2)                 AS avg_risk,
    COUNT(*)                                AS days_in_week
FROM class_daily_snapshots
GROUP BY class_id, DATE_TRUNC('week', snapshot_date)
ORDER BY class_id, week_start;

COMMENT ON VIEW v_weekly_trend IS 'Biểu đồ trend theo tuần — aggregate từ daily snapshots';

-- v_monthly_trend (unchanged from original)
CREATE OR REPLACE VIEW v_monthly_trend AS
SELECT
    class_id,
    DATE_TRUNC('month', snapshot_date)::date AS month_start,
    ROUND(AVG(attendance_avg), 2)            AS avg_attendance,
    ROUND(AVG(homework_avg), 2)              AS avg_homework,
    ROUND(AVG(pass_chuan_rate), 2)           AS avg_pass_chuan,
    ROUND(AVG(pass_mem_rate), 2)             AS avg_pass_mem,
    ROUND(AVG(risk_pct), 2)                  AS avg_risk,
    COUNT(*)                                 AS days_in_month
FROM class_daily_snapshots
GROUP BY class_id, DATE_TRUNC('month', snapshot_date)
ORDER BY class_id, month_start;

COMMENT ON VIEW v_monthly_trend IS 'Biểu đồ trend theo tháng — aggregate từ daily snapshots';


-- ============================================================
-- DONE — Migration 005 complete
-- ============================================================

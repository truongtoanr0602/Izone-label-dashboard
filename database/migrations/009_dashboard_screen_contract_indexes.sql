-- ============================================================
-- IZONE LABEL DASHBOARD — Screen-contract query indexes
-- Migration 009 | Date: 2026-08-12
-- ============================================================

SET search_path TO izone, public;

CREATE INDEX IF NOT EXISTS idx_classes_course_status_teacher
  ON classes(course_id, status, teacher_id);

CREATE INDEX IF NOT EXISTS idx_student_records_class_date_student
  ON student_daily_records(class_id, record_date DESC, student_id);

CREATE INDEX IF NOT EXISTS idx_pass_reviews_class_status_deadline
  ON pass_reviews(class_id, review_status, deadline);

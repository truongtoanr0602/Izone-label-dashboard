-- Normalize class progress for supported courses from cumulative student evidence.
-- The audit makes the write recoverable; rerunning after success is idempotent.

SET search_path TO izone, public;

-- Preview every value that would change.
WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.class_id,
        c.class_name,
        c.course_id,
        s.snapshot_date,
        s.completed_sessions AS old_completed_sessions,
        s.total_sessions AS old_total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions,
        c.total_sessions AS derived_total_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
     AND r.snapshot_stage IS NULL
    WHERE c.course_id IN (1, 2, 3)
    GROUP BY s.id, s.class_id, c.class_name, c.course_id, s.snapshot_date,
             s.completed_sessions, s.total_sessions, c.total_sessions
)
SELECT *,
       derived_completed_sessions - old_completed_sessions AS completed_delta,
       derived_total_sessions - old_total_sessions AS total_delta
FROM snapshot_evidence
WHERE old_completed_sessions IS DISTINCT FROM derived_completed_sessions
   OR old_total_sessions IS DISTINCT FROM derived_total_sessions
ORDER BY course_id, class_id, snapshot_date;

BEGIN;

CREATE TABLE IF NOT EXISTS izone.class_snapshot_progress_repair_20260824 (
    snapshot_id BIGINT PRIMARY KEY,
    class_id INTEGER NOT NULL,
    class_name VARCHAR(20) NOT NULL,
    course_id INTEGER NOT NULL,
    snapshot_date DATE NOT NULL,
    old_completed_sessions INTEGER NOT NULL,
    new_completed_sessions INTEGER NOT NULL,
    old_total_sessions INTEGER NOT NULL,
    new_total_sessions INTEGER NOT NULL,
    backed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.class_id,
        c.class_name,
        c.course_id,
        s.snapshot_date,
        s.completed_sessions AS old_completed_sessions,
        s.total_sessions AS old_total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions,
        c.total_sessions AS derived_total_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
     AND r.snapshot_stage IS NULL
    WHERE c.course_id IN (1, 2, 3)
    GROUP BY s.id, s.class_id, c.class_name, c.course_id, s.snapshot_date,
             s.completed_sessions, s.total_sessions, c.total_sessions
), mismatches AS (
    SELECT *
    FROM snapshot_evidence
    WHERE old_completed_sessions IS DISTINCT FROM derived_completed_sessions
       OR old_total_sessions IS DISTINCT FROM derived_total_sessions
)
INSERT INTO izone.class_snapshot_progress_repair_20260824 (
    snapshot_id, class_id, class_name, course_id, snapshot_date,
    old_completed_sessions, new_completed_sessions,
    old_total_sessions, new_total_sessions
)
SELECT
    snapshot_id, class_id, class_name, course_id, snapshot_date,
    old_completed_sessions, derived_completed_sessions,
    old_total_sessions, derived_total_sessions
FROM mismatches
ON CONFLICT (snapshot_id) DO NOTHING;

WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.completed_sessions AS old_completed_sessions,
        s.total_sessions AS old_total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions,
        c.total_sessions AS derived_total_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
     AND r.snapshot_stage IS NULL
    WHERE c.course_id IN (1, 2, 3)
    GROUP BY s.id, s.completed_sessions, s.total_sessions, c.total_sessions
), candidates AS (
    SELECT evidence.*
    FROM snapshot_evidence evidence
    JOIN izone.class_snapshot_progress_repair_20260824 audit
      ON audit.snapshot_id = evidence.snapshot_id
     AND audit.old_completed_sessions = evidence.old_completed_sessions
     AND audit.new_completed_sessions = evidence.derived_completed_sessions
     AND audit.old_total_sessions = evidence.old_total_sessions
     AND audit.new_total_sessions = evidence.derived_total_sessions
    WHERE evidence.old_completed_sessions IS DISTINCT FROM
          evidence.derived_completed_sessions
       OR evidence.old_total_sessions IS DISTINCT FROM
          evidence.derived_total_sessions
)
UPDATE izone.class_daily_snapshots AS snapshots
SET completed_sessions = candidates.derived_completed_sessions,
    total_sessions = candidates.derived_total_sessions
FROM candidates
WHERE snapshots.id = candidates.snapshot_id
RETURNING snapshots.id, snapshots.class_id, snapshots.snapshot_date,
          snapshots.completed_sessions, snapshots.total_sessions,
          snapshots.progress_pct;

COMMIT;

-- Postcondition: both counts must match their evidence-backed values.
WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.completed_sessions,
        s.total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions,
        c.total_sessions AS derived_total_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
     AND r.snapshot_stage IS NULL
    WHERE c.course_id IN (1, 2, 3)
    GROUP BY s.id, s.completed_sessions, s.total_sessions, c.total_sessions
)
SELECT COUNT(*) AS remaining_evidence_backed_mismatches
FROM snapshot_evidence
WHERE completed_sessions IS DISTINCT FROM derived_completed_sessions
   OR total_sessions IS DISTINCT FROM derived_total_sessions;

SELECT COUNT(*) AS audited_snapshots,
       COUNT(DISTINCT class_id) AS affected_classes
FROM izone.class_snapshot_progress_repair_20260824;

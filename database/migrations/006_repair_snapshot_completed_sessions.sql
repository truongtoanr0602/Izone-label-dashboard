-- Repair historical class progress from cumulative student evidence.
-- Safe to preview repeatedly. The write section is audited and idempotent.

-- Preview evidence-backed mismatches before any write.
WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.class_id,
        c.class_name,
        s.snapshot_date,
        s.completed_sessions AS old_completed_sessions,
        c.total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
    GROUP BY s.id, s.class_id, c.class_name, s.snapshot_date,
             s.completed_sessions, c.total_sessions
)
SELECT
    snapshot_id,
    class_id,
    class_name,
    snapshot_date,
    old_completed_sessions,
    derived_completed_sessions,
    total_sessions,
    derived_completed_sessions - old_completed_sessions AS delta
FROM snapshot_evidence
WHERE old_completed_sessions IS DISTINCT FROM derived_completed_sessions
ORDER BY class_id, snapshot_date;

-- Report snapshots that have no student evidence on or before their date.
SELECT s.id AS snapshot_id, s.class_id, c.class_name, s.snapshot_date,
       s.completed_sessions
FROM izone.class_daily_snapshots s
JOIN izone.classes c ON c.class_id = s.class_id
WHERE NOT EXISTS (
    SELECT 1
    FROM izone.student_daily_records r
    WHERE r.class_id = s.class_id
      AND r.record_date <= s.snapshot_date
)
ORDER BY s.class_id, s.snapshot_date;

BEGIN;

CREATE TABLE IF NOT EXISTS izone.class_snapshot_progress_repair_20260817 (
    snapshot_id BIGINT PRIMARY KEY,
    class_id INTEGER NOT NULL,
    class_name VARCHAR(20) NOT NULL,
    snapshot_date DATE NOT NULL,
    old_completed_sessions INTEGER NOT NULL,
    new_completed_sessions INTEGER NOT NULL,
    total_sessions INTEGER NOT NULL,
    backed_up_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.class_id,
        c.class_name,
        s.snapshot_date,
        s.completed_sessions AS old_completed_sessions,
        c.total_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
    GROUP BY s.id, s.class_id, c.class_name, s.snapshot_date,
             s.completed_sessions, c.total_sessions
), mismatches AS (
    SELECT *
    FROM snapshot_evidence
    WHERE old_completed_sessions IS DISTINCT FROM derived_completed_sessions
)
INSERT INTO izone.class_snapshot_progress_repair_20260817 (
    snapshot_id,
    class_id,
    class_name,
    snapshot_date,
    old_completed_sessions,
    new_completed_sessions,
    total_sessions
)
SELECT
    snapshot_id,
    class_id,
    class_name,
    snapshot_date,
    old_completed_sessions,
    derived_completed_sessions,
    total_sessions
FROM mismatches
ON CONFLICT (snapshot_id) DO NOTHING;

WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.completed_sessions AS old_completed_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
    GROUP BY s.id, s.completed_sessions, c.total_sessions
), candidates AS (
    SELECT evidence.snapshot_id, evidence.derived_completed_sessions
    FROM snapshot_evidence evidence
    JOIN izone.class_snapshot_progress_repair_20260817 audit
      ON audit.snapshot_id = evidence.snapshot_id
     AND audit.old_completed_sessions = evidence.old_completed_sessions
     AND audit.new_completed_sessions = evidence.derived_completed_sessions
    WHERE evidence.old_completed_sessions IS DISTINCT FROM
          evidence.derived_completed_sessions
)
UPDATE izone.class_daily_snapshots AS snapshots
SET completed_sessions = candidates.derived_completed_sessions
FROM candidates
WHERE snapshots.id = candidates.snapshot_id
RETURNING snapshots.id, snapshots.class_id, snapshots.snapshot_date,
          snapshots.completed_sessions, snapshots.progress_pct;

COMMIT;

-- Postcondition: this must return zero evidence-backed mismatches.
WITH snapshot_evidence AS (
    SELECT
        s.id AS snapshot_id,
        s.completed_sessions,
        LEAST(c.total_sessions, GREATEST(
            COALESCE(MAX(r.attendance_total), 0),
            COALESCE(MAX(r.homework_total), 0),
            0
        )) AS derived_completed_sessions
    FROM izone.class_daily_snapshots s
    JOIN izone.classes c ON c.class_id = s.class_id
    JOIN izone.student_daily_records r
      ON r.class_id = s.class_id
     AND r.record_date <= s.snapshot_date
    GROUP BY s.id, s.completed_sessions, c.total_sessions
)
SELECT COUNT(*) AS remaining_evidence_backed_mismatches
FROM snapshot_evidence
WHERE completed_sessions IS DISTINCT FROM derived_completed_sessions;

SELECT COUNT(*) AS audited_snapshots,
       COUNT(DISTINCT class_id) AS affected_classes
FROM izone.class_snapshot_progress_repair_20260817;

SELECT s.class_id, c.class_name, s.snapshot_date, s.completed_sessions,
       s.total_sessions, s.progress_pct
FROM izone.class_daily_snapshots s
JOIN izone.classes c ON c.class_id = s.class_id
WHERE s.class_id = 1104
  AND s.snapshot_date <= DATE '2026-07-31'
ORDER BY s.snapshot_date DESC
LIMIT 1;

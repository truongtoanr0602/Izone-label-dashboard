-- Allow one authenticated account (especially a Lead) to access multiple khoi.
-- teachers.khoi_id remains the transitional primary/fallback assignment.

SET search_path TO izone, public;

CREATE TABLE IF NOT EXISTS teacher_khoi_assignments (
    teacher_id INTEGER NOT NULL,
    khoi_id INTEGER NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_teacher_khoi_assignments PRIMARY KEY (teacher_id, khoi_id),
    CONSTRAINT fk_teacher_khoi_teacher
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    CONSTRAINT fk_teacher_khoi_khoi
        FOREIGN KEY (khoi_id) REFERENCES khoi(khoi_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_teacher_khoi_primary
    ON teacher_khoi_assignments (teacher_id)
    WHERE is_primary = TRUE;

CREATE INDEX IF NOT EXISTS idx_teacher_khoi_assignments_khoi
    ON teacher_khoi_assignments (khoi_id, teacher_id);

INSERT INTO teacher_khoi_assignments (teacher_id, khoi_id, is_primary)
SELECT teacher_id, khoi_id, TRUE
FROM teachers
WHERE khoi_id IS NOT NULL
ON CONFLICT (teacher_id, khoi_id) DO NOTHING;

COMMENT ON TABLE teacher_khoi_assignments IS
    'Authorized khoi scopes per authenticated teacher/lead account.';

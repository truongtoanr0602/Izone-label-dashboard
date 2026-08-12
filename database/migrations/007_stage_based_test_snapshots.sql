-- Stage-based historical test snapshots.
-- Run after 005_historical_test_snapshots.sql.
-- snapshot_stage is the business progression key; record_date is ingestion date.

ALTER TABLE izone.student_daily_records
  ADD COLUMN IF NOT EXISTS snapshot_stage integer,
  ADD COLUMN IF NOT EXISTS test_7 numeric,
  ADD COLUMN IF NOT EXISTS test_8 numeric;

ALTER TABLE izone.student_daily_records
  DROP CONSTRAINT IF EXISTS uq_student_record;

ALTER TABLE izone.student_daily_records
  DROP CONSTRAINT IF EXISTS ck_student_daily_snapshot_stage;

ALTER TABLE izone.student_daily_records
  ADD CONSTRAINT ck_student_daily_snapshot_stage
  CHECK (snapshot_stage IS NULL OR snapshot_stage BETWEEN 1 AND 8);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'uq_student_stage'
      AND conrelid = 'izone.student_daily_records'::regclass
  ) THEN
    ALTER TABLE izone.student_daily_records
      ADD CONSTRAINT uq_student_stage
      UNIQUE (student_id, class_id, snapshot_stage);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_student_daily_stage
  ON izone.student_daily_records (student_id, class_id, snapshot_stage);

CREATE OR REPLACE FUNCTION izone.refresh_student_stage_snapshot(
  p_student_id integer,
  p_class_id integer,
  p_snapshot_stage integer
)
RETURNS TABLE (
  record_id bigint,
  student_id integer,
  class_id integer,
  record_date date,
  snapshot_stage integer,
  tests_taken integer,
  test_average numeric,
  current_label varchar,
  previous_label varchar,
  has_label_changed boolean,
  label_change_direction varchar
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_test_1 numeric;
  v_test_2 numeric;
  v_test_3 numeric;
  v_test_4 numeric;
  v_test_5 numeric;
  v_test_6 numeric;
  v_test_7 numeric;
  v_test_8 numeric;
  v_tests_taken integer;
  v_average numeric;
  v_current_label varchar;
  v_previous_label varchar;
  v_direction varchar;
  v_changed boolean;
  v_teacher_id integer;
  v_scraped_at timestamptz := now();
BEGIN
  IF p_snapshot_stage IS NULL OR p_snapshot_stage < 1 OR p_snapshot_stage > 8 THEN
    RAISE EXCEPTION 'snapshot_stage must be between 1 and 8, got %', p_snapshot_stage;
  END IF;

  WITH eligible AS (
    SELECT DISTINCT ON (ts.test_order)
      ts.test_order,
      ts.final_score
    FROM izone.test_scores ts
    WHERE ts.student_id = p_student_id
      AND ts.class_id = p_class_id
      AND ts.test_order BETWEEN 1 AND p_snapshot_stage
      AND ts.final_score IS NOT NULL
    ORDER BY ts.test_order, ts.is_makeup DESC, ts.id DESC
  )
  SELECT
    MAX(final_score) FILTER (WHERE test_order = 1),
    MAX(final_score) FILTER (WHERE test_order = 2),
    MAX(final_score) FILTER (WHERE test_order = 3),
    MAX(final_score) FILTER (WHERE test_order = 4),
    MAX(final_score) FILTER (WHERE test_order = 5),
    MAX(final_score) FILTER (WHERE test_order = 6),
    MAX(final_score) FILTER (WHERE test_order = 7),
    MAX(final_score) FILTER (WHERE test_order = 8),
    COUNT(*)::integer,
    ROUND(AVG(final_score), 2)
  INTO v_test_1, v_test_2, v_test_3, v_test_4, v_test_5, v_test_6,
       v_test_7, v_test_8, v_tests_taken, v_average
  FROM eligible;

  v_current_label := izone.label_from_average(v_average);

  SELECT sdr.current_label
  INTO v_previous_label
  FROM izone.student_daily_records sdr
  WHERE sdr.student_id = p_student_id
    AND sdr.class_id = p_class_id
    AND sdr.snapshot_stage < p_snapshot_stage
  ORDER BY sdr.snapshot_stage DESC
  LIMIT 1;

  v_changed := v_previous_label IS NOT NULL
    AND v_previous_label IN ('grey', 'red', 'yellow')
    AND v_current_label IN ('grey', 'red', 'yellow')
    AND v_previous_label <> v_current_label;

  v_direction := CASE
    WHEN NOT v_changed THEN 'same'
    WHEN (CASE v_current_label WHEN 'grey' THEN 0 WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 END)
       > (CASE v_previous_label WHEN 'grey' THEN 0 WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 END)
      THEN 'up'
    ELSE 'down'
  END;

  INSERT INTO izone.student_daily_records (
    student_id, class_id, record_date, snapshot_stage,
    test_1, test_2, test_3, test_4, test_5, test_6, test_7, test_8,
    tests_taken, test_average, current_label, previous_label,
    benchmark_label, has_label_changed, label_change_direction,
    last_checkpoint, scraped_at
  ) VALUES (
    p_student_id, p_class_id, CURRENT_DATE, p_snapshot_stage,
    v_test_1, v_test_2, v_test_3, v_test_4, v_test_5, v_test_6, v_test_7, v_test_8,
    v_tests_taken, v_average, v_current_label, v_previous_label,
    v_current_label, v_changed, v_direction,
    ('stage:' || p_snapshot_stage::text), v_scraped_at
  )
  ON CONFLICT ON CONSTRAINT uq_student_stage DO UPDATE SET
    record_date = EXCLUDED.record_date,
    test_1 = EXCLUDED.test_1,
    test_2 = EXCLUDED.test_2,
    test_3 = EXCLUDED.test_3,
    test_4 = EXCLUDED.test_4,
    test_5 = EXCLUDED.test_5,
    test_6 = EXCLUDED.test_6,
    test_7 = EXCLUDED.test_7,
    test_8 = EXCLUDED.test_8,
    tests_taken = EXCLUDED.tests_taken,
    test_average = EXCLUDED.test_average,
    current_label = EXCLUDED.current_label,
    previous_label = EXCLUDED.previous_label,
    benchmark_label = EXCLUDED.benchmark_label,
    has_label_changed = EXCLUDED.has_label_changed,
    label_change_direction = EXCLUDED.label_change_direction,
    last_checkpoint = EXCLUDED.last_checkpoint,
    scraped_at = EXCLUDED.scraped_at
  RETURNING id INTO record_id;

  IF v_changed THEN
    SELECT c.teacher_id INTO v_teacher_id
    FROM izone.classes c
    WHERE c.class_id = p_class_id;

    IF v_teacher_id IS NOT NULL AND NOT EXISTS (
      SELECT 1
      FROM izone.label_change_logs lcl
      WHERE lcl.student_id = p_student_id
        AND lcl.class_id = p_class_id
        AND lcl.checkpoint = ('stage:' || p_snapshot_stage::text)
    ) THEN
      INSERT INTO izone.label_change_logs (
        student_id, class_id, teacher_id, from_label, to_label,
        direction, severity, step_count, checkpoint, created_at
      ) VALUES (
        p_student_id, p_class_id, v_teacher_id, v_previous_label, v_current_label,
        v_direction,
        CASE
          WHEN v_direction = 'up' THEN 'recovery'
          WHEN v_previous_label = 'yellow' AND v_current_label = 'red' THEN 'warning'
          WHEN v_previous_label = 'red' AND v_current_label = 'grey' THEN 'serious'
          WHEN v_previous_label = 'yellow' AND v_current_label = 'grey' THEN 'critical'
          ELSE 'warning'
        END,
        ABS(
          (CASE v_current_label WHEN 'grey' THEN 0 WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 END) -
          (CASE v_previous_label WHEN 'grey' THEN 0 WHEN 'red' THEN 1 WHEN 'yellow' THEN 2 END)
        ),
        ('stage:' || p_snapshot_stage::text),
        now()
      );
    END IF;
  END IF;

  student_id := p_student_id;
  class_id := p_class_id;
  record_date := CURRENT_DATE;
  snapshot_stage := p_snapshot_stage;
  tests_taken := v_tests_taken;
  test_average := v_average;
  current_label := v_current_label;
  previous_label := v_previous_label;
  has_label_changed := v_changed;
  label_change_direction := v_direction;
  RETURN NEXT;
END;
$$;

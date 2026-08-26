SET search_path TO izone, public;

INSERT INTO khoi (khoi_id, khoi_name) VALUES
  (1, 'Khối 03'),
  (2, 'Khối 3-4'),
  (3, 'Khối 4-5')
ON CONFLICT (khoi_id) DO UPDATE SET khoi_name = EXCLUDED.khoi_name;

UPDATE teachers
SET khoi_id = 2
WHERE khoi_id = 34;

ALTER TABLE teachers
  ALTER COLUMN khoi_id SET DEFAULT 2;

COMMENT ON COLUMN teachers.khoi_id IS
  'Khối phụ trách; ánh xạ một-một với classes.course_id: 1=03, 2=3-4, 3=4-5';

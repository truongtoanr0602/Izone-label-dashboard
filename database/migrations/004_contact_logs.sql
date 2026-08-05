CREATE TABLE izone.contact_logs (
    contact_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES izone.students(student_id),
    class_id INT NOT NULL REFERENCES izone.classes(class_id),
    teacher_id INT NOT NULL REFERENCES izone.teachers(teacher_id),
    channel VARCHAR(20) NOT NULL DEFAULT 'zalo',
    trigger VARCHAR(50) NOT NULL,
    checkpoint VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_contact_log UNIQUE (student_id, class_id, trigger, checkpoint)
);

CREATE INDEX idx_contact_logs_class ON izone.contact_logs(class_id);
CREATE INDEX idx_contact_logs_student ON izone.contact_logs(student_id);

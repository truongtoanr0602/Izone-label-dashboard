SET search_path TO izone, public;

CREATE TABLE message_templates (
    template_id BIGSERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('habit_reminder', 'red_followup', 'relearn_advice')),
    body TEXT NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 5000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_templates_teacher_trigger
    ON message_templates (teacher_id, trigger_type);

CREATE TRIGGER trg_message_templates_updated
    BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMENT ON TABLE message_templates IS 'Template tin nhan Zalo ca nhan cua giao vien';

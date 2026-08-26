-- ============================================================
-- IZONE LABEL DASHBOARD — PostgreSQL Schema
-- Version: 1.0.0 | Date: 2026-08-05
-- Architecture: Snapshot/Time-series for Daily Trend Tracking
-- ============================================================

-- Cleanup (dev only — bỏ dòng này khi lên production)
DROP SCHEMA IF EXISTS izone CASCADE;
CREATE SCHEMA izone;
SET search_path TO izone, public;

-- ============================================================
-- 1. MASTER TABLES (Dữ liệu tĩnh, hiếm thay đổi)
-- ============================================================

-- Sheet 08: Giáo viên
CREATE TABLE teachers (
    teacher_id    INTEGER PRIMARY KEY,
    teacher_name  VARCHAR(100)  NOT NULL,
    teacher_email VARCHAR(150)  NOT NULL UNIQUE,
    teacher_phone VARCHAR(20),
    khoi_id       INTEGER       NOT NULL DEFAULT 2,
    role          VARCHAR(20)   NOT NULL DEFAULT 'teacher'
                  CHECK (role IN ('teacher', 'lead', 'admin')),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE teachers IS 'Danh sách giáo viên và lead của khối (Sheet 08_GiaoVien)';

-- Sheet 01: Lớp học (chỉ metadata tĩnh)
CREATE TABLE classes (
    class_id       INTEGER PRIMARY KEY,
    class_name     VARCHAR(20)   NOT NULL UNIQUE,
    course_id      INTEGER       NOT NULL DEFAULT 2,
    teacher_id     INTEGER       NOT NULL REFERENCES teachers(teacher_id),
    lead_email     VARCHAR(150),
    status         VARCHAR(20)   NOT NULL DEFAULT 'on_going'
                   CHECK (status IN ('upcoming', 'on_going', 'completed')),
    schedule       VARCHAR(50),
    location       VARCHAR(100)  DEFAULT 'Online',
    opening_date   DATE          NOT NULL,
    ending_date    DATE,
    total_sessions INTEGER       NOT NULL DEFAULT 28,
    portal_url     VARCHAR(300),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_status  ON classes(status);

COMMENT ON TABLE classes IS 'Thông tin tĩnh của lớp học (Sheet 01_DanhSach_Lop — phần metadata)';

-- Sheet 02: Học viên (chỉ thông tin cá nhân)
CREATE TABLE students (
    student_id          INTEGER PRIMARY KEY,
    student_code        VARCHAR(20),
    full_name           VARCHAR(150)  NOT NULL,
    phone               VARCHAR(20),
    email               VARCHAR(200),
    class_id            INTEGER       NOT NULL REFERENCES classes(class_id),
    registration_status VARCHAR(20)   NOT NULL DEFAULT 'active'
                        CHECK (registration_status IN ('active', 'transferred', 'on_hold', 'dropped')),
    admitted_at         DATE,
    target_output_status VARCHAR(20)  DEFAULT 'Chưa đạt',
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_class    ON students(class_id);
CREATE INDEX idx_students_status   ON students(registration_status);
CREATE INDEX idx_students_class_status ON students(class_id, registration_status);

COMMENT ON TABLE students IS 'Thông tin cá nhân học viên (Sheet 02_DuLieu_HocVien — phần PII)';

-- ============================================================
-- 2. SNAPSHOT / TIME-SERIES TABLES
--    Đây là TRÁI TIM của bài toán trend.
--    Mỗi ngày n8n chạy → INSERT 1 row mới (không UPDATE)
--    → Dashboard query range để vẽ biểu đồ tuần/tháng.
-- ============================================================

-- Ảnh chụp tình trạng LỚP mỗi ngày
CREATE TABLE class_daily_snapshots (
    id                   BIGSERIAL PRIMARY KEY,
    class_id             INTEGER   NOT NULL REFERENCES classes(class_id),
    snapshot_date        DATE      NOT NULL,

    -- Tiến độ
    completed_sessions   INTEGER   NOT NULL DEFAULT 0,
    progress_pct         NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN completed_sessions > 0 THEN
            ROUND(completed_sessions * 100.0 / NULLIF(28, 0), 2)
        ELSE 0 END
    ) STORED,

    -- Sĩ số
    active_students      INTEGER   NOT NULL DEFAULT 0,
    on_hold_students     INTEGER   NOT NULL DEFAULT 0,
    dropped_students     INTEGER   NOT NULL DEFAULT 0,
    transferred_students INTEGER   NOT NULL DEFAULT 0,

    -- Chỉ số vận hành
    attendance_avg       NUMERIC(5,2),
    homework_avg         NUMERIC(5,2),

    -- Chỉ số đầu ra
    pass_chuan_rate      NUMERIC(5,2) DEFAULT 0,
    pass_mem_rate        NUMERIC(5,2) DEFAULT 0,

    -- Phân bố nhãn
    label_yellow         INTEGER   NOT NULL DEFAULT 0,
    label_red            INTEGER   NOT NULL DEFAULT 0,
    label_grey           INTEGER   NOT NULL DEFAULT 0,
    label_no_data        INTEGER   NOT NULL DEFAULT 0,

    -- Cảnh báo
    risk_pct             NUMERIC(5,2) DEFAULT 0,
    is_alarm_triggered   BOOLEAN   NOT NULL DEFAULT FALSE,
    health_status        VARCHAR(30) DEFAULT 'Bình thường'
                         CHECK (health_status IN ('Bình thường', 'Cần theo dõi', 'Xử lý gấp')),

    -- Metadata
    scraped_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- BẮT BUỘC: Mỗi lớp chỉ có 1 snapshot/ngày
    CONSTRAINT uq_class_snapshot UNIQUE (class_id, snapshot_date)
);

-- Index phục vụ query trend: WHERE class_id = ? AND snapshot_date BETWEEN ? AND ?
CREATE INDEX idx_class_snap_date ON class_daily_snapshots(class_id, snapshot_date DESC);
-- Index cho query toàn khối: WHERE snapshot_date = ?
CREATE INDEX idx_class_snap_by_date ON class_daily_snapshots(snapshot_date);

COMMENT ON TABLE class_daily_snapshots IS
    'Ảnh chụp hàng ngày tình trạng lớp — nguồn dữ liệu cho biểu đồ trend tuần/tháng';

-- Ảnh chụp tình trạng HỌC VIÊN mỗi ngày
CREATE TABLE student_daily_records (
    id                       BIGSERIAL PRIMARY KEY,
    student_id               INTEGER   NOT NULL REFERENCES students(student_id),
    class_id                 INTEGER   NOT NULL REFERENCES classes(class_id),
    record_date              DATE      NOT NULL,

    -- Chuyên cần
    attendance_pct           NUMERIC(5,2),
    attendance_present       INTEGER   DEFAULT 0,
    attendance_total         INTEGER   DEFAULT 0,

    -- BTVN
    homework_pct             NUMERIC(5,2),
    homework_done            INTEGER   DEFAULT 0,
    homework_total           INTEGER   DEFAULT 0,

    -- Điểm test (denormalized cho read performance)
    test_1  NUMERIC(5,2), test_2  NUMERIC(5,2), test_3  NUMERIC(5,2),
    test_4  NUMERIC(5,2), test_5  NUMERIC(5,2), test_6  NUMERIC(5,2),
    tests_taken              INTEGER   DEFAULT 0,
    test_average             NUMERIC(5,2),

    -- Nhãn
    current_label            VARCHAR(20),
    previous_label           VARCHAR(20),
    benchmark_label          VARCHAR(20),
    has_label_changed        BOOLEAN   DEFAULT FALSE,
    label_change_direction   VARCHAR(10) CHECK (label_change_direction IN ('up', 'down', 'same')),
    last_checkpoint          VARCHAR(20),

    -- Pass
    pass_chuan_status        VARCHAR(50),
    pass_chuan_reasons       TEXT,
    pass_mem_status          VARCHAR(50),
    pass_mem_group           VARCHAR(20),
    pass_mem_label           VARCHAR(100),

    -- Flags cảnh báo
    flag_attendance_drop     BOOLEAN   DEFAULT FALSE,
    flag_homework_drop       BOOLEAN   DEFAULT FALSE,
    flag_cheating            BOOLEAN   DEFAULT FALSE,
    flag_needs_review        BOOLEAN   DEFAULT FALSE,

    -- Feedback từ GV
    teacher_feedback_btvn    TEXT,
    teacher_feedback_orient  TEXT,
    teacher_note             TEXT,
    teacher_temp_label       VARCHAR(20),

    -- Metadata
    scraped_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- BẮT BUỘC: Mỗi HV chỉ có 1 record/ngày
    CONSTRAINT uq_student_record UNIQUE (student_id, record_date)
);

-- Index chính: query theo HV + time range
CREATE INDEX idx_student_rec_date ON student_daily_records(student_id, record_date DESC);
-- Index: query tất cả HV của 1 lớp trong 1 ngày
CREATE INDEX idx_student_rec_class ON student_daily_records(class_id, record_date);
-- Index: filter theo nhãn
CREATE INDEX idx_student_rec_label ON student_daily_records(current_label, record_date);

COMMENT ON TABLE student_daily_records IS
    'Ảnh chụp hàng ngày tình trạng học viên — cho phân tích biến động cá nhân';

-- ============================================================
-- 3. EVENT LOG TABLES (Immutable — chỉ INSERT, không UPDATE)
-- ============================================================

-- Sheet 03: Điểm test chi tiết
CREATE TABLE test_scores (
    id               BIGSERIAL PRIMARY KEY,
    student_id       INTEGER      NOT NULL REFERENCES students(student_id),
    class_id         INTEGER      NOT NULL REFERENCES classes(class_id),
    test_order       INTEGER      NOT NULL CHECK (test_order BETWEEN 1 AND 6),
    test_name        VARCHAR(30)  NOT NULL,
    raw_score        NUMERIC(5,2),
    max_score        NUMERIC(5,2) DEFAULT 100,
    grade_percent    NUMERIC(5,2),
    is_makeup        BOOLEAN      NOT NULL DEFAULT FALSE,
    makeup_score     NUMERIC(5,2),
    final_score      NUMERIC(5,2),
    grade_status     VARCHAR(20)  DEFAULT 'confirmed',
    is_cheating      BOOLEAN      NOT NULL DEFAULT FALSE,
    grade_note       TEXT,
    label_at_time    VARCHAR(20),
    scraped_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- Mỗi HV chỉ có 1 điểm gốc cho mỗi test (thi lại thì is_makeup=TRUE)
    CONSTRAINT uq_test_score UNIQUE (student_id, class_id, test_order, is_makeup)
);

CREATE INDEX idx_test_student ON test_scores(student_id);
CREATE INDEX idx_test_class   ON test_scores(class_id, test_order);

COMMENT ON TABLE test_scores IS 'Điểm test chi tiết — source of truth (Sheet 03_DiemTest_ChiTiet)';

-- Sheet 04: Nhật ký chuyển nhãn
CREATE TABLE label_change_logs (
    id                 BIGSERIAL PRIMARY KEY,
    log_id             VARCHAR(36)  NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
    student_id         INTEGER      NOT NULL REFERENCES students(student_id),
    class_id           INTEGER      NOT NULL REFERENCES classes(class_id),
    teacher_id         INTEGER      NOT NULL REFERENCES teachers(teacher_id),
    from_label         VARCHAR(20)  NOT NULL,
    to_label           VARCHAR(20)  NOT NULL,
    direction          VARCHAR(10)  NOT NULL CHECK (direction IN ('up', 'down')),
    severity           VARCHAR(20)  CHECK (severity IN ('recovery', 'warning', 'serious', 'critical')),
    step_count         INTEGER      DEFAULT 1,
    reason             TEXT,
    checkpoint         VARCHAR(20),
    test_average_after NUMERIC(5,2),
    attendance_pct     NUMERIC(5,2),
    homework_pct       NUMERIC(5,2),
    email_sent         BOOLEAN      DEFAULT FALSE,
    email_sent_at      TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_label_log_student ON label_change_logs(student_id, created_at DESC);
CREATE INDEX idx_label_log_class   ON label_change_logs(class_id, created_at DESC);

COMMENT ON TABLE label_change_logs IS 'Nhật ký chuyển nhãn — immutable log (Sheet 04_NhatKy_ChuyenNhan)';

-- ============================================================
-- 4. TRANSACTION TABLE
-- ============================================================

-- Sheet 05: Xét duyệt Pass mềm
CREATE TABLE pass_reviews (
    id                BIGSERIAL PRIMARY KEY,
    review_id         VARCHAR(36)  NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
    student_id        INTEGER      NOT NULL REFERENCES students(student_id),
    class_id          INTEGER      NOT NULL REFERENCES classes(class_id),
    teacher_id        INTEGER      NOT NULL REFERENCES teachers(teacher_id),
    pass_mem_group    VARCHAR(20)  NOT NULL CHECK (pass_mem_group IN ('Nhóm 1', 'Nhóm 2', 'Nhóm 3')),
    test_average      NUMERIC(5,2) NOT NULL,
    attendance_pct    NUMERIC(5,2),
    homework_pct      NUMERIC(5,2),
    review_status     VARCHAR(30)  NOT NULL DEFAULT 'Chờ GV'
                      CHECK (review_status IN ('Chờ GV', 'GV Đồng ý', 'GV Từ chối', 'Quá hạn → Lead')),
    teacher_decision  VARCHAR(10)  CHECK (teacher_decision IN ('Pass', 'Fail')),
    teacher_comment   TEXT,
    confirmed_at      TIMESTAMPTZ,
    deadline          DATE         NOT NULL,
    is_overdue        BOOLEAN      NOT NULL DEFAULT FALSE,
    escalated_to_lead BOOLEAN      NOT NULL DEFAULT FALSE,
    lead_email_sent   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_review_status   ON pass_reviews(review_status);
CREATE INDEX idx_review_student  ON pass_reviews(student_id);
CREATE INDEX idx_review_class    ON pass_reviews(class_id);
CREATE INDEX idx_review_deadline ON pass_reviews(deadline) WHERE NOT is_overdue;

COMMENT ON TABLE pass_reviews IS 'Xét duyệt Pass mềm (Sheet 05_XetDuyet_PassMem)';

-- ============================================================
-- 5. SYSTEM TABLES
-- ============================================================

-- Sheet 06: Cấu hình hệ thống
CREATE TABLE system_configs (
    id           SERIAL PRIMARY KEY,
    config_key   VARCHAR(100) NOT NULL UNIQUE,
    config_value VARCHAR(200) NOT NULL,
    description  TEXT,
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_by   VARCHAR(100) DEFAULT 'admin'
);

COMMENT ON TABLE system_configs IS 'Cấu hình ngưỡng và tham số hệ thống (Sheet 06_CauHinh_HeThong)';

-- Sheet 07: Log hệ thống
CREATE TABLE system_logs (
    id               BIGSERIAL PRIMARY KEY,
    log_id           VARCHAR(36)  DEFAULT gen_random_uuid()::text,
    run_id           VARCHAR(36),
    workflow_name    VARCHAR(100),
    action           VARCHAR(50),
    class_id         INTEGER,
    status           VARCHAR(20)  NOT NULL DEFAULT 'success'
                     CHECK (status IN ('success', 'warning', 'error', 'info')),
    message          TEXT,
    records_affected INTEGER      DEFAULT 0,
    duration_ms      INTEGER      DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Log table cần index theo thời gian (xem log gần nhất) và run_id (xem 1 lần chạy)
CREATE INDEX idx_syslog_created ON system_logs(created_at DESC);
CREATE INDEX idx_syslog_run     ON system_logs(run_id);

COMMENT ON TABLE system_logs IS 'Log hoạt động hệ thống n8n (Sheet 07_Log_HeThong)';

-- ============================================================
-- 6. USEFUL VIEWS cho Dashboard
-- ============================================================

-- View: Trạng thái MỚI NHẤT của mỗi lớp (thay Sheet 01)
CREATE OR REPLACE VIEW v_class_latest AS
SELECT DISTINCT ON (s.class_id)
    c.class_id, c.class_name, c.course_id,
    t.teacher_id, t.teacher_name, t.teacher_email,
    c.status, c.schedule, c.location,
    c.opening_date, c.ending_date, c.total_sessions,
    s.completed_sessions, s.progress_pct,
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

-- View: Trạng thái MỚI NHẤT của mỗi học viên (thay Sheet 02)
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

-- View: Trend theo TUẦN (aggregate snapshots)
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

-- View: Trend theo THÁNG (aggregate snapshots)
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
-- TRIGGER: Tự động cập nhật updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_teachers_updated
    BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_classes_updated
    BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_students_updated
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- DONE
-- ============================================================

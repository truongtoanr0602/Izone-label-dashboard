-- ============================================================
-- IZONE LABEL DASHBOARD — Seed Data
-- Dữ liệu khởi tạo từ mock data hiện có
-- ============================================================

SET search_path TO izone, public;

-- ============================================================
-- 1. TEACHERS (Sheet 08_GiaoVien)
-- ============================================================

INSERT INTO teachers (teacher_id, teacher_name, teacher_email, teacher_phone, khoi_id, role) VALUES
(305, 'Trần Minh Phương',    'phuong.tm@izone.edu.vn',  '0901234567', 34, 'teacher'),
(412, 'Nguyễn Hoàng Anh',    'anh.nh@izone.edu.vn',     '0912345678', 34, 'teacher'),
(218, 'Lê Thanh Hà',         'ha.lt@izone.edu.vn',      '0923456789', 34, 'teacher'),
(100, 'Nguyễn Ngọc Bảo Hà',  'ha.nnb@izone.edu.vn',     '0934567890', 34, 'lead');

-- ============================================================
-- 2. CLASSES (Sheet 01 — metadata tĩnh)
-- ============================================================

INSERT INTO classes (class_id, class_name, course_id, teacher_id, lead_email, status, schedule, location, opening_date, ending_date, total_sessions, portal_url) VALUES
(1159, 'IC2174', 2, 305, 'ha.nnb@izone.edu.vn', 'on_going',   '3,6', 'Online', '2026-05-19', '2026-08-25', 27, 'https://portal.izone.edu.vn/academic-affairs/course-classes/1159'),
(1006, 'IC2030', 2, 412, 'ha.nnb@izone.edu.vn', 'on_going',   '3,6', 'Online', '2025-12-26', '2026-04-24', 28, 'https://portal.izone.edu.vn/academic-affairs/course-classes/1006'),
(905,  'IC1924', 2, 218, 'ha.nnb@izone.edu.vn', 'on_going',   '3,6', 'Online', '2025-09-12', '2025-12-23', 28, 'https://portal.izone.edu.vn/academic-affairs/course-classes/905');

-- ============================================================
-- 3. STUDENTS (Sheet 02 — thông tin cá nhân)
-- ============================================================

-- IC2174 (class_id = 1159)
INSERT INTO students (student_id, student_code, full_name, phone, email, class_id, registration_status, admitted_at, target_output_status) VALUES
(18972, '18972', 'Nguyễn Việt Anh',         '0868578476', 'vietanh251109@gmail.com',                  1159, 'active', '2026-05-19', 'Chưa đạt'),
(17759, '17759', 'Hoàng Trần Hải Bằng',     '0969323714', 'hoangtranhaibang123@gmail.com',             1159, 'active', '2026-05-19', 'Chưa đạt'),
(18717, '18717', 'Lê Khả Hân',              '0815739553', 'khahan275@gmail.com',                      1159, 'active', '2026-05-19', 'Chưa đạt'),
(18496, '18496', 'Lê Ngọc Hiếu',            '0914843828', '257720501032@uhsvnu.edu.vn',                1159, 'active', '2026-05-19', 'Chưa đạt'),
(19428, '19428', 'Nguyễn Trường Huy',        '0354670164', 'nguyentruonghuy11092006@gmail.com',         1159, 'active', '2026-05-19', 'Chưa đạt'),
(19465, '19465', 'Nguyễn Thu Huyền',         '0969033998', 'hn1327569@gmail.com',                      1159, 'active', '2026-05-19', 'Chưa đạt'),
(19352, '19352', 'Hồ Thị Lan',              '0398388715', 'holan160305@gmail.com',                    1159, 'active', '2026-05-19', 'Chưa đạt'),
(18292, '18292', 'Quang Trần Khánh Linh',    '0985835205', 'quangtrankhanhllinh250909@gmail.com',       1159, 'active', '2026-05-19', 'Chưa đạt'),
(18381, '18381', 'Hoàng Thanh Như',          '0858433463', 'nhuhoang.htn@gmail.com',                   1159, 'active', '2026-05-19', 'Chưa đạt'),
(10377, '10377', 'Chu Nhã Quỳnh',           '0854816826', 'nhaquynh031106@gmail.com',                 1159, 'active', '2026-05-19', 'Chưa đạt'),
(10162, '10162', 'Nguyễn Thị Như Quỳnh',     '0348570368', 'nhuquynh2072k5@gmail.com',                 1159, 'active', '2026-05-19', 'Chưa đạt'),
(17958, '17958', 'Nguyễn Phương Thảo',       '0362342204', 'Trannguyenphuongthao22@gmail.com',          1159, 'active', '2026-05-19', 'Chưa đạt'),
(19483, '19483', 'Trịnh Viết Thiện',         '0961938462', 'caotramy85@gmail.com',                     1159, 'active', '2026-05-19', 'Chưa đạt'),
(19384, '19384', 'Phạm Châu Thanh Thuỷ',     '0704494150', 'thakthy4316@gmail.com',                    1159, 'active', '2026-05-19', 'Chưa đạt'),
(16497, '16497', 'Huỳnh Võ Ngọc Trâm',      '0913447075', 'ngtram0607@gmail.com',                     1159, 'active', '2026-05-19', 'Chưa đạt'),
(19346, '19346', 'Lê Thanh Tùng',           '0363823743', 'lethanhtung5710@gmail.com',                1159, 'active', '2026-05-19', 'Chưa đạt'),
(17953, '17953', 'Tạ Thị Tuyền',            '0972234610', 'tathituyen0505@gmail.com',                 1159, 'active', '2026-05-19', 'Chưa đạt'),
(18782, '18782', 'Đoàn Ánh Tuyết',           '0377223522', 'henrrylee427@gmail.com',                   1159, 'active', '2026-05-19', 'Chưa đạt'),
(18634, '18634', 'Nguyễn Thị Nhật Dương',    '0352996388', 'nguyenthinhatduong11@gmail.com',            1159, 'transferred', '2026-05-19', 'Chưa đạt'),
(17787, '17787', 'Bùi Phương Nga',           '0562657888', 'ngabui81209@gmail.com',                    1159, 'transferred', '2026-05-19', 'Chưa đạt'),
(18718, '18718', 'Nguyễn Danh Thi',          '0939251832', 'ndthi15112005@gmail.com',                  1159, 'transferred', '2026-05-19', 'Chưa đạt');

-- IC2030 (class_id = 1006)
INSERT INTO students (student_id, student_code, full_name, phone, email, class_id, registration_status, admitted_at, target_output_status) VALUES
(25820, '25820', 'Trần Quốc Bảo',           '0901111001', 'baotq@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25821, '25821', 'Nguyễn Thị Hồng',         '0901111002', 'hongnth@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25822, '25822', 'Phạm Văn Kiên',           '0901111003', 'kienpv@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25823, '25823', 'Lê Thị Thanh Trúc',       '0901111004', 'trucltt@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25824, '25824', 'Hoàng Minh Tuấn',         '0901111005', 'tuanhm@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25825, '25825', 'Vũ Thị Ngọc Ánh',         '0901111006', 'anhvtn@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25826, '25826', 'Đặng Văn Hùng',           '0901111007', 'hungdv@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25827, '25827', 'Bùi Thị Kim Chi',          '0901111008', 'chibtk@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25828, '25828', 'Ngô Đình Khoa',           '0901111009', 'khoandn@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25829, '25829', 'Phan Thị Mỹ Duyên',       '0901111010', 'duyenptm@gmail.com',    1006, 'active', '2025-12-26', 'Chưa đạt'),
(25830, '25830', 'Lý Văn Tài',              '0901111011', 'tailv@gmail.com',       1006, 'active', '2025-12-26', 'Chưa đạt'),
(25831, '25831', 'Trịnh Thị Hồng Nhung',    '0901111012', 'nhungtth@gmail.com',    1006, 'active', '2025-12-26', 'Chưa đạt'),
(25832, '25832', 'Đỗ Mạnh Cường',           '0901111013', 'cuongdm@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25833, '25833', 'Mai Thị Hương Giang',      '0901111014', 'giangmth@gmail.com',    1006, 'active', '2025-12-26', 'Chưa đạt'),
(25834, '25834', 'Đinh Công Thành',          '0901111015', 'thanhdc@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25835, '25835', 'Tô Thị Phương Anh',       '0901111016', 'anhttp@gmail.com',      1006, 'active', '2025-12-26', 'Chưa đạt'),
(25836, '25836', 'Võ Minh Đức',              '0901111017', 'ducvm@gmail.com',       1006, 'on_hold', '2025-12-26', 'Chưa đạt'),
(25837, '25837', 'Hà Thị Bích Ngọc',        '0901111018', 'ngochtb@gmail.com',     1006, 'active', '2025-12-26', 'Chưa đạt'),
(25838, '25838', 'Chu Văn Long',             '0901111019', 'longcv@gmail.com',      1006, 'dropped', '2025-12-26', 'Chưa đạt');

-- IC1924 (class_id = 905)
INSERT INTO students (student_id, student_code, full_name, phone, email, class_id, registration_status, admitted_at, target_output_status) VALUES
(25839, '25839', 'Trương Minh Quân',        '0901222001', 'quantm@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25840, '25840', 'Nguyễn Thị Diệu Linh',   '0901222002', 'linhntd@gmail.com',     905, 'active', '2025-09-12', 'Chưa đạt'),
(25841, '25841', 'Phạm Hoàng Sơn',          '0901222003', 'sonph@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25842, '25842', 'Lê Thị Hồng Vân',         '0901222004', 'vanlth@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25843, '25843', 'Hoàng Văn Phúc',          '0901222005', 'phuchv@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25844, '25844', 'Vũ Thị Thu Hà',           '0901222006', 'havtt@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25845, '25845', 'Đặng Minh Trí',           '0901222007', 'tridm@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25846, '25846', 'Bùi Thị Ngọc Mai',        '0901222008', 'maiBtn@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25847, '25847', 'Ngô Thanh Tâm',           '0901222009', 'tamnt@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25848, '25848', 'Phan Văn Đức',             '0901222010', 'ducpv@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25849, '25849', 'Lý Thị Kim Ngân',          '0901222011', 'nganlkk@gmail.com',     905, 'active', '2025-09-12', 'Chưa đạt'),
(25850, '25850', 'Trịnh Hoàng Anh',         '0901222012', 'anhth@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25851, '25851', 'Đỗ Văn Lâm',              '0901222013', 'lamdv@gmail.com',       905, 'active', '2025-09-12', 'Chưa đạt'),
(25852, '25852', 'Mai Thị Thanh Xuân',       '0901222014', 'xuanmtt@gmail.com',     905, 'active', '2025-09-12', 'Chưa đạt'),
(25853, '25853', 'Đinh Thị Quỳnh Anh',       '0901222015', 'anhdtq@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25854, '25854', 'Tô Minh Hiếu',            '0901222016', 'hieutm@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25855, '25855', 'Võ Thị Hạnh',             '0901222017', 'hanhvt@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25856, '25856', 'Hà Quốc Việt',            '0901222018', 'viethq@gmail.com',      905, 'active', '2025-09-12', 'Chưa đạt'),
(25857, '25857', 'Chu Thị Minh Thư',         '0901222019', 'thuctm@gmail.com',      905, 'transferred', '2025-09-12', 'Chưa đạt');

-- ============================================================
-- 4. SYSTEM CONFIGS (Sheet 06)
-- ============================================================

INSERT INTO system_configs (config_key, config_value, description) VALUES
('nguong_xam_max',       '45',           'Điểm tối đa nhóm Xám (<giá trị này)'),
('nguong_do_min',        '45',           'Điểm tối thiểu nhóm Đỏ'),
('nguong_do_max',        '60',           'Điểm tối đa nhóm Đỏ (<giá trị này)'),
('nguong_vang_min',      '60',           'Điểm tối thiểu nhóm Vàng (>=giá trị này)'),
('pass_dh_min',          '90',           'ĐH tối thiểu cho Pass chuẩn (>=%)'),
('pass_btvn_min',        '90',           'BTVN tối thiểu cho Pass chuẩn (>=%)'),
('pass_test_avg_min',    '60',           'TB test tối thiểu cho Pass chuẩn'),
('soft_g1_test_min',     '50',           'Nhóm 1 Pass mềm: TB test min'),
('soft_g1_test_max',     '55',           'Nhóm 1 Pass mềm: TB test max (<)'),
('soft_g1_dh_min',       '100',          'Nhóm 1 Pass mềm: ĐH tối thiểu (%)'),
('soft_g1_btvn_min',     '100',          'Nhóm 1 Pass mềm: BTVN tối thiểu (%)'),
('soft_g2_test_min',     '55',           'Nhóm 2 Pass mềm: TB test min'),
('soft_g2_test_max',     '60',           'Nhóm 2 Pass mềm: TB test max (<)'),
('soft_g2_dh_min',       '90',           'Nhóm 2 Pass mềm: ĐH tối thiểu (%)'),
('soft_g2_btvn_min',     '90',           'Nhóm 2 Pass mềm: BTVN tối thiểu (%)'),
('review_deadline_days', '7',            'Số ngày GV phải confirm Pass mềm'),
('moc_bao_dong_pct',     '40',           'Ngưỡng % (Xám+Đỏ) để báo động lớp'),
('alert_dh_tut_pct',     '80',           'Ngưỡng ĐH tuần tụt để cảnh báo (%)'),
('alert_btvn_tut_pct',   '80',           'Ngưỡng BTVN tuần tụt để cảnh báo (%)'),
('cheating_test_score',  '0',            'Điểm test bị cheating tính = bao nhiêu'),
('cron_schedule',        '0 10 * * *',   'Lịch chạy N8N (hàng ngày 10h sáng)'),
('total_tests_per_course','6',           'Tổng số test dự kiến trong khóa'),
('test_makeup_rule',     'max',          'Cách tính điểm thi lại: max / replace / average');

-- ============================================================
-- 5. SAMPLE: 1 ngày snapshot cho lớp (minh hoạ)
-- ============================================================

INSERT INTO class_daily_snapshots (class_id, snapshot_date, completed_sessions, active_students, on_hold_students, dropped_students, transferred_students, attendance_avg, homework_avg, pass_chuan_rate, pass_mem_rate, label_yellow, label_red, label_grey, label_no_data, risk_pct, is_alarm_triggered, health_status) VALUES
(1159, '2026-08-05', 18, 18, 0, 0, 3, 95.7, 87.9, 22.2, 27.8, 6, 8, 2, 2, 55.6, TRUE,  'Cần theo dõi'),
(1006, '2026-08-05', 28, 17, 1, 1, 0, 91.8, 92.4, 47.1, 52.9, 8, 5, 3, 1, 47.1, TRUE,  'Cần theo dõi'),
(905,  '2026-08-05', 28, 18, 0, 0, 1, 94.1, 93.6, 44.4, 55.6, 9, 5, 3, 1, 44.4, TRUE,  'Cần theo dõi');

-- ============================================================
-- DONE — Seed data loaded successfully
-- ============================================================

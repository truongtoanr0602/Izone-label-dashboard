#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate mock data CSV files for IZONE Student Labeling System - Khối 3-4
VERSION 3 (FROZEN / WATERFALL RELEASE) — 2026-07-27

Architectural Freeze Implemented:
1. Solution 1 (Strict Normalization on FKs):
   - Removed full_name, class_name, teacher_email from Sheet 03, 04, 05.
   - Sheet 03, 04, 05 now strictly use FKs (student_id, class_id, teacher_id).
   - Removed test_date from Sheet 03 as Portal /tests does not provide date.
2. Solution 2 (Hybrid Database / Denormalization for Frontend):
   - Restored 6 static test columns (test_1..test_6) in Sheet 02 as Read-Only denormalized view.
   - Sheet 03 acts as the detailed log/source of truth (makeup, cheating).
   - n8n writes details to Sheet 03 and flattens final scores directly into test_1..test_6 of Sheet 02.
3. Solution 3 (Clean Document & ERD Readiness):
   - 8 sheets completely aligned with Hybrid CQRS architecture.
"""

import csv
import os
import random
import uuid
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "csv_output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def gan_nhan(test_avg):
    """Phân nhãn theo ngưỡng Khối 3-4"""
    if test_avg is None:
        return "Chưa có DL"
    if test_avg < 45:
        return "Xám"
    if test_avg < 60:
        return "Đỏ"
    return "Vàng"


def pass_chuan(att, hw, test_avg):
    """Kiểm tra Pass chuẩn: ĐH>=90%, BTVN>=90%, TB test>=60"""
    if att is None or hw is None or test_avg is None:
        return "Chưa đủ DL", []
    reasons = []
    if att < 90:
        reasons.append("Đi học <90%")
    if hw < 90:
        reasons.append("BTVN <90%")
    if test_avg < 60:
        reasons.append("TB test <60")
    if not reasons:
        return "Có khả năng pass", []
    return "Chưa đạt điều kiện pass", reasons


def pass_mem(att, hw, test_avg):
    """Kiểm tra Pass mềm theo 3 nhóm"""
    if test_avg is None:
        return None, None, None
    if test_avg >= 60:
        return "Đạt pass mềm", "Nhóm 3", "Test >=60"
    if att is None or hw is None:
        return "Chưa đủ DL xét pass mềm", None, None
    if 55 <= test_avg < 60 and att >= 90 and hw >= 90:
        return "Đạt pass mềm", "Nhóm 2", "Test 55-<60, ĐH>=90%, BTVN>=90%"
    if 50 <= test_avg < 55 and att >= 100 and hw >= 100:
        return "Đạt pass mềm", "Nhóm 1", "Test 50-<55, ĐH 100%, BTVN 100%"
    return "Không đạt pass mềm", None, None


def write_csv(filename, headers, rows):
    """Ghi file CSV với BOM cho Excel/Sheets đọc đúng tiếng Việt"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"  ✅ {filename} — {len(rows)} dòng")
    return filepath


# ============================================================
# TEACHER DATA (Sheet 08)
# ============================================================

TEACHERS = [
    {
        "teacher_id": 305, "teacher_name": "Trần Minh Phương",
        "teacher_email": "phuong.tm@izone.edu.vn",
        "teacher_phone": "0901234567", "khoi_id": 34, "role": "teacher",
    },
    {
        "teacher_id": 412, "teacher_name": "Nguyễn Hoàng Anh",
        "teacher_email": "anh.nh@izone.edu.vn",
        "teacher_phone": "0912345678", "khoi_id": 34, "role": "teacher",
    },
    {
        "teacher_id": 218, "teacher_name": "Lê Thanh Hà",
        "teacher_email": "ha.lt@izone.edu.vn",
        "teacher_phone": "0923456789", "khoi_id": 34, "role": "teacher",
    },
    {
        "teacher_id": 100, "teacher_name": "Nguyễn Ngọc Bảo Hà",
        "teacher_email": "ha.nnb@izone.edu.vn",
        "teacher_phone": "0934567890", "khoi_id": 34, "role": "lead",
    },
]

LEAD_EMAIL = "ha.nnb@izone.edu.vn"  # Lead Khối 3-4

def get_teacher(teacher_id):
    for t in TEACHERS:
        if t["teacher_id"] == teacher_id:
            return t
    return None

# ============================================================
# MOCK DATA: DANH SÁCH LỚP
# ============================================================

CLASSES = [
    {
        "class_id": 1159, "class_name": "IC2174", "course_id": 2,
        "teacher_id": 305,
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2026-05-19", "ngay_ket_thuc": "2026-08-25",
        "total_sessions": 27, "completed_sessions": 18,
    },
    {
        "class_id": 1006, "class_name": "IC2030", "course_id": 2,
        "teacher_id": 412,
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2025-12-26", "ngay_ket_thuc": "2026-04-24",
        "total_sessions": 28, "completed_sessions": 28,
    },
    {
        "class_id": 905, "class_name": "IC1924", "course_id": 2,
        "teacher_id": 218,
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2025-09-12", "ngay_ket_thuc": "2025-12-23",
        "total_sessions": 28, "completed_sessions": 28,
    },
]

# ============================================================
# MOCK DATA: HỌC VIÊN — Using real Portal IDs + data
# Format: (student_id, name, status, att%, hw%, phone, email,
#          chuan_dau_ra, tests_list, makeup_tests_dict)
# tests_list: [test1, test2, ...] (None = chưa thi)
# makeup_tests_dict: {test_order: makeup_score}
# ============================================================

STUDENTS_IC2174 = [
    (18972, "Nguyễn Việt Anh", "active", 78, 94, "0868578476", "vietanh251109@gmail.com", "Chưa đạt", [60.5, 70.0, 70.5, 56.0], {}),
    (17759, "Hoàng Trần Hải Bằng", "active", 100, 89, "0969323714", "hoangtranhaibang123@gmail.com", "Chưa đạt", [67.5, 60.0, 57.5, None], {}),
    (18717, "Lê Khả Hân", "active", 94, 100, "0815739553", "khahan275@gmail.com", "Chưa đạt", [93.5, 85.0, 91.5, 93.0], {}),
    (18496, "Lê Ngọc Hiếu", "active", 100, 100, "0914843828", "257720501032@uhsvnu.edu.vn", "Chưa đạt", [77.0, 83.1, 71.0, 83.0], {}),
    (19428, "Nguyễn Trường Huy", "active", 100, 100, "0354670164", "nguyentruonghuy11092006@gmail.com", "Chưa đạt", [54.0, 70.5, 76.0, 84.0], {}),
    (19465, "Nguyễn Thu Huyền", "active", 100, 50, "0969033998", "hn1327569@gmail.com", "Chưa đạt", [50.0, 47.5, 46.0, 51.0], {}),
    (19352, "Hồ Thị Lan", "active", 100, 100, "0398388715", "holan160305@gmail.com", "Chưa đạt", [77.0, 71.0, 83.0, 74.5], {}),
    (18292, "Quang Trần Khánh Linh", "active", 100, 100, "0985835205", "quangtrankhanhllinh250909@gmail.com", "Chưa đạt", [69.5, 71.0, 65.5, 84.0], {}),
    (18381, "Hoàng Thanh Như", "active", None, None, "0858433463", "nhuhoang.htn@gmail.com", "Chưa đạt", [None, None, None, None], {}),
    (10377, "Chu Nhã Quỳnh", "active", 67, 83, "0854816826", "nhaquynh031106@gmail.com", "Chưa đạt", [87.5, 93.0, 95.5, None], {}),
    (10162, "Nguyễn Thị Như Quỳnh", "active", 100, 100, "0348570368", "nhuquynh2072k5@gmail.com", "Chưa đạt", [35.0, 46.5, 50.0, 57.0], {1: 43.5, 2: 54.5}),
    (17958, "Nguyễn Phương Thảo", "active", 94, 67, "0362342204", "Trannguyenphuongthao22@gmail.com", "Chưa đạt", [55.0, 42.0, 60.5, None], {}),
    (19483, "Trịnh Viết Thiện", "active", 100, 94, "0961938462", "caotramy85@gmail.com", "Chưa đạt", [74.0, 57.5, None, 67.5], {2: 60.0}),
    (19384, "Phạm Châu Thanh Thuỷ", "active", 94, None, "0704494150", "thakthy4316@gmail.com", "Chưa đạt", [72.0, 75.0, 82.0, None], {}),
    (16497, "Huỳnh Võ Ngọc Trâm", "active", 100, None, "0913447075", "ngtram0607@gmail.com", "Chưa đạt", [None, None, None, 86.0], {}),
    (19346, "Lê Thanh Tùng", "active", 94, None, "0363823743", "lethanhtung5710@gmail.com", "Chưa đạt", [60.0, 73.0, 63.0, 55.0], {}),
    (17953, "Tạ Thị Tuyền", "active", 94, None, "0972234610", "tathituyen0505@gmail.com", "Chưa đạt", [None, 62.0, 66.5, 69.5], {}),
    (18782, "Đoàn Ánh Tuyết", "active", 100, None, "0377223522", "henrrylee427@gmail.com", "Chưa đạt", [69.0, 60.0, 64.0, 64.0], {}),
    (18634, "Nguyễn Thị Nhật Dương", "transferred", 100, 100, "0352996388", "nguyenthinhatduong11@gmail.com", "Chưa đạt", [], {}),
    (17787, "Bùi Phương Nga", "transferred", 100, 100, "0562657888", "ngabui81209@gmail.com", "Chưa đạt", [], {}),
    (18718, "Nguyễn Danh Thi", "transferred", None, None, "0939251832", "ndthi15112005@gmail.com", "Chưa đạt", [], {}),
]

STUDENTS_IC2030 = [
    (25820, "Trần Quốc Bảo", "active", 95, 100, "0901111001", "baotq@gmail.com", "Chưa đạt", [72.0, 75.5, 78.0, 80.0, 82.5, 85.0], {}),
    (25821, "Nguyễn Thị Hồng", "active", 100, 100, "0901111002", "hongnth@gmail.com", "Chưa đạt", [65.0, 68.0, 70.5, 72.0, 75.0, 78.0], {}),
    (25822, "Phạm Văn Kiên", "active", 90, 95, "0901111003", "kienpv@gmail.com", "Chưa đạt", [55.0, 58.0, 60.0, 62.0, 65.0, 68.0], {}),
    (25823, "Lê Thị Thanh Trúc", "active", 100, 100, "0901111004", "trucltt@gmail.com", "Chưa đạt", [48.0, 52.0, 55.0, 58.0, 60.0, 62.0], {}),
    (25824, "Hoàng Minh Tuấn", "active", 85, 80, "0901111005", "tuanhm@gmail.com", "Chưa đạt", [42.0, 45.0, 43.0, 48.0, 50.0, 52.0], {}),
    (25825, "Vũ Thị Ngọc Ánh", "active", 100, 100, "0901111006", "anhvtn@gmail.com", "Chưa đạt", [88.0, 90.0, 85.0, 92.0, 88.5, 91.0], {}),
    (25826, "Đặng Văn Hùng", "active", 92, 95, "0901111007", "hungdv@gmail.com", "Chưa đạt", [50.0, 55.0, 52.0, 58.0, 60.0, 55.0], {}),
    (25827, "Bùi Thị Kim Chi", "active", 78, 82, "0901111008", "chibtk@gmail.com", "Chưa đạt", [35.0, 38.0, 40.0, 42.0, 38.0, 45.0], {}),
    (25828, "Ngô Đình Khoa", "active", 100, 100, "0901111009", "khoandn@gmail.com", "Chưa đạt", [70.0, 72.0, 75.0, 78.0, 80.0, 82.0], {}),
    (25829, "Phan Thị Mỹ Duyên", "active", 95, 90, "0901111010", "duyenptm@gmail.com", "Chưa đạt", [60.0, 58.0, 62.0, 55.0, 65.0, 60.0], {}),
    (25830, "Lý Văn Tài", "active", 88, 92, "0901111011", "tailv@gmail.com", "Chưa đạt", [45.0, 48.0, 50.0, 52.0, 55.0, 53.0], {}),
    (25831, "Trịnh Thị Hồng Nhung", "active", 100, 100, "0901111012", "nhungtth@gmail.com", "Chưa đạt", [52.0, 55.0, 58.0, 60.0, 62.0, 65.0], {}),
    (25832, "Đỗ Mạnh Cường", "active", 95, 95, "0901111013", "cuongdm@gmail.com", "Chưa đạt", [75.0, 72.0, 78.0, 80.0, 76.0, 82.0], {}),
    (25833, "Mai Thị Hương Giang", "active", 70, 65, "0901111014", "giangmth@gmail.com", "Chưa đạt", [30.0, 32.0, 28.0, 35.0, 30.0, 33.0], {}),
    (25834, "Đinh Công Thành", "active", 92, 95, "0901111015", "thanhdc@gmail.com", "Chưa đạt", [58.0, 62.0, 60.0, 65.0, 68.0, 70.0], {}),
    (25835, "Tô Thị Phương Anh", "active", 100, 100, "0901111016", "anhttp@gmail.com", "Chưa đạt", [82.0, 85.0, 80.0, 88.0, 85.0, 90.0], {}),
    (25836, "Võ Minh Đức", "on_hold", 60, 55, "0901111017", "ducvm@gmail.com", "Chưa đạt", [40.0, 38.0], {}),
    (25837, "Hà Thị Bích Ngọc", "active", 95, 100, "0901111018", "ngochtb@gmail.com", "Chưa đạt", [68.0, 70.0, 72.0, 75.0, 78.0, 80.0], {}),
    (25838, "Chu Văn Long", "dropped", 35, 30, "0901111019", "longcv@gmail.com", "Chưa đạt", [20.0], {}),
]

STUDENTS_IC1924 = [
    (25839, "Trương Minh Quân", "active", 100, 100, "0901222001", "quantm@gmail.com", "Chưa đạt", [80.0, 82.0, 85.0, 78.0, 88.0, 90.0], {}),
    (25840, "Nguyễn Thị Diệu Linh", "active", 95, 95, "0901222002", "linhntd@gmail.com", "Chưa đạt", [62.0, 65.0, 68.0, 70.0, 72.0, 75.0], {}),
    (25841, "Phạm Hoàng Sơn", "active", 88, 90, "0901222003", "sonph@gmail.com", "Chưa đạt", [55.0, 52.0, 58.0, 60.0, 55.0, 62.0], {}),
    (25842, "Lê Thị Hồng Vân", "active", 100, 100, "0901222004", "vanlth@gmail.com", "Chưa đạt", [45.0, 50.0, 55.0, 58.0, 60.0, 62.0], {}),
    (25843, "Hoàng Văn Phúc", "active", 82, 78, "0901222005", "phuchv@gmail.com", "Chưa đạt", [38.0, 40.0, 42.0, 45.0, 40.0, 48.0], {}),
    (25844, "Vũ Thị Thu Hà", "active", 100, 100, "0901222006", "havtt@gmail.com", "Chưa đạt", [92.0, 90.0, 88.0, 95.0, 90.0, 93.0], {}),
    (25845, "Đặng Minh Trí", "active", 95, 92, "0901222007", "tridm@gmail.com", "Chưa đạt", [50.0, 55.0, 58.0, 60.0, 62.0, 58.0], {}),
    (25846, "Bùi Thị Ngọc Mai", "active", 100, 100, "0901222008", "maiBtn@gmail.com", "Chưa đạt", [75.0, 78.0, 80.0, 82.0, 85.0, 88.0], {}),
    (25847, "Ngô Thanh Tâm", "active", 72, 70, "0901222009", "tamnt@gmail.com", "Chưa đạt", [32.0, 35.0, 30.0, 38.0, 35.0, 40.0], {}),
    (25848, "Phan Văn Đức", "active", 100, 100, "0901222010", "ducpv@gmail.com", "Chưa đạt", [70.0, 72.0, 68.0, 75.0, 78.0, 80.0], {}),
    (25849, "Lý Thị Kim Ngân", "active", 95, 95, "0901222011", "nganlkk@gmail.com", "Chưa đạt", [58.0, 60.0, 62.0, 65.0, 68.0, 70.0], {}),
    (25850, "Trịnh Hoàng Anh", "active", 90, 88, "0901222012", "anhth@gmail.com", "Chưa đạt", [48.0, 50.0, 52.0, 48.0, 55.0, 50.0], {}),
    (25851, "Đỗ Văn Lâm", "active", 100, 95, "0901222013", "lamdv@gmail.com", "Chưa đạt", [65.0, 68.0, 70.0, 72.0, 75.0, 72.0], {}),
    (25852, "Mai Thị Thanh Xuân", "active", 88, 90, "0901222014", "xuanmtt@gmail.com", "Chưa đạt", [42.0, 45.0, 48.0, 50.0, 52.0, 55.0], {}),
    (25853, "Đinh Thị Quỳnh Anh", "active", 100, 100, "0901222015", "anhdtq@gmail.com", "Chưa đạt", [85.0, 88.0, 90.0, 92.0, 88.0, 95.0], {}),
    (25854, "Tô Minh Hiếu", "active", 95, 95, "0901222016", "hieutm@gmail.com", "Chưa đạt", [55.0, 58.0, 52.0, 60.0, 55.0, 58.0], {}),
    (25855, "Võ Thị Hạnh", "active", 100, 100, "0901222017", "hanhvt@gmail.com", "Chưa đạt", [78.0, 80.0, 82.0, 85.0, 88.0, 85.0], {}),
    (25856, "Hà Quốc Việt", "active", 82, 85, "0901222018", "viethq@gmail.com", "Chưa đạt", [40.0, 42.0, 45.0, 48.0, 50.0, 52.0], {}),
    (25857, "Chu Thị Minh Thư", "transferred", 90, 88, "0901222019", "thuctm@gmail.com", "Chưa đạt", [52.0, 55.0], {}),
]

ALL_STUDENTS_RAW = [
    (CLASSES[0], STUDENTS_IC2174),
    (CLASSES[1], STUDENTS_IC2030),
    (CLASSES[2], STUDENTS_IC1924),
]

FEEDBACK_BTVN = [
    "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
    "có tinh thần làm BTVN tốt, tuy nhiên vẫn cần phải chú ý hơn ở khoá sau vì một số buổi vẫn thiếu BTVN",
    "có tinh thần làm BTVN tương đối tốt, tuy nhiên vẫn cần phải chú ý hơn ở khoá sau vì bài tập chưa đầy đủ",
    "có tinh thần làm BTVN chưa tốt, còn thiếu nhiều bài tập",
]
FEEDBACK_ORIENTATION = [
    "có tinh thần đi học rất tốt. Em đi học đầy đủ",
    "có tinh thần đi học tốt, tuy nhiên vẫn cần phải chú ý hơn về chuyên cần",
    "cần cải thiện tỉ lệ đi học để đảm bảo tiến độ khóa học",
]

# ============================================================
# GENERATE SHEET 1: DanhSach_Lop
# ============================================================

def generate_danhsach_lop():
    headers = [
        "class_id", "class_name", "course_id", "teacher_id", "teacher_name",
        "teacher_email", "lead_email", "status", "lich_hoc", "dia_diem",
        "ngay_khai_giang", "ngay_ket_thuc",
        "total_sessions", "completed_sessions", "session_progress",
        "active_students", "on_hold_students", "dropped_students",
        "attendance_class_avg", "homework_class_avg", "tinh_trang",
        "count_xam", "count_do", "count_vang", "count_chua_co_dl",
        "pct_xam", "pct_do", "pct_vang",
        "moc_bao_dong", "pass_chuan_rate", "pass_mem_rate",
        "link_portal", "scraped_at",
    ]

    rows = []
    for cls, students in ALL_STUDENTS_RAW:
        teacher = get_teacher(cls["teacher_id"])
        active = [s for s in students if s[2] == "active"]
        on_hold = [s for s in students if s[2] == "on_hold"]
        dropped = [s for s in students if s[2] in ("dropped",)]
        transferred = [s for s in students if s[2] == "transferred"]

        att_vals = [s[3] for s in active if s[3] is not None]
        hw_vals = [s[4] for s in active if s[4] is not None]
        att_avg = round(sum(att_vals) / len(att_vals), 1) if att_vals else 0
        hw_avg = round(sum(hw_vals) / len(hw_vals), 1) if hw_vals else 0

        labels = {"Xám": 0, "Đỏ": 0, "Vàng": 0, "Chưa có DL": 0}
        pass_chuan_count = 0
        pass_mem_count = 0

        for s in active:
            tests = [t for t in s[8] if t is not None]
            for test_idx, makeup_score in s[9].items():
                if test_idx - 1 < len(s[8]) and s[8][test_idx - 1] is not None:
                    orig = s[8][test_idx - 1]
                    idx_in_valid = list(range(len([t for t in s[8][:test_idx] if t is not None])))
                    if idx_in_valid:
                        actual_idx = idx_in_valid[-1]
                        if actual_idx < len(tests):
                            tests[actual_idx] = max(orig, makeup_score)

            test_avg = round(sum(tests) / len(tests), 1) if tests else None
            label = gan_nhan(test_avg)
            labels[label] += 1

            status_pc, _ = pass_chuan(s[3], s[4], test_avg)
            if status_pc == "Có khả năng pass":
                pass_chuan_count += 1

            status_pm, _, _ = pass_mem(s[3], s[4], test_avg)
            if status_pm == "Đạt pass mềm":
                pass_mem_count += 1

        n_active = len(active)
        pct_xam = round(labels["Xám"] / n_active * 100, 1) if n_active else 0
        pct_do = round(labels["Đỏ"] / n_active * 100, 1) if n_active else 0
        pct_vang = round(labels["Vàng"] / n_active * 100, 1) if n_active else 0
        moc_bao_dong = "TRUE" if (pct_xam + pct_do) >= 40 else "FALSE"

        tinh_trang = "Bình thường"
        if att_avg < 70 or hw_avg < 70:
            tinh_trang = "Xử lý gấp"
        elif att_avg <= 80 or hw_avg <= 80:
            tinh_trang = "Cần theo dõi"

        rows.append([
            cls["class_id"], cls["class_name"], cls["course_id"],
            cls["teacher_id"], teacher["teacher_name"], teacher["teacher_email"],
            LEAD_EMAIL,
            cls["status"], cls["lich_hoc"], cls["dia_diem"],
            cls["ngay_khai_giang"], cls["ngay_ket_thuc"],
            cls["total_sessions"], cls["completed_sessions"],
            f"{cls['completed_sessions']}/{cls['total_sessions']}",
            n_active, len(on_hold), len(dropped) + len(transferred),
            att_avg, hw_avg, tinh_trang,
            labels["Xám"], labels["Đỏ"], labels["Vàng"], labels["Chưa có DL"],
            pct_xam, pct_do, pct_vang,
            moc_bao_dong,
            round(pass_chuan_count / n_active * 100, 1) if n_active else 0,
            round(pass_mem_count / n_active * 100, 1) if n_active else 0,
            f"https://portal.izone.edu.vn/academic-affairs/course-classes/{cls['class_id']}",
            "2026-07-27",
        ])

    return write_csv("01_DanhSach_Lop.csv", headers, rows)


# ============================================================
# GENERATE SHEET 2: DuLieu_HocVien (HYBRID DENORMALIZED VIEW)
# Solution 2: Restored test_1..test_6 for Frontend Read-Only
# ============================================================

def generate_dulieu_hocvien():
    headers = [
        "student_id", "student_code", "full_name", "phone", "email",
        "class_id", "class_name",
        "registration_status", "admitted_at", "chuan_dau_ra",
        "attendance_pct", "attendance_present", "attendance_total",
        "homework_pct", "homework_done", "homework_total",
        # SOLUTION 2: Restored static columns for Frontend Read-Only
        "test_1", "test_2", "test_3", "test_4", "test_5", "test_6",
        "tests_taken", "test_average",
        "nhan_hien_tai", "nhan_truoc", "nhan_benchmark",
        "co_chuyen_nhan", "huong_chuyen_nhan", "checkpoint_gan_nhan",
        "pass_chuan_status", "pass_chuan_reasons",
        "pass_mem_status", "pass_mem_group", "pass_mem_label",
        "flag_dh_tut", "flag_btvn_tut", "flag_cheating", "flag_can_review",
        "teacher_feedback_btvn", "teacher_feedback_orientation",
        "gv_note", "gv_nhan_tam", "scraped_at",
    ]

    rows = []

    for cls, students in ALL_STUDENTS_RAW:
        for s in students:
            sid, name, status, att, hw, phone, email, cdr = s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]
            tests_raw = list(s[8])
            makeup_dict = s[9]

            tests_final = []
            for i, score in enumerate(tests_raw):
                if score is not None:
                    makeup = makeup_dict.get(i + 1)
                    final = max(score, makeup) if makeup else score
                    tests_final.append(final)
                else:
                    tests_final.append(None)

            # Pad to 6 tests for the static columns
            while len(tests_final) < 6:
                tests_final.append(None)

            valid_tests = [t for t in tests_final[:6] if t is not None]
            tests_taken = len(valid_tests)
            test_avg = round(sum(valid_tests) / tests_taken, 1) if valid_tests else None

            nhan = gan_nhan(test_avg)
            nhan_bm = gan_nhan(valid_tests[0]) if valid_tests else "Chưa có DL"

            if tests_taken >= 2:
                prev_tests = valid_tests[:-1]
                prev_avg = round(sum(prev_tests) / len(prev_tests), 1)
                nhan_truoc = gan_nhan(prev_avg)
            else:
                nhan_truoc = nhan_bm

            co_chuyen = "TRUE" if nhan != nhan_truoc else "FALSE"
            huong = f"{nhan_truoc} → {nhan}" if nhan != nhan_truoc else "Không đổi"
            checkpoint = f"Test {tests_taken}" if tests_taken > 0 else ""

            att_total = cls["completed_sessions"]
            att_present = round(att * att_total / 100) if att else 0
            hw_total = att_total
            hw_done = round(hw * hw_total / 100) if hw else 0

            if status == "active":
                pc_status, pc_reasons = pass_chuan(att, hw, test_avg)
                pc_reasons_str = "; ".join(pc_reasons) if pc_reasons else ""
            else:
                pc_status, pc_reasons_str = "", ""

            if status == "active":
                pm_status, pm_group, pm_label = pass_mem(att, hw, test_avg)
                pm_group = pm_group or ""
                pm_label = pm_label or ""
                pm_status = pm_status or ""
            else:
                pm_status, pm_group, pm_label = "", "", ""

            flag_dh = "TRUE" if att is not None and att < 80 else "FALSE"
            flag_btvn = "TRUE" if hw is not None and hw < 80 else "FALSE"
            flag_cheat = "FALSE"
            flag_review = "TRUE" if pm_group in ("Nhóm 1", "Nhóm 2") and status == "active" else "FALSE"

            if status == "active" and att is not None:
                if hw and hw >= 90: fb_btvn = FEEDBACK_BTVN[0]
                elif hw and hw >= 70: fb_btvn = FEEDBACK_BTVN[1]
                elif hw and hw >= 50: fb_btvn = FEEDBACK_BTVN[2]
                else: fb_btvn = FEEDBACK_BTVN[3]

                if att >= 90: fb_orient = FEEDBACK_ORIENTATION[0]
                elif att >= 80: fb_orient = FEEDBACK_ORIENTATION[1]
                else: fb_orient = FEEDBACK_ORIENTATION[2]
            else:
                fb_btvn, fb_orient = "", ""

            gv_note = ""
            gv_nhan_tam = ""
            if nhan == "Chưa có DL" and status == "active":
                gv_nhan_tam = "Đỏ"
                gv_note = "HV mới vào, GV gán tạm dựa trên BTVN"

            rows.append([
                sid, str(sid), name, phone, email,
                cls["class_id"], cls["class_name"],
                status, cls["ngay_khai_giang"], cdr,
                att or "", att_present, att_total,
                hw or "", hw_done, hw_total,
                tests_final[0] or "", tests_final[1] or "", tests_final[2] or "",
                tests_final[3] or "", tests_final[4] or "", tests_final[5] or "",
                tests_taken, test_avg or "",
                nhan, nhan_truoc, nhan_bm,
                co_chuyen, huong, checkpoint,
                pc_status, pc_reasons_str,
                pm_status, pm_group, pm_label,
                flag_dh, flag_btvn, flag_cheat, flag_review,
                fb_btvn, fb_orient,
                gv_note, gv_nhan_tam, "2026-07-27",
            ])

    return write_csv("02_DuLieu_HocVien.csv", headers, rows)


# ============================================================
# GENERATE SHEET 3: DiemTest_ChiTiet (NORMALIZED SOURCE OF TRUTH)
# Solution 1: Removed full_name, class_name.
# Solution 2: Removed test_date as Portal /tests lacks date.
# ============================================================

def generate_diem_test():
    headers = [
        "student_id", "class_id", "class_test_id", "test_order", "test_name",
        "raw_grade", "max_grade", "grade_percent",
        "is_makeup", "makeup_grade", "grade_final",
        "grade_status", "is_cheating", "grade_note",
        "nhan_tai_thoi_diem", "scraped_at",
    ]

    rows = []
    test_id_counter = 500

    for cls, students in ALL_STUDENTS_RAW:
        class_id = cls["class_id"]

        for s in students:
            sid = s[0]
            tests_raw = list(s[8])
            makeup_dict = s[9]

            cumulative_finals = []
            for i, score in enumerate(tests_raw):
                if score is None:
                    continue
                test_id_counter += 1
                test_order = i + 1

                makeup_score = makeup_dict.get(test_order)
                is_makeup = "TRUE" if makeup_score else "FALSE"
                grade_final = max(score, makeup_score) if makeup_score else score

                cumulative_finals.append(grade_final)
                cum_avg = round(sum(cumulative_finals) / len(cumulative_finals), 1)
                nhan_at_time = gan_nhan(cum_avg)

                rows.append([
                    sid, class_id, test_id_counter, test_order, f"Test {test_order}",
                    score, 100, score,
                    is_makeup, makeup_score or "", grade_final,
                    "confirmed", "FALSE", "",
                    nhan_at_time, "2026-07-27",
                ])

    return write_csv("03_DiemTest_ChiTiet.csv", headers, rows)


# ============================================================
# GENERATE SHEET 4: NhatKy_ChuyenNhan (NORMALIZED LOG)
# Solution 1: Removed full_name, class_name, teacher_email. Added teacher_id.
# ============================================================

def generate_nhatky_chuyennhan():
    headers = [
        "log_id", "student_id", "class_id", "teacher_id",
        "nhan_cu", "nhan_moi", "huong", "ly_do", "checkpoint",
        "test_average_moi", "dh_pct", "btvn_pct",
        "email_sent", "email_sent_at", "created_at",
    ]

    changes = [
        {
            "student_id": 19428, "class_id": 1159, "teacher_id": 305,
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "TB test tăng lên 70.1 (>=60) sau Test 4",
            "checkpoint": "Test 4", "test_avg": 70.1, "dh": 100, "btvn": 100,
            "date": "2026-07-20",
        },
        {
            "student_id": 10162, "class_id": 1159, "teacher_id": 305,
            "nhan_cu": "Xám", "nhan_moi": "Đỏ",
            "huong": "Lên", "ly_do": "Thi lại Test 1+2 nâng TB lên 51.3 (>=45) sau Test 4",
            "checkpoint": "Test 4", "test_avg": 51.3, "dh": 100, "btvn": 100,
            "date": "2026-07-20",
        },
        {
            "student_id": 25822, "class_id": 1006, "teacher_id": 412,
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "TB test từ Test 1-6 đạt 61.3 (>=60)",
            "checkpoint": "Test 6", "test_avg": 61.3, "dh": 90, "btvn": 95,
            "date": "2026-07-15",
        },
    ]

    rows = []
    for c in changes:
        rows.append([
            str(uuid.uuid4())[:8],
            c["student_id"], c["class_id"], c["teacher_id"],
            c["nhan_cu"], c["nhan_moi"], c["huong"], c["ly_do"], c["checkpoint"],
            c["test_avg"], c["dh"], c["btvn"],
            "TRUE", f"{c['date']} 10:05:00", f"{c['date']} 10:00:00",
        ])

    return write_csv("04_NhatKy_ChuyenNhan.csv", headers, rows)


# ============================================================
# GENERATE SHEET 5: XetDuyet_PassMem (NORMALIZED TRANSACTION)
# Solution 1: Removed full_name, class_name, teacher_email. Keep FKs only.
# ============================================================

def generate_xetduyet():
    headers = [
        "review_id", "student_id", "class_id", "teacher_id",
        "pass_mem_group", "test_average", "attendance_pct", "homework_pct",
        "review_status", "gv_decision", "gv_comment", "gv_confirmed_at",
        "deadline", "is_overdue", "escalated_to_lead", "lead_email_sent",
        "created_at",
    ]

    reviews = [
        {
            "student_id": 10162, "class_id": 1159, "teacher_id": 305,
            "group": "Nhóm 1", "test_avg": 51.3, "att": 100, "hw": 100,
            "status": "Chờ GV", "decision": "", "comment": "",
            "confirmed_at": "", "deadline": "2026-08-03",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25823, "class_id": 1006, "teacher_id": 412,
            "group": "Nhóm 2", "test_avg": 55.8, "att": 100, "hw": 100,
            "status": "GV Đồng ý", "decision": "Pass",
            "comment": "HV tiến bộ rõ rệt qua 6 bài test, từ 48→62",
            "confirmed_at": "2026-07-17 09:30:00", "deadline": "2026-07-22",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25826, "class_id": 1006, "teacher_id": 412,
            "group": "Nhóm 2", "test_avg": 55.0, "att": 92, "hw": 95,
            "status": "GV Từ chối", "decision": "Fail",
            "comment": "HV không ổn định, điểm lên xuống thất thường",
            "confirmed_at": "2026-07-18 14:00:00", "deadline": "2026-07-22",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25845, "class_id": 905, "teacher_id": 218,
            "group": "Nhóm 2", "test_avg": 57.2, "att": 95, "hw": 92,
            "status": "Quá hạn → Lead", "decision": "",
            "comment": "",
            "confirmed_at": "", "deadline": "2026-07-17",
            "overdue": "TRUE", "escalated": "TRUE", "lead_sent": "TRUE",
        },
    ]

    rows = []
    for r in reviews:
        rows.append([
            str(uuid.uuid4())[:8],
            r["student_id"], r["class_id"], r["teacher_id"],
            r["group"], r["test_avg"], r["att"], r["hw"],
            r["status"], r["decision"], r["comment"], r["confirmed_at"],
            r["deadline"], r["overdue"], r["escalated"], r["lead_sent"],
            "2026-07-27",
        ])

    return write_csv("05_XetDuyet_PassMem.csv", headers, rows)


# ============================================================
# GENERATE SHEET 6: CauHinh_HeThong
# ============================================================

def generate_cauhinh():
    headers = ["config_key", "config_value", "description", "updated_at", "updated_by"]

    configs = [
        ("nguong_xam_max", "45", "Điểm tối đa nhóm Xám (< giá trị này)", "2026-07-27", "admin"),
        ("nguong_do_min", "45", "Điểm tối thiểu nhóm Đỏ", "2026-07-27", "admin"),
        ("nguong_do_max", "60", "Điểm tối đa nhóm Đỏ (< giá trị này)", "2026-07-27", "admin"),
        ("nguong_vang_min", "60", "Điểm tối thiểu nhóm Vàng (>= giá trị này)", "2026-07-27", "admin"),
        ("pass_dh_min", "90", "ĐH tối thiểu cho Pass chuẩn (>= giá trị này %)", "2026-07-27", "admin"),
        ("pass_btvn_min", "90", "BTVN tối thiểu cho Pass chuẩn (>= giá trị này %)", "2026-07-27", "admin"),
        ("pass_test_avg_min", "60", "TB test tối thiểu cho Pass chuẩn (>= giá trị này)", "2026-07-27", "admin"),
        ("soft_g1_test_min", "50", "Nhóm 1 Pass mềm: TB test min", "2026-07-27", "admin"),
        ("soft_g1_test_max", "55", "Nhóm 1 Pass mềm: TB test max (< giá trị này)", "2026-07-27", "admin"),
        ("soft_g1_dh_min", "100", "Nhóm 1 Pass mềm: ĐH tối thiểu (%)", "2026-07-27", "admin"),
        ("soft_g1_btvn_min", "100", "Nhóm 1 Pass mềm: BTVN tối thiểu (%)", "2026-07-27", "admin"),
        ("soft_g2_test_min", "55", "Nhóm 2 Pass mềm: TB test min", "2026-07-27", "admin"),
        ("soft_g2_test_max", "60", "Nhóm 2 Pass mềm: TB test max (< giá trị này)", "2026-07-27", "admin"),
        ("soft_g2_dh_min", "90", "Nhóm 2 Pass mềm: ĐH tối thiểu (%)", "2026-07-27", "admin"),
        ("soft_g2_btvn_min", "90", "Nhóm 2 Pass mềm: BTVN tối thiểu (%)", "2026-07-27", "admin"),
        ("review_deadline_days", "7", "Số ngày GV phải confirm Pass mềm", "2026-07-27", "admin"),
        ("moc_bao_dong_pct", "40", "Ngưỡng % (Xám+Đỏ) để báo động lớp", "2026-07-27", "admin"),
        ("alert_dh_tut_pct", "80", "Ngưỡng ĐH tuần tụt để cảnh báo (%)", "2026-07-27", "admin"),
        ("alert_btvn_tut_pct", "80", "Ngưỡng BTVN tuần tụt để cảnh báo (%)", "2026-07-27", "admin"),
        ("cheating_test_score", "0", "Điểm test bị cheating tính = bao nhiêu", "2026-07-27", "admin"),
        ("cron_schedule", "0 10 * * *", "Lịch chạy N8N (hàng ngày 10h sáng)", "2026-07-27", "admin"),
        ("course_id_khoi34", "2", "course_id cho Khối 3-4 trên Portal", "2026-07-27", "admin"),
        ("total_tests_per_course", "6", "Tổng số test dự kiến trong khóa", "2026-07-27", "admin"),
        ("test_makeup_rule", "max", "Cách tính điểm thi lại: max / replace / average", "2026-07-27", "admin"),
    ]

    return write_csv("06_CauHinh_HeThong.csv", headers, configs)


# ============================================================
# GENERATE SHEET 7: Log_HeThong
# ============================================================

def generate_log():
    headers = [
        "log_id", "run_id", "timestamp", "workflow_name", "action", "class_id",
        "status", "message", "records_affected", "duration_ms",
    ]

    run_id = str(uuid.uuid4())[:8]
    logs = [
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:00", "WF-01 Data Sync Master", "scrape_data", 1159, "success", "Lấy dữ liệu IC2174 thành công", 21, 3200),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:05", "WF-01 Data Sync Master", "scrape_data", 1006, "success", "Lấy dữ liệu IC2030 thành công", 19, 2800),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:10", "WF-01 Data Sync Master", "scrape_data", 905, "success", "Lấy dữ liệu IC1924 thành công", 19, 2900),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:15", "WF-01b Label Engine", "update_labels", 1159, "success", "Gán nhãn 18 HV", 18, 1500),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:16", "WF-01b Label Engine", "update_labels", 1006, "success", "Gán nhãn 17 HV", 17, 1400),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:17", "WF-01b Label Engine", "update_labels", 905, "success", "Gán nhãn 18 HV", 18, 1300),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:20", "WF-01b Label Engine", "detect_changes", 1159, "success", "Phát hiện 2 HV chuyển nhãn", 2, 800),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:25", "WF-01b Label Engine", "send_email", 1159, "success", "Gửi email cho phuong.tm@izone.edu.vn — 2 HV chuyển nhãn", 1, 2000),
        (str(uuid.uuid4())[:8], run_id, "2026-07-27 10:00:30", "WF-02 Deadline Checker", "check_deadline", "", "warning", "1 review quá hạn: Đặng Minh Trí (IC1924) — đã escalate cho Lead", 1, 500),
    ]

    return write_csv("07_Log_HeThong.csv", headers, logs)


# ============================================================
# GENERATE SHEET 8: GiaoVien
# ============================================================

def generate_giaovien():
    headers = [
        "teacher_id", "teacher_name", "teacher_email",
        "teacher_phone", "khoi_id", "role",
    ]

    rows = []
    for t in TEACHERS:
        rows.append([
            t["teacher_id"], t["teacher_name"], t["teacher_email"],
            t["teacher_phone"], t["khoi_id"], t["role"],
        ])

    return write_csv("08_GiaoVien.csv", headers, rows)


# ============================================================
# GENERATE SHEET 9: Weekly_Snapshot
# ============================================================

def generate_weekly_snapshot():
    headers = [
        "snapshot_id", "class_id", "checkpoint", 
        "attendance_avg", "homework_avg", "pass_chuan_rate", "pass_mem_rate",
        "snapshot_date"
    ]
    
    checkpoints = [
        {"name": "Tuần 1", "date": "2026-06-01"},
        {"name": "Tuần 2", "date": "2026-06-08"},
        {"name": "Test 1", "date": "2026-06-15"},
        {"name": "Tuần 4", "date": "2026-06-22"},
        {"name": "Tuần 5", "date": "2026-06-29"},
        {"name": "Test 2", "date": "2026-07-06"},
    ]
    
    rows = []
    
    # Generate mock history for each class
    for cls, _ in ALL_STUDENTS_RAW:
        base_att = 90 + random.randint(-5, 5)
        base_hw = 85 + random.randint(-5, 5)
        base_pass = 20 + random.randint(-5, 5)
        
        for idx, cp in enumerate(checkpoints):
            att = min(100, max(0, base_att + idx * random.randint(-2, 3)))
            hw = min(100, max(0, base_hw + idx * random.randint(-2, 4)))
            pass_rate = min(100, max(0, base_pass + idx * 7))
            
            rows.append([
                str(uuid.uuid4())[:8],
                cls["class_id"], cp["name"],
                att, hw, pass_rate, round(pass_rate * 0.8, 1),
                cp["date"]
            ])
            
    # Generate for "Toàn Khối" (class_id = "ALL")
    base_att_all = 92
    base_hw_all = 88
    base_pass_all = 25
    for idx, cp in enumerate(checkpoints):
        att = min(100, max(0, base_att_all + idx * random.randint(-1, 2)))
        hw = min(100, max(0, base_hw_all + idx * random.randint(-1, 2)))
        pass_rate = min(100, max(0, base_pass_all + idx * 6))
        rows.append([
            str(uuid.uuid4())[:8],
            "ALL", cp["name"],
            att, hw, pass_rate, round(pass_rate * 0.8, 1),
            cp["date"]
        ])

    return write_csv("09_Weekly_Snapshot.csv", headers, rows)

# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 65)
    print("🏫 IZONE — Tạo Mock Data v3 (FROZEN ARCHITECTURE)")
    print("   Hybrid CQRS & Strict Normalization Implemented (2026-07-27)")
    print("=" * 65)
    print()

    generate_danhsach_lop()
    generate_dulieu_hocvien()
    generate_diem_test()
    generate_nhatky_chuyennhan()
    generate_xetduyet()
    generate_cauhinh()
    generate_log()
    generate_giaovien()
    generate_weekly_snapshot()

    print()
    print("=" * 65)
    print(f"📁 Tất cả file CSV chuẩn đã được tạo tại: {OUTPUT_DIR}")
    print()
    print("🔒 CHỐT CỨNG KIẾN TRÚC (WATERFALL FREEZE):")
    print("  • Giải pháp 1 (Lược bỏ dư thừa): Xóa full_name, class_name khỏi 03, 04, 05.")
    print("    Xóa teacher_email khỏi 04, 05 (chỉ giữ FK student_id, class_id, teacher_id).")
    print("    Xóa test_date khỏi 03 (khớp 100% với thực tế Portal /tests).")
    print("  • Giải pháp 2 (Hybrid CQRS): Khôi phục test_1..test_6 ở Sheet 02 làm")
    print("    Denormalized Read-Only View cho Frontend Dashboard.")
    print("    Sheet 03 đóng vai trò kho Log chi tiết (điểm thi bù, cheating).")
    print("  • Giải pháp 3: Đã chuẩn hóa 8 Sheets khớp mô hình thực thể ERD.")
    print("=" * 65)


if __name__ == "__main__":
    main()

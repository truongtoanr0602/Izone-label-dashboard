#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate mock data CSV files for IZONE Student Labeling System - Khối 3-4
Tạo dữ liệu mẫu để import vào Google Sheets workbook mới.

Mỗi file CSV tương ứng với 1 sheet trong Google Sheets.
"""

import csv
import os
import random
import uuid
from datetime import datetime, timedelta

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
    """Kiểm tra Pass chuẩn: ĐH>90%, BTVN>90%, TB test>=60"""
    if att is None or hw is None or test_avg is None:
        return "Chưa đủ DL", []
    reasons = []
    if att <= 90:
        reasons.append("Đi học ≤90%")
    if hw <= 90:
        reasons.append("BTVN ≤90%")
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
# MOCK DATA: DANH SÁCH LỚP
# ============================================================

CLASSES = [
    {
        "class_id": 1159, "class_name": "IC2174", "course_id": 2,
        "teacher_id": 305, "teacher_name": "Trần Minh Phương",
        "teacher_email": "phuong.tm@izone.edu.vn",
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2026-05-19", "ngay_ket_thuc": "2026-08-25",
        "total_sessions": 28, "completed_sessions": 17,
    },
    {
        "class_id": 1006, "class_name": "IC2030", "course_id": 2,
        "teacher_id": 412, "teacher_name": "Nguyễn Hoàng Anh",
        "teacher_email": "anh.nh@izone.edu.vn",
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2025-12-26", "ngay_ket_thuc": "2026-04-24",
        "total_sessions": 28, "completed_sessions": 28,
    },
    {
        "class_id": 905, "class_name": "IC1924", "course_id": 2,
        "teacher_id": 218, "teacher_name": "Lê Thanh Hà",
        "teacher_email": "ha.lt@izone.edu.vn",
        "status": "on_going", "lich_hoc": "3,6", "dia_diem": "Online",
        "ngay_khai_giang": "2025-09-12", "ngay_ket_thuc": "2025-12-23",
        "total_sessions": 28, "completed_sessions": 28,
    },
]

# ============================================================
# MOCK DATA: HỌC VIÊN (dữ liệu thực tế từ Portal screenshots)
# ============================================================

# Lớp IC2174 — dữ liệu gần sát ảnh portal
STUDENTS_IC2174 = [
    # (name, status, att%, hw%, test1, test2, test3, test4, test5, test6)
    ("Nguyễn Việt Anh",     "on_going", 88, 100, 60.5, 70.0, 70.5, None, None, None),
    ("Hoàng Trần Hải Bằng", "on_going", 100, 94, 67.5, 60.0, 57.5, None, None, None),
    ("Lê Khả Hân",          "on_going", 94, 100, 93.5, 85.0, 91.5, None, None, None),
    ("Lê Ngọc Hiếu",        "on_going", 100, 100, 77.0, 83.1, 71.0, None, None, None),
    ("Nguyễn Trường Huy",   "on_going", 100, 100, 54.0, 70.5, 76.0, None, None, None),
    ("Nguyễn Thu Huyền",    "on_going", 100, 53, 50.0, 47.5, 46.0, None, None, None),
    ("Hồ Thị Lan",          "on_going", 100, 100, 77.0, 71.0, 83.0, None, None, None),
    ("Quang Trần Khánh Linh","on_going", 100, 100, 69.5, 71.0, 65.5, None, None, None),
    ("Phạm Đức Minh",       "on_going", 94, 94, 45.0, 52.0, 48.5, None, None, None),
    ("Trần Thị Mai",        "on_going", 82, 88, 38.0, 42.0, 40.5, None, None, None),
    ("Vũ Hoàng Nam",        "on_going", 100, 100, 72.0, 68.5, 75.0, None, None, None),
    ("Đặng Thùy Linh",     "on_going", 94, 100, 55.5, 58.0, 62.0, None, None, None),
    ("Bùi Quốc Đạt",       "on_going", 76, 71, 35.0, 40.0, 38.0, None, None, None),
    ("Ngô Minh Châu",      "on_going", 100, 94, 82.0, 78.5, 85.0, None, None, None),
    ("Phan Gia Bảo",        "on_going", 88, 94, 58.0, 55.0, 60.0, None, None, None),
    ("Lý Thanh Tùng",       "on_going", 100, 100, 90.0, 88.0, 92.5, None, None, None),
    ("Hoàng Yến Nhi",       "on_going", 94, 88, None, None, None, None, None, None),
    ("Trịnh Văn Hào",       "on_going", 100, 100, 62.0, 65.0, 58.0, None, None, None),
    ("Đỗ Phương Thảo",      "dropped", 47, 35, 25.0, None, None, None, None, None),
]

# Lớp IC2030 — đã hoàn thành (có đủ 6 test)
STUDENTS_IC2030 = [
    ("Trần Quốc Bảo",      "on_going", 95, 100, 72.0, 75.5, 78.0, 80.0, 82.5, 85.0),
    ("Nguyễn Thị Hồng",    "on_going", 100, 100, 65.0, 68.0, 70.5, 72.0, 75.0, 78.0),
    ("Phạm Văn Kiên",      "on_going", 90, 95, 55.0, 58.0, 60.0, 62.0, 65.0, 68.0),
    ("Lê Thị Thanh Trúc",  "on_going", 100, 100, 48.0, 52.0, 55.0, 58.0, 60.0, 62.0),
    ("Hoàng Minh Tuấn",    "on_going", 85, 80, 42.0, 45.0, 43.0, 48.0, 50.0, 52.0),
    ("Vũ Thị Ngọc Ánh",    "on_going", 100, 100, 88.0, 90.0, 85.0, 92.0, 88.5, 91.0),
    ("Đặng Văn Hùng",      "on_going", 92, 95, 50.0, 55.0, 52.0, 58.0, 60.0, 55.0),
    ("Bùi Thị Kim Chi",    "on_going", 78, 82, 35.0, 38.0, 40.0, 42.0, 38.0, 45.0),
    ("Ngô Đình Khoa",      "on_going", 100, 100, 70.0, 72.0, 75.0, 78.0, 80.0, 82.0),
    ("Phan Thị Mỹ Duyên",  "on_going", 95, 90, 60.0, 58.0, 62.0, 55.0, 65.0, 60.0),
    ("Lý Văn Tài",          "on_going", 88, 92, 45.0, 48.0, 50.0, 52.0, 55.0, 53.0),
    ("Trịnh Thị Hồng Nhung","on_going", 100, 100, 52.0, 55.0, 58.0, 60.0, 62.0, 65.0),
    ("Đỗ Mạnh Cường",      "on_going", 95, 95, 75.0, 72.0, 78.0, 80.0, 76.0, 82.0),
    ("Mai Thị Hương Giang", "on_going", 70, 65, 30.0, 32.0, 28.0, 35.0, 30.0, 33.0),
    ("Đinh Công Thành",     "on_going", 92, 95, 58.0, 62.0, 60.0, 65.0, 68.0, 70.0),
    ("Tô Thị Phương Anh",  "on_going", 100, 100, 82.0, 85.0, 80.0, 88.0, 85.0, 90.0),
    ("Võ Minh Đức",         "on_hold", 60, 55, 40.0, 38.0, None, None, None, None),
    ("Hà Thị Bích Ngọc",   "on_going", 95, 100, 68.0, 70.0, 72.0, 75.0, 78.0, 80.0),
    ("Chu Văn Long",        "dropped", 35, 30, 20.0, None, None, None, None, None),
]

# Lớp IC1924
STUDENTS_IC1924 = [
    ("Trương Minh Quân",    "on_going", 100, 100, 80.0, 82.0, 85.0, 78.0, 88.0, 90.0),
    ("Nguyễn Thị Diệu Linh","on_going", 95, 95, 62.0, 65.0, 68.0, 70.0, 72.0, 75.0),
    ("Phạm Hoàng Sơn",     "on_going", 88, 90, 55.0, 52.0, 58.0, 60.0, 55.0, 62.0),
    ("Lê Thị Hồng Vân",    "on_going", 100, 100, 45.0, 50.0, 55.0, 58.0, 60.0, 62.0),
    ("Hoàng Văn Phúc",     "on_going", 82, 78, 38.0, 40.0, 42.0, 45.0, 40.0, 48.0),
    ("Vũ Thị Thu Hà",      "on_going", 100, 100, 92.0, 90.0, 88.0, 95.0, 90.0, 93.0),
    ("Đặng Minh Trí",      "on_going", 95, 92, 50.0, 55.0, 58.0, 60.0, 62.0, 58.0),
    ("Bùi Thị Ngọc Mai",   "on_going", 100, 100, 75.0, 78.0, 80.0, 82.0, 85.0, 88.0),
    ("Ngô Thanh Tâm",      "on_going", 72, 70, 32.0, 35.0, 30.0, 38.0, 35.0, 40.0),
    ("Phan Văn Đức",        "on_going", 100, 100, 70.0, 72.0, 68.0, 75.0, 78.0, 80.0),
    ("Lý Thị Kim Ngân",    "on_going", 95, 95, 58.0, 60.0, 62.0, 65.0, 68.0, 70.0),
    ("Trịnh Hoàng Anh",    "on_going", 90, 88, 48.0, 50.0, 52.0, 48.0, 55.0, 50.0),
    ("Đỗ Văn Lâm",          "on_going", 100, 95, 65.0, 68.0, 70.0, 72.0, 75.0, 72.0),
    ("Mai Thị Thanh Xuân",  "on_going", 88, 90, 42.0, 45.0, 48.0, 50.0, 52.0, 55.0),
    ("Đinh Thị Quỳnh Anh",  "on_going", 100, 100, 85.0, 88.0, 90.0, 92.0, 88.0, 95.0),
    ("Tô Minh Hiếu",       "on_going", 95, 95, 55.0, 58.0, 52.0, 60.0, 55.0, 58.0),
    ("Võ Thị Hạnh",         "on_going", 100, 100, 78.0, 80.0, 82.0, 85.0, 88.0, 85.0),
    ("Hà Quốc Việt",        "on_going", 82, 85, 40.0, 42.0, 45.0, 48.0, 50.0, 52.0),
    ("Chu Thị Minh Thư",   "transferred", 90, 88, 52.0, 55.0, None, None, None, None),
]


ALL_STUDENTS_RAW = [
    (CLASSES[0], STUDENTS_IC2174),
    (CLASSES[1], STUDENTS_IC2030),
    (CLASSES[2], STUDENTS_IC1924),
]


# ============================================================
# GENERATE SHEET 1: DanhSach_Lop
# ============================================================

def generate_danhsach_lop():
    headers = [
        "class_id", "class_name", "course_id", "teacher_id", "teacher_name",
        "teacher_email", "status", "lich_hoc", "dia_diem",
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
        active = [s for s in students if s[1] == "on_going"]
        on_hold = [s for s in students if s[1] == "on_hold"]
        dropped = [s for s in students if s[1] in ("dropped", "drop")]

        # Tính TB ĐH/BTVN cho active students
        att_vals = [s[2] for s in active if s[2] is not None]
        hw_vals = [s[3] for s in active if s[3] is not None]
        att_avg = round(sum(att_vals) / len(att_vals), 1) if att_vals else 0
        hw_avg = round(sum(hw_vals) / len(hw_vals), 1) if hw_vals else 0

        # Tính TB test cho active students
        labels = {"Xám": 0, "Đỏ": 0, "Vàng": 0, "Chưa có DL": 0}
        pass_chuan_count = 0
        pass_mem_count = 0

        for s in active:
            tests = [t for t in s[4:10] if t is not None]
            test_avg = round(sum(tests) / len(tests), 1) if tests else None
            label = gan_nhan(test_avg)
            labels[label] += 1

            # Pass chuẩn
            status_pc, _ = pass_chuan(s[2], s[3], test_avg)
            if status_pc == "Có khả năng pass":
                pass_chuan_count += 1

            # Pass mềm
            status_pm, _, _ = pass_mem(s[2], s[3], test_avg)
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
            cls["teacher_id"], cls["teacher_name"], cls["teacher_email"],
            cls["status"], cls["lich_hoc"], cls["dia_diem"],
            cls["ngay_khai_giang"], cls["ngay_ket_thuc"],
            cls["total_sessions"], cls["completed_sessions"],
            f"{cls['completed_sessions']}/{cls['total_sessions']}",
            n_active, len(on_hold), len(dropped),
            att_avg, hw_avg, tinh_trang,
            labels["Xám"], labels["Đỏ"], labels["Vàng"], labels["Chưa có DL"],
            pct_xam, pct_do, pct_vang,
            moc_bao_dong,
            round(pass_chuan_count / n_active * 100, 1) if n_active else 0,
            round(pass_mem_count / n_active * 100, 1) if n_active else 0,
            f"https://portal.izone.edu.vn/academic-affairs/course-classes/{cls['class_id']}",
            "2026-07-24",
        ])

    return write_csv("01_DanhSach_Lop.csv", headers, rows)


# ============================================================
# GENERATE SHEET 2: DuLieu_HocVien
# ============================================================

def generate_dulieu_hocvien():
    headers = [
        "student_id", "full_name", "class_id", "class_name",
        "registration_status", "admitted_at",
        "attendance_pct", "attendance_present", "attendance_total",
        "homework_pct", "homework_done", "homework_total",
        "test_1", "test_2", "test_3", "test_4", "test_5", "test_6",
        "tests_taken", "test_average",
        "nhan_hien_tai", "nhan_truoc", "nhan_benchmark",
        "co_chuyen_nhan", "huong_chuyen_nhan", "checkpoint_gan_nhan",
        "pass_chuan_status", "pass_chuan_reasons",
        "pass_mem_status", "pass_mem_group", "pass_mem_label",
        "flag_dh_tut", "flag_btvn_tut", "flag_cheating", "flag_can_review",
        "gv_note", "gv_nhan_tam", "scraped_at",
    ]

    rows = []
    student_id_counter = 25800

    for cls, students in ALL_STUDENTS_RAW:
        for s in students:
            student_id_counter += 1
            name, status, att, hw = s[0], s[1], s[2], s[3]
            tests_raw = list(s[4:10])
            tests_valid = [t for t in tests_raw if t is not None]
            tests_taken = len(tests_valid)
            test_avg = round(sum(tests_valid) / tests_taken, 1) if tests_valid else None

            # Nhãn
            nhan = gan_nhan(test_avg)

            # Nhãn benchmark (dựa trên test 1)
            nhan_bm = gan_nhan(tests_raw[0]) if tests_raw[0] is not None else "Chưa có DL"

            # Nhãn trước (giả lập: dùng TB 2 test đầu nếu có)
            if tests_taken >= 2:
                prev_tests = tests_valid[:-1]
                prev_avg = round(sum(prev_tests) / len(prev_tests), 1) if prev_tests else None
                nhan_truoc = gan_nhan(prev_avg)
            else:
                nhan_truoc = nhan_bm

            co_chuyen = "TRUE" if nhan != nhan_truoc else "FALSE"
            if nhan != nhan_truoc:
                huong = f"{nhan_truoc} → {nhan}"
            else:
                huong = "Không đổi"

            checkpoint = f"Test {tests_taken}" if tests_taken > 0 else ""

            # Attendance details
            att_total = cls["completed_sessions"]
            att_present = round(att * att_total / 100) if att else 0
            hw_total = att_total
            hw_done = round(hw * hw_total / 100) if hw else 0

            # Pass chuẩn
            if status == "on_going":
                pc_status, pc_reasons = pass_chuan(att, hw, test_avg)
                pc_reasons_str = "; ".join(pc_reasons) if pc_reasons else ""
            else:
                pc_status, pc_reasons_str = "", ""

            # Pass mềm
            if status == "on_going":
                pm_status, pm_group, pm_label = pass_mem(att, hw, test_avg)
                pm_group = pm_group or ""
                pm_label = pm_label or ""
                pm_status = pm_status or ""
            else:
                pm_status, pm_group, pm_label = "", "", ""

            # Flags
            flag_dh = "TRUE" if att is not None and att < 80 else "FALSE"
            flag_btvn = "TRUE" if hw is not None and hw < 80 else "FALSE"
            flag_cheat = "FALSE"
            flag_review = "TRUE" if pm_group in ("Nhóm 1", "Nhóm 2") and status == "on_going" else "FALSE"

            # GV notes
            gv_note = ""
            gv_nhan_tam = ""
            if nhan == "Chưa có DL" and status == "on_going":
                gv_nhan_tam = "Đỏ"  # GV gán tạm
                gv_note = "HV mới vào, GV gán tạm dựa trên BTVN"

            rows.append([
                student_id_counter, name, cls["class_id"], cls["class_name"],
                status, cls["ngay_khai_giang"],
                att, att_present, att_total,
                hw, hw_done, hw_total,
                tests_raw[0] or "", tests_raw[1] or "", tests_raw[2] or "",
                tests_raw[3] or "", tests_raw[4] or "", tests_raw[5] or "",
                tests_taken, test_avg or "",
                nhan, nhan_truoc, nhan_bm,
                co_chuyen, huong, checkpoint,
                pc_status, pc_reasons_str,
                pm_status, pm_group, pm_label,
                flag_dh, flag_btvn, flag_cheat, flag_review,
                gv_note, gv_nhan_tam, "2026-07-24",
            ])

    return write_csv("02_DuLieu_HocVien.csv", headers, rows)


# ============================================================
# GENERATE SHEET 3: DiemTest_ChiTiet
# ============================================================

def generate_diem_test():
    headers = [
        "student_id", "full_name", "class_id", "class_name",
        "class_test_id", "test_name", "raw_grade", "max_grade",
        "grade_percent", "grade_status", "is_cheating", "grade_note",
        "nhan_tai_thoi_diem", "scraped_at",
    ]

    rows = []
    student_id_counter = 25800
    test_id_counter = 500

    for cls, students in ALL_STUDENTS_RAW:
        for s in students:
            student_id_counter += 1
            name = s[0]
            tests_raw = list(s[4:10])

            cumulative_tests = []
            for i, score in enumerate(tests_raw):
                if score is None:
                    continue
                test_id_counter += 1
                cumulative_tests.append(score)
                cum_avg = round(sum(cumulative_tests) / len(cumulative_tests), 1)
                nhan_at_time = gan_nhan(cum_avg)

                rows.append([
                    student_id_counter, name, cls["class_id"], cls["class_name"],
                    test_id_counter, f"Test {i + 1}", score, 100,
                    score, "confirmed", "FALSE", "",
                    nhan_at_time, "2026-07-24",
                ])

    return write_csv("03_DiemTest_ChiTiet.csv", headers, rows)


# ============================================================
# GENERATE SHEET 4: NhatKy_ChuyenNhan
# ============================================================

def generate_nhatky_chuyennhan():
    headers = [
        "log_id", "student_id", "full_name", "class_id", "class_name",
        "teacher_email",
        "nhan_cu", "nhan_moi", "huong", "ly_do", "checkpoint",
        "test_average_moi", "dh_pct", "btvn_pct",
        "email_sent", "email_sent_at", "created_at",
    ]

    # Tạo mock chuyển nhãn dựa trên data thực
    changes = [
        {
            "student_id": 25805, "full_name": "Nguyễn Trường Huy",
            "class_id": 1159, "class_name": "IC2174",
            "teacher_email": "phuong.tm@izone.edu.vn",
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "TB test tăng lên 66.8 (>=60) sau Test 3",
            "checkpoint": "Test 3", "test_avg": 66.8, "dh": 100, "btvn": 100,
            "date": "2026-07-20",
        },
        {
            "student_id": 25812, "full_name": "Đặng Thùy Linh",
            "class_id": 1159, "class_name": "IC2174",
            "teacher_email": "phuong.tm@izone.edu.vn",
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "Test 3 đạt 62.0, TB test lên 58.5→ 2 test gần nhất >=60",
            "checkpoint": "Test 3", "test_avg": 58.5, "dh": 94, "btvn": 100,
            "date": "2026-07-20",
        },
        {
            "student_id": 25818, "full_name": "Trịnh Văn Hào",
            "class_id": 1159, "class_name": "IC2174",
            "teacher_email": "phuong.tm@izone.edu.vn",
            "nhan_cu": "Vàng", "nhan_moi": "Đỏ",
            "huong": "Xuống", "ly_do": "TB test tụt xuống 61.7 sau Test 3 (Test 3 = 58.0)",
            "checkpoint": "Test 3", "test_avg": 61.7, "dh": 100, "btvn": 100,
            "date": "2026-07-20",
        },
        {
            "student_id": 25823, "full_name": "Phạm Văn Kiên",
            "class_id": 1006, "class_name": "IC2030",
            "teacher_email": "anh.nh@izone.edu.vn",
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "TB test từ Test 1-6 đạt 61.3 (>=60)",
            "checkpoint": "Test 6", "test_avg": 61.3, "dh": 90, "btvn": 95,
            "date": "2026-07-15",
        },
        {
            "student_id": 25824, "full_name": "Lê Thị Thanh Trúc",
            "class_id": 1006, "class_name": "IC2030",
            "teacher_email": "anh.nh@izone.edu.vn",
            "nhan_cu": "Đỏ", "nhan_moi": "Vàng",
            "huong": "Lên", "ly_do": "Tiến bộ đều, TB test 55.8 từ Xám/Đỏ lên dần",
            "checkpoint": "Test 6", "test_avg": 55.8, "dh": 100, "btvn": 100,
            "date": "2026-07-15",
        },
        {
            "student_id": 25849, "full_name": "Hoàng Văn Phúc",
            "class_id": 905, "class_name": "IC1924",
            "teacher_email": "ha.lt@izone.edu.vn",
            "nhan_cu": "Xám", "nhan_moi": "Đỏ",
            "huong": "Lên", "ly_do": "TB test tăng dần từ 38 lên 42.2 nhưng vẫn Xám→ Test 6 đạt 48",
            "checkpoint": "Test 6", "test_avg": 42.2, "dh": 82, "btvn": 78,
            "date": "2026-07-10",
        },
    ]

    rows = []
    for c in changes:
        rows.append([
            str(uuid.uuid4())[:8],
            c["student_id"], c["full_name"], c["class_id"], c["class_name"],
            c["teacher_email"],
            c["nhan_cu"], c["nhan_moi"], c["huong"], c["ly_do"], c["checkpoint"],
            c["test_avg"], c["dh"], c["btvn"],
            "TRUE", f"{c['date']} 10:05:00", f"{c['date']} 10:00:00",
        ])

    return write_csv("04_NhatKy_ChuyenNhan.csv", headers, rows)


# ============================================================
# GENERATE SHEET 5: XetDuyet_PassMem
# ============================================================

def generate_xetduyet():
    headers = [
        "review_id", "student_id", "full_name", "class_id", "class_name",
        "teacher_id", "teacher_email",
        "pass_mem_group", "test_average", "attendance_pct", "homework_pct",
        "review_status", "gv_decision", "gv_comment", "gv_confirmed_at",
        "deadline", "is_overdue", "escalated_to_lead", "lead_email_sent",
        "created_at",
    ]

    reviews = [
        {
            "student_id": 25809, "full_name": "Phạm Đức Minh",
            "class_id": 1159, "class_name": "IC2174",
            "teacher_id": 305, "teacher_email": "phuong.tm@izone.edu.vn",
            "group": "Nhóm 1", "test_avg": 48.5, "att": 94, "hw": 94,
            "status": "Chờ GV", "decision": "", "comment": "",
            "confirmed_at": "", "deadline": "2026-07-31",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25824, "full_name": "Lê Thị Thanh Trúc",
            "class_id": 1006, "class_name": "IC2030",
            "teacher_id": 412, "teacher_email": "anh.nh@izone.edu.vn",
            "group": "Nhóm 2", "test_avg": 55.8, "att": 100, "hw": 100,
            "status": "GV Đồng ý", "decision": "Pass",
            "comment": "HV tiến bộ rõ rệt qua 6 bài test, từ 48→62",
            "confirmed_at": "2026-07-17 09:30:00", "deadline": "2026-07-22",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25827, "full_name": "Đặng Văn Hùng",
            "class_id": 1006, "class_name": "IC2030",
            "teacher_id": 412, "teacher_email": "anh.nh@izone.edu.vn",
            "group": "Nhóm 2", "test_avg": 55.0, "att": 92, "hw": 95,
            "status": "GV Từ chối", "decision": "Fail",
            "comment": "HV không ổn định, điểm lên xuống thất thường",
            "confirmed_at": "2026-07-18 14:00:00", "deadline": "2026-07-22",
            "overdue": "FALSE", "escalated": "FALSE", "lead_sent": "FALSE",
        },
        {
            "student_id": 25851, "full_name": "Đặng Minh Trí",
            "class_id": 905, "class_name": "IC1924",
            "teacher_id": 218, "teacher_email": "ha.lt@izone.edu.vn",
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
            r["student_id"], r["full_name"], r["class_id"], r["class_name"],
            r["teacher_id"], r["teacher_email"],
            r["group"], r["test_avg"], r["att"], r["hw"],
            r["status"], r["decision"], r["comment"], r["confirmed_at"],
            r["deadline"], r["overdue"], r["escalated"], r["lead_sent"],
            "2026-07-24",
        ])

    return write_csv("05_XetDuyet_PassMem.csv", headers, rows)


# ============================================================
# GENERATE SHEET 6: CauHinh_HeThong
# ============================================================

def generate_cauhinh():
    headers = ["config_key", "config_value", "description", "updated_at", "updated_by"]

    configs = [
        ("nguong_xam_max", "45", "Điểm tối đa nhóm Xám (< giá trị này)", "2026-07-24", "admin"),
        ("nguong_do_min", "45", "Điểm tối thiểu nhóm Đỏ", "2026-07-24", "admin"),
        ("nguong_do_max", "60", "Điểm tối đa nhóm Đỏ (< giá trị này)", "2026-07-24", "admin"),
        ("nguong_vang_min", "60", "Điểm tối thiểu nhóm Vàng (>= giá trị này)", "2026-07-24", "admin"),
        ("pass_dh_min", "90", "ĐH tối thiểu cho Pass chuẩn (> giá trị này %)", "2026-07-24", "admin"),
        ("pass_btvn_min", "90", "BTVN tối thiểu cho Pass chuẩn (> giá trị này %)", "2026-07-24", "admin"),
        ("pass_test_avg_min", "60", "TB test tối thiểu cho Pass chuẩn (>= giá trị này)", "2026-07-24", "admin"),
        ("soft_g1_test_min", "50", "Nhóm 1 Pass mềm: TB test min", "2026-07-24", "admin"),
        ("soft_g1_test_max", "55", "Nhóm 1 Pass mềm: TB test max (< giá trị này)", "2026-07-24", "admin"),
        ("soft_g1_dh_min", "100", "Nhóm 1 Pass mềm: ĐH tối thiểu (%)", "2026-07-24", "admin"),
        ("soft_g1_btvn_min", "100", "Nhóm 1 Pass mềm: BTVN tối thiểu (%)", "2026-07-24", "admin"),
        ("soft_g2_test_min", "55", "Nhóm 2 Pass mềm: TB test min", "2026-07-24", "admin"),
        ("soft_g2_test_max", "60", "Nhóm 2 Pass mềm: TB test max (< giá trị này)", "2026-07-24", "admin"),
        ("soft_g2_dh_min", "90", "Nhóm 2 Pass mềm: ĐH tối thiểu (%)", "2026-07-24", "admin"),
        ("soft_g2_btvn_min", "90", "Nhóm 2 Pass mềm: BTVN tối thiểu (%)", "2026-07-24", "admin"),
        ("review_deadline_days", "7", "Số ngày GV phải confirm Pass mềm", "2026-07-24", "admin"),
        ("moc_bao_dong_pct", "40", "Ngưỡng % (Xám+Đỏ) để báo động lớp", "2026-07-24", "admin"),
        ("alert_dh_tut_pct", "80", "Ngưỡng ĐH tuần tụt để cảnh báo (%)", "2026-07-24", "admin"),
        ("alert_btvn_tut_pct", "80", "Ngưỡng BTVN tuần tụt để cảnh báo (%)", "2026-07-24", "admin"),
        ("cheating_test_score", "0", "Điểm test bị cheating tính = bao nhiêu", "2026-07-24", "admin"),
        ("cron_schedule", "0 10 * * *", "Lịch chạy N8N (hàng ngày 10h sáng)", "2026-07-24", "admin"),
        ("course_id_khoi34", "2", "course_id cho Khối 3-4 trên Portal", "2026-07-24", "admin"),
    ]

    return write_csv("06_CauHinh_HeThong.csv", headers, configs)


# ============================================================
# GENERATE SHEET 7: Log_HeThong
# ============================================================

def generate_log():
    headers = [
        "timestamp", "workflow_name", "action", "class_id",
        "status", "message", "records_affected",
    ]

    logs = [
        ("2026-07-24 10:00:00", "Cập nhật dữ liệu các lớp 34", "scrape_data", 1159, "success", "Lấy dữ liệu IC2174 thành công", 18),
        ("2026-07-24 10:00:05", "Cập nhật dữ liệu các lớp 34", "scrape_data", 1006, "success", "Lấy dữ liệu IC2030 thành công", 19),
        ("2026-07-24 10:00:10", "Cập nhật dữ liệu các lớp 34", "scrape_data", 905, "success", "Lấy dữ liệu IC1924 thành công", 19),
        ("2026-07-24 10:00:15", "Cập nhật dữ liệu các lớp 34", "update_labels", 1159, "success", "Gán nhãn 18 HV: 2 Xám, 4 Đỏ, 11 Vàng, 1 Chưa có DL", 18),
        ("2026-07-24 10:00:16", "Cập nhật dữ liệu các lớp 34", "update_labels", 1006, "success", "Gán nhãn 17 HV: 2 Xám, 3 Đỏ, 12 Vàng", 17),
        ("2026-07-24 10:00:17", "Cập nhật dữ liệu các lớp 34", "update_labels", 905, "success", "Gán nhãn 18 HV: 2 Xám, 4 Đỏ, 12 Vàng", 18),
        ("2026-07-24 10:00:20", "Cập nhật dữ liệu các lớp 34", "detect_changes", 1159, "success", "Phát hiện 3 HV chuyển nhãn", 3),
        ("2026-07-24 10:00:25", "Cập nhật dữ liệu các lớp 34", "send_email", 1159, "success", "Gửi email cho phuong.tm@izone.edu.vn — 3 HV chuyển nhãn", 1),
        ("2026-07-24 10:00:30", "Cập nhật dữ liệu các lớp 34", "check_attendance", 1159, "warning", "Phát hiện 2 HV có ĐH < 80%: Trần Thị Mai (82%), Bùi Quốc Đạt (76%)", 2),
        ("2026-07-24 10:00:35", "Cập nhật dữ liệu các lớp 34", "check_deadline", "", "warning", "1 review quá hạn: Đặng Minh Trí (IC1924) — đã escalate cho Lead", 1),
    ]

    return write_csv("07_Log_HeThong.csv", headers, logs)


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 60)
    print("🏫 IZONE — Tạo Mock Data cho Google Sheets Khối 3-4")
    print("=" * 60)
    print()

    generate_danhsach_lop()
    generate_dulieu_hocvien()
    generate_diem_test()
    generate_nhatky_chuyennhan()
    generate_xetduyet()
    generate_cauhinh()
    generate_log()

    print()
    print("=" * 60)
    print(f"📁 Tất cả file CSV đã được tạo tại: {OUTPUT_DIR}")
    print()
    print("📋 Hướng dẫn import vào Google Sheets:")
    print("  1. Tạo Google Sheets workbook mới")
    print("  2. Với mỗi file CSV:")
    print("     a. Tạo sheet mới (đặt tên theo file)")
    print("     b. File → Import → Upload → chọn file CSV")
    print("     c. Chọn 'Insert new sheet' hoặc 'Replace current sheet'")
    print("     d. Separator: Comma")
    print("  3. Xóa sheet mặc định 'Sheet1' nếu không dùng")
    print("=" * 60)


if __name__ == "__main__":
    main()

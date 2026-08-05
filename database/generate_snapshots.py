#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate 60 days of daily snapshot data for PostgreSQL trend charts.
Uses the same archetype logic as the TypeScript mock generator.

Generates:
- class_daily_snapshots: 60 days × 3 classes = 180 rows
- student_daily_records: 60 days × 59 students (active only) = ~3,000 rows
- test_scores: realistic test score events
- label_change_logs: label transitions when tests happen
"""

import math
import random
import os
from datetime import datetime, timedelta

# ============================================================
# CONFIG
# ============================================================

# 60 ngày: từ 07/06/2026 → 05/08/2026 (ngày hiện tại)
START_DATE = datetime(2026, 6, 7)
END_DATE   = datetime(2026, 8, 5)
TOTAL_DAYS = (END_DATE - START_DATE).days + 1  # 60 days

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "database", "migrations")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# CLASS & STUDENT CONFIG (from seed data)
# ============================================================

CLASSES = [
    {
        "class_id": 1159, "class_name": "IC2174", "teacher_id": 305,
        "total_sessions": 27, "opening_date": "2026-05-19",
        "archetype": "declining",  # declining class
        "ability_mean": 64, "ability_spread": 12, "diligence": 0.92,
        "trend_per_week": -0.3,
    },
    {
        "class_id": 1006, "class_name": "IC2030", "teacher_id": 412,
        "total_sessions": 28, "opening_date": "2025-12-26",
        "archetype": "average",
        "ability_mean": 67, "ability_spread": 10, "diligence": 0.94,
        "trend_per_week": 0.2,
    },
    {
        "class_id": 905, "class_name": "IC1924", "teacher_id": 218,
        "total_sessions": 28, "opening_date": "2025-09-12",
        "archetype": "average",
        "ability_mean": 67, "ability_spread": 10, "diligence": 0.94,
        "trend_per_week": 0.1,
    },
]

# Students grouped by class (from seed data)
STUDENTS_BY_CLASS = {
    1159: [18972,17759,18717,18496,19428,19465,19352,18292,18381,10377,
           10162,17958,19483,19384,16497,19346,17953,18782],  # 18 active
    1006: [25820,25821,25822,25823,25824,25825,25826,25827,25828,25829,
           25830,25831,25832,25833,25834,25835,25837],  # 17 active (excl on_hold, dropped)
    905:  [25839,25840,25841,25842,25843,25844,25845,25846,25847,25848,
           25849,25850,25851,25852,25853,25854,25855,25856],  # 18 active
}

# Test schedule: sessions where tests happen
TEST_SESSIONS = [4, 8, 12, 16, 20, 24]

# Label thresholds
def gan_nhan(avg):
    if avg is None: return "Chưa có DL"
    if avg < 45: return "Xám"
    if avg < 60: return "Đỏ"
    return "Vàng"

def nhan_code(vn_label):
    """Convert Vietnamese label to code used in dashboard"""
    m = {"Vàng": "yellow", "Đỏ": "red", "Xám": "grey", "Chưa có DL": "no_data"}
    return m.get(vn_label, "no_data")

# ============================================================
# STUDENT ABILITY PROFILES (deterministic per student)
# ============================================================

def generate_student_profiles():
    """Generate stable ability profiles for each student."""
    profiles = {}
    random.seed(42)  # deterministic

    for cls in CLASSES:
        class_id = cls["class_id"]
        students = STUDENTS_BY_CLASS[class_id]
        mean = cls["ability_mean"]
        spread = cls["ability_spread"]

        for i, sid in enumerate(students):
            # Each student has a base ability that varies around class mean
            base_ability = mean + random.gauss(0, spread)
            base_ability = max(20, min(95, base_ability))

            # Attendance and homework (high for this school, 85-100%)
            att_base = cls["diligence"] * 100 + random.gauss(0, 4)
            att_base = max(60, min(100, att_base))
            hw_base = cls["diligence"] * 100 + random.gauss(0, 5)
            hw_base = max(50, min(100, hw_base))

            profiles[sid] = {
                "class_id": class_id,
                "ability": base_ability,
                "att_base": att_base,
                "hw_base": hw_base,
                "trend": cls["trend_per_week"],
            }

    return profiles

# ============================================================
# GENERATE DAILY DATA
# ============================================================

def generate_all():
    random.seed(2026)
    profiles = generate_student_profiles()

    class_snapshots = []   # SQL statements
    student_records = []
    test_scores_sql = []
    label_changes_sql = []

    # Track test history per student for cumulative average
    student_test_history = {sid: [] for sid in profiles}
    student_prev_label = {sid: "no_data" for sid in profiles}

    for day_offset in range(TOTAL_DAYS):
        current_date = START_DATE + timedelta(days=day_offset)
        date_str = current_date.strftime("%Y-%m-%d")
        week_number = day_offset // 7 + 1

        for cls in CLASSES:
            class_id = cls["class_id"]
            students = STUDENTS_BY_CLASS[class_id]
            opening = datetime.strptime(cls["opening_date"], "%Y-%m-%d")

            # Calculate completed sessions for this date
            days_since_open = (current_date - opening).days
            weeks_since_open = max(0, days_since_open / 7)
            sessions_per_week = 2
            completed_sessions = min(
                cls["total_sessions"],
                max(0, int(weeks_since_open * sessions_per_week))
            )

            # Determine how many tests have happened
            tests_completed = len([s for s in TEST_SESSIONS if s <= completed_sessions])

            # Check if a new test just happened today (roughly)
            prev_date = current_date - timedelta(days=1)
            prev_days = (prev_date - opening).days
            prev_sessions = min(cls["total_sessions"], max(0, int(prev_days / 7 * sessions_per_week)))
            prev_tests = len([s for s in TEST_SESSIONS if s <= prev_sessions])
            new_test_today = tests_completed > prev_tests

            # --- Per-student calculations for this day ---
            label_counts = {"yellow": 0, "red": 0, "grey": 0, "no_data": 0}
            att_sum, hw_sum = 0, 0
            pass_chuan_count, pass_mem_count = 0, 0
            n_active = len(students)

            for sid in students:
                prof = profiles[sid]
                trend_bonus = prof["trend"] * week_number

                # Daily wobble for attendance/homework
                att_pct = round(min(100, max(0, prof["att_base"] + random.gauss(0, 1.5) + trend_bonus * 0.1)), 1)
                hw_pct = round(min(100, max(0, prof["hw_base"] + random.gauss(0, 2) + trend_bonus * 0.1)), 1)
                att_present = round(att_pct * completed_sessions / 100)
                hw_done = round(hw_pct * completed_sessions / 100)

                att_sum += att_pct
                hw_sum += hw_pct

                # Generate test score if new test today
                if new_test_today and tests_completed <= 6:
                    test_order = tests_completed
                    # Score based on ability + trend + noise
                    difficulty_offsets = [0, 2, -8, -1, 1, -2]
                    difficulty = difficulty_offsets[test_order - 1] if test_order <= 6 else 0
                    score = prof["ability"] + trend_bonus + difficulty + random.gauss(0, 7)
                    score = round(max(10, min(100, score)), 1)

                    student_test_history[sid].append(score)

                    test_scores_sql.append(
                        f"({sid}, {class_id}, {test_order}, "
                        f"'Test {test_order}', {score}, 100, {score}, "
                        f"FALSE, NULL, {score}, 'confirmed', FALSE, NULL, "
                        f"'{gan_nhan(sum(student_test_history[sid])/len(student_test_history[sid]))}', "
                        f"'{date_str}')"
                    )

                # Calculate current test average
                tests = student_test_history[sid]
                tests_taken = len(tests)
                test_avg = round(sum(tests) / len(tests), 2) if tests else None

                # Test scores for denormalized columns
                t1 = tests[0] if len(tests) > 0 else "NULL"
                t2 = tests[1] if len(tests) > 1 else "NULL"
                t3 = tests[2] if len(tests) > 2 else "NULL"
                t4 = tests[3] if len(tests) > 3 else "NULL"
                t5 = tests[4] if len(tests) > 4 else "NULL"
                t6 = tests[5] if len(tests) > 5 else "NULL"

                # Label
                current_label = nhan_code(gan_nhan(test_avg))
                prev_label = student_prev_label[sid]
                has_changed = current_label != prev_label and prev_label != "no_data" and current_label != "no_data"
                direction = "'same'"
                if has_changed:
                    order = {"grey": 0, "red": 1, "yellow": 2, "no_data": -1}
                    direction = "'up'" if order.get(current_label, -1) > order.get(prev_label, -1) else "'down'"

                    # Label change log
                    sev = "'recovery'" if direction == "'up'" else "'warning'"
                    label_changes_sql.append(
                        f"({sid}, {class_id}, {cls['teacher_id']}, "
                        f"'{prev_label}', '{current_label}', {direction}, {sev}, "
                        f"1, 'TB test thay đổi sau Test {tests_taken}', 'Test {tests_taken}', "
                        f"{test_avg if test_avg else 'NULL'}, {att_pct}, {hw_pct}, "
                        f"TRUE, '{date_str}')"
                    )

                label_counts[current_label] += 1
                student_prev_label[sid] = current_label

                # Benchmark label (first test)
                bm_label = nhan_code(gan_nhan(tests[0])) if tests else "no_data"

                # Pass calculations
                pass_chuan = "Chưa đủ DL"
                pass_chuan_reasons = ""
                pass_mem = ""
                pass_mem_group = ""
                if test_avg is not None:
                    reasons = []
                    if att_pct < 90: reasons.append("ĐH<90%")
                    if hw_pct < 90: reasons.append("BTVN<90%")
                    if test_avg < 60: reasons.append("TB test<60")
                    if not reasons:
                        pass_chuan = "Có khả năng pass"
                        pass_chuan_count += 1
                    else:
                        pass_chuan = "Chưa đạt điều kiện pass"
                        pass_chuan_reasons = "; ".join(reasons)

                    if test_avg >= 60:
                        pass_mem = "Đạt pass mềm"
                        pass_mem_group = "Nhóm 3"
                        pass_mem_count += 1
                    elif test_avg >= 55 and att_pct >= 90 and hw_pct >= 90:
                        pass_mem = "Đạt pass mềm"
                        pass_mem_group = "Nhóm 2"
                        pass_mem_count += 1
                    elif test_avg >= 50 and att_pct >= 100 and hw_pct >= 100:
                        pass_mem = "Đạt pass mềm"
                        pass_mem_group = "Nhóm 1"
                        pass_mem_count += 1

                # Flags
                flag_att = "TRUE" if att_pct < 80 else "FALSE"
                flag_hw = "TRUE" if hw_pct < 80 else "FALSE"
                flag_review = "TRUE" if pass_mem_group in ("Nhóm 1", "Nhóm 2") else "FALSE"

                test_avg_sql = test_avg if test_avg else "NULL"
                checkpoint = f"Test {tests_taken}" if tests_taken > 0 else ""

                student_records.append(
                    f"({sid}, {class_id}, '{date_str}', "
                    f"{att_pct}, {att_present}, {completed_sessions}, "
                    f"{hw_pct}, {hw_done}, {completed_sessions}, "
                    f"{t1}, {t2}, {t3}, {t4}, {t5}, {t6}, "
                    f"{tests_taken}, {test_avg_sql}, "
                    f"'{current_label}', '{prev_label}', '{bm_label}', "
                    f"{str(has_changed).upper()}, {direction}, '{checkpoint}', "
                    f"'{pass_chuan}', '{pass_chuan_reasons}', "
                    f"'{pass_mem}', '{pass_mem_group}', '', "
                    f"{flag_att}, {flag_hw}, FALSE, {flag_review}, "
                    f"'{date_str}')"
                )

            # --- Class snapshot for this day ---
            att_avg = round(att_sum / n_active, 2) if n_active else 0
            hw_avg = round(hw_sum / n_active, 2) if n_active else 0
            pass_chuan_rate = round(pass_chuan_count / n_active * 100, 2) if n_active else 0
            pass_mem_rate = round(pass_mem_count / n_active * 100, 2) if n_active else 0
            risk_pct = round((label_counts["grey"] + label_counts["red"]) / n_active * 100, 2) if n_active else 0
            is_alarm = "TRUE" if risk_pct >= 40 else "FALSE"

            health = "Bình thường"
            if att_avg < 70 or hw_avg < 70:
                health = "Xử lý gấp"
            elif att_avg <= 80 or hw_avg <= 80:
                health = "Cần theo dõi"

            class_snapshots.append(
                f"({class_id}, '{date_str}', {completed_sessions}, "
                f"{n_active}, 0, 0, 0, "
                f"{att_avg}, {hw_avg}, {pass_chuan_rate}, {pass_mem_rate}, "
                f"{label_counts['yellow']}, {label_counts['red']}, "
                f"{label_counts['grey']}, {label_counts['no_data']}, "
                f"{risk_pct}, {is_alarm}, '{health}')"
            )

    return class_snapshots, student_records, test_scores_sql, label_changes_sql


def main():
    print("=" * 65)
    print("🏫 IZONE — Generating 60-day snapshot data for PostgreSQL")
    print("=" * 65)

    class_snaps, student_recs, test_scores, label_changes = generate_all()

    print(f"  📊 class_daily_snapshots: {len(class_snaps)} rows")
    print(f"  👤 student_daily_records: {len(student_recs)} rows")
    print(f"  📝 test_scores: {len(test_scores)} rows")
    print(f"  🏷️  label_change_logs: {len(label_changes)} rows")

    # Write SQL file
    filepath = os.path.join(OUTPUT_DIR, "003_snapshot_data.sql")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("-- ============================================================\n")
        f.write("-- IZONE — 60-day Snapshot Data for Trend Charts\n")
        f.write(f"-- Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"-- Period: {START_DATE.strftime('%Y-%m-%d')} → {END_DATE.strftime('%Y-%m-%d')}\n")
        f.write("-- ============================================================\n\n")
        f.write("SET search_path TO izone, public;\n\n")

        # Delete existing sample snapshot from seed data
        f.write("-- Remove sample snapshot from seed data\n")
        f.write("DELETE FROM class_daily_snapshots;\n")
        f.write("DELETE FROM student_daily_records;\n")
        f.write("DELETE FROM test_scores;\n")
        f.write("DELETE FROM label_change_logs;\n\n")

        # Class snapshots
        f.write("-- ============================================================\n")
        f.write(f"-- CLASS DAILY SNAPSHOTS ({len(class_snaps)} rows)\n")
        f.write("-- ============================================================\n\n")
        f.write("INSERT INTO class_daily_snapshots (\n")
        f.write("    class_id, snapshot_date, completed_sessions,\n")
        f.write("    active_students, on_hold_students, dropped_students, transferred_students,\n")
        f.write("    attendance_avg, homework_avg, pass_chuan_rate, pass_mem_rate,\n")
        f.write("    label_yellow, label_red, label_grey, label_no_data,\n")
        f.write("    risk_pct, is_alarm_triggered, health_status\n")
        f.write(") VALUES\n")
        # Write in batches of 50 to avoid huge statements
        batch_size = 50
        for i in range(0, len(class_snaps), batch_size):
            batch = class_snaps[i:i+batch_size]
            f.write(",\n".join(batch))
            if i + batch_size < len(class_snaps):
                f.write(";\n\nINSERT INTO class_daily_snapshots (\n")
                f.write("    class_id, snapshot_date, completed_sessions,\n")
                f.write("    active_students, on_hold_students, dropped_students, transferred_students,\n")
                f.write("    attendance_avg, homework_avg, pass_chuan_rate, pass_mem_rate,\n")
                f.write("    label_yellow, label_red, label_grey, label_no_data,\n")
                f.write("    risk_pct, is_alarm_triggered, health_status\n")
                f.write(") VALUES\n")
        f.write(";\n\n")

        # Test scores
        if test_scores:
            f.write("-- ============================================================\n")
            f.write(f"-- TEST SCORES ({len(test_scores)} rows)\n")
            f.write("-- ============================================================\n\n")
            f.write("INSERT INTO test_scores (\n")
            f.write("    student_id, class_id, test_order,\n")
            f.write("    test_name, raw_score, max_score, grade_percent,\n")
            f.write("    is_makeup, makeup_score, final_score, grade_status, is_cheating, grade_note,\n")
            f.write("    label_at_time, scraped_at\n")
            f.write(") VALUES\n")
            for i in range(0, len(test_scores), batch_size):
                batch = test_scores[i:i+batch_size]
                f.write(",\n".join(batch))
                if i + batch_size < len(test_scores):
                    f.write(";\n\nINSERT INTO test_scores (\n")
                    f.write("    student_id, class_id, test_order,\n")
                    f.write("    test_name, raw_score, max_score, grade_percent,\n")
                    f.write("    is_makeup, makeup_score, final_score, grade_status, is_cheating, grade_note,\n")
                    f.write("    label_at_time, scraped_at\n")
                    f.write(") VALUES\n")
            f.write(";\n\n")

        # Label changes
        if label_changes:
            f.write("-- ============================================================\n")
            f.write(f"-- LABEL CHANGE LOGS ({len(label_changes)} rows)\n")
            f.write("-- ============================================================\n\n")
            f.write("INSERT INTO label_change_logs (\n")
            f.write("    student_id, class_id, teacher_id,\n")
            f.write("    from_label, to_label, direction, severity,\n")
            f.write("    step_count, reason, checkpoint,\n")
            f.write("    test_average_after, attendance_pct, homework_pct,\n")
            f.write("    email_sent, created_at\n")
            f.write(") VALUES\n")
            for i in range(0, len(label_changes), batch_size):
                batch = label_changes[i:i+batch_size]
                f.write(",\n".join(batch))
                if i + batch_size < len(label_changes):
                    f.write(";\n\nINSERT INTO label_change_logs (\n")
                    f.write("    student_id, class_id, teacher_id,\n")
                    f.write("    from_label, to_label, direction, severity,\n")
                    f.write("    step_count, reason, checkpoint,\n")
                    f.write("    test_average_after, attendance_pct, homework_pct,\n")
                    f.write("    email_sent, created_at\n")
                    f.write(") VALUES\n")
            f.write(";\n\n")

        # Student records
        f.write("-- ============================================================\n")
        f.write(f"-- STUDENT DAILY RECORDS ({len(student_recs)} rows)\n")
        f.write("-- ============================================================\n\n")
        for i in range(0, len(student_recs), batch_size):
            batch = student_recs[i:i+batch_size]
            f.write("INSERT INTO student_daily_records (\n")
            f.write("    student_id, class_id, record_date,\n")
            f.write("    attendance_pct, attendance_present, attendance_total,\n")
            f.write("    homework_pct, homework_done, homework_total,\n")
            f.write("    test_1, test_2, test_3, test_4, test_5, test_6,\n")
            f.write("    tests_taken, test_average,\n")
            f.write("    current_label, previous_label, benchmark_label,\n")
            f.write("    has_label_changed, label_change_direction, last_checkpoint,\n")
            f.write("    pass_chuan_status, pass_chuan_reasons,\n")
            f.write("    pass_mem_status, pass_mem_group, pass_mem_label,\n")
            f.write("    flag_attendance_drop, flag_homework_drop, flag_cheating, flag_needs_review,\n")
            f.write("    scraped_at\n")
            f.write(") VALUES\n")
            f.write(",\n".join(batch))
            f.write(";\n\n")

        f.write("-- ============================================================\n")
        f.write("-- DONE — All snapshot data loaded\n")
        f.write("-- ============================================================\n")

    print(f"\n  ✅ File saved: {filepath}")
    print(f"  📁 Total SQL size: {os.path.getsize(filepath) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

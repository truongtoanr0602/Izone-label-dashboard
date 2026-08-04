# ARCHITECTURE.md

Hạ tầng dữ liệu của hệ thống **Dán nhãn / Phân loại HV / Auto Pass-Fail** của IZONE, và cách dashboard này tiêu thụ nó.

Nguồn: `docs/infrastructure/IZONE — Phân nhãn HV.xlsx` (9 sheet, 8175 cell, snapshot `scraped_at = 2026-07-27`), đối chiếu với hai meeting report trong `docs/general information/`. Mọi con số và quy tắc dưới đây đã được **verify trực tiếp trên dữ liệu**, không phải suy đoán từ tên cột.

> Đường dẫn trong doc này tính từ `Transfer-labels-izone/` (thư mục cha của repo dashboard).

---

## 1. Kiến trúc ba lớp

```
┌──────────────────────┐   HTTP Request (JSON)      ┌──────────────────────┐
│  Portal / LMS IZONE  │ ─────────────────────────► │        n8n           │
│ portal.izone.edu.vn  │   cron: 0 10 * * *         │  (engine xử lý)      │
│  /academic-affairs/  │   (hàng ngày 10h sáng)     │                      │
│   course-classes/:id │                            │  WF-01  Data Sync    │
└──────────────────────┘                            │  WF-01b Label Engine │
                                                    │  WF-02  Deadline Chk │
                                                    └──────────┬───────────┘
                                                               │ read/write
                                                               ▼
┌──────────────────────┐   webhook (GV bấm nút)     ┌──────────────────────┐
│  GitHub Pages        │ ─────────────────────────► │   Google Sheets      │
│  (dashboard này)     │ ◄───────────────────────── │  "IZONE — Phân nhãn  │
│  base: /Izone-label- │   query dữ liệu            │   HV"  (9 sheet)      │
│        dashboard/    │                            │  = database          │
└──────────────────────┘                            └──────────────────────┘
                                                               │
                                                               ▼ email
                                                    GV + cc Lead khối
```

**Vì sao thiết kế như vậy** (chốt trong meeting 2026-07-23):

- **Không dùng SQL** — Google Sheets được chọn có chủ đích để nghiệp vụ tự tinh chỉnh được, đúng quy mô dự án (3 lớp, ~60 HV/khối).
- **Không có real-time trigger** — IZONE không có quyền cài event trigger trên portal của bên thứ ba, nên bắt buộc quét theo cron hàng ngày. **Đây là đánh đổi đã được chấp nhận**: cảnh báo tới GV luôn có độ trễ tối đa 24h. Đừng thiết kế UI hứa hẹn "real-time".
- **Dashboard là read-mostly** — GV không bao giờ sửa Sheets trực tiếp. Chỉ đọc, và ghi đúng một thứ: quyết định Pass mềm (`05_XetDuyet_PassMem`) qua webhook về n8n.

Mỗi khối (Khối 3-4, `course_id = 2`) có công thức phân loại riêng → sẽ có luồng n8n riêng. Config hiện tại chỉ phủ Khối 34 (`course_id_khoi34 = 2`).

---

## 2. Quan hệ giữa 9 sheet

```mermaid
erDiagram
    08_GiaoVien      ||--o{ 01_DanhSach_Lop      : "teacher_id"
    01_DanhSach_Lop  ||--o{ 02_DuLieu_HocVien    : "class_id"
    01_DanhSach_Lop  ||--o{ 09_Weekly_Snapshot   : "class_id (+ 'ALL')"
    01_DanhSach_Lop  ||--o{ 07_Log_HeThong       : "class_id"
    02_DuLieu_HocVien ||--o{ 03_DiemTest_ChiTiet : "student_id + class_id"
    02_DuLieu_HocVien ||--o{ 04_NhatKy_ChuyenNhan: "student_id"
    02_DuLieu_HocVien ||--o| 05_XetDuyet_PassMem : "student_id (khi flag_can_review)"
    06_CauHinh_HeThong }o--|| 02_DuLieu_HocVien  : "cung cấp ngưỡng tính toán"
```

Phân loại theo vai trò:

| Nhóm | Sheet | Bản chất |
|---|---|---|
| **Master / dimension** | `08_GiaoVien`, `01_DanhSach_Lop` | Danh mục, cardinality thấp, đổi chậm |
| **Fact — snapshot** | `02_DuLieu_HocVien` | **Bảng trung tâm.** 1 dòng = 1 HV trong 1 lớp, ghi đè mỗi lần cron chạy |
| **Fact — chi tiết** | `03_DiemTest_ChiTiet` | 1 dòng = 1 lượt thi. Grain mịn nhất |
| **Fact — event log** | `04_NhatKy_ChuyenNhan`, `07_Log_HeThong` | Append-only, có timestamp |
| **Workflow state** | `05_XetDuyet_PassMem` | Có trạng thái, được GV ghi vào |
| **Time series** | `09_Weekly_Snapshot` | Lịch sử theo checkpoint (phục vụ biểu đồ timeline) |
| **Config** | `06_CauHinh_HeThong` | Key-value, **là nguồn duy nhất của mọi ngưỡng** |

### Khóa và cách join

- `class_id` là khóa xuyên suốt. Hiện có 3 lớp: `1159` (IC2174), `1006` (IC2030), `905` (IC1924).
- `student_id` **luôn bằng** `student_code` trong toàn bộ dữ liệu (đã kiểm tra 59/59 dòng) — dư thừa, chọn một cái mà dùng.
- `02_DuLieu_HocVien` là **denormalized một cách có chủ đích**: nó đã chứa sẵn `class_name`, `test_1..test_6`, và mọi kết quả tính toán. Đây chính là "Hybrid CQRS" mà sidebar dashboard nhắc tới — làm giàu tĩnh trên sheet để dashboard không phải join gì cả. **Màn hình lớp chỉ cần đọc `02` là đủ.**
- `03_DiemTest_ChiTiet` chỉ cần khi muốn **lịch sử điểm** (sparkline, biểu đồ trend, cờ cheating theo từng bài). Đã verify: `02.test_N` khớp 100% với `03.grade_final` tại `test_order = N` — không có sai lệch nào trên 274 dòng.
- `09_Weekly_Snapshot` có `class_id = 'ALL'` (**chuỗi**, không phải số) cho 6 dòng tổng hợp toàn khối. Phải lọc riêng, nếu ép kiểu số sẽ mất/lỗi.

---

## 3. Chi tiết từng sheet

### `01_DanhSach_Lop` — 3 dòng × 33 cột

1 dòng = 1 lớp. Là nguồn cho **Lead Khối Dashboard**.

| Nhóm cột | Trường |
|---|---|
| Định danh | `class_id`, `class_name`, `course_id`, `status` (`on_going`) |
| GV & Lead | `teacher_id`, `teacher_name`, `teacher_email`, `lead_email` |
| Lịch | `lich_hoc`, `dia_diem`, `ngay_khai_giang`, `ngay_ket_thuc` |
| Tiến độ | `total_sessions`, `completed_sessions`, `session_progress` (chuỗi `"18/27"`) |
| Sĩ số | `active_students`, `on_hold_students`, `dropped_students` |
| Sức khỏe lớp | `attendance_class_avg`, `homework_class_avg`, `tinh_trang`, `moc_bao_dong` (bool) |
| Phân bố nhãn | `count_xam`, `count_do`, `count_vang`, `count_chua_co_dl`, `pct_xam`, `pct_do`, `pct_vang` |
| Tỷ lệ pass | `pass_chuan_rate`, `pass_mem_rate` |
| Meta | `link_portal`, `scraped_at` |

`moc_bao_dong = TRUE` khi `pct_xam + pct_do >= moc_bao_dong_pct` (40%). Verify: IC2030 (11.8+29.4=41.2) và IC1924 (11.1+38.9=50.0) đều `TRUE`; IC2174 (0+16.7=16.7) `FALSE`. ✅

### `02_DuLieu_HocVien` — 59 dòng × 44 cột ⭐ bảng trung tâm

1 dòng = 1 HV trong 1 lớp. Ghi đè toàn bộ mỗi lần cron chạy (không có version).

| Nhóm cột | Trường | Ghi chú |
|---|---|---|
| Định danh | `student_id`, `student_code`, `full_name`, `phone`, `email` | `student_id == student_code` |
| Lớp | `class_id`, `class_name`, `registration_status`, `admitted_at` | `active` \| `transferred` \| `on_hold` \| `dropped` |
| Chuẩn đầu ra | `chuan_dau_ra` | Toàn bộ 59 dòng đều là `'Chưa đạt'` — chưa có lớp nào kết thúc |
| Chuyên cần | `attendance_pct`, `attendance_present`, `attendance_total` | |
| BTVN | `homework_pct`, `homework_done`, `homework_total` | Tách riêng khỏi ĐH — chốt tại meeting 07-21 |
| Điểm test | `test_1` … `test_6`, `tests_taken`, `test_average` | **Lưu dạng text**, xem §6 |
| Nhãn | `nhan_hien_tai`, `nhan_truoc`, `nhan_benchmark`, `co_chuyen_nhan`, `huong_chuyen_nhan`, `checkpoint_gan_nhan` | `Xám` \| `Đỏ` \| `Vàng` \| `Chưa có DL` |
| Pass chuẩn | `pass_chuan_status`, `pass_chuan_reasons` | `reasons` là chuỗi nối bằng `"; "` |
| Pass mềm | `pass_mem_status`, `pass_mem_group`, `pass_mem_label` | |
| Cờ cảnh báo | `flag_dh_tut`, `flag_btvn_tut`, `flag_cheating`, `flag_can_review` | bool |
| Nhận xét GV | `teacher_feedback_btvn`, `teacher_feedback_orientation`, `gv_note`, `gv_nhan_tam` | Cào từ trang nhận xét cuối khóa trên portal |
| Meta | `scraped_at` | |

`gv_nhan_tam` (nhãn tạm do GV tự gắn) hiện **toàn bộ đều rỗng** — cơ chế đã chốt ở meeting (câu 7: "GV có thể tự điền") nhưng chưa có dữ liệu.

### `03_DiemTest_ChiTiet` — 274 dòng × 18 cột

1 dòng = 1 lượt thi của 1 HV. 55 HV có điểm (4 HV `transferred` chưa thi lần nào).

`student_id`, `class_id`, `class_test_id`, `test_order` (1–6), `test_name` (`"Test 1"`…), `raw_grade`, `max_grade` (100), `grade_percent`, `is_makeup`, `makeup_grade`, `grade_final`, `grade_status` (toàn bộ `confirmed`), `is_cheating`, `grade_note`, `nhan_tai_thoi_diem`, `scraped_at`.

`nhan_tai_thoi_diem` là nhãn **tại thời điểm bài test đó** → dùng để vẽ đường tiến hóa nhãn, đừng nhầm với `02.nhan_hien_tai`.

Điểm thi lại: `test_makeup_rule = max` → `grade_final = max(raw_grade, makeup_grade)`.

### `04_NhatKy_ChuyenNhan` — 3 dòng × 17 cột

Append-only, mỗi lần HV đổi nhãn. `log_id` (hex 8 ký tự), `student_id`, `class_id`, `teacher_id`, `nhan_cu`, `nhan_moi`, `huong` (`Lên`/`Xuống`), `ly_do` (câu tiếng Việt sinh tự động, vd `"TB test tăng lên 70.1 (>=60) sau Test 4"`), `checkpoint`, `test_average_moi`, `dh_pct`, `btvn_pct`, `email_sent`, `email_sent_at`, `created_at`.

Đây là nguồn cho email cảnh báo "Lớp IC1924: 2 HV Xám→Đỏ" và cho cột lịch sử nhãn trên dashboard.

### `05_XetDuyet_PassMem` — 4 dòng × 20 cột 🔄 sheet duy nhất dashboard ghi vào

`review_id`, `student_id`, `class_id`, `teacher_id`, `pass_mem_group`, `test_average`, `attendance_pct`, `homework_pct`, `review_status`, `gv_decision`, `gv_comment`, `gv_confirmed_at`, `deadline`, `is_overdue`, `escalated_to_lead`, `lead_email_sent`, `created_at`.

Vòng đời (`review_status`):

```
Chờ GV ──(GV bấm Đồng ý)──► GV Đồng ý       gv_decision = 'Pass'
       ──(GV bấm Từ chối)──► GV Từ chối      gv_decision = 'Fail'
       ──(quá deadline)────► Quá hạn → Lead  escalated_to_lead = TRUE
```

`deadline = created_at + review_deadline_days` (7 ngày). `WF-02 Deadline Checker` quét hằng ngày; quá hạn thì gửi mail cảnh báo GV **cc Lead khối** (chốt meeting 07-21 câu 8). Không tự động Fail.

### `06_CauHinh_HeThong` — 24 dòng × 5 cột ⭐ nguồn duy nhất của mọi ngưỡng

`config_key`, `config_value`, `description`, `updated_at`, `updated_by`. **Mọi con số nghiệp vụ đều nằm ở đây, không hardcode ở nơi khác.** Xem §4 cho bảng đầy đủ.

### `07_Log_HeThong` — 9 dòng × 10 cột

`log_id`, `run_id`, `timestamp`, `workflow_name`, `action`, `class_id`, `status`, `message`, `records_affected`, `duration_ms`.

Cho biết đúng 3 workflow n8n đang chạy:

| Workflow | Các action | Vai trò |
|---|---|---|
| **WF-01 Data Sync Master** | `scrape_data` | Cào portal, ghi `01`/`02`/`03`. 1 lần/lớp/ngày, ~3.2s |
| **WF-01b Label Engine** | `update_labels`, `detect_changes`, `send_email` | Tính nhãn, so với `nhan_truoc`, ghi `04`, gửi mail GV |
| **WF-02 Deadline Checker** | `check_deadline` | Escalate review quá hạn lên Lead |

### `08_GiaoVien` — 4 dòng × 6 cột

`teacher_id`, `teacher_name`, `teacher_email`, `teacher_phone`, `khoi_id` (34), `role` (`teacher` / `lead`).

### `09_Weekly_Snapshot` — 24 dòng × 8 cột

`snapshot_id`, `class_id`, `checkpoint`, `attendance_avg`, `homework_avg`, `pass_chuan_rate`, `pass_mem_rate`, `snapshot_date`.

6 checkpoint × 4 "lớp" (3 lớp thật + `'ALL'`). Checkpoint đan xen tuần và mốc test: `Tuần 1`, `Tuần 2`, `Test 1`, `Tuần 4`, `Tuần 5`, `Test 2`. **Đây chính là nguồn thật cho biểu đồ timeline** đang bị hardcode trong `LeadDashboard.tsx`.

---

## 4. Quy tắc nghiệp vụ (đã verify trên dữ liệu)

Toàn bộ ngưỡng đọc từ `06_CauHinh_HeThong`. **Đừng hardcode lại ở frontend** — nếu cần dùng, coi như biến cấu hình.

### Gán nhãn theo `test_average`

| Nhãn | Điều kiện | Config key | Ý nghĩa nghiệp vụ (từ dữ liệu lịch sử) |
|---|---|---|---|
| **Xám** | `< 45` | `nguong_xam_max = 45` | Rủi ro cao nhất, gần như không cứu được dù ĐH&BTVN đạt 83% |
| **Đỏ** | `45 ≤ x < 60` | `nguong_do_min/max = 45/60` | Tiềm năng, 50/50. Can thiệp + ĐH&BTVN > 90% → tỷ lệ đạt vượt 60% |
| **Vàng** | `≥ 60` | `nguong_vang_min = 60` | An toàn |
| **Chưa có DL** | chưa có điểm test nào | — | |

✅ Verify: khớp 58/59 dòng. Ngoại lệ duy nhất là `Mai Thị Hương Giang` — nhãn `Xám` đúng về nghiệp vụ (TB thật = 31.3) nhưng ô `test_average` bị Excel làm hỏng thành ngày (xem §6).

### Pass chuẩn

```
pass_chuan_status = 'Có khả năng pass'
    ⟺ attendance_pct >= 90  AND  homework_pct >= 90  AND  test_average >= 60
```

Config: `pass_dh_min = 90`, `pass_btvn_min = 90`, `pass_test_avg_min = 60`. **ĐH và BTVN là hai điều kiện tách rời** — chốt tại meeting 07-21 câu 2, vì có HV đi học đủ nhưng không làm bài.

`pass_chuan_reasons` liệt kê các điều kiện trượt, nối bằng `"; "`, tối đa 3 mệnh đề: `Đi học <90%`, `BTVN <90%`, `TB test <60`.

`'Chưa đủ DL'` dùng khi `tests_taken` chưa đủ so với tiến độ lớp (có HV `tests_taken = 3` vẫn bị đánh `Chưa đủ DL` dù đã có `test_average`) — **đây không đơn thuần là `test_average IS NULL`**, và quy tắc chính xác chưa được ghi ở đâu cả. ⚠️ Cần hỏi lại nghiệp vụ trước khi implement.

### Pass mềm — 3 nhóm ngoại lệ

| Nhóm | `test_average` | ĐH | BTVN | `pass_mem_label` | Cần GV duyệt? |
|---|---|---|---|---|---|
| **Nhóm 1** | `50 ≤ x < 55` | `= 100%` | `= 100%` | `Test 50-<55, ĐH 100%, BTVN 100%` | ✅ Có |
| **Nhóm 2** | `55 ≤ x < 60` | `≥ 90%` | `≥ 90%` | `Test 55-<60, ĐH>=90%, BTVN>=90%` | ✅ Có |
| **Nhóm 3** | `≥ 60` | — | — | `Test >=60` | ❌ Không (tự động đạt) |

✅ Verify: Nhóm 3 ⟺ `test_average >= 60`, **không phụ thuộc ĐH/BTVN** (có HV Nhóm 3 với `homework_pct` rỗng). Đúng 100%.

Config: `soft_g1_test_min/max = 50/55`, `soft_g1_dh_min = soft_g1_btvn_min = 100`, `soft_g2_test_min/max = 55/60`, `soft_g2_dh_min = soft_g2_btvn_min = 90`.

`flag_can_review = TRUE` chỉ cho **Nhóm 1 và Nhóm 2** (7 HV). Nhóm 3 tự đạt nên không vào hàng đợi review.

### Các quy tắc khác

| Quy tắc | Giá trị | Nguồn |
|---|---|---|
| TB test | Trung bình cộng **các bài đã thi**, chia cho `tests_taken`, **không chia cứng cho 6** | ✅ verify 0 sai lệch trên 55 HV |
| Cheating | Điểm bài đó tính **= 0**, vẫn nằm trong mẫu số | `cheating_test_score = 0`, meeting 07-21 câu 6 |
| Thi lại | `grade_final = max(raw, makeup)` | `test_makeup_rule = max` |
| Báo động lớp | `pct_xam + pct_do >= 40%` | `moc_bao_dong_pct = 40` |
| Cảnh báo tụt ĐH/BTVN | `< 80%` trong tuần | `alert_dh_tut_pct`, `alert_btvn_tut_pct = 80` |
| Deadline review | 7 ngày, quá hạn → escalate Lead | `review_deadline_days = 7` |
| Tổng số test | 6 | `total_tests_per_course = 6` |
| Lịch cron | `0 10 * * *` (10h sáng hàng ngày) | `cron_schedule` |

⚠️ **Lưu ý ngưỡng chồng chéo**: `alert_dh_tut_pct = 80` (ngưỡng cảnh báo) khác `pass_dh_min = 90` (ngưỡng pass). `StudentTable.tsx` đang dùng `attendance.percentage < 80` cho bộ lọc "urgent" — trùng với ngưỡng cảnh báo, nhưng đó là **trùng hợp chứ không phải đọc từ config**. Nếu nghiệp vụ đổi `alert_dh_tut_pct`, frontend sẽ lệch âm thầm.

---

## 5. Cách ghép dữ liệu cho từng màn hình

### Lead Khối Dashboard

| Thành phần UI | Nguồn |
|---|---|
| KPI tổng (sĩ số, dropped, on_hold) | `SUM` các cột của `01` |
| KPI trung bình (ĐH, BTVN, pass chuẩn, pass mềm) | `AVG` các cột của `01` |
| Biểu đồ cột chồng phân bố nhãn | `01.count_xam / count_do / count_vang` theo lớp |
| Biểu đồ timeline | `09` lọc `class_id = 'ALL'`, sắp theo `snapshot_date` — **hiện đang hardcode trong `LeadDashboard.tsx`** |
| Bảng master các lớp | `01` toàn bộ, join `08` nếu cần thông tin GV |
| Cảnh báo lớp | `01.moc_bao_dong = TRUE` |

### Màn hình lớp (Teacher view)

| Thành phần UI | Nguồn |
|---|---|
| Header lớp | `01` lọc theo `class_id` |
| Bảng HV | `02` lọc theo `class_id` — **không cần join gì** |
| Sparkline điểm | `03` lọc `student_id`, sắp theo `test_order`, lấy `grade_final` (hoặc đọc thẳng `02.test_1..6`) |
| Lịch sử chuyển nhãn | `04` lọc `student_id`, sắp theo `created_at DESC` |
| Card "cần gọi gấp" | `02` với `flag_dh_tut` / `nhan_hien_tai = 'Đỏ'` / `attendance_pct` thấp |
| Card "nhắc BTVN" | `02.flag_btvn_tut = TRUE` |
| Card "chờ duyệt pass" | `05` với `review_status = 'Chờ GV'` |

### Review Center (component hiện đang mồ côi)

`05` join `02` (lấy tên/SĐT/email) join `03` (lấy `scoreHistory`) join `08` (lấy tên GV). Ghi ngược: `review_status`, `gv_decision`, `gv_comment`, `gv_confirmed_at` qua webhook n8n.

---

## 6. Chất lượng dữ liệu — các bẫy đã xác nhận

Đây là các lỗi **có thật trong file hiện tại**, không phải rủi ro giả định. Bất kỳ parser nào (n8n hay frontend) đều phải xử lý.

### ⚠️ 1. Điểm test lưu dạng **text**, không phải số

`test_1` … `test_6` và `test_average` trong `02` là **chuỗi** (`'60.5'`), không phải number. `attendance_pct`, `homework_pct`, `tests_taken` thì lại là number. Bắt buộc ép kiểu — `'60.5' >= 60` trong JS cho ra kết quả sai lệch khó lường.

### ⚠️ 2. Số thập phân bị Excel tự chuyển thành **ngày tháng**

Giá trị dạng `d.m` (ngày ≤ 31, tháng ≤ 12) bị autoparse thành date. Đã tìm thấy 6 ô hỏng:

| Sheet | Ô | Giá trị lưu | Giá trị thật |
|---|---|---|---|
| `02` | `test_average` (Mai Thị Hương Giang) | `2026-03-31`, format `d.m` | **31.3** |
| `01` | `pct_do` (IC2174) | `2026-07-16` | **16.7** (3/18) |
| `01` | `pct_xam` (IC2030) | `2026-08-11` | **11.8** (2/17) |
| `01` | `pct_do` (IC2030) | `2026-04-29` | **29.4** (5/17) |
| `01` | `pct_xam` (IC1924) | `2026-01-11` | **11.1** (2/18) |
| `09` | `pass_mem_rate` (ALL, Tuần 2 & Test 1) | `2026-08-24`, `2026-06-29` | **24.8**, **29.6** |

Quy tắc khôi phục: `giá trị thật = ngày + tháng/10`. **Cách sửa gốc**: format cột thành Plain text / Number trong Google Sheets, hoặc để n8n ghi số thật thay vì chuỗi.

### ⚠️ 3. Số điện thoại mất số 0 đầu

`phone` lưu dạng number → `0868578476` thành `868578476`. Cần pad lại `'0' + phone` khi hiển thị hoặc gọi. `CallParentModal` copy số vào clipboard — nếu bê nguyên từ sheet sẽ ra số không gọi được.

### ⚠️ 4. `lich_hoc` bị co thành số

Cả 3 lớp đều có `lich_hoc = 3.6` (number). Đây gần như chắc chắn là **"Thứ 3, Thứ 6"** bị parse thành `3.6`. Cột này phải là text.

### ⚠️ 5. `co_chuyen_nhan` không đồng bộ với `04_NhatKy_ChuyenNhan`

`04` ghi nhận 3 lượt chuyển nhãn (HV `19428` Đỏ→Vàng, `10162` Xám→Đỏ, `25822` Đỏ→Vàng), nhưng trong `02` cả 3 HV đó đều có `co_chuyen_nhan = FALSE` và `nhan_truoc == nhan_hien_tai`. Toàn bộ 59 dòng đều `FALSE`, và `huong_chuyen_nhan` chỉ có duy nhất giá trị `'Không đổi'`.

→ **Không dùng `02.co_chuyen_nhan` để phát hiện chuyển nhãn.** Dùng `04_NhatKy_ChuyenNhan` làm nguồn sự thật.

### ⚠️ 6. `flag_can_review` (7 HV) nhiều hơn số dòng trong `05` (4 dòng)

3 HV bị bỏ sót, đều thuộc Nhóm 2: `25831` (Trịnh Thị Hồng Nhung), `25842` (Lê Thị Hồng Vân), `25854` (Tô Minh Hiếu). Chưa rõ là lỗi luồng tạo review hay chỉ do mock data chưa đầy đủ. Nếu UI đếm số review theo `02.flag_can_review` mà danh sách lại lấy từ `05`, con số sẽ không khớp.

### ⚠️ 7. `pass_chuan_status` rỗng cho HV không `active`

6 HV có `pass_chuan_status` rỗng: 4 `transferred`, 1 `on_hold`, 1 `dropped`. Ô rỗng ở đây nghĩa là "không áp dụng", không phải "chưa tính". Nhớ lọc theo `registration_status = 'active'` trước khi tính tỷ lệ, nếu không mẫu số sẽ sai.

---

## 7. Sheet ↔ `src/data/mockData.ts`

Các interface TypeScript trong dashboard **gần khớp nhưng không phải ánh xạ 1-1** với sheet. Bảng dưới đây là hợp đồng tích hợp thật sự khi thay mock bằng API.

### `ClassSummary` ← `01_DanhSach_Lop`

Ánh xạ trực tiếp phần lớn. **Không có trong sheet, frontend phải tự tính:**

- `healthMetrics.classRiskLevel` (`high`/`medium`/`low`) — sheet chỉ có `tinh_trang` (chuỗi tiếng Việt) và `moc_bao_dong` (bool)
- `healthMetrics.healthScore` (số) — không tồn tại
- `labelDistribution.netMomentum` — phải tính từ `04_NhatKy_ChuyenNhan` (số HV lên trừ số HV xuống)
- `actionItems.urgentCallsNeeded` / `homeworkRemindersNeeded` / `pendingPassReviews` — phải đếm từ `02` và `05`
- `progress.percentage` — sheet chỉ có chuỗi `session_progress = "18/27"`

### `StudentDetail` ← `02_DuLieu_HocVien` (+ `03`)

Ánh xạ tên trường:

| TS | Sheet |
|---|---|
| `labeling.currentLabel: 'yellow'\|'red'\|'grey'\|'no_data'` | `nhan_hien_tai: 'Vàng'\|'Đỏ'\|'Xám'\|'Chưa có DL'` — **cần bảng dịch** |
| `labeling.benchmarkLabel` | `nhan_benchmark` |
| `labeling.hasChangedRecently` / `changeDirection` | `co_chuyen_nhan` / `huong_chuyen_nhan` — ⚠️ xem bẫy §6.5 |
| `labeling.teacherTemporaryLabel` | `gv_nhan_tam` |
| `attendance.isDroppingRecently` | `flag_dh_tut` |
| `homework.isDroppingRecently` | `flag_btvn_tut` |
| `testPerformance.isCheatingFlagged` | `flag_cheating` |
| `testPerformance.scores[]` | `03_DiemTest_ChiTiet` |
| `portalEvidence.*` | `teacher_feedback_btvn`, `teacher_feedback_orientation`, `gv_note` |
| `targetOutputStatus` | `chuan_dau_ra` |

**Không có trong sheet, frontend phải tự tính:**

- `evaluation.riskScore` (0–100) — **hoàn toàn là phát minh của frontend**. Đang điều khiển thứ tự sort mặc định của bảng HV. Chưa có định nghĩa nghiệp vụ nào cả. ⚠️ Cần chốt công thức với nghiệp vụ, hoặc chuyển việc tính sang n8n.
- `evaluation.suggestedAction` (`call_parent`/`assign_hw`/`review_pass`/`none`) — không tồn tại
- `testPerformance.trendDirection`, `lastScore` — suy ra từ `03`
- `evaluation.isEligibleForReview` ← `flag_can_review`; `evaluation.reviewStatus` ← `05.review_status`

### `PendingReviewEnriched` ← `05` + `02` + `03` + `08`

`evidence.aiRecommendation` (`action`, `confidence`, `reasoning`) **không có ở bất kỳ đâu trong hạ tầng** — không có sheet nào lưu, không có workflow nào sinh ra. Đây là tính năng dashboard đề xuất, chưa có backend. `student.avatarInitials` cũng vậy (suy ra từ `full_name`).

### Tóm lại

Sheet đã cung cấp sẵn gần như toàn bộ dữ liệu **mô tả** và **phân loại**. Thứ đang thiếu là lớp **ưu tiên hóa** — `riskScore`, `suggestedAction`, `healthScore`, `netMomentum`, `aiRecommendation`. Đó chính là ranh giới cần quyết định: tính ở n8n (ghi thêm cột vào `02`, giữ đúng tinh thần Hybrid CQRS mà kiến trúc đang theo) hay tính ở frontend (nhanh hơn nhưng logic nghiệp vụ rơi ra khỏi `06_CauHinh_HeThong`).

---

## 8. Sheet đề xuất `10_NhatKy_LienHe` — theo dõi GV đã liên hệ

Sheet này **chưa tồn tại**. Frontend đã dựng xong phần giao diện và mô hình dữ liệu (`ContactLog` trong `src/data/types.ts`, ghi qua `src/data/contactStore.ts`), hiện chạy trên `localStorage`. Đây là hợp đồng để n8n hiện thực hoá.

### Vì sao là nhật ký, không phải một cột cờ trên `02`

Một cột `da_lien_he: TRUE/FALSE` trên `02_DuLieu_HocVien` chỉ trả lời được câu "đã bao giờ liên hệ chưa". Nó vô dụng ngay từ lần thứ hai: sau bài test kế tiếp, nhãn được tính lại và cảnh báo là cảnh báo MỚI, nhưng cờ vẫn `TRUE`. Nó cũng không nói được ai liên hệ, lúc nào, và vì cảnh báo gì.

### Cột

| Cột | Kiểu | Ví dụ | Ghi chú |
|---|---|---|---|
| `contact_id` | text | `CT-19428-urgent_call-2026-08-04T03:12:55Z` | Khoá chính |
| `student_id` | number | `19428` | → `02.student_id` |
| `class_id` | number | `2174` | → `01.class_id` |
| `teacher_id` | number | `7` | → `08.teacher_id`. AI của độ phủ theo GV |
| `channel` | enum | `call` \| `zalo` \| `in_person` | |
| `trigger` | enum | `urgent_call` \| `homework_reminder` \| `relearn_advice` | Loại cảnh báo được đóng |
| `checkpoint` | text | `Test 3` \| `Chưa có test` | **Phải cùng hệ giá trị với `04.checkpoint`** |
| `note` | text | `''` | Bản v1 luôn rỗng, giữ cột sẵn |
| `created_at` | ISO8601 | `2026-08-04T03:12:55Z` | |

**Append-only.** Không sửa, không xoá dòng cũ — lịch sử là thứ duy nhất trả lời được "lần trước liên hệ khi nào". (Nút hoàn tác trên UI chỉ gỡ dòng của đúng episode tại đúng checkpoint hiện tại, dành cho ca bấm nhầm.)

### Quy tắc episode

```
khoá episode = student_id | trigger | checkpoint
```

Một cảnh báo được coi là "đã xử lý" khi tồn tại ít nhất một dòng khớp cả ba thành phần. `checkpoint` chính là cơ chế hết hạn: lớp thi bài mới → nhãn tính lại → khoá đổi → cảnh báo tự nổi lại, không cần job nào đi reset cờ.

Ba `trigger` ứng với ba predicate trong `src/data/selectors/studentFilters.ts`. Thêm trigger mới thì phải thêm predicate, nếu không `openEpisodes` đếm thiếu.

### Ghi ngược qua n8n

Cùng mẫu với Review Center (§5): `POST {n8n}/webhook/contact-log`, body đúng hình dạng một dòng ở trên, n8n append vào sheet. Frontend chỉ cần đổi ruột `persist()` trong `contactStore.ts` — chữ ký hàm đã giữ nguyên hình dạng lời gọi API.

### Độ phủ liên hệ (bảng lớp của Lead)

`done / total` với `total` = số episode đang mở của lớp tại mốc test hiện tại **của chính lớp đó** (mỗi lớp có mốc riêng). Đếm theo episode chứ không theo học viên: một HV mở hai cảnh báo phải đếm hai lần, nếu không GV đóng việc dễ rồi bỏ việc khó vẫn hiện 100%. `total = 0` → hiện `--`, **không phải 0%**.

Cái tick là GV tự khai, nên bản thân nó không chứng minh được cuộc gọi đã xảy ra. Thứ khiến nó có sức nặng là chiều ngược lại: GV **không** liên hệ thì lộ ra thành con số trên bảng của Lead.

### Trường frontend đang tự suy — backend nên trả thẳng

`currentCheckpoint(students)` đang suy mốc test hiện tại từ bài có `testOrder` lớn nhất mà đã có học viên nhận điểm. Nên đọc thẳng từ `09_Weekly_Snapshot.test_checkpoint` để không lệch với `04`.

### ⚠️ Lỗi đã phát hiện khi dựng phần này

`suggestedAction` (trong bộ sinh mock, và theo mô tả cũng là ý định của backend) **chỉ suy từ điểm danh và BTVN, không hề đọc nhãn**:

```
if (isEligibleForReview) → review_pass
else if (attendance_pct < 80) → call_parent
else if (homework_pct < 80)   → assign_hw
else → none
```

Hệ quả: một HV **nhãn Xám** đi học đều và nộp bài đủ nhận `suggestedAction = 'none'` — không rơi vào luồng hành động nào, ô "Hành động" trên màn hình GV hiện `--`. Trên dữ liệu mock hiện tại là **10 HV trên 15 lớp**, riêng lớp IC2174 có 5. Đây chính là nhóm mà §4 xác định là rủi ro cao nhất.

Frontend đã vá bằng cách thêm luồng riêng `relearn_advice` (predicate `isRelearnAdviceStudent`), độc lập với `suggestedAction`. Nếu backend sinh `suggestedAction` thật thì phải xử lý nhánh nhãn Xám ở đó, nếu không hai bên sẽ lệch nhau.

---

## 9. Nguồn tham chiếu

| Tài liệu | Nội dung |
|---|---|
| `docs/infrastructure/IZONE — Phân nhãn HV.xlsx` | Schema thật, 9 sheet |
| `docs/general information/Meeting Report … 2026-07-21.md` | 7 bước tự động hóa, chốt các edge case (cheating=0, ĐH/BTVN tách riêng, deadline 7 ngày, escalate Lead) |
| `docs/general information/Meeting Report … 2026-07-23.md` | Chốt kiến trúc 3 lớp, lý do chọn Sheets thay SQL, đánh đổi cron vs real-time |
| `docs/design_docs/IZONE-DESIGN.md` | Design system auto-extract từ `izone.edu.vn` (2026-07-11) — nguồn gốc của `#db0829`, font Geologica |
| Portal | `https://portal.izone.edu.vn/academic-affairs/course-classes/{class_id}` |
| n8n | `https://n8n-ai.izone.edu.vn` |

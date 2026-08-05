# BÁO CÁO TỔNG KẾT QUÁ TRÌNH & PHÂN TÍCH TINH GỌN CƠ SỞ DỮ LIỆU

> **Hệ thống:** IZONE Student Labeling & Warning System
> **Kiến trúc:** Google Sheets → N8N → GitHub Pages (React)
> **Phương pháp phát triển:** Top-Down (UI → Backend), Waterfall
> **Ngày báo cáo:** 28/07/2026

---

## PHẦN 1: OVERVIEW TOÀN BỘ QUÁ TRÌNH PHÁT TRIỂN

### Giai đoạn 1 — Thiết kế Cơ sở Dữ liệu (Database-First)
Xuất phát từ yêu cầu nghiệp vụ thực tế của IZONE (giám sát chất lượng học viên Khối 3-4), nhóm đã thiết kế **8 bảng Google Sheets** chuẩn hóa, bao phủ toàn bộ vòng đời dữ liệu:

| # | Tên Sheet | Vai trò |
|---|-----------|---------|
| 01 | `DanhSach_Lop` | Master data lớp học (33 cột) |
| 02 | `DuLieu_HocVien` | Hồ sơ & chỉ số học viên (44 cột) |
| 03 | `DiemTest_ChiTiet` | Điểm từng bài test chi tiết (16 cột) |
| 04 | `NhatKy_ChuyenNhan` | Log chuyển đổi nhãn (15 cột) |
| 05 | `XetDuyet_PassMem` | Hệ thống duyệt Pass mềm (17 cột) |
| 06 | `CauHinh_HeThong` | Tham số ngưỡng phân nhãn (5 cột) |
| 07 | `Log_HeThong` | Audit trail hệ thống (10 cột) |
| 08 | `GiaoVien` | Danh sách GV & phân quyền (6 cột) |

Script Python ([generate_mock_data_v2.py](file:///d:/TruongQuocToan/IZONE/CongViec/Gán nhãn học viên/google_sheets/generate_mock_data_v2.py)) đã được viết để sinh dữ liệu mẫu thực tế (3 lớp, 53 học viên, ~275 bản ghi điểm test) xuất ra 8 file CSV trong thư mục [csv_output](file:///d:/TruongQuocToan/IZONE/CongViec/Gán nhãn học viên/google_sheets/csv_output).

### Giai đoạn 2 — Thiết kế Giao diện (UI/UX Top-Down)
Áp dụng nguyên tắc "Làm UI trước để biết cần dữ kiện gì", nhóm đã xây dựng Frontend bằng **React + TypeScript + Vite + Tailwind CSS**, bao gồm 3 trang chính:

1. **Lead Dashboard (Macro View):** Bảng tổng quan cho Lead Khối — KPI Cards (Sức khỏe toàn khối, Số lớp báo động, Dự báo nguy cơ), Biểu đồ tỷ lệ nhãn, Master Class Table có bộ lọc và nút Export.
2. **Teacher Dashboard (Micro View):** Bảng chi tiết cho GV chủ nhiệm — Danh sách học viên dạng Table/Card, Badge Nhãn hiện tại (Đỏ/Vàng/Xám), Sparkline Charts (Điểm Test, CC, BTVN), Accordion lịch sử chuyển nhãn, Nút CTA (Gọi phụ huynh, Nhắn Zalo).
3. **Review Center (Action View):** Hòm thư duyệt nhãn — Ticket Cards chứa lý do cảnh báo từ n8n, Form đánh giá thái độ học tập (3 Toggle: Có tiến bộ/Không rõ/Không), Textarea nhận xét, Nút "Gửi Quyết Định" trigger Webhook.

### Giai đoạn 3 — Tối ưu hóa Mobile-First & Responsive
Sau khi chốt Desktop UI, toàn bộ 3 trang đã được tối ưu cho thiết bị di động:
- **Header:** Rút gọn (ẩn Nav tabs, ẩn Dropdown chọn lớp, chỉ giữ Hamburger + Logo + Portal link).
- **Sidebar:** Chuyển thành Drawer trượt từ trái, có Overlay mờ và nút đóng [X].
- **Data Tables:** Thêm `whitespace-nowrap` + `overflow-x-auto` cho phép vuốt ngang.
- **Student Cards:** Bổ sung Badge Nhãn to rõ + dòng "Nhịp tim" (`CC: 95% | BTVN: 89%`) với auto-highlight đỏ nếu < 90%.
- **Charts:** Thêm `Tooltip` (chạm để xem) và `LabelList` (hiển thị số liệu trực tiếp trên đường line).
- Build kiểm tra: **0 errors** (TypeScript strict mode).

### Giai đoạn 4 — Báo cáo Ánh xạ Ngược (Reverse Mapping)
Đối chiếu toàn bộ UI Components với 8 bảng CSV thực tế để xác nhận: Cấu trúc dữ liệu hiện tại **bao phủ 100%** các tính năng hiển thị trên giao diện. → Sẵn sàng chuyển sang giai đoạn viết luồng N8N.

---

## PHẦN 2: PHÂN TÍCH "GIỮ HAY BỎ" TỪNG TRƯỜNG DỮ LIỆU

Dưới đây là kết quả phân tích chi tiết từng trường trong 8 bảng. Các trường **đã được xác nhận hiển thị trên UI** (từ Phần 1 của báo cáo trước) sẽ không được liệt kê lại. Chỉ phân tích các trường **KHÔNG xuất hiện trực tiếp trên giao diện**.

---

### 🗂️ Bảng 01: `DanhSach_Lop` (33 cột)

#### Các trường ĐÃ dùng trên UI:
`class_id`, `class_name`, `course_id`, `teacher_name`, `total_sessions`, `completed_sessions`, `attendance_class_avg`, `homework_class_avg`, `count_xam`, `count_do`, `count_vang`, `link_portal`

#### Phân tích các trường còn lại:

| Trường | Phân loại | Lý do |
|--------|-----------|-------|
| `teacher_id` | 🟢 **PHẢI GIỮ** | Khóa ngoại (FK) liên kết sang Bảng 08 `GiaoVien` và Bảng 05 `XetDuyet_PassMem`. N8N dùng để xác định GV nào phụ trách, gửi email đúng người. |
| `teacher_email` | 🟢 **PHẢI GIỮ** | N8N dùng trực tiếp để gửi email cảnh báo chuyển nhãn và nhắc review quá hạn. |
| `lead_email` | 🟢 **PHẢI GIỮ** | N8N dùng để escalate ticket khi GV không xử lý quá hạn (gửi email cho Lead). |
| `status` | 🟢 **PHẢI GIỮ** | N8N cần lọc chỉ xử lý các lớp `on_going`, bỏ qua lớp `completed` hoặc `cancelled`. |
| `active_students` | 🟢 **PHẢI GIỮ** | N8N dùng làm mẫu số tính `pct_do`, `pct_vang`. UI cũng dùng gián tiếp (hiển thị "Sĩ số: 18"). |
| `moc_bao_dong` | 🟢 **PHẢI GIỮ** | Cờ boolean dùng trong logic N8N: khi `(count_do + count_xam) / active_students >= 40%` → trigger cảnh báo cho Lead. |
| `pass_chuan_rate` | 🟢 **PHẢI GIỮ** | N8N tính toán tỷ lệ Pass chuẩn toàn lớp; Lead Dashboard có thể dùng trong tương lai. |
| `pass_mem_rate` | 🟢 **PHẢI GIỮ** | Tương tự `pass_chuan_rate`, phục vụ thống kê tổng quan. |
| `scraped_at` | 🟢 **PHẢI GIỮ** | Timestamp để N8N xác định dữ liệu đã được sync lần cuối khi nào. Tránh xử lý trùng lặp. |
| `session_progress` | 🔴 **XÓA BỎ** | Chuỗi text dạng `"18/27"` — **trùng lặp hoàn toàn** với 2 trường `completed_sessions` và `total_sessions` đã có. Frontend tự ghép chuỗi này được. |
| `pct_xam` | 🔴 **XÓA BỎ** | Giá trị `= count_xam / active_students * 100`. **Tính toán được** từ 2 trường đã có. Lưu trữ thừa, tốn ô Google Sheets. |
| `pct_do` | 🔴 **XÓA BỎ** | Tương tự `pct_xam`. Tính toán được từ `count_do / active_students`. |
| `pct_vang` | 🔴 **XÓA BỎ** | Tương tự. Tính toán được từ `count_vang / active_students`. |
| `count_chua_co_dl` | 🟡 **CÂN NHẮC GIỮ** | Số HV chưa có dữ liệu điểm. Hữu ích cho Lead biết bao nhiêu HV mới vào chưa có Test, nhưng có thể tính được bằng `active_students - count_xam - count_do - count_vang`. |
| `lich_hoc` | 🟡 **CÂN NHẮC GIỮ** | Lịch học (VD: "3,6"). Không hiện trên UI hiện tại nhưng có thể hữu ích cho N8N lên lịch nhắc nhở đúng ngày học. |
| `dia_diem` | 🔴 **XÓA BỎ** | Không phục vụ bất kỳ logic tính toán hay UI nào. Thông tin tĩnh, ít giá trị cho hệ thống cảnh báo. |
| `ngay_khai_giang` | 🟡 **CÂN NHẮC GIỮ** | Dùng để tính thời lượng khóa học đã trôi qua, hoặc audit khi cần. |
| `ngay_ket_thuc` | 🟡 **CÂN NHẮC GIỮ** | N8N có thể dùng để tự động đánh dấu lớp `completed` khi qua ngày này. |
| `on_hold_students` | 🟡 **CÂN NHẮC GIỮ** | Số HV bảo lưu. Không hiện UI nhưng có thể hữu ích cho thống kê tổng quan. |
| `dropped_students` | 🟡 **CÂN NHẮC GIỮ** | Số HV bỏ học. Tương tự trên. |
| `tinh_trang` | 🔴 **XÓA BỎ** | Text mô tả dạng "Bình thường" — **trùng ngữ nghĩa** với `moc_bao_dong` (boolean). N8N nên dùng boolean, không cần text. |

---

### 🗂️ Bảng 02: `DuLieu_HocVien` (44 cột)

#### Các trường ĐÃ dùng trên UI:
`student_id`, `full_name`, `phone`, `class_id`, `attendance_pct`, `homework_pct`, `test_1`→`test_6`, `test_average`, `nhan_hien_tai`, `nhan_truoc`, `co_chuyen_nhan`, `flag_dh_tut`, `flag_btvn_tut`

#### Phân tích các trường còn lại:

| Trường | Phân loại | Lý do |
|--------|-----------|-------|
| `student_code` | 🔴 **XÓA BỎ** | **Trùng hoàn toàn** với `student_id` (cả 2 đều là `18972`). Giữ 1 là đủ. |
| `email` | 🟢 **PHẢI GIỮ** | N8N có thể dùng để gửi email cảnh báo trực tiếp cho học viên (nếu có luồng này). |
| `class_name` | 🔴 **XÓA BỎ** | **Trùng lặp** — đã có ở Bảng 01. Tra cứu bằng `class_id` (FK) là đủ. |
| `registration_status` | 🟢 **PHẢI GIỮ** | N8N cần lọc chỉ xử lý HV `active`, bỏ qua HV `dropped` hoặc `on_hold`. |
| `admitted_at` | 🟡 **CÂN NHẮC GIỮ** | Ngày nhập học. Có thể dùng audit hoặc tính số tuần đã học. |
| `chuan_dau_ra` | 🟢 **PHẢI GIỮ** | Kết quả đầu ra cuối khóa ("Đạt" / "Chưa đạt"). Logic N8N dùng để đánh giá tổng kết. |
| `attendance_present` | 🟢 **PHẢI GIỮ** | Tử số để N8N tính `attendance_pct = present / total * 100`. Nếu xóa, không thể tái tính toán khi cần. |
| `attendance_total` | 🟢 **PHẢI GIỮ** | Mẫu số cho phép tính trên. |
| `homework_done` | 🟢 **PHẢI GIỮ** | Tử số để tính `homework_pct`. |
| `homework_total` | 🟢 **PHẢI GIỮ** | Mẫu số cho phép tính trên. |
| `tests_taken` | 🟢 **PHẢI GIỮ** | N8N cần biết HV đã thi bao nhiêu test để tính trung bình đúng (tránh chia cho 6 khi mới thi 3). |
| `nhan_benchmark` | 🟡 **CÂN NHẮC GIỮ** | Nhãn "tiêu chuẩn" trước khi áp dụng Pass mềm. Hữu ích khi audit: phân biệt HV pass do đạt chuẩn hay do GV xét duyệt mềm. |
| `huong_chuyen_nhan` | 🟢 **PHẢI GIỮ** | N8N dùng để xác định HV đang "Lên" hay "Xuống" nhãn → quyết định có gửi email cảnh báo không. |
| `checkpoint_gan_nhan` | 🟢 **PHẢI GIỮ** | N8N dùng để ghi nhận nhãn được gán tại checkpoint nào (VD: "Test 4"), tránh gán lại nhãn trùng. |
| `pass_chuan_status` | 🟢 **PHẢI GIỮ** | Kết quả pass chuẩn. N8N dùng để quyết định có cần tạo ticket Pass mềm không. |
| `pass_chuan_reasons` | 🟡 **CÂN NHẮC GIỮ** | Lý do không đạt pass chuẩn (VD: "Đi học <90%"). Audit trail. |
| `pass_mem_status` | 🟢 **PHẢI GIỮ** | Kết quả pass mềm. N8N dùng trong logic tạo review ticket. |
| `pass_mem_group` | 🟢 **PHẢI GIỮ** | Nhóm Pass mềm (Nhóm 1/2/3). N8N dùng để áp đúng ngưỡng từ Bảng 06. |
| `pass_mem_label` | 🟡 **CÂN NHẮC GIỮ** | Mô tả chi tiết nhóm (VD: "Test >=60"). Audit trail, không dùng trong logic. |
| `flag_cheating` | 🟢 **PHẢI GIỮ** | N8N dùng để tính lại điểm test = 0 nếu bị gian lận (theo `cheating_test_score` trong Bảng 06). |
| `flag_can_review` | 🟢 **PHẢI GIỮ** | Cờ trigger N8N: khi `TRUE` → tạo ticket trong Bảng 05 `XetDuyet_PassMem`. |
| `teacher_feedback_btvn` | 🟡 **CÂN NHẮC GIỮ** | Nhận xét GV về BTVN. Không hiện UI hiện tại nhưng rất giá trị cho audit / phụ huynh hỏi. |
| `teacher_feedback_orientation` | 🟡 **CÂN NHẮC GIỮ** | Nhận xét GV về thái độ. Tương tự trên. |
| `gv_note` | 🟡 **CÂN NHẮC GIỮ** | Ghi chú riêng của GV. Audit trail. |
| `gv_nhan_tam` | 🟡 **CÂN NHẮC GIỮ** | Đánh giá chủ quan của GV. Có thể bổ sung lên UI trong tương lai. |
| `scraped_at` | 🟢 **PHẢI GIỮ** | Timestamp sync. N8N cần để xác định dữ liệu mới. |

---

### 🗂️ Bảng 03: `DiemTest_ChiTiet` (16 cột)

#### Các trường ĐÃ dùng trên UI:
`student_id`, `test_name`, `grade_percent` (= `grade_final`), `is_makeup`, `nhan_tai_thoi_diem`

#### Phân tích các trường còn lại:

| Trường | Phân loại | Lý do |
|--------|-----------|-------|
| `class_id` | 🟢 **PHẢI GIỮ** | FK liên kết. N8N dùng để lọc điểm theo lớp. |
| `class_test_id` | 🟢 **PHẢI GIỮ** | ID bài test trên Portal. N8N dùng làm khóa chính để scrape và cập nhật đúng dòng. |
| `test_order` | 🟢 **PHẢI GIỮ** | Thứ tự bài test (1→6). N8N dùng để sắp xếp khi tính trung bình lũy kế. |
| `raw_grade` | 🟡 **CÂN NHẮC GIỮ** | Điểm gốc trước khi thi lại. Audit trail — khi phụ huynh hỏi "điểm ban đầu con tôi bao nhiêu?". |
| `max_grade` | 🔴 **XÓA BỎ** | Luôn = 100 trong toàn bộ dữ liệu hiện tại. Nếu hệ thống chỉ dùng thang 100, trường này **hoàn toàn thừa**. |
| `grade_percent` | 🔴 **XÓA BỎ** | **Trùng hoàn toàn** với `grade_final` khi `max_grade = 100`. Giữ `grade_final` là đủ. |
| `makeup_grade` | 🟡 **CÂN NHẮC GIỮ** | Điểm thi lại. Kết hợp với `is_makeup` và `raw_grade` để audit toàn bộ quá trình điểm. |
| `grade_status` | 🟢 **PHẢI GIỮ** | Trạng thái xác nhận điểm (`confirmed` / `pending`). N8N chỉ nên tính trung bình từ điểm đã `confirmed`. |
| `is_cheating` | 🟢 **PHẢI GIỮ** | N8N dùng để áp dụng logic `cheating_test_score = 0` từ Bảng 06. |
| `grade_note` | 🟡 **CÂN NHẮC GIỮ** | Ghi chú điểm. Audit trail. |
| `scraped_at` | 🟢 **PHẢI GIỮ** | Timestamp sync. |

---

### 🗂️ Bảng 04: `NhatKy_ChuyenNhan` (15 cột)

#### Các trường ĐÃ dùng trên UI:
`nhan_cu`, `nhan_moi`, `ly_do`, `created_at`

#### Phân tích các trường còn lại:

| Trường | Phân loại | Lý do |
|--------|-----------|-------|
| `log_id` | 🟢 **PHẢI GIỮ** | Khóa chính (PK). Bắt buộc. |
| `student_id` | 🟢 **PHẢI GIỮ** | FK liên kết với HV. Bắt buộc. |
| `class_id` | 🟢 **PHẢI GIỮ** | FK liên kết với lớp. |
| `teacher_id` | 🟢 **PHẢI GIỮ** | Xác định GV nào phụ trách tại thời điểm chuyển nhãn. |
| `huong` | 🟢 **PHẢI GIỮ** | "Lên" / "Xuống". N8N dùng để quyết định gửi email loại nào (khen / cảnh báo). |
| `checkpoint` | 🟢 **PHẢI GIỮ** | Mốc thời điểm (VD: "Test 4"). Logic dedup cho N8N. |
| `test_average_moi` | 🟢 **PHẢI GIỮ** | TB test tại thời điểm chuyển nhãn. N8N cần để ghi vào email cảnh báo. |
| `dh_pct` | 🟡 **CÂN NHẮC GIỮ** | % đi học tại thời điểm chuyển. Snapshot audit, không dùng trong logic. |
| `btvn_pct` | 🟡 **CÂN NHẮC GIỮ** | Tương tự `dh_pct`. |
| `email_sent` | 🟢 **PHẢI GIỮ** | Cờ boolean. N8N dùng để tránh gửi email trùng lặp. |
| `email_sent_at` | 🟢 **PHẢI GIỮ** | Timestamp gửi email. Audit + N8N dùng để retry nếu gửi thất bại. |

---

### 🗂️ Bảng 05: `XetDuyet_PassMem` (17 cột)

#### Các trường ĐÃ dùng trên UI (GET + POST):
`review_id`, `student_id`, `class_id`, `review_status`, `is_overdue`, `gv_decision`, `gv_comment`, `gv_confirmed_at`

#### Phân tích các trường còn lại:

| Trường | Phân loại | Lý do |
|--------|-----------|-------|
| `teacher_id` | 🟢 **PHẢI GIỮ** | FK. N8N dùng để gửi email nhắc GV review. |
| `pass_mem_group` | 🟢 **PHẢI GIỮ** | Nhóm Pass mềm. N8N dùng để áp ngưỡng từ Bảng 06 và hiển thị trên Review Card. |
| `test_average` | 🟢 **PHẢI GIỮ** | Hiển thị trên Review Card (cho GV biết TB test hiện tại). |
| `attendance_pct` | 🟢 **PHẢI GIỮ** | Hiển thị trên Review Card. |
| `homework_pct` | 🟢 **PHẢI GIỮ** | Hiển thị trên Review Card. |
| `deadline` | 🟢 **PHẢI GIỮ** | N8N dùng để tính `is_overdue = (today > deadline)`. |
| `escalated_to_lead` | 🟢 **PHẢI GIỮ** | Cờ escalation. N8N dùng để gửi email cho Lead khi GV không xử lý. |
| `lead_email_sent` | 🟢 **PHẢI GIỮ** | Tránh gửi email escalation trùng lặp. |
| `created_at` | 🟢 **PHẢI GIỮ** | Timestamp tạo ticket. Audit + tính deadline. |

> [!NOTE]
> **Bảng 05 không có trường nào cần xóa.** Toàn bộ 17 cột đều phục vụ UI hoặc Logic N8N.

---

### 🗂️ Bảng 06: `CauHinh_HeThong` (5 cột, 24 dòng config)
> [!IMPORTANT]
> **GIỮ NGUYÊN TOÀN BỘ.** Đây là bảng tham số cốt lõi cho engine phân nhãn. Mỗi dòng config (`nguong_xam_max`, `pass_dh_min`, `review_deadline_days`...) đều là input trực tiếp cho logic N8N. Không xóa bất kỳ dòng nào.

---

### 🗂️ Bảng 07: `Log_HeThong` (10 cột)
> [!NOTE]
> **GIỮ NGUYÊN TOÀN BỘ** — nhóm **CÂN NHẮC GIỮ** (Audit). Bảng này là System Log thuần túy, không phục vụ UI nhưng cực kỳ quan trọng để debug khi N8N gặp lỗi, hoặc khi Lead cần tra soát "tại sao học viên X bị đổi nhãn ngày Y?".

---

### 🗂️ Bảng 08: `GiaoVien` (6 cột)
> [!NOTE]
> **GIỮ NGUYÊN TOÀN BỘ.** Bảng nhỏ (4 dòng), chứa thông tin phân quyền (`role`: teacher/lead) và liên kết FK. Không có gì để tối ưu.

---

## PHẦN 3: TỔNG HỢP — CÁC TRƯỜNG ĐỀ XUẤT XÓA BỎ

Bảng tóm tắt nhanh các trường **an toàn để xóa** mà không ảnh hưởng đến UI lẫn Logic N8N:

| # | Bảng | Trường | Lý do xóa |
|---|------|--------|-----------|
| 1 | `01_DanhSach_Lop` | `session_progress` | Trùng: `completed_sessions` + `total_sessions` |
| 2 | `01_DanhSach_Lop` | `pct_xam` | Tính được: `count_xam / active_students` |
| 3 | `01_DanhSach_Lop` | `pct_do` | Tính được: `count_do / active_students` |
| 4 | `01_DanhSach_Lop` | `pct_vang` | Tính được: `count_vang / active_students` |
| 5 | `01_DanhSach_Lop` | `dia_diem` | Không dùng trong logic hay UI |
| 6 | `01_DanhSach_Lop` | `tinh_trang` | Trùng ngữ nghĩa với `moc_bao_dong` |
| 7 | `02_DuLieu_HocVien` | `student_code` | Trùng hoàn toàn với `student_id` |
| 8 | `02_DuLieu_HocVien` | `class_name` | Trùng lặp — tra cứu qua FK `class_id` |
| 9 | `03_DiemTest_ChiTiet` | `max_grade` | Luôn = 100, không có giá trị |
| 10 | `03_DiemTest_ChiTiet` | `grade_percent` | Trùng với `grade_final` khi max=100 |

**Tổng cộng tiết kiệm:** 10 cột × (53 HV + 275 bản ghi điểm) ≈ **hàng trăm ô Google Sheets** được giải phóng.

---

## PHẦN 4: CẤU TRÚC DATABASE TINH GỌN (FINALIZED)

Sau khi loại bỏ 10 trường thừa, cấu trúc cuối cùng sẵn sàng cho N8N:

### `01_DanhSach_Lop` — 27 cột (giảm 6)
```
class_id | class_name | course_id | teacher_id | teacher_name | teacher_email | lead_email | status | lich_hoc | ngay_khai_giang | ngay_ket_thuc | total_sessions | completed_sessions | active_students | on_hold_students | dropped_students | attendance_class_avg | homework_class_avg | count_xam | count_do | count_vang | count_chua_co_dl | moc_bao_dong | pass_chuan_rate | pass_mem_rate | link_portal | scraped_at
```

### `02_DuLieu_HocVien` — 42 cột (giảm 2)
```
student_id | full_name | phone | email | class_id | registration_status | admitted_at | chuan_dau_ra | attendance_pct | attendance_present | attendance_total | homework_pct | homework_done | homework_total | test_1→test_6 | tests_taken | test_average | nhan_hien_tai | nhan_truoc | nhan_benchmark | co_chuyen_nhan | huong_chuyen_nhan | checkpoint_gan_nhan | pass_chuan_status | pass_chuan_reasons | pass_mem_status | pass_mem_group | pass_mem_label | flag_dh_tut | flag_btvn_tut | flag_cheating | flag_can_review | teacher_feedback_btvn | teacher_feedback_orientation | gv_note | gv_nhan_tam | scraped_at
```

### `03_DiemTest_ChiTiet` — 14 cột (giảm 2)
```
student_id | class_id | class_test_id | test_order | test_name | raw_grade | is_makeup | makeup_grade | grade_final | grade_status | is_cheating | grade_note | nhan_tai_thoi_diem | scraped_at
```

### `04_NhatKy_ChuyenNhan` — 15 cột (không đổi)
### `05_XetDuyet_PassMem` — 17 cột (không đổi)
### `06_CauHinh_HeThong` — 5 cột (không đổi)
### `07_Log_HeThong` — 10 cột (không đổi)
### `08_GiaoVien` — 6 cột (không đổi)

---

> [!TIP]
> **Bước tiếp theo:** Cấu trúc Database này đã được tinh gọn triệt để và sẵn sàng 100% để chuyển sang giai đoạn **Viết luồng N8N** (Data Sync → Label Engine → Email Alert → Review Ticket Creator → Deadline Checker).

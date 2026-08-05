Bạn là một Expert Frontend Developer. Chúng ta vừa có một cuộc họp quan trọng với Lead dự án và có một bản cập nhật lớn (Big Update) nhằm tinh gọn hệ thống IZONE Student Labeling. Giao diện Lead Dashboard hiện tại đang bị "ngợp" và cần được cấu trúc lại để tập trung vào các chỉ số cốt lõi.

Hãy thực hiện việc tái cấu trúc (Refactor) mã nguồn React/Tailwind hiện tại theo các yêu cầu nghiêm ngặt sau:

### 1. CẬP NHẬT GLOBAL (TOÀN HỆ THỐNG)

- **Dark/Light Mode:** Triển khai tính năng chuyển đổi giao diện Sáng/Tối. Sử dụng class `dark:` của Tailwind (ví dụ: `bg-white dark:bg-slate-900`, `text-slate-900 dark:text-white`). Thêm một nút Toggle (Icon Sun/Moon) trên thanh Header hoặc Sidebar.
- **Xóa bỏ Review Center:** Xóa hoàn toàn component và route của trang "Review Center". Luồng duyệt Pass mềm sẽ được xử lý ở hệ thống Portal khác. (Teacher Dashboard giữ nguyên hiện trạng, không thay đổi).

### 2. TÁI CẤU TRÚC "LEAD DASHBOARD"

Xóa bỏ hoàn toàn phần "Risk Leaderboard" cũ. Thay thế và sắp xếp lại Layout của Lead Dashboard theo thứ tự từ trên xuống dưới như sau:

**A. Khu vực 1: Performance Khối (Macro Metrics Cards)**
Thiết kế lại khu vực thẻ thống kê trên cùng thành một Grid (2 hàng x 3 cột hoặc 1 hàng 6 cột trên Desktop) hiển thị 6 chỉ số tổng quan của toàn khối:

1. `Trung bình Điểm danh (Attendance)` (VD: 92.47%)
2. `Trung bình Làm BTVN (HW)` (VD: 93.45%)
3. `Trung bình Pass Chuẩn` (VD: 43.74%)
4. `Trung bình Pass Mềm` (VD: 72.38%)
5. `Tổng HS Bỏ học` (VD: 8)
6. `Tổng HS Bảo lưu` (VD: 13)

**B. Khu vực 2: Timeline Tracking Chart (Mới)**
Thêm một thành phần biểu đồ đường (Line Chart) để theo dõi tiến độ.

- **Tính năng:** Có một Dropdown Arrow (Select box) cho phép Lead chọn: "Toàn Khối" hoặc chọn chi tiết từng "Lớp" (VD: IC2155).
- **Hiển thị:** Biểu đồ vẽ theo trục X là Thời gian (Các tháng / Các bài Test). Trục Y hiển thị các đường chỉ số (Attendance, HW, Tỷ lệ Pass).

**C. Khu vực 3: Master Table (Bảng Quản lý Lớp Cập nhật)**
Tích hợp toàn bộ thông tin các lớp vào bảng này. BẮT BUỘC thêm cột **"Trạng Thái Cảnh Báo"** với logic phân loại dựa trên trung bình của Điểm danh (ĐH) và Bài tập về nhà (BTVN) như sau:

- **Bình thường (Màu Xanh lá):** Trung bình ĐH & BTVN > 80%.
- **Cần theo dõi (Màu Vàng/Cam):** Trung bình ĐH & BTVN từ 70% đến 80%.
- **Cần can thiệp (Màu Đỏ):** Trung bình ĐH & BTVN < 70%.
  (Hiển thị trạng thái này dưới dạng Badge/Pill nổi bật trong bảng). Bảng cũng cần hiển thị tên Giáo viên phụ trách (VD: Nguyễn Quốc Khánh, Bùi Tuấn Hưng...).

**D. Khu vực 4: Bản Đồ Phân Bố Nhãn (Label Distribution)**

- Giữ nguyên biểu đồ Stacked Bar thể hiện tỷ lệ Vàng/Đỏ/Xám theo từng lớp, nhưng ĐẨY XUỐNG DƯỚI CÙNG của trang Lead Dashboard.

### YÊU CẦU KỸ THUẬT:

- Code cần hỗ trợ đầy đủ responsive (Mobile-first).
- Cập nhật lại bộ Mock Data JSON cho phù hợp với 6 chỉ số mới và logic cảnh báo trong bảng Master Table.
- Trả về mã nguồn React component hoàn chỉnh cho trang Lead Dashboard và cấu hình Dark/Light Mode.
  ![1785918315993](image/api_design_payloads/1785918315993.png)

# Thiết Kế Cấu Trúc JSON Payload (Hybrid CQRS)

Tài liệu này định nghĩa cấu trúc dữ liệu JSON được sinh ra bởi N8N (Luồng GET) và dữ liệu từ Frontend gửi lên N8N (Luồng POST) dựa trên 8 bảng dữ liệu gốc từ Google Sheets.
Tất cả các key trong JSON đều sử dụng định dạng `camelCase` để phù hợp với chuẩn của React/TypeScript.

---

## 1. LUỒNG ĐỌC (GET) - N8N TRẢ VỀ CHO FRONTEND

Trong kiến trúc Hybrid CQRS, N8N sẽ là tầng "Read Model". Nó có nhiệm vụ query các sheets, join dữ liệu, tính toán (aggregate) và xuất ra file JSON tĩnh. Frontend chỉ việc fetch file JSON này để hiển thị ngay lập tức.

### A. JSON cho Lead Dashboard (Macro View)

Dữ liệu này dùng để vẽ các biểu đồ tổng quan, heatmap và danh sách các lớp rủi ro cao. N8N cần quét chủ yếu từ bảng `01_DanhSach_Lop.csv`, `04_NhatKy_ChuyenNhan.csv` để tổng hợp.

```json
{
  "summaryMetrics": {
    // [Calculated] N8N tính: (Tổng active_students - Tổng sinh viên Đỏ/Xám) / Tổng active_students
    "healthScore": 85.5,
    // [Calculated] N8N tính: Trung bình cộng của trường 'pass_mem_rate' từ tất cả các lớp (01_DanhSach_Lop.csv)
    "forecastPassPercent": 83.3,
    // [Calculated] N8N đếm số dòng trong 04_NhatKy_ChuyenNhan.csv có huong = "Xuống" trong 7 ngày qua
    "downgradeAlerts": 5,
    // [Aggregated] N8N tính tổng trường 'count_do' của tất cả các lớp (01_DanhSach_Lop.csv)
    "totalRedAlerts": 12 
  },
  
  "labelDistribution": {
    // Dữ liệu vẽ Stacked Bar Chart
    "labels": ["Vàng", "Đỏ", "Xám", "Chưa có DL"],
    "data": [
      {
        "className": "IC2174", // Lấy từ 'class_name' (01_DanhSach_Lop.csv)
        "vang": 14,            // Lấy từ 'count_vang'
        "do": 3,               // Lấy từ 'count_do'
        "xam": 0,              // Lấy từ 'count_xam'
        "chuaCoDl": 1          // Lấy từ 'count_chua_co_dl'
      }
    ]
  },

  "riskLeaderboard": [
    // Top các lớp có số học viên Đỏ hoặc Tỷ lệ nghỉ/BTVN kém nhất
    {
      "classId": 1159,                  // Lấy từ 'class_id' (01_DanhSach_Lop.csv)
      "className": "IC2174",            // Lấy từ 'class_name'
      "teacherName": "Trần Minh Phương",// Lấy từ 'teacher_name'
      "redCount": 3,                    // Lấy từ 'count_do'
      "droppedCount": 3,                // Lấy từ 'dropped_students'
      "avgAttendance": 95.0,            // Lấy từ 'attendance_class_avg'
      "avgHomework": 89.8               // Lấy từ 'homework_class_avg'
    }
  ],

  "masterTable": [
    // Dữ liệu cho bảng Master Class Table
    {
      "classId": 1159,
      "className": "IC2174",
      "teacherName": "Trần Minh Phương",
      "totalStudents": 18,              // Lấy từ 'active_students'
      "progress": "18/27",              // Lấy từ 'session_progress'
      "labelVang": 14,
      "labelDo": 3,
      "labelXam": 0,
      // [Calculated] N8N đếm từ 04_NhatKy_ChuyenNhan.csv (Số HS thăng hạng - Số HS tụt hạng trong tuần)
      "trend": -1 
    }
  ]
}
```

### B. JSON cho Teacher Dashboard & Review Center (Micro View)

Mỗi lớp sẽ có 1 file JSON riêng hoặc gộp chung theo `teacherId`. Dữ liệu yêu cầu join giữa `02_DuLieu_HocVien.csv`, `03_DiemTest_ChiTiet.csv` và `05_XetDuyet_PassMem.csv`.

```json
{
  "classInfo": {
    "classId": 1159,                     // 01_DanhSach_Lop.csv
    "className": "IC2174",
    "teacherName": "Trần Minh Phương",
    "totalStudents": 18,                 // active_students
    "passRate": 83.3                     // pass_mem_rate
  },
  "studentList": [
    {
      "studentId": 18972,                // 02_DuLieu_HocVien.csv
      "studentCode": "18972",            // student_code
      "name": "Nguyễn Việt Anh",         // full_name
      "phone": "0868578476",             // phone
      "currentLabel": "Vàng",            // nhan_hien_tai
  
      "metrics": {
        "attendancePct": 78,             // attendance_pct
        "homeworkPct": 94,               // homework_pct
        "testAverage": 64.2              // test_average
      },
  
      // [Aggregated] N8N lọc các dòng trong 03_DiemTest_ChiTiet.csv khớp với student_id
      "timeline": [ 
        {
          "testName": "Test 1",          // test_name
          "grade": 60.5,                 // grade_final
          "labelAtTime": "Vàng"          // nhan_tai_thoi_diem
        },
        {
          "testName": "Test 2",
          "grade": 70.0,
          "labelAtTime": "Vàng"
        }
      ],
  
      // [Calculated] N8N kiểm tra 05_XetDuyet_PassMem.csv:
      // Nếu có student_id này và review_status = 'Chờ GV' => "pending_review"
      // Nếu review_status = 'Đã duyệt' => "reviewed"
      // Nếu không có => "normal"
      "status": "pending_review",
  
      // Khối này chỉ xuất hiện nếu status là 'pending_review'
      "reviewData": {
        "reviewId": "339c22cf",          // 05_XetDuyet_PassMem.csv -> review_id
        "passMemGroup": "Nhóm 1",        // pass_mem_group
        "deadline": "2026-08-03"         // deadline
      }
    }
  ]
}
```

---

## 2. LUỒNG GHI (POST) - DỮ LIỆU FRONTEND GỬI LÊN N8N WEBHOOK

Khi Giáo viên click nút xác nhận "Pass Mềm" (Quyết định thái độ học tập) tại màn hình Review Center, Frontend sẽ gọi một POST request về Webhook của N8N. Payload cần thiết kế gọn nhẹ, tập trung vào ID và Quyết định.

```json
{
  // Loại hành động giúp N8N định tuyến (Router) workflow phù hợp
  "actionType": "SUBMIT_REVIEW",
  "payload": {
    "reviewId": "339c22cf",         // Ánh xạ để update vào 05_XetDuyet_PassMem.csv
    "studentId": 10162,
    "classId": 1159,
    "teacherId": 305,
    "decision": "Có tiến bộ",       // Các giá trị: "Có tiến bộ" | "Không rõ" | "Không". Ánh xạ vào cột 'gv_decision'
    "teacherNote": "Học sinh dạo này có cố gắng làm BTVN đầy đủ", // Ánh xạ vào cột 'gv_comment'
    "timestamp": "2026-07-29T13:50:00Z" // Dùng để điền vào cột 'gv_confirmed_at'
  }
}
```

### Quy trình xử lý của N8N sau khi nhận Webhook:

1. Xác thực `actionType` là `SUBMIT_REVIEW`.
2. Tìm dòng có `review_id = 339c22cf` trong sheet `05_XetDuyet_PassMem`.
3. Cập nhật `gv_decision`, `gv_comment` và `gv_confirmed_at`.
4. Đổi `review_status` từ "Chờ GV" sang "Hoàn thành".
5. Kích hoạt (Trigger) quá trình generate lại file JSON tĩnh cho Teacher Dashboard để Frontend được cập nhật.

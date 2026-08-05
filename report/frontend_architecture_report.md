# BÁO CÁO PHÂN TÍCH KIẾN TRÚC FRONTEND & YÊU CẦU DỮ LIỆU

> **Dự án:** IZONE Student Labeling & Warning System
> **Giai đoạn:** Hoàn thiện UI/UX (Frontend) & Chốt Data Schema

---

## 1. MỤC TIÊU CHIẾN LƯỢC: TẠI SAO LÀM DASHBOARD TRƯỚC?

Chúng ta đang áp dụng phương pháp phát triển **Top-Down (Từ Giao diện đi ngược về Backend)**. Việc hoàn thiện UI/UX của Dashboard trước khi đụng vào N8N hay Google Sheets mang lại 3 giá trị cốt lõi:

1. **Xác định chính xác Dữ kiện (Data Needs):** Khi nhìn vào một màn hình thực tế (ví dụ: Thẻ học viên cần hiển thị "CC: 95% | BTVN: 89%"), chúng ta biết chắc chắn Backend (N8N) bắt buộc phải tính toán và trả về 2 con số này.
2. **Loại bỏ Dữ liệu rác (Lean Data):** Bất kỳ trường dữ liệu nào trong Google Sheets không có "đất diễn" trên giao diện (ví dụ: *Tình trạng đóng học phí, Địa điểm học...*) đều có thể mạnh tay gạch bỏ hoặc xếp vào nhóm lưu trữ thụ động, giúp API nhẹ và N8N chạy nhanh hơn.
3. **Chốt luồng Nghiệp vụ (User Flow):** Giao diện định hình cách Giáo viên/Lead thao tác (ví dụ: Nút *Submit Review* có 3 lựa chọn Thái độ). Từ đó, Backend dễ dàng thiết kế cấu trúc Webhook nhận dữ liệu sao cho khớp 100%.

> [!TIP]
> **Kết luận:** Dashboard chính là "Bản hợp đồng dữ liệu" (Data Contract). Khi Frontend đã chốt hiển thị cái gì, Backend chỉ việc làm đúng nhiệm vụ: Cung cấp chính xác những con số đó.

---

## 2. CẤU TRÚC HỆ THỐNG: SẼ CÓ NHỮNG TRANG NÀO?

Hệ thống Frontend (React/Tailwind) được chia thành **3 trang (Modules) biệt lập**, phục vụ 3 nhóm nghiệp vụ khác nhau:

| Trang (Page)                      | Đối tượng sử dụng | Mục đích chính (Đặc điểm)                                                                                                            |
| --------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Lead Khối Dashboard** | Quản lý / Lead Khối  | **Macro View:** Giám sát toàn cảnh, theo dõi rủi ro diện rộng, tìm ra lớp đang đi xuống.                                  |
| **2. Teacher Dashboard**    | Giáo viên chủ nhiệm | **Micro View:** Quản lý vi mô cấp độ học viên, xem biến động nhãn và hành động lập tức (gọi điện/nhắn tin).      |
| **3. Review Center**        | Giáo viên chủ nhiệm | **Action View:** Hòm thư điện tử xử lý các Ticket "Pass mềm" hoặc "Cảnh báo khẩn" do hệ thống (N8N) tự động tạo ra. |

---

## 3. ĐẶC ĐIỂM & CHI TIẾT HIỂN THỊ CỦA TỪNG TRANG

Để Backend (N8N) có thể cung cấp đủ dữ liệu, đây là danh sách chi tiết những thứ sẽ hiển thị trên từng trang:

### 3.1. Lead Khối Dashboard (Trang Quản trị Rủi ro)

- **Đặc điểm:** Bao quát, thiên về số liệu tổng hợp (Aggregated Data), sử dụng nhiều biểu đồ và màu sắc cảnh báo (Đỏ/Cam).
- **Dữ kiện cần hiển thị (Backend cần cấp):**
  - **KPI Cards (4 thẻ trên cùng):**
    1. Điểm Sức khỏe toàn khối (Health Score trung bình).
    2. Dự báo tỷ lệ Pass cuối khóa (% Pass chuẩn + % Pass mềm).
    3. Cảnh báo số lượng HV "Tụt nhãn" (Downgrades) trong tuần.
    4. Cảnh báo Đỏ khẩn cấp (Số lượng HV cần can thiệp trong 24h).
  - **Bảng xếp hạng rủi ro (Risk Leaderboard):** Top 5 lớp có Health Score thấp nhất, hiển thị kèm Tên lớp, Tên GV, Tiến độ khóa học, và Số HV Đỏ.
  - **Biểu đồ (Stacked Bar Chart):** Bản đồ phân bố nhãn (Tỷ lệ Vàng/Đỏ/Xám) của toàn bộ các lớp trong Khối.
  - **Master Table:** Bảng danh sách toàn bộ lớp học, hiển thị Sĩ số, Tiến độ (%), Biến động nhãn (↑ Lên / ↓ Tụt), Điểm Health Score, Tỷ lệ Pass.

### 3.2. Teacher Dashboard (Trang Quản lý Lớp & Học viên)

- **Đặc điểm:** Chi tiết, tính hành động cao (Actionable), hiển thị dữ liệu theo cá nhân học viên, tối ưu hiển thị dạng Card (Thẻ) trên Mobile.
- **Dữ kiện cần hiển thị (Backend cần cấp):**
  - **Thông tin Lớp & KPI:** Tên lớp, Tiến độ buổi học, Sĩ số (Active/Dropped), Điểm Test trung bình, Tỷ lệ Chuyên cần/BTVN của cả lớp.
  - **Bộ lọc (Tabs):** Tất cả / HV Nhãn Đỏ / HV Nhãn Vàng / HV Nhãn Xám.
  - **Danh sách Học viên (Student Cards):** Mỗi học viên là 1 Thẻ chứa:
    - Họ tên, SĐT học viên.
    - **Badge Nhãn (Label):** Hiện tại là màu gì, trước đó là màu gì (Biểu thị sự lên/xuống).
    - **Chỉ số sinh tồn (Vital Signs):** % Đi học, % BTVN (Tự động đổi màu đỏ nếu < 90%).
    - **Sparkline Chart:** Biểu đồ mini hiển thị xu hướng điểm 6 bài Test gần nhất.
    - **Lịch sử:** Accordion xem lại lịch sử chuyển nhãn các lần trước (Test 1, Test 2...).
    - **Action Buttons:** Nút "Gọi Phụ Huynh" (Kèm kịch bản gọi) và Nút "Zalo Remind" (Kèm mẫu tin nhắn).

### 3.3. Review Center (Trung tâm Xét duyệt)

- **Đặc điểm:** Tương tác 2 chiều (Bi-directional). Đây là nơi Giáo viên nhập Data đẩy ngược lại cho Backend xử lý.
- **Dữ kiện cần hiển thị (Backend cấp cho UI):**
  - Danh sách các Ticket cần duyệt (Ví dụ: "Học viên Nguyễn Văn A xin Pass mềm Nhóm 1").
  - Lý do cảnh báo từ N8N (Ví dụ: "Test >=60 nhưng CC <90%").
  - Hạn chót xử lý (Deadline) và trạng thái (Quá hạn/Chờ duyệt).
- **Dữ kiện thu thập (UI trả về Backend):**
  - Đánh giá thái độ (3 Options: *Có tiến bộ* / *Không rõ* / *Không*).
  - Nhận xét bằng chữ (Textarea) của GV.
  - Quyết định cuối cùng (Submit Webhook) để N8N đóng Ticket và tính toán lại nhãn.

---

> [!IMPORTANT]
> **Chốt chặn kỹ thuật:** Nhờ việc định hình rõ các thành phần hiển thị ở trên, quá trình viết luồng N8N tiếp theo sẽ vô cùng rành mạch. Chúng ta chỉ cần viết luồng N8N kéo đúng các cột tương ứng từ Google Sheets và map (ánh xạ) nó vào các object JSON mà Dashboard đang chờ sẵn. Mọi thứ dư thừa sẽ bị lược bỏ!

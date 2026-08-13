## 24/07/2026: Họp trao đổi vs Toản về luồng tự động sắp tới

## **Tóm tắt Thực thi (Executive Summary)**

* **Dự án trọng điểm mới:** Triển khai hệ thống tự động phân loại, gắn nhãn (xám, đỏ, vàng) và cảnh báo năng lực học viên, nhằm hỗ trợ giảng viên dự báo sớm tỷ lệ qua môn (pass) của lớp.  
* **Kiến trúc hệ thống ba lớp linh hoạt:** Sử dụng GitHub Pages làm giao diện (Dashboard), Google Sheets làm cơ sở dữ liệu trung gian, và N8N làm động cơ xử lý dữ liệu.  
* **Nhiệm vụ cấp bách của nhân sự:** Toản cần dùng AI để tổng hợp tài liệu nghiệp vụ, tham khảo các luồng mẫu, và ngay lập tức thiết kế các trường dữ liệu (fields) cần thiết trên Google Sheets.

## **Phân tích Cốt lõi (Core Analysis)**

* **Chiến lược Phân loại Học viên (Dự án 3):** Dựa trên dữ liệu lịch sử, học viên được phân thành 3 nhóm năng lực thông qua điểm bài kiểm tra (test):

  * *Nhóm Xám (\<45 điểm):* Nhóm rủi ro cao nhất, gần như không thể cứu vớt dù tỷ lệ đi học và làm bài tập (ĐH\&BTVN) đạt tới 83%.  
  * *Nhóm Đỏ (45 \- 59 điểm):* Nhóm tiềm năng. Tỷ lệ qua môn là 50/50, nhưng nếu được can thiệp và có ĐH\&BTVN lớn hơn 90%, tỷ lệ đạt sẽ vượt 60%.  
  * *Nhóm Vàng (\>=60 điểm):* Nhóm an toàn với khả năng đỗ rất cao.  
* **Luồng Kỹ thuật & Kiến trúc Hệ thống (Technical Architecture):**  
  * *Thu thập dữ liệu:* Sử dụng HTTP Request để trích xuất dữ liệu thô (định dạng JSON) từ trang nhận xét cuối khóa trên portal, nhắm vào các lớp đang chạy (ongoing).  
  * *Xử lý luồng:* Do không có quyền can thiệp vào sự kiện (event trigger) trên portal của bên thứ ba, luồng N8N sẽ được thiết lập chạy theo lịch trình (cron job) hàng ngày để quét dữ liệu.  
  * *Lưu trữ & Hiển thị:* Không dùng SQL Database phức tạp; Google Sheets được chọn làm cơ sở dữ liệu để dễ dàng tinh chỉnh. Giao diện hiển thị sẽ đặt trên GitHub Pages, nơi giảng viên tương tác sẽ tạo ra trigger gửi về N8N để truy vấn dữ liệu từ Sheets.  
  * *Cảnh báo (Alerts):* Hệ thống sẽ tự động gửi email cho giảng viên khi học viên có sự chuyển dịch giữa các nhóm, khi tỷ lệ chuyên cần tụt giảm, hoặc khi có điểm bài test cuối (Test 6\) để kích hoạt luồng xét duyệt ngoại lệ (pass sure review).

Tài liệu đọc tham khảo:

[Meeting Report Luồng Dán nhãn - Phân loại HV - Auto Pass/Fail](https://docs.google.com/document/d/1bmdJk8Bk1PjTCfiqsar_aLk1GEvH7PZSPZtE_ST2x_s/edit?tab=t.0#heading=h.o4q0ysfqjal9)

[Benchmark Khóa 34 (Đề xuất)](https://docs.google.com/document/d/1bBBO3NhTaq40P6DiIpQxFidlT1Nqt2zNAQeocvORG9U/edit?tab=t.0)

Luồng tham khảo: [▶️ Cập nhật dữ liệu các lớp 34 \- n8n](https://n8n-ai.izone.edu.vn/workflow/uDLh0l1LYCfJx16Q) 

## **Tổng hợp và Xung đột (Synthesis & Conflict)**

**Điểm Đồng thuận (Synthesis):**

* **Chiến lược Tối ưu Hóa Công cụ:** Dữ liệu cho thấy sự nhất quán tuyệt đối trong tư duy thiết kế luồng của người quản lý: ưu tiên các công cụ linh hoạt, tiết kiệm tài nguyên. Việc chọn Google Sheets thay vì xây dựng cơ sở dữ liệu SQL đồ sộ là minh chứng cho việc đo lường đúng quy mô dự án, giúp triển khai nhanh và dễ bảo trì.

**Xung đột và Đánh đổi Nội tại (Conflicts & Trade-offs):**

* **Độ trễ Dữ liệu (Scheduled vs. Real-time Trigger):** Tồn tại một sự đánh đổi lớn về mặt kỹ thuật. Vì không có quyền can thiệp trực tiếp vào hệ thống portal để tạo trigger ngay khi giảng viên nhập điểm, hệ thống tự động hóa bắt buộc phải quét theo lịch trình (cron job quét hàng ngày). Điều này đồng nghĩa với việc thông tin cảnh báo gửi tới giảng viên sẽ có độ trễ nhất định (không phải theo thời gian thực).  
* **Tính Phức tạp của Ngoại lệ (Pass vớt):** Mặc dù quy tắc đỗ tiêu chuẩn rất rõ ràng (ĐH\&BTVN \>= 90% và Trung bình Test \>= 60), hệ thống lại yêu cầu xử lý các giả thuyết (assumption) linh hoạt từ giảng viên cho các nhóm điểm thấp hơn nhưng thái độ học tốt (ví dụ: điểm 50-54 nhưng ĐH\&BTVN 100%, hoặc điểm 55-59 nhưng ĐH\&BTVN \>= 90%). Sự linh hoạt trong chính sách giáo dục này sẽ tạo ra xung đột với tính cứng nhắc của máy móc, đòi hỏi nhân sự phải thiết kế logic (logic tree) trong N8N cực kỳ chặt chẽ để hệ thống không gắn nhãn sai hoặc bỏ sót email cảnh báo cho giảng viên.


# **Meeting Brief: Hệ thống Dán nhãn \+ Phân loại HV \+ Auto Pass/Fail**

**Người tham gia:** anh Đức , anh Hưng Đức Anh

**Mục tiêu buổi họp:**

1. Thống nhất được nhân sự tham gia của các bên (Khánh Linh, Toản có hỗ trợ trong này không)  
2. **Thống nhất về các thông tin:** tần suất gửi, nơi GV nhận, cách trao đổi dữ liệu  
3. Xác định **đầu việc của từng người**

## **A. Tổng quan**

Hệ thống này giống như **một trợ lý ảo** thay mình làm mấy việc lặp đi lặp lại. Thay vì mỗi tuần phải tay kéo báo cáo, mở Excel, filter từng lớp, tính điểm trung bình... thì hệ thống tự chạy hết.

Dưới đây là **7 bước hệ thống tự làm** — đọc từ trên xuống là hiểu luồng:

### **Các bước định triển khai**

| Bước | Thủ Công | Sau khi có hệ thống (tự động) |
| ----- | ----- | ----- |
| **B1: Lấy dữ liệu** | GV phải vào portal để lấy thông tin điểm test | Hệ thống **tự động** vào LMS lấy dữ liệu tất cả các lớp cùng lúc — không ai phải làm gì |
| **B2: Tính toán & phân loại** | GV phải copy điểm Test vào GG sheet và đối chiếu thủ công giữa các mốc điểm theo chuẩn đầu ra \-\> Chia học viên thành các nhóm | Hệ thống **tự động** chạy công thức: cộng điểm → chia TB → gắn nhãn Xám/Đỏ/VàngMỗi khối sẽ có 1 công thức riêng \-\> có nghĩa mỗi khối sẽ có các luồng khác nhau  |
| **B3: Lưu vào Google Sheets** | Mỗi GV có file riêng, mỗi nơi một kiểu, không ai tổng hợp được | **Tất cả** dữ liệu vào **1 bảng duy nhất** — ai cũng xem được (nhưng chỉ xem phần của mình) |
| **B4: Hiển thị Dashboard** | GV tự mở sheet, scroll tìm từng học viên | Dùng github page để **1 trang web đơn giản → giúp interact** — GV mở link là thấy ngay dashboard lớp mình |
| **B5: Gửi email thông báo** | Không có — GV tự nhớ, Lead phải nhắc | Khi có HV chuyển nhãn (VD: Vàng \-\> Đỏ), hệ thống **tự gửi email** cho GV kèm link xem |
| **B6: Xét Pass/Fail cuối khóa** | Cuối khóa mới ngồi tổng hợp từng case một | Hệ thống **tự động** **tính Pass / Fail / Chờ Review** dựa trên công thức đã thống nhất → Sẽ có 1 luồng riêng cho việc thông báo về Pass/Fail cuối khóa  |
| **B7: GV confirm Pass mềm** | GV phải đọc lại các tiêu chí về Pass chuẩn \+ Pass mềm và sau đó thì | GV mở link dashboard, thấy danh sách HV cần review, **bấm nút "Xác nhận" hoặc "Từ chối"** → xong |

### **Chuyện gì xảy ra sau mỗi bài test?**

| Thời điểm | Hệ thống làm gì? | GV thấy gì? |
| ----- | ----- | ----- |
| **Các sáng hàng tuần** | Tự vào LMS lấy điểm danh \+ BTVN mới nhất | Không cần làm gì |
| **Sau mỗi bài test** | Tự tính lại điểm trung bình → gắn nhãn mới (Xám/Đỏ/Vàng) cho từng HV | Nhận email: "Lớp IC1924: 2 HV Xám→Đỏ, 1 HV Vàng→Đỏ" |
| **Khi HV tụt ĐH/BTVN** | Tự phát hiện HV có tỉ lệ \< 80% | Nhận email: "Nguyễn Văn A — Đỏ — ĐH tuần này 75%" |
| **Sau khi có điểm Test cuối**  | Tự tính [Pass/Fail/Chờ Review](https://docs.google.com/document/d/1bBBO3NhTaq40P6DiIpQxFidlT1Nqt2zNAQeocvORG9U/edit?tab=t.0) cho tất cả HV | Nhận email dashboard để confirm các case **Chờ Review** |
|  |  |  |

> **Điểm quan trọng:** GV không phải vào Sheets để chỉnh sửa. GV chỉ mở **1 link web** (giống như mở 1 trang web bình thường), xem dashboard lớp mình, và bấm nút nếu cần confirm. Mọi thứ khác hệ thống tự lo.

## **B. Câu hỏi cần thảo luận**

### **B1. Về LMS API**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 1 | **Nếu LMS không trả đủ dữ liệu của 1 lớp** (VD: thiếu điểm test 3 của 5 HV) — hệ thống nên: dừng không ghi gì hết, hay ghi những gì có \+ đánh dấu "thiếu dữ liệu"? | **Với 03 → 45:** cào bằng? **Với 56-67:** Trọng số? |

### **B2. Về Giao diện hiển thị**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 1 | Sẽ dùng platform nào thì tiện nhất cho GV? | Dùng github page → nó là link trang web hiển thị → sẽ có nút bấm → Khi bấm nút xong thì no |

### **B3. Về Logic xét phân loại**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 2 | **ĐH và BTVN nên gộp chung hay tách riêng?** Hiện mình đang nói "ĐH\&BTVN" như 1 chỉ số, nhưng thực tế có HV đi học đủ nhưng không làm bài. Nếu tách ra thì Pass chuẩn cần cả 2 ≥ 90%, đúng không anh? | ĐH & BTVN cần tách riêng. |
| 3 | **TB test tính trên mấy test?** Tất cả 6 test, hay bỏ test 1 (vì HV mới vào còn bỡ ngỡ)? Hay chỉ tính 5 test cao nhất? Có trường hợp HV vắng test được học bù không? | Trung bình test sẽ tính trên tất cả số Test cố trong khóa học  |

### **B4. Một số edge cases**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 4 | **HV bảo lưu giữa khóa thì sao?** Họ mới học 3 buổi rồi nghỉ 2 tháng rồi quay lại — dữ liệu cũ còn dùng được không? Có tính ĐH/BTVN trước khi bảo lưu không? |  |
| 5 | **HV vào lớp muộn (thiếu test 1-2) — mẫu số tính TB là gì?** VD: vào từ test 3, TB chỉ chia cho 4 test còn lại, hay vẫn chia 6? | TH1: bảo lưu từ lớp khác vào \-\> lấy điểm test đã làm ở lớp trước \-\> cho vào công thức và chia TB (Câu hỏi thêm: bộ phận nào sẽ chịu trách nhiệm là ai? Bên tuyển sinh hay QM?)  |
| 6 | **HV bị phát hiện cheating 1 test — điểm test đó hủy, vậy TB tính sao?** Chia cho 5 test còn lại, hay vẫn chia 6 và coi test đó \= 0? | Coi Test \= 0 |
| 7 | **HV không có điểm test (ốm, vắng không phép, chưa thi bù) — hệ thống gắn nhãn gì?** "Chưa có dữ liệu" hay GV tự gắn tạm? Nếu GV gắn tạm, GV có được gắn Xám không? | Nếu HV chưa có điểm Test thì tạm thời sẽ để trống/GV có thể tự điền để cập nhật  |
| 8 | **HV thuộc diện "Chờ Review" nhưng GV không chịu confirm — hết hạn thì xử lý sao?** Tự động Fail, giữ nguyên Chờ Review, hay chuyển cho Lead? Deadline bao nhiêu ngày là hợp lý? | Deadline nên là 1 tuần từ này hệ thống cho ra thông báo GV nên nhận được mail báo tình trạng này ngay khi có thông bào từ hệ thống Quá deadline mà GV chưa có action thì hệ thống báo cho Lead (qua hình thức gửi mail cảnh báo GV và cc lead khối) |

### **B5. Về trải nghiệm GV**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 9 | **GV nhận thông báo qua email — có ổn không?** Hay nên làm thêm 1 kênh nữa như group Zalo? | GV nhận thông báo qua email |
| 10 | **Dashboard GV nên hiển thị gì đầu tiên khi mở lên?** Em nghĩ nên là: (1) Số HV từng nhãn \+ (2) Danh sách HV "cần chú ý"  | Dashboard cần được thiết kế dễ nhìn, trực quan. GV  nhìn vào là nắm được tình hình chung luôn |

### **B6. Về quy trình**

| \# | Câu hỏi | Chốt ý kiến |
| ----- | ----- | ----- |
| 13 | **Lead khối muốn thấy gì trên dashboard Admin?** Chỉ cần biết lớp nào có nhiều Xám/Đỏ, hay cần xem được chi tiết từng HV?  | Lead nên tập trung vào bức tranh lớn: xám/đỏ chiếm bao nhiêu phần trăm của lớp; mốc báo động (ae cần trao đổi thêm để đặt ra, có thể là 40-50%); tỷ lệ HV từ xanh xuống xám/đỏ lead vẫn có thể xem chi tiết thông số của từng HV nhưng không nên show hết trên dashboard \-\> có điều hướng ra thông số này |

## 


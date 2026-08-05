# **Meeting Brief: Hệ thống Dán nhãn + Phân loại HV + Auto Pass/Fail** 

**Người tham gia:** anh Đức , anh Hưng Đức Anh 

# **Mục tiêu buổi họp:** 

1. Thống nhất được nhân sự tham gia của các bên (Khánh Linh, Toản có hỗ trợ trong này không) 

2. **Thống nhất về các thông tin:** tần suất gửi, nơi GV nhận, cách trao đổi dữ liệu 

3. Xác định **đầu việc của từng người** 

# **A. Tổng quan** 

Hệ thống này giống như **một trợ lý ảo** thay mình làm mấy việc lặp đi lặp lại. Thay vì mỗi tuần phải tay kéo báo cáo, mở Excel, filter từng lớp, tính điểm trung bình... thì hệ thống tự chạy hết. 

Dưới đây là **7 bước hệ thống tự làm** — đọc từ trên xuống là hiểu luồng: 

# **Các bước định triển khai** 

# **Sau khi có hệ thống (tự động)** 

**Bước Thủ Công Sau khi có hệ thống (tự động) B1: Lấy dữ liệu** GV phải vào portal để lấy thông tin Hệ thống **tự động** vào LMS lấy dữ điểm test liệu tất cả các lớp cùng lúc — không ai phải làm gì **B2: Tính toán** GV phải copy điểm Test vào GG Hệ thống **tự động** chạy công thức: **& phân loại** sheet và đối chiếu thủ công giữa cộng điểm → chia TB → gắn nhãn các mốc điểm theo chuẩn đầu ra Xám/Đỏ/Vàng -> Chia học viên thành các nhóm 

Mỗi khối sẽ có 1 công thức riêng -> có nghĩa mỗi khối sẽ có các luồng khác nhau 

**B3: Lưu vào** Mỗi GV có file riêng, mỗi nơi một **Tất cả** dữ liệu vào **1 bảng duy nhất Google Sheets** kiểu, không ai tổng hợp được — ai cũng xem được (nhưng chỉ xem phần của mình) 

|**B4: Hiển thị**|GV tự mở sheet, scroll tìm từng|Dùng github page để**1 trang web**|
|---|---|---|
|**Dashboard**|học viên|**đơn giản → giúp interact**— GV mở<br>link là thấy ngay dashboard lớp<br>mình|
|**B5: Gửi email**<br>**thông báo**|Không có — GV tự nhớ, Lead phải<br>nhắc|Khi có HV chuyển nhãn (VD: Vàng<br>-> Đỏ), hệ thống**tự gửi email**cho<br>GV kèm link xem|
|**B6: Xét**|Cuối khóa mới ngồi tổng hợp từng|Hệ thống**tự động** **tính Pass / Fail /**|
|**Pass/Fail cuối**|case một|**Chờ Review**dựa trên công thức|
|**khóa**||đã thống nhất|
|**B7: GV**<br>|GV phải đọc lại các tiêu chí về|GV mở link dashboard, thấy danh|
|**confrm Pass**<br>**mềm**|Pass chuẩn + Pass mềm và sau đó<br>thì|sách HV cần review,**bấm nút "Xác**<br>**nhận" hoặc "Từ chối"**→ xong|



|**Chuyện gì xảy ra s**|**au mỗi bài test?**||
|---|---|---|
|**Thời điểm**|**Hệ thống làm gì?**|**GV thấy gì?**|
|**Các sáng hàng**<br>**tuần**|Tự vào LMS lấy điểm danh + BTVN mới<br>nhất|Không cần làm gì|
|**Sau mỗi bài test**|Tự tính lại điểm trung bình → gắn nhãn<br>mới (Xám/Đỏ/Vàng) cho từng HV|Nhận email: "Lớp IC1924: 2<br>HV Xám→Đỏ, 1 HV Vàng→Đỏ"|
|**Khi HV tụt**|Tự phát hiện HV có tỉ lệ < 80%|Nhận email: "Nguyễn Văn A —|
|**ĐH/BTVN**||Đỏ — ĐH tuần này 75%"|
|**Sau khi có điểm**|Tự tính Pass/Fail/Chờ Review<br> cho tất|Nhận email dashboard để<br>|
|**Test cuối**|cả HV|confrm các case**Chờ**<br>**Review**|



**Điểm quan trọng:** GV không phải vào Sheets để chỉnh sửa. GV chỉ mở **1 link web** (giống như mở 1 trang web bình thường), xem dashboard lớp mình, và bấm nút nếu cần confirm. Mọi thứ khác hệ thống tự lo. 

# **B. Câu hỏi cần thảo luận** 

# **B1. Về LMS API** 

|**#**<br>**Câu hỏi**|**Chốt ý kiến**|
|---|---|
|1<br>**Nếu LMS không trả đủ dữ liệu của 1 lớp**(VD: thiếu điểm test 3 của 5|**Với 03 → 45:**|
|HV) — hệ thống nên: dừng không ghi gì hết, hay ghi những gì có + đánh|cào bằng?|
|dấu "thiếu dữ liệu"?|**Với 56-67:**|
||Trọng số?|



# **B2. Về Giao diện hiển thị** 

|**#**|**Câu hỏi**|**Chốt ý kiến**||
|---|---|---|---|
|1|Sẽ dùng platform nào thì<br>tiện nhất cho GV?|Dùng github page → nó là link tran<br>nút bấm → Khi bấm nút xong thì n|g web hiển thị → sẽ có<br>o|
|**3.**<br>**#**|**Về Logic xét phân loại**<br>**Câu hỏi**||**Chốt ý kiến**|
|2|**ĐH và BTVN nên gộp chung**<br>nói "ĐH&BTVN" như 1 chỉ số<br>nhưng không làm bài. Nếu tá<br>90%, đúng không anh?|**hay tách riêng?**Hiện mình đang<br>, nhưng thực tế có HV đi học đủ<br>ch ra thì Pass chuẩn cần cả 2 ≥|ĐH & BTVN cần<br>tách riêng.|
|3|**TB test tính trên mấy test?** <br>mới vào còn bỡ ngỡ)? Hay ch<br>hợp HV vắng test được học b|Tất cả 6 test, hay bỏ test 1 (vì HV<br>ỉ tính 5 test cao nhất? Có trường<br>ù không?|Trung bình test sẽ<br>tính trên tất cả số<br>Test cố trong khóa<br>học|



**B3. Về Logic xét phân loại** 



<!-- Start of picture text -->
B4. Một số edge cases<br><!-- End of picture text -->

|**#**<br>**Câu hỏi**|**Chốt ý kiến**|
|---|---|
|4<br>**HV bảo lưu giữa khóa thì sao?**Họ mới<br>học 3 buổi rồi nghỉ 2 tháng rồi quay lại —<br>dữ liệu cũ còn dùng được không? Có tính<br>ĐH/BTVN trước khi bảo lưu không?||
|5<br>**HV vào lớp muộn (thiếu test 1-2) — mẫu**<br>**số tính TB là gì?**VD: vào từ test 3, TB chỉ<br>chia cho 4 test còn lại, hay vẫn chia 6?|TH1: bảo lưu từ lớp khác vào -> lấy điểm<br>test đã làm ở lớp trước -> cho vào công<br>thức và chia TB (Câu hỏi thêm: bộ phận<br>nào sẽ chịu trách nhiệm là ai? Bên tuyển<br>sinh hay QM?)|
|6<br>**HV bị phát hiện cheating 1 test — điểm**<br>**test đó hủy, vậy TB tính sao?**Chia cho 5<br>test còn lại, hay vẫn chia 6 và coi test đó =<br>0?|Coi Test = 0|
|7<br>**HV không có điểm test (ốm, vắng không**<br>**phép, chưa thi bù) — hệ thống gắn nhãn**<br>**gì?**"Chưa có dữ liệu" hay GV tự gắn tạm?<br>Nếu GV gắn tạm, GV có được gắn Xám<br>không?|Nếu HV chưa có điểm Test thì tạm thời<br>sẽ không|
|8<br>**HV thuộc diện "Chờ Review" nhưng GV**<br>**không chịu confrm — hết hạn thì xử lý**<br>**sao?**Tự động Fail, giữ nguyên Chờ Review,<br>hay chuyển cho Lead? Deadline bao nhiêu<br>ngày là hợp lý?|Deadline nên là 1 tuần từ này hệ thống<br>cho ra thông báo<br>GV nên nhận được mail báo tình trạng<br>này ngay khi có thông bào từ hệ thống<br>Quá deadline mà GV chưa có action thì<br>hệ thống báo cho Lead (qua hình thức<br>gửi mail cảnh báo GV và cc lead khối)|



**B5. Về trải nghiệm GV** 

**# Câu hỏi Chốt ý kiến** 

|9<br>**GV nhận thông báo qua email — có ổn**|GV nhận thông báo qua email|
|---|---|
|**không?**Hay nên làm thêm 1 kênh nữa như||
|group Zalo?||
|1<br>**Dashboard GV nên hiển thị gì đầu tiên khi**|Dashboard cần được thiết kế dễ|
|0<br>**mở lên?**Em nghĩ nên là: (1) Số HV từng nhãn|nhìn, trực quan. GV  nhìn vào là nắm|
|+ (2) Danh sách HV "cần chú ý"|được tình hình chung luôn|



# **B6. Về quy trình** 

|**#**|**Câu hỏi**|**Chốt ý kiến**|
|---|---|---|
|1|**Lead khối muốn thấy gì trên**|Lead nên tập trung vào bức tranh lớn: xám/đỏ|
|3|**dashboard Admin?**Chỉ cần biết<br>lớp nào có nhiều Xám/Đỏ, hay cần<br>xem được chi tiết từng HV?|chiếm bao nhiêu phần trăm của lớp; mốc báo<br>động (ae cần trao đổi thêm để đặt ra, có thể là<br>40-50%); tỷ lệ HV từ xanh xuống xám/đỏ|
|||lead vẫn có thể xem chi tiết thông số của từng<br>HV nhưng không nên show hết trên dashboard<br>-> có điều hướng ra thông số này|




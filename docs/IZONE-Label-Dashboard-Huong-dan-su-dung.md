# Hướng dẫn sử dụng IZONE Label Dashboard

## 1. Mục đích của dashboard

Dashboard dùng để theo dõi chất lượng học viên và phát hiện sớm các trường hợp cần can thiệp trong các lớp IZONE. Hệ thống phục vụ hai góc nhìn:

- **Lead Khối Dashboard:** nhìn toàn bộ khối, so sánh các lớp và theo dõi xu hướng.
- **Góc nhìn lớp / giáo viên:** xem danh sách học viên của một lớp, mức độ rủi ro và hành động cần làm trong ngày.

Dashboard không thay thế Portal IZONE. Các nút gọi phụ huynh và nhắc Zalo hỗ trợ chuẩn bị nội dung liên hệ; nút duyệt Pass mềm đưa người dùng sang Portal.

> **Lưu ý về phiên bản hiện tại:** codebase hiện là frontend prototype. Dữ liệu được sinh từ dữ liệu mock trong `src/data/generator`, chưa có API, đăng nhập, lưu chỉnh sửa hoặc đồng bộ trực tiếp trong trình duyệt. Các số trong tài liệu này mô tả đúng logic đang chạy trong code hiện tại.

## 2. Bắt đầu sử dụng

### 2.1. Chọn màn hình

Thanh bên trái có hai chức năng:

- **Lead Khối Dashboard:** màn hình tổng hợp toàn khối.
- **Lớp: [mã lớp]:** màn hình chi tiết của lớp đang chọn.

Ở thanh trên cùng, mục **Lớp đang chọn** cho phép đổi lớp nhanh. Khi bấm vào một dòng trong **Bảng Quản Lý Toàn Bộ Lớp**, dashboard cũng chuyển thẳng sang màn hình chi tiết của lớp đó.

Các nút phụ:

- Biểu tượng mặt trăng/mặt trời: đổi giao diện sáng/tối.
- Biểu tượng mũi tên: mở trang lớp tương ứng trên Portal IZONE.
- **Export Dữ Liệu:** hiện đang là nút giao diện, chưa có logic xuất file trong code hiện tại.

### 2.2. Chọn kỳ báo cáo

Trong màn hình Lead, chọn tháng tại **Kỳ báo cáo**. Các KPI, delta và biểu đồ xu hướng phía trên được tính cho kỳ đã chọn và so với kỳ trước.

Thanh ngữ cảnh cho biết:

- số lớp và số học viên active trong kỳ;
- số lớp mới khai giảng hoặc vừa kết thúc so với kỳ trước;
- thời điểm dữ liệu được đồng bộ;
- số học viên chưa đủ dữ liệu.

Khi hiển thị `—`, nghĩa là chỉ số chưa tính được do không có mẫu số phù hợp, không phải 0% và cũng không phải không có học viên.

> **Giới hạn cần nhớ:** trong phiên bản hiện tại, **Master Table** và **Label Distribution** vẫn hiển thị hiện trạng hôm nay của các lớp, không lọc theo kỳ báo cáo đang chọn. Vì vậy khi xem lại tháng cũ, hãy dùng KPI và biểu đồ xu hướng cho số liệu lịch sử; không dùng hai bảng phía dưới để kết luận về tháng đó.

## 3. Màn hình Lead Khối Dashboard

### 3.1. Sáu KPI đầu trang

#### Điểm danh (TB)

Tỷ lệ đi học trung bình của học viên active trong khối.

Ở cấp lớp:

```text
Điểm danh = tổng số buổi có mặt của học viên active
            / tổng số buổi phải học của các học viên active × 100
```

Ở cấp khối, các lớp được gộp **có trọng số theo số học viên active**, không lấy trung bình đơn giản của các lớp. Vì vậy lớp có 20 học viên đóng góp nhiều hơn lớp có 8 học viên.

Màu hiển thị ở các thẻ/lớp:

- `>= 80%`: tốt;
- `70%–<80%`: cần theo dõi;
- `<70%`: cần can thiệp.

#### Làm BTVN (TB)

Tỷ lệ hoàn thành/nộp bài tập về nhà.

```text
BTVN = tổng số bài đã hoàn thành / tổng số bài phải làm × 100
```

Chỉ số cấp khối cũng được gộp có trọng số theo số học viên active. Màu dùng cùng mốc 80% và 70% như Điểm danh.

#### Pass chuẩn

Tỷ lệ học viên đạt đủ cả ba điều kiện chuẩn:

```text
Điểm danh >= 90% VÀ BTVN >= 90% VÀ điểm TB test >= 60
```

Ở cấp khối, chỉ các lớp đã có ít nhất một bài test mới được đưa vào mẫu số của KPI. Lớp chưa thi không bị tính là 0%.

Dòng chú thích trên thẻ cho biết tỷ lệ đang tính trên bao nhiêu lớp đã có test, ví dụ `trên 4/10 lớp đã có test`.

Trạng thái ở từng học viên có bốn cách hiểu:

- **Đạt tiêu chuẩn:** đủ cả ba điều kiện.
- **Có khả năng pass:** điểm TB test đã đạt `>=60`, nhưng còn thiếu điểm danh hoặc BTVN chuẩn.
- **Chưa đạt điều kiện pass:** điểm TB test còn dưới 60.
- **Chưa đủ DL:** chưa có điểm test để kết luận.

#### Pass mềm

Pass mềm là nhánh ngoại lệ/được phép xem xét theo nhóm. Các nhóm trong code hiện tại:

| Nhóm | Điều kiện | Cách xử lý |
|---|---|---|
| Nhóm 1 | TB test `50–<55`, Điểm danh `100%`, BTVN `100%` | Học viên active đủ điều kiện để GV xem xét |
| Nhóm 2 | TB test `55–<60`, Điểm danh `>=90%`, BTVN `>=90%` | Học viên active đủ điều kiện để GV xem xét |
| Nhóm 3 | TB test `>=60` | Tự động đạt pass mềm theo logic hiện tại |

Học viên Nhóm 1 và Nhóm 2 có `isEligibleForReview = true`, được đếm vào **Chờ duyệt Pass**. Nhóm 3 đạt tự động nên không tạo hồ sơ chờ GV.

Có một điểm cần phân biệt khi đọc số liệu: **KPI Pass mềm ở cấp khối/lớp hiện không đếm theo đầy đủ ba nhóm trên**. Snapshot cấp lớp đếm học viên có TB test `>=50`, sau đó gộp tỷ lệ theo các lớp đã có test. Vì vậy KPI Pass mềm có thể rộng hơn số học viên đang mang trạng thái `Đạt pass mềm` theo logic chi tiết của từng học viên.

#### Chuyển dịch nhãn

Đây là số **lượt thay đổi nhãn**, không phải số học viên duy nhất.

```text
Chuyển dịch nhãn ròng = số lượt đi lên − số lượt đi xuống
```

Ví dụ, một học viên đổi từ Đỏ lên Vàng rồi lại rơi xuống Đỏ trong cùng kỳ tạo ra hai event. Vì vậy `+3 lượt` không có nghĩa là có đúng 3 học viên được cải thiện.

Nhãn chỉ được tính lại khi có bài test mới. Nếu kỳ không có lớp nào thi, `0` event có nghĩa là **chưa có dữ liệu mới**, không phải khối chắc chắn ổn định.

Mức độ của event:

- **Recovery:** đi lên, bất kể bao nhiêu bậc.
- **Warning:** Vàng → Đỏ.
- **Serious:** Đỏ → Xám.
- **Critical:** Vàng → Xám, rơi hai bậc trong một lần tính lại.

#### Bỏ học

KPI chính là số học viên đã bỏ học **lũy kế từ đầu khóa** trong các lớp của kỳ. Delta bên cạnh mới là phần thay đổi giữa kỳ hiện tại và kỳ trước.

Do đó không được đọc con số lớn như “số học viên bỏ học trong tháng” nếu chỉ nhìn KPI chính.

### 3.2. Delta và mũi tên thay đổi

Delta là chênh lệch giữa kỳ đang chọn và kỳ trước:

```text
Delta = giá trị kỳ hiện tại − giá trị kỳ trước
```

Delta chỉ so sánh các lớp xuất hiện ở **cả hai kỳ**. Điều này tránh việc một lớp yếu kết thúc và một lớp mới mở làm số liệu tưởng như cải thiện dù chất lượng thực tế không đổi.

Ví dụ:

- `▲ 2.5 điểm`: tỷ lệ tăng 2.5 điểm phần trăm;
- `▼ 1 HV`: số học viên giảm 1 người;
- `▲ 2 lượt`: số event chuyển nhãn ròng tăng 2 lượt;
- `chưa so sánh được`: không có lớp chung hoặc một trong hai kỳ không có dữ liệu.

Màu của mũi tên phản ánh tốt/xấu, không chỉ phản ánh tăng/giảm:

- Tăng Điểm danh, BTVN, Pass hoặc chuyển dịch nhãn: tốt hơn.
- Tăng Bỏ học: xấu hơn.

Dòng ghi `thay đổi tính trên X/Y lớp so sánh được` là mẫu số của delta, không phải mẫu số của KPI chính.

### 3.3. Hai biểu đồ xu hướng

#### Chất lượng vận hành

Hiển thị Điểm danh và BTVN của tối đa 13 tuần gần nhất, tính đến cuối kỳ đang chọn. Đây là trục thời gian theo lịch.

#### Kết quả

Hiển thị Pass chuẩn và Pass mềm theo tuần. Chỉ các lớp đã có test trong tuần đó được tính. Tooltip cho biết có bao nhiêu lớp thi trong tuần.

Nếu đường biểu đồ bị ngắt, tuần đó chưa có dữ liệu test phù hợp. Không nối đường qua khoảng trống và không đọc khoảng trống là 0%.

## 4. Bảng quản lý lớp

Bảng có ô tìm kiếm theo mã lớp, tên khóa hoặc tên giáo viên. Bấm vào một dòng hoặc nút **Vào lớp** để mở màn hình học viên của lớp.

Các cột:

- **Sĩ số (Active):** số học viên đang active / tổng số học viên được ghi nhận. Tổng số có thể bao gồm học viên on-hold, transferred hoặc dropped.
- **Điểm danh / BTVN:** hai tỷ lệ trung bình của lớp.
- **Tiến độ:** số buổi đã hoàn thành / tổng số buổi của khóa, hiển thị dưới dạng phần trăm.
- **Trạng thái Cảnh báo:** trạng thái vận hành của lớp.
- **Tỷ lệ Pass (Chuẩn/Mềm):** tỷ lệ pass chuẩn / pass mềm.

### Cách tính Trạng thái Cảnh báo

Code hiện tại dùng hai tỷ lệ vận hành:

```text
TB vận hành = (Điểm danh + BTVN) / 2
```

Sau đó phân loại:

- **Bình thường:** TB vận hành `>80` và cả Điểm danh, BTVN đều `>=70`.
- **Cần theo dõi:** TB vận hành `>=70` nhưng chưa đạt điều kiện Bình thường.
- **Cần can thiệp:** TB vận hành `<70`.

Đây là cảnh báo vận hành trên bảng, khác với `classRiskLevel` và `healthScore` trong dữ liệu lớp. Không nên coi hai loại điểm này là cùng một công thức.

## 5. Bản đồ phân bố nhãn

Biểu đồ thanh ngang so sánh số học viên theo ba nhãn:

- **Vàng:** an toàn hơn, điểm TB test `>=60`.
- **Đỏ:** nhóm tiềm năng/cần can thiệp, điểm TB test `45–<60`.
- **Xám:** rủi ro cao/gần như fail, điểm TB test `<45`.
- **Chưa có DL:** chưa có điểm test; hiện không được vẽ thành một thanh màu trong biểu đồ.

Điểm dùng để gán nhãn học viên là **điểm TB tích lũy của các bài test đã có**, không phải chỉ điểm bài test gần nhất. Nếu chưa có điểm, nhãn là `Chưa có DL`.

`Nhãn xuất phát`/benchmark được suy ra từ bài test đầu tiên; nhãn hiện tại được suy ra từ TB tích lũy đến bài test mới nhất.

> Biểu đồ này cũng đang hiển thị hiện trạng hôm nay, không lọc theo kỳ đã chọn ở thanh Kỳ báo cáo.

## 6. Màn hình chi tiết lớp / Teacher view

### 6.1. Thông tin đầu lớp

Khu vực đầu trang hiển thị:

- tên lớp và khóa học;
- trạng thái khóa học và số buổi đã học / tổng số buổi;
- giáo viên chủ nhiệm;
- lịch học;
- số active / tổng số học viên;
- nút **Gọi gấp** và **Nhắc Zalo**.

Sidebar **Tổng quan lớp** lặp lại ba chỉ số: Điểm danh, BTVN và Tỷ lệ Pass chuẩn, kèm màu trực quan.

### 6.2. Ba thẻ “Can thiệp 30 giây”

#### Cần gọi phụ huynh gấp

Một học viên được đưa vào tập gọi nếu thỏa **ít nhất một** điều kiện:

```text
suggestedAction = call_parent
HOẶC nhãn hiện tại = Đỏ
HOẶC Điểm danh <80%
```

Vì đây là phép OR, học viên nhãn Đỏ vẫn được liệt kê dù `suggestedAction` không phải `call_parent`.

Nút **Lọc bảng HV này** chuyển bảng sang nhóm **Nguy cấp & Tụt nhãn**. Nút **Gọi ngay (SĐT + Kịch bản)** mở danh sách học viên, số điện thoại và kịch bản gọi có thể sao chép.

#### Cần nhắc nhở BTVN

Một học viên được đưa vào tập nhắc nếu:

```text
suggestedAction = assign_hw
HOẶC BTVN <80%
HOẶC BTVN đang bị đánh dấu tụt gần đây
```

Nút **Gửi Zalo nhắc nhở** mở mẫu tin nhắn theo từng học viên. Người dùng vẫn cần kiểm tra nội dung trước khi gửi thực tế.

#### Chờ duyệt Pass mềm

Đếm học viên active thuộc Nhóm 1 hoặc Nhóm 2 của Pass mềm. SLA trong giao diện là 7 ngày. Nút **Duyệt trên Portal** mở URL Portal của lớp; Review Center trong code hiện không được gắn vào navigation của dashboard.

### 6.3. Bảng học viên

Bảng mặc định sắp xếp giảm dần theo `riskScore`, tức học viên có điểm rủi ro cao hơn được đưa lên trước.

Các bộ lọc:

- **Tất cả học viên:** toàn bộ danh sách của lớp.
- **Nguy cấp & Tụt nhãn:** dùng đúng điều kiện gọi phụ huynh ở trên.
- **Đủ điều kiện Pass:** `passChuanStatus = Có khả năng pass` hoặc `passMemStatus = Đạt pass mềm`. Vì vậy nhóm này bao gồm cả người có khả năng pass chuẩn lẫn người đạt pass mềm, không chỉ người đã “Đạt tiêu chuẩn” pass chuẩn.
- **Chờ GV Duyệt Pass:** `isEligibleForReview = true`, tức Nhóm 1/2 và đang active.

Ô tìm kiếm hỗ trợ tên, mã học viên và số điện thoại.

Chế độ hiển thị test:

- **Thu gọn Test:** điểm test được gom thành điểm TB và biểu đồ nhỏ.
- **Hiện 6 cột Test:** hiển thị T1–T6 từng bài. Ký hiệu `⚡` là điểm có thi bù; theo cấu hình hiện tại, điểm cuối lấy điểm cao hơn giữa lần thi gốc và thi bù.

### 6.4. Các chỉ số trên từng học viên

#### Chuyên cần

```text
Chuyên cần = số buổi có mặt / số buổi phải học × 100
```

Màu bảng:

- `>=90%`: tốt;
- `80%–<90%`: cần theo dõi;
- `<80%`: nguy cấp.

Nhãn **Tụt tuần** xuất hiện khi tỷ lệ dưới 80% theo cấu hình cảnh báo. Trong code hiện tại đây là một cờ ngưỡng (`<80%`), chưa phải phép so sánh đầy đủ giữa tuần này và tuần trước.

#### BTVN

```text
BTVN = số bài hoàn thành / tổng số bài phải làm × 100
```

Màu bảng dùng các mốc `>=90%`, `80%–<90%`, `<80%`. Nhãn **Lười bài** xuất hiện khi BTVN dưới 80%. Tương tự Điểm danh, cờ `isDroppingRecently` hiện được bật bởi ngưỡng `<80%`, không phải bởi một phép tính xu hướng theo nhiều tuần.

#### Điểm test và TB

Điểm `finalScore` là điểm được dùng sau khi xử lý thi bù. Nếu có thi bù, cấu hình `testMakeupRule = max` lấy điểm cao hơn.

Điểm TB là trung bình các `finalScore` đã có. Bài chưa thi hiển thị `--` và không đưa vào trung bình.

#### Risk score

Risk score nằm trong khoảng 0–100, điểm càng cao nghĩa là rủi ro càng lớn. Công thức hiện tại:

```text
riskScore = clamp(
  (100 − TB test) × 0.6
  + (100 − Chuyên cần) × 0.2
  + (100 − BTVN) × 0.2,
  0, 100
)
```

Nếu chưa có điểm test, phần điểm test tạm dùng 55. Đây là điểm ưu tiên sắp xếp danh sách, không phải xác suất học viên fail.

#### Xu hướng điểm test

So sánh điểm test đầu tiên và điểm test cuối cùng:

- tăng hơn 4 điểm: **Đang tiến bộ**;
- giảm hơn 4 điểm: **Đang sa sút**;
- chênh lệch không quá 4 điểm: **Ổn định**;
- dưới 2 bài test: **Chưa đủ dữ liệu xu hướng**.

Timeline nhãn trong dòng mở rộng lấy nhãn của từng bài test riêng lẻ theo điểm bài đó. Timeline này khác với nhãn hiện tại, vốn dùng TB tích lũy.

#### Nhãn và lịch sử nhãn

Nhãn hiện tại được tính từ TB tích lũy:

```text
TB >=60        → Vàng
45 <= TB <60  → Đỏ
TB <45        → Xám
Chưa có điểm  → Chưa có DL
```

Mũi tên/chip thay đổi như `Đỏ → Vàng` cho biết bậc nhãn đã đổi gần đây. Nhật ký chuyển nhãn chỉ tạo event khi việc tính lại sau bài test làm nhãn đổi bậc; một bài test không đổi bậc không tạo event.

#### Trạng thái Pass và hành động đề xuất

`suggestedAction` được chọn theo thứ tự ưu tiên:

1. đủ điều kiện Pass mềm cần review → `review_pass`;
2. Điểm danh `<80%` → `call_parent`;
3. BTVN `<80%` → `assign_hw`;
4. còn lại → `none`.

Thứ tự này giải thích vì sao học viên có thể đồng thời nằm trong danh sách Pass mềm và có tín hiệu cần theo dõi khác: hành động đề xuất chỉ giữ một giá trị ưu tiên, còn bộ lọc khẩn cấp dùng điều kiện riêng.

## 7. Công thức cấp lớp và chỉ số sức khỏe

### Tỷ lệ rủi ro của lớp

```text
riskPct = (số học viên Xám + số học viên Đỏ)
          / số học viên active × 100
```

Đây là tỷ lệ được dùng để xác định mức rủi ro lớp:

- `riskPct >=40%`: high;
- `25%–<40%`: medium;
- `<25%`: low.

Mốc cảnh báo hệ thống `mocBaoDongPct = 40%`, nên lớp đạt từ 40% Xám+Đỏ được đánh dấu alarm.

### Health score

```text
healthScore = clamp(
  100 − riskPct × 0.9 + (Điểm danh − 90) × 0.5,
  0, 100
)
```

Health score càng cao càng tốt. Score này có tính đến rủi ro nhãn và điểm danh; không phải trung bình của tất cả KPI.

### Net momentum của lớp

```text
netMomentum = tổng event đi lên − tổng event đi xuống
```

Ở `ClassSummary`, con số này được tính trên toàn bộ nhật ký chuyển nhãn của vòng đời lớp. Nó khác KPI **Chuyển dịch nhãn** trên Lead, vốn được giới hạn theo kỳ báo cáo.

## 8. Cách đọc dashboard để ra quyết định

### Quy trình đề xuất cho Lead

1. Chọn kỳ báo cáo và kiểm tra mốc đồng bộ dữ liệu.
2. Đọc Điểm danh, BTVN, Pass chuẩn và Pass mềm cùng mẫu số.
3. Kiểm tra delta: chỉ so sánh các lớp chung giữa hai kỳ.
4. Xem biểu đồ vận hành để phát hiện xu hướng giảm kéo dài.
5. Xem phân bố Xám+Đỏ để xác định lớp cần ưu tiên.
6. Bấm vào lớp có cảnh báo để chuyển sang danh sách học viên.

### Quy trình đề xuất cho giáo viên

1. Mở đúng lớp và kiểm tra sĩ số active.
2. Xử lý nhóm **Gọi phụ huynh gấp** trước.
3. Gửi/chuẩn bị tin nhắc BTVN cho nhóm cần nhắc.
4. Lọc **Chờ GV Duyệt Pass**, kiểm tra điểm, chuyên cần, BTVN và feedback trên Portal.
5. Mở rộng dòng học viên để xem lịch sử test, lịch sử nhãn và hành động đề xuất.
6. Sau khi liên hệ hoặc duyệt trên Portal, cập nhật nghiệp vụ ở hệ thống nguồn theo quy trình của IZONE.

## 9. Các cảnh báo khi diễn giải số liệu

- **Không coi 0% là không có dữ liệu.** Với tỷ lệ pass và biểu đồ, `—`/đường ngắt mới là trạng thái chưa tính được.
- **Không coi một event là một học viên.** Chuyển dịch nhãn đếm số lần đổi nhãn.
- **Không so sánh delta nếu không xem mẫu số.** Delta có thể chỉ dựa trên một phần số lớp hiện tại.
- **Không đọc Bỏ học KPI chính là số bỏ học trong tháng.** KPI chính là lũy kế; delta mới phản ánh thay đổi giữa kỳ.
- **Không trộn hiện trạng hôm nay với kỳ lịch sử.** Master Table và Label Distribution chưa lọc theo kỳ báo cáo.
- **Không coi Risk score là xác suất fail.** Đây là điểm ưu tiên nội bộ từ ba thành phần: test, chuyên cần và BTVN.
- **Không xem nhãn Vàng là đảm bảo chắc chắn pass.** Vàng chỉ phản ánh điểm TB test `>=60`; Pass chuẩn còn yêu cầu cả chuyên cần và BTVN `>=90%`.
- **Không bỏ qua dữ liệu nguồn.** Khi có quyết định gọi phụ huynh hoặc duyệt pass, cần kiểm tra feedback/ghi chú trên Portal vì dashboard hiện đang dùng dữ liệu mô phỏng.

## 10. Từ điển nhanh

| Thuật ngữ | Ý nghĩa |
|---|---|
| Active | Học viên đang được tính vào các tỷ lệ vận hành và mẫu số chính |
| BTVN | Bài tập về nhà |
| ĐH | Điểm danh/chuyên cần trong một số nhãn rút gọn của giao diện |
| TB test | Trung bình các điểm test cuối cùng đã có |
| Nhãn Vàng | TB test `>=60` |
| Nhãn Đỏ | TB test `45–<60` |
| Nhãn Xám | TB test `<45` |
| Pass chuẩn | ĐH `>=90%`, BTVN `>=90%`, TB test `>=60` |
| Pass mềm | Nhánh đạt theo Nhóm 1/2/3 |
| Risk score | Điểm ưu tiên rủi ro 0–100, càng cao càng cần xem trước |
| Health score | Điểm sức khỏe lớp 0–100, càng cao càng tốt |
| Event | Một lần thay đổi nhãn, không đồng nghĩa một học viên |
| `—` | Không đủ mẫu số/dữ liệu để tính |

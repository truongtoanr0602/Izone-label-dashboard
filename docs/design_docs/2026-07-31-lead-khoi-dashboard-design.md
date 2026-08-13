# Lead Khối Dashboard — Thiết kế

**Ngày:** 2026-07-31
**Phạm vi:** Màn hình dành cho Lead khối trong `Izone-label-dashboard`
**Trạng thái:** Thiết kế đã chốt, chưa triển khai

---

## 1. Mục đích và nhịp sử dụng

Lead khối mở dashboard này **hằng tháng, để đánh giá chất lượng** — phục vụ hai
tình huống:

1. **Họp review khối** — chiếu màn hình, cả phòng cùng nhìn, chất vấn và phân công.
2. **Báo cáo lên cấp trên** — gửi lại kết quả dưới dạng liên kết hoặc đoạn tóm tắt.

Cả hai đều là tình huống *trình bày*, không phải *xử lý việc*. Dashboard vì vậy
được tổ chức quanh một câu chuyện có thứ tự, không phải quanh một hàng đợi công
việc.

Yêu cầu gốc từ biên bản họp 2026-07-21:

> "Lead nên tập trung vào bức tranh lớn: xám/đỏ chiếm bao nhiêu phần trăm của lớp;
> mốc báo động (40–50%); tỷ lệ HV từ xanh xuống xám/đỏ. Lead vẫn có thể xem chi
> tiết từng HV nhưng không nên show hết trên dashboard → có điều hướng ra."

Ba ý này là xương sống. Bản dashboard hiện tại đáp ứng **một phần ba** (phân bố
nhãn), và cả phần đó cũng đang vẽ số lượng tuyệt đối thay vì tỷ lệ, không có vạch
mốc báo động.

---

## 2. Sáu câu hỏi mà màn hình phải trả lời

| # | Câu hỏi | Nguồn dữ liệu | Hiện có? |
|---|---|---|---|
| A | Lớp nào vượt mốc báo động 40%? | `01.pct_xam + pct_do` vs `06.moc_bao_dong_pct` | Một phần |
| B | Học viên đang trôi lên hay trôi xuống? | `04_NhatKy_ChuyenNhan` | **Không** |
| C | Việc gì đang chờ Lead? | `05_XetDuyet_PassMem` | **Không** |
| D | Giáo viên nào cần được kèm? | `08` + `01` + `03.test_1` (nhãn xuất phát) | **Không** |
| E | Lớp nào còn kịp cứu? | `01.session_progress` × rủi ro | **Không** |
| F | Số liệu này có tin được không? | `01.count_chua_co_dl`, `07_Log_HeThong` | **Không** |

---

## 3. Nguyên tắc xuyên suốt

Bốn nguyên tắc này chi phối mọi thành phần bên dưới. Khi có mâu thuẫn giữa "đẹp"
và một trong bốn điều này, chọn nguyên tắc.

### 3.1. Sự kiện thì chú thích, không chiếm ô trên trục thời gian

Lỗi gốc của biểu đồ hiện tại: trục X là `Tuần 1 → Tuần 2 → Test 1 → Tuần 4 →
Tuần 5 → Test 2`. **Tuần là đơn vị thời gian, Test là sự kiện.** Trộn chung gây
ba hệ quả: "Tuần 3" biến mất, khoảng cách trục không đều nhưng vẽ bằng đường nối
(đọc sai tốc độ), và người xem tưởng chuỗi liên tục trong khi nó đứt đoạn.

**Quy tắc:** trục X luôn là đại lượng liên tục — thời gian thật hoặc % tiến độ
khóa. Các mốc Test vẽ thành **vạch dọc có nhãn** đè lên biểu đồ.

### 3.2. Hai đại lượng khác thang đo → hai biểu đồ

Điểm danh và BTVN nằm ở vùng 85–100; tỷ lệ pass nằm ở vùng 20–60. Vẽ chung trên
trục 0–100 làm biến động của ĐH/BTVN — thứ quan trọng nhất — bị nén thành đường
thẳng. Tách làm hai khối: *chất lượng vận hành* (ĐH, BTVN) và *kết quả* (pass).

Không bao giờ dùng hai trục Y trên cùng một biểu đồ.

### 3.3. Mọi con số phải kèm mẫu số

Ba chỗ mà thiếu mẫu số sẽ khiến dashboard nói dối:

- **Dòng chảy nhãn:** nhãn chỉ được tính lại khi có bài test mới. Tháng không có
  test thì dòng chảy bằng 0 — đó là *"chưa có dữ liệu mới"*, không phải *"khối ổn
  định"*. Bắt buộc hiện: *"Tháng 7: 5 lớp có test (7 lượt tính lại) → 8 HV đổi
  nhãn"*. Khi mẫu số bằng 0, hiện chữ thay vì biểu đồ rỗng.
- **Delta tháng:** chỉ tính trên các lớp có mặt ở **cả hai kỳ**. Ghi rõ
  *"so sánh trên 12/15 lớp"*.
- **So sánh GV:** hiện số HV đủ điều kiện tính. Dưới ngưỡng thì không hiện số.

### 3.4. Chỉ ra bất thường, không chỉ ra "dưới trung bình"

Luôn có một nửa số lớp và một nửa số GV nằm dưới trung bình — đó là số học, không
phải chất lượng. Nếu dashboard tô cảnh báo theo "dưới trung bình" thì vĩnh viễn có
50% GV bị gọi tên, kể cả khi cả khối cùng giỏi lên; chạy vài tháng là GV mất niềm
tin và Lead mất công cụ.

**Quy tắc:** vẽ mức lệch cho *mọi* đối tượng (để thấy phân bố), nhưng **màu cảnh
báo** chỉ dành cho những đối tượng nằm ngoài khoảng dao động bình thường. Hai việc
khác nhau: *hiển thị độ lệch* và *gọi tên vấn đề*.

**Định nghĩa "khoảng dao động bình thường"** (mặc định, có thể chỉnh sau khi Lead
dùng thật): khoảng **p25–p75 của chính phân bố trong kỳ đang xem**. Chọn phân vị
thay vì độ lệch chuẩn vì phân bố rủi ro lệch phải và có ngoại lai — độ lệch chuẩn
bị chính các ngoại lai đó kéo giãn, làm ngưỡng nới rộng đúng lúc cần chặt.

Riêng lớp thì có thêm một ngưỡng tuyệt đối độc lập: **vượt `moc_bao_dong_pct`
(40%) luôn được đánh dấu**, bất kể phân bố. Nếu cả khối cùng xấu thì p75 sẽ trôi
lên và không lớp nào bị gọi tên — ngưỡng tuyệt đối chặn đúng trường hợp đó.

---

## 4. Kiến trúc hai chế độ

Một bộ component chart duy nhất, hai lớp vỏ. Mỗi chart nhận tham số `mode`.

|  | `analyze` | `present` |
|---|---|---|
| Mật độ / cỡ chữ | dày, chữ nhỏ | giãn, chữ to ~1.5× |
| Tương tác | hover, lọc, sắp xếp, đi sâu | tắt gần hết |
| Số dòng hiển thị | tất cả | top 10 + dòng gộp phần còn lại |
| Nhãn dữ liệu | khi hover | in trực tiếp lên chart |

**Không dựng hai dashboard.** Chế độ trình bày là *tập con được biên tập* của chế
độ phân tích, dùng chung nguồn số. Nếu tách thành hai cây component thì sau vài
lần sửa hai bên sẽ ra số khác nhau — và điều đó sẽ lộ ra giữa cuộc họp.

### 4.1. Chế độ `Trình bày` — 5 khung

Toàn màn hình, chuyển khung bằng phím mũi tên, `Esc` để thoát.

| Khung | Nội dung | Trả lời |
|---|---|---|
| 1 | Đoạn tóm tắt tự sinh + 6 KPI cỡ lớn kèm delta tháng | Tháng này khối thế nào |
| 2 | Bảng xếp hạng lớp (top 10 + dòng gộp) | Lớp nào phải nói tới |
| 3 | Dòng chảy nhãn — thanh phân kỳ theo lớp | HV trôi lên hay trôi xuống |
| 4 | So sánh Giáo viên | Ai cần được kèm |
| 5 | **Việc cần giao** | Cuộc họp kết thúc bằng gì |

Khung 5 là khung cuối vì buổi họp kết thúc bằng phân công, và thứ còn đọng lại
trên màn hình nên là danh sách việc chứ không phải biểu đồ.

### 4.2. Chế độ `Phân tích`

Thanh ngữ cảnh → KPI → dải cảnh báo (bấm để lọc) → bảng xếp hạng lớp đầy đủ →
Master Table (hai chế độ Lớp/GV, sắp xếp mọi cột) → ba tab đào sâu:
`Dòng chảy nhãn` · `Vòng đời lớp` · `Phân tán Rủi ro × Tiến độ`.

### 4.3. Không xuất file

Bản deploy là trang tĩnh; sau này có đăng nhập thì cấp trên vẫn mở được liên kết.
Xuất PDF chỉ tạo ra **hai nguồn số liệu** — bản đóng băng và trang sống — rồi lệch
nhau ở lần đồng bộ kế tiếp.

Thay thế bằng hai thứ:

1. **Bộ chọn kỳ báo cáo** (`Tháng 7/2026 ▾`) — đây mới là thứ thay thế chức năng
   đóng băng của PDF. Mở lại kỳ nào ra đúng số kỳ đó.
2. **Trạng thái nằm trên URL** (`?ky=2026-07&che-do=trinh-bay`) — copy thanh địa
   chỉ gửi đi là xong. Không cần `react-router`; đồng bộ `URLSearchParams` với
   store `zustand` đã có sẵn trong dependency.

Giữ lại **nút copy đoạn tóm tắt** (đổi từ nút `Download` hiện đang không gắn hành
động nào ở `Header.tsx:152`), vì báo cáo lên trên thực tế thường là một tin nhắn
chứ không phải một tệp đính kèm.

### 4.4. Hai công tắc, phân biệt về mặt thị giác

- **Vai trò** (Lead / Giáo viên) — suy ra từ tài khoản đăng nhập, không phải lựa
  chọn. GV không thấy công tắc này. Với Lead nó mang nghĩa *"xem màn hình của GV X"*.
- **Chế độ trình bày** — nút biểu tượng riêng bên phải, kiểu nút toàn màn hình.
  Chỉ hiện với vai trò Lead.

---

## 5. Mô hình dữ liệu

### 5.1. `ClassSnapshot` — hai trục thời gian song song

Mỗi bản ghi mang **cả hai**:

- `snapshotDate` / `weekIndex` → **trục theo lịch**. Dùng cho diễn biến toàn khối
  và delta tháng.
- `progressPct` → **trục theo vòng đời lớp**. Dùng để so sánh các lớp chạy ở thời
  điểm khác nhau, và để dựng dải phân vị lịch sử.

Giữ cả hai trong cùng một bản ghi là điều kiện để hai góc nhìn dùng chung một
nguồn số. Tách thành hai bảng thì sớm muộn cũng lệch.

`testCheckpoint` khác `null` nghĩa là tuần đó có bài test. Mọi chart đọc dòng chảy
nhãn phải kiểm tra trường này trước khi diễn giải một số 0 (xem §3.3).

### 5.2. `LabelChangeLog` — phân cấp mức nghiêm trọng

Đếm thuần "số HV tụt nhãn" là mất thông tin quan trọng nhất. Ba nhãn: **Vàng**
(≥60) → **Đỏ** (45–60) → **Xám** (<45).

| Chuyển dịch | `severity` | Ý nghĩa |
|---|---|---|
| bất kỳ hướng lên | `recovery` | đang gỡ được |
| Vàng → Đỏ | `warning` | mất trạng thái an toàn |
| Đỏ → Xám | `serious` | rơi xuống đáy |
| **Vàng → Xám** | `critical` | rơi hai bậc trong một lần tính lại |

Một lớp có 4 HV `warning` cần cách xử lý khác một lớp có 1 HV `critical`.

### 5.3. Nhãn tại điểm xuất phát, và ghi chú về `nhan_benchmark`

Chỉ số **giá trị-thêm** ở §6.6 cần biết nhãn của học viên tại **điểm xuất phát**,
để so với nhãn hiện tại.

**Cách tính (chốt):** lấy **bài test đầu tiên** của học viên trong
`03_DiemTest_ChiTiet`, áp ngưỡng trong `06_CauHinh_HeThong`
(<45 Xám · 45–60 Đỏ · ≥60 Vàng).

Cố ý tính từ **điểm test thô** thay vì đọc cột `nhan_benchmark` — xem cảnh báo bên
dưới. Nhãn xuất phát là đại lượng dẫn xuất được, nên không nên phụ thuộc vào ngữ
nghĩa của một trường đang chưa rõ mục đích.

#### Ghi chú: trường `nhan_benchmark`

Kiểm chứng trên toàn bộ `02_DuLieu_HocVien` (2026-07-31):

```
nhan_benchmark == nhãn(bài test đầu tiên) : 55/55   (100%)
nhan_hien_tai  == nhãn(TB tích luỹ)       : 54/55   (1 ca lệch: test_average
                                                     bị hỏng thành ngày tháng)
```

Về mặt số học, `nhan_benchmark` trùng khít nhãn-tại-điểm-xuất-phát. Nhưng theo
phản hồi từ team, trường này **"dùng để tô nhãn màu"**. Hai điều đó ghép lại thì
có vấn đề:

**8/55 HV (14.5%) có `nhan_benchmark` khác `nhan_hien_tai`, và cả 8 đều lệch cùng
một chiều — nhãn hiện tại tốt hơn benchmark.**

| HV | các bài test | `nhan_hien_tai` | `nhan_benchmark` |
|---|---|---|---|
| Nguyễn Trường Huy | 54 → 70.5 → 76 → **84** | Vàng | Đỏ |
| Phạm Văn Kiên | 55 → … → **68** | Vàng | Đỏ |
| Nguyễn Thị Như Quỳnh | 43.5 → … → **57** | Đỏ | Xám |
| (và 5 HV nữa) | | tốt hơn | |

Nếu màu hiển thị đọc từ `nhan_benchmark` thì **mọi học viên tiến bộ đều bị giữ
nguyên màu cũ**, trong khi học viên sa sút không bị ảnh hưởng. Lệch một chiều 8/8
không phải ngẫu nhiên.

`04_NhatKy_ChuyenNhan` củng cố nghi vấn: cả ba lượt chuyển nhãn được ghi log đều
có `nhan_cu` = giá trị benchmark và `nhan_moi` = giá trị hiện tại, hướng `Lên` —
tức hệ thống *biết* các em này đã lên nhãn và đã gửi email báo GV.

**Cần xác nhận với team:** màu hiển thị trên portal đọc từ `nhan_hien_tai` hay
`nhan_benchmark`? Nếu là `nhan_benchmark` thì đây là lỗi hiển thị cần sửa, không
phải chuyện của dashboard này. Dù câu trả lời thế nào, §6.6 vẫn chạy được vì nó
tính từ điểm test thô.

### 5.4. Hai đặc tính của hệ thống nhãn cần biết

**Nhãn càng về cuối khóa càng "dính".** Vì tính trên trung bình **tích luỹ**, một
cú rơi hai bậc về mặt số học chỉ khả thi khi có điểm 0 — mà theo `06_CauHinh`,
điểm 0 đến từ đúng một nguồn: `cheating_test_score = 0`. Sau Test 4, kể cả điểm 0
cũng không đủ kéo tụt hai bậc.

Hệ quả: **dòng chảy nhãn mạnh nhất ở đầu khóa và mất độ nhạy về cuối.** Nếu cần
cảnh báo sớm ở giai đoạn cuối khóa thì phải theo dõi **điểm từng bài**, không phải
nhãn.

**Tỷ lệ pass tăng tự nhiên theo tiến độ.** Lớp càng nhiều buổi, càng nhiều bài
test, tỷ lệ pass càng tăng kể cả khi chất lượng giảng dạy không đổi. Vì vậy mọi
so sánh theo lịch đều phải kèm thông tin tiến độ, còn so sánh công bằng thì phải
dùng trục vòng đời (§6.7).

---

## 6. Các thành phần

### 6.1. Thanh ngữ cảnh

```
Kỳ báo cáo: Tháng 7/2026 ▾   ·   so với Tháng 6/2026
Khối 3-4 · 15 lớp đang chạy · 3 lớp mới khai giảng · 2 lớp vừa kết thúc
Đồng bộ lần cuối 31/07 10:00 · 20 HV chưa đủ dữ liệu (7%)
```

Dòng thứ ba trả lời câu hỏi F. Nếu 30% HV chưa đủ dữ liệu thì con số "Pass chuẩn
50.9%" trên thẻ KPI là sai lệch, và hiện tại Lead không hề biết điều đó.

### 6.2. Sáu thẻ KPI + delta tháng

Đổi từ "số trần" sang "số + delta". `95.2%` một mình vô nghĩa trong phòng họp;
`95.2% ▼2.1 điểm so với tháng trước` mở đầu được một câu chuyện.

Mỗi thẻ gồm: giá trị · delta tháng · sparkline nền 13 tuần · dòng chú thích mẫu số.

**Đổi một thẻ.** Bỏ `Bảo lưu` (hiện `1 HV`, gần như không đổi và không hành động
được gì), thay bằng **`Chuyển dịch nhãn: ▼4 HV`** — đây là chỉ số **dẫn** duy nhất
trên toàn dashboard; mọi thứ còn lại đều mô tả chuyện đã rồi.

**Hai độ phân giải, cùng một nguồn.** Cửa sổ hiển thị mặc định 3 tháng:

| Thành phần | Độ phân giải | Số điểm trong 3 tháng |
|---|---|---|
| Delta trên thẻ KPI | Tháng | 1 mốc so sánh |
| Biểu đồ diễn biến | **Tuần** | ~13 điểm |

Ba tháng × mốc tháng = 3 điểm, không đủ thành đường. Báo cáo bằng tháng, nhìn hình
dạng bằng tuần.

**Trung bình có trọng số.** `LeadDashboard.tsx:26` đang lấy trung bình của các
trung bình, nên lớp 8 HV và lớp 23 HV đóng góp ngang nhau. Đúng phải là
`tổng buổi có mặt / tổng buổi phải học`.

Đo trên dữ liệu mock hiện tại, mức chênh là **0.07–1.26 điểm** tuỳ chỉ số — nhỏ
hơn nhiều so với dự đoán ban đầu. Vẫn nên sửa vì đó là định nghĩa đúng, nhưng đây
là hạng mục dọn dẹp, không phải hạng mục gấp.

### 6.3. Dải cảnh báo

Một dải mảnh, mỗi mục là một chip bấm được để lọc xuống bảng bên dưới:

```
⚠ 3 lớp vượt mốc báo động   ·   ▼8 HV tụt nhãn   ·   2 review quá hạn đã escalate
```

### 6.4. Bảng xếp hạng lớp

Thành phần nặng nhất màn hình, gánh ba việc: xếp hạng rủi ro, diễn biến, và so
sánh với nền khối.

```
                        %Xám+Đỏ      ĐH           BTVN         Diễn biến 13 tuần
─────────────────────────────────────────────────────────────────────────────────
KHỐI 3-4 (TB)           28.0%        94.2%        90.8%                     ← ghim
─────────────────────────────────────────────────────────────────────────────────
IC2174  Phương   18     55.6 ▐▌+28   93.9 ▏−0.3   90.1 ▏−0.5   ▁▂▃▅▆▇  ⚠
IC2201  Phương   18     50.0 ▐▌+22   93.3 ▏−0.9   86.5 ◀▌−4.1  ▂▃▃▅▆▆  ⚠
IC2210  Hà       17     41.2 ▐▏+13   93.2 ▏−1.0   88.7 ◀▏−1.9  ▃▄▄▅▅▆  ⚠
────────────────────────── mốc báo động 40% ─────────────────────────────────────
IC2205  Hà       18     38.9 ▐▏+11   92.8 ▏−1.4   94.4 ▎+3.8   ▅▅▄▃▃▂
...
                              18 lớp khác trong ngưỡng an toàn — bấm để mở
```

**Vì sao bảng chứ không phải ma trận nhiệt.** Ma trận nhiệt (lớp × tuần) làm được
bốn việc, nhưng chỉ **một việc là độc quyền**: đọc theo cột để phân biệt "lỗi của
lớp" với "chuyện chung cả khối". Đổi lại nó có ba điểm yếu đều trúng bối cảnh này:
màu không đọc ra số (trong họp cần nói con số), là loại biểu đồ phải học mới đọc
được (phòng họp là quản lý học thuật), và **chỉ có lý từ ~12–15 lớp trở lên**.

Việc độc quyền đó lấy lại được bằng một mẹo rẻ: **vẽ đường trung bình khối mờ phía
sau mỗi sparkline**. Lớp tụt ở tuần 7 mà đường nền cũng tụt → sự kiện chung; đường
nền đi ngang → lớp có vấn đề thật. Phép so sánh được đặt ngay cạnh nhau thay vì
bắt người xem tự ghép trong đầu.

Ma trận nhiệt để dành làm phương án dự phòng, thêm vào như một nút chuyển cách
hiển thị khi khối vượt ~15 lớp. **Không làm bây giờ.**

**Chi tiết:**
- Dòng `KHỐI 3-4 (TB)` ghim cố định ở đầu — không ai phải nhớ con số nền.
- Mỗi ô: số thật + thanh lệch nhỏ so với khối. Thanh vẽ cho mọi lớp; màu cảnh báo
  chỉ cho lớp bất thường (§3.4).
- Vạch mốc 40% cắt ngang bảng.
- **Quy tắc thu gọn khác nhau giữa hai chế độ, và đó là cố ý:**
  `analyze` thu gọn theo **ngưỡng** (hiện lớp ≥30%, phần còn lại gộp một dòng) —
  vì người dùng đang đi tìm và cần biết ranh giới nằm ở đâu.
  `present` thu gọn theo **số lượng** (top 10) — vì khung hình chiếu có chỗ cho
  đúng chừng đó dòng, bất kể phân bố tháng đó ra sao.
- Ghi tiến độ cạnh tên lớp (`IC2174 · 67% khóa`) để người đọc tự chỉnh trong đầu
  khi so cột Pass.
- **Không có điểm tổng hợp kiểu "sức khỏe lớp 72/100"** — lớp điểm danh tốt nhưng
  BTVN tệ và lớp ngược lại sẽ ra cùng điểm, trong khi cần hai cách can thiệp khác
  hẳn nhau.

### 6.5. Dòng chảy nhãn

**Mức 1 — thanh phân kỳ theo lớp:**

```
                 ←── TỤT NHÃN ────┼──── LÊN NHÃN ──→     Ròng
IC2174    ▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒        │ ████                 ▼4   ⚠
IC2201              ▒▒▒▒▒▒▒▒      │ ████████              0
IC2188                            │ ████████████         ▲3
IC2215                            │                       —   (chưa có test trong kỳ)
```

- Trục 0 ở giữa; chiều dài = số HV.
- Mỗi thanh **chia đoạn theo `severity`**; đoạn `critical` tô đậm nhất, để một HV
  rơi hai bậc vẫn nổi bật hơn bốn HV rơi một bậc.
- Sắp xếp theo ròng tăng dần.
- Lớp chưa có test trong kỳ hiện gạch ngang, **không** hiện thanh rỗng.

Không dùng Sankey: Sankey trả lời *"dòng chảy giữa các nhãn"*, còn câu cần trả lời
trong họp là *"lớp nào đang chảy máu"*. Thanh phân kỳ trả lời thẳng, đọc trong một
giây, và xếp hạng được.

**Mức 2 — ma trận chuyển tiếp 3×3** (chỉ ở chế độ phân tích, khi bấm vào một lớp):

```
              →  Vàng    Đỏ    Xám
   Vàng           14      3     1
   Đỏ              2      6     2
   Xám             0      1     3
```

Đường chéo = giữ nguyên; trên đường chéo = tụt; dưới = lên. Chín ô, đủ nhỏ để đọc
chính xác, cho con số tuyệt đối mà thanh phân kỳ chỉ cho ước lượng.

### 6.6. So sánh Giáo viên

**Đây là màn hình nguy hiểm nhất trong dashboard.** Nó nói về con người; nếu GV
thấy nó bất công một lần thì cả hệ thống mất niềm tin.

Kiểm chứng trên dữ liệu mock cho thấy **xếp hạng theo %Xám+Đỏ sẽ chỉ sai người**:

| GV | Hạng theo %Xám+Đỏ | Hạng theo giá trị thêm | |
|---|---|---|---|
| Lê Thanh Hà | 2 (tệ) — 40.0% | **1 (tốt nhất)** — +5.7% (4↑/2↓) | nhảy 8 bậc |
| Nguyễn Hoàng Anh | 6 (tốt) — 16.2% | **2 (tệ nhì)** — −5.4% (1↑/3↓) | tụt 4 bậc |
| Trần Minh Phương | 1 (tệ nhất) — 46.3% | 1 (tệ nhất) — −13.5% (1↑/8↓) | trùng khớp |

Hà nhận lớp đầu vào yếu nên bị %Xám+Đỏ đẩy lên đầu danh sách "cần kèm", trong khi
thực tế Hà đang kéo được nhiều HV lên trên điểm xuất phát nhất khối. Hoàng Anh
ngược lại: lớp trông đẹp vì đầu vào tốt, nhưng HV đang trôi xuống — cảnh báo sớm
mà cột %Xám+Đỏ hoàn toàn không thấy.

**Bố cục:**

```
                          ── TÌNH TRẠNG ──   ── GIÁ TRỊ TẠO THÊM ──  │ ── QUY TRÌNH ──
GV                lớp  HV   %Xám+Đỏ           xuất phát → hiện tại   │  review quá hạn
──────────────────────────────────────────────────────────────────────────────────────
Trần Minh Phương   3   54   46.3 ▓▓▓▓▓▓▓▓ ⚠   −13.5 ◀▌▌ 1↑ 8↓   ⚠   │       0
Lê Thanh Hà        2   35   40.0 ▓▓▓▓▓▓▓  ⚠   +5.7      ▐▌ 4↑ 2↓ ★   │       1  ⚠
Nguyễn Hoàng Anh   2   37   16.2 ▓▓           −5.4    ◀▏ 1↑ 3↓   ⚠   │       1  ⚠
```

Vạch dọc trước cột quy trình là cố ý: **kỷ luật quy trình không phải chất lượng
giảng dạy.** Để chung một khối thì sớm muộn cũng có người cộng lại thành "điểm GV".
Đồng thời đó là cột duy nhất Lead có thẩm quyền tuyệt đối để nhắc — deadline 7
ngày là quy định, không phải chuyện tranh luận.

**Bốn biện pháp chống lạm dụng — bắt buộc:**

1. **Không có điểm tổng hợp.** Hà (+5.7 / 40%) và Hoàng Anh (−5.4 / 16%) sẽ ra
   điểm tổng gần bằng nhau dù tình huống ngược hẳn.
2. **Hiện cỡ mẫu; im lặng khi mẫu nhỏ.** Dưới ~30 HV đủ điều kiện thì cột giá trị
   thêm hiện `—` kèm *"chưa đủ mẫu"*, **không hiện số**. Thà trống còn hơn một con
   số vô nghĩa mà người ta sẽ tin.
3. **Chỉ tính HV đã có ≥3 bài test.** HV mới thi một bài thì nhãn xuất phát trùng
   nhãn hiện tại, giá trị thêm luôn bằng 0; không lọc thì GV dạy lớp mới bị đẩy về
   giữa bảng một cách vô nghĩa.
4. **Không tô theo "dưới trung bình"** (§3.4).

**GV không có lớp đang chạy** phải tách xuống mục *"Không dạy trong kỳ"*, không xếp
chung — hiện họ ra `0.0%` và lọt vào giữa bảng như thể đang dạy tốt.

**Đi sâu:** bấm vào một GV → liệt kê các lớp của họ (đang chạy + đã kết thúc). Đây
là câu trả lời cho *"vấn đề ở GV hay ở một lớp cụ thể?"*

### 6.7. Vòng đời lớp (chế độ phân tích)

Trục X = **% tiến độ khóa (0→100%)**, không phải thời gian. Đây là lời giải triệt
để cho vấn đề "Tuần/Test", và là công cụ so sánh công bằng giữa các lớp chạy ở
thời điểm khác nhau.

```
%Xám+Đỏ
  60│                                        ░░░░░░░  ← p75
    │                              ░░░░░░░░░░▒▒▒▒▒▒▒
  40│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╱─ ─ ─ ─ ─ ─ ─ ─  mốc báo động
    │                    ░░░░░▒▒▒▒╱▒▒▒▒▒━━━━━━━━━━  ← trung vị lịch sử
  20│         ░░░▒▒▒▒▒▒▒▒▒▒━━━━━━╱━━━━━━━
    │░░▒▒▒▒▒▒▒▒━━━━━━━━━━━╱                         ← p25
   0└────┬────┬────┬────┬────┬────┬────┬────┬───
        20%  30%  40%  50%  60%  70%  80%  90%   tiến độ khóa
              ↑ vạch dọc: Test 1, 2, 3...
        ━━━ IC2174 (đang chạy) — vẽ đậm đè lên nền
```

Vùng mờ = khoảng p25–p75 của **toàn bộ lớp trong lịch sử**. Câu đọc ra được:

> *"Ở mốc 60% khóa học, IC2174 đang ở 45% xám+đỏ — nằm trên p75, tức thuộc nhóm
> 25% lớp tệ nhất mà khối từng có ở cùng giai đoạn."*

**View này càng nhiều lớp lịch sử càng mạnh.** Với 3 lớp thì dải phân vị vô nghĩa;
với 100 lớp thì nó trở thành thước đo chuẩn của khối — thứ mà hôm nay không có, nên
mọi đánh giá "lớp này tệ" đều đang dựa vào cảm giác.

Chọn được chỉ số vẽ trên trục Y: %Xám+Đỏ · ĐH · BTVN · Pass chuẩn · Pass mềm.

Không đưa vào chế độ trình bày — đây là công cụ điều tra, cần hover để đọc.

### 6.8. Phân tán Rủi ro × Tiến độ (chế độ phân tích)

Trục X = % tiến độ khóa, trục Y = %Xám+Đỏ, mỗi chấm một lớp, cỡ chấm = sĩ số.

- Góc **phải-trên** = sắp kết thúc mà vẫn nhiều đỏ → hết đường cứu, phải giải trình.
- Góc **trái-trên** = mới học mà đã nhiều đỏ → can thiệp ngay, còn kịp.

Hai tình huống này hiện đang bị dashboard đối xử như nhau, mà cách hành động thì
ngược nhau hoàn toàn.

**Chỉ bật khi ≥8 lớp** — dưới ngưỡng đó thì thừa.

### 6.9. Việc cần giao

Gom từ dữ liệu đã có, sắp theo **người chịu trách nhiệm**:

- Lớp vượt mốc báo động (sheet 01) → GV phụ trách
- HV tụt nhãn trong kỳ (sheet 04) → GV phụ trách
- Review quá hạn đã escalate (sheet 05) → GV + Lead

Không cần dữ liệu mới, chỉ là gom lại và đổi trục sắp xếp từ "lớp" sang "người".

---

## 7. Trạng thái thiếu dữ liệu

Phần hay bị bỏ quên nhất, và là chỗ dashboard dễ nói dối nhất.

| Tình huống | Hiện sai | Phải hiện |
|---|---|---|
| Lớp chưa có bài test nào | `Pass chuẩn 0%` | `—` + *"chưa có test"* |
| Kỳ không có lượt tính lại nhãn | biểu đồ rỗng, ròng = 0 | chữ *"Chưa có lượt tính lại nhãn nào trong kỳ"* |
| GV có <30 HV đủ điều kiện | một con số nhiễu | `—` + *"chưa đủ mẫu"* |
| Lớp mới, không so được tháng trước | delta giả | loại khỏi phép trừ, ghi rõ mẫu số |
| Chưa tích luỹ đủ 13 tuần | vẽ đường ngắn như thể đủ | ghi rõ *"dữ liệu từ tuần X"* |
| HV chưa đủ dữ liệu | tính vào mẫu số | tách riêng, hiện ở thanh ngữ cảnh |

Nguyên tắc: **`0` và "không biết" là hai thứ khác nhau, không bao giờ vẽ giống nhau.**

---

## 8. Yêu cầu hạ tầng

Bốn hạng mục này nằm ngoài giao diện nhưng thiết kế trên **không chạy được nếu
thiếu**. Xếp theo mức chặn.

### 8.1. Snapshot phải ghi thêm, giữ vĩnh viễn — CHẶN

Hiện toàn bộ pipeline mới là mockup. Khi dựng thật, `09_Weekly_Snapshot` **phải
ghi thêm (append-only)**, không ghi đè.

Chi phí bằng không: 28 lớp × 52 tuần ≈ **1.500 dòng/năm**; chi tiết điểm test
~11.000 dòng/năm. Đây là quy mô một bảng tính cũng gánh được.

**Cửa sổ hiển thị (3 tháng) và thời gian lưu (vĩnh viễn) là hai quyết định khác
nhau.** Rút cửa sổ hiển thị thì thoải mái — chỉ là tham số giao diện. Rút thời gian
lưu thì không dựng lại được: dữ liệu lịch sử không tái tạo ngược từ trạng thái hiện
tại. Không có kho lịch sử thì §6.7 (dải phân vị) không tồn tại.

Nếu bắt đầu ghi từ tháng 8/2026 thì **cuối tháng 10/2026** cửa sổ 3 tháng mới đầy.
Trước đó, phần diễn biến phải hiện đúng số tuần đang có kèm nhãn *"đang tích luỹ
dữ liệu"* — không vẽ đường giả.

### 8.2. Chốt chỉ số giá trị-thêm khi lớp đóng — CHẶN §6.6

Chỉ số giá trị-thêm tính từ dữ liệu **cấp học viên**. Lớp kết thúc thì HV không còn
được đồng bộ. Nếu không chốt và lưu lại chỉ số này lúc đóng lớp thì bảng so sánh GV
chỉ xem được các lớp đang chạy — mà một GV thường chỉ có 2 lớp đang chạy, tức mẫu
quá nhỏ để kết luận gì. Góc nhìn cả năm chỉ tồn tại nếu có bước chốt số này.

### 8.3. Phân quyền ở tầng dữ liệu, không phải tầng giao diện

GitHub Pages là hosting tĩnh, không chạy được server. "Đăng nhập" trên đó có hai
đường:

- Dữ liệu nằm trong bundle JS → đăng nhập chỉ là *ẩn giao diện*. Ai mở DevTools
  cũng đọc được toàn bộ dữ liệu HV, kể cả tài khoản GV lẽ ra chỉ được xem lớp mình.
  **Đây không phải bảo mật.**
- Dữ liệu lấy từ backend/BaaS bằng token sau khi đăng nhập → mới thật.

Phải chọn đường thứ hai **trước khi** cắm dữ liệu HV thật. `"Lead xem được hết"`
là lọc ở tầng API theo quyền, không phải lọc ở tầng render.

Trong lúc chưa có: dữ liệu mock phải giả hoàn toàn (đã xử lý — xem
`src/data/generator/names.ts`).

### 8.4. Trạng thái trên URL

`?ky=2026-07&che-do=trinh-bay`. Không cần `react-router`; đồng bộ `URLSearchParams`
với `zustand`.

---

## 9. Ngoài phạm vi

Đã cân nhắc và **chủ động bỏ**:

| Hạng mục | Lý do |
|---|---|
| Ma trận nhiệt lớp × tuần | Chỉ có lý từ ~15 lớp; bảng xếp hạng làm tốt hơn ở quy mô hiện tại (§6.4) |
| Xuất PDF / PNG | Tạo ra hai nguồn số liệu; bộ chọn kỳ + URL thay thế tốt hơn (§4.3) |
| Điểm tổng hợp "sức khỏe lớp" / "điểm GV" | Xoá mất chính thông tin có giá trị nhất (§6.4, §6.6) |
| Sankey cho dòng chảy nhãn | Trả lời sai câu hỏi và không xếp hạng được (§6.5) |
| Biểu đồ vòng đời trong chế độ trình bày | Cần hover mới đọc được, chiếu lên không ai kịp |
| Cửa sổ 6–12 tháng | 3 tháng là mặc định; kho dữ liệu vẫn giữ vĩnh viễn nên mở rộng sau chỉ là đổi tham số |

---

## 10. Sửa đổi trên mã hiện có

| Vị trí | Vấn đề | Xử lý |
|---|---|---|
| `LeadDashboard.tsx:41-48` | `timelineData` ghi cứng, trục trộn Tuần/Test | Thay bằng snapshot thật, trục theo thời gian, Test thành vạch dọc |
| `LeadDashboard.tsx:26-29` | Trung bình của các trung bình | Đổi sang có trọng số theo sĩ số |
| `LeadDashboard.tsx:204-206` | Ba đường khác thang trên một trục | Tách hai khối (§3.2) |
| `LeadDashboard.tsx:322-331` | Stacked bar vẽ số tuyệt đối, không có mốc 40% | Thay bằng bảng xếp hạng (§6.4) |
| `LeadDashboard.tsx:95-168` | 6 thẻ KPI không ngữ cảnh | Thêm delta tháng + sparkline; đổi thẻ `Bảo lưu` (§6.2) |
| `Header.tsx:152` | Nút `Download` không gắn hành động | Đổi thành nút copy đoạn tóm tắt |
| `App.tsx` | Không có tầng lọc theo kỳ | Thêm bộ chọn kỳ + đồng bộ URL |

**Đã sửa trong lúc dựng mock:**

- `rng.ts` — hệ số `0.5774` thừa trong hàm phân phối chuẩn làm độ phân tán chỉ còn
  58% giá trị yêu cầu.
- `App.tsx:16` — danh sách HV ghim cứng vào IC2174; với 15 lớp thì chọn lớp nào
  cũng hiện nhầm học viên. Đổi sang `getStudentsByClass(selectedClass.classId)`.

---

## 11. Dữ liệu mock

Đã dựng xong (`src/data/generator/`). 15 lớp đang chạy + 20 lớp đã kết thúc,
11 GV, 270 HV, 116 + 280 snapshot, 42 lượt chuyển nhãn, 15 review.

Bộ ngẫu nhiên có seed nên dữ liệu **đứng yên qua mọi lần tải trang** — lỗi bố cục
phát hiện được sẽ tái hiện lại được.

Các tình huống biên đã có mẫu: 1 ca Vàng→Xám (do gian lận) · 20 HV chưa có dữ liệu ·
1 lớp chưa có test nào · 3 bỏ học · 2 bảo lưu · 1 chuyển lớp · 2 HV thi lại ·
2 review quá hạn đã escalate · tên dài 31 ký tự · sĩ số 8 vs 23.

**Hai cú sốc khác loại**, để kiểm chứng rằng đường trung bình khối phía sau
sparkline thật sự phân biệt được "lỗi của lớp" với "chuyện chung cả khối":

- Test 3 khó (−8 điểm) → hiện trên trục **vòng đời**, không hiện trên trục lịch.
- Tuần nghỉ lễ 15/06 (−12 điểm danh) → hiện trên trục **lịch**, không hiện trên
  trục vòng đời.

---

## 12. Thứ tự triển khai đề xuất

Spec này mô tả 9 thành phần — quá lớn cho một kế hoạch triển khai duy nhất. Chia
làm bốn đợt, mỗi đợt tự đứng được và có thể đưa cho Lead dùng thử ngay.

| Đợt | Nội dung | Phụ thuộc | Vì sao xếp ở đây |
|---|---|---|---|
| **1** | Thanh ngữ cảnh + bộ chọn kỳ · KPI + delta tháng · trung bình có trọng số · sửa trục Tuần/Test | Không | Rẻ nhất, tác động lớn nhất trên màn hình hiện tại. Sửa được lỗi mà Lead đã tự phát hiện. |
| **2** | Bảng xếp hạng lớp (§6.4) + dải cảnh báo (§6.3) | Đợt 1 | Trả lời câu A và E — hai trong ba ý của biên bản họp. Là thành phần Lead nhìn lâu nhất. |
| **3** | Dòng chảy nhãn (§6.5) + Việc cần giao (§6.9) | Đợt 2 | Trả lời câu B và C. Dùng `LabelChangeLog` đã có trong mock. |
| **4** | So sánh GV (§6.6) · Vòng đời lớp (§6.7) · Phân tán (§6.8) · chế độ Trình bày (§4.1) | Đợt 3 + §8.1 + §8.2 | Hai view cuối cần **kho lịch sử thật**; làm sớm thì chỉ demo được trên mock. |

Chế độ `Trình bày` xếp cuối vì nó là **lớp vỏ của các chart đã có** (§4) — không
có gì để trình bày cho tới khi các chart tồn tại.

Hai hạng mục hạ tầng §8.1 (snapshot ghi thêm) và §8.2 (chốt giá trị-thêm khi đóng
lớp) nên khởi động **song song từ đợt 1**, không đợi tới đợt 4. Chúng cần thời
gian tích luỹ dữ liệu, không cần thời gian lập trình: bắt đầu ghi từ tháng 8/2026
thì cuối tháng 10 mới đủ một cửa sổ 3 tháng. Bắt đầu muộn một tháng là lùi kết quả
một tháng, không rút ngắn được.

---

## 13. Câu hỏi còn mở

Cả bốn câu đều đã có giá trị mặc định để triển khai được ngay; đây là những chỗ
cần Lead xác nhận lại sau khi dùng thật, không phải chỗ chặn.

1. **Ngưỡng thu gọn bảng lớp** — tạm đặt 30%. Cần Lead xác nhận mức nào là
   "đáng nhìn".
2. **Cỡ mẫu tối thiểu cho cột giá trị-thêm** — tạm đặt 30 HV. Nếu quá chặt thì
   phần lớn GV sẽ hiện `—`; nếu quá lỏng thì nhiễu bị đọc thành tín hiệu.
3. **Khoảng dao động bình thường** — tạm đặt p25–p75 của kỳ đang xem (§3.4).
   Cần kiểm lại sau vài tháng: nếu danh sách gọi tên vẫn quá dài thì siết lại.
4. `07_Log_HeThong` (sức khỏe pipeline) hiện gộp vào dòng "đồng bộ lần cuối" ở
   thanh ngữ cảnh. Đủ hay cần một khối riêng?

### Câu hỏi cho team, ngoài phạm vi dashboard này

**Màu nhãn hiển thị trên portal đọc từ `nhan_hien_tai` hay `nhan_benchmark`?**

Nếu là `nhan_benchmark` thì 14.5% học viên đang bị tô ở mức thấp hơn thực lực, và
toàn bộ là các em đã tiến bộ (§5.3). Đây là lỗi hiển thị ở hệ thống nguồn, không
phải ở dashboard — nhưng nó ảnh hưởng tới việc GV có tin vào nhãn hay không, nên
đáng xác nhận trước khi Lead dùng dashboard để chất vấn GV về nhãn.

Thiết kế trong tài liệu này **không phụ thuộc câu trả lời**: nhãn xuất phát được
tính từ điểm test thô.

### Đã giải trong quá trình thiết kế

- **Nhãn tại điểm xuất phát lấy ở đâu** → tính từ bài test đầu tiên trong
  `03_DiemTest_ChiTiet`, không mượn cột `nhan_benchmark` (§5.3). Từ đó ra chỉ số
  giá trị-thêm, nền tảng của §6.6.
- **Ma trận nhiệt hay bảng xếp hạng** → bảng, và lý do (§6.4).
- **Cửa sổ 3 hay 6 tháng** → 3 tháng cho hiển thị, vĩnh viễn cho lưu trữ (§8.1).
- **Xuất file hay không** → không (§4.3).

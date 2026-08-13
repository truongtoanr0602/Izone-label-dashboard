# Lead Khối Dashboard — Khôi phục độ trung thực dữ liệu

**Ngày:** 2026-08-12
**Phạm vi:** `backend/src/dashboards/*`, `dashboard/src/components/dashboard/*`, `database/migrations/007_*`
**Trạng thái:** Design đã chốt, chờ viết implementation plan

---

## 1. Bối cảnh

Trang Lead Khối Dashboard hiển thị sai số ở gần như mọi chỉ số. Triệu chứng người dùng báo:

1. Header ghi "17 lớp đang chạy · 264 HV active" nhưng biểu đồ *Chất lượng vận hành* chỉ hiện 7 lớp mỗi tuần.
2. Cột "Độ phủ liên hệ" luôn trống.
3. Card "Net Momentum" không ai hiểu là gì.

Điều tra trực tiếp trên Postgres prod (`160.187.146.127`, `izone_dashboard`) cho thấy đây không phải ba lỗi rời rạc mà là hai lỗi tầng dữ liệu cộng với ba lỗi trình bày.

---

## 2. Chẩn đoán

### 2.1 Nguyên nhân gốc A — migration 007 đổi "hạt" của bảng, backend chưa biết

`database/migrations/007_stage_based_test_snapshots.sql` (đang **untracked trong git nhưng đã chạy trên prod**) thêm cột `snapshot_stage`, **drop constraint `uq_student_record`**, thay bằng `uq_student_stage (student_id, class_id, snapshot_stage)`.

Từ đó `izone.student_daily_records` không còn là "1 dòng / học viên / ngày". Dữ liệu thật ngày `2026-08-12`, Khối 3-4, 17 lớp `on_going`:

| `snapshot_stage` | Số dòng | `attendance_pct` not-null |
|---|---|---|
| `NULL` (dòng live thật) | 244 | 244 (100%) |
| 1–6 (backfill theo mốc test) | 526 | 0 |
| **Backend đang đếm** | **770** | 244 |

Bốn query trong `dashboards.service.ts:93-172` vẫn `GROUP BY r.class_id, r.record_date` với `COUNT(*) AS record_count`, tức coi mỗi dòng là một học viên. Hệ quả:

- `record_count` = 770 thay vì 244 → mọi mẫu số phình ~3 lần.
- `snapshot-quality.ts:113` yêu cầu `attendanceSampleSize / recordCount >= 80%`; thực tế 244/770 = 31.7% → **15/17 lớp trượt cổng**, backend lùi về ngày cũ hơn (IC2196 và IC2201 lùi tận `2026-07-06`).
- `lead-aggregation.ts:211` `fresh()` chỉ nhận dữ liệu trong 7 ngày → các lớp vừa bị lùi ngày rớt khỏi biểu đồ.
- Pass chuẩn, Pass mềm, `riskRate`, `labelDistribution` đều chia cho 770. IC2142 (9 HV thật) đang hiển thị **36 vàng / 10 đỏ / 13 xám = 59 HV** trên Bản đồ phân bố nhãn.

### 2.2 Nguyên nhân gốc B — học viên `queuing` làm trượt cổng coverage

Kể cả sau khi loại dòng stage, các tuần lịch sử vẫn chỉ có 9/17 lớp. Thủ phạm là `DEFAULT_MINIMUM_COVERAGE = 80` (`snapshot-quality.ts:1`) kết hợp với việc **không query nào của Lead dashboard lọc `registration_status`**:

| `registration_status` | Số dòng (90 ngày) | Có `attendance_pct` |
|---|---|---|
| `on_going` | 4.300 | 83% |
| `queuing` | 476 | 39.3% |
| `cancelled` | 26 | 15.4% |

Ví dụ IC2155 ngày `2026-07-21`: 15 HV `on_going` (14 có số) + 3 HV `queuing` (đều NULL) → 14/18 = **77.8%, trượt ngưỡng 80% sát nút**. Đó là lý do lớp này chỉ có 2/28 ngày lọt vào biểu đồ.

Đáng chú ý: business rule "`queuing` trong lớp `on_going` ⇒ coi như `dropped`" **đã tồn tại** ở `dashboards.service.ts:1151` (`effectiveRegistrationStatus`) nhưng chỉ áp dụng cho Teacher dashboard. Đây đúng là kiểu duplication mà `CLAUDE.md` §business-rules-duplication cảnh báo.

### 2.3 Ngữ nghĩa NULL vs 0 — đã kiểm chứng, sạch tuyệt đối

| `attendance_pct` | Số dòng | `attendance_total = 0` | `attendance_total > 0` |
|---|---|---|---|
| `NULL` | 729 | **729 (100%)** | 0 |
| `0%` | 442 | 0 | **442 (100%)** |
| `> 0%` | 3.129 | 0 | 3.129 |

**`NULL` ⟺ học viên chưa có buổi học nào. `0%` là số thật** (có buổi, vắng hết). Không có ngoại lệ nào trong 4.300 dòng.

Hệ quả thiết kế: loại `NULL` khỏi mẫu số, giữ `0%` — và **không cần bất kỳ ngưỡng coverage nào**.

### 2.4 Ba lỗi trình bày độc lập

- **Độ phủ liên hệ chưa từng được nối dây.** `LeadDashboard.tsx:55` khai báo `const [contactLogs] = useState<ContactLog[]>([])` không setter, không effect fetch; dòng 297 gọi `coverageOf(contactLogs, [])` với mảng học viên rỗng. Cột luôn render `--`. Backend đã có sẵn `GET /api/contact-logs?khoiId=` (`contact-logs.controller.ts:12`).
- **Nhãn "HV có test" sai.** `snapshot-quality.ts:143` gán `sampleSize: row.recordCount` (tổng sĩ số) nhưng `KpiRow.tsx:34` in ra `"${sample} HV có test"`. Trường `testedStudents` đúng thì đang bị bỏ không.
- **`newClasses` / `endedClasses` hardcode `0`** (`LeadDashboard.tsx:95-96, 114-115`) → nhánh hiển thị trong `ContextBar.tsx:65-66` là code chết.

### 2.5 Hạt thật của bảng sau migration 007

`izone.student_daily_records` giờ là **hai bảng logic trộn trong một bảng vật lý**:

| | `snapshot_stage IS NULL` | `snapshot_stage = 1..8` |
|---|---|---|
| Hạt | 1 dòng / HV / lớp / **ngày** | 1 dòng / HV / lớp / **mốc test** |
| Trục thời gian | `record_date` (ngày quan sát) | `snapshot_stage`; `record_date` vô nghĩa, tất cả = ngày chạy backfill |
| Số dòng | 30.765 | 10.130 |
| Cột có nghĩa | Đầy đủ | Chỉ `tests_taken`, `test_average`, `current_label`; điểm danh/BTVN/pass luôn NULL |

Đã kiểm chứng: cả hai loại hiện **vẫn đúng hạt của mình** (30.765/30.765 và 10.130/10.130 khoá đều có đúng 1 dòng). Dữ liệu không bẩn — lỗi nằm ở chỗ backend đọc chung cả hai loại như thể cùng một hạt.

**Rủi ro cần vá:** migration 007 `DROP CONSTRAINT uq_student_record` và thay bằng `uq_student_stage (student_id, class_id, snapshot_stage)`. Postgres coi mỗi `NULL` là một giá trị khác nhau, nên constraint mới **không ràng buộc gì các dòng live**. Hạt "1 dòng/HV/ngày" hiện chỉ sạch nhờ ingestion cẩn thận, không nhờ database. Nếu pipeline chạy hai lần trong ngày, dòng trùng sinh ra âm thầm và mọi `COUNT(*)` lại sai — lần này không có cột nào để lần ra.

Khôi phục bằng partial unique index, không đụng dòng stage:

```sql
CREATE UNIQUE INDEX uq_student_record_live
  ON izone.student_daily_records (student_id, class_id, record_date)
  WHERE snapshot_stage IS NULL;
```

### 2.6 Khoảng trống roster (phát hiện thêm)

Roster từ `class_daily_snapshots` cho 264 HV active, khớp chính xác với `students` (264 HV `on_going`). Nhưng ngày `2026-08-12` chỉ **228 HV có bản ghi live** — 36 HV active không có dòng dữ liệu nào.

Độ phủ trung thực toàn khối là **228/264 = 86.4%**, không phải 100%. Đây là dữ kiện phải hiển thị chứ không được giấu.

---

## 3. Thiết kế

### 3.1 Nguyên tắc aggregate thống nhất

Mọi query aggregate của Lead dashboard áp dụng cùng ba bộ lọc:

```sql
AND r.snapshot_stage IS NULL             -- chỉ dòng live, bỏ backfill mốc test
AND s.registration_status = 'on_going'   -- chỉ HV đang học
-- NULL bị loại khỏi cả tử số lẫn mẫu số (NULL = chưa có buổi, khác hẳn 0%)
```

### 3.2 Đổi công thức trung bình sang tầng học viên

Hiện tại `weightedResolved` (`lead-aggregation.ts:117-142`) lấy trung bình các trung bình lớp, cân theo `roster.activeStudents`. Khi một lớp chỉ có 5/14 HV có số, class average tính trên 5 người đó vẫn được nhân trọng số 14 → méo.

Công thức mới:

```
attendanceAvg = SUM(attendance_pct) / COUNT(HV on_going có attendance_pct)
```

Mỗi học viên đóng góp đúng một phiếu. Kiểm chứng trên ngày `2026-08-12`: cách mới cho **89.12%**, cách "cân theo số HV có dữ liệu" cũng cho **89.12%** (trùng nhau về toán học), cách hiện tại cho 89.04%. Hôm nay lệch ít vì coverage cao; ở các ngày lịch sử coverage ~70% thì lệch đáng kể.

### 3.3 Xoá cổng coverage, biến độ phủ thành số hiển thị

`DEFAULT_MINIMUM_COVERAGE = 80` bị **xoá hẳn**. Nó chỉ tồn tại để bù cho sai lệch trọng số ở §3.2, mà sai lệch đó biến mất khi tính ở tầng học viên.

Thay vào đó độ phủ trở thành thông tin hiển thị trên tooltip biểu đồ và note của card: `228/264 HV (86%)`. Người dùng tự đánh giá độ tin cậy thay vì bị hệ thống âm thầm giấu lớp.

`fresh()` (cửa sổ 7 ngày) **được giữ** — nó chống việc kéo dữ liệu quá cũ vào tuần hiện tại, là mục đích khác với cổng coverage.

### 3.4 Mẫu số Pass chuẩn / Pass mềm

Đổi từ tổng sĩ số sang **số HV đã có test**:

```
passStandardRate = passStandardStudents / testedStudents
```

Trả lời câu "trong số HV đã thi, bao nhiêu % đạt". `resolvePassMetric` đổi `sampleSize: row.recordCount` → `row.testedStudents`, đồng thời sửa nhãn sai ở `KpiRow.tsx:34`.

### 3.5 Độ phủ liên hệ — tính ở backend

Thêm vào `LeadDashboardClass`:

```ts
contactCoverage: { done: number; total: number; pct: number | null }
```

`total` = số HV của lớp đang có cảnh báo mở tại mốc test hiện tại; `done` = số cảnh báo đã có bản ghi trong `contact_logs` khớp `(student_id, trigger_type, checkpoint)`. `pct` là `null` khi `total = 0` (lớp không có cảnh báo nào — khác hẳn với 0%).

Tính ở backend vì nơi đó đã có sẵn cả `contact_logs` lẫn logic phân loại HV cần hành động; tính ở frontend sẽ phải fetch toàn bộ học viên của 17 lớp.

### 3.6 Thay đổi giao diện

| Vị trí | Thay đổi |
|---|---|
| `KpiRow` | Bỏ card Net Momentum, còn 5 card. Grid đổi `xl:grid-cols-6` → `xl:grid-cols-5` |
| Master Table | Cột "Độ phủ liên hệ" đọc từ `contactCoverage` trong contract |
| Subtitle 2 biểu đồ | Nói rõ mẫu số và độ phủ thay vì chỉ ghi số tuần |
| Tooltip biểu đồ | Thêm dòng độ phủ `N/M HV` |
| `ContextBar` | Xoá nhánh `newClasses` / `endedClasses` |

Net Momentum bị bỏ vì dữ liệu quá thưa (kỳ 08/2026 chỉ có 24 transition, dồn hết vào một ngày 12/08) và Lead không hành động được gì từ con số đó. Không thay bằng card khác.

---

## 4. Ngoài phạm vi

- **Các dòng `snapshot_stage` 1–8 không được dùng vào việc gì** trong đợt này, chỉ bị loại khỏi aggregate. Chúng được backfill để dựng biểu đồ tiến triển theo mốc test — đó là tính năng riêng.
- **Không sửa pipeline ingestion.** Khoảng trống 36 HV ở §2.5 và việc scrape không lấy đủ roster mỗi ngày là vấn đề tầng thu thập, nằm ngoài repo này. Đợt này chỉ làm cho dashboard *hiển thị trung thực* khoảng trống đó.
- **Teacher dashboard không đổi.** Nó dùng đường query riêng và đã lọc `registration_status` đúng.

---

## 5. Kế hoạch triển khai

**Bước 0 — Đồng bộ schema và vá ràng buộc.**
Commit migration 007 (đang untracked nhưng đã chạy prod: schema prod và schema git đã lệch). Cập nhật `backend/prisma/schema.prisma` cho biết `snapshot_stage`, `test_7`, `test_8`. Thêm migration 008 tạo partial unique index `uq_student_record_live` theo §2.5 để khôi phục ràng buộc 1 dòng/HV/ngày cho dữ liệu live. Làm trước mọi thứ.

**Bước 1 — Tầng aggregate backend.**
Sửa 4 query trong `dashboards.service.ts:93-172` (join `izone.students`, thêm 2 bộ lọc). Viết lại `weightedResolved` trong `lead-aggregation.ts` thành student-level. Gỡ ngưỡng coverage trong `snapshot-quality.ts`, đổi `ResolvedMetric.coveragePct` thành số hiển thị. Bám vào `lead-aggregation.spec.ts` và `snapshot-quality.spec.ts` đã có.

**Bước 2 — Mẫu số Pass.**
`resolvePassMetric` đổi sang `testedStudents`; sửa nhãn `KpiRow.tsx:34`.

**Bước 3 — Độ phủ liên hệ.**
Thêm `contactCoverage` vào contract backend + `dashboardContracts.ts`. Nối vào cột đang chết ở `LeadDashboard.tsx:297`, xoá `useState<ContactLog[]>([])` mồ côi và hàm `coverageOf`.

**Bước 4 — KpiRow.**
Bỏ card Net Momentum, đổi grid. Giữ `netMomentum` trong contract backend (không phá API) nhưng không render.

**Bước 5 — Dọn UI.**
Xoá `newClasses`/`endedClasses`. Viết lại subtitle 2 biểu đồ + tooltip theo §3.6.

### Cổng kiểm tra

- `backend/`: `npm run build`, `npm test`
- `dashboard/`: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build` — cả bốn phải sạch (`CLAUDE.md` §Commands)

### Kỳ vọng số liệu sau khi sửa

| Tuần | Hiện tại | Sau sửa |
|---|---|---|
| 29/06–05/07 | 7/17 lớp | 11/17 |
| 13/07–19/07 | 8/17 | 13/17 |
| 27/07–02/08 | 9/17 | 16/17 |
| 03/08–09/08 | 9/17 | 16/17 |
| 10/08–12/08 | 15/17 | 17/17 |

Phần trái biểu đồ vẫn mỏng thật — IC2230 chỉ có 3 ngày dữ liệu, IC2226 có 5, vì các lớp này mới được scrape gần đây. Đó là sự thật về dữ liệu, và subtitle phải nói rõ thay vì che.

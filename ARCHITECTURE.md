# ARCHITECTURE.md

Hạ tầng dữ liệu của hệ thống **Dán nhãn / Phân loại HV / Auto Pass-Fail** của IZONE, và cách dashboard này tiêu thụ nó.

Doc này mô tả **hiện trạng** — kiến trúc, schema, quy tắc nghiệp vụ, và các khoảng trống đang tồn tại. Lịch sử thay đổi, lý do từng quyết định, và nhật ký các đợt sửa lỗi/migration nằm ở [`CHANGELOG.md`](CHANGELOG.md), mới nhất ở trên cùng — đọc file đó khi cần biết "vì sao lại như vậy" hoặc "cái này đổi từ khi nào".

---

## 0. Bố cục monorepo

```
Izone-label-dashboard/
├── dashboard/     React + Vite + Tailwind v4 — app frontend
├── backend/       NestJS 11 + Prisma 7 + Postgres — API thật
├── database/      docker-compose Postgres, SQL migrations, script sinh dữ liệu mẫu
├── google_sheets/ Script Python sinh CSV mock (KHÔNG phải pipeline đồng bộ, xem §8)
├── report/        Doc thiết kế/họp tiếng Việt — nguồn tham khảo, không phải mã nguồn
├── docs/          Hướng dẫn sử dụng + tài liệu tư vấn kiến trúc (Oracle, xem §8)
└── package.json   Chỉ còn devDependency `gh-pages` — không phải workspace root
```

**Đây không phải một monorepo có tooling** (không `workspaces`, không Turborepo/Lerna/pnpm). `backend/` và `dashboard/` là hai dự án npm độc lập, mỗi thư mục có `package.json`/`node_modules` riêng, chỉ nằm cạnh nhau trong cùng git repo. Chạy lệnh gì thì phải `cd` đúng thư mục trước — xem CLAUDE.md.

`ARCHITECTURE.md` và `CLAUDE.md` hiện **đã được track bình thường trong git**, không còn nằm trong `.gitignore` (từng có một giai đoạn bị gitignore nhầm — xem `CHANGELOG.md`) — commit như file thường, không cần `git add -f`.

### Hiện trạng vs kiến trúc mục tiêu

| | **Hiện tại (đã verify trong code)** | **Mục tiêu (theo `docs/research/2026-08-04-oracle-sheets-sql-decision.md`)** |
|---|---|---|
| Nguồn sự thật | Postgres (`backend/`, schema `izone`) | Postgres — đã đúng hướng |
| Ghi dữ liệu vào DB | **Không có** — toàn bộ dữ liệu trong Postgres là **sinh giả lập** bởi 1 script Python, chạy một lần lúc seed | n8n cào portal → gọi API ingest của backend → backend ghi Postgres |
| Đồng bộ Sheets | — | Sheets chỉ còn vai trò *xuất báo cáo* (đọc từ Postgres), không phải nguồn ghi |
| Frontend đọc gì | `dashboard/src/api/client.ts` gọi REST API thật | Giữ nguyên, API trả đủ trường thay vì frontend tự bịa (xem §5) |
| Đăng nhập | JWT thật, email + SĐT làm mật khẩu | Cần thêm hash mật khẩu, đổi cơ chế xác thực (xem §6) |

**Điều quan trọng nhất cần hiểu**: hạ tầng ghi dữ liệu (n8n cào portal → Sheets/Postgres) **chưa tồn tại ở bất kỳ đâu trong repo**. Backend, schema, và frontend đều đã sẵn sàng *đọc* dữ liệu thật, nhưng hiện tại toàn bộ dữ liệu trong Postgres là mock được sinh một lần bởi `database/generate_snapshots.py`. Đừng nhầm "có schema Postgres" với "có pipeline dữ liệu sống" — hai thứ đó độc lập, và chỉ cái đầu đã xong.

---

## 1. Cơ sở dữ liệu Postgres (`backend/prisma/schema.prisma`, schema `izone`)

> **Sơ đồ quan hệ đầy đủ (ER diagram) + mô tả chi tiết từng bảng**: xem [`docs/infrastructure/database-architecture.md`](docs/infrastructure/database-architecture.md) — sinh trực tiếp từ introspect Postgres production (`\d+`, `information_schema`), không phải từ Prisma schema, nên phản ánh đúng DB thật kể cả khi lệch với `schema.prisma`. Chi tiết 2 hàm PL/pgSQL (`label_from_average`, `refresh_student_daily_snapshot`) xem [database-architecture.md §4](docs/infrastructure/database-architecture.md#4-hàm-plpgsql-business-logic-sống-trong-db-không-phải-chỉ-ở-backend). Phần dưới đây giữ vai trò ánh xạ sang 9 sheet Google Sheets cũ; không lặp lại chi tiết cột/constraint đã có ở file kia.

Provisioning: `database/docker-compose.yml` (Postgres 16-alpine + pgAdmin, port 5432/5050), tự chạy `database/migrations/*.sql` theo thứ tự khi container khởi tạo lần đầu. **Không dùng Prisma Migrate** — migration là SQL tay viết, Prisma schema được `db pull` từ Postgres (giải thích các comment "requires additional setup for migrations" rải khắp `schema.prisma`).

⚠️ Vài chuỗi mặc định tiếng Việt trong `schema.prisma` bị hỏng encoding khi introspect (`'Bình thường'` hiện ra `'B?nh th??ng'`, `'Chờ GV'` → `'Ch? GV'`, `'Chưa đạt'` → `'Ch?a ??t'`). Chưa xác nhận dữ liệu thật trong Postgres có bị hỏng theo hay chỉ là lỗi hiển thị lúc `prisma db pull` — kiểm tra trực tiếp trong DB trước khi tin vào các giá trị này.

### Ánh xạ 9 sheet cũ → 10 bảng Postgres

| Bảng Postgres | Sheet cũ tương ứng | Vai trò |
|---|---|---|
| `teachers` | `08_GiaoVien` | Master GV: `teacher_id`, `teacher_name`, `teacher_email` (unique), `teacher_phone`, `khoi_id` (mặc định 34), `role` (`teacher`/`lead`/`admin`) |
| `classes` | `01_DanhSach_Lop` (phần tĩnh) | Master lớp: `class_id`, `class_name` (unique), `course_id`, `teacher_id` (FK), `lead_email`, `status`, `schedule`, `location`, `opening_date`, `total_sessions` (mặc định 28), `portal_url` |
| `class_daily_snapshots` | `01_DanhSach_Lop` (phần biến động) + `09_Weekly_Snapshot` | **Time-series theo lớp/ngày**, không UPDATE — mỗi lần cào tạo 1 dòng mới. Có `progress_pct` là **generated column** (`completed_sessions*100/28` — chia cứng 28, không đọc `classes.total_sessions`, xem bẫy ở §6). Gộp luôn vai trò của `09_Weekly_Snapshot` — không còn bảng snapshot theo tuần riêng, có 2 view SQL tổng hợp thay thế (`v_weekly_trend`, `v_monthly_trend`) |
| `students` | `02_DuLieu_HocVien` (phần tĩnh/định danh) | Master HV: `student_id`, `student_code`, `full_name`, `phone`, `email`, `class_id` (FK), `registration_status`, `admitted_at`, `target_output_status` |
| `student_daily_records` | `02_DuLieu_HocVien` (phần biến động mỗi ngày) | **Time-series theo HV/ngày** — cho dòng **live** (`snapshot_stage IS NULL`). Chứa toàn bộ: điểm danh, BTVN, `test_1..test_8`, nhãn (`current_label`/`previous_label`/`benchmark_label`/`has_label_changed`/`label_change_direction`/`last_checkpoint`), pass chuẩn/mềm, các cờ (`flag_attendance_drop`, `flag_homework_drop`, `flag_cheating`, `flag_needs_review`), nhận xét GV. Bảng này còn chứa một hạt thứ hai (`snapshot_stage = 1..8`, backfill theo mốc test) — KHÔNG phải "1 dòng/HV/ngày" đơn thuần, xem mục riêng cuối phần này |
| `test_scores` | `03_DiemTest_ChiTiet` | 1 dòng = 1 lượt thi. `raw_score`, `makeup_score`, `final_score`, `is_cheating`, `label_at_time`. Unique `(student_id, class_id, test_order, is_makeup)` |
| `label_change_logs` | `04_NhatKy_ChuyenNhan` | Append-only. Có thêm `severity` (`recovery`/`warning`/`serious`/`critical`) và `step_count` so với sheet cũ, phân biệt được 1 HV rớt 1 bậc với 1 HV rớt 2 bậc |
| `pass_reviews` | `05_XetDuyet_PassMem` | Vòng đời `review_status` (`Chờ GV` → `GV Đồng ý`/`GV Từ chối`/quá hạn), y hệt thiết kế cũ |
| `system_configs` | `06_CauHinh_HeThong` | Key-value threshold, **vẫn là nguồn duy nhất của mọi ngưỡng** — xem §2 |
| `system_logs` | `07_Log_HeThong` | Log workflow. Comment trong `001_schema.sql:336` vẫn ghi *"Log hoạt động hệ thống n8n"* — bảng tồn tại nhưng **không ai ghi vào nó**, vì không có n8n nào chạy (xem §0) |
| `contact_logs` | *(không có trong 9 sheet gốc)* | Nhật ký liên hệ Zalo — xem §5. Đã triển khai thật |

Việc tách **định danh tĩnh** (`classes`, `students`) khỏi **snapshot hàng ngày** (`class_daily_snapshots`, `student_daily_records`) là khác biệt kiến trúc lớn nhất so với sheet cũ (sheet cũ ghi đè state mới nhất, không giữ lịch sử theo ngày). Bốn view SQL (`v_class_latest`, `v_student_latest`, `v_weekly_trend`, `v_monthly_trend`, định nghĩa cuối `001_schema.sql`) dùng `DISTINCT ON (...) ORDER BY date DESC` để dựng lại "trạng thái hiện tại" — đây chính là cơ chế cho các API `GET /classes`, `GET /students/by-class/:id` (xem §3). Các view này KHÔNG lọc `snapshot_stage` — chưa cần, vì `dashboards` là module duy nhất hiện đọc trực tiếp `student_daily_records` thay vì qua view (xem §3).

### Hai hạt trộn trong `student_daily_records`

Cột `snapshot_stage` biến bảng này thành **hai bảng logic dùng chung một bảng vật lý**:

| | `snapshot_stage IS NULL` | `snapshot_stage = 1..8` |
|---|---|---|
| Hạt | 1 dòng / HV / lớp / **ngày** (quan sát thật, cào hàng ngày) | 1 dòng / HV / lớp / **mốc test** (backfill dựng lại lịch sử theo mốc test) |
| Trục thời gian | `record_date` = ngày quan sát thật | `record_date` **vô nghĩa** — luôn là ngày chạy backfill, không phải ngày của mốc test đó |
| Cột có nghĩa | Đầy đủ: điểm danh, BTVN, pass chuẩn/mềm, nhãn | Chỉ `tests_taken`, `test_average`, `current_label`; điểm danh/BTVN/pass **luôn NULL** |
| Constraint bảo vệ 1-dòng-mỗi-hạt | ✅ Partial unique index `uq_student_record_live (student_id, class_id, record_date) WHERE snapshot_stage IS NULL` | ✅ `uq_student_stage (student_id, class_id, snapshot_stage)` |

Cả hai hạt đều có ràng buộc unique bảo vệ chống trùng dòng (lịch sử lỗ hổng này đã đóng, xem `CHANGELOG.md`). Nếu phục hồi database từ backup cũ hoặc dựng container mới, hãy kiểm tra lại hai index/constraint này có mặt trước khi tin rằng ràng buộc còn hiệu lực — không có bảng theo dõi migration nào trong DB, nên dấu vết schema là bằng chứng duy nhất.

**Mọi query aggregate của Lead Dashboard phải thêm `AND r.snapshot_stage IS NULL`.** `getLeadDashboard` (`dashboards.service.ts`) có 7 lệnh `$queryRaw`; chỉ **3 trong số đó** thật sự đọc `student_daily_records` và cần điều kiện này — `studentMetricRows`, `transitionRows`, `coverageStudentRows`. Bốn lệnh còn lại (`classRows`, `snapshotRows`, `configRows`, `contactLogRows`) **đúng khi KHÔNG có** điều kiện này: `classRows`/`snapshotRows` đọc `classes`/`class_daily_snapshots` — hai bảng không có cột `snapshot_stage` lẫn `registration_status` theo từng HV; `configRows` đọc `system_configs`; `contactLogRows` đọc `contact_logs` join thẳng `classes`/`teachers`, không qua `student_daily_records`. Đừng "tiện tay" thêm điều kiện vào 4 query này. Comment giải thích đầy đủ lý do điều kiện bắt buộc chỉ nằm ở **một chỗ duy nhất** — ngay trên `GROUP BY` của `studentMetricRows`; `transitionRows` và `coverageStudentRows` lặp lại đúng điều kiện đó nhưng không lặp lại comment, nên đọc comment ở `studentMetricRows` trước nếu thấy điều kiện ở hai query kia có vẻ vô căn cứ. Lý do lịch sử của bẫy này (và hệ quả đo được khi nó bị bỏ sót) nằm ở `CHANGELOG.md`.

**`NULL` khác `0%`.** `attendance_pct`/`homework_pct` là `NULL` khi HV **chưa có buổi học nào** kể từ lúc ghi danh; `0%` là số thật (đã có buổi, vắng hết). Đây là bất biến đã kiểm chứng trên toàn bộ dữ liệu prod (chi tiết số liệu ở `CHANGELOG.md`). Hệ quả thiết kế: mọi phép tính trung bình phải loại `NULL` khỏi cả tử số lẫn mẫu số, nhưng **giữ nguyên `0%`** trong cả hai — gộp `0%` vào cùng nhóm với `NULL` sẽ xoá mất đúng tín hiệu cần cảnh báo nhất ("HV có buổi nhưng vắng hết"), biến nó thành "chưa có dữ liệu".

Các dòng `snapshot_stage = 1..8` không tham gia các query aggregate của Lead — chúng chỉ dùng để dựng biểu đồ "tiến triển theo mốc test" (tính năng riêng, ngoài phạm vi các quy tắc ở trên).

---

## 2. Quy tắc nghiệp vụ

Toàn bộ ngưỡng đọc từ `system_configs` (trước là sheet `06_CauHinh_HeThong`), seed tại `database/migrations/002_seed_data.sql:53-75`, **cùng giá trị hệt sheet cũ**. ⚠️ Comment trong `dashboard/src/data/selectors/studentFilters.ts` trỏ vào mục này bằng số thứ tự nhưng ghi **`ARCHITECTURE §4`** — số đó đã lỗi thời (mục này hiện là §2); cần sửa comment trong code cho khớp. Nếu đổi lại số mục ở đây trong tương lai thì nhớ sửa comment trong code tương ứng luôn.

### Gán nhãn theo `test_average`

| Nhãn | Điều kiện | Config key |
|---|---|---|
| **Xám** | `< 45` | `nguong_xam_max = 45` |
| **Đỏ** | `45 ≤ x < 60` | `nguong_do_min/max = 45/60` |
| **Vàng** | `≥ 60` | `nguong_vang_min = 60` |
| **Chưa có DL** | chưa có điểm test nào | — |

Nhãn học thuật chỉ tính theo Test — thiếu hoặc kém ĐH/BTVN không xoá hay đổi nhãn Test, chỉ tạo issue/cảnh báo chất lượng dữ liệu và điều khiển `interventionLevel` (xem "Dashboards module" ở §3).

### Pass chuẩn

```
pass_chuan_status = 'Có khả năng pass'
    ⟺ attendance_pct >= 90  AND  homework_pct >= 90  AND  test_average >= 60
```

Config: `pass_dh_min = 90`, `pass_btvn_min = 90`, `pass_test_avg_min = 60`. ĐH và BTVN vẫn là hai điều kiện tách rời.

### Pass mềm — 3 nhóm ngoại lệ

| Nhóm | `test_average` | ĐH | BTVN | Cần GV duyệt? |
|---|---|---|---|---|
| **Nhóm 1** | `50 ≤ x < 55` | `= 100%` | `= 100%` | ✅ Có |
| **Nhóm 2** | `55 ≤ x < 60` | `≥ 90%` | `≥ 90%` | ✅ Có |
| **Nhóm 3** | `≥ 60` | — | — | ❌ Không (tự động đạt) |

Config: `soft_g1_test_min/max = 50/55`, `soft_g1_dh_min = soft_g1_btvn_min = 100`, `soft_g2_test_min/max = 55/60`, `soft_g2_dh_min = soft_g2_btvn_min = 90`.

### Các quy tắc khác

| Quy tắc | Giá trị | Config key |
|---|---|---|
| TB test | Trung bình các bài **đã thi**, không chia cứng 6 | — |
| Cheating | Điểm bài đó = 0 | `cheating_test_score = 0` |
| Thi lại | `final_score = max(raw, makeup)` | `test_makeup_rule = max` |
| Báo động lớp | `(Xám+Đỏ)% >= 40%` | `moc_bao_dong_pct = 40` |
| Cảnh báo tụt ĐH/BTVN (ngưỡng cấu hình, **không phải ngưỡng nhắc thật**) | `< 80%` | `alert_dh_tut_pct`, `alert_btvn_tut_pct = 80` |
| Deadline review | 7 ngày | `review_deadline_days = 7` |
| Tổng số test | 6 | `total_tests_per_course = 6` |

⚠️ **Ngưỡng nhắc thật trong frontend là 90, không phải 80** — `PASS_THRESHOLD_PCT` trong `dashboard/src/data/selectors/studentFilters.ts` cố tình lệch khỏi `alert_dh_tut_pct` để khớp ngưỡng pass thật (khe 80–90 khiến HV nhãn Đỏ mới đủ điều kiện nhận lời nhắc, tránh spam sớm).

---

## 3. Backend API (`backend/`)

**Stack**: NestJS 11 + Prisma 7 (driver adapter `@prisma/adapter-pg`, không dùng connection pooling built-in của Prisma) + Postgres 16. `backend/main.ts` chỉ 7 dòng: `app.enableCors()` **không giới hạn origin nào**, lắng nghe `process.env.PORT ?? 3000`. Không có `@nestjs/config`, không `class-validator`, không Swagger — body controller kiểu `any`, không có global `ValidationPipe`.

### Module & endpoint (mọi route trừ login đều yêu cầu `AuthGuard`)

| Module | Endpoint | Ghi chú |
|---|---|---|
| `auth` | `POST /api/auth/login` | Body `{email, password}` — `password` thực chất là **số điện thoại**, so sánh **plaintext**, không hash |
| `auth` | `GET /api/me` | Trả `AuthUser` giải mã từ JWT |
| `classes` | `GET /api/classes` | `lead` → mọi lớp trong `khoi_id`; `teacher` → chỉ lớp của mình. Query raw SQL vào view `v_class_latest` |
| `classes` | `GET /api/classes/:id/trend` | 403 nếu GV xin lớp ngoài `classIds`. Query `v_weekly_trend`/`v_monthly_trend`. **Không có nơi nào trong frontend gọi endpoint này** — dead API |
| `students` | `GET /api/students/by-class/:classId` | Lọc `registration_status = 'active'`, dùng `v_student_latest` |
| `students` | `GET /api/students/:id/timeline` | ⚠️ **Không có RBAC check** — comment trong code tự thừa nhận điều này. GV A có thể xem timeline của HV thuộc lớp GV B nếu biết `student_id` |
| `label-changes` | `GET /api/label-events?classId=&khoiId=` | Lọc theo lớp hoặc theo khối |
| `snapshots` | `GET /api/snapshots?khoiId=` | Dead API — xem §4. Có rule nghiệp vụ trong service: nếu `active_students === 0` thì trả `null` cho các tỷ lệ trung bình thay vì `0` (tránh hiểu nhầm lớp rỗng đạt 0%) |
| `contact-logs` | `GET /api/contact-logs?classId=&khoiId=` | |
| `contact-logs` | `POST /api/contact-logs` | Bắt lỗi unique-violation (Prisma `P2002`) → 409 |
| `contact-logs` | `POST /api/contact-logs/undo` | GV chỉ được undo log do chính mình tạo (`teacher_id` không khớp → 409) |
| `dashboards` | `GET /api/v1/lead-dashboard` | Namespace `/api/v1/*` — khác mọi endpoint khác ở trên (`/api/...`, không version, xem §6 mục namespace không nhất quán). Query `period=YYYY-MM` (khuyến nghị) hoặc `from`/`to` (tối đa 90 ngày) — hai kiểu loại trừ lẫn nhau. Chỉ chấp nhận `courseId=2` (400 nếu khác); `role=teacher` bị chặn 403; `role=lead` bị ép `khoiId` theo JWT bất kể query param. Trả KPI/xu hướng tuần/nhãn đã tính sẵn — xem "Dashboards module" dưới đây |
| `dashboards` | `GET /api/v1/classes/:classId/teacher-dashboard` | `role=teacher` chỉ xem lớp trong `classIds` của JWT (403 nếu không), `role=lead` giới hạn theo `khoi_id`, `admin` không giới hạn. Trả roster đầy đủ (kể cả HV chưa có `student_daily_records`) + nhãn/mức can thiệp đã phân loại sẵn qua `classifyStudent` (`labeling-engine.ts`) |

### Dashboards module (screen-contract)

`backend/src/dashboards/` (`dashboards.service.ts`, ~1224 dòng) hiện thực hoá kiến trúc "screen-contract": backend tính sẵn toàn bộ KPI/nhãn/gợi ý hành động, React chỉ hiển thị. Thiết kế đầy đủ ở `report/2026-08-12-screen-contract-data-flow-design.md` và `report/2026-08-12-lead-dashboard-data-quality-design.md` (§8). Lịch sử ra đời và các bug đã sửa của module này nằm ở `CHANGELOG.md`. Vài điểm quan trọng khi đọc code:

- **Truy vấn thẳng bảng gốc, không qua view.** Khác với module `classes`/`snapshots` (dùng `v_class_latest`/`v_weekly_trend`/`v_monthly_trend`, xem `docs/infrastructure/database-architecture.md` §5), cả 2 endpoint ở đây query raw SQL có tham số hoá (`$queryRaw`) thẳng vào `class_daily_snapshots`/`student_daily_records`/`test_scores`/`pass_reviews` — vì các view chỉ làm `DISTINCT ON (...) ORDER BY date DESC` đơn giản, không có logic "độ phủ dữ liệu" mà module này cần. Migration `009_dashboard_screen_contract_indexes.sql` thêm 3 index phục vụ đúng pattern query này.
- **Snapshot Quality Resolver** (`snapshot-quality.ts`, hàm `resolveClassObservation`): loại bỏ dòng có ngày tương lai; chọn roster từ snapshot mới nhất ≤ `asOf`; `progress` lấy `completedSessions` **lớn nhất từng quan sát được** (không phải dòng mới nhất) để một snapshot lỗi/rỗng không kéo tiến độ lớp tụt về 0; `attendance`/`homework` nhận dòng mới nhất **có mẫu** (`sampleSize > 0` và giá trị khác `null`), nếu dòng mới nhất không có mẫu thì lùi về dòng cũ hơn gần nhất có (`fallbackUsed: true`); tỷ lệ pass chia cho `testedStudents` (số HV đã thi), không phải tổng sĩ số, `0%` vẫn hợp lệ nếu có mẫu.
- **Không còn ngưỡng độ phủ tối thiểu ở tầng snapshot.** `coveragePct` (`sampleSize/recordCount`) chỉ để hiển thị (tooltip biểu đồ, note của card: `228/264 HV`) — Lead tự đánh giá độ tin cậy thay vì bị hệ thống âm thầm loại lớp khỏi mẫu số. `LOW_COVERAGE_WARNING_PCT = 80` chỉ gắn cảnh báo `LOW_ATTENDANCE_COVERAGE`/`LOW_HOMEWORK_COVERAGE` lên `dataQuality.warnings[]`. Lớp chỉ bị đánh `dataQuality.status: 'insufficient'` khi `attendance`/`homework` hoàn toàn không có dòng nào có mẫu (không phải khi mẫu mỏng) — status còn lại (`complete`/`fallback`) + `warnings[]` (`PARTIAL_SNAPSHOT`, `LOW_ATTENDANCE_COVERAGE`, `LOW_HOMEWORK_COVERAGE`, `NO_TEST_SAMPLE`, `PROGRESS_HISTORY_INCOMPLETE`, `FUTURE_ROWS_EXCLUDED`) trả thẳng ra API.
- **`netMomentum` luôn `null` trên dữ liệu thật hiện tại.** `calculateNetMomentum` (`lead-aggregation.ts`) cố tình phân biệt "không quan sát được chuyển nhãn nào" (`null`) khỏi "có chuyển nhãn nhưng cân bằng lên/xuống" (`0`) — trên dữ liệu thật hiện tại luôn nhận mảng rỗng nên trả `null` (lý do dữ liệu, xem `CHANGELOG.md`). Card "Net Momentum" đã bị bỏ khỏi `KpiRow.tsx` vì lý do này — trường `kpis.netMomentum` vẫn còn nguyên trong API contract, không phá schema, chỉ không còn UI nào đọc. Đừng "sửa" bằng cách bỏ điều kiện `snapshot_stage IS NULL` ở query chuyển nhãn để trường này khác `null` — làm vậy sẽ đếm lại đúng lỗi phình mẫu số đã sửa (xem §1 và `CHANGELOG.md`).
- **Chỉ số ĐH/BTVN của từng học viên lấy số đếm lũy kế cùng ngày chốt làm nguồn chuẩn.** Teacher dashboard và phép phân loại phục vụ `contactCoverage` đều tính lại tỷ lệ từ `attendance_present / attendance_total` và `homework_done / homework_total`; không còn tin trực tiếp `*_pct` nếu hai nguồn lệch nhau. Mẫu số bằng 0 hoặc bộ đếm vô lý (âm, tử lớn hơn mẫu) trả `null` thay vì dựng `0%`; sai lệch/invalid được trả trong `dataQuality.warnings[]`. UI chỉ hiển thị một snapshot chung cho cả hai metric, số đếm và ngày dữ liệu; không fallback riêng BTVN sang ngày cũ và không còn vẽ trend giả từ một snapshot. Hai n8n workflow phục vụ pipeline này (`AbBatX2eptllUAET`, `SLZH4ZwyQsx8b4CS`) là draft, **chưa deploy** — backfill chưa chạy trên production.
- **`contactCoverage`.** `LeadDashboardClass.contactCoverage: { done, total, pct }` tính ở `contact-coverage.ts` (hàm `contactCoverageByClass`), join `contact_logs` với danh sách HV đang có cảnh báo mở tại **checkpoint cấp lớp** (`total`), rồi đếm số cảnh báo đã có bản ghi liên hệ khớp `(student_id, trigger_type, checkpoint)` (`done`); checkpoint là test confirmed có `test_order` lớn nhất trong cả lớp, hoặc `Chưa có test` nếu lớp chưa có test. Danh sách coverage còn bắt buộc `students.class_id = student_daily_records.class_id`, nếu không record lịch sử của HV đã chuyển lớp vẫn bị Lead tính dù không còn nằm trong roster Teacher. Vì vậy một test mới của bất kỳ HV nào sẽ mở episode mới nhất quán ở cả Teacher và Lead; tick hết ở Teacher sẽ phản ánh đúng lên Lead. `pct` là `null` khi `total = 0` (lớp không có cảnh báo nào — khác hẳn 0%, đừng gộp hai trường hợp). Hàm này **cố tình không nhân bản** luật "đóng hộ đa luồng" (`COVERED_BY`) mà frontend áp dụng ở `dashboard/src/data/selectors/contactLog.ts`, vì `classifyStudent` (`labeling-engine.ts`) đã xếp mỗi HV vào đúng một `interventionLevel` nên mỗi HV chỉ mở tối đa một episode ở tầng backend — điều kiện bắt buộc phải port luật đó sang, và hệ quả nếu quên, nằm ở comment đầu `contact-coverage.ts` và ở CLAUDE.md §"Business rules that are duplicated".
- **Code chết trong cùng module — đừng nhầm là đang chạy:** `lead-aggregation.ts` export `aggregateSnapshots`/`calculateAttrition`/`buildTrend` nhưng không nơi nào trong `dashboards.service.ts` gọi tới (sót lại từ thiết kế daily-trend trước khi chuyển sang weekly) — chỉ `parseReportPeriod`/`calculateNetMomentum`/`compareMonthlyMetrics`/`buildWeeklyTrend` thực sự được dùng. Phía frontend, `dashboard/src/api/dashboardService.ts` có 2 hàm hỏng/mồ côi: `getKhoi34Dashboard()` gọi `GET /snapshots/dashboard` — **endpoint này không tồn tại ở backend** — và `getStudentsByClass()`/`getClassTrend()` trùng tên với hàm tương ứng trong `client.ts` nhưng không có nơi nào trong UI gọi tới bất kỳ hàm nào trong 3 hàm này.
- **`GET /api/classes/:id/trend` và `GET /api/snapshots?khoiId=` là dead API** — module `dashboards` xây một đường song song, không hồi sinh hai endpoint cũ này. Wrapper phía frontend (`api.getSnapshots`, `dashboardService.getKhoi34Dashboard`) tồn tại nhưng không component nào gọi.

### Xác thực

JWT (`@nestjs/jwt`), secret đọc từ `process.env.JWT_SECRET`, **có fallback hardcode `'izone-secret-key-12345'` ngay trong `auth.module.ts` nếu thiếu env** — rủi ro bảo mật thật nếu quên set env khi deploy. Hết hạn sau 7 ngày. `teachers` chính là bảng user — không có bảng `User` riêng; `role` + `khoi_id` quyết định RBAC. `classIds` trong JWT payload được tính lại **mỗi lần** validate token (query `classes WHERE teacher_id = ... AND status = 'on_going'`), không cache trong token.

### Vấn đề vận hành cần biết trước khi đưa lên production

- Mật khẩu Postgres (`Izone@2026!`) commit dạng plaintext ở **3+ chỗ**: `database/.env.example`, `database/docker-compose.yml` (fallback default), và hardcode thẳng trong `backend/seed.js`/`backend/run_sql.js`/`backend/src/prisma/prisma.service.ts:9`.
- CORS mở hoàn toàn (`app.enableCors()` không tham số).
- Không có input validation pipe — mọi body controller đang nhận kiểu `any`.
- Prisma client đã generate bị **commit vào git** (`backend/src/generated/prisma/`, 21 file) — `.gitignore` của backend chỉ loại trừ `/generated/prisma` ở root backend, không khớp path lồng trong `src/`.
- Không có `npm run migrate`/`seed` script chính thức — seed chạy tay qua `node backend/seed.js`, connection string hardcode.

---

## 4. Frontend ↔ Backend (`dashboard/src/api/client.ts`)

Axios client, `API_BASE_URL = 'http://localhost:3000/api'` **hardcode trong source**, không có `import.meta.env.VITE_*` nào — build production hiện tại sẽ gọi `localhost:3000` từ trình duyệt người dùng, tức là **không hoạt động ngoài máy dev** cho tới khi việc này được sửa. Token JWT lưu `localStorage['auth_token']`, gắn vào `Authorization: Bearer` header qua `setAuthHeader()`. Không có router — `App.tsx` gate bằng `currentUser` truthy.

App 100% phụ thuộc API sống — không còn chế độ offline/demo, không có mock data fallback.

Màn Lead Dashboard và luồng chọn lớp giáo viên **không đi qua các mapper cũ dưới đây cho phần số liệu chính** — `LeadDashboard.tsx` tự fetch qua `dashboardService.getLeadDashboard()` (`GET /api/v1/lead-dashboard`), và `App.tsx` tự fetch roster lớp qua `dashboardService.getTeacherDashboard()` (`GET /api/v1/classes/:classId/teacher-dashboard`) khi đổi lớp — cả hai trả số liệu server tính thật (xem "Dashboards module" ở §3). `api.getClasses()` (dùng `mapClassSummary`) vẫn được `App.tsx` gọi thật cho sidebar/chọn lớp — các trường của `ClassSummary` từ mapper này vẫn đang live, **trừ** `netMomentum` (xem bảng dưới). `api.getSnapshots()` (`mapSnapshot`) và `api.getStudentsByClass()` (`mapStudentDetail`) không còn nơi nào gọi — dead code theo đúng nghĩa đen.

### ⚠️ Các trường frontend khai báo nhưng backend chưa trả (hoặc mapper không đọc) — chỉ áp dụng cho các mapper còn sống

Các hàm `mapClassSummary`/`mapStudentDetail`/`mapSnapshot` trong `client.ts` nhận response snake_case rồi map sang camelCase cho khớp `dashboard/src/data/types.ts`. Với các trường API chưa trả (hoặc trả nhưng mapper không đọc), giá trị bị **hardcode cứng**, không phải `null`/`undefined` dễ nhận ra:

| Trường | Mapper | Giá trị hardcode | Còn ảnh hưởng UI? |
|---|---|---|---|
| `labelDistribution.netMomentum` | `mapClassSummary` | luôn `0` | Không — Lead Dashboard đọc `kpis.netMomentum` từ contract mới thay thế (§3), khác trường này. `api.getClasses()` vẫn live nhưng riêng trường này không còn ai đọc |
| `evaluation.riskScore` | `mapStudentDetail` | luôn `0` | Không (mapper chết) |
| `evaluation.suggestedAction` | `mapStudentDetail` | luôn `'none'` | Không (mapper chết) |
| `evaluation.isEligibleForReview`, `reviewStatus`, `passMemStatus/Group/Label` | `mapStudentDetail` | luôn `false`/`''` | Không (mapper chết) — luồng Pass mềm chưa có UI thay thế qua contract mới, dù `pass_reviews` đã có API |
| `evaluation.passChuanReasons` | `mapStudentDetail` | luôn `[]` | Không (mapper chết) |
| `testPerformance.isCheatingFlagged` | `mapStudentDetail` | luôn `false` | Không (mapper chết) |
| `attendance.isDroppingRecently`, `homework.isDroppingRecently` | `mapStudentDetail` | luôn `false` | Không (mapper chết) |
| `labeling.hasChangedRecently` | `mapStudentDetail` | luôn `false` | Không (mapper chết) |
| `healthMetrics.classRiskLevel`/`healthScore`/`isAlarmTriggered` | `mapSnapshot` | luôn `'low'`/`100`/`false` | Không (mapper chết) — cột thật `class_daily_snapshots.is_alarm_triggered` tồn tại và có giá trị đúng trong DB nhưng mapper này không đọc |
| `ClassSnapshot.weekIndex`, `progressPct`, `totalSessions`, `riskPct`, `testCheckpoint` | `mapSnapshot` | luôn `0` / suy từ mảng hardcode `[4,8,12,16,20,24]` | Không (mapper chết) |

Chưa verify `TeacherDashboardResponse`/`adaptTeacherStudent` (`dashboardContracts.ts`, contract mới) có phủ đủ mọi trường tương đương của `StudentDetail` cũ hay chưa — đừng coi contract mới là đã thay thế hoàn toàn cho tới khi kiểm tra kỹ. Nếu dọn dead code, `mapSnapshot`/`api.getSnapshots`/`mapStudentDetail`/`api.getStudentsByClass` là ứng viên xoá cùng đợt, cùng với type `PendingReviewEnriched` (`dashboard/src/data/types.ts`, không còn consumer nào từ khi `ReviewCenter.tsx` bị xoá) và `zustand`/`@tanstack/react-query` (đã cài trong `dashboard/package.json` nhưng 0 import trong toàn bộ `dashboard/src`).

---

## 5. Nhật ký liên hệ (`contact_logs`)

Bảng Postgres thật (`contact_logs`, xem schema ở §1) + module NestJS thật (`backend/src/contact-logs/`) + được `dashboard/src/App.tsx` gọi thật qua `api.createContactLog`/`api.undoContactLog`.

### Khoá episode

```
khoá unique DB = (student_id, class_id, trigger, checkpoint)
```

Khớp đúng constraint `uq_contact_log` trong schema. Append-only ở tầng nghiệp vụ (undo là xoá dòng, không phải cờ trạng thái).

### Ba mức can thiệp (`dashboard/src/data/selectors/studentFilters.ts`)

| Mức | `trigger` | Predicate | Tiêu chí |
|---|---|---|---|
| 1 | `habit_reminder` | `isHabitReminderStudent` | `attendance_pct < 90` hoặc `homework_pct < 90` (hoặc `homework.isDroppingRecently` — hiện luôn false, xem §4) |
| 2 | `red_followup` | `isRedFollowUpStudent` | Nhãn Đỏ, `registration_status = 'active'` |
| 3 | `relearn_advice` | `isRelearnAdviceStudent` | Nhãn Xám, `registration_status = 'active'` |

Ba predicate này **trực tiếp đọc từ `StudentDetail`** trả về bởi `client.ts` — nghĩa là chúng đang chịu ảnh hưởng của các trường bị hardcode ở §4 (đặc biệt `isDroppingRecently`).

### Kênh liên hệ: chỉ Zalo, gửi cho học viên

`channel` mặc định `'zalo'` cả ở schema DB lẫn UI. Giao diện gọi phụ huynh (`CallParentModal.tsx`) đã bị xoá hẳn — nếu cần khôi phục phải viết lại từ đầu, không phải remount.

### Đóng hộ giữa các luồng — một chiều

```
red_followup / relearn_advice  ──đóng hộ──►  habit_reminder
```

Ràng buộc bởi test `dashboard/src/data/messageScripts.test.ts` — đảm bảo kịch bản Đỏ/Xám luôn nêu cả số ĐH lẫn BTVN. Đừng xoá test đó.

### Ghi ngược — qua REST thật, không qua n8n

`POST /api/contact-logs` và `POST /api/contact-logs/undo` (NestJS, xem §3), gọi trực tiếp từ `App.tsx`, không qua n8n ở bất kỳ bước nào.

---

## 6. Khoảng trống & rủi ro lớn nhất

Xếp theo mức độ chặn việc đưa hệ thống vào dùng thật:

1. **Không có pipeline nạp dữ liệu thật.** Không n8n, không tích hợp Google Sheets API, không cào portal ở đâu trong repo. Toàn bộ dữ liệu trong Postgres là mock, sinh 1 lần bởi `database/generate_snapshots.py` (60 ngày dữ liệu giả lập theo "archetype" học viên, `random.seed(42)`). `google_sheets/generate_mock_data_v2.py` là một **generator mock khác, độc lập, không liên quan** — nó sinh CSV để *nhập vào* Sheets, không đọc *từ* Sheets ra. Hai script này tạo hai bộ dữ liệu giả song song, không đồng bộ với nhau và không đồng bộ với Postgres thật.
2. **Frontend hardcode nhiều trường "thông minh"** (risk score, health score, cảnh báo tụt hạng, pass-mềm) dù backend đã có cột tương ứng — xem bảng ở §4. Đây là việc sửa nhanh (sửa mapper), không phải thiết kế lại.
3. **Bảo mật**: mật khẩu DB plaintext trong git, secret JWT có fallback hardcode, mật khẩu đăng nhập = SĐT so sánh plaintext không hash, CORS mở toàn bộ, thiếu validation pipe. Chấp nhận được cho giai đoạn nội bộ/demo, **không nên deploy public** như hiện tại.
4. **`API_BASE_URL` hardcode `localhost:3000`** trong `dashboard/src/api/client.ts` — bản build production hiện tại không gọi được backend thật trừ khi sửa thành biến môi trường.
5. `generated column` `progress_pct` trong `class_daily_snapshots` chia cứng cho 28, không đọc `classes.total_sessions` — sai nếu có lớp tổng buổi khác 28.
6. Endpoint `GET /api/students/:id/timeline` thiếu RBAC — GV có thể xem timeline HV lớp khác nếu đoán được `student_id`.
7. **Namespace API không nhất quán.** Module `dashboards` (§3) mount ở `api/v1/*`, mọi module khác mount ở `api/*` không version — không có lý do kỹ thuật rõ ràng trong code, dễ gây nhầm lẫn khi thêm client hoặc route mới.

Kế hoạch mục tiêu đầy đủ (5 giai đoạn: đo hiệu năng n8n hiện tại → build SQL + backfill → shadow-write → cutover đọc → cutover ghi review → Sheets thành pure export) nằm ở `docs/research/2026-08-04-oracle-sheets-sql-decision.md` — đây là bản tư vấn kiến trúc (Oracle/ChatGPT) đã chốt Postgres làm nguồn sự thật, Sheets chỉ còn vai trò admin nhẹ/báo cáo/export, n8n giữ vai trò orchestration (cron, gọi API ingest, outbox gửi email) chứ không giữ business rule. Backend/schema hiện tại là một hiện thực hoá **rút gọn** của phương án đó (không có `enrollments`/`outbox_events`/`rule_sets` như bản đề xuất đầy đủ).

Hai rủi ro hạ tầng từng nằm ở mục này (lỗ hổng trùng dòng live, file migration mồ côi) đã đóng — xem `CHANGELOG.md`.

---

## 7. Triển khai Production (VPS)

VPS `root@160.187.146.127` (thông tin đăng nhập trong memory riêng, không commit vào repo). Ba container theo `docker-compose.prod.yml`: `izone_postgres_prod`, `izone_backend_prod` (build từ `backend/Dockerfile`), `izone_dashboard_prod` (build từ `dashboard/Dockerfile` + `dashboard/nginx.conf`), expose port `3000`/`8088`. Cùng VPS còn chạy các workload khác không liên quan tới dự án này: `n8n` + Caddy (reverse proxy cổng 80/443), `proctoring_backend`/`proctoring-frontend`, `rabbitmq`, `minio_server`.

Database `izone_dashboard`, schema `izone` (không phải `public` — chú ý khi query tay, `psql -c '\dt'` mặc định không thấy gì nếu không set `search_path` hoặc chỉ định schema). Đủ 12 bảng đúng như §1 (`students`, `classes`, `teachers`, `contact_logs`, `class_daily_snapshots`, `student_daily_records`, `pass_reviews`, `system_configs`, `system_logs`, `khoi`, `test_scores`, `label_change_logs`).

⚠️ **Trạng thái dữ liệu (`students`/`contact_logs` rỗng hay không, backend có route riêng qua Caddy hay chưa) cần re-verify qua SSH trước khi tin** — lần xác nhận gần nhất trong doc này đã cũ (xem `CHANGELOG.md` §2026-08-07 cho số liệu tại thời điểm đó và ghi chú về khả năng đã thay đổi sau đó theo memory phiên làm việc). Đừng coi số dòng trong `CHANGELOG.md` là hiện trạng — chạy lại truy vấn nếu cần số thật.

---

## 8. Nguồn tham chiếu

| Tài liệu | Nội dung |
|---|---|
| `backend/prisma/schema.prisma` | Schema Postgres thật, nguồn sự thật hiện tại |
| `database/migrations/001_schema.sql` | DDL đầy đủ + comment ánh xạ từng bảng về sheet gốc |
| `database/DEPLOYMENT.md` | Kế hoạch deploy VPS thật (IP, firewall, backup cron) |
| `docs/research/2026-08-04-oracle-sheets-sql-decision.md` | Tư vấn kiến trúc: vì sao chuyển Sheets → SQL, lộ trình 5 giai đoạn, vai trò còn lại của n8n |
| `report/bao_cao_thiet_ke_fields.md` | Thiết kế field gốc của 9 sheet Google Sheets (2026-07-24) |
| `report/2026-08-05-IZONE-Thiet-Ke-API.md` | Đề xuất API tối thiểu cho việc chuyển mock → Postgres |
| `BenchMark3_4.md`, `Meeting Brief.md` | Quy tắc nghiệp vụ nhãn/pass — khớp với `system_configs`, không có nội dung migration hạ tầng |
| `docs/IZONE-Label-Dashboard-Huong-dan-su-dung.md` | Hướng dẫn sử dụng dashboard (người dùng cuối) |
| `report/2026-08-12-screen-contract-data-flow-design.md` | Thiết kế 2 endpoint screen-contract (`/api/v1/lead-dashboard`, `/api/v1/classes/:classId/teacher-dashboard`) — xem §3 |
| `report/2026-08-12-screen-contract-implementation-plan.md` | Kế hoạch triển khai 8 task cho screen-contract — tham khảo lịch sử, code thật có thể lệch nhẹ so với plan, đối chiếu §3 trước khi tin |
| `report/2026-08-12-lead-dashboard-data-quality-design.md` | Thiết kế Snapshot Quality Resolver, kỳ báo cáo theo tháng, chart tuần — xem §3 |
| `report/2026-08-12-lead-dashboard-data-quality-implementation-plan.md` | Kế hoạch triển khai data-quality resolver (7 task) — cùng lưu ý như trên |
| `docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md` | Chẩn đoán + thiết kế đợt sửa 2026-08-13: hai hạt `snapshot_stage`, ngữ nghĩa `NULL` vs `0%`, trọng số khối theo HV có dữ liệu, độ phủ liên hệ ở backend, lý do bỏ card Net Momentum |
| `CHANGELOG.md` | Nhật ký thay đổi kiến trúc theo thời gian — đọc trước khi hỏi "vì sao lại như vậy" |

**Lưu ý**: ba tài liệu được bản doc trước trích dẫn (`docs/infrastructure/IZONE — Phân nhãn HV.xlsx`, `docs/general information/Meeting Report … 2026-07-21/23.md`, `docs/design_docs/IZONE-DESIGN.md`) **không tồn tại trong lịch sử git của repo này** (`git log --all` cho các path đó không ra kết quả) — có thể từng tồn tại ở một checkout khác, hoặc bị xoá trước khi merge vào đây. Đừng đi tìm chúng; nội dung tương đương gần nhất hiện nằm ở `report/bao_cao_thiet_ke_fields.md` và `report/IZONE-DESIGN.md`.

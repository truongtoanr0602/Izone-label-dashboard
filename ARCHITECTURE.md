# ARCHITECTURE.md

Hạ tầng dữ liệu của hệ thống **Dán nhãn / Phân loại HV / Auto Pass-Fail** của IZONE, và cách dashboard này tiêu thụ nó.

> **Cập nhật 2026-08-05**: repo vừa nhận một merge lớn (`650657f "Merge into Monorepo: Add Backend, Database, and migrate Frontend"`, +396 file, +91k dòng) biến dashboard từ **frontend-only prototype đọc mock data** thành **monorepo 3 phần**: `backend/` (NestJS + Prisma + Postgres, có thật, đang chạy), `dashboard/` (React, giờ gọi API thật thay vì đọc `mockData.ts`), và các thư mục dữ liệu/kế hoạch (`database/`, `google_sheets/`, `report/`, `docs/`). Bản doc này viết lại toàn bộ theo hiện trạng mới. Sheet Google Sheets 9-sheet ở dưới **không còn là nguồn dữ liệu sống** — nó vẫn tồn tại như tài liệu thiết kế gốc và là format của một script sinh CSV mock (`google_sheets/`), nhưng schema thật bây giờ là Postgres, mô tả ở §2.
>
> **Cập nhật 2026-08-07**: đã lên production thật trên VPS (`root@160.187.146.127`) — commit `cf92d64 "chore: add Docker production configuration"` thêm `docker-compose.prod.yml` + `backend/Dockerfile` + `dashboard/Dockerfile` + `dashboard/nginx.conf`. Ba container `izone_postgres_prod`/`izone_backend_prod`/`izone_dashboard_prod` đang chạy thật trên VPS đó, cùng host với các workload không liên quan khác (`n8n`, `proctoring_backend`, `rabbitmq`, `minio_server`). Schema `izone` đã có đủ 12 bảng và migration đã chạy, nhưng **seed dữ liệu chưa đầy đủ**: `classes` (265 dòng) và `teachers` (237 dòng) đã có, còn `students` và `contact_logs` là **0 dòng** — chi tiết ở §7. Đây hiện là điểm chặn nghiêm trọng hơn cả pipeline dữ liệu thiếu (§6 mục 1): hạ tầng đã triển khai xong nhưng dashboard prod hiện không có học viên nào để hiển thị.
>
> **Cập nhật 2026-08-12**: một chuỗi 11 commit trong ngày (`d239004` → `404a8e9`) thêm hẳn một module backend mới `backend/src/dashboards/` (route namespace riêng `api/v1/*`) triển khai kiến trúc "screen-contract": hai endpoint `GET /api/v1/lead-dashboard` và `GET /api/v1/classes/:classId/teacher-dashboard` trả về KPI/nhãn/gợi ý hành động **đã tính sẵn ở backend** (React không còn tự tính), kèm một "snapshot quality resolver" xử lý snapshot thiếu/tương lai/độ phủ dữ liệu thấp — chi tiết ở §3. Đây là thay đổi kiến trúc lớn nhất kể từ merge monorepo; thiết kế gốc nằm ở `report/2026-08-12-screen-contract-data-flow-design.md` và `report/2026-08-12-lead-dashboard-data-quality-design.md` (liệt kê đầy đủ ở §8). Cùng ngày, hai file migration `database/migrations/006_historical_test_snapshots.sql` và `007_stage_based_test_snapshots.sql` xuất hiện trong working tree nhưng **chưa commit** (`git status` báo `??`) tính đến thời điểm viết — 006 đã áp dụng thật lên Postgres prod (xem `docs/infrastructure/database-architecture.md`), còn 007 (thêm `snapshot_stage`, `test_7`, `test_8`, hàm `izone.refresh_student_stage_snapshot`) **không có code nào tham chiếu tới**, kể cả module `dashboards` mới — coi đây là nháp chưa dùng, đừng giả định các cột đó tồn tại trong DB thật.
>
> **Cập nhật 2026-08-13 — nhận định "007 là nháp mồ côi" ở trên đã lỗi thời, giờ SAI.** Nhánh `fix/lead-dashboard-data-fidelity` (chẩn đoán + thiết kế đầy đủ ở `docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md`) commit chính thức `006`/`007` (đã chạy trên prod) và thêm `008_restore_live_record_uniqueness.sql` (**đã commit git VÀ đã chạy trên prod ngày 2026-08-13** — lỗ hổng "dòng live có thể trùng lặp âm thầm" nay đã đóng, xem cuối §1); `snapshot_stage` giờ là cột trung tâm của các query aggregate trong `dashboards.service.ts` — xem mục "Hai hạt trộn trong `student_daily_records`" ở cuối §1. Lý do: `student_daily_records` sau migration 007 chứa hai loại dòng khác hạt nhau trong cùng một bảng, và 3/7 query của `getLeadDashboard` (viết trước khi 007 được nhận diện) từng đếm lẫn cả hai — hệ quả là mẫu số mọi KPI Lead Dashboard bị phình gần gấp 3, một ngưỡng độ phủ dữ liệu bù sai (đã xoá, xem §3) khiến 8/17 lớp biến mất khỏi biểu đồ tuần, và trung bình khối bị méo vì cân theo sĩ số lớp thay vì số HV thực sự có số (đã sửa, cân theo `sampleSize`, xem §3). Đồng thời: card "Net Momentum" bị bỏ khỏi UI (trường `netMomentum` vẫn còn trong API contract nhưng nay luôn `null` trên dữ liệu thật — xem §3), và độ phủ liên hệ (`contactCoverage`) được tính thật ở backend lần đầu tiên.

---

## 0. Bố cục monorepo

```
Izone-label-dashboard/
├── dashboard/     React + Vite + Tailwind v4 — app cũ, chuyển từ root vào đây nguyên trạng
├── backend/       NestJS 11 + Prisma 7 + Postgres — API thật, mới hoàn toàn
├── database/      docker-compose Postgres, SQL migrations, script sinh dữ liệu mẫu
├── google_sheets/ Script Python sinh CSV mock (KHÔNG phải pipeline đồng bộ, xem §8)
├── report/        Doc thiết kế/họp tiếng Việt — nguồn tham khảo, không phải mã nguồn
├── docs/          Hướng dẫn sử dụng + 1 bản ghi tư vấn kiến trúc (Oracle, xem §8)
└── package.json   Chỉ còn devDependency `gh-pages` — không phải workspace root
```

**Đây không phải một monorepo có tooling** (không `workspaces`, không Turborepo/Lerna/pnpm). `backend/` và `dashboard/` là hai dự án npm độc lập, mỗi thư mục có `package.json`/`node_modules` riêng, chỉ nằm cạnh nhau trong cùng git repo. Chạy lệnh gì thì phải `cd` đúng thư mục trước — xem CLAUDE.md.

Ba doc kiến trúc/hướng dẫn ở root (`ARCHITECTURE.md`, `CLAUDE.md`) **không còn nằm trong `.gitignore`** sau merge này (file `.gitignore` bị ghi đè bởi bản từ nhánh merge, không có hai dòng loại trừ đó nữa) — chúng chỉ đơn thuần *untracked*. Cẩn thận khi `git add -A`/`git add .`: hai file này giờ có thể bị add nhầm vào commit.
>
> ⚠️ **Lỗi thời — sửa 2026-08-13.** Nhận định trên KHÔNG còn đúng. Commit `7bb5fe5 "chore: add dev scripts, api proxy, and drop stale docx lockfiles"` (nhánh `fix/lead-dashboard-data-fidelity`, dự định chỉ dọn `~$*.docx` và viết lại `.gitignore` bị hỏng encoding) vô tình đưa `ARCHITECTURE.md`/`CLAUDE.md` (kèm cả `docs/`, `scripts/`) trở lại `.gitignore` — `git check-ignore -v ARCHITECTURE.md CLAUDE.md` xác nhận cả hai đang bị bỏ qua. Hai file này **chưa từng có commit nào trong lịch sử git** của repo (`git log --all -- ARCHITECTURE.md`/`CLAUDE.md` đều rỗng) cho tới đợt sửa tài liệu 2026-08-13, lúc đó phải `git add -f` để vượt qua `.gitignore`. Nếu dọn `.gitignore` sau này, nhớ bỏ hai dòng `ARCHITECTURE.md`/`CLAUDE.md` — đây là 2 doc sống, không phải file tạm.

### Hiện trạng vs kiến trúc mục tiêu

| | **Trước đây (đã lỗi thời)** | **Hiện tại (đã verify trong code)** | **Mục tiêu (theo `docs/research/2026-08-04-oracle-sheets-sql-decision.md`)** |
|---|---|---|---|
| Nguồn sự thật | Google Sheets (9 sheet) | Postgres (`backend/`, schema `izone`) | Postgres — đã đúng hướng |
| Ghi dữ liệu vào DB | n8n cào portal, ghi Sheets hàng ngày | **Không có** — toàn bộ dữ liệu trong Postgres là **sinh giả lập** bởi 1 script Python, chạy một lần lúc seed | n8n cào portal → gọi API ingest của backend → backend ghi Postgres |
| Đồng bộ Sheets | — | — | Sheets chỉ còn vai trò *xuất báo cáo* (đọc từ Postgres), không phải nguồn ghi |
| Frontend đọc gì | `src/data/mockData.ts` (frozen, tay viết) | `dashboard/src/api/client.ts` gọi REST API thật | Giữ nguyên, API trả đủ trường thay vì frontend tự bịa (xem §5) |
| Đăng nhập | Không có | JWT thật, email + SĐT làm mật khẩu | Cần thêm hash mật khẩu, đổi cơ chế xác thực (xem §6) |

**Điều quan trọng nhất cần hiểu**: hạ tầng ghi dữ liệu (n8n cào portal → Sheets/Postgres) **chưa tồn tại ở bất kỳ đâu trong repo**. Backend, schema, và frontend đều đã sẵn sàng *đọc* dữ liệu thật, nhưng hiện tại toàn bộ dữ liệu trong Postgres là mock được sinh một lần bởi `database/generate_snapshots.py`. Đừng nhầm "có schema Postgres" với "có pipeline dữ liệu sống" — hai thứ đó độc lập, và chỉ cái đầu đã xong.

---

## 1. Cơ sở dữ liệu Postgres (`backend/prisma/schema.prisma`, schema `izone`)

> **Sơ đồ quan hệ đầy đủ (ER diagram) + mô tả chi tiết từng bảng**: xem [`docs/infrastructure/database-architecture.md`](docs/infrastructure/database-architecture.md) — sinh trực tiếp từ introspect Postgres production (`\d+`, `information_schema`), không phải từ Prisma schema, nên phản ánh đúng DB thật kể cả khi lệch với `schema.prisma`. Phần dưới đây giữ nguyên vai trò ánh xạ sang 9 sheet Google Sheets cũ; không lặp lại chi tiết cột/constraint đã có ở file kia.

Provisioning: `database/docker-compose.yml` (Postgres 16-alpine + pgAdmin, port 5432/5050), tự chạy `database/migrations/*.sql` theo thứ tự khi container khởi tạo lần đầu. **Không dùng Prisma Migrate** — migration là SQL tay viết, Prisma schema được `db pull` từ Postgres (giải thích các comment "requires additional setup for migrations" rải khắp `schema.prisma`).

⚠️ Vài chuỗi mặc định tiếng Việt trong `schema.prisma` bị hỏng encoding khi introspect (`'Bình thường'` hiện ra `'B?nh th??ng'`, `'Chờ GV'` → `'Ch? GV'`, `'Chưa đạt'` → `'Ch?a ??t'`). Chưa xác nhận dữ liệu thật trong Postgres có bị hỏng theo hay chỉ là lỗi hiển thị lúc `prisma db pull` — kiểm tra trực tiếp trong DB trước khi tin vào các giá trị này.

### Ánh xạ 9 sheet cũ → 10 bảng Postgres

| Bảng Postgres | Sheet cũ tương ứng | Vai trò |
|---|---|---|
| `teachers` | `08_GiaoVien` | Master GV: `teacher_id`, `teacher_name`, `teacher_email` (unique), `teacher_phone`, `khoi_id` (mặc định 34), `role` (`teacher`/`lead`/`admin`) |
| `classes` | `01_DanhSach_Lop` (phần tĩnh) | Master lớp: `class_id`, `class_name` (unique), `course_id`, `teacher_id` (FK), `lead_email`, `status`, `schedule`, `location`, `opening_date`, `total_sessions` (mặc định 28), `portal_url` |
| `class_daily_snapshots` | `01_DanhSach_Lop` (phần biến động) + `09_Weekly_Snapshot` | **Time-series theo lớp/ngày**, không UPDATE — mỗi lần cào tạo 1 dòng mới. Có `progress_pct` là **generated column** (`completed_sessions*100/28` — chia cứng 28, không đọc `classes.total_sessions`, xem bẫy ở §4). Gộp luôn vai trò của `09_Weekly_Snapshot` — không còn bảng snapshot theo tuần riêng, có 2 view SQL tổng hợp thay thế (`v_weekly_trend`, `v_monthly_trend`) |
| `students` | `02_DuLieu_HocVien` (phần tĩnh/định danh) | Master HV: `student_id`, `student_code`, `full_name`, `phone`, `email`, `class_id` (FK), `registration_status`, `admitted_at`, `target_output_status` |
| `student_daily_records` | `02_DuLieu_HocVien` (phần biến động mỗi ngày) | **Time-series theo HV/ngày** — cho dòng **live** (`snapshot_stage IS NULL`). Chứa toàn bộ: điểm danh, BTVN, `test_1..test_8`, nhãn (`current_label`/`previous_label`/`benchmark_label`/`has_label_changed`/`label_change_direction`/`last_checkpoint`), pass chuẩn/mềm, các cờ (`flag_attendance_drop`, `flag_homework_drop`, `flag_cheating`, `flag_needs_review`), nhận xét GV. Từ migration 007, bảng này còn chứa một hạt thứ hai (`snapshot_stage = 1..8`, backfill theo mốc test) — bảng KHÔNG còn là "1 dòng/HV/ngày" đơn thuần, xem mục riêng cuối phần này. Constraint trên prod hiện tại: `uq_student_stage (student_id, class_id, snapshot_stage)` cho dòng stage, **và** partial unique index `uq_student_record_live (student_id, class_id, record_date) WHERE snapshot_stage IS NULL` cho dòng live (migration 008, chạy lên prod 2026-08-13). Cả hai hạt đều có ràng buộc bảo vệ — xem mục "Hai hạt trộn" bên dưới |
| `test_scores` | `03_DiemTest_ChiTiet` | 1 dòng = 1 lượt thi. `raw_score`, `makeup_score`, `final_score`, `is_cheating`, `label_at_time`. Unique `(student_id, class_id, test_order, is_makeup)` |
| `label_change_logs` | `04_NhatKy_ChuyenNhan` | Append-only. Thêm `severity` (`recovery`/`warning`/`serious`/`critical`) và `step_count` so với sheet cũ — **cải tiến thật**, sheet cũ không phân biệt được 1 HV rớt 1 bậc với 1 HV rớt 2 bậc |
| `pass_reviews` | `05_XetDuyet_PassMem` | Vòng đời `review_status` (`Chờ GV` → `GV Đồng ý`/`GV Từ chối`/quá hạn), y hệt thiết kế cũ |
| `system_configs` | `06_CauHinh_HeThong` | Key-value threshold, **vẫn là nguồn duy nhất của mọi ngưỡng** — xem §3 |
| `system_logs` | `07_Log_HeThong` | Log workflow. Comment trong `001_schema.sql:336` vẫn ghi *"Log hoạt động hệ thống n8n"* — bảng tồn tại nhưng **không ai ghi vào nó**, vì không có n8n nào chạy (xem §0) |
| `contact_logs` | *(mới, không có trong 9 sheet gốc)* | Nhật ký liên hệ Zalo — xem §6. Đã triển khai thật, không còn là đề xuất |

Việc tách **định danh tĩnh** (`classes`, `students`) khỏi **snapshot hàng ngày** (`class_daily_snapshots`, `student_daily_records`) là khác biệt kiến trúc lớn nhất so với sheet cũ (sheet cũ ghi đè state mới nhất, không giữ lịch sử theo ngày). Bốn view SQL (`v_class_latest`, `v_student_latest`, `v_weekly_trend`, `v_monthly_trend`, định nghĩa cuối `001_schema.sql`) dùng `DISTINCT ON (...) ORDER BY date DESC` để dựng lại "trạng thái hiện tại" — đây chính là cơ chế cho các API `GET /classes`, `GET /students/by-class/:id` (xem §4). Các view này KHÔNG lọc `snapshot_stage` — chưa cần, vì `dashboards` là module duy nhất hiện đọc trực tiếp `student_daily_records` thay vì qua view (xem §3).

### Hai hạt trộn trong `student_daily_records` (migration 007, 2026-08-13)

`007_stage_based_test_snapshots.sql` thêm cột `snapshot_stage` và biến bảng này thành **hai bảng logic dùng chung một bảng vật lý**:

| | `snapshot_stage IS NULL` | `snapshot_stage = 1..8` |
|---|---|---|
| Hạt | 1 dòng / HV / lớp / **ngày** (quan sát thật, cào hàng ngày) | 1 dòng / HV / lớp / **mốc test** (backfill dựng lại lịch sử theo mốc test) |
| Trục thời gian | `record_date` = ngày quan sát thật | `record_date` **vô nghĩa** — luôn là ngày chạy backfill, không phải ngày của mốc test đó |
| Cột có nghĩa | Đầy đủ: điểm danh, BTVN, pass chuẩn/mềm, nhãn | Chỉ `tests_taken`, `test_average`, `current_label`; điểm danh/BTVN/pass **luôn NULL** |
| Constraint bảo vệ 1-dòng-mỗi-hạt | ❌ **CHƯA CÓ trên prod** — xem cảnh báo dưới bảng | ✅ `uq_student_stage (student_id, class_id, snapshot_stage)` |

Migration 007 tự nó đổi `uq_student_record` cũ (unique trên `(student_id, record_date)`, không phân biệt `class_id`) thành `uq_student_stage (student_id, class_id, snapshot_stage)` — và vì Postgres coi mỗi `NULL` là một giá trị **khác nhau**, constraint mới đó **không chặn được gì** ở các dòng live (`snapshot_stage IS NULL` luôn "khác" mọi `NULL` khác). Migration 008 (`008_restore_live_record_uniqueness.sql`, đã commit git) viết đúng bản vá cho lỗ hổng này — partial unique index `uq_student_record_live (student_id, class_id, record_date) WHERE snapshot_stage IS NULL`.

✅ **Lỗ hổng này ĐÃ ĐÓNG — migration 008 chạy lên prod ngày 2026-08-13.** Dispatch của Task 1 cố tình hoãn việc áp dụng ("Applying it is a deployment step outside this task"), nên nó được chạy riêng như một bước deploy sau khi toàn bộ nhánh hoàn tất. Xác minh sau khi chạy, trực tiếp trên `izone_dashboard` prod:

- Index tồn tại: `CREATE UNIQUE INDEX uq_student_record_live ON izone.student_daily_records USING btree (student_id, class_id, record_date) WHERE (snapshot_stage IS NULL)`, `indisunique = true`, `indisvalid = true`, `indpred` khác NULL (đúng là partial), 960 kB.
- Số dòng trước và sau khi chạy đều là 40.895 — migration chỉ tạo index, không đụng dữ liệu.
- **Kiểm chứng nó thực sự chặn**, không chỉ tồn tại: chèn một dòng live trùng `(student_id, class_id, record_date)` trong transaction → bị từ chối với `code=23505 constraint=uq_student_record_live`; chèn một dòng live hợp lệ ở ngày khác → cho qua. Cả hai đều `ROLLBACK`, prod không đổi.

Nếu phục hồi database từ backup cũ hoặc dựng container mới, hãy kiểm tra lại index này có mặt trước khi tin rằng ràng buộc còn hiệu lực — không có bảng theo dõi migration nào trong DB, nên dấu vết schema là bằng chứng duy nhất.

**Mọi query aggregate của Lead Dashboard phải thêm `AND r.snapshot_stage IS NULL`.** `getLeadDashboard` (`dashboards.service.ts`) có 7 lệnh `$queryRaw`; chỉ **3 trong số đó** thật sự đọc `student_daily_records` và cần cả hai điều kiện — `studentMetricRows`, `transitionRows`, `coverageStudentRows`. Bốn lệnh còn lại (`classRows`, `snapshotRows`, `configRows`, `contactLogRows`) **đúng khi KHÔNG có** hai điều kiện này: `classRows`/`snapshotRows` đọc `classes`/`class_daily_snapshots` — hai bảng không có cột `snapshot_stage` lẫn `registration_status` theo từng HV; `configRows` đọc `system_configs`; `contactLogRows` đọc `contact_logs` join thẳng `classes`/`teachers`, không qua `student_daily_records`. Đừng "tiện tay" thêm điều kiện vào 4 query này. Comment giải thích đầy đủ lý do hai điều kiện bắt buộc chỉ nằm ở **một chỗ duy nhất** — ngay trên `GROUP BY` của `studentMetricRows`; `transitionRows` và `coverageStudentRows` lặp lại đúng hai điều kiện đó nhưng không lặp lại comment, nên đọc comment ở `studentMetricRows` trước nếu thấy điều kiện ở hai query kia có vẻ vô căn cứ. Ba query này thiếu điều kiện đó khi module `dashboards` mới được viết ở 2026-08-12 — vì 007 lúc đó còn là migration untracked, chưa ai biết bảng đã đổi hạt. Hệ quả đo được trên dữ liệu thật (Khối 3-4, 17 lớp `on_going`, ngày 2026-08-12): đếm cả hai loại dòng ra 770 dòng thay vì 244 dòng live thật — mọi mẫu số KPI phình gần gấp 3, một ngưỡng độ phủ dữ liệu bù cho méo mó này (`DEFAULT_MINIMUM_COVERAGE = 80`, đã xoá — xem §3) trượt sai ở 15/17 lớp và đẩy dữ liệu hiển thị lùi về tận `2026-07-06` ở một số lớp. Bản sửa (nhánh `fix/lead-dashboard-data-fidelity`) thêm điều kiện `snapshot_stage IS NULL` vào cả 3 query đó.

**`NULL` khác `0%` — bất biến đã kiểm chứng trên prod, không có ngoại lệ.** `attendance_pct`/`homework_pct` là `NULL` khi HV **chưa có buổi học nào** kể từ lúc ghi danh; `0%` là số thật (đã có buổi, vắng hết). Verify trực tiếp trên Postgres **ngày 2026-08-13**, toàn bộ `izone.student_daily_records` (40.895 dòng, cả live lẫn stage): `attendance_pct IS NULL` ⟺ `attendance_total = 0` đúng ở toàn bộ 18.747/18.747 dòng; `attendance_pct = 0` ⟺ `attendance_total > 0` đúng ở toàn bộ 3.065/3.065 dòng; `attendance_pct > 0` ⟺ `attendance_total > 0` đúng ở toàn bộ 19.083/19.083 dòng còn lại — không một ngoại lệ nào, ba nhóm cộng lại khớp đúng tổng 40.895. **Con số này sẽ tiếp tục tăng theo mỗi lần scrape** — đừng coi 40.895/18.747/3.065/19.083 là hằng số, chỉ coi bất biến "`NULL` ⟺ chưa có buổi, `0%` ⟺ có buổi nhưng vắng hết" là thứ ổn định lâu dài; nếu cần số hiện tại, chạy lại truy vấn thay vì tin số ở đây. Hệ quả thiết kế: mọi phép tính trung bình phải loại `NULL` khỏi cả tử số lẫn mẫu số, nhưng **giữ nguyên `0%`** trong cả hai — gộp `0%` vào cùng nhóm với `NULL` sẽ xoá mất đúng tín hiệu cần cảnh báo nhất ("HV có buổi nhưng vắng hết"), biến nó thành "chưa có dữ liệu".

Các dòng `snapshot_stage = 1..8` không bị đổi hay xoá gì trong đợt sửa 2026-08-13 — chúng chỉ bị loại khỏi các query aggregate của Lead. Việc dùng chúng để dựng biểu đồ "tiến triển theo mốc test" là tính năng riêng, ngoài phạm vi nhánh này.

---

## 2. Quy tắc nghiệp vụ (không đổi, chỉ đổi nguồn — vẫn đã verify trên dữ liệu cũ)

Toàn bộ ngưỡng đọc từ `system_configs` (trước là sheet `06_CauHinh_HeThong`), seed tại `database/migrations/002_seed_data.sql:53-75`, **cùng giá trị hệt sheet cũ**. Comment trong `dashboard/src/data/selectors/studentFilters.ts` trỏ thẳng vào mục này bằng số thứ tự (`ARCHITECTURE §4` trong code — số cũ trước khi viết lại doc này; nếu đổi số mục ở đây thì phải sửa comment trong code tương ứng).

### Gán nhãn theo `test_average`

| Nhãn | Điều kiện | Config key |
|---|---|---|
| **Xám** | `< 45` | `nguong_xam_max = 45` |
| **Đỏ** | `45 ≤ x < 60` | `nguong_do_min/max = 45/60` |
| **Vàng** | `≥ 60` | `nguong_vang_min = 60` |
| **Chưa có DL** | chưa có điểm test nào | — |

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

⚠️ **Ngưỡng nhắc thật trong frontend là 90, không phải 80** — `PASS_THRESHOLD_PCT` trong `dashboard/src/data/selectors/studentFilters.ts` cố tình lệch khỏi `alert_dh_tut_pct` để khớp ngưỡng pass thật. Chi tiết lý do (khe 80–90 khiến 27 HV nhãn Đỏ không nhận lời nhắc) xem §6 — nội dung này không đổi so với bản doc trước, code vẫn y hệt.

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
| `snapshots` | `GET /api/snapshots?khoiId=` | Có rule nghiệp vụ trong service: nếu `active_students === 0` thì trả `null` cho các tỷ lệ trung bình thay vì `0` (tránh hiểu nhầm lớp rỗng đạt 0%) |
| `contact-logs` | `GET /api/contact-logs?classId=&khoiId=` | |
| `contact-logs` | `POST /api/contact-logs` | Bắt lỗi unique-violation (Prisma `P2002`) → 409 |
| `contact-logs` | `POST /api/contact-logs/undo` | GV chỉ được undo log do chính mình tạo (`teacher_id` không khớp → 409) |
| `dashboards` | `GET /api/v1/lead-dashboard` | **Mới (2026-08-12).** Namespace `/api/v1/*` — khác mọi endpoint khác ở trên (`/api/...`, không version). Query `period=YYYY-MM` (khuyến nghị) hoặc `from`/`to` (tối đa 90 ngày) — hai kiểu loại trừ lẫn nhau. Chỉ chấp nhận `courseId=2` (400 nếu khác); `role=teacher` bị chặn 403; `role=lead` bị ép `khoiId` theo JWT bất kể query param. Trả KPI/xu hướng tuần/nhãn đã tính sẵn — xem "Dashboards module" dưới đây |
| `dashboards` | `GET /api/v1/classes/:classId/teacher-dashboard` | **Mới (2026-08-12).** `role=teacher` chỉ xem lớp trong `classIds` của JWT (403 nếu không), `role=lead` giới hạn theo `khoi_id`, `admin` không giới hạn. Trả roster đầy đủ (kể cả HV chưa có `student_daily_records`) + nhãn/mức can thiệp đã phân loại sẵn qua `classifyStudent` (`labeling-engine.ts`) |

### Dashboards module (screen-contract, mới 2026-08-12)

`backend/src/dashboards/` (`dashboards.service.ts`, ~1224 dòng) hiện thực hoá kiến trúc "screen-contract": backend tính sẵn toàn bộ KPI/nhãn/gợi ý hành động, React chỉ hiển thị. Thiết kế đầy đủ ở `report/2026-08-12-screen-contract-data-flow-design.md` và `report/2026-08-12-lead-dashboard-data-quality-design.md` (§8). Vài điểm quan trọng khi đọc code:

- **Truy vấn thẳng bảng gốc, không qua view.** Khác với module `classes`/`snapshots` (dùng `v_class_latest`/`v_weekly_trend`/`v_monthly_trend`, xem `docs/infrastructure/database-architecture.md` §5), cả 2 endpoint ở đây query raw SQL có tham số hoá (`$queryRaw`) thẳng vào `class_daily_snapshots`/`student_daily_records`/`test_scores`/`pass_reviews` — vì các view chỉ làm `DISTINCT ON (...) ORDER BY date DESC` đơn giản, không có logic "độ phủ dữ liệu" mà module này cần. Migration `009_dashboard_screen_contract_indexes.sql` (đã commit) thêm 3 index phục vụ đúng pattern query này.
- **Snapshot Quality Resolver** (`snapshot-quality.ts`, hàm `resolveClassObservation`): loại bỏ dòng có ngày tương lai; chọn roster từ snapshot mới nhất ≤ `asOf`; `progress` lấy `completedSessions` **lớn nhất từng quan sát được** (không phải dòng mới nhất) để một snapshot lỗi/rỗng không kéo tiến độ lớp tụt về 0; `attendance`/`homework` nhận dòng mới nhất **có mẫu** (`sampleSize > 0` và giá trị khác `null`), nếu dòng mới nhất không có mẫu thì lùi về dòng cũ hơn gần nhất có (`fallbackUsed: true`); tỷ lệ pass chia cho `testedStudents` (số HV đã thi), không phải tổng sĩ số, `0%` vẫn hợp lệ nếu có mẫu.
  ⚠️ **Cập nhật 2026-08-13 — không còn ngưỡng độ phủ tối thiểu.** Bản trước của mục này ghi "chỉ nhận dòng có độ phủ dữ liệu ≥ 80%, lớp không đạt bị loại khỏi mẫu số KPI" — điều đó **không còn đúng**. `DEFAULT_MINIMUM_COVERAGE = 80` đã bị xoá hẳn khỏi `snapshot-quality.ts`: nó chỉ tồn tại để bù cho việc trung bình khối cân theo sĩ số roster thay vì số HV thực sự có số, và sai lệch đó biến mất khi `weightedResolved` (`lead-aggregation.ts`) đổi sang cân theo `sampleSize`. Giữ ngưỡng đó sau khi đã sửa trọng số sẽ chỉ còn tác dụng giấu lớp — 8/17 lớp từng biến mất khỏi biểu đồ tuần vì lý do này. `coveragePct` vẫn được tính (`sampleSize/recordCount`) nhưng giờ **chỉ để hiển thị** (tooltip biểu đồ, note của card: `228/264 HV`), Lead tự đánh giá độ tin cậy thay vì bị hệ thống âm thầm loại lớp. Một hằng số khác cùng tên khái niệm — `LOW_COVERAGE_WARNING_PCT = 80` — vẫn còn, nhưng chỉ gắn cảnh báo `LOW_ATTENDANCE_COVERAGE`/`LOW_HOMEWORK_COVERAGE` lên `dataQuality.warnings[]`, không loại gì khỏi mẫu số nữa. Lớp giờ chỉ bị đánh `dataQuality.status: 'insufficient'` khi `attendance`/`homework` hoàn toàn không có dòng nào có mẫu (không phải khi mẫu mỏng) — status còn lại (`complete`/`fallback`) + `warnings[]` (`PARTIAL_SNAPSHOT`, `LOW_ATTENDANCE_COVERAGE`, `LOW_HOMEWORK_COVERAGE`, `NO_TEST_SAMPLE`, `PROGRESS_HISTORY_INCOMPLETE`, `FUTURE_ROWS_EXCLUDED`) trả thẳng ra API.
- **Bug đã sửa** (`a5be7b8 "fix: compare label momentum on matching classes"`): trước đó `netMomentum` kỳ này so với kỳ trước được tính trên *toàn bộ* lớp có chuyển nhãn ở mỗi kỳ riêng lẻ — nếu lớp A chỉ có chuyển nhãn tháng này còn lớp B chỉ có ở tháng trước, delta vẫn so sánh momentum A với momentum B, khập khiễng. Bản sửa tính `momentumDelta`/`comparableClasses` chỉ trên **giao của** hai tập lớp có chuyển nhãn ở cả hai kỳ (`dashboards.service.ts:211-233`); `kpis.netMomentum.value` vẫn phản ánh toàn bộ lớp, chỉ `delta`/`comparableClasses` dùng tập giao.
- **`netMomentum` giờ luôn `null` trên dữ liệu thật (2026-08-13).** Bộ lọc `snapshot_stage IS NULL` bắt buộc thêm vào (xem §1) áp cho cả query lấy `has_label_changed`/`label_change_direction` để tính chuyển nhãn — và đã kiểm chứng trên prod: **100% các dòng có `has_label_changed = TRUE` và hướng chuyển hợp lệ (517/517 dòng) nằm ở `snapshot_stage IS NOT NULL`, không có dòng live nào**. Vì vậy `calculateNetMomentum` (`lead-aggregation.ts`) luôn nhận mảng rỗng và trả `value: null` — **không phải `0`**: hàm này cố tình phân biệt "không quan sát được chuyển nhãn nào" (`null`) khỏi "có chuyển nhãn nhưng cân bằng lên/xuống" (`0`). Card "Net Momentum" đã bị bỏ khỏi `KpiRow.tsx` vì lý do này (24 lượt chuyển nhãn trong cả kỳ, dồn hết vào một ngày, không có gì để Lead hành động) — trường `kpis.netMomentum` vẫn còn nguyên trong API contract, không phá schema, chỉ không còn UI nào đọc. Đừng "sửa" bằng cách bỏ điều kiện `snapshot_stage IS NULL` ở query chuyển nhãn để trường này khác `null` — làm vậy sẽ đếm lại đúng lỗi phình mẫu số đã sửa ở §1.
- **Nhãn học thuật chỉ theo Test; ĐH/BTVN chỉ điều khiển can thiệp (2026-08-13).** `classifyStudent` gán `no_data` khi chưa có Test confirmed, `grey` khi `<45`, `red` khi `45..<60`, và `yellow` khi `>=60`; không còn tạo nhãn `green`. Thiếu hoặc kém ĐH/BTVN không được xóa hay đổi nhãn Test. Chúng chỉ tạo issue, cảnh báo chất lượng dữ liệu và — khi có tỷ lệ thật dưới ngưỡng — `interventionLevel: level_1`; mức Test yếu vẫn ưu tiên `level_2`/`level_3`.
- **Chỉ số ĐH/BTVN của từng học viên lấy số đếm lũy kế cùng ngày chốt làm nguồn chuẩn (2026-08-13).** Hai workflow draft inactive `AbBatX2eptllUAET` (live sync) và `SLZH4ZwyQsx8b4CS` (historical backfill) cùng đếm các session completed tới một cutoff, loại trạng thái `NULL` khỏi mẫu số, và upsert bằng khóa live `(student_id, class_id, record_date) WHERE snapshot_stage IS NULL`. Teacher dashboard và phép phân loại phục vụ `contactCoverage` đều tính lại tỷ lệ từ `attendance_present / attendance_total` và `homework_done / homework_total`; không còn tin trực tiếp `*_pct` nếu hai nguồn lệch nhau. Mẫu số bằng 0 hoặc bộ đếm vô lý (âm, tử lớn hơn mẫu) trả `null` thay vì dựng `0%`; sai lệch/invalid được trả trong `dataQuality.warnings[]`. UI chỉ hiển thị một snapshot chung cho cả hai metric, số đếm và ngày dữ liệu; không fallback riêng BTVN sang ngày cũ và không còn vẽ trend giả từ một snapshot. Backfill chưa được chạy trên production.
- **`contactCoverage` mới (2026-08-13).** `LeadDashboardClass.contactCoverage: { done, total, pct }` tính ở `contact-coverage.ts` (hàm `contactCoverageByClass`), join `contact_logs` với danh sách HV đang có cảnh báo mở tại **checkpoint cấp lớp** (`total`), rồi đếm số cảnh báo đã có bản ghi liên hệ khớp `(student_id, trigger_type, checkpoint)` (`done`); checkpoint là test confirmed có `test_order` lớn nhất trong cả lớp, hoặc `Chưa có test` nếu lớp chưa có test. Danh sách coverage còn bắt buộc `students.class_id = student_daily_records.class_id`, nếu không record lịch sử của HV đã chuyển lớp vẫn bị Lead tính dù không còn nằm trong roster Teacher. Vì vậy một test mới của bất kỳ HV nào sẽ mở episode mới nhất quán ở cả Teacher và Lead; tick hết ở Teacher sẽ phản ánh đúng lên Lead. `pct` là `null` khi `total = 0` (lớp không có cảnh báo nào — khác hẳn 0%, đừng gộp hai trường hợp). Hàm này **cố tình không nhân bản** luật "đóng hộ đa luồng" (`COVERED_BY`) mà frontend áp dụng ở `dashboard/src/data/selectors/contactLog.ts`, vì `classifyStudent` (`labeling-engine.ts`) đã xếp mỗi HV vào đúng một `interventionLevel` nên mỗi HV chỉ mở tối đa một episode ở tầng backend — điều kiện bắt buộc phải port luật đó sang, và hệ quả nếu quên, nằm ở comment đầu `contact-coverage.ts` và ở CLAUDE.md §"Business rules that are duplicated".
- **Code chết trong cùng module — đừng nhầm là đang chạy:** `lead-aggregation.ts` export `aggregateSnapshots`/`calculateAttrition`/`buildTrend` nhưng không nơi nào trong `dashboards.service.ts` gọi tới (sót lại từ thiết kế daily-trend trước khi chuyển sang weekly) — chỉ `parseReportPeriod`/`calculateNetMomentum`/`compareMonthlyMetrics`/`buildWeeklyTrend` thực sự được dùng. Phía frontend, `dashboard/src/api/dashboardService.ts` có 2 hàm hỏng/mồ côi: `getKhoi34Dashboard()` gọi `GET /snapshots/dashboard` — **endpoint này không tồn tại ở backend** — và `getStudentsByClass()`/`getClassTrend()` trùng tên với hàm tương ứng trong `client.ts` nhưng không có nơi nào trong UI gọi tới bất kỳ hàm nào trong 3 hàm này.
- **`GET /api/classes/:id/trend` vẫn là dead API** (xem dòng ở bảng trên, không đổi) — module `dashboards` mới xây một đường song song, không hồi sinh endpoint cũ. `GET /api/snapshots?khoiId=` giờ cũng nên coi là dead: wrapper phía frontend (`api.getSnapshots`, `dashboardService.getKhoi34Dashboard`) tồn tại nhưng không component nào gọi.
- **Deploy VPS chưa xác nhận cho đợt này:** §7 dưới đây mô tả trạng thái VPS tính đến 2026-08-07, **trước** toàn bộ thay đổi 2026-08-12 này — chưa xác nhận qua SSH liệu `izone_backend_prod`/`izone_dashboard_prod` đã rebuild với code mới hay chưa. Kiểm tra lại trước khi coi §7 là hiện trạng production của module này.

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

Axios client, `API_BASE_URL = 'http://localhost:3000/api'` **hardcode trong source**, không có `import.meta.env.VITE_*` nào — build production hiện tại sẽ gọi `localhost:3000` từ trình duyệt người dùng, tức là **không hoạt động ngoài máy dev** cho tới khi việc này được sửa. Token JWT lưu `localStorage['auth_token']`, gắn vào `Authorization: Bearer` header qua `setAuthHeader()`. Không có router — `App.tsx` gate bằng `currentUser` truthy, y hệt pattern tab-state cũ, chỉ thêm 1 lớp điều kiện.

`mockData.ts` và toàn bộ hạ tầng sinh nó (`contactStore.ts`, `data/generator/*`) đã bị **xoá hẳn**, không giữ làm fallback. App giờ 100% phụ thuộc API sống — không còn chế độ offline/demo.

### ⚠️ Quan trọng nhất: nhiều trường frontend khai báo nhưng backend chưa trả — mapper trong `client.ts` đang set cứng

Các hàm `mapClassSummary`/`mapStudentDetail`/`mapSnapshot` trong `client.ts` nhận response snake_case rồi map sang camelCase cho khớp `dashboard/src/data/types.ts`. Với các trường API chưa trả (hoặc trả nhưng mapper không đọc), giá trị bị **hardcode cứng**, không phải `null`/`undefined` dễ nhận ra:

| Trường | Giá trị hardcode | Hệ quả |
|---|---|---|
| `evaluation.riskScore` | luôn `0` | Bảng HV không còn sort theo rủi ro thật — mọi HV bằng điểm nhau |
| `evaluation.suggestedAction` | luôn `'none'` | Ô "Hành động" trên màn hình GV luôn rỗng |
| `evaluation.isEligibleForReview`, `reviewStatus`, `passMemStatus/Group/Label` | luôn `false`/`''` | Luồng Pass mềm **không hoạt động qua UI hiện tại**, dù `pass_reviews` đã có API |
| `evaluation.passChuanReasons` | luôn `[]` | Cột `pass_chuan_reasons` có thật trong `student_daily_records` nhưng mapper không đọc |
| `testPerformance.isCheatingFlagged` | luôn `false` | Cột `flag_cheating` có thật, bị bỏ qua |
| `attendance.isDroppingRecently`, `homework.isDroppingRecently` | luôn `false` | `isHabitReminderStudent()` (§6, `studentFilters.ts`) có nhánh OR đọc đúng field này — nhánh đó hiện **không bao giờ true** vì input luôn `false` |
| `labeling.hasChangedRecently` | luôn `false` | Badge "vừa đổi nhãn" trên bảng HV không bao giờ hiện |
| `healthMetrics.classRiskLevel` | luôn `'low'`, `healthScore` luôn `100` | |
| `healthMetrics.isAlarmTriggered` | luôn `false` | **Cột thật `class_daily_snapshots.is_alarm_triggered` tồn tại và có giá trị đúng trong DB, nhưng mapper bỏ qua nó và hardcode `false`** — đây là bug rõ ràng nhất trong danh sách này, không phải "backend chưa làm", mà là dữ liệu có sẵn nhưng frontend không đọc |
| `labelDistribution.netMomentum`, `actionItems.*` | luôn `0` | |
| `ClassSnapshot.weekIndex`, `progressPct`, `totalSessions`, `riskPct` | luôn `0` | |
| `ClassSnapshot.testCheckpoint` | tự suy từ mảng hardcode `[4, 8, 12, 16, 20, 24]` phiên học, không đọc `last_checkpoint`/checkpoint thật từ server | Sai lệch nếu lịch test đổi so với 4 giả định này |

Nói cách khác: dây nối frontend↔backend đã thông, nhưng phần lớn "lớp thông minh" của dashboard (risk score, health score, cảnh báo tụt hạng, luồng pass-mềm) hiện đang chạy trên số 0/false giả, không phải vì backend thiếu cột — nhiều cột (`is_alarm_triggered`, `pass_chuan_reasons`, `flag_cheating`) **đã có trong response**, chỉ là mapper chưa đọc. Đây là việc cần làm tiếp theo, không phải thiết kế lại.

**Cập nhật 2026-08-12 — bảng trên giờ chỉ còn đúng cho các đường dữ liệu cũ, không phải toàn bộ app.** Màn Lead Dashboard và luồng chọn lớp giáo viên **không còn gọi `mapClassSummary`/`mapStudentDetail`/`mapSnapshot` ở trên cho phần số liệu chính nữa** — `LeadDashboard.tsx` tự fetch qua `dashboardService.getLeadDashboard()` (`GET /api/v1/lead-dashboard`), và `App.tsx` tự fetch roster lớp qua `dashboardService.getTeacherDashboard()` (`GET /api/v1/classes/:classId/teacher-dashboard`) khi đổi lớp — cả hai trả số liệu server tính thật (xem "Dashboards module" ở §3). Đối chiếu lại từng dòng hardcode ở bảng trên:

- `labelDistribution.netMomentum` (trong `mapClassSummary`) — **hardcode `0` vẫn còn nguyên trong code**, nhưng không còn ảnh hưởng Lead Dashboard vì màn đó giờ đọc `kpis.netMomentum` từ contract mới. `api.getClasses()` (chứa `mapClassSummary`) vẫn được `App.tsx` gọi thật (dùng cho sidebar/chọn lớp), nên các trường khác của `ClassSummary` từ mapper này vẫn đang live — chỉ riêng `netMomentum` là không còn ai đọc tới nữa trên UI hiện tại. Đừng nhầm trường hardcode này với `kpis.netMomentum` ở contract mới (§3 "Dashboards module") — trường đó **không** hardcode, được tính thật từ dữ liệu, nhưng trên dữ liệu hiện tại luôn ra `null` vì lý do dữ liệu (mọi dòng chuyển nhãn nằm ở `snapshot_stage` backfill, bị lọc khỏi Lead), không phải vì bị bỏ qua. Hai chuyện độc lập, đừng "sửa" cái sau bằng cách đọc mẫu của cái trước.
- `ClassSnapshot.weekIndex/progressPct/totalSessions/riskPct` và mảng `testCheckpoint` cứng `[4,8,12,16,20,24]` (trong `mapSnapshot`, backing `api.getSnapshots()`) — **giờ là dead code theo đúng nghĩa đen**: không component nào gọi `api.getSnapshots()` nữa. Đừng sửa các hardcode này tưởng là đang fix bug thật đang chạy; nếu dọn dead code, `mapSnapshot`/`api.getSnapshots` là ứng viên xoá cùng đợt.
- Toàn bộ hardcode trên `StudentDetail` (`riskScore`, `suggestedAction`, `isEligibleForReview`, `passChuanReasons`, `isCheatingFlagged`, `isDroppingRecently`, `hasChangedRecently`, …) nằm trong `mapStudentDetail`, backing `api.getStudentsByClass()` trong `client.ts` — **cũng không còn nơi nào gọi** kể từ khi `App.tsx` chuyển sang `dashboardService.getTeacherDashboard()`. Dữ liệu học viên thật (nhãn, hành động gợi ý) giờ tính ở backend qua `classifyStudent` (`labeling-engine.ts`, §3), không qua các trường hardcode này nữa — nhưng chưa verify `TeacherDashboardResponse`/`adaptTeacherStudent` (`dashboardContracts.ts`) có phủ đủ mọi trường `StudentDetail` cũ hay chưa, đừng coi đây là đã thay thế hoàn toàn cho tới khi kiểm tra kỹ.

Type `PendingReviewEnriched` trong `dashboard/src/data/types.ts` giờ **không còn consumer nào** — `ReviewCenter.tsx` (nơi duy nhất dùng nó) đã bị xoá hẳn trong commit `3ac769b`, không chỉ orphaned như trước. Nếu dọn dead code, đây là ứng viên xoá tiếp theo cùng với `zustand`/`@tanstack/react-query` (đã cài trong `dashboard/package.json` nhưng 0 import trong toàn bộ `dashboard/src`).

---

## 5. Nhật ký liên hệ (`contact_logs`) — đã triển khai thật, không còn là đề xuất

Bản doc trước mô tả sheet `10_NhatKy_LienHe` như một đề xuất chạy tạm trên `localStorage`. Giờ nó là bảng Postgres thật (`contact_logs`, xem schema ở §1) + module NestJS thật (`backend/src/contact-logs/`) + được `dashboard/src/App.tsx` gọi thật qua `api.createContactLog`/`api.undoContactLog`. Toàn bộ thiết kế logic dưới đây **không đổi** so với bản trước — nó đã được implement đúng như đặc tả:

### Khoá episode

```
khoá unique DB = (student_id, class_id, trigger, checkpoint)
```

Khớp đúng constraint `uq_contact_log` trong schema. Append-only ở tầng nghiệp vụ (undo là xoá dòng, không phải cờ trạng thái).

### Ba mức can thiệp (`dashboard/src/data/selectors/studentFilters.ts`)

| Mức | `trigger` | Predicate | Tiêu chí |
|---|---|---|---|
| 1 | `habit_reminder` | `isHabitReminderStudent` | `attendance_pct < 90` hoặc `homework_pct < 90` (hoặc `homework.isDroppingRecently` — hiện luôn false, xem §5) |
| 2 | `red_followup` | `isRedFollowUpStudent` | Nhãn Đỏ, `registration_status = 'active'` |
| 3 | `relearn_advice` | `isRelearnAdviceStudent` | Nhãn Xám, `registration_status = 'active'` |

Ba predicate này **trực tiếp đọc từ `StudentDetail`** trả về bởi `client.ts` — nghĩa là chúng đang chịu ảnh hưởng của các trường bị hardcode ở §4 (đặc biệt `isDroppingRecently`).

### Kênh liên hệ: chỉ Zalo, gửi cho học viên

`channel` mặc định `'zalo'` cả ở schema DB lẫn UI. Giao diện gọi phụ huynh (`CallParentModal.tsx`) đã bị xoá hẳn (commit `319bc24`), không chỉ ẩn — nếu cần khôi phục phải viết lại từ đầu, không phải remount.

### Đóng hộ giữa các luồng — một chiều (không đổi)

```
red_followup / relearn_advice  ──đóng hộ──►  habit_reminder
```

Ràng buộc bởi test `dashboard/src/data/messageScripts.test.ts` (mới, không có ở bản doc trước) — đảm bảo kịch bản Đỏ/Xám luôn nêu cả số ĐH lẫn BTVN. Đừng xoá test đó.

### Ghi ngược — qua REST thật, không còn webhook n8n

Trước đây doc mô tả "ghi ngược qua n8n webhook" như kế hoạch. Thực tế đã cài: `POST /api/contact-logs` và `POST /api/contact-logs/undo` (NestJS, xem §3), gọi trực tiếp từ `App.tsx`, không qua n8n ở bất kỳ bước nào.

---

## 6. Khoảng trống & rủi ro lớn nhất

Xếp theo mức độ chặn việc đưa hệ thống vào dùng thật:

1. **Không có pipeline nạp dữ liệu thật.** Không n8n, không tích hợp Google Sheets API, không cào portal ở đâu trong repo. Toàn bộ dữ liệu trong Postgres là mock, sinh 1 lần bởi `database/generate_snapshots.py` (60 ngày dữ liệu giả lập theo "archetype" học viên, `random.seed(42)`). `google_sheets/generate_mock_data_v2.py` là một **generator mock khác, độc lập, không liên quan** — nó sinh CSV để *nhập vào* Sheets, không đọc *từ* Sheets ra. Hai script này tạo hai bộ dữ liệu giả song song, không đồng bộ với nhau và không đồng bộ với Postgres thật.
2. **Frontend hardcode nhiều trường "thông minh"** (risk score, health score, cảnh báo tụt hạng, pass-mềm) dù backend đã có cột tương ứng — xem bảng ở §4. Đây là việc sửa nhanh (sửa mapper), không phải thiết kế lại.
3. **Bảo mật**: mật khẩu DB plaintext trong git, secret JWT có fallback hardcode, mật khẩu đăng nhập = SĐT so sánh plaintext không hash, CORS mở toàn bộ, thiếu validation pipe. Chấp nhận được cho giai đoạn nội bộ/demo, **không nên deploy public** như hiện tại.
4. **`API_BASE_URL` hardcode `localhost:3000`** trong `dashboard/src/api/client.ts` — bản build production hiện tại không gọi được backend thật trừ khi sửa thành biến môi trường.
5. `generated column` `progress_pct` trong `class_daily_snapshots` chia cứng cho 28, không đọc `classes.total_sessions` — sai nếu có lớp tổng buổi khác 28.
6. Endpoint `GET /api/students/:id/timeline` thiếu RBAC — GV có thể xem timeline HV lớp khác nếu đoán được `student_id`.

Kế hoạch mục tiêu đầy đủ (5 giai đoạn: đo hiệu năng n8n hiện tại → build SQL + backfill → shadow-write → cutover đọc → cutover ghi review → Sheets thành pure export) nằm ở `docs/research/2026-08-04-oracle-sheets-sql-decision.md` — đây là bản tư vấn kiến trúc (Oracle/ChatGPT) đã chốt Postgres làm nguồn sự thật, Sheets chỉ còn vai trò admin nhẹ/báo cáo/export, n8n giữ vai trò orchestration (cron, gọi API ingest, outbox gửi email) chứ không giữ business rule. Backend/schema hiện tại là một hiện thực hoá **rút gọn** của phương án đó (không có `enrollments`/`outbox_events`/`rule_sets` như bản đề xuất đầy đủ).

7. **Production đã deploy nhưng `students`/`contact_logs` rỗng** (xem §7) — dashboard prod trên VPS hiện không hiển thị được học viên nào dù backend/DB/frontend đều chạy đúng. Chặn hơn cả mục 1 ở trên cho mục đích demo/dùng thử ngay, vì đây không cần chờ pipeline sống — chỉ cần chạy lại/seed đủ bảng `students`.
8. **Namespace API không nhất quán.** Module `dashboards` mới (§3) mount ở `api/v1/*`, mọi module khác mount ở `api/*` không version — không có lý do kỹ thuật rõ ràng trong code, dễ gây nhầm lẫn khi thêm client hoặc route mới.
9. ~~**File migration mồ côi trong working tree.**~~ **Đã xử lý xong 2026-08-13.** `006`/`007` đã commit git và đã chạy trên prod (xác nhận qua `pg_indexes`/`pg_constraint`: `idx_student_daily_stage`, `uq_student_stage`, `ck_student_daily_snapshot_stage` đều tồn tại) — toàn bộ module `dashboards` giờ phụ thuộc trực tiếp vào cột `snapshot_stage` (xem mục "Hai hạt trộn trong `student_daily_records`" cuối §1). `008` (`uq_student_record_live`) cũng đã commit git **và đã chạy lên prod cùng ngày**, sau khi nhánh hoàn tất, như một bước deploy riêng. Kết quả: cả hai hạt đều có ràng buộc unique bảo vệ — dòng backfill bởi `uq_student_stage`, dòng live bởi partial index `uq_student_record_live`. Đã kiểm chứng index thực sự chặn được dòng trùng chứ không chỉ tồn tại (chi tiết ở §1). **Rủi ro hạ tầng ở mục này coi như đã đóng.**

---

## 7. Triển khai Production (VPS)

Xác nhận trực tiếp qua SSH ngày 2026-08-07 (`root@160.187.146.127`, xem thông tin đăng nhập trong memory riêng, không commit vào repo).

### Container đang chạy (`docker-compose.prod.yml`)

| Container | Image | Port | Uptime lúc kiểm tra |
|---|---|---|---|
| `izone_postgres_prod` | `postgres:16-alpine` | `5432:5432` | 23h |
| `izone_backend_prod` | `izone-label-dashboard-backend` (build từ `backend/Dockerfile`) | `3000:3000` | 23h |
| `izone_dashboard_prod` | `izone-label-dashboard-dashboard` (build từ `dashboard/Dockerfile` + `dashboard/nginx.conf`) | `8088:80` | 23h |

Cùng VPS còn chạy các workload khác không liên quan tới dự án này: `n8n` + Caddy (reverse proxy cổng 80/443), `proctoring_backend`/`proctoring-frontend`, `rabbitmq`, `minio_server`. **Backend `izone_backend_prod` không có domain/Caddy route riêng ở lần kiểm tra này** — chỉ expose thẳng port 3000/8088, khác với API_BASE_URL hardcode `localhost:3000` đã ghi nhận ở §4 (§4 vẫn đúng: build dashboard hiện tại gọi `localhost:3000` từ trình duyệt người dùng, không phải backend prod trên VPS — hai vấn đề độc lập, cả hai đều cần sửa trước khi dùng thật ngoài LAN của VPS).

Backend log lúc khởi động sạch, không lỗi: Prisma kết nối thành công, toàn bộ route ở §3 map đúng (`/api/classes`, `/api/students/by-class/:classId`, `/api/auth/login`, v.v.).

### Trạng thái dữ liệu trong `izone_postgres_prod`

Database `izone_dashboard`, schema `izone` (không phải `public` — chú ý khi query tay, `psql -c '\dt'` mặc định không thấy gì nếu không set `search_path` hoặc chỉ định schema). Đủ 12 bảng đúng như §1 (`students`, `classes`, `teachers`, `contact_logs`, `class_daily_snapshots`, `student_daily_records`, `pass_reviews`, `system_configs`, `system_logs`, `khoi`, `test_scores`, `label_change_logs`) — nghĩa là migration SQL đã chạy đủ.

Nhưng seed dữ liệu chỉ chạy một phần:

| Bảng | Số dòng |
|---|---|
| `classes` | 265 |
| `teachers` | 237 |
| `students` | **0** |
| `contact_logs` | **0** (đúng như kỳ vọng — bảng này append-only từ thao tác người dùng thật, không phải seed) |

**Hệ quả**: `students` rỗng nghĩa là `student_daily_records`, `test_scores`, `label_change_logs` gần như chắc chắn cũng rỗng theo (chưa kiểm tra trực tiếp — cần verify nếu debug tiếp), vì các bảng đó đều FK vào `students`. `GET /api/students/by-class/:classId` sẽ trả mảng rỗng cho mọi lớp. Dashboard prod trên VPS này hiện **chạy được nhưng không có học viên nào để xem** — khác với môi trường dev local (nơi `backend/seed.js` được chạy tay đầy đủ, xem §3).

Chưa xác định seed trên VPS được chạy bằng cách nào (khả năng: chạy tay một phần qua `docker exec`, hoặc `backend/seed.js` bị lỗi giữa chừng sau khi insert `classes`/`teachers`) — cần hỏi người triển khai hoặc xem lại lịch sử lệnh trên VPS nếu cần điều tra tiếp.

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
| `docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md` | Chẩn đoán + thiết kế đợt sửa 2026-08-13: hai hạt `snapshot_stage`, ngữ nghĩa `NULL` vs `0%`, trọng số khối theo HV có dữ liệu, độ phủ liên hệ ở backend, lý do bỏ card Net Momentum — nguồn cho mọi mục "Cập nhật 2026-08-13" trong file này |

**Lưu ý**: ba tài liệu được bản doc trước trích dẫn (`docs/infrastructure/IZONE — Phân nhãn HV.xlsx`, `docs/general information/Meeting Report … 2026-07-21/23.md`, `docs/design_docs/IZONE-DESIGN.md`) **không tồn tại trong lịch sử git của repo này** (`git log --all` cho các path đó không ra kết quả) — có thể từng tồn tại ở một checkout khác, hoặc bị xoá trước khi merge vào đây. Đừng đi tìm chúng; nội dung tương đương gần nhất hiện nằm ở `report/bao_cao_thiet_ke_fields.md` và `report/IZONE-DESIGN.md`.

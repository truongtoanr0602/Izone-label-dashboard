# CHANGELOG.md

Nhật ký các thay đổi kiến trúc/hạ tầng lớn của dự án, mới nhất ở trên cùng. `ARCHITECTURE.md` chỉ mô tả **hiện trạng**; lý do/lịch sử/bối cảnh của từng thay đổi nằm ở đây.

---

## 2026-08-13 — Sửa lỗi phình mẫu số Lead Dashboard + đóng lỗ hổng trùng dòng live

Nhánh `fix/lead-dashboard-data-fidelity` (chẩn đoán + thiết kế đầy đủ ở `docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md`).

- **Migration `008_restore_live_record_uniqueness.sql`**: commit git và **chạy lên prod cùng ngày** (bước deploy riêng, sau khi nhánh hoàn tất) — thêm partial unique index `uq_student_record_live (student_id, class_id, record_date) WHERE snapshot_stage IS NULL`. Trước đó, migration 007 đã vô tình làm constraint cũ mất tác dụng chặn trùng dòng live (Postgres coi mỗi `NULL` khác nhau). Xác minh sau khi chạy: index tồn tại (`indisunique/indisvalid = true`, 960 kB), số dòng trước/sau đều 40.895 (chỉ tạo index, không đụng dữ liệu), và test chèn trùng `(student_id, class_id, record_date)` bị từ chối đúng `code=23505`.
- **Bug phình mẫu số 3 query Lead Dashboard**: `studentMetricRows`/`transitionRows`/`coverageStudentRows` trong `dashboards.service.ts` (viết 2026-08-12, trước khi migration 007 được nhận diện là đã áp dụng) thiếu điều kiện `snapshot_stage IS NULL`, nên đếm lẫn cả dòng live lẫn dòng backfill theo mốc test. Đo được trên dữ liệu thật (Khối 3-4, 17 lớp `on_going`, 2026-08-12): 770 dòng thay vì 244 dòng live thật — mẫu số mọi KPI phình gần gấp 3. Một ngưỡng bù cho méo mó này (`DEFAULT_MINIMUM_COVERAGE = 80`) từng khiến 15/17 lớp trượt sai và dữ liệu hiển thị lùi về tận `2026-07-06` ở một số lớp. Đã sửa: thêm `snapshot_stage IS NULL` vào cả 3 query.
- **Xoá `DEFAULT_MINIMUM_COVERAGE = 80`** (`snapshot-quality.ts`) — ngưỡng này từng loại hẳn lớp có độ phủ dữ liệu thấp khỏi mẫu số KPI (8/17 lớp từng biến mất khỏi biểu đồ tuần vì lý do này). Sau khi `weightedResolved` (`lead-aggregation.ts`) đổi sang cân trung bình khối theo `sampleSize` thay vì sĩ số roster, ngưỡng bù này không còn cần thiết — `coveragePct` vẫn tính (`sampleSize/recordCount`) nhưng giờ chỉ để hiển thị. `LOW_COVERAGE_WARNING_PCT = 80` (tên gần giống nhưng khác hằng số) vẫn còn, chỉ gắn cảnh báo vào `dataQuality.warnings[]`, không loại gì khỏi mẫu số.
- **Xác nhận `NULL` ≠ `0%` trên dữ liệu thật**: verify trực tiếp Postgres, toàn bộ 40.895 dòng `student_daily_records` — `attendance_pct IS NULL` ⟺ `attendance_total = 0` đúng 100% (18.747 dòng), `attendance_pct = 0` ⟺ `attendance_total > 0` đúng 100% (3.065 dòng), phần còn lại (19.083 dòng) cũng khớp bất biến. Số dòng cụ thể sẽ tăng theo mỗi lần scrape — chỉ coi bất biến ngữ nghĩa là ổn định lâu dài.
- **`netMomentum` xác nhận luôn `null` trên dữ liệu thật**: 100% dòng có `has_label_changed = TRUE` hợp lệ (517/517) nằm ở `snapshot_stage IS NOT NULL`, không có dòng live nào — nên sau khi thêm điều kiện lọc ở trên, `calculateNetMomentum` luôn nhận mảng rỗng. Đây là lý do card "Net Momentum" đã bị bỏ khỏi `KpiRow.tsx` trước đó (24 lượt chuyển nhãn cả kỳ, dồn hết vào một ngày, không có gì để Lead hành động).
- **Nhãn học thuật chỉ theo Test; ĐH/BTVN chỉ điều khiển can thiệp**: `classifyStudent` đổi để không còn tạo nhãn `green`; thiếu/kém ĐH-BTVN không xoá hay đổi nhãn Test nữa, chỉ tạo issue/cảnh báo chất lượng dữ liệu và (khi có tỷ lệ thật dưới ngưỡng) `interventionLevel: level_1`.
- **Chỉ số ĐH/BTVN dùng số đếm lũy kế cùng ngày chốt làm nguồn chuẩn**: hai n8n workflow draft (chưa deploy) `AbBatX2eptllUAET`/`SLZH4ZwyQsx8b4CS` đếm session completed tới cutoff, loại `NULL` khỏi mẫu số. Backend tính lại tỷ lệ từ `attendance_present/total` và `homework_done/total` thay vì tin trực tiếp `*_pct`.
- **`contactCoverage` mới**: `contact-coverage.ts` tính độ phủ liên hệ thật ở backend lần đầu tiên (trước đó chỉ có ở frontend).
- **File migration "mồ côi" hết mồ côi**: nhận định cũ (2026-08-12, xem bên dưới) rằng `006`/`007` là nháp chưa dùng đã lỗi thời — cả hai đã được commit chính thức và chạy trên prod trong đợt này.

## 2026-08-12 — Module `dashboards` (screen-contract)

Chuỗi 11 commit (`d239004` → `404a8e9`) thêm `backend/src/dashboards/` (route namespace riêng `api/v1/*`), triển khai kiến trúc "screen-contract": `GET /api/v1/lead-dashboard` và `GET /api/v1/classes/:classId/teacher-dashboard` trả KPI/nhãn/gợi ý hành động đã tính sẵn ở backend. Thiết kế gốc: `report/2026-08-12-screen-contract-data-flow-design.md`, `report/2026-08-12-lead-dashboard-data-quality-design.md`. Đây là thay đổi kiến trúc lớn nhất kể từ merge monorepo.

- Snapshot Quality Resolver (`snapshot-quality.ts`) ra đời cùng đợt này, ban đầu có ngưỡng độ phủ tối thiểu 80% (`DEFAULT_MINIMUM_COVERAGE`) — bị xoá ở đợt sửa 2026-08-13 phía trên.
- Bug đã sửa (`a5be7b8 "fix: compare label momentum on matching classes"`): `netMomentum` kỳ này so với kỳ trước từng tính trên toàn bộ lớp có chuyển nhãn ở mỗi kỳ riêng lẻ, thay vì trên giao của hai tập lớp — khiến so sánh khập khiễng giữa các lớp không cùng có dữ liệu ở cả hai kỳ. Bản sửa giới hạn `momentumDelta`/`comparableClasses` vào tập giao (`dashboards.service.ts:211-233`).
- Cùng ngày, hai file migration `006_historical_test_snapshots.sql` và `007_stage_based_test_snapshots.sql` xuất hiện trong working tree nhưng chưa commit. Tại thời điểm đó, 006 đã áp dụng lên Postgres prod nhưng 007 (thêm `snapshot_stage`) chưa có code nào tham chiếu — coi là nháp chưa dùng. **Nhận định này đã lỗi thời từ 2026-08-13** (xem mục trên): cả hai migration sau đó được commit chính thức và trở thành cột trung tâm của các query aggregate.

## 2026-08-07 — Lên production VPS

Commit `cf92d64 "chore: add Docker production configuration"` thêm `docker-compose.prod.yml` + `backend/Dockerfile` + `dashboard/Dockerfile` + `dashboard/nginx.conf`. Ba container `izone_postgres_prod`/`izone_backend_prod`/`izone_dashboard_prod` chạy trên VPS `root@160.187.146.127`, cùng host với các workload không liên quan khác (`n8n`, `proctoring_backend`, `rabbitmq`, `minio_server`).

Xác nhận qua SSH cùng ngày: schema `izone` đã có đủ 12 bảng và migration đã chạy, nhưng seed dữ liệu chưa đầy đủ — `classes` (265 dòng) và `teachers` (237 dòng) đã có, còn `students` và `contact_logs` là **0 dòng**. Dashboard prod lúc đó chạy được nhưng không có học viên nào để hiển thị. (Theo memory phiên làm việc: `students` đã có ~19.7k dòng tính đến 2026-08-08, tức được seed đầy đủ ngay hôm sau — chưa re-verify qua SSH trong doc này.)

Backend `izone_backend_prod` lúc đó không có domain/Caddy route riêng, chỉ expose thẳng port 3000/8088.

## 2026-08-05 — Merge monorepo

Merge lớn (`650657f "Merge into Monorepo: Add Backend, Database, and migrate Frontend"`, +396 file, +91k dòng) biến dashboard từ **frontend-only prototype đọc mock data** thành **monorepo 3 phần**: `backend/` (NestJS + Prisma + Postgres, có thật), `dashboard/` (React, giờ gọi API thật thay vì đọc `mockData.ts`), và các thư mục dữ liệu/kế hoạch (`database/`, `google_sheets/`, `report/`, `docs/`). Google Sheets 9-sheet không còn là nguồn dữ liệu sống — vẫn tồn tại như tài liệu thiết kế gốc và là format của script sinh CSV mock (`google_sheets/`), schema thật từ đây là Postgres.

Cùng đợt: commit `7bb5fe5 "chore: add dev scripts, api proxy, and drop stale docx lockfiles"` (nhánh `fix/lead-dashboard-data-fidelity`, dự định chỉ dọn `~$*.docx` và viết lại `.gitignore` bị hỏng encoding) vô tình đưa `ARCHITECTURE.md`/`CLAUDE.md`/`docs/`/`scripts/` vào `.gitignore` — cả hai file doc chưa từng có commit nào trong lịch sử git trước đợt sửa tài liệu 2026-08-13, lúc đó phải dùng `git add -f` để vượt qua `.gitignore`.

---

## Trạng thái đã đóng (không cần theo dõi tiếp)

- **Lỗ hổng trùng dòng live** (`uq_student_record_live` thiếu) — đóng 2026-08-13, xem mục cùng ngày ở trên.
- **File migration mồ côi trong working tree** (006/007 chưa commit) — đóng 2026-08-13, xem mục cùng ngày ở trên.
- **`ARCHITECTURE.md`/`CLAUDE.md` bị gitignore nhầm** (từ commit `7bb5fe5`, xem mục 2026-08-05 ở trên) — đã đóng: `.gitignore` không còn hai dòng loại trừ này, cả hai file track bình thường trong git (`git ls-files` xác nhận), không cần `git add -f` nữa.

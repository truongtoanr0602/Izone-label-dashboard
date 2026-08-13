# Oracle consultation transcript — IZONE Sheets vs SQL

- Date: 2026-08-04
- Oracle session: `izone-sheets-sql-decision`
- Model: GPT-5.5 High (browser current model)
- Conversation: https://chatgpt.com/c/6a718dc2-7c50-83ec-ac3d-8fb3ef716bcc
- Local evidence bundle: 21 code and documentation files, approximately 53,001 prompt tokens

## User prompt

### Project briefing

Đây là hệ thống nội bộ IZONE để đồng bộ dữ liệu lớp/học viên từ Portal/LMS, tính nhãn Xám-Đỏ-Vàng, tính pass chuẩn/pass mềm, gửi cảnh báo và hiển thị dashboard React/Vite trên GitHub Pages. n8n hiện được định hướng làm engine cron và webhook. Thiết kế ban đầu chọn Google Sheets làm database vì MVP chỉ 3 lớp và khoảng 60 học viên. Nhưng roadmap trong tài liệu/code đã lên khoảng 28 lớp, snapshot hằng tuần lưu vĩnh viễn, chi tiết điểm khoảng 11.000 dòng/năm, review pass mềm có trạng thái và ghi ngược từ GV, nhiều người dùng có phân quyền GV/Lead. Hãy đọc các file đính kèm như bằng chứng, đặc biệt `ARCHITECTURE.md` là bản đối chiếu trực tiếp workbook 9 sheet; file xlsx là dữ liệu mẫu thật.

### Concrete details and constraints

Workbook có 9 sheet: master lớp, snapshot học viên ghi đè, chi tiết điểm, log chuyển nhãn append-only, review pass mềm mutable, config nghiệp vụ, system log, giáo viên, weekly snapshot append-only. Đã có lỗi dữ liệu thật do Sheets/Excel: số thập phân `d.m` tự thành ngày; phone mất số 0; một số cờ và review lệch nhau. Frontend hiện hoàn toàn mock/in-memory; `ReviewCenter` chỉ `setState`. GitHub Pages là static hosting và không thể bảo vệ dữ liệu học viên nếu dữ liệu nhúng vào bundle hoặc Sheets được mở trực tiếp. Portal chỉ hỗ trợ polling cron hằng ngày, không có event trigger. Dashboard là read-mostly nhưng có quyết định pass mềm cần write. Không có JSON workflow n8n thật trong repo, vì vậy hãy phân biệt điều biết chắc từ code/docs và điều cần đo ở workflow runtime. Google Sheets API hiện có quota per-minute và có thể `batchUpdate`; đừng mặc định rằng row-by-row write là bắt buộc.

### Specific ask

Trả lời bằng tiếng Việt, thẳng và có lập luận. Hãy:

1. Kết luận hệ thống này có nên chuyển sang SQL không, và nếu có thì chuyển phần nào.
2. So sánh ít nhất 3 phương án: Sheets-only được tối ưu batching, SQL-only, và SQL source-of-truth + Sheets làm admin/report/export.
3. Chỉ ra liệu rate limit là nguyên nhân quyết định hay chỉ là triệu chứng của cách ghi row-by-row.
4. Đề xuất schema/domain boundaries tối thiểu tương ứng 9 sheet, keys, unique constraints, idempotent upsert, transaction boundary và audit/outbox.
5. Nói rõ n8n nên giữ vai trò gì và không nên giữ vai trò gì.
6. Đề xuất API/auth/authorization phù hợp với frontend static, nhất là GV chỉ xem lớp mình và Lead xem toàn bộ.
7. Đưa migration roadmap theo phase, rollback/dual-write strategy, metric để chốt Go/No-Go.
8. Nêu các giả định rủi ro và câu hỏi cần chốt.

YAGNI: không đề xuất microservices/Kafka/Kubernetes. Hãy đưa recommendation đủ cụ thể để team ra quyết định, không viết code.

## Assistant response

# Kết luận điều hành

**Nên chuyển sang SQL.** Tuy nhiên, không nên loại bỏ Google Sheets hoàn toàn.

Phương án phù hợp nhất là:

> **PostgreSQL làm source of truth; Google Sheets chỉ còn vai trò admin nhẹ, báo cáo và xuất dữ liệu.**

Cần chuyển sang SQL toàn bộ phần có yêu cầu về tính đúng đắn, lịch sử, quan hệ, phân quyền hoặc ghi đồng thời:

* Master lớp, giáo viên, học viên và đăng ký lớp.
* Điểm chi tiết.
* Snapshot học viên hiện tại.
* Weekly snapshot lịch sử.
* Log chuyển nhãn.
* Review pass mềm và quyết định của giáo viên.
* Config nghiệp vụ có version.
* System run log, audit log và notification outbox.

Sheets có thể được giữ cho:

* Xem nhanh và đối soát thủ công.
* Xuất báo cáo cho Lead hoặc các team khác.
* Chỉnh một số config ít rủi ro, sau đó import có kiểm tra.
* Admin operations trong giai đoạn chưa có màn hình quản trị.
* Bản snapshot read-only phục vụ nghiệp vụ quen dùng Excel.

Đây không còn là bài toán “3 lớp, 60 học viên”. Roadmap 28 lớp, dữ liệu lịch sử vĩnh viễn, khoảng 11.000 dòng điểm/năm, workflow review mutable và phân quyền theo giáo viên đã vượt khỏi vùng mà Sheets nên giữ vai trò database chính.

---

# 1. Những gì đã biết chắc và những gì chưa biết

## Đã xác nhận từ tài liệu, code và workbook

1. Workbook có đúng 9 sheet, gồm cả master, current snapshot, transaction detail, append-only logs, mutable workflow state và time series.
2. `02_DuLieu_HocVien` đang là bảng denormalized và bị ghi đè mỗi lần đồng bộ.
3. `04_NhatKy_ChuyenNhan`, `07_Log_HeThong`, `09_Weekly_Snapshot` có tính chất append-only.
4. `05_XetDuyet_PassMem` là workflow state có thay đổi trạng thái và quyết định của GV.
5. Dữ liệu mẫu đã xuất hiện lỗi kiểu dữ liệu:

   * Số thập phân bị Excel hiểu thành ngày.
   * Số điện thoại mất số 0 đầu.
   * Cờ `co_chuyen_nhan` không khớp log chuyển nhãn.
   * `flag_can_review` có nhiều học viên hơn số review thật.
6. Frontend hiện không kết nối dữ liệu thật:

   * `App.tsx` đọc `MOCK_CLASSES`.
   * `ReviewCenter.tsx` đọc `MOCK_PENDING_REVIEWS`.
   * Quyết định Pass/Fail chỉ dùng `setReviews(...)`.
   * Refresh trang sẽ mất toàn bộ quyết định.
7. GitHub Pages chỉ host file tĩnh. Không thể bảo vệ dữ liệu học viên nếu dữ liệu được:

   * Nhúng vào JavaScript bundle.
   * Đặt trong file JSON public.
   * Đọc từ một Google Sheet được mở quyền công khai.
8. Portal chỉ hỗ trợ polling cron, không có event trigger. Việc chuyển sang SQL không biến nguồn Portal thành real-time.
9. Không có JSON workflow n8n thật trong repo. Vì vậy chưa thể kết luận runtime đang ghi theo từng dòng, đang batch, có retry hay có idempotency hay không.

## Cần đo ở runtime

* Số request Google Sheets thực tế trên mỗi lớp và mỗi lần chạy.
* Workflow đang dùng append/update row-by-row hay `batchUpdate`.
* Tỷ lệ retry, timeout và partial failure.
* Một lần đồng bộ thất bại có để lại dữ liệu nửa cũ, nửa mới hay không.
* Có workflow chạy chồng khi cron trước chưa kết thúc không.
* Có khả năng một review hoặc email được tạo hai lần khi n8n retry không.
* Thời gian đọc dashboard và kích thước payload thật ở quy mô 28 lớp.
* Số người dùng đồng thời và tần suất GV thực hiện review.
* Portal ID nào ổn định lâu dài: `student_id`, `class_id`, `class_test_id`, registration ID.

---

# 2. So sánh ba phương án

| Tiêu chí                     | Sheets-only, tối ưu batching |          SQL-only | SQL source of truth + Sheets admin/report |
| ---------------------------- | ---------------------------: | ----------------: | ----------------------------------------: |
| Thời gian triển khai ban đầu |                     Tốt nhất |        Trung bình |                                Trung bình |
| Độ toàn vẹn dữ liệu          |                          Yếu |               Tốt |                                       Tốt |
| Kiểu dữ liệu nghiêm ngặt     |                          Yếu |               Tốt |                                       Tốt |
| Unique/FK/check constraint   |             Không thực sự có |                Có |                              Có trong SQL |
| Transaction nhiều bảng       |                        Không |                Có |                              Có trong SQL |
| Idempotent upsert            |        Khó, phải tự mô phỏng |          Tự nhiên |                                  Tự nhiên |
| Workflow mutable             |     Có thể làm nhưng dễ lệch |           Phù hợp |                                   Phù hợp |
| Lịch sử append-only lâu dài  |                  Khó quản lý |           Phù hợp |                                   Phù hợp |
| Phân quyền GV/Lead           |                      Rất yếu |               Tốt |                                       Tốt |
| Dashboard static an toàn     |   Vẫn cần backend trung gian |   Cần backend/API |                           Cần backend/API |
| Nghiệp vụ tự mở Sheet chỉnh  |                   Thuận tiện |           Kém hơn |                              Vẫn giữ được |
| Đối soát thủ công            |                          Tốt | Cần UI/query tool |                                       Tốt |
| Rủi ro hai nguồn dữ liệu     |        Thấp nhưng source yếu |              Thấp |                Có, nếu dual-write lâu dài |
| Phù hợp roadmap hiện tại     |            Không khuyến nghị |                Có |                          **Phù hợp nhất** |

## Phương án A — Sheets-only nhưng tối ưu batching

Phương án này có thể kéo dài tuổi thọ MVP bằng cách:

* Đọc/ghi theo range lớn.
* Dùng `values.batchUpdate` hoặc `spreadsheets.batchUpdate`.
* Không tìm và update từng dòng.
* Load sheet một lần vào memory, tính toán rồi ghi một lần.
* Tách current state và append log.
* Dùng cột text rõ ràng cho phone và các identifier.
* Thêm validation và protected ranges.

Nó có thể giải quyết phần lớn vấn đề quota và tốc độ nếu hiện tại workflow đang ghi row-by-row.

Nhưng nó **không giải quyết được**:

* Foreign key.
* Transaction xuyên nhiều sheet.
* Race condition giữa cron và GV review.
* Unique constraint thực sự.
* Authorization theo từng lớp.
* Audit đáng tin cậy.
* Atomic state transition của review.
* Việc hai cờ dẫn xuất bị lệch nhau.
* Rủi ro người dùng sửa nhầm cấu trúc hoặc format.

**Kết luận:** phù hợp làm biện pháp ổn định ngắn hạn, không nên là target architecture.

## Phương án B — SQL-only

Mọi dữ liệu và config chuyển sang SQL. Admin phải dùng dashboard hoặc database admin tool.

Ưu điểm:

* Một source of truth duy nhất.
* Dễ enforce constraint, transaction, audit và phân quyền.
* Không có nguy cơ Sheets bị hiểu sai kiểu dữ liệu.
* Dễ tạo API nhất quán cho frontend.

Nhược điểm:

* Team mất công cụ thao tác quen thuộc.
* Các báo cáo ad hoc và đối soát thủ công trở nên chậm hơn nếu chưa có admin UI.
* Dễ khiến migration mở rộng thành dự án xây toàn bộ back-office.

**Kết luận:** đúng về kỹ thuật nhưng chưa chắc tối ưu cho cách vận hành hiện tại.

## Phương án C — SQL source of truth, Sheets cho admin/report/export

Đây là phương án khuyến nghị.

Nguyên tắc bắt buộc:

1. **Mọi quyết định nghiệp vụ có hiệu lực phải ghi vào SQL trước.**
2. Sheets không được coi là database song song.
3. Dữ liệu từ SQL xuất ra Sheets theo một chiều, trừ một số config được kiểm soát.
4. Nếu cho phép chỉnh config trong Sheets, phải có quy trình:

   * Validate.
   * Preview diff.
   * Người có quyền approve.
   * Import thành version mới.
   * Ghi audit.
5. Không cho workflow đọc khi thì SQL, khi thì Sheets tùy tiện.

Có thể chia Sheets thành hai loại:

* **Export read-only:** lớp, học viên, điểm, snapshot, review status.
* **Admin input có kiểm soát:** config hoặc mapping, với schema validation khi nhập lại.

---

# 3. Rate limit có phải nguyên nhân quyết định không?

**Không. Rate limit không phải lý do quyết định để chuyển sang SQL.**

Nếu workflow đang ghi từng dòng, quota chỉ là **triệu chứng của cách tích hợp chưa tối ưu**. Với khoảng 28 lớp và 11.000 dòng điểm/năm, Sheets API vẫn có thể xử lý khá nhiều nếu:

* Ghi theo batch.
* Hạn chế gọi lại metadata.
* Upsert theo range hoặc thay thế cả tập dữ liệu hiện tại.
* Gom append log.
* Không thực hiện một request cho mỗi ô hoặc mỗi học viên.

Do chưa có workflow JSON thật, chưa thể nói “Sheets không chịu nổi tải”.

Lý do quyết định chuyển sang SQL nằm ở bản chất dữ liệu:

* Có entity relationship.
* Có mutable workflow state.
* Có quyết định nghiệp vụ cần chống ghi đè.
* Có lịch sử phải giữ lâu dài.
* Có yêu cầu phân quyền theo lớp.
* Có nhiều bảng cần cập nhật nhất quán.
* Đã có lỗi type coercion và derived state mismatch.
* Frontend cần một backend an toàn dù dữ liệu nằm ở Sheets hay SQL.

Nói cách khác:

> **Batching có thể chữa vấn đề hiệu năng và quota. Nó không chữa được vấn đề consistency, authorization và transactional integrity.**

Team vẫn nên tối ưu batching ngay trong giai đoạn migration, vì SQL không bù được một workflow n8n thiết kế kém.

---

# 4. Domain boundaries và schema tối thiểu

Không cần microservices. Một PostgreSQL database, một API/backend và một nhóm worker n8n là đủ.

## 4.1. Identity và access

### `users`

* `id` UUID, primary key.
* `email` unique, normalized lowercase.
* `display_name`.
* `status`.
* `created_at`, `updated_at`.

### `roles`

Có thể chưa cần bảng nếu role ít; dùng enum:

* `teacher`
* `lead`
* `admin`
* `system`

### `user_roles`

* `user_id`
* `role`
* `scope_type`: `global`, `khoi`, `class`
* `scope_id`
* Unique: `(user_id, role, scope_type, scope_id)`

Trong MVP, giáo viên có thể map qua email với bảng teacher, nhưng không nên dùng email làm primary key nội bộ.

---

## 4.2. Teacher và class master

Tương ứng `08_GiaoVien` và phần master của `01_DanhSach_Lop`

### `teachers`

* `id` UUID nội bộ.
* `portal_teacher_id` bigint/text.
* `user_id` nullable FK.
* `full_name`.
* `email`.
* `phone` **text**, không phải number.
* `khoi_id`.
* `active`.

Unique:

* `portal_teacher_id`.
* Email có thể unique nếu tổ chức đảm bảo một người một email.

### `classes`

* `id` UUID nội bộ.
* `portal_class_id`.
* `class_code`.
* `course_id`.
* `teacher_id`.
* `lead_user_id` hoặc `khoi_id`.
* `status`.
* `schedule_text`.
* `location`.
* `opening_date`, `ending_date`.
* `total_sessions`.
* `portal_url`.
* `source_updated_at`.
* `last_synced_at`.

Unique:

* `portal_class_id`.
* Có thể thêm `(class_code, opening_date)` nếu code có khả năng tái sử dụng.

Không nên lưu các chỉ số tổng hợp như `count_xam`, `pass_rate` trực tiếp trong bảng class master. Chúng nên nằm trong snapshot hoặc materialized aggregate.

---

## 4.3. Student và enrollment

Tương ứng grain của `02_DuLieu_HocVien`

Tài liệu hiện nói `student_id == student_code` trong 59/59 dòng, nhưng không nên coi đó là quy luật vĩnh viễn.

### `students`

* `id` UUID nội bộ.
* `portal_student_id`.
* `student_code`.
* `full_name`.
* `phone` text.
* `email`.
* `created_at`, `updated_at`.

Unique:

* `portal_student_id`.
* `student_code` chỉ unique nếu Portal cam kết.

### `enrollments`

Đây mới là quan hệ “một học viên trong một lớp”.

* `id` UUID.
* `student_id`.
* `class_id`.
* `portal_registration_id`, nếu có.
* `registration_status`.
* `admitted_at`.
* `ended_at`.
* `output_status`.
* `source_updated_at`.

Unique:

* Tốt nhất: `portal_registration_id`.
* Nếu không có: `(student_id, class_id, admitted_at)`.
* Không nên chỉ dùng `(student_id, class_id)` nếu một học viên có thể học lại cùng lớp hoặc tái đăng ký.

---

## 4.4. Current learner state

Tương ứng phần snapshot ghi đè của `02_DuLieu_HocVien`

### `enrollment_current_state`

Một dòng cho mỗi enrollment.

* `enrollment_id` primary key/FK.
* Attendance count và percentage.
* Homework count và percentage.
* `tests_taken`.
* `test_average` numeric.
* `current_label`.
* `previous_label`.
* `baseline_label`.
* `label_checkpoint`.
* `pass_standard_status`.
* `pass_soft_status`.
* Các cờ tính toán.
* Feedback từ Portal.
* `calculated_at`.
* `rule_version`.
* `source_run_id`.

Các percentage nên dùng `numeric`, không dùng text. Có thể lưu numerator/denominator làm nguồn và percentage là generated/derived value.

`pass_chuan_reasons` nên là:

* JSONB danh sách reason code, hoặc
* bảng child `enrollment_rule_failures`.

Không nên chỉ lưu chuỗi tiếng Việt nối bằng dấu `;`, vì khó lọc và dễ phụ thuộc wording.

---

## 4.5. Test details

Tương ứng `03_DiemTest_ChiTiet`

### `test_definitions`

* `id`.
* `portal_class_test_id`.
* `class_id`.
* `test_order`.
* `test_name`.
* `max_grade`.
* `scheduled_at`.

Unique:

* `portal_class_test_id`.
* Dự phòng `(class_id, test_order)` nếu mỗi order chỉ có một test.

### `test_attempts`

* `id`.
* `test_definition_id`.
* `enrollment_id`.
* `attempt_type`: regular/makeup.
* `raw_grade`.
* `final_grade`.
* `status`.
* `is_cheating`.
* `grade_note`.
* `label_at_attempt`.
* `source_updated_at`.
* `source_run_id`.

Unique tùy dữ liệu Portal:

* Tốt nhất: portal grade/attempt ID.
* Nếu không có: `(test_definition_id, enrollment_id, attempt_type)`.
* Nếu Portal có nhiều lần thi lại, phải thêm attempt number hoặc timestamp.

`grade_final = max(raw, makeup)` có thể được tính trong service/rule engine, nhưng cần lưu rõ input để audit.

---

## 4.6. Label history

Tương ứng `04_NhatKy_ChuyenNhan`

### `label_events`

* `id` UUID.
* `enrollment_id`.
* `from_label`.
* `to_label`.
* `direction`.
* `severity`.
* `reason_code`.
* `reason_detail` JSONB.
* `checkpoint`.
* `test_average`.
* Attendance/homework tại thời điểm sự kiện.
* `rule_version`.
* `occurred_at`.
* `source_run_id`.

Unique/idempotency:

* `event_key` unique, được sinh từ:

  * enrollment.
  * checkpoint hoặc source data version.
  * from label.
  * to label.
  * rule version.

Không dùng random 8-character hex làm cơ chế chống trùng.

`email_sent` không nên nằm trong label event. Đó là trạng thái delivery của notification/outbox.

---

## 4.7. Soft-pass review

Tương ứng `05_XetDuyet_PassMem`

### `soft_pass_reviews`

* `id` UUID.
* `enrollment_id`.
* `eligibility_group`.
* `eligibility_snapshot` JSONB.
* `rule_version`.
* `status`.
* `deadline_at`.
* `assigned_teacher_id`.
* `escalated_at`.
* `created_at`.
* `updated_at`.
* `version` integer cho optimistic locking.

Unique:

Không nên unique vĩnh viễn chỉ theo `student_id`, vì một học viên có thể được review lại ở lớp hoặc chu kỳ khác.

Đề xuất:

* Unique `(enrollment_id, eligibility_cycle, rule_version)`.
* Hoặc partial unique chỉ cho review đang mở:

  * Một enrollment chỉ có tối đa một review ở trạng thái pending/overdue.

### `soft_pass_decisions`

Có thể gộp vào review nếu chỉ có một quyết định cuối cùng. Tuy nhiên bảng riêng tốt hơn cho audit:

* `id`.
* `review_id`.
* `decision`: pass/fail.
* `comment`.
* `attitude_assessment`.
* `decided_by_user_id`.
* `decided_at`.
* `client_request_id`.

Unique:

* `review_id` nếu chỉ cho một quyết định cuối.
* `client_request_id` unique để chống double-click/retry.

State transition phải được kiểm tra ở backend:

```text
pending → approved
pending → rejected
pending → overdue
overdue → approved/rejected, nếu nghiệp vụ cho phép
```

Frontend không được tự gửi một status tùy ý.

---

## 4.8. Config

Tương ứng `06_CauHinh_HeThong`

### `rule_sets`

* `id`.
* `name`.
* `version`.
* `effective_from`.
* `effective_to`.
* `status`: draft/active/retired.
* `created_by`.
* `approved_by`.

### `rule_parameters`

* `rule_set_id`.
* `key`.
* `value_json`.
* `value_type`.
* `description`.

Unique:

* `(rule_set_id, key)`.

Không nên update đè config mà không lưu version. Nếu ngưỡng đổi, team phải biết một nhãn hoặc pass status được tính bằng rule version nào.

---

## 4.9. System run log

Tương ứng `07_Log_HeThong`

### `sync_runs`

* `id`.
* `workflow_name`.
* `trigger_type`.
* `started_at`, `completed_at`.
* `status`.
* `correlation_id`.
* `source_watermark`.
* Tổng records fetched/inserted/updated/rejected.
* Error summary.

### `sync_run_items`

Theo class hoặc bước:

* `sync_run_id`.
* `class_id`.
* `step`.
* `status`.
* `records_affected`.
* `duration_ms`.
* `error_detail`.

Điều này giúp phân biệt “workflow thành công” với “27 lớp thành công, 1 lớp thất bại”.

---

## 4.10. Weekly snapshot

Tương ứng `09_Weekly_Snapshot`

Không nên dùng `class_id = 'ALL'` để biểu diễn aggregate.

### `class_weekly_snapshots`

* `id`.
* `class_id` FK, luôn là class thật.
* `snapshot_date`.
* `week_index`.
* `checkpoint`.
* `progress_pct`.
* `test_checkpoint`.
* Numerator/denominator cho attendance/homework nếu có.
* `attendance_avg`.
* `homework_avg`.
* `pass_standard_rate`.
* `pass_soft_rate`.
* Label counts.
* `source_run_id`.

Unique:

* `(class_id, snapshot_date)`, hoặc
* `(class_id, checkpoint, snapshot_date)` nếu có nhiều checkpoint một ngày.

Dòng `ALL` nên:

* Được query aggregate khi đọc, hoặc
* Lưu trong bảng aggregate riêng với `scope_type = 'khoi'`.

Không trộn string sentinel vào cột foreign key.

---

# 5. Transaction boundary và idempotency

## Transaction hợp lý cho cron sync

Không nên dùng một transaction khổng lồ cho cả 28 lớp. Đề xuất một transaction cho **mỗi lớp trong mỗi sync run**:

1. Ghi raw/staging payload của lớp.
2. Validate schema và type.
3. Upsert class, teacher, student, enrollment.
4. Upsert test definitions và attempts.
5. Tính current state bằng rule version đã khóa.
6. So sánh state trước/sau.
7. Tạo label events mới.
8. Tạo hoặc đóng soft-pass review theo quy tắc.
9. Tạo weekly snapshot nếu đúng lịch.
10. Tạo outbox events.
11. Commit.

Nếu bất kỳ bước quan trọng nào thất bại, rollback transaction của lớp đó. Các lớp khác vẫn chạy được.

Không nên gửi email bên trong database transaction. Email có thể chậm hoặc thất bại khiến transaction kéo dài.

## Idempotent upsert

Mỗi run cần:

* `run_id`.
* `correlation_id`.
* `source_fetched_at`.
* `payload_hash` nếu cần.
* Deterministic keys từ Portal.

Khi n8n retry cùng payload:

* Không tạo lại test attempt.
* Không tạo lại label event.
* Không mở review thứ hai.
* Không gửi email thứ hai.
* Không append weekly snapshot trùng.

## Optimistic concurrency cho review

Khi GV mở review, response trả về `version = 3`.

Khi submit:

```text
UPDATE review
SET ..., version = 4
WHERE id = ... AND version = 3
```

Nếu không update được dòng nào, API trả conflict. Điều này tránh Lead và GV cùng thao tác làm mất quyết định của nhau.

---

# 6. Audit log và transactional outbox

## `audit_events`

Ghi các thay đổi có ý nghĩa nghiệp vụ:

* Ai thực hiện.
* Role và scope lúc thực hiện.
* Entity type/id.
* Action.
* Before/after JSON.
* Request ID.
* IP/user agent nếu phù hợp chính sách.
* Timestamp.

Bắt buộc audit:

* Quyết định pass mềm.
* Lead override.
* Thay đổi config.
* Thay đổi quyền truy cập.
* Manual correction dữ liệu.
* Re-run hoặc backfill có tác động đến nhãn.

Không cần audit mọi lần dashboard GET dữ liệu ở mức row-by-row, trừ khi chính sách dữ liệu yêu cầu.

## `outbox_events`

* `id`.
* `event_type`.
* `aggregate_type`.
* `aggregate_id`.
* `event_key` unique.
* `payload`.
* `created_at`.
* `processed_at`.
* `attempt_count`.
* `last_error`.

Ví dụ:

* `label.changed`
* `soft_pass.review_created`
* `soft_pass.review_overdue`
* `soft_pass.decision_recorded`

Outbox được tạo trong cùng transaction với thay đổi nghiệp vụ. n8n hoặc worker đọc outbox và gửi email. Thành công mới đánh dấu processed.

Nhờ đó tránh tình trạng:

* DB đã đổi nhãn nhưng email không có dấu vết.
* Email gửi rồi nhưng transaction dữ liệu rollback.
* Retry gửi cùng email nhiều lần.

---

# 7. Vai trò của n8n

## n8n nên giữ

* Cron polling Portal hàng ngày.
* Gọi API Portal và xử lý pagination.
* Orchestration theo từng lớp.
* Gọi API ingestion hoặc stored procedure có kiểm soát.
* Retry với backoff.
* Đọc outbox hoặc nhận webhook nội bộ để gửi email.
* Escalation deadline theo lịch.
* Đồng bộ SQL → Google Sheets.
* Thông báo vận hành khi sync thất bại.

## n8n không nên giữ

* Không nên là source of truth.
* Không nên giữ workflow state quan trọng trong execution data.
* Không nên là nơi duy nhất chứa toàn bộ rule nghiệp vụ bằng các Code node rải rác.
* Không nên tự ghép SQL string tùy tiện hoặc update nhiều bảng không transaction.
* Không nên trực tiếp quyết định authorization cho người dùng dashboard.
* Không nên expose webhook công khai và tin `teacher_id` do frontend gửi lên.
* Không nên trả toàn bộ dữ liệu lớp rồi để frontend tự lọc “lớp của tôi”.
* Không nên coi workflow execution log là audit log nghiệp vụ.
* Không nên gửi email trước khi dữ liệu đã commit.
* Không nên ghi đè cả dataset mà không có staging, validation và reconciliation.

Cách phân chia tốt:

* **n8n:** orchestration và integration.
* **Database/API domain layer:** validation, state transition, authorization, transaction, idempotency.
* **Frontend:** hiển thị và gửi intent của người dùng.

Không nhất thiết phải xây một service lớn. Có thể dùng một API nhỏ/serverless functions hoặc backend managed đi cùng PostgreSQL.

---

# 8. API, authentication và authorization cho GitHub Pages

## Kiến trúc đề xuất

```text
React/Vite trên GitHub Pages
        ↓ HTTPS + access token
Backend API / serverless functions
        ↓
PostgreSQL
        ↓
Outbox → n8n → email/Sheets
```

GitHub Pages có thể tiếp tục được dùng. Vấn đề không nằm ở static frontend, mà ở việc frontend phải gọi một API được bảo vệ.

## Authentication

Ưu tiên dùng SSO của tổ chức:

* Google Workspace OIDC nếu giáo viên dùng tài khoản Google của IZONE.
* Hoặc một identity provider tương đương.

Luồng:

1. Người dùng đăng nhập với IdP.
2. Frontend nhận token theo Authorization Code + PKCE.
3. API xác minh:

   * Signature.
   * Issuer.
   * Audience.
   * Expiry.
   * Domain/email policy nếu dùng Google Workspace.
4. API map identity sang `users` và role/scope nội bộ.

Không nên:

* Chỉ kiểm tra email ở frontend.
* Lưu database password/API secret trong Vite environment variables.
* Đưa service account key vào bundle.
* Dùng URL bí mật làm cơ chế bảo vệ.
* Cho frontend gọi SQL hoặc Sheets bằng quyền service account.

## Authorization

Authorization phải thực hiện ở server hoặc database, không chỉ ẩn nút trên UI.

### Giáo viên

Được phép:

* Xem class/enrollment thuộc lớp được phân công.
* Xem review được giao cho mình.
* Gửi quyết định cho review đó.
* Không xem lớp khác bằng cách sửa `class_id` trên URL.

### Lead

Được phép:

* Xem toàn bộ lớp trong `khoi_id` của mình.
* Xem review và trạng thái của các GV trong khối.
* Xử lý/escalate/override nếu nghiệp vụ cho phép.

### Admin

* Quản lý user mapping, config, corrections và export.

Có thể thực hiện bằng:

* Authorization trong API query, hoặc
* PostgreSQL Row-Level Security.

RLS là một lớp phòng thủ tốt nếu dùng nền tảng hỗ trợ token claims, nhưng không bắt buộc. Điều bắt buộc là mọi query đều được scope theo identity đã xác minh.

## API tối thiểu

Không cần API quá lớn:

* `GET /me`
* `GET /classes`
* `GET /classes/{id}/students`
* `GET /classes/{id}/snapshots`
* `GET /reviews`
* `GET /reviews/{id}`
* `POST /reviews/{id}/decision`
* `GET /lead/summary?period=...`
* Admin/config endpoints chỉ khi thực sự cần.

Response phải chỉ chứa dữ liệu người dùng được phép xem. Không trả toàn bộ khối rồi lọc ở React.

---

# 9. Migration roadmap

## Phase 0 — Đo và ổn định hệ thống hiện tại

Mục tiêu: không migration theo giả định sai.

Thực hiện:

* Xuất và lưu version workflow n8n thật.
* Đo request count, batch size, runtime, retry và lỗi theo class.
* Thêm `run_id` xuyên suốt workflow.
* Tối ưu Sheets batching ngay.
* Chặn concurrent run cùng class.
* Chuẩn hóa phone/ID thành text.
* Ghi data quality report:

  * Duplicate key.
  * Invalid numeric/date.
  * Review/flag mismatch.
  * Label/current-state mismatch.
* Chốt grain và stable keys từ Portal.
* Chốt quy tắc chính xác của `Chưa đủ DL`.

Đây là phase bắt buộc, dù sau đó chuyển SQL.

## Phase 1 — Dựng SQL schema và backfill

* Tạo database/schema.
* Import 9 sheet vào staging tables.
* Chạy validation.
* Chuẩn hóa dữ liệu lỗi với mapping có audit.
* Backfill normalized tables.
* Tái tính derived state từ raw facts và config.
* So sánh với workbook, không im lặng copy cả lỗi workbook sang SQL.

Đầu ra cần có reconciliation report cho từng lớp:

* Student count.
* Enrollment count.
* Test count.
* Label distribution.
* Pass chuẩn/mềm.
* Review count.
* Weekly snapshot count.

## Phase 2 — Shadow write, Sheets vẫn là production source

Trong mỗi cron:

1. Workflow cũ tiếp tục cập nhật Sheets.
2. Cùng raw payload được gửi sang SQL.
3. SQL tự tính state.
4. Không cho frontend đọc SQL ở production.
5. So sánh SQL và Sheets sau mỗi run.

Đây không nên là “hai logic tính riêng”. Tốt nhất dùng cùng payload và cùng version rule; reconciliation phải chỉ ra khác biệt.

Thời gian đánh giá nên theo số chu kỳ dữ liệu, không chỉ số ngày. Cần bao phủ:

* Ít nhất một lần đổi nhãn.
* Tạo review.
* Review quá hạn.
* GV ra quyết định.
* Một lần retry hoặc failure có chủ đích.

## Phase 3 — Chuyển read path sang SQL

* API production đọc SQL.
* Frontend chuyển khỏi mock data.
* Sheets vẫn được workflow cũ duy trì để rollback.
* Bật authorization theo teacher/lead.
* Chạy canary với một số GV/Lead trước.
* Theo dõi API latency và authorization denial.

Ở phase này chưa nhất thiết chuyển quyết định review sang SQL nếu team muốn giảm rủi ro, nhưng thời gian giữ split state phải ngắn.

## Phase 4 — Chuyển write path của review

* Frontend submit decision qua API.
* SQL transaction ghi decision + audit + outbox.
* n8n gửi notification từ outbox.
* SQL xuất review status sang Sheets read-only.
* Dừng mọi chỉnh trực tiếp sheet review, hoặc khóa range.

Đây là mốc SQL trở thành source of truth đầy đủ.

## Phase 5 — Sheets trở thành projection/export

* Ngừng dual-write business state.
* Tạo job SQL → Sheets.
* Sheet có cột `exported_at`, `source_run_id`.
* Protected ranges.
* Nếu config còn chỉnh qua Sheets, dùng import workflow riêng có approval.
* Xóa quyền sửa các sheet fact và workflow state.

---

# 10. Rollback và dual-write strategy

## Nguyên tắc

Không duy trì dual-write vô thời hạn. Dual-write chỉ là cơ chế migration.

## Trước cutover

* Sheets là authoritative.
* SQL là shadow.
* Có thể xóa và rebuild SQL từ raw payload/Sheets nếu cần.

## Sau khi chuyển read sang SQL nhưng chưa chuyển review write

Rollback đơn giản:

* Đổi frontend/API feature flag về read từ Sheets adapter cũ.
* Không mất quyết định vì write vẫn ở hệ cũ.

## Sau khi chuyển review write sang SQL

Sheets không còn được phép nhận quyết định độc lập.

Rollback nên là:

1. Tạm đóng chức năng review hoặc chuyển sang read-only trong thời gian rollback.
2. Xuất toàn bộ decision mới từ SQL sang Sheets.
3. Xác nhận count và checksum.
4. Chuyển read/write adapter về hệ cũ nếu thực sự cần.

Không nên bật hai nơi cùng cho phép GV quyết định. Đây là nơi dual-write hai chiều dễ gây split-brain nhất.

## Feature flags cần có

* `READ_SOURCE = sheets | sql`
* `REVIEW_WRITE_SOURCE = sheets | sql`
* `EXPORT_TO_SHEETS = on | off`
* Có thể canary theo user hoặc class.

---

# 11. Metric để quyết định Go/No-Go

## Data correctness

**Go** khi:

* 100% class/student/enrollment keys map được.
* Test detail reconciliation đạt 100%, ngoại trừ lỗi nguồn đã ghi nhận.
* Label và pass result match 100% theo rule version đã chốt.
* Không có duplicate active review.
* Không có orphan FK.
* Mọi khác biệt đều có reason code, không có “unknown mismatch”.

Không nên đặt mục tiêu 99% cho quyết định pass. Một mismatch chưa giải thích được có thể là một học viên bị xử lý sai.

## Idempotency

* Replay cùng payload 2–3 lần không làm tăng:

  * Test attempts.
  * Label events.
  * Reviews.
  * Snapshots.
  * Emails.
* Double-click decision chỉ tạo một quyết định.

## Reliability

* Tỷ lệ sync thành công theo class ≥ 99,5% trong giai đoạn thử nghiệm.
* Partial failure được cô lập theo class.
* Recovery không cần chỉnh trực tiếp DB trong tình huống thông thường.
* Outbox không có event mắc kẹt quá SLA.

## Performance

Các ngưỡng có thể chốt theo trải nghiệm, ví dụ:

* API dashboard p95 dưới 1 giây cho query thông thường.
* Màn hình lớp p95 dưới 1,5 giây.
* Daily sync hoàn thành trước cửa sổ vận hành đã quy định.
* Export Sheets không ảnh hưởng API production.

Không nên lấy tốc độ nhanh hơn Sheets làm điều kiện duy nhất.

## Security

* GV thử truy cập class ID khác nhận 403 hoặc không thấy resource.
* Lead chỉ xem đúng khối.
* Không có PII trong bundle hoặc public static files.
* Không có secret trong frontend.
* Audit đủ để xác định ai quyết định pass, lúc nào và dựa trên version dữ liệu nào.

## Operability

* Có dashboard/log cho sync run.
* Có alert khi một lớp thất bại.
* Có hướng dẫn replay một class.
* Có backup và thử restore.
* Team vận hành xử lý được mà không cần sửa dữ liệu thủ công trong Sheets.

---

# 12. Các giả định rủi ro và câu hỏi phải chốt

## Khóa dữ liệu

1. `student_id` và `student_code` có thực sự luôn giống nhau không, hay chỉ trùng trong mẫu?
2. Học viên có thể học lại cùng một lớp hoặc tái đăng ký không?
3. Portal có registration ID ổn định không?
4. `class_test_id` xác định test definition hay từng kết quả của học viên?
5. Portal có grade/attempt ID riêng không?
6. Thi lại có thể xảy ra nhiều hơn một lần không?

## Quy tắc nghiệp vụ

7. Chính xác khi nào là `Chưa đủ DL`?
8. Nhóm 3 pass mềm có cần tạo review hay tự động pass?
9. Sau khi review quá hạn, GV còn được quyết định không?
10. Lead có quyền override quyết định GV không?
11. Nếu dữ liệu Portal thay đổi sau khi GV đã duyệt, review cũ:

    * Giữ nguyên?
    * Mở lại?
    * Tạo review cycle mới?
12. Thay đổi config có áp dụng hồi tố cho toàn bộ lịch sử không?
13. `nhan_benchmark` là nhãn đầu vào hay nhãn dùng để hiển thị?
14. Weekly snapshot được tạo vào ngày cố định, theo checkpoint hay cả hai?
15. Có cần lưu raw Portal payload để điều tra và replay không?

## Ownership và vận hành

16. Ai được quyền thay đổi config?
17. Có cần hai bước maker-checker cho config pass không?
18. Lead được xem toàn khối hay nhiều khối?
19. Có giáo viên đồng giảng hoặc thay giáo viên giữa khóa không?
20. Email nào là identity chính thức của giáo viên?
21. Người dùng có đều thuộc Google Workspace của IZONE không?
22. Thời hạn lưu PII và log là bao lâu?
23. Có yêu cầu xóa/ẩn dữ liệu học viên nghỉ hoặc chuyển lớp không?

## Runtime n8n

24. Hiện workflow ghi bao nhiêu request cho mỗi lớp?
25. Có batchUpdate chưa?
26. Có overlap execution không?
27. Retry policy hiện tại là gì?
28. Khi gửi email thất bại, workflow có chạy lại toàn bộ tính toán không?
29. Có manual execution và cron chạy trùng nhau không?
30. Có cách lấy incremental changes từ Portal hay bắt buộc full fetch?

---

# Quyết định đề xuất cho team

**Chốt target architecture là hybrid: PostgreSQL source of truth + API có authentication/authorization + n8n làm integration engine + Sheets làm projection/report/admin có kiểm soát.**

Thứ tự ưu tiên:

1. Đo workflow thật và tối ưu batching.
2. Chốt stable keys và các quy tắc còn mơ hồ.
3. Dựng SQL với constraint, idempotency, transaction và outbox ngay từ đầu.
4. Shadow-write và reconciliation trước khi chuyển frontend.
5. Chuyển read path sang API.
6. Chuyển review write sang SQL.
7. Hạ Sheets thành export, không để tồn tại hai source of truth.

**Không nên chờ đến khi quota Sheets gây sự cố mới chuyển.** Quota có thể chưa phải bottleneck, nhưng inconsistency, security và workflow state đã là bottleneck kiến trúc ngay ở hiện tại.

# Học viên chuyển lớp: mất khả năng hiển thị lại ở lớp cũ

**Ngày phát hiện:** 2026-08-08
**Bối cảnh phát hiện:** review luồng n8n đẩy dữ liệu `test_scores`, phát hiện batch test của lớp `1067` có `class_id` không khớp `students.class_id` hiện tại của 2/3 học viên trong batch — dẫn tới việc rà lại thiết kế schema và phát hiện đây là hạn chế kiến trúc có chủ đích (đã bị cắt khỏi bản thiết kế gốc), không phải bug của n8n.

## 1. Tóm tắt

Schema hiện tại (`backend/prisma/schema.prisma`) lưu **quan hệ "học viên – lớp" bằng một cột FK duy nhất** (`students.class_id`). Khi học viên chuyển lớp, cột này bị **ghi đè** — không có cơ chế nào lưu lại lớp cũ. Hệ quả: sau khi chuyển lớp, học viên **biến mất khỏi mọi màn hình/API hiển thị roster của lớp cũ**, dù dữ liệu chi tiết (điểm test, chuyên cần, BTVN...) của họ khi còn ở lớp đó vẫn còn nguyên trong DB, không hề bị xoá.

Đây không phải bug — là hạn chế đã biết, bắt nguồn từ việc bảng `enrollments` trong bản thiết kế gốc (`docs/research/2026-08-04-oracle-sheets-sql-decision.md` §4.3) đã bị lược bỏ khi hiện thực hoá schema thật (ghi chú tại `ARCHITECTURE.md:232`).

## 2. Nguyên nhân gốc

`students.class_id` (`backend/prisma/schema.prisma:190`) là **1 cột Int FK duy nhất** → tại một thời điểm, mỗi học viên chỉ có thể gắn với đúng 1 `class_id` trong hệ thống. Chuyển lớp = `UPDATE students SET class_id = <lớp mới>`, ghi đè giá trị cũ, không lưu vết.

Bản thiết kế đầy đủ ban đầu tách riêng:
- `students` — chỉ định danh (không có `class_id`)
- `enrollments` — quan hệ N-N theo thời gian, có `admitted_at`/`ended_at`, hỗ trợ cả lịch sử tuần tự lẫn học chồng lớp

Bản hiện tại đã gộp `class_id` thẳng vào `students` cho gọn, đánh đổi lấy việc **mất lịch sử enrollment**.

## 3. Bằng chứng thực tế (verify trên VPS)

Kiểm tra trực tiếp trên `izone_postgres_prod` (2026-08-08), batch test của n8n cho lớp `1067`:

| `student_id` | `class_id` trong batch test | `class_id` thật hiện tại trong `students` |
|---|---|---|
| 16975 | 1067 | **1185** |
| 17067 | 1067 | 1067 (khớp) |
| 17182 | 1067 | **1167** |

→ 2/3 học viên đã học thêm hoặc chuyển lớp kể từ lúc thi. Dữ liệu vẫn insert được bình thường (FK vẫn hợp lệ vì `1067` là lớp có thật) nhưng nếu tra theo `students.class_id` hiện tại, sẽ **không tìm lại được** 2 học viên này dưới lớp `1067` nữa.

## 4. Phạm vi ảnh hưởng

Mọi bảng "sự kiện" (`test_scores`, `student_daily_records`, `contact_logs`, `label_change_logs`, `pass_reviews`) đều **tự lưu `class_id` riêng trên từng dòng, độc lập với `students.class_id`** — dữ liệu thô của các bảng này **không mất**, vẫn ghi đúng lớp tại thời điểm phát sinh.

Cái bị ảnh hưởng là các query/API dựng "trạng thái hiện tại" bằng cách join qua `students.class_id`:

- **`GET /api/students/by-class/:classId`** (`ARCHITECTURE.md:128`) — dùng view `v_student_latest`.
- **View `v_student_latest`** (`database/migrations/005_optimize_schema.sql:207-226`): lấy `student_daily_records` mới nhất theo `student_id` (`DISTINCT ON (r.student_id) ... ORDER BY r.record_date DESC`), rồi `JOIN classes c ON c.class_id = st.class_id` — dùng `class_id` **hiện tại** của học viên, không dùng `r.class_id` (class_id lịch sử trên chính dòng record). Ngay cả nếu sửa để join qua `r.class_id`, `DISTINCT ON` vẫn chỉ lấy **1 dòng mới nhất toàn cục mỗi học viên** (không scope theo lớp đang query) — nên không thể chỉ đổi 1 điều kiện WHERE là xong, cần viết lại logic.
- Tương tự cho `v_class_latest` và mọi chỗ khác lọc roster theo `students.class_id`.

**Không bị ảnh hưởng:** `class_daily_snapshots` của lớp cũ ở các ngày trước khi chuyển vẫn là snapshot đông cứng theo thời điểm, không bị tính lại — KPI lịch sử của lớp cũ vẫn đúng.

## 5. Phương án xử lý

### Phương án A — Bảng log nhỏ `class_change_logs`

Thêm bảng log kiểu `(student_id, from_class_id, to_class_id, changed_at)`, ghi mỗi khi `students.class_id` bị update — tương tự cách `label_change_logs` đang ghi lại chuyển nhãn.

- Chi phí thấp, không đụng bảng hiện có.
- **Chỉ giải quyết phần "biết được sự kiện chuyển lớp đã xảy ra"**, không tự làm học viên hiện lại ở view lớp cũ — vẫn cần sửa riêng các query hiển thị roster lịch sử (mục 4) để dùng `class_id` lịch sử từ chính bảng sự kiện (`test_scores`/`student_daily_records`) hoặc từ log này, thay vì `students.class_id`.

### Phương án B — Bảng `enrollments` đầy đủ (theo thiết kế gốc)

Tách `class_id` ra khỏi `students`, đưa vào bảng `enrollments` riêng (`student_id`, `class_id`, `admitted_at`, `ended_at`...).

- Đúng chuẩn, hỗ trợ được cả trường hợp học chồng 2 lớp cùng lúc (không chỉ chuyển tuần tự).
- Tốn công hơn nhiều: phải sửa **mọi** endpoint/view đang join qua `students.class_id` (`v_student_latest`, `v_class_latest`, các bảng sự kiện có `class_id` FK trực tiếp vào `students`...) sang join qua `enrollments`.

## 6. Khuyến nghị

Nếu chỉ cần "không mất dấu vết học viên đã ở lớp nào" ở mức audit/tra cứu thủ công → Phương án A đủ dùng, triển khai nhanh.

Nếu sản phẩm cần hiển thị đúng roster lịch sử của từng lớp (vd: "xem lại lớp A hồi tháng 3 có những ai") như một tính năng thật trong dashboard, hoặc cần hỗ trợ học chồng lớp → nên làm thẳng Phương án B, tránh phải làm A rồi sau này làm lại B từ đầu.

## 7. Việc cần làm tiếp (chưa triển khai, cần đội kỹ thuật quyết định hướng trước)

- [ ] Chốt phương án A hay B với product/lead.
- [ ] Nếu chọn A: thiết kế bảng `class_change_logs`, thêm hook ghi log vào chỗ hiện đang update `students.class_id` (chưa xác định vị trí — chưa có endpoint/service nào update field này trong `backend/src` tại thời điểm viết báo cáo, cần grep lại khi bắt tay code).
- [ ] Nếu chọn A: sửa các query "xem lớp cũ" để lấy `class_id` lịch sử từ `test_scores`/`student_daily_records` thay vì `students.class_id`.
- [ ] Nếu chọn B: thiết kế migration tách `enrollments`, rà soát toàn bộ nơi đang FK/join trực tiếp vào `students.class_id` để cập nhật.

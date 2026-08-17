# Thiết kế bộ skill nghiệp vụ gán nhãn học viên

**Ngày:** 2026-08-17  
**Phạm vi:** Bộ agent skill mô-đun thực hiện nghiệp vụ gán nhãn học viên từ PostgreSQL  
**Quyết định:** Dùng một skill điều phối và bảy skill chuyên trách; cho phép tự cập nhật dữ liệu sau dry-run, backup và kiểm tra an toàn.

## 1. Mục tiêu

Bộ skill chuẩn hóa việc đọc dữ liệu, kiểm tra chất lượng, gán nhãn, đánh giá Pass, đề xuất can thiệp, cập nhật PostgreSQL và tạo audit. PostgreSQL là nguồn dữ liệu chính. `database/master.json` là workflow n8n đồng bộ Teachers, Classes và Students, không phải kho lưu nhãn học viên.

## 2. Kiến trúc

```text
PostgreSQL
  -> syncing-student-data
  -> validating-label-inputs
  -> classifying-students
  -> evaluating-student-passes
  -> planning-student-interventions
  -> recording-label-transitions
  -> auditing-label-updates
```

`orchestrating-student-labeling` kiểm soát thứ tự trên và không tự tính nghiệp vụ. Một đợt ghi chỉ được phép chạy khi validation, dry-run và backup đều thành công.

### Các nguyên tắc bất biến

- Đọc ngưỡng từ cấu hình hệ thống; chỉ dùng mặc định `45/60/90/90` khi chính sách cho phép.
- Chỉ học viên `on_going` được đưa vào hàng đợi can thiệp.
- Thiếu điểm test hợp lệ là `no_data`, không phải `0` hoặc Xám.
- Loại kết quả có dấu hiệu cheating khỏi phép tính.
- Chỉ tính lại nhãn tại checkpoint chính thức.
- Ghi nhãn và nhật ký trong một transaction; lỗi làm rollback toàn đợt.
- Tạo backup và change plan trước commit.
- Không sửa hoặc xóa lịch sử checkpoint cũ.
- Khi nguồn mâu thuẫn, ưu tiên quy tắc mới hơn đã được kiểm thử trong code; nếu không phân xử được thì chặn ghi.

## 3. Trách nhiệm các skill

### `orchestrating-student-labeling`

Nhận phạm vi theo `studentId`, `classId`, `courseId` hoặc checkpoint; gọi đúng skill con; chặn mọi đường tắt bỏ qua validation, dry-run hoặc backup.

### `syncing-student-data`

Đọc học viên, lớp, test, chuyên cần, BTVN, cấu hình và checkpoint từ PostgreSQL; chuẩn hóa kiểu dữ liệu, phần trăm và trạng thái đăng ký; giữ nguyên giá trị thiếu.

### `validating-label-inputs`

Kiểm tra phạm vi lớp, trạng thái học viên, test hợp lệ, cheating, checkpoint, bản ghi trùng và cấu hình ngưỡng. Trả `valid`, `warning` hoặc `blocked` kèm mã lỗi.

### `classifying-students`

- Test `<45`: Xám.
- Test `45–<60`: Đỏ.
- Test `>=60`: Vàng.
- Không có test hợp lệ: Chưa có dữ liệu.
- Chuyên cần/BTVN không đổi màu nhãn test nhưng tạo issue và mức can thiệp.
- Giữ mọi issue phụ dù chỉ chọn một mức can thiệp cao nhất.

### `evaluating-student-passes`

- Pass chuẩn: test trung bình `>=60`, chuyên cần `>=90%`, BTVN `>=90%`.
- Pass mềm Nhóm 1: test `50–54`, chuyên cần và BTVN `100%`, cần xác nhận tiến bộ của GV.
- Pass mềm Nhóm 2: test `55–59`, chuyên cần và BTVN `>=90%`, cần xác nhận tiến bộ của GV.
- Pass mềm Nhóm 3: test `>=60`; ghi riêng theo chính sách Pass mềm, không thay thế kết quả Pass chuẩn.
- Không tự suy trạng thái “có tiến bộ” khi thiếu nhận xét của GV.

### `planning-student-interventions`

- Xám: `level_3`, rà soát lại lộ trình.
- Đỏ: `level_2`, theo sát.
- Vàng hoặc `no_data` có ĐH/BTVN yếu hay đang giảm: `level_1`, nhắc thói quen học tập.
- Ưu tiên độc quyền: `level_3 > level_2 > level_1 > none`.
- Tạo hành động và mẫu Zalo nhưng không tự gửi tin.

### `recording-label-transitions`

So sánh nhãn mới/cũ; lập change plan; cập nhật nhãn và append nhật ký trong cùng transaction. Chỉ ghi khi nhãn đổi hoặc chính sách yêu cầu snapshot checkpoint.

### `auditing-label-updates`

Tạo backup có định danh đợt chạy và checksum; đối chiếu change plan với kết quả; xuất audit; khôi phục backup khi kiểm tra sau ghi thất bại.

## 4. Hợp đồng dữ liệu giữa các skill

Mỗi skill nhận và trả JSON có schema cố định:

| Artifact | Nội dung |
|---|---|
| `run-manifest.json` | Phạm vi, checkpoint, phiên bản quy tắc, ngưỡng |
| `normalized-input.json` | Dữ liệu nguồn đã chuẩn hóa |
| `validation-report.json` | Lỗi, cảnh báo, bản ghi bị chặn |
| `classification-plan.json` | Nhãn, Pass, issues, can thiệp dự kiến |
| `backup-manifest.json` | Vị trí backup, checksum, số bản ghi |
| `change-plan.json` | Diff đầy đủ trước khi ghi |
| `audit-report.json` | Kết quả xác minh sau transaction |

Audit của mỗi thay đổi phải có học viên, lớp, checkpoint, nhãn cũ/mới, trạng thái Pass, can thiệp, dữ liệu nguồn, ngưỡng, lý do và thời điểm.

## 5. Xử lý lỗi

- `blocked`: cấu hình sai, checkpoint sai, trùng dữ liệu không phân giải được, mất kết nối hoặc backup thất bại. Không ghi dữ liệu.
- `warning`: thiếu dữ liệu không thiết yếu. Có thể tiếp tục nhưng phải xuất audit.
- `no_data`: trạng thái nghiệp vụ khi thiếu test hợp lệ, không phải lỗi hệ thống.
- Mất kết nối hoặc sai số lượng bản ghi trong transaction: rollback.
- Kiểm tra sau ghi không khớp change plan: rollback hoặc khôi phục backup.
- Không chấp nhận partial success không được báo cáo.

## 6. Kiểm thử

Mỗi skill được phát triển theo RED-GREEN-REFACTOR và có baseline test riêng trước khi viết nội dung.

- Biên nhãn: `44.99`, `45`, `59.99`, `60`.
- Thiếu test không trở thành `0` hoặc Xám.
- Kết quả cheating không được dùng.
- Học viên inactive không vào queue.
- Ưu tiên `level_3 > level_2 > level_1 > none`.
- Pass chuẩn và ba nhóm Pass mềm đúng biên.
- Không chuyển nhãn ngoài checkpoint.
- Rollback khi một bản ghi thất bại.
- Backup tồn tại và checksum hợp lệ trước commit.
- Audit khớp dữ liệu đã ghi.
- Orchestrator không bỏ qua validation, dry-run hoặc backup dưới áp lực chạy gấp.

## 7. Cấu trúc triển khai

Mỗi thư mục skill gồm `SKILL.md`, `agents/openai.yaml` và chỉ các `references/` hoặc `scripts/` thực sự cần thiết. Nội dung nguồn từ `report/` và DOCX được chắt lọc thành quy tắc chuẩn, có chỉ dẫn nguồn và mức ưu tiên; không sao chép nguyên tài liệu dài vào context.

Các script chỉ được bổ sung cho thao tác cần tính quyết định hoặc an toàn lặp lại, gồm đọc PostgreSQL, tạo backup/checksum, lập change plan, ghi transaction và xác minh sau ghi. Thông tin kết nối lấy từ biến môi trường; không ghi credential vào skill hoặc artifact.

## 8. Tiêu chí hoàn thành

- Cả tám skill được khởi tạo bằng công cụ chuẩn và validate thành công.
- Mỗi skill có bài kiểm thử baseline thất bại và bài kiểm thử sau triển khai đạt.
- Quy tắc trong skill phù hợp tài liệu mới nhất và labeling engine hiện tại.
- Dry-run tạo diff đầy đủ trước mọi cập nhật.
- Không có đường ghi PostgreSQL thiếu backup, transaction hoặc audit.
- Các thay đổi hiện có ngoài phạm vi không bị sửa.
  
# Thiết kế tập lớp hoạt động theo kỳ trên Lead Dashboard

## Mục tiêu

Khi Lead chọn một tháng báo cáo, Master Table và toàn bộ số liệu Lead Dashboard phải sử dụng các lớp thực sự có hoạt động trong tháng đó, thay vì luôn lọc theo trạng thái hiện tại `on_going`.

## Nguồn sự thật

Trường `classes.ending_date` không có dữ liệu đáng tin cậy trong database production. Vì vậy, hệ thống xác định lớp hoạt động trong kỳ bằng bằng chứng snapshot:

```text
Lớp hoạt động trong tháng = có ít nhất một class_daily_snapshots.snapshot_date
                           nằm từ ngày đầu đến ngày cuối tháng được chọn
```

Điều kiện này bao gồm cả lớp hiện đang `on_going` và lớp hiện đã `completed`, miễn là có snapshot trong kỳ.

## Quy tắc chọn lớp

Một lớp được đưa vào Lead Dashboard khi đồng thời thỏa mãn:

- `classes.course_id = 2`.
- Giáo viên của lớp thuộc `khoi_id` mà tài khoản Lead được phân quyền.
- Trạng thái hiện tại thuộc `on_going` hoặc `completed`.
- Tồn tại ít nhất một `class_daily_snapshots` của lớp trong tháng được chọn.
- Nếu request có `teacherId` hoặc `classId`, lớp vẫn phải thỏa bộ lọc tương ứng.

Lớp `pending` hoặc `cancelled` bị loại ngay cả khi có snapshot trong tháng. Lớp `on_going` nhưng không có snapshot trong tháng cũng bị loại vì không có bằng chứng hoạt động trong kỳ.

Snapshot ở đúng ngày đầu hoặc ngày cuối tháng được tính vào kỳ.

## Backend

### Tập lớp chuẩn của kỳ

`getLeadDashboard` xây dựng một tập lớp duy nhất dựa trên `EXISTS` với `class_daily_snapshots` trong khoảng ngày đầu–cuối tháng. Tập này thay thế điều kiện `c.status = classStatus` hiện đang lặp trong các query.

Mọi query phục vụ Lead Dashboard phải giới hạn về cùng tập lớp:

- `classRows`.
- `snapshotRows`.
- `studentMetricRows`.
- `transitionRows`.
- `coverageStudentRows`.
- `coverageTestRows`.
- `contactLogRows`.

`configRows` không liên quan đến lớp và không nhận điều kiện mới.

### Biên thời gian

- Điều kiện xác nhận lớp hoạt động dùng toàn bộ tháng: từ ngày đầu đến ngày cuối tháng.
- Dữ liệu metric/snapshot trả về vẫn tuân theo `currentAsOf`/`reportAsOf` hiện có, không đọc dữ liệu tương lai chỉ vì lớp có snapshot ở phần sau của tháng.
- Các quy tắc `snapshot_stage IS NULL`, học viên đang học, course, khoi, teacher và class đang có phải được giữ nguyên tại những query tương ứng.

### API contract

- Frontend không còn gửi `classStatus: 'on_going'` cho Lead Dashboard.
- `classStatus` được loại khỏi `LeadDashboardQuery` nếu không còn consumer hợp lệ.
- Response contract không thay đổi.

## Frontend

- `LeadDashboard` tiếp tục gửi `period` và `khoiId`.
- Master Table tiếp tục lấy giao giữa `dashboard.classes` và danh sách `/classes`; `dashboard.classes` là tập lớp chuẩn theo kỳ.
- Khi đổi tháng, bảng, KPI và biểu đồ cùng cập nhật theo response mới, không có bộ lọc trạng thái cố định phía trình duyệt.
- Không thêm control UI mới.

## Tính nhất quán số liệu

Master Table, KPI, trend, phân bố nhãn, pass và contact coverage phải dùng cùng tập lớp theo kỳ. Không query nào được tiếp tục lọc bằng trạng thái hiện tại `on_going` theo cách khiến một lớp completed trong tháng xuất hiện ở chỗ này nhưng biến mất ở chỗ khác.

## Trạng thái không có dữ liệu

- Nếu không lớp nào có snapshot trong tháng, dashboard trả tập lớp rỗng và dùng trạng thái “không có dữ liệu kỳ” hiện tại.
- Đây không phải lỗi API và không tự động quay về các lớp đang chạy hiện tại.
- Một lớp có snapshot trong tháng nhưng thiếu student metrics vẫn xuất hiện; cơ chế data quality/fallback hiện có quyết định cách hiển thị metric của lớp.

## Kiểm chứng

Backend cần test các trường hợp:

- Lớp `on_going` có snapshot trong tháng được chọn.
- Lớp `completed` có snapshot trong tháng được chọn.
- Lớp chỉ có snapshot ở tháng khác bị loại.
- Lớp `pending` hoặc `cancelled` có snapshot trong tháng vẫn bị loại.
- Snapshot đúng ngày đầu và ngày cuối tháng được tính.
- Query metric không đọc record sau `currentAsOf`.
- Tất cả query theo lớp dùng cùng điều kiện tập lớp.

Frontend cần kiểm tra request không còn gửi `classStatus` và Master Table hiển thị đúng tập `dashboard.classes` khi đổi kỳ.

## Ngoài phạm vi

- Backfill `classes.ending_date`.
- Thay đổi `course_id = 2` hoặc phân quyền `khoi_id`.
- Hiển thị lớp `pending`/`cancelled`.
- Thêm bộ lọc trạng thái lớp mới trên giao diện.
- Thay đổi công thức KPI hoặc quy tắc data-quality ngoài việc thay tập lớp đầu vào.

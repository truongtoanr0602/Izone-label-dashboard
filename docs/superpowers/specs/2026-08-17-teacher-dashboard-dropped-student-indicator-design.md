# Thiết kế nhận diện học viên đã nghỉ trên Teacher Dashboard

## Mục tiêu

Giúp giáo viên nhận ra ngay học viên đã chuyển sang `dropped` mà vẫn giữ được dữ liệu học tập lịch sử. Học viên đã nghỉ tiếp tục xuất hiện trong danh sách `Tất cả`, nhưng không được trình bày như một trường hợp đang cần can thiệp.

## Phạm vi

- Áp dụng cho bảng học viên trên Teacher Dashboard.
- Dùng `registrationStatus === 'dropped'` đã có trong dữ liệu màn hình làm nguồn sự thật.
- Không thay đổi công thức performance, dữ liệu điểm, nhãn lịch sử hoặc API contract.
- Không mở rộng sang các trạng thái khác trong lần triển khai này.

## Thiết kế hàng học viên đã nghỉ

### Dấu hiệu nhận diện chính

- Hiển thị badge `Đã nghỉ` ngay cạnh tên học viên.
- Badge dùng màu slate/xám trung tính, nền nhẹ, viền 1px và `rounded-[8px]` để phân biệt đây là trạng thái hành chính, không phải cảnh báo rủi ro.
- Badge luôn có chữ; không phụ thuộc riêng vào màu sắc hoặc icon.

### Phân cấp thị giác

- Toàn bộ hàng dùng nền trung tính rất nhẹ và giảm độ nổi của avatar, chữ phụ, thanh tiến độ và điểm số.
- Tên học viên và dữ liệu lịch sử vẫn đủ tương phản để đọc; không dùng opacity cho toàn bộ hàng vì sẽ làm giảm khả năng truy cập.
- Không dùng màu đỏ, animation, gradient hoặc shadow mới.
- Trạng thái `dropped` được ưu tiên hơn màu nền cảnh báo của nhãn đỏ/xám để hàng không còn tạo cảm giác cần xử lý khẩn cấp.

### Cột Trạng thái

- Với học viên đang học, giữ nguyên nội dung `Pass`, `Xét chờ Review` hoặc `Chưa đạt`.
- Với học viên `dropped`, hiển thị `Đã nghỉ` trong cột này thay cho trạng thái đánh giá hiện tại.
- Kết quả đánh giá và lý do cũ vẫn có thể xem trong phần chi tiết mở rộng; không xóa dữ liệu lịch sử.

### Cột Hành động

- Không hiển thị hành động nhắc Zalo hoặc ghi nhận liên hệ cho học viên `dropped`.
- Thay vùng hành động bằng dòng chữ trung tính `Không cần can thiệp`.
- Hàng vẫn có thể mở phần chi tiết để giáo viên xem lịch sử học tập.

## Hiển thị, lọc và sắp xếp

- Học viên `dropped` vẫn xuất hiện mặc định trong bộ lọc `Tất cả`.
- Khi cùng xuất hiện trong một danh sách, học viên đang học đứng trước và học viên đã nghỉ nằm cuối bảng; trong mỗi nhóm giữ nguyên quy tắc sắp xếp hiện có.
- Học viên đã nghỉ không xuất hiện trong các bộ lọc cảnh báo hoặc danh sách hành động cần xử lý.
- Không tính học viên đã nghỉ vào số hành động còn lại và các số đếm can thiệp.
- Không thêm cột mới để tránh làm bảng test vốn rộng trở nên chật hơn.

## Responsive và dark mode

- Trên màn hình hẹp, badge `Đã nghỉ` vẫn nằm cạnh hoặc ngay dưới tên để không phụ thuộc vào cột Trạng thái có thể nằm ngoài viewport ngang.
- Dùng đúng cặp màu surface, border, text muted hiện có trong `Design.md` cho light/dark mode.
- Nội dung `Không cần can thiệp` được phép xuống dòng, không làm tăng chiều rộng tối thiểu của bảng.

## Quy tắc dữ liệu và trạng thái biên

- Nếu học viên `dropped` vẫn còn nhãn đỏ, dữ liệu nhãn được giữ nguyên nhưng không phát animation hoặc màu nền khẩn cấp.
- Nếu học viên không có snapshot mới nhất, badge `Đã nghỉ` vẫn hiển thị vì lấy từ `registrationStatus`, không phụ thuộc `recordDate`.
- Nếu trạng thái thay đổi lại thành `on_going`, hàng trở về cách hiển thị và hành động hiện tại mà không cần dữ liệu phụ.

## Kiểm chứng

- Kiểm tra hàng `on_going` không thay đổi về badge, trạng thái và hành động.
- Kiểm tra hàng `dropped` có badge cạnh tên, cột Trạng thái là `Đã nghỉ`, không có hành động liên hệ và vẫn mở được chi tiết.
- Kiểm tra học viên `dropped` có nhãn đỏ không còn mang visual urgency.
- Kiểm tra thứ tự: đang học trước, đã nghỉ sau trong `Tất cả`.
- Kiểm tra các bộ lọc cảnh báo và số hành động không chứa học viên đã nghỉ.
- Render ở light/dark mode và viewport desktop/mobile.
- Chạy `tsc -b`, `lint`, `test`, `build` trong `dashboard/` khi triển khai.

## Ngoài phạm vi

- Thay đổi công thức performance hoặc cách backend lọc `dropped`.
- Tạo bộ lọc riêng `Đã nghỉ`.
- Thiết kế chung cho `transferred`, `on_hold`, `cancelled` hoặc các trạng thái hành chính khác.

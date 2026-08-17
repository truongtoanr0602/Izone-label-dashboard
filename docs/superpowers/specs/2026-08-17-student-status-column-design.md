# Thiết kế cột Trạng thái học viên

## Mục tiêu

Làm rõ ý nghĩa của cột đang hiển thị các kết quả `Pass`, `Xét chờ Review` và `Chưa đạt`, đồng thời giúp trạng thái chưa đạt dễ nhận biết như hai trạng thái còn lại.

## Thay đổi giao diện

- Đổi header gộp `Trạng thái / Hành động` thành hai vùng rõ nghĩa: cột kết quả đánh giá có header `Trạng thái`; hai cột điều khiển kế tiếp dùng header `Hành động` với `colSpan={2}`.
- Giữ nguyên badge xanh của `Pass` và badge vàng của `Xét chờ Review`.
- Hiển thị `Chưa đạt` bằng badge đỏ nhạt, viền đỏ 1px, bo `rounded-[8px]`, có icon cảnh báo và hỗ trợ dark mode.
- Giữ lý do chưa đạt ở dòng phụ ngay dưới badge, dùng màu chữ giảm nhấn để bảng vẫn có phân cấp thị giác rõ ràng.
- Không thay đổi dữ liệu, điều kiện xác định trạng thái, bộ lọc hay hành động của bảng.

## Khả năng truy cập và responsive

- Badge dùng cả chữ và icon nên không phụ thuộc riêng vào màu sắc.
- Không thay đổi số cột hoặc cách ẩn/hiện trên mobile; chỉ phân bổ lại nhãn header theo đúng các ô hiện có.

## Kiểm chứng

- Chạy `tsc -b`, `lint`, `test`, `build` trong `dashboard/`.
- Render bảng học viên, kiểm tra ba trạng thái ở light/dark mode và xác nhận lý do chưa đạt không bị mất hoặc tràn bất thường.

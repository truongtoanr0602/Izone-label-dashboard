# Thiết kế AGENTS.md dùng CLAUDE.md làm nguồn sự thật

**Ngày:** 2026-08-17  
**Phạm vi:** Hướng dẫn agent ở root repository

## Quyết định

`AGENTS.md` chỉ đóng vai trò con trỏ. `CLAUDE.md` ở root là nguồn sự thật duy
nhất cho toàn bộ hướng dẫn dự án; không sao chép nội dung từ `CLAUDE.md` sang
`AGENTS.md` để tránh hai bản bị lệch nhau.

## Nội dung bắt buộc

- Yêu cầu agent đọc toàn bộ `CLAUDE.md` trước khi khám phá code, sửa file, chạy
  lệnh hoặc review.
- Yêu cầu đọc các tài liệu được `CLAUDE.md` dẫn chiếu khi nhiệm vụ liên quan,
  gồm `ARCHITECTURE.md`, `Design.md` và các skill dự án.
- Chỉ cập nhật hướng dẫn dự án trong `CLAUDE.md`; không duy trì bản sao trong
  `AGENTS.md`.
- Khi có mâu thuẫn giữa hai file, `CLAUDE.md` thắng.
- Chỉ thị hệ thống/developer và yêu cầu trực tiếp mới nhất của người dùng vẫn
  có độ ưu tiên cao hơn tài liệu repository.

## Tiêu chí hoàn thành

- `AGENTS.md` ngắn, không lặp lại quy tắc chi tiết.
- Liên kết tương đối đến `CLAUDE.md` hoạt động.
- Nội dung không làm thay đổi `CLAUDE.md`.

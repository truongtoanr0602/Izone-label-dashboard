---
date: 2026-08-19
scope: VPS production deploy — dashboard Docker build
status: resolved
commits: 0e35d3f, ebddae0
---

# VPS dashboard build thiếu selector bị `.gitignore` bỏ qua

## Symptom

Dashboard Docker build thất bại với `TS2307: Cannot find module
'./studentTable'`; các kiểu dữ liệu dùng từ module này sau đó bị suy luận thành
`any` và tạo thêm nhiều lỗi TypeScript trong `StudentTable.tsx`.

## Root cause

Rule `data/` trong `.gitignore` khớp cả `dashboard/src/data/`. Hai file
`dashboard/src/data/selectors/studentTable.ts` và `studentTable.test.ts` tồn tại
trên máy phát triển nên local build vẫn đạt, nhưng bị Git bỏ qua và không có
trong commit `0e35d3f`. VPS build từ Git sạch nên thiếu module.

## Fix

Force-add hai file source/test bị bỏ sót và push commit `ebddae0` lên
`origin/main`. Không chỉnh dữ liệu hoặc PostgreSQL.

## Verify

- Local TypeScript, targeted tests và production build đều đạt.
- Docker Compose build `backend dashboard` trên VPS đạt.
- Recreate riêng hai service bằng `--no-deps`; PostgreSQL không bị tác động.
- Backend khởi động thành công; API không có token trả `401` JSON như kỳ vọng.
- Public JS/CSS trả lần lượt `application/javascript` và `text/css`.

## Deploy-mechanics gotcha

Khi thêm source dưới `dashboard/src/data/`, luôn chạy `git check-ignore -v`
và xác nhận file xuất hiện trong `git ls-files`. Local build thành công không
đảm bảo Docker/VPS build thành công nếu source cần thiết chỉ tồn tại dưới dạng
file ignored.

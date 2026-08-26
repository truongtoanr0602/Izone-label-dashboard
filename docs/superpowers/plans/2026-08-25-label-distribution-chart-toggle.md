# Label Distribution Chart Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho phép Lead chuyển giữa biểu đồ thanh theo lớp và hai biểu đồ tròn tổng hợp cơ cấu nhãn cùng độ phủ liên hệ toàn khối, với title/subtitle giải thích rõ ý nghĩa từng chế độ.

**Architecture:** Giữ `LeadDashboard` làm component trình bày và quản lý trạng thái chế độ xem. Đưa phép cộng phân bố nhãn và độ phủ liên hệ vào pure selectors để có thể kiểm thử trong môi trường Vitest không có DOM.

**Tech Stack:** React 19, TypeScript, Recharts, Lucide React, Vitest, Tailwind CSS v4.

**Spec:** Thiết kế ngắn được người dùng duyệt trong hội thoại ngày 2026-08-25.

## Global Constraints

- UI copy bằng tiếng Việt; identifier bằng tiếng Anh.
- Giữ bảng màu hardcode và phong cách phẳng, ít hiệu ứng theo `Design.md`.
- Không thêm dependency hoặc DOM testing stack.
- Nút chuyển đổi phải có `title` và `aria-label` mô tả chế độ đích.

---

### Task 1: Aggregate label distribution selector

**Files:**
- Modify: `dashboard/src/data/selectors/labelDistribution.test.ts`
- Modify: `dashboard/src/data/selectors/labelDistribution.ts`

**Interfaces:**
- Consumes: mảng phần tử có `labelDistribution: { yellow: number; red: number; grey: number }`.
- Produces: `aggregateLabelDistribution(classes): { yellow: number; red: number; grey: number }`.
- Produces: `aggregateContactCoverage(classes): { done: number; total: number; remaining: number; pct: number | null }`.

- [ ] **Step 1: Write the failing test**

Thêm test dùng hai lớp với số lượng literal và kỳ vọng tổng `{ yellow: 7, red: 3, grey: 3 }`; thêm test mảng rỗng trả về ba số 0. Thêm test cộng `contactCoverage.done/total`, suy ra `remaining` và tỷ lệ toàn khối; mẫu số 0 trả về `pct: null`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/data/selectors/labelDistribution.test.ts`
Expected: FAIL vì `aggregateLabelDistribution` chưa được export.

- [ ] **Step 3: Write minimal implementation**

Dùng `reduce` với accumulator `{ yellow: 0, red: 0, grey: 0 }`, cộng riêng ba trường được hiển thị.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/data/selectors/labelDistribution.test.ts`
Expected: PASS toàn bộ test trong file.

### Task 2: Toggle bar and pie chart presentation

**Files:**
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`

**Interfaces:**
- Consumes: `aggregateLabelDistribution(displayClasses)` từ Task 1.
- Produces: nút chuyển `bar`/`pie`, title chung và subtitle theo chế độ, hai biểu đồ tròn tổng hợp toàn khối.

- [ ] **Step 1: Add chart mode state and chart data**

Thêm union `LabelChartMode = 'bar' | 'pie'`, state mặc định `bar`, và dữ liệu pie gồm ba lát Vàng/Đỏ/Xám từ selector tổng hợp.

- [ ] **Step 2: Replace the decorative icon with an accessible toggle**

Dùng button phẳng có border/radius đúng hệ thống; icon mô tả chế độ đích, `title` và `aria-label` là “Xem biểu đồ tròn tổng hợp toàn khối” hoặc “Xem biểu đồ thanh theo từng lớp”.

- [ ] **Step 3: Clarify title and subtitle**

Title: “Phân Bố Nhãn Học Viên Toàn Khối”. Subtitle biểu đồ thanh giải thích so sánh giữa từng lớp; subtitle biểu đồ tròn giải thích tổng số và tỷ trọng trên toàn bộ lớp có dữ liệu test trong kỳ.

- [ ] **Step 4: Render the selected chart**

Giữ nguyên stacked bar hiện tại cho mode `bar`; mode `pie` dùng hai Recharts `PieChart`: cơ cấu Vàng/Đỏ/Xám và độ phủ Đã liên hệ/Chưa liên hệ. Mỗi donut có tiêu đề, số tổng ở tâm, tooltip và chú giải riêng; nếu không có học viên cần cảnh báo thì biểu đồ độ phủ hiện empty state rõ ràng.

- [ ] **Step 5: Run all dashboard gates**

Run lần lượt trong `dashboard/`: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build`.
Expected: cả bốn lệnh exit 0.

- [ ] **Step 6: Inspect the rendered Lead Dashboard**

Chạy `npm run dev`, mở Lead Dashboard, kiểm tra cả light/dark mode, hai biểu đồ, tooltip, legend, title/subtitle và trạng thái không dữ liệu.

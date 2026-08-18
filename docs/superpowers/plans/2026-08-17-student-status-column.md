# Student Status Column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làm rõ cột trạng thái học viên và hiển thị `Chưa đạt` bằng badge đỏ nhất quán với các trạng thái còn lại.

**Architecture:** Chỉ chỉnh JSX và Tailwind classes trong `StudentTable.tsx`; không thêm state, selector hoặc thay đổi hợp đồng dữ liệu. Header hiện có được chia lại trên đúng ba ô cuối, còn nhánh fallback của trạng thái được trình bày thành badge cộng dòng lý do.

**Tech Stack:** React, TypeScript, Tailwind CSS v4, lucide-react.

## Global Constraints

- Giữ nguyên logic xác định `Pass`, `Xét chờ Review` và `Chưa đạt`.
- Dùng palette semantic `emerald` / `amber` / `red`, viền 1px và `rounded-[8px]` theo `Design.md`.
- Giữ tiếng Việt cho UI và không làm mất lý do chưa đạt.
- Không ghi đè các chỉnh sửa đang tồn tại trong `StudentTable.tsx`.

---

### Task 1: Header và badge trạng thái

**Files:**
- Modify: `dashboard/src/components/dashboard/StudentTable.tsx:225-229`
- Modify: `dashboard/src/components/dashboard/StudentTable.tsx:417-434`

**Interfaces:**
- Consumes: `StudentDetail.evaluation.passChuanStatus`, `passMemStatus`, `passChuanReasons`.
- Produces: Không có API mới; chỉ thay đổi markup hiển thị.

- [ ] **Step 1: Ghi nhận baseline**

Kiểm tra JSX hiện tại có header gộp và nhánh chưa đạt dạng text:

```powershell
rg -n "Trạng thái / Hành động|Chưa đạt:" dashboard/src/components/dashboard/StudentTable.tsx
```

Expected: tìm thấy cả hai mẫu trước khi sửa.

- [ ] **Step 2: Tách header**

Thay header gộp bằng:

```tsx
<th className="py-3 px-4 text-left">Trạng thái</th>
<th className="py-3 px-4 text-right" colSpan={2}>Hành động</th>
```

- [ ] **Step 3: Tạo badge đỏ cho trạng thái chưa đạt**

Trong nhánh fallback, render:

```tsx
<div className="max-w-xs">
  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-[8px] border border-red-500/20">
    <AlertTriangle className="w-3.5 h-3.5" /> Chưa đạt
  </span>
  <p className="mt-1 text-[10px] leading-tight text-[#404040]/60 dark:text-[#a1a1aa] whitespace-normal">
    {s.evaluation.passChuanReasons.join(', ') || 'Điểm test dưới ngưỡng'}
  </p>
</div>
```

- [ ] **Step 4: Chạy bốn quality gate**

```powershell
npx tsc -b
npm run lint
npm test
npm run build
```

Run from: `dashboard/`. Expected: tất cả exit code 0.

- [ ] **Step 5: Kiểm tra render**

Chạy `npm run dev`, mở bảng học viên và kiểm tra `Pass`, `Xét chờ Review`, `Chưa đạt` ở light/dark mode. Xác nhận header `Trạng thái` nằm trên badge, `Hành động` nằm trên các nút, và lý do chưa đạt vẫn đọc được.

- [ ] **Step 6: Commit**

```powershell
git add -- dashboard/src/components/dashboard/StudentTable.tsx docs/superpowers/plans/2026-08-17-student-status-column.md
git commit -m "feat: làm rõ trạng thái học viên"
```

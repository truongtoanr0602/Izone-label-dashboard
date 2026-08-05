# Lead Dashboard Clarity Fixes + Desktop Sidebar Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three Lead Khối Dashboard clarity issues (trend-chart subtitle, KPI-card note separation, Pass chuẩn/mềm tooltips) and add a desktop-only sidebar collapse toggle.

**Architecture:** Four independent, presentational-only changes to an existing React + TypeScript + Tailwind v4 SPA. No new state management, no new data flow — one new tiny component (`InfoTooltip`, native `<details>/<summary>`), one new optional prop on an existing component (`KpiCard.infoTooltip`), one new piece of local state in `App.tsx` (`isSidebarCollapsed`), and two edited subtitle strings. Nothing touches `src/data/`.

**Tech Stack:** Vite, React 19, TypeScript (strict, `tsc -b`), Tailwind v4 (`@tailwindcss/vite`, no config file), recharts, lucide-react icons, vitest (node environment, no DOM).

## Global Constraints

- All four gates must stay clean after every task: `npx tsc -b`, `npm run lint` (oxlint), `npm test` (vitest run), `npm run build`.
- `noUnusedLocals` / `noUnusedParameters` / `erasableSyntaxOnly` are on — an unused import fails the build, not just lint.
- No test framework beyond vitest in plain node environment — **no jsdom, no React Testing Library, no component rendering.** Do not attempt to write a render test for `InfoTooltip` or any component; verify those visually via `npm run dev`.
- UI copy stays Vietnamese; code identifiers stay English.
- Match existing hardcoded hex/dark-mode pairs exactly (see CLAUDE.md styling table). Don't introduce new colors, new border-radius scale, or `@theme` token classes — this codebase hardcodes hex literals with explicit `dark:` pairs everywhere.
- Don't touch `src/App.css` (unimported, dead) or add new dependencies — `PanelLeftClose`/`PanelLeftOpen`/`Info` already exist in the installed `lucide-react`.

---

## File Structure

| File | Change |
|---|---|
| `src/components/dashboard/LeadDashboard.tsx` | Modify: import `periodLabel`, rewrite two hardcoded `subtitle` strings as template literals |
| `src/components/dashboard/KpiCard.tsx` | Modify: add `border-t` divider between the two note lines; add `infoTooltip` prop and render it next to the label |
| `src/components/common/InfoTooltip.tsx` | Create: new `<details>/<summary>` popover component |
| `src/components/dashboard/KpiRow.tsx` | Modify: import `InfoTooltip`, pass `infoTooltip` to the "Pass chuẩn" and "Pass mềm" cards |
| `src/App.tsx` | Modify: add `isSidebarCollapsed` state, extend `aside` className, pass two new props to `Header` |
| `src/components/common/Header.tsx` | Modify: accept `isSidebarCollapsed`/`onToggleSidebar` props, import `PanelLeftClose`/`PanelLeftOpen`, render desktop toggle button |

---

### Task 1: Dynamic trailing-window subtitle on the two trend charts

**Files:**
- Modify: `src/components/dashboard/LeadDashboard.tsx:11-20` (import block), `src/components/dashboard/LeadDashboard.tsx:220-239` (the two `<TrendChart>` calls)

**Interfaces:**
- Consumes: `periodLabel(key: string): string` — already exported from `src/data/selectors/periods.ts` via the `src/data/selectors` barrel (confirmed: `ContextBar.tsx` already imports it from the same barrel).
- Produces: nothing new consumed by later tasks — this task is self-contained.

- [ ] **Step 1: Add `periodLabel` to the existing selectors import**

In `src/components/dashboard/LeadDashboard.tsx`, the import block currently reads:

```tsx
import {
  aggregateKhoi,
  labelFlowDelta,
  labelFlowInPeriod,
  latestSnapshotPerClass,
  listPeriods,
  metricDelta,
  periodKeyOf,
  previousPeriodKey,
} from '../../data/selectors';
```

Change it to:

```tsx
import {
  aggregateKhoi,
  labelFlowDelta,
  labelFlowInPeriod,
  latestSnapshotPerClass,
  listPeriods,
  metricDelta,
  periodKeyOf,
  periodLabel,
  previousPeriodKey,
} from '../../data/selectors';
```

- [ ] **Step 2: Rewrite the two `subtitle` props to state the trailing window**

Find this block (around line 220-239):

```tsx
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart
          title="Chất lượng vận hành"
          subtitle="Tỷ lệ điểm danh và BTVN toàn khối. Vạch dọc là mốc bài test."
          points={view.trendSeries}
          series={OPERATIONS_SERIES}
          domain={[70, 100]}
          isDarkMode={isDarkMode}
        />
        <TrendChart
          title="Kết quả"
          subtitle="Tỷ lệ pass chuẩn và pass mềm toàn khối, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi."
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          // Pass mềm chạm 94.4 trên dữ liệu hiện tại, nên [0,80] là con số ghi
          // một đằng vẽ một nẻo — recharts nới ra tới ~94 mà nhãn trục vẫn nói
          // 80. Dùng đúng dải thật của một tỷ lệ phần trăm.
          domain={[0, 100]}
          isDarkMode={isDarkMode}
        />
      </div>
```

Replace with:

```tsx
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart
          title="Chất lượng vận hành"
          subtitle={`Tỷ lệ điểm danh và BTVN toàn khối, 13 tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}. Vạch dọc là mốc bài test.`}
          points={view.trendSeries}
          series={OPERATIONS_SERIES}
          domain={[70, 100]}
          isDarkMode={isDarkMode}
        />
        <TrendChart
          title="Kết quả"
          subtitle={`Tỷ lệ pass chuẩn và pass mềm toàn khối, 13 tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi.`}
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          // Pass mềm chạm 94.4 trên dữ liệu hiện tại, nên [0,80] là con số ghi
          // một đằng vẽ một nẻo — recharts nới ra tới ~94 mà nhãn trục vẫn nói
          // 80. Dùng đúng dải thật của một tỷ lệ phần trăm.
          domain={[0, 100]}
          isDarkMode={isDarkMode}
        />
      </div>
```

(`selectedPeriod` is already in scope — it's the component's existing state variable used throughout `LeadDashboard.tsx`, e.g. in the `view` `useMemo` dependency array.)

- [ ] **Step 3: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Test**

Run: `npm test`
Expected: all existing tests pass unchanged (this task touches no selector logic).

- [ ] **Step 6: Manual visual verification**

Run: `npm run dev`, open the app, stay on "Lead Khối Dashboard" tab. Change the "Kỳ báo cáo" dropdown in the `ContextBar` to a couple of different months. Confirm both trend-chart subtitles ("Chất lượng vận hành", "Kết quả") update to say `... 13 tuần gần nhất tính đến hết Tháng N/YYYY ...` matching the selected month.

- [ ] **Step 7: Commit**

```bash
git add src/components/dashboard/LeadDashboard.tsx
git commit -m "fix: nói rõ biểu đồ trend là cửa sổ 13 tuần trượt, không phải lọc theo kỳ"
```

---

### Task 2: Visually separate the two KPI-card note lines

**Files:**
- Modify: `src/components/dashboard/KpiCard.tsx:63-81`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new consumed by later tasks (Task 3 edits a different, non-overlapping part of the same file — the props interface and the label row — so do this task first to avoid re-reading a file mid-edit).

- [ ] **Step 1: Add a top border to the delta-note line**

Find this block in `src/components/dashboard/KpiCard.tsx` (around line 63-81):

```tsx
      {/*
        Hai dòng mẫu số riêng biệt khi có `note`: dòng trên thuộc về con số lớn,
        dòng dưới thuộc về delta. Phân biệt bằng CÂU CHỮ chứ không bằng kiểu
        dáng — `formatComparisonNote` luôn mở đầu bằng "thay đổi". Cố ý không làm
        dòng dưới mờ đi: đây chính là dòng cần đọc được, hạ tương phản ở cỡ 10px
        là xoá nó khỏi màn hình.
      */}
      {note !== undefined && (
        <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
          {note}
        </p>
      )}
      <p
        className={`text-[10px] text-[#404040]/50 dark:text-[#71717a] ${
          note !== undefined ? 'mt-0.5' : 'mt-1.5'
        }`}
      >
        {formatComparisonNote(delta)}
      </p>
```

Replace with:

```tsx
      {/*
        Hai dòng mẫu số riêng biệt khi có `note`: dòng trên thuộc về con số lớn,
        dòng dưới thuộc về delta. Phân biệt bằng CÂU CHỮ (formatComparisonNote
        luôn mở đầu bằng "thay đổi") VÀ bằng một đường kẻ mảnh phía trên dòng
        delta — hai câu gần giống nhau về hình thức nên chỉ câu chữ là chưa đủ
        để mắt phân biệt nhanh. Cố ý không làm dòng dưới mờ đi: đây chính là
        dòng cần đọc được, hạ tương phản ở cỡ 10px là xoá nó khỏi màn hình.
      */}
      {note !== undefined && (
        <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
          {note}
        </p>
      )}
      <p
        className={`text-[10px] text-[#404040]/50 dark:text-[#71717a] ${
          note !== undefined
            ? 'mt-1.5 pt-1.5 border-t border-[#f3f4f6] dark:border-[#3f3f46]'
            : 'mt-1.5'
        }`}
      >
        {formatComparisonNote(delta)}
      </p>
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Test**

Run: `npm test`
Expected: all existing tests pass unchanged (CSS-only change, no logic touched).

- [ ] **Step 5: Manual visual verification**

Run: `npm run dev` (or reuse the dev server from Task 1), look at the "Điểm danh (TB)", "Pass chuẩn", "Pass mềm", "Chuyển dịch nhãn", and "Bỏ học" KPI cards — each has a `note` prop and should now show a thin divider line between its two note rows. Check "Làm BTVN (TB)" (no `note` prop) still shows a single note line with no divider. Toggle dark mode and confirm the divider color switches (`#f3f4f6` light / `#3f3f46` dark).

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/KpiCard.tsx
git commit -m "fix: thêm đường kẻ phân cách hai dòng mẫu số trên thẻ KPI"
```

---

### Task 3: `InfoTooltip` component + Pass chuẩn/mềm explanations

**Files:**
- Create: `src/components/common/InfoTooltip.tsx`
- Modify: `src/components/dashboard/KpiCard.tsx:1-54` (props interface + label row — non-overlapping with Task 2's edit)
- Modify: `src/components/dashboard/KpiRow.tsx:1-78` (import + two `KpiCard` call sites)

**Interfaces:**
- Consumes: nothing from Tasks 1-2.
- Produces: `InfoTooltip` component with props `{ label: string; children: React.ReactNode }`; `KpiCardProps.infoTooltip?: React.ReactNode` — no later task depends on these signatures, but keep them exact since this is the only place they're defined.

- [ ] **Step 1: Create `InfoTooltip`**

Create `src/components/common/InfoTooltip.tsx`:

```tsx
import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  /** aria-label cho icon — mô tả tooltip nói về cái gì, vd "Cách tính Pass chuẩn". */
  label: string;
  children: React.ReactNode;
}

/**
 * Popover giải thích ngắn, mở bằng bấm/chạm (không phải hover) vì dashboard có
 * chế độ mobile drawer nơi hover không tồn tại. Dùng <details>/<summary> gốc
 * thay vì tự quản state: có sẵn hỗ trợ bàn phím (Enter/Space khi summary
 * focus) và screen reader, không cần logic click-outside.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({ label, children }) => (
  <details className="relative inline-block">
    <summary
      aria-label={label}
      className="list-none cursor-help inline-flex items-center align-middle [&::-webkit-details-marker]:hidden"
    >
      <Info className="w-3 h-3 text-[#404040]/40 dark:text-[#71717a] hover:text-[#404040] dark:hover:text-[#e4e4e7] transition-colors" />
    </summary>
    <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded-[8px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] p-3 text-[11px] font-normal normal-case leading-relaxed text-[#404040] dark:text-[#e4e4e7] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  </details>
);
```

- [ ] **Step 2: Type-check the new file in isolation**

Run: `npx tsc -b`
Expected: no errors (this file isn't imported anywhere yet, but it must still type-check standalone).

- [ ] **Step 3: Add the `infoTooltip` prop to `KpiCard`**

In `src/components/dashboard/KpiCard.tsx`, the props interface currently reads:

```tsx
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: KpiUnit;
  delta: MetricDelta;
  /** true khi giá trị càng cao càng tốt (điểm danh); false khi ngược lại (bỏ học). */
  higherIsBetter: boolean;
  /**
   * Mẫu số của GIÁ TRỊ lớn. BỔ SUNG cho dòng mẫu số của delta chứ không thay thế
   * nó: hai con số trên thẻ được tính trên hai tập lớp khác nhau (giá trị trên
   * mọi lớp của kỳ, delta chỉ trên lớp so sánh được), nên mỗi con số phải mang
   * mẫu số của chính nó — §3.3.
   */
  note?: string;
}
```

Add `infoTooltip` after `note`:

```tsx
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: KpiUnit;
  delta: MetricDelta;
  /** true khi giá trị càng cao càng tốt (điểm danh); false khi ngược lại (bỏ học). */
  higherIsBetter: boolean;
  /**
   * Mẫu số của GIÁ TRỊ lớn. BỔ SUNG cho dòng mẫu số của delta chứ không thay thế
   * nó: hai con số trên thẻ được tính trên hai tập lớp khác nhau (giá trị trên
   * mọi lớp của kỳ, delta chỉ trên lớp so sánh được), nên mỗi con số phải mang
   * mẫu số của chính nó — §3.3.
   */
  note?: string;
  /** Icon giải thích cách tính, đặt cạnh label. Xem `InfoTooltip`. */
  infoTooltip?: React.ReactNode;
}
```

Then update the destructured props and add `{ icon, label, value, unit, delta, higherIsBetter, note }` → include `infoTooltip`:

```tsx
export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  unit,
  delta,
  higherIsBetter,
  note,
  infoTooltip,
}) => {
```

Then find the label row:

```tsx
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
      </div>
```

Replace with:

```tsx
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
        {infoTooltip}
      </div>
```

- [ ] **Step 4: Wire `InfoTooltip` into the Pass chuẩn / Pass mềm cards**

In `src/components/dashboard/KpiRow.tsx`, add the import (after the existing `KpiCard` import):

```tsx
import { KpiCard } from './KpiCard';
import { InfoTooltip } from '../common/InfoTooltip';
```

Find the "Pass chuẩn" card:

```tsx
      <KpiCard
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Pass chuẩn"
        value={aggregate.passChuanRate}
        unit="percent"
        delta={deltas.passChuan}
        higherIsBetter
        note={passNote}
      />
```

Replace with:

```tsx
      <KpiCard
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Pass chuẩn"
        value={aggregate.passChuanRate}
        unit="percent"
        delta={deltas.passChuan}
        higherIsBetter
        note={passNote}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass chuẩn">
            Điểm danh ≥90% <b>VÀ</b> BTVN ≥90% <b>VÀ</b> TB test ≥60 — cả 3 điều kiện.
          </InfoTooltip>
        }
      />
```

Find the "Pass mềm" card:

```tsx
      <KpiCard
        icon={<Award className="w-4 h-4" />}
        label="Pass mềm"
        value={aggregate.passMemRate}
        unit="percent"
        delta={deltas.passMem}
        higherIsBetter
        note={passNote}
      />
```

Replace with:

```tsx
      <KpiCard
        icon={<Award className="w-4 h-4" />}
        label="Pass mềm"
        value={aggregate.passMemRate}
        unit="percent"
        delta={deltas.passMem}
        higherIsBetter
        note={passNote}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass mềm">
            <b>Nhóm 1</b>: TB test 50–&lt;55, ĐH &amp; BTVN = 100% (cần GV duyệt)
            <br />
            <b>Nhóm 2</b>: TB test 55–&lt;60, ĐH &amp; BTVN ≥90% (cần GV duyệt)
            <br />
            <b>Nhóm 3</b>: TB test ≥60 (tự động đạt)
          </InfoTooltip>
        }
      />
```

- [ ] **Step 5: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 6: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Test**

Run: `npm test`
Expected: all existing tests pass unchanged.

- [ ] **Step 8: Manual visual verification**

Run: `npm run dev`, go to "Lead Khối Dashboard". Confirm a small `(i)` icon appears next to "PASS CHUẨN" and "PASS MỀM" labels (not on the other four cards). Click each icon: a popover opens below the icon with the explanation text, right-aligned content readable in both light and dark mode, not clipped by the card's rounded corners. Click the icon again (or click elsewhere then the icon) to confirm it can be closed. Confirm no other KPI card grew an icon.

- [ ] **Step 9: Commit**

```bash
git add src/components/common/InfoTooltip.tsx src/components/dashboard/KpiCard.tsx src/components/dashboard/KpiRow.tsx
git commit -m "feat: thêm tooltip giải thích cách tính Pass chuẩn / Pass mềm"
```

---

### Task 4: Desktop sidebar collapse toggle

**Files:**
- Modify: `src/components/common/Header.tsx:1-58` (props interface + left-side buttons)
- Modify: `src/App.tsx:14-59` (new state + `aside` className) and `src/App.tsx:170-177` (props passed to `Header`)

**Interfaces:**
- Consumes: nothing from Tasks 1-3.
- Produces: `HeaderProps.isSidebarCollapsed: boolean`, `HeaderProps.onToggleSidebar: () => void` — defined and consumed within this task only.

- [ ] **Step 1: Add the two new props and the desktop toggle button to `Header`**

In `src/components/common/Header.tsx`, the imports and props interface currently read:

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Download, Menu, Moon, Sun } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface HeaderProps {
  classes: ClassSummary[];
  selectedClass: ClassSummary;
  onSelectClass: (cls: ClassSummary) => void;
  onOpenMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classes,
  selectedClass,
  onSelectClass,
  onOpenMobileMenu,
  isDarkMode,
  onToggleDarkMode
}) => {
```

Replace with:

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Download, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface HeaderProps {
  classes: ClassSummary[];
  selectedClass: ClassSummary;
  onSelectClass: (cls: ClassSummary) => void;
  onOpenMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classes,
  selectedClass,
  onSelectClass,
  onOpenMobileMenu,
  isDarkMode,
  onToggleDarkMode,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
```

Then find the mobile hamburger button:

```tsx
            {onOpenMobileMenu && (
              <button 
                onClick={onOpenMobileMenu}
                className="xl:hidden p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
```

Add the desktop toggle button right after it (same block, still inside the `<div className="flex items-center gap-3">`):

```tsx
            {onOpenMobileMenu && (
              <button 
                onClick={onOpenMobileMenu}
                className="xl:hidden p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={onToggleSidebar}
              className="hidden xl:flex p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
              title={isSidebarCollapsed ? 'Hiện sidebar' : 'Ẩn sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
```

- [ ] **Step 2: Add `isSidebarCollapsed` state and pass props to `Header` in `App.tsx`**

In `src/App.tsx`, find:

```tsx
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
```

Replace with:

```tsx
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
```

Then find the `<Header>` usage:

```tsx
        <Header
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={(cls) => setSelectedClass(cls)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
```

Replace with:

```tsx
        <Header
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={(cls) => setSelectedClass(cls)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}
        />
```

- [ ] **Step 3: Make the `aside` collapse at `xl` when `isSidebarCollapsed`**

In `src/App.tsx`, find the `aside` opening tag:

```tsx
      <aside className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7] p-5 space-y-6 transform transition-transform duration-300 xl:relative xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
```

Replace with:

```tsx
      <aside className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7] p-5 space-y-6 transform transition-all duration-300 xl:relative xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isSidebarCollapsed ? 'xl:w-0 xl:p-0 xl:border-0 xl:overflow-hidden' : ''}`}>
```

(Note `transition-transform` → `transition-all`: the collapse now animates `width`/`padding`/`border`, not just `transform`, so all of them need to be covered by the transition.)

- [ ] **Step 4: Type-check**

Run: `npx tsc -b`
Expected: no errors.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Test**

Run: `npm test`
Expected: all existing tests pass unchanged.

- [ ] **Step 7: Manual visual verification**

Run: `npm run dev`, widen the browser window to desktop width (`≥ 1280px`, the `xl` breakpoint). Confirm a new icon button (`PanelLeftClose`) appears in the header's top-left, next to the brand text (the hamburger `Menu` icon should NOT be visible at this width — it's `xl:hidden`). Click it: sidebar smoothly collapses to zero width, main content expands to fill the space, icon changes to `PanelLeftOpen`. Click again: sidebar reopens, icon reverts. Then narrow the window below `1280px` and confirm: the new desktop button disappears, the original hamburger + drawer + overlay + `X`-close behavior is unchanged from before this task.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/components/common/Header.tsx
git commit -m "feat: thêm nút thu gọn sidebar trên desktop"
```

---

### Task 5: Full verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run all four required gates in order**

```bash
npx tsc -b
npm run lint
npm test
npm run build
```

Expected: all four exit 0 with no errors.

- [ ] **Step 2: Full manual regression pass**

Run `npm run preview` (serves the production `dist/` build) or `npm run dev`. Walk through, in both light and dark mode:

1. Lead Khối Dashboard: change the "Kỳ báo cáo" dropdown — both trend-chart subtitles update with the new period text (Task 1).
2. KPI row: "Điểm danh (TB)", "Pass chuẩn", "Pass mềm", "Chuyển dịch nhãn", "Bỏ học" cards each show a divider between their two note lines; "Làm BTVN (TB)" shows one note line, no divider (Task 2).
3. "Pass chuẩn" and "Pass mềm" cards: click the `(i)` icon, confirm the popover text matches the rules in `ARCHITECTURE.md` §4 (Task 3).
4. At `≥ xl` width: click the new sidebar-toggle icon in the header, confirm collapse/expand animates and main content reflows; shrink below `xl` and confirm the mobile hamburger drawer still works exactly as before (Task 4).

- [ ] **Step 3: Confirm no unrelated diff**

```bash
git status
git diff --stat main
```

Expected: only the six files listed in "File Structure" above appear changed/added; nothing under `src/data/` touched.

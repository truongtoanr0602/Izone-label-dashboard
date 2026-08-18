# Teacher Dashboard Dropped Student Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep dropped students visible in Teacher Dashboard's `Tất cả` list while making their administrative status unmistakable and removing intervention affordances.

**Architecture:** Extract filtering and stable status-first sorting into a pure selector so behavior is testable without a DOM. Keep `StudentTable` presentational: derive `isDropped` for each row and switch only its visual/status/action branches while preserving historical data and the existing detail expander.

**Tech Stack:** React, TypeScript, Tailwind CSS v4, Vitest (node environment), Lucide React.

## Global Constraints

- Preserve all pre-existing uncommitted changes in `dashboard/src/components/dashboard/StudentTable.tsx`.
- Use `registrationStatus === 'dropped'` as the source of truth.
- Keep dropped students in `Tất cả`; exclude them from warning, pass, and review filters/counts.
- Keep historical attendance, homework, tests, labels, and detail expansion visible.
- Use the existing muted slate palette, 1px borders, and `rounded-[8px]`; no red urgency, gradients, new shadows, or animation for dropped rows.
- Do not change backend/API contracts or performance calculations.

---

### Task 1: Pure table selection behavior

**Files:**
- Create: `dashboard/src/data/selectors/studentTable.ts`
- Create: `dashboard/src/data/selectors/studentTable.test.ts`
- Modify: `dashboard/src/data/selectors/index.ts`

**Interfaces:**
- Consumes: `StudentDetail`, `ContactTrigger`, and the existing `matchesTrigger` selector.
- Produces: `StudentTableFilter = 'all' | ContactTrigger | 'pass' | 'review'`, `isDroppedStudent(student): boolean`, `matchesStudentTableFilter(student, filter): boolean`, and `sortStudentsForTable(students): StudentDetail[]`.

- [ ] **Step 1: Write failing tests** proving: dropped matches `all`; dropped does not match trigger/pass/review; active filter behavior remains; active students sort before dropped while risk order is retained inside both groups; input is not mutated.
- [ ] **Step 2: Run `npm test -- src/data/selectors/studentTable.test.ts` from `dashboard/`** and confirm failure because the selector module does not exist.
- [ ] **Step 3: Implement the minimal pure selectors** with a status rank followed by descending `evaluation.riskScore`, and export them from the selector barrel.
- [ ] **Step 4: Re-run the focused test** and confirm all cases pass.

### Task 2: Dropped row presentation and interaction

**Files:**
- Modify: `dashboard/src/components/dashboard/StudentTable.tsx`

**Interfaces:**
- Consumes: `StudentTableFilter`, `isDroppedStudent`, `matchesStudentTableFilter`, and `sortStudentsForTable` from Task 1.
- Produces: unchanged `StudentTable` props and user-visible dropped-row presentation.

- [ ] **Step 1: Replace inline filter/sort logic** with the tested selector while retaining search behavior and the public `TableFilter` export as a type alias.
- [ ] **Step 2: Exclude dropped students from pass/review counts**; trigger counts remain correct through the existing active-only trigger selectors.
- [ ] **Step 3: Add the `Đã nghỉ` badge beside the student name** using muted slate light/dark classes and no animation.
- [ ] **Step 4: Give dropped rows a neutral background and muted avatar/metrics** without applying opacity to the entire row; dropped styling must override red/grey urgency styling.
- [ ] **Step 5: Render `Đã nghỉ` in the status column** instead of Pass/Review/Chưa đạt for dropped students.
- [ ] **Step 6: Replace contact/portal actions with `Không cần can thiệp`** while preserving the history/detail button.
- [ ] **Step 7: Ensure mobile name content includes the badge** so status remains visible without horizontal scrolling.

### Task 3: Verification

**Files:**
- Verify only; no planned production files.

- [ ] **Step 1: Run focused tests** with `npm test -- src/data/selectors/studentTable.test.ts`.
- [ ] **Step 2: Run all four dashboard gates:** `npx tsc -b`, `npm run lint`, `npm test`, `npm run build`.
- [ ] **Step 3: Start `npm run dev` and inspect Teacher Dashboard** in light/dark and desktop/mobile widths for one active and one dropped student; confirm historical detail still expands and intervention actions are absent for dropped.
- [ ] **Step 4: Review `git diff --check` and the final diff** to confirm unrelated dirty files and the pre-existing status-column work were not reverted.

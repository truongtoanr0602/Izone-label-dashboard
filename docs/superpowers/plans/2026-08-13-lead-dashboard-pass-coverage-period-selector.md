# Lead Dashboard Pass, Coverage, and Selector UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct Lead Dashboard denominators and exclusive pass outcomes, expose empty historical periods, and replace long native selectors with accessible month/year and grouped-class popups.

**Architecture:** PostgreSQL remains the source of truth; NestJS aggregates raw daily student metrics into strict Pass chuẩn and exclusive Group 1/2 Pass mềm counts, while current class operations remain independent of the selected historical month. React consumes an explicit API contract, uses pure selector models for deterministic tests, and renders accessible dependency-free popups.

**Tech Stack:** PostgreSQL, NestJS 11, Prisma tagged SQL, Jest, React 19, TypeScript 6, Tailwind CSS 4, Recharts 3, Vitest.

## Global Constraints

- Target only Khối 3-4: `course_id = 2`.
- Contact Coverage denominator is warning students only.
- Pass chuẩn and Pass mềm numerators are mutually exclusive.
- Pass mềm contains Group 1 and Group 2 only; Group 3 is excluded.
- Both pass rates use tested students as denominator.
- Missing data is `null`, never synthetic `0%`.
- KPI cards and charts follow `period`; Master Table and Contact Coverage remain current.
- Every non-future month is selectable; future months are disabled.
- Class selector groups by `courseName`, sorts naturally, and scrolls internally.
- Do not add a frontend date-picker dependency or database migration.

## File Structure

- Create `backend/src/dashboards/period-data.ts`: period-evidence and empty-metric helpers.
- Create `backend/src/dashboards/period-data.spec.ts`: empty/non-empty month regression tests.
- Modify `backend/src/dashboards/dashboards.service.ts`: raw pass predicates, current-vs-period resolution, response metadata.
- Modify `backend/src/dashboards/dashboard.types.ts`: pass numerator contract.
- Modify `backend/src/dashboards/snapshot-quality.ts`: carry pass numerator through resolved observations.
- Modify `backend/src/dashboards/snapshot-quality.spec.ts`: numerator tests.
- Modify `backend/src/dashboards/lead-aggregation.ts`: sum pass numerators across weighted classes.
- Modify `backend/src/dashboards/lead-aggregation.spec.ts`: independent pass aggregation tests.
- Modify `backend/src/dashboards/dashboards.service.spec.ts`: SQL predicate, empty-period, current-table, and coverage integration tests.
- Modify `dashboard/src/api/dashboardContracts.ts`: `hasDataForPeriod` and `qualifiedStudents` fields.
- Modify `dashboard/src/api/dashboardContracts.test.ts`: contract preservation tests.
- Modify `dashboard/src/components/dashboard/KpiRow.tsx`: exclusive Pass mềm copy and numerator notes.
- Modify `dashboard/src/components/dashboard/kpiFormat.ts`: pass numerator/denominator formatter.
- Modify `dashboard/src/components/dashboard/kpiFormat.test.ts`: pass note tests.
- Modify `dashboard/src/components/dashboard/LeadDashboard.tsx`: empty macro state and explicit Master Table labels.
- Create `dashboard/src/components/dashboard/monthYearPickerModel.ts`: pure month grid model.
- Create `dashboard/src/components/dashboard/monthYearPickerModel.test.ts`: month formatting/future-state tests.
- Create `dashboard/src/components/dashboard/MonthYearPicker.tsx`: accessible popup component.
- Modify `dashboard/src/components/dashboard/ContextBar.tsx`: consume `MonthYearPicker`.
- Create `dashboard/src/components/common/classGrouping.ts`: pure grouping and sorting.
- Create `dashboard/src/components/common/classGrouping.test.ts`: course grouping tests.
- Modify `dashboard/src/components/common/Header.tsx`: grouped, sticky, scrollable class menu.

---

### Task 1: Carry explicit pass numerators through backend aggregation

**Files:**
- Modify: `backend/src/dashboards/dashboard.types.ts`
- Modify: `backend/src/dashboards/snapshot-quality.ts`
- Test: `backend/src/dashboards/snapshot-quality.spec.ts`
- Modify: `backend/src/dashboards/lead-aggregation.ts`
- Test: `backend/src/dashboards/lead-aggregation.spec.ts`

**Interfaces:**
- Consumes: `StudentMetricEvidence.passStandardStudents`, `StudentMetricEvidence.softPassStudents`.
- Produces: `ResolvedPassMetric.qualifiedStudents: number` and `DashboardMetric.qualifiedStudents?: number`.

- [ ] **Step 1: Write failing numerator tests**

Add assertions to the existing pass-resolution test:

```ts
expect(result.passStandard).toMatchObject({
  value: 25,
  sampleSize: 8,
  qualifiedStudents: 2,
});
expect(result.softPass).toMatchObject({
  value: 50,
  sampleSize: 8,
  qualifiedStudents: 4,
});
```

Add an aggregation assertion where two classes contribute `2/8` and `3/12`:

```ts
expect(result.passStandardRate).toMatchObject({
  value: 25,
  sampleSize: 20,
  qualifiedStudents: 5,
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd backend
npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts src/dashboards/lead-aggregation.spec.ts
```

Expected: FAIL because `qualifiedStudents` is absent.

- [ ] **Step 3: Implement numerator propagation**

Extend the contracts:

```ts
export interface DashboardMetric {
  value: number | null;
  qualifiedStudents?: number;
  // existing fields remain
}

export interface ResolvedPassMetric extends ResolvedMetric {
  testedStudents: number;
  qualifiedStudents: number;
}
```

In `resolvePassMetric`, return `qualifiedStudents: row[passedKey]`; for an empty metric return zero. Extend `weightedResolved` to sum `qualifiedStudents` only for `passStandard` and `softPass`, then expose the sum from `compareMetric`.

- [ ] **Step 4: Verify GREEN**

Run the two Jest files from Step 2. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/dashboards/dashboard.types.ts backend/src/dashboards/snapshot-quality.ts backend/src/dashboards/snapshot-quality.spec.ts backend/src/dashboards/lead-aggregation.ts backend/src/dashboards/lead-aggregation.spec.ts
git commit -m "feat: expose independent pass numerators"
```

### Task 2: Calculate strict and exclusive pass buckets from raw metrics

**Files:**
- Modify: `backend/src/dashboards/dashboards.service.ts`
- Test: `backend/src/dashboards/dashboards.service.spec.ts`

**Interfaces:**
- Consumes: `attendance_pct`, `homework_pct`, `test_average`, `tests_taken` from current-state `student_daily_records`.
- Produces: SQL aliases `tested_students`, `pass_standard_students`, `soft_pass_students` with disjoint numerators.

- [ ] **Step 1: Write a failing SQL-contract test**

After exercising `getLeadDashboard`, inspect the third tagged query:

```ts
const studentMetricSql = (queryRaw.mock.calls[2][0] as TemplateStringsArray).join('?');
expect(studentMetricSql).toContain('r.test_average >= 60');
expect(studentMetricSql).toContain('r.test_average >= 50');
expect(studentMetricSql).toContain('r.test_average < 55');
expect(studentMetricSql).toContain('r.test_average < 60');
expect(studentMetricSql).not.toContain("r.pass_mem_status IN");
```

Add result assertions proving the mocked independent counts remain separate:

```ts
expect(result.kpis.passStandardRate).toMatchObject({
  qualifiedStudents: 22,
  sampleSize: 40,
  value: 55,
});
expect(result.kpis.softPassRate).toMatchObject({
  qualifiedStudents: 9,
  sampleSize: 40,
  value: 22.5,
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd backend
npm test -- --runInBand src/dashboards/dashboards.service.spec.ts
```

Expected: FAIL because the SQL still uses stored pass statuses and numerator fields are absent.

- [ ] **Step 3: Replace stored-status pass counts with raw predicates**

Use these SQL filters:

```sql
COUNT(*) FILTER (
  WHERE COALESCE(r.tests_taken, 0) > 0
    AND r.test_average IS NOT NULL
)::integer AS tested_students,
COUNT(*) FILTER (
  WHERE COALESCE(r.tests_taken, 0) > 0
    AND r.test_average >= 60
    AND r.attendance_pct >= 90
    AND r.homework_pct >= 90
)::integer AS pass_standard_students,
COUNT(*) FILTER (
  WHERE COALESCE(r.tests_taken, 0) > 0
    AND (
      (r.test_average >= 50 AND r.test_average < 55
       AND r.attendance_pct >= 100 AND r.homework_pct >= 100)
      OR
      (r.test_average >= 55 AND r.test_average < 60
       AND r.attendance_pct >= 90 AND r.homework_pct >= 90)
    )
)::integer AS soft_pass_students
```

The `< 60` boundary makes the soft numerator disjoint from Pass chuẩn and excludes Group 3.

- [ ] **Step 4: Verify GREEN**

Run the service spec. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/dashboards/dashboards.service.ts backend/src/dashboards/dashboards.service.spec.ts
git commit -m "fix: make lead pass outcomes mutually exclusive"
```

### Task 3: Expose empty report months without blanking current operations

**Files:**
- Create: `backend/src/dashboards/period-data.ts`
- Create: `backend/src/dashboards/period-data.spec.ts`
- Modify: `backend/src/dashboards/dashboards.service.ts`
- Test: `backend/src/dashboards/dashboards.service.spec.ts`

**Interfaces:**
- Produces: `hasLeadPeriodData(snapshotRows, studentMetricRows, period): boolean`.
- Produces: `emptyDashboardMetric(totalClasses): DashboardMetric`.
- Produces API field: `meta.hasDataForPeriod: boolean`.

- [ ] **Step 1: Write failing pure period tests**

```ts
expect(hasLeadPeriodData(
  [{ snapshot_date: '2026-07-31' }],
  [{ record_date: '2026-07-31' }],
  '2026-08',
)).toBe(false);

expect(hasLeadPeriodData(
  [{ snapshot_date: '2026-08-01' }],
  [],
  '2026-08',
)).toBe(true);
```

Add a service regression where selected-period evidence is absent but current evidence exists:

```ts
expect(result.meta.hasDataForPeriod).toBe(false);
expect(result.kpis.attendanceAvg.value).toBeNull();
expect(result.kpis.passStandardRate.value).toBeNull();
expect(result.trend).toEqual([]);
expect(result.classes[0].attendanceAvg).toBe(86);
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd backend
npm test -- --runInBand src/dashboards/period-data.spec.ts src/dashboards/dashboards.service.spec.ts
```

Expected: FAIL because the helper and metadata do not exist and historical fallback remains visible.

- [ ] **Step 3: Implement period availability and blank historical outputs**

Implement:

```ts
export function hasLeadPeriodData(
  snapshots: Array<{ snapshot_date: unknown }>,
  metrics: Array<{ record_date: unknown }>,
  period: string,
): boolean {
  return snapshots.some((row) => String(row.snapshot_date).slice(0, 7) === period)
    || metrics.some((row) => String(row.record_date).slice(0, 7) === period);
}
```

Use the project’s ISO conversion when values are `Date`. When false, return null-valued historical KPI metrics and `trend: []`, but continue resolving `currentRows` at `calendar.currentAsOf` and keep `classes: currentClassRows` plus current Contact Coverage.

- [ ] **Step 4: Verify GREEN**

Run both Jest files from Step 2. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/dashboards/period-data.ts backend/src/dashboards/period-data.spec.ts backend/src/dashboards/dashboards.service.ts backend/src/dashboards/dashboards.service.spec.ts
git commit -m "feat: distinguish empty report months from current state"
```

### Task 4: Consume the corrected pass and empty-period contract

**Files:**
- Modify: `dashboard/src/api/dashboardContracts.ts`
- Test: `dashboard/src/api/dashboardContracts.test.ts`
- Modify: `dashboard/src/components/dashboard/kpiFormat.ts`
- Test: `dashboard/src/components/dashboard/kpiFormat.test.ts`
- Modify: `dashboard/src/components/dashboard/KpiRow.tsx`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`

**Interfaces:**
- Consumes: `meta.hasDataForPeriod`, `DashboardMetric.qualifiedStudents`.
- Produces: `formatPassNote({ qualifiedStudents, sampleSize, classesWithTests, totalClasses }): string`.

- [ ] **Step 1: Write failing contract and formatter tests**

```ts
expect(adapted.meta.hasDataForPeriod).toBe(false);
expect(adapted.kpis.softPassRate.qualifiedStudents).toBe(9);

expect(formatPassNote({
  qualifiedStudents: 9,
  sampleSize: 40,
  classesWithTests: 15,
  totalClasses: 17,
})).toBe('9/40 HV đã thi · 15/17 lớp có test');
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd dashboard
npm test -- src/api/dashboardContracts.test.ts src/components/dashboard/kpiFormat.test.ts
```

Expected: FAIL because the fields and formatter are absent.

- [ ] **Step 3: Implement contract and UI consumption**

Add exact fields:

```ts
qualifiedStudents?: number;
// in meta
hasDataForPeriod: boolean;
```

Update `KpiRow` so each pass card formats only its own numerator. Remove Group 3 from the Pass mềm tooltip.

In `LeadDashboard`, when `hasDataForPeriod` is false, replace `KpiRow` and both charts with one macro empty-state panel. Keep the Master Table below it. Change table coverage copy to `{done}/{total} HV cần cảnh báo`, and render pass values on separate `Chuẩn` and `Mềm` lines.

- [ ] **Step 4: Verify GREEN**

Run both Vitest files from Step 2 and `npm run build`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/api/dashboardContracts.ts dashboard/src/api/dashboardContracts.test.ts dashboard/src/components/dashboard/kpiFormat.ts dashboard/src/components/dashboard/kpiFormat.test.ts dashboard/src/components/dashboard/KpiRow.tsx dashboard/src/components/dashboard/LeadDashboard.tsx
git commit -m "feat: render exclusive pass and empty report periods"
```

### Task 5: Replace the report-period select with a month/year popup

**Files:**
- Create: `dashboard/src/components/dashboard/monthYearPickerModel.ts`
- Create: `dashboard/src/components/dashboard/monthYearPickerModel.test.ts`
- Create: `dashboard/src/components/dashboard/MonthYearPicker.tsx`
- Modify: `dashboard/src/components/dashboard/ContextBar.tsx`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`

**Interfaces:**
- Produces: `monthKey(year: number, month: number): string`.
- Produces: `buildMonthGrid(year: number, selectedKey: string, currentKey: string): MonthOption[]`.
- `MonthYearPicker` consumes `selectedKey`, `currentKey`, and `onSelect(key)`.

- [ ] **Step 1: Write failing month-model tests**

```ts
expect(monthKey(2026, 8)).toBe('2026-08');
expect(buildMonthGrid(2026, '2026-07', '2026-08')[6]).toMatchObject({
  key: '2026-07', selected: true, disabled: false,
});
expect(buildMonthGrid(2026, '2026-07', '2026-08')[8]).toMatchObject({
  key: '2026-09', disabled: true,
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd dashboard
npm test -- src/components/dashboard/monthYearPickerModel.test.ts
```

Expected: FAIL because the model does not exist.

- [ ] **Step 3: Implement the model and popup**

Define:

```ts
export interface MonthOption {
  key: string;
  label: string;
  selected: boolean;
  disabled: boolean;
}
```

Build a 12-button, 3-column popup with year navigation. Disable a month when its key is lexically greater than `currentKey`. Use `pointerdown` outside handling, Escape handling, focus restoration, and `aria-expanded`/`aria-pressed`. Replace the `<select>` in `ContextBar`; keep the comparison label and URL `ky` behavior unchanged.

- [ ] **Step 4: Verify GREEN**

Run the model test and `npm run build`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/components/dashboard/monthYearPickerModel.ts dashboard/src/components/dashboard/monthYearPickerModel.test.ts dashboard/src/components/dashboard/MonthYearPicker.tsx dashboard/src/components/dashboard/ContextBar.tsx dashboard/src/components/dashboard/LeadDashboard.tsx
git commit -m "feat: add report month calendar picker"
```

### Task 6: Group and constrain the global class dropdown

**Files:**
- Create: `dashboard/src/components/common/classGrouping.ts`
- Create: `dashboard/src/components/common/classGrouping.test.ts`
- Modify: `dashboard/src/components/common/Header.tsx`

**Interfaces:**
- Produces: `groupClassesByCourse(classes: ClassSummary[]): ClassCourseGroup[]`.
- `ClassCourseGroup` is `{ courseName: string; classes: ClassSummary[] }`.

- [ ] **Step 1: Write failing grouping tests**

```ts
const groups = groupClassesByCourse([
  classSummary({ className: 'IC10', courseName: 'IELTS' }),
  classSummary({ className: 'IC2', courseName: 'IELTS' }),
  classSummary({ className: 'FT1', courseName: 'IELTS Nền Tảng' }),
]);

expect(groups.map((group) => group.courseName)).toEqual(['IELTS', 'IELTS Nền Tảng']);
expect(groups[0].classes.map((item) => item.className)).toEqual(['IC2', 'IC10']);
```

- [ ] **Step 2: Verify RED**

Run:

```bash
cd dashboard
npm test -- src/components/common/classGrouping.test.ts
```

Expected: FAIL because the grouping model does not exist.

- [ ] **Step 3: Implement grouping and scrollable UI**

Normalize blank course names to `Khóa học khác`, group with `Map`, and sort using:

```ts
new Intl.Collator('vi', { numeric: true, sensitivity: 'base' })
```

Render each group with a sticky heading inside a list container using `max-h-[min(60vh,28rem)] overflow-y-auto`. Preserve `role=listbox`, each `role=option`, `aria-selected`, risk badge, selection callback, outside click, and Escape behavior.

- [ ] **Step 4: Verify GREEN**

Run the grouping test and `npm run build`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add dashboard/src/components/common/classGrouping.ts dashboard/src/components/common/classGrouping.test.ts dashboard/src/components/common/Header.tsx
git commit -m "feat: group class selector by course"
```

### Task 7: Full verification and handoff

**Files:**
- Verify only; modify files only if a failing test identifies a regression.

**Interfaces:**
- Consumes all prior task outputs.
- Produces a clean, buildable branch ready for integration.

- [ ] **Step 1: Run backend verification**

```bash
cd backend
npm test -- --runInBand
npm run build
```

Expected: 19 or more suites pass, zero failures, build exit zero.

- [ ] **Step 2: Run frontend verification**

```bash
cd dashboard
npm test
npm run build
```

Expected: all Vitest files pass, build exit zero.

- [ ] **Step 3: Inspect the final change set**

```bash
git diff --check
git status --short
git log --oneline main..HEAD
```

Expected: no whitespace errors; only planned files changed; task commits appear in order.

- [ ] **Step 4: Review requirements against the design**

Confirm all four user-facing requirements and the current-vs-period boundary in `docs/superpowers/specs/2026-08-13-lead-dashboard-pass-coverage-period-selector-design.md` have matching tests and implementation.

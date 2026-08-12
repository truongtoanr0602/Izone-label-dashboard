# Lead Dashboard Data Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make August and historical Lead Dashboard cards, progress, weekly charts, and current class rows resilient to partial/future snapshots while enforcing calendar-month comparison semantics.

**Architecture:** Add a pure snapshot-quality resolver and reporting aggregators behind the existing NestJS screen-contract endpoint. The endpoint accepts `period=YYYY-MM`, resolves current/previous month observations and a 90-day weekly series, and returns current class rows independently of the report period. React renders the server contract without recalculating comparison cohorts or sample counts.

**Tech Stack:** PostgreSQL 16, NestJS 11, TypeScript 5.7, Prisma raw SQL, Jest 30, React 19, Recharts 3, Vitest 3, Docker Compose on the VPS.

## Global Constraints

- Khối 34 is always `course_id = 2` and authorization remains scoped by the authenticated user's `khoi_id`.
- Future-dated rows are excluded relative to the relevant `asOf` date in `Asia/Ho_Chi_Minh`.
- Missing measurements remain `null`; a numeric zero is valid only when source coverage proves it was measured.
- Attendance and homework require at least one student record and at least 80% non-null coverage for their own metric.
- Pass rates require test evidence; no test sample returns `null`.
- Progress is monotonic, capped by total sessions, and recomputed from completed/total sessions.
- KPI delta compares the selected calendar month with the immediately preceding month on the intersection of valid class IDs.
- The weekly chart reads 90 inclusive calendar days and carries a class observation forward for at most seven days.
- The Master Table is current state and does not change when the report period changes.
- React formats presentation only; it does not recalculate KPI values, comparison cohorts, progress, or quality fallback.
- Preserve unrelated dirty-worktree changes and deploy only after focused tests and builds pass.

---

### Task 1: Pure snapshot-quality resolver

**Files:**
- Create: `backend/src/dashboards/snapshot-quality.ts`
- Create: `backend/src/dashboards/snapshot-quality.spec.ts`

**Interfaces:**
- Consumes: normalized `ClassSnapshotEvidence[]` and `StudentMetricEvidence[]`.
- Produces: `resolveClassObservation(input, asOf, options): ResolvedClassObservation`.

- [ ] **Step 1: Write failing tests for partial rows, legitimate zero, coverage, future rows, and monotonic progress**

```ts
it('falls back from a newer empty snapshot but keeps its roster', () => {
  const result = resolveClassObservation(fixtureWithAug10AndPartialAug12, '2026-08-12');
  expect(result.roster.dataAsOf).toBe('2026-08-12');
  expect(result.attendance).toMatchObject({ value: 84.4, dataAsOf: '2026-08-10', fallbackUsed: true });
  expect(result.progress).toMatchObject({ completedSessions: 22, totalSessions: 27, percentage: 81.5 });
});

it('keeps zero pass when test evidence exists', () => {
  const result = resolveClassObservation(testBackedZeroFixture, '2026-08-12');
  expect(result.passStandard.value).toBe(0);
});
```

- [ ] **Step 2: Run the resolver spec and verify RED**

Run: `cd backend && npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts`

Expected: FAIL because `snapshot-quality` does not exist.

- [ ] **Step 3: Implement focused evidence and result types**

```ts
export interface ResolvedMetric {
  value: number | null;
  dataAsOf: string | null;
  sampleSize: number;
  recordCount: number;
  coveragePct: number | null;
  fallbackUsed: boolean;
}

export function resolveClassObservation(
  input: ClassObservationEvidence,
  asOf: string,
  options: { minimumCoveragePct: number },
): ResolvedClassObservation;
```

Implement independent attendance/homework coverage, test-backed pass selection, future-row exclusion, latest roster selection, and progress as the capped maximum observed completed-session count.

- [ ] **Step 4: Run resolver tests and verify GREEN**

Run: `cd backend && npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts`

Expected: all resolver tests pass.

- [ ] **Step 5: Commit the resolver**

```bash
git add backend/src/dashboards/snapshot-quality.ts backend/src/dashboards/snapshot-quality.spec.ts
git commit -m "feat: resolve valid class snapshot evidence"
```

---

### Task 2: Calendar periods, monthly KPI comparisons, and weekly aggregation

**Files:**
- Modify: `backend/src/dashboards/dashboard.types.ts`
- Modify: `backend/src/dashboards/lead-aggregation.ts`
- Modify: `backend/src/dashboards/lead-aggregation.spec.ts`

**Interfaces:**
- Consumes: `ResolvedClassObservation[]` at report, previous, and weekly boundaries.
- Produces: `parseReportPeriod(period, today)`, `aggregateResolvedMetrics(rows)`, `compareMonthlyMetrics(current, previous)`, and `buildWeeklyTrend(rows, trendFrom, reportAsOf)`.

- [ ] **Step 1: Add failing calendar and comparison tests**

```ts
expect(parseReportPeriod('2026-08', '2026-08-12')).toEqual({
  period: '2026-08', reportAsOf: '2026-08-12', previousAsOf: '2026-07-31',
  trendFrom: '2026-05-15', currentAsOf: '2026-08-12',
});

expect(compareMonthlyMetrics(currentRows, previousRows).attendanceAvg)
  .toMatchObject({ delta: 6, comparableClasses: 2, totalClasses: 3 });
```

Add a weekly test proving a 90-day window produces 13–14 ordered ISO-week points, a nine-day-old observation is not carried, and missing weekly metrics remain null.

- [ ] **Step 2: Run aggregation tests and verify RED**

Run: `cd backend && npm test -- --runInBand src/dashboards/lead-aggregation.spec.ts`

Expected: FAIL for missing period/weekly functions.

- [ ] **Step 3: Implement the reporting functions**

```ts
export function parseReportPeriod(period: string | undefined, todayIso: string): ReportCalendar;
export function compareMonthlyMetrics(
  current: ResolvedClassObservation[],
  previous: ResolvedClassObservation[],
): LeadMonthlyKpis;
export function buildWeeklyTrend(
  evidence: ClassObservationEvidence[],
  calendar: Pick<ReportCalendar, 'trendFrom' | 'reportAsOf'>,
): LeadWeeklyTrendPoint[];
```

Keep weighted averages metric-specific, use class-ID intersections for deltas, compute Net Momentum by calendar month, and separate attrition count delta from attrition rate.

- [ ] **Step 4: Run aggregation tests and verify GREEN**

Run: `cd backend && npm test -- --runInBand src/dashboards/lead-aggregation.spec.ts`

Expected: all aggregation tests pass.

- [ ] **Step 5: Commit reporting aggregation**

```bash
git add backend/src/dashboards/dashboard.types.ts backend/src/dashboards/lead-aggregation.ts backend/src/dashboards/lead-aggregation.spec.ts
git commit -m "feat: aggregate monthly KPIs and weekly trends"
```

---

### Task 3: Integrate quality resolution into the Lead screen contract

**Files:**
- Modify: `backend/src/dashboards/dashboards.service.ts`
- Modify: `backend/src/dashboards/dashboards.service.spec.ts`
- Modify: `backend/src/dashboards/dashboards.controller.ts`

**Interfaces:**
- Consumes: `LeadDashboardQuery.period`, authenticated `AuthUser`, resolver and reporting functions from Tasks 1–2.
- Produces: `getLeadDashboard(query, user)` with month-correct KPIs, weekly trend points, and current quality-aware classes.

- [ ] **Step 1: Add failing service tests for August and report/current separation**

```ts
it('uses July month-end as the August baseline', async () => {
  const response = await service.getLeadDashboard({ period: '2026-08' }, lead);
  expect(response.meta.previousAsOf).toBe('2026-07-31');
  expect(response.kpis.attendanceAvg.comparableClasses).toBe(2);
});

it('keeps current class rows identical when report period changes', async () => {
  const july = await service.getLeadDashboard({ period: '2026-07' }, lead);
  const august = await service.getLeadDashboard({ period: '2026-08' }, lead);
  expect(july.classes).toEqual(august.classes);
});
```

Also assert that conflicting `period` and `from`/`to` returns `400`, future rows are absent, query count stays bounded, and class rows contain quality metadata.

- [ ] **Step 2: Run the service spec and verify RED**

Run: `cd backend && npm test -- --runInBand src/dashboards/dashboards.service.spec.ts`

Expected: FAIL because the service still uses one range-scoped snapshot query for KPIs, trend, and class rows.

- [ ] **Step 3: Replace the Lead query composition**

Load bounded evidence for:

- Previous-month boundary through `reportAsOf`.
- The 90-day weekly window.
- Current state through `currentAsOf`.
- Student metric/test evidence for the same bounded class/date scope.
- Label transitions for selected and previous calendar months.

Compose the response as:

```ts
{
  meta: { period, reportAsOf, previousAsOf, trendFrom, currentAsOf, ... },
  kpis: monthlyComparison.kpis,
  trend: weeklyTrend,
  labelDistribution: aggregateCurrentClasses(currentRows),
  classes: currentRows.map(mapResolvedLeadClass),
}
```

Log only aggregate quality counters and never student PII.

- [ ] **Step 4: Run dashboard backend tests and build**

Run:

```bash
cd backend
npm test -- --runInBand src/dashboards
npm run build
```

Expected: dashboard suites pass and TypeScript build exits zero.

- [ ] **Step 5: Commit backend integration**

```bash
git add backend/src/dashboards
git commit -m "fix: compose lead dashboard from valid observations"
```

---

### Task 4: Update frontend contracts and presentation adapters

**Files:**
- Modify: `dashboard/src/api/dashboardContracts.ts`
- Modify: `dashboard/src/api/dashboardContracts.test.ts`
- Modify: `dashboard/src/api/dashboardService.ts`

**Interfaces:**
- Consumes: the revised backend JSON contract.
- Produces: `LeadDashboardResponse`, `LeadDashboardFilters.period`, `toLeadWeeklyTrendPoint(point)`, and presentation-only card metadata.

- [ ] **Step 1: Write failing contract fixture tests**

```ts
expect(response.kpis.attendanceAvg).toMatchObject({
  classesReported: 16,
  comparableClasses: 15,
  totalClasses: 17,
});
expect(response.trend[0]).toHaveProperty('weekStart');
expect(response.classes[0].progress.percentage).toBe(81.5);
expect(response.classes[0].dataQuality.status).toBe('fallback');
```

- [ ] **Step 2: Run contract tests and verify RED**

Run: `cd dashboard && npm test -- --run src/api/dashboardContracts.test.ts`

Expected: FAIL because the old interface uses daily `date`, shared counts, and `progressPct`.

- [ ] **Step 3: Update exact TypeScript contracts and API parameters**

```ts
export interface LeadDashboardFilters {
  courseId?: 2;
  khoiId: number;
  period: string;
  classStatus?: string;
  teacherId?: number;
  classId?: number;
}
```

Add the quality metadata, nested progress object, metric-specific counts, attrition count/rate fields, and weekly chart fields. Remove React production reliance on legacy `from`/`to` construction.

- [ ] **Step 4: Run contract tests and dashboard build**

Run:

```bash
cd dashboard
npm test -- --run src/api/dashboardContracts.test.ts
npm run build
```

Expected: contract tests and TypeScript/Vite build pass.

- [ ] **Step 5: Commit frontend contracts**

```bash
git add dashboard/src/api/dashboardContracts.ts dashboard/src/api/dashboardContracts.test.ts dashboard/src/api/dashboardService.ts
git commit -m "feat: consume quality-aware lead dashboard contract"
```

---

### Task 5: Correct KPI cards and Master Table rendering

**Files:**
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`
- Modify: `dashboard/src/components/dashboard/KpiRow.tsx`
- Modify: `dashboard/src/components/dashboard/KpiCard.tsx`
- Modify: `dashboard/src/components/dashboard/kpiFormat.ts`
- Modify: `dashboard/src/components/dashboard/kpiFormat.test.ts`

**Interfaces:**
- Consumes: server metric counts, attrition count/rate, and current class quality fields.
- Produces: correctly labeled cards and quality-aware current class rows.

- [ ] **Step 1: Add failing formatter/presentation tests**

```ts
expect(formatComparisonNote({ value: -3.2, comparableClasses: 12, totalClasses: 17 }))
  .toContain('12/17 lớp so sánh được');
expect(formatAttritionNote({ rate: 1.8, newDroppedStudents: 4 }))
  .toBe('Tỷ lệ attrition: 1.8%');
```

Add a pure adapter test proving the same class contract maps to the same Master Table row for July and August and that progress uses the server's nested progress value.

- [ ] **Step 2: Run focused frontend tests and verify RED**

Run:

```bash
cd dashboard
npm test -- --run src/components/dashboard/kpiFormat.test.ts src/api/dashboardContracts.test.ts
```

Expected: FAIL for the missing attrition formatter and old shared class-count mapping.

- [ ] **Step 3: Implement card and table mapping changes**

- Pass each metric's `comparableClasses` and `totalClasses` directly to `KpiCard`.
- Render `Bỏ học trong tháng` with the current count and count delta; show attrition rate in the supporting note.
- Render Net Momentum current value and its previous-month delta as distinct numbers.
- Use `contract.progress.percentage` without fallback to the legacy class value.
- Show `Dữ liệu đến DD/MM` for fallback rows and `Chưa đủ dữ liệu` when quality is insufficient.
- Remove the misleading claim that the current table is sourced from the selected report range.

- [ ] **Step 4: Run focused tests, lint, and build**

Run:

```bash
cd dashboard
npm test -- --run src/components/dashboard/kpiFormat.test.ts src/api/dashboardContracts.test.ts
npm run lint
npm run build
```

Expected: tests/build pass; lint has no new errors.

- [ ] **Step 5: Commit KPI and table UI**

```bash
git add dashboard/src/components/dashboard/LeadDashboard.tsx dashboard/src/components/dashboard/KpiRow.tsx dashboard/src/components/dashboard/KpiCard.tsx dashboard/src/components/dashboard/kpiFormat.ts dashboard/src/components/dashboard/kpiFormat.test.ts
git commit -m "fix: render monthly KPI cards and current class state"
```

---

### Task 6: Render the weekly 90-day chart

**Files:**
- Modify: `dashboard/src/components/dashboard/TrendChart.tsx`
- Create: `dashboard/src/components/dashboard/trendChartModel.ts`
- Create: `dashboard/src/components/dashboard/trendChartModel.test.ts`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`

**Interfaces:**
- Consumes: `LeadWeeklyTrendPoint[]` from the API contract.
- Produces: `toTrendChartRows(points)` and weekly Recharts visualization.

- [ ] **Step 1: Write failing chart-model tests**

```ts
expect(toTrendChartRows(points)[0]).toMatchObject({
  weekLabel: '11/05–17/05',
  classesReported: 15,
  activeStudentSample: 241,
});
expect(toTrendChartRows(points)[0].attendanceAvg).toBeNull();
```

- [ ] **Step 2: Run chart tests and verify RED**

Run: `cd dashboard && npm test -- --run src/components/dashboard/trendChartModel.test.ts`

Expected: FAIL because the weekly chart model does not exist.

- [ ] **Step 3: Implement the weekly chart model and component**

- Use one categorical row per ISO week.
- Keep null metric values and `connectNulls={false}`.
- Reduce dot clutter and use active dots for hover.
- Show week range, reporting classes, student sample, test-class count, and latest source date in the tooltip.
- Change copy from `90 tuần` to `90 ngày · khoảng 13 tuần`.
- Keep endpoint labels only on the last non-null value of each series.

- [ ] **Step 4: Run chart tests and production build**

Run:

```bash
cd dashboard
npm test -- --run src/components/dashboard/trendChartModel.test.ts
npm run build
```

Expected: chart-model tests and build pass.

- [ ] **Step 5: Commit weekly chart UI**

```bash
git add dashboard/src/components/dashboard/TrendChart.tsx dashboard/src/components/dashboard/trendChartModel.ts dashboard/src/components/dashboard/trendChartModel.test.ts dashboard/src/components/dashboard/LeadDashboard.tsx
git commit -m "fix: render quality-aware weekly lead trends"
```

---

### Task 7: Full verification and VPS deployment

**Files:**
- Modify only files from Tasks 1–6 if verification exposes defects.
- Keep: `report/2026-08-12-lead-dashboard-data-quality-design.md`
- Keep: `report/2026-08-12-lead-dashboard-data-quality-implementation-plan.md`

**Interfaces:**
- Verifies the screen contract through PostgreSQL, NestJS, Nginx, and React production containers.

- [ ] **Step 1: Run full scoped verification**

```bash
cd backend
npm test -- --runInBand src/dashboards
npm run build

cd ../dashboard
npm test -- --run src/api/dashboardContracts.test.ts src/components/dashboard/kpiFormat.test.ts src/components/dashboard/trendChartModel.test.ts
npm run lint
npm run build
```

Expected: all scoped tests/builds pass and lint has no new errors.

- [ ] **Step 2: Audit production paths**

Search for legacy recalculation and wrong copy:

```bash
rg -n "requestedStart|90 tuần|progressPct|comparable = dashboard.classes.length|periodAttritionRate" dashboard/src backend/src/dashboards
```

Expected: no production Lead path uses the old range construction, shared comparable count, or flat progress percentage.

- [ ] **Step 3: Rebuild and restart backend/dashboard containers**

```bash
docker compose -f docker-compose.prod.yml build backend dashboard
docker compose -f docker-compose.prod.yml up -d --no-deps backend dashboard
```

Expected: both containers are running with restart count zero.

- [ ] **Step 4: Run authenticated production smoke tests**

Verify through Nginx on `127.0.0.1:8088`:

- `period=2026-08` returns non-zero fallback attendance/homework for the known partial 12-Aug snapshot.
- `period=2026-07` uses `previousAsOf=2026-06-30`.
- Both periods return identical current Master Table class progress.
- Weekly trend contains 13–14 points and does not end in synthetic zero.
- Unauthenticated access remains `401`.

- [ ] **Step 5: Review container logs and current listeners**

```bash
docker logs --since 5m izone_backend_prod
docker logs --since 5m izone_dashboard_prod
ss -ltnp | rg ':(3000|5432|8088|5173)\\b'
```

Expected: no application/Nginx errors, production ports are present, and Vite port `5173` is absent.

- [ ] **Step 6: Commit any final verified corrections**

Stage only feature files, review `git diff --cached --check`, and commit with:

```bash
git commit -m "fix: correct lead dashboard reporting data"
```

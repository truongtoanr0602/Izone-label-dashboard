# Lead Dashboard Period-Active Classes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Lead Dashboard use classes evidenced as active by at least one class snapshot in the selected month, including currently completed classes and excluding pending/cancelled classes.

**Architecture:** Extend the report calendar with explicit month boundaries, then replace every duplicated current-status class predicate in `getLeadDashboard` with one shared semantic SQL predicate: status in `on_going/completed` plus an `EXISTS` snapshot between the period boundaries. Remove the obsolete frontend/API `classStatus` parameter while preserving response contracts and all metric cutoffs.

**Tech Stack:** NestJS, Prisma raw SQL, PostgreSQL, Jest, React/TypeScript, Vitest.

## Global Constraints

- Class membership requires a `class_daily_snapshots.snapshot_date` from the first through last day of the selected month, inclusive.
- Include current statuses `on_going` and `completed`; exclude `pending` and `cancelled`.
- Preserve `course_id = 2`, Lead `khoi_id`, optional teacher/class filters, `snapshot_stage IS NULL`, and student-status rules.
- Snapshot/metric reads remain capped by existing `currentAsOf`/`reportAsOf`; period membership must not expose future measurements.
- All seven class-dependent Lead queries must use the same membership predicate; `configRows` must not.
- Preserve unrelated dirty worktree changes.

---

### Task 1: Explicit selected-month boundaries

**Files:**
- Modify: `backend/src/dashboards/lead-aggregation.ts`
- Modify: `backend/src/dashboards/lead-aggregation.spec.ts`

**Interfaces:**
- Produces `ReportCalendar.periodStart: string` and `ReportCalendar.periodEnd: string` in ISO `YYYY-MM-DD` form.

- [ ] Write failing assertions that August 2026 produces `periodStart: '2026-08-01'` and `periodEnd: '2026-08-31'`, including the current partial month.
- [ ] Run `npm test -- lead-aggregation.spec.ts` from `backend/` and verify the missing fields fail.
- [ ] Implement month-start/month-end fields without changing `reportAsOf` behavior.
- [ ] Re-run the focused test and verify it passes.

### Task 2: Period-active membership in every Lead query

**Files:**
- Modify: `backend/src/dashboards/dashboards.service.ts`
- Modify: `backend/src/dashboards/dashboards.service.spec.ts`
- Modify: `backend/src/dashboards/dashboard.types.ts`

**Interfaces:**
- Consumes `calendar.periodStart`/`periodEnd`.
- Removes `LeadDashboardQuery.classStatus`.
- Produces unchanged `LeadDashboardResponse` using a period-active class set.

- [ ] Add a failing service test that captures all `$queryRaw` calls and asserts the seven class-dependent SQL statements contain `c.status IN ('on_going', 'completed')` and a period-bounded `EXISTS` against `class_daily_snapshots`, while the config query does not.
- [ ] Run the focused service test and verify it fails against `c.status = classStatus`.
- [ ] Remove `classStatus` parsing and replace every class-dependent predicate consistently.
- [ ] Keep measurement cutoffs (`currentAsOf`, `reportAsOf`) unchanged and remove `classStatus` from the query type.
- [ ] Re-run dashboard service tests and backend build.

### Task 3: Remove the fixed frontend status parameter

**Files:**
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`
- Modify: `dashboard/src/api/dashboardContracts.ts`

**Interfaces:**
- `LeadDashboardFilters` retains `courseId`, `khoiId`, `period`, `teacherId`, and `classId`; removes `classStatus`.

- [ ] Remove `classStatus: 'on_going'` from the Lead request and its TypeScript filter interface.
- [ ] Run `npx tsc -b` to prove no remaining caller depends on the field.

### Task 4: Verification

**Files:**
- Verify only.

- [ ] Run backend focused tests, full backend tests, and `npm run build`.
- [ ] Run dashboard `npx tsc -b`, `npm run lint`, `npm test`, and `npm run build`; report pre-existing failures separately rather than changing unrelated KPI code.
- [ ] Run `git diff --check` and inspect only task-owned hunks.
- [ ] If a local authenticated environment is available, compare two report months and verify completed classes with snapshots appear only in their evidenced month.

# IZONE Screen-contract Dashboards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one backend-composed API contract for the Lead Dashboard and one for the Teacher Dashboard, then migrate React to consume them without client-side business calculations.

**Architecture:** Add a focused NestJS `dashboards` module. Pure calculation and labeling functions are isolated from SQL and unit tested; a query service loads raw rows and a facade composes response DTOs. Frontend API adapters expose the two contracts and existing UI components receive server-computed data.

**Tech Stack:** NestJS 11, TypeScript 5.7, Prisma raw SQL, PostgreSQL 16, React 19, Axios, Recharts 3, Jest, Vitest.

## Global Constraints

- Khối 34 is `course_id = 2`; never rely on `khoi_id` alone.
- Lead trend range is inclusive and at most 90 calendar days.
- Missing metrics remain `null`.
- Intervention priority is `level_3 > level_2 > level_1 > none`.
- All students are returned; only `on_going` students enter action queues.
- Preserve existing uncommitted work and legacy endpoints during migration.

---

### Task 1: Pure labeling engine

**Files:**
- Create: `backend/src/dashboards/labeling-engine.ts`
- Test: `backend/src/dashboards/labeling-engine.spec.ts`

**Interfaces:**
- Consumes: normalized student metrics and numeric thresholds.
- Produces: `classifyStudent(input, thresholds): StudentClassification`.

- [ ] Write Jest cases for 44.99, 45, 59.99, 60, inactive, missing data, and M3-over-M1 priority.
- [ ] Run `npm test -- --runInBand src/dashboards/labeling-engine.spec.ts` and confirm the missing module failure.
- [ ] Implement `DashboardThresholds`, `StudentClassification`, issue codes, and `classifyStudent`.
- [ ] Run the focused test and confirm all cases pass.

### Task 2: Pure lead aggregation

**Files:**
- Create: `backend/src/dashboards/lead-aggregation.ts`
- Test: `backend/src/dashboards/lead-aggregation.spec.ts`

**Interfaces:**
- Consumes: normalized class snapshot rows and label transition rows.
- Produces: `aggregateSnapshots(rows)`, `buildTrend(rows, transitions, from, to)`, and `calculateNetMomentum(transitions)`.

- [ ] Write tests proving weighted averages, null-on-empty, risk rate, attrition delta, and Net Momentum.
- [ ] Run the focused Jest suite and confirm failure before implementation.
- [ ] Implement the smallest pure functions that satisfy the tests.
- [ ] Run the focused Jest suite and confirm it passes.

### Task 3: Dashboard backend module and query facade

**Files:**
- Create: `backend/src/dashboards/dashboard.types.ts`
- Create: `backend/src/dashboards/dashboards.service.ts`
- Create: `backend/src/dashboards/dashboards.controller.ts`
- Create: `backend/src/dashboards/dashboards.module.ts`
- Create: `backend/src/dashboards/dashboards.service.spec.ts`
- Modify: `backend/src/app.module.ts`

**Interfaces:**
- Produces: `getLeadDashboard(query, user)` and `getTeacherDashboard(classId, asOf, user)`.
- HTTP routes: `GET /api/v1/lead-dashboard` and `GET /api/v1/classes/:classId/teacher-dashboard`.

- [ ] Write service tests with a mocked `PrismaService` for authorization, course filtering inputs, all-student inclusion, and summary/student count invariants.
- [ ] Run focused tests and confirm failure.
- [ ] Implement DTO parsing with `BadRequestException` for invalid or over-90-day ranges.
- [ ] Implement fixed-count raw queries: scoped snapshots/transitions for Lead; class/latest snapshot, students/latest records/test scores/config/reviews for Teacher.
- [ ] Compose camelCase response DTOs using Tasks 1 and 2.
- [ ] Add controller RBAC and register `DashboardsModule`.
- [ ] Run dashboard backend tests and build.

### Task 4: Database performance migration

**Files:**
- Create: `database/migrations/009_dashboard_screen_contract_indexes.sql`

**Interfaces:**
- Adds idempotent indexes for screen-contract query predicates.

- [ ] Add `IF NOT EXISTS` indexes for `(course_id, status, teacher_id)`, `(class_id, record_date DESC, student_id)`, and `(class_id, review_status, deadline)`.
- [ ] Validate SQL syntax against PostgreSQL when a database is available; otherwise document that runtime migration verification is pending.

### Task 5: Frontend contract types and API adapters

**Files:**
- Create: `dashboard/src/api/dashboardContracts.ts`
- Modify: `dashboard/src/api/dashboardService.ts`
- Test: `dashboard/src/api/dashboardContracts.test.ts`

**Interfaces:**
- Produces: `LeadDashboardResponse`, `TeacherDashboardResponse`, `getLeadDashboard(filters)`, and `getTeacherDashboard(classId, asOf?)`.

- [ ] Add compile-time/fixture tests for null metrics, exclusive intervention values, and camelCase response shape.
- [ ] Run Vitest and confirm the fixture test initially fails.
- [ ] Implement exact interfaces and Axios calls.
- [ ] Run focused Vitest and TypeScript build.

### Task 6: Consume Lead screen contract

**Files:**
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`
- Modify: `dashboard/src/components/dashboard/KpiRow.tsx`
- Modify: `dashboard/src/components/dashboard/TrendChart.tsx`

**Interfaces:**
- Consumes: `LeadDashboardResponse.kpis`, `.trend`, and `.classes`.

- [ ] Replace the three-request snapshot/event/log analytics fetch with `getLeadDashboard`.
- [ ] Remove production calls to `aggregateKhoi`, `metricDelta`, and `labelFlowInPeriod` from `LeadDashboard`.
- [ ] Feed Recharts the server trend array with `connectNulls={false}`.
- [ ] Keep legacy class drill-down behavior intact.
- [ ] Run dashboard tests and build.

### Task 7: Consume Teacher screen contract

**Files:**
- Modify: `dashboard/src/App.tsx`
- Modify: `dashboard/src/components/dashboard/TopRibbon.tsx`
- Modify: `dashboard/src/components/dashboard/StudentTable.tsx`
- Modify: `dashboard/src/data/types.ts`

**Interfaces:**
- Consumes: `TeacherDashboardResponse.classHeader`, `.actionSummary`, `.tabs`, and `.students`.

- [ ] Replace the class-change student request with the teacher screen-contract request.
- [ ] Adapt server student rows to existing presentation fields without recomputing labels or thresholds.
- [ ] Render card counts from `actionSummary`.
- [ ] Filter tabs by exclusive `interventionLevel`.
- [ ] Preserve contact-log actions and current checkpoint behavior.
- [ ] Run dashboard tests and build.

### Task 8: Full verification and contract audit

**Files:**
- Modify if needed: files from Tasks 1–7 only.

**Interfaces:**
- Verifies both screen contracts end to end at build/test level.

- [ ] Run backend Jest suite and `npm run build`.
- [ ] Run dashboard Vitest suite, lint, and `npm run build`.
- [ ] Search production frontend code for legacy metric recomputation and unsafe `100`/`Math.random()` fallbacks; remove only screen-contract-path occurrences.
- [ ] Compare response names used by React with `dashboardContracts.ts` and fix mismatches.
- [ ] Record any environment-only database verification that could not be executed.

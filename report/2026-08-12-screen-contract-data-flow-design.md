# IZONE Label Dashboard — Screen-contract Data Flow Design

**Date:** 2026-08-12
**Scope:** Khối 34 (`course_id = 2`)
**Decision:** Separate Lead (Macro) and Teacher (Micro) read contracts.

## 1. Architecture decision

The dashboard exposes two composed read endpoints:

- `GET /api/v1/lead-dashboard`: filtered 90-day macro analytics, KPI values and deltas, Net Momentum, trend points, and current class rows.
- `GET /api/v1/classes/:classId/teacher-dashboard`: class header, exclusive intervention counts, soft-pass SLA, and every student with a server-computed label and action.

PostgreSQL remains the source of truth. NestJS owns authorization, aggregation, thresholds, labels, and recommended actions. React owns request state and rendering only.

## 2. Cross-cutting invariants

- The actual table is `izone.class_daily_snapshots` (singular `class`).
- Every lead query includes `classes.course_id = 2` and the authenticated lead's `khoi_id`.
- A trend range is inclusive and may contain at most 90 calendar days.
- Missing measurements are `null`, never synthetic `0` or `100`.
- Class averages are weighted by `active_students`.
- Pass rates exclude classes without a test sample.
- Teacher classification is exclusive: `level_3 > level_2 > level_1 > none`.
- Secondary violations remain in `issues[]` even when a higher intervention wins.
- Inactive students remain in the roster but never enter an intervention queue.
- `test_scores` is the detailed test source of truth; denormalized daily values are used as snapshot/audit values.

## 3. Lead flow

```text
GlobalFilterBar
  -> GET /api/v1/lead-dashboard?courseId=2&khoiId=34&from=...&to=...
  -> AuthGuard and scope validation
  -> scoped classes
  -> class_daily_snapshots in range
  -> student_daily_records label transitions in range
  -> weighted KPI + daily trend + class rows
  -> InsightsRibbon / AnalyticsGrid / ClassMasterTable
```

The latest row is selected per class, not by the global maximum snapshot date. Daily trend points use a dense calendar series; absent data remains `null` so Recharts breaks the line.

### Metrics

- `attendanceAvg = sum(attendance_avg * active_students) / sum(active_students)`.
- `homeworkAvg` uses the same weighting.
- `passStandardRate` and `softPassRate` use the same weighting but only for classes with a test sample.
- `riskRate = sum(label_red + label_grey) / sum(active_students) * 100`.
- `newDroppedStudents = sum(max(0, dropped_end - dropped_start))`.
- `periodAttritionRate = newDroppedStudents / active_students_at_start * 100`.
- `upTransitions` and `downTransitions` count daily records where `has_label_changed = true`.
- `netMomentum = upTransitions - downTransitions`; with no recalculation event it is `null`.

The response contains `meta`, `kpis`, `trend`, `labelDistribution`, and `classes`. KPI objects include value, baseline, delta, semantic direction, and sample sizes where applicable.

## 4. Teacher flow

```text
Class selection
  -> GET /api/v1/classes/:classId/teacher-dashboard?asOf=...
  -> AuthGuard and class scope validation
  -> classes + teachers + latest class snapshot
  -> students as the driving table
  -> LEFT JOIN LATERAL latest student_daily_records
  -> aggregate confirmed test_scores
  -> open pass_reviews and current contact logs
  -> LabelingEngine
  -> classHeader + actionSummary + tabs + students
```

Starting from `students` guarantees that students without a daily record are still returned.

### Label and intervention rules

Thresholds come from `system_configs`: attendance 90, homework 90, grey below 45, red from 45 to below 60, and passing test average from 60.

For active students:

1. Test average below 45: `grey`, `level_3`, `REVIEW_LEARNING_PATH`.
2. Otherwise, test average below 60: `red`, `level_2`, `FOLLOW_UP_CLOSELY`.
3. Otherwise, attendance/homework below 90 or a recent-drop flag: `yellow`, `level_1`, `REMIND_STUDY_HABIT`.
4. With complete passing data: `green`, `none`, `NONE`.
5. With insufficient data and no actionable habit issue: `no_data`, `none`, `WAIT_FOR_DATA`.

Soft-pass review is an independent administrative queue and does not change the intervention level.

## 5. Frontend consumption

- `LeadDashboard` performs one screen-contract request and passes `kpis` to the ribbon, `trend` directly to Recharts, and `classes` to the master table.
- `App` performs one teacher screen-contract request when the selected class changes.
- `TopRibbon` reads `actionSummary`; it does not count predicates independently.
- `StudentTable` filters `interventionLevel` locally. Exclusive levels prevent duplicate rows across tabs.
- Compatibility adapters may populate legacy component props during migration, but may not recalculate thresholds.

## 6. Errors and quality

- `400`: invalid date or a range over 90 days.
- `401`: missing/expired authentication.
- `403`: class or khoi outside user scope.
- `404`: unknown class.
- `503`: database unavailable.

Missing or conflicting measurements are surfaced in `dataQuality`; they are never silently replaced.

## 7. Acceptance criteria

- Lead endpoint enforces course 2, scope, and 90-day limit.
- Weighted metrics and transition counts pass boundary tests.
- Teacher endpoint returns every class student, including students without records.
- Label boundaries 44.99/45/59.99/60 and exclusive priority are covered by unit tests.
- Action-card counts exactly equal counts derived from the returned student array.
- React production flow no longer calculates dashboard business metrics.
- Backend and dashboard builds and test suites pass.

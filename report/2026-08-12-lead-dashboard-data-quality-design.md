# Lead Dashboard Data Quality and Reporting Design

**Date:** 2026-08-12
**Scope:** Lead Dashboard for Khối 34 (`course_id = 2`)
**Decision:** Normalize incomplete snapshots at query time; do not rewrite historical source rows.

## 1. Problem statement

The current Lead Dashboard mixes report-period analytics with current class state and treats incomplete snapshots as valid measurements. This causes four visible failures:

- A report for August can select a newly inserted snapshot with `completed_sessions = 0` and no matching student records, forcing KPI cards and class rows to zero.
- A report for July fetches a trailing 90-day range and compares the last July snapshot with the first snapshot in May, even though the UI says it compares July with June.
- The chart renders 90 daily slots while its copy calls them weeks. Sparse daily reporting and a changing class cohort produce broken, noisy lines.
- The frontend substitutes total class count for the actual comparable/sample count returned by the backend.

The PostgreSQL history contains useful source evidence but also partial current-day rows, future mock rows, and historical rows whose progress was backfilled as one completed session. The API must distinguish absence from a legitimate zero and must expose data freshness instead of silently fabricating values.

## 2. Selected approach

Use a backend query-time quality resolver. Raw rows remain immutable. The resolver chooses the latest valid source independently for roster, progress, attendance, homework, and pass metrics.

Alternatives were rejected for this phase:

- Rewriting snapshot history cannot reconstruct exact missing historical session counts and does not prevent the ingestion pipeline from producing another partial row.
- A clean materialized reporting layer is a viable later optimization, but adds ETL scheduling and operational state before the read rules have stabilized.

## 3. Reporting calendar

The Lead endpoint accepts a calendar month instead of asking React to construct an ambiguous 90-day KPI range:

```text
GET /api/v1/lead-dashboard?courseId=2&period=YYYY-MM
```

The server derives:

- `reportAsOf`: the last calendar day of the selected month, capped at the current date in `Asia/Ho_Chi_Minh` for the current month.
- `previousAsOf`: the last calendar day of the preceding month.
- `trendFrom`: 89 days before `reportAsOf`, inclusive.
- `currentAsOf`: the current date in `Asia/Ho_Chi_Minh`, used only by the Master Table.

Future snapshot and student-record dates are excluded from all four scopes. The old `from`/`to` parameters may remain temporarily for compatibility, but the production React flow uses `period`; the API must reject conflicting `period` and `from`/`to` inputs.

## 4. Snapshot Quality Resolver

The resolver produces metric-specific observations per class and `asOf` date.

### 4.1 Roster observation

- Choose the newest class snapshot on or before `asOf`.
- Roster counts may be used even when learning metrics in the same row are incomplete.
- Return the chosen snapshot date as `rosterAsOf`.

### 4.2 Progress observation

- Exclude rows with a missing or non-positive total session count.
- `completedSessions` is the greatest observed completed-session count on or before `asOf`, capped by `totalSessions`.
- `totalSessions` comes from the class master value when positive, otherwise from the chosen snapshot.
- Recompute `percentage = completedSessions / totalSessions * 100`; never trust stored `progress_pct` independently.
- This enforces the domain invariant that completed course progress cannot decrease.
- Return the source date of the maximum observation as `progressAsOf`.

This rule prevents a partial August row from changing progress from 22 sessions to zero. It does not claim to reconstruct an exact historical session count when every historical row is corrupt; in that case the API returns the best observed evidence and adds `PROGRESS_HISTORY_INCOMPLETE` to the class data-quality warnings.

### 4.3 Attendance and homework observations

For each class/date, calculate evidence coverage from `student_daily_records`:

```text
attendanceCoverage = non-null attendance_pct rows / student record rows
homeworkCoverage   = non-null homework_pct rows / student record rows
```

An observation is valid when the date has at least one student record and coverage is at least 80% for that metric. A numeric zero is valid when this coverage rule passes. Otherwise the resolver searches backward for the closest valid observation.

The resolved class metric is calculated from student records, not copied from the potentially partial class snapshot. Each observation includes `value`, `dataAsOf`, `sampleSize`, `recordCount`, `coveragePct`, and `fallbackUsed`.

### 4.4 Pass observations

- A class enters a pass-rate denominator only when at least one student has test evidence available by the observation date.
- Pass-standard and soft-pass values are calculated from the applicable student state/test evidence for that date.
- A computed `0%` is legitimate when a test sample exists and no student passes.
- No test sample produces `null`, not zero, and the class is excluded from the pass denominator.
- Return `testedStudents`, `dataAsOf`, and `fallbackUsed`.

### 4.5 Quality metadata

Every class row exposes:

```json
{
  "dataQuality": {
    "status": "complete | fallback | insufficient",
    "warnings": [],
    "rosterAsOf": "YYYY-MM-DD",
    "progressAsOf": "YYYY-MM-DD",
    "attendanceAsOf": "YYYY-MM-DD",
    "homeworkAsOf": "YYYY-MM-DD",
    "passAsOf": "YYYY-MM-DD"
  }
}
```

Warnings use stable codes such as `PARTIAL_SNAPSHOT`, `LOW_ATTENDANCE_COVERAGE`, `LOW_HOMEWORK_COVERAGE`, `NO_TEST_SAMPLE`, and `PROGRESS_HISTORY_INCOMPLETE`.

## 5. KPI semantics

The main KPI value represents the selected month at `reportAsOf`. The comparison baseline represents `previousAsOf`.

- Attendance and homework are weighted by active student count.
- Pass rates are weighted only over classes/students with test evidence.
- The main value includes every class with a valid current-period observation for that metric.
- Delta is recalculated on the intersection of class IDs having valid observations in both periods. This avoids measuring class-cohort turnover as teaching improvement or decline.
- Each metric returns its own `sampleSize`, `classesReported`, `comparableClasses`, and `totalClasses`; React must not substitute one shared class count.
- Net Momentum is `upTransitions - downTransitions` during the selected calendar month. Its delta is current-month Net Momentum minus previous-month Net Momentum. With no recalculation event, the value is `null`.

The attrition card is explicitly defined as:

- Label: `Bỏ học trong tháng`.
- Main value: newly dropped students between the previous and current month-end observations.
- Delta: current new-drop count minus the preceding month's new-drop count.
- Supporting note: current-month attrition rate, using active students at the start of the month as denominator.

## 6. Weekly chart over a 90-day source window

The API reads the inclusive 90-day window ending at `reportAsOf` and returns ISO-week points rather than dense daily slots.

For each ISO week and class:

1. Resolve the latest valid metric at or before the end of that week.
2. Permit carry-forward only when the source is at most seven calendar days old.
3. Aggregate valid class observations with active-student weighting.
4. Keep pass metrics `null` when no class has a test sample.

The response normally contains 13–14 weekly points depending on calendar boundaries. Each point includes:

```json
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "attendanceAvg": 82.4,
  "homeworkAvg": 78.1,
  "passStandardRate": 51.2,
  "softPassRate": 68.5,
  "classesReported": 15,
  "activeStudentSample": 241,
  "classesWithTests": 12,
  "latestDataAsOf": "YYYY-MM-DD"
}
```

If a weekly metric has no valid observation, its value is `null`; Recharts leaves a gap and never converts it to zero. Tooltips show the week range, reporting class count, student sample, test-class count where relevant, and latest source date.

## 7. Master Table semantics

The Master Table is current operational state and is independent of the selected report month.

- Roster uses the current roster observation.
- Attendance, homework, and pass use their current valid observations with fallback.
- Progress uses monotonic completed sessions and a recomputed percentage.
- Warning status is `Chưa đủ dữ liệu` when required observations are insufficient; it is not `Cần can thiệp` merely because a partial snapshot contains zeros.
- When fallback is used, the row displays `Dữ liệu đến DD/MM` and makes the detailed quality metadata available in a tooltip.

Changing `period` must change KPI cards and the weekly chart but must not change Master Table values.

## 8. API contract changes

The existing top-level response sections remain `meta`, `kpis`, `trend`, `labelDistribution`, and `classes` to minimize frontend churn.

Required additions/changes:

- `meta.period`, `meta.reportAsOf`, `meta.previousAsOf`, and `meta.currentAsOf`.
- Metric-level `classesReported`, `comparableClasses`, `totalClasses`, and metric-specific sample counts.
- Attrition fields for current count, previous count, count delta, and rate.
- Weekly trend keys `weekStart`/`weekEnd` and coverage metadata.
- Class progress contains `completedSessions`, `totalSessions`, and server-recomputed `percentage`.
- Class rows contain `dataQuality` metadata.

React consumes these fields as presentation data only. It may format dates, percentages, colors, and tooltips, but may not recalculate KPI values, business thresholds, comparison cohorts, progress, or fallback selection.

## 9. Error handling and observability

- `400`: malformed/unsupported period, conflicting period and legacy range, or unsupported course.
- `401/403`: existing authentication and scope behavior.
- `404`: class/filter scope has no matching classes.
- `200` with nullable metrics: classes exist but evidence is insufficient; this is not a server failure.
- `503`: database unavailable.

The backend logs aggregate quality counters per request without student PII: partial snapshots skipped, fallback observations used, insufficient metrics, and future rows excluded.

## 10. Testing and acceptance criteria

Backend unit/integration fixtures must prove:

- A newer zero-filled snapshot with no student records does not replace a valid earlier metric.
- A test-backed zero-percent pass result remains zero rather than becoming null/fallback.
- Progress cannot decrease from 22 to 0 and is capped at total sessions.
- August KPI values compare with July month-end, not with the start of a trailing 90-day range.
- Delta uses only comparable class IDs and reports the exact comparable count.
- Attendance/homework use independent 80% coverage checks.
- Future-dated mock rows never enter current or historical results before their date.
- A 90-day window produces ISO-week points with a maximum seven-day carry-forward.
- Changing report period does not change current Master Table rows.
- Attrition count, count delta, and rate use consistent units.

Frontend tests must prove:

- Card values and sample notes come directly from their corresponding metric contract.
- The attrition card displays a count delta and a separate rate note.
- The chart consumes weekly points, uses week labels, and preserves null gaps.
- Fallback freshness is visible in Master Table rows.
- The chart subtitle no longer calls daily points weeks or claims 90 weeks.

Production verification on the VPS must include authenticated smoke tests for the current month and a completed prior month, plus visual confirmation that the final chart point and class progress do not collapse to zero when the current-day snapshot is partial.

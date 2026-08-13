# Teacher Dashboard Label and Cumulative Habit Metrics Amendment

**Date:** 2026-08-13

**Status:** Approved and implemented in the isolated worktree; production data repair remains pending explicit approval

**Amends:** `report/2026-08-12-screen-contract-data-flow-design.md` and the in-progress `fix/teacher-dashboard-data` work

**Scope:** Teacher Dashboard student labels, attendance/homework snapshots, Lead contact coverage inputs, and the n8n producers that populate `izone.student_daily_records`

## 1. Decision summary

This amendment makes two business concepts independent:

1. A student's academic label is determined only by confirmed Test scores.
2. Attendance and homework determine habit warnings and intervention level, but never create, change, or erase the academic label.

Attendance and homework are cumulative measurements as of one shared cutoff date. The dashboard must not combine attendance from one date with homework from another date, and it must not treat a single class session as the course-to-date percentage.

The selected implementation approach is to normalize the data at its producers and rebuild the affected live history. Computing cumulative values in the dashboard from the current table is rejected because the table already mixes per-session rows and cumulative rows without a field that distinguishes them.

## 2. Production evidence and root cause

### 2.1 IC2249 / Lê Ngọc Anh

Production data for student `18848`, class `1237` (`IC2249`), reproduces the problem:

- confirmed Test 1 score: `88.75`;
- live row dated `2026-08-11`: attendance `1/1`, homework `0/0`;
- live row dated `2026-08-07`: attendance `1/1`, homework `1/1`;
- the stored source label on the `2026-08-11` row is `yellow`;
- the Teacher screen contract recomputes the student as `no_data` because the latest row has no homework sample.

The issue affects the class, not only this student. On `2026-08-11`, IC2249 had 21 live student rows, 20 with attendance samples, and zero with homework samples. Five students had confirmed Test scores but were returned as `no_data` by the Teacher API because homework was missing.

### 2.2 Conflicting producer grains

Two n8n workflows write incompatible meanings into the same live columns:

- `SLZH4ZwyQsx8b4CS` (`0.7 backup data 90day`) groups source rows by class-session date. Its counts describe only that date.
- `AbBatX2eptllUAET` (`0.5 Sync Attendance & Homework`) groups by student and class across a date range. Its counts are cumulative.

Both write `attendance_present`, `attendance_total`, `homework_done`, and `homework_total` to live rows in `student_daily_records`. The dashboard cannot safely infer which grain a row uses.

The historical workflow also uses the obsolete conflict target `(student_id, record_date)`. The current live-row uniqueness rule is class-scoped and stage-aware: `(student_id, class_id, record_date) WHERE snapshot_stage IS NULL`.

### 2.3 Conflicting label contracts

The original domain rule defines labels from Test average: Xám below 45, Đỏ from 45 to below 60, Vàng from 60, and no-data only when no Test exists. The newer screen-contract classifier introduced `green` for complete passing data and allowed missing attendance/homework to leave a Test-bearing student as `no_data`.

This amendment resolves the conflict in favor of the original Test-only academic label. Operational status remains available through `interventionLevel`, issues, recommended action, and data-quality metadata.

## 3. Canonical data grain

A live `student_daily_records` row has this meaning:

> One student's cumulative state in one class as of the end of `record_date`.

For a student `S`, class `C`, and cutoff date `D`:

- include only completed class sessions for `C` whose session time is on or before `D`;
- include only the part of the student's enrollment that belongs to `C`;
- never merge activity from a previous or subsequent class after a transfer;
- use `snapshot_stage IS NULL` for these live/as-of rows;
- historical Test-stage rows (`snapshot_stage = 1..8`) remain a separate grain and are not changed by this amendment.

### 3.1 Attendance

- `attendance_total`: number of eligible completed sessions through `D` with a non-null attendance status for the student;
- `attendance_present`: number of those sessions whose attendance status is the configured present status;
- `attendance_pct`: `attendance_present / attendance_total * 100`, rounded consistently;
- when `attendance_total = 0`, `attendance_pct` is `NULL`, not zero.

An absent status is included in the denominator when it is a real non-null attendance status. A missing/unrecorded status is excluded rather than silently treated as absence.

### 3.2 Homework

- `homework_total`: number of eligible completed sessions through `D` with a non-null homework status for the student;
- `homework_done`: number of those sessions whose homework status is the configured completed status;
- `homework_pct`: `homework_done / homework_total * 100`, rounded consistently;
- when `homework_total = 0`, `homework_pct` is `NULL`, not zero.

With the current ERP source, a null homework status does not distinguish “no assignment” from “assignment not updated.” The dashboard therefore describes it only as “Chưa có dữ liệu BTVN,” without claiming either business cause.

### 3.3 Same-date invariant

Attendance and homework displayed together must come from the same cumulative cutoff `record_date`. There is no independent metric fallback to an older date.

For example, the Teacher Dashboard must not display attendance as of `2026-08-11` and homework as of `2026-08-07`. After the cumulative rebuild, both metrics for Lê Ngọc Anh use the state through `2026-08-11`. The exact cumulative counts must be derived from ERP; they must not be inferred from the currently contaminated daily rows.

## 4. Academic label and intervention rules

### 4.1 Academic label

Calculate `testAverage` from confirmed Test scores for the same student and class, using the configured makeup rule. Then assign:

| Confirmed Test average | Academic label |
|---|---|
| No scored Test | `no_data` |
| `< 45` | `grey` |
| `45` to `< 60` | `red` |
| `>= 60` | `yellow` |

Attendance, homework, missing habit data, and drop flags do not participate in this mapping. `green` is no longer a student academic label. “No intervention required” is an operational state, not a label.

### 4.2 Intervention precedence

For active students, determine the intervention independently:

1. Test average below 45: `level_3` / review learning path.
2. Otherwise, Test average below 60: `level_2` / follow up closely.
3. Otherwise, attendance or homework below its configured threshold, or a valid recent-drop flag: `level_1` / remind study habits.
4. Otherwise: `none`.

All detected issues remain visible even when a higher-priority intervention wins. For example, a grey student may also carry attendance and homework issues, while the recommended action remains level 3.

A student with no Test can still open a level-1 habit intervention when a real attendance/homework percentage is below threshold. The academic label remains `no_data`.

Missing attendance or homework is a data-quality issue, not a below-threshold habit issue. It does not create an intervention by itself and does not erase a Test-derived label.

### 4.3 Required examples

- Lê Ngọc Anh, Test average `88.75`, missing homework sample: `yellow`; no homework-based intervention; issue `MISSING_HOMEWORK_DATA`.
- IC2230 student with no Test and passing habits: `no_data`, intervention `none`.
- IC2230 student with no Test and attendance below threshold: `no_data`, intervention `level_1`.
- Test average `52` with poor homework: `red`, intervention `level_2`, while retaining the homework issue.
- Test average `75` with homework below threshold: `yellow`, intervention `level_1`.

## 5. Producer normalization

The n8n live sync and historical backfill must share one reusable query or equivalent shared logic for cumulative counts. Copying two independently maintained formulas is acceptable only if tests compare their outputs over the same fixtures.

Both producers must:

- scope by `(student_id, class_id)`;
- use a single cutoff date for attendance and homework;
- filter to completed sessions;
- exclude null statuses from metric denominators;
- derive percentages from counts;
- emit `NULL` percentages for zero denominators;
- upsert using the live class-scoped conflict key;
- update all count and percentage columns together;
- never write to `snapshot_stage = 1..8` rows.

The live sync writes the cumulative state for its execution cutoff. The historical workflow writes the same cumulative state for each historical cutoff date instead of writing only that day's session values.

## 6. Historical repair

Existing live rows cannot be trusted as cumulative evidence until repaired. Repair is a separate controlled production step, not an incidental side effect of opening the dashboard.

The repair process must:

1. create a database backup before mutation;
2. calculate canonical cumulative results in a staging table or read-only comparison query;
3. report invalid count pairs, monotonicity violations, changed row counts, and a focused diff for IC2249/Lê Ngọc Anh;
4. obtain explicit deployment approval before writing production data;
5. update only attendance/homework counts and percentages on `snapshot_stage IS NULL` rows;
6. preserve Test values, labels, pass-review data, teacher notes, and historical stage rows;
7. run in a transaction where practical and verify row counts before commit;
8. rerun read-only validation after completion.

For every existing live `(student_id, class_id, record_date)`, the repaired metrics are cumulative through that row's date. This preserves existing Test/contact chronology while fixing the meaning of the habit fields.

## 7. Backend contract

### 7.1 Teacher Dashboard

The Teacher endpoint continues to select one latest live row at or before `asOf` for each student. Because producers are normalized, that row is a complete cumulative snapshot for both habit metrics.

The endpoint must:

- derive percentages from the count pairs;
- recompute Test average from confirmed scores;
- derive the academic label only from Test average;
- derive intervention level independently;
- return one shared `recordDate` for attendance and homework;
- return `MISSING_ATTENDANCE_DATA` or `MISSING_HOMEWORK_DATA` in data-quality warnings when the corresponding denominator is zero or absent;
- never fetch an older row for only one metric.

### 7.2 Lead Dashboard and contact coverage

Lead contact coverage must classify the same current roster with the same Test-label and intervention rules as Teacher. It must retain the already selected class-level contact checkpoint and exclude former-class records for transferred students.

Lead aggregate attendance/homework metrics may continue to use their class-level quality resolver, but any fallback observation represents an entire class snapshot at one cutoff. It must not construct per-student hybrid dates.

### 7.3 Compatibility

No new public endpoint is required. The existing Teacher response keeps `label`, `interventionLevel`, `issues`, `attendance`, `homework`, `recordDate`, and `dataQuality`. Consumers must stop assuming `green` can appear as a student label.

## 8. Frontend behavior

The student detail view displays:

- academic Test label separately from recommended action;
- cumulative attendance percentage and counts through the snapshot date;
- cumulative homework percentage and counts through the same snapshot date;
- `—` when a percentage is null;
- a visible data-quality message when attendance or homework is missing;
- the shared cutoff date for both metrics.

The UI must not manufacture historical chart points, carry an older homework value forward, or display `0%` for a zero denominator. The real Test chart remains unchanged.

For Lê Ngọc Anh, Test `88.75` displays label Vàng even if homework remains unavailable at the cutoff. The homework card displays `—` and the missing-data warning; it does not make the label disappear.

## 9. Validation and acceptance criteria

### 9.1 Automated tests

- Label boundaries: no Test, 44.99, 45, 59.99, and 60.
- Test-bearing students retain their Test label when either habit metric is missing.
- Missing Test plus a real low habit metric remains `no_data` with level 1.
- Missing habit data does not create level 1 by itself.
- Count-derived percentages preserve real zero and return null for zero denominators.
- Teacher returns both habit metrics with one shared record date and performs no per-metric fallback.
- Teacher and Lead contact coverage classify the same roster identically.
- Producer query fixtures prove historical and live paths return identical cumulative values for the same cutoff.
- Transfer fixtures prove activity from a former class does not enter the current class totals.

### 9.2 Production read-only checks before repair

- Quantify live rows whose counts decrease across later dates.
- Quantify rows where stored percentages disagree with counts.
- Compare current versus canonical cumulative values for IC2249.
- Verify the canonical result for Lê Ngọc Anh directly from ERP session statuses.
- Confirm the number of affected students with a Test label currently erased by missing habit data.

### 9.3 Post-repair smoke checks

- IC2249/Lê Ngọc Anh has a Test-derived yellow label.
- Attendance and homework share one cutoff date and match ERP cumulative counts through that date.
- IC2230 students without Test remain `no_data` and never receive a fabricated yellow label.
- Teacher and Lead contact coverage agree for IC2174, IC2230, and IC2249.
- Zero denominators render as missing data, not `0%`.

## 10. Rollout boundaries

Implementation in the feature worktree may update application code, tests, documentation, and draft n8n workflow definitions. It does not by itself authorize:

- publishing or activating an n8n workflow;
- running the production historical repair;
- deploying backend or dashboard containers;
- deleting or rewriting production rows outside the controlled repair procedure.

Those production mutations require a separate explicit deployment decision after dry-run evidence is reviewed.

## 11. Non-goals

- Distinguishing “no homework assigned” from “homework status not updated” without a new ERP source field.
- Redesigning Test makeup semantics or historical Test stages.
- Changing contact-log episode keys beyond the already selected class-level checkpoint rule.
- Restoring fabricated attendance/homework trend charts.
- Repairing unrelated backend test scaffolds or existing repository-wide lint debt.

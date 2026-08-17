# Class Snapshot Progress Backfill Design

## Problem

Historical class progress on the Lead Dashboard is resolved from
`class_daily_snapshots.completed_sessions`. Some snapshots created by the
2026-08-17 backfill contain a constant value of `1` even though the matching
`student_daily_records` show increasing attendance and homework totals.

For example, class `1104` (`IC2119`) has 27 total sessions. Its student records
reach 27 sessions on 2026-07-16, but every class snapshot contains
`completed_sessions = 1`. Consequently, the July Lead Dashboard reports 3.7%
instead of 100%.

## Goals

- Repair every class snapshot whose completed-session value disagrees with
  available student evidence for the same class and date.
- Prevent the repository-owned snapshot/backfill path from recreating the bad
  values.
- Preserve snapshots that cannot be supported by student evidence.
- Produce an auditable preview before applying database changes.
- Verify that class `1104` resolves to 27/27 (100%) for July 2026.

## Non-goals

- Recalculate attendance, homework, pass rates, labels, roster counts, or
  student statuses.
- Infer progress for dates without matching `student_daily_records`.
- Change the Lead Dashboard's historical observation algorithm.

## Source of truth

For each `(class_id, snapshot_date)`, derive completed sessions from matching
student records as:

```text
derived_completed_sessions = LEAST(
  classes.total_sessions,
  GREATEST(
    MAX(student_daily_records.attendance_total),
    MAX(student_daily_records.homework_total),
    0
  )
)
```

Null totals are treated as zero. The value is updated only when at least one
student record exists for the same class and date and the derived value differs
from the snapshot value. This keeps the repair evidence-based and idempotent.

`progress_pct` is a generated database column and must not be written directly;
PostgreSQL recalculates it after `completed_sessions` changes.

## Repair workflow

Add a repository-owned SQL migration/backfill file with two explicit sections:

1. A read-only preview query listing class ID/name, snapshot date, old value,
   derived value, total sessions, and the delta.
2. A transaction-scoped update using the identical derivation CTE and returning
   every changed row for audit.

The update must only target rows backed by same-day student evidence. Rows
without evidence remain unchanged and are reported separately. Running the
update twice must produce zero changes on the second run.

Before applying the update, capture the preview count and the affected class
count. After applying it, verify that no evidence-backed mismatches remain and
inspect class `1104` separately.

## Prevention

Locate the repository-owned process that creates historical class snapshots and
make it use the same derived completed-session rule. The derivation should live
in one testable helper or one shared SQL expression so preview, repair, and
future generation cannot silently diverge.

If the faulty writer is external to this repository, document the exact external
workflow as the remaining prevention owner and keep the validation query in the
repository as a guard. Do not claim recurrence is prevented until that writer is
updated.

## Testing

- Add a regression test where student totals progress from 23 to 27 while the
  stored snapshots incorrectly remain at 1; the repaired July observation must
  resolve to 27/27 and 100%.
- Cover null totals, values above the class total, no matching student records,
  an already-correct snapshot, and idempotent reruns.
- Run backend unit tests and build.
- Run the preview query before the database write and the mismatch query after
  it.

## Safety and rollback

The database update is limited to `class_daily_snapshots.completed_sessions` and
runs in an explicit transaction. Before updating, export the affected snapshot
IDs and old values. Rollback consists of restoring those values from the export;
the generated percentage follows automatically.

No snapshot is deleted, no row is inserted, and no unrelated metric is changed.

## Success criteria

- Preview identifies all and only evidence-backed mismatches.
- The update changes the previewed rows and a second execution changes none.
- No evidence-backed mismatch remains afterward.
- Class `1104` reports 27/27 and 100% for July 2026.
- Backend regression tests and build pass.
- The faulty writer is corrected or explicitly recorded as an external blocker.

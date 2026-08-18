# Class Snapshot Progress Backfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair evidence-backed historical class progress mismatches and leave a safe, repeatable validation/backfill artifact in the repository.

**Architecture:** A single SQL migration owns the canonical same-day derivation CTE, exposes preview and no-evidence reports, snapshots old values into an audit table, and performs an idempotent update. Existing dashboard resolution remains unchanged; regression coverage proves corrected snapshot input resolves class 1104 to 100% in July.

**Tech Stack:** PostgreSQL 15 SQL, NestJS/TypeScript, Jest

## Global Constraints

- Derive completed sessions as `LEAST(classes.total_sessions, GREATEST(MAX(attendance_total), MAX(homework_total), 0))` from records for the same class where `record_date <= snapshot_date`.
- Never infer values for snapshot dates without prior or matching `student_daily_records`.
- Only update `class_daily_snapshots.completed_sessions`; never write generated `progress_pct`.
- Preserve an audit copy of every old value before updating.
- The repair must be idempotent.
- Do not modify unrelated attendance, homework, pass, label, roster, or status data.

---

### Task 1: Repair-contract regression test

**Files:**
- Create: `backend/src/dashboards/snapshot-progress-repair.spec.ts`

**Interfaces:**
- Consumes: `database/migrations/006_repair_snapshot_completed_sessions.sql`
- Produces: An automated contract requiring the repair artifact to use cumulative evidence, cap progress, audit old values, and update only `completed_sessions`.

- [ ] **Step 1: Write the failing repair-contract test**

Create a Jest test that reads the migration path with `readFileSync`. Assert it contains a same-class join with `r.record_date <= s.snapshot_date`, `LEAST(c.total_sessions`, both `MAX(r.attendance_total)` and `MAX(r.homework_total)`, an audit table, `BEGIN`/`COMMIT`, and an update whose `SET` clause assigns only `completed_sessions`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts`

Expected: FAIL with `ENOENT` because migration 006 does not exist.

- [ ] **Step 3: Create the minimal migration skeleton**

Create migration 006 with the canonical evidence CTE, audit table, transaction, and narrowly scoped update described in Task 2.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts`

Expected: PASS for every repair safety assertion.

### Task 2: Auditable, idempotent database repair

**Files:**
- Modify: `database/migrations/006_repair_snapshot_completed_sessions.sql`
- Modify: `backend/src/dashboards/snapshot-quality.spec.ts`

**Interfaces:**
- Consumes: `izone.classes`, `izone.class_daily_snapshots`, `izone.student_daily_records`
- Produces: `izone.class_snapshot_progress_repair_20260817` audit table and corrected `completed_sessions` values.

- [ ] **Step 1: Write the read-only preview CTE**

Define cumulative evidence grouped by snapshot and `mismatches` joined to classes. Output snapshot ID, class ID/name, date, old value, derived value, total sessions, and delta. Add a separate query listing snapshot rows with no evidence on or before their date.

- [ ] **Step 2: Validate preview SQL without writes**

Run the CTE as a read-only query against the configured database and record total mismatch count, affected class count, and the class 1104 rows. Confirm class 1104 derives 23, 24, 25, 26, and 27 for its July snapshots.

- [ ] **Step 3: Add transactional audit and update SQL**

Inside `BEGIN`/`COMMIT`, create the audit table with `snapshot_id` primary key, old/new completed sessions, class/date metadata, and `backed_up_at`. Insert mismatches with `ON CONFLICT (snapshot_id) DO NOTHING`, then update snapshots by joining only the audit rows inserted for this repair. Return every changed row.

- [ ] **Step 4: Add postconditions**

Append read-only queries that assert zero evidence-backed mismatches remain, report audit/change counts, verify class 1104's latest July snapshot is `27/27 = 100`, and show no-evidence rows left untouched.

- [ ] **Step 5: Review SQL safety**

Run `git diff --check -- database/migrations/006_repair_snapshot_completed_sessions.sql` and inspect that the only `UPDATE` target column is `completed_sessions`, the audit insert precedes the update, and every write is transaction-scoped.

- [ ] **Step 6: Add the class 1104 resolver regression**

Add `resolves repaired class 1104 to 100 percent at the end of July` to `snapshot-quality.spec.ts`, using a 27-session snapshot dated 2026-07-16 and `asOf = 2026-07-31`. Assert `completedSessions: 27`, `totalSessions: 27`, `percentage: 100`, and `dataAsOf: '2026-07-16'`; run the focused test and confirm it passes without changing the resolver.

### Task 3: Apply repair and verify the real symptom

**Files:**
- Use: `database/migrations/006_repair_snapshot_completed_sessions.sql`
- Verify: `backend/src/dashboards/dashboards.service.ts`

**Interfaces:**
- Consumes: Previewed mismatch set from Task 2.
- Produces: Corrected database plus captured before/after counts.

- [ ] **Step 1: Export affected values**

Execute the migration's preview and persist its audit rows in the database transaction before the update. Capture mismatch count and affected class count in the implementation report.

- [ ] **Step 2: Apply the transaction once**

Execute `006_repair_snapshot_completed_sessions.sql` against the configured PostgreSQL database. Abort and roll back if the returned class 1104 July values do not end at 27.

- [ ] **Step 3: Verify idempotence**

Run the mismatch preview again without applying writes.

Expected: zero evidence-backed mismatches.

- [ ] **Step 4: Verify class 1104 through dashboard semantics**

Query class 1104 snapshots through 2026-07-31 and feed them to `resolveClassObservation`; verify `27/27`, `100%`, and a July data-as-of date.

### Task 4: Repository validation and external prevention ownership

**Files:**
- Modify: `ARCHITECTURE.md`

**Interfaces:**
- Consumes: Canonical derivation in migration 006.
- Produces: Documentation that the 2026-08-17 production backfill writer is external to this repository and migration 006 is the repository guard.

- [ ] **Step 1: Confirm writer ownership**

Record that repository search found no production writer for the rows sharing `scraped_at = 2026-08-17T10:13:23.426Z`, and `system_logs` contains no matching class/date entry. Document the external ingestion/backfill workflow as the unresolved prevention owner and migration 006's mismatch preview as the repository guard.

- [ ] **Step 2: Run backend verification**

Run: `npm test -- --runInBand src/dashboards/snapshot-quality.spec.ts`

Run: `npm run build`

Expected: both exit 0.

- [ ] **Step 3: Review final scope**

Run: `git diff --check`

Run: `git status --short`

Confirm no unrelated user changes were staged or modified by this work.

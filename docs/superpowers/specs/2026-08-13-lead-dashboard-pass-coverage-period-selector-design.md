# Lead Khối Dashboard: Contact Coverage, Exclusive Pass Metrics, and Selector UX

**Date:** 2026-08-13  
**Status:** Approved in conversation; pending written-spec review  
**Scope:** Lead Khối Dashboard, `GET /api/v1/lead-dashboard`, global class selector  
**Target:** Khối 3-4 (`course_id = 2`)

## 1. Objectives

This change has four outcomes:

1. Contact Coverage uses only students who currently require a warning as its denominator.
2. Pass chuẩn and Pass mềm are mutually exclusive outcome groups.
3. The report-period `<select>` becomes an accessible month/year calendar popup.
4. The global class dropdown is grouped by `courseName` and scrolls internally.

The implementation must preserve the existing separation between:

- historical macro reporting: KPI cards and 90-day charts follow the selected month;
- current operational state: the Master Table and Contact Coverage always show the latest state and do not change when the report month changes.

No database migration or historical backfill is required. The backend calculates the new metrics from existing `student_daily_records` fields.

## 2. Selected Approach

Use an explicit API-contract change rather than a frontend-only patch.

The rejected alternatives are:

- UI-only formatting: cannot correct pass numerators or prevent stale period fallback;
- new snapshot columns plus backfill: duplicates derivable state and introduces an unnecessary production migration.

The selected approach changes the backend aggregation, exposes period availability explicitly, and lets the frontend render only the meaning supplied by the API.

## 3. Metric Definitions

### 3.1 Contact Coverage

Contact Coverage answers: “Among students who currently require a warning action, how many have been contacted for the current intervention episode?”

Define the warning population using the backend labeling engine:

```text
warning student := recommended_action.messageTemplateKey IS NOT NULL
```

A warning student is contacted when a contact log matches all episode keys:

```text
student_id + class_id + trigger_type + checkpoint
```

The metric is:

```text
done  = count(distinct warning students with a matching contact log)
total = count(distinct warning students)
pct   = total = 0 ? null : round(done / total * 100, 1)
```

Students with `recommended_action.messageTemplateKey = null` are excluded even if they belong to the class. Logs for an old trigger or checkpoint do not satisfy the current episode.

The existing response shape is retained:

```json
{
  "contactCoverage": {
    "done": 4,
    "total": 6,
    "pct": 66.7
  }
}
```

When `total = 0`, `pct` is `null`, not zero. Zero would mean a real warning population exists and nobody has been contacted; `null` means there is no applicable warning population.

### 3.2 Pass denominator

Both pass rates answer a question about students who have taken a test. Their common denominator is:

```text
tested_students := count(students where tests_taken > 0 and test_average is not null)
```

Students without a valid test are not treated as failed and are excluded from both rates.

When `tested_students = 0`, both values are `null`.

### 3.3 Pass chuẩn

A student belongs to Pass chuẩn only when every strict condition is met:

```text
attendance_pct >= 90
AND homework_pct >= 90
AND test_average >= 60
```

The rate is:

```text
pass_standard_rate = pass_standard_students / tested_students * 100
```

### 3.4 Pass mềm (exclusive)

The approved business choice is exclusive Pass mềm. A student already counted in Pass chuẩn must never be counted in Pass mềm.

Only Groups 1 and 2 are Pass mềm:

```text
Group 1:
  50 <= test_average < 55
  AND attendance_pct >= 100
  AND homework_pct >= 100

Group 2:
  55 <= test_average < 60
  AND attendance_pct >= 90
  AND homework_pct >= 90
```

Group 3 is removed from the Lead Pass mềm numerator. A student with `test_average >= 60` is evaluated only against Pass chuẩn; failing the attendance or homework requirement does not move that student into Pass mềm.

The defensive aggregate predicate remains mutually exclusive even if upstream status fields are inconsistent:

```text
soft_pass_only_students =
  count(Group 1 or Group 2 students who are not Pass chuẩn)
```

The rate is:

```text
soft_pass_rate = soft_pass_only_students / tested_students * 100
```

The backend derives both groups from raw percentages and `test_average`; it does not add `pass_chuan_status` rows to `pass_mem_status` rows. Stored status/group fields remain available for Teacher Dashboard workflow and review state, but do not override the Lead aggregate formula.

## 4. Backend Data Flow

### 4.1 Historical macro path

For `GET /api/v1/lead-dashboard?courseId=2&khoiId=34&period=YYYY-MM`:

1. Parse the requested calendar month in `Asia/Ho_Chi_Minh`.
2. Resolve the selected month boundaries, previous month boundaries, and the 90-day trend window ending at the selected month’s report-as-of date.
3. Query eligible classes through `classes -> teachers`, applying course, khoi, class status, teacher, and class filters.
4. Query `class_daily_snapshots` for roster/progress evidence.
5. Query current-state-grain `student_daily_records` only:
   - `snapshot_stage IS NULL`;
   - student `registration_status = 'on_going'`;
   - no test-stage history rows mixed into daily state.
6. Aggregate attendance, homework, tested students, strict pass students, and exclusive soft-pass students per class and record date.
7. Resolve selected and previous observations without substituting an older month for a completely empty selected month.
8. Weight attendance/homework by their actual student sample and pass rates by `tested_students`.
9. Build weekly trend points from the same strict/exclusive pass definitions.

The KPI response continues to expose `passStandardRate` and `softPassRate` separately. Pass metric objects add an explicit numerator:

```json
{
  "passStandardRate": {
    "value": 47.7,
    "qualifiedStudents": 113,
    "sampleSize": 237,
    "classesWithTests": 15
  },
  "softPassRate": {
    "value": 18.1,
    "qualifiedStudents": 43,
    "sampleSize": 237,
    "classesWithTests": 15
  }
}
```

Trend points retain two separate fields:

```json
{
  "weekStart": "2026-08-03",
  "weekEnd": "2026-08-09",
  "passStandardRate": 47.7,
  "softPassRate": 18.1,
  "classesWithTests": 15,
  "activeStudentSample": 237
}
```

### 4.2 Empty report month

The API adds:

```json
{
  "meta": {
    "hasDataForPeriod": false
  }
}
```

`hasDataForPeriod` is true only when at least one in-scope class has source evidence dated inside the selected calendar month. Evidence includes a class snapshot or a current-state student record.

If it is false:

- historical KPI values and deltas are `null`;
- the frontend does not present an older fallback value as belonging to the selected month;
- the macro charts render a single empty state for the selected month;
- `0%` is never used as a substitute for missing data.

The Master Table is unaffected because it follows the latest current operational path.

### 4.3 Current Master Table path

The class collection in the Lead response is resolved as of the current Ho Chi Minh date, independently of `period`.

This matches the existing UI statement that the Master Table is current state and is not filtered by the selected report month.

For each current class, the API returns:

- current roster and progress;
- latest attendance and homework;
- current strict Pass chuẩn rate;
- current exclusive Pass mềm rate;
- current label distribution;
- current Contact Coverage.

Contact Coverage uses the latest student records, the latest test checkpoint, current classification thresholds, and contact logs. It must not be reconstructed from historical monthly snapshots.

## 5. Frontend Design

### 5.1 KPI cards and chart

`KpiRow` keeps separate Pass chuẩn and Pass mềm cards. Each card reads only its corresponding API object and displays its own numerator/denominator note.

The Pass mềm tooltip lists Groups 1 and 2 only. Group 3 text is removed.

`TrendChart` receives two independent Recharts series:

```text
passStandardRate -> green line
softPassRate     -> purple line
```

No selector or presentation helper may sum the series.

If `meta.hasDataForPeriod = false`, the KPI/chart region displays:

```text
Không có dữ liệu cho Tháng M/YYYY
```

The Master Table remains visible below this state.

### 5.2 Master Table

Contact Coverage displays:

```text
66.7%
4/6 HV cần cảnh báo
```

Pass values use explicit labels rather than the ambiguous `X% / Y%` format:

```text
Chuẩn  47.7%
Mềm    18.1%
```

The column title becomes `Tỷ lệ Pass` and retains a tooltip explaining that both rates use tested students as denominator and are mutually exclusive numerators.

### 5.3 Month/year calendar popup

Replace the native `<select>` in `ContextBar` with a dependency-free React popup:

- trigger text: `Tháng M/YYYY`;
- year header with previous/next buttons;
- 12 months in a 3-by-4 grid;
- unlimited backward year navigation;
- current month selectable;
- future months and future years disabled;
- selection emitted as `YYYY-MM` and synchronized with `?ky=YYYY-MM`;
- close on selection, outside pointer event, or `Escape`;
- restore focus to the trigger when closed;
- appropriate `aria-haspopup`, `aria-expanded`, button labels, and selected state.

The popup does not need a backend `availablePeriods` endpoint because every non-future month is selectable by decision. Empty months are handled through `meta.hasDataForPeriod`.

### 5.4 Grouped class dropdown

The global class selector groups `ClassSummary[]` by normalized `courseName`.

Ordering:

1. course groups sorted by Vietnamese locale label;
2. classes inside each group sorted by `className` using natural/numeric comparison.

The menu uses:

```text
max-height: min(60vh, 28rem)
overflow-y: auto
```

Each group has a sticky heading. Existing selected-class highlighting, risk score, outside-click handling, Escape handling, and selection callback remain intact.

## 6. Error and Loading Behaviour

- API request in progress: retain the current loading state.
- Request failure: show the current API error state; do not translate failure to an empty month.
- Successful empty month: show the dedicated empty-period state based on `hasDataForPeriod=false`.
- Contact Coverage `pct=null`: render `—` with “Không có HV cần cảnh báo”.
- Pass rate `null`: render `—`, never `0%`.

## 7. Testing Strategy

Backend tests must prove:

1. 10 students, 4 warning students, 2 matching contact logs gives `2/4 = 50%`, not `20%`.
2. Old trigger/checkpoint logs do not count toward current coverage.
3. Zero warning students returns `pct=null`.
4. A strict-pass student appears only in `pass_standard_students`.
5. Group 1 and Group 2 students appear only in `soft_pass_only_students`.
6. Group 3 is excluded from soft pass.
7. No tested students returns both pass rates as `null`.
8. A calendar month without in-month evidence returns `hasDataForPeriod=false` and null historical metrics.
9. Master Table class values still resolve from current evidence when an old or empty report month is selected.

Frontend tests must prove:

1. Pass cards and rows never sum the two rates.
2. Pass labels and tooltips match exclusive semantics.
3. Empty periods show the empty state while the Master Table remains present.
4. Month selection emits a zero-padded `YYYY-MM`.
5. Future months are disabled.
6. Escape and outside click close the popup.
7. Class grouping uses `courseName`, natural class ordering, and selected state.

Verification before merge:

```bash
cd backend && npm test -- --runInBand && npm run build
cd dashboard && npm test && npm run build
```

## 8. Non-goals

- Changing Teacher Dashboard pass-review workflow.
- Rewriting n8n status assignment.
- Adding database columns or backfilling snapshots.
- Supporting a different Lead course than `course_id = 2`.
- Filtering the current Master Table by the historical report month.


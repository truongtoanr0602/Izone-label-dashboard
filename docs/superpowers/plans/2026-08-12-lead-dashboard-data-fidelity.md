# Lead Khối Dashboard — Khôi phục độ trung thực dữ liệu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sửa Lead Khối Dashboard để mọi con số hiển thị phản ánh đúng dữ liệu trong Postgres, sau khi migration 007 âm thầm đổi hạt của `izone.student_daily_records`.

**Architecture:** Ba bộ lọc thống nhất (`snapshot_stage IS NULL`, `registration_status = 'on_going'`, loại `NULL` khỏi mẫu số) áp vào tầng query; trung bình toàn khối đổi trọng số từ sĩ số lớp sang số HV thực sự có dữ liệu — về mặt toán học tương đương aggregate ở tầng học viên; ngưỡng coverage bị xoá và độ phủ trở thành số hiển thị.

**Tech Stack:** NestJS + Prisma + Postgres (backend, jest), React 19 + Vite + Tailwind v4 + recharts (dashboard, vitest).

## Global Constraints

- Spec nguồn: `docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md`. Đọc trước khi bắt đầu.
- Bốn cổng của `dashboard/` phải sạch: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build` (`CLAUDE.md` §Commands). `tsc -b` bật `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` — một import thừa là fail build.
- Hai cổng của `backend/`: `npm run build`, `npm test` (jest, `testRegex: .*\.spec\.ts$`, `rootDir: src`).
- Mọi lệnh `npm` chạy từ trong `dashboard/` hoặc `backend/`, **không bao giờ từ repo root** — root chỉ có `gh-pages`.
- Không đụng Teacher dashboard (`getTeacherDashboard`) trừ Task 6 Step 9, đã nêu rõ ở đó.
- Không dùng các dòng `snapshot_stage = 1..8` vào bất kỳ tính toán nào. Chúng chỉ bị loại trừ.
- Giữ nguyên bảng màu và bán kính bo góc hiện có (`CLAUDE.md` §Styling). Không thêm màu mới, không thêm shadow.
- UI copy tiếng Việt, code identifier tiếng Anh.
- Quy ước `pct: null` khi `total = 0` (khác hẳn `0`) — đã có sẵn trong `contactLog.ts`, giữ nguyên ở backend.
- Kết nối DB prod để kiểm chứng thủ công: `postgresql://postgres:Izone%402026!@160.187.146.127:5432/izone_dashboard`. Chỉ đọc, không ghi.

---

## File Structure

**Tạo mới**

| File | Trách nhiệm |
|---|---|
| `database/migrations/008_restore_live_record_uniqueness.sql` | Partial unique index khôi phục hạt 1 dòng/HV/ngày cho dòng live |
| `backend/src/dashboards/contact-coverage.ts` | Hàm thuần tính độ phủ liên hệ từ danh sách HV + contact log |
| `backend/src/dashboards/contact-coverage.spec.ts` | Test cho file trên |

**Sửa**

| File | Thay đổi |
|---|---|
| `database/migrations/007_stage_based_test_snapshots.sql` | Chỉ `git add` (đang untracked) |
| `backend/prisma/schema.prisma:134-179` | Thêm `snapshot_stage`, `test_7`, `test_8`; đổi unique |
| `backend/src/dashboards/snapshot-quality.ts` | Xoá ngưỡng coverage; pass metric đổi mẫu số |
| `backend/src/dashboards/lead-aggregation.ts:117-142` | Trọng số đổi sang `sampleSize` |
| `backend/src/dashboards/dashboards.service.ts:93-172` | Ba bộ lọc vào query; thêm query coverage |
| `dashboard/src/api/dashboardContracts.ts` | Thêm `contactCoverage`, `activeStudentRoster` |
| `dashboard/src/components/dashboard/KpiRow.tsx` | Bỏ Net Momentum; sửa nhãn "HV có test" |
| `dashboard/src/components/dashboard/LeadDashboard.tsx` | Nối độ phủ; dọn code chết; subtitle |
| `dashboard/src/components/dashboard/TrendChart.tsx` | Tooltip thêm độ phủ |
| `dashboard/src/components/dashboard/trendChartModel.ts` | Truyền thêm trường độ phủ |

---

## Task 1: Đồng bộ schema và vá ràng buộc

Migration 007 đã chạy trên prod nhưng chưa vào git, và nó drop `uq_student_record` mà không thay bằng ràng buộc tương đương cho dòng live (Postgres coi mỗi `NULL` là giá trị riêng, nên `uq_student_stage` không chặn gì khi `snapshot_stage IS NULL`).

**Files:**
- Create: `database/migrations/008_restore_live_record_uniqueness.sql`
- Modify: `backend/prisma/schema.prisma:134-179`
- Add to git: `database/migrations/007_stage_based_test_snapshots.sql`

**Interfaces:**
- Consumes: không có (task đầu tiên)
- Produces: cột `snapshot_stage Int?`, `test_7 Decimal?`, `test_8 Decimal?` trên model `student_daily_records` của Prisma — các task sau tham chiếu `snapshot_stage` trong raw SQL nên không phụ thuộc Prisma client, nhưng schema phải khớp để `prisma validate` không báo drift.

- [ ] **Step 1: Viết migration 008**

Tạo `database/migrations/008_restore_live_record_uniqueness.sql`:

```sql
-- Khôi phục ràng buộc "1 dòng / HV / lớp / ngày" cho DỮ LIỆU LIVE.
--
-- Migration 007 drop uq_student_record và thay bằng
-- uq_student_stage (student_id, class_id, snapshot_stage). Trong Postgres,
-- UNIQUE coi mỗi NULL là một giá trị KHÁC NHAU, nên với các dòng live
-- (snapshot_stage IS NULL) constraint đó không chặn gì cả. Hạt của dữ liệu
-- live hiện chỉ sạch nhờ ingestion cẩn thận, không nhờ database.
--
-- Partial unique index chỉ áp lên dòng live, không đụng dòng stage 1..8.

CREATE UNIQUE INDEX IF NOT EXISTS uq_student_record_live
  ON izone.student_daily_records (student_id, class_id, record_date)
  WHERE snapshot_stage IS NULL;
```

- [ ] **Step 2: Kiểm tra migration chạy được trên bản sao dữ liệu prod**

Index này chỉ tạo được nếu dữ liệu hiện tại không có dòng trùng. Đã kiểm chứng ngày 2026-08-12: 30.765/30.765 khoá đều có đúng 1 dòng. Xác nhận lại trước khi chạy:

```bash
cd backend && NODE_PATH=./node_modules node -e "
const {Client}=require('pg');
const c=new Client({connectionString:'postgresql://postgres:Izone%402026!@160.187.146.127:5432/izone_dashboard'});
c.connect().then(async()=>{
  const r=await c.query(\`SELECT count(*)::int AS trung FROM (
    SELECT student_id, class_id, record_date FROM izone.student_daily_records
    WHERE snapshot_stage IS NULL GROUP BY 1,2,3 HAVING count(*)>1) x\`);
  console.log('So khoa bi trung:', r.rows[0].trung);
  await c.end();
});"
```

Expected: `So khoa bi trung: 0`. Nếu ra khác 0, **dừng lại** và báo — phải dedupe trước, không được ép tạo index.

- [ ] **Step 3: Cập nhật Prisma schema**

Trong `backend/prisma/schema.prisma`, model `student_daily_records`: thêm ba cột sau dòng `test_6` (dòng 150) và đổi khối unique ở dòng 176.

Thêm sau `test_6` — **kiểm tra kiểu thật trên prod trước khi viết**, đừng chép mù:

```prisma
  test_7                  Decimal?
  test_8                  Decimal?
  snapshot_stage          Int?
```

Lưu ý `test_7`/`test_8` **không** có `@db.Decimal(5, 2)` như `test_1`–`test_6`. Migration 007 tạo chúng bằng `numeric` trần, và `information_schema.columns` trên prod xác nhận `numeric_precision` là `null`. Khai báo sai precision ở đây chính là loại drift mà task này sinh ra để xoá.

Thay dòng 176:

```prisma
  @@unique([student_id, class_id, snapshot_stage], map: "uq_student_stage")
```

Thêm hai index mà migration 006 và 007 tạo trên prod nhưng schema chưa biết — lấy đúng danh sách cột và thứ tự từ `pg_indexes`, đừng đoán:

```prisma
  @@index([student_id, class_id, snapshot_stage], map: "idx_student_daily_stage")
```

và trên model `test_scores`, index `idx_test_scores_student_test_at` do migration 006 tạo.

- [ ] **Step 4: Xác nhận schema khớp database thật**

Run: `cd backend && npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

Lưu ý: partial unique index `uq_student_record_live` **không** khai báo được trong Prisma schema (Prisma chưa hỗ trợ partial index). Đó là chủ đích — nó sống trong migration SQL, và đây là lý do repo dùng migration SQL thủ công thay vì `prisma migrate`.

- [ ] **Step 5: Build backend để chắc chắn không vỡ gì**

Run: `cd backend && npm run build`
Expected: build thành công, không lỗi TypeScript.

- [ ] **Step 6: Commit**

```bash
git add database/migrations/007_stage_based_test_snapshots.sql \
        database/migrations/008_restore_live_record_uniqueness.sql \
        backend/prisma/schema.prisma
git commit -m "fix: track migration 007 and restore live-record uniqueness

Migration 007 dropped uq_student_record and replaced it with a unique on
(student_id, class_id, snapshot_stage). Postgres treats each NULL as
distinct, so live rows (snapshot_stage IS NULL) lost all uniqueness
protection. Add a partial unique index covering only live rows."
```

---

## Task 2: Bỏ ngưỡng coverage, đổi mẫu số pass

`DEFAULT_MINIMUM_COVERAGE = 80` loại **cả lớp** khi độ phủ dữ liệu dưới 80%. Nó tồn tại chỉ để bù cho sai lệch trọng số ở Task 3; khi trọng số đúng thì nó thành có hại. Đồng thời `resolvePassMetric` đang chia cho tổng sĩ số thay vì số HV đã thi.

**Files:**
- Modify: `backend/src/dashboards/snapshot-quality.ts`
- Test: `backend/src/dashboards/snapshot-quality.spec.ts`

**Interfaces:**
- Consumes: không có
- Produces:
  - `resolveClassObservation(input: ClassObservationEvidence, asOf: string, options?: { minimumCoveragePct?: number })` — tham số `options` bị **xoá hoàn toàn**, chữ ký còn `(input, asOf)`.
  - `ResolvedMetric.coveragePct: number | null` giữ nguyên kiểu nhưng đổi ý nghĩa: từ "tiêu chí lọc" thành "số để hiển thị".
  - `ResolvedPassMetric.sampleSize` giờ bằng `testedStudents` (trước là `recordCount`). Task 3 dùng trường này làm trọng số; Task 5 hiển thị nó.

- [ ] **Step 1: Viết test thất bại**

Thêm vào cuối `backend/src/dashboards/snapshot-quality.spec.ts`:

```typescript
describe('coverage không còn là cổng loại lớp', () => {
  it('vẫn nhận số liệu khi chỉ một phần học viên có dữ liệu', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          date: '2026-08-10',
          recordCount: 14,
          attendanceSampleSize: 5,
          attendanceAvg: 82,
          homeworkSampleSize: 5,
          homeworkAvg: 74,
          testedStudents: 5,
          passStandardStudents: 2,
          softPassStudents: 3,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-10');

    expect(result.attendance.value).toBe(82);
    expect(result.attendance.sampleSize).toBe(5);
    expect(result.attendance.coveragePct).toBe(35.7);
    expect(result.dataQuality.status).not.toBe('insufficient');
  });

  it('chia tỷ lệ pass cho số học viên đã thi, không cho tổng sĩ số', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          date: '2026-08-10',
          recordCount: 20,
          attendanceSampleSize: 20,
          attendanceAvg: 90,
          homeworkSampleSize: 20,
          homeworkAvg: 90,
          testedStudents: 8,
          passStandardStudents: 2,
          softPassStudents: 4,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-10');

    expect(result.passStandard.value).toBe(25);
    expect(result.passStandard.sampleSize).toBe(8);
    expect(result.passStandard.testedStudents).toBe(8);
    expect(result.softPass.value).toBe(50);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd backend && npx jest snapshot-quality -t "coverage không còn là cổng loại lớp"`
Expected: FAIL. Test đầu báo `attendance.value` là `null` (bị cổng 80% chặn, 5/14 = 35.7%); test sau báo `passStandard.value` là `10` (2/20) thay vì `25` (2/8).

- [ ] **Step 3: Xoá hằng số ngưỡng**

Trong `backend/src/dashboards/snapshot-quality.ts`, xoá dòng 1:

```typescript
const DEFAULT_MINIMUM_COVERAGE = 80;
```

- [ ] **Step 4: Viết lại `resolveCoveredMetric`**

Thay toàn bộ hàm (dòng 100-128) bằng:

```typescript
/**
 * Bản ghi mới nhất CÓ số cho chỉ số này.
 *
 * Không còn ngưỡng độ phủ tối thiểu. Ngưỡng cũ (80%) loại cả lớp khi chỉ một
 * phần học viên có dữ liệu — nó chỉ tồn tại để bù cho việc trung bình toàn
 * khối cân theo sĩ số lớp thay vì theo số HV thực sự có số. Khi trọng số đã
 * đúng (xem `weightedResolved` trong lead-aggregation.ts) thì ngưỡng này chỉ
 * còn tác dụng giấu bớt lớp: 8/17 lớp biến mất khỏi biểu đồ dù có dữ liệu.
 *
 * `coveragePct` vẫn được tính, nhưng giờ là SỐ ĐỂ HIỂN THỊ — Lead tự đánh giá
 * độ tin cậy thay vì bị hệ thống âm thầm quyết hộ.
 */
function resolveCoveredMetric(
  rows: StudentMetricEvidence[],
  rosterDate: string | null,
  kind: 'attendance' | 'homework',
): ResolvedMetric {
  const sampleKey =
    kind === 'attendance' ? 'attendanceSampleSize' : 'homeworkSampleSize';
  const valueKey = kind === 'attendance' ? 'attendanceAvg' : 'homeworkAvg';
  const row = rows.find(
    (candidate) =>
      candidate.recordCount > 0 &&
      candidate[sampleKey] > 0 &&
      candidate[valueKey] !== null,
  );
  if (!row) return emptyMetric();
  return {
    value: round1(Number(row[valueKey])),
    dataAsOf: row.date,
    sampleSize: row[sampleKey],
    recordCount: row.recordCount,
    coveragePct: round1((row[sampleKey] / row.recordCount) * 100),
    fallbackUsed:
      row.date !== rows[0]?.date ||
      (rosterDate !== null && row.date < rosterDate),
  };
}
```

- [ ] **Step 5: Viết lại `resolvePassMetric`**

Thay toàn bộ hàm (dòng 130-150) bằng:

```typescript
/**
 * Tỷ lệ pass tính trên SỐ HỌC VIÊN ĐÃ THI, không phải tổng sĩ số.
 *
 * Trả lời câu "trong số HV đã thi, bao nhiêu phần trăm đạt". Chia cho tổng sĩ
 * số sẽ trộn hai chuyện khác nhau — HV thi trượt và HV chưa thi — vào cùng
 * một con số, và kéo tỷ lệ xuống giả tạo ở các lớp mới học được vài buổi.
 */
function resolvePassMetric(
  rows: StudentMetricEvidence[],
  rosterDate: string | null,
  passedKey: 'passStandardStudents' | 'softPassStudents',
): ResolvedPassMetric {
  const row = rows.find(
    (candidate) => candidate.recordCount > 0 && candidate.testedStudents > 0,
  );
  if (!row) return { ...emptyMetric(), testedStudents: 0 };
  return {
    value: round1((row[passedKey] / row.testedStudents) * 100),
    dataAsOf: row.date,
    sampleSize: row.testedStudents,
    recordCount: row.recordCount,
    coveragePct: round1((row.testedStudents / row.recordCount) * 100),
    fallbackUsed:
      row.date !== rows[0]?.date ||
      (rosterDate !== null && row.date < rosterDate),
    testedStudents: row.testedStudents,
  };
}
```

- [ ] **Step 6: Cập nhật nơi gọi trong `resolveClassObservation`**

Trong `resolveClassObservation`, xoá tham số `options` khỏi chữ ký và xoá biến `minimumCoveragePct`. Đổi dòng 152-158 thành:

```typescript
export function resolveClassObservation(
  input: ClassObservationEvidence,
  asOf: string,
): ResolvedClassObservation {
```

Xoá hai dòng:

```typescript
  const minimumCoveragePct =
    options.minimumCoveragePct ?? DEFAULT_MINIMUM_COVERAGE;
```

Đổi bốn lời gọi (dòng 186-207) thành:

```typescript
  const attendance = resolveCoveredMetric(studentMetrics, rosterDate, 'attendance');
  const homework = resolveCoveredMetric(studentMetrics, rosterDate, 'homework');
  const passStandard = resolvePassMetric(studentMetrics, rosterDate, 'passStandardStudents');
  const softPass = resolvePassMetric(studentMetrics, rosterDate, 'softPassStudents');
```

- [ ] **Step 7: Đổi hai cảnh báo độ phủ sang ngưỡng hiển thị**

Hai khối `warnings.add('LOW_ATTENDANCE_COVERAGE')` / `LOW_HOMEWORK_COVERAGE` (dòng 211-227) đang dùng `minimumCoveragePct` vừa bị xoá. Chúng vẫn có ích như *cảnh báo*, chỉ không còn là *cổng chặn*. Thêm hằng số mới ngay dưới chỗ `DEFAULT_MINIMUM_COVERAGE` cũ:

```typescript
/**
 * Dưới mức này thì gắn cảnh báo lên lớp — nhưng KHÔNG loại lớp khỏi số liệu.
 * Đây là ngưỡng để nói với người dùng "số này mỏng", không phải để giấu số.
 */
const LOW_COVERAGE_WARNING_PCT = 80;
```

Rồi thay `minimumCoveragePct` bằng `LOW_COVERAGE_WARNING_PCT` ở cả hai khối `if`.

- [ ] **Step 8: Chạy lại toàn bộ test của file**

Run: `cd backend && npx jest snapshot-quality`
Expected: PASS toàn bộ. Nếu test cũ nào fail vì nó khẳng định hành vi của cổng 80%, sửa test đó cho khớp hành vi mới và ghi lý do vào tên test — đó là thay đổi có chủ đích, không phải hồi quy.

- [ ] **Step 9: Chạy toàn bộ test backend**

Run: `cd backend && npm test`
Expected: PASS. `lead-aggregation.spec.ts` có thể fail ở các test dùng pass rate — Task 3 sẽ xử lý. Nếu fail, ghi lại tên test và chuyển sang Task 3 ngay, đừng sửa vội.

- [ ] **Step 10: Commit**

```bash
git add backend/src/dashboards/snapshot-quality.ts backend/src/dashboards/snapshot-quality.spec.ts
git commit -m "fix: stop dropping classes below 80% data coverage

The coverage gate existed to compensate for weighting khoi averages by
class roster size instead of by students who actually have data. It hid
8 of 17 classes from the trend chart. Coverage becomes a displayed number
instead. Pass rates now divide by tested students, not total roster."
```

---

## Task 3: Trung bình toàn khối cân theo số HV có dữ liệu

`weightedResolved` cân trung bình các lớp theo `roster.activeStudents`. Một lớp 14 HV mà chỉ 5 HV có số vẫn được nhân trọng số 14 → méo. Đổi trọng số sang `sampleSize` cho kết quả **bằng đúng** aggregate ở tầng học viên: `Σ(avg_lớp × n_lớp) / Σ(n_lớp) = Σ(điểm từng HV) / Σ(số HV)`.

Kiểm chứng trên dữ liệu prod ngày 2026-08-12: cách mới 89.12%, cách cũ 89.04%.

**Files:**
- Modify: `backend/src/dashboards/lead-aggregation.ts:117-142` và `216-291`
- Test: `backend/src/dashboards/lead-aggregation.spec.ts`

**Interfaces:**
- Consumes: `ResolvedMetric.sampleSize` từ Task 2 (với pass metric, nó bằng `testedStudents`).
- Produces:
  - `weightedResolved(rows, key)` giữ nguyên chữ ký, đổi cách tính bên trong.
  - `LeadWeeklyTrendPoint` thêm trường `activeStudentRoster: number | null` (tổng sĩ số của các lớp báo cáo trong tuần) bên cạnh `activeStudentSample` đã có. Task 8 và 9 dùng cặp này để hiện `228/264 HV`.

- [ ] **Step 1: Viết test thất bại**

Thêm vào `backend/src/dashboards/lead-aggregation.spec.ts`. File đã có helper `resolved(...)` — đọc định nghĩa của nó trước, và nếu nó không cho set `sampleSize` riêng thì thêm helper mới ngay cạnh:

```typescript
const resolvedWithSample = (
  classId: number,
  activeStudents: number,
  attendanceValue: number,
  attendanceSample: number,
): ResolvedClassObservation =>
  ({
    classId,
    className: `C${classId}`,
    asOf: '2026-08-12',
    roster: {
      activeStudents,
      onHoldStudents: 0,
      droppedStudents: 0,
      transferredStudents: 0,
      dataAsOf: '2026-08-12',
    },
    progress: { completedSessions: 0, totalSessions: 0, percentage: null, dataAsOf: null },
    attendance: {
      value: attendanceValue,
      dataAsOf: '2026-08-12',
      sampleSize: attendanceSample,
      recordCount: activeStudents,
      coveragePct: (attendanceSample / activeStudents) * 100,
      fallbackUsed: false,
    },
    homework: {
      value: null, dataAsOf: null, sampleSize: 0, recordCount: 0,
      coveragePct: null, fallbackUsed: false,
    },
    passStandard: {
      value: null, dataAsOf: null, sampleSize: 0, recordCount: 0,
      coveragePct: null, fallbackUsed: false, testedStudents: 0,
    },
    softPass: {
      value: null, dataAsOf: null, sampleSize: 0, recordCount: 0,
      coveragePct: null, fallbackUsed: false, testedStudents: 0,
    },
    dataQuality: {
      status: 'complete', warnings: [], rosterAsOf: '2026-08-12',
      progressAsOf: null, attendanceAsOf: '2026-08-12',
      homeworkAsOf: '2026-08-12', passAsOf: null,
    },
  }) as ResolvedClassObservation;

describe('trung bình toàn khối cân theo số HV có dữ liệu', () => {
  it('không để lớp thiếu dữ liệu kéo lệch trung bình', () => {
    // Lớp A: 20 HV, cả 20 có số, trung bình 90.
    // Lớp B: 20 HV nhưng chỉ 2 HV có số, trung bình 50.
    // Tầng học viên: (90*20 + 50*2) / 22 = 86.4
    // Cân theo sĩ số (cách cũ): (90*20 + 50*20) / 40 = 70 — sai.
    const current = [
      resolvedWithSample(1, 20, 90, 20),
      resolvedWithSample(2, 20, 50, 2),
    ];

    const result = compareMonthlyMetrics(current, []);

    expect(result.attendanceAvg.value).toBe(86.4);
    expect(result.attendanceAvg.sampleSize).toBe(22);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd backend && npx jest lead-aggregation -t "không để lớp thiếu dữ liệu kéo lệch"`
Expected: FAIL, nhận `70` thay vì `86.4`.

- [ ] **Step 3: Viết lại `weightedResolved`**

Thay hàm ở `lead-aggregation.ts:117-142` bằng:

```typescript
/**
 * Trung bình toàn khối, cân theo SỐ HỌC VIÊN THỰC SỰ CÓ DỮ LIỆU.
 *
 * Tương đương về mặt toán học với việc cộng chỉ số của từng học viên rồi chia
 * cho tổng số học viên có chỉ số:
 *   Σ(avg_lớp × n_lớp) / Σ(n_lớp) = Σ(điểm từng HV) / Σ(số HV)
 *
 * Cách cũ cân theo `roster.activeStudents`, tức sĩ số lớp. Một lớp 14 HV mà
 * chỉ 5 HV có số vẫn được nhân trọng số 14 — trung bình của 5 người bị nhân
 * lên như thể đại diện cho 14 người. Đó cũng chính là lý do tồn tại của ngưỡng
 * độ phủ 80% đã bị xoá ở snapshot-quality.ts: nó chặn bớt các lớp mà trọng số
 * sai gây hại nhất, thay vì sửa trọng số.
 *
 * Với pass chuẩn / pass mềm, `sampleSize` là số HV đã thi, nên trọng số cũng
 * tự động đúng: lớp có 2 người thi không nặng bằng lớp có 20 người thi.
 */
function weightedResolved(
  rows: ResolvedClassObservation[],
  key: MetricKey,
): { value: number | null; sampleSize: number; classes: number } {
  const valid = rows.filter(
    (row) => row[key].sampleSize > 0 && row[key].value !== null,
  );
  const denominator = valid.reduce((sum, row) => sum + row[key].sampleSize, 0);
  return {
    value:
      denominator === 0
        ? null
        : round1(
            valid.reduce(
              (sum, row) => sum + Number(row[key].value) * row[key].sampleSize,
              0,
            ) / denominator,
          ),
    sampleSize: denominator,
    classes: valid.length,
  };
}
```

- [ ] **Step 4: Chạy test để xác nhận nó pass**

Run: `cd backend && npx jest lead-aggregation -t "không để lớp thiếu dữ liệu kéo lệch"`
Expected: PASS.

- [ ] **Step 5: Thêm `activeStudentRoster` vào kiểu trend point**

Trong `lead-aggregation.ts`, thêm vào `LeadWeeklyTrendPoint` (dòng 48-64), ngay sau `activeStudentSample`:

```typescript
  /**
   * Tổng sĩ số của các lớp có báo cáo trong tuần — mẫu số để đọc
   * `activeStudentSample`. Hai số này lệch nhau là chuyện bình thường và phải
   * hiện ra cho người dùng thấy: ngày 12/08 có 264 HV active nhưng chỉ 228 HV
   * có bản ghi. Giấu đi thì độ phủ trông như 100%.
   */
  activeStudentRoster: number | null;
```

- [ ] **Step 6: Điền `activeStudentRoster` trong `buildWeeklyTrend`**

Trong `buildWeeklyTrend` (dòng 266-287), thêm vào object được push, ngay sau `activeStudentSample`.

⚠️ Mẫu số phải lấy trên **đúng tập lớp** đã đóng góp vào tử số — tức các lớp có điểm danh tươi, KHÔNG phải `reportRows` (`fresh(attendance) || fresh(homework)`). Nếu lấy `reportRows`, một lớp tươi BTVN nhưng cũ điểm danh sẽ góp toàn bộ sĩ số vào mẫu số mà góp 0 vào tử số: lớp A (sĩ số 20, sample 18) cộng lớp B (sĩ số 15, điểm danh cũ) ra "18/35 HV" = 51%, trong khi lớp duy nhất thực sự báo cáo có độ phủ 90%. Task 9 hiển thị cặp này thành tỷ lệ độ phủ, nên sai lệch đó đọc ra thành báo động chất lượng dữ liệu giả.

Ngoài ra, lấy `reportRows` khiến trường này trùng y hệt trường `activeStudents` ngay phía trên — hai tên khác nhau cho cùng một số.

```typescript
      activeStudentRoster: (() => {
        const attendanceRows = rows.filter((row) => fresh(row.attendance, weekEnd));
        return attendanceRows.length === 0
          ? null
          : attendanceRows.reduce((sum, row) => sum + row.roster.activeStudents, 0);
      })(),
```

Lưu ý một lớp có bản ghi chỉ số nhưng chưa có snapshot sĩ số sẽ cho `roster.activeStudents = 0` kèm `sampleSize > 0` — tức tử số lớn hơn mẫu số. Xử lý rõ ràng thay vì để tỷ lệ vượt 100%.

- [ ] **Step 7: Đổi `activeStudentSample` sang dùng sampleSize**

Cùng object đó, `activeStudentSample` hiện cộng `roster.activeStudents` của các lớp tươi — sai tên. Thay bằng:

```typescript
      activeStudentSample: rows
        .filter((row) => fresh(row.attendance, weekEnd))
        .reduce((sum, row) => sum + row.attendance.sampleSize, 0),
```

- [ ] **Step 8: Chạy toàn bộ test backend**

Run: `cd backend && npm test`
Expected: PASS. Các test cũ khẳng định trọng số theo sĩ số sẽ fail — sửa số kỳ vọng cho khớp công thức mới và đổi tên test để nói rõ nó đang kiểm chứng trọng số theo `sampleSize`.

- [ ] **Step 9: Commit**

```bash
git add backend/src/dashboards/lead-aggregation.ts backend/src/dashboards/lead-aggregation.spec.ts
git commit -m "fix: weight khoi averages by students with data, not roster size

Equivalent to aggregating at the student level. A class where only 5 of
14 students have data no longer counts as if all 14 reported. Verified
against prod 2026-08-12: 89.12% vs 89.04% under the old weighting."
```

---

## Task 4: Ba bộ lọc vào tầng query

Bốn query trong `getLeadDashboard` đọc lẫn dòng `snapshot_stage 1..8` (backfill mốc test, luôn NULL điểm danh) và HV `queuing`/`cancelled`. Trên prod ngày 2026-08-12: 770 dòng được đếm thay vì 244.

**Files:**
- Modify: `backend/src/dashboards/dashboards.service.ts:107-172`

**Interfaces:**
- Consumes: không có gì mới.
- Produces: `studentMetricRows` và `transitionRows` chỉ còn dòng live của HV `on_going`. Các trường trả về giữ nguyên tên, chỉ đổi giá trị.

- [ ] **Step 1: Viết test thất bại ở tầng SQL bằng script kiểm chứng**

Backend không có test tích hợp chạm DB thật, và thêm một cái ở đây là ngoài phạm vi. Thay vào đó dùng script kiểm chứng thủ công. Tạo file tạm (không commit):

```bash
cd backend && NODE_PATH=./node_modules node -e "
const {Client}=require('pg');
const c=new Client({connectionString:'postgresql://postgres:Izone%402026!@160.187.146.127:5432/izone_dashboard'});
c.connect().then(async()=>{
  const q = (extra) => c.query(\`
    SELECT count(*)::int AS record_count, count(r.attendance_pct)::int AS att_n
    FROM izone.student_daily_records r
    JOIN izone.students s ON s.student_id = r.student_id
    JOIN izone.classes c ON c.class_id = r.class_id
    JOIN izone.teachers t ON t.teacher_id = c.teacher_id
    WHERE c.course_id=2 AND t.khoi_id=2 AND c.status='on_going'
      AND r.record_date='2026-08-12' \${extra}\`);
  console.log('Truoc khi loc:', (await q('')).rows[0]);
  console.log('Sau khi loc  :', (await q(\"AND r.snapshot_stage IS NULL AND s.registration_status='on_going'\")).rows[0]);
  await c.end();
});"
```

Expected trước khi sửa code: `Truoc khi loc: { record_count: 770, att_n: 244 }` và `Sau khi loc: { record_count: 228, att_n: 228 }`. Đây là con số mục tiêu mà query trong code phải đạt được.

- [ ] **Step 2: Thêm bộ lọc vào `studentMetricRows`**

Trong `dashboards.service.ts`, query bắt đầu ở dòng 124. Thêm join `students` và hai điều kiện. Sửa khối `FROM`/`WHERE` (dòng 140-148) thành:

```sql
      FROM izone.student_daily_records r
      JOIN izone.students s ON s.student_id = r.student_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND r.record_date <= ${new Date(`${calendar.currentAsOf}T00:00:00Z`)}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
```

Đặt ngay trên dòng `GROUP BY r.class_id, r.record_date` một comment giải thích, vì đây là chỗ dễ bị gỡ nhất khi ai đó tối ưu query về sau:

```typescript
    /*
     * HAI BỘ LỌC DƯỚI ĐÂY LÀ BẮT BUỘC — gỡ ra là mọi con số của Lead sai.
     *
     * snapshot_stage IS NULL: migration 007 biến bảng này thành hai loại dữ
     * liệu trộn chung. Dòng stage 1..8 là ảnh chụp theo MỐC TEST (record_date
     * của chúng chỉ là ngày chạy backfill, vô nghĩa) và luôn NULL điểm danh /
     * BTVN / pass. Đếm lẫn chúng thì ngày 12/08 ra 770 dòng thay vì 228.
     *
     * registration_status = 'on_going': HV queuing chỉ có 39% dòng mang điểm
     * danh, HV cancelled 15%. Business rule "queuing trong lớp on_going coi
     * như dropped" đã có ở effectiveRegistrationStatus() nhưng chỉ áp cho
     * Teacher dashboard — đây là chỗ áp cho Lead.
     */
```

- [ ] **Step 3: Thêm bộ lọc vào `transitionRows`**

Query bắt đầu ở dòng 153. Thêm join `students` và hai điều kiện tương tự vào khối `FROM`/`WHERE` (dòng 159-170):

```sql
      FROM izone.student_daily_records r
      JOIN izone.students s ON s.student_id = r.student_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND r.record_date BETWEEN ${new Date(`${previousCalendar.previousAsOf.slice(0, 7)}-01T00:00:00Z`)}
                              AND ${new Date(`${calendar.reportAsOf}T00:00:00Z`)}
        AND r.has_label_changed = TRUE
        AND r.label_change_direction IN ('up', 'down')
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
```

`snapshotRows` (dòng 107) đọc `class_daily_snapshots` — bảng đó ở tầng lớp, không có `snapshot_stage` và không có `registration_status`. **Không sửa gì.** `classRows` (dòng 93) cũng không sửa.

- [ ] **Step 4: Build backend**

Run: `cd backend && npm run build`
Expected: build thành công.

- [ ] **Step 5: Chạy backend và kiểm chứng số thật trên API**

```bash
cd backend && npm run start:dev
```

Ở terminal khác, đăng nhập lấy token rồi gọi endpoint (thay `<TOKEN>`):

```bash
curl -s 'http://localhost:3000/api/v1/lead-dashboard?courseId=2&khoiId=2&period=2026-08&classStatus=on_going' \
  -H 'Authorization: Bearer <TOKEN>' \
  | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  const r=JSON.parse(s);
  console.log('Điểm danh:', r.kpis.attendanceAvg.value, '| mẫu:', r.kpis.attendanceAvg.sampleSize,
              '| lớp báo cáo:', r.kpis.attendanceAvg.classesReported, '/', r.kpis.attendanceAvg.totalClasses);
  console.log('Nhãn toàn khối:', r.labelDistribution);
  console.log('Tuần cuối:', r.trend.at(-1));
});"
```

Expected: `Điểm danh: 89.1 | mẫu: 228 | lớp báo cáo: 17 / 17`. Tổng `labelDistribution` phải xấp xỉ 264, **không** phải ~770. Nếu vẫn ra số nghìn thì một bộ lọc chưa được áp.

- [ ] **Step 6: Chạy toàn bộ test backend**

Run: `cd backend && npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/src/dashboards/dashboards.service.ts
git commit -m "fix: exclude stage rows and non-active students from lead aggregates

Migration 007 mixed two data grains into student_daily_records. The lead
queries counted stage backfill rows as if they were students: 770 rows
instead of 228 on 2026-08-12, inflating every denominator ~3x."
```

---

## Task 5: Sửa nhãn "HV có test" trên KPI

`snapshot-quality.ts` đã trả `sampleSize = testedStudents` sau Task 2, nên nhãn ở `KpiRow` giờ đúng nghĩa. Nhưng `reportingNote` và `testNote` cần nói rõ mẫu số hơn.

**Files:**
- Modify: `dashboard/src/components/dashboard/KpiRow.tsx:21-35`
- Test: `dashboard/src/components/dashboard/kpiFormat.test.ts`
- Modify: `dashboard/src/components/dashboard/kpiFormat.ts`

**Interfaces:**
- Consumes: `DashboardMetric.sampleSize` giờ mang nghĩa "số HV có dữ liệu cho chỉ số này" (Task 2).
- Produces: `formatReportingNote({ classesReported, totalClasses, sampleSize })` và `formatTestNote({ classesWithTests, totalClasses, sampleSize })` — hai hàm thuần export từ `kpiFormat.ts`, dùng bởi `KpiRow`.

- [ ] **Step 1: Viết test thất bại**

Thêm vào `dashboard/src/components/dashboard/kpiFormat.test.ts`:

```typescript
import { formatReportingNote, formatTestNote } from './kpiFormat';

describe('formatReportingNote', () => {
  it('nói rõ số lớp báo cáo và số HV có dữ liệu', () => {
    expect(formatReportingNote({ classesReported: 17, totalClasses: 17, sampleSize: 228 }))
      .toBe('17/17 lớp · 228 HV có dữ liệu');
  });

  it('không giấu việc chưa lớp nào báo cáo', () => {
    expect(formatReportingNote({ classesReported: 0, totalClasses: 17, sampleSize: 0 }))
      .toBe('chưa lớp nào có dữ liệu');
  });
});

describe('formatTestNote', () => {
  it('đếm học viên đã thi, không đếm sĩ số', () => {
    expect(formatTestNote({ classesWithTests: 15, totalClasses: 17, sampleSize: 196 }))
      .toBe('15/17 lớp có test · 196 HV đã thi');
  });

  it('nói rõ khi chưa lớp nào thi', () => {
    expect(formatTestNote({ classesWithTests: 0, totalClasses: 17, sampleSize: 0 }))
      .toBe('chưa lớp nào có bài test');
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd dashboard && npm test -- kpiFormat`
Expected: FAIL với lỗi import — `formatReportingNote` và `formatTestNote` chưa tồn tại.

- [ ] **Step 3: Viết hai hàm**

Thêm vào cuối `dashboard/src/components/dashboard/kpiFormat.ts`:

```typescript
export interface ReportingNoteInput {
  classesReported: number;
  totalClasses: number;
  sampleSize: number;
}

/**
 * Dòng chú thích dưới các card điểm danh / BTVN.
 *
 * `sampleSize` là số HV THỰC SỰ CÓ SỐ cho chỉ số đó, không phải sĩ số. Hai con
 * số này lệch nhau là bình thường — ngày 12/08 có 264 HV active nhưng 228 HV có
 * bản ghi — và người đọc phải thấy được điều đó thay vì tưởng số liệu phủ 100%.
 */
export function formatReportingNote({
  classesReported,
  totalClasses,
  sampleSize,
}: ReportingNoteInput): string {
  if (classesReported === 0) return 'chưa lớp nào có dữ liệu';
  return `${classesReported}/${totalClasses} lớp · ${sampleSize} HV có dữ liệu`;
}

export interface TestNoteInput {
  classesWithTests: number;
  totalClasses: number;
  sampleSize: number;
}

/**
 * Dòng chú thích dưới các card pass chuẩn / pass mềm.
 *
 * Tỷ lệ pass chia cho SỐ HV ĐÃ THI, nên chú thích phải nói đúng con số đó.
 * Trước đây dòng này in `recordCount` (tổng sĩ số) kèm chữ "HV có test" — sai
 * nghĩa hoàn toàn.
 */
export function formatTestNote({
  classesWithTests,
  totalClasses,
  sampleSize,
}: TestNoteInput): string {
  if (classesWithTests === 0) return 'chưa lớp nào có bài test';
  return `${classesWithTests}/${totalClasses} lớp có test · ${sampleSize} HV đã thi`;
}
```

- [ ] **Step 4: Chạy test để xác nhận nó pass**

Run: `cd dashboard && npm test -- kpiFormat`
Expected: PASS.

- [ ] **Step 5: Dùng hai hàm trong `KpiRow`**

Trong `dashboard/src/components/dashboard/KpiRow.tsx`, xoá hai hàm cục bộ `reportingNote` (dòng 21-26) và `testNote` (dòng 28-35). Đổi import ở dòng 7 thành:

```typescript
import { formatAttritionNote, formatReportingNote, formatTestNote } from './kpiFormat';
```

Đổi bốn chỗ dùng:

```typescript
        note={formatReportingNote({
          classesReported: kpis.attendanceAvg.classesReported ?? 0,
          totalClasses: kpis.attendanceAvg.totalClasses ?? 0,
          sampleSize: kpis.attendanceAvg.sampleSize ?? 0,
        })}
```

```typescript
        note={formatReportingNote({
          classesReported: kpis.homeworkAvg.classesReported ?? 0,
          totalClasses: kpis.homeworkAvg.totalClasses ?? 0,
          sampleSize: kpis.homeworkAvg.sampleSize ?? 0,
        })}
```

```typescript
        note={formatTestNote({
          classesWithTests: kpis.passStandardRate.classesWithTests ?? 0,
          totalClasses: kpis.passStandardRate.totalClasses ?? 0,
          sampleSize: kpis.passStandardRate.sampleSize ?? 0,
        })}
```

```typescript
        note={formatTestNote({
          classesWithTests: kpis.softPassRate.classesWithTests ?? 0,
          totalClasses: kpis.softPassRate.totalClasses ?? 0,
          sampleSize: kpis.softPassRate.sampleSize ?? 0,
        })}
```

- [ ] **Step 6: Chạy bốn cổng của dashboard**

Run: `cd dashboard && npx tsc -b && npm run lint && npm test && npm run build`
Expected: cả bốn sạch.

- [ ] **Step 7: Commit**

```bash
git add dashboard/src/components/dashboard/kpiFormat.ts \
        dashboard/src/components/dashboard/kpiFormat.test.ts \
        dashboard/src/components/dashboard/KpiRow.tsx
git commit -m "fix: KPI notes now state the real denominator

The pass cards printed total roster size labelled 'HV có test'. Extract
both note formatters into kpiFormat.ts so they are testable without a DOM."
```

---

## Task 6: Tính độ phủ liên hệ ở backend

Cột "Độ phủ liên hệ" chưa từng được nối dây. Backend đã có mọi mảnh cần thiết: `classifyStudent` cho biết HV nào đang mở cảnh báo, `contact_logs` cho biết GV đã liên hệ chưa.

Ghi chú thiết kế quan trọng: trong `dashboard/src/data/selectors/studentFilters.ts`, cả ba predicate đều rẽ vào `s.interventionLevel === 'level_N'` khi trường đó có mặt — mà backend luôn trả về. Nên **mỗi HV chỉ mở đúng một episode**, và luật "đóng hộ" `COVERED_BY` trong `contactLog.ts` hiện là no-op. Backend không cần nhân bản luật đó.

**Files:**
- Create: `backend/src/dashboards/contact-coverage.ts`
- Create: `backend/src/dashboards/contact-coverage.spec.ts`
- Modify: `backend/src/dashboards/dashboards.service.ts`

**Interfaces:**
- Consumes: `classifyStudent` và `DashboardThresholds` từ `./labeling-engine`.
- Produces:
  - `export interface ContactCoverage { done: number; total: number; pct: number | null }`
  - `export interface CoverageStudent { studentId: number; classId: number; messageTemplateKey: string | null; checkpoint: string }`
  - `export interface CoverageLog { studentId: number; classId: number; triggerType: string; checkpoint: string }`
  - `export function contactCoverageByClass(students: CoverageStudent[], logs: CoverageLog[]): Map<number, ContactCoverage>`
  - Task 7 đọc `contactCoverage` trên mỗi phần tử `classes[]` của response.

- [ ] **Step 1: Viết test thất bại**

Tạo `backend/src/dashboards/contact-coverage.spec.ts`:

```typescript
import {
  contactCoverageByClass,
  type CoverageLog,
  type CoverageStudent,
} from './contact-coverage';

const student = (
  studentId: number,
  classId: number,
  messageTemplateKey: string | null,
  checkpoint = 'Test 3',
): CoverageStudent => ({ studentId, classId, messageTemplateKey, checkpoint });

const log = (
  studentId: number,
  classId: number,
  triggerType: string,
  checkpoint = 'Test 3',
): CoverageLog => ({ studentId, classId, triggerType, checkpoint });

describe('contactCoverageByClass', () => {
  it('đếm HV đang mở cảnh báo làm mẫu số, HV không cần hành động bị bỏ qua', () => {
    const result = contactCoverageByClass(
      [
        student(1, 100, 'habit_reminder'),
        student(2, 100, 'red_followup'),
        student(3, 100, null),
      ],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it('trả pct null khi lớp không có cảnh báo nào — khác hẳn 0%', () => {
    const result = contactCoverageByClass([student(1, 100, null)], []);

    expect(result.get(100)).toEqual({ done: 0, total: 0, pct: null });
  });

  it('không tính log của mốc test khác', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder', 'Test 3')],
      [log(1, 100, 'habit_reminder', 'Test 2')],
    );

    expect(result.get(100)).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('không tính log của luồng khác', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'red_followup')],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('nhiều log trùng một episode chỉ tính một lần', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder')],
      [log(1, 100, 'habit_reminder'), log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 1, pct: 100 });
  });

  it('tách độ phủ theo từng lớp', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder'), student(2, 200, 'habit_reminder')],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 1, pct: 100 });
    expect(result.get(200)).toEqual({ done: 0, total: 1, pct: 0 });
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd backend && npx jest contact-coverage`
Expected: FAIL — module chưa tồn tại.

- [ ] **Step 3: Viết module**

Tạo `backend/src/dashboards/contact-coverage.ts`:

```typescript
/**
 * Độ phủ liên hệ: trong số cảnh báo đang mở của một lớp, bao nhiêu cái GV đã
 * xác nhận đã liên hệ.
 *
 * Đếm theo EPISODE = (học viên, luồng, mốc test). Một episode đóng khi có bản
 * ghi contact_logs khớp cả ba. Đổi mốc test là mọi episode mở lại — đó là chủ
 * đích: nhãn được tính lại sau mỗi bài test nên lời nhắc cũ không còn giá trị.
 *
 * Mỗi HV chỉ mở tối đa MỘT episode, vì classifyStudent xếp mỗi HV vào đúng một
 * interventionLevel và trả đúng một recommendedAction. Frontend
 * (selectors/contactLog.ts) có thêm luật "đóng hộ" COVERED_BY cho trường hợp
 * một HV mở nhiều luồng cùng lúc — luật đó hiện là no-op vì cả ba predicate
 * trong studentFilters.ts đều rẽ theo interventionLevel. Nếu sau này nghiệp vụ
 * cho phép một HV mở nhiều luồng, phải port COVERED_BY sang đây, nếu không con
 * số Lead thấy sẽ lệch con số GV thấy.
 */

export interface ContactCoverage {
  done: number;
  total: number;
  /**
   * null khi total = 0 — KHÔNG được thay bằng 0. Một lớp không có cảnh báo nào
   * và một lớp bỏ mặc 100% cảnh báo là hai chuyện khác hẳn nhau; trả 0% khiến
   * chúng hiện ra giống hệt nhau trên bảng của Lead. Cùng quy ước với
   * dashboard/src/data/selectors/contactLog.ts.
   */
  pct: number | null;
}

export interface CoverageStudent {
  studentId: number;
  classId: number;
  /** null nghĩa là HV không mở cảnh báo nào — không vào mẫu số. */
  messageTemplateKey: string | null;
  checkpoint: string;
}

export interface CoverageLog {
  studentId: number;
  classId: number;
  triggerType: string;
  checkpoint: string;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

const episodeKey = (
  studentId: number,
  classId: number,
  trigger: string,
  checkpoint: string,
): string => `${classId}|${studentId}|${trigger}|${checkpoint}`;

export function contactCoverageByClass(
  students: CoverageStudent[],
  logs: CoverageLog[],
): Map<number, ContactCoverage> {
  const closed = new Set(
    logs.map((row) =>
      episodeKey(row.studentId, row.classId, row.triggerType, row.checkpoint),
    ),
  );

  const tally = new Map<number, { done: number; total: number }>();
  for (const student of students) {
    const current = tally.get(student.classId) ?? { done: 0, total: 0 };
    if (student.messageTemplateKey !== null) {
      current.total += 1;
      if (
        closed.has(
          episodeKey(
            student.studentId,
            student.classId,
            student.messageTemplateKey,
            student.checkpoint,
          ),
        )
      ) {
        current.done += 1;
      }
    }
    tally.set(student.classId, current);
  }

  return new Map(
    [...tally].map(([classId, { done, total }]) => [
      classId,
      { done, total, pct: total === 0 ? null : round1((done / total) * 100) },
    ]),
  );
}
```

- [ ] **Step 4: Chạy test để xác nhận nó pass**

Run: `cd backend && npx jest contact-coverage`
Expected: PASS, cả 6 test.

- [ ] **Step 5: Thêm query ngưỡng và HV vào `getLeadDashboard`**

Trong `dashboards.service.ts`, thêm ba query sau `transitionRows` (sau dòng 172):

```typescript
    const configRows = await this.prisma.$queryRaw<any[]>`
      SELECT config_key, config_value
      FROM izone.system_configs
      WHERE config_key IN ('nguong_xam_max', 'nguong_do_max', 'pass_dh_min', 'pass_btvn_min')
    `;

    /*
     * Dòng live của HV đang học tại mốc hiện tại — dùng để phân loại mức can
     * thiệp cho từng HV, từ đó ra mẫu số của độ phủ liên hệ. Khoảng 264 dòng
     * cho toàn khối nên không cần phân trang.
     */
```

⚠️ Truy vấn này PHẢI có fallback `test_scores` giống hệt Teacher dashboard. Teacher suy checkpoint bằng `row.last_checkpoint || scores.at(-1)?.testName || 'Chưa có test'`. Nếu Lead chỉ có `last_checkpoint || 'Chưa có test'` thì 23–24 HV (trong 88 HV có `last_checkpoint` rỗng nhưng đã có điểm test) sẽ được Teacher tính là `'Test 5'` còn Lead tính là `'Chưa có test'` — contact log ghi từ màn hình Teacher mang checkpoint của Teacher, nên episode của họ không bao giờ đóng được và độ phủ của Lead đếm thiếu vĩnh viễn.

Dùng `LEFT JOIN LATERAL ... LIMIT 1`, **không** dùng join thường: join thường sẽ nhân dòng theo từng lần thi và phá vỡ cardinality mà `DISTINCT ON` phụ thuộc vào.

```typescript
    const coverageStudentRows = await this.prisma.$queryRaw<any[]>`
      SELECT DISTINCT ON (r.student_id, r.class_id)
             r.student_id, r.class_id, r.attendance_pct, r.homework_pct,
             r.test_average, r.flag_attendance_drop, r.flag_homework_drop,
             r.last_checkpoint, s.registration_status,
             COALESCE(ts.test_name, 'Test ' || ts.test_order) AS latest_test_name
      FROM izone.student_daily_records r
      JOIN izone.students s ON s.student_id = r.student_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND r.record_date <= ${new Date(`${calendar.currentAsOf}T00:00:00Z`)}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY r.student_id, r.class_id, r.record_date DESC
    `;

    const contactLogRows = await this.prisma.$queryRaw<any[]>`
      SELECT cl.student_id, cl.class_id, cl.trigger_type, cl.checkpoint
      FROM izone.contact_logs cl
      JOIN izone.classes c ON c.class_id = cl.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
    `;
```

- [ ] **Step 6: Tính coverage map**

Ngay sau ba query trên, thêm:

```typescript
    const coverageConfig = new Map(
      configRows.map((row) => [row.config_key, row.config_value]),
    );
    const coverageThresholds: DashboardThresholds = {
      greyMax: this.configNumber(
        coverageConfig, 'nguong_xam_max', DEFAULT_DASHBOARD_THRESHOLDS.greyMax,
      ),
      redMax: this.configNumber(
        coverageConfig, 'nguong_do_max', DEFAULT_DASHBOARD_THRESHOLDS.redMax,
      ),
      attendanceMin: this.configNumber(
        coverageConfig, 'pass_dh_min', DEFAULT_DASHBOARD_THRESHOLDS.attendanceMin,
      ),
      homeworkMin: this.configNumber(
        coverageConfig, 'pass_btvn_min', DEFAULT_DASHBOARD_THRESHOLDS.homeworkMin,
      ),
    };

    const coverageByClass = contactCoverageByClass(
      coverageStudentRows.map((row): CoverageStudent => {
        const classification = classifyStudent(
          {
            registrationStatus: row.registration_status,
            attendancePct: this.nullableNumber(row.attendance_pct),
            homeworkPct: this.nullableNumber(row.homework_pct),
            testAverage: this.nullableNumber(row.test_average),
            flagAttendanceDrop: Boolean(row.flag_attendance_drop),
            flagHomeworkDrop: Boolean(row.flag_homework_drop),
          },
          coverageThresholds,
        );
        return {
          studentId: Number(row.student_id),
          classId: Number(row.class_id),
          messageTemplateKey: classification.recommendedAction.messageTemplateKey,
          /*
           * `||` chứ không phải `??`: last_checkpoint trong DB dùng CHUỖI RỖNG
           * cho HV chưa có test (35/228 HV ngày 12/08), không phải NULL. Dùng
           * `??` thì checkpoint thành '' và không khớp được contact_logs.
           */
          checkpoint: row.last_checkpoint || 'Chưa có test',
        };
      }),
      contactLogRows.map((row): CoverageLog => ({
        studentId: Number(row.student_id),
        classId: Number(row.class_id),
        triggerType: String(row.trigger_type),
        checkpoint: String(row.checkpoint),
      })),
    );
```

- [ ] **Step 7: Thêm import**

Đầu file `dashboards.service.ts`, thêm:

```typescript
import {
  contactCoverageByClass,
  type ContactCoverage,
  type CoverageLog,
  type CoverageStudent,
} from './contact-coverage';
```

Và bổ sung `DashboardThresholds` vào import sẵn có từ `./labeling-engine` nếu chưa có (dòng 10-15 đã import `DEFAULT_DASHBOARD_THRESHOLDS`, `classifyStudent`, `type DashboardThresholds` — kiểm tra lại, nếu đủ thì bỏ qua bước này).

- [ ] **Step 8: Đưa coverage vào response**

Đổi chữ ký `mapResolvedLeadClass` (dòng 841) để nhận thêm coverage:

```typescript
  private mapResolvedLeadClass(
    row: any,
    observation: ResolvedClassObservation,
    metrics: any,
    contactCoverage: ContactCoverage,
  ) {
```

Thêm vào object trả về của nó, ngay sau `lastSnapshotDate`:

```typescript
      contactCoverage,
```

Đổi chỗ gọi (dòng 247-257) thành:

```typescript
    const currentClassRows = currentRows.map((observation) => {
      const meta = classRows.find(
        (row) => Number(row.class_id) === observation.classId,
      );
      const metrics = this.latestStudentMetric(
        studentMetricRows,
        observation.classId,
        calendar.currentAsOf,
      );
      return this.mapResolvedLeadClass(
        meta,
        observation,
        metrics,
        coverageByClass.get(observation.classId) ?? { done: 0, total: 0, pct: null },
      );
    });
```

- [ ] **Step 9: Sửa lỗi `??` trên `last_checkpoint` ở Teacher dashboard**

Đây là cùng một lỗi ở `dashboards.service.ts:452-453`. Sửa luôn để hai màn hình không lệch nhau:

```typescript
      const checkpoint =
        row.last_checkpoint || scores.at(-1)?.testName || 'Chưa có test';
```

- [ ] **Step 10: Build và chạy test backend**

Run: `cd backend && npm run build && npm test`
Expected: cả hai sạch.

- [ ] **Step 11: Kiểm chứng trên API thật**

Chạy `npm run start:dev` rồi:

```bash
curl -s 'http://localhost:3000/api/v1/lead-dashboard?courseId=2&khoiId=2&period=2026-08&classStatus=on_going' \
  -H 'Authorization: Bearer <TOKEN>' \
  | node -e "
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
  JSON.parse(s).classes.forEach(c=>
    console.log(c.className.padEnd(8), JSON.stringify(c.contactCoverage)));
});"
```

Expected: 17 dòng. Lớp `IC2142` (class_id 1127) và `IC2174` (class_id 1159) phải có `done > 0` — DB có 9 contact log ở đúng hai lớp này. Các lớp còn lại `done: 0`.

- [ ] **Step 12: Commit**

```bash
git add backend/src/dashboards/contact-coverage.ts \
        backend/src/dashboards/contact-coverage.spec.ts \
        backend/src/dashboards/dashboards.service.ts
git commit -m "feat: compute contact coverage per class in the lead contract

The column existed in the UI but was wired to an empty array. Computing
it server-side avoids fetching every student of all 17 classes. Also fix
last_checkpoint falling back with ?? instead of ||, which missed the empty
string the DB actually stores for students without a test."
```

---

## Task 7: Nối độ phủ liên hệ vào Master Table

**Files:**
- Modify: `dashboard/src/api/dashboardContracts.ts`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`
- Test: `dashboard/src/api/dashboardContracts.test.ts`

**Interfaces:**
- Consumes: `contactCoverage` trên mỗi phần tử `classes[]` (Task 6).
- Produces: `toLeadClassPresentation(contract)` trả thêm `contactCoverage`.

- [ ] **Step 1: Viết test thất bại**

Thêm vào `dashboard/src/api/dashboardContracts.test.ts`. Đọc file trước để dùng đúng fixture đã có; nếu file đã có helper tạo `LeadDashboardClass` thì tái dùng, còn không thì viết inline:

```typescript
describe('toLeadClassPresentation — độ phủ liên hệ', () => {
  it('truyền nguyên độ phủ từ contract', () => {
    const result = toLeadClassPresentation({
      ...leadClassFixture,
      contactCoverage: { done: 3, total: 5, pct: 60 },
    });

    expect(result.contactCoverage).toEqual({ done: 3, total: 5, pct: 60 });
  });

  it('giữ pct null khi lớp không có cảnh báo nào', () => {
    const result = toLeadClassPresentation({
      ...leadClassFixture,
      contactCoverage: { done: 0, total: 0, pct: null },
    });

    expect(result.contactCoverage.pct).toBeNull();
  });
});
```

Nếu `leadClassFixture` chưa tồn tại trong file, tạo nó ở đầu `describe` bằng cách sao chép đủ mọi trường bắt buộc của `LeadDashboardClass` — đừng dùng `as any` để né, vì `tsc -b` là cổng bắt buộc và fixture yếu sẽ che lỗi kiểu thật.

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd dashboard && npm test -- dashboardContracts`
Expected: FAIL — `contactCoverage` chưa có trên kiểu và chưa được trả ra.

- [ ] **Step 3: Thêm trường vào contract**

Trong `dashboard/src/api/dashboardContracts.ts`, thêm vào `LeadDashboardClass` (sau `lastSnapshotDate`, dòng 64):

```typescript
  contactCoverage: { done: number; total: number; pct: number | null };
```

Thêm vào `LeadTrendContractPoint` (sau `activeStudentSample`, dòng 29):

```typescript
  activeStudentRoster: number | null;
```

- [ ] **Step 4: Trả trường đó ra khỏi mapper**

Trong `toLeadClassPresentation` (dòng 221-249), thêm vào object trả về:

```typescript
    contactCoverage: contract.contactCoverage,
```

Trong `toLeadWeeklyTrendPoint` (dòng 205-219), thêm:

```typescript
    activeStudentRoster: point.activeStudentRoster,
```

- [ ] **Step 5: Chạy test để xác nhận nó pass**

Run: `cd dashboard && npm test -- dashboardContracts`
Expected: PASS.

- [ ] **Step 6: Xoá code chết trong `LeadDashboard`**

Trong `dashboard/src/components/dashboard/LeadDashboard.tsx`:

Xoá hàm `coverageOf` (dòng 42-44) hoàn toàn.

Xoá dòng 55: `const [contactLogs] = useState<ContactLog[]>([]);`

Xoá dòng 297: `const coverage = coverageOf(contactLogs, []);`

Dọn import ở dòng 5-11 — bỏ `ContactLog`, `contactCoverage`, `currentCheckpoint` nếu không còn nơi nào dùng. `tsc -b` bật `noUnusedLocals` nên import thừa sẽ fail build; đó chính là cơ chế bắt lỗi cho bước này.

- [ ] **Step 7: Đọc coverage từ contract**

Trong `filteredClasses.map((c) => {` (dòng 285), thêm ngay sau `const contract = contractClassById.get(c.classId);`:

```typescript
                  const coverage = contract?.contactCoverage ?? { done: 0, total: 0, pct: null };
```

Phần JSX của cột (dòng 338-349) giữ nguyên không đổi — nó vốn đã đọc đúng `coverage.pct`, `coverage.done`, `coverage.total`.

- [ ] **Step 8: Chạy bốn cổng của dashboard**

Run: `cd dashboard && npx tsc -b && npm run lint && npm test && npm run build`
Expected: cả bốn sạch.

- [ ] **Step 9: Kiểm chứng bằng mắt**

Chạy backend (`cd backend && npm run start:dev`) và dashboard (`cd dashboard && npm run dev`), đăng nhập bằng tài khoản lead, mở tab Lead Khối Dashboard.

Expected: cột "Độ phủ liên hệ" của `IC2142` và `IC2174` hiện tỷ lệ phần trăm kèm dòng `N/M cảnh báo`; các lớp khác hiện `0%` hoặc `--` (lớp không có cảnh báo nào), **không lớp nào còn hiện `--` đồng loạt**.

- [ ] **Step 10: Commit**

```bash
git add dashboard/src/api/dashboardContracts.ts \
        dashboard/src/api/dashboardContracts.test.ts \
        dashboard/src/components/dashboard/LeadDashboard.tsx
git commit -m "feat: wire contact coverage column to the lead contract

The column rendered '--' for every class because contactLogs was a
useState frozen at [] and coverageOf was called with an empty student
list. Both are now gone."
```

---

## Task 8: Bỏ card Net Momentum

Kỳ 08/2026 chỉ có 24 transition, dồn hết vào một ngày 12/08. Lead không hành động được gì từ con số đó, và card không có tooltip giải thích. Contract backend giữ nguyên `netMomentum` để không phá API.

**Files:**
- Modify: `dashboard/src/components/dashboard/KpiRow.tsx`

**Interfaces:**
- Consumes: `LeadDashboardResponse['kpis']` — trường `netMomentum` vẫn còn trong kiểu, chỉ không được render.
- Produces: `KpiRow` render đúng 5 card.

- [ ] **Step 1: Xoá card và biến phụ trợ**

Trong `dashboard/src/components/dashboard/KpiRow.tsx`:

Xoá cả khối `<KpiCard ... label="Net Momentum" ... />` (dòng 99-107).

Xoá hai biến ở đầu component (dòng 38-45): `netDelta` và `flowNote`.

- [ ] **Step 2: Đổi lưới sang 5 cột**

Đổi dòng 48:

```typescript
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
```

- [ ] **Step 3: Dọn import thừa**

`TrendingDown` ở dòng 2 giờ không còn ai dùng — xoá khỏi danh sách import của `lucide-react`. Kiểm tra `MetricDelta` (dòng 4) vẫn còn dùng bởi hàm `metricDelta`; nếu còn thì giữ.

- [ ] **Step 4: Chạy bốn cổng**

Run: `cd dashboard && npx tsc -b && npm run lint && npm test && npm run build`
Expected: cả bốn sạch. Nếu `tsc -b` báo unused import thì đó đúng là thứ Step 3 cần dọn nốt.

- [ ] **Step 5: Kiểm chứng bằng mắt**

Mở lại dashboard. Expected: hàng KPI có đúng 5 thẻ, dàn đều trên màn hình rộng, không có ô trống ở cuối hàng.

- [ ] **Step 6: Commit**

```bash
git add dashboard/src/components/dashboard/KpiRow.tsx
git commit -m "refactor: drop the Net Momentum KPI card

24 label transitions in the whole period, all on a single day, with no
tooltip explaining the subtraction. The backend still returns the field;
only the card is gone."
```

---

## Task 9: Nói thật về mẫu số trên hai biểu đồ

Header ghi "17 lớp · 264 HV" còn biểu đồ ghi "7 lớp báo cáo · 125 HV" mà không giải thích hai con số đo hai thứ khác nhau. Sau các task trên, biểu đồ sẽ đầy hơn nhiều nhưng phần trái vẫn mỏng thật — IC2230 chỉ có 3 ngày dữ liệu, IC2226 có 5.

**Files:**
- Modify: `dashboard/src/components/dashboard/trendChartModel.ts`
- Modify: `dashboard/src/components/dashboard/TrendChart.tsx`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`
- Test: `dashboard/src/components/dashboard/trendChartModel.test.ts`

**Interfaces:**
- Consumes: `activeStudentRoster` trên trend point (Task 3 + Task 7).
- Produces: `TrendChartRow` thêm `activeStudentRoster: number | null`.

- [ ] **Step 1: Viết test thất bại**

Đọc `trendChartModel.ts` để biết `WeeklyTrendPoint` và `TrendChartRow` đang có gì, rồi thêm vào `trendChartModel.test.ts`:

```typescript
describe('toTrendChartRows — mẫu số dữ liệu', () => {
  it('mang theo sĩ số để đọc được độ phủ', () => {
    const rows = toTrendChartRows([
      {
        weekStart: '2026-08-10',
        weekEnd: '2026-08-12',
        testCheckpoint: null,
        attendanceAvg: 89.1,
        homeworkAvg: 89.3,
        passChuanRate: null,
        passMemRate: null,
        classesReported: 17,
        activeStudentSample: 228,
        activeStudentRoster: 264,
        classesWithTests: 15,
        latestDataAsOf: '2026-08-12',
      },
    ]);

    expect(rows[0].activeStudentSample).toBe(228);
    expect(rows[0].activeStudentRoster).toBe(264);
  });
});
```

- [ ] **Step 2: Chạy test để xác nhận nó fail**

Run: `cd dashboard && npm test -- trendChartModel`
Expected: FAIL — `activeStudentRoster` chưa có trên kiểu.

- [ ] **Step 3: Thêm trường vào model**

Trong `trendChartModel.ts`, thêm `activeStudentRoster: number | null;` vào cả `WeeklyTrendPoint` và `TrendChartRow`, và truyền qua trong `toTrendChartRows`.

- [ ] **Step 4: Chạy test để xác nhận nó pass**

Run: `cd dashboard && npm test -- trendChartModel`
Expected: PASS.

- [ ] **Step 5: Hiện độ phủ trên tooltip**

Trong `TrendChart.tsx`, đổi dòng 93 trong `labelFormatter`:

```typescript
                    <div>
                      {row.classesReported} lớp báo cáo · {row.activeStudentSample}
                      {row.activeStudentRoster === null
                        ? ''
                        : `/${row.activeStudentRoster}`} HV có dữ liệu
                    </div>
```

- [ ] **Step 6: Viết lại subtitle hai biểu đồ**

Trong `LeadDashboard.tsx`, đổi subtitle của `TrendChart` "Chất lượng vận hành" (dòng 223):

```typescript
          subtitle={`Điểm danh và BTVN toàn khối · ${view.trendSeries.length} tuần đến ${dashboard.meta.reportAsOf} · mỗi tuần chỉ tính lớp có dữ liệu trong 7 ngày, nên số lớp thấp hơn tổng số lớp đang chạy`}
```

Và của "Kết quả" (dòng 231):

```typescript
          subtitle={`Pass chuẩn và pass mềm toàn khối · ${view.trendSeries.length} tuần đến ${dashboard.meta.reportAsOf} · tỷ lệ tính trên học viên đã thi, không tính học viên chưa có bài test nào`}
```

- [ ] **Step 7: Xoá `newClasses` và `endedClasses`**

Trong `LeadDashboard.tsx`, xoá `newClasses: 0` và `endedClasses: 0` khỏi cả hai nhánh của `view` (dòng 95-96 và 114-115), và xoá hai prop khỏi `<ContextBar>` (dòng 212-213).

Trong `ContextBar.tsx`, xoá hai prop khỏi interface `ContextBarProps` (dòng 11-12), khỏi destructuring (dòng 21-22), và xoá hai nhánh hiển thị (dòng 65-66).

- [ ] **Step 8: Chạy bốn cổng**

Run: `cd dashboard && npx tsc -b && npm run lint && npm test && npm run build`
Expected: cả bốn sạch.

- [ ] **Step 9: Kiểm chứng bằng mắt**

Mở dashboard, di chuột lên biểu đồ *Chất lượng vận hành*.

Expected: tuần cuối hiện `17 lớp báo cáo · 228/264 HV có dữ liệu`; các tuần tháng 7 hiện quanh 13–16 lớp (trước khi sửa là 8–9). Subtitle giải thích được vì sao số lớp thấp hơn 17.

- [ ] **Step 10: Commit**

```bash
git add dashboard/src/components/dashboard/trendChartModel.ts \
        dashboard/src/components/dashboard/trendChartModel.test.ts \
        dashboard/src/components/dashboard/TrendChart.tsx \
        dashboard/src/components/dashboard/LeadDashboard.tsx \
        dashboard/src/components/dashboard/ContextBar.tsx
git commit -m "feat: state the real denominator on both trend charts

The header said '17 classes / 264 students' while the chart said '7
classes reporting' with nothing explaining that they measure different
things. Tooltips now show sample/roster, and the dead newClasses and
endedClasses branches are gone."
```

---

## Task 10: Cập nhật tài liệu kiến trúc

`ARCHITECTURE.md` và `CLAUDE.md` mô tả hành vi cũ ở nhiều chỗ. Để nguyên thì người sau đọc tài liệu sẽ hiểu sai về chính đoạn code vừa sửa.

**Files:**
- Modify: `ARCHITECTURE.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: kết quả của toàn bộ Task 1-9.
- Produces: không có code.

- [ ] **Step 1: Đọc hai file và tìm mọi chỗ đã lỗi thời**

Run: `grep -n "coverage\|snapshot_stage\|Net Momentum\|netMomentum\|pass chuẩn\|passChuanRate\|độ phủ" ARCHITECTURE.md CLAUDE.md`

Đọc từng chỗ khớp và đối chiếu với hành vi mới.

- [ ] **Step 2: Ghi lại hai hạt của `student_daily_records` vào ARCHITECTURE.md**

Thêm mục mới vào phần schema, sao chép nội dung bảng ở §2.5 của spec (`docs/superpowers/specs/2026-08-12-lead-dashboard-data-fidelity-design.md`) — hai hạt, cột nào có nghĩa với hạt nào, và cảnh báo rằng mọi query aggregate phải lọc `snapshot_stage IS NULL`.

- [ ] **Step 3: Ghi lại quy tắc NULL vs 0**

Cùng mục đó, thêm: `attendance_pct`/`homework_pct` bằng `NULL` nghĩa là học viên chưa có buổi học nào (đã kiểm chứng: `NULL` ⟺ `attendance_total = 0`, không ngoại lệ trong 4.300 dòng); `0%` là số thật. Loại `NULL` khỏi mẫu số, giữ `0%`.

- [ ] **Step 4: Cập nhật CLAUDE.md**

Trong §"Business rules that are duplicated", thêm dòng về ba bộ lọc bắt buộc của Lead dashboard và về việc `contactCoverageByClass` ở backend cố ý không nhân bản luật `COVERED_BY` của frontend (kèm điều kiện khi nào phải nhân bản).

Trong §Domain glossary, xoá dòng `netMomentum` khỏi mô tả nếu nó nói card này đang hiển thị, hoặc sửa thành "còn trong contract, không còn hiển thị".

- [ ] **Step 5: Commit**

```bash
git add ARCHITECTURE.md CLAUDE.md
git commit -m "docs: record the two grains of student_daily_records

Document that migration 007 split the table into live rows and
test-stage rows, that every lead aggregate must filter snapshot_stage IS
NULL, and that NULL attendance means 'no session yet' while 0% is real."
```

---

## Self-Review

**Spec coverage**

| Mục spec | Task |
|---|---|
| §2.1 dòng stage làm phình mẫu số | Task 4 |
| §2.2 HV queuing làm trượt cổng coverage | Task 2 + Task 4 |
| §2.3 ngữ nghĩa NULL vs 0 | Task 2 Step 4, Task 10 Step 3 |
| §2.4 độ phủ liên hệ chưa nối dây | Task 6, Task 7 |
| §2.4 nhãn "HV có test" sai | Task 5 |
| §2.4 newClasses/endedClasses chết | Task 9 Step 7 |
| §2.5 hạt thật + partial unique index | Task 1, Task 10 Step 2 |
| §2.6 khoảng trống roster 36 HV | Task 3 Step 5-6, Task 9 Step 5 |
| §3.1 ba bộ lọc | Task 4 |
| §3.2 trung bình tầng học viên | Task 3 |
| §3.3 xoá cổng coverage | Task 2 |
| §3.4 mẫu số pass | Task 2 Step 5 |
| §3.5 contactCoverage ở backend | Task 6 |
| §3.6 thay đổi giao diện | Task 5, 7, 8, 9 |

Không có mục nào thiếu task.

**Type consistency**

- `ContactCoverage { done, total, pct }` — định nghĩa Task 6, dùng Task 6 Step 8 và Task 7 Step 3. Khớp `ContactCoverage` sẵn có ở `dashboard/src/data/selectors/contactLog.ts`.
- `activeStudentRoster: number | null` — thêm ở Task 3 Step 5 (`LeadWeeklyTrendPoint` backend), Task 7 Step 3 (`LeadTrendContractPoint` frontend), Task 9 Step 3 (`WeeklyTrendPoint`/`TrendChartRow`). Cùng tên, cùng kiểu ở cả bốn nơi.
- `resolveClassObservation(input, asOf)` — tham số thứ ba bị xoá ở Task 2 Step 6; không task nào sau đó truyền ba tham số.
- `ResolvedPassMetric.sampleSize` đổi nghĩa ở Task 2 Step 5, được Task 3 Step 3 dùng làm trọng số và Task 5 Step 5 hiển thị. Nhất quán.
- `formatReportingNote` / `formatTestNote` — định nghĩa Task 5 Step 3, dùng Task 5 Step 5.

# Lead Khối Dashboard — Kế hoạch triển khai Đợt 1

> **Dành cho người thực thi:** Dùng skill `superpowers:subagent-driven-development`
> (khuyến nghị) hoặc `superpowers:executing-plans` để làm từng task một. Các bước
> dùng cú pháp checkbox (`- [ ]`) để đánh dấu tiến độ.

**Tài liệu thiết kế:** `docs/design_docs/2026-07-31-lead-khoi-dashboard-design.md`
(các tham chiếu §x.y bên dưới trỏ vào tài liệu đó)

**Mục tiêu:** Lead khối chọn được kỳ báo cáo, thấy 6 chỉ số cấp khối kèm mức thay
đổi so với tháng trước, và đọc được biểu đồ diễn biến trên trục thời gian thật.

**Kiến trúc:** Thêm một tầng *selector* thuần hàm (`src/data/selectors/`) đứng giữa
dữ liệu thô và giao diện. Mọi phép tính tổng hợp — trung bình có trọng số, delta
tháng, dòng chảy nhãn — nằm ở tầng này và được kiểm thử độc lập. Component chỉ
nhận số đã tính và vẽ. Đây là thay đổi kiến trúc chính của đợt 1: hiện tại phép
tính đang nằm rải trong JSX của `LeadDashboard.tsx`, không kiểm chứng được.

**Công nghệ:** React 19 · TypeScript · Vite 8 · Tailwind v4 · recharts 3 ·
**vitest** (thêm mới ở Task 1)

---

## Global Constraints

Áp cho **mọi** task bên dưới.

- **Cổng kiểm tra bắt buộc:** `npx tsc -b` và `npm run lint` phải sạch trước mỗi
  commit. `tsconfig.app.json` bật `noUnusedLocals`, `noUnusedParameters`,
  `erasableSyntaxOnly` — một import thừa là gãy build.
- **`erasableSyntaxOnly`:** không dùng `enum`, không dùng parameter property
  (`constructor(private x)`), không dùng `namespace`. Dùng union type và object
  literal thay thế.
- **Chữ hiển thị bằng tiếng Việt, định danh trong mã bằng tiếng Anh.** Giữ nguyên
  quy ước này.
- **Màu:** component ghi thẳng mã hex kèm cặp `dark:`, không dùng token từ
  `@theme`. Bảng màu hiện có:

  | Vai trò | Light | Dark |
  |---|---|---|
  | Thương hiệu (đỏ IZONE) | `#DB0829` | `#DB0829` |
  | Nền trang | `#f3f4f6` | `#18181b` |
  | Mặt thẻ | `white` | `#27272a` |
  | Viền | `#f3f4f6` | `#3f3f46` |
  | Chữ chính | `#404040` | `#e4e4e7` |
  | Chữ mờ | `#404040/60` | `#a1a1aa` |

- **Bo góc dùng giá trị literal** (`rounded-[8px]`, `rounded-[12px]`,
  `rounded-[16px]`), không dùng thang Tailwind.
- **Giữ hướng "giảm nhiệt thị giác"**: mặt phẳng, viền 1px, tối thiểu đổ bóng,
  không gradient.
- **Không sửa `vite.config.ts: base`** (`/Izone-label-dashboard/`) — bỏ đi là ảnh
  404 trên GitHub Pages.
- **Không có `0` giả.** Khi một đại lượng chưa tính được, kiểu dữ liệu phải là
  `number | null` và giao diện hiện `—`, không hiện `0`. Đây là §7 của spec; vi
  phạm chỗ nào là dashboard nói dối chỗ đó.

### Bảng màu biểu đồ — đã kiểm định, dùng nguyên văn

Đã chạy validator của skill `dataviz` trên nền sáng `#fcfcfb` và nền tối
`#27272a`. Bộ dưới đây **đạt toàn bộ kiểm tra ở cả hai chế độ**:

| Biểu đồ | Chuỗi | Light | Dark |
|---|---|---|---|
| Vận hành | Tỷ lệ điểm danh | `#3b82f6` | `#3b82f6` |
| Vận hành | Tỷ lệ BTVN | `#f59e0b` | `#d97706` |
| Kết quả | Pass chuẩn | `#10b981` | `#059669` |
| Kết quả | Pass mềm | `#a855f7` | `#a855f7` |

Chỉ **màu thứ hai của mỗi cặp đổi bậc** khi sang dark; màu thứ nhất giữ nguyên.
Không tự ý đổi mã màu khác — các cặp khác đã thử đều fail (`#60a5fa` L=0.714 và
`#34d399` L=0.773 đều nằm ngoài dải độ sáng cho nền tối).

**Ràng buộc kèm theo, không được bỏ:** ở nền sáng, `#f59e0b` và `#10b981` có độ
tương phản dưới 3:1 so với mặt thẻ. Validator xếp đây là **WARN bắt buộc khắc
phục**, không phải cảnh báo có thể bỏ qua. Cách khắc phục đã chọn: **mỗi đường
phải có nhãn chữ trực tiếp ở đầu mút đường**. Nghĩa là danh tính chuỗi không bao
giờ chỉ dựa vào màu. Bỏ nhãn trực tiếp là vi phạm ràng buộc khả dụng.

---

## Cấu trúc file

**Tạo mới:**

| File | Trách nhiệm |
|---|---|
| `src/data/number.ts` | `round1`, `clamp` — dùng chung giữa bộ sinh mock và tầng selector |
| `src/data/selectors/periods.ts` | Kỳ báo cáo: liệt kê, đổi khoá, lấy ảnh chụp chốt kỳ |
| `src/data/selectors/aggregates.ts` | Tổng hợp cấp khối **có trọng số** |
| `src/data/selectors/deltas.ts` | Chênh lệch tháng trên tập lớp so sánh được |
| `src/data/selectors/labelFlow.ts` | Dòng chảy nhãn cấp khối kèm mẫu số |
| `src/data/selectors/index.ts` | Điểm export gộp |
| `src/components/dashboard/kpiFormat.ts` | Logic hiển thị thẻ KPI (thuần, kiểm thử được) |
| `src/components/dashboard/KpiCard.tsx` | Một thẻ KPI |
| `src/components/dashboard/KpiRow.tsx` | Hàng 6 thẻ |
| `src/components/dashboard/ContextBar.tsx` | Thanh ngữ cảnh + bộ chọn kỳ |
| `src/components/dashboard/TrendChart.tsx` | Biểu đồ diễn biến, trục thời gian thật |
| `src/hooks/useUrlParam.ts` | Đồng bộ một tham số với thanh địa chỉ |
| `vitest.config.ts` | Cấu hình test |

**Sửa:**

| File | Sửa gì |
|---|---|
| `src/data/types.ts` | Thêm `testsCompleted` vào `ClassSnapshot` |
| `src/data/generator/generate.ts` | Điền `testsCompleted` |
| `src/data/generator/rng.ts` | Chuyển `round1`/`clamp` sang `data/number.ts` |
| `src/data/mockData.ts` | Export lại tầng selector |
| `src/components/dashboard/LeadDashboard.tsx` | Nối thành phần mới, xoá mã cũ |
| `package.json` | Thêm `vitest` + script `test` |

**Ranh giới:** tầng selector **không được import gì từ `generator/`** ngoài
`data/number.ts`. Selector là mã chạy thật; generator là dữ liệu giả. Trộn vào
nhau thì sau này cắm dữ liệu thật sẽ kéo theo cả bộ sinh mock vào bundle.

---

## Task 1: Nền tảng kiểm thử và hai trường mới của `ClassSnapshot`

**Files:**
- Create: `vitest.config.ts`
- Create: `src/data/selectors/periods.test.ts` (chỉ để xác nhận bộ chạy test hoạt động; nội dung thật ở Task 2)
- Modify: `package.json`
- Modify: `src/data/types.ts`
- Modify: `src/data/generator/generate.ts`

**Interfaces:**
- Produces:
  - `ClassSnapshot.testsCompleted: number` — số bài test đã diễn ra tính tới ảnh
    chụp đó. Task 3 dùng nó để loại lớp chưa thi ra khỏi phép tính tỷ lệ pass.
  - `ClassSnapshot.droppedStudents: number` — số HV đã bỏ học tính tới ảnh chụp
    đó. Task 3 gộp lên cấp khối, Task 4 lấy hiệu hai kỳ để ra "số HV bỏ học thêm
    trong tháng".

**Giới hạn đã biết của dữ liệu mock:** bộ sinh hiện coi trạng thái bỏ học là tĩnh
(một HV bỏ học thì bỏ từ đầu), nên `droppedStudents` **không đổi theo tuần** và
delta tháng của thẻ `Bỏ học` sẽ luôn hiện "không đổi". Kiểu dữ liệu vẫn đúng cho
dữ liệu thật — chỉ mock chưa mô phỏng được thời điểm bỏ học. Không sửa bộ sinh
trong đợt này.

**Vì sao thêm bộ chạy test.** Dự án hiện không có framework test nào (xem
`CLAUDE.md`). Đợt 1 gần như toàn bộ là **phép tính số** — trung bình có trọng số,
hiệu hai kỳ, lọc tập lớp so sánh được. Sai ở đây thì dashboard hiện số sai một
cách im lặng, mà cả tài liệu thiết kế xoay quanh việc *không hiện số sai*. Chỉ
kiểm thử **hàm thuần**; component và hook dựa vào typecheck và chạy thử ứng dụng.

- [ ] **Bước 1: Cài vitest**

```bash
cd Izone-label-dashboard
npm install --save-dev vitest@^3
```

- [ ] **Bước 2: Tạo `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Bước 3: Thêm script `test` vào `package.json`**

Trong khối `"scripts"`, thêm dòng sau ngay dưới `"lint"`:

```json
"test": "vitest run",
```

- [ ] **Bước 4: Viết test tạm để xác nhận bộ chạy hoạt động**

Tạo `src/data/selectors/periods.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('bộ chạy test', () => {
  it('hoạt động', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Bước 5: Chạy test**

Chạy: `npm test`
Kỳ vọng: PASS, 1 test.

- [ ] **Bước 6: Viết test cho trường `testsCompleted`**

Thay toàn bộ nội dung `src/data/selectors/periods.test.ts` bằng:

```ts
import { describe, expect, it } from 'vitest';
import { MOCK_SNAPSHOTS } from '../mockData';

describe('ClassSnapshot.testsCompleted', () => {
  it('bắt đầu từ 0 và không bao giờ giảm theo tuần', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    expect(ic2174.length).toBeGreaterThan(0);
    expect(ic2174[0].testsCompleted).toBe(0);

    for (let i = 1; i < ic2174.length; i++) {
      expect(ic2174[i].testsCompleted).toBeGreaterThanOrEqual(ic2174[i - 1].testsCompleted);
    }
  });

  it('tăng đúng 1 ở tuần có mốc test', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    for (let i = 1; i < ic2174.length; i++) {
      const delta = ic2174[i].testsCompleted - ic2174[i - 1].testsCompleted;
      expect(delta).toBe(ic2174[i].testCheckpoint === null ? 0 : 1);
    }
  });

  it('lớp chưa thi bài nào thì mọi ảnh chụp đều bằng 0', () => {
    const ic2215 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2215');
    expect(ic2215.length).toBeGreaterThan(0);
    expect(ic2215.every((s) => s.testsCompleted === 0)).toBe(true);
  });
});

describe('ClassSnapshot.droppedStudents', () => {
  it('có mặt ở mọi ảnh chụp và không âm', () => {
    expect(MOCK_SNAPSHOTS.every((s) => s.droppedStudents >= 0)).toBe(true);
  });

  it('IC2174 có HV bỏ học (ca biên đã dàn dựng trong bộ sinh)', () => {
    const ic2174 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2174');
    expect(ic2174[0].droppedStudents).toBeGreaterThan(0);
  });
});
```

- [ ] **Bước 7: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — TypeScript báo `testsCompleted` và `droppedStudents` không tồn tại
trên `ClassSnapshot`.

- [ ] **Bước 8: Thêm hai trường vào kiểu dữ liệu**

Trong `src/data/types.ts`, bên trong `interface ClassSnapshot`, thêm ngay dưới
dòng `testCheckpoint: string | null;`:

```ts
  /**
   * Số bài test đã diễn ra tính tới ảnh chụp này.
   *
   * Bằng 0 nghĩa là lớp chưa thi bài nào — khi đó tỷ lệ pass KHÔNG có nghĩa và
   * phải bị loại khỏi mọi phép tổng hợp, thay vì tính là 0%.
   */
  testsCompleted: number;

  /**
   * Số HV đã bỏ học tính tới ảnh chụp này (luỹ kế).
   *
   * Hiệu giữa hai kỳ cho ra "số HV bỏ học thêm trong tháng" — con số Lead cần,
   * khác với tổng luỹ kế.
   */
  droppedStudents: number;
```

- [ ] **Bước 9: Điền giá trị trong bộ sinh**

Trong `src/data/generator/generate.ts`, hàm `buildSnapshots`, thêm ngay dưới dòng
khai báo `const active = students.filter(...)`:

```ts
  const dropped = students.filter((s) => s.registrationStatus === 'dropped').length;
```

Rồi bên trong lời gọi `snapshots.push({ ... })`, thêm ngay dưới dòng
`testCheckpoint: testJustHeld ? \`Test ${testsSoFar}\` : null,`:

```ts
      testsCompleted: testsSoFar,
      droppedStudents: dropped,
```

- [ ] **Bước 10: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, 5 test.

- [ ] **Bước 11: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add package.json package-lock.json vitest.config.ts src/data/types.ts src/data/generator/generate.ts src/data/selectors/periods.test.ts
git commit -m "test: thêm vitest và trường testsCompleted cho ClassSnapshot"
```

---

## Task 2: Kỳ báo cáo (`periods.ts`)

**Files:**
- Create: `src/data/selectors/periods.ts`
- Modify: `src/data/selectors/periods.test.ts`

**Interfaces:**
- Consumes: `ClassSnapshot` từ `../types`
- Produces:
  - `interface Period { key: string; label: string; startDate: string; endDate: string }`
  - `periodKeyOf(dateIso: string): string`
  - `periodLabel(key: string): string`
  - `previousPeriodKey(key: string): string`
  - `listPeriods(snapshots: ClassSnapshot[]): Period[]` — mới nhất trước
  - `latestSnapshotPerClass(snapshots: ClassSnapshot[], periodKey: string): ClassSnapshot[]`

`latestSnapshotPerClass` là hàm nền của cả đợt: nó trả về **ảnh chụp cuối cùng của
mỗi lớp trong kỳ**, tức trạng thái lớp tại thời điểm chốt kỳ. Task 3, 4 và 10 đều
gọi nó.

- [ ] **Bước 1: Viết test**

Thêm vào cuối `src/data/selectors/periods.test.ts`:

```ts
import {
  latestSnapshotPerClass,
  listPeriods,
  periodKeyOf,
  periodLabel,
  previousPeriodKey,
} from './periods';
import type { ClassSnapshot } from '../types';

function snap(classId: number, date: string, week: number, over: Partial<ClassSnapshot> = {}): ClassSnapshot {
  return {
    snapshotId: `${classId}-w${week}`,
    classId,
    className: `C${classId}`,
    snapshotDate: date,
    weekIndex: week,
    progressPct: week * 7,
    completedSessions: week * 2,
    totalSessions: 28,
    testCheckpoint: null,
    testsCompleted: 0,
    droppedStudents: 0,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
    ...over,
  };
}

describe('periodKeyOf / periodLabel / previousPeriodKey', () => {
  it('đổi ngày sang khoá kỳ', () => {
    expect(periodKeyOf('2026-07-15')).toBe('2026-07');
  });

  it('đọc khoá kỳ ra chữ tiếng Việt, không đệm số 0', () => {
    expect(periodLabel('2026-07')).toBe('Tháng 7/2026');
    expect(periodLabel('2026-12')).toBe('Tháng 12/2026');
  });

  it('lùi một tháng', () => {
    expect(previousPeriodKey('2026-07')).toBe('2026-06');
  });

  it('lùi qua mốc giao năm', () => {
    expect(previousPeriodKey('2026-01')).toBe('2025-12');
  });
});

describe('listPeriods', () => {
  it('trả về các kỳ không trùng, mới nhất trước', () => {
    const periods = listPeriods([
      snap(1, '2026-06-08', 1),
      snap(1, '2026-07-06', 5),
      snap(2, '2026-06-15', 2),
    ]);
    expect(periods.map((p) => p.key)).toEqual(['2026-07', '2026-06']);
  });

  it('tính đúng ngày cuối tháng', () => {
    const [july] = listPeriods([snap(1, '2026-07-06', 1)]);
    expect(july.startDate).toBe('2026-07-01');
    expect(july.endDate).toBe('2026-07-31');
  });

  it('tính đúng ngày cuối tháng 2 năm không nhuận', () => {
    const [feb] = listPeriods([snap(1, '2026-02-10', 1)]);
    expect(feb.endDate).toBe('2026-02-28');
  });
});

describe('latestSnapshotPerClass', () => {
  it('mỗi lớp trả về đúng ảnh chụp cuối cùng trong kỳ', () => {
    const result = latestSnapshotPerClass(
      [
        snap(1, '2026-07-06', 5),
        snap(1, '2026-07-27', 8),
        snap(2, '2026-07-13', 6),
        snap(1, '2026-06-29', 4),
      ],
      '2026-07',
    );
    expect(result).toHaveLength(2);
    expect(result.find((s) => s.classId === 1)?.snapshotDate).toBe('2026-07-27');
    expect(result.find((s) => s.classId === 2)?.snapshotDate).toBe('2026-07-13');
  });

  it('trả về mảng rỗng khi kỳ không có ảnh chụp nào', () => {
    expect(latestSnapshotPerClass([snap(1, '2026-07-06', 5)], '2026-05')).toEqual([]);
  });
});
```

- [ ] **Bước 2: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — không tìm thấy module `./periods`.

- [ ] **Bước 3: Viết cài đặt**

Tạo `src/data/selectors/periods.ts`:

```ts
import type { ClassSnapshot } from '../types';

/** Một kỳ báo cáo. Đơn vị là tháng dương lịch. */
export interface Period {
  /** Khoá sắp xếp được, ví dụ '2026-07'. Cũng là giá trị đặt trên URL. */
  key: string;
  /** Chữ hiển thị, ví dụ 'Tháng 7/2026'. */
  label: string;
  startDate: string;
  endDate: string;
}

export function periodKeyOf(dateIso: string): string {
  return dateIso.slice(0, 7);
}

export function periodLabel(key: string): string {
  const [year, month] = key.split('-');
  return `Tháng ${Number(month)}/${year}`;
}

export function previousPeriodKey(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return month === 1
    ? `${year - 1}-12`
    : `${year}-${String(month - 1).padStart(2, '0')}`;
}

export function listPeriods(snapshots: ClassSnapshot[]): Period[] {
  const keys = [...new Set(snapshots.map((s) => periodKeyOf(s.snapshotDate)))]
    .sort()
    .reverse();

  return keys.map((key) => {
    const [year, month] = key.split('-').map(Number);
    // Date.UTC(y, m, 0) = ngày cuối cùng của tháng m (vì tham số tháng là 0-based).
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return {
      key,
      label: periodLabel(key),
      startDate: `${key}-01`,
      endDate: `${key}-${String(lastDay).padStart(2, '0')}`,
    };
  });
}

/**
 * Ảnh chụp CUỐI CÙNG của mỗi lớp trong kỳ — tức trạng thái lớp tại thời điểm
 * chốt kỳ.
 *
 * Đây là hàm nền của toàn bộ tầng tổng hợp. Dùng ảnh chụp cuối kỳ thay vì trung
 * bình các tuần trong kỳ, vì câu hỏi của Lead là "cuối tháng 7 khối đang thế
 * nào", không phải "trung bình tháng 7 khối thế nào".
 */
export function latestSnapshotPerClass(
  snapshots: ClassSnapshot[],
  periodKey: string,
): ClassSnapshot[] {
  const byClass = new Map<number, ClassSnapshot>();

  for (const snapshot of snapshots) {
    if (periodKeyOf(snapshot.snapshotDate) !== periodKey) continue;
    const seen = byClass.get(snapshot.classId);
    if (!seen || snapshot.snapshotDate > seen.snapshotDate) {
      byClass.set(snapshot.classId, snapshot);
    }
  }

  return [...byClass.values()];
}
```

- [ ] **Bước 4: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, toàn bộ test.

- [ ] **Bước 5: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/data/selectors/periods.ts src/data/selectors/periods.test.ts
git commit -m "feat: thêm selector kỳ báo cáo"
```

---

## Task 3: Tổng hợp cấp khối có trọng số (`aggregates.ts`)

**Files:**
- Create: `src/data/number.ts`
- Create: `src/data/selectors/aggregates.ts`
- Create: `src/data/selectors/aggregates.test.ts`
- Modify: `src/data/generator/rng.ts`

**Interfaces:**
- Consumes: `ClassSnapshot`, `latestSnapshotPerClass` (Task 2)
- Produces:
  - `round1(value: number): number`, `clamp(value, min, max): number` từ `src/data/number.ts`
  - `interface KhoiAggregate` (xem code bên dưới)
  - `aggregateKhoi(snapshots: ClassSnapshot[]): KhoiAggregate`

Đây là task sửa lỗi đã nêu ở §6.2 của spec: `LeadDashboard.tsx:26-29` đang lấy
**trung bình của các trung bình**, nên lớp 8 học viên và lớp 23 học viên đóng góp
ngang nhau vào con số khối.

Điểm thứ hai, quan trọng không kém: **tỷ lệ pass chỉ được tổng hợp trên các lớp đã
có ít nhất một bài test.** Lớp mới khai giảng có `passChuanRate = 0` không phải vì
dạy kém mà vì chưa thi; gộp nó vào sẽ kéo tụt con số khối một cách sai lệch.

- [ ] **Bước 1: Viết test**

Tạo `src/data/selectors/aggregates.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { aggregateKhoi } from './aggregates';
import type { ClassSnapshot } from '../types';

function snap(over: Partial<ClassSnapshot>): ClassSnapshot {
  return {
    snapshotId: 's',
    classId: 1,
    className: 'C1',
    snapshotDate: '2026-07-27',
    weekIndex: 8,
    progressPct: 57,
    completedSessions: 16,
    totalSessions: 28,
    testCheckpoint: null,
    testsCompleted: 4,
    droppedStudents: 1,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
    ...over,
  };
}

describe('aggregateKhoi', () => {
  it('lấy trung bình CÓ TRỌNG SỐ theo sĩ số, không phải trung bình của trung bình', () => {
    // Lớp 20 HV ở 100%, lớp 5 HV ở 50%.
    // Có trọng số: (100*20 + 50*5) / 25 = 90.  Trung bình của TB: (100+50)/2 = 75.
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 20, attendanceAvg: 100 }),
      snap({ classId: 2, activeStudents: 5, attendanceAvg: 50 }),
    ]);
    expect(result.attendanceAvg).toBe(90);
  });

  it('tính riskPct từ số HV thực, không phải trung bình các tỷ lệ lớp', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 20, labelCounts: { yellow: 10, red: 6, grey: 4, noData: 0 } }),
      snap({ classId: 2, activeStudents: 5, labelCounts: { yellow: 5, red: 0, grey: 0, noData: 0 } }),
    ]);
    // (6+4+0+0) / 25 = 40%
    expect(result.riskPct).toBe(40);
  });

  it('LOẠI lớp chưa có bài test nào ra khỏi tỷ lệ pass', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, testsCompleted: 4, passChuanRate: 60 }),
      snap({ classId: 2, activeStudents: 10, testsCompleted: 0, passChuanRate: 0 }),
    ]);
    // Chỉ lớp 1 được tính → 60, không phải 30.
    expect(result.passChuanRate).toBe(60);
    expect(result.classesWithTests).toBe(1);
  });

  it('trả về null cho tỷ lệ pass khi CHƯA lớp nào thi', () => {
    const result = aggregateKhoi([snap({ testsCompleted: 0, passChuanRate: 0 })]);
    expect(result.passChuanRate).toBeNull();
    expect(result.passMemRate).toBeNull();
  });

  it('bỏ qua lớp không còn HV active', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, attendanceAvg: 80 }),
      snap({ classId: 2, activeStudents: 0, attendanceAvg: 0 }),
    ]);
    expect(result.attendanceAvg).toBe(80);
    expect(result.activeStudents).toBe(10);
  });

  it('cộng dồn số HV bỏ học của mọi lớp, kể cả lớp không còn HV active', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, droppedStudents: 2 }),
      snap({ classId: 2, activeStudents: 0, droppedStudents: 3 }),
    ]);
    expect(result.droppedStudents).toBe(5);
  });

  it('không chia cho 0 khi danh sách rỗng', () => {
    const result = aggregateKhoi([]);
    expect(result.activeStudents).toBe(0);
    expect(result.attendanceAvg).toBe(0);
    expect(result.droppedStudents).toBe(0);
    expect(result.passChuanRate).toBeNull();
  });
});
```

- [ ] **Bước 2: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — không tìm thấy module `./aggregates`.

- [ ] **Bước 3: Tách `round1`/`clamp` ra file dùng chung**

Tạo `src/data/number.ts`:

```ts
/** Tiện ích số dùng chung giữa bộ sinh dữ liệu mock và tầng selector. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const round1 = (value: number): number => Math.round(value * 10) / 10;
```

Trong `src/data/generator/rng.ts`, **xoá** hai dòng cuối file:

```ts
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const round1 = (value: number): number => Math.round(value * 10) / 10;
```

và thay bằng:

```ts
export { clamp, round1 } from '../number';
```

- [ ] **Bước 4: Viết cài đặt**

Tạo `src/data/selectors/aggregates.ts`:

```ts
import type { ClassSnapshot } from '../types';
import { round1 } from '../number';

export interface KhoiAggregate {
  /** Số lớp đưa vào phép tổng hợp (kể cả lớp chưa thi). */
  classCount: number;
  activeStudents: number;
  /** Luỹ kế toàn khối. Tính trên MỌI lớp, kể cả lớp không còn HV active. */
  droppedStudents: number;
  attendanceAvg: number;
  homeworkAvg: number;
  /** null khi chưa lớp nào có bài test — KHÔNG được thay bằng 0. */
  passChuanRate: number | null;
  passMemRate: number | null;
  riskPct: number;
  /** Mẫu số của hai tỷ lệ pass ở trên. Giao diện phải hiện con số này. */
  classesWithTests: number;
}

/**
 * Tổng hợp cấp khối từ các ảnh chụp lớp, **có trọng số theo sĩ số**.
 *
 * Trung bình của các trung bình (cách cũ trong LeadDashboard.tsx) khiến lớp 8 HV
 * và lớp 23 HV đóng góp ngang nhau. Ở đây mọi tỷ lệ đều nhân với sĩ số trước khi
 * cộng.
 *
 * Tỷ lệ pass chỉ tổng hợp trên lớp ĐÃ có bài test. Lớp mới khai giảng có
 * passChuanRate = 0 không phải vì dạy kém mà vì chưa thi; gộp vào là kéo tụt con
 * số khối một cách sai lệch (§7 của tài liệu thiết kế).
 */
export function aggregateKhoi(snapshots: ClassSnapshot[]): KhoiAggregate {
  const withStudents = snapshots.filter((s) => s.activeStudents > 0);
  const totalStudents = withStudents.reduce((sum, s) => sum + s.activeStudents, 0);

  const weighted = (pick: (s: ClassSnapshot) => number): number =>
    totalStudents === 0
      ? 0
      : withStudents.reduce((sum, s) => sum + pick(s) * s.activeStudents, 0) / totalStudents;

  const scored = withStudents.filter((s) => s.testsCompleted > 0);
  const scoredStudents = scored.reduce((sum, s) => sum + s.activeStudents, 0);

  const weightedScored = (pick: (s: ClassSnapshot) => number): number | null =>
    scoredStudents === 0
      ? null
      : round1(
          scored.reduce((sum, s) => sum + pick(s) * s.activeStudents, 0) / scoredStudents,
        );

  const atRisk = withStudents.reduce(
    (sum, s) => sum + s.labelCounts.grey + s.labelCounts.red,
    0,
  );

  return {
    classCount: snapshots.length,
    activeStudents: totalStudents,
    // Cố ý duyệt `snapshots` chứ không phải `withStudents`: một lớp có thể mất
    // hết HV active mà vẫn phải tính số đã bỏ học của nó.
    droppedStudents: snapshots.reduce((sum, s) => sum + s.droppedStudents, 0),
    attendanceAvg: round1(weighted((s) => s.attendanceAvg)),
    homeworkAvg: round1(weighted((s) => s.homeworkAvg)),
    passChuanRate: weightedScored((s) => s.passChuanRate),
    passMemRate: weightedScored((s) => s.passMemRate),
    riskPct: totalStudents === 0 ? 0 : round1((atRisk / totalStudents) * 100),
    classesWithTests: scored.length,
  };
}
```

- [ ] **Bước 5: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, toàn bộ test.

- [ ] **Bước 6: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/data/number.ts src/data/generator/rng.ts src/data/selectors/aggregates.ts src/data/selectors/aggregates.test.ts
git commit -m "feat: tổng hợp cấp khối có trọng số theo sĩ số"
```

---

## Task 4: Chênh lệch tháng (`deltas.ts`)

**Files:**
- Create: `src/data/selectors/deltas.ts`
- Create: `src/data/selectors/deltas.test.ts`

**Interfaces:**
- Consumes: `aggregateKhoi`, `KhoiAggregate` (Task 3); `ClassSnapshot`
- Produces:
  - `interface MetricDelta { value: number | null; comparableClasses: number; totalClasses: number }`
  - `metricDelta(current, previous, pick): MetricDelta`

Đây là §3.3 và §6.2 của spec. Delta **chỉ tính trên các lớp có mặt ở cả hai kỳ**.
Lớp vừa khai giảng và lớp vừa kết thúc bị loại khỏi phép trừ, nhưng vẫn tính vào
con số tuyệt đối. Không làm vậy thì delta đo *sự thay đổi thành phần lớp* chứ
không đo chất lượng.

- [ ] **Bước 1: Viết test**

Tạo `src/data/selectors/deltas.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { metricDelta } from './deltas';
import type { ClassSnapshot } from '../types';

function snap(classId: number, attendanceAvg: number, over: Partial<ClassSnapshot> = {}): ClassSnapshot {
  return {
    snapshotId: `s${classId}`,
    classId,
    className: `C${classId}`,
    snapshotDate: '2026-07-27',
    weekIndex: 8,
    progressPct: 57,
    completedSessions: 16,
    totalSessions: 28,
    testCheckpoint: null,
    testsCompleted: 4,
    droppedStudents: 0,
    attendanceAvg,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 10,
    ...over,
  };
}

describe('metricDelta', () => {
  it('tính hiệu khi cả hai kỳ có cùng tập lớp', () => {
    const result = metricDelta(
      [snap(1, 92), snap(2, 88)],
      [snap(1, 95), snap(2, 91)],
      (a) => a.attendanceAvg,
    );
    expect(result.value).toBe(-3);
    expect(result.comparableClasses).toBe(2);
    expect(result.totalClasses).toBe(2);
  });

  it('LOẠI lớp chỉ có ở kỳ hiện tại ra khỏi phép trừ', () => {
    // Lớp 2 mới khai giảng, điểm danh 100% — nếu tính vào sẽ đẩy delta lên sai.
    const result = metricDelta(
      [snap(1, 92), snap(2, 100)],
      [snap(1, 95)],
      (a) => a.attendanceAvg,
    );
    expect(result.value).toBe(-3);
    expect(result.comparableClasses).toBe(1);
    expect(result.totalClasses).toBe(2);
  });

  it('LOẠI lớp chỉ có ở kỳ trước ra khỏi phép trừ', () => {
    const result = metricDelta(
      [snap(1, 92)],
      [snap(1, 95), snap(3, 40)],
      (a) => a.attendanceAvg,
    );
    expect(result.value).toBe(-3);
    expect(result.comparableClasses).toBe(1);
  });

  it('trả về null khi không lớp nào có mặt ở cả hai kỳ', () => {
    const result = metricDelta([snap(1, 92)], [snap(9, 95)], (a) => a.attendanceAvg);
    expect(result.value).toBeNull();
    expect(result.comparableClasses).toBe(0);
    expect(result.totalClasses).toBe(1);
  });

  it('trả về null khi chỉ số ở một trong hai kỳ là null', () => {
    const result = metricDelta(
      [snap(1, 92, { testsCompleted: 4, passChuanRate: 50 })],
      [snap(1, 95, { testsCompleted: 0, passChuanRate: 0 })],
      (a) => a.passChuanRate,
    );
    expect(result.value).toBeNull();
    expect(result.comparableClasses).toBe(1);
  });
});
```

- [ ] **Bước 2: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — không tìm thấy module `./deltas`.

- [ ] **Bước 3: Viết cài đặt**

Tạo `src/data/selectors/deltas.ts`:

```ts
import type { ClassSnapshot } from '../types';
import { round1 } from '../number';
import { aggregateKhoi, type KhoiAggregate } from './aggregates';

export interface MetricDelta {
  /** null khi không so sánh được — giao diện hiện '—', không hiện 0. */
  value: number | null;
  /** Số lớp có mặt ở CẢ HAI kỳ. Giao diện phải hiện con số này. */
  comparableClasses: number;
  /** Tổng số lớp ở kỳ hiện tại. */
  totalClasses: number;
}

/**
 * Chênh lệch một chỉ số giữa kỳ hiện tại và kỳ trước, tính **chỉ trên các lớp có
 * mặt ở cả hai kỳ**.
 *
 * Lớp chỉ sống 3–4 tháng, nên giữa hai tháng liên tiếp tập hợp lớp trong khối đã
 * khác nhau. So thẳng hai kỳ sẽ đo sự thay đổi thành phần lớp chứ không đo chất
 * lượng: một lớp yếu kết thúc và một lớp mới khai giảng sẽ làm con số "cải thiện"
 * mà chẳng ai dạy tốt lên.
 */
export function metricDelta(
  current: ClassSnapshot[],
  previous: ClassSnapshot[],
  pick: (aggregate: KhoiAggregate) => number | null,
): MetricDelta {
  const previousIds = new Set(previous.map((s) => s.classId));
  const comparableCurrent = current.filter((s) => previousIds.has(s.classId));
  const comparableIds = new Set(comparableCurrent.map((s) => s.classId));
  const comparablePrevious = previous.filter((s) => comparableIds.has(s.classId));

  if (comparableCurrent.length === 0) {
    return { value: null, comparableClasses: 0, totalClasses: current.length };
  }

  const now = pick(aggregateKhoi(comparableCurrent));
  const before = pick(aggregateKhoi(comparablePrevious));

  return {
    value: now === null || before === null ? null : round1(now - before),
    comparableClasses: comparableCurrent.length,
    totalClasses: current.length,
  };
}
```

- [ ] **Bước 4: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, toàn bộ test.

- [ ] **Bước 5: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/data/selectors/deltas.ts src/data/selectors/deltas.test.ts
git commit -m "feat: chênh lệch tháng trên tập lớp so sánh được"
```

---

## Task 5: Dòng chảy nhãn cấp khối (`labelFlow.ts`)

**Files:**
- Create: `src/data/selectors/labelFlow.ts`
- Create: `src/data/selectors/labelFlow.test.ts`

**Interfaces:**
- Consumes: `LabelChangeLog`, `ClassSnapshot`; `periodKeyOf`, `previousPeriodKey`
  (Task 2); `MetricDelta` (Task 4)
- Produces:
  - `interface LabelFlowSummary { up; down; net; bySeverity; recalcEvents; classesWithTest }`
  - `labelFlowInPeriod(changes, snapshots, periodKey): LabelFlowSummary`
  - `labelFlowDelta(changes, snapshots, periodKey): MetricDelta`

Cung cấp số liệu cho thẻ KPI mới **`Chuyển dịch nhãn`** thay cho thẻ `Bảo lưu`
(§6.2). `recalcEvents` và `classesWithTest` là **mẫu số bắt buộc** — không có
chúng thì `net = 0` không phân biệt được "khối ổn định" với "chưa lớp nào thi"
(§3.3).

- [ ] **Bước 1: Viết test**

Tạo `src/data/selectors/labelFlow.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { labelFlowDelta, labelFlowInPeriod } from './labelFlow';
import type { ClassSnapshot, LabelChangeLog } from '../types';

function change(over: Partial<LabelChangeLog>): LabelChangeLog {
  return {
    logId: 'l1',
    studentId: 1,
    studentName: 'HV',
    classId: 1,
    className: 'C1',
    teacherId: 301,
    teacherName: 'GV',
    fromLabel: 'yellow',
    toLabel: 'red',
    direction: 'down',
    severity: 'warning',
    stepCount: 1,
    reason: '',
    checkpoint: 'Test 4',
    testAverageAfter: 55,
    attendancePct: 90,
    homeworkPct: 90,
    emailSent: true,
    createdAt: '2026-07-20 10:00:00',
    ...over,
  };
}

function snap(classId: number, date: string, checkpoint: string | null): ClassSnapshot {
  return {
    snapshotId: `${classId}-${date}`,
    classId,
    className: `C${classId}`,
    snapshotDate: date,
    weekIndex: 8,
    progressPct: 57,
    completedSessions: 16,
    totalSessions: 28,
    testCheckpoint: checkpoint,
    testsCompleted: checkpoint === null ? 3 : 4,
    droppedStudents: 0,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
  };
}

describe('labelFlowInPeriod', () => {
  it('đếm lên/xuống/ròng trong kỳ', () => {
    const result = labelFlowInPeriod(
      [
        change({ logId: 'a', direction: 'down', severity: 'warning' }),
        change({ logId: 'b', direction: 'down', severity: 'serious' }),
        change({ logId: 'c', direction: 'up', severity: 'recovery' }),
      ],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.down).toBe(2);
    expect(result.up).toBe(1);
    expect(result.net).toBe(-1);
  });

  it('bỏ qua chuyển dịch ngoài kỳ', () => {
    const result = labelFlowInPeriod(
      [change({ createdAt: '2026-06-20 10:00:00' })],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.up + result.down).toBe(0);
  });

  it('gom theo mức nghiêm trọng, mọi khoá đều có mặt kể cả bằng 0', () => {
    const result = labelFlowInPeriod(
      [change({ severity: 'critical', stepCount: 2, toLabel: 'grey' })],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.bySeverity).toEqual({ recovery: 0, warning: 0, serious: 0, critical: 1 });
  });

  it('đếm mẫu số: số lượt tính lại nhãn và số lớp có test', () => {
    const result = labelFlowInPeriod(
      [],
      [
        snap(1, '2026-07-06', 'Test 3'),
        snap(1, '2026-07-20', 'Test 4'),
        snap(2, '2026-07-13', 'Test 2'),
        snap(3, '2026-07-13', null),
      ],
      '2026-07',
    );
    expect(result.recalcEvents).toBe(3);
    expect(result.classesWithTest).toBe(2);
  });

  it('kỳ không có lượt tính lại nào thì mẫu số bằng 0 — đây KHÁC với khối ổn định', () => {
    const result = labelFlowInPeriod([], [snap(1, '2026-07-13', null)], '2026-07');
    expect(result.net).toBe(0);
    expect(result.recalcEvents).toBe(0);
  });
});

describe('labelFlowDelta', () => {
  const snapshots = [
    snap(1, '2026-06-15', 'Test 3'),
    snap(1, '2026-07-13', 'Test 4'),
    snap(2, '2026-07-13', 'Test 2'),
  ];

  it('so ròng của kỳ này với kỳ trước, chỉ trên lớp có test ở CẢ HAI kỳ', () => {
    const result = labelFlowDelta(
      [
        // Lớp 1, tháng 6: ròng −1
        change({ logId: 'a', classId: 1, direction: 'down', createdAt: '2026-06-15 10:00:00' }),
        // Lớp 1, tháng 7: ròng −3
        change({ logId: 'b', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        change({ logId: 'c', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        change({ logId: 'd', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        // Lớp 2 chỉ có test ở tháng 7 → bị loại khỏi phép trừ
        change({ logId: 'e', classId: 2, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
      ],
      snapshots,
      '2026-07',
    );
    expect(result.value).toBe(-2);
    expect(result.comparableClasses).toBe(1);
    expect(result.totalClasses).toBe(2);
  });

  it('trả về null khi không lớp nào có test ở cả hai kỳ', () => {
    const result = labelFlowDelta([], [snap(2, '2026-07-13', 'Test 2')], '2026-07');
    expect(result.value).toBeNull();
    expect(result.comparableClasses).toBe(0);
  });
});
```

- [ ] **Bước 2: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — không tìm thấy module `./labelFlow`.

- [ ] **Bước 3: Viết cài đặt**

Tạo `src/data/selectors/labelFlow.ts`:

```ts
import type { ClassSnapshot, LabelChangeLog } from '../types';
import type { MetricDelta } from './deltas';
import { periodKeyOf, previousPeriodKey } from './periods';

export interface LabelFlowSummary {
  up: number;
  down: number;
  /** up − down. Đây là chỉ số DẪN duy nhất trên dashboard. */
  net: number;
  bySeverity: Record<LabelChangeLog['severity'], number>;
  /** Số lượt tính lại nhãn trong kỳ (mỗi lớp × mỗi bài test = 1 lượt). */
  recalcEvents: number;
  /** Số lớp có ít nhất một bài test trong kỳ. */
  classesWithTest: number;
}

/**
 * Dòng chảy nhãn cấp khối trong một kỳ.
 *
 * `recalcEvents` và `classesWithTest` là MẪU SỐ BẮT BUỘC phải hiển thị cùng với
 * `net`. Nhãn chỉ được tính lại khi có bài test mới, nên một kỳ không có test sẽ
 * cho net = 0 — mà đó là "chưa có dữ liệu mới", không phải "khối ổn định". Thiếu
 * mẫu số thì hai tình huống đó hiện ra giống hệt nhau (§3.3).
 */
export function labelFlowInPeriod(
  changes: LabelChangeLog[],
  snapshots: ClassSnapshot[],
  periodKey: string,
): LabelFlowSummary {
  const inPeriod = changes.filter((c) => c.createdAt.slice(0, 7) === periodKey);

  const testSnapshots = snapshots.filter(
    (s) => s.testCheckpoint !== null && periodKeyOf(s.snapshotDate) === periodKey,
  );

  const bySeverity: Record<LabelChangeLog['severity'], number> = {
    recovery: 0,
    warning: 0,
    serious: 0,
    critical: 0,
  };
  for (const change of inPeriod) bySeverity[change.severity]++;

  const up = inPeriod.filter((c) => c.direction === 'up').length;
  const down = inPeriod.filter((c) => c.direction === 'down').length;

  return {
    up,
    down,
    net: up - down,
    bySeverity,
    recalcEvents: testSnapshots.length,
    classesWithTest: new Set(testSnapshots.map((s) => s.classId)).size,
  };
}

/**
 * Ròng chuyển nhãn kỳ này so với kỳ trước.
 *
 * Áp cùng một quy tắc lọc như `metricDelta`, nhưng đơn vị lọc là "lớp có ít nhất
 * một bài test trong kỳ" chứ không phải "lớp có mặt trong kỳ". Lớp không thi thì
 * không có lượt tính lại nhãn nào, nên đưa nó vào phép trừ chỉ làm loãng kết quả.
 */
export function labelFlowDelta(
  changes: LabelChangeLog[],
  snapshots: ClassSnapshot[],
  periodKey: string,
): MetricDelta {
  const classesWithTestIn = (key: string): Set<number> =>
    new Set(
      snapshots
        .filter((s) => s.testCheckpoint !== null && periodKeyOf(s.snapshotDate) === key)
        .map((s) => s.classId),
    );

  const now = classesWithTestIn(periodKey);
  const before = classesWithTestIn(previousPeriodKey(periodKey));
  const comparable = new Set([...now].filter((id) => before.has(id)));

  if (comparable.size === 0) {
    return { value: null, comparableClasses: 0, totalClasses: now.size };
  }

  const netIn = (key: string): number => {
    const inPeriod = changes.filter(
      (c) => c.createdAt.slice(0, 7) === key && comparable.has(c.classId),
    );
    return (
      inPeriod.filter((c) => c.direction === 'up').length -
      inPeriod.filter((c) => c.direction === 'down').length
    );
  };

  return {
    value: netIn(periodKey) - netIn(previousPeriodKey(periodKey)),
    comparableClasses: comparable.size,
    totalClasses: now.size,
  };
}
```

- [ ] **Bước 4: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, toàn bộ test.

- [ ] **Bước 5: Tạo điểm export gộp**

Tạo `src/data/selectors/index.ts`:

```ts
export { aggregateKhoi, type KhoiAggregate } from './aggregates';
export { metricDelta, type MetricDelta } from './deltas';
export { labelFlowDelta, labelFlowInPeriod, type LabelFlowSummary } from './labelFlow';
export {
  latestSnapshotPerClass,
  listPeriods,
  periodKeyOf,
  periodLabel,
  previousPeriodKey,
  type Period,
} from './periods';
```

- [ ] **Bước 6: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/data/selectors/labelFlow.ts src/data/selectors/labelFlow.test.ts src/data/selectors/index.ts
git commit -m "feat: dòng chảy nhãn cấp khối kèm mẫu số"
```

---

## Task 6: Logic hiển thị thẻ KPI (`kpiFormat.ts`)

**Files:**
- Create: `src/components/dashboard/kpiFormat.ts`
- Create: `src/components/dashboard/kpiFormat.test.ts`

**Interfaces:**
- Consumes: `MetricDelta` (Task 4)
- Produces:
  - `formatValue(value: number | null, unit: 'percent' | 'count'): string`
  - `type DeltaTone = 'up' | 'down' | 'flat' | 'unknown'`
  - `formatDelta(delta: MetricDelta, higherIsBetter: boolean): { text: string; tone: DeltaTone; isGood: boolean | null }`
  - `formatComparisonNote(delta: MetricDelta): string`

Tách logic này ra khỏi JSX để **kiểm thử được**. Component chỉ nhận chuỗi đã định
dạng và vẽ. Đây cũng là chỗ thực thi quy tắc "không có `0` giả".

Lưu ý về `higherIsBetter`: điểm danh tăng là tốt, nhưng số HV bỏ học tăng là xấu.
Mũi tên chỉ **hướng thay đổi**, còn màu chỉ **tốt hay xấu** — hai chuyện khác nhau.

- [ ] **Bước 1: Viết test**

Tạo `src/components/dashboard/kpiFormat.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatComparisonNote, formatDelta, formatValue } from './kpiFormat';
import type { MetricDelta } from '../../data/selectors';

const delta = (over: Partial<MetricDelta> = {}): MetricDelta => ({
  value: 0,
  comparableClasses: 12,
  totalClasses: 15,
  ...over,
});

describe('formatValue', () => {
  it('định dạng phần trăm một chữ số thập phân', () => {
    expect(formatValue(95.24, 'percent')).toBe('95.2%');
  });

  it('định dạng số đếm không thập phân', () => {
    expect(formatValue(4, 'count')).toBe('4');
  });

  it('hiện gạch ngang chứ KHÔNG hiện 0 khi chưa có dữ liệu', () => {
    expect(formatValue(null, 'percent')).toBe('—');
    expect(formatValue(null, 'count')).toBe('—');
  });
});

describe('formatDelta', () => {
  it('giảm ở chỉ số càng-cao-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: -2.1 }), true);
    expect(result.text).toBe('▼2.1 điểm');
    expect(result.tone).toBe('down');
    expect(result.isGood).toBe(false);
  });

  it('tăng ở chỉ số càng-cao-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: 3.4 }), true);
    expect(result.text).toBe('▲3.4 điểm');
    expect(result.isGood).toBe(true);
  });

  it('tăng ở chỉ số càng-thấp-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: 2 }), false);
    expect(result.tone).toBe('up');
    expect(result.isGood).toBe(false);
  });

  it('không đổi thì trung tính', () => {
    const result = formatDelta(delta({ value: 0 }), true);
    expect(result.text).toBe('không đổi');
    expect(result.tone).toBe('flat');
    expect(result.isGood).toBeNull();
  });

  it('không so sánh được thì nói rõ, không suy ra 0', () => {
    const result = formatDelta(delta({ value: null, comparableClasses: 0 }), true);
    expect(result.text).toBe('chưa so sánh được');
    expect(result.tone).toBe('unknown');
    expect(result.isGood).toBeNull();
  });
});

describe('formatComparisonNote', () => {
  it('nêu rõ mẫu số khi không phải mọi lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 12, totalClasses: 15 })))
      .toBe('so sánh trên 12/15 lớp');
  });

  it('nói gọn khi toàn bộ lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 15, totalClasses: 15 })))
      .toBe('so sánh trên toàn bộ 15 lớp');
  });

  it('nêu lý do khi không lớp nào so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 0, totalClasses: 15 })))
      .toBe('không lớp nào có mặt ở cả hai kỳ');
  });
});
```

- [ ] **Bước 2: Chạy test để xác nhận nó fail**

Chạy: `npm test`
Kỳ vọng: FAIL — không tìm thấy module `./kpiFormat`.

- [ ] **Bước 3: Viết cài đặt**

Tạo `src/components/dashboard/kpiFormat.ts`:

```ts
import type { MetricDelta } from '../../data/selectors';

export type DeltaTone = 'up' | 'down' | 'flat' | 'unknown';

export interface FormattedDelta {
  text: string;
  /** Hướng thay đổi — quyết định mũi tên. */
  tone: DeltaTone;
  /** Thay đổi này là tốt hay xấu — quyết định màu. null nghĩa là trung tính. */
  isGood: boolean | null;
}

/** Không bao giờ trả về '0' khi giá trị là null. Xem §7 của tài liệu thiết kế. */
export function formatValue(value: number | null, unit: 'percent' | 'count'): string {
  if (value === null) return '—';
  return unit === 'percent' ? `${value.toFixed(1)}%` : String(Math.round(value));
}

/**
 * Hướng và ý nghĩa của một thay đổi là HAI chuyện khác nhau.
 *
 * Điểm danh tăng là tốt; số HV bỏ học tăng là xấu. Mũi tên bám theo hướng
 * (`tone`), màu bám theo ý nghĩa (`isGood`).
 */
export function formatDelta(delta: MetricDelta, higherIsBetter: boolean): FormattedDelta {
  if (delta.value === null) {
    return { text: 'chưa so sánh được', tone: 'unknown', isGood: null };
  }
  if (delta.value === 0) {
    return { text: 'không đổi', tone: 'flat', isGood: null };
  }

  const rising = delta.value > 0;
  const magnitude = Math.abs(delta.value).toFixed(1);

  return {
    text: `${rising ? '▲' : '▼'}${magnitude} điểm`,
    tone: rising ? 'up' : 'down',
    isGood: rising === higherIsBetter,
  };
}

export function formatComparisonNote(delta: MetricDelta): string {
  if (delta.comparableClasses === 0) return 'không lớp nào có mặt ở cả hai kỳ';
  if (delta.comparableClasses === delta.totalClasses) {
    return `so sánh trên toàn bộ ${delta.totalClasses} lớp`;
  }
  return `so sánh trên ${delta.comparableClasses}/${delta.totalClasses} lớp`;
}
```

- [ ] **Bước 4: Chạy test để xác nhận nó pass**

Chạy: `npm test`
Kỳ vọng: PASS, toàn bộ test.

- [ ] **Bước 5: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/components/dashboard/kpiFormat.ts src/components/dashboard/kpiFormat.test.ts
git commit -m "feat: logic định dạng thẻ KPI"
```

---

## Task 7: Thẻ KPI (`KpiCard.tsx`, `KpiRow.tsx`)

**Files:**
- Create: `src/components/dashboard/KpiCard.tsx`
- Create: `src/components/dashboard/KpiRow.tsx`

**Interfaces:**
- Consumes: `formatValue`, `formatDelta`, `formatComparisonNote` (Task 6);
  `KhoiAggregate`, `MetricDelta`, `LabelFlowSummary` (Task 3–5)
- Produces:
  - `KpiCard` với props `{ icon, label, value, unit, delta, higherIsBetter, note?, sparkline? }`
  - `KpiRow` với props `{ aggregate, deltas, labelFlow, sparklines }`

Không có unit test — đây là JSX thuần vẽ lại số đã tính. Toàn bộ logic có thể sai
đã nằm ở Task 6 và đã được kiểm thử.

- [ ] **Bước 1: Viết `KpiCard.tsx`**

```tsx
import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { MetricDelta } from '../../data/selectors';
import { formatComparisonNote, formatDelta, formatValue } from './kpiFormat';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: 'percent' | 'count';
  delta: MetricDelta;
  /** true khi giá trị càng cao càng tốt (điểm danh); false khi ngược lại (bỏ học). */
  higherIsBetter: boolean;
  /** Chuỗi 13 tuần cho sparkline nền. `null` = chưa xác định, đường sẽ ngắt. */
  sparkline?: (number | null)[];
  /** Chú thích thay cho dòng mẫu số mặc định. */
  note?: string;
}

const TONE_CLASS: Record<string, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-[#DB0829] dark:text-red-400',
  neutral: 'text-[#404040]/50 dark:text-[#71717a]',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  unit,
  delta,
  higherIsBetter,
  sparkline,
  note,
}) => {
  const formatted = formatDelta(delta, higherIsBetter, unit);
  const toneClass =
    formatted.isGood === null
      ? TONE_CLASS.neutral
      : formatted.isGood
        ? TONE_CLASS.up
        : TONE_CLASS.down;

  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }));

  return (
    <div className="relative rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] overflow-hidden">
      {sparkData.length > 1 && (
        // `stroke` của recharts là thuộc tính SVG thô nên biến thể `dark:` không
        // gắn được. Đặt màu bằng class Tailwind trên thẻ bọc rồi để đường vẽ kế
        // thừa qua `currentColor` — hai chế độ sáng/tối cùng chạy, không phải
        // truyền thêm prop isDarkMode xuống. Đừng đổi lại thành mã hex cố định.
        <div className="absolute inset-x-0 bottom-0 h-10 opacity-[0.18] pointer-events-none text-[#475569] dark:text-[#a1a1aa]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="v" stroke="currentColor" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="relative flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
      </div>

      <div className="relative flex items-baseline gap-2">
        <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7]">
          {formatValue(value, unit)}
        </span>
        <span className={`text-xs font-semibold font-mono ${toneClass}`}>{formatted.text}</span>
      </div>

      <p className="relative text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
        {note ?? formatComparisonNote(delta)}
      </p>
    </div>
  );
};
```

- [ ] **Bước 2: Viết `KpiRow.tsx`**

```tsx
import React from 'react';
import { Award, BookOpen, CheckCircle2, TrendingDown, UserCheck, UserMinus } from 'lucide-react';
import type { KhoiAggregate, LabelFlowSummary, MetricDelta } from '../../data/selectors';
import { KpiCard } from './KpiCard';

export interface KpiDeltas {
  attendance: MetricDelta;
  homework: MetricDelta;
  passChuan: MetricDelta;
  passMem: MetricDelta;
  dropped: MetricDelta;
  labelNet: MetricDelta;
}

/** `null` = tuần đó chưa xác định; sparkline sẽ ngắt tại đó, không vẽ tụt về 0. */
export interface KpiSparklines {
  attendance: (number | null)[];
  homework: (number | null)[];
  passChuan: (number | null)[];
  passMem: (number | null)[];
}

interface KpiRowProps {
  aggregate: KhoiAggregate;
  deltas: KpiDeltas;
  labelFlow: LabelFlowSummary;
  sparklines: KpiSparklines;
}

export const KpiRow: React.FC<KpiRowProps> = ({
  aggregate,
  deltas,
  labelFlow,
  sparklines,
}) => {
  const passNote =
    aggregate.classesWithTests === 0
      ? 'chưa lớp nào có bài test'
      : `trên ${aggregate.classesWithTests}/${aggregate.classCount} lớp đã có test`;

  const flowNote =
    labelFlow.recalcEvents === 0
      ? 'chưa có lượt tính lại nhãn nào trong kỳ'
      : `${labelFlow.classesWithTest} lớp có test · ${labelFlow.recalcEvents} lượt tính lại`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard
        icon={<UserCheck className="w-4 h-4" />}
        label="Điểm danh (TB)"
        value={aggregate.attendanceAvg}
        unit="percent"
        delta={deltas.attendance}
        higherIsBetter
        sparkline={sparklines.attendance}
      />
      <KpiCard
        icon={<BookOpen className="w-4 h-4" />}
        label="Làm BTVN (TB)"
        value={aggregate.homeworkAvg}
        unit="percent"
        delta={deltas.homework}
        higherIsBetter
        sparkline={sparklines.homework}
      />
      <KpiCard
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Pass chuẩn"
        value={aggregate.passChuanRate}
        unit="percent"
        delta={deltas.passChuan}
        higherIsBetter
        sparkline={sparklines.passChuan}
        note={passNote}
      />
      <KpiCard
        icon={<Award className="w-4 h-4" />}
        label="Pass mềm"
        value={aggregate.passMemRate}
        unit="percent"
        delta={deltas.passMem}
        higherIsBetter
        sparkline={sparklines.passMem}
        note={passNote}
      />
      <KpiCard
        icon={<TrendingDown className="w-4 h-4" />}
        label="Chuyển dịch nhãn"
        value={labelFlow.net}
        unit="count"
        delta={deltas.labelNet}
        higherIsBetter
        note={flowNote}
      />
      <KpiCard
        icon={<UserMinus className="w-4 h-4" />}
        label="Bỏ học"
        value={aggregate.droppedStudents}
        unit="count"
        delta={deltas.dropped}
        higherIsBetter={false}
      />
    </div>
  );
};
```

- [ ] **Bước 3: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/components/dashboard/KpiCard.tsx src/components/dashboard/KpiRow.tsx
git commit -m "feat: thẻ KPI kèm delta tháng và sparkline"
```

---

## Task 8: Bộ chọn kỳ và thanh ngữ cảnh

**Files:**
- Create: `src/hooks/useUrlParam.ts`
- Create: `src/components/dashboard/ContextBar.tsx`

**Interfaces:**
- Consumes: `Period` (Task 2), `KhoiAggregate` (Task 3)
- Produces:
  - `useUrlParam(name: string, fallback: string): [string, (next: string) => void]`
  - `ContextBar` với props `{ periods, selectedKey, onSelectPeriod, aggregate, newClasses, endedClasses, noDataStudents, lastSyncedAt }`

Dòng thứ ba của thanh ngữ cảnh trả lời câu hỏi F của spec: nếu 30% học viên chưa
đủ dữ liệu thì con số pass trên thẻ KPI là sai lệch, và hiện tại Lead không hề
biết điều đó.

- [ ] **Bước 1: Viết `useUrlParam.ts`**

```ts
import { useCallback, useEffect, useState } from 'react';

/**
 * Giữ một tham số đồng bộ với thanh địa chỉ.
 *
 * Nhờ vậy copy URL gửi đi là người nhận thấy đúng kỳ báo cáo mày đang xem — đây
 * là thứ thay thế việc xuất file (§4.3). Dùng replaceState để đổi kỳ không sinh
 * mục mới trong lịch sử trình duyệt.
 */
export function useUrlParam(
  name: string,
  fallback: string,
): [string, (next: string) => void] {
  const [value, setValue] = useState<string>(
    () => new URLSearchParams(window.location.search).get(name) ?? fallback,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (value === fallback) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [name, value, fallback]);

  const update = useCallback((next: string) => setValue(next), []);

  return [value, update];
}
```

- [ ] **Bước 2: Viết `ContextBar.tsx`**

```tsx
import React from 'react';
import { CalendarRange, Database } from 'lucide-react';
import type { KhoiAggregate, Period } from '../../data/selectors';
import { periodLabel, previousPeriodKey } from '../../data/selectors';

interface ContextBarProps {
  periods: Period[];
  selectedKey: string;
  onSelectPeriod: (key: string) => void;
  aggregate: KhoiAggregate;
  newClasses: number;
  endedClasses: number;
  noDataStudents: number;
  lastSyncedAt: string;
}

export const ContextBar: React.FC<ContextBarProps> = ({
  periods,
  selectedKey,
  onSelectPeriod,
  aggregate,
  newClasses,
  endedClasses,
  noDataStudents,
  lastSyncedAt,
}) => {
  const noDataPct =
    aggregate.activeStudents === 0
      ? 0
      : Math.round((noDataStudents / aggregate.activeStudents) * 100);

  return (
    <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] px-5 py-4 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-[#db0829]" />
          <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
            Kỳ báo cáo
          </span>
        </div>
        <select
          value={selectedKey}
          onChange={(e) => onSelectPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] outline-none focus:ring-1 focus:ring-[#DB0829] transition-colors"
        >
          {periods.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
          so với {periodLabel(previousPeriodKey(selectedKey))}
        </span>
      </div>

      <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] font-mono">
        Khối 3-4 · {aggregate.classCount} lớp đang chạy · {aggregate.activeStudents} HV active
        {newClasses > 0 && ` · ${newClasses} lớp mới khai giảng`}
        {endedClasses > 0 && ` · ${endedClasses} lớp vừa kết thúc`}
      </p>

      <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] flex items-center gap-1.5">
        <Database className="w-3 h-3" />
        Đồng bộ lần cuối {lastSyncedAt}
        {noDataStudents > 0 && (
          <span className="text-amber-600 dark:text-amber-400">
            · {noDataStudents} HV chưa đủ dữ liệu ({noDataPct}%)
          </span>
        )}
      </p>
    </div>
  );
};
```

- [ ] **Bước 3: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test
git add src/hooks/useUrlParam.ts src/components/dashboard/ContextBar.tsx
git commit -m "feat: thanh ngữ cảnh và bộ chọn kỳ đồng bộ URL"
```

---

## Task 9: Biểu đồ diễn biến trên trục thời gian thật

**Files:**
- Create: `src/components/dashboard/TrendChart.tsx`

**Interfaces:**
- Consumes: không có (đứng độc lập với `ClassSnapshot`)
- Produces:
  - `interface TrendPoint { date: string; testCheckpoint: string | null; attendanceAvg: number | null; homeworkAvg: number | null; passChuanRate: number | null; passMemRate: number | null }`
  - `interface TrendSeries { key: 'attendanceAvg' | 'homeworkAvg' | 'passChuanRate' | 'passMemRate'; name: string; lightColor: string; darkColor: string }`
  - `TrendChart` với props `{ title; subtitle; points; series; domain; isDarkMode }`

**Vì sao có kiểu `TrendPoint` riêng thay vì dùng thẳng `ClassSnapshot`.**
`ClassSnapshot.passChuanRate` là `number`, không nhận `null`. Nhưng ở cấp khối,
một tuần mà chưa lớp nào thi thì tỷ lệ pass **không xác định** — ép nó thành `0`
sẽ vẽ đường tụt thẳng xuống đáy, trông như thảm hoạ trong khi thực ra là chưa có
dữ liệu. Đó đúng là loại nói dối mà Global Constraints cấm.

`TrendPoint` cho phép `null`, và recharts **ngắt đường** ở chỗ null thay vì nối
qua — đúng nghĩa "không biết". Đây cũng là lý do `connectNulls` phải để mặc định
(false); bật lên là quay lại nói dối theo kiểu khác.

Đây là task sửa lỗi gốc mà Lead tự phát hiện — trục X trộn `Tuần` với `Test`.

**Ba việc phải làm đúng:**

1. **Trục X là ngày thật** (`snapshotDate`), dùng thang `number` với timestamp để
   khoảng cách giữa các điểm tỷ lệ đúng với thời gian trôi qua. Dùng thang
   `category` là quay lại đúng lỗi cũ.
2. **Mốc test vẽ bằng `ReferenceLine` dọc**, không phải một tick của trục.
3. **Mỗi đường phải có nhãn chữ ở đầu mút.** Đây là ràng buộc khả dụng bắt buộc,
   không phải trang trí — xem phần bảng màu trong Global Constraints.

- [ ] **Bước 1: Viết `TrendChart.tsx`**

```tsx
import React from 'react';
import {
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
export type TrendMetric = 'attendanceAvg' | 'homeworkAvg' | 'passChuanRate' | 'passMemRate';

/**
 * Một điểm trên trục thời gian.
 *
 * Giá trị `null` nghĩa là CHƯA XÁC ĐỊNH, không phải bằng 0 — recharts sẽ ngắt
 * đường ở đó. Không bật `connectNulls`.
 */
export interface TrendPoint {
  /** Ngày dạng ISO 'YYYY-MM-DD'. */
  date: string;
  testCheckpoint: string | null;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passChuanRate: number | null;
  passMemRate: number | null;
}

export interface TrendSeries {
  key: TrendMetric;
  name: string;
  lightColor: string;
  darkColor: string;
}

interface TrendChartProps {
  title: string;
  subtitle: string;
  /** Chuỗi điểm theo thời gian. Sẽ được sắp theo ngày. */
  points: TrendPoint[];
  series: TrendSeries[];
  /** Thu hẹp trục Y để biến động nhỏ nhìn thấy được. */
  domain: [number, number];
  isDarkMode: boolean;
}

const DAY_MS = 86_400_000;

function formatTick(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  title,
  subtitle,
  points,
  series,
  domain,
  isDarkMode,
}) => {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));

  /*
   * Nhãn trực tiếp được nhét sẵn vào dữ liệu dưới khoá `<key>__label`.
   *
   * Đây không phải mẹo cho gọn: prop `formatter` của LabelList trong recharts 3
   * chỉ nhận một tham số (`LabelFormatter`), không nhận chỉ số phần tử, nên
   * không có cách nào từ trong formatter biết đang ở điểm nào. Đã kiểm chứng
   * bằng tsc: bản dùng formatter 3 tham số KHÔNG compile.
   *
   * Nhãn đặt ở điểm CUỐI CÙNG CÓ GIÁ TRỊ của từng chuỗi, không phải điểm cuối
   * của mảng — chuỗi kết thúc bằng null thì đường đã ngắt trước đó, đặt nhãn ở
   * cuối mảng sẽ thành nhãn treo lơ lửng không dính đường nào.
   */
  const lastValueIndex = new Map<TrendMetric, number>();
  for (const item of series) {
    let index = -1;
    sorted.forEach((point, i) => {
      if (point[item.key] !== null) index = i;
    });
    lastValueIndex.set(item.key, index);
  }

  const data = sorted.map((point, index) => {
    const row: Record<string, number | string | null> = {
      t: Date.parse(`${point.date}T00:00:00Z`),
      attendanceAvg: point.attendanceAvg,
      homeworkAvg: point.homeworkAvg,
      passChuanRate: point.passChuanRate,
      passMemRate: point.passMemRate,
    };
    for (const item of series) {
      row[`${item.key}__label`] = index === lastValueIndex.get(item.key) ? item.name : '';
    }
    return row;
  });

  // Mốc test là SỰ KIỆN — vẽ thành vạch dọc chú thích, không phải một ô trên trục.
  const testMarkers = sorted
    .filter((point) => point.testCheckpoint !== null)
    .map((point) => ({
      t: Date.parse(`${point.date}T00:00:00Z`),
      label: point.testCheckpoint as string,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] p-5">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">{title}</h3>
        <p className="text-xs text-[#404040]/50 dark:text-[#71717a] mt-6 text-center">
          Chưa có dữ liệu cho kỳ này.
        </p>
      </div>
    );
  }

  const axisColor = isDarkMode ? '#71717a' : '#9ca3af';

  return (
    <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] flex flex-col">
      <div className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] border-l-4 border-l-[#db0829] px-5 py-4 rounded-t-[16px]">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">{title}</h3>
        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-1">{subtitle}</p>
      </div>

      <div className="h-64 w-full p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 64, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3f3f46' : '#e5e7eb'} opacity={0.6} vertical={false} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={['dataMin - ' + DAY_MS, 'dataMax + ' + DAY_MS]}
              tickFormatter={formatTick}
              stroke={axisColor}
              fontSize={11}
              tickMargin={10}
            />
            <YAxis stroke={axisColor} fontSize={11} domain={domain} width={40} />
            <Tooltip
              labelFormatter={(t) => new Date(Number(t)).toISOString().slice(0, 10)}
              contentStyle={{
                background: isDarkMode ? '#27272a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#3f3f46' : '#f3f4f6'}`,
                borderRadius: '12px',
                fontSize: '12px',
                color: isDarkMode ? '#e4e4e7' : '#404040',
              }}
            />

            {testMarkers.map((marker) => (
              <ReferenceLine
                key={marker.t}
                x={marker.t}
                stroke={axisColor}
                strokeDasharray="4 4"
              >
                <Label value={marker.label} position="top" fontSize={10} fill={axisColor} />
              </ReferenceLine>
            ))}

            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={isDarkMode ? s.darkColor : s.lightColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              >
                {/* Nhãn trực tiếp ở đầu mút — ràng buộc khả dụng, không được bỏ. */}
                <LabelList
                  dataKey={`${s.key}__label`}
                  position="right"
                  fontSize={10}
                  fill={isDarkMode ? s.darkColor : s.lightColor}
                />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

- [ ] **Bước 2: Cổng kiểm tra**

```bash
npx tsc -b && npm run lint
```

Kỳ vọng: sạch. Cách dùng `LabelList` ở trên đã được kiểm chứng compile với
recharts 3 trước khi viết plan này. Nếu vẫn gặp lỗi kiểu, **không** dùng `any` để
bịt — `oxlint` sẽ chặn.

- [ ] **Bước 3: Commit**

```bash
git add src/components/dashboard/TrendChart.tsx
git commit -m "feat: biểu đồ diễn biến trên trục thời gian thật, mốc test thành vạch dọc"
```

---

## Task 10: Nối vào `LeadDashboard` và xoá mã cũ

**Files:**
- Modify: `src/components/dashboard/LeadDashboard.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: toàn bộ Task 2–9
- Produces: `LeadDashboard` nhận thêm prop `isDarkMode: boolean`

**Xoá dứt điểm:**
- `timelineData` ghi cứng (`LeadDashboard.tsx:41-48`) — trục trộn Tuần/Test
- Bốn biến `avg*` tính bằng trung bình của trung bình (dòng 26–29)
- Khối 6 thẻ KPI cũ (dòng 95–168)
- Khối `Layer 2: Timeline Tracking Chart` cũ (dòng 171–210)
- Biến state `timelineFilter` và `<select>` gắn với nó

**Giữ nguyên trong đợt này:** Master Table (Layer 3) và stacked bar (Layer 4).
Chúng được thay ở đợt 2, không đụng tới bây giờ.

- [ ] **Bước 1: Thêm phần tính toán vào đầu `LeadDashboard`**

Thay toàn bộ khối từ `const [searchClass, setSearchClass] = useState('');` tới hết
mảng `timelineData` bằng:

```tsx
  const [searchClass, setSearchClass] = useState('');

  const periods = useMemo(() => listPeriods(MOCK_SNAPSHOTS), []);
  const defaultPeriod = periods[0]?.key ?? periodKeyOf(REFERENCE_DATE);
  const [selectedPeriod, setSelectedPeriod] = useUrlParam('ky', defaultPeriod);

  const view = useMemo(() => {
    const currentSnaps = latestSnapshotPerClass(MOCK_SNAPSHOTS, selectedPeriod);
    const previousSnaps = latestSnapshotPerClass(
      MOCK_SNAPSHOTS,
      previousPeriodKey(selectedPeriod),
    );

    const aggregate = aggregateKhoi(currentSnaps);
    const labelFlow = labelFlowInPeriod(MOCK_LABEL_CHANGES, MOCK_SNAPSHOTS, selectedPeriod);

    const currentIds = new Set(currentSnaps.map((s) => s.classId));
    const previousIds = new Set(previousSnaps.map((s) => s.classId));

    const deltas: KpiDeltas = {
      attendance: metricDelta(currentSnaps, previousSnaps, (a) => a.attendanceAvg),
      homework: metricDelta(currentSnaps, previousSnaps, (a) => a.homeworkAvg),
      passChuan: metricDelta(currentSnaps, previousSnaps, (a) => a.passChuanRate),
      passMem: metricDelta(currentSnaps, previousSnaps, (a) => a.passMemRate),
      dropped: metricDelta(currentSnaps, previousSnaps, (a) => a.droppedStudents),
      labelNet: labelFlowDelta(MOCK_LABEL_CHANGES, MOCK_SNAPSHOTS, selectedPeriod),
    };

    /*
     * Chuỗi cấp khối: mỗi tuần một điểm, gộp có trọng số qua toàn bộ lớp của
     * tuần đó. Tỷ lệ pass giữ nguyên `null` khi tuần đó chưa lớp nào thi — KHÔNG
     * ép về 0, xem chú thích của TrendPoint.
     */
    const weeks = [...new Set(MOCK_SNAPSHOTS.map((s) => s.snapshotDate))].sort();
    const khoiSeries: TrendPoint[] = weeks.map((date) => {
      const ofWeek = MOCK_SNAPSHOTS.filter((s) => s.snapshotDate === date);
      const agg = aggregateKhoi(ofWeek);

      /*
       * Nhãn vạch mốc ở cấp khối là SỐ LỚP THI trong tuần, không phải số hiệu
       * bài test.
       *
       * Mốc test neo theo vòng đời từng lớp, không theo lịch: hai lớp khai
       * giảng cách nhau ba tháng cùng thi "Test 4" ở hai thời điểm hoàn toàn
       * khác nhau, và ngược lại cùng một tuần có lớp đang ở Test 1 còn lớp
       * khác đã ở Test 6. Lấy số hiệu của một lớp bất kỳ rồi gán cho cả khối
       * là sai. Cái có nghĩa trên trục lịch là bao nhiêu lớp vừa có dữ liệu
       * mới — đúng bằng mẫu số mà §3.3 của tài liệu thiết kế đòi hỏi.
       */
      const classesWithTest = new Set(
        ofWeek.filter((s) => s.testCheckpoint !== null).map((s) => s.classId),
      );

      return {
        date,
        testCheckpoint: classesWithTest.size > 0 ? `${classesWithTest.size} lớp thi` : null,
        attendanceAvg: agg.attendanceAvg,
        homeworkAvg: agg.homeworkAvg,
        passChuanRate: agg.passChuanRate,
        passMemRate: agg.passMemRate,
      };
    });

    const recent = khoiSeries.slice(-13);
    const sparklines: KpiSparklines = {
      attendance: recent.map((p) => p.attendanceAvg),
      homework: recent.map((p) => p.homeworkAvg),
      passChuan: recent.map((p) => p.passChuanRate),
      passMem: recent.map((p) => p.passMemRate),
    };

    // Phải tính từ currentSnaps, KHÔNG từ prop `classes`: `classes` luôn phản
    // ánh thời điểm hiện tại, còn mẫu số (aggregate.activeStudents) lại theo
    // kỳ đang chọn. Trộn hai gốc thời gian làm tỷ lệ "chưa đủ dữ liệu" tự nhảy
    // khi đổi kỳ mà dữ liệu không hề đổi — và đó lại đúng là dòng trả lời câu
    // "số này có tin được không".
    const noDataStudents = currentSnaps.reduce((sum, s) => sum + s.labelCounts.noData, 0);

    return {
      aggregate,
      labelFlow,
      deltas,
      sparklines,
      trendSeries: recent,
      noDataStudents,
      newClasses: [...currentIds].filter((id) => !previousIds.has(id)).length,
      endedClasses: [...previousIds].filter((id) => !currentIds.has(id)).length,
    };
  }, [selectedPeriod]);
```

- [ ] **Bước 2: Thêm import**

Ở đầu file, thay dòng import từ `mockData` và thêm các import mới:

```tsx
import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight, BarChart3, Search, Table2
} from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';
import {
  MOCK_LABEL_CHANGES,
  MOCK_SNAPSHOTS,
  REFERENCE_DATE,
} from '../../data/mockData';
import {
  aggregateKhoi,
  labelFlowDelta,
  labelFlowInPeriod,
  latestSnapshotPerClass,
  listPeriods,
  metricDelta,
  periodKeyOf,
  previousPeriodKey,
} from '../../data/selectors';
import { useUrlParam } from '../../hooks/useUrlParam';
import { ContextBar } from './ContextBar';
import { KpiRow, type KpiDeltas, type KpiSparklines } from './KpiRow';
import { TrendChart, type TrendPoint, type TrendSeries } from './TrendChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
```

Xoá khỏi danh sách import của `lucide-react` các biểu tượng không còn dùng
(`Award`, `CheckCircle2`, `Clock`, `BookOpen`, `UserMinus`, `UserCheck`,
`TrendingUp`) — chúng đã chuyển sang `KpiRow.tsx`, để lại sẽ gãy `noUnusedLocals`.
Tương tự xoá `LineChart`, `Line`, `CartesianGrid` khỏi import recharts.

- [ ] **Bước 3: Khai báo hai bộ chuỗi cho hai biểu đồ**

Đặt ngay trên khai báo component:

```tsx
/** Hai nhóm chỉ số KHÁC THANG ĐO → hai biểu đồ riêng (§3.2 của tài liệu thiết kế). */
const OPERATIONS_SERIES: TrendSeries[] = [
  { key: 'attendanceAvg', name: 'Điểm danh', lightColor: '#3b82f6', darkColor: '#3b82f6' },
  { key: 'homeworkAvg', name: 'BTVN', lightColor: '#f59e0b', darkColor: '#d97706' },
];

const OUTCOME_SERIES: TrendSeries[] = [
  { key: 'passChuanRate', name: 'Pass chuẩn', lightColor: '#10b981', darkColor: '#059669' },
  { key: 'passMemRate', name: 'Pass mềm', lightColor: '#a855f7', darkColor: '#a855f7' },
];
```

- [ ] **Bước 4: Thay phần JSX**

Thay khối tiêu đề + 6 thẻ KPI cũ + Layer 2 bằng:

```tsx
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight flex flex-wrap items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#475569] dark:text-[#a1a1aa]" /> Lead Khối Dashboard — Quản lý Rủi ro Toàn Khối 3-4
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#DB0829]/10 text-[#DB0829] font-mono border border-[#DB0829]/20">
            Macro View
          </span>
        </h2>
        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-0.5">
          Giám sát chất lượng giảng dạy, tỷ lệ chuyển dịch nhãn và cảnh báo sớm các lớp sa sút.
        </p>
      </div>

      <ContextBar
        periods={periods}
        selectedKey={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        aggregate={view.aggregate}
        newClasses={view.newClasses}
        endedClasses={view.endedClasses}
        noDataStudents={view.noDataStudents}
        lastSyncedAt={REFERENCE_DATE}
      />

      <KpiRow
        aggregate={view.aggregate}
        deltas={view.deltas}
        labelFlow={view.labelFlow}
        sparklines={view.sparklines}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart
          title="Chất lượng vận hành"
          subtitle="Tỷ lệ điểm danh và BTVN toàn khối. Vạch dọc là mốc bài test."
          points={view.trendSeries}
          series={OPERATIONS_SERIES}
          domain={[70, 100]}
          isDarkMode={isDarkMode}
        />
        <TrendChart
          title="Kết quả"
          subtitle="Tỷ lệ pass chuẩn và pass mềm toàn khối, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi."
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          domain={[0, 80]}
          isDarkMode={isDarkMode}
        />
      </div>
```

- [ ] **Bước 5: Thêm prop `isDarkMode`**

Trong `LeadDashboardProps`, thêm:

```tsx
  isDarkMode: boolean;
```

và nhận nó trong tham số destructure của component. Trong `src/App.tsx`, tìm chỗ
render `<LeadDashboard ... />` và thêm `isDarkMode={isDarkMode}`.

- [ ] **Bước 6: Chạy ứng dụng và kiểm tra bằng mắt**

```bash
npm run dev
```

Mở trình duyệt và xác nhận từng điểm:

- [ ] Bộ chọn kỳ liệt kê các tháng có dữ liệu, mới nhất trước.
- [ ] Đổi kỳ thì thanh địa chỉ đổi theo (`?ky=2026-06`); tải lại trang giữ đúng kỳ đó.
- [ ] Sáu thẻ KPI hiện giá trị + delta + chú thích mẫu số.
- [ ] Thẻ `Pass chuẩn` ghi rõ `trên N/M lớp đã có test`.
- [ ] Thẻ `Chuyển dịch nhãn` hiện số ròng và mẫu số lượt tính lại.
- [ ] **Trục X của cả hai biểu đồ là ngày, không còn chữ `Tuần`/`Test`.**
- [ ] Mốc test hiện thành vạch đứt dọc có nhãn `Test 1`, `Test 2`...
- [ ] Mỗi đường có nhãn chữ ở đầu mút bên phải.
- [ ] Bật chế độ tối: màu đường đổi bậc, chữ và lưới vẫn đọc được.
- [ ] Chọn một kỳ chưa có dữ liệu (nếu có): biểu đồ hiện chữ *"Chưa có dữ liệu cho kỳ này"*, không hiện khung rỗng.

- [ ] **Bước 7: Cổng kiểm tra và commit**

```bash
npx tsc -b && npm run lint && npm test && npm run build
git add src/components/dashboard/LeadDashboard.tsx src/App.tsx
git commit -m "feat: nối tầng selector vào Lead Dashboard, xoá timeline ghi cứng"
```

---

## Ngoài phạm vi đợt 1

Ghi ra để không ai lấn sang:

- Bảng xếp hạng lớp, dải cảnh báo → **đợt 2**
- Dòng chảy nhãn dạng thanh phân kỳ, Việc cần giao → **đợt 3**
- So sánh GV, vòng đời lớp, phân tán, chế độ Trình bày → **đợt 4**
- Master Table và stacked bar hiện tại **giữ nguyên**, thay ở đợt 2
- `MOCK_HISTORICAL_CLASSES` và `MOCK_HISTORICAL_SNAPSHOTS` **chưa dùng** ở đợt này

## Việc song song, không nằm trong plan này

Hai hạng mục hạ tầng ở §8.1 và §8.2 của tài liệu thiết kế cần **khởi động ngay**,
song song với đợt 1. Chúng cần thời gian tích luỹ dữ liệu chứ không cần thời gian
lập trình: bắt đầu ghi snapshot từ tháng 8/2026 thì cuối tháng 10 mới đủ một cửa
sổ 3 tháng.

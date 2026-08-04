/**
 * Điểm vào duy nhất cho dữ liệu mock của dashboard.
 *
 * File này cố tình mỏng: mọi thứ do `generator/` sinh ra từ kịch bản trong
 * `generator/classPlan.ts`. Muốn đổi quy mô, thêm lớp, hay dựng thêm một
 * tình huống biên thì sửa ở đó, không sửa ở đây.
 *
 * HỢP ĐỒNG SCHEMA vẫn giữ nguyên. Các interface đã chuyển sang `./types` và
 * được export lại từ đây, nên mọi `import type { ... } from '.../mockData'`
 * cũ tiếp tục chạy. Ba tên export dữ liệu cũ (`MOCK_CLASSES`,
 * `MOCK_STUDENTS_IC2174`, `MOCK_PENDING_REVIEWS`) cũng giữ nguyên.
 *
 * Quy mô: 15 lớp đang chạy + 20 lớp đã kết thúc (nền lịch sử), ~270 học viên
 * đang học. Dữ liệu cá nhân giả hoàn toàn — xem chú thích đầu
 * `generator/names.ts` để biết vì sao điều đó là bắt buộc với bản deploy lên
 * GitHub Pages.
 */

import {
  ACTIVE_CLASSES,
  HISTORICAL_CLASSES,
  SYSTEM_CONFIG,
  TEACHERS,
  buildPendingReviews,
  labelFromAverage,
} from './generator/generate';
import { REFERENCE_DATE } from './generator/classPlan';
import { currentCheckpoint, openEpisodes } from './selectors/contactLog';
import type {
  ClassSnapshot,
  ClassSummary,
  ContactLog,
  LabelChangeLog,
  PendingReviewEnriched,
  StudentDetail,
  Teacher,
} from './types';

export type {
  ClassSnapshot,
  ClassSummary,
  ContactChannel,
  ContactLog,
  ContactTrigger,
  LabelChangeLog,
  LabelCode,
  PendingReviewEnriched,
  StudentDetail,
  SystemConfig,
  Teacher,
  TestScore,
} from './types';

export { SYSTEM_CONFIG, labelFromAverage, REFERENCE_DATE };

/* ------------------------------------------------------------------ *
 * Lớp
 * ------------------------------------------------------------------ */

/** 15 lớp đang chạy tại {@link REFERENCE_DATE}. */
export const MOCK_CLASSES: ClassSummary[] = ACTIVE_CLASSES.map((c) => c.summary);

/**
 * 20 lớp đã kết thúc trong 12 tháng gần nhất.
 *
 * Không hiển thị trong bảng quản lý lớp — chúng tồn tại để làm nền so sánh:
 * đường cong trọn vòng đời của chúng là thứ duy nhất trả lời được câu "ở mốc
 * 60% khóa học thì bao nhiêu phần trăm xám+đỏ mới là bình thường".
 */
export const MOCK_HISTORICAL_CLASSES: ClassSummary[] = HISTORICAL_CLASSES.map((c) => c.summary);

export const MOCK_TEACHERS: Teacher[] = TEACHERS;

/* ------------------------------------------------------------------ *
 * Học viên
 * ------------------------------------------------------------------ */

export const MOCK_STUDENTS_BY_CLASS: Record<number, StudentDetail[]> = Object.fromEntries(
  ACTIVE_CLASSES.map((c) => [c.plan.classId, c.students]),
);

export const MOCK_STUDENTS: StudentDetail[] = ACTIVE_CLASSES.flatMap((c) => c.students);

export function getStudentsByClass(classId: number): StudentDetail[] {
  return MOCK_STUDENTS_BY_CLASS[classId] ?? [];
}

/** Giữ lại cho các component đang import tên cũ. */
export const MOCK_STUDENTS_IC2174: StudentDetail[] = getStudentsByClass(MOCK_CLASSES[0].classId);

/* ------------------------------------------------------------------ *
 * Snapshot theo tuần
 * ------------------------------------------------------------------ */

/** Ảnh chụp hằng tuần của các lớp đang chạy. */
export const MOCK_SNAPSHOTS: ClassSnapshot[] = ACTIVE_CLASSES.flatMap((c) => c.snapshots);

/** Ảnh chụp trọn vòng đời của các lớp đã kết thúc. */
export const MOCK_HISTORICAL_SNAPSHOTS: ClassSnapshot[] = HISTORICAL_CLASSES.flatMap(
  (c) => c.snapshots,
);

export function getSnapshotsByClass(classId: number): ClassSnapshot[] {
  return [...MOCK_SNAPSHOTS, ...MOCK_HISTORICAL_SNAPSHOTS].filter((s) => s.classId === classId);
}

/* ------------------------------------------------------------------ *
 * Chuyển nhãn & xét duyệt
 * ------------------------------------------------------------------ */

export const MOCK_LABEL_CHANGES: LabelChangeLog[] = ACTIVE_CLASSES.flatMap((c) => c.labelChanges);

export const MOCK_HISTORICAL_LABEL_CHANGES: LabelChangeLog[] = HISTORICAL_CLASSES.flatMap(
  (c) => c.labelChanges,
);

export const MOCK_PENDING_REVIEWS: PendingReviewEnriched[] = buildPendingReviews();

/* ------------------------------------------------------------------ *
 * Nhật ký liên hệ
 * ------------------------------------------------------------------ */

/**
 * Nền có sẵn cho nhật ký liên hệ, sinh TẤT ĐỊNH (không `Math.random`) để hai
 * lần tải trang cho ra cùng một con số độ phủ.
 *
 * Cố ý ghi một phần log vào checkpoint TRƯỚC mốc hiện tại: đó là cách duy nhất
 * để nhìn thấy ngay hành vi quan trọng nhất của mô hình này — tick cũ không
 * còn hiệu lực sau khi lớp thi bài mới, nên cảnh báo tự nổi lại.
 */
export const MOCK_CONTACT_LOGS: ContactLog[] = ACTIVE_CLASSES.flatMap((c) => {
  const checkpoint = currentCheckpoint(c.students);
  const previous = previousCheckpoint(checkpoint);

  return openEpisodes(c.students).flatMap((ep, idx) => {
    // 1 trong 3 episode chưa ai đụng tới — để bảng của Lead không hiện 100%
    // ở mọi lớp, vì một dashboard lúc nào cũng xanh thì không ai nhìn.
    if (idx % 3 === 2) return [];

    // Cứ 4 log thì 1 log rơi vào mốc cũ → episode đó hiện ra là CHƯA liên hệ.
    const atPrevious = idx % 4 === 1 && previous !== null;
    const student = c.students.find((s) => s.studentId === ep.studentId);

    return [
      {
        contactId: `CT${c.plan.classId}-${ep.studentId}-${ep.trigger}`,
        studentId: ep.studentId,
        classId: c.plan.classId,
        teacherId: c.summary.teacher.teacherId,
        channel: 'zalo' as const,
        trigger: ep.trigger,
        checkpoint: atPrevious ? (previous as string) : checkpoint,
        note: '',
        createdAt: student?.updatedAt ?? REFERENCE_DATE,
      },
    ];
  });
});

/**
 * Mốc test liền trước, suy từ tên (`'Test 3'` → `'Test 2'`).
 *
 * Chỉ dùng để dựng dữ liệu mock. Bản thật đọc thẳng lịch sử checkpoint từ
 * `09_Weekly_Snapshot`, không đoán từ chuỗi.
 */
function previousCheckpoint(checkpoint: string): string | null {
  const match = /^Test (\d+)$/.exec(checkpoint);
  if (!match) return null;

  const order = Number(match[1]);
  return order > 1 ? `Test ${order - 1}` : null;
}

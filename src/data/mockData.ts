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
import type {
  ClassSnapshot,
  ClassSummary,
  LabelChangeLog,
  PendingReviewEnriched,
  StudentDetail,
  Teacher,
} from './types';

export type {
  ClassSnapshot,
  ClassSummary,
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

import type { MetricDelta } from '../../data/selectors';

export type DeltaTone = 'up' | 'down' | 'flat' | 'unknown';

/**
 * Đơn vị của một thẻ KPI.
 *
 * `count` đếm CON NGƯỜI (HV), `event` đếm SỰ KIỆN (lượt). Phân biệt này không
 * phải chuyện chữ nghĩa: bảng đổi nhãn ghi mỗi lần đổi là một dòng, nên một HV
 * đổi nhãn hai lần trong kỳ sinh hai dòng. Gọi con số đó là "HV" là báo cáo 23
 * học viên trong khi thực tế chỉ có 22 người.
 */
export type KpiUnit = 'percent' | 'count' | 'event';

export function passTooltipCopy() {
  return {
    standard: 'Chỉ cần TB test ≥60.',
    soft: [
      'Nhóm 1: TB test 50–<55, Điểm danh và BTVN = 100% (cần GV duyệt)',
      'Nhóm 2: TB test 55–<60, Điểm danh và BTVN ≥90% (cần GV duyệt)',
    ],
  };
}

export interface FormattedDelta {
  text: string;
  /** Hướng thay đổi — quyết định màu. */
  tone: DeltaTone;
  /** Thay đổi này là tốt hay xấu — quyết định màu. null nghĩa là trung tính. */
  isGood: boolean | null;
}

/** Không bao giờ trả về '0' khi giá trị là null. Xem §7 của tài liệu thiết kế. */
export function formatValue(value: number | null, unit: KpiUnit): string {
  if (value === null) return '—';
  return unit === 'percent' ? `${value.toFixed(1)}%` : String(Math.round(value));
}

/**
 * Hướng và ý nghĩa của một thay đổi là HAI chuyện khác nhau.
 *
 * Điểm danh tăng là tốt; số HV bỏ học tăng là xấu. Hướng (`tone`) và màu
 * bám theo ý nghĩa (`isGood`).
 *
 * Unit phải được truyền vào vì không thể suy ra từ delta: cùng một thay đổi
 * có thể là thay đổi phần trăm (đơn vị `%`), thay đổi số HV (đơn vị `HV`)
 * hay thay đổi số lượt (đơn vị `lượt`). Card Bỏ học đếm người nên dùng
 * `unit: 'count'`; card Chuyển dịch nhãn đếm lần đổi nhãn nên dùng
 * `unit: 'event'`; card Điểm danh và BTVN dùng `unit: 'percent'`.
 */
export function formatDelta(delta: MetricDelta, higherIsBetter: boolean, unit: KpiUnit): FormattedDelta {
  if (delta.value === null) {
    return { text: 'chưa so sánh được', tone: 'unknown', isGood: null };
  }
  if (delta.value === 0) {
    return { text: 'không đổi', tone: 'flat', isGood: null };
  }

  const rising = delta.value > 0;
  const magnitude = unit === 'percent'
    ? Math.abs(delta.value).toFixed(1)
    : String(Math.round(Math.abs(delta.value)));
  const formattedMagnitude =
    unit === 'percent'
      ? `${magnitude}%`
      : `${magnitude} ${unit === 'event' ? 'lượt' : 'HV'}`;

  return {
    text: `${rising ? 'Tăng' : 'Giảm'} ${formattedMagnitude}`,
    tone: rising ? 'up' : 'down',
    isGood: rising === higherIsBetter,
  };
}

export function formatAttritionNote(input: {
  rate: number | null;
  newDroppedStudents: number;
}): string {
  return input.rate === null
    ? 'Tỷ lệ attrition: chưa đủ dữ liệu'
    : `Tỷ lệ attrition: ${input.rate.toFixed(1)}%`;
}

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

export interface PassNoteInput extends TestNoteInput {
  qualifiedStudents: number;
}

export function formatPassNote({
  qualifiedStudents,
  sampleSize,
  classesWithTests,
  totalClasses,
}: PassNoteInput): string {
  if (classesWithTests === 0) return 'chưa lớp nào có bài test';
  return `${qualifiedStudents}/${sampleSize} HV đã thi · ${classesWithTests}/${totalClasses} lớp có test`;
}

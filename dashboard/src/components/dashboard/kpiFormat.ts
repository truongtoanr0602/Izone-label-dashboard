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

export interface FormattedDelta {
  text: string;
  /** Hướng thay đổi — quyết định mũi tên. */
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
 * Điểm danh tăng là tốt; số HV bỏ học tăng là xấu. Mũi tên bám theo hướng
 * (`tone`), màu bám theo ý nghĩa (`isGood`).
 *
 * Unit phải được truyền vào vì không thể suy ra từ delta: cùng một thay đổi
 * có thể là thay đổi phần trăm (đơn vị `điểm`), thay đổi số HV (đơn vị `HV`)
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
  const suffix = unit === 'percent' ? 'điểm' : unit === 'event' ? 'lượt' : 'HV';

  return {
    text: `${rising ? '▲' : '▼'}${magnitude} ${suffix}`,
    tone: rising ? 'up' : 'down',
    isGood: rising === higherIsBetter,
  };
}

/**
 * Mẫu số của DELTA, không phải của giá trị.
 *
 * Câu chữ phải tự đứng một mình được: thẻ KPI hiện đồng thời hai dòng mẫu số —
 * một cho giá trị (prop `note`) và một cho delta — nên nếu dòng này chỉ ghi
 * "12/15 lớp" thì người đọc không biết con số nào đang được chia cho mẫu số nào.
 * Vì thế mở đầu bằng chữ "thay đổi".
 */
export function formatComparisonNote(delta: MetricDelta): string {
  if (delta.comparableClasses === 0) {
    return 'thay đổi: không có lớp nào so sánh được giữa hai kỳ';
  }
  if (delta.comparableClasses === delta.totalClasses) {
    return `thay đổi tính trên toàn bộ ${delta.totalClasses} lớp so sánh được`;
  }
  return `thay đổi tính trên ${delta.comparableClasses}/${delta.totalClasses} lớp so sánh được`;
}

export function formatAttritionNote(input: {
  rate: number | null;
  newDroppedStudents: number;
}): string {
  return input.rate === null
    ? 'Tỷ lệ attrition: chưa đủ dữ liệu'
    : `Tỷ lệ attrition: ${input.rate.toFixed(1)}%`;
}

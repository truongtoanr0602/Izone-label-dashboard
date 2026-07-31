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
 *
 * Unit phải được truyền vào vì không thể suy ra từ delta: cùng một thay đổi
 * có thể là thay đổi phần trăm (đơn vị `điểm`) hay thay đổi số HV (đơn vị `HV`).
 * Card Bỏ học và Chuyển dịch nhãn dùng `unit: 'count'` để hiển thị HV,
 * còn card Điểm danh và Vắng học dùng `unit: 'percent'` để hiển thị điểm.
 */
export function formatDelta(delta: MetricDelta, higherIsBetter: boolean, unit: 'percent' | 'count'): FormattedDelta {
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
  const suffix = unit === 'percent' ? 'điểm' : 'HV';

  return {
    text: `${rising ? '▲' : '▼'}${magnitude} ${suffix}`,
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

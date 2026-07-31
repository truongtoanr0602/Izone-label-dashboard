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

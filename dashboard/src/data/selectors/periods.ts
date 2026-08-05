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

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

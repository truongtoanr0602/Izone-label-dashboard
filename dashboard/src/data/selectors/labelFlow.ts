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

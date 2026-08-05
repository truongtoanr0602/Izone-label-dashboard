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

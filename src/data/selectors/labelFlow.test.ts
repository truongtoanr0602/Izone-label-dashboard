import { describe, expect, it } from 'vitest';
import { labelFlowDelta, labelFlowInPeriod } from './labelFlow';
import type { ClassSnapshot, LabelChangeLog } from '../types';

function change(over: Partial<LabelChangeLog>): LabelChangeLog {
  return {
    logId: 'l1',
    studentId: 1,
    studentName: 'HV',
    classId: 1,
    className: 'C1',
    teacherId: 301,
    teacherName: 'GV',
    fromLabel: 'yellow',
    toLabel: 'red',
    direction: 'down',
    severity: 'warning',
    stepCount: 1,
    reason: '',
    checkpoint: 'Test 4',
    testAverageAfter: 55,
    attendancePct: 90,
    homeworkPct: 90,
    emailSent: true,
    createdAt: '2026-07-20 10:00:00',
    ...over,
  };
}

function snap(classId: number, date: string, checkpoint: string | null): ClassSnapshot {
  return {
    snapshotId: `${classId}-${date}`,
    classId,
    className: `C${classId}`,
    snapshotDate: date,
    weekIndex: 8,
    progressPct: 57,
    completedSessions: 16,
    totalSessions: 28,
    testCheckpoint: checkpoint,
    testsCompleted: checkpoint === null ? 3 : 4,
    droppedStudents: 0,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
  };
}

describe('labelFlowInPeriod', () => {
  it('đếm lên/xuống/ròng trong kỳ', () => {
    const result = labelFlowInPeriod(
      [
        change({ logId: 'a', direction: 'down', severity: 'warning' }),
        change({ logId: 'b', direction: 'down', severity: 'serious' }),
        change({ logId: 'c', direction: 'up', severity: 'recovery' }),
      ],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.down).toBe(2);
    expect(result.up).toBe(1);
    expect(result.net).toBe(-1);
  });

  it('bỏ qua chuyển dịch ngoài kỳ', () => {
    const result = labelFlowInPeriod(
      [change({ createdAt: '2026-06-20 10:00:00' })],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.up + result.down).toBe(0);
  });

  it('gom theo mức nghiêm trọng, mọi khoá đều có mặt kể cả bằng 0', () => {
    const result = labelFlowInPeriod(
      [change({ severity: 'critical', stepCount: 2, toLabel: 'grey' })],
      [snap(1, '2026-07-20', 'Test 4')],
      '2026-07',
    );
    expect(result.bySeverity).toEqual({ recovery: 0, warning: 0, serious: 0, critical: 1 });
  });

  it('đếm mẫu số: số lượt tính lại nhãn và số lớp có test', () => {
    const result = labelFlowInPeriod(
      [],
      [
        snap(1, '2026-07-06', 'Test 3'),
        snap(1, '2026-07-20', 'Test 4'),
        snap(2, '2026-07-13', 'Test 2'),
        snap(3, '2026-07-13', null),
      ],
      '2026-07',
    );
    expect(result.recalcEvents).toBe(3);
    expect(result.classesWithTest).toBe(2);
  });

  it('kỳ không có lượt tính lại nào thì mẫu số bằng 0 — đây KHÁC với khối ổn định', () => {
    const result = labelFlowInPeriod([], [snap(1, '2026-07-13', null)], '2026-07');
    expect(result.net).toBe(0);
    expect(result.recalcEvents).toBe(0);
  });
});

describe('labelFlowDelta', () => {
  const snapshots = [
    snap(1, '2026-06-15', 'Test 3'),
    snap(1, '2026-07-13', 'Test 4'),
    snap(2, '2026-07-13', 'Test 2'),
  ];

  it('so ròng của kỳ này với kỳ trước, chỉ trên lớp có test ở CẢ HAI kỳ', () => {
    const result = labelFlowDelta(
      [
        // Lớp 1, tháng 6: ròng −1
        change({ logId: 'a', classId: 1, direction: 'down', createdAt: '2026-06-15 10:00:00' }),
        // Lớp 1, tháng 7: ròng −3
        change({ logId: 'b', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        change({ logId: 'c', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        change({ logId: 'd', classId: 1, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
        // Lớp 2 chỉ có test ở tháng 7 → bị loại khỏi phép trừ
        change({ logId: 'e', classId: 2, direction: 'down', createdAt: '2026-07-13 10:00:00' }),
      ],
      snapshots,
      '2026-07',
    );
    expect(result.value).toBe(-2);
    expect(result.comparableClasses).toBe(1);
    expect(result.totalClasses).toBe(2);
  });

  it('trả về null khi không lớp nào có test ở cả hai kỳ', () => {
    const result = labelFlowDelta([], [snap(2, '2026-07-13', 'Test 2')], '2026-07');
    expect(result.value).toBeNull();
    expect(result.comparableClasses).toBe(0);
  });
});

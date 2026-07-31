import { describe, expect, it } from 'vitest';
import { MOCK_SNAPSHOTS } from '../mockData';

describe('ClassSnapshot.testsCompleted', () => {
  it('bắt đầu từ 0 và không bao giờ giảm theo tuần', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    expect(ic2174.length).toBeGreaterThan(0);
    expect(ic2174[0].testsCompleted).toBe(0);

    for (let i = 1; i < ic2174.length; i++) {
      expect(ic2174[i].testsCompleted).toBeGreaterThanOrEqual(ic2174[i - 1].testsCompleted);
    }
  });

  it('tăng đúng 1 ở tuần có mốc test', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    for (let i = 1; i < ic2174.length; i++) {
      const delta = ic2174[i].testsCompleted - ic2174[i - 1].testsCompleted;
      expect(delta).toBe(ic2174[i].testCheckpoint === null ? 0 : 1);
    }
  });

  it('lớp chưa thi bài nào thì mọi ảnh chụp đều bằng 0', () => {
    const ic2215 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2215');
    expect(ic2215.length).toBeGreaterThan(0);
    expect(ic2215.every((s) => s.testsCompleted === 0)).toBe(true);
  });
});

describe('ClassSnapshot.droppedStudents', () => {
  it('có mặt ở mọi ảnh chụp và không âm', () => {
    expect(MOCK_SNAPSHOTS.every((s) => s.droppedStudents >= 0)).toBe(true);
  });

  it('IC2174 có HV bỏ học (ca biên đã dàn dựng trong bộ sinh)', () => {
    const ic2174 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2174');
    expect(ic2174[0].droppedStudents).toBeGreaterThan(0);
  });
});

import {
  latestSnapshotPerClass,
  listPeriods,
  periodKeyOf,
  periodLabel,
  previousPeriodKey,
} from './periods';
import type { ClassSnapshot } from '../types';

function snap(classId: number, date: string, week: number, over: Partial<ClassSnapshot> = {}): ClassSnapshot {
  return {
    snapshotId: `${classId}-w${week}`,
    classId,
    className: `C${classId}`,
    snapshotDate: date,
    weekIndex: week,
    progressPct: week * 7,
    completedSessions: week * 2,
    totalSessions: 28,
    testCheckpoint: null,
    testsCompleted: 0,
    droppedStudents: 0,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
    ...over,
  };
}

describe('periodKeyOf / periodLabel / previousPeriodKey', () => {
  it('đổi ngày sang khoá kỳ', () => {
    expect(periodKeyOf('2026-07-15')).toBe('2026-07');
  });

  it('đọc khoá kỳ ra chữ tiếng Việt, không đệm số 0', () => {
    expect(periodLabel('2026-07')).toBe('Tháng 7/2026');
    expect(periodLabel('2026-12')).toBe('Tháng 12/2026');
  });

  it('lùi một tháng', () => {
    expect(previousPeriodKey('2026-07')).toBe('2026-06');
  });

  it('lùi qua mốc giao năm', () => {
    expect(previousPeriodKey('2026-01')).toBe('2025-12');
  });
});

describe('listPeriods', () => {
  it('trả về các kỳ không trùng, mới nhất trước', () => {
    const periods = listPeriods([
      snap(1, '2026-06-08', 1),
      snap(1, '2026-07-06', 5),
      snap(2, '2026-06-15', 2),
    ]);
    expect(periods.map((p) => p.key)).toEqual(['2026-07', '2026-06']);
  });

  it('tính đúng ngày cuối tháng', () => {
    const [july] = listPeriods([snap(1, '2026-07-06', 1)]);
    expect(july.startDate).toBe('2026-07-01');
    expect(july.endDate).toBe('2026-07-31');
  });

  it('tính đúng ngày cuối tháng 2 năm không nhuận', () => {
    const [feb] = listPeriods([snap(1, '2026-02-10', 1)]);
    expect(feb.endDate).toBe('2026-02-28');
  });
});

describe('latestSnapshotPerClass', () => {
  it('mỗi lớp trả về đúng ảnh chụp cuối cùng trong kỳ', () => {
    const result = latestSnapshotPerClass(
      [
        snap(1, '2026-07-06', 5),
        snap(1, '2026-07-27', 8),
        snap(2, '2026-07-13', 6),
        snap(1, '2026-06-29', 4),
      ],
      '2026-07',
    );
    expect(result).toHaveLength(2);
    expect(result.find((s) => s.classId === 1)?.snapshotDate).toBe('2026-07-27');
    expect(result.find((s) => s.classId === 2)?.snapshotDate).toBe('2026-07-13');
  });

  it('trả về mảng rỗng khi kỳ không có ảnh chụp nào', () => {
    expect(latestSnapshotPerClass([snap(1, '2026-07-06', 5)], '2026-05')).toEqual([]);
  });
});

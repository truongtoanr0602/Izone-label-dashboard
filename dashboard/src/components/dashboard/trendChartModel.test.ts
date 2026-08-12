import { describe, expect, it } from 'vitest';
import { toTrendChartRows, type WeeklyTrendPoint } from './trendChartModel';

const point = (over: Partial<WeeklyTrendPoint> = {}): WeeklyTrendPoint => ({
  weekStart: '2026-05-11',
  weekEnd: '2026-05-17',
  testCheckpoint: '4 lớp thi',
  attendanceAvg: null,
  homeworkAvg: 82.1,
  passChuanRate: 51.2,
  passMemRate: 70.4,
  classesReported: 15,
  activeStudentSample: 241,
  classesWithTests: 4,
  latestDataAsOf: '2026-05-16',
  ...over,
});

describe('toTrendChartRows', () => {
  it('creates one categorical row with quality context for each ISO week', () => {
    expect(toTrendChartRows([point()])[0]).toMatchObject({
      weekLabel: '11/05–17/05',
      classesReported: 15,
      activeStudentSample: 241,
      classesWithTests: 4,
      latestDataAsOf: '2026-05-16',
    });
  });

  it('keeps missing metrics null so Recharts draws a gap', () => {
    expect(toTrendChartRows([point()])[0].attendanceAvg).toBeNull();
  });

  it('sorts weeks and labels only the last non-null value per series', () => {
    const rows = toTrendChartRows([
      point({ weekStart: '2026-05-18', weekEnd: '2026-05-24', attendanceAvg: 84 }),
      point({ attendanceAvg: 82 }),
      point({ weekStart: '2026-05-25', weekEnd: '2026-05-31', attendanceAvg: null }),
    ]);

    expect(rows.map((row) => row.weekStart)).toEqual(['2026-05-11', '2026-05-18', '2026-05-25']);
    expect(rows.map((row) => row.attendanceAvgLabel)).toEqual(['', 'Điểm danh', '']);
  });
});

import {
  aggregateSnapshots,
  buildTrend,
  calculateAttrition,
  calculateNetMomentum,
  buildWeeklyTrend,
  compareMonthlyMetrics,
  parseReportPeriod,
} from './lead-aggregation';
import type { ResolvedClassObservation } from './snapshot-quality';

const snapshot = (overrides: Record<string, unknown> = {}) => ({
  classId: 1,
  date: '2026-08-01',
  activeStudents: 10,
  onHoldStudents: 0,
  droppedStudents: 1,
  attendanceAvg: 80,
  homeworkAvg: 90,
  passStandardRate: 50,
  softPassRate: 60,
  riskStudents: 2,
  hasTestSample: true,
  ...overrides,
});

describe('lead aggregation', () => {
  it('derives current, previous, and 90-day boundaries from a calendar month', () => {
    expect(parseReportPeriod('2026-08', '2026-08-12')).toEqual({
      period: '2026-08',
      reportAsOf: '2026-08-12',
      previousAsOf: '2026-07-31',
      trendFrom: '2026-05-15',
      currentAsOf: '2026-08-12',
    });
    expect(parseReportPeriod('2026-07', '2026-08-12')).toEqual({
      period: '2026-07',
      reportAsOf: '2026-07-31',
      previousAsOf: '2026-06-30',
      trendFrom: '2026-05-03',
      currentAsOf: '2026-08-12',
    });
  });

  it('computes delta only on classes valid in both month-end cohorts', () => {
    const current = [
      resolved(1, 10, 90),
      resolved(2, 30, 80),
      resolved(3, 20, 100),
    ];
    const previous = [resolved(1, 10, 84), resolved(2, 30, 74)];

    const result = compareMonthlyMetrics(current, previous);

    expect(result.attendanceAvg).toMatchObject({
      value: 88.3,
      baselineValue: 76.5,
      delta: 6,
      classesReported: 3,
      comparableClasses: 2,
      totalClasses: 3,
    });
  });

  it('builds ISO-week points and expires carry-forward after seven days', () => {
    const result = buildWeeklyTrend(
      [
        {
          classId: 1,
          className: 'C1',
          classTotalSessions: 27,
          snapshots: [
            {
              date: '2026-05-15',
              activeStudents: 10,
              onHoldStudents: 0,
              droppedStudents: 0,
              transferredStudents: 0,
              completedSessions: 5,
              totalSessions: 27,
            },
          ],
          studentMetrics: [
            {
              date: '2026-05-15',
              recordCount: 10,
              attendanceSampleSize: 10,
              attendanceAvg: 90,
              homeworkSampleSize: 10,
              homeworkAvg: 80,
              testedStudents: 10,
              passStandardStudents: 5,
              softPassStudents: 6,
            },
          ],
        },
      ],
      { trendFrom: '2026-05-15', reportAsOf: '2026-08-12' },
    );

    expect(result).toHaveLength(14);
    expect(result[0]).toMatchObject({
      weekStart: '2026-05-11',
      weekEnd: '2026-05-17',
      attendanceAvg: 90,
      classesReported: 1,
      activeStudentSample: 10,
    });
    expect(result[1]).toMatchObject({
      weekStart: '2026-05-18',
      attendanceAvg: null,
      classesReported: 0,
    });
    expect(result.at(-1)?.weekEnd).toBe('2026-08-12');
  });

  it('weights class metrics by active students instead of averaging classes', () => {
    const result = aggregateSnapshots([
      snapshot({
        classId: 1,
        activeStudents: 10,
        attendanceAvg: 80,
        homeworkAvg: 70,
      }),
      snapshot({
        classId: 2,
        activeStudents: 30,
        attendanceAvg: 100,
        homeworkAvg: 90,
      }),
    ]);

    expect(result.attendanceAvg).toBe(95);
    expect(result.homeworkAvg).toBe(85);
    expect(result.activeStudents).toBe(40);
  });

  it('excludes classes without test samples from pass rates', () => {
    const result = aggregateSnapshots([
      snapshot({ classId: 1, activeStudents: 10, passStandardRate: 40 }),
      snapshot({
        classId: 2,
        activeStudents: 30,
        passStandardRate: 100,
        hasTestSample: false,
      }),
    ]);

    expect(result.passStandardRate).toBe(40);
    expect(result.classesWithTests).toBe(1);
    expect(result.testedActiveStudents).toBe(10);
  });

  it('returns null metrics when there is no valid sample', () => {
    const result = aggregateSnapshots([
      snapshot({
        activeStudents: 0,
        attendanceAvg: null,
        homeworkAvg: null,
        hasTestSample: false,
      }),
    ]);

    expect(result.attendanceAvg).toBeNull();
    expect(result.homeworkAvg).toBeNull();
    expect(result.passStandardRate).toBeNull();
    expect(result.riskRate).toBeNull();
  });

  it('calculates risk from red and grey student counts', () => {
    const result = aggregateSnapshots([
      snapshot({ activeStudents: 20, riskStudents: 5 }),
      snapshot({ classId: 2, activeStudents: 30, riskStudents: 10 }),
    ]);

    expect(result.riskRate).toBe(30);
  });

  it('calculates period attrition from class boundary snapshots', () => {
    const result = calculateAttrition(
      [snapshot({ classId: 1, activeStudents: 20, droppedStudents: 1 })],
      [snapshot({ classId: 1, activeStudents: 17, droppedStudents: 4 })],
    );

    expect(result).toEqual({ newDroppedStudents: 3, periodAttritionRate: 15 });
  });

  it('calculates Net Momentum and returns null without recalculation events', () => {
    expect(
      calculateNetMomentum([
        { date: '2026-08-01', studentId: 1, classId: 1, direction: 'up' },
        { date: '2026-08-01', studentId: 2, classId: 1, direction: 'up' },
        { date: '2026-08-02', studentId: 1, classId: 1, direction: 'down' },
      ]),
    ).toEqual({
      value: 1,
      upTransitions: 2,
      downTransitions: 1,
      studentsChanged: 2,
      recalculationEvents: 2,
      classesWithTests: 1,
    });
    expect(calculateNetMomentum([]).value).toBeNull();
  });

  it('builds a dense date series and keeps absent measurements null', () => {
    const result = buildTrend(
      [snapshot({ date: '2026-08-01' }), snapshot({ date: '2026-08-03' })],
      [{ date: '2026-08-03', studentId: 1, classId: 1, direction: 'up' }],
      '2026-08-01',
      '2026-08-03',
    );

    expect(result).toHaveLength(3);
    expect(result[1]).toMatchObject({
      date: '2026-08-02',
      attendanceAvg: null,
      netMomentum: null,
      classesReported: 0,
    });
    expect(result[2]).toMatchObject({ date: '2026-08-03', netMomentum: 1 });
  });
});

function resolved(
  classId: number,
  activeStudents: number,
  attendance: number,
): ResolvedClassObservation {
  const metric = {
    value: attendance,
    dataAsOf: '2026-08-01',
    sampleSize: activeStudents,
    recordCount: activeStudents,
    coveragePct: 100,
    fallbackUsed: false,
  };
  return {
    classId,
    className: `C${classId}`,
    asOf: '2026-08-01',
    roster: {
      activeStudents,
      onHoldStudents: 0,
      droppedStudents: 0,
      transferredStudents: 0,
      dataAsOf: '2026-08-01',
    },
    progress: {
      completedSessions: 1,
      totalSessions: 27,
      percentage: 3.7,
      dataAsOf: '2026-08-01',
    },
    attendance: metric,
    homework: { ...metric, value: 80 },
    passStandard: { ...metric, value: 50, testedStudents: activeStudents },
    softPass: { ...metric, value: 60, testedStudents: activeStudents },
    dataQuality: {
      status: 'complete',
      warnings: [],
      rosterAsOf: '2026-08-01',
      progressAsOf: '2026-08-01',
      attendanceAsOf: '2026-08-01',
      homeworkAsOf: '2026-08-01',
      passAsOf: '2026-08-01',
    },
  };
}

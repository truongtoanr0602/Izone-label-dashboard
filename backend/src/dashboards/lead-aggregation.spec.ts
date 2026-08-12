import {
  aggregateSnapshots,
  buildTrend,
  calculateAttrition,
  calculateNetMomentum,
} from './lead-aggregation';

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

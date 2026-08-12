import {
  resolveClassObservation,
  type ClassObservationEvidence,
} from './snapshot-quality';

const base: ClassObservationEvidence = {
  classId: 1127,
  className: 'IC2142',
  classTotalSessions: 27,
  snapshots: [
    {
      date: '2026-08-10',
      activeStudents: 9,
      onHoldStudents: 0,
      droppedStudents: 0,
      transferredStudents: 0,
      completedSessions: 22,
      totalSessions: 27,
    },
  ],
  studentMetrics: [
    {
      date: '2026-08-10',
      recordCount: 9,
      attendanceSampleSize: 9,
      attendanceAvg: 84.44,
      homeworkSampleSize: 9,
      homeworkAvg: 79.26,
      testedStudents: 9,
      passStandardStudents: 5,
      softPassStudents: 9,
    },
  ],
};

describe('resolveClassObservation', () => {
  it('falls back from a newer empty snapshot but keeps its roster', () => {
    const input: ClassObservationEvidence = {
      ...base,
      snapshots: [
        ...base.snapshots,
        {
          date: '2026-08-12',
          activeStudents: 7,
          onHoldStudents: 0,
          droppedStudents: 1,
          transferredStudents: 1,
          completedSessions: 0,
          totalSessions: 27,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-12');

    expect(result.roster).toMatchObject({
      activeStudents: 7,
      droppedStudents: 1,
      dataAsOf: '2026-08-12',
    });
    expect(result.attendance).toMatchObject({
      value: 84.4,
      dataAsOf: '2026-08-10',
      fallbackUsed: true,
      coveragePct: 100,
    });
    expect(result.homework.value).toBe(79.3);
    expect(result.progress).toMatchObject({
      completedSessions: 22,
      totalSessions: 27,
      percentage: 81.5,
      dataAsOf: '2026-08-10',
    });
    expect(result.dataQuality.status).toBe('fallback');
    expect(result.dataQuality.warnings).toContain('PARTIAL_SNAPSHOT');
  });

  it('keeps zero pass when test evidence exists', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          ...base.studentMetrics[0],
          testedStudents: 6,
          passStandardStudents: 0,
          softPassStudents: 0,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-10');

    expect(result.passStandard).toMatchObject({
      value: 0,
      sampleSize: 9,
      testedStudents: 6,
    });
    expect(result.softPass.value).toBe(0);
  });

  it('uses independent 80 percent coverage for attendance and homework', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          ...base.studentMetrics[0],
          date: '2026-08-11',
          recordCount: 10,
          attendanceSampleSize: 8,
          attendanceAvg: 0,
          homeworkSampleSize: 7,
          homeworkAvg: 0,
        },
        base.studentMetrics[0],
      ],
    };

    const result = resolveClassObservation(input, '2026-08-11');

    expect(result.attendance).toMatchObject({
      value: 0,
      dataAsOf: '2026-08-11',
      coveragePct: 80,
    });
    expect(result.homework).toMatchObject({
      value: 79.3,
      dataAsOf: '2026-08-10',
      fallbackUsed: true,
    });
    expect(result.dataQuality.warnings).toContain('LOW_HOMEWORK_COVERAGE');
  });

  it('excludes future evidence relative to asOf', () => {
    const input: ClassObservationEvidence = {
      ...base,
      snapshots: [
        ...base.snapshots,
        { ...base.snapshots[0], date: '2026-09-01', completedSessions: 27 },
      ],
      studentMetrics: [
        ...base.studentMetrics,
        { ...base.studentMetrics[0], date: '2026-09-01', attendanceAvg: 100 },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-12');

    expect(result.progress.completedSessions).toBe(22);
    expect(result.attendance.value).toBe(84.4);
    expect(result.dataQuality.warnings).toContain('FUTURE_ROWS_EXCLUDED');
  });

  it('caps progress at total sessions and never allows it to decrease', () => {
    const input: ClassObservationEvidence = {
      ...base,
      snapshots: [
        { ...base.snapshots[0], date: '2026-08-09', completedSessions: 30 },
        { ...base.snapshots[0], date: '2026-08-12', completedSessions: 0 },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-12');

    expect(result.progress).toMatchObject({
      completedSessions: 27,
      totalSessions: 27,
      percentage: 100,
    });
  });

  it('returns insufficient instead of synthetic zero without metric evidence', () => {
    const result = resolveClassObservation(
      { ...base, studentMetrics: [] },
      '2026-08-10',
    );

    expect(result.attendance.value).toBeNull();
    expect(result.homework.value).toBeNull();
    expect(result.passStandard.value).toBeNull();
    expect(result.dataQuality.status).toBe('insufficient');
  });
});

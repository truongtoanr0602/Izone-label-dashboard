import {
  resolveClassObservation,
  type ClassObservationEvidence,
} from './snapshot-quality';

const base: ClassObservationEvidence = {
  classId: 1127,
  className: 'IC2142',
  classStatus: 'on_going',
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
  it('ignores student metrics recorded after the final roster snapshot of a completed class', () => {
    const input: ClassObservationEvidence = {
      ...base,
      classId: 1141,
      className: 'IC2155',
      classStatus: 'completed',
      snapshots: [
        { ...base.snapshots[0], date: '2026-08-12', activeStudents: 12 },
      ],
      studentMetrics: [
        {
          ...base.studentMetrics[0],
          date: '2026-08-17',
          recordCount: 3,
          attendanceSampleSize: 2,
          attendanceAvg: 0,
          homeworkSampleSize: 2,
          homeworkAvg: 0,
        },
        {
          ...base.studentMetrics[0],
          date: '2026-08-12',
          recordCount: 13,
          attendanceSampleSize: 13,
          attendanceAvg: 79.2,
          homeworkSampleSize: 13,
          homeworkAvg: 70.7,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-19');

    expect(result.attendance).toMatchObject({
      value: 79.2,
      dataAsOf: '2026-08-12',
    });
    expect(result.homework).toMatchObject({
      value: 70.7,
      dataAsOf: '2026-08-12',
    });
    expect(result.dataQuality.warnings).toContain('FUTURE_ROWS_EXCLUDED');
  });

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

  it('keeps zero pass when test evidence exists, sampleSize now reports tested students not roster size', () => {
    // Trước đây sampleSize == recordCount (tổng sĩ số, 9). Từ Task 2 nó phải
    // bằng testedStudents (6) — Task 3 dùng trường này làm trọng số.
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
      sampleSize: 6,
      testedStudents: 6,
    });
    expect(result.softPass.value).toBe(0);
  });

  it('reports coverage independently for attendance and homework without gating either out', () => {
    // Trước đây độ phủ homework 7/10 = 70% dưới ngưỡng 80% khiến cả bản ghi bị
    // loại và rơi về ngày cũ hơn (fallback). Từ Task 2, coverage không còn là
    // cổng chặn — bản ghi mới nhất vẫn được nhận, chỉ gắn thêm cảnh báo
    // LOW_HOMEWORK_COVERAGE để Lead biết số này mỏng.
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
      value: 0,
      dataAsOf: '2026-08-11',
      coveragePct: 70,
      fallbackUsed: false,
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

  it('resolves repaired class 1104 to 100 percent at the end of July', () => {
    const input: ClassObservationEvidence = {
      ...base,
      classId: 1104,
      className: 'IC2119',
      classTotalSessions: 27,
      snapshots: [
        {
          ...base.snapshots[0],
          date: '2026-07-16',
          completedSessions: 27,
          totalSessions: 27,
        },
      ],
      studentMetrics: [],
    };

    const result = resolveClassObservation(input, '2026-07-31');

    expect(result.progress).toMatchObject({
      completedSessions: 27,
      totalSessions: 27,
      percentage: 100,
      dataAsOf: '2026-07-16',
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

describe('coverage không còn là cổng loại lớp', () => {
  it('vẫn nhận số liệu khi chỉ một phần học viên có dữ liệu', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          date: '2026-08-10',
          recordCount: 14,
          attendanceSampleSize: 5,
          attendanceAvg: 82,
          homeworkSampleSize: 5,
          homeworkAvg: 74,
          testedStudents: 5,
          passStandardStudents: 2,
          softPassStudents: 3,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-10');

    expect(result.attendance.value).toBe(82);
    expect(result.attendance.sampleSize).toBe(5);
    expect(result.attendance.coveragePct).toBe(35.7);
    expect(result.dataQuality.status).not.toBe('insufficient');
  });

  it('chia tỷ lệ pass cho số học viên đã thi, không cho tổng sĩ số', () => {
    const input: ClassObservationEvidence = {
      ...base,
      studentMetrics: [
        {
          date: '2026-08-10',
          recordCount: 20,
          attendanceSampleSize: 20,
          attendanceAvg: 90,
          homeworkSampleSize: 20,
          homeworkAvg: 90,
          testedStudents: 8,
          passStandardStudents: 2,
          softPassStudents: 4,
        },
      ],
    };

    const result = resolveClassObservation(input, '2026-08-10');

    expect(result.passStandard.value).toBe(25);
    expect(result.passStandard.sampleSize).toBe(8);
    expect(result.passStandard.testedStudents).toBe(8);
    expect(result.passStandard).toMatchObject({ qualifiedStudents: 2 });
    expect(result.softPass.value).toBe(50);
    expect(result.softPass).toMatchObject({ qualifiedStudents: 4 });
  });
});

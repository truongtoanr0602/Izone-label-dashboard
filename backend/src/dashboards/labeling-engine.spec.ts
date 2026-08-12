import {
  DEFAULT_DASHBOARD_THRESHOLDS,
  classifyStudent,
} from './labeling-engine';

const activeStudent = {
  registrationStatus: 'on_going',
  attendancePct: 95,
  homeworkPct: 95,
  testAverage: 65,
  flagAttendanceDrop: false,
  flagHomeworkDrop: false,
};

describe('classifyStudent', () => {
  it.each([
    [44.99, 'grey', 'level_3', 'REVIEW_LEARNING_PATH'],
    [45, 'red', 'level_2', 'FOLLOW_UP_CLOSELY'],
    [59.99, 'red', 'level_2', 'FOLLOW_UP_CLOSELY'],
  ] as const)(
    'classifies test average %s at the configured boundary',
    (testAverage, label, interventionLevel, actionCode) => {
      const result = classifyStudent(
        { ...activeStudent, testAverage },
        DEFAULT_DASHBOARD_THRESHOLDS,
      );

      expect(result.label).toBe(label);
      expect(result.interventionLevel).toBe(interventionLevel);
      expect(result.recommendedAction.code).toBe(actionCode);
    },
  );

  it('classifies a fully passing student as green without intervention', () => {
    const result = classifyStudent(
      { ...activeStudent, testAverage: 60, attendancePct: 90, homeworkPct: 90 },
      DEFAULT_DASHBOARD_THRESHOLDS,
    );

    expect(result).toMatchObject({
      label: 'green',
      interventionLevel: 'none',
      recommendedAction: { code: 'NONE', priority: 0 },
      issues: [],
    });
  });

  it('classifies passing test data with weak habits as level 1', () => {
    const result = classifyStudent(
      { ...activeStudent, attendancePct: 89, homeworkPct: 88 },
      DEFAULT_DASHBOARD_THRESHOLDS,
    );

    expect(result.label).toBe('yellow');
    expect(result.interventionLevel).toBe('level_1');
    expect(result.recommendedAction.code).toBe('REMIND_STUDY_HABIT');
    expect(result.issues.map((issue) => issue.code)).toEqual([
      'ATTENDANCE_BELOW_THRESHOLD',
      'HOMEWORK_BELOW_THRESHOLD',
    ]);
  });

  it('keeps level 3 priority while retaining secondary habit issues', () => {
    const result = classifyStudent(
      { ...activeStudent, testAverage: 40, attendancePct: 82, homeworkPct: 81 },
      DEFAULT_DASHBOARD_THRESHOLDS,
    );

    expect(result.interventionLevel).toBe('level_3');
    expect(result.issues.map((issue) => issue.code)).toEqual([
      'TEST_BELOW_GREY_THRESHOLD',
      'ATTENDANCE_BELOW_THRESHOLD',
      'HOMEWORK_BELOW_THRESHOLD',
    ]);
  });

  it('does not enqueue inactive students', () => {
    const result = classifyStudent(
      { ...activeStudent, registrationStatus: 'dropped', testAverage: 30 },
      DEFAULT_DASHBOARD_THRESHOLDS,
    );

    expect(result).toMatchObject({
      interventionLevel: 'none',
      recommendedAction: { code: 'NONE', priority: 0 },
    });
  });

  it('returns no_data instead of treating missing measurements as zero', () => {
    const result = classifyStudent(
      {
        ...activeStudent,
        attendancePct: null,
        homeworkPct: null,
        testAverage: null,
      },
      DEFAULT_DASHBOARD_THRESHOLDS,
    );

    expect(result).toMatchObject({
      label: 'no_data',
      interventionLevel: 'none',
      recommendedAction: { code: 'WAIT_FOR_DATA', priority: 0 },
    });
    expect(result.issues.map((issue) => issue.code)).toContain(
      'MISSING_TEST_DATA',
    );
  });
});

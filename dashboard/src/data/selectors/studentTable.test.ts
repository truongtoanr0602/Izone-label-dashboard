import { describe, expect, it } from 'vitest';
import type { StudentDetail } from '../types';
import {
  matchesStudentTableFilter,
  sortStudentsForTable,
  studentPassState,
} from './studentTable';

function student(
  studentId: number,
  registrationStatus: StudentDetail['registrationStatus'],
  riskScore: number,
  overrides: Partial<StudentDetail> = {},
): StudentDetail {
  return {
    studentId,
    registrationStatus,
    interventionLevel: 'none',
    evaluation: {
      riskScore,
      suggestedAction: 'none',
      passChuanStatus: 'Chưa đạt',
      passChuanReasons: [],
      passMemStatus: 'Không đạt pass mềm',
      passMemGroup: '',
      passMemLabel: '',
      isEligibleForReview: false,
      reviewStatus: '',
    },
    ...overrides,
  } as StudentDetail;
}

describe('matchesStudentTableFilter', () => {
  it('keeps dropped students in all but excludes them from actionable filters', () => {
    const dropped = student(1, 'dropped', 90, {
      interventionLevel: 'level_1',
      evaluation: {
        riskScore: 90,
        suggestedAction: 'none',
        passChuanStatus: 'Có khả năng pass',
        passChuanReasons: [],
        passMemStatus: 'Đạt pass mềm',
        passMemGroup: '',
        passMemLabel: '',
        isEligibleForReview: true,
        reviewStatus: '',
      },
    });

    expect(matchesStudentTableFilter(dropped, 'all')).toBe(true);
    expect(matchesStudentTableFilter(dropped, 'habit_reminder')).toBe(false);
    expect(matchesStudentTableFilter(dropped, 'pass')).toBe(false);
    expect(matchesStudentTableFilter(dropped, 'review')).toBe(false);
  });

  it('preserves active pass and review filters', () => {
    const active = student(2, 'on_going', 20, {
      evaluation: {
        riskScore: 20,
        suggestedAction: 'none',
        passChuanStatus: 'Có khả năng pass',
        passChuanReasons: [],
        passMemStatus: 'Không đạt pass mềm',
        passMemGroup: '',
        passMemLabel: '',
        isEligibleForReview: true,
        reviewStatus: 'Chờ GV',
      },
    });

    expect(matchesStudentTableFilter(active, 'pass')).toBe(true);
    expect(matchesStudentTableFilter(active, 'review')).toBe(true);
  });

  it('includes students who already meet the standard pass criteria', () => {
    const passed = student(3, 'on_going', 0, {
      evaluation: {
        riskScore: 0,
        suggestedAction: 'none',
        passChuanStatus: 'Đạt tiêu chuẩn',
        passChuanReasons: [],
        passMemStatus: '',
        passMemGroup: '',
        passMemLabel: '',
        isEligibleForReview: false,
        reviewStatus: '',
      },
    });

    expect(matchesStudentTableFilter(passed, 'pass')).toBe(true);
  });

  it('keeps escalated reviews out of the waiting-for-teacher filter', () => {
    const escalated = student(4, 'on_going', 0, {
      evaluation: {
        riskScore: 0,
        suggestedAction: 'none',
        passChuanStatus: 'Chưa đạt điều kiện pass',
        passChuanReasons: [],
        passMemStatus: 'Xét chờ Review',
        passMemGroup: '',
        passMemLabel: '',
        isEligibleForReview: true,
        reviewStatus: 'Quá hạn → Lead',
      },
    });

    expect(matchesStudentTableFilter(escalated, 'review')).toBe(false);
  });
});

describe('studentPassState', () => {
  it('shows a neutral waiting state before the first test', () => {
    const noTest = student(5, 'on_going', 0, {
      testPerformance: {
        testsTakenCount: 0,
        averageScore: null,
        lastScore: null,
        trendDirection: 'no_data',
        scores: [],
        isCheatingFlagged: false,
      },
    });
    expect(studentPassState(noTest)).toBe('no_test');
  });
});

describe('sortStudentsForTable', () => {
  it('puts active students before dropped students and keeps risk order within groups', () => {
    const input = [
      student(1, 'dropped', 100),
      student(2, 'on_going', 10),
      student(3, 'on_going', 80),
      student(4, 'dropped', 30),
    ];

    expect(sortStudentsForTable(input).map((item) => item.studentId)).toEqual([3, 2, 1, 4]);
    expect(input.map((item) => item.studentId)).toEqual([1, 2, 3, 4]);
  });

  it('sorts by the selected text column and direction', () => {
    const input = [
      student(1, 'on_going', 0, { fullName: 'Trần Bình' }),
      student(2, 'on_going', 0, { fullName: 'Anh An' }),
    ];

    expect(sortStudentsForTable(input, { key: 'name', direction: 'asc' }).map((s) => s.studentId))
      .toEqual([2, 1]);
    expect(sortStudentsForTable(input, { key: 'name', direction: 'desc' }).map((s) => s.studentId))
      .toEqual([1, 2]);
  });

  it('keeps missing metrics last in both directions', () => {
    const input = [
      student(1, 'on_going', 0, { attendance: { percentage: null } as StudentDetail['attendance'] }),
      student(2, 'on_going', 0, { attendance: { percentage: 70 } as StudentDetail['attendance'] }),
      student(3, 'on_going', 0, { attendance: { percentage: 90 } as StudentDetail['attendance'] }),
    ];

    expect(sortStudentsForTable(input, { key: 'attendance', direction: 'asc' }).map((s) => s.studentId))
      .toEqual([2, 3, 1]);
    expect(sortStudentsForTable(input, { key: 'attendance', direction: 'desc' }).map((s) => s.studentId))
      .toEqual([3, 2, 1]);
  });

  it('sorts an individual test column by final score', () => {
    const input = [
      student(1, 'on_going', 0, {
        testPerformance: { scores: [{ testOrder: 2, finalScore: 80 }] } as StudentDetail['testPerformance'],
      }),
      student(2, 'on_going', 0, {
        testPerformance: { scores: [{ testOrder: 2, finalScore: 60 }] } as StudentDetail['testPerformance'],
      }),
    ];

    expect(sortStudentsForTable(input, { key: 'test2', direction: 'asc' }).map((s) => s.studentId))
      .toEqual([2, 1]);
  });
});

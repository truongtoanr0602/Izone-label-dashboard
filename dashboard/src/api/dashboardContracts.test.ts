import { describe, expect, it } from 'vitest';
import {
  adaptTeacherStudent,
  toLeadTrendPoint,
  type TeacherDashboardStudent,
} from './dashboardContracts';

describe('dashboard screen-contract adapters', () => {
  it('keeps missing Lead measurements null for Recharts gaps', () => {
    expect(
      toLeadTrendPoint({
        date: '2026-08-02',
        attendanceAvg: null,
        homeworkAvg: null,
        passStandardRate: null,
        softPassRate: null,
        riskRate: null,
        activeStudents: null,
        classesReported: 0,
        classesWithTests: 0,
        upTransitions: 0,
        downTransitions: 0,
        netMomentum: null,
      }),
    ).toMatchObject({
      date: '2026-08-02',
      attendanceAvg: null,
      passChuanRate: null,
      passMemRate: null,
    });
  });

  it('adapts an exclusive level 3 student without recalculating its label', () => {
    const student: TeacherDashboardStudent = {
      studentId: 1,
      fullName: 'HV Xám',
      phone: null,
      email: null,
      registrationStatus: 'on_going',
      recordDate: '2026-08-12',
      attendance: { percentage: 82, present: 8, total: 10, isDropping: false },
      homework: { percentage: 80, completed: 8, total: 10, isDropping: false },
      tests: {
        taken: 1,
        average: 40,
        latestScore: 40,
        trend: 'stable',
        scores: [{ testOrder: 1, testName: 'Test 1', rawScore: 40, makeupScore: null, finalScore: 40, isMakeup: false }],
      },
      label: 'grey',
      previousLabel: 'red',
      interventionLevel: 'level_3',
      issues: [
        { code: 'TEST_BELOW_GREY_THRESHOLD', metric: 'testAverage', actual: 40, threshold: 45 },
        { code: 'ATTENDANCE_BELOW_THRESHOLD', metric: 'attendancePct', actual: 82, threshold: 90 },
      ],
      recommendedAction: { code: 'REVIEW_LEARNING_PATH', title: 'Bàn lại lộ trình', priority: 3, messageTemplateKey: 'relearn_advice' },
      actionState: { status: 'pending', checkpoint: 'Test 1', lastContactedAt: null },
      passEvaluation: {
        standardStatus: 'not_met',
        standardReasons: ['TEST_BELOW_60'],
        softPassStatus: '',
        softPassGroup: null,
        reviewStatus: null,
        reviewDeadline: null,
      },
      teacherEvidence: { homeworkFeedback: '', orientationFeedback: '', note: '' },
      dataQuality: { status: 'complete', warnings: [] },
      updatedAt: '2026-08-12T03:00:00Z',
    };

    const adapted = adaptTeacherStudent(student, 1159, '34A-1159');

    expect(adapted.labeling.currentLabel).toBe('grey');
    expect(adapted.interventionLevel).toBe('level_3');
    expect(adapted.evaluation.riskScore).toBe(100);
  });

  it('keeps missing Teacher measurements null instead of inventing zero', () => {
    const noData = adaptTeacherStudent(
      {
        studentId: 2,
        fullName: 'Chưa có dữ liệu',
        phone: null,
        email: null,
        registrationStatus: 'on_going',
        recordDate: null,
        attendance: { percentage: null, present: null, total: null, isDropping: false },
        homework: { percentage: null, completed: null, total: null, isDropping: false },
        tests: { taken: 0, average: null, latestScore: null, trend: 'no_data', scores: [] },
        label: 'no_data',
        previousLabel: null,
        interventionLevel: 'none',
        issues: [],
        recommendedAction: { code: 'WAIT_FOR_DATA', title: 'Chờ dữ liệu', priority: 0, messageTemplateKey: null },
        actionState: { status: 'not_applicable', checkpoint: 'Chưa có test', lastContactedAt: null },
        passEvaluation: { standardStatus: 'no_data', standardReasons: [], softPassStatus: '', softPassGroup: null, reviewStatus: null, reviewDeadline: null },
        teacherEvidence: { homeworkFeedback: '', orientationFeedback: '', note: '' },
        dataQuality: { status: 'complete', warnings: [] },
        updatedAt: null,
      },
      1159,
      '34A-1159',
    );

    expect(noData.attendance.percentage).toBeNull();
    expect(noData.homework.percentage).toBeNull();
    expect(noData.testPerformance.averageScore).toBeNull();
  });
});

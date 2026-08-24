import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  adaptTeacherStudent,
  toLeadClassPresentation,
  toLeadWeeklyTrendPoint,
  type LeadDashboardClass,
  type LeadDashboardResponse,
  type TeacherDashboardStudent,
} from './dashboardContracts';

function teacherStudent(
  passEvaluation: TeacherDashboardStudent['passEvaluation'],
): TeacherDashboardStudent {
  return {
    studentId: 99,
    fullName: 'Học viên kiểm thử',
    phone: null,
    email: null,
    registrationStatus: 'on_going',
    recordDate: '2026-08-12',
    attendance: { percentage: 90, present: 9, total: 10, isDropping: false },
    homework: { percentage: 90, completed: 9, total: 10, isDropping: false },
    tests: { taken: 1, average: 55, latestScore: 55, trend: 'stable', scores: [] },
    label: 'red',
    previousLabel: null,
    interventionLevel: 'none',
    issues: [],
    recommendedAction: { code: 'NONE', title: '', priority: 0, messageTemplateKey: null },
    actionState: { status: 'not_applicable', checkpoint: 'Test 1', lastContactedAt: null },
    passEvaluation,
    teacherEvidence: { homeworkFeedback: '', orientationFeedback: '', note: '' },
    dataQuality: { status: 'complete', warnings: [] },
    updatedAt: null,
  };
}

describe('dashboard screen-contract adapters', () => {
  it('declares period availability and independent pass numerators', () => {
    expectTypeOf<LeadDashboardResponse['meta']['hasDataForPeriod']>()
      .toEqualTypeOf<boolean>();
    expectTypeOf<LeadDashboardResponse['kpis']['softPassRate']['qualifiedStudents']>()
      .toEqualTypeOf<number | undefined>();
  });

  it('normalizes pending_teacher as the only teacher-waiting review state', () => {
    const pending = adaptTeacherStudent(teacherStudent({
      standardStatus: 'not_met',
      standardReasons: [],
      softPassStatus: 'Xét chờ Review',
      softPassGroup: 'Nhóm 1',
      reviewStatus: 'pending_teacher',
      reviewDeadline: null,
    }), 1104, 'IC2119');
    const escalated = adaptTeacherStudent(teacherStudent({
      standardStatus: 'not_met',
      standardReasons: [],
      softPassStatus: 'Xét chờ Review',
      softPassGroup: 'Nhóm 1',
      reviewStatus: 'escalated_lead',
      reviewDeadline: null,
    }), 1104, 'IC2119');

    expect(pending.evaluation.reviewStatus).toBe('Chờ GV');
    expect(pending.evaluation.isEligibleForReview).toBe(true);
    expect(escalated.evaluation.reviewStatus).toBe('Quá hạn → Lead');
    expect(escalated.evaluation.isEligibleForReview).toBe(false);
  });

  it('preserves a confirmed soft-pass status from the backend', () => {
    const adapted = adaptTeacherStudent(teacherStudent({
      standardStatus: 'not_met',
      standardReasons: [],
      softPassStatus: 'Đạt pass mềm',
      softPassGroup: 'Nhóm 3',
      reviewStatus: null,
      reviewDeadline: null,
    }), 1104, 'IC2119');

    expect(adapted.evaluation.passMemStatus).toBe('Đạt pass mềm');
  });

  it('keeps missing Lead measurements null for Recharts gaps', () => {
    expect(
      toLeadWeeklyTrendPoint({
        weekStart: '2026-07-27',
        weekEnd: '2026-08-02',
        attendanceAvg: null,
        homeworkAvg: null,
        passStandardRate: null,
        softPassRate: null,
        riskRate: null,
        activeStudents: null,
        classesReported: 0,
        activeStudentSample: 0,
        activeStudentRoster: null,
        classesWithTests: 0,
        latestDataAsOf: null,
        upTransitions: 0,
        downTransitions: 0,
        netMomentum: null,
      }),
    ).toMatchObject({
      weekStart: '2026-07-27',
      weekEnd: '2026-08-02',
      attendanceAvg: null,
      passChuanRate: null,
      passMemRate: null,
    });
  });

  it('keeps server progress and fallback freshness on current class rows', () => {
    const row: LeadDashboardClass = {
      classId: 1127,
      className: 'IC2142',
      courseId: 2,
      status: 'on_going',
      schedule: '[5,1]',
      location: null,
      portalUrl: null,
      teacher: { teacherId: 1, fullName: 'GV A', email: 'a@izone.edu.vn' },
      activeStudents: 7,
      onHoldStudents: 0,
      droppedStudents: 1,
      transferredStudents: 1,
      attendanceAvg: 84.4,
      homeworkAvg: 79.3,
      passStandardRate: 55.6,
      softPassRate: 100,
      riskRate: 22.2,
      progress: { completedSessions: 22, totalSessions: 27, percentage: 81.5, dataAsOf: '2026-08-10' },
      healthStatus: 'watch',
      isAlarmTriggered: false,
      labelDistribution: { green: 0, yellow: 7, red: 1, grey: 1, noData: 0 },
      lastSnapshotDate: '2026-08-12',
      contactCoverage: { done: 4, total: 5, pct: 80 },
      dataQuality: {
        status: 'fallback',
        warnings: ['PARTIAL_SNAPSHOT'],
        rosterAsOf: '2026-08-12',
        progressAsOf: '2026-08-10',
        attendanceAsOf: '2026-08-10',
        homeworkAsOf: '2026-08-10',
        passAsOf: '2026-08-10',
      },
    };

    expect(row.progress.percentage).toBe(81.5);
    expect(row.dataQuality.status).toBe('fallback');
  });

  it('maps current class progress without using the selected report month', () => {
    const contract = {
      classId: 1127,
      activeStudents: 7,
      onHoldStudents: 1,
      droppedStudents: 1,
      transferredStudents: 2,
      attendanceAvg: 84.4,
      homeworkAvg: 79.3,
      passStandardRate: 55.6,
      softPassRate: 100,
      isAlarmTriggered: false,
      progress: { completedSessions: 22, totalSessions: 27, percentage: 81.5, dataAsOf: '2026-08-10' },
      labelDistribution: { green: 0, yellow: 7, red: 1, grey: 1, noData: 0 },
      lastSnapshotDate: '2026-08-12',
    } as LeadDashboardClass;

    const julyView = toLeadClassPresentation(contract);
    const augustView = toLeadClassPresentation(contract);

    expect(julyView).toEqual(augustView);
    expect(augustView.progress).toEqual({ completedSessions: 22, totalSessions: 27, percentage: 81.5 });
    expect(augustView.studentCounts.totalEnrolled).toBe(11);
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
    expect(adapted.recordDate).toBe('2026-08-12');
    expect(adapted.dataQuality).toEqual({ status: 'complete', warnings: [] });
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

describe('toLeadClassPresentation — độ phủ liên hệ', () => {
  const leadClassFixture: LeadDashboardClass = {
    classId: 1127,
    className: 'IC2142',
    courseId: 2,
    status: 'on_going',
    schedule: '[5,1]',
    location: null,
    portalUrl: null,
    teacher: { teacherId: 1, fullName: 'GV A', email: 'a@izone.edu.vn' },
    activeStudents: 7,
    onHoldStudents: 0,
    droppedStudents: 1,
    transferredStudents: 1,
    attendanceAvg: 84.4,
    homeworkAvg: 79.3,
    passStandardRate: 55.6,
    softPassRate: 100,
    riskRate: 22.2,
    progress: { completedSessions: 22, totalSessions: 27, percentage: 81.5, dataAsOf: '2026-08-10' },
    healthStatus: 'watch',
    isAlarmTriggered: false,
    labelDistribution: { green: 0, yellow: 7, red: 1, grey: 1, noData: 0 },
    lastSnapshotDate: '2026-08-12',
    dataQuality: {
      status: 'fallback',
      warnings: ['PARTIAL_SNAPSHOT'],
      rosterAsOf: '2026-08-12',
      progressAsOf: '2026-08-10',
      attendanceAsOf: '2026-08-10',
      homeworkAsOf: '2026-08-10',
      passAsOf: '2026-08-10',
    },
    contactCoverage: { done: 0, total: 0, pct: null },
  };

  it('truyền nguyên độ phủ từ contract', () => {
    const result = toLeadClassPresentation({
      ...leadClassFixture,
      contactCoverage: { done: 3, total: 5, pct: 60 },
    });

    expect(result.contactCoverage).toEqual({ done: 3, total: 5, pct: 60 });
  });

  it('giữ pct null khi lớp không có cảnh báo nào', () => {
    const result = toLeadClassPresentation({
      ...leadClassFixture,
      contactCoverage: { done: 0, total: 0, pct: null },
    });

    expect(result.contactCoverage.pct).toBeNull();
  });
});

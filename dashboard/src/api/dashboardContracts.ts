import type { StudentDetail } from '../data/types';

export type MetricDirection = 'improving' | 'declining' | 'stable' | 'unknown';
export type InterventionLevel = 'level_1' | 'level_2' | 'level_3' | 'none';
export type SystemLabel = 'green' | 'yellow' | 'red' | 'grey' | 'no_data';

export interface DashboardMetric {
  value: number | null;
  baselineValue: number | null;
  delta: number | null;
  direction: MetricDirection;
  sampleSize?: number;
  classesWithTests?: number;
  classesReported?: number;
  comparableClasses?: number;
  totalClasses?: number;
}

export interface LeadTrendContractPoint {
  weekStart: string;
  weekEnd: string;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passStandardRate: number | null;
  softPassRate: number | null;
  riskRate: number | null;
  activeStudents: number | null;
  classesReported: number;
  activeStudentSample: number;
  activeStudentRoster: number | null;
  classesWithTests: number;
  latestDataAsOf: string | null;
  upTransitions: number;
  downTransitions: number;
  netMomentum: number | null;
}

export interface LeadDashboardClass {
  classId: number;
  className: string;
  courseId: number;
  status: string;
  schedule: string | null;
  location: string | null;
  portalUrl: string | null;
  teacher: { teacherId: number; fullName: string; email: string };
  activeStudents: number;
  onHoldStudents: number;
  droppedStudents: number;
  transferredStudents: number;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passStandardRate: number | null;
  softPassRate: number | null;
  riskRate: number | null;
  progress: {
    completedSessions: number;
    totalSessions: number;
    percentage: number | null;
    dataAsOf: string | null;
  };
  healthStatus: string;
  isAlarmTriggered: boolean;
  labelDistribution: { green: number; yellow: number; red: number; grey: number; noData: number };
  lastSnapshotDate: string | null;
  contactCoverage: { done: number; total: number; pct: number | null };
  dataQuality: {
    status: 'complete' | 'fallback' | 'insufficient';
    warnings: string[];
    rosterAsOf: string | null;
    progressAsOf: string | null;
    attendanceAsOf: string | null;
    homeworkAsOf: string | null;
    passAsOf: string | null;
  };
}

export interface LeadDashboardResponse {
  meta: {
    apiVersion: 'v1';
    courseId: 2;
    khoiId: number;
    period: string;
    reportAsOf: string;
    previousAsOf: string;
    trendFrom: string;
    currentAsOf: string;
    from: string;
    to: string;
    timezone: string;
    generatedAt: string;
    dataFreshnessAt: string | null;
  };
  kpis: {
    activeStudents: DashboardMetric;
    attendanceAvg: DashboardMetric;
    homeworkAvg: DashboardMetric;
    passStandardRate: DashboardMetric;
    softPassRate: DashboardMetric;
    riskRate: DashboardMetric;
    periodAttritionRate: DashboardMetric & {
      newDroppedStudents: number;
      previousNewDroppedStudents: number;
      attritionRate: number | null;
    };
    netMomentum: {
      value: number | null;
      baselineValue: number | null;
      delta: number | null;
      upTransitions: number;
      downTransitions: number;
      studentsChanged: number;
      recalculationEvents: number;
      classesWithTests: number;
      comparableClasses: number;
      totalClasses: number;
      direction: MetricDirection;
    };
  };
  trend: LeadTrendContractPoint[];
  labelDistribution: { green: number; yellow: number; red: number; grey: number; noData: number };
  classes: LeadDashboardClass[];
}

export interface TeacherDashboardStudent {
  studentId: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  registrationStatus: StudentDetail['registrationStatus'];
  recordDate: string | null;
  attendance: { percentage: number | null; present: number | null; total: number | null; isDropping: boolean };
  homework: { percentage: number | null; completed: number | null; total: number | null; isDropping: boolean };
  tests: {
    taken: number;
    average: number | null;
    latestScore: number | null;
    trend: 'improving' | 'declining' | 'stable' | 'no_data';
    scores: Array<{
      testOrder: number;
      testName: string;
      rawScore: number | null;
      makeupScore: number | null;
      finalScore: number | null;
      isMakeup: boolean;
    }>;
  };
  label: SystemLabel;
  previousLabel: SystemLabel | null;
  interventionLevel: InterventionLevel;
  issues: Array<{ code: string; metric: string; actual: number | null; threshold: number | null }>;
  recommendedAction: {
    code: 'REMIND_STUDY_HABIT' | 'FOLLOW_UP_CLOSELY' | 'REVIEW_LEARNING_PATH' | 'WAIT_FOR_DATA' | 'NONE';
    title: string;
    priority: 0 | 1 | 2 | 3;
    messageTemplateKey: 'habit_reminder' | 'red_followup' | 'relearn_advice' | null;
  };
  actionState: { status: 'pending' | 'contacted' | 'not_applicable'; checkpoint: string; lastContactedAt: string | null };
  passEvaluation: {
    standardStatus: string;
    standardReasons: string[];
    softPassStatus: string;
    softPassGroup: string | null;
    reviewStatus: string | null;
    reviewDeadline: string | null;
  };
  teacherEvidence: { homeworkFeedback: string; orientationFeedback: string; note: string };
  dataQuality: { status: 'complete' | 'warning'; warnings: string[] };
  updatedAt: string | null;
}

export interface TeacherDashboardResponse {
  meta: { apiVersion: 'v1'; classId: number; asOf: string; generatedAt: string; thresholdVersion: string | null };
  classHeader: {
    classId: number;
    className: string;
    courseId: number;
    courseName: string;
    status: string;
    schedule: string | null;
    location: string | null;
    portalUrl: string | null;
    teacher: { teacherId: number; fullName: string; email: string };
    progress: { completedSessions: number; totalSessions: number; percentage: number | null };
    studentCounts: { total: number; active: number; onHold: number; dropped: number; transferred: number };
    lastSnapshotDate: string | null;
  };
  actionSummary: {
    level1: { count: number; label: string; actionCode: 'REMIND_STUDY_HABIT' };
    level2: { count: number; label: string; actionCode: 'FOLLOW_UP_CLOSELY' };
    level3: { count: number; label: string; actionCode: 'REVIEW_LEARNING_PATH' };
    softPassReview: { pending: number; dueSoon: number; overdue: number; slaDays: number };
  };
  tabs: { all: number; active: number; level1: number; level2: number; level3: number; noAction: number; noData: number };
  students: TeacherDashboardStudent[];
}

export interface LeadDashboardFilters {
  courseId?: 2;
  khoiId: number;
  period: string;
  classStatus?: string;
  teacherId?: number;
  classId?: number;
}

export function toLeadWeeklyTrendPoint(point: LeadTrendContractPoint) {
  return {
    weekStart: point.weekStart,
    weekEnd: point.weekEnd,
    testCheckpoint: point.classesWithTests > 0 ? `${point.classesWithTests} lớp thi` : null,
    attendanceAvg: point.attendanceAvg,
    homeworkAvg: point.homeworkAvg,
    passChuanRate: point.passStandardRate,
    passMemRate: point.softPassRate,
    classesReported: point.classesReported,
    activeStudentSample: point.activeStudentSample,
    activeStudentRoster: point.activeStudentRoster,
    classesWithTests: point.classesWithTests,
    latestDataAsOf: point.latestDataAsOf,
  };
}

export function toLeadClassPresentation(contract: LeadDashboardClass) {
  return {
    studentCounts: {
      active: contract.activeStudents,
      onHold: contract.onHoldStudents,
      dropped: contract.droppedStudents,
      transferred: contract.transferredStudents,
    },
    progress: {
      completedSessions: contract.progress.completedSessions,
      totalSessions: contract.progress.totalSessions,
      percentage: contract.progress.percentage,
    },
    healthMetrics: {
      isAlarmTriggered: contract.isAlarmTriggered,
      attendanceAverage: contract.attendanceAvg,
      homeworkAverage: contract.homeworkAvg,
      passChuanRate: contract.passStandardRate,
      passMemRate: contract.softPassRate,
    },
    labelDistribution: {
      yellow: contract.labelDistribution.yellow,
      red: contract.labelDistribution.red,
      grey: contract.labelDistribution.grey,
      noData: contract.labelDistribution.noData,
    },
    lastSyncedAt: contract.lastSnapshotDate,
    contactCoverage: contract.contactCoverage,
  };
}

function mapStandardStatus(value: string): StudentDetail['evaluation']['passChuanStatus'] {
  if (value === 'passed') return 'Đạt tiêu chuẩn';
  if (value === 'likely_pass') return 'Có khả năng pass';
  if (value === 'no_data') return 'Chưa đủ DL';
  return 'Chưa đạt điều kiện pass';
}

export function adaptTeacherStudent(
  student: TeacherDashboardStudent,
  classId: number,
  className: string,
): StudentDetail {
  return {
    studentId: student.studentId,
    fullName: student.fullName,
    phone: student.phone ?? '',
    email: student.email ?? '',
    classId,
    className,
    registrationStatus: student.registrationStatus,
    admittedAt: '',
    targetOutputStatus: 'Chưa đạt',
    attendance: {
      percentage: student.attendance.percentage,
      presentSessions: student.attendance.present,
      totalSessions: student.attendance.total,
      isDroppingRecently: student.attendance.isDropping,
    },
    homework: {
      percentage: student.homework.percentage,
      completedCount: student.homework.completed,
      totalCount: student.homework.total,
      isDroppingRecently: student.homework.isDropping,
    },
    testPerformance: {
      testsTakenCount: student.tests.taken,
      averageScore: student.tests.average,
      lastScore: student.tests.latestScore,
      trendDirection: student.tests.trend,
      scores: student.tests.scores,
      isCheatingFlagged: false,
    },
    labeling: {
      currentLabel: student.label,
      previousLabel: student.previousLabel ?? 'no_data',
      benchmarkLabel: student.label,
      hasChangedRecently: student.previousLabel !== null && student.previousLabel !== student.label,
      changeDirection: 'same',
      lastCheckpoint: student.actionState.checkpoint,
    },
    interventionLevel: student.interventionLevel,
    issues: student.issues,
    evaluation: {
      riskScore: student.recommendedAction.priority * (100 / 3),
      suggestedAction:
        student.recommendedAction.code === 'REMIND_STUDY_HABIT'
          ? 'assign_hw'
          : student.recommendedAction.code === 'REVIEW_LEARNING_PATH'
            ? 'call_parent'
            : 'none',
      passChuanStatus: mapStandardStatus(student.passEvaluation.standardStatus),
      passChuanReasons: student.passEvaluation.standardReasons,
      passMemStatus: student.passEvaluation.softPassStatus as StudentDetail['evaluation']['passMemStatus'],
      passMemGroup: (student.passEvaluation.softPassGroup ?? '') as StudentDetail['evaluation']['passMemGroup'],
      passMemLabel: '',
      isEligibleForReview: student.passEvaluation.reviewStatus !== null,
      reviewStatus: (student.passEvaluation.reviewStatus ?? '') as StudentDetail['evaluation']['reviewStatus'],
    },
    portalEvidence: {
      teacherFeedbackBtvn: student.teacherEvidence.homeworkFeedback,
      teacherFeedbackOrientation: student.teacherEvidence.orientationFeedback,
      teacherNote: student.teacherEvidence.note,
    },
    updatedAt: student.updatedAt ?? '',
  };
}

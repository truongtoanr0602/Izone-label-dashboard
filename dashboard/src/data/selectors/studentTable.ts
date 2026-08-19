import type { ContactTrigger, StudentDetail } from '../types';
import { matchesTrigger } from './contactLog';

export type StudentTableFilter = 'all' | ContactTrigger | 'pass' | 'review';
export type StudentSortDirection = 'asc' | 'desc';
export type StudentSortKey =
  | 'name'
  | 'attendance'
  | 'homework'
  | 'testAverage'
  | `test${1 | 2 | 3 | 4 | 5 | 6}`
  | 'label'
  | 'status';

export interface StudentSort {
  key: StudentSortKey;
  direction: StudentSortDirection;
}

export type StudentPassState = 'dropped' | 'no_test' | 'pass' | 'review' | 'not_passed';

export function isDroppedStudent(student: StudentDetail): boolean {
  return student.registrationStatus === 'dropped';
}

export function studentPassState(student: StudentDetail): StudentPassState {
  if (isDroppedStudent(student)) return 'dropped';
  if (student.testPerformance.testsTakenCount === 0) return 'no_test';
  if (
    student.evaluation.passChuanStatus === 'Có khả năng pass' ||
    student.evaluation.passChuanStatus === 'Đạt tiêu chuẩn' ||
    student.evaluation.passMemStatus === 'Đạt pass mềm'
  ) {
    return 'pass';
  }
  if (student.evaluation.passMemStatus === 'Xét chờ Review') return 'review';
  return 'not_passed';
}

export function matchesStudentTableFilter(
  student: StudentDetail,
  filter: StudentTableFilter,
): boolean {
  if (filter === 'all') return true;
  if (isDroppedStudent(student)) return false;

  if (
    filter === 'habit_reminder' ||
    filter === 'red_followup' ||
    filter === 'relearn_advice'
  ) {
    return matchesTrigger(student, filter);
  }
  if (filter === 'pass') {
    return (
      student.evaluation.passChuanStatus === 'Có khả năng pass' ||
      student.evaluation.passChuanStatus === 'Đạt tiêu chuẩn' ||
      student.evaluation.passMemStatus === 'Đạt pass mềm'
    );
  }
  return student.evaluation.reviewStatus === 'Chờ GV';
}

const labelOrder: Record<StudentDetail['labeling']['currentLabel'], number> = {
  green: 0,
  yellow: 1,
  red: 2,
  grey: 3,
  no_data: 4,
};

const statusOrder: Record<StudentDetail['registrationStatus'], number> = {
  on_going: 0,
  completed: 1,
  on_hold: 2,
  transferred: 3,
  pending: 4,
  queuing: 5,
  not_completed: 6,
  cancelled: 7,
  dropped: 8,
};

function sortValue(student: StudentDetail, key: StudentSortKey): number | string | null {
  if (key === 'name') return student.fullName;
  if (key === 'attendance') return student.attendance.percentage;
  if (key === 'homework') return student.homework.percentage;
  if (key === 'testAverage') return student.testPerformance.averageScore;
  if (key === 'label') return labelOrder[student.labeling.currentLabel];
  if (key === 'status') return statusOrder[student.registrationStatus];

  const testOrder = Number(key.slice(4));
  return student.testPerformance.scores.find((score) => score.testOrder === testOrder)?.finalScore ?? null;
}

export function sortStudentsForTable(
  students: StudentDetail[],
  sort?: StudentSort,
): StudentDetail[] {
  if (sort) {
    return [...students].sort((a, b) => {
      const aValue = sortValue(a, sort.key);
      const bValue = sortValue(b, sort.key);
      if (aValue === null) return bValue === null ? 0 : 1;
      if (bValue === null) return -1;

      const comparison = typeof aValue === 'string'
        ? aValue.localeCompare(String(bValue), 'vi')
        : aValue - Number(bValue);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }

  return [...students].sort((a, b) => {
    const droppedOrder = Number(isDroppedStudent(a)) - Number(isDroppedStudent(b));
    return droppedOrder || b.evaluation.riskScore - a.evaluation.riskScore;
  });
}

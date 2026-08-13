import { describe, expect, it } from 'vitest';
import type { ClassSummary } from '../../data/types';
import { groupClassesByCourse } from './classGrouping';

function classSummary(
  className: string,
  courseName: string,
  classId: number,
): ClassSummary {
  return {
    classId,
    className,
    courseId: 2,
    courseName,
    teacher: { teacherId: 1, fullName: 'GV', email: '', phone: '' },
    leadEmail: '',
    status: 'on_going',
    schedule: '',
    openingDate: '',
    endingDate: '',
    progress: { completedSessions: 0, totalSessions: 28, percentage: 0 },
    studentCounts: { active: 0, onHold: 0, dropped: 0, transferred: 0, totalEnrolled: 0 },
    healthMetrics: {
      classRiskLevel: 'low',
      healthScore: null,
      isAlarmTriggered: false,
      attendanceAverage: null,
      homeworkAverage: null,
      passChuanRate: null,
      passMemRate: null,
    },
    labelDistribution: { grey: 0, red: 0, yellow: 0, noData: 0, netMomentum: 0 },
    actionItems: { urgentCallsNeeded: 0, homeworkRemindersNeeded: 0, pendingPassReviews: 0 },
    portalUrl: '',
    lastSyncedAt: '',
  };
}

describe('groupClassesByCourse', () => {
  it('groups by courseName and sorts class codes naturally', () => {
    const groups = groupClassesByCourse([
      classSummary('IC10', 'IELTS', 10),
      classSummary('FT1', 'IELTS Nền Tảng', 1),
      classSummary('IC2', 'IELTS', 2),
    ]);

    expect(groups.map((group) => group.courseName)).toEqual([
      'IELTS',
      'IELTS Nền Tảng',
    ]);
    expect(groups[0].classes.map((item) => item.className)).toEqual([
      'IC2',
      'IC10',
    ]);
  });

  it('places blank course names in a stable fallback group', () => {
    const groups = groupClassesByCourse([
      classSummary('X1', '   ', 1),
      classSummary('X2', '', 2),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].courseName).toBe('Khóa học khác');
  });
});

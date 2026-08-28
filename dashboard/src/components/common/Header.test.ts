import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ClassSummary } from '../../data/types';
import { Header } from './Header';

const selectedClass: ClassSummary = {
  classId: 1159,
  className: 'IC2174',
  courseId: 2,
  courseName: 'Khối 3-4',
  teacher: { teacherId: 305, fullName: 'GV A', email: 'a@izone.edu.vn', phone: '0900000000' },
  leadEmail: '',
  status: 'on_going',
  schedule: '3,6',
  openingDate: '',
  endingDate: '',
  progress: { completedSessions: 12, totalSessions: 27, percentage: 44.4 },
  studentCounts: { totalEnrolled: 11, active: 10, onHold: 1, dropped: 0, transferred: 0 },
  healthMetrics: {
    classRiskLevel: 'low',
    healthScore: 88,
    isAlarmTriggered: false,
    attendanceAverage: 90,
    homeworkAverage: 88,
    passChuanRate: 70,
    passMemRate: 10,
  },
  labelDistribution: { yellow: 6, red: 3, grey: 1, noData: 1, netMomentum: 0 },
  actionItems: { urgentCallsNeeded: 0, homeworkRemindersNeeded: 0, pendingPassReviews: 0 },
  portalUrl: '',
  lastSyncedAt: '2026-08-12T00:00:00.000Z',
};

describe('Header Portal link', () => {
  it('renders a disabled control instead of a self-navigation link when the class has no Portal URL', () => {
    const markup = renderToStaticMarkup(createElement(Header, {
      classes: [],
      selectedClass,
      onSelectClass: () => undefined,
      isDarkMode: false,
      onToggleDarkMode: () => undefined,
      isSidebarCollapsed: false,
      onToggleSidebar: () => undefined,
      currentMonthKey: '2026-08',
      onSelectReportPeriod: () => undefined,
    }));

    expect(markup).toContain('disabled');
    expect(markup).not.toContain('href=""');
  });
});

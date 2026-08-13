import { describe, expect, it } from 'vitest';
import { currentHabitMetrics } from './studentMetricModel';

describe('currentHabitMetrics', () => {
  it('returns only current count-backed measurements and their snapshot date', () => {
    expect(
      currentHabitMetrics({
        recordDate: '2026-08-12',
        attendance: {
          percentage: 80,
          presentSessions: 8,
          totalSessions: 10,
        },
        homework: {
          percentage: 66.7,
          completedCount: 2,
          totalCount: 3,
        },
        warnings: ['ATTENDANCE_SOURCE_PERCENT_MISMATCH'],
      }),
    ).toEqual([
      {
        key: 'attendance',
        title: 'Chuyên cần',
        percentage: 80,
        done: 8,
        total: 10,
        unit: 'buổi',
        recordDate: '2026-08-12',
        hasWarning: true,
        warningMessage: 'Đã tính lại từ số lượng nguồn',
      },
      {
        key: 'homework',
        title: 'Bài tập VN',
        percentage: 66.7,
        done: 2,
        total: 3,
        unit: 'bài',
        recordDate: '2026-08-12',
        hasWarning: false,
        warningMessage: null,
      },
    ]);
  });

  it('keeps missing current measurements null instead of creating chart points', () => {
    const result = currentHabitMetrics({
      recordDate: null,
      attendance: {
        percentage: null,
        presentSessions: 0,
        totalSessions: 0,
      },
      homework: {
        percentage: null,
        completedCount: 0,
        totalCount: 0,
      },
      warnings: ['MISSING_ATTENDANCE_DATA', 'MISSING_HOMEWORK_DATA'],
    });

    expect(result.map((metric) => metric.percentage)).toEqual([null, null]);
    expect(result.map((metric) => metric.recordDate)).toEqual([null, null]);
    expect(result.map((metric) => metric.warningMessage)).toEqual([
      'Chưa có dữ liệu điểm danh tại ngày chốt',
      'Chưa có dữ liệu BTVN tại ngày chốt',
    ]);
  });

  it('distinguishes invalid counts from a corrected source percentage', () => {
    const result = currentHabitMetrics({
      recordDate: '2026-08-12',
      attendance: {
        percentage: null,
        presentSessions: 3,
        totalSessions: 2,
      },
      homework: {
        percentage: 100,
        completedCount: 2,
        totalCount: 2,
      },
      warnings: [
        'INVALID_ATTENDANCE_COUNTS',
        'HOMEWORK_SOURCE_PERCENT_MISMATCH',
      ],
    });

    expect(result.map((metric) => metric.warningMessage)).toEqual([
      'Số lượng điểm danh nguồn không hợp lệ',
      'Đã tính lại từ số lượng nguồn',
    ]);
  });
});

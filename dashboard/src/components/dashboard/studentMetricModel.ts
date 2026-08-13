export interface HabitMetricInput {
  recordDate: string | null;
  attendance: {
    percentage: number | null;
    presentSessions: number | null;
    totalSessions: number | null;
  };
  homework: {
    percentage: number | null;
    completedCount: number | null;
    totalCount: number | null;
  };
  warnings: string[];
}

export interface CurrentHabitMetric {
  key: 'attendance' | 'homework';
  title: string;
  percentage: number | null;
  done: number | null;
  total: number | null;
  unit: 'buổi' | 'bài';
  recordDate: string | null;
  hasWarning: boolean;
  warningMessage: string | null;
}

function metricWarningMessage(
  key: 'ATTENDANCE' | 'HOMEWORK',
  warnings: string[],
): string | null {
  if (warnings.includes(`MISSING_${key}_DATA`)) {
    return key === 'ATTENDANCE'
      ? 'Chưa có dữ liệu điểm danh tại ngày chốt'
      : 'Chưa có dữ liệu BTVN tại ngày chốt';
  }
  if (warnings.includes(`INVALID_${key}_COUNTS`)) {
    return key === 'ATTENDANCE'
      ? 'Số lượng điểm danh nguồn không hợp lệ'
      : 'Số lượng BTVN nguồn không hợp lệ';
  }
  return warnings.includes(`${key}_SOURCE_PERCENT_MISMATCH`)
    ? 'Đã tính lại từ số lượng nguồn'
    : null;
}

export function currentHabitMetrics(
  input: HabitMetricInput,
): CurrentHabitMetric[] {
  const attendanceWarning = metricWarningMessage(
    'ATTENDANCE',
    input.warnings,
  );
  const homeworkWarning = metricWarningMessage('HOMEWORK', input.warnings);
  return [
    {
      key: 'attendance',
      title: 'Chuyên cần',
      percentage: input.attendance.percentage,
      done: input.attendance.presentSessions,
      total: input.attendance.totalSessions,
      unit: 'buổi',
      recordDate: input.recordDate,
      hasWarning: attendanceWarning !== null,
      warningMessage: attendanceWarning,
    },
    {
      key: 'homework',
      title: 'Bài tập VN',
      percentage: input.homework.percentage,
      done: input.homework.completedCount,
      total: input.homework.totalCount,
      unit: 'bài',
      recordDate: input.recordDate,
      hasWarning: homeworkWarning !== null,
      warningMessage: homeworkWarning,
    },
  ];
}

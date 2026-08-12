export interface LeadDashboardQuery {
  period?: string;
  courseId?: string;
  khoiId?: string;
  from?: string;
  to?: string;
  classStatus?: string;
  teacherId?: string;
  classId?: string;
}

export type MetricDirection = 'improving' | 'declining' | 'stable' | 'unknown';

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

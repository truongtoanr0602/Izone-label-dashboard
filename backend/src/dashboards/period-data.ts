type SnapshotEvidence = { snapshot_date: unknown };
type StudentMetricEvidence = { record_date: unknown };

function periodOf(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 7);
  }
  if (typeof value !== 'string') return null;
  return /^\d{4}-\d{2}/.test(value) ? value.slice(0, 7) : null;
}

export function hasLeadPeriodData(
  snapshots: SnapshotEvidence[],
  studentMetrics: StudentMetricEvidence[],
  period: string,
): boolean {
  return (
    snapshots.some((row) => periodOf(row.snapshot_date) === period) ||
    studentMetrics.some((row) => periodOf(row.record_date) === period)
  );
}

export function emptyDashboardMetric(totalClasses: number): DashboardMetric {
  return {
    value: null,
    baselineValue: null,
    delta: null,
    direction: 'unknown',
    sampleSize: 0,
    classesReported: 0,
    comparableClasses: 0,
    totalClasses,
  };
}
import type { DashboardMetric } from './dashboard.types';

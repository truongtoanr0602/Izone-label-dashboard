export type TrendMetric = 'attendanceAvg' | 'homeworkAvg' | 'passChuanRate' | 'passMemRate';

export interface WeeklyTrendPoint {
  weekStart: string;
  weekEnd: string;
  testCheckpoint: string | null;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passChuanRate: number | null;
  passMemRate: number | null;
  classesReported: number;
  activeStudentSample: number;
  activeStudentRoster: number | null;
  classesWithTests: number;
  latestDataAsOf: string | null;
}

export interface TrendChartRow extends WeeklyTrendPoint {
  weekLabel: string;
  attendanceAvgLabel: string;
  homeworkAvgLabel: string;
  passChuanRateLabel: string;
  passMemRateLabel: string;
}

const SERIES_NAMES: Record<TrendMetric, string> = {
  attendanceAvg: 'Điểm danh',
  homeworkAvg: 'BTVN',
  passChuanRate: 'Pass chuẩn',
  passMemRate: 'Pass mềm',
};

function shortDate(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

export function toTrendChartRows(points: WeeklyTrendPoint[]): TrendChartRow[] {
  const sorted = [...points].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  const lastValueIndex = new Map<TrendMetric, number>();

  (Object.keys(SERIES_NAMES) as TrendMetric[]).forEach((metric) => {
    let index = -1;
    sorted.forEach((point, pointIndex) => {
      if (point[metric] !== null) index = pointIndex;
    });
    lastValueIndex.set(metric, index);
  });

  return sorted.map((point, index) => ({
    ...point,
    weekLabel: `${shortDate(point.weekStart)}–${shortDate(point.weekEnd)}`,
    attendanceAvgLabel: index === lastValueIndex.get('attendanceAvg') ? SERIES_NAMES.attendanceAvg : '',
    homeworkAvgLabel: index === lastValueIndex.get('homeworkAvg') ? SERIES_NAMES.homeworkAvg : '',
    passChuanRateLabel: index === lastValueIndex.get('passChuanRate') ? SERIES_NAMES.passChuanRate : '',
    passMemRateLabel: index === lastValueIndex.get('passMemRate') ? SERIES_NAMES.passMemRate : '',
  }));
}

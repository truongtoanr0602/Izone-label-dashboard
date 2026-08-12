export interface LeadSnapshotRow {
  classId: number;
  date: string;
  activeStudents: number;
  onHoldStudents: number;
  droppedStudents: number;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passStandardRate: number | null;
  softPassRate: number | null;
  riskStudents: number;
  hasTestSample: boolean;
}

export interface LabelTransitionRow {
  date: string;
  studentId: number;
  classId: number;
  direction: 'up' | 'down';
}

export interface LeadTrendPoint {
  date: string;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passStandardRate: number | null;
  softPassRate: number | null;
  riskRate: number | null;
  activeStudents: number | null;
  classesReported: number;
  classesWithTests: number;
  upTransitions: number;
  downTransitions: number;
  netMomentum: number | null;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;
const DAY_MS = 86_400_000;

export interface ReportCalendar {
  period: string;
  reportAsOf: string;
  previousAsOf: string;
  trendFrom: string;
  currentAsOf: string;
}

export interface LeadWeeklyTrendPoint {
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
  classesWithTests: number;
  latestDataAsOf: string | null;
  upTransitions: number;
  downTransitions: number;
  netMomentum: number | null;
}

export interface LeadMonthlyMetrics {
  attendanceAvg: DashboardMetric;
  homeworkAvg: DashboardMetric;
  passStandardRate: DashboardMetric;
  softPassRate: DashboardMetric;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function monthEnd(period: string): string {
  const [year, month] = period.split('-').map(Number);
  return iso(new Date(Date.UTC(year, month, 0)));
}

function previousMonth(period: string): string {
  const [year, month] = period.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 2, 1));
  return iso(date).slice(0, 7);
}

export function parseReportPeriod(
  periodInput: string | undefined,
  todayIso: string,
): ReportCalendar {
  const period = periodInput ?? todayIso.slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(period)) {
    throw new Error('period must use YYYY-MM');
  }
  const [year, month] = period.split('-').map(Number);
  if (month < 1 || month > 12) throw new Error('period is not valid');
  const normalized = `${year}-${String(month).padStart(2, '0')}`;
  const currentPeriod = todayIso.slice(0, 7);
  if (normalized > currentPeriod)
    throw new Error('period cannot be in the future');
  const reportAsOf =
    normalized === currentPeriod ? todayIso : monthEnd(normalized);
  const trendStart = new Date(`${reportAsOf}T00:00:00Z`);
  trendStart.setUTCDate(trendStart.getUTCDate() - 89);
  return {
    period: normalized,
    reportAsOf,
    previousAsOf: monthEnd(previousMonth(normalized)),
    trendFrom: iso(trendStart),
    currentAsOf: todayIso,
  };
}

type MetricKey = 'attendance' | 'homework' | 'passStandard' | 'softPass';

function weightedResolved(
  rows: ResolvedClassObservation[],
  key: MetricKey,
): { value: number | null; sampleSize: number; classes: number } {
  const valid = rows.filter(
    (row) => row.roster.activeStudents > 0 && row[key].value !== null,
  );
  const denominator = valid.reduce(
    (sum, row) => sum + row.roster.activeStudents,
    0,
  );
  return {
    value:
      denominator === 0
        ? null
        : round1(
            valid.reduce(
              (sum, row) =>
                sum + Number(row[key].value) * row.roster.activeStudents,
              0,
            ) / denominator,
          ),
    sampleSize: valid.reduce((sum, row) => sum + row[key].sampleSize, 0),
    classes: valid.length,
  };
}

function direction(delta: number | null) {
  if (delta === null) return 'unknown' as const;
  if (delta === 0) return 'stable' as const;
  return delta > 0 ? ('improving' as const) : ('declining' as const);
}

function compareMetric(
  current: ResolvedClassObservation[],
  previous: ResolvedClassObservation[],
  key: MetricKey,
): DashboardMetric {
  const previousByClass = new Map(previous.map((row) => [row.classId, row]));
  const comparableCurrent = current.filter((row) => {
    const before = previousByClass.get(row.classId);
    return (
      row[key].value !== null &&
      before !== undefined &&
      before[key].value !== null
    );
  });
  const comparableIds = new Set(comparableCurrent.map((row) => row.classId));
  const comparablePrevious = previous.filter((row) =>
    comparableIds.has(row.classId),
  );
  const allCurrent = weightedResolved(current, key);
  const currentComparable = weightedResolved(comparableCurrent, key).value;
  const previousComparable = weightedResolved(comparablePrevious, key).value;
  const delta =
    currentComparable === null || previousComparable === null
      ? null
      : round1(currentComparable - previousComparable);
  return {
    value: allCurrent.value,
    baselineValue: previousComparable,
    delta,
    direction: direction(delta),
    sampleSize: allCurrent.sampleSize,
    classesReported: allCurrent.classes,
    comparableClasses: comparableCurrent.length,
    totalClasses: current.length,
    ...(key === 'passStandard' || key === 'softPass'
      ? { classesWithTests: allCurrent.classes }
      : {}),
  };
}

export function compareMonthlyMetrics(
  current: ResolvedClassObservation[],
  previous: ResolvedClassObservation[],
): LeadMonthlyMetrics {
  return {
    attendanceAvg: compareMetric(current, previous, 'attendance'),
    homeworkAvg: compareMetric(current, previous, 'homework'),
    passStandardRate: compareMetric(current, previous, 'passStandard'),
    softPassRate: compareMetric(current, previous, 'softPass'),
  };
}

function ageInDays(asOf: string, source: string | null): number | null {
  if (!source) return null;
  return Math.floor(
    (new Date(`${asOf}T00:00:00Z`).getTime() -
      new Date(`${source}T00:00:00Z`).getTime()) /
      DAY_MS,
  );
}

function fresh(metric: ResolvedMetric, asOf: string): boolean {
  const age = ageInDays(asOf, metric.dataAsOf);
  return metric.value !== null && age !== null && age >= 0 && age <= 7;
}

function weeklyWeighted(
  rows: ResolvedClassObservation[],
  key: MetricKey,
  asOf: string,
) {
  return weightedResolved(
    rows.map((row) =>
      fresh(row[key], asOf)
        ? row
        : { ...row, [key]: { ...row[key], value: null } },
    ),
    key,
  );
}

export function buildWeeklyTrend(
  evidence: ClassObservationEvidence[],
  calendar: Pick<ReportCalendar, 'trendFrom' | 'reportAsOf'>,
): LeadWeeklyTrendPoint[] {
  const rangeStart = new Date(`${calendar.trendFrom}T00:00:00Z`);
  const reportEnd = new Date(`${calendar.reportAsOf}T00:00:00Z`);
  const firstWeek = new Date(rangeStart);
  const dayFromMonday = (firstWeek.getUTCDay() + 6) % 7;
  firstWeek.setUTCDate(firstWeek.getUTCDate() - dayFromMonday);
  const result: LeadWeeklyTrendPoint[] = [];

  for (
    const cursor = firstWeek;
    cursor <= reportEnd;
    cursor.setUTCDate(cursor.getUTCDate() + 7)
  ) {
    const weekStart = iso(cursor);
    const sunday = new Date(cursor);
    sunday.setUTCDate(sunday.getUTCDate() + 6);
    const weekEnd = iso(sunday > reportEnd ? reportEnd : sunday);
    const rows = evidence.map((item) => resolveClassObservation(item, weekEnd));
    const attendance = weeklyWeighted(rows, 'attendance', weekEnd);
    const homework = weeklyWeighted(rows, 'homework', weekEnd);
    const passStandard = weeklyWeighted(rows, 'passStandard', weekEnd);
    const softPass = weeklyWeighted(rows, 'softPass', weekEnd);
    const reportRows = rows.filter(
      (row) => fresh(row.attendance, weekEnd) || fresh(row.homework, weekEnd),
    );
    const sourceDates = rows.flatMap((row) =>
      [row.attendance, row.homework, row.passStandard, row.softPass]
        .filter((metric) => fresh(metric, weekEnd))
        .map((metric) => metric.dataAsOf)
        .filter((value): value is string => value !== null),
    );

    result.push({
      weekStart,
      weekEnd,
      attendanceAvg: attendance.value,
      homeworkAvg: homework.value,
      passStandardRate: passStandard.value,
      softPassRate: softPass.value,
      riskRate: null,
      activeStudents:
        reportRows.length === 0
          ? null
          : reportRows.reduce((sum, row) => sum + row.roster.activeStudents, 0),
      classesReported: reportRows.length,
      activeStudentSample: rows
        .filter((row) => fresh(row.attendance, weekEnd))
        .reduce((sum, row) => sum + row.roster.activeStudents, 0),
      classesWithTests: passStandard.classes,
      latestDataAsOf: sourceDates.sort().at(-1) ?? null,
      upTransitions: 0,
      downTransitions: 0,
      netMomentum: null,
    });
  }

  return result;
}

export function aggregateSnapshots(rows: LeadSnapshotRow[]) {
  const withStudents = rows.filter((row) => row.activeStudents > 0);
  const activeStudents = withStudents.reduce(
    (sum, row) => sum + row.activeStudents,
    0,
  );

  const weighted = (
    pick: (row: LeadSnapshotRow) => number | null,
  ): number | null => {
    const valid = withStudents.filter((row) => pick(row) !== null);
    const denominator = valid.reduce((sum, row) => sum + row.activeStudents, 0);
    if (denominator === 0) return null;
    return round1(
      valid.reduce(
        (sum, row) => sum + Number(pick(row)) * row.activeStudents,
        0,
      ) / denominator,
    );
  };

  const tested = withStudents.filter((row) => row.hasTestSample);
  const testedActiveStudents = tested.reduce(
    (sum, row) => sum + row.activeStudents,
    0,
  );
  const weightedTested = (
    pick: (row: LeadSnapshotRow) => number | null,
  ): number | null => {
    const valid = tested.filter((row) => pick(row) !== null);
    const denominator = valid.reduce((sum, row) => sum + row.activeStudents, 0);
    if (denominator === 0) return null;
    return round1(
      valid.reduce(
        (sum, row) => sum + Number(pick(row)) * row.activeStudents,
        0,
      ) / denominator,
    );
  };

  const riskStudents = withStudents.reduce(
    (sum, row) => sum + row.riskStudents,
    0,
  );

  return {
    totalClasses: rows.length,
    activeStudents,
    droppedStudents: rows.reduce((sum, row) => sum + row.droppedStudents, 0),
    attendanceAvg: weighted((row) => row.attendanceAvg),
    homeworkAvg: weighted((row) => row.homeworkAvg),
    passStandardRate: weightedTested((row) => row.passStandardRate),
    softPassRate: weightedTested((row) => row.softPassRate),
    riskRate:
      activeStudents === 0
        ? null
        : round1((riskStudents / activeStudents) * 100),
    classesWithTests: tested.length,
    testedActiveStudents,
  };
}

export function calculateAttrition(
  startRows: LeadSnapshotRow[],
  endRows: LeadSnapshotRow[],
) {
  const startByClass = new Map(startRows.map((row) => [row.classId, row]));
  let newDroppedStudents = 0;
  let startingActiveStudents = 0;

  for (const end of endRows) {
    const start = startByClass.get(end.classId);
    if (!start) continue;
    startingActiveStudents += start.activeStudents;
    newDroppedStudents += Math.max(
      0,
      end.droppedStudents - start.droppedStudents,
    );
  }

  return {
    newDroppedStudents,
    periodAttritionRate:
      startingActiveStudents === 0
        ? null
        : round1((newDroppedStudents / startingActiveStudents) * 100),
  };
}

export function calculateNetMomentum(transitions: LabelTransitionRow[]) {
  const upTransitions = transitions.filter(
    (row) => row.direction === 'up',
  ).length;
  const downTransitions = transitions.filter(
    (row) => row.direction === 'down',
  ).length;
  const recalculationEvents = new Set(
    transitions.map((row) => `${row.classId}:${row.date}`),
  ).size;

  return {
    value: transitions.length === 0 ? null : upTransitions - downTransitions,
    upTransitions,
    downTransitions,
    studentsChanged: new Set(transitions.map((row) => row.studentId)).size,
    recalculationEvents,
    classesWithTests: new Set(transitions.map((row) => row.classId)).size,
  };
}

export function buildTrend(
  rows: LeadSnapshotRow[],
  transitions: LabelTransitionRow[],
  from: string,
  to: string,
): LeadTrendPoint[] {
  const rowsByDate = new Map<string, LeadSnapshotRow[]>();
  for (const row of rows) {
    const current = rowsByDate.get(row.date) ?? [];
    current.push(row);
    rowsByDate.set(row.date, current);
  }

  const transitionsByDate = new Map<string, LabelTransitionRow[]>();
  for (const transition of transitions) {
    const current = transitionsByDate.get(transition.date) ?? [];
    current.push(transition);
    transitionsByDate.set(transition.date, current);
  }

  const result: LeadTrendPoint[] = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);

  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    const dateRows = rowsByDate.get(date) ?? [];
    const aggregate = aggregateSnapshots(dateRows);
    const momentum = calculateNetMomentum(transitionsByDate.get(date) ?? []);

    result.push({
      date,
      attendanceAvg: aggregate.attendanceAvg,
      homeworkAvg: aggregate.homeworkAvg,
      passStandardRate: aggregate.passStandardRate,
      softPassRate: aggregate.softPassRate,
      riskRate: aggregate.riskRate,
      activeStudents: dateRows.length === 0 ? null : aggregate.activeStudents,
      classesReported: dateRows.length,
      classesWithTests: aggregate.classesWithTests,
      upTransitions: momentum.upTransitions,
      downTransitions: momentum.downTransitions,
      netMomentum: momentum.value,
    });

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}
import type { DashboardMetric } from './dashboard.types';
import {
  resolveClassObservation,
  type ClassObservationEvidence,
  type ResolvedClassObservation,
  type ResolvedMetric,
} from './snapshot-quality';

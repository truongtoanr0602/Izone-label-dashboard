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

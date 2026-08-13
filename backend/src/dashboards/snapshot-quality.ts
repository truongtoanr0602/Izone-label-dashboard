export type DataQualityWarning =
  | 'PARTIAL_SNAPSHOT'
  | 'LOW_ATTENDANCE_COVERAGE'
  | 'LOW_HOMEWORK_COVERAGE'
  | 'NO_TEST_SAMPLE'
  | 'PROGRESS_HISTORY_INCOMPLETE'
  | 'FUTURE_ROWS_EXCLUDED';

export interface ClassSnapshotEvidence {
  date: string;
  activeStudents: number;
  onHoldStudents: number;
  droppedStudents: number;
  transferredStudents: number;
  completedSessions: number;
  totalSessions: number;
}

export interface StudentMetricEvidence {
  date: string;
  recordCount: number;
  attendanceSampleSize: number;
  attendanceAvg: number | null;
  homeworkSampleSize: number;
  homeworkAvg: number | null;
  testedStudents: number;
  passStandardStudents: number;
  softPassStudents: number;
}

export interface ClassObservationEvidence {
  classId: number;
  className: string;
  classTotalSessions: number;
  snapshots: ClassSnapshotEvidence[];
  studentMetrics: StudentMetricEvidence[];
}

export interface ResolvedMetric {
  value: number | null;
  dataAsOf: string | null;
  sampleSize: number;
  recordCount: number;
  coveragePct: number | null;
  fallbackUsed: boolean;
}

export interface ResolvedPassMetric extends ResolvedMetric {
  testedStudents: number;
  qualifiedStudents: number;
}

export interface ResolvedClassObservation {
  classId: number;
  className: string;
  asOf: string;
  roster: {
    activeStudents: number;
    onHoldStudents: number;
    droppedStudents: number;
    transferredStudents: number;
    dataAsOf: string | null;
  };
  progress: {
    completedSessions: number;
    totalSessions: number;
    percentage: number | null;
    dataAsOf: string | null;
  };
  attendance: ResolvedMetric;
  homework: ResolvedMetric;
  passStandard: ResolvedPassMetric;
  softPass: ResolvedPassMetric;
  dataQuality: {
    status: 'complete' | 'fallback' | 'insufficient';
    warnings: DataQualityWarning[];
    rosterAsOf: string | null;
    progressAsOf: string | null;
    attendanceAsOf: string | null;
    homeworkAsOf: string | null;
    passAsOf: string | null;
  };
}

/**
 * Dưới mức này thì gắn cảnh báo lên lớp — nhưng KHÔNG loại lớp khỏi số liệu.
 * Đây là ngưỡng để nói với người dùng "số này mỏng", không phải để giấu số.
 */
const LOW_COVERAGE_WARNING_PCT = 80;

const round1 = (value: number): number => Math.round(value * 10) / 10;

const latestFirst = <T extends { date: string }>(rows: T[]): T[] =>
  [...rows].sort((a, b) => b.date.localeCompare(a.date));

const emptyMetric = (): ResolvedMetric => ({
  value: null,
  dataAsOf: null,
  sampleSize: 0,
  recordCount: 0,
  coveragePct: null,
  fallbackUsed: false,
});

/**
 * Bản ghi mới nhất CÓ số cho chỉ số này.
 *
 * Không còn ngưỡng độ phủ tối thiểu. Ngưỡng cũ (80%) loại cả lớp khi chỉ một
 * phần học viên có dữ liệu — nó chỉ tồn tại để bù cho việc trung bình toàn
 * khối cân theo sĩ số lớp thay vì theo số HV thực sự có số. Khi trọng số đã
 * đúng (xem `weightedResolved` trong lead-aggregation.ts) thì ngưỡng này chỉ
 * còn tác dụng giấu bớt lớp: 8/17 lớp biến mất khỏi biểu đồ dù có dữ liệu.
 *
 * `coveragePct` vẫn được tính, nhưng giờ là SỐ ĐỂ HIỂN THỊ — Lead tự đánh giá
 * độ tin cậy thay vì bị hệ thống âm thầm quyết hộ.
 */
function resolveCoveredMetric(
  rows: StudentMetricEvidence[],
  rosterDate: string | null,
  kind: 'attendance' | 'homework',
): ResolvedMetric {
  const sampleKey =
    kind === 'attendance' ? 'attendanceSampleSize' : 'homeworkSampleSize';
  const valueKey = kind === 'attendance' ? 'attendanceAvg' : 'homeworkAvg';
  const row = rows.find(
    (candidate) =>
      candidate.recordCount > 0 &&
      candidate[sampleKey] > 0 &&
      candidate[valueKey] !== null,
  );
  if (!row) return emptyMetric();
  return {
    value: round1(Number(row[valueKey])),
    dataAsOf: row.date,
    sampleSize: row[sampleKey],
    recordCount: row.recordCount,
    coveragePct: round1((row[sampleKey] / row.recordCount) * 100),
    fallbackUsed:
      row.date !== rows[0]?.date ||
      (rosterDate !== null && row.date < rosterDate),
  };
}

/**
 * Tỷ lệ pass tính trên SỐ HỌC VIÊN ĐÃ THI, không phải tổng sĩ số.
 *
 * Trả lời câu "trong số HV đã thi, bao nhiêu phần trăm đạt". Chia cho tổng sĩ
 * số sẽ trộn hai chuyện khác nhau — HV thi trượt và HV chưa thi — vào cùng
 * một con số, và kéo tỷ lệ xuống giả tạo ở các lớp mới học được vài buổi.
 */
function resolvePassMetric(
  rows: StudentMetricEvidence[],
  rosterDate: string | null,
  passedKey: 'passStandardStudents' | 'softPassStudents',
): ResolvedPassMetric {
  const row = rows.find(
    (candidate) => candidate.recordCount > 0 && candidate.testedStudents > 0,
  );
  if (!row) {
    return { ...emptyMetric(), testedStudents: 0, qualifiedStudents: 0 };
  }
  return {
    value: round1((row[passedKey] / row.testedStudents) * 100),
    dataAsOf: row.date,
    sampleSize: row.testedStudents,
    recordCount: row.recordCount,
    coveragePct: round1((row.testedStudents / row.recordCount) * 100),
    fallbackUsed:
      row.date !== rows[0]?.date ||
      (rosterDate !== null && row.date < rosterDate),
    testedStudents: row.testedStudents,
    qualifiedStudents: row[passedKey],
  };
}

export function resolveClassObservation(
  input: ClassObservationEvidence,
  asOf: string,
): ResolvedClassObservation {
  const futureRowsExist =
    input.snapshots.some((row) => row.date > asOf) ||
    input.studentMetrics.some((row) => row.date > asOf);
  const snapshots = latestFirst(
    input.snapshots.filter((row) => row.date <= asOf),
  );
  const studentMetrics = latestFirst(
    input.studentMetrics.filter((row) => row.date <= asOf),
  );
  const rosterRow = snapshots[0];
  const rosterDate = rosterRow?.date ?? null;

  const totalSessions = Math.max(
    0,
    Number(input.classTotalSessions || 0),
    ...snapshots.map((row) => Number(row.totalSessions || 0)),
  );
  const progressRow = [...snapshots].sort((a, b) => {
    const completedDelta =
      Number(b.completedSessions || 0) - Number(a.completedSessions || 0);
    return completedDelta !== 0 ? completedDelta : b.date.localeCompare(a.date);
  })[0];
  const completedSessions = Math.min(
    totalSessions || Number(progressRow?.completedSessions || 0),
    Math.max(0, Number(progressRow?.completedSessions || 0)),
  );

  const attendance = resolveCoveredMetric(studentMetrics, rosterDate, 'attendance');
  const homework = resolveCoveredMetric(studentMetrics, rosterDate, 'homework');
  const passStandard = resolvePassMetric(
    studentMetrics,
    rosterDate,
    'passStandardStudents',
  );
  const softPass = resolvePassMetric(
    studentMetrics,
    rosterDate,
    'softPassStudents',
  );

  const warnings = new Set<DataQualityWarning>();
  if (futureRowsExist) warnings.add('FUTURE_ROWS_EXCLUDED');
  const newestMetrics = studentMetrics[0];
  if (
    newestMetrics &&
    newestMetrics.recordCount > 0 &&
    (newestMetrics.attendanceSampleSize / newestMetrics.recordCount) * 100 <
      LOW_COVERAGE_WARNING_PCT
  ) {
    warnings.add('LOW_ATTENDANCE_COVERAGE');
  }
  if (
    newestMetrics &&
    newestMetrics.recordCount > 0 &&
    (newestMetrics.homeworkSampleSize / newestMetrics.recordCount) * 100 <
      LOW_COVERAGE_WARNING_PCT
  ) {
    warnings.add('LOW_HOMEWORK_COVERAGE');
  }
  if (passStandard.value === null) warnings.add('NO_TEST_SAMPLE');
  if (
    rosterDate &&
    (attendance.dataAsOf !== rosterDate ||
      homework.dataAsOf !== rosterDate ||
      progressRow?.date !== rosterDate)
  ) {
    warnings.add('PARTIAL_SNAPSHOT');
  }
  if (
    progressRow &&
    completedSessions <= 1 &&
    totalSessions > 1 &&
    snapshots.length > 1
  ) {
    warnings.add('PROGRESS_HISTORY_INCOMPLETE');
  }

  const insufficient = attendance.value === null || homework.value === null;
  const fallback =
    attendance.fallbackUsed ||
    homework.fallbackUsed ||
    passStandard.fallbackUsed ||
    progressRow?.date !== rosterDate ||
    warnings.size > 0;

  return {
    classId: input.classId,
    className: input.className,
    asOf,
    roster: {
      activeStudents: Number(rosterRow?.activeStudents ?? 0),
      onHoldStudents: Number(rosterRow?.onHoldStudents ?? 0),
      droppedStudents: Number(rosterRow?.droppedStudents ?? 0),
      transferredStudents: Number(rosterRow?.transferredStudents ?? 0),
      dataAsOf: rosterDate,
    },
    progress: {
      completedSessions,
      totalSessions,
      percentage:
        totalSessions === 0
          ? null
          : round1((completedSessions / totalSessions) * 100),
      dataAsOf: progressRow?.date ?? null,
    },
    attendance,
    homework,
    passStandard,
    softPass,
    dataQuality: {
      status: insufficient
        ? 'insufficient'
        : fallback
          ? 'fallback'
          : 'complete',
      warnings: [...warnings],
      rosterAsOf: rosterDate,
      progressAsOf: progressRow?.date ?? null,
      attendanceAsOf: attendance.dataAsOf,
      homeworkAsOf: homework.dataAsOf,
      passAsOf: passStandard.dataAsOf,
    },
  };
}

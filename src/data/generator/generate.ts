/**
 * Sinh toàn bộ dữ liệu mock từ kịch bản trong classPlan.ts.
 *
 * Nguyên tắc xuyên suốt: SNAPSHOT LÀ NGUỒN SỰ THẬT.
 *
 * Mọi con số tổng hợp cấp lớp và cấp khối đều tính ra từ danh sách học viên
 * rồi cuộn lên snapshot, chứ không ghi tay độc lập. Nhờ vậy không thể xảy ra
 * chuyện thẻ KPI nói một đằng còn biểu đồ nói một nẻo — lỗi mà bản mock cũ
 * mắc phải vì các con số cấp lớp được gõ cứng, không dẫn xuất từ HV nào.
 */

import type {
  ClassSnapshot,
  ClassSummary,
  LabelChangeLog,
  LabelCode,
  PendingReviewEnriched,
  StudentDetail,
  SystemConfig,
  Teacher,
  TestScore,
} from '../types';
import { clamp, createRng, round1, type Rng } from './rng';
import {
  fakeEmail,
  fakePhone,
  fakeTeacherEmail,
  FAMILY_NAMES,
  GIVEN_NAMES,
  initialsOf,
  LONG_NAME_PROBE,
  MIDDLE_NAMES,
} from './names';
import {
  ACTIVE_CLASS_PLANS,
  ARCHETYPES,
  CALENDAR_SHOCK,
  HISTORICAL_CLASS_PLANS,
  LEAD_TEACHER_ID,
  REFERENCE_DATE,
  SESSIONS_PER_WEEK,
  TEACHER_PLANS,
  TEST_DIFFICULTY_OFFSET,
  TEST_SESSIONS,
  TOTAL_SESSIONS,
  TOTAL_TESTS,
  type ClassPlan,
} from './classPlan';

/* ------------------------------------------------------------------ *
 * Cấu hình  (sheet 06_CauHinh_HeThong)
 * ------------------------------------------------------------------ */

export const SYSTEM_CONFIG: SystemConfig = {
  nguongXamMax: 45,
  nguongDoMin: 45,
  nguongDoMax: 60,
  nguongVangMin: 60,
  passDhMin: 90,
  passBtvnMin: 90,
  passTestAvgMin: 60,
  softG1TestMin: 50,
  softG1TestMax: 55,
  softG1DhMin: 100,
  softG1BtvnMin: 100,
  softG2TestMin: 55,
  softG2TestMax: 60,
  softG2DhMin: 90,
  softG2BtvnMin: 90,
  reviewDeadlineDays: 7,
  mocBaoDongPct: 40,
  alertDhTutPct: 80,
  alertBtvnTutPct: 80,
  cheatingTestScore: 0,
  totalTestsPerCourse: TOTAL_TESTS,
  testMakeupRule: 'max',
};

/* ------------------------------------------------------------------ *
 * Ngày tháng
 * ------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

function parseDate(iso: string): number {
  return Date.parse(iso + 'T00:00:00Z');
}

function formatDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function formatDateTime(ms: number, hour = 10, minute = 0): string {
  const base = new Date(ms);
  base.setUTCHours(hour, minute, 0, 0);
  return base.toISOString().slice(0, 19).replace('T', ' ');
}

const addDays = (ms: number, days: number): number => ms + days * DAY_MS;
const addWeeks = (ms: number, weeks: number): number => addDays(ms, weeks * 7);

const REFERENCE_MS = parseDate(REFERENCE_DATE);
const SHOCK_MS = parseDate(CALENDAR_SHOCK.weekOf);
const COURSE_WEEKS = TOTAL_SESSIONS / SESSIONS_PER_WEEK;

const COURSE_NAME = 'IELTS Chiến lược (Khối 3-4)';
const LAST_SYNCED_AT = `${REFERENCE_DATE}T10:00:00Z`;
const LEAD_EMAIL = fakeTeacherEmail(
  TEACHER_PLANS.find((t) => t.teacherId === LEAD_TEACHER_ID)!.fullName,
  LEAD_TEACHER_ID,
);

/** Lịch học — gán vòng theo classId để mỗi lớp một khung giờ khác nhau. */
const SCHEDULES = [
  'Thứ 3, Thứ 6 (Online)',
  'Thứ 2, Thứ 5 (Online)',
  'Thứ 4, Thứ 7 (Online)',
  'Thứ 2, Thứ 6 (Offline)',
  'Thứ 3, Thứ 7 (Offline)',
];

/** Tuần chứa cú sốc lịch: snapshot rơi vào khoảng [weekOf, weekOf + 6 ngày]. */
function isShockWeek(snapshotMs: number): boolean {
  const diff = snapshotMs - SHOCK_MS;
  return diff >= 0 && diff < 7 * DAY_MS;
}

/* ------------------------------------------------------------------ *
 * Nhãn
 * ------------------------------------------------------------------ */

export function labelFromAverage(average: number | null): LabelCode {
  if (average === null || Number.isNaN(average)) return 'no_data';
  if (average >= SYSTEM_CONFIG.nguongVangMin) return 'yellow';
  if (average >= SYSTEM_CONFIG.nguongDoMin) return 'red';
  return 'grey';
}

/** Xám 0 → Đỏ 1 → Vàng 2. Dùng để đếm số bậc rơi/lên. */
const LABEL_RANK: Record<LabelCode, number> = { grey: 0, red: 1, yellow: 2, no_data: -1 };

const LABEL_VI: Record<LabelCode, string> = {
  grey: 'Xám',
  red: 'Đỏ',
  yellow: 'Vàng',
  no_data: 'Chưa có DL',
};

function severityOf(from: LabelCode, to: LabelCode): LabelChangeLog['severity'] {
  const step = LABEL_RANK[to] - LABEL_RANK[from];
  if (step > 0) return 'recovery';
  if (step <= -2) return 'critical';
  return from === 'yellow' ? 'warning' : 'serious';
}

const mean = (values: number[]): number | null =>
  values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length;

/* ------------------------------------------------------------------ *
 * Ca đặc biệt được dàn dựng
 * ------------------------------------------------------------------ */

/**
 * Những tình huống mà dữ liệu ngẫu nhiên gần như không bao giờ tự tạo ra,
 * nhưng giao diện bắt buộc phải xử lý được.
 *
 * Đáng chú ý — `cheating_collapse`: vì nhãn tính trên TRUNG BÌNH TÍCH LUỸ,
 * càng về cuối khóa nhãn càng khó dịch chuyển. Một cú rơi 2 bậc (Vàng → Xám)
 * chỉ xảy ra được khi có điểm 0, mà theo cấu hình thì điểm 0 đến từ đúng một
 * nguồn: `cheating_test_score = 0`. Nói cách khác, ca nghiêm trọng nhất trên
 * dashboard luôn gắn với một sự kiện gian lận — không phải với việc học sa
 * sút từ từ.
 */
type ScriptedKind =
  | 'cheating_collapse'
  | 'no_data_newcomer'
  | 'dropped'
  | 'on_hold'
  | 'transferred'
  | 'long_name'
  | 'makeup_recovery';

const SCRIPTED_CASES: Record<string, Array<{ index: number; kind: ScriptedKind }>> = {
  IC2174: [
    { index: 0, kind: 'cheating_collapse' },
    { index: 1, kind: 'no_data_newcomer' },
    { index: 2, kind: 'dropped' },
    { index: 3, kind: 'dropped' },
    { index: 4, kind: 'on_hold' },
    { index: 5, kind: 'long_name' },
  ],
  IC2201: [
    { index: 0, kind: 'makeup_recovery' },
    { index: 1, kind: 'transferred' },
    { index: 2, kind: 'no_data_newcomer' },
  ],
  IC2210: [
    { index: 0, kind: 'on_hold' },
    { index: 1, kind: 'makeup_recovery' },
  ],
  IC2205: [{ index: 0, kind: 'makeup_recovery' }],
  IC2224: [{ index: 0, kind: 'no_data_newcomer' }, { index: 1, kind: 'dropped' }],
  IC2218: [{ index: 0, kind: 'no_data_newcomer' }],
};

/* ------------------------------------------------------------------ *
 * Sinh học viên
 * ------------------------------------------------------------------ */

let studentIdCounter = 18000;

interface GeneratedClass {
  plan: ClassPlan;
  students: StudentDetail[];
  snapshots: ClassSnapshot[];
  summary: ClassSummary;
  labelChanges: LabelChangeLog[];
  openingMs: number;
  endingMs: number;
  isHistorical: boolean;
}

function makeName(rng: Rng): string {
  return `${rng.pick(FAMILY_NAMES)} ${rng.pick(MIDDLE_NAMES)} ${rng.pick(GIVEN_NAMES)}`;
}

function buildStudents(
  plan: ClassPlan,
  completedSessions: number,
  openingMs: number,
  rng: Rng,
): StudentDetail[] {
  const archetype = ARCHETYPES[plan.archetype];
  const scripted = SCRIPTED_CASES[plan.className] ?? [];
  const testsAvailable = TEST_SESSIONS.filter((s) => s <= completedSessions).length;

  return Array.from({ length: plan.enrolled }, (_, index) => {
    const script = scripted.find((s) => s.index === index)?.kind;

    const studentId = studentIdCounter++;
    const fullName = script === 'long_name' ? LONG_NAME_PROBE : makeName(rng);

    let registrationStatus: StudentDetail['registrationStatus'] = 'active';
    if (script === 'dropped') registrationStatus = 'dropped';
    else if (script === 'on_hold') registrationStatus = 'on_hold';
    else if (script === 'transferred') registrationStatus = 'transferred';

    /* --- Điểm test ------------------------------------------------- */

    /**
     * Ca gian lận được ghim năng lực cố định (68) thay vì bốc ngẫu nhiên.
     *
     * Vì nhãn tính trên trung bình tích luỹ, cú rơi hai bậc chỉ xảy ra trong
     * một khe rất hẹp: trung bình trước đó phải vừa đủ ≥60 nhưng đủ thấp để
     * một điểm 0 kéo xuống dưới 45. Thả ngẫu nhiên thì hầu như luôn trượt
     * khe này, và tình huống nghiêm trọng nhất của dashboard sẽ không bao
     * giờ có mẫu để nhìn.
     */
    const ability =
      script === 'cheating_collapse'
        ? 68
        : rng.normal(archetype.abilityMean + (plan.abilityOffset ?? 0), archetype.abilitySpread);
    // HV mới vào chưa có điểm nào; HV bỏ học / chuyển lớp dừng thi từ giữa chừng.
    const takenCount =
      script === 'no_data_newcomer'
        ? 0
        : registrationStatus === 'active'
          ? testsAvailable
          : Math.max(0, testsAvailable - rng.int(1, 2));

    // Ca gian lận: bỏ bài đầu (vào muộn) rồi ăn điểm 0 ở bài mới nhất.
    const skipsFirstTest = script === 'cheating_collapse';
    const isCheatingFlagged = script === 'cheating_collapse';

    const scores: TestScore[] = [];
    for (let order = 1; order <= TOTAL_TESTS; order++) {
      const isTaken = order <= takenCount && !(skipsFirstTest && order === 1);
      if (!isTaken) {
        scores.push({
          testOrder: order,
          testName: `Test ${order}`,
          rawScore: null,
          makeupScore: null,
          finalScore: null,
          isMakeup: false,
        });
        continue;
      }

      const isLastTaken = order === takenCount;
      let raw: number;

      if (isCheatingFlagged && isLastTaken) {
        raw = SYSTEM_CONFIG.cheatingTestScore;
      } else {
        raw = clamp(
          ability +
            archetype.trendPerTest * (order - 1) +
            TEST_DIFFICULTY_OFFSET[order - 1] +
            // Ca dàn dựng bỏ nhiễu để không trượt khe rơi hai bậc.
            (script === 'cheating_collapse' ? 0 : rng.normal(0, 4.5)),
          8,
          99,
        );
      }

      // Thi lại: theo cấu hình test_makeup_rule = 'max' nên điểm cuối lấy bản cao hơn.
      const wantsMakeup = script === 'makeup_recovery' && order === 1 && raw < 55;
      const makeup = wantsMakeup ? clamp(raw + rng.float(9, 18), 8, 99) : null;
      const final = makeup === null ? raw : Math.max(raw, makeup);

      scores.push({
        testOrder: order,
        testName: `Test ${order}`,
        rawScore: round1(raw),
        makeupScore: makeup === null ? null : round1(makeup),
        finalScore: round1(final),
        isMakeup: makeup !== null,
      });
    }

    const taken = scores.filter((s) => s.finalScore !== null);
    const finals = taken.map((s) => s.finalScore as number);
    const average = mean(finals);
    const previousAverage = mean(finals.slice(0, -1));

    const currentLabel = labelFromAverage(average === null ? null : round1(average));
    const previousLabel =
      finals.length <= 1 ? currentLabel : labelFromAverage(round1(previousAverage as number));

    /**
     * Nhãn tại ĐIỂM XUẤT PHÁT — suy ra từ bài test đầu tiên.
     *
     * Quy tắc tra ngược từ `02_DuLieu_HocVien`, khớp 55/55 dòng kiểm chứng
     * được. Khoảng cách xuất phát → hiện tại đo phần giá trị lớp học tạo
     * thêm, độc lập với chất lượng đầu vào.
     *
     * Lưu ý: trường nguồn tên là `nhan_benchmark`, nhưng theo team nó "dùng
     * để tô nhãn màu" — mục đích đó chưa khớp với cách nó được tính. Dashboard
     * vì vậy tính nhãn xuất phát TỪ ĐIỂM TEST THÔ, không mượn ngữ nghĩa của
     * trường đó. Xem §5.3 trong tài liệu thiết kế.
     */
    const benchmarkLabel = finals.length === 0 ? 'no_data' : labelFromAverage(finals[0]);

    /* --- Điểm danh & BTVN ------------------------------------------ */

    // Chuyên cần bám sát trần: đa số HV đi học gần đủ, một thiểu số tụt hẳn.
    // Đó là lý do độ lệch chuẩn nhỏ nhưng có clamp dưới rất thấp.
    const attendanceRate = clamp(rng.normal(archetype.diligence, 0.05), 0.35, 1);
    const homeworkRate = clamp(rng.normal(archetype.diligence - 0.035, 0.07), 0.25, 1);

    const attendedOf = registrationStatus === 'active' ? completedSessions : Math.round(completedSessions * 0.6);
    const presentSessions = Math.round(attendedOf * attendanceRate);
    const homeworkTotal = attendedOf;
    const completedCount = Math.round(homeworkTotal * homeworkRate);

    const attendancePct = attendedOf === 0 ? 0 : Math.round((presentSessions / attendedOf) * 100);
    const homeworkPct = homeworkTotal === 0 ? 0 : Math.round((completedCount / homeworkTotal) * 100);

    /* --- Đánh giá pass --------------------------------------------- */

    const avgRounded = average === null ? null : round1(average);
    const passChuanReasons: string[] = [];
    if (attendancePct < SYSTEM_CONFIG.passDhMin) passChuanReasons.push('Đi học <90%');
    if (homeworkPct < SYSTEM_CONFIG.passBtvnMin) passChuanReasons.push('BTVN <90%');
    if (avgRounded !== null && avgRounded < SYSTEM_CONFIG.passTestAvgMin) passChuanReasons.push('TB test <60');

    let passChuanStatus: StudentDetail['evaluation']['passChuanStatus'];
    if (avgRounded === null) passChuanStatus = 'Chưa đủ DL';
    else if (passChuanReasons.length === 0) passChuanStatus = 'Đạt tiêu chuẩn';
    else if (avgRounded >= SYSTEM_CONFIG.passTestAvgMin) passChuanStatus = 'Có khả năng pass';
    else passChuanStatus = 'Chưa đạt điều kiện pass';

    let passMemGroup: StudentDetail['evaluation']['passMemGroup'] = '';
    let passMemLabel = '';
    if (avgRounded !== null) {
      if (
        avgRounded >= SYSTEM_CONFIG.softG1TestMin &&
        avgRounded < SYSTEM_CONFIG.softG1TestMax &&
        attendancePct >= SYSTEM_CONFIG.softG1DhMin &&
        homeworkPct >= SYSTEM_CONFIG.softG1BtvnMin
      ) {
        passMemGroup = 'Nhóm 1';
        passMemLabel = 'Test 50-<55, ĐH 100%, BTVN 100%';
      } else if (
        avgRounded >= SYSTEM_CONFIG.softG2TestMin &&
        avgRounded < SYSTEM_CONFIG.softG2TestMax &&
        attendancePct >= SYSTEM_CONFIG.softG2DhMin &&
        homeworkPct >= SYSTEM_CONFIG.softG2BtvnMin
      ) {
        passMemGroup = 'Nhóm 2';
        passMemLabel = 'Test 55-<60, ĐH >=90%, BTVN >=90%';
      } else if (avgRounded >= SYSTEM_CONFIG.passTestAvgMin) {
        passMemGroup = 'Nhóm 3';
        passMemLabel = 'Test >=60';
      }
    }

    const passMemStatus: StudentDetail['evaluation']['passMemStatus'] =
      avgRounded === null ? '' : passMemGroup === '' ? 'Không đạt pass mềm' : 'Đạt pass mềm';

    const isEligibleForReview =
      registrationStatus === 'active' && (passMemGroup === 'Nhóm 1' || passMemGroup === 'Nhóm 2');

    const trendDirection: StudentDetail['testPerformance']['trendDirection'] =
      finals.length < 2
        ? 'no_data'
        : finals[finals.length - 1] - finals[0] > 4
          ? 'improving'
          : finals[0] - finals[finals.length - 1] > 4
            ? 'declining'
            : 'stable';

    const riskScore = clamp(
      Math.round(
        (avgRounded === null ? 55 : (100 - avgRounded) * 0.6) +
          (100 - attendancePct) * 0.2 +
          (100 - homeworkPct) * 0.2,
      ),
      0,
      100,
    );

    let suggestedAction: StudentDetail['evaluation']['suggestedAction'] = 'none';
    if (isEligibleForReview) suggestedAction = 'review_pass';
    else if (attendancePct < 80) suggestedAction = 'call_parent';
    else if (homeworkPct < 80) suggestedAction = 'assign_hw';

    const lastCheckpoint = takenCount === 0 ? 'Chưa đủ DL' : `Test ${takenCount}`;

    return {
      studentId,
      studentCode: String(studentId),
      fullName,
      phone: fakePhone(studentId),
      email: fakeEmail(fullName, studentId),
      classId: plan.classId,
      className: plan.className,
      registrationStatus,
      admittedAt: formatDate(openingMs),
      targetOutputStatus: 'Chưa đạt',
      attendance: {
        percentage: attendancePct,
        presentSessions,
        totalSessions: attendedOf,
        isDroppingRecently: attendancePct < SYSTEM_CONFIG.alertDhTutPct,
      },
      homework: {
        percentage: homeworkPct,
        completedCount,
        totalCount: homeworkTotal,
        isDroppingRecently: homeworkPct < SYSTEM_CONFIG.alertBtvnTutPct,
      },
      testPerformance: {
        testsTakenCount: taken.length,
        averageScore: avgRounded,
        lastScore: finals.length === 0 ? null : finals[finals.length - 1],
        trendDirection,
        scores,
        isCheatingFlagged,
      },
      labeling: {
        currentLabel,
        previousLabel,
        benchmarkLabel,
        hasChangedRecently: currentLabel !== previousLabel,
        changeDirection:
          currentLabel === previousLabel
            ? 'same'
            : LABEL_RANK[currentLabel] > LABEL_RANK[previousLabel]
              ? 'up'
              : 'down',
        lastCheckpoint,
        teacherTemporaryLabel: script === 'no_data_newcomer' ? 'Đỏ' : null,
      },
      evaluation: {
        riskScore,
        suggestedAction,
        passChuanStatus,
        passChuanReasons,
        passMemStatus,
        passMemGroup,
        passMemLabel,
        isEligibleForReview,
        reviewStatus: '',
      },
      portalEvidence: {
        teacherFeedbackBtvn:
          homeworkPct >= 90
            ? 'có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ'
            : homeworkPct >= 70
              ? 'có tinh thần làm BTVN tương đối tốt'
              : 'có tinh thần làm BTVN chưa tốt, còn thiếu nhiều bài tập',
        teacherFeedbackOrientation:
          attendancePct >= 90 ? 'có tinh thần đi học đều đặn' : 'nghỉ học khá nhiều, cần nhắc nhở',
        teacherNote: script === 'no_data_newcomer' ? 'HV mới vào, GV gán tạm dựa trên BTVN' : '',
      },
      updatedAt: REFERENCE_DATE,
    } satisfies StudentDetail;
  });
}

/* ------------------------------------------------------------------ *
 * Snapshot theo tuần
 * ------------------------------------------------------------------ */

/**
 * Chuỗi tỷ lệ theo từng tuần, có nhiễu và có cú sốc lịch, nhưng được chuẩn
 * hoá lại để trung bình đúng bằng giá trị tích luỹ tính từ danh sách HV.
 * Nhờ vậy giá trị ở snapshot cuối cùng luôn khớp với thẻ KPI.
 */
function weeklySeries(target: number, weeks: number, openingMs: number, rng: Rng, shockDrop: number): number[] {
  const raw = Array.from({ length: weeks }, (_, i) => {
    const snapshotMs = addWeeks(openingMs, i + 1);
    const wobble = rng.normal(0, 3.2);
    const shock = isShockWeek(snapshotMs) ? -shockDrop : 0;
    return target + wobble + shock;
  });

  const rawMean = raw.reduce((a, b) => a + b, 0) / weeks;
  const correction = target - rawMean;
  return raw.map((v) => clamp(v + correction, 0, 100));
}

function buildSnapshots(
  plan: ClassPlan,
  students: StudentDetail[],
  completedSessions: number,
  openingMs: number,
  rng: Rng,
): ClassSnapshot[] {
  const weeks = Math.max(1, Math.ceil(completedSessions / SESSIONS_PER_WEEK));
  const active = students.filter((s) => s.registrationStatus === 'active');

  const totalPresent = active.reduce((a, s) => a + s.attendance.presentSessions, 0);
  const totalSessionsSum = active.reduce((a, s) => a + s.attendance.totalSessions, 0);
  const totalHwDone = active.reduce((a, s) => a + s.homework.completedCount, 0);
  const totalHwCount = active.reduce((a, s) => a + s.homework.totalCount, 0);

  // Trung bình CÓ TRỌNG SỐ: tổng buổi có mặt / tổng buổi phải học.
  const attendanceTarget = totalSessionsSum === 0 ? 0 : (totalPresent / totalSessionsSum) * 100;
  const homeworkTarget = totalHwCount === 0 ? 0 : (totalHwDone / totalHwCount) * 100;

  const attendanceWeekly = weeklySeries(attendanceTarget, weeks, openingMs, rng, CALENDAR_SHOCK.attendanceDrop);
  const homeworkWeekly = weeklySeries(homeworkTarget, weeks, openingMs, rng, CALENDAR_SHOCK.homeworkDrop);

  const snapshots: ClassSnapshot[] = [];

  for (let week = 1; week <= weeks; week++) {
    const sessionsDone = Math.min(week * SESSIONS_PER_WEEK, completedSessions);
    const testsSoFar = TEST_SESSIONS.filter((s) => s <= sessionsDone).length;
    const testJustHeld = TEST_SESSIONS.some(
      (s) => s <= sessionsDone && s > (week - 1) * SESSIONS_PER_WEEK,
    );

    // Trung bình tích luỹ tới tuần này.
    const attendanceAvg = round1(
      attendanceWeekly.slice(0, week).reduce((a, b) => a + b, 0) / week,
    );
    const homeworkAvg = round1(homeworkWeekly.slice(0, week).reduce((a, b) => a + b, 0) / week);

    const counts = { yellow: 0, red: 0, grey: 0, noData: 0 };
    let passChuan = 0;
    let passMem = 0;

    for (const student of active) {
      const finals = student.testPerformance.scores
        .filter((s) => s.finalScore !== null && s.testOrder <= testsSoFar)
        .map((s) => s.finalScore as number);
      const avg = mean(finals);
      const label = labelFromAverage(avg === null ? null : round1(avg));

      if (label === 'yellow') counts.yellow++;
      else if (label === 'red') counts.red++;
      else if (label === 'grey') counts.grey++;
      else counts.noData++;

      if (
        avg !== null &&
        avg >= SYSTEM_CONFIG.passTestAvgMin &&
        student.attendance.percentage >= SYSTEM_CONFIG.passDhMin &&
        student.homework.percentage >= SYSTEM_CONFIG.passBtvnMin
      ) {
        passChuan++;
      }
      if (avg !== null && avg >= SYSTEM_CONFIG.softG1TestMin) passMem++;
    }

    const denominator = active.length || 1;
    const riskPct = round1(((counts.grey + counts.red) / denominator) * 100);

    snapshots.push({
      snapshotId: `${plan.classId}-w${week}`,
      classId: plan.classId,
      className: plan.className,
      snapshotDate: formatDate(addWeeks(openingMs, week)),
      weekIndex: week,
      progressPct: Math.round((sessionsDone / TOTAL_SESSIONS) * 100),
      completedSessions: sessionsDone,
      totalSessions: TOTAL_SESSIONS,
      testCheckpoint: testJustHeld ? `Test ${testsSoFar}` : null,
      attendanceAvg,
      homeworkAvg,
      passChuanRate: round1((passChuan / denominator) * 100),
      passMemRate: round1((passMem / denominator) * 100),
      labelCounts: counts,
      riskPct,
      activeStudents: active.length,
    });
  }

  return snapshots;
}

/* ------------------------------------------------------------------ *
 * Nhật ký chuyển nhãn
 * ------------------------------------------------------------------ */

/**
 * Nhãn chỉ được tính lại khi có bài test mới, nên nhật ký này sinh ra bằng
 * cách so nhãn trước/sau tại từng mốc test — không phải theo tuần lịch. Một
 * tháng không có test thì nhật ký rỗng, và đó là "chưa có dữ liệu mới" chứ
 * không phải "khối ổn định".
 */
function buildLabelChanges(
  plan: ClassPlan,
  students: StudentDetail[],
  snapshots: ClassSnapshot[],
  teacherName: string,
): LabelChangeLog[] {
  const logs: LabelChangeLog[] = [];

  for (const snapshot of snapshots) {
    if (!snapshot.testCheckpoint) continue;
    const testOrder = Number(snapshot.testCheckpoint.replace('Test ', ''));

    for (const student of students) {
      if (student.registrationStatus !== 'active') continue;

      const upto = (n: number) =>
        student.testPerformance.scores
          .filter((s) => s.finalScore !== null && s.testOrder <= n)
          .map((s) => s.finalScore as number);

      const before = upto(testOrder - 1);
      const after = upto(testOrder);
      if (after.length === 0 || after.length === before.length) continue;

      const beforeAvg = mean(before);
      const afterAvg = mean(after) as number;
      const fromLabel = before.length === 0 ? 'no_data' : labelFromAverage(round1(beforeAvg as number));
      const toLabel = labelFromAverage(round1(afterAvg));
      if (fromLabel === toLabel || fromLabel === 'no_data') continue;

      const step = LABEL_RANK[toLabel] - LABEL_RANK[fromLabel];
      const cheated = student.testPerformance.isCheatingFlagged && testOrder === student.testPerformance.testsTakenCount;

      logs.push({
        logId: `${plan.classId}-${student.studentId}-t${testOrder}`,
        studentId: student.studentId,
        studentName: student.fullName,
        classId: plan.classId,
        className: plan.className,
        teacherId: plan.teacherId,
        teacherName,
        fromLabel,
        toLabel,
        direction: step > 0 ? 'up' : 'down',
        severity: severityOf(fromLabel, toLabel),
        stepCount: Math.abs(step),
        reason: cheated
          ? `${LABEL_VI[fromLabel]} → ${LABEL_VI[toLabel]}: ${snapshot.testCheckpoint} bị đánh dấu gian lận, tính 0 điểm — TB tụt còn ${round1(afterAvg)}`
          : step > 0
            ? `${LABEL_VI[fromLabel]} → ${LABEL_VI[toLabel]}: TB test tăng lên ${round1(afterAvg)} sau ${snapshot.testCheckpoint}`
            : `${LABEL_VI[fromLabel]} → ${LABEL_VI[toLabel]}: TB test giảm còn ${round1(afterAvg)} sau ${snapshot.testCheckpoint}`,
        checkpoint: snapshot.testCheckpoint,
        testAverageAfter: round1(afterAvg),
        attendancePct: student.attendance.percentage,
        homeworkPct: student.homework.percentage,
        emailSent: true,
        createdAt: formatDateTime(parseDate(snapshot.snapshotDate)),
      });
    }
  }

  return logs;
}

/* ------------------------------------------------------------------ *
 * Tổng hợp cấp lớp
 * ------------------------------------------------------------------ */

function buildSummary(
  plan: ClassPlan,
  students: StudentDetail[],
  snapshots: ClassSnapshot[],
  labelChanges: LabelChangeLog[],
  teacher: Teacher,
  openingMs: number,
  endingMs: number,
  isHistorical: boolean,
): ClassSummary {
  const latest = snapshots[snapshots.length - 1];
  const counts = {
    active: students.filter((s) => s.registrationStatus === 'active').length,
    onHold: students.filter((s) => s.registrationStatus === 'on_hold').length,
    dropped: students.filter((s) => s.registrationStatus === 'dropped').length,
    transferred: students.filter((s) => s.registrationStatus === 'transferred').length,
  };

  const netMomentum =
    labelChanges.filter((c) => c.direction === 'up').length -
    labelChanges.filter((c) => c.direction === 'down').length;

  const isAlarmTriggered = latest.riskPct >= SYSTEM_CONFIG.mocBaoDongPct;
  const healthScore = Math.round(
    clamp(100 - latest.riskPct * 0.9 + (latest.attendanceAvg - 90) * 0.5, 0, 100),
  );

  return {
    classId: plan.classId,
    className: plan.className,
    courseId: 2,
    courseName: COURSE_NAME,
    teacher: {
      teacherId: teacher.teacherId,
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
    },
    leadEmail: LEAD_EMAIL,
    status: isHistorical ? 'completed' : 'on_going',
    schedule: SCHEDULES[plan.classId % SCHEDULES.length],
    openingDate: formatDate(openingMs),
    endingDate: formatDate(endingMs),
    progress: {
      completedSessions: latest.completedSessions,
      totalSessions: TOTAL_SESSIONS,
      percentage: latest.progressPct,
    },
    studentCounts: {
      ...counts,
      totalEnrolled: students.length,
    },
    healthMetrics: {
      classRiskLevel: latest.riskPct >= 40 ? 'high' : latest.riskPct >= 25 ? 'medium' : 'low',
      healthScore,
      isAlarmTriggered,
      attendanceAverage: latest.attendanceAvg,
      homeworkAverage: latest.homeworkAvg,
      passChuanRate: latest.passChuanRate,
      passMemRate: latest.passMemRate,
    },
    labelDistribution: {
      grey: latest.labelCounts.grey,
      red: latest.labelCounts.red,
      yellow: latest.labelCounts.yellow,
      noData: latest.labelCounts.noData,
      netMomentum,
    },
    actionItems: {
      urgentCallsNeeded: students.filter(
        (s) => s.registrationStatus === 'active' && s.evaluation.suggestedAction === 'call_parent',
      ).length,
      homeworkRemindersNeeded: students.filter(
        (s) => s.registrationStatus === 'active' && s.evaluation.suggestedAction === 'assign_hw',
      ).length,
      pendingPassReviews: students.filter((s) => s.evaluation.isEligibleForReview).length,
    },
    portalUrl: `https://portal.izone.edu.vn/academic-affairs/course-classes/${plan.classId}`,
    lastSyncedAt: LAST_SYNCED_AT,
  };
}

/* ------------------------------------------------------------------ *
 * Lắp ráp
 * ------------------------------------------------------------------ */

export const TEACHERS: Teacher[] = TEACHER_PLANS.map((t) => ({
  teacherId: t.teacherId,
  fullName: t.fullName,
  email: fakeTeacherEmail(t.fullName, t.teacherId),
  phone: fakePhone(t.teacherId),
  khoiId: 34,
  role: t.role,
}));

const TEACHER_BY_ID = new Map(TEACHERS.map((t) => [t.teacherId, t]));

function generateClass(plan: ClassPlan, isHistorical: boolean, endingMsOverride?: number): GeneratedClass {
  const rng = createRng(plan.seed);
  const completedSessions = Math.max(
    1,
    Math.round((TOTAL_SESSIONS * plan.progressPct) / 100),
  );
  const weeks = Math.max(1, Math.ceil(completedSessions / SESSIONS_PER_WEEK));

  const endingMs = endingMsOverride ?? addWeeks(REFERENCE_MS, COURSE_WEEKS - weeks);
  const openingMs = addWeeks(endingMs, -COURSE_WEEKS);

  const teacher = TEACHER_BY_ID.get(plan.teacherId)!;
  const students = buildStudents(plan, completedSessions, openingMs, rng);
  const snapshots = buildSnapshots(plan, students, completedSessions, openingMs, rng);
  const labelChanges = buildLabelChanges(plan, students, snapshots, teacher.fullName);
  const summary = buildSummary(
    plan,
    students,
    snapshots,
    labelChanges,
    teacher,
    openingMs,
    endingMs,
    isHistorical,
  );

  return { plan, students, snapshots, summary, labelChanges, openingMs, endingMs, isHistorical };
}

export const ACTIVE_CLASSES: GeneratedClass[] = ACTIVE_CLASS_PLANS.map((p) => generateClass(p, false));

export const HISTORICAL_CLASSES: GeneratedClass[] = HISTORICAL_CLASS_PLANS.map((p) =>
  generateClass(p, true, addWeeks(REFERENCE_MS, -p.endedWeeksAgo)),
);

/* ------------------------------------------------------------------ *
 * Xét duyệt Pass mềm
 * ------------------------------------------------------------------ */

/**
 * Trạng thái review được rải có chủ đích để mọi nhánh giao diện đều có mẫu:
 * chờ GV, GV đồng ý, GV từ chối, và ít nhất một ca quá hạn đã đẩy lên Lead.
 */
export function buildPendingReviews(): PendingReviewEnriched[] {
  const reviews: PendingReviewEnriched[] = [];
  const rng = createRng(77_001);
  let sequence = 0;

  for (const generated of ACTIVE_CLASSES) {
    const eligible = generated.students.filter((s) => s.evaluation.isEligibleForReview);

    for (const student of eligible) {
      sequence++;

      // Quá hạn phải HIẾM: nó là ngoại lệ đẩy lên Lead, không phải mặc định.
      // Ghim đúng hai ca quá hạn thay vì thả ngẫu nhiên, để dải cảnh báo luôn
      // có mẫu mà không bị ngập.
      const forcedOverdue = sequence === 3 || sequence === 11;
      const createdMs = addDays(REFERENCE_MS, forcedOverdue ? -rng.int(10, 13) : -rng.int(1, 6));
      const deadlineMs = addDays(createdMs, SYSTEM_CONFIG.reviewDeadlineDays);
      const hoursRemaining = Math.round((deadlineMs - REFERENCE_MS) / 3_600_000);
      const isOverdue = hoursRemaining < 0;

      let status: PendingReviewEnriched['workflow']['status'];
      if (isOverdue) status = 'Quá hạn → Lead';
      else if (sequence % 4 === 0) status = 'GV Đồng ý';
      else if (sequence % 7 === 0) status = 'GV Từ chối';
      else status = 'Chờ GV';

      const scoreHistory = student.testPerformance.scores
        .filter((s) => s.finalScore !== null)
        .map((s) => s.finalScore as number);

      const trend: 'improving' | 'declining' | 'stable' =
        student.testPerformance.trendDirection === 'no_data'
          ? 'stable'
          : student.testPerformance.trendDirection;

      const decided = status === 'GV Đồng ý' || status === 'GV Từ chối';

      reviews.push({
        reviewId: `rv-${generated.plan.classId}-${student.studentId}`,
        student: {
          studentId: student.studentId,
          studentCode: student.studentCode,
          fullName: student.fullName,
          phone: student.phone,
          email: student.email,
          avatarInitials: initialsOf(student.fullName),
        },
        classInfo: {
          classId: generated.plan.classId,
          className: generated.plan.className,
          teacherId: generated.summary.teacher.teacherId,
          teacherName: generated.summary.teacher.fullName,
        },
        qualification: {
          passMemGroup: student.evaluation.passMemGroup as 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3',
          reasonTitle: student.evaluation.passMemLabel,
          testAverage: student.testPerformance.averageScore ?? 0,
          attendancePct: student.attendance.percentage,
          homeworkPct: student.homework.percentage,
          scoreHistory,
          trendDirection: trend,
        },
        evidence: {
          portalFeedbackBtvn: student.portalEvidence.teacherFeedbackBtvn,
          portalFeedbackOrientation: student.portalEvidence.teacherFeedbackOrientation,
          aiRecommendation: {
            action: trend === 'improving' ? 'APPROVE' : trend === 'declining' ? 'REJECT' : 'NEUTRAL',
            confidence: rng.int(62, 94),
            reasoning:
              trend === 'improving'
                ? 'Điểm test đi lên đều qua các mốc, đi học và BTVN đầy đủ.'
                : trend === 'declining'
                  ? 'Điểm test đi xuống ở các mốc gần đây dù vẫn đủ điều kiện xét.'
                  : 'Kết quả đi ngang, cần GV xác nhận bằng quan sát trên lớp.',
          },
        },
        workflow: {
          status,
          teacherDecision: decided ? (status === 'GV Đồng ý' ? 'Pass' : 'Fail') : null,
          teacherComment: decided
            ? status === 'GV Đồng ý'
              ? 'HV tiến bộ rõ rệt, đề nghị cho pass.'
              : 'HV không ổn định, điểm lên xuống thất thường.'
            : null,
          confirmedAt: decided ? formatDateTime(addDays(createdMs, 2), 9, 30) : null,
          deadline: formatDate(deadlineMs),
          isOverdue,
          hoursRemaining,
          escalatedToLead: isOverdue,
        },
        createdAt: formatDateTime(createdMs),
      });
    }
  }

  return reviews;
}

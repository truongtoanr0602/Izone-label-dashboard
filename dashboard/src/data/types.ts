/**
 * Toàn bộ kiểu dữ liệu của dashboard.
 *
 * Tách khỏi mockData.ts để phần sinh dữ liệu và phần khai báo kiểu không lẫn
 * vào nhau. mockData.ts export lại tất cả nên các component cũ không phải sửa
 * đường dẫn import.
 */

export type LabelCode = 'green' | 'yellow' | 'red' | 'grey' | 'no_data';
export type InterventionLevel = 'level_1' | 'level_2' | 'level_3' | 'none';

/* ------------------------------------------------------------------ *
 * Học viên
 * ------------------------------------------------------------------ */

export interface TestScore {
  testOrder: number;
  testName: string;
  rawScore: number | null;
  makeupScore: number | null;
  finalScore: number | null;
  isMakeup: boolean;
}

export interface StudentDetail {
  studentId: number;
  fullName: string;
  phone: string;
  email: string;
  classId: number;
  className: string;
  registrationStatus: 'on_going' | 'transferred' | 'pending' | 'on_hold' | 'cancelled' | 'completed' | 'dropped' | 'not_completed' | 'queuing';
  recordDate: string | null;
  admittedAt: string;
  targetOutputStatus: 'Chưa đạt' | 'Đạt';
  attendance: {
    percentage: number | null;
    presentSessions: number | null;
    totalSessions: number | null;
    isDroppingRecently: boolean;
  };
  homework: {
    percentage: number | null;
    completedCount: number | null;
    totalCount: number | null;
    isDroppingRecently: boolean;
  };
  testPerformance: {
    testsTakenCount: number;
    averageScore: number | null;
    lastScore: number | null;
    trendDirection: 'improving' | 'declining' | 'stable' | 'no_data';
    scores: TestScore[];
    isCheatingFlagged: boolean;
  };
  labeling: {
    currentLabel: LabelCode;
    previousLabel: LabelCode;
    benchmarkLabel: LabelCode;
    hasChangedRecently: boolean;
    changeDirection: 'up' | 'down' | 'same';
    lastCheckpoint: string;
    teacherTemporaryLabel?: string | null;
  };
  interventionLevel?: InterventionLevel;
  issues?: Array<{
    code: string;
    metric: string;
    actual: number | null;
    threshold: number | null;
  }>;
  dataQuality: {
    status: 'complete' | 'warning';
    warnings: string[];
  };
  evaluation: {
    riskScore: number; // 0 to 100
    suggestedAction: 'call_parent' | 'assign_hw' | 'review_pass' | 'none';
    passChuanStatus: 'Có khả năng pass' | 'Chưa đạt điều kiện pass' | 'Chưa đủ DL' | 'Đạt tiêu chuẩn';
    passChuanReasons: string[];
    passMemStatus: 'Đạt pass mềm' | 'Không đạt pass mềm' | 'Xét chờ Review' | '';
    passMemGroup: 'Nhóm 1' | 'Nhóm 2' | '';
    passMemLabel: string;
    isEligibleForReview: boolean;
    reviewStatus: 'Chờ GV' | 'GV Đồng ý' | 'GV Từ chối' | 'Quá hạn → Lead' | '';
  };
  portalEvidence: {
    teacherFeedbackBtvn: string;
    teacherFeedbackOrientation: string;
    teacherNote: string;
  };
  updatedAt: string;
}

/* ------------------------------------------------------------------ *
 * Lớp
 * ------------------------------------------------------------------ */

export interface ClassSummary {
  classId: number;
  className: string;
  courseId: number;
  courseName: string;
  teacher: {
    teacherId: number;
    fullName: string;
    email: string;
    phone: string;
  };
  leadEmail: string;
  status: 'on_going' | 'completed' | 'upcoming';
  schedule: string;
  openingDate: string;
  endingDate: string;
  progress: {
    completedSessions: number;
    totalSessions: number;
    percentage: number | null;
  };
  studentCounts: {
    active: number;
    onHold: number;
    dropped: number;
    transferred: number;
    totalEnrolled: number;
  };
  healthMetrics: {
    classRiskLevel: 'high' | 'medium' | 'low';
    healthScore: number | null;
    isAlarmTriggered: boolean;
    attendanceAverage: number | null;
    homeworkAverage: number | null;
    passChuanRate: number | null;
    passMemRate: number | null;
  };
  labelDistribution: {
    grey: number;
    red: number;
    yellow: number;
    noData: number;
    netMomentum: number;
  };
  actionItems: {
    urgentCallsNeeded: number;
    homeworkRemindersNeeded: number;
    pendingPassReviews: number;
  };
  portalUrl: string;
  lastSyncedAt: string;
}

/* ------------------------------------------------------------------ *
 * Xét duyệt Pass mềm
 * ------------------------------------------------------------------ */

export interface PendingReviewEnriched {
  reviewId: string;
  student: {
    studentId: number;
    fullName: string;
    phone: string;
    email: string;
    avatarInitials: string;
  };
  classInfo: {
    classId: number;
    className: string;
    teacherId: number;
    teacherName: string;
  };
  qualification: {
    passMemGroup: 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3';
    reasonTitle: string;
    testAverage: number;
    attendancePct: number;
    homeworkPct: number;
    scoreHistory: number[];
    trendDirection: 'improving' | 'declining' | 'stable';
  };
  evidence: {
    portalFeedbackBtvn: string;
    portalFeedbackOrientation: string;
    aiRecommendation: {
      action: 'APPROVE' | 'REJECT' | 'NEUTRAL';
      confidence: number;
      reasoning: string;
    };
  };
  workflow: {
    status: 'Chờ GV' | 'GV Đồng ý' | 'GV Từ chối' | 'Quá hạn → Lead';
    teacherDecision?: 'Pass' | 'Fail' | null;
    teacherComment?: string | null;
    confirmedAt?: string | null;
    deadline: string;
    isOverdue: boolean;
    hoursRemaining: number;
    escalatedToLead: boolean;
  };
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Giáo viên  (sheet 08_GiaoVien)
 * ------------------------------------------------------------------ */

export interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  phone: string;
  khoiId: number;
  role: 'teacher' | 'lead';
}

/* ------------------------------------------------------------------ *
 * Ảnh chụp lớp theo tuần  (sheet 09_Weekly_Snapshot)
 * ------------------------------------------------------------------ */

/**
 * Một ảnh chụp mang HAI trục thời gian song song, và đó là chủ đích:
 *
 *   - `snapshotDate` / `weekIndex` → trục theo LỊCH. Dùng cho biểu đồ diễn
 *     biến của toàn khối và cho delta tháng.
 *   - `progressPct`               → trục theo VÒNG ĐỜI lớp. Dùng cho biểu đồ
 *     so sánh giữa các lớp chạy ở thời điểm khác nhau, và cho dải phân vị
 *     lịch sử.
 *
 * Giữ cả hai trong cùng một bản ghi là điều kiện để hai góc nhìn dùng chung
 * một nguồn số — nếu tách ra hai bảng thì sớm muộn cũng lệch nhau.
 *
 * `testCheckpoint` khác null nghĩa là tuần đó có bài test, tức là nhãn được
 * tính lại. Tuần không có test thì nhãn đứng yên — và đó KHÔNG phải tín hiệu
 * "khối ổn định", nên mọi chart đọc dòng chảy nhãn phải kiểm tra trường này
 * trước khi diễn giải một số 0.
 */
export interface ClassSnapshot {
  snapshotId: string;
  classId: number;
  className: string;
  snapshotDate: string;
  weekIndex: number;
  progressPct: number;
  completedSessions: number;
  totalSessions: number;
  testCheckpoint: string | null;

  /**
   * Số bài test đã diễn ra tính tới ảnh chụp này.
   *
   * Bằng 0 nghĩa là lớp chưa thi bài nào — khi đó tỷ lệ pass KHÔNG có nghĩa và
   * phải bị loại khỏi mọi phép tổng hợp, thay vì tính là 0%.
   */
  testsCompleted: number;

  /**
   * Số HV đã bỏ học tính tới ảnh chụp này (luỹ kế).
   *
   * Hiệu giữa hai kỳ cho ra "số HV bỏ học thêm trong tháng" — con số Lead cần,
   * khác với tổng luỹ kế.
   */
  droppedStudents: number;
  attendanceAvg: number;
  homeworkAvg: number;
  passChuanRate: number;
  passMemRate: number;
  labelCounts: {
    yellow: number;
    red: number;
    grey: number;
    noData: number;
  };
  /** (xám + đỏ) / sĩ số active — chỉ số xếp hạng chính của bảng lớp. */
  riskPct: number;
  activeStudents: number;
}

/* ------------------------------------------------------------------ *
 * Nhật ký chuyển nhãn  (sheet 04_NhatKy_ChuyenNhan)
 * ------------------------------------------------------------------ */

/**
 * `severity` phân biệt điều mà một con số đếm thuần không nói được: bốn học
 * viên rơi một bậc không nghiêm trọng bằng một học viên rơi hai bậc.
 *
 *   recovery  — đi lên, bất kể mấy bậc
 *   warning   — Vàng → Đỏ, mất trạng thái an toàn
 *   serious   — Đỏ → Xám, rơi xuống đáy
 *   critical  — Vàng → Xám, rơi hai bậc trong một lần tính lại
 */
export interface LabelChangeLog {
  logId: string;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  fromLabel: LabelCode;
  toLabel: LabelCode;
  direction: 'up' | 'down';
  severity: 'recovery' | 'warning' | 'serious' | 'critical';
  stepCount: number;
  reason: string;
  checkpoint: string;
  testAverageAfter: number;
  attendancePct: number;
  homeworkPct: number;
  emailSent: boolean;
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Nhật ký liên hệ  (sheet 10_NhatKy_LienHe)
 * ------------------------------------------------------------------ */

export type ContactChannel = 'call' | 'zalo' | 'in_person';

/**
 * Loại cảnh báo mà lượt liên hệ này đóng lại. Mỗi loại ứng với đúng một
 * predicate trong `selectors/studentFilters.ts` — thêm loại mới ở đây thì
 * phải thêm predicate tương ứng, nếu không `openEpisodes` sẽ đếm thiếu.
 */
export type ContactTrigger = 'habit_reminder' | 'red_followup' | 'relearn_advice';

/**
 * MỘT DÒNG = MỘT LƯỢT LIÊN HỆ. Append-only, không bao giờ sửa hay ghi đè.
 *
 * `checkpoint` là thứ làm cái tick tự hết hiệu lực: nó ghim lượt liên hệ vào
 * mốc test đang mở tại thời điểm GV bấm. Có bài test mới → nhãn được tính lại
 * → khoá episode đổi → cảnh báo nổi lại mà không cần ai đi reset cờ.
 *
 * Đây là lý do KHÔNG dùng một cờ boolean `daLienHe` trên `StudentDetail`: cờ
 * đó chỉ trả lời được "đã bao giờ liên hệ chưa", nên vô dụng từ lần thứ hai
 * trở đi, và cũng không nói được ai liên hệ, lúc nào, vì cảnh báo gì.
 */
export interface ContactLog {
  contactId: string;
  studentId: number;
  classId: number;
  teacherId: number;
  channel: ContactChannel;
  trigger: ContactTrigger;
  /**
   * Tên mốc test (`'Test 3'`) hoặc `'Chưa có test'`. Phải cùng hệ giá trị với
   * `LabelChangeLog.checkpoint` để hai nhật ký join được với nhau.
   */
  checkpoint: string;
  /** Bản v1 luôn rỗng. Giữ cột sẵn cho backend, chưa hiện lên giao diện. */
  note: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Cấu hình hệ thống  (sheet 06_CauHinh_HeThong)
 * ------------------------------------------------------------------ */

export interface SystemConfig {
  nguongXamMax: number;
  nguongDoMin: number;
  nguongDoMax: number;
  nguongVangMin: number;
  passDhMin: number;
  passBtvnMin: number;
  passTestAvgMin: number;
  softG1TestMin: number;
  softG1TestMax: number;
  softG1DhMin: number;
  softG1BtvnMin: number;
  softG2TestMin: number;
  softG2TestMax: number;
  softG2DhMin: number;
  softG2BtvnMin: number;
  reviewDeadlineDays: number;
  /** Ngưỡng % (Xám + Đỏ) để một lớp bị coi là báo động. */
  mocBaoDongPct: number;
  alertDhTutPct: number;
  alertBtvnTutPct: number;
  cheatingTestScore: number;
  totalTestsPerCourse: number;
  testMakeupRule: 'max' | 'replace' | 'average';
}

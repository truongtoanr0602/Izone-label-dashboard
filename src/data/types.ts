/**
 * Toàn bộ kiểu dữ liệu của dashboard.
 *
 * Tách khỏi mockData.ts để phần sinh dữ liệu và phần khai báo kiểu không lẫn
 * vào nhau. mockData.ts export lại tất cả nên các component cũ không phải sửa
 * đường dẫn import.
 */

export type LabelCode = 'yellow' | 'red' | 'grey' | 'no_data';

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
  studentCode: string;
  fullName: string;
  phone: string;
  email: string;
  classId: number;
  className: string;
  registrationStatus: 'active' | 'transferred' | 'on_hold' | 'dropped';
  admittedAt: string;
  targetOutputStatus: 'Chưa đạt' | 'Đạt';
  attendance: {
    percentage: number;
    presentSessions: number;
    totalSessions: number;
    isDroppingRecently: boolean;
  };
  homework: {
    percentage: number;
    completedCount: number;
    totalCount: number;
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
  evaluation: {
    riskScore: number; // 0 to 100
    suggestedAction: 'call_parent' | 'assign_hw' | 'review_pass' | 'none';
    passChuanStatus: 'Có khả năng pass' | 'Chưa đạt điều kiện pass' | 'Chưa đủ DL' | 'Đạt tiêu chuẩn';
    passChuanReasons: string[];
    passMemStatus: 'Đạt pass mềm' | 'Không đạt pass mềm' | '';
    passMemGroup: 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3' | '';
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
    percentage: number;
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
    healthScore: number;
    isAlarmTriggered: boolean;
    attendanceAverage: number;
    homeworkAverage: number;
    passChuanRate: number;
    passMemRate: number;
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
    studentCode: string;
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

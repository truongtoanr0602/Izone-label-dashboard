// Types and Mock Data aligned with Pre-Development Review (v3 Frozen Architecture)

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
    currentLabel: 'yellow' | 'red' | 'grey' | 'no_data';
    previousLabel: 'yellow' | 'red' | 'grey' | 'no_data';
    benchmarkLabel: 'yellow' | 'red' | 'grey' | 'no_data';
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

// ==========================================
// MOCK DATA IMPLEMENTATION
// ==========================================

export const MOCK_CLASSES: ClassSummary[] = [
  {
    classId: 1159,
    className: "IC2174",
    courseId: 2,
    courseName: "IELTS Chiến lược (Khối 3-4)",
    teacher: {
      teacherId: 305,
      fullName: "Trần Minh Phương",
      email: "phuong.tm@izone.edu.vn",
      phone: "0901234567"
    },
    leadEmail: "ha.nnb@izone.edu.vn",
    status: "on_going",
    schedule: "Thứ 3, Thứ 6 (Online)",
    openingDate: "2026-05-19",
    endingDate: "2026-08-25",
    progress: { completedSessions: 17, totalSessions: 28, percentage: 60.7 },
    studentCounts: { active: 18, onHold: 0, dropped: 2, transferred: 3, totalEnrolled: 23 },
    healthMetrics: {
      classRiskLevel: "high",
      healthScore: 68.5,
      isAlarmTriggered: true,
      attendanceAverage: 95.0,
      homeworkAverage: 78.5,
      passChuanRate: 55.6,
      passMemRate: 66.7
    },
    labelDistribution: { grey: 2, red: 4, yellow: 11, noData: 1, netMomentum: -2 },
    actionItems: { urgentCallsNeeded: 4, homeworkRemindersNeeded: 5, pendingPassReviews: 1 },
    portalUrl: "https://portal.izone.edu.vn/academic-affairs/course-classes/1159",
    lastSyncedAt: "2026-07-27T10:00:00Z"
  },
  {
    classId: 1006,
    className: "IC2030",
    courseId: 2,
    courseName: "IELTS Chiến lược (Khối 3-4)",
    teacher: {
      teacherId: 412,
      fullName: "Nguyễn Hoàng Anh",
      email: "anh.nh@izone.edu.vn",
      phone: "0912345678"
    },
    leadEmail: "ha.nnb@izone.edu.vn",
    status: "on_going",
    schedule: "Thứ 2, Thứ 5 (Online)",
    openingDate: "2025-12-26",
    endingDate: "2026-04-24",
    progress: { completedSessions: 28, totalSessions: 28, percentage: 100.0 },
    studentCounts: { active: 17, onHold: 1, dropped: 0, transferred: 0, totalEnrolled: 18 },
    healthMetrics: {
      classRiskLevel: "medium",
      healthScore: 82.0,
      isAlarmTriggered: false,
      attendanceAverage: 92.6,
      homeworkAverage: 93.5,
      passChuanRate: 47.1,
      passMemRate: 76.5
    },
    labelDistribution: { grey: 2, red: 2, yellow: 13, noData: 0, netMomentum: +1 },
    actionItems: { urgentCallsNeeded: 2, homeworkRemindersNeeded: 2, pendingPassReviews: 1 },
    portalUrl: "https://portal.izone.edu.vn/academic-affairs/course-classes/1006",
    lastSyncedAt: "2026-07-27T10:00:00Z"
  },
  {
    classId: 905,
    className: "IC1924",
    courseId: 2,
    courseName: "IELTS Chiến lược (Khối 3-4)",
    teacher: {
      teacherId: 218,
      fullName: "Lê Thanh Hà",
      email: "ha.lt@izone.edu.vn",
      phone: "0923456789"
    },
    leadEmail: "ha.nnb@izone.edu.vn",
    status: "on_going",
    schedule: "Thứ 4, Thứ 7 (Online)",
    openingDate: "2025-09-12",
    endingDate: "2025-12-23",
    progress: { completedSessions: 28, totalSessions: 28, percentage: 100.0 },
    studentCounts: { active: 18, onHold: 0, dropped: 0, transferred: 1, totalEnrolled: 19 },
    healthMetrics: {
      classRiskLevel: "low",
      healthScore: 91.0,
      isAlarmTriggered: false,
      attendanceAverage: 98.0,
      homeworkAverage: 95.0,
      passChuanRate: 50.0,
      passMemRate: 66.7
    },
    labelDistribution: { grey: 2, red: 1, yellow: 15, noData: 0, netMomentum: +3 },
    actionItems: { urgentCallsNeeded: 1, homeworkRemindersNeeded: 1, pendingPassReviews: 0 },
    portalUrl: "https://portal.izone.edu.vn/academic-affairs/course-classes/905",
    lastSyncedAt: "2026-07-27T10:00:00Z"
  }
];

export const MOCK_STUDENTS_IC2174: StudentDetail[] = [
  {
    studentId: 10162,
    studentCode: "10162",
    fullName: "Nguyễn Thị Như Quỳnh",
    phone: "0348570368",
    email: "nhuquynh2072k5@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Chưa đạt",
    attendance: { percentage: 100, presentSessions: 18, totalSessions: 18, isDroppingRecently: false },
    homework: { percentage: 100, completedCount: 18, totalCount: 18, isDroppingRecently: false },
    testPerformance: {
      testsTakenCount: 4,
      averageScore: 51.3,
      lastScore: 57.0,
      trendDirection: "improving",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 35.0, makeupScore: 43.5, finalScore: 43.5, isMakeup: true },
        { testOrder: 2, testName: "Test 2", rawScore: 46.5, makeupScore: 54.5, finalScore: 54.5, isMakeup: true },
        { testOrder: 3, testName: "Test 3", rawScore: 50.0, makeupScore: null, finalScore: 50.0, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 57.0, makeupScore: null, finalScore: 57.0, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "red",
      previousLabel: "grey",
      benchmarkLabel: "grey",
      hasChangedRecently: true,
      changeDirection: "up",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 65,
      suggestedAction: "review_pass",
      passChuanStatus: "Chưa đạt điều kiện pass",
      passChuanReasons: ["TB test <60"],
      passMemStatus: "Đạt pass mềm",
      passMemGroup: "Nhóm 1",
      passMemLabel: "Test 50-<55, ĐH 100%, BTVN 100%",
      isEligibleForReview: true,
      reviewStatus: "Chờ GV"
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      teacherFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      teacherNote: "HV cực kỳ ngoan, nỗ lực làm bài thi bù tăng từ 35 -> 57"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 25806,
    studentCode: "25806",
    fullName: "Nguyễn Thu Huyền",
    phone: "0969033998",
    email: "hn1327569@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Chưa đạt",
    attendance: { percentage: 100, presentSessions: 18, totalSessions: 18, isDroppingRecently: false },
    homework: { percentage: 53, completedCount: 10, totalCount: 18, isDroppingRecently: true },
    testPerformance: {
      testsTakenCount: 4,
      averageScore: 48.6,
      lastScore: 51.0,
      trendDirection: "improving",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 50.0, makeupScore: null, finalScore: 50.0, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 47.5, makeupScore: null, finalScore: 47.5, isMakeup: false },
        { testOrder: 3, testName: "Test 3", rawScore: 46.0, makeupScore: null, finalScore: 46.0, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 51.0, makeupScore: null, finalScore: 51.0, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "red",
      previousLabel: "red",
      benchmarkLabel: "red",
      hasChangedRecently: false,
      changeDirection: "same",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 88,
      suggestedAction: "call_parent",
      passChuanStatus: "Chưa đạt điều kiện pass",
      passChuanReasons: ["BTVN < 90%", "TB Test < 60"],
      passMemStatus: "Không đạt pass mềm",
      passMemGroup: "",
      passMemLabel: "",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN chưa tốt, còn thiếu nhiều bài tập",
      teacherFeedbackOrientation: "có tinh thần đi học tốt, tuy nhiên cần chú ý làm bài đầy đủ hơn",
      teacherNote: "Chưa đạt: BTVN < 90%, TB Test < 60"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 17958,
    studentCode: "17958",
    fullName: "Nguyễn Phương Thảo",
    phone: "0362342204",
    email: "Trannguyenphuongthao22@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Chưa đạt",
    attendance: { percentage: 94, presentSessions: 17, totalSessions: 18, isDroppingRecently: true },
    homework: { percentage: 67, completedCount: 12, totalCount: 18, isDroppingRecently: true },
    testPerformance: {
      testsTakenCount: 3,
      averageScore: 52.5,
      lastScore: 60.5,
      trendDirection: "improving",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 55.0, makeupScore: null, finalScore: 55.0, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 42.0, makeupScore: null, finalScore: 42.0, isMakeup: false },
        { testOrder: 3, testName: "Test 3", rawScore: 60.5, makeupScore: null, finalScore: 60.5, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "red",
      previousLabel: "red",
      benchmarkLabel: "red",
      hasChangedRecently: false,
      changeDirection: "same",
      lastCheckpoint: "Test 3"
    },
    evaluation: {
      riskScore: 78,
      suggestedAction: "assign_hw",
      passChuanStatus: "Chưa đạt điều kiện pass",
      passChuanReasons: ["BTVN <90%", "TB test <60"],
      passMemStatus: "Không đạt pass mềm",
      passMemGroup: "",
      passMemLabel: "",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN tương đối tốt, tuy nhiên vẫn thiếu bài tập",
      teacherFeedbackOrientation: "có tinh thần đi học tốt",
      teacherNote: "Vắng mặt buổi Test 4, cần nhắc nộp bài tập về nhà tuần này"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 25801,
    studentCode: "25801",
    fullName: "Nguyễn Việt Anh",
    phone: "0868578476",
    email: "vietanh251109@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Đạt",
    attendance: { percentage: 88, presentSessions: 16, totalSessions: 18, isDroppingRecently: true },
    homework: { percentage: 100, completedCount: 18, totalCount: 18, isDroppingRecently: false },
    testPerformance: {
      testsTakenCount: 4,
      averageScore: 64.2,
      lastScore: 56.0,
      trendDirection: "declining",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 60.5, makeupScore: null, finalScore: 60.5, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 70.0, makeupScore: null, finalScore: 70.0, isMakeup: false },
        { testOrder: 3, testName: "Test 3", rawScore: 70.5, makeupScore: null, finalScore: 70.5, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 56.0, makeupScore: null, finalScore: 56.0, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "yellow",
      previousLabel: "yellow",
      benchmarkLabel: "yellow",
      hasChangedRecently: false,
      changeDirection: "same",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 72,
      suggestedAction: "call_parent",
      passChuanStatus: "Đạt tiêu chuẩn",
      passChuanReasons: [],
      passMemStatus: "Đạt pass mềm",
      passMemGroup: "Nhóm 3",
      passMemLabel: "Test >=60",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      teacherFeedbackOrientation: "cần cải thiện tỉ lệ đi học để đảm bảo tiến độ khóa học",
      teacherNote: "Điểm test 4 bị tụt xuống 56.0, nghỉ học 2 buổi liên tiếp gần đây!"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 18717,
    studentCode: "18717",
    fullName: "Lê Khả Hân",
    phone: "0815739553",
    email: "khahan275@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Đạt",
    attendance: { percentage: 94, presentSessions: 17, totalSessions: 18, isDroppingRecently: false },
    homework: { percentage: 100, completedCount: 18, totalCount: 18, isDroppingRecently: false },
    testPerformance: {
      testsTakenCount: 4,
      averageScore: 90.8,
      lastScore: 93.0,
      trendDirection: "improving",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 93.5, makeupScore: null, finalScore: 93.5, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 85.0, makeupScore: null, finalScore: 85.0, isMakeup: false },
        { testOrder: 3, testName: "Test 3", rawScore: 91.5, makeupScore: null, finalScore: 91.5, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 93.0, makeupScore: null, finalScore: 93.0, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "yellow",
      previousLabel: "yellow",
      benchmarkLabel: "yellow",
      hasChangedRecently: false,
      changeDirection: "same",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 10,
      suggestedAction: "none",
      passChuanStatus: "Có khả năng pass",
      passChuanReasons: [],
      passMemStatus: "Đạt pass mềm",
      passMemGroup: "Nhóm 3",
      passMemLabel: "Test >=60",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      teacherFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      teacherNote: "Học viên xuất sắc, top 1 của lớp!"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 19428,
    studentCode: "19428",
    fullName: "Nguyễn Trường Huy",
    phone: "0354670164",
    email: "nguyentruonghuy11092006@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Chưa đạt",
    attendance: { percentage: 100, presentSessions: 18, totalSessions: 18, isDroppingRecently: false },
    homework: { percentage: 100, completedCount: 18, totalCount: 18, isDroppingRecently: false },
    testPerformance: {
      testsTakenCount: 4,
      averageScore: 71.1,
      lastScore: 84.0,
      trendDirection: "improving",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 54.0, makeupScore: null, finalScore: 54.0, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 70.5, makeupScore: null, finalScore: 70.5, isMakeup: false },
        { testOrder: 3, testName: "Test 3", rawScore: 76.0, makeupScore: null, finalScore: 76.0, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 84.0, makeupScore: null, finalScore: 84.0, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "yellow",
      previousLabel: "red",
      benchmarkLabel: "red",
      hasChangedRecently: true,
      changeDirection: "up",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 15,
      suggestedAction: "none",
      passChuanStatus: "Có khả năng pass",
      passChuanReasons: [],
      passMemStatus: "Đạt pass mềm",
      passMemGroup: "Nhóm 3",
      passMemLabel: "Test >=60",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      teacherFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      teacherNote: "Tiến bộ vượt bậc, đã chuyển nhãn từ Đỏ lên Vàng ở Test 2 và giữ vững phong độ!"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  },
  {
    studentId: 19483,
    studentCode: "19483",
    fullName: "Trịnh Viết Thiện",
    phone: "0961938462",
    email: "caotramy85@gmail.com",
    classId: 1159,
    className: "IC2174",
    registrationStatus: "active",
    admittedAt: "2026-05-19",
    targetOutputStatus: "Chưa đạt",
    attendance: { percentage: 100, presentSessions: 18, totalSessions: 18, isDroppingRecently: false },
    homework: { percentage: 94, completedCount: 17, totalCount: 18, isDroppingRecently: false },
    testPerformance: {
      testsTakenCount: 3,
      averageScore: 67.2,
      lastScore: 67.5,
      trendDirection: "stable",
      scores: [
        { testOrder: 1, testName: "Test 1", rawScore: 74.0, makeupScore: null, finalScore: 74.0, isMakeup: false },
        { testOrder: 2, testName: "Test 2", rawScore: 57.5, makeupScore: 60.0, finalScore: 60.0, isMakeup: true },
        { testOrder: 3, testName: "Test 3", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 4, testName: "Test 4", rawScore: 67.5, makeupScore: null, finalScore: 67.5, isMakeup: false },
        { testOrder: 5, testName: "Test 5", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false },
        { testOrder: 6, testName: "Test 6", rawScore: null, makeupScore: null, finalScore: null, isMakeup: false }
      ],
      isCheatingFlagged: false
    },
    labeling: {
      currentLabel: "yellow",
      previousLabel: "yellow",
      benchmarkLabel: "yellow",
      hasChangedRecently: false,
      changeDirection: "same",
      lastCheckpoint: "Test 4"
    },
    evaluation: {
      riskScore: 25,
      suggestedAction: "none",
      passChuanStatus: "Có khả năng pass",
      passChuanReasons: [],
      passMemStatus: "Đạt pass mềm",
      passMemGroup: "Nhóm 3",
      passMemLabel: "Test >=60",
      isEligibleForReview: false,
      reviewStatus: ""
    },
    portalEvidence: {
      teacherFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      teacherFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      teacherNote: "Test 2 thi lại đạt 60.0, giữ vững phong độ ổn định"
    },
    updatedAt: "2026-07-27T10:00:15Z"
  }
];

export const MOCK_PENDING_REVIEWS: PendingReviewEnriched[] = [
  {
    reviewId: "RV001",
    student: {
      studentId: 10162,
      studentCode: "10162",
      fullName: "Nguyễn Thị Như Quỳnh",
      phone: "0348570368",
      email: "nhuquynh2072k5@gmail.com",
      avatarInitials: "NQ"
    },
    classInfo: {
      classId: 1159,
      className: "IC2174",
      teacherId: 305,
      teacherName: "Trần Minh Phương"
    },
    qualification: {
      passMemGroup: "Nhóm 1",
      reasonTitle: "Đạt Pass Mềm Nhóm 1 (ĐH 100% + BTVN 100%)",
      testAverage: 51.3,
      attendancePct: 100.0,
      homeworkPct: 100.0,
      scoreHistory: [50, 49, 51, 55],
      trendDirection: "improving"
    },
    evidence: {
      portalFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      portalFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      aiRecommendation: {
        action: "APPROVE",
        confidence: 95,
        reasoning: "Học viên có ý thức tuyệt đối (ĐH 100%, BTVN 100%) và có nỗ lực thi lại vượt bậc."
      }
    },
    workflow: {
      status: "Chờ GV",
      teacherDecision: null,
      teacherComment: null,
      confirmedAt: null,
      deadline: "2026-08-04T23:59:59Z",
      isOverdue: false,
      hoursRemaining: 168,
      escalatedToLead: false
    },
    createdAt: "2026-07-27T10:00:15Z"
  },
  {
    reviewId: "RV002",
    student: {
      studentId: 25823,
      studentCode: "25823",
      fullName: "Lê Thị Thanh Trúc",
      phone: "0901111004",
      email: "trucltt@gmail.com",
      avatarInitials: "TT"
    },
    classInfo: {
      classId: 1006,
      className: "IC2030",
      teacherId: 412,
      teacherName: "Nguyễn Hoàng Anh"
    },
    qualification: {
      passMemGroup: "Nhóm 2",
      reasonTitle: "Đạt Pass Mềm Nhóm 2 (Test 55.8, ĐH 100%, BTVN 100%)",
      testAverage: 55.8,
      attendancePct: 100.0,
      homeworkPct: 100.0,
      scoreHistory: [55, 52, 56, 60],
      trendDirection: "improving"
    },
    evidence: {
      portalFeedbackBtvn: "có tinh thần làm BTVN rất tốt. Em làm BTVN đầy đủ",
      portalFeedbackOrientation: "có tinh thần đi học rất tốt. Em đi học đầy đủ",
      aiRecommendation: {
        action: "APPROVE",
        confidence: 98,
        reasoning: "Học viên qua 6 bài test tiến bộ liên tục, xứng đáng đạt chuẩn đầu ra."
      }
    },
    workflow: {
      status: "Chờ GV",
      teacherDecision: null,
      teacherComment: null,
      confirmedAt: null,
      deadline: "2026-08-02T23:59:59Z",
      isOverdue: false,
      hoursRemaining: 120,
      escalatedToLead: false
    },
    createdAt: "2026-07-25T10:00:00Z"
  }
];

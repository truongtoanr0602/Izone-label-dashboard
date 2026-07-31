/**
 * Kịch bản của bộ dữ liệu mock.
 *
 * Đây không phải danh sách lớp ngẫu nhiên — mỗi lớp được đặt vào một tình
 * huống cụ thể để kiểm chứng một phần của dashboard. Cột `exercises` ghi rõ
 * lớp đó dùng để thử cái gì; khi sửa thiết kế mà một tình huống không còn ai
 * đại diện thì phải bổ sung lại, nếu không sẽ có nhánh giao diện không bao
 * giờ được nhìn thấy trước khi lên thật.
 */

/** Mốc thời gian cố định của bộ mock. Không dùng new Date() để dữ liệu đứng yên. */
export const REFERENCE_DATE = '2026-07-31';

export const SESSIONS_PER_WEEK = 2;
export const TOTAL_SESSIONS = 28;
export const TOTAL_TESTS = 6;

/** Buổi học diễn ra bài test thứ i (1-based). 6 test rải đều trên 28 buổi. */
export const TEST_SESSIONS = [4, 8, 12, 16, 20, 24];

/**
 * Độ khó lệch của từng bài test, áp cho MỌI lớp.
 *
 * Test 3 cố tình khó (-8 điểm). Vì các lớp thi Test 3 ở những tuần lịch khác
 * nhau nhưng cùng một mốc tiến độ, cú lõm này chỉ hiện ra trên biểu đồ vòng
 * đời (trục = % tiến độ), không hiện trên biểu đồ theo lịch. Đó chính là thứ
 * dải phân vị lịch sử phải bắt được.
 */
export const TEST_DIFFICULTY_OFFSET = [0, +2, -8, -1, +1, -2];

/**
 * Cú sốc theo LỊCH: tuần chứa ngày này cả khối cùng tụt điểm danh.
 *
 * Ngược với Test 3 ở trên — cú này hiện trên trục lịch và biến mất trên trục
 * vòng đời. Có cả hai loại trong mock thì mới kiểm chứng được rằng đường
 * trung bình khối vẽ phía sau mỗi sparkline thật sự phân biệt được "lỗi của
 * lớp" với "chuyện chung của cả khối".
 */
export const CALENDAR_SHOCK = {
  weekOf: '2026-06-15',
  attendanceDrop: 12,
  homeworkDrop: 7,
  note: 'Tuần nghỉ lễ — cả khối cùng tụt',
};

/* ------------------------------------------------------------------ *
 * Nguyên mẫu lớp
 * ------------------------------------------------------------------ */

export interface ClassArchetype {
  key: string;
  /** TB điểm test kỳ vọng của lớp ở giữa khóa. */
  abilityMean: number;
  /** Độ phân tán năng lực giữa các HV trong lớp. */
  abilitySpread: number;
  /** 0..1 — chi phối tỷ lệ đi học và làm BTVN. */
  diligence: number;
  /** Điểm thay đổi sau mỗi bài test: dương = lớp đi lên, âm = sa sút. */
  trendPerTest: number;
  exercises: string;
}

/**
 * Hiệu chỉnh theo dữ liệu thật trong `01_DanhSach_Lop`:
 *
 *   - Điểm danh và BTVN ở trung tâm này LUÔN cao (92–98% kể cả ở lớp yếu).
 *     Thứ phân hoá lớp là ĐIỂM TEST, không phải chuyên cần. Nên `diligence`
 *     nằm sát trần ở mọi nguyên mẫu, còn `abilityMean` mới là thứ kéo giãn.
 *   - Nhãn cắt ở mốc 60, nên tỷ lệ xám+đỏ của lớp xấp xỉ P(năng lực < 60).
 *     Ví dụ: mean 71 / spread 9 → khoảng 12% dưới ngưỡng, đúng mức một lớp
 *     khỏe; mean 63 / spread 11 → khoảng 40%, tức chạm mốc báo động.
 */
export const ARCHETYPES: Record<string, ClassArchetype> = {
  healthy: {
    key: 'healthy',
    abilityMean: 71,
    abilitySpread: 9,
    diligence: 0.96,
    trendPerTest: 0.4,
    exercises: 'Trạng thái bình thường — phần bị thu gọn của bảng xếp hạng',
  },
  average: {
    key: 'average',
    abilityMean: 67,
    abilitySpread: 10,
    diligence: 0.94,
    trendPerTest: 0.2,
    exercises: 'Vùng giữa — kiểm tra bảng không tô cảnh báo tràn lan',
  },
  declining: {
    key: 'declining',
    abilityMean: 66,
    abilitySpread: 11,
    diligence: 0.92,
    trendPerTest: -1.6,
    exercises: 'Sa sút dần — sparkline đi xuống, dòng chảy nhãn âm',
  },
  atRisk: {
    key: 'atRisk',
    abilityMean: 64,
    abilitySpread: 11,
    diligence: 0.93,
    trendPerTest: -0.6,
    exercises: 'Vượt mốc báo động 40% — vạch ngưỡng trên bảng xếp hạng',
  },
  recovering: {
    key: 'recovering',
    abilityMean: 61,
    abilitySpread: 11,
    diligence: 0.94,
    trendPerTest: +2.0,
    exercises: 'Đang gỡ được — thanh dòng chảy nhãn nghiêng về phía dương',
  },
  fresh: {
    key: 'fresh',
    abilityMean: 68,
    abilitySpread: 10,
    diligence: 0.97,
    trendPerTest: 0.3,
    exercises: 'Mới khai giảng — trạng thái thiếu dữ liệu, mẫu số bằng 0',
  },
};

/* ------------------------------------------------------------------ *
 * Giáo viên
 * ------------------------------------------------------------------ */

export interface TeacherPlan {
  teacherId: number;
  fullName: string;
  role: 'teacher' | 'lead';
}

export const TEACHER_PLANS: TeacherPlan[] = [
  { teacherId: 100, fullName: 'Nguyễn Ngọc Bảo Hà', role: 'lead' },
  { teacherId: 301, fullName: 'Trần Minh Phương', role: 'teacher' },
  { teacherId: 302, fullName: 'Nguyễn Hoàng Anh', role: 'teacher' },
  { teacherId: 303, fullName: 'Lê Thanh Hà', role: 'teacher' },
  { teacherId: 304, fullName: 'Phạm Quang Duy', role: 'teacher' },
  { teacherId: 305, fullName: 'Đỗ Ngọc Lan', role: 'teacher' },
  { teacherId: 306, fullName: 'Vũ Hải Nam', role: 'teacher' },
  { teacherId: 307, fullName: 'Hoàng Thu Trang', role: 'teacher' },
  { teacherId: 308, fullName: 'Bùi Khánh Linh', role: 'teacher' },
  { teacherId: 309, fullName: 'Đặng Gia Bảo', role: 'teacher' },
  { teacherId: 310, fullName: 'Phan Xuân Mai', role: 'teacher' },
];

export const LEAD_TEACHER_ID = 100;

/* ------------------------------------------------------------------ *
 * 15 lớp đang chạy
 * ------------------------------------------------------------------ */

export interface ClassPlan {
  classId: number;
  className: string;
  teacherId: number;
  archetype: string;
  /** % tiến độ khóa tại REFERENCE_DATE. */
  progressPct: number;
  enrolled: number;
  seed: number;
  /**
   * Dịch năng lực trung bình của riêng lớp này so với nguyên mẫu.
   * Dùng để ghim một lớp vào đúng tình huống cần dựng mà không phải đẻ thêm
   * nguyên mẫu chỉ dùng một lần.
   */
  abilityOffset?: number;
  exercises?: string;
}

export const ACTIVE_CLASS_PLANS: ClassPlan[] = [
  // --- Ba lớp vượt mốc báo động 40% -------------------------------------
  { classId: 1159, className: 'IC2174', teacherId: 301, archetype: 'declining', progressPct: 67, enrolled: 21, seed: 1159,
    exercises: 'Lớp xấu nhất khối; chứa ca Vàng→Xám (rơi 2 bậc)' },
  { classId: 1201, className: 'IC2201', teacherId: 301, archetype: 'atRisk', progressPct: 57, enrolled: 19, seed: 1201,
    exercises: 'Vượt mốc, cùng GV với IC2174 — tạo tín hiệu cho bảng so sánh GV' },
  { classId: 1210, className: 'IC2210', teacherId: 303, archetype: 'atRisk', progressPct: 93, enrolled: 18, seed: 1210,
    abilityOffset: -4,
    exercises: 'Sắp kết thúc mà vẫn nhiều đỏ — góc phải-trên của biểu đồ phân tán' },

  // --- Vùng cảnh báo / trung bình ---------------------------------------
  { classId: 1205, className: 'IC2205', teacherId: 303, archetype: 'recovering', progressPct: 71, enrolled: 18, seed: 1205,
    exercises: 'Gần mốc nhưng đang gỡ — thanh dòng chảy nhãn dương' },
  { classId: 1220, className: 'IC2220', teacherId: 304, archetype: 'declining', progressPct: 64, enrolled: 17, seed: 1220 },
  { classId: 1193, className: 'IC2193', teacherId: 301, archetype: 'average', progressPct: 50, enrolled: 18, seed: 1193 },
  { classId: 1196, className: 'IC2196', teacherId: 304, archetype: 'average', progressPct: 43, enrolled: 20, seed: 1196 },
  { classId: 1230, className: 'IC2230', teacherId: 306, archetype: 'average', progressPct: 36, enrolled: 19, seed: 1230 },
  { classId: 1227, className: 'IC2227', teacherId: 306, archetype: 'average', progressPct: 50, enrolled: 8, seed: 1227,
    exercises: 'Sĩ số nhỏ — lộ ra chênh lệch giữa trung bình có trọng số và không trọng số' },

  // --- Lớp khỏe ---------------------------------------------------------
  { classId: 1188, className: 'IC2188', teacherId: 302, archetype: 'healthy', progressPct: 79, enrolled: 19, seed: 1188 },
  { classId: 1190, className: 'IC2190', teacherId: 302, archetype: 'healthy', progressPct: 86, enrolled: 18, seed: 1190 },
  { classId: 1198, className: 'IC2198', teacherId: 305, archetype: 'healthy', progressPct: 29, enrolled: 17, seed: 1198 },
  { classId: 1224, className: 'IC2224', teacherId: 305, archetype: 'healthy', progressPct: 71, enrolled: 24, seed: 1224,
    exercises: 'Sĩ số lớn nhất — đối trọng với IC2227 khi kiểm tra trọng số' },

  // --- Lớp mới, thiếu dữ liệu -------------------------------------------
  { classId: 1218, className: 'IC2218', teacherId: 307, archetype: 'fresh', progressPct: 18, enrolled: 18, seed: 1218,
    exercises: 'Mới có Test 1 — pass rate thấp một cách tự nhiên, không phải do dạy kém' },
  { classId: 1215, className: 'IC2215', teacherId: 307, archetype: 'fresh', progressPct: 7, enrolled: 16, seed: 1215,
    exercises: 'CHƯA có test nào — toàn bộ HV "Chưa có DL", dòng chảy nhãn mẫu số 0' },
];

/* ------------------------------------------------------------------ *
 * 20 lớp đã kết thúc — nền cho dải phân vị lịch sử
 * ------------------------------------------------------------------ */

/** `endedWeeksAgo` tính từ REFERENCE_DATE. Trải đều ~12 tháng gần nhất. */
export interface HistoricalClassPlan extends ClassPlan {
  endedWeeksAgo: number;
}

export const HISTORICAL_CLASS_PLANS: HistoricalClassPlan[] = [
  { classId: 905,  className: 'IC1924', teacherId: 303, archetype: 'average',    progressPct: 100, enrolled: 19, seed: 905,  endedWeeksAgo: 32 },
  { classId: 1006, className: 'IC2030', teacherId: 302, archetype: 'average',    progressPct: 100, enrolled: 18, seed: 1006, endedWeeksAgo: 14 },
  { classId: 910,  className: 'IC1931', teacherId: 301, archetype: 'atRisk',     progressPct: 100, enrolled: 17, seed: 910,  endedWeeksAgo: 48 },
  { classId: 915,  className: 'IC1940', teacherId: 305, archetype: 'healthy',    progressPct: 100, enrolled: 20, seed: 915,  endedWeeksAgo: 45 },
  { classId: 922,  className: 'IC1955', teacherId: 304, archetype: 'average',    progressPct: 100, enrolled: 18, seed: 922,  endedWeeksAgo: 43 },
  { classId: 930,  className: 'IC1968', teacherId: 306, archetype: 'declining',  progressPct: 100, enrolled: 16, seed: 930,  endedWeeksAgo: 40 },
  { classId: 938,  className: 'IC1977', teacherId: 302, archetype: 'healthy',    progressPct: 100, enrolled: 21, seed: 938,  endedWeeksAgo: 37 },
  { classId: 946,  className: 'IC1989', teacherId: 308, archetype: 'average',    progressPct: 100, enrolled: 19, seed: 946,  endedWeeksAgo: 35 },
  { classId: 954,  className: 'IC1996', teacherId: 301, archetype: 'declining',  progressPct: 100, enrolled: 18, seed: 954,  endedWeeksAgo: 30 },
  { classId: 962,  className: 'IC2004', teacherId: 309, archetype: 'healthy',    progressPct: 100, enrolled: 17, seed: 962,  endedWeeksAgo: 28 },
  { classId: 970,  className: 'IC2012', teacherId: 303, archetype: 'recovering', progressPct: 100, enrolled: 20, seed: 970,  endedWeeksAgo: 26 },
  { classId: 978,  className: 'IC2019', teacherId: 310, archetype: 'average',    progressPct: 100, enrolled: 18, seed: 978,  endedWeeksAgo: 24 },
  { classId: 986,  className: 'IC2025', teacherId: 305, archetype: 'healthy',    progressPct: 100, enrolled: 22, seed: 986,  endedWeeksAgo: 21 },
  { classId: 994,  className: 'IC2028', teacherId: 308, archetype: 'atRisk',     progressPct: 100, enrolled: 15, seed: 994,  endedWeeksAgo: 19 },
  { classId: 1014, className: 'IC2041', teacherId: 306, archetype: 'average',    progressPct: 100, enrolled: 19, seed: 1014, endedWeeksAgo: 17 },
  { classId: 1022, className: 'IC2055', teacherId: 309, archetype: 'healthy',    progressPct: 100, enrolled: 18, seed: 1022, endedWeeksAgo: 12 },
  { classId: 1030, className: 'IC2068', teacherId: 304, archetype: 'declining',  progressPct: 100, enrolled: 17, seed: 1030, endedWeeksAgo: 10 },
  { classId: 1038, className: 'IC2077', teacherId: 310, archetype: 'average',    progressPct: 100, enrolled: 20, seed: 1038, endedWeeksAgo: 8  },
  { classId: 1046, className: 'IC2089', teacherId: 302, archetype: 'recovering', progressPct: 100, enrolled: 18, seed: 1046, endedWeeksAgo: 5  },
  { classId: 1054, className: 'IC2101', teacherId: 307, archetype: 'average',    progressPct: 100, enrolled: 19, seed: 1054, endedWeeksAgo: 3  },
];

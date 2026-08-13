/**
 * Độ phủ liên hệ: trong số cảnh báo đang mở của một lớp, bao nhiêu cái GV đã
 * xác nhận đã liên hệ.
 *
 * Đếm theo EPISODE = (học viên, luồng, mốc test). Một episode đóng khi có bản
 * ghi contact_logs khớp cả ba. Đổi mốc test là mọi episode mở lại — đó là chủ
 * đích: nhãn được tính lại sau mỗi bài test nên lời nhắc cũ không còn giá trị.
 *
 * Mỗi HV chỉ mở tối đa MỘT episode, vì classifyStudent xếp mỗi HV vào đúng một
 * interventionLevel và trả đúng một recommendedAction. Frontend
 * (selectors/contactLog.ts) có thêm luật "đóng hộ" COVERED_BY cho trường hợp
 * một HV mở nhiều luồng cùng lúc — luật đó hiện là no-op vì cả ba predicate
 * trong studentFilters.ts đều rẽ theo interventionLevel. Nếu sau này nghiệp vụ
 * cho phép một HV mở nhiều luồng, phải port COVERED_BY sang đây, nếu không con
 * số Lead thấy sẽ lệch con số GV thấy.
 */

export interface ContactCoverage {
  done: number;
  total: number;
  /**
   * null khi total = 0 — KHÔNG được thay bằng 0. Một lớp không có cảnh báo nào
   * và một lớp bỏ mặc 100% cảnh báo là hai chuyện khác hẳn nhau; trả 0% khiến
   * chúng hiện ra giống hệt nhau trên bảng của Lead. Cùng quy ước với
   * dashboard/src/data/selectors/contactLog.ts.
   */
  pct: number | null;
}

export interface CoverageStudent {
  studentId: number;
  classId: number;
  /** null nghĩa là HV không mở cảnh báo nào — không vào mẫu số. */
  messageTemplateKey: string | null;
  checkpoint: string;
}

export interface CoverageLog {
  studentId: number;
  classId: number;
  triggerType: string;
  checkpoint: string;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

const episodeKey = (
  studentId: number,
  classId: number,
  trigger: string,
  checkpoint: string,
): string => `${classId}|${studentId}|${trigger}|${checkpoint}`;

export function contactCoverageByClass(
  students: CoverageStudent[],
  logs: CoverageLog[],
): Map<number, ContactCoverage> {
  const closed = new Set(
    logs.map((row) =>
      episodeKey(row.studentId, row.classId, row.triggerType, row.checkpoint),
    ),
  );

  const tally = new Map<number, { done: number; total: number }>();
  for (const student of students) {
    const current = tally.get(student.classId) ?? { done: 0, total: 0 };
    if (student.messageTemplateKey !== null) {
      current.total += 1;
      if (
        closed.has(
          episodeKey(
            student.studentId,
            student.classId,
            student.messageTemplateKey,
            student.checkpoint,
          ),
        )
      ) {
        current.done += 1;
      }
    }
    tally.set(student.classId, current);
  }

  return new Map(
    [...tally].map(([classId, { done, total }]) => [
      classId,
      { done, total, pct: total === 0 ? null : round1((done / total) * 100) },
    ]),
  );
}

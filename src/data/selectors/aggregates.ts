import type { ClassSnapshot } from '../types';
import { round1 } from '../number';

export interface KhoiAggregate {
  /** Số lớp đưa vào phép tổng hợp (kể cả lớp chưa thi). */
  classCount: number;
  activeStudents: number;
  /** Luỹ kế toàn khối. Tính trên MỌI lớp, kể cả lớp không còn HV active. */
  droppedStudents: number;
  attendanceAvg: number;
  homeworkAvg: number;
  /** null khi chưa lớp nào có bài test — KHÔNG được thay bằng 0. */
  passChuanRate: number | null;
  passMemRate: number | null;
  riskPct: number;
  /** Mẫu số của hai tỷ lệ pass ở trên. Giao diện phải hiện con số này. */
  classesWithTests: number;
}

/**
 * Tổng hợp cấp khối từ các ảnh chụp lớp, **có trọng số theo sĩ số**.
 *
 * Trung bình của các trung bình (cách cũ trong LeadDashboard.tsx) khiến lớp 8 HV
 * và lớp 23 HV đóng góp ngang nhau. Ở đây mọi tỷ lệ đều nhân với sĩ số trước khi
 * cộng.
 *
 * Tỷ lệ pass chỉ tổng hợp trên lớp ĐÃ có bài test. Lớp mới khai giảng có
 * passChuanRate = 0 không phải vì dạy kém mà vì chưa thi; gộp vào là kéo tụt con
 * số khối một cách sai lệch (§7 của tài liệu thiết kế).
 */
export function aggregateKhoi(snapshots: ClassSnapshot[]): KhoiAggregate {
  const withStudents = snapshots.filter((s) => s.activeStudents > 0);
  const totalStudents = withStudents.reduce((sum, s) => sum + s.activeStudents, 0);

  const weighted = (pick: (s: ClassSnapshot) => number): number =>
    totalStudents === 0
      ? 0
      : withStudents.reduce((sum, s) => sum + pick(s) * s.activeStudents, 0) / totalStudents;

  const scored = withStudents.filter((s) => s.testsCompleted > 0);
  const scoredStudents = scored.reduce((sum, s) => sum + s.activeStudents, 0);

  const weightedScored = (pick: (s: ClassSnapshot) => number): number | null =>
    scoredStudents === 0
      ? null
      : round1(
          scored.reduce((sum, s) => sum + pick(s) * s.activeStudents, 0) / scoredStudents,
        );

  const atRisk = withStudents.reduce(
    (sum, s) => sum + s.labelCounts.grey + s.labelCounts.red,
    0,
  );

  return {
    classCount: snapshots.length,
    activeStudents: totalStudents,
    // Cố ý duyệt `snapshots` chứ không phải `withStudents`: một lớp có thể mất
    // hết HV active mà vẫn phải tính số đã bỏ học của nó.
    droppedStudents: snapshots.reduce((sum, s) => sum + s.droppedStudents, 0),
    attendanceAvg: round1(weighted((s) => s.attendanceAvg)),
    homeworkAvg: round1(weighted((s) => s.homeworkAvg)),
    passChuanRate: weightedScored((s) => s.passChuanRate),
    passMemRate: weightedScored((s) => s.passMemRate),
    riskPct: totalStudents === 0 ? 0 : round1((atRisk / totalStudents) * 100),
    classesWithTests: scored.length,
  };
}

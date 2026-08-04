import type { ContactLog, ContactTrigger, StudentDetail } from '../types';
import { round1 } from '../number';
import {
  isHomeworkReminderStudent,
  isRelearnAdviceStudent,
  isUrgentCallStudent,
} from './studentFilters';

/**
 * Nhãn "chưa có bài test nào" — dùng làm checkpoint cho lớp mới khai giảng.
 *
 * Không dùng chuỗi rỗng hay null: khoá episode phải luôn là một chuỗi so sánh
 * được, và một lượt liên hệ ở giai đoạn trước bài test đầu tiên vẫn là một
 * lượt liên hệ có thật cần ghi lại.
 */
export const NO_CHECKPOINT = 'Chưa có test';

export interface Episode {
  studentId: number;
  trigger: ContactTrigger;
}

export interface ContactCoverage {
  done: number;
  total: number;
  /**
   * null khi `total === 0` — KHÔNG được thay bằng 0. Một lớp không có cảnh báo
   * nào và một lớp bỏ mặc 100% cảnh báo là hai chuyện khác hẳn nhau; trả về 0%
   * khiến chúng hiện ra giống hệt nhau trên bảng của Lead. Cùng quy ước với
   * `aggregateKhoi`.
   */
  pct: number | null;
}

/** Ba luồng cảnh báo hiện có, theo thứ tự ưu tiên hiển thị. */
const TRIGGERS: { trigger: ContactTrigger; match: (s: StudentDetail) => boolean }[] = [
  { trigger: 'urgent_call', match: isUrgentCallStudent },
  { trigger: 'relearn_advice', match: isRelearnAdviceStudent },
  { trigger: 'homework_reminder', match: isHomeworkReminderStudent },
];

export function episodeKey(
  studentId: number,
  trigger: ContactTrigger,
  checkpoint: string,
): string {
  return `${studentId}|${trigger}|${checkpoint}`;
}

/**
 * Mốc test đang mở của lớp: bài test có `testOrder` lớn nhất mà ĐÃ có ít nhất
 * một học viên trong lớp nhận điểm.
 *
 * Suy từ điểm học viên chứ không từ tiến độ buổi học, vì nhãn chỉ được tính
 * lại khi có điểm — tuần không có test thì nhãn đứng yên và mọi cảnh báo đang
 * mở vẫn là cảnh báo cũ, không được phép tự làm mới.
 */
export function currentCheckpoint(students: StudentDetail[]): string {
  let best: { order: number; name: string } | null = null;

  for (const s of students) {
    for (const t of s.testPerformance.scores) {
      if (t.finalScore === null) continue;
      if (best === null || t.testOrder > best.order) {
        best = { order: t.testOrder, name: t.testName };
      }
    }
  }

  return best?.name ?? NO_CHECKPOINT;
}

/**
 * Mọi cảnh báo đang mở của một danh sách học viên.
 *
 * Một HV có thể mở nhiều episode cùng lúc (vừa cần gọi gấp vừa cần nhắc BTVN)
 * và đó là chủ đích: đóng một việc không có nghĩa là đã làm việc kia.
 */
export function openEpisodes(students: StudentDetail[]): Episode[] {
  const episodes: Episode[] = [];

  for (const s of students) {
    for (const { trigger, match } of TRIGGERS) {
      if (match(s)) episodes.push({ studentId: s.studentId, trigger });
    }
  }

  return episodes;
}

/**
 * Luồng nào ĐÓNG HỘ được luồng nào — cố ý MỘT CHIỀU.
 *
 * Đo trên dữ liệu: trong 17 HV của danh sách nhắc BTVN có 5 HV đồng thời nằm
 * trong "Gọi gấp", và cả 5 đều đã có `BTVN <90%` nằm sẵn trong lý do của kịch
 * bản gọi phụ huynh. GV gọi PH xong — cuộc gọi đó đã nói về bài tập — rồi hệ
 * thống vẫn bắt nhắn Zalo cho chính HV đó để nhắc nộp bài. Một việc, đếm hai
 * lần, và thẻ "còn X/Y" hiện ra công việc thực tế đã xong.
 *
 * Chiều ngược lại KHÔNG được phép: một tin nhắn Zalo cho học viên không thay
 * thế được cuộc gọi cho phụ huynh. Đây cũng là lý do bảng này không phải quan
 * hệ đối xứng — nếu để hai chiều thì GV đóng việc dễ rồi bỏ việc khó vẫn hiện
 * 100% trên bảng của Lead.
 *
 * `relearn_advice` KHÔNG đóng hộ `homework_reminder`: buổi tư vấn phương án học
 * bàn về việc học lại / bảo lưu, không phải về việc nộp bài — HV nhãn Xám vẫn
 * cần được nhắc BTVN như mọi HV khác.
 */
const COVERED_BY: Record<ContactTrigger, ContactTrigger[]> = {
  urgent_call: [],
  relearn_advice: [],
  homework_reminder: ['urgent_call'],
};

/**
 * Lượt liên hệ đã đóng episode này — có thể là lượt của chính luồng đó, hoặc
 * của một luồng bao nó (xem {@link COVERED_BY}). `null` nếu chưa ai đụng tới.
 *
 * Trả về cả bản ghi chứ không chỉ true/false, vì giao diện cần phân biệt "đã
 * nhắn Zalo" với "đã gọi PH nên khỏi nhắn" — hai chuyện đó GV phải thấy khác
 * nhau, nếu không họ sẽ tưởng mình đã gửi tin nhắn mà thật ra chưa.
 */
export function closingContact(
  logs: ContactLog[],
  studentId: number,
  trigger: ContactTrigger,
  checkpoint: string,
): ContactLog | null {
  // Ưu tiên lượt của CHÍNH luồng này trước khi xét luồng bao: nếu GV vừa gọi
  // PH vừa nhắn Zalo thật, giao diện phải hiện "đã nhắn" (có nút hoàn tác) chứ
  // không phải "đã gọi PH nên khỏi nhắn".
  for (const t of [trigger, ...COVERED_BY[trigger]]) {
    const hit = logs.find(
      (l) => l.studentId === studentId && l.checkpoint === checkpoint && l.trigger === t,
    );
    if (hit) return hit;
  }

  return null;
}

export function isContacted(
  logs: ContactLog[],
  studentId: number,
  trigger: ContactTrigger,
  checkpoint: string,
): boolean {
  return closingContact(logs, studentId, trigger, checkpoint) !== null;
}

/** Lượt liên hệ gần nhất của một episode, bất kể checkpoint. `null` nếu chưa từng. */
export function lastContact(
  logs: ContactLog[],
  studentId: number,
  trigger: ContactTrigger,
): ContactLog | null {
  let latest: ContactLog | null = null;

  for (const l of logs) {
    if (l.studentId !== studentId || l.trigger !== trigger) continue;
    if (latest === null || l.createdAt > latest.createdAt) latest = l;
  }

  return latest;
}

/**
 * Độ phủ liên hệ tại mốc hiện tại: bao nhiêu cảnh báo đang mở đã được GV xác
 * nhận đã liên hệ.
 *
 * Đếm theo EPISODE chứ không theo học viên — một HV mở hai cảnh báo thì phải
 * đếm hai lần, nếu không GV đóng việc dễ rồi bỏ việc khó vẫn hiện 100%.
 * Nhiều log trùng một episode chỉ tính một lần.
 */
export function contactCoverage(
  students: StudentDetail[],
  logs: ContactLog[],
  checkpoint: string,
): ContactCoverage {
  const episodes = openEpisodes(students);
  const done = episodes.filter((e) =>
    isContacted(logs, e.studentId, e.trigger, checkpoint),
  ).length;

  return {
    done,
    total: episodes.length,
    pct: episodes.length === 0 ? null : round1((done / episodes.length) * 100),
  };
}

/** Số episode CHƯA liên hệ của một luồng — con số "còn lại" trên thẻ hành động. */
export function remainingCount(
  students: StudentDetail[],
  logs: ContactLog[],
  trigger: ContactTrigger,
  checkpoint: string,
): number {
  const match = TRIGGERS.find((t) => t.trigger === trigger)?.match;
  if (!match) return 0;

  return students.filter(
    (s) => match(s) && !isContacted(logs, s.studentId, trigger, checkpoint),
  ).length;
}

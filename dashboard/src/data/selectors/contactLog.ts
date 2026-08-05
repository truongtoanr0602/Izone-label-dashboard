import type { ContactLog, ContactTrigger, StudentDetail } from '../types';
import { round1 } from '../number';
import {
  isHabitReminderStudent,
  isRelearnAdviceStudent,
  isRedFollowUpStudent,
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

/**
 * Ba luồng, xếp theo THANG CAN THIỆP tăng dần — cũng là thứ tự hiển thị trên
 * dải thẻ và thứ tự tab trong bảng.
 *
 * Mức 1 nhắc nhở giải quyết được, mức 3 thì không. Giữ đúng một thứ tự ở mọi
 * nơi để GV không phải học lại cách đọc màn hình mỗi lần đổi chỗ nhìn.
 */
const TRIGGERS: { trigger: ContactTrigger; match: (s: StudentDetail) => boolean }[] = [
  { trigger: 'habit_reminder', match: isHabitReminderStudent },
  { trigger: 'red_followup', match: isRedFollowUpStudent },
  { trigger: 'relearn_advice', match: isRelearnAdviceStudent },
];

/**
 * HV này có đang mở cảnh báo thuộc luồng đó không.
 *
 * Cửa duy nhất để giao diện hỏi câu đó — modal, thẻ và bảng đều gọi hàm này
 * thay vì tự lặp lại predicate, nên không thể lệch nhau như hồi ba nơi cùng
 * copy-paste định nghĩa "HV nguy cấp".
 */
export function matchesTrigger(s: StudentDetail, trigger: ContactTrigger): boolean {
  return TRIGGERS.find((t) => t.trigger === trigger)?.match(s) ?? false;
}

/**
 * Thứ tự ưu tiên khi một HV mở nhiều luồng và giao diện chỉ hiện được MỘT —
 * NGƯỢC với thứ tự trên: can thiệp nặng nhất thắng.
 *
 * Hai thứ tự khác nhau là chủ đích. Dải thẻ đọc từ nhẹ tới nặng vì đó là thứ
 * tự khối lượng công việc; ô "Hành động" của một HV thì phải chỉ ra việc quan
 * trọng nhất với chính bạn ấy.
 */
export const TRIGGER_PRIORITY: ContactTrigger[] = [
  'relearn_advice',
  'red_followup',
  'habit_reminder',
];

/** Luồng cần xử lý nhất của một HV, `null` nếu HV không mở cảnh báo nào. */
export function primaryTrigger(s: StudentDetail): ContactTrigger | null {
  return TRIGGER_PRIORITY.find((t) => matchesTrigger(s, t)) ?? null;
}

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
 * Một HV có thể mở nhiều episode cùng lúc (vừa nhãn Đỏ vừa chưa đủ chăm) và đó
 * là chủ đích: đóng một việc không có nghĩa là đã làm việc kia.
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
 * Đo trên dữ liệu: 32/63 HV nhãn Đỏ và 8/11 HV nhãn Xám đồng thời chưa đủ chăm.
 * Vì MỌI kịch bản trong `messageScripts.ts` đều nêu cả đi học lẫn BTVN kèm số
 * cụ thể, GV nhắn xong tin nhóm Đỏ/Xám — tin đó đã nói về đi học và bài tập —
 * rồi hệ thống vẫn bắt nhắn thêm một tin nữa. Hai tin nói cùng một việc, đếm
 * hai lần, và thẻ "còn X/Y" hiện ra công việc thực tế đã xong.
 *
 * Chiều ngược lại KHÔNG được phép: tin nhắc bài tập không nói gì về việc đi học
 * sa sút hay về lộ trình học. Đây là lý do bảng này không đối xứng — nếu để hai
 * chiều thì GV đóng việc dễ rồi bỏ việc khó vẫn hiện 100% trên bảng của Lead.
 *
 * `relearn_advice` cũng đóng hộ `homework_reminder` vì tin nhắn của nhóm Xám
 * nêu cả đi học lẫn BTVN kèm số cụ thể (xem `messageScripts.ts`, có test ràng
 * buộc điều đó). Nếu ai sửa kịch bản đó bỏ phần bài tập đi thì luật này thành
 * ra nói dối — test trong `messageScripts.test.ts` chính là cái chặn.
 */
const COVERED_BY: Record<ContactTrigger, ContactTrigger[]> = {
  habit_reminder: ['red_followup', 'relearn_advice'],
  red_followup: [],
  relearn_advice: [],
};

/**
 * Lượt liên hệ đã đóng episode này — có thể là lượt của chính luồng đó, hoặc
 * của một luồng bao nó (xem {@link COVERED_BY}). `null` nếu chưa ai đụng tới.
 *
 * Trả về cả bản ghi chứ không chỉ true/false, vì giao diện cần phân biệt "GV đã
 * gửi tin của luồng này" với "nội dung đã nằm trong tin của luồng khác" — hai
 * chuyện đó GV phải thấy khác nhau, nếu không họ tưởng mình đã gửi mà thật ra chưa.
 */
export function closingContact(
  logs: ContactLog[],
  studentId: number,
  trigger: ContactTrigger,
  checkpoint: string,
): ContactLog | null {
  // Ưu tiên lượt của CHÍNH luồng này trước khi xét luồng bao: nếu GV đã gửi cả
  // tin nhóm Đỏ lẫn tin BTVN thật, giao diện phải hiện "đã nhắn" (có nút hoàn
  // tác) chứ không phải huy hiệu xám "đã nằm trong tin kia".
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

import type { StudentDetail } from '../types';

/**
 * BA NHÓM THEO THANG CAN THIỆP.
 *
 * Cách chia cũ trộn hai trục vào nhau: nhóm "cần gọi gấp" định nghĩa là
 * `nhãn Đỏ HOẶC điểm danh <80%` — một cái OR bắc cầu giữa trục KẾT QUẢ (điểm
 * test) và trục HÀNH VI (đi học, nộp bài), nên hai HV cùng nằm trong đó có thể
 * vào vì hai lý do chẳng liên quan gì nhau, và không có quy tắc nào giải thích
 * được vì sao lại là ba nhóm ấy.
 *
 * Cách chia hiện tại: mỗi nhóm đúng MỘT tiêu chí, xếp theo mức can thiệp tăng
 * dần — nhắc nhở giải quyết được (hành vi) → cần bám sát (điểm dưới ngưỡng
 * nhưng còn cứu) → nhắc nhở không giải quyết được (nền yếu).
 *
 * Nhãn Đỏ KHÔNG còn được coi là "gấp". Theo ARCHITECTURE §4 đây là nhóm 50/50
 * mà can thiệp có tác dụng thật, và việc cần làm với họ đúng bằng việc cần làm
 * với bất kỳ ai đang lơ là — không có gì khẩn cấp theo giờ ở đây.
 */

/**
 * Ngưỡng nhắc = ngưỡng PASS, không phải ngưỡng cảnh báo.
 *
 * Trước đây dùng 80 (`alert_dh_tut_pct`), trong khi điều kiện pass là 90
 * (`pass_dh_min` / `pass_btvn_min`). Cái khe 80–90 đó khiến 27 HV nhãn Đỏ có
 * ĐH/BTVN kiểu 89% không nhận được lời nhắc nào: trên ngưỡng cảnh báo nên hệ
 * thống im lặng, nhưng dưới ngưỡng pass nên chắc chắn trượt. Đúng nhóm mà
 * ARCHITECTURE §4 nói can thiệp có hiệu quả cao nhất.
 *
 * ⚠️ Số 90 này PHẢI khớp `pass_dh_min` / `pass_btvn_min` trong
 * `06_CauHinh_HeThong`. Nghiệp vụ đổi ngưỡng pass mà quên chỗ này thì lời nhắc
 * sẽ lệch âm thầm với điều kiện thật.
 */
const PASS_THRESHOLD_PCT = 90;

/**
 * Mức 1 — HV chưa đủ chăm để đạt điều kiện pass.
 *
 * CỐ Ý không đọc nhãn: đây là trục hành vi, độc lập hoàn toàn với điểm test.
 * Nhờ vậy HV nhãn Đỏ hay Xám đang lơ là cũng rơi vào đây như mọi HV khác — họ
 * không bị "nhãn của mình" đẩy ra khỏi danh sách nhắc chăm học.
 *
 * Gộp đi học và BTVN làm một nhóm vì chúng sinh ra CÙNG một tin nhắn. Tách ra
 * hai danh sách chỉ khiến GV mở hai chỗ để gửi cùng một thứ.
 */
export function isHabitReminderStudent(s: StudentDetail): boolean {
  if (s.interventionLevel !== undefined) return s.interventionLevel === 'level_1';
  return (
    s.registrationStatus === 'on_going' &&
    ((s.attendance.percentage !== null && s.attendance.percentage < PASS_THRESHOLD_PCT) ||
      (s.homework.percentage !== null && s.homework.percentage < PASS_THRESHOLD_PCT) ||
      s.homework.isDroppingRecently)
  );
}

/**
 * Mức 2 — HV nhãn Đỏ, cần bám sát.
 *
 * TB test 45–59: dưới ngưỡng đạt đầu ra nhưng theo dữ liệu lịch sử vẫn còn cứu
 * được — "Can thiệp + ĐH & BTVN > 90% → tỷ lệ đạt vượt 60%" (ARCHITECTURE §4).
 * Vì vậy tin nhắn cho nhóm này là ĐỘNG VIÊN kèm số cụ thể, không phải cảnh báo.
 */
export function isRedFollowUpStudent(s: StudentDetail): boolean {
  if (s.interventionLevel !== undefined) return s.interventionLevel === 'level_2';
  return s.labeling.currentLabel === 'red' && s.registrationStatus === 'on_going';
}

/**
 * Mức 3 — HV nhãn Xám, cần bàn lại lộ trình.
 *
 * TB test <45, mức mà ARCHITECTURE §4 mô tả là "gần như không cứu được dù ĐH &
 * BTVN đạt 83%". Đây là nhóm DUY NHẤT mà nhắc nhở không giải quyết được vấn đề,
 * nên cũng là nhóm duy nhất cần một loại trao đổi khác về chất.
 *
 * Trước đây nhóm này không rơi vào bất kỳ luồng hành động nào: `suggestedAction`
 * chỉ suy từ điểm danh và BTVN, không hề đọc nhãn, nên một HV Xám đi học đều và
 * nộp bài đủ hiện ô hành động là "--".
 */
export function isRelearnAdviceStudent(s: StudentDetail): boolean {
  if (s.interventionLevel !== undefined) return s.interventionLevel === 'level_3';
  return s.labeling.currentLabel === 'grey' && s.registrationStatus === 'on_going';
}

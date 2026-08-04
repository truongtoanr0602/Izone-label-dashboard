import type { StudentDetail } from '../types';

/**
 * HV cần gọi phụ huynh gấp. Định nghĩa DUY NHẤT — trước đây bị copy-paste
 * khác nhau ở StudentTable, CallParentModal và bộ sinh dữ liệu mock
 * (`generate.ts` chỉ đếm `suggestedAction === 'call_parent'`, thiếu hẳn
 * nhánh nhãn Đỏ và điểm danh <80%), khiến số trên thẻ TopRibbon/nút Header
 * luôn THẤP HƠN số học viên thật sự liệt kê trong bảng/modal.
 */
export function isUrgentCallStudent(s: StudentDetail): boolean {
  return (
    s.evaluation.suggestedAction === 'call_parent' ||
    s.labeling.currentLabel === 'red' ||
    s.attendance.percentage < 80
  );
}

/** HV cần nhắc BTVN qua Zalo. Định nghĩa DUY NHẤT — cùng lý do như trên. */
export function isHomeworkReminderStudent(s: StudentDetail): boolean {
  return (
    s.evaluation.suggestedAction === 'assign_hw' ||
    s.homework.percentage < 80 ||
    s.homework.isDroppingRecently
  );
}

/**
 * HV cần tư vấn học lại / bảo lưu / đổi lớp.
 *
 * Nhãn Xám nghĩa là TB test < 45 — theo dữ liệu lịch sử (ARCHITECTURE §4) đây
 * là mức "gần như không cứu được dù ĐH & BTVN đạt 83%". Trước đây nhóm này
 * KHÔNG rơi vào bất kỳ luồng hành động nào: `suggestedAction` chỉ suy từ điểm
 * danh và BTVN, không hề đọc nhãn, nên một HV Xám đi học đều và nộp bài đủ sẽ
 * hiện ô hành động là "--" — màn hình GV im lặng về chính nhóm rủi ro nhất.
 *
 * CỐ Ý tách khỏi `isUrgentCallStudent`: đây không phải việc "gấp trong ngày"
 * mà là việc phải trao đổi khác về chất — đặt lại phương án học, chứ không
 * phải hối thúc nộp bài. Gộp hai danh sách sẽ làm loãng đúng thứ cần gấp.
 */
export function isRelearnAdviceStudent(s: StudentDetail): boolean {
  return s.labeling.currentLabel === 'grey' && s.registrationStatus === 'active';
}

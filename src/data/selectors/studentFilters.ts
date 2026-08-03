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

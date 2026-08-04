import type { ContactTrigger, LabelCode } from './types';

/** Chữ hiện trên huy hiệu "đã xong" của từng luồng liên hệ. */
export const TRIGGER_DONE_TEXT: Record<ContactTrigger, string> = {
  urgent_call: 'Đã gọi PH',
  relearn_advice: 'Đã tư vấn PH',
  homework_reminder: 'Đã nhắn BTVN',
};

/**
 * Chữ và màu của nhãn — ĐỊNH NGHĨA DUY NHẤT.
 *
 * Trước đây mỗi nơi tự viết lại một tam thức `red ? 'ĐỎ' : 'XÁM'`, và
 * `CallParentModal` vì thế dán nhãn "XÁM" lên một HV nhãn Vàng chỉ vì bạn đó
 * lọt vào danh sách gọi gấp do điểm danh <80%. Tam thức hai nhánh không thể
 * biểu diễn nổi bốn giá trị của `LabelCode`; một bảng tra thì có.
 */
export const LABEL_TEXT: Record<LabelCode, string> = {
  red: 'ĐỎ',
  yellow: 'VÀNG',
  grey: 'XÁM',
  no_data: 'CHƯA CÓ DL',
};

export const LABEL_BADGE_CLASS: Record<LabelCode, string> = {
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  yellow: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  grey: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25',
  no_data: 'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46]',
};

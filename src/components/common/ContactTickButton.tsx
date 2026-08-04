import React from 'react';
import { Check, CheckCircle2, Undo2 } from 'lucide-react';

interface ContactTickButtonProps {
  /** Có lượt liên hệ của CHÍNH luồng này (GV đã tự tick). */
  contacted: boolean;
  /**
   * Luồng khác đã đóng hộ episode này — ví dụ HV vừa thuộc nhóm Đỏ vừa trong
   * danh sách nhắc BTVN: tin nhóm Đỏ đã nêu sẵn số bài tập nên không cần gửi
   * thêm tin riêng. Chỉ có nghĩa khi `contacted` là false.
   */
  coveredByText?: string;
  /** Mốc test mà cái tick này thuộc về — hiện lên để GV biết nó hết hạn khi nào. */
  checkpoint: string;
  onMark: () => void;
  onUndo: () => void;
}

/**
 * Nút xác nhận "đã liên hệ", dùng chung cho cả ba modal hành động.
 *
 * Trạng thái đã tick CỐ Ý hiện kèm tên mốc test. Nếu chỉ hiện một dấu tick
 * trống, GV sẽ hiểu là "xong hẳn rồi"; hiện "Đã liên hệ · Test 3" nói đúng
 * điều hệ thống thật sự biết — bạn đã liên hệ Ở MỐC NÀY, và sau bài test tới
 * thì câu hỏi sẽ được hỏi lại.
 */
export const ContactTickButton: React.FC<ContactTickButtonProps> = ({
  contacted,
  coveredByText,
  checkpoint,
  onMark,
  onUndo,
}) => {
  if (!contacted && coveredByText) {
    // Việc đã nằm trong tin nhắn của luồng khác (tin nhóm Đỏ và nhóm Xám đều nêu
    // cả đi học lẫn BTVN). KHÔNG hiện huy hiệu xanh giống trường hợp GV tự tick,
    // và không có nút hoàn tác — hoàn tác ở đây sẽ phải gỡ lượt liên hệ của luồng
    // kia, tức là sửa một thứ mà màn hình này không sở hữu.
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span
          className="px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/70 dark:text-[#a1a1aa] border border-[#e5e7eb] dark:border-[#52525b]"
          title={`Nội dung này đã nằm trong tin nhắn đã gửi tại mốc ${checkpoint} — không cần nhắn lại`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> {coveredByText} · {checkpoint}
        </span>
        <button
          onClick={onMark}
          className="text-[11px] font-medium text-[#404040]/50 dark:text-[#71717a] hover:text-[#404040] dark:hover:text-[#e4e4e7] underline underline-offset-2 transition-colors"
        >
          Vẫn nhắn thêm
        </button>
      </div>
    );
  }

  if (!contacted) {
    return (
      <button
        onClick={onMark}
        className="px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 bg-transparent border border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 active:scale-95 transition-all"
      >
        <Check className="w-3.5 h-3.5" /> Đã liên hệ
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" /> Đã liên hệ · {checkpoint}
      </span>
      <button
        onClick={onUndo}
        title="Bấm nhầm? Gỡ xác nhận này"
        className="p-1.5 rounded-[8px] text-[#404040]/40 dark:text-[#71717a] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
      >
        <Undo2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

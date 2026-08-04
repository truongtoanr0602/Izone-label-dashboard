import React from 'react';
import { PhoneCall, MessageSquare, Award, AlertTriangle, TrendingDown, Clock, ArrowUpRight, Compass } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface TopRibbonProps {
  selectedClass: ClassSummary;
  /**
   * Số HV nhãn Xám của lớp. Tính ở App.tsx từ danh sách HV — cố ý KHÔNG thêm
   * trường mới vào `ClassSummary.actionItems`, vì đó là hợp đồng với backend.
   */
  relearnCount: number;
  /** Số episode CHƯA được xác nhận liên hệ, theo từng luồng, tại mốc hiện tại. */
  remaining: { urgent: number; relearn: number; homework: number };
  onOpenCallModal: () => void;
  onOpenZaloModal: () => void;
  onOpenRelearnModal: () => void;
  onFilterUrgent: () => void;
  onFilterRelearn: () => void;
}

/**
 * Mỗi thẻ hiện "còn X / Y" thay vì một con số trần.
 *
 * Một con số đứng yên không nói được GV đã làm tới đâu — sau khi gọi hết 8 phụ
 * huynh, thẻ vẫn hiện 8 và trông y hệt lúc chưa ai làm gì. Giữ cả mẫu số để
 * không mất bối cảnh quy mô công việc.
 */
const RemainingStat: React.FC<{ remaining: number; total: number; toneClass: string }> = ({
  remaining,
  total,
  toneClass,
}) => (
  <div className="text-right shrink-0">
    <span
      className={`text-2xl font-extrabold font-mono leading-none ${
        remaining === 0 ? 'text-emerald-500' : toneClass
      }`}
    >
      {remaining}
    </span>
    <span className="text-sm font-bold font-mono text-[#404040]/40 dark:text-[#71717a]">/{total}</span>
    <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">
      {remaining === 0 ? 'Đã liên hệ hết' : 'Chưa liên hệ'}
    </p>
  </div>
);

export const TopRibbon: React.FC<TopRibbonProps> = ({
  selectedClass,
  relearnCount,
  remaining,
  onOpenCallModal,
  onOpenZaloModal,
  onOpenRelearnModal,
  onFilterUrgent,
  onFilterRelearn
}) => {
  const { actionItems } = selectedClass;

  return (
    // Bốn thẻ bằng nhau. Trước đây là lưới 12 cột với span 5/4/3 để thẻ đầu to
    // nhất; nhồi thêm thẻ thứ tư vào đó sẽ ép thẻ cuối xuống span-2 và vỡ chữ.
    // Ưu tiên giờ thể hiện bằng THỨ TỰ và MÀU, không bằng kích thước.
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Cần gọi phụ huynh gấp — ưu tiên cao nhất */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
              <PhoneCall className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <AlertTriangle className="w-3 h-3" /> Can thiệp 30 giây
              </span>
              <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
                Cần gọi phụ huynh gấp
              </h3>
            </div>
          </div>
          <RemainingStat remaining={remaining.urgent} total={actionItems.urgentCallsNeeded} toneClass="text-red-500" />
        </div>

        {/* Mô tả phải khớp `isUrgentCallStudent`. Trước đây ghi "tụt nhãn Xám/Đỏ"
            trong khi bộ lọc không hề đọc nhãn Xám — nhóm Xám nay có thẻ riêng. */}
        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3">
          HV nhãn Đỏ hoặc điểm danh tụt dưới 80%.
        </p>

        <div className="mt-auto pt-3 border-t border-red-200 dark:border-red-900/40 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onFilterUrgent}
            className="text-[11px] font-medium text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] underline underline-offset-2 transition-colors"
          >
            Lọc bảng HV này
          </button>
          <button
            onClick={onOpenCallModal}
            className="px-3 py-2 rounded-[8px] bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Gọi ngay
          </button>
        </div>
      </div>

      {/* Card 2: Nhãn Xám — tư vấn phương án học. Theo TB test đây là nhóm rủi ro
          cao nhất, nhưng trước đây không rơi vào bất kỳ luồng hành động nào. */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] border border-slate-300 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/20 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-slate-500/10 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/25">
                <AlertTriangle className="w-3 h-3" /> Nhãn Xám
              </span>
              <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
                Cần tư vấn học lại
              </h3>
            </div>
          </div>
          <RemainingStat remaining={remaining.relearn} total={relearnCount} toneClass="text-slate-600 dark:text-slate-400" />
        </div>

        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3">
          TB test &lt;45 — bàn phương án học lại / bảo lưu / đổi lớp.
        </p>

        <div className="mt-auto pt-3 border-t border-slate-300 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onFilterRelearn}
            className="text-[11px] font-medium text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] underline underline-offset-2 transition-colors"
          >
            Lọc bảng HV này
          </button>
          <button
            onClick={onOpenRelearnModal}
            className="px-3 py-2 rounded-[8px] bg-transparent border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Compass className="w-3.5 h-3.5" /> Kịch bản tư vấn
          </button>
        </div>
      </div>

      {/* Card 3: Cần nhắc nhở BTVN — ưu tiên trung bình */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] bg-white dark:bg-[#27272a] flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <TrendingDown className="w-3 h-3" /> BTVN Sa sút
              </span>
              <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
                Cần nhắc nhở BTVN
              </h3>
            </div>
          </div>
          <RemainingStat remaining={remaining.homework} total={actionItems.homeworkRemindersNeeded} toneClass="text-amber-500" />
        </div>

        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3">
          Tỷ lệ nộp BTVN tụt dưới 80% — tính cả HV nhãn Xám.
        </p>

        <div className="mt-auto pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-end">
          <button
            onClick={onOpenZaloModal}
            className="px-3 py-2 rounded-[8px] bg-transparent border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Gửi Zalo nhắc nhở
          </button>
        </div>
      </div>

      {/* Card 4: Chờ duyệt Pass mềm — hành chính, không khẩn cấp */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] bg-white dark:bg-[#27272a] flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-slate-500/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/20 font-mono">
                <Clock className="w-3 h-3" /> SLA: 7 Ngày
              </span>
              <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
                Chờ duyệt Pass mềm
              </h3>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-extrabold font-mono text-slate-600 dark:text-slate-400 leading-none">
              {actionItems.pendingPassReviews}
            </span>
            <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Hồ sơ</p>
          </div>
        </div>

        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3">
          HV đạt Nhóm 1, Nhóm 2 chờ GV đánh giá chuyên cần &amp; BTVN.
        </p>

        <div className="mt-auto pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-end">
          <a
            href={selectedClass.portalUrl || "https://portal.izone.edu.vn"}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-[8px] bg-transparent border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            Duyệt trên Portal <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

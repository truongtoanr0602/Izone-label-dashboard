import React from 'react';
import { PhoneCall, MessageSquare, Award, AlertTriangle, TrendingDown, Clock, ArrowUpRight } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface TopRibbonProps {
  selectedClass: ClassSummary;
  onOpenCallModal: () => void;
  onOpenZaloModal: () => void;
  onFilterUrgent: () => void;
}

export const TopRibbon: React.FC<TopRibbonProps> = ({
  selectedClass,
  onOpenCallModal,
  onOpenZaloModal,
  onFilterUrgent
}) => {
  const { actionItems } = selectedClass;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      {/* Card 1: Urgent Phone Calls Needed — mức ưu tiên cao nhất, chiếm nhiều không gian nhất */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] md:col-span-5 border border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-red-500/10 flex items-center justify-center text-red-500">
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
          <div className="text-right">
            <span className="text-3xl font-extrabold font-mono text-red-500 leading-none">
              {actionItems.urgentCallsNeeded}
            </span>
            <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Học viên</p>
          </div>
        </div>
        
        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3 line-clamp-1">
          HV tụt nhãn Xám/Đỏ liên tiếp hoặc ĐH tuần tụt &lt; 80%.
        </p>

        <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-900/40 flex items-center justify-between gap-2">
          <button
            onClick={onFilterUrgent}
            className="text-[11px] font-medium text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] underline underline-offset-2 transition-colors"
          >
            Lọc bảng HV này
          </button>
          <button
            onClick={onOpenCallModal}
            className="px-4 py-2 rounded-[8px] bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Gọi ngay (SĐT + Kịch bản)
          </button>
        </div>
      </div>

      {/* Card 2: Homework Reminders Needed — mức ưu tiên trung bình */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] md:col-span-4 bg-white dark:bg-[#27272a]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-amber-500/10 flex items-center justify-center text-amber-500">
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
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-amber-500 leading-none">
              {actionItems.homeworkRemindersNeeded}
            </span>
            <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Học viên</p>
          </div>
        </div>

        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3 line-clamp-1">
          Tỷ lệ nộp BTVN tích lũy tụt dưới 80%, có xu hướng lười biếng.
        </p>

        <div className="mt-4 pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-end">
          <button
            onClick={onOpenZaloModal}
            className="px-4 py-2 rounded-[8px] bg-transparent border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Gửi Zalo nhắc nhở (Mẫu tin nhắn)
          </button>
        </div>
      </div>

      {/* Card 3: Pending Pass Reviews — mức ưu tiên thấp nhất, hành chính chứ không khẩn cấp */}
      <div className="relative overflow-hidden rounded-[16px] p-[24px] md:col-span-3 bg-white dark:bg-[#27272a]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-slate-500/10 flex items-center justify-center text-slate-500 dark:text-slate-400">
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
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-slate-600 dark:text-slate-400 leading-none">
              {actionItems.pendingPassReviews}
            </span>
            <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Hồ sơ</p>
          </div>
        </div>

        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-3 line-clamp-1">
          HV đạt Nhóm 1, Nhóm 2 chờ GV đánh giá chuyên cần & BTVN.
        </p>

        <div className="mt-4 pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-end">
          <a
            href={selectedClass.portalUrl || "https://portal.izone.edu.vn"}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-[8px] bg-transparent border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors font-semibold text-xs flex items-center gap-1.5 active:scale-95"
          >
            Duyệt trên Portal <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

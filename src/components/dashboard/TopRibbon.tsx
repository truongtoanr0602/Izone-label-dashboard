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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Urgent Phone Calls Needed */}
      <div className="relative overflow-hidden rounded-2xl p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
              <PhoneCall className="w-5 h-5 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <AlertTriangle className="w-3 h-3" /> Can thiệp 30 giây
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                Cần gọi phụ huynh gấp
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-red-400 leading-none">
              {actionItems.urgentCallsNeeded}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Học viên</p>
          </div>
        </div>
        
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-1">
          HV tụt nhãn Xám/Đỏ liên tiếp hoặc ĐH tuần tụt &lt; 80%.
        </p>
        
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={onFilterUrgent}
            className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2 transition-colors"
          >
            Lọc bảng HV này
          </button>
          <button
            onClick={onOpenCallModal}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Gọi ngay (SĐT + Kịch bản)
          </button>
        </div>
      </div>

      {/* Card 2: Homework Reminders Needed */}
      <div className="relative overflow-hidden rounded-2xl p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <TrendingDown className="w-3 h-3" /> BTVN Sa sút
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                Cần nhắc nhở BTVN
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-amber-400 leading-none">
              {actionItems.homeworkRemindersNeeded}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Học viên</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-1">
          Tỷ lệ nộp BTVN tích lũy tụt dưới 80%, có xu hướng lười biếng.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-end">
          <button
            onClick={onOpenZaloModal}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-600/20 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Gửi Zalo nhắc nhở (Mẫu tin nhắn)
          </button>
        </div>
      </div>

      {/* Card 3: Pending Pass Reviews */}
      <div className="relative overflow-hidden rounded-2xl p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#DB0829]/20 border border-[#DB0829]/30 flex items-center justify-center text-[#DB0829] shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#DB0829] bg-[#DB0829]/15 px-2 py-0.5 rounded-full border border-[#DB0829]/30 font-mono">
                <Clock className="w-3 h-3" /> SLA: 7 Ngày
              </span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                Chờ duyệt Pass mềm
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-[#DB0829] leading-none">
              {actionItems.pendingPassReviews}
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Hồ sơ</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-1">
          HV đạt Nhóm 1, Nhóm 2 chờ GV đánh giá chuyên cần & BTVN.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-end">
          <a
            href={selectedClass.portalUrl || "https://portal.izone.edu.vn"}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#DB0829] hover:bg-[#b80620] text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#DB0829]/30 active:scale-95"
          >
            Duyệt trên Portal <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

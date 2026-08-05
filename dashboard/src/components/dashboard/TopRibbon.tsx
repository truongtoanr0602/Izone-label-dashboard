import React from 'react';
import { MessageSquare, Award, Clock, ArrowUpRight, Compass, TrendingUp } from 'lucide-react';
import type { ClassSummary, ContactTrigger } from '../../data/types';
import { TRIGGER_SHORT_TITLE } from '../../data/labels';

interface TopRibbonProps {
  selectedClass: ClassSummary;
  /**
   * Tổng số HV của từng luồng, tính ở App.tsx từ danh sách HV thật của lớp.
   *
   * CỐ Ý không đọc `ClassSummary.actionItems`: các trường ở đó
   * (`urgentCallsNeeded`, `homeworkRemindersNeeded`) mang tên của cách phân
   * nhóm cũ và là hợp đồng với backend, không sửa được từ đây.
   */
  totals: Record<ContactTrigger, number>;
  /** Số episode CHƯA được xác nhận đã nhắn, theo từng luồng, tại mốc hiện tại. */
  remaining: Record<ContactTrigger, number>;
  onOpenTrigger: (trigger: ContactTrigger) => void;
  onFilterTrigger: (trigger: ContactTrigger) => void;
}

/**
 * Ba thẻ hành động xếp theo THANG CAN THIỆP, không phải theo mức "gấp".
 *
 * Cách bày cũ trộn hai trục vào nhau — thẻ đầu là `nhãn Đỏ HOẶC điểm danh <80%`,
 * một cái OR bắc cầu giữa trục kết quả và trục hành vi — nên không có quy tắc
 * nào giải thích được vì sao lại là ba nhóm ấy. Giờ mỗi thẻ đúng một tiêu chí,
 * và đọc từ trái sang phải là mức can thiệp tăng dần: nhắc nhở giải quyết được
 * → cần bám sát → nhắc nhở không giải quyết được.
 */
const CARDS: {
  trigger: ContactTrigger;
  level: string;
  criterion: string;
  action: string;
  icon: React.ReactNode;
  iconWrap: string;
  badge: string;
  tone: string;
  border: string;
  surface: string;
}[] = [
  {
    trigger: 'habit_reminder',
    level: 'Mức 1',
    criterion: 'Đi học hoặc BTVN dưới 90%',
    action: 'Chưa đủ điều kiện pass đầu ra — nhắc nhở là giải quyết được.',
    icon: <MessageSquare className="w-5 h-5" />,
    iconWrap: 'bg-amber-500/10 text-amber-500',
    badge: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    tone: 'text-amber-500',
    border: 'border-amber-200 dark:border-amber-900/40',
    surface: 'bg-white dark:bg-[#27272a]',
  },
  {
    trigger: 'red_followup',
    level: 'Mức 2',
    criterion: 'Nhãn Đỏ · TB test 45–59',
    action: 'Dưới ngưỡng đạt nhưng còn cứu được — động viên và bám sát.',
    icon: <TrendingUp className="w-5 h-5" />,
    iconWrap: 'bg-red-500/10 text-red-500',
    badge: 'text-red-500 bg-red-500/10 border-red-500/20',
    tone: 'text-red-500',
    border: 'border-red-200 dark:border-red-900/40',
    surface: 'bg-red-50/40 dark:bg-red-950/10',
  },
  {
    trigger: 'relearn_advice',
    level: 'Mức 3',
    criterion: 'Nhãn Xám · TB test dưới 45',
    action: 'Nhắc nhở không đủ — cần mở lời trao đổi về lộ trình học.',
    icon: <Compass className="w-5 h-5" />,
    iconWrap: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    badge: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/25',
    tone: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-300 dark:border-slate-700/60',
    surface: 'bg-slate-50/60 dark:bg-slate-900/20',
  },
];

/**
 * "còn X / Y" thay vì một con số trần.
 *
 * Một con số đứng yên không nói được GV đã làm tới đâu — nhắn xong 8 bạn, thẻ
 * vẫn hiện 8 và trông y hệt lúc chưa ai làm gì. Giữ cả mẫu số để không mất bối
 * cảnh quy mô công việc.
 */
const RemainingStat: React.FC<{ remaining: number; total: number; tone: string }> = ({
  remaining,
  total,
  tone,
}) => (
  <div className="text-right shrink-0">
    <span
      className={`text-2xl font-extrabold font-mono leading-none ${
        remaining === 0 ? 'text-emerald-500' : tone
      }`}
    >
      {remaining}
    </span>
    <span className="text-sm font-bold font-mono text-[#404040]/40 dark:text-[#71717a]">/{total}</span>
    <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">
      {total === 0 ? 'Không có HV' : remaining === 0 ? 'Đã nhắn hết' : 'Chưa nhắn'}
    </p>
  </div>
);

export const TopRibbon: React.FC<TopRibbonProps> = ({
  selectedClass,
  totals,
  remaining,
  onOpenTrigger,
  onFilterTrigger,
}) => (
  // Bốn thẻ bằng nhau: ba thẻ hành động theo thang can thiệp + một thẻ hành
  // chính. Ưu tiên thể hiện bằng THỨ TỰ và MÀU, không bằng kích thước.
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
    {CARDS.map((c) => (
      <div
        key={c.trigger}
        className={`relative overflow-hidden rounded-[16px] p-[24px] border ${c.border} ${c.surface} flex flex-col`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 ${c.iconWrap}`}>
              {c.icon}
            </div>
            <div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${c.badge}`}>
                {c.level}
              </span>
              <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
                {TRIGGER_SHORT_TITLE[c.trigger]}
              </h3>
            </div>
          </div>
          <RemainingStat remaining={remaining[c.trigger]} total={totals[c.trigger]} tone={c.tone} />
        </div>

        {/* Tiêu chí đứng riêng một dòng: đây là thứ trả lời câu "vì sao bạn này
            ở đây". Trước đây nó bị trộn vào câu mô tả nên đọc xong vẫn không
            biết nhóm được cắt theo cái gì. */}
        <p className="text-[11px] font-semibold text-[#404040] dark:text-[#e4e4e7] mt-3 font-mono">
          {c.criterion}
        </p>
        <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-1">{c.action}</p>

        <div className={`mt-auto pt-3 border-t ${c.border} flex flex-wrap items-center justify-between gap-2`}>
          <button
            onClick={() => onFilterTrigger(c.trigger)}
            className="text-[11px] font-medium text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] underline underline-offset-2 transition-colors"
          >
            Lọc bảng HV này
          </button>
          <button
            onClick={() => onOpenTrigger(c.trigger)}
            className={`px-3 py-2 rounded-[8px] bg-transparent border font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-colors ${c.badge}`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Nhắn Zalo
          </button>
        </div>
      </div>
    ))}

    {/* Thẻ hành chính — không nằm trên thang can thiệp, không sinh ra tin nhắn nào. */}
    <div className="relative overflow-hidden rounded-[16px] p-[24px] bg-white dark:bg-[#27272a] flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[12px] bg-slate-500/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/20 font-mono">
              <Clock className="w-3 h-3" /> SLA 7 ngày
            </span>
            <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] mt-1">
              Chờ duyệt Pass mềm
            </h3>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-extrabold font-mono text-slate-600 dark:text-slate-400 leading-none">
            {selectedClass.actionItems.pendingPassReviews}
          </span>
          <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Hồ sơ</p>
        </div>
      </div>

      <p className="text-[11px] font-semibold text-[#404040] dark:text-[#e4e4e7] mt-3 font-mono">
        Pass mềm Nhóm 1 &amp; Nhóm 2
      </p>
      <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] mt-1">
        Việc hành chính, không phải việc nhắc nhở — duyệt trên Portal.
      </p>

      <div className="mt-auto pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-end">
        <a
          href={selectedClass.portalUrl || 'https://portal.izone.edu.vn'}
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

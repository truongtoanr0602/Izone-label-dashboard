import React, { useState } from 'react';
import {
  X, Check, Copy, Send, MessageCircle, MessageSquare, AlertTriangle, Compass,
} from 'lucide-react';
import type { ContactLog, ContactTrigger, StudentDetail } from '../../data/mockData';
import { closingContact, matchesTrigger } from '../../data/selectors';
import { LABEL_TEXT, TRIGGER_DONE_TEXT } from '../../data/labels';
import { buildZaloMessage } from '../../data/messageScripts';
import { ContactTickButton } from '../common/ContactTickButton';

/**
 * Một modal cho cả ba luồng.
 *
 * Trước đây là ba component gần như giống hệt nhau (CallParentModal,
 * RelearnAdviceModal, ZaloRemindModal) chỉ khác bộ lọc, nội dung kịch bản và
 * màu. Khi nghiệp vụ chốt rằng GV không gọi phụ huynh mà chỉ nhắn Zalo cho học
 * viên, cả ba quy về đúng một thao tác — copy tin, mở Zalo, tick — nên giữ ba
 * bản sao chỉ là ba chỗ để chúng lệch nhau.
 */
const GROUP: Record<
  ContactTrigger,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    /** Viền + nền của huy hiệu số lượng, theo mức ưu tiên. */
    accent: string;
    emptyText: string;
  }
> = {
  urgent_remind: {
    title: 'Cần nhắc gấp',
    subtitle: 'HV nhãn Đỏ hoặc đi học tụt dưới 80% — tin nhắn động viên, nêu rõ đi học & BTVN.',
    icon: <AlertTriangle className="w-5 h-5" />,
    accent: 'bg-red-500/10 border-red-500/20 text-red-500',
    emptyText: 'Tuyệt vời! Lớp không có học viên nào cần nhắc gấp.',
  },
  relearn_advice: {
    title: 'Nhóm Xám — nhắc học & mở lời về lộ trình',
    subtitle: 'TB test <45. Tin nhắn nhắc đi học & BTVN, kèm lời mời trao đổi riêng về lộ trình.',
    icon: <Compass className="w-5 h-5" />,
    accent: 'bg-slate-500/10 border-slate-500/25 text-slate-600 dark:text-slate-400',
    emptyText: 'Lớp không có học viên nào ở nhãn Xám.',
  },
  homework_reminder: {
    title: 'Cần nhắc nhở BTVN',
    subtitle: 'Tỷ lệ nộp bài tụt dưới 80% — tin nhắn ngắn, nhắc đúng phần bài tập.',
    icon: <MessageSquare className="w-5 h-5" />,
    accent: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    emptyText: 'Tuyệt vời! Tất cả học viên đều nộp BTVN rất đầy đủ.',
  },
};

interface ZaloRemindModalProps {
  /** `null` = đóng. Luồng đang mở quyết định bộ lọc, kịch bản và màu. */
  trigger: ContactTrigger | null;
  onClose: () => void;
  students: StudentDetail[];
  className: string;
  teacherName: string;
  contactLogs: ContactLog[];
  checkpoint: string;
  onMarkContacted: (trigger: ContactTrigger, student: StudentDetail) => void;
  onUndoContacted: (trigger: ContactTrigger, student: StudentDetail) => void;
}

export const ZaloRemindModal: React.FC<ZaloRemindModalProps> = ({
  trigger,
  onClose,
  students,
  className,
  teacherName,
  contactLogs,
  checkpoint,
  onMarkContacted,
  onUndoContacted,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (trigger === null) return null;

  const group = GROUP[trigger];
  const matched = students.filter((s) => matchesTrigger(s, trigger));

  const handleCopy = (s: StudentDetail) => {
    navigator.clipboard.writeText(buildZaloMessage(trigger, s, teacherName, className));
    setCopiedId(s.studentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] overflow-hidden bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[12px] border flex items-center justify-center shrink-0 ${group.accent}`}>
              {group.icon}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#404040] dark:text-[#e4e4e7] flex flex-wrap items-center gap-2">
                {group.title}
                <span className="text-xs font-mono text-[#404040]/60 dark:text-[#a1a1aa]">
                  {matched.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">{group.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[8px] text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {matched.length === 0 ? (
            <div className="text-center py-8 text-[#404040]/50 dark:text-[#71717a]">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-[#404040] dark:text-[#e4e4e7]">{group.emptyText}</p>
            </div>
          ) : (
            matched.map((s) => {
              const closedBy = closingContact(contactLogs, s.studentId, trigger, checkpoint);
              const contacted = closedBy?.trigger === trigger;
              const coveredByText =
                closedBy && !contacted ? TRIGGER_DONE_TEXT[closedBy.trigger] : undefined;

              return (
                <div
                  key={s.studentId}
                  className="p-4 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] hover:border-[#e5e7eb] dark:hover:border-[#52525b] transition-all space-y-3"
                >
                  {/* Tên + chỉ số + kênh gửi */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7] flex flex-wrap items-center gap-2">
                        {s.fullName}
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#404040]/5 dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border border-[#e5e7eb] dark:border-[#52525b] font-semibold uppercase">
                          {LABEL_TEXT[s.labeling.currentLabel]}
                        </span>
                      </h4>
                      <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex flex-wrap items-center gap-2">
                        <span>ĐH: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.attendance.percentage}%</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>BTVN: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.homework.percentage}%</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>TB Test: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.testPerformance.averageScore ?? '--'}</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>Zalo: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.phone}</b></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(s)}
                        className={`px-3 py-2 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          copiedId === s.studentId
                            ? 'bg-transparent border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                            : 'bg-transparent border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95'
                        }`}
                      >
                        {copiedId === s.studentId ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Đã copy tin nhắn
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy tin nhắn
                          </>
                        )}
                      </button>
                      <a
                        href={`https://zalo.me/${s.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-[8px] bg-transparent border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Mở chat Zalo web với học viên"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/*
                    Hiện NGUYÊN VĂN tin sẽ được copy, không phải bản tóm tắt.
                    GV đang gửi chữ này cho một học sinh thật — họ phải đọc được
                    đúng thứ mình sắp gửi trước khi bấm, nhất là với nhóm Xám.
                  */}
                  <pre className="p-3 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-[11px] leading-relaxed text-[#404040]/80 dark:text-[#a1a1aa] whitespace-pre-wrap font-sans border-l-2 border-l-blue-500">
                    {buildZaloMessage(trigger, s, teacherName, className)}
                  </pre>

                  <div className="flex items-center justify-end border-t border-[#f3f4f6] dark:border-[#3f3f46] pt-3">
                    <ContactTickButton
                      contacted={contacted}
                      coveredByText={coveredByText}
                      checkpoint={checkpoint}
                      onMark={() => onMarkContacted(trigger, s)}
                      onUndo={() => onUndoContacted(trigger, s)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" />
            <b className="text-[#404040] dark:text-[#e4e4e7]">Lưu ý:</b> Gửi xong bấm "Đã liên hệ" — xác
            nhận gắn với mốc <b className="text-[#404040] dark:text-[#e4e4e7]">{checkpoint}</b>, sang bài
            test sau sẽ được hỏi lại.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[12px] bg-[#404040]/10 dark:bg-[#3f3f46] hover:bg-[#404040]/15 dark:hover:bg-[#52525b] text-[#404040] dark:text-[#e4e4e7] font-semibold text-xs transition-colors shrink-0"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};

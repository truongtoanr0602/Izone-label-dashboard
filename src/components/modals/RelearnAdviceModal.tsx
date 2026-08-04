import React, { useState } from 'react';
import { X, Copy, Check, Compass, Lightbulb, Mic, PhoneCall } from 'lucide-react';
import type { ContactLog, StudentDetail } from '../../data/mockData';
import { isContacted, isRelearnAdviceStudent } from '../../data/selectors';
import { ContactTickButton } from '../common/ContactTickButton';

interface RelearnAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentDetail[];
  className: string;
  teacherName: string;
  contactLogs: ContactLog[];
  checkpoint: string;
  onMarkContacted: (student: StudentDetail) => void;
  onUndoContacted: (student: StudentDetail) => void;
}

/**
 * Danh sách HV nhãn Xám cần tư vấn phương án học.
 *
 * Tông màu slate chứ không phải đỏ là có chủ đích: việc này QUAN TRỌNG nhưng
 * không khẩn cấp theo giờ. Nhóm Đỏ còn cứu được bằng cách hối thúc đi học và
 * nộp bài; nhóm Xám (TB test <45) thì không — điều cần trao đổi là phương án
 * học, và dùng lại kịch bản hối thúc của nhóm Đỏ ở đây vừa vô ích vừa làm phụ
 * huynh hiểu sai mức độ.
 */
export const RelearnAdviceModal: React.FC<RelearnAdviceModalProps> = ({
  isOpen,
  onClose,
  students,
  className,
  teacherName,
  contactLogs,
  checkpoint,
  onMarkContacted,
  onUndoContacted,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<number | null>(null);

  if (!isOpen) return null;

  const greyStudents = students.filter(isRelearnAdviceStudent);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCopyScript = (index: number, s: StudentDetail) => {
    const avg = s.testPerformance.averageScore ?? 0;
    const taken = s.testPerformance.testsTakenCount;
    const scriptText =
      `Chào anh/chị, em là ${teacherName}, giáo viên chủ nhiệm lớp ${className} của trung tâm tiếng Anh IZONE.\n\n` +
      `Em xin phép trao đổi thẳng thắn về tình hình của bạn ${s.fullName}. Sau ${taken} bài test, điểm trung bình của bạn đang là ${avg} — thấp hơn khá nhiều so với ngưỡng 60 điểm để đạt chuẩn đầu ra của khóa. ` +
      `Chuyên cần của bạn hiện là ${s.attendance.percentage}% và bài tập về nhà là ${s.homework.percentage}%.\n\n` +
      `Với khoảng cách này, em e rằng việc cố hoàn thành nốt khóa hiện tại sẽ rất áp lực cho bạn mà khả năng đạt đầu ra vẫn thấp. ` +
      `Em muốn cùng anh/chị bàn một phương án phù hợp hơn với sức của bạn: học lại khóa này để chắc nền, bảo lưu sang kỳ sau, hoặc chuyển sang lớp đúng trình độ hiện tại.\n\n` +
      `Anh/chị sắp xếp giúp em một buổi trao đổi ngắn với trung tâm để chọn phương án tốt nhất cho bạn ạ. Em cảm ơn anh/chị!`;
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(index);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] overflow-hidden bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                Nhóm Xám — Cần tư vấn phương án học
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {greyStudents.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
                TB test dưới 45 — trao đổi về học lại / bảo lưu / đổi lớp, không phải nhắc nộp bài.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[8px] text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {greyStudents.length === 0 ? (
            <div className="text-center py-8 text-[#404040]/50 dark:text-[#71717a]">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-[#404040] dark:text-[#e4e4e7]">
                Lớp không có học viên nào ở nhãn Xám.
              </p>
            </div>
          ) : (
            greyStudents.map((s, idx) => {
              const contacted = isContacted(contactLogs, s.studentId, 'relearn_advice', checkpoint);

              return (
                <div
                  key={s.studentId}
                  className="p-4 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] hover:border-[#e5e7eb] dark:hover:border-[#52525b] transition-all space-y-3"
                >
                  {/* Student Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[8px] bg-slate-500/10 border border-slate-500/25 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 font-mono text-xs">
                        #{s.studentCode}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                          {s.fullName}
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/25 font-semibold uppercase">
                            Nhãn XÁM
                          </span>
                        </h4>
                        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex flex-wrap items-center gap-3 mt-0.5">
                          <span>
                            TB Test:{' '}
                            <b className="text-slate-700 dark:text-slate-300 font-mono">
                              {s.testPerformance.averageScore ?? '--'}
                            </b>{' '}
                            <span className="opacity-70">({s.testPerformance.testsTakenCount} bài)</span>
                          </span>
                          <span>•</span>
                          <span>
                            ĐH: <b className="text-[#404040] dark:text-[#e4e4e7]">{s.attendance.percentage}%</b>
                          </span>
                          <span>•</span>
                          <span>
                            BTVN: <b className="text-[#404040] dark:text-[#e4e4e7]">{s.homework.percentage}%</b>
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs font-mono font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                        {s.phone}
                      </div>
                      <button
                        onClick={() => handleCopyPhone(s.phone)}
                        className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          copiedPhone === s.phone
                            ? 'bg-transparent border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                            : 'bg-transparent border border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 active:scale-95'
                        }`}
                      >
                        {copiedPhone === s.phone ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Đã copy SĐT
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy SĐT
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Gap to the pass threshold — the number that makes the case */}
                  <div className="p-2.5 rounded-[8px] bg-slate-500/5 border border-slate-500/15 text-xs text-[#404040]/80 dark:text-[#a1a1aa] flex items-start gap-2">
                    <Compass className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#404040] dark:text-[#e4e4e7]">Khoảng cách tới chuẩn đầu ra: </span>
                      còn thiếu{' '}
                      <b className="font-mono text-slate-700 dark:text-slate-300">
                        {s.testPerformance.averageScore !== null
                          ? Math.round((60 - s.testPerformance.averageScore) * 10) / 10
                          : '--'}
                      </b>{' '}
                      điểm TB so với ngưỡng 60.
                      {s.attendance.percentage >= 90 && s.homework.percentage >= 90 && (
                        <span className="text-slate-600 dark:text-slate-400">
                          {' '}Bạn vẫn đi học đều và nộp bài đủ — vấn đề nằm ở nền kiến thức, không phải thái độ.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call Script Preview Box */}
                  <div className="p-3 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#404040]/60 dark:text-[#a1a1aa] font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" /> Kịch bản tư vấn gợi ý:
                      </span>
                      <button
                        onClick={() => handleCopyScript(idx, s)}
                        className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[8px] transition-all ${
                          copiedScript === idx
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                            : 'text-slate-600 dark:text-slate-400 hover:underline'
                        }`}
                      >
                        {copiedScript === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedScript === idx ? 'Đã copy lời thoại' : 'Copy lời thoại'}
                      </button>
                    </div>
                    <p className="text-[#404040]/70 dark:text-[#a1a1aa] italic leading-relaxed pl-2 border-l-2 border-slate-400 dark:border-slate-600">
                      "Em xin phép trao đổi thẳng thắn về bạn{' '}
                      <b className="text-[#404040] dark:text-[#e4e4e7]">{s.fullName}</b>. Sau{' '}
                      {s.testPerformance.testsTakenCount} bài test, TB của bạn là{' '}
                      <b className="text-slate-700 dark:text-slate-300 font-mono">
                        {s.testPerformance.averageScore ?? '--'}
                      </b>
                      , còn cách ngưỡng 60 khá xa. Em muốn cùng anh/chị bàn một phương án phù hợp hơn với sức của bạn:{' '}
                      <span className="text-slate-700 dark:text-slate-300">học lại, bảo lưu, hoặc chuyển sang lớp đúng trình độ</span>."
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <ContactTickButton
                      contacted={contacted}
                      checkpoint={checkpoint}
                      onMark={() => onMarkContacted(s)}
                      onUndo={() => onUndoContacted(s)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between gap-4">
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" />
            <b className="text-[#404040] dark:text-[#e4e4e7]">Lưu ý:</b> HV nhóm Xám vẫn nằm trong danh
            sách nhắc BTVN &amp; điểm danh như mọi HV khác.
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

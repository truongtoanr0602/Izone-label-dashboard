import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, TrendingDown, Send, MessageCircle } from 'lucide-react';
import type { StudentDetail } from '../../data/mockData';

interface ZaloRemindModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentDetail[];
  className: string;
  teacherName: string;
}

export const ZaloRemindModal: React.FC<ZaloRemindModalProps> = ({
  isOpen,
  onClose,
  students,
  className,
  teacherName
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const hwStudents = students.filter(
    (s) => s.evaluation.suggestedAction === 'assign_hw' || s.homework.percentage < 80 || s.homework.isDroppingRecently
  );

  const handleCopyMessage = (index: number, studentName: string, hwPct: number) => {
    const msg = `Chào ${studentName} ! Cô/Thầy ${teacherName} (GVCN lớp ${className}) nhắc em nộp bài tập về nhà đầy đủ nhé. Hiện tại tỷ lệ hoàn thành BTVN của em đang là ${hwPct}%, cần cải thiện ngay để không bị ảnh hưởng đến điều kiện Pass đầu ra của khóa học nha em! 💪`;
    navigator.clipboard.writeText(msg);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] overflow-hidden bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                Danh sách Cần nhắc nhở BTVN qua Zalo
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-500 font-mono">
                  {hwStudents.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
                1-Click Copy tin nhắn mẫu chuẩn hóa để gửi nhanh Zalo cá nhân / Nhóm lớp.
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
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {hwStudents.length === 0 ? (
            <div className="text-center py-8 text-[#404040]/50 dark:text-[#71717a]">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-[#404040] dark:text-[#e4e4e7]">Tuyệt vời! Tất cả học viên đều nộp BTVN rất đầy đủ.</p>
            </div>
          ) : (
            hwStudents.map((s, idx) => (
              <div key={s.studentId} className="p-4 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] hover:border-[#e5e7eb] dark:hover:border-[#52525b] transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                    {s.fullName}
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold font-mono">
                      BTVN: {s.homework.percentage}% ({s.homework.completedCount}/{s.homework.totalCount})
                    </span>
                  </h4>
                  <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-500 inline" />
                    <span>SĐT Zalo: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.phone}</b></span>
                    <span>•</span>
                    <span>ĐH: <b className="text-[#404040] dark:text-[#e4e4e7]">{s.attendance.percentage}%</b></span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyMessage(idx, s.fullName, s.homework.percentage)}
                    className={`px-3 py-2 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      copiedIndex === idx
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
                    }`}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đã Copy tin nhắn
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy tin nhắn Zalo
                      </>
                    )}
                  </button>
                  <a
                    href={`https://zalo.me/${s.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-[8px] bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    title="Mở chat Zalo web"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between">
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" /> <b className="text-[#404040] dark:text-[#e4e4e7]">Lưu ý:</b> Bấm biểu tượng máy bay xanh để mở thẳng Zalo Web chat với học viên.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[12px] bg-[#404040]/10 dark:bg-[#3f3f46] hover:bg-[#404040]/15 dark:hover:bg-[#52525b] text-[#404040] dark:text-[#e4e4e7] font-semibold text-xs transition-colors"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};

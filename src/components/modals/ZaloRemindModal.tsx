import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, TrendingDown, Send } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden bg-slate-900/95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Danh sách Cần nhắc nhở BTVN qua Zalo
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">
                  {hwStudents.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                1-Click Copy tin nhắn mẫu chuẩn hóa để gửi nhanh Zalo cá nhân / Nhóm lớp.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {hwStudents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">Tuyệt vời! Tất cả học viên đều nộp BTVN rất đầy đủ.</p>
            </div>
          ) : (
            hwStudents.map((s, idx) => (
              <div key={s.studentId} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-all flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    {s.fullName}
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold font-mono">
                      BTVN: {s.homework.percentage}% ({s.homework.completedCount}/{s.homework.totalCount})
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-400 inline" />
                    <span>SĐT Zalo: <b className="text-slate-200 font-mono">{s.phone}</b></span>
                    <span>•</span>
                    <span>ĐH: <b className="text-slate-200">{s.attendance.percentage}%</b></span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyMessage(idx, s.fullName, s.homework.percentage)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      copiedIndex === idx
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 active:scale-95'
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
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-600/20"
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
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            💬 <b className="text-slate-300">Lưu ý:</b> Bấm biểu tượng máy bay xanh để mở thẳng Zalo Web chat với học viên.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};

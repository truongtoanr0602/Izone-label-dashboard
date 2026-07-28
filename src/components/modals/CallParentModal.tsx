import React, { useState } from 'react';
import { X, PhoneCall, Copy, Check, AlertTriangle } from 'lucide-react';
import type { StudentDetail } from '../../data/mockData';

interface CallParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentDetail[];
  className: string;
  teacherName: string;
}

export const CallParentModal: React.FC<CallParentModalProps> = ({
  isOpen,
  onClose,
  students,
  className,
  teacherName
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<number | null>(null);

  if (!isOpen) return null;

  const urgentStudents = students.filter(
    (s) => s.evaluation.suggestedAction === 'call_parent' || s.labeling.currentLabel === 'red' || s.attendance.percentage < 80
  );

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCopyScript = (index: number, studentName: string, reason: string) => {
    const scriptText = `Chào anh/chị, em là ${teacherName}, giáo viên chủ nhiệm lớp ${className} của trung tâm tiếng Anh IZONE.\n\nEm gọi điện để trao đổi về tình hình học tập của bạn ${studentName}. Hiện tại bạn đang gặp vấn đề: ${reason}.\n\nRất mong anh/chị đồng hành nhắc nhở bạn làm bài và đi học đầy đủ để đảm bảo chuẩn đầu ra của khóa học ạ!`;
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(index);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-red-500/40 shadow-2xl overflow-hidden bg-slate-900/95">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 to-slate-900 border-b border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Danh sách Cần gọi điện Phụ huynh gấp
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 font-mono">
                  {urgentStudents.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Can thiệp 30 giây: Copy SĐT gọi ngay &amp; sử dụng kịch bản nói chuyện chuẩn hóa IZONE.
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

        {/* Modal Body: List of Students */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {urgentStudents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">Tuyệt vời! Lớp không có học viên nào báo động đỏ.</p>
            </div>
          ) : (
            urgentStudents.map((s, idx) => {
              const reason = s.portalEvidence.teacherNote || (s.evaluation.passChuanReasons.length > 0 ? s.evaluation.passChuanReasons.join(', ') : 'Điểm Test hoặc chuyên cần tụt giảm');
              
              return (
                <div key={s.studentId} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/30 transition-all space-y-3">
                  {/* Student Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center font-bold text-red-400 font-mono text-xs">
                        #{s.studentCode}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          {s.fullName}
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 font-semibold uppercase">
                            Nhãn {s.labeling.currentLabel === 'red' ? 'ĐỎ' : 'XÁM'}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                          <span>ĐH: <b className="text-slate-200">{s.attendance.percentage}%</b></span>
                          <span>•</span>
                          <span>BTVN: <b className="text-slate-200">{s.homework.percentage}%</b></span>
                          <span>•</span>
                          <span>TB Test: <b className="text-slate-200 font-mono">{s.testPerformance.averageScore || '--'}</b></span>
                        </p>
                      </div>
                    </div>

                    {/* Phone Call Copy Button */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                        {s.phone}
                      </div>
                      <button
                        onClick={() => handleCopyPhone(s.phone)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          copiedPhone === s.phone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20'
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

                  {/* Warning Reason */}
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Vấn đề: </span> {reason}
                    </div>
                  </div>

                  {/* Call Script Preview Box */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>🗣️ Kịch bản gọi điện gợi ý (Script):</span>
                      <button
                        onClick={() => handleCopyScript(idx, s.fullName, reason)}
                        className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
                          copiedScript === idx ? 'text-emerald-400 bg-emerald-500/10' : 'text-[#DB0829] hover:underline'
                        }`}
                      >
                        {copiedScript === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedScript === idx ? 'Đã copy lời thoại' : 'Copy lời thoại thoại'}
                      </button>
                    </div>
                    <p className="text-slate-300 italic leading-relaxed pl-2 border-l-2 border-[#DB0829]">
                      "Chào anh/chị, em là <b className="text-white">{teacherName}</b>, GVCN lớp <b className="text-white">{className}</b> của IZONE. Em gọi trao đổi về bạn <b className="text-white">{s.fullName}</b>. Hiện bạn đang gặp vấn đề: <span className="text-red-300">{reason}</span>. Rất mong gia đình đồng hành nhắc nhở bạn ạ!"
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            💡 <b className="text-slate-300">Tip:</b> Sau khi gọi điện xong, hãy ghi chú vào cột <code>gv_note</code> trên Google Sheets.
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

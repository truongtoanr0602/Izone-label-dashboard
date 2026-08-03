import React, { useState } from 'react';
import { X, PhoneCall, Copy, Check, AlertTriangle, Lightbulb, Mic } from 'lucide-react';
import type { StudentDetail } from '../../data/mockData';
import { isUrgentCallStudent } from '../../data/selectors';

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

  const urgentStudents = students.filter(isUrgentCallStudent);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] overflow-hidden bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                Danh sách Cần gọi điện Phụ huynh gấp
                <span className="text-xs font-mono text-red-500">{urgentStudents.length} Học viên</span>
              </h2>
              <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
                Can thiệp 30 giây: Copy SĐT gọi ngay &amp; sử dụng kịch bản nói chuyện chuẩn hóa IZONE.
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

        {/* Modal Body: List of Students */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {urgentStudents.length === 0 ? (
            <div className="text-center py-8 text-[#404040]/50 dark:text-[#71717a]">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-[#404040] dark:text-[#e4e4e7]">Tuyệt vời! Lớp không có học viên nào báo động đỏ.</p>
            </div>
          ) : (
            urgentStudents.map((s, idx) => {
              const reason = s.portalEvidence.teacherNote || (s.evaluation.passChuanReasons.length > 0 ? s.evaluation.passChuanReasons.join(', ') : 'Điểm Test hoặc chuyên cần tụt giảm');
              
              return (
                <div key={s.studentId} className="p-4 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] hover:border-[#e5e7eb] dark:hover:border-[#52525b] transition-all space-y-3">
                  {/* Student Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[8px] bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-red-500 font-mono text-xs">
                        #{s.studentCode}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                          {s.fullName}
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 font-semibold uppercase">
                            Nhãn {s.labeling.currentLabel === 'red' ? 'ĐỎ' : 'XÁM'}
                          </span>
                        </h4>
                        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-3 mt-0.5">
                          <span>ĐH: <b className="text-[#404040] dark:text-[#e4e4e7]">{s.attendance.percentage}%</b></span>
                          <span>•</span>
                          <span>BTVN: <b className="text-[#404040] dark:text-[#e4e4e7]">{s.homework.percentage}%</b></span>
                          <span>•</span>
                          <span>TB Test: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.testPerformance.averageScore || '--'}</b></span>
                        </p>
                      </div>
                    </div>

                    {/* Phone Call Copy Button */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs font-mono font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-red-500" />
                        {s.phone}
                      </div>
                      <button
                        onClick={() => handleCopyPhone(s.phone)}
                        className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          copiedPhone === s.phone
                            ? 'bg-transparent border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                            : 'bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95'
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
                  <div className="p-2.5 rounded-[8px] bg-red-50 dark:bg-red-950/20 border border-red-500/10 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Vấn đề: </span> {reason}
                    </div>
                  </div>

                  {/* Call Script Preview Box */}
                  <div className="p-3 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#404040]/60 dark:text-[#a1a1aa] font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" /> Kịch bản gọi điện gợi ý (Script):</span>
                      <button
                        onClick={() => handleCopyScript(idx, s.fullName, reason)}
                        className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[8px] transition-all ${
                          copiedScript === idx ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'text-red-500 hover:underline'
                        }`}
                      >
                        {copiedScript === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedScript === idx ? 'Đã copy lời thoại' : 'Copy lời thoại thoại'}
                      </button>
                    </div>
                    <p className="text-[#404040]/70 dark:text-[#a1a1aa] italic leading-relaxed pl-2 border-l-2 border-red-500">
                      "Chào anh/chị, em là <b className="text-[#404040] dark:text-[#e4e4e7]">{teacherName}</b>, GVCN lớp <b className="text-[#404040] dark:text-[#e4e4e7]">{className}</b> của IZONE. Em gọi trao đổi về bạn <b className="text-[#404040] dark:text-[#e4e4e7]">{s.fullName}</b>. Hiện bạn đang gặp vấn đề: <span className="text-red-500">{reason}</span>. Rất mong gia đình đồng hành nhắc nhở bạn ạ!"
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between">
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" /> <b className="text-[#404040] dark:text-[#e4e4e7]">Tip:</b> Sau khi gọi điện xong, hãy ghi chú vào cột <code>gv_note</code> trên Google Sheets.
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

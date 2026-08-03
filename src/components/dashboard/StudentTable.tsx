import React, { useState } from 'react';
import { 
  Search, TrendingDown, AlertTriangle, 
  PhoneCall, MessageSquare, Award, CheckCircle, Clock, LayoutGrid, List, History, ChevronRight, Users, Target, Star
} from 'lucide-react';
import { MOCK_LABEL_CHANGES, labelFromAverage } from '../../data/mockData';
import type { LabelCode, StudentDetail } from '../../data/mockData';
import { isUrgentCallStudent } from '../../data/selectors';
import { round1 } from '../../data/number';
import { LineChart, Line, ResponsiveContainer, Tooltip, LabelList } from 'recharts';

const LABEL_TEXT: Record<LabelCode, string> = {
  red: 'ĐỎ',
  yellow: 'VÀNG',
  grey: 'XÁM',
  no_data: 'CHƯA CÓ DL',
};

const LABEL_BADGE_CLASS: Record<LabelCode, string> = {
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  yellow: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  grey: 'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46]',
  no_data: 'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46]',
};

/**
 * Nhãn TẠI TỪNG MỐC TEST, suy trực tiếp từ ĐIỂM CỦA CHÍNH BÀI ĐÓ qua
 * `labelFromAverage` (ngưỡng ≥60 Vàng / 45–59 Đỏ / &lt;45 Xám — cùng ngưỡng
 * đang tô màu cột "Điểm Test" trong bảng) — không phải điểm TB cộng dồn, và
 * không phải chỉ những lần nhãn ĐỔI BẬC như `MOCK_LABEL_CHANGES`. Một học
 * viên thi 4 lần mà TB cộng dồn không đổi bậc lần nào sẽ có 0 dòng trong
 * `MOCK_LABEL_CHANGES` — dùng riêng log đó làm timeline sẽ vẽ ra một học
 * viên "chưa từng có nhãn" dù đã thi đủ 4 bài, sai lệch với sparkline điểm
 * test ngay bên cạnh.
 */
function labelTimeline(s: StudentDetail) {
  const scores = [...s.testPerformance.scores]
    .filter((t) => t.finalScore !== null)
    .sort((a, b) => a.testOrder - b.testOrder);

  return scores.map((t) => {
    const label = labelFromAverage(round1(t.finalScore as number));
    const changeLog = MOCK_LABEL_CHANGES.find(
      (log) => log.studentId === s.studentId && log.checkpoint === t.testName,
    );
    return { key: `t${t.testOrder}`, checkpoint: t.testName, label, reason: changeLog?.reason };
  });
}

interface StudentTableProps {
  students: StudentDetail[];
  onOpenCallModal: () => void;
  onOpenZaloModal: () => void;
  activeFilter: 'all' | 'urgent' | 'pass' | 'review';
  onChangeFilter: (filter: 'all' | 'urgent' | 'pass' | 'review') => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onOpenCallModal,
  onOpenZaloModal,
  activeFilter,
  onChangeFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(false); // false = Collapsed Sparkline view, true = 6 columns grid view
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  // Filter students based on active tab and search term
  const filteredStudents = students.filter((s) => {
    // Search match
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.includes(searchTerm) ||
      s.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    // Tab match
    if (activeFilter === 'urgent') {
      return isUrgentCallStudent(s);
    }
    if (activeFilter === 'pass') {
      return s.evaluation.passChuanStatus === 'Có khả năng pass' || s.evaluation.passMemStatus === 'Đạt pass mềm';
    }
    if (activeFilter === 'review') {
      return s.evaluation.isEligibleForReview;
    }
    return true; // 'all'
  });

  // Sort by risk score descending (highest risk first)
  const sortedStudents = [...filteredStudents].sort((a, b) => b.evaluation.riskScore - a.evaluation.riskScore);

  const counts = {
    all: students.length,
    urgent: students.filter(isUrgentCallStudent).length,
    pass: students.filter((s) => s.evaluation.passChuanStatus === 'Có khả năng pass' || s.evaluation.passMemStatus === 'Đạt pass mềm').length,
    review: students.filter((s) => s.evaluation.isEligibleForReview).length,
  };

  return (
    <div className="bg-white dark:bg-[#27272a] rounded-[16px] shadow-sm overflow-hidden">
      {/* Table Toolbar & Workflow Tabs */}
      <div className="p-5 border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6] dark:bg-[#18181b] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Workflow Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#27272a] p-1.5 rounded-[12px]">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-200 font-medium border border-[#f3f4f6] dark:border-slate-700'
                : 'font-semibold text-[#404040]/70 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Tất cả học viên
            <span className="font-mono text-[11px] opacity-60">({counts.all})</span>
          </button>
          <button
            onClick={() => onChangeFilter('urgent')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'urgent'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium border border-red-200 dark:border-red-800/50'
                : 'font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Nguy cấp &amp; Tụt nhãn
            <span className="font-mono text-[11px] opacity-70">({counts.urgent})</span>
          </button>
          <button
            onClick={() => onChangeFilter('pass')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'pass'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800/50'
                : 'font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Đủ điều kiện Pass
            <span className="font-mono text-[11px] opacity-70">({counts.pass})</span>
          </button>
          <button
            onClick={() => onChangeFilter('review')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'review'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-800/50'
                : 'font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Chờ GV Duyệt Pass
            <span className="font-mono text-[11px] opacity-70">({counts.review})</span>
          </button>
        </div>

        {/* Right: Search & View Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#404040]/40 dark:text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-[8px] bg-white dark:bg-[#18181b] border border-[#e5e7eb] dark:border-[#3f3f46] text-xs text-[#404040] dark:text-[#e4e4e7] placeholder:text-[#404040]/40 dark:placeholder:text-[#71717a] focus:outline-none focus:border-[#DB0829] w-56 transition-all"
            />
          </div>

          {/* Collapsed vs Grid Toggle */}
          <button
            onClick={() => setIsGridView(!isGridView)}
            className={`px-3 py-1.5 rounded-[8px] border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isGridView
                ? 'bg-[#f3f4f6] dark:bg-[#3f3f46] border-[#DB0829]/50 text-[#404040] dark:text-[#e4e4e7]'
                : 'bg-white dark:bg-[#27272a] border-[#f3f4f6] dark:border-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
            }`}
            title="Chuyển đổi chế độ xem 6 cột Test / Sparkline thu gọn"
          >
            {isGridView ? (
              <>
                <List className="w-4 h-4 text-[#DB0829]" /> Thu gọn Test
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4 text-[#404040]/50 dark:text-[#71717a]" /> Hiện 6 cột Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46]">
            <tr className="text-[#404040]/60 dark:text-[#71717a] font-semibold text-xs uppercase tracking-wider">
              <th className="py-3 px-4 text-left" colSpan={2}>Họ và Tên</th>
              <th className="py-3 px-4 text-center">Chuyên cần</th>
              <th className="py-3 px-4 text-center">BTVN</th>
              
              {/* Dynamic Columns based on Grid View */}
              {isGridView ? (
                <>
                  <th className="py-3 px-2 text-center" colSpan={6}>T1 - T6</th>
                  <th className="py-3 px-3 text-center">TB</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-4 text-center">Điểm Test</th>
                </>
              )}

              <th className="py-3 px-4 text-center">Nhãn</th>
              <th className="py-3 px-4 text-right" colSpan={3}>Trạng thái / Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#3f3f46] text-xs">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[#404040]/50 dark:text-[#71717a]">
                  Không tìm thấy học viên nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              sortedStudents.map((s, idx) => {
                // Sparkline data format
                const sparkData = s.testPerformance.scores
                  .filter((t) => t.finalScore !== null)
                  .map((t) => ({ name: t.testName, score: t.finalScore }));

                return (
                  <React.Fragment key={s.studentId}>
                    <tr 
                      className={`transition-colors hover:bg-[#f3f4f6]/50 dark:hover:bg-[#3f3f46]/30 ${
                        s.labeling.currentLabel === 'red' || s.evaluation.suggestedAction === 'call_parent'
                          ? 'bg-red-50 dark:bg-red-950/15'
                          : expandedStudentId === s.studentId ? 'bg-[#f3f4f6] dark:bg-[#18181b]' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center font-mono text-[#404040]/50 dark:text-[#71717a]">{idx + 1}</td>

                    {/* Student Name & Phone / Mobile Summary */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-2">
                        {/* Top: Avatar, Name & Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                              s.labeling.currentLabel === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/70 dark:text-[#a1a1aa]'
                            }`}>
                              {s.fullName.split(' ').slice(-2).map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-[#404040] dark:text-[#e4e4e7] text-sm flex items-center gap-1.5 flex-wrap">
                                {s.fullName}
                                {s.labeling.hasChangedRecently && (
                                  <span className="px-1.5 py-0.2 text-[9px] rounded font-bold uppercase bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/70 dark:text-[#a1a1aa] border border-[#f3f4f6] dark:border-[#3f3f46] font-mono" title={`Vừa đổi từ ${s.labeling.previousLabel} lên ${s.labeling.currentLabel}`}>
                                    {s.labeling.previousLabel}→{s.labeling.currentLabel}
                                  </span>
                                )}
                              </p>
                              <p className="text-[#404040]/50 dark:text-[#71717a] font-mono text-[11px] mt-0.5">{s.phone}</p>
                            </div>
                          </div>
                          
                          {/* Mobile Only Badge */}
                           <div className="md:hidden ml-2 shrink-0">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                               s.labeling.currentLabel === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                               s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                               'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46]'
                             }`}>
                              {s.labeling.currentLabel === 'red' ? 'ĐỎ' : s.labeling.currentLabel === 'yellow' ? 'VÀNG' : 'XÁM'}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Only Metrics (Heartbeat) */}
                        <div className="md:hidden flex items-center gap-3 text-[11px] font-mono border-t border-[#f3f4f6] dark:border-[#3f3f46] pt-2 mt-1">
                          <span>CC: <span className={s.attendance.percentage < 90 ? 'text-red-500 font-bold' : 'text-[#404040] dark:text-[#e4e4e7]'}>{s.attendance.percentage}%</span></span>
                          <span className="text-[#404040]/30 dark:text-[#52525b]">|</span>
                          <span>BTVN: <span className={s.homework.percentage < 90 ? 'text-red-500 font-bold' : 'text-[#404040] dark:text-[#e4e4e7]'}>{s.homework.percentage}%</span></span>
                        </div>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          s.attendance.percentage < 80 ? 'text-red-500' :
                          s.attendance.percentage < 90 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {s.attendance.percentage}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              s.attendance.percentage < 80 ? 'bg-red-500' :
                              s.attendance.percentage < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${s.attendance.percentage}%` }}
                          />
                        </div>
                        {s.attendance.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5 mt-0.5 animate-pulse">
                            <TrendingDown className="w-2.5 h-2.5" /> Tụt tuần
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Homework */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          s.homework.percentage < 80 ? 'text-red-500' :
                          s.homework.percentage < 90 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {s.homework.percentage}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              s.homework.percentage < 80 ? 'bg-red-500' :
                              s.homework.percentage < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${s.homework.percentage}%` }}
                          />
                        </div>
                        {s.homework.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5">
                            <TrendingDown className="w-2.5 h-2.5" /> Lười bài
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Test Columns / Sparkline View */}
                    {isGridView ? (
                      <>
                        {s.testPerformance.scores.map((t) => (
                          <td key={t.testOrder} className="py-3.5 px-2 text-center font-mono">
                            {t.finalScore !== null ? (
                              <span className={`text-sm font-bold ${
                                t.finalScore < 45 ? 'text-[#404040]/50 dark:text-[#71717a]' :
                                t.finalScore < 60 ? 'text-red-500' : 'text-amber-500'
                              }`} title={t.isMakeup ? `Thi bù (Lần 1: ${t.rawScore}, Lần 2: ${t.makeupScore})` : ''}>
                                {t.finalScore}
                                {t.isMakeup && '⚡'}
                              </span>
                            ) : (
                              <span className="text-[#404040]/30 dark:text-[#52525b]">--</span>
                            )}
                          </td>
                        ))}
                        <td className="py-3.5 px-3 text-center font-mono">
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`text-sm font-extrabold ${
                              s.testPerformance.averageScore < 45 ? 'text-[#404040]/70 dark:text-[#a1a1aa]' :
                              s.testPerformance.averageScore < 60 ? 'text-red-500' : 'text-amber-500'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-[#404040]/30 dark:text-[#52525b] font-bold">--</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 text-center">
                          {/* Big Avg Number */}
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`text-sm font-extrabold font-mono ${
                              s.testPerformance.averageScore < 45 ? 'text-[#404040]/70 dark:text-[#a1a1aa]' :
                              s.testPerformance.averageScore < 60 ? 'text-red-500' : 'text-amber-500'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-[#404040]/30 dark:text-[#52525b] font-bold font-mono">--</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Current Label Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 ${
                        s.labeling.currentLabel === 'red'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          : s.labeling.currentLabel === 'yellow'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}>
                        {s.labeling.currentLabel === 'red' && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
                        {s.labeling.currentLabel === 'yellow' && <Award className="w-3.5 h-3.5" />}
                        {s.labeling.currentLabel === 'red' ? 'ĐỎ' : s.labeling.currentLabel === 'yellow' ? 'VÀNG' : 'XÁM'}
                      </span>
                    </td>

                    {/* Pass Evaluation */}
                    <td className="py-3.5 px-4">
                      {s.evaluation.passChuanStatus === 'Có khả năng pass' || s.evaluation.passChuanStatus === 'Đạt tiêu chuẩn' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-[8px] border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Pass Chuẩn
                        </span>
                      ) : s.evaluation.passMemStatus === 'Đạt pass mềm' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-[8px] border border-amber-500/20">
                            <Star className="w-3 h-3" /> Pass Mềm ({s.evaluation.passMemGroup})
                          </span>
                          <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5 font-mono">{s.evaluation.reviewStatus || 'Đạt tiêu chuẩn'}</p>
                        </div>
                      ) : (
                        <div className="text-[#404040]/60 dark:text-[#a1a1aa] text-[11px] max-w-xs leading-tight">
                          <span className="text-red-500 font-semibold">Chưa đạt: </span>
                          {s.evaluation.passChuanReasons.join(', ') || 'Điểm test dưới ngưỡng'}
                        </div>
                      )}
                    </td>

                    {/* Action Suggestion */}
                    <td className="py-3.5 px-4 text-right">
                      {s.evaluation.suggestedAction === 'call_parent' || s.labeling.currentLabel === 'red' ? (
                        <button
                          onClick={onOpenCallModal}
                          className="px-3 py-1.5 rounded-[8px] bg-transparent text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <PhoneCall className="w-3 h-3" /> Gọi gấp
                        </button>
                      ) : s.evaluation.suggestedAction === 'assign_hw' || s.homework.isDroppingRecently ? (
                        <button
                          onClick={onOpenZaloModal}
                          className="px-3 py-1.5 rounded-[8px] bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500 hover:bg-amber-600 hover:text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <MessageSquare className="w-3 h-3" /> Nhắc Zalo
                        </button>
                      ) : s.evaluation.isEligibleForReview ? (
                        <a
                          href="https://portal.izone.edu.vn"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-[8px] bg-transparent text-[#DB0829] border border-[#DB0829] hover:bg-[#DB0829] hover:text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Clock className="w-3 h-3" /> Duyệt trên Portal
                        </a>
                      ) : (
                        <span className="text-[#404040]/40 dark:text-[#52525b] text-xs font-mono">--</span>
                      )}
                    </td>
                    {/* History Toggle */}
                    <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setExpandedStudentId(expandedStudentId === s.studentId ? null : s.studentId)}
                          className={`p-2 rounded-[8px] border transition-all ${
                            expandedStudentId === s.studentId 
                              ? 'bg-[#DB0829] text-white border-[#DB0829]' 
                              : 'bg-white dark:bg-[#27272a] text-[#404040]/50 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:border-[#e5e7eb] dark:hover:border-[#52525b]'
                          }`}
                          title="Xem lịch sử nhãn và xu hướng chi tiết"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded History Accordion */}
                    {expandedStudentId === s.studentId && (
                      <tr>
                        <td colSpan={20} className="p-0 border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6]/50 dark:bg-[#18181b]/50">
                          <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left: Timeline Nhãn */}
                              <div className="flex-1 space-y-4">
                                <h4 className="text-xs font-bold text-[#404040]/70 dark:text-[#a1a1aa] uppercase tracking-wider flex items-center gap-2">
                                  <History className="w-4 h-4 text-blue-500" />
                                  Lộ trình chuyển nhãn
                                </h4>
                                {(() => {
                                  const timeline = labelTimeline(s);
                                  // "Hiện tại" phải cùng công thức (điểm bài gần nhất) với các mốc Test
                                  // phía trước — không lấy `currentLabel` (TB cộng dồn), nếu không ô cuối
                                  // có thể khác màu với ô Test ngay trước nó dù cùng một bài test.
                                  const currentLabel = timeline.length > 0
                                    ? timeline[timeline.length - 1].label
                                    : s.labeling.currentLabel;
                                  const steps: { key: string; checkpoint: string; label: LabelCode; reason?: string }[] = [
                                    ...timeline,
                                    { key: 'current', checkpoint: 'Hiện tại', label: currentLabel },
                                  ];

                                  return (
                                    <>
                                      <div className="flex flex-wrap items-center gap-3">
                                        {steps.map((step, idx) => (
                                          <div key={step.key} className="flex items-center gap-3">
                                            <div className="flex flex-col items-center gap-1" title={step.reason}>
                                              <span className="text-[10px] text-[#404040]/50 dark:text-[#71717a] font-mono">{step.checkpoint}</span>
                                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${LABEL_BADGE_CLASS[step.label]}`}>
                                                {LABEL_TEXT[step.label]}
                                              </span>
                                            </div>
                                            {idx < steps.length - 1 && (
                                              <ChevronRight className="w-4 h-4 text-[#404040]/30 dark:text-[#52525b]" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {steps.length === 1 && (
                                        <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] italic">
                                          Chưa có bài test nào để tính nhãn theo mốc.
                                        </p>
                                      )}
                                    </>
                                  );
                                })()}
                                <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] italic">
                                  Học viên có xu hướng {s.testPerformance.trendDirection === 'improving' ? 'cải thiện tích cực' : s.testPerformance.trendDirection === 'declining' ? 'sa sút nghiêm trọng' : 'duy trì nhãn ổn định'}.
                                </p>
                              </div>

                              {/* Right: Sparklines */}
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-[#404040]/50 dark:text-[#71717a] uppercase tracking-wider text-center">Điểm Test</h4>
                                  <div className="h-20 w-full bg-white dark:bg-[#27272a] rounded-[12px] p-1 px-4 overflow-hidden border border-[#f3f4f6] dark:border-[#3f3f46]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={sparkData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6', fontSize: '10px' }} itemStyle={{ color: '#3b82f6' }} />
                                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}>
                                          <LabelList dataKey="score" position="top" offset={8} fontSize={9} className="fill-[#404040]/60 dark:fill-[#a1a1aa]" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-[#404040]/50 dark:text-[#71717a] uppercase tracking-wider text-center">Chuyên cần</h4>
                                  <div className="h-20 w-full bg-white dark:bg-[#27272a] rounded-[12px] p-1 px-4 overflow-hidden border border-[#f3f4f6] dark:border-[#3f3f46]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={[{v: 100}, {v: s.attendance.percentage > 85 ? 95 : 85}, {v: s.attendance.percentage}]} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6', fontSize: '10px' }} itemStyle={{ color: '#10b981' }} />
                                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}>
                                          <LabelList dataKey="v" position="top" offset={8} fontSize={9} className="fill-[#404040]/60 dark:fill-[#a1a1aa]" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-[#404040]/50 dark:text-[#71717a] uppercase tracking-wider text-center">Bài tập VN</h4>
                                  <div className="h-20 w-full bg-white dark:bg-[#27272a] rounded-[12px] p-1 px-4 overflow-hidden border border-[#f3f4f6] dark:border-[#3f3f46]">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={[{v: 90}, {v: s.homework.percentage > 70 ? 80 : 60}, {v: s.homework.percentage}]} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6', fontSize: '10px' }} itemStyle={{ color: '#f59e0b' }} />
                                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}>
                                          <LabelList dataKey="v" position="top" offset={8} fontSize={9} className="fill-[#404040]/60 dark:fill-[#a1a1aa]" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex flex-wrap items-center justify-between gap-4 text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
        <div>
          Hiển thị <b className="text-[#404040] dark:text-[#e4e4e7]">{sortedStudents.length}</b> / <span className="text-[#404040] dark:text-[#e4e4e7]">{students.length}</span> học viên
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Nhãn Đỏ / Cần gọi gấp</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Nhãn Vàng / Pass Mềm</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Nhãn Xám</span>
        </div>
      </div>
    </div>
  );
};

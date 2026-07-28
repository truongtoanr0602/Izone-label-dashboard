import React, { useState } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Minus, AlertTriangle, 
  PhoneCall, MessageSquare, Award, CheckCircle, Clock, LayoutGrid, List, History, ChevronRight
} from 'lucide-react';
import type { StudentDetail } from '../../data/mockData';
import { LineChart, Line, ResponsiveContainer, Tooltip, LabelList } from 'recharts';

interface StudentTableProps {
  students: StudentDetail[];
  onOpenCallModal: () => void;
  onOpenZaloModal: () => void;
  onGoToReview: () => void;
  activeFilter: 'all' | 'urgent' | 'pass' | 'review';
  onChangeFilter: (filter: 'all' | 'urgent' | 'pass' | 'review') => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onOpenCallModal,
  onOpenZaloModal,
  onGoToReview,
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
      return s.evaluation.suggestedAction === 'call_parent' || s.labeling.currentLabel === 'red' || s.attendance.percentage < 80;
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
    urgent: students.filter((s) => s.evaluation.suggestedAction === 'call_parent' || s.labeling.currentLabel === 'red' || s.attendance.percentage < 80).length,
    pass: students.filter((s) => s.evaluation.passChuanStatus === 'Có khả năng pass' || s.evaluation.passMemStatus === 'Đạt pass mềm').length,
    review: students.filter((s) => s.evaluation.isEligibleForReview).length,
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Table Toolbar & Workflow Tabs */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Workflow Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#DB0829] text-white shadow-md shadow-[#DB0829]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            🔥 Tất cả học viên
            <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.all}</span>
          </button>
          <button
            onClick={() => onChangeFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'urgent'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            🚨 Nguy cấp &amp; Tụt nhãn
            <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">{counts.urgent}</span>
          </button>
          <button
            onClick={() => onChangeFilter('pass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'pass'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            🎯 Đủ điều kiện Pass
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">{counts.pass}</span>
          </button>
          <button
            onClick={() => onChangeFilter('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'review'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            ⏳ Chờ GV Duyệt Pass
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">{counts.review}</span>
          </button>
        </div>

        {/* Right: Search & View Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#DB0829] w-56 transition-all"
            />
          </div>

          {/* Collapsed vs Grid Toggle */}
          <button
            onClick={() => setIsGridView(!isGridView)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isGridView
                ? 'bg-slate-800 border-[#DB0829]/50 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Chuyển đổi chế độ xem 6 cột Test / Sparkline thu gọn"
          >
            {isGridView ? (
              <>
                <List className="w-4 h-4 text-[#DB0829]" /> Thu gọn Test
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4 text-slate-400" /> Hiện 6 cột Test
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-gray-700/50 bg-transparent text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <th className="pb-3 px-4 text-left" colSpan={2}>Họ và Tên</th>
              <th className="pb-3 px-4 text-center">Chuyên cần</th>
              <th className="pb-3 px-4 text-center">BTVN</th>
              
              {/* Dynamic Columns based on Grid View */}
              {isGridView ? (
                <>
                  <th className="pb-3 px-2 text-center" colSpan={6}>T1 - T6</th>
                  <th className="pb-3 px-3 text-center">TB</th>
                </>
              ) : (
                <>
                  <th className="pb-3 px-4 text-center">Điểm Test</th>
                  <th className="pb-3 px-4 text-center">Biểu đồ Lộ trình</th>
                </>
              )}

              <th className="pb-3 px-4 text-center">Nhãn</th>
              <th className="pb-3 px-4 text-right" colSpan={3}>Trạng thái / Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-xs">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500">
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
                      className={`transition-colors hover:bg-slate-800/40 ${
                        s.labeling.currentLabel === 'red' || s.evaluation.suggestedAction === 'call_parent'
                          ? 'bg-red-950/15'
                          : expandedStudentId === s.studentId ? 'bg-slate-900' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">{idx + 1}</td>

                    {/* Student Name & Phone / Mobile Summary */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-2">
                        {/* Top: Avatar, Name & Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                              s.labeling.currentLabel === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {s.fullName.split(' ').slice(-2).map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100 text-sm flex items-center gap-1.5 flex-wrap">
                                {s.fullName}
                                {s.labeling.hasChangedRecently && (
                                  <span className="px-1.5 py-0.2 text-[9px] rounded font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 font-mono" title={`Vừa đổi từ ${s.labeling.previousLabel} lên ${s.labeling.currentLabel}`}>
                                    {s.labeling.previousLabel}→{s.labeling.currentLabel}
                                  </span>
                                )}
                              </p>
                              <p className="text-slate-400 font-mono text-[11px] mt-0.5">{s.phone}</p>
                            </div>
                          </div>
                          
                          {/* Mobile Only Badge */}
                          <div className="md:hidden ml-2 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              s.labeling.currentLabel === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red' :
                              s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 glow-yellow' :
                              'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {s.labeling.currentLabel === 'red' ? 'ĐỎ' : s.labeling.currentLabel === 'yellow' ? 'VÀNG' : 'XÁM'}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Only Metrics (Heartbeat) */}
                        <div className="md:hidden flex items-center gap-3 text-[11px] font-mono border-t border-slate-800/60 pt-2 mt-1">
                          <span>CC: <span className={s.attendance.percentage < 90 ? 'text-red-400 font-bold' : 'text-slate-300'}>{s.attendance.percentage}%</span></span>
                          <span className="text-slate-700">|</span>
                          <span>BTVN: <span className={s.homework.percentage < 90 ? 'text-red-400 font-bold' : 'text-slate-300'}>{s.homework.percentage}%</span></span>
                        </div>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          s.attendance.percentage < 80 ? 'text-red-400' :
                          s.attendance.percentage < 90 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {s.attendance.percentage}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              s.attendance.percentage < 80 ? 'bg-red-500' :
                              s.attendance.percentage < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${s.attendance.percentage}%` }}
                          />
                        </div>
                        {s.attendance.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-red-400 flex items-center gap-0.5 mt-0.5 animate-pulse">
                            <TrendingDown className="w-2.5 h-2.5" /> Tụt tuần
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Homework */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          s.homework.percentage < 80 ? 'text-red-400' :
                          s.homework.percentage < 90 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {s.homework.percentage}%
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              s.homework.percentage < 80 ? 'bg-red-500' :
                              s.homework.percentage < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${s.homework.percentage}%` }}
                          />
                        </div>
                        {s.homework.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5 mt-0.5">
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
                              <span className={`text-[12px] font-bold ${
                                t.finalScore < 45 ? 'text-slate-400' :
                                t.finalScore < 60 ? 'text-red-400' : 'text-amber-300'
                              }`} title={t.isMakeup ? `Thi bù (Lần 1: ${t.rawScore}, Lần 2: ${t.makeupScore})` : ''}>
                                {t.finalScore}
                                {t.isMakeup && '⚡'}
                              </span>
                            ) : (
                              <span className="text-slate-600">--</span>
                            )}
                          </td>
                        ))}
                        <td className="py-3.5 px-3 text-center font-mono">
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                              s.testPerformance.averageScore < 45 ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                              s.testPerformance.averageScore < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold">--</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 text-center">
                          {/* Big Avg Number Badge */}
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold font-mono shadow-sm ${
                              s.testPerformance.averageScore < 45 ? 'bg-slate-800 text-slate-300 border border-slate-700' :
                              s.testPerformance.averageScore < 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold font-mono">--</span>
                          )}
                        </td>
                        
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            {/* Sparkline */}
                            {sparkData.length >= 2 ? (
                              <div className="w-16 h-8 bg-slate-900/80 rounded px-1 pt-1 border border-slate-800/80">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={sparkData}>
                                    <Line
                                      type="monotone"
                                      dataKey="score"
                                      stroke={
                                        s.testPerformance.trendDirection === 'improving' ? '#10b981' :
                                        s.testPerformance.trendDirection === 'declining' ? '#ef4444' : '#f59e0b'
                                      }
                                      strokeWidth={2}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">1 Test</span>
                            )}

                            {/* Trend Icon with span wrapper for title */}
                            {s.testPerformance.trendDirection === 'improving' && (
                              <span title="Xu hướng điểm test tiến bộ">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                              </span>
                            )}
                            {s.testPerformance.trendDirection === 'declining' && (
                              <span title="Xu hướng điểm test sa sút">
                                <TrendingDown className="w-4 h-4 text-red-400 animate-pulse" />
                              </span>
                            )}
                            {s.testPerformance.trendDirection === 'stable' && (
                              <span title="Xu hướng điểm test ổn định">
                                <Minus className="w-4 h-4 text-amber-400" />
                              </span>
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    {/* Current Label Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 shadow-sm ${
                        s.labeling.currentLabel === 'red'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 glow-red'
                          : s.labeling.currentLabel === 'yellow'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 glow-yellow'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {s.labeling.currentLabel === 'red' && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
                        {s.labeling.currentLabel === 'yellow' && <Award className="w-3.5 h-3.5" />}
                        {s.labeling.currentLabel === 'red' ? 'ĐỎ' : s.labeling.currentLabel === 'yellow' ? 'VÀNG' : 'XÁM'}
                      </span>
                    </td>

                    {/* Pass Evaluation */}
                    <td className="py-3.5 px-4">
                      {s.evaluation.passChuanStatus === 'Có khả năng pass' || s.evaluation.passChuanStatus === 'Đạt tiêu chuẩn' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Pass Chuẩn
                        </span>
                      ) : s.evaluation.passMemStatus === 'Đạt pass mềm' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                            ⭐ Pass Mềm ({s.evaluation.passMemGroup})
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{s.evaluation.reviewStatus || 'Đạt tiêu chuẩn'}</p>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px] max-w-xs leading-tight">
                          <span className="text-red-400 font-semibold">Chưa đạt: </span>
                          {s.evaluation.passChuanReasons.join(', ') || 'Điểm test dưới ngưỡng'}
                        </div>
                      )}
                    </td>

                    {/* Action Suggestion */}
                    <td className="py-3.5 px-4 text-right">
                      {s.evaluation.suggestedAction === 'call_parent' || s.labeling.currentLabel === 'red' ? (
                        <button
                          onClick={onOpenCallModal}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95"
                        >
                          <PhoneCall className="w-3 h-3" /> Gọi gấp
                        </button>
                      ) : s.evaluation.suggestedAction === 'assign_hw' || s.homework.isDroppingRecently ? (
                        <button
                          onClick={onOpenZaloModal}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-600/20 active:scale-95"
                        >
                          <MessageSquare className="w-3 h-3" /> Nhắc Zalo
                        </button>
                      ) : s.evaluation.isEligibleForReview ? (
                        <button
                          onClick={onGoToReview}
                          className="px-3 py-1.5 rounded-lg bg-[#DB0829] hover:bg-[#b80620] text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5 shadow-md shadow-[#DB0829]/20 active:scale-95"
                        >
                          <Clock className="w-3 h-3" /> Duyệt Pass
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs font-mono">--</span>
                      )}
                    </td>
                    {/* History Toggle */}
                    <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setExpandedStudentId(expandedStudentId === s.studentId ? null : s.studentId)}
                          className={`p-2 rounded-xl border transition-all ${
                            expandedStudentId === s.studentId 
                              ? 'bg-[#DB0829] text-white border-[#DB0829] shadow-md shadow-[#DB0829]/30' 
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:border-slate-500'
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
                        <td colSpan={20} className="p-0 border-b border-slate-800/60 bg-slate-950/80">
                          <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left: Timeline Nhãn */}
                              <div className="flex-1 space-y-4">
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                  <History className="w-4 h-4 text-blue-400" />
                                  Lộ trình chuyển nhãn
                                </h4>
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono">Test 1</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">XÁM</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-600" />
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono">Test 2</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">VÀNG</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-600" />
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono">Test 3</span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">VÀNG</span>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-600" />
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono">Hiện tại</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                      s.labeling.currentLabel === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/40 glow-red' :
                                      s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 glow-yellow' :
                                      'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}>
                                      {s.labeling.currentLabel === 'red' ? 'ĐỎ' : s.labeling.currentLabel === 'yellow' ? 'VÀNG' : 'XÁM'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-400 italic">
                                  Học viên có xu hướng {s.testPerformance.trendDirection === 'improving' ? 'cải thiện tích cực' : s.testPerformance.trendDirection === 'declining' ? 'sa sút nghiêm trọng' : 'duy trì nhãn ổn định'}.
                                </p>
                              </div>

                              {/* Right: Sparklines */}
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Điểm Test</h4>
                                  <div className="h-20 w-full bg-slate-900/60 rounded-xl p-1 px-4 overflow-hidden border border-slate-800/80">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={sparkData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '10px' }} itemStyle={{ color: '#38bdf8' }} />
                                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}>
                                          <LabelList dataKey="score" position="top" offset={8} fontSize={9} fill="#94a3b8" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Chuyên cần</h4>
                                  <div className="h-20 w-full bg-slate-900/60 rounded-xl p-1 px-4 overflow-hidden border border-slate-800/80">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={[{v: 100}, {v: s.attendance.percentage > 85 ? 95 : 85}, {v: s.attendance.percentage}]} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '10px' }} itemStyle={{ color: '#34d399' }} />
                                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}>
                                          <LabelList dataKey="v" position="top" offset={8} fontSize={9} fill="#94a3b8" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Bài tập VN</h4>
                                  <div className="h-20 w-full bg-slate-900/60 rounded-xl p-1 px-4 overflow-hidden border border-slate-800/80">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={[{v: 90}, {v: s.homework.percentage > 70 ? 80 : 60}, {v: s.homework.percentage}]} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '10px' }} itemStyle={{ color: '#fbbf24' }} />
                                        <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#0f172a' }}>
                                          <LabelList dataKey="v" position="top" offset={8} fontSize={9} fill="#94a3b8" />
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
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          Hiển thị <b className="text-slate-200">{sortedStudents.length}</b> / <span className="text-slate-300">{students.length}</span> học viên
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

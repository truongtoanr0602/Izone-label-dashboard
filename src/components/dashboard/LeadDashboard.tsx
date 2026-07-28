import React, { useState } from 'react';
import { 
  HeartPulse, TrendingDown, ShieldAlert, 
  ArrowUpRight, ChevronRight, Award, BarChart3, CheckCircle2,
  Users, Activity, AlertTriangle, Clock, Search
} from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LeadDashboardProps {
  classes: ClassSummary[];
  onSelectClassAndDrillDown: (cls: ClassSummary) => void;
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown
}) => {
  const [searchClass, setSearchClass] = useState('');

  // Aggregate KPIs
  const totalStudents = classes.reduce((acc, c) => acc + c.studentCounts.active, 0);
  const avgHealthScore = Math.round(classes.reduce((acc, c) => acc + c.healthMetrics.healthScore, 0) / classes.length);
  const totalUrgent = classes.reduce((acc, c) => acc + c.actionItems.urgentCallsNeeded, 0);

  // Stacked Bar Chart Data
  const chartData = classes.map((c) => ({
    name: c.className,
    teacher: c.teacher.fullName,
    Vàng: c.labelDistribution.yellow,
    Đỏ: c.labelDistribution.red,
    Xám: c.labelDistribution.grey,
  }));

  // Sort by risk (lowest health score first)
  const riskClasses = [...classes].sort((a, b) => a.healthMetrics.healthScore - b.healthMetrics.healthScore);

  // Filter classes for Master Table
  const filteredClasses = classes.filter(c => 
    c.className.toLowerCase().includes(searchClass.toLowerCase()) || 
    c.courseName.toLowerCase().includes(searchClass.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-100 tracking-tight flex flex-wrap items-center gap-2">
            📊 Lead Khối Dashboard — Quản lý Rủi ro Toàn Khối 3-4
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#DB0829]/20 text-[#DB0829] font-mono border border-[#DB0829]/30">
              Macro View
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Giám sát chất lượng giảng dạy, tỷ lệ chuyển dịch nhãn và cảnh báo sớm các lớp sa sút.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <span>Tổng số lớp đang dạy: <b>{classes.length}</b></span>
          <span className="hidden sm:inline">•</span>
          <span>Học viên Active: <b>{totalStudents}</b></span>
        </div>
      </div>

      {/* Layer 1: Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Center Health Score */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sức khỏe Toàn Khối</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">{avgHealthScore}</span>
            <span className="text-xs text-slate-400">/ 100 điểm</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tình trạng: <b>Ổn định &amp; Tốt</b>
          </p>
        </div>

        {/* Card 2: Pass Rate Forecast */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800/80 bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dự báo Pass cuối khóa</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-blue-400">74.5%</span>
            <span className="text-xs text-emerald-400 font-bold">▲ +4.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            (Pass chuẩn 55.5% + Pass mềm dự kiến 19.0%)
          </p>
        </div>

        {/* Card 3: Downgrade Warnings */}
        <div className="glass-card rounded-2xl p-4 border border-red-500/20 bg-gradient-to-br from-slate-900 to-slate-900/60 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Cảnh báo tụt nhãn (Downgrades)</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-red-500">3</span>
            <span className="text-xs text-red-400/80 font-semibold">Học viên</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Rơi từ nhãn Vàng xuống Đỏ/Xám tuần này
          </p>
        </div>

        {/* Card 4: Urgent Action Alerts */}
        <div className="glass-card rounded-2xl p-4 border border-red-500/40 bg-gradient-to-br from-red-950/30 to-slate-900/80 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Cảnh báo Đỏ gấp</span>
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 animate-bounce" style={{ animationDuration: '3s' }}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-red-400">{totalUrgent}</span>
            <span className="text-xs text-slate-400">Học viên</span>
          </div>
          <p className="text-[11px] text-red-300 mt-2">
            Cần thúc giêu GV gọi phụ huynh ngay trong 24h
          </p>
        </div>
      </div>

      {/* Layer 2 & 3: Risk Leaderboard and Stacked Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Risk Classes Leaderboard */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              🚨 Risk Leaderboard (Top Lớp Báo Động)
            </h3>
            <span className="text-[11px] text-slate-400">Sắp xếp theo rủi ro</span>
          </div>

          <div className="space-y-3">
            {riskClasses.map((cls, idx) => (
              <div
                key={cls.classId}
                onClick={() => onSelectClassAndDrillDown(cls)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 shadow-md ${
                  cls.healthMetrics.classRiskLevel === 'high'
                    ? 'bg-red-950/25 border-red-500/50 hover:border-red-500 hover:bg-red-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-[#DB0829]/50 hover:bg-slate-900/80'
                }`}
              >
                {/* Top Row: Class Header & Score Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      idx === 0 ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-1.5">
                        {cls.className}
                        {cls.healthMetrics.isAlarmTriggered && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Lớp có cảnh báo khẩn cấp" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400">GV: <b className="text-slate-200">{cls.teacher.fullName}</b></p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-extrabold font-mono ${
                      cls.healthMetrics.classRiskLevel === 'high' ? 'bg-red-600/40 text-white border border-red-400/60 shadow-sm' :
                      cls.healthMetrics.classRiskLevel === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      Score: {cls.healthMetrics.healthScore}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                      Xem lớp <ChevronRight className="w-3 h-3 text-[#DB0829]" />
                    </p>
                  </div>
                </div>

                {/* Bottom Row / Operational KPIs (Compact 2-Row Icon Layout) */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs font-medium text-slate-300">
                  {/* Hàng 1: Thông tin Lớp (Tiến độ & Sĩ số) */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{cls.progress.completedSessions}/{cls.progress.totalSessions} buổi</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{cls.studentCounts.active} Active</span>
                      {cls.studentCounts.dropped > 0 && (
                        <span className="text-red-400 font-extrabold animate-pulse ml-0.5">
                          • {cls.studentCounts.dropped} Dropped
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hàng 2: Chỉ số Rủi ro (Nhịp tim & Count Đỏ) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Activity className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>ĐH: <b className={cls.healthMetrics.attendanceAverage < 90 ? 'text-red-400 font-extrabold' : 'text-emerald-400 font-semibold'}>{cls.healthMetrics.attendanceAverage}%</b></span>
                      <span className="text-slate-600 font-bold mx-0.5">|</span>
                      <span>BTVN: <b className={cls.healthMetrics.homeworkAverage < 90 ? 'text-red-400 font-extrabold' : 'text-emerald-400 font-semibold'}>{cls.healthMetrics.homeworkAverage}%</b></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${cls.labelDistribution.red > 0 ? 'text-red-400 animate-bounce' : 'text-slate-500'}`} style={{ animationDuration: '2s' }} />
                      <span className={cls.labelDistribution.red > 0 ? 'text-red-400 font-extrabold' : 'text-slate-400'}>
                        {cls.labelDistribution.red} HV Đỏ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar Chart: Label Distribution */}
        <div className="glass-panel lg:col-span-2 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                📈 Bản Đồ Phân Bố Nhãn Theo Lớp (Label Distribution)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">So sánh tỷ lệ học viên Vàng / Đỏ / Xám giữa các lớp trong Khối</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#DB0829]" />
          </div>

          <div className="h-80 w-full pt-2 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={12} fontStyle="bold" width={60} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px', bottom: 0 }} />
                <Bar dataKey="Vàng" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Nhãn Vàng (An toàn / >=60 điểm)" />
                <Bar dataKey="Đỏ" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} name="Nhãn Đỏ (Nhóm tiềm năng / Cần can thiệp / 45-59 điểm)" />
                <Bar dataKey="Xám" stackId="a" fill="#64748b" radius={[0, 4, 4, 0]} name="Nhãn Xám (Rủi ro cao nhất / Gần như Fail / <45 điểm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Layer 4: Master Class Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            📋 Bảng Quản Lý Toàn Bộ Lớp Trong Khối 3-4 (Master Table)
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="🔍 Lọc lớp theo tên/mã..."
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#DB0829] w-full sm:w-56 transition-all"
              />
            </div>
            <span className="hidden sm:inline text-[10px] text-slate-400">Bấm vào hàng để vào lớp</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Mã lớp / Khóa</th>
                <th className="py-3 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3 px-4 text-center">Sĩ số</th>
                <th className="py-3 px-4 text-center">Tiến độ</th>
                <th className="py-3 px-4 text-center">Biến động nhãn</th>
                <th className="py-3 px-4 text-center">Health Score</th>
                <th className="py-3 px-4 text-center">Tỷ lệ Pass</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    Không tìm thấy lớp nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((c) => (
                  <tr
                  key={c.classId}
                  onClick={() => onSelectClassAndDrillDown(c)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-100 font-mono text-sm">{c.className}</span>
                    <p className="text-[11px] text-slate-400">{c.courseName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-200">{c.teacher.fullName}</span>
                    <p className="text-[11px] font-mono text-slate-500">{c.teacher.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                    {c.studentCounts.active}/{c.studentCounts.totalEnrolled}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-slate-300">{c.progress.percentage}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-800 mx-auto mt-1 overflow-hidden">
                      <div className="h-full bg-[#DB0829] rounded-full" style={{ width: `${c.progress.percentage}%` }} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {c.className === 'IC2030' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">↑ 2 Lên</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500">↓ 1 Tụt</span>
                      </div>
                    ) : c.className === 'IC1924' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500">↓ 2 Tụt</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 font-bold">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold font-mono ${
                      c.healthMetrics.classRiskLevel === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      c.healthMetrics.classRiskLevel === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {c.healthMetrics.healthScore} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold font-mono text-emerald-400">{c.healthMetrics.passChuanRate}%</span>
                    <span className="text-slate-500 text-[10px]"> (+{c.healthMetrics.passMemRate}% mềm)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#DB0829] hover:text-white text-slate-300 font-semibold transition-all inline-flex items-center gap-1">
                      Vào lớp <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

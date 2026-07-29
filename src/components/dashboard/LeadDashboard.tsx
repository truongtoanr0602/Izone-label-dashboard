import React, { useState } from 'react';
import { 
  ArrowUpRight, Award, BarChart3, CheckCircle2,
  Clock, Search, BookOpen, UserMinus, UserCheck
} from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';

interface LeadDashboardProps {
  classes: ClassSummary[];
  onSelectClassAndDrillDown: (cls: ClassSummary) => void;
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown
}) => {
  const [searchClass, setSearchClass] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<'all' | number>('all');

  // Aggregate KPIs
  const totalStudents = classes.reduce((acc, c) => acc + c.studentCounts.active, 0);
  const totalDropped = classes.reduce((acc, c) => acc + c.studentCounts.dropped, 0);
  const totalOnHold = classes.reduce((acc, c) => acc + c.studentCounts.onHold, 0);

  const avgAttendance = (classes.reduce((acc, c) => acc + c.healthMetrics.attendanceAverage, 0) / classes.length).toFixed(1);
  const avgHomework = (classes.reduce((acc, c) => acc + c.healthMetrics.homeworkAverage, 0) / classes.length).toFixed(1);
  const avgPassChuan = (classes.reduce((acc, c) => acc + c.healthMetrics.passChuanRate, 0) / classes.length).toFixed(1);
  const avgPassMem = (classes.reduce((acc, c) => acc + c.healthMetrics.passMemRate, 0) / classes.length).toFixed(1);

  // Stacked Bar Chart Data
  const barChartData = classes.map((c) => ({
    name: c.className,
    teacher: c.teacher.fullName,
    Vàng: c.labelDistribution.yellow,
    Đỏ: c.labelDistribution.red,
    Xám: c.labelDistribution.grey,
  }));

  // Mock Timeline Data (In a real app, this would be fetched based on timelineFilter)
  const timelineData = [
    { checkpoint: 'Tuần 1', attendance: 98, homework: 95, passRate: 20 },
    { checkpoint: 'Tuần 2', attendance: 96, homework: 90, passRate: 25 },
    { checkpoint: 'Test 1', attendance: 95, homework: 85, passRate: 40 },
    { checkpoint: 'Tuần 4', attendance: 92, homework: 82, passRate: 45 },
    { checkpoint: 'Tuần 5', attendance: 88, homework: 75, passRate: 50 },
    { checkpoint: 'Test 2', attendance: 85, homework: 70, passRate: 55 },
  ];

  // Filter classes for Master Table
  const filteredClasses = classes.filter(c => 
    c.className.toLowerCase().includes(searchClass.toLowerCase()) || 
    c.courseName.toLowerCase().includes(searchClass.toLowerCase()) ||
    c.teacher.fullName.toLowerCase().includes(searchClass.toLowerCase())
  );

  const getWarningStatus = (cls: ClassSummary) => {
    const avg = (cls.healthMetrics.attendanceAverage + cls.healthMetrics.homeworkAverage) / 2;
    if (avg > 80 && cls.healthMetrics.attendanceAverage >= 70 && cls.healthMetrics.homeworkAverage >= 70) 
      return { label: 'Bình thường', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' };
    if (avg >= 70) 
      return { label: 'Cần theo dõi', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' };
    return { label: 'Cần can thiệp', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' };
  };

  const getMetricColor = (value: number) => {
    if (value > 80) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-[#DB0829] dark:text-red-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex flex-wrap items-center gap-2">
            📊 Lead Khối Dashboard — Quản lý Rủi ro Toàn Khối 3-4
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#DB0829]/10 text-[#DB0829] font-mono border border-[#DB0829]/20">
              Macro View
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Giám sát chất lượng giảng dạy, tỷ lệ chuyển dịch nhãn và cảnh báo sớm các lớp sa sút.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono shadow-sm dark:shadow-none">
          <span>Tổng số lớp đang dạy: <b>{classes.length}</b></span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
          <span>Học viên Active: <b>{totalStudents}</b></span>
        </div>
      </div>

      {/* Layer 1: 6 Macro Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="rounded-2xl p-4 border border-slate-200 dark:border-none bg-white dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Điểm danh (TB)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white">{avgAttendance}%</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-slate-200 dark:border-none bg-white dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Làm BTVN (TB)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white">{avgHomework}%</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-slate-200 dark:border-none bg-white dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pass Chuẩn</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white">{avgPassChuan}%</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-slate-200 dark:border-none bg-white dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pass Mềm</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white">{avgPassMem}%</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500">
              <UserMinus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">Bỏ học</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-red-700 dark:text-red-400">{totalDropped}</span>
            <span className="text-xs text-red-500/80">HV</span>
          </div>
        </div>

        <div className="rounded-2xl p-4 border border-slate-200 dark:border-none bg-white dark:bg-slate-800 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Bảo lưu</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white">{totalOnHold}</span>
            <span className="text-xs text-slate-500">HV</span>
          </div>
        </div>
      </div>

      {/* Layer 2: Timeline Tracking Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col">
        <div className="bg-[#DB0829] dark:bg-slate-800/90 text-white border-b border-[#DB0829] dark:border-slate-700 px-5 py-4 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              📈 Timeline Tracking (Biến động theo thời gian)
            </h3>
            <p className="text-xs text-red-100 mt-1">
              Theo dõi sự thay đổi của tỷ lệ Điểm danh, BTVN và Pass dự kiến qua các mốc thời gian.
            </p>
          </div>
          <select 
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-[#DB0829] dark:focus:ring-slate-500 transition-colors"
            value={timelineFilter}
            onChange={(e) => setTimelineFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Toàn Khối 3-4</option>
            {classes.map(c => (
              <option key={c.classId} value={c.classId}>{c.className}</option>
            ))}
          </select>
        </div>
        <div className="h-64 w-full p-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} vertical={false} />
              <XAxis dataKey="checkpoint" stroke="#94a3b8" fontSize={11} tickMargin={10} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="attendance" name="Tỷ lệ Điểm danh (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="homework" name="Tỷ lệ BTVN (%)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="passRate" name="Tỷ lệ Pass Dự kiến (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Layer 3: Master Class Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-[#DB0829] dark:bg-slate-800/90 text-white border-b border-[#DB0829] dark:border-slate-700 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            📋 Bảng Quản Lý Toàn Bộ Lớp (Master Table)
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="🔍 Lọc lớp/GV..."
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-[#DB0829] dark:focus:ring-slate-500 w-full sm:w-56 transition-all"
              />
            </div>
            <span className="hidden sm:inline text-[10px] text-red-100">Bấm vào hàng để vào lớp</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Mã lớp / Khóa</th>
                <th className="py-3 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3 px-4 text-center">Sĩ số (Active)</th>
                <th className="py-3 px-4 text-center">Điểm danh / BTVN</th>
                <th className="py-3 px-4 text-center">Tiến độ</th>
                <th className="py-3 px-4 text-center">Trạng thái Cảnh báo</th>
                <th className="py-3 px-4 text-center">Tỷ lệ Pass (Chuẩn/Mềm)</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    Không tìm thấy lớp nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((c) => {
                  const warning = getWarningStatus(c);
                  return (
                  <tr
                    key={c.classId}
                    onClick={() => onSelectClassAndDrillDown(c)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-100 font-mono text-sm">{c.className}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.courseName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">{c.teacher.fullName}</span>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">{c.teacher.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-200">
                      {c.studentCounts.active} / {c.studentCounts.totalEnrolled}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs">
                      <span className={`${getMetricColor(c.healthMetrics.attendanceAverage)} font-medium`}>ĐH: {c.healthMetrics.attendanceAverage}%</span>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className={`${getMetricColor(c.healthMetrics.homeworkAverage)} font-medium`}>BT: {c.healthMetrics.homeworkAverage}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{c.progress.percentage}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress.percentage}%` }} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${warning.color}`}>
                        {warning.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{c.healthMetrics.passChuanRate}%</span>
                      <span className="font-bold text-color:white text-slate-500 text-[11px]"> / {c.healthMetrics.passMemRate}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#DB0829] hover:text-[#DB0829] dark:hover:border-[#DB0829] dark:hover:text-[#DB0829] font-semibold transition-colors inline-flex items-center gap-1">
                        Vào lớp <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Layer 4: Stacked Bar Chart - Label Distribution */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-[#DB0829] dark:bg-slate-800/90 text-white border-b border-[#DB0829] dark:border-slate-700 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              📊 Bản Đồ Phân Bố Nhãn Theo Lớp (Label Distribution)
            </h3>
            <p className="text-xs text-red-100 mt-0.5">So sánh tỷ lệ học viên Vàng / Đỏ / Xám giữa các lớp trong Khối</p>
          </div>
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        
        <div className="h-80 w-full p-5 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} fontStyle="bold" width={60} />
              <Tooltip 
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px', bottom: 0 }} />
              <Bar dataKey="Vàng" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Nhãn Vàng (An toàn / >=60 điểm)" />
              <Bar dataKey="Đỏ" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} name="Nhãn Đỏ (Nhóm tiềm năng / Cần can thiệp / 45-59 điểm)" />
              <Bar dataKey="Xám" stackId="a" fill="#64748b" radius={[0, 4, 4, 0]} name="Nhãn Xám (Rủi ro cao / Gần như Fail / <45 điểm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

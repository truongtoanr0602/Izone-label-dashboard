import React, { useState } from 'react';
import { 
  ArrowUpRight, Award, BarChart3, CheckCircle2,
  Clock, Search, BookOpen, UserMinus, UserCheck, TrendingUp, Table2,
  TrendingDown, Minus
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

  // Mock Deltas
  const deltas = {
    attendance: 2.1,
    homework: -1.5,
    passChuan: 0.8,
    passMem: 0,
    dropped: 2,
    onHold: -1
  };

  const renderTrend = (delta: number, invertColors: boolean = false, suffix: string = '%') => {
    if (delta === 0) {
      return (
        <span className="flex items-center text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-2">
          <Minus size={16} className="mr-1" /> 0{suffix}
        </span>
      );
    }
    const isUp = delta > 0;
    const isGood = invertColors ? !isUp : isUp;
    const colorClass = isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
    const Icon = isUp ? TrendingUp : TrendingDown;
    const sign = isUp ? '+' : '';

    return (
      <span className={`flex items-center text-[13px] font-medium ${colorClass} mt-2`}>
        <Icon size={16} className="mr-1" /> {sign}{delta}{suffix}
      </span>
    );
  };

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
      return { label: 'Bình thường', color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' };
    if (avg >= 70) 
      return { label: 'Cần theo dõi', color: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
    return { label: 'Cần can thiệp', color: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  };

  const getMetricColor = (value: number) => {
    if (value > 80) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-[#DB0829]';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight flex flex-wrap items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#475569] dark:text-[#a1a1aa]" /> Lead Khối Dashboard — Quản lý Rủi ro Toàn Khối 3-4
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#DB0829]/10 text-[#DB0829] font-mono border border-[#DB0829]/20">
              Macro View
            </span>
          </h2>
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-0.5">
            Giám sát chất lượng giảng dạy, tỷ lệ chuyển dịch nhãn và cảnh báo sớm các lớp sa sút.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 bg-white dark:bg-[#27272a] px-3 py-2 rounded-[12px] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs text-[#404040]/70 dark:text-[#a1a1aa] font-mono">
          <span>Tổng số lớp đang dạy: <b className="text-[#404040] dark:text-[#e4e4e7]">{classes.length}</b></span>
          <span className="hidden sm:inline text-[#404040]/30 dark:text-[#52525b]">•</span>
          <span>Học viên Active: <b className="text-[#404040] dark:text-[#e4e4e7]">{totalStudents}</b></span>
        </div>
      </div>

      {/* Layer 1: 6 Macro Metrics Cards — Standardized */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Điểm danh (TB)</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7] leading-none">{avgAttendance}%</span>
            </div>
            {renderTrend(deltas.attendance)}
          </div>
        </div>

        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Làm BTVN (TB)</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7] leading-none">{avgHomework}%</span>
            </div>
            {renderTrend(deltas.homework)}
          </div>
        </div>

        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Pass Chuẩn</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7] leading-none">{avgPassChuan}%</span>
            </div>
            {renderTrend(deltas.passChuan)}
          </div>
        </div>

        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Pass Mềm</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7] leading-none">{avgPassMem}%</span>
            </div>
            {renderTrend(deltas.passMem)}
          </div>
        </div>

        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#ef3753]">
              <UserMinus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Bỏ học</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-red-600 dark:text-red-400 leading-none">{totalDropped}</span>
              <span className="text-xs text-red-500/80">HV</span>
            </div>
            {renderTrend(deltas.dropped, true, '')}
          </div>
        </div>

        <div className="rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">Bảo lưu</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7] leading-none">{totalOnHold}</span>
              <span className="text-xs text-[#404040]/50 dark:text-[#71717a]">HV</span>
            </div>
            {renderTrend(deltas.onHold, true, '')}
          </div>
        </div>
      </div>

      {/* Layer 2: Timeline Tracking Chart */}
      <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] flex flex-col">
        <div className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] border-l-4 border-l-[#db0829] px-5 py-4 rounded-t-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#db0829]" /> Timeline Tracking (Biến động theo thời gian)
            </h3>
            <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-1">
              Theo dõi sự thay đổi của tỷ lệ Điểm danh, BTVN và Pass dự kiến qua các mốc thời gian.
            </p>
          </div>
          <select 
            className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-[#404040] dark:text-[#e4e4e7] outline-none focus:ring-1 focus:ring-[#DB0829] transition-colors"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} vertical={false} />
              <XAxis dataKey="checkpoint" stroke="#9ca3af" fontSize={11} tickMargin={10} />
              <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '12px', fontSize: '12px', color: '#404040' }}
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
      <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] flex flex-col overflow-hidden">
        <div className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] border-l-4 border-l-[#db0829] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
            <Table2 className="w-4 h-4 text-[#db0829]" /> Bảng Quản Lý Toàn Bộ Lớp (Master Table)
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#404040]/40 dark:text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Lọc lớp/GV..."
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#e5e7eb] dark:border-[#3f3f46] text-[#404040] dark:text-[#e4e4e7] outline-none focus:ring-1 focus:ring-[#DB0829] w-full sm:w-56 transition-all"
              />
            </div>
            <span className="hidden sm:inline text-[10px] text-[#404040]/50 dark:text-[#71717a]">Bấm vào hàng để vào lớp</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6] dark:bg-[#18181b] text-[#404040]/60 dark:text-[#71717a] font-semibold uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#3f3f46]">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#404040]/50 dark:text-[#71717a] text-xs">
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
                    className="hover:bg-[#f3f4f6]/50 dark:hover:bg-[#3f3f46]/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#404040] dark:text-[#e4e4e7] font-mono text-sm">{c.className}</span>
                      <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a]">{c.courseName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#404040] dark:text-[#e4e4e7] bg-[#f3f4f6] dark:bg-[#3f3f46] px-2 py-0.5 rounded-md">{c.teacher.fullName}</span>
                      <p className="text-[11px] font-mono text-[#404040]/50 dark:text-[#71717a] mt-1">{c.teacher.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#404040] dark:text-[#e4e4e7]">
                      {c.studentCounts.active} / {c.studentCounts.totalEnrolled}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs">
                      <span className={`${getMetricColor(c.healthMetrics.attendanceAverage)} font-medium`}>ĐH: {c.healthMetrics.attendanceAverage}%</span>
                      <span className="text-[#404040]/30 dark:text-[#52525b] mx-1">•</span>
                      <span className={`${getMetricColor(c.healthMetrics.homeworkAverage)} font-medium`}>BT: {c.healthMetrics.homeworkAverage}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-[#404040] dark:text-[#e4e4e7]">{c.progress.percentage}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] mx-auto mt-1 overflow-hidden">
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
                      <span className="font-bold text-[#404040]/50 dark:text-[#71717a] text-[11px]"> / {c.healthMetrics.passMemRate}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-[8px] bg-transparent text-[#404040]/70 dark:text-[#a1a1aa] border border-[#f3f4f6] dark:border-[#3f3f46] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors font-semibold inline-flex items-center gap-1">
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
      <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] flex flex-col overflow-hidden">
        <div className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] border-l-4 border-l-[#db0829] px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#db0829]" /> Bản Đồ Phân Bố Nhãn Theo Lớp (Label Distribution)
            </h3>
            <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-0.5">So sánh tỷ lệ học viên Vàng / Đỏ / Xám giữa các lớp trong Khối</p>
          </div>
          <BarChart3 className="w-5 h-5 text-[#475569] dark:text-[#71717a]" />
        </div>
        
        <div className="h-80 w-full p-5 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} fontStyle="bold" width={60} />
              <Tooltip 
                contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '12px', fontSize: '12px', color: '#404040' }}
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

import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight, BarChart3, Search, Table2
} from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';
import {
  MOCK_LABEL_CHANGES,
  MOCK_SNAPSHOTS,
  REFERENCE_DATE,
} from '../../data/mockData';
import {
  aggregateKhoi,
  labelFlowDelta,
  labelFlowInPeriod,
  latestSnapshotPerClass,
  listPeriods,
  metricDelta,
  periodKeyOf,
  previousPeriodKey,
} from '../../data/selectors';
import { useUrlParam } from '../../hooks/useUrlParam';
import { ContextBar } from './ContextBar';
import { KpiRow, type KpiDeltas, type KpiSparklines } from './KpiRow';
import { TrendChart, type TrendPoint, type TrendSeries } from './TrendChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LeadDashboardProps {
  classes: ClassSummary[];
  onSelectClassAndDrillDown: (cls: ClassSummary) => void;
  isDarkMode: boolean;
}

/** Hai nhóm chỉ số KHÁC THANG ĐO → hai biểu đồ riêng (§3.2 của tài liệu thiết kế). */
const OPERATIONS_SERIES: TrendSeries[] = [
  { key: 'attendanceAvg', name: 'Điểm danh', lightColor: '#3b82f6', darkColor: '#3b82f6' },
  { key: 'homeworkAvg', name: 'BTVN', lightColor: '#f59e0b', darkColor: '#d97706' },
];

const OUTCOME_SERIES: TrendSeries[] = [
  { key: 'passChuanRate', name: 'Pass chuẩn', lightColor: '#10b981', darkColor: '#059669' },
  { key: 'passMemRate', name: 'Pass mềm', lightColor: '#a855f7', darkColor: '#a855f7' },
];

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown,
  isDarkMode,
}) => {
  const [searchClass, setSearchClass] = useState('');

  const periods = useMemo(() => listPeriods(MOCK_SNAPSHOTS), []);
  const defaultPeriod = periods[0]?.key ?? periodKeyOf(REFERENCE_DATE);
  const [selectedPeriod, setSelectedPeriod] = useUrlParam('ky', defaultPeriod);

  const view = useMemo(() => {
    const currentSnaps = latestSnapshotPerClass(MOCK_SNAPSHOTS, selectedPeriod);
    const previousSnaps = latestSnapshotPerClass(
      MOCK_SNAPSHOTS,
      previousPeriodKey(selectedPeriod),
    );

    const aggregate = aggregateKhoi(currentSnaps);
    const labelFlow = labelFlowInPeriod(MOCK_LABEL_CHANGES, MOCK_SNAPSHOTS, selectedPeriod);

    const currentIds = new Set(currentSnaps.map((s) => s.classId));
    const previousIds = new Set(previousSnaps.map((s) => s.classId));

    const deltas: KpiDeltas = {
      attendance: metricDelta(currentSnaps, previousSnaps, (a) => a.attendanceAvg),
      homework: metricDelta(currentSnaps, previousSnaps, (a) => a.homeworkAvg),
      passChuan: metricDelta(currentSnaps, previousSnaps, (a) => a.passChuanRate),
      passMem: metricDelta(currentSnaps, previousSnaps, (a) => a.passMemRate),
      dropped: metricDelta(currentSnaps, previousSnaps, (a) => a.droppedStudents),
      labelNet: labelFlowDelta(MOCK_LABEL_CHANGES, MOCK_SNAPSHOTS, selectedPeriod),
    };

    /*
     * Chuỗi cấp khối: mỗi tuần một điểm, gộp có trọng số qua toàn bộ lớp của
     * tuần đó. Tỷ lệ pass giữ nguyên `null` khi tuần đó chưa lớp nào thi — KHÔNG
     * ép về 0, xem chú thích của TrendPoint.
     */
    const weeks = [...new Set(MOCK_SNAPSHOTS.map((s) => s.snapshotDate))].sort();
    const khoiSeries: TrendPoint[] = weeks.map((date) => {
      const ofWeek = MOCK_SNAPSHOTS.filter((s) => s.snapshotDate === date);
      const agg = aggregateKhoi(ofWeek);
      /*
       * Không thể lấy "Test N" của một lớp bất kỳ làm nhãn cho cả tuần: mốc
       * test bám theo VÒNG ĐỜI từng lớp, không bám lịch. Hai lớp khai giảng
       * cách nhau ba tháng vẫn có thể cùng ở "Test 4" nhưng vào hai tuần khác
       * nhau hẳn; ngược lại cùng một tuần có thể có lớp đang ở Test 1 và lớp
       * khác đã ở Test 6. Lấy đại một lớp làm đại diện là gán nhãn sai cho cả
       * khối. Cái có ý nghĩa ở cấp khối là ĐẾM: bao nhiêu lớp thi tuần đó —
       * con số này cho Lead biết một đường đi ngang là "ổn định" hay "chưa có
       * lớp nào nộp dữ liệu".
       */
      const classesWithTest = new Set(
        ofWeek.filter((s) => s.testCheckpoint !== null).map((s) => s.classId),
      );
      return {
        date,
        testCheckpoint: classesWithTest.size > 0 ? `${classesWithTest.size} lớp thi` : null,
        attendanceAvg: agg.attendanceAvg,
        homeworkAvg: agg.homeworkAvg,
        passChuanRate: agg.passChuanRate,
        passMemRate: agg.passMemRate,
      };
    });

    const recent = khoiSeries.slice(-13);
    const sparklines: KpiSparklines = {
      attendance: recent.map((p) => p.attendanceAvg),
      homework: recent.map((p) => p.homeworkAvg),
      passChuan: recent.map((p) => p.passChuanRate),
      passMem: recent.map((p) => p.passMemRate),
    };

    /*
     * Lấy từ `currentSnaps` (đúng kỳ đang xem), KHÔNG lấy từ prop `classes` —
     * `classes` luôn phản ánh thời điểm hiện tại nên khi chọn kỳ cũ, tử số
     * "chưa đủ dữ liệu" (hiện tại) bị đem chia cho mẫu số `activeStudents`
     * (của kỳ cũ) ở ContextBar, ra phần trăm ảo không tương ứng dữ liệu thật
     * của kỳ đó.
     */
    const noDataStudents = currentSnaps.reduce((sum, s) => sum + s.labelCounts.noData, 0);

    return {
      aggregate,
      labelFlow,
      deltas,
      sparklines,
      trendSeries: recent,
      newClasses: [...currentIds].filter((id) => !previousIds.has(id)).length,
      endedClasses: [...previousIds].filter((id) => !currentIds.has(id)).length,
      noDataStudents,
    };
  }, [selectedPeriod]);

  // Stacked Bar Chart Data
  const barChartData = classes.map((c) => ({
    name: c.className,
    teacher: c.teacher.fullName,
    Vàng: c.labelDistribution.yellow,
    Đỏ: c.labelDistribution.red,
    Xám: c.labelDistribution.grey,
  }));

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

      <ContextBar
        periods={periods}
        selectedKey={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        aggregate={view.aggregate}
        newClasses={view.newClasses}
        endedClasses={view.endedClasses}
        noDataStudents={view.noDataStudents}
        lastSyncedAt={REFERENCE_DATE}
      />

      <KpiRow
        aggregate={view.aggregate}
        deltas={view.deltas}
        labelFlow={view.labelFlow}
        sparklines={view.sparklines}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart
          title="Chất lượng vận hành"
          subtitle="Tỷ lệ điểm danh và BTVN toàn khối. Vạch dọc là mốc bài test."
          points={view.trendSeries}
          series={OPERATIONS_SERIES}
          domain={[70, 100]}
          isDarkMode={isDarkMode}
        />
        <TrendChart
          title="Kết quả"
          subtitle="Tỷ lệ pass chuẩn và pass mềm toàn khối, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi."
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          domain={[0, 80]}
          isDarkMode={isDarkMode}
        />
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

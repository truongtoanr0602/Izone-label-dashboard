import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, BarChart3, Search, Table2
} from 'lucide-react';
import type { ClassSummary, ContactLog } from '../../data/types';
import {
  contactCoverage,
  currentCheckpoint,
  periodLabel,
  type Period,
} from '../../data/selectors';
import { useUrlParam } from '../../hooks/useUrlParam';
import { ContextBar } from './ContextBar';
import { KpiRow, type KpiDeltas } from './KpiRow';
import { SectionHeader } from './SectionHeader';
import { TrendChart, type TrendSeries } from './TrendChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardService } from '../../api/dashboardService';
import {
  toLeadTrendPoint,
  type DashboardMetric,
  type LeadDashboardResponse,
} from '../../api/dashboardContracts';

interface LeadDashboardProps {
  classes: ClassSummary[];
  onSelectClassAndDrillDown: (cls: ClassSummary) => void;
  isDarkMode: boolean;
  khoiId: number;
}

const OPERATIONS_SERIES: TrendSeries[] = [
  { key: 'attendanceAvg', name: 'Điểm danh', lightColor: '#3b82f6', darkColor: '#3b82f6' },
  { key: 'homeworkAvg', name: 'BTVN', lightColor: '#f59e0b', darkColor: '#d97706' },
];

const OUTCOME_SERIES: TrendSeries[] = [
  { key: 'passChuanRate', name: 'Pass chuẩn', lightColor: '#10b981', darkColor: '#059669' },
  { key: 'passMemRate', name: 'Pass mềm', lightColor: '#a855f7', darkColor: '#a855f7' },
];

function coverageOf(logs: ContactLog[], currentStudents: any[]) {
  return contactCoverage(currentStudents, logs, currentCheckpoint(currentStudents));
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown,
  isDarkMode,
  khoiId,
}) => {
  const [searchClass, setSearchClass] = useState('');
  
  const [dashboard, setDashboard] = useState<LeadDashboardResponse | null>(null);
  const [contactLogs] = useState<ContactLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [urlPeriod, setSelectedPeriod] = useUrlParam('ky', 'current');
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const selectedPeriod = /^\d{4}-\d{2}$/.test(urlPeriod) ? urlPeriod : currentMonthKey;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const today = new Date();
        const [year, month] = selectedPeriod.split('-').map(Number);
        const requestedEnd = selectedPeriod === currentMonthKey
          ? today
          : new Date(Date.UTC(year, month, 0));
        const requestedStart = new Date(requestedEnd);
        requestedStart.setUTCDate(requestedStart.getUTCDate() - 89);
        const response = await dashboardService.getLeadDashboard({
          khoiId,
          from: requestedStart.toISOString().slice(0, 10),
          to: requestedEnd.toISOString().slice(0, 10),
          classStatus: 'on_going',
        });
        setDashboard(response);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [currentMonthKey, khoiId, selectedPeriod]);

  const periods = useMemo<Period[]>(() => {
    const keys = new Set((dashboard?.trend ?? []).map((point) => point.date.slice(0, 7)));
    keys.add(currentMonthKey);
    return [...keys].sort().reverse().map((key) => {
      const [year, month] = key.split('-').map(Number);
      const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
      return { key, label: periodLabel(key), startDate: `${key}-01`, endDate: `${key}-${String(lastDay).padStart(2, '0')}` };
    });
  }, [currentMonthKey, dashboard]);

  const view = useMemo(() => {
    if (!dashboard) {
      return {
        aggregate: { classCount: 0, activeStudents: 0, droppedStudents: 0, riskPct: null, classesWithTests: 0, attendanceAvg: null, homeworkAvg: null, passChuanRate: null, passMemRate: null },
        labelFlow: { up: 0, down: 0, net: null, bySeverity: { recovery: 0, warning: 0, serious: 0, critical: 0 }, recalcEvents: 0, classesWithTest: 0 },
        deltas: { attendance: { value: null, comparableClasses: 0, totalClasses: 0 }, homework: { value: null, comparableClasses: 0, totalClasses: 0 }, passChuan: { value: null, comparableClasses: 0, totalClasses: 0 }, passMem: { value: null, comparableClasses: 0, totalClasses: 0 }, dropped: { value: null, comparableClasses: 0, totalClasses: 0 }, labelNet: { value: null, comparableClasses: 0, totalClasses: 0 } },
        trendSeries: [],
        newClasses: 0,
        endedClasses: 0,
        noDataStudents: 0
      };
    }

    const comparable = dashboard.classes.length;
    const deltaOf = (metric: DashboardMetric) => ({ value: metric.delta, comparableClasses: comparable, totalClasses: comparable });
    const deltas: KpiDeltas = {
      attendance: deltaOf(dashboard.kpis.attendanceAvg),
      homework: deltaOf(dashboard.kpis.homeworkAvg),
      passChuan: deltaOf(dashboard.kpis.passStandardRate),
      passMem: deltaOf(dashboard.kpis.softPassRate),
      dropped: deltaOf(dashboard.kpis.periodAttritionRate),
      labelNet: { value: dashboard.kpis.netMomentum.value, comparableClasses: dashboard.kpis.netMomentum.classesWithTests, totalClasses: comparable },
    };

    return {
      aggregate: {
        classCount: dashboard.classes.length,
        activeStudents: dashboard.kpis.activeStudents.value ?? 0,
        droppedStudents: dashboard.kpis.periodAttritionRate.newDroppedStudents,
        attendanceAvg: dashboard.kpis.attendanceAvg.value,
        homeworkAvg: dashboard.kpis.homeworkAvg.value,
        passChuanRate: dashboard.kpis.passStandardRate.value,
        passMemRate: dashboard.kpis.softPassRate.value,
        riskPct: dashboard.kpis.riskRate.value,
        classesWithTests: dashboard.kpis.passStandardRate.classesWithTests ?? 0,
      },
      labelFlow: {
        up: dashboard.kpis.netMomentum.upTransitions,
        down: dashboard.kpis.netMomentum.downTransitions,
        net: dashboard.kpis.netMomentum.value,
        bySeverity: { recovery: 0, warning: 0, serious: 0, critical: 0 },
        recalcEvents: dashboard.kpis.netMomentum.recalculationEvents,
        classesWithTest: dashboard.kpis.netMomentum.classesWithTests,
      },
      deltas,
      trendSeries: dashboard.trend.map(toLeadTrendPoint),
      newClasses: 0,
      endedClasses: 0,
      noDataStudents: dashboard.labelDistribution.noData,
    };
  }, [dashboard]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu khối...</div>;
  }

  const contractClassIds = new Set(dashboard?.classes.map((item) => item.classId) ?? []);
  const contractClassById = new Map(dashboard?.classes.map((item) => [item.classId, item]) ?? []);
  const displayClasses = classes.filter((item) => contractClassIds.has(item.classId)).map((item) => {
    const contract = contractClassById.get(item.classId);
    if (!contract) return item;
    return {
      ...item,
      studentCounts: { ...item.studentCounts, active: contract.activeStudents, dropped: contract.droppedStudents },
      progress: { ...item.progress, percentage: contract.progressPct ?? item.progress.percentage },
      healthMetrics: {
        ...item.healthMetrics,
        isAlarmTriggered: contract.isAlarmTriggered,
        attendanceAverage: contract.attendanceAvg,
        homeworkAverage: contract.homeworkAvg,
        passChuanRate: contract.passStandardRate,
        passMemRate: contract.softPassRate,
      },
      labelDistribution: {
        ...item.labelDistribution,
        yellow: contract.labelDistribution.yellow,
        red: contract.labelDistribution.red,
        grey: contract.labelDistribution.grey,
        noData: contract.labelDistribution.noData,
      },
      lastSyncedAt: contract.lastSnapshotDate,
    };
  });
  const barChartData = displayClasses.map((c) => ({
    name: c.className,
    teacher: c.teacher.fullName,
    Vàng: c.labelDistribution.yellow,
    Đỏ: c.labelDistribution.red,
    Xám: c.labelDistribution.grey,
  }));

  const filteredClasses = displayClasses.filter(c =>
    c.className.toLowerCase().includes(searchClass.toLowerCase()) || 
    c.courseName.toLowerCase().includes(searchClass.toLowerCase()) ||
    c.teacher.fullName.toLowerCase().includes(searchClass.toLowerCase())
  );

  const getWarningStatus = (cls: ClassSummary) => {
    if (cls.healthMetrics.attendanceAverage === null || cls.healthMetrics.homeworkAverage === null) {
      return { label: 'Chưa có dữ liệu', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
    }
    const avg = (cls.healthMetrics.attendanceAverage + cls.healthMetrics.homeworkAverage) / 2;
    if (avg > 80 && cls.healthMetrics.attendanceAverage >= 70 && cls.healthMetrics.homeworkAverage >= 70) 
      return { label: 'Bình thường', color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' };
    if (avg >= 70) 
      return { label: 'Cần theo dõi', color: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };
    return { label: 'Cần can thiệp', color: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' };
  };

  const getMetricColor = (value: number | null) => {
    if (value === null) return 'text-[#404040]/40 dark:text-[#71717a]';
    if (value > 80) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight flex flex-wrap items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#475569] dark:text-[#a1a1aa]" /> Lead Khối Dashboard
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#404040]/50 dark:text-[#71717a]">
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
        lastSyncedAt={dashboard?.meta.dataFreshnessAt?.slice(0, 10) ?? dashboard?.meta.to ?? ''}
      />

      <KpiRow
        aggregate={view.aggregate}
        deltas={view.deltas}
        labelFlow={view.labelFlow}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart
          title="Chất lượng vận hành"
          subtitle={`Tỷ lệ điểm danh và BTVN toàn khối, ${view.trendSeries.length} tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}.`}
          points={view.trendSeries}
          series={OPERATIONS_SERIES}
          domain={[70, 100]}
          isDarkMode={isDarkMode}
        />
        <TrendChart
          title="Kết quả"
          subtitle={`Tỷ lệ pass chuẩn và pass mềm toàn khối, ${view.trendSeries.length} tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}.`}
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          domain={[0, 100]}
          showTestCountInTooltip
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="rounded-[16px] bg-white dark:bg-[#27272a] shadow-sm flex flex-col overflow-hidden">
        <SectionHeader
          icon={<Table2 className="w-4 h-4 text-[#db0829]" />}
          title="Bảng Quản Lý Toàn Bộ Lớp (Master Table)"
          subtitle="Hiện trạng hôm nay của toàn bộ lớp — KHÔNG lọc theo kỳ báo cáo đã chọn ở trên."
          right={
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
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6] dark:bg-[#18181b] text-[#404040]/60 dark:text-[#71717a] font-semibold uppercase tracking-wider text-xs">
                <th className="py-3 px-4">Mã lớp / Khóa</th>
                <th className="py-3 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3 px-4 text-center">Sĩ số (Active)</th>
                <th className="py-3 px-4 text-center">Điểm danh / BTVN</th>
                <th className="py-3 px-4 text-center">Tiến độ</th>
                <th className="py-3 px-4 text-center">Trạng thái Cảnh báo</th>
                <th className="py-3 px-4 text-center" title="Số cảnh báo GV đã xác nhận đã liên hệ, tại mốc test hiện tại của lớp">Độ phủ liên hệ</th>
                <th className="py-3 px-4 text-center">Tỷ lệ Pass (Chuẩn/Mềm)</th>
                <th className="py-3 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#3f3f46]">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#404040]/50 dark:text-[#71717a] text-xs">
                    Không tìm thấy lớp nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((c) => {
                  const warning = getWarningStatus(c);
                  const coverage = coverageOf(contactLogs, []); // Empty array because we don't fetch all students for lead dashboard yet
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
                    <td className="py-3.5 px-4 text-center">
                      <span className={`${getMetricColor(c.healthMetrics.attendanceAverage)} font-medium font-mono`}>ĐH: {c.healthMetrics.attendanceAverage}%</span>
                      <span className="text-[#404040]/30 dark:text-[#52525b] mx-1">•</span>
                      <span className={`${getMetricColor(c.healthMetrics.homeworkAverage)} font-medium font-mono`}>BT: {c.healthMetrics.homeworkAverage}%</span>
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
                      {coverage.pct === null ? (
                        <span className="font-mono text-[#404040]/40 dark:text-[#52525b]" title="Lớp không có cảnh báo nào đang mở">--</span>
                      ) : (
                        <>
                          <span className={`font-bold font-mono ${getMetricColor(coverage.pct)}`}>{coverage.pct}%</span>
                          <p className="text-[11px] font-mono text-[#404040]/50 dark:text-[#71717a] mt-0.5">
                            {coverage.done}/{coverage.total} cảnh báo
                          </p>
                        </>
                      )}
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

      <div className="rounded-[16px] bg-white dark:bg-[#27272a] flex flex-col overflow-hidden">
        <SectionHeader
          icon={<BarChart3 className="w-4 h-4 text-[#db0829]" />}
          title="Bản Đồ Phân Bố Nhãn Theo Lớp (Label Distribution)"
          subtitle="So sánh tỷ lệ học viên Vàng / Đỏ / Xám giữa các lớp trong Khối · Hiện trạng hôm nay, KHÔNG lọc theo kỳ báo cáo đã chọn ở trên."
          right={<BarChart3 className="w-5 h-5 text-[#475569] dark:text-[#71717a]" />}
        />
        <div className="h-80 w-full p-5 pb-6">
          <ResponsiveContainer width="100%" height="100%" debounce={200}>
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

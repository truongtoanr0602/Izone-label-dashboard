import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, BarChart3, Search, Table2
} from 'lucide-react';
import type { ClassSummary } from '../../data/types';
import {
  periodLabel,
} from '../../data/selectors';
import { useUrlParam } from '../../hooks/useUrlParam';
import { ContextBar } from './ContextBar';
import { KpiRow } from './KpiRow';
import { SectionHeader } from './SectionHeader';
import { TrendChart, type TrendSeries } from './TrendChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardService } from '../../api/dashboardService';
import {
  toLeadClassPresentation,
  toLeadWeeklyTrendPoint,
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

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown,
  isDarkMode,
  khoiId,
}) => {
  const [searchClass, setSearchClass] = useState('');
  
  const [dashboard, setDashboard] = useState<LeadDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [urlPeriod, setSelectedPeriod] = useUrlParam('ky', 'current');
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const selectedPeriod = /^\d{4}-\d{2}$/.test(urlPeriod) ? urlPeriod : currentMonthKey;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await dashboardService.getLeadDashboard({
          khoiId,
          period: selectedPeriod,
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

  const view = useMemo(() => {
    if (!dashboard) {
      return {
        aggregate: { classCount: 0, activeStudents: 0, droppedStudents: 0, riskPct: null, classesWithTests: 0, attendanceAvg: null, homeworkAvg: null, passChuanRate: null, passMemRate: null },
        trendSeries: [],
        noDataStudents: 0
      };
    }

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
      trendSeries: dashboard.trend.map(toLeadWeeklyTrendPoint),
      noDataStudents: dashboard.labelDistribution.noData,
    };
  }, [dashboard]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu khối...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-center text-red-600">Không tải được dữ liệu khối. Vui lòng thử lại.</div>;
  }

  const contractClassIds = new Set(dashboard.classes.map((item) => item.classId));
  const contractClassById = new Map(dashboard.classes.map((item) => [item.classId, item]));
  const displayClasses = classes.filter((item) => contractClassIds.has(item.classId)).map((item) => {
    const contract = contractClassById.get(item.classId);
    if (!contract) return item;
    const presentation = toLeadClassPresentation(contract);
    return {
      ...item,
      studentCounts: { ...item.studentCounts, ...presentation.studentCounts },
      progress: presentation.progress,
      healthMetrics: {
        ...item.healthMetrics,
        ...presentation.healthMetrics,
      },
      labelDistribution: {
        ...item.labelDistribution,
        ...presentation.labelDistribution,
      },
      lastSyncedAt: presentation.lastSyncedAt ?? '',
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
    const quality = contractClassById.get(cls.classId)?.dataQuality;
    if (quality?.status === 'insufficient') {
      return { label: 'Chưa đủ dữ liệu', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
    }
    if (cls.healthMetrics.attendanceAverage === null || cls.healthMetrics.homeworkAverage === null) {
      return { label: 'Chưa đủ dữ liệu', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
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

  const formatMetric = (value: number | null) => value === null ? '—' : `${value}%`;
  const formatDataAsOf = (iso: string | null) => {
    if (!iso) return null;
    const [, month, day] = iso.split('-');
    return `${day}/${month}`;
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
        selectedKey={selectedPeriod}
        currentKey={dashboard.meta.currentAsOf.slice(0, 7)}
        onSelectPeriod={setSelectedPeriod}
        aggregate={view.aggregate}
        noDataStudents={view.noDataStudents}
        lastSyncedAt={dashboard.meta.dataFreshnessAt?.slice(0, 10) ?? dashboard.meta.currentAsOf}
      />

      {dashboard.meta.hasDataForPeriod ? (
        <>
          <KpiRow kpis={dashboard.kpis} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TrendChart
              title="Chất lượng vận hành"
              subtitle={`Điểm danh và BTVN toàn khối · ${view.trendSeries.length} tuần đến ${dashboard.meta.reportAsOf} · mỗi tuần chỉ tính lớp có dữ liệu trong 7 ngày, nên số lớp thấp hơn tổng số lớp đang chạy`}
              points={view.trendSeries}
              series={OPERATIONS_SERIES}
              domain={[70, 100]}
              isDarkMode={isDarkMode}
            />
            <TrendChart
              title="Kết quả"
              subtitle={`Pass chuẩn và pass mềm loại trừ toàn khối · ${view.trendSeries.length} tuần đến ${dashboard.meta.reportAsOf} · cả hai tỷ lệ tính trên học viên đã thi`}
              points={view.trendSeries}
              series={OUTCOME_SERIES}
              domain={[0, 100]}
              showTestCountInTooltip
              isDarkMode={isDarkMode}
            />
          </div>
        </>
      ) : (
        <div className="rounded-[16px] bg-white dark:bg-[#27272a] px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">
            Không có dữ liệu cho {periodLabel(selectedPeriod)}
          </p>
          <p className="mt-1 text-xs text-[#404040]/50 dark:text-[#71717a]">
            Bảng quản lý lớp bên dưới vẫn hiển thị hiện trạng mới nhất.
          </p>
        </div>
      )}

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
                <th className="py-3 px-4 text-center" title="Số HV cần cảnh báo đã được liên hệ trên tổng số HV cần cảnh báo, tại mốc test hiện tại của lớp">Độ phủ liên hệ</th>
                <th className="py-3 px-4 text-center" title="Hai tỷ lệ dùng chung mẫu số HV đã thi; tử số Pass chuẩn và Pass mềm không trùng nhau">Tỷ lệ Pass</th>
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
                  const contract = contractClassById.get(c.classId);
                  const coverage = contract?.contactCoverage ?? { done: 0, total: 0, pct: null };
                  const fallbackDates = contract?.dataQuality.status === 'fallback'
                    ? [
                        contract.dataQuality.attendanceAsOf,
                        contract.dataQuality.homeworkAsOf,
                        contract.dataQuality.passAsOf,
                        contract.dataQuality.progressAsOf,
                      ].filter((date): date is string => Boolean(date)).sort()
                    : [];
                  const fallbackAsOf = fallbackDates.at(0) ?? null;
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
                      <span className={`${getMetricColor(c.healthMetrics.attendanceAverage)} font-medium font-mono`}>ĐH: {formatMetric(c.healthMetrics.attendanceAverage)}</span>
                      <span className="text-[#404040]/30 dark:text-[#52525b] mx-1">•</span>
                      <span className={`${getMetricColor(c.healthMetrics.homeworkAverage)} font-medium font-mono`}>BT: {formatMetric(c.healthMetrics.homeworkAverage)}</span>
                      {fallbackAsOf && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                          Dữ liệu đến {formatDataAsOf(fallbackAsOf)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-[#404040] dark:text-[#e4e4e7]">
                        {c.progress.percentage === null ? '—' : `${c.progress.percentage}%`}
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] mx-auto mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress.percentage ?? 0}%` }} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${warning.color}`}>
                        {warning.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {coverage.pct === null ? (
                        <>
                          <span className="font-mono text-[#404040]/40 dark:text-[#52525b]">—</span>
                          <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5">Không có HV cần cảnh báo</p>
                        </>
                      ) : (
                        <>
                          <span className={`font-bold font-mono ${getMetricColor(coverage.pct)}`}>{coverage.pct}%</span>
                          <p className="text-[11px] font-mono text-[#404040]/50 dark:text-[#71717a] mt-0.5">
                            {coverage.done}/{coverage.total} HV cần cảnh báo
                          </p>
                        </>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <p className="font-mono text-[11px] text-[#404040]/60 dark:text-[#a1a1aa]">
                        Chuẩn <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMetric(c.healthMetrics.passChuanRate)}</span>
                      </p>
                      <p className="font-mono text-[11px] text-[#404040]/60 dark:text-[#a1a1aa] mt-0.5">
                        Mềm <span className="font-bold text-purple-600 dark:text-purple-400">{formatMetric(c.healthMetrics.passMemRate)}</span>
                      </p>
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

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, BarChart3, Search, Table2
} from 'lucide-react';
import type { ClassSummary, ContactLog } from '../../data/mockData';
import {
  MOCK_LABEL_CHANGES,
  MOCK_SNAPSHOTS,
  REFERENCE_DATE,
  getStudentsByClass,
} from '../../data/mockData';
import {
  aggregateKhoi,
  contactCoverage,
  currentCheckpoint,
  labelFlowDelta,
  labelFlowInPeriod,
  latestSnapshotPerClass,
  listPeriods,
  metricDelta,
  periodKeyOf,
  periodLabel,
  previousPeriodKey,
} from '../../data/selectors';
import { useUrlParam } from '../../hooks/useUrlParam';
import { ContextBar } from './ContextBar';
import { KpiRow, type KpiDeltas } from './KpiRow';
import { SectionHeader } from './SectionHeader';
import { TrendChart, type TrendPoint, type TrendSeries } from './TrendChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LeadDashboardProps {
  classes: ClassSummary[];
  onSelectClassAndDrillDown: (cls: ClassSummary) => void;
  isDarkMode: boolean;
  contactLogs: ContactLog[];
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

/**
 * Độ phủ liên hệ của một lớp tại mốc test đang mở của chính lớp đó.
 *
 * Mỗi lớp có mốc riêng — lớp mới khai giảng chưa thi bài nào, lớp cuối khóa đã
 * thi 5 bài — nên không thể dùng một checkpoint chung cho cả bảng.
 */
function coverageOf(classId: number, logs: ContactLog[]) {
  const students = getStudentsByClass(classId);
  return contactCoverage(students, logs, currentCheckpoint(students));
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({
  classes,
  onSelectClassAndDrillDown,
  isDarkMode,
  contactLogs,
}) => {
  const [searchClass, setSearchClass] = useState('');

  const periods = useMemo(() => listPeriods(MOCK_SNAPSHOTS), []);
  const defaultPeriod = periods[0]?.key ?? periodKeyOf(REFERENCE_DATE);
  const [urlPeriod, setSelectedPeriod] = useUrlParam('ky', defaultPeriod);

  /*
   * URL là đầu vào KHÔNG TIN CẬY. Nó vừa là cơ chế chia sẻ chính thức của màn
   * hình này (§4.3/§8.4 — thay cho xuất file) vừa là thứ người dùng sửa tay
   * được, nên một đường link cũ hoặc bị gõ sai là đầu vào BÌNH THƯỜNG, không
   * phải trường hợp ngoại lệ. `?ky=garbage` mà đi thẳng vào tầng selector sẽ
   * cho previousPeriodKey ra 'NaN-NaN' và thanh ngữ cảnh ghi "so với Tháng
   * NaN/NaN". Đối chiếu với danh sách kỳ có thật; sai thì lặng lẽ lùi về kỳ mặc
   * định và dọn luôn URL, KHÔNG ném lỗi giữa buổi họp.
   */
  const isKnownPeriod = periods.some((p) => p.key === urlPeriod);
  const selectedPeriod = isKnownPeriod ? urlPeriod : defaultPeriod;

  useEffect(() => {
    if (!isKnownPeriod) setSelectedPeriod(defaultPeriod);
  }, [isKnownPeriod, defaultPeriod, setSelectedPeriod]);

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
     * tuần đó. Mọi chỉ số giữ nguyên `null` khi tuần đó chưa tính được (chưa lớp
     * nào thi, hoặc không còn HV active) — KHÔNG ép về 0, xem chú thích của
     * TrendPoint.
     *
     * Cửa sổ 13 tuần neo vào CUỐI KỲ ĐANG XEM, không neo vào "bây giờ". Lead mở
     * Tháng 5 để kể chuyện tháng 5; nếu biểu đồ vẫn chạy tới tuần cuối cùng của
     * toàn bộ dữ liệu thì thẻ KPI nói tháng 5 còn đường biểu đồ nói tháng 7,
     * ngay cạnh nhau. Giữ độ dài 13 điểm tuần theo §6.2, chỉ đổi điểm kết thúc.
     * `endDate` lấy thẳng từ `listPeriods` để không tự tính lại ngày cuối tháng.
     */
    const periodEnd = periods.find((p) => p.key === selectedPeriod)?.endDate ?? '';
    const weeks = [...new Set(MOCK_SNAPSHOTS.map((s) => s.snapshotDate))]
      .sort()
      .filter((date) => date <= periodEnd)
      .slice(-13);

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
      trendSeries: khoiSeries,
      newClasses: [...currentIds].filter((id) => !previousIds.has(id)).length,
      endedClasses: [...previousIds].filter((id) => !currentIds.has(id)).length,
      noDataStudents,
    };
  }, [selectedPeriod, periods]);

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
        lastSyncedAt={REFERENCE_DATE}
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
          subtitle={`Tỷ lệ pass chuẩn và pass mềm toàn khối, ${view.trendSeries.length} tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi; hover để xem tuần đó tính trên mấy lớp.`}
          points={view.trendSeries}
          series={OUTCOME_SERIES}
          // Pass mềm chạm 94.4 trên dữ liệu hiện tại, nên [0,80] là con số ghi
          // một đằng vẽ một nẻo — recharts nới ra tới ~94 mà nhãn trục vẫn nói
          // 80. Dùng đúng dải thật của một tỷ lệ phần trăm.
          domain={[0, 100]}
          showTestCountInTooltip
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Layer 3: Master Class Table */}
      <div className="rounded-[16px] bg-white dark:bg-[#27272a] shadow-sm flex flex-col overflow-hidden">
        {/*
          Khối này vẫn đọc prop `classes` (trạng thái hiện tại), chưa nối vào
          bộ chọn kỳ — việc đó thuộc đợt 2. Cho tới lúc đó phải nói thẳng ra:
          nếu không, thanh ngữ cảnh ghi "6 lớp đang chạy" cho Tháng 5 trong khi
          bảng ngay dưới liệt kê 15 dòng, và người xem không biết tin số nào.
        */}
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
                <th className="py-3 px-4 text-center" title="Số cảnh báo GV đã xác nhận đã liên hệ, tại mốc test hiện tại của lớp">
                  Độ phủ liên hệ
                </th>
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
                  const coverage = coverageOf(c.classId, contactLogs);
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
                    {/*
                      Đây là thứ khiến cái tick "Đã liên hệ" có sức nặng: bản thân
                      nó là GV tự khai, nhưng việc KHÔNG liên hệ thì lộ ra thành một
                      con số trên bảng của Lead.
                    */}
                    <td className="py-3.5 px-4 text-center">
                      {coverage.pct === null ? (
                        // Lớp không có cảnh báo nào đang mở. KHÔNG hiện 0% — lớp khoẻ
                        // mạnh và lớp bỏ mặc toàn bộ cảnh báo phải trông khác nhau.
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

      {/* Layer 4: Stacked Bar Chart - Label Distribution */}
      <div className="rounded-[16px] bg-white dark:bg-[#27272a] flex flex-col overflow-hidden">
        {/* Cùng lý do như Master Table: chưa nối vào bộ chọn kỳ (đợt 2). */}
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

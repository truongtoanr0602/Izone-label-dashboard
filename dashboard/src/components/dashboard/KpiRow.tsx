import React from 'react';
import { Award, BookOpen, CheckCircle2, TrendingDown, UserCheck, UserMinus } from 'lucide-react';
import type { LeadDashboardResponse, DashboardMetric } from '../../api/dashboardContracts';
import type { MetricDelta } from '../../data/selectors';
import { KpiCard } from './KpiCard';
import { InfoTooltip } from '../common/InfoTooltip';
import { formatAttritionNote, formatReportingNote, formatTestNote } from './kpiFormat';

interface KpiRowProps {
  kpis: LeadDashboardResponse['kpis'];
}

function metricDelta(metric: Pick<DashboardMetric, 'delta' | 'comparableClasses' | 'totalClasses'>): MetricDelta {
  return {
    value: metric.delta,
    comparableClasses: metric.comparableClasses ?? 0,
    totalClasses: metric.totalClasses ?? 0,
  };
}

export const KpiRow: React.FC<KpiRowProps> = ({ kpis }) => {
  const netDelta: MetricDelta = {
    value: kpis.netMomentum.delta,
    comparableClasses: kpis.netMomentum.comparableClasses,
    totalClasses: kpis.netMomentum.totalClasses,
  };
  const flowNote = kpis.netMomentum.recalculationEvents === 0
    ? 'chưa có lượt tính lại nhãn nào trong tháng'
    : `${kpis.netMomentum.classesWithTests} lớp có chuyển dịch · ${kpis.netMomentum.recalculationEvents} lượt tính lại`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard
        icon={<UserCheck className="w-4 h-4" />}
        label="Điểm danh (TB)"
        value={kpis.attendanceAvg.value}
        unit="percent"
        delta={metricDelta(kpis.attendanceAvg)}
        higherIsBetter
        note={formatReportingNote({
          classesReported: kpis.attendanceAvg.classesReported ?? 0,
          totalClasses: kpis.attendanceAvg.totalClasses ?? 0,
          sampleSize: kpis.attendanceAvg.sampleSize ?? 0,
        })}
      />
      <KpiCard
        icon={<BookOpen className="w-4 h-4" />}
        label="Làm BTVN (TB)"
        value={kpis.homeworkAvg.value}
        unit="percent"
        delta={metricDelta(kpis.homeworkAvg)}
        higherIsBetter
        note={formatReportingNote({
          classesReported: kpis.homeworkAvg.classesReported ?? 0,
          totalClasses: kpis.homeworkAvg.totalClasses ?? 0,
          sampleSize: kpis.homeworkAvg.sampleSize ?? 0,
        })}
      />
      <KpiCard
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Pass chuẩn"
        value={kpis.passStandardRate.value}
        unit="percent"
        delta={metricDelta(kpis.passStandardRate)}
        higherIsBetter
        note={formatTestNote({
          classesWithTests: kpis.passStandardRate.classesWithTests ?? 0,
          totalClasses: kpis.passStandardRate.totalClasses ?? 0,
          sampleSize: kpis.passStandardRate.sampleSize ?? 0,
        })}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass chuẩn">
            Điểm danh ≥90% <b>VÀ</b> BTVN ≥90% <b>VÀ</b> TB test ≥60 — cả 3 điều kiện.
          </InfoTooltip>
        }
      />
      <KpiCard
        icon={<Award className="w-4 h-4" />}
        label="Pass mềm"
        value={kpis.softPassRate.value}
        unit="percent"
        delta={metricDelta(kpis.softPassRate)}
        higherIsBetter
        note={formatTestNote({
          classesWithTests: kpis.softPassRate.classesWithTests ?? 0,
          totalClasses: kpis.softPassRate.totalClasses ?? 0,
          sampleSize: kpis.softPassRate.sampleSize ?? 0,
        })}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass mềm">
            <b>Nhóm 1</b>: TB test 50–&lt;55, ĐH &amp; BTVN = 100% (cần GV duyệt)
            <br />
            <b>Nhóm 2</b>: TB test 55–&lt;60, ĐH &amp; BTVN ≥90% (cần GV duyệt)
            <br />
            <b>Nhóm 3</b>: TB test ≥60 (tự động đạt)
          </InfoTooltip>
        }
      />
      <KpiCard
        icon={<TrendingDown className="w-4 h-4" />}
        label="Net Momentum"
        value={kpis.netMomentum.value}
        unit="event"
        delta={netDelta}
        higherIsBetter
        note={flowNote}
      />
      <KpiCard
        icon={<UserMinus className="w-4 h-4" />}
        label="Bỏ học trong tháng"
        value={kpis.periodAttritionRate.newDroppedStudents}
        unit="count"
        delta={metricDelta(kpis.periodAttritionRate)}
        higherIsBetter={false}
        note={formatAttritionNote({
          rate: kpis.periodAttritionRate.attritionRate,
          newDroppedStudents: kpis.periodAttritionRate.newDroppedStudents,
        })}
      />
    </div>
  );
};

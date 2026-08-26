import React from 'react';
import { Award, BookOpen, CheckCircle2, UserCheck } from 'lucide-react';
import type { LeadDashboardResponse, DashboardMetric } from '../../api/dashboardContracts';
import type { MetricDelta } from '../../data/selectors';
import { KpiCard } from './KpiCard';
import { InfoTooltip } from '../common/InfoTooltip';
import { formatPassNote, formatReportingNote, passTooltipCopy } from './kpiFormat';

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
  const passCopy = passTooltipCopy();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        note={formatPassNote({
          qualifiedStudents: kpis.passStandardRate.qualifiedStudents ?? 0,
          classesWithTests: kpis.passStandardRate.classesWithTests ?? 0,
          totalClasses: kpis.passStandardRate.totalClasses ?? 0,
          sampleSize: kpis.passStandardRate.sampleSize ?? 0,
        })}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass chuẩn">
            {passCopy.standard}
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
        note={formatPassNote({
          qualifiedStudents: kpis.softPassRate.qualifiedStudents ?? 0,
          classesWithTests: kpis.softPassRate.classesWithTests ?? 0,
          totalClasses: kpis.softPassRate.totalClasses ?? 0,
          sampleSize: kpis.softPassRate.sampleSize ?? 0,
        })}
        infoTooltip={
          <InfoTooltip label="Cách tính Pass mềm">
            {passCopy.soft.map((line, index) => (
              <React.Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
            <br />Không bao gồm học viên đã đạt Pass chuẩn.
          </InfoTooltip>
        }
      />

    </div>
  );
};

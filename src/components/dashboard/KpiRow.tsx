import React from 'react';
import { Award, BookOpen, CheckCircle2, TrendingDown, UserCheck, UserMinus } from 'lucide-react';
import type { KhoiAggregate, LabelFlowSummary, MetricDelta } from '../../data/selectors';
import { KpiCard } from './KpiCard';

export interface KpiDeltas {
  attendance: MetricDelta;
  homework: MetricDelta;
  passChuan: MetricDelta;
  passMem: MetricDelta;
  dropped: MetricDelta;
  labelNet: MetricDelta;
}

/** `null` = tuần đó chưa xác định; sparkline sẽ ngắt tại đó, không vẽ tụt về 0. */
export interface KpiSparklines {
  attendance: (number | null)[];
  homework: (number | null)[];
  passChuan: (number | null)[];
  passMem: (number | null)[];
}

interface KpiRowProps {
  aggregate: KhoiAggregate;
  deltas: KpiDeltas;
  labelFlow: LabelFlowSummary;
  sparklines: KpiSparklines;
}

export const KpiRow: React.FC<KpiRowProps> = ({
  aggregate,
  deltas,
  labelFlow,
  sparklines,
}) => {
  const passNote =
    aggregate.classesWithTests === 0
      ? 'chưa lớp nào có bài test'
      : `trên ${aggregate.classesWithTests}/${aggregate.classCount} lớp đã có test`;

  const flowNote =
    labelFlow.recalcEvents === 0
      ? 'chưa có lượt tính lại nhãn nào trong kỳ'
      : `${labelFlow.classesWithTest} lớp có test · ${labelFlow.recalcEvents} lượt tính lại`;

  /*
   * Con số Bỏ học là LUỸ KẾ từ đầu khoá của các lớp trong kỳ, còn delta bên cạnh
   * là chênh lệch giữa hai tháng. Hai cơ sở tính khác nhau nằm sát nhau mà không
   * chú thích thì người đọc mặc định cả hai cùng là "trong tháng".
   */
  const droppedNote = `luỹ kế từ đầu khoá, trên ${aggregate.classCount} lớp của kỳ`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard
        icon={<UserCheck className="w-4 h-4" />}
        label="Điểm danh (TB)"
        value={aggregate.attendanceAvg}
        unit="percent"
        delta={deltas.attendance}
        higherIsBetter
        sparkline={sparklines.attendance}
      />
      <KpiCard
        icon={<BookOpen className="w-4 h-4" />}
        label="Làm BTVN (TB)"
        value={aggregate.homeworkAvg}
        unit="percent"
        delta={deltas.homework}
        higherIsBetter
        sparkline={sparklines.homework}
      />
      <KpiCard
        icon={<CheckCircle2 className="w-4 h-4" />}
        label="Pass chuẩn"
        value={aggregate.passChuanRate}
        unit="percent"
        delta={deltas.passChuan}
        higherIsBetter
        sparkline={sparklines.passChuan}
        note={passNote}
      />
      <KpiCard
        icon={<Award className="w-4 h-4" />}
        label="Pass mềm"
        value={aggregate.passMemRate}
        unit="percent"
        delta={deltas.passMem}
        higherIsBetter
        sparkline={sparklines.passMem}
        note={passNote}
      />
      <KpiCard
        icon={<TrendingDown className="w-4 h-4" />}
        label="Chuyển dịch nhãn"
        value={labelFlow.net}
        // Mỗi dòng trong bảng đổi nhãn là một LƯỢT, không phải một HV: một HV
        // đổi nhãn hai lần trong kỳ sinh hai dòng.
        unit="event"
        delta={deltas.labelNet}
        higherIsBetter
        note={flowNote}
      />
      <KpiCard
        icon={<UserMinus className="w-4 h-4" />}
        label="Bỏ học"
        value={aggregate.droppedStudents}
        unit="count"
        delta={deltas.dropped}
        higherIsBetter={false}
        note={droppedNote}
      />
    </div>
  );
};

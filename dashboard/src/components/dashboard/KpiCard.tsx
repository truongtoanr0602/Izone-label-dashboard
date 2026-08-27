import React from 'react';
import type { MetricDelta } from '../../data/selectors';
import { formatDelta, formatValue, type KpiUnit } from './kpiFormat';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: KpiUnit;
  delta: MetricDelta;
  /** true khi giá trị càng cao càng tốt (điểm danh); false khi ngược lại (bỏ học). */
  higherIsBetter: boolean;
  /** Mẫu số của giá trị KPI hiện tại. */
  note?: string;
  /** Icon giải thích cách tính, đặt cạnh label. Xem `InfoTooltip`. */
  infoTooltip?: React.ReactNode;
}

const TONE_CLASS: Record<string, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-red-600 dark:text-red-400',
  neutral: 'text-[#404040]/50 dark:text-[#71717a]',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  unit,
  delta,
  higherIsBetter,
  note,
  infoTooltip,
}) => {
  const formatted = formatDelta(delta, higherIsBetter, unit);
  const toneClass =
    formatted.isGood === null
      ? TONE_CLASS.neutral
      : formatted.isGood
        ? TONE_CLASS.up
        : TONE_CLASS.down;

  return (
    <div className="rounded-[16px] border border-[#f3f4f6] bg-white p-[20px] dark:border-[#3f3f46] dark:bg-[#27272a]">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
        {infoTooltip}
      </div>

      <div>
        <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7]">
          {formatValue(value, unit)}
        </span>
      </div>

      <p className={`mt-2 text-xs font-semibold ${toneClass}`}>
        So với tháng trước: {formatted.text}
      </p>
      {note !== undefined && (
        <p className="mt-1.5 text-[11px] text-[#404040]/50 dark:text-[#71717a]">
          {note}
        </p>
      )}
    </div>
  );
};

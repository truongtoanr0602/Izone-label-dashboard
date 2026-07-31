import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import type { MetricDelta } from '../../data/selectors';
import { formatComparisonNote, formatDelta, formatValue, type KpiUnit } from './kpiFormat';

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: KpiUnit;
  delta: MetricDelta;
  /** true khi giá trị càng cao càng tốt (điểm danh); false khi ngược lại (bỏ học). */
  higherIsBetter: boolean;
  /** Chuỗi 13 tuần cho sparkline nền. `null` = chưa xác định, đường sẽ ngắt. */
  sparkline?: (number | null)[];
  /**
   * Mẫu số của GIÁ TRỊ lớn. BỔ SUNG cho dòng mẫu số của delta chứ không thay thế
   * nó: hai con số trên thẻ được tính trên hai tập lớp khác nhau (giá trị trên
   * mọi lớp của kỳ, delta chỉ trên lớp so sánh được), nên mỗi con số phải mang
   * mẫu số của chính nó — §3.3.
   */
  note?: string;
}

const TONE_CLASS: Record<string, string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-[#DB0829] dark:text-red-400',
  neutral: 'text-[#404040]/50 dark:text-[#71717a]',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  unit,
  delta,
  higherIsBetter,
  sparkline,
  note,
}) => {
  const formatted = formatDelta(delta, higherIsBetter, unit);
  const toneClass =
    formatted.isGood === null
      ? TONE_CLASS.neutral
      : formatted.isGood
        ? TONE_CLASS.up
        : TONE_CLASS.down;

  const sparkData = (sparkline ?? []).map((v, i) => ({ i, v }));

  return (
    <div className="relative rounded-[16px] p-[24px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] overflow-hidden">
      {sparkData.length > 1 && (
        // `stroke` là SVG attribute thuần, class `dark:` không gắn được vào nó — nên
        // đặt màu trên div bọc ngoài rồi dùng `currentColor` để recharts kế thừa đúng
        // theme, thay vì hardcode một hex duy nhất khiến sparkline biến mất ở dark mode.
        <div className="absolute inset-x-0 bottom-0 h-10 opacity-[0.18] pointer-events-none text-[#475569] dark:text-[#a1a1aa]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="v" stroke="currentColor" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="relative flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
      </div>

      <div className="relative flex items-baseline gap-2">
        <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7]">
          {formatValue(value, unit)}
        </span>
        <span className={`text-xs font-semibold font-mono ${toneClass}`}>{formatted.text}</span>
      </div>

      {/*
        Hai dòng mẫu số riêng biệt khi có `note`: dòng trên thuộc về con số lớn,
        dòng dưới (mờ hơn, thụt vào sau dấu ▲/▼) thuộc về delta bên cạnh con số.
      */}
      {note !== undefined && (
        <p className="relative text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
          {note}
        </p>
      )}
      <p
        className={`relative text-[10px] text-[#404040]/50 dark:text-[#71717a] ${
          note !== undefined ? 'mt-0.5 opacity-70' : 'mt-1.5'
        }`}
      >
        {formatComparisonNote(delta)}
      </p>
    </div>
  );
};

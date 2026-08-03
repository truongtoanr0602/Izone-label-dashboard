import React from 'react';
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
}) => {
  const formatted = formatDelta(delta, higherIsBetter, unit);
  const toneClass =
    formatted.isGood === null
      ? TONE_CLASS.neutral
      : formatted.isGood
        ? TONE_CLASS.up
        : TONE_CLASS.down;

  return (
    <div className="rounded-[16px] p-[24px] bg-white dark:bg-[#27272a] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#475569] dark:text-[#a1a1aa]">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold font-mono text-[#404040] dark:text-[#e4e4e7]">
          {formatValue(value, unit)}
        </span>
        <span className={`text-xs font-semibold font-mono ${toneClass}`}>{formatted.text}</span>
      </div>

      {/*
        Hai dòng mẫu số riêng biệt khi có `note`: dòng trên thuộc về con số lớn,
        dòng dưới thuộc về delta. Phân biệt bằng CÂU CHỮ chứ không bằng kiểu
        dáng — `formatComparisonNote` luôn mở đầu bằng "thay đổi". Cố ý không làm
        dòng dưới mờ đi: đây chính là dòng cần đọc được, hạ tương phản ở cỡ 10px
        là xoá nó khỏi màn hình.
      */}
      {note !== undefined && (
        <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
          {note}
        </p>
      )}
      <p
        className={`text-[10px] text-[#404040]/50 dark:text-[#71717a] ${
          note !== undefined ? 'mt-0.5' : 'mt-1.5'
        }`}
      >
        {formatComparisonNote(delta)}
      </p>
    </div>
  );
};

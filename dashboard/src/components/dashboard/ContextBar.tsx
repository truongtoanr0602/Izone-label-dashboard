import React from 'react';
import { CalendarRange, Database } from 'lucide-react';
import type { KhoiAggregate, Period } from '../../data/selectors';
import { periodLabel, previousPeriodKey } from '../../data/selectors';

interface ContextBarProps {
  periods: Period[];
  selectedKey: string;
  onSelectPeriod: (key: string) => void;
  aggregate: KhoiAggregate;
  noDataStudents: number;
  lastSyncedAt: string;
}

export const ContextBar: React.FC<ContextBarProps> = ({
  periods,
  selectedKey,
  onSelectPeriod,
  aggregate,
  noDataStudents,
  lastSyncedAt,
}) => {
  /*
   * Không có HV active nào thì tỷ lệ này KHÔNG tính được — trả null để hiện gạch
   * ngang, không hiện 0% (0% nghĩa là "đã kiểm và không ai thiếu dữ liệu", trái
   * hẳn với "không có gì để kiểm").
   */
  const noDataPct: number | null =
    aggregate.activeStudents === 0
      ? null
      : Math.round((noDataStudents / aggregate.activeStudents) * 100);

  return (
    <div className="rounded-[16px] bg-white dark:bg-[#27272a] px-5 py-4 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-[#db0829]" />
          <span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
            Kỳ báo cáo
          </span>
        </div>
        <select
          aria-label="Kỳ báo cáo"
          value={selectedKey}
          onChange={(e) => onSelectPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-sm font-semibold text-[#404040] dark:text-[#e4e4e7] outline-none focus:ring-1 focus:ring-[#DB0829] transition-colors"
        >
          {periods.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
          so với {periodLabel(previousPeriodKey(selectedKey))}
        </span>
      </div>

      <p className="text-xs text-[#404040]/70 dark:text-[#a1a1aa] font-mono">
        Khối 3-4 · {aggregate.classCount} lớp đang chạy · {aggregate.activeStudents} HV active
      </p>

      <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] flex items-center gap-1.5">
        <Database className="w-3 h-3" />
        {/*
          Nói rõ đây là mốc đồng bộ của NGUỒN DỮ LIỆU, không phải mốc của kỳ đang
          xem: khi Lead chọn Tháng 5 mà dòng này ghi trống trơn "2026-07-31" thì
          rất dễ đọc nhầm thành ngày chốt số của kỳ.
        */}
        Dữ liệu đồng bộ đến {lastSyncedAt} (áp dụng cho mọi kỳ)
        {noDataStudents > 0 && (
          <span className="text-amber-600 dark:text-amber-400">
            · {noDataStudents} HV chưa đủ dữ liệu ({noDataPct === null ? '—' : `${noDataPct}%`})
          </span>
        )}
      </p>
    </div>
  );
};

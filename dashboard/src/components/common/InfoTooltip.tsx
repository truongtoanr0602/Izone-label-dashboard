import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  /** aria-label cho icon — mô tả tooltip nói về cái gì, vd "Cách tính Pass chuẩn". */
  label: string;
  children: React.ReactNode;
}

/**
 * Popover giải thích ngắn, mở bằng bấm/chạm (không phải hover) vì dashboard có
 * chế độ mobile drawer nơi hover không tồn tại. Dùng <details>/<summary> gốc
 * thay vì tự quản state: có sẵn hỗ trợ bàn phím (Enter/Space khi summary
 * focus) và screen reader, không cần logic click-outside.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({ label, children }) => (
  <details className="relative inline-block">
    <summary
      aria-label={label}
      className="list-none cursor-help inline-flex items-center align-middle [&::-webkit-details-marker]:hidden"
    >
      <Info className="w-3 h-3 text-[#404040]/40 dark:text-[#71717a] hover:text-[#404040] dark:hover:text-[#e4e4e7] transition-colors" />
    </summary>
    <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded-[8px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] p-3 text-[11px] font-normal normal-case leading-relaxed text-[#404040] dark:text-[#e4e4e7] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  </details>
);

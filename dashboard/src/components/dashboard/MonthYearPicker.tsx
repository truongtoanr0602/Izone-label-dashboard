import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { periodLabel } from '../../data/selectors';
import { buildMonthGrid } from './monthYearPickerModel';

interface MonthYearPickerProps {
  selectedKey: string;
  currentKey: string;
  onSelect: (key: string) => void;
  compact?: boolean;
  align?: 'left' | 'right';
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedKey,
  currentKey,
  onSelect,
  compact = false,
  align = 'left',
}) => {
  const selectedYear = Number(selectedKey.slice(0, 4));
  const currentYear = Number(currentKey.slice(0, 4));
  const [isOpen, setIsOpen] = useState(false);
  const dialogId = useId();
  const [visibleYear, setVisibleYear] = useState(selectedYear);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const months = useMemo(
    () => buildMonthGrid(visibleYear, selectedKey, currentKey),
    [currentKey, selectedKey, visibleYear],
  );

  useEffect(() => {
    if (!isOpen) setVisibleYear(selectedYear);
  }, [isOpen, selectedYear]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={dialogId}
        onClick={() => {
          setVisibleYear(selectedYear);
          setIsOpen((open) => !open);
        }}
        className={`inline-flex items-center justify-between gap-2 rounded-[8px] border border-[#e5e7eb] bg-white font-semibold text-[#404040] outline-none transition-colors hover:bg-[#f9fafb] focus:ring-2 focus:ring-[#DB0829]/30 dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#e4e4e7] dark:hover:bg-[#3f3f46] ${compact ? 'min-w-32 px-2.5 py-1.5 text-xs' : 'min-w-36 px-3 py-2 text-sm'}`}
      >
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#db0829]" />
          {periodLabel(selectedKey)}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id={dialogId}
          role="dialog"
          aria-label="Chọn tháng và năm báo cáo"
          className={`absolute top-full z-50 mt-2 w-72 rounded-[16px] border border-[#e5e7eb] bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.18)] dark:border-[#3f3f46] dark:bg-[#27272a] ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label={`Xem năm ${visibleYear - 1}`}
              onClick={() => setVisibleYear((year) => year - 1)}
              className="rounded-[8px] p-2 text-[#404040]/60 hover:bg-[#f3f4f6] dark:text-[#a1a1aa] dark:hover:bg-[#3f3f46]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7]">
              Năm {visibleYear}
            </span>
            <button
              type="button"
              aria-label={`Xem năm ${visibleYear + 1}`}
              disabled={visibleYear >= currentYear}
              onClick={() => setVisibleYear((year) => year + 1)}
              className="rounded-[8px] p-2 text-[#404040]/60 hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-25 dark:text-[#a1a1aa] dark:hover:bg-[#3f3f46]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <button
                key={month.key}
                type="button"
                aria-pressed={month.selected}
                disabled={month.disabled}
                onClick={() => {
                  onSelect(month.key);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={`rounded-[8px] px-2 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
                  month.selected
                    ? 'bg-[#DB0829] text-white'
                    : 'text-[#404040] hover:bg-[#f3f4f6] dark:text-[#e4e4e7] dark:hover:bg-[#3f3f46]'
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Download, Menu, Moon, Sun } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface HeaderProps {
  classes: ClassSummary[];
  selectedClass: ClassSummary;
  onSelectClass: (cls: ClassSummary) => void;
  onOpenMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classes,
  selectedClass,
  onSelectClass,
  onOpenMobileMenu,
  isDarkMode,
  onToggleDarkMode,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const classMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClassMenuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (classMenuRef.current && !classMenuRef.current.contains(e.target as Node)) {
        setIsClassMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsClassMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClassMenuOpen]);

  return (
    <header className="w-full flex-shrink-0 z-10 border-b border-[#f3f4f6] dark:border-[#3f3f46] px-6 py-3.5 transition-all bg-white dark:bg-[#27272a]">
      <div className="flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenMobileMenu?.();
                onToggleSidebar();
              }}
              className="p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
              title={isSidebarCollapsed ? 'Hiện sidebar' : 'Ẩn sidebar'}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs font-bold tracking-widest text-[#DB0829] uppercase">
                IZONE PORTAL
              </span>
              <h1 className="hidden md:block text-lg font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight leading-none">
                Student Labeling & Warning
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Class Selector & Status */}
        <div className="flex items-center gap-4">
          {/* Class Dropdown */}
          <div className="relative hidden md:block" ref={classMenuRef}>
            <button
              type="button"
              onClick={() => setIsClassMenuOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isClassMenuOpen}
              className="flex items-center gap-2 bg-[#f3f4f6] dark:bg-[#18181b] hover:bg-[#e5e7eb] dark:hover:bg-[#3f3f46] px-3.5 py-1.5 rounded-[12px] border border-[#f3f4f6] dark:border-[#3f3f46] cursor-pointer transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-[#DB0829] animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] uppercase text-[#404040]/50 dark:text-[#71717a] font-semibold leading-none">Lớp đang chọn</p>
                <p className="text-xs font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-1">
                  {selectedClass.className} — {selectedClass.teacher.fullName}
                  <ChevronDown className={`w-3.5 h-3.5 text-[#404040]/50 dark:text-[#71717a] transition-transform ${isClassMenuOpen ? 'rotate-180' : ''}`} />
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isClassMenuOpen && (
              <div
                role="listbox"
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-[#404040]/50 dark:text-[#71717a] tracking-wider">
                  Khối 3-4 (Active Classes)
                </p>
                <div className="space-y-1 mt-1">
                  {classes.map((cls) => (
                    <button
                      key={cls.classId}
                      role="option"
                      aria-selected={selectedClass.classId === cls.classId}
                      onClick={() => {
                        onSelectClass(cls);
                        setIsClassMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-[8px] text-xs transition-all flex items-center justify-between border-l-2 ${
                        selectedClass.classId === cls.classId
                          ? 'bg-[#f3f4f6] dark:bg-[#3f3f46] border-l-[#db0829] text-[#404040] dark:text-[#e4e4e7] font-semibold'
                          : 'border-l-transparent text-[#404040] dark:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46]'
                      }`}
                    >
                      <div>
                        <span className="font-bold font-mono">{cls.className}</span>
                        <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a]">{cls.teacher.fullName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cls.healthMetrics.classRiskLevel === 'high'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : cls.healthMetrics.classRiskLevel === 'medium'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          Score: {cls.healthMetrics.healthScore}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="p-2 rounded-[8px] border border-[#f3f4f6] dark:border-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-all"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs text-[#404040]/70 dark:text-[#a1a1aa] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-all">
              <Download className="w-3.5 h-3.5" />
              Export Dữ Liệu
            </button>
            
            <a
              href={selectedClass.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] hover:bg-[#e5e7eb] dark:hover:bg-[#52525b] text-[#404040]/70 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] transition-all border border-[#f3f4f6] dark:border-[#3f3f46]"
              title="Mở trên Portal IZONE"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};


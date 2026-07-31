import React from 'react';
import { RefreshCw, ChevronDown, ExternalLink, Download, Menu, Moon, Sun, BarChart3, Users } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';

interface HeaderProps {
  classes: ClassSummary[];
  selectedClass: ClassSummary;
  onSelectClass: (cls: ClassSummary) => void;
  activeTab: 'lead' | 'teacher';
  onChangeTab: (tab: 'lead' | 'teacher') => void;
  onOpenMobileMenu?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classes,
  selectedClass,
  onSelectClass,
  activeTab,
  onChangeTab,
  onOpenMobileMenu,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="w-full flex-shrink-0 z-10 border-b border-[#f3f4f6] dark:border-[#3f3f46] px-6 py-3.5 transition-all bg-white dark:bg-[#27272a]">
      <div className="flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            {onOpenMobileMenu && (
              <button 
                onClick={onOpenMobileMenu}
                className="xl:hidden p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <div>
              <span className="text-xs font-bold tracking-widest text-[#DB0829] uppercase">
                IZONE PORTAL
              </span>
              <h1 className="hidden md:flex text-lg font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight leading-none items-center gap-2">
                Student Labeling & Warning
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] font-mono font-normal border border-[#f3f4f6] dark:border-[#3f3f46]">
                  v3.1 Refactored
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex flex-wrap items-center gap-1 bg-[#f3f4f6] dark:bg-[#18181b] p-1 rounded-[12px] border border-[#f3f4f6] dark:border-[#3f3f46]">
            <button
              onClick={() => onChangeTab('lead')}
              className={`px-4 py-1.5 rounded-[8px] text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                activeTab === 'lead'
                  ? 'bg-[#DB0829] text-white'
                  : 'text-[#404040]/70 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-white dark:hover:bg-[#27272a]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Lead Khối (Macro View)
            </button>
            <button
              onClick={() => onChangeTab('teacher')}
              className={`px-4 py-1.5 rounded-[8px] text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'teacher'
                  ? 'bg-[#DB0829] text-white'
                  : 'text-[#404040]/70 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-white dark:hover:bg-[#27272a]'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Teacher Dashboard
              <span className="px-1.5 py-0.2 rounded-full bg-white dark:bg-[#3f3f46] text-[10px] text-[#404040]/70 dark:text-[#a1a1aa] font-mono">
                {selectedClass.className}
              </span>
            </button>
          </nav>
        </div>

        {/* Right: Class Selector & Status */}
        <div className="flex items-center gap-4">
          {/* Class Dropdown */}
          <div className="relative group hidden md:block">
            <div className="flex items-center gap-2 bg-[#f3f4f6] dark:bg-[#18181b] hover:bg-[#e5e7eb] dark:hover:bg-[#3f3f46] px-3.5 py-1.5 rounded-[12px] border border-[#f3f4f6] dark:border-[#3f3f46] cursor-pointer transition-all">
              <div className="w-2 h-2 rounded-full bg-[#DB0829] animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] uppercase text-[#404040]/50 dark:text-[#71717a] font-semibold leading-none">Lớp đang chọn</p>
                <p className="text-xs font-bold text-[#404040] dark:text-[#e4e4e7] flex items-center gap-1">
                  {selectedClass.className} — {selectedClass.teacher.fullName}
                  <ChevronDown className="w-3.5 h-3.5 text-[#404040]/50 dark:text-[#71717a]" />
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-[#404040]/50 dark:text-[#71717a] tracking-wider">
                Khối 3-4 (Active Classes)
              </p>
              <div className="space-y-1 mt-1">
                {classes.map((cls) => (
                  <button
                    key={cls.classId}
                    onClick={() => onSelectClass(cls)}
                    className={`w-full text-left px-3 py-2 rounded-[8px] text-xs transition-all flex items-center justify-between ${
                      selectedClass.classId === cls.classId
                        ? 'bg-[#DB0829]/10 text-[#DB0829] border border-[#DB0829]/30 font-semibold'
                        : 'text-[#404040] dark:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46]'
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
          </div>

          {/* Sync Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Sync: <b className="text-[#404040] dark:text-[#e4e4e7]">10:00 AM</b></span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20">
              n8n Live
            </span>
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


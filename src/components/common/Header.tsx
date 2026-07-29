import React from 'react';
import { RefreshCw, ChevronDown, ExternalLink, Download, Menu, Moon, Sun } from 'lucide-react';
import type { ClassSummary } from '../../data/mockData';
import IzoneLogo from '../../images/logo.png';

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
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 px-6 py-3.5 transition-all bg-white/90 dark:bg-slate-900/90">
      <div className="flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            {onOpenMobileMenu && (
              <button 
                onClick={onOpenMobileMenu}
                className="xl:hidden p-2 -ml-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div className="h-9 w-auto flex items-center justify-center shrink-0">
              <img src={IzoneLogo} alt="IZONE Logo" className="h-full w-auto object-contain drop-shadow-md" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-[#DB0829] uppercase">
                IZONE PORTAL
              </span>
              <h1 className="hidden md:flex text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none items-center gap-2">
                Student Labeling & Warning
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-normal border border-slate-200 dark:border-slate-700">
                  v3.1 Refactored
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onChangeTab('lead')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'lead'
                  ? 'bg-[#DB0829] text-white shadow-md shadow-[#DB0829]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'
              }`}
            >
              📊 Lead Khối (Macro View)
            </button>
            <button
              onClick={() => onChangeTab('teacher')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'teacher'
                  ? 'bg-[#DB0829] text-white shadow-md shadow-[#DB0829]/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50'
              }`}
            >
              👩‍🏫 Teacher Dashboard
              <span className="px-1.5 py-0.2 rounded-full bg-white dark:bg-slate-800/80 text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                {selectedClass.className}
              </span>
            </button>
          </nav>
        </div>

        {/* Right: Class Selector & Status */}
        <div className="flex items-center gap-4">
          {/* Class Dropdown */}
          <div className="relative group hidden md:block">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700/80 cursor-pointer transition-all">
              <div className="w-2 h-2 rounded-full bg-[#DB0829] animate-pulse" />
              <div className="text-left">
                <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-semibold leading-none">Lớp đang chọn</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  {selectedClass.className} — {selectedClass.teacher.fullName}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Khối 3-4 (Active Classes)
              </p>
              <div className="space-y-1 mt-1">
                {classes.map((cls) => (
                  <button
                    key={cls.classId}
                    onClick={() => onSelectClass(cls)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      selectedClass.classId === cls.classId
                        ? 'bg-[#DB0829]/10 text-[#DB0829] border border-[#DB0829]/30 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold font-mono">{cls.className}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{cls.teacher.fullName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cls.healthMetrics.classRiskLevel === 'high'
                          ? 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20'
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
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Sync: <b className="text-slate-800 dark:text-slate-200">10:00 AM</b></span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20">
              n8n Live
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-all">
              <Download className="w-3.5 h-3.5" />
              Export Dữ Liệu
            </button>
            
            <a
              href={selectedClass.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80"
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


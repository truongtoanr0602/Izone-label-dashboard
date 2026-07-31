import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { TopRibbon } from './components/dashboard/TopRibbon';
import { StudentTable } from './components/dashboard/StudentTable';
import { LeadDashboard } from './components/dashboard/LeadDashboard';
import { CallParentModal } from './components/modals/CallParentModal';
import { ZaloRemindModal } from './components/modals/ZaloRemindModal';
import { MOCK_CLASSES, MOCK_STUDENTS_IC2174 } from './data/mockData';
import type { ClassSummary } from './data/mockData';
import { ShieldCheck, LayoutDashboard, Users, X, CheckCircle, BookOpen, Award, AlertTriangle, MessageSquare } from 'lucide-react';
import IzoneLogo from './images/logo.png';

export default function App() {
  const [classes] = useState<ClassSummary[]>(MOCK_CLASSES);
  const [selectedClass, setSelectedClass] = useState<ClassSummary>(MOCK_CLASSES[0]); // IC2174
  const [students] = useState(MOCK_STUDENTS_IC2174);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'lead' | 'teacher'>('lead');
  const [tableFilter, setTableFilter] = useState<'all' | 'urgent' | 'pass' | 'review'>('all');

  // Modal states
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isZaloModalOpen, setIsZaloModalOpen] = useState(false);

  const handleDrillDownToClass = (cls: ClassSummary) => {
    setSelectedClass(cls);
    setActiveTab('teacher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync dark mode class with HTML element for globals
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} flex h-screen w-full overflow-hidden bg-[#f3f4f6] dark:bg-[#18181b] text-[#404040] dark:text-[#e4e4e7] font-sans selection:bg-[#DB0829]/30 selection:text-white transition-colors duration-300`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[50] xl:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7] p-5 space-y-6 transform transition-transform duration-300 xl:relative xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Logo / Header in Sidebar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto flex items-center justify-center shrink-0">
              <img src={IzoneLogo} alt="IZONE Logo" className={`h-full w-auto object-contain ${isDarkMode ? 'brightness-0 invert opacity-90' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,1)]'}`} />
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="xl:hidden p-1.5 rounded-[8px] bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040] dark:text-[#e4e4e7] hover:text-[#404040]/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#404040]/50 dark:text-[#a1a1aa] mb-2">Chức năng chính</p>
          <button
            onClick={() => {
              setActiveTab('lead');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs transition-all ${activeTab === 'lead'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-100 font-medium border-l-4 border-[#db0829]'
                : 'font-bold text-[#404040]/70 dark:text-[#a1a1aa] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Lead Khối Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('teacher');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs transition-all ${activeTab === 'teacher'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-100 font-medium border-l-4 border-[#db0829]'
                : 'font-bold text-[#404040]/70 dark:text-[#a1a1aa] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
              }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Lớp: {selectedClass.className}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Lớp Overview Widget */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-[#404040]/50 dark:text-[#a1a1aa] uppercase border-b border-[#f3f4f6] dark:border-[#3f3f46] pb-2">
            Tổng quan lớp
          </h3>

          <div className="flex flex-col gap-4">
            {/* Điểm danh */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Điểm danh</span>
                </div>
                <span className={`font-semibold text-sm ${selectedClass.healthMetrics.attendanceAverage >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.attendanceAverage >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                  {selectedClass.healthMetrics.attendanceAverage}%
                </span>
              </div>
              <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                <div className={`h-full ${selectedClass.healthMetrics.attendanceAverage >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.attendanceAverage >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.attendanceAverage}%` }} />
              </div>
            </div>

            {/* BTVN */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]">
                  <BookOpen className="w-4 h-4" />
                  <span>BTVN</span>
                </div>
                <span className={`font-semibold text-sm ${selectedClass.healthMetrics.homeworkAverage >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.homeworkAverage >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                  {selectedClass.healthMetrics.homeworkAverage}%
                </span>
              </div>
              <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                <div className={`h-full ${selectedClass.healthMetrics.homeworkAverage >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.homeworkAverage >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.homeworkAverage}%` }} />
              </div>
            </div>

            {/* Pass/Fail (Pass Chuẩn) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]">
                  <Award className="w-4 h-4" />
                  <span>Tỷ lệ Pass</span>
                </div>
                <span className={`font-semibold text-sm ${selectedClass.healthMetrics.passChuanRate >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.passChuanRate >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                  {selectedClass.healthMetrics.passChuanRate}%
                </span>
              </div>
              <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                <div className={`h-full ${selectedClass.healthMetrics.passChuanRate >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.passChuanRate >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.passChuanRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* System Info Box */}
        <div className="mt-auto p-3.5 rounded-[16px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] text-[11px] text-[#404040]/60 dark:text-[#a1a1aa] space-y-2">
          <div className="flex items-center gap-2 font-semibold text-[#404040] dark:text-[#e4e4e7]">
            <ShieldCheck className="w-4 h-4 text-[#DB0829]" />
            <span>Kiến trúc Hybrid CQRS</span>
          </div>
          <p className="leading-relaxed">
            Dữ liệu được làm giàu tĩnh trên Sheet <code>02_DuLieu_HocVien</code> giúp tốc độ phản hồi &lt;500ms.
          </p>
          <div className="pt-2 border-t border-[#404040]/10 dark:border-[#3f3f46] flex items-center justify-between font-mono text-[10px]">
            <span>n8n Webhook: <b>Active</b></span>
            <span className="text-emerald-500">● Live</span>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <Header
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={(cls) => setSelectedClass(cls)}
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {activeTab === 'lead' && (
            <LeadDashboard
              classes={classes}
              onSelectClassAndDrillDown={handleDrillDownToClass}
            />
          )}

          {activeTab === 'teacher' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Class Title & Info Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#27272a] p-5 rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46]">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-lg md:text-xl font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#475569] dark:text-[#a1a1aa]" /> Lớp {selectedClass.className} — {selectedClass.courseName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#DB0829]/10 text-[#DB0829] border border-[#DB0829]/20 w-fit">
                      On-going (Buổi {selectedClass.progress.completedSessions}/{selectedClass.progress.totalSessions})
                    </span>
                  </div>
                  <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex flex-wrap items-center gap-4">
                    <span>GVCN: <b className="text-[#404040] dark:text-[#e4e4e7]">{selectedClass.teacher.fullName}</b></span>
                    <span>•</span>
                    <span>Lịch học: <b className="text-[#404040] dark:text-[#e4e4e7]">{selectedClass.schedule}</b></span>
                    <span>•</span>
                    <span>Sĩ số: <b className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedClass.studentCounts.active} Active</b> / {selectedClass.studentCounts.totalEnrolled} Tổng</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="px-3.5 py-2 rounded-[8px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-bold text-xs transition-all hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Gọi gấp (3)
                  </button>
                  <button
                    onClick={() => setIsZaloModalOpen(true)}
                    className="px-3.5 py-2 rounded-[8px] bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 font-bold text-xs transition-all hover:bg-orange-100 dark:hover:bg-orange-900/40 active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Nhắc Zalo (5)
                  </button>
                </div>
              </div>

              {/* Top Ribbon (30-Second Intervention Cards) */}
              <TopRibbon
                selectedClass={selectedClass}
                onOpenCallModal={() => setIsCallModalOpen(true)}
                onOpenZaloModal={() => setIsZaloModalOpen(true)}
                onFilterUrgent={() => setTableFilter('urgent')}
              />

              {/* Student Table */}
              <StudentTable
                students={students}
                onOpenCallModal={() => setIsCallModalOpen(true)}
                onOpenZaloModal={() => setIsZaloModalOpen(true)}
                activeFilter={tableFilter}
                onChangeFilter={(f) => setTableFilter(f)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <CallParentModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        students={students}
        className={selectedClass.className}
        teacherName={selectedClass.teacher.fullName}
      />
      <ZaloRemindModal
        isOpen={isZaloModalOpen}
        onClose={() => setIsZaloModalOpen(false)}
        students={students}
        className={selectedClass.className}
        teacherName={selectedClass.teacher.fullName}
      />
    </div>
  );
}

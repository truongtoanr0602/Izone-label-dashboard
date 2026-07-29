import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { TopRibbon } from './components/dashboard/TopRibbon';
import { StudentTable } from './components/dashboard/StudentTable';
import { LeadDashboard } from './components/dashboard/LeadDashboard';
import { CallParentModal } from './components/modals/CallParentModal';
import { ZaloRemindModal } from './components/modals/ZaloRemindModal';
import { MOCK_CLASSES, MOCK_STUDENTS_IC2174 } from './data/mockData';
import type { ClassSummary } from './data/mockData';
import { ShieldCheck, HeartPulse, LayoutDashboard, Users, X, CheckCircle, BookOpen, Award } from 'lucide-react';
import IzoneLogo from './images/logo.png';

export default function App() {
  const [classes] = useState<ClassSummary[]>(MOCK_CLASSES);
  const [selectedClass, setSelectedClass] = useState<ClassSummary>(MOCK_CLASSES[0]); // IC2174
  const [students] = useState(MOCK_STUDENTS_IC2174);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
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
    <div className={`${isDarkMode ? 'dark' : ''} flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-[#DB0829]/30 selection:text-white transition-colors duration-300`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[50] xl:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-slate-800 bg-slate-900 text-slate-300 p-5 space-y-6 transform transition-transform duration-300 xl:relative xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Logo / Header in Sidebar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto flex items-center justify-center shrink-0">
              <img src={IzoneLogo} alt="IZONE Logo" className="h-full w-auto object-contain brightness-0 invert opacity-90" />
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="xl:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Chức năng chính</p>
            <button
              onClick={() => {
                setActiveTab('lead');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'lead'
                  ? 'bg-[#DB0829] text-white shadow-lg shadow-[#DB0829]/25'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-[#DB0829] text-white shadow-lg shadow-[#DB0829]/25'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
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
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-700/50 pb-2">
              Tổng quan lớp
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Điểm danh */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4" />
                    <span>Điểm danh</span>
                  </div>
                  <span className={`font-semibold text-sm ${selectedClass.healthMetrics.attendanceAverage >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.attendanceAverage >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                    {selectedClass.healthMetrics.attendanceAverage}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedClass.healthMetrics.attendanceAverage >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.attendanceAverage >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.attendanceAverage}%` }} />
                </div>
              </div>

              {/* BTVN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-300">
                    <BookOpen className="w-4 h-4" />
                    <span>BTVN</span>
                  </div>
                  <span className={`font-semibold text-sm ${selectedClass.healthMetrics.homeworkAverage >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.homeworkAverage >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                    {selectedClass.healthMetrics.homeworkAverage}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedClass.healthMetrics.homeworkAverage >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.homeworkAverage >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.homeworkAverage}%` }} />
                </div>
              </div>

              {/* Pass/Fail (Pass Chuẩn) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-300">
                    <Award className="w-4 h-4" />
                    <span>Tỷ lệ Pass</span>
                  </div>
                  <span className={`font-semibold text-sm ${selectedClass.healthMetrics.passChuanRate >= 80 ? 'text-emerald-500' : selectedClass.healthMetrics.passChuanRate >= 70 ? 'text-amber-500' : 'text-[#DB0829]'}`}>
                    {selectedClass.healthMetrics.passChuanRate}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${selectedClass.healthMetrics.passChuanRate >= 80 ? 'bg-emerald-500' : selectedClass.healthMetrics.passChuanRate >= 70 ? 'bg-amber-500' : 'bg-[#DB0829]'}`} style={{ width: `${selectedClass.healthMetrics.passChuanRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* System Info Box */}
          <div className="mt-auto p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#DB0829]" />
              <span>Kiến trúc Hybrid CQRS</span>
            </div>
            <p className="leading-relaxed">
              Dữ liệu được làm giàu tĩnh trên Sheet <code>02_DuLieu_HocVien</code> giúp tốc độ phản hồi &lt;500ms.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
              <span>n8n Webhook: <b>Active</b></span>
              <span className="text-emerald-400">● Live</span>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                      👩‍🏫 Lớp {selectedClass.className} — {selectedClass.courseName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#DB0829]/10 dark:bg-[#DB0829]/20 text-[#DB0829] border border-[#DB0829]/20 dark:border-[#DB0829]/30 w-fit">
                      On-going (Buổi {selectedClass.progress.completedSessions}/{selectedClass.progress.totalSessions})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-4">
                    <span>GVCN: <b className="text-slate-700 dark:text-slate-200">{selectedClass.teacher.fullName}</b></span>
                    <span>•</span>
                    <span>Lịch học: <b className="text-slate-700 dark:text-slate-200">{selectedClass.schedule}</b></span>
                    <span>•</span>
                    <span>Sĩ số: <b className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedClass.studentCounts.active} Active</b> / {selectedClass.studentCounts.totalEnrolled} Tổng</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/20 active:scale-95"
                  >
                    🚨 Gọi gấp (3)
                  </button>
                  <button
                    onClick={() => setIsZaloModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 active:scale-95"
                  >
                    ⚠️ Nhắc Zalo (5)
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

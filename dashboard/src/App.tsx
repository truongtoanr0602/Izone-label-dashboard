import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { TopRibbon } from './components/dashboard/TopRibbon';
import { StudentTable } from './components/dashboard/StudentTable';
import { LeadDashboard } from './components/dashboard/LeadDashboard';
import { ZaloRemindModal } from './components/modals/ZaloRemindModal';
import { Login } from './components/auth/Login';
import type { TableFilter } from './components/dashboard/StudentTable';
import type { ClassSummary, ContactLog, ContactTrigger, StudentDetail, LabelChangeLog } from './data/types';
import { currentCheckpoint, remainingCount } from './data/selectors';
import { TRIGGER_SHORT_TITLE } from './data/labels';
import { LayoutDashboard, Users, X, CheckCircle, BookOpen, Award, MessageSquare, LogOut } from 'lucide-react';
import IzoneLogo from './images/logo.png';
import { api, setAuthHeader } from './api/client';
import { dashboardService } from './api/dashboardService';
import { adaptTeacherStudent } from './api/dashboardContracts';

const QUICK_BUTTONS: { trigger: ContactTrigger; className: string }[] = [
  { trigger: 'habit_reminder', className: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40' },
  { trigger: 'red_followup', className: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40' },
  { trigger: 'relearn_advice', className: 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/70' },
];

function metricTone(value: number | null) {
  if (value === null) return 'text-[#404040]/40 dark:text-[#71717a]';
  if (value >= 80) return 'text-emerald-500';
  if (value >= 70) return 'text-amber-500';
  return 'text-red-500';
}

function metricBar(value: number | null) {
  if (value === null) return 'bg-transparent';
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

const metricText = (value: number | null) => value === null ? '—' : `${value}%`;

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassSummary | null>(null);
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [labelEvents, setLabelEvents] = useState<LabelChangeLog[]>([]);
  const [contactLogs, setContactLogs] = useState<ContactLog[]>([]);
  const [actionTotals, setActionTotals] = useState<Record<ContactTrigger, number>>({
    habit_reminder: 0,
    red_followup: 0,
    relearn_advice: 0,
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [activeTab, setActiveTab] = useState<'lead' | 'teacher'>('teacher');
  const [tableFilter, setTableFilter] = useState<TableFilter>('all');
  const [openTrigger, setOpenTrigger] = useState<ContactTrigger | null>(null);

  // Initialize App: Use token 'teacher-1002' for Teacher, 'lead-token' for Lead
  const initApp = async (token: string) => {
    try {
      setIsLoading(true);
      setAuthHeader(token);
      const user = await api.getMe();
      setCurrentUser(user);
      localStorage.setItem('auth_token', token);

      // Force view mode based on role
      setActiveTab(user.role === 'lead' ? 'lead' : 'teacher');

      const clsData = await api.getClasses();
      setClasses(clsData);
      if (clsData.length > 0) {
        setSelectedClass(clsData[0]);
      } else {
        setSelectedClass(null);
      }
    } catch (e: any) {
      console.error('Failed to init app', e);
      if (e?.response?.status === 401) {
        alert('Tài khoản không hợp lệ hoặc phiên đăng nhập đã hết hạn.');
        handleLogout();
      } else {
        alert('Không thể kết nối đến Backend Server ở port 3000. Hãy chắc chắn Backend đang chạy.');
      }
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setSelectedClass(null);
    setClasses([]);
    setStudents([]);
    setContactLogs([]);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      initApp(savedToken);
    } else {
      setIsInitializing(false);
      setIsLoading(false);
    }
  }, []);

  // When selected class changes, fetch its students, label events, and contact logs
  useEffect(() => {
    const classId = selectedClass?.classId;
    if (!classId) return;
    const requestedClassId = classId;

    async function fetchTeacherDashboard() {
      try {
        const [screen, labels, logs] = await Promise.all([
          dashboardService.getTeacherDashboard(requestedClassId),
          api.getLabelEvents({ classId: requestedClassId }),
          api.getContactLogs({ classId: requestedClassId }),
        ]);
        setStudents(screen.students.map((student) =>
          adaptTeacherStudent(student, requestedClassId, screen.classHeader.className),
        ));
        setLabelEvents(labels);
        setContactLogs(logs);
        setActionTotals({
          habit_reminder: screen.actionSummary.level1.count,
          red_followup: screen.actionSummary.level2.count,
          relearn_advice: screen.actionSummary.level3.count,
        });
        setSelectedClass((current) => current && current.classId === requestedClassId ? {
          ...current,
          className: screen.classHeader.className,
          courseId: screen.classHeader.courseId,
          courseName: screen.classHeader.courseName,
          schedule: screen.classHeader.schedule ?? '',
          portalUrl: screen.classHeader.portalUrl ?? '',
          teacher: {
            ...current.teacher,
            teacherId: screen.classHeader.teacher.teacherId,
            fullName: screen.classHeader.teacher.fullName,
            email: screen.classHeader.teacher.email,
          },
          progress: {
            completedSessions: screen.classHeader.progress.completedSessions,
            totalSessions: screen.classHeader.progress.totalSessions,
            percentage: screen.classHeader.progress.percentage ?? 0,
          },
          studentCounts: {
            active: screen.classHeader.studentCounts.active,
            onHold: screen.classHeader.studentCounts.onHold,
            dropped: screen.classHeader.studentCounts.dropped,
            transferred: screen.classHeader.studentCounts.transferred,
            totalEnrolled: screen.classHeader.studentCounts.total,
          },
          actionItems: {
            ...current.actionItems,
            urgentCallsNeeded: screen.actionSummary.level2.count,
            homeworkRemindersNeeded: screen.actionSummary.level1.count,
            pendingPassReviews: screen.actionSummary.softPassReview.pending,
          },
          lastSyncedAt: screen.meta.generatedAt,
        } : current);
      } catch (error) {
        console.error('Failed to fetch Teacher Dashboard', error);
      }
    }

    fetchTeacherDashboard();
  }, [selectedClass?.classId]);

  const checkpoint = currentCheckpoint(students);

  const markContacted = async (trigger: ContactTrigger, s: StudentDetail) => {
    if (!selectedClass) return;
    try {
      const newLog = await api.createContactLog({
        studentId: s.studentId,
        classId: selectedClass.classId,
        trigger,
        checkpoint
      });
      setContactLogs(prev => [newLog, ...prev]);
    } catch (e: any) {
      if (e.response?.status === 409) {
        alert('Checkpont này đã được đánh dấu đã liên hệ từ trước!');
      } else {
        console.error(e);
      }
    }
  };

  const undoContacted = async (trigger: ContactTrigger, s: StudentDetail) => {
    try {
      await api.undoContactLog({
        studentId: s.studentId,
        trigger,
        checkpoint
      });
      setContactLogs(prev => prev.filter(log => !(
        log.studentId === s.studentId && 
        log.trigger === trigger && 
        log.checkpoint === checkpoint
      )));
    } catch (e) {
      console.error(e);
    }
  };

  const totals = actionTotals;

  const remaining: Record<ContactTrigger, number> = {
    habit_reminder: remainingCount(students, contactLogs, 'habit_reminder', checkpoint),
    red_followup: remainingCount(students, contactLogs, 'red_followup', checkpoint),
    relearn_advice: remainingCount(students, contactLogs, 'relearn_advice', checkpoint),
  };

  const handleDrillDownToClass = (cls: ClassSummary) => {
    setSelectedClass(cls);
    setActiveTab('teacher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#18181b] text-gray-500">Đang khởi tạo ứng dụng...</div>;
  }

  if (!currentUser) {
    return <Login onLogin={initApp} isLoading={isLoading} />;
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} flex h-screen w-full overflow-hidden bg-[#f3f4f6] dark:bg-[#18181b] text-[#404040] dark:text-[#e4e4e7] font-sans selection:bg-[#DB0829]/30 selection:text-white transition-colors duration-300`}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[50] xl:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7] p-5 space-y-6 transform transition-all duration-300 xl:relative xl:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isSidebarCollapsed ? 'xl:w-0 xl:p-0 xl:border-0 xl:overflow-hidden' : ''}`}>
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

        {/* User Info & Logout */}
        <div className="p-3 bg-[#f3f4f6] dark:bg-[#3f3f46]/50 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold truncate">{currentUser?.displayName}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{currentUser?.role === 'lead' ? 'Trưởng Khối' : 'Giáo viên'}</span>
          </div>
          <button 
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#404040]/50 dark:text-[#a1a1aa] mb-2">Chức năng chính</p>
          {(currentUser?.role === 'lead' || currentUser?.role === 'admin') && (
            <button
              onClick={() => {
                setActiveTab('lead');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs transition-all ${activeTab === 'lead'
                  ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-100 font-medium border-l-4 border-[#db0829]'
                  : 'font-bold text-[#404040]/70 dark:text-[#a1a1aa] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Lead Khối Dashboard</span>
            </button>
          )}

          {selectedClass && (
            <button
              onClick={() => {
                setActiveTab('teacher');
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs transition-all ${activeTab === 'teacher'
                  ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-100 font-medium border-l-4 border-[#db0829]'
                  : 'font-bold text-[#404040]/70 dark:text-[#a1a1aa] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span className="truncate w-32 text-left">Lớp: {selectedClass.className}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </button>
          )}
        </div>

        {/* Lớp Overview Widget */}
        {selectedClass && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#404040]/50 dark:text-[#a1a1aa] uppercase border-b border-[#f3f4f6] dark:border-[#3f3f46] pb-2">
              Tổng quan lớp
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]"><CheckCircle className="w-4 h-4" /><span>Điểm danh</span></div>
                  <span className={`font-semibold font-mono text-sm ${metricTone(selectedClass.healthMetrics.attendanceAverage)}`}>{metricText(selectedClass.healthMetrics.attendanceAverage)}</span>
                </div>
                <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                  <div className={`h-full ${metricBar(selectedClass.healthMetrics.attendanceAverage)}`} style={{ width: selectedClass.healthMetrics.attendanceAverage === null ? '0%' : `${selectedClass.healthMetrics.attendanceAverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]"><BookOpen className="w-4 h-4" /><span>BTVN</span></div>
                  <span className={`font-semibold font-mono text-sm ${metricTone(selectedClass.healthMetrics.homeworkAverage)}`}>{metricText(selectedClass.healthMetrics.homeworkAverage)}</span>
                </div>
                <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                  <div className={`h-full ${metricBar(selectedClass.healthMetrics.homeworkAverage)}`} style={{ width: selectedClass.healthMetrics.homeworkAverage === null ? '0%' : `${selectedClass.healthMetrics.homeworkAverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-[#404040]/70 dark:text-[#a1a1aa]"><Award className="w-4 h-4" /><span>Tỷ lệ Pass</span></div>
                  <span className={`font-semibold font-mono text-sm ${metricTone(selectedClass.healthMetrics.passChuanRate)}`}>{metricText(selectedClass.healthMetrics.passChuanRate)}</span>
                </div>
                <div className="w-full h-1 bg-[#f3f4f6] dark:bg-[#3f3f46] rounded-full overflow-hidden">
                  <div className={`h-full ${metricBar(selectedClass.healthMetrics.passChuanRate)}`} style={{ width: selectedClass.healthMetrics.passChuanRate === null ? '0%' : `${selectedClass.healthMetrics.passChuanRate}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <Header
          classes={classes}
          selectedClass={selectedClass || undefined}
          onSelectClass={handleDrillDownToClass}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {activeTab === 'lead' && currentUser?.role === 'lead' && (
            <LeadDashboard
              classes={classes}
              onSelectClassAndDrillDown={handleDrillDownToClass}
              isDarkMode={isDarkMode}
              khoiId={currentUser.khoiId}
            />
          )}

          {activeTab === 'teacher' && selectedClass && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#27272a] p-5 rounded-[16px]">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-lg md:text-xl font-semibold text-[#404040] dark:text-[#e4e4e7] tracking-tight flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#475569] dark:text-[#a1a1aa]" /> Lớp {selectedClass.className} — {selectedClass.courseName}
                    </h2>
                    <span className="text-xs font-mono font-semibold text-[#404040]/60 dark:text-[#a1a1aa] w-fit">
                      On-going · Buổi {selectedClass.progress.completedSessions}/{selectedClass.progress.totalSessions}
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
                <div className="flex flex-wrap items-center gap-3">
                  {QUICK_BUTTONS.map(({ trigger, className: btnClass }) => (
                    <button
                      key={trigger}
                      onClick={() => setOpenTrigger(trigger)}
                      className={`px-3.5 py-2 rounded-[8px] border font-bold text-xs transition-all active:scale-95 inline-flex items-center gap-1.5 ${btnClass}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> {TRIGGER_SHORT_TITLE[trigger]}
                      <span className="font-mono opacity-70">{remaining[trigger]}/{totals[trigger]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <TopRibbon
                selectedClass={selectedClass}
                totals={totals}
                remaining={remaining}
                onOpenTrigger={setOpenTrigger}
                onFilterTrigger={setTableFilter}
              />

              <StudentTable
                students={students}
                onOpenTrigger={setOpenTrigger}
                activeFilter={tableFilter}
                onChangeFilter={(f) => setTableFilter(f)}
                contactLogs={contactLogs}
                checkpoint={checkpoint}
                labelEvents={labelEvents}
              />
            </div>
          )}
          
          {activeTab === 'teacher' && !selectedClass && (
            <div className="text-center py-20 text-gray-500">Bạn chưa được phân quyền quản lý lớp nào.</div>
          )}
        </main>
      </div>

      {selectedClass && (
        <ZaloRemindModal
          trigger={openTrigger}
          onClose={() => setOpenTrigger(null)}
          students={students}
          className={selectedClass.className}
          teacherName={selectedClass.teacher.fullName}
          contactLogs={contactLogs}
          checkpoint={checkpoint}
          onMarkContacted={markContacted}
          onUndoContacted={undoContacted}
        />
      )}
    </div>
  );
}

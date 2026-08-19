import React, { useState } from 'react';
import {
  Search, TrendingDown, AlertTriangle, Compass, CheckCircle2,
  MessageSquare, Award, CheckCircle, Clock, LayoutGrid, List, History, ChevronRight, Users, Target, Star,
  ArrowDown, ArrowUp, ArrowUpDown,
} from 'lucide-react';
import type { ContactLog, ContactTrigger, LabelCode, StudentDetail, LabelChangeLog } from '../../data/types';
import {
  isContacted,
  isDroppedStudent,
  matchesStudentTableFilter,
  primaryTrigger,
  sortStudentsForTable,
  studentPassState,
  type StudentSort,
  type StudentSortKey,
  type StudentTableFilter,
} from '../../data/selectors';
import { uniqueLogicalTestScores } from './studentTestScores';
import { LABEL_BADGE_CLASS, LABEL_TEXT, TRIGGER_SHORT_TITLE } from '../../data/labels';
import { round1 } from '../../data/number';
import { LineChart, Line, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { currentHabitMetrics } from './studentMetricModel';

export type TableFilter = StudentTableFilter;

const TRIGGER_ACTION_CLASS: Record<ContactTrigger, string> = {
  habit_reminder: 'text-amber-600 dark:text-amber-400 border-amber-500 hover:bg-amber-600 hover:text-white',
  red_followup: 'text-red-600 dark:text-red-400 border-red-600 dark:border-red-500 hover:bg-red-600 hover:text-white',
  relearn_advice: 'text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-500 hover:bg-slate-600 hover:text-white hover:border-slate-600',
};

export function labelFromAverage(avg: number): LabelCode {
  if (avg >= 60) return 'yellow';
  if (avg >= 45) return 'red';
  return 'grey';
}

function labelTimeline(s: StudentDetail, labelEvents: LabelChangeLog[]) {
  const scores = uniqueLogicalTestScores(s.testPerformance.scores)
    .filter((t) => t.finalScore !== null);

  return scores.map((t) => {
    const label = labelFromAverage(round1(t.finalScore as number));
    const changeLog = labelEvents.find(
      (log) => log.studentId === s.studentId && log.checkpoint === t.testName,
    );
    return { key: `t${t.testOrder}`, checkpoint: t.testName, label, reason: changeLog?.reason };
  });
}

interface StudentTableProps {
  students: StudentDetail[];
  onOpenTrigger: (trigger: ContactTrigger) => void;
  activeFilter: TableFilter;
  onChangeFilter: (filter: TableFilter) => void;
  contactLogs: ContactLog[];
  checkpoint: string;
  labelEvents: LabelChangeLog[];
}

interface SortableHeaderProps {
  label: string;
  sortKey: StudentSortKey;
  sort: StudentSort | null;
  onSort: (key: StudentSortKey) => void;
  align?: 'left' | 'center';
  className?: string;
  colSpan?: number;
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = 'center',
  className = 'py-3 px-4',
  colSpan,
}: SortableHeaderProps) {
  const isActive = sort?.key === sortKey;
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <th
      className={`${className} ${align === 'left' ? 'text-left' : 'text-center'}`}
      colSpan={colSpan}
      aria-sort={!isActive ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending'}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex w-full items-center gap-1.5 rounded-[8px] py-1 transition-colors hover:text-[#404040] dark:hover:text-[#e4e4e7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB0829]/30 ${
          align === 'left' ? 'justify-start' : 'justify-center'
        } ${isActive ? 'text-[#404040] dark:text-[#e4e4e7]' : ''}`}
      >
        <span>{label}</span>
        <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#DB0829]' : 'opacity-35'}`} />
      </button>
    </th>
  );
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onOpenTrigger,
  activeFilter,
  onChangeFilter,
  contactLogs,
  checkpoint,
  labelEvents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
  const [sort, setSort] = useState<StudentSort | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.studentId).includes(searchTerm) ||
      s.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    return matchesStudentTableFilter(s, activeFilter);
  });

  const sortedStudents = sortStudentsForTable(filteredStudents, sort ?? undefined);

  const handleSort = (key: StudentSortKey) => {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const counts = {
    all: students.length,
    pass: students.filter((s) => matchesStudentTableFilter(s, 'pass')).length,
    review: students.filter((s) => matchesStudentTableFilter(s, 'review')).length,
  };

  return (
    <div className="bg-white dark:bg-[#27272a] rounded-[16px] shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6] dark:bg-[#18181b] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-[#27272a] p-1.5 rounded-[12px]">
          <button
            onClick={() => onChangeFilter('all')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#f3f4f6] dark:bg-slate-800 text-[#404040] dark:text-slate-200 font-medium border border-[#f3f4f6] dark:border-slate-700'
                : 'font-semibold text-[#404040]/70 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Tất cả học viên
            <span className="font-mono text-[11px] opacity-60">({counts.all})</span>
          </button>
          <button
            onClick={() => onChangeFilter('pass')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'pass'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800/50'
                : 'font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Đủ điều kiện Pass
            <span className="font-mono text-[11px] opacity-70">({counts.pass})</span>
          </button>
          <button
            onClick={() => onChangeFilter('review')}
            className={`px-3 py-1.5 rounded-[8px] text-xs transition-all flex items-center gap-1.5 ${
              activeFilter === 'review'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-800/50'
                : 'font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Chờ GV Duyệt Pass
            <span className="font-mono text-[11px] opacity-70">({counts.review})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#404040]/40 dark:text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-[8px] bg-white dark:bg-[#18181b] border border-[#e5e7eb] dark:border-[#3f3f46] text-xs text-[#404040] dark:text-[#e4e4e7] placeholder:text-[#404040]/40 dark:placeholder:text-[#71717a] focus:outline-none focus:border-[#DB0829] w-56 transition-all"
            />
          </div>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className={`px-3 py-1.5 rounded-[8px] border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isGridView
                ? 'bg-[#f3f4f6] dark:bg-[#3f3f46] border-[#DB0829]/50 text-[#404040] dark:text-[#e4e4e7]'
                : 'bg-white dark:bg-[#27272a] border-[#f3f4f6] dark:border-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7]'
            }`}
          >
            {isGridView ? (
              <>
                <List className="w-4 h-4 text-[#DB0829]" /> Thu gọn Test
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4 text-[#404040]/50 dark:text-[#71717a]" /> Hiện 6 cột Test
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46]">
            <tr className="text-[#404040]/60 dark:text-[#71717a] font-semibold text-xs uppercase tracking-wider">
              <SortableHeader label="Họ và Tên" sortKey="name" sort={sort} onSort={handleSort} align="left" colSpan={2} />
              <SortableHeader label="Chuyên cần" sortKey="attendance" sort={sort} onSort={handleSort} />
              <SortableHeader label="BTVN" sortKey="homework" sort={sort} onSort={handleSort} />
              
              {isGridView ? (
                <>
                  {([1, 2, 3, 4, 5, 6] as const).map((testOrder) => (
                    <SortableHeader key={testOrder} label={`T${testOrder}`} sortKey={`test${testOrder}`} sort={sort} onSort={handleSort} className="py-3 px-2" />
                  ))}
                  <SortableHeader label="TB" sortKey="testAverage" sort={sort} onSort={handleSort} className="py-3 px-3" />
                </>
              ) : (
                <>
                  <SortableHeader label="Điểm Test" sortKey="testAverage" sort={sort} onSort={handleSort} />
                </>
              )}

              <SortableHeader label="Nhãn" sortKey="label" sort={sort} onSort={handleSort} />
              <SortableHeader label="Trạng thái" sortKey="status" sort={sort} onSort={handleSort} align="left" />
              <th className="py-3 px-4 text-right" colSpan={2}>Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f3f4f6] dark:divide-[#3f3f46] text-xs">
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-[#404040]/50 dark:text-[#71717a]">
                  Không tìm thấy học viên nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              sortedStudents.map((s, idx) => {
                const isDropped = isDroppedStudent(s);
                const passState = studentPassState(s);
                const attendancePct = s.attendance.percentage;
                const homeworkPct = s.homework.percentage;
                const logicalTestScores = uniqueLogicalTestScores(s.testPerformance.scores);
                const sparkData = logicalTestScores
                  .filter((t) => t.finalScore !== null)
                  .map((t) => ({ name: t.testName, score: t.finalScore }));
                const habitMetrics = currentHabitMetrics({
                  recordDate: s.recordDate,
                  attendance: s.attendance,
                  homework: s.homework,
                  warnings: s.dataQuality.warnings,
                });

                const trigger = primaryTrigger(s);
                const contacted =
                  trigger !== null && isContacted(contactLogs, s.studentId, trigger, checkpoint);

                return (
                  <React.Fragment key={s.studentId}>
                    <tr
                      className={`transition-colors ${
                        isDropped
                          ? 'bg-slate-50/80 dark:bg-slate-900/20 hover:bg-slate-100/80 dark:hover:bg-slate-800/25'
                          : s.labeling.currentLabel === 'red' || s.evaluation.suggestedAction === 'call_parent'
                          ? 'bg-red-50 dark:bg-red-950/15'
                          : s.labeling.currentLabel === 'grey'
                          ? 'bg-slate-100/70 dark:bg-slate-800/20'
                          : expandedStudentId === s.studentId ? 'bg-[#f3f4f6] dark:bg-[#18181b]' : 'hover:bg-[#f3f4f6]/50 dark:hover:bg-[#3f3f46]/30'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-[#404040]/50 dark:text-[#71717a]">{idx + 1}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                              isDropped ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700' :
                              s.labeling.currentLabel === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              s.labeling.currentLabel === 'yellow' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/70 dark:text-[#a1a1aa]'
                            }`}>
                              {s.fullName.split(' ').slice(-2).map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-[#404040] dark:text-[#e4e4e7] text-sm flex items-center gap-1.5 flex-wrap">
                                {s.fullName}
                                {isDropped && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wide">
                                    Đã nghỉ
                                  </span>
                                )}
                                {s.labeling.hasChangedRecently && (
                                  <span className="px-1.5 py-0.2 text-[9px] rounded font-bold uppercase bg-[#f3f4f6] dark:bg-[#3f3f46] text-[#404040]/70 dark:text-[#a1a1aa] border border-[#f3f4f6] dark:border-[#3f3f46] font-mono" title={`Vừa đổi từ ${s.labeling.previousLabel} lên ${s.labeling.currentLabel}`}>
                                    {s.labeling.previousLabel}→{s.labeling.currentLabel}
                                  </span>
                                )}
                              </p>
                              <p className="text-[#404040]/50 dark:text-[#71717a] font-mono text-[11px] mt-0.5">{s.phone}</p>
                            </div>
                          </div>
                          
                           <div className="md:hidden ml-2 shrink-0">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${LABEL_BADGE_CLASS[s.labeling.currentLabel]}`}>
                              {LABEL_TEXT[s.labeling.currentLabel]}
                            </span>
                          </div>
                        </div>

                        <div className="md:hidden flex items-center gap-3 text-[11px] font-mono border-t border-[#f3f4f6] dark:border-[#3f3f46] pt-2 mt-1">
                          <span>CC: <span className={attendancePct !== null && attendancePct < 90 ? 'text-red-500 font-bold' : 'text-[#404040] dark:text-[#e4e4e7]'}>{attendancePct === null ? '—' : `${attendancePct}%`}</span></span>
                          <span className="text-[#404040]/30 dark:text-[#52525b]">|</span>
                          <span>BTVN: <span className={homeworkPct !== null && homeworkPct < 90 ? 'text-red-500 font-bold' : 'text-[#404040] dark:text-[#e4e4e7]'}>{homeworkPct === null ? '—' : `${homeworkPct}%`}</span></span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          isDropped ? 'text-slate-500 dark:text-slate-400' :
                          attendancePct === null ? 'text-[#404040]/40 dark:text-[#71717a]' :
                          attendancePct < 80 ? 'text-red-500' :
                          attendancePct < 90 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {attendancePct === null ? '—' : `${attendancePct}%`}
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              isDropped ? 'bg-slate-400 dark:bg-slate-500' :
                              attendancePct === null ? 'bg-transparent' :
                              attendancePct < 80 ? 'bg-red-500' :
                              attendancePct < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: attendancePct === null ? '0%' : `${attendancePct}%` }}
                          />
                        </div>
                        {s.attendance.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-red-500 flex items-center gap-0.5 mt-0.5 animate-pulse">
                            <TrendingDown className="w-2.5 h-2.5" /> Tụt tuần
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold font-mono text-sm ${
                          isDropped ? 'text-slate-500 dark:text-slate-400' :
                          homeworkPct === null ? 'text-[#404040]/40 dark:text-[#71717a]' :
                          homeworkPct < 80 ? 'text-red-500' :
                          homeworkPct < 90 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {homeworkPct === null ? '—' : `${homeworkPct}%`}
                        </span>
                        <div className="w-14 h-1.5 rounded-full bg-[#f3f4f6] dark:bg-[#3f3f46] overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              isDropped ? 'bg-slate-400 dark:bg-slate-500' :
                              homeworkPct === null ? 'bg-transparent' :
                              homeworkPct < 80 ? 'bg-red-500' :
                              homeworkPct < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: homeworkPct === null ? '0%' : `${homeworkPct}%` }}
                          />
                        </div>
                        {s.homework.isDroppingRecently && (
                          <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5">
                            <TrendingDown className="w-2.5 h-2.5" /> Lười bài
                          </span>
                        )}
                      </div>
                    </td>

                    {isGridView ? (
                      <>
                        {[1, 2, 3, 4, 5, 6].map((testOrder) => {
                          const t = logicalTestScores.find((score) => score.testOrder === testOrder);
                          return (
                            <td key={testOrder} className="py-3.5 px-2 text-center font-mono">
                              {t && t.finalScore !== null ? (
                                <span className={`text-sm font-bold ${
                                  isDropped ? 'text-slate-500 dark:text-slate-400' :
                                  t.finalScore < 45 ? 'text-[#404040]/50 dark:text-[#71717a]' :
                                  t.finalScore < 60 ? 'text-red-500' : 'text-amber-500'
                                }`} title={t.isMakeup ? `Thi bù (Lần 1: ${t.rawScore}, Lần 2: ${t.makeupScore})` : ''}>
                                  {t.finalScore}
                                  {t.isMakeup && '⚡'}
                                </span>
                              ) : (
                                <span className="text-[#404040]/30 dark:text-[#52525b]">--</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3.5 px-3 text-center font-mono">
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`text-sm font-extrabold ${
                              isDropped ? 'text-slate-500 dark:text-slate-400' :
                              s.testPerformance.averageScore < 45 ? 'text-[#404040]/70 dark:text-[#a1a1aa]' :
                              s.testPerformance.averageScore < 60 ? 'text-red-500' : 'text-amber-500'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-[#404040]/30 dark:text-[#52525b] font-bold">--</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 text-center">
                          {s.testPerformance.averageScore !== null ? (
                            <span className={`text-sm font-extrabold font-mono ${
                              isDropped ? 'text-slate-500 dark:text-slate-400' :
                              s.testPerformance.averageScore < 45 ? 'text-[#404040]/70 dark:text-[#a1a1aa]' :
                              s.testPerformance.averageScore < 60 ? 'text-red-500' : 'text-amber-500'
                            }`}>
                              {s.testPerformance.averageScore}
                            </span>
                          ) : (
                            <span className="text-[#404040]/30 dark:text-[#52525b] font-bold font-mono">--</span>
                          )}
                        </td>
                      </>
                    )}

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 border ${LABEL_BADGE_CLASS[s.labeling.currentLabel]}`}>
                        {s.labeling.currentLabel === 'red' && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
                        {s.labeling.currentLabel === 'yellow' && <Award className="w-3.5 h-3.5" />}
                        {s.labeling.currentLabel === 'grey' && <Compass className="w-3.5 h-3.5" />}
                        {LABEL_TEXT[s.labeling.currentLabel]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {passState === 'dropped' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                          Đã nghỉ
                        </span>
                      ) : passState === 'no_test' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-[8px] border border-slate-300 dark:border-slate-600">
                            <Clock className="w-3.5 h-3.5" /> Chờ dữ liệu Test
                          </span>
                          <p className="mt-1 text-[10px] leading-tight text-[#404040]/50 dark:text-[#71717a]">
                            Chưa có bài Test
                          </p>
                        </div>
                      ) : passState === 'pass' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-[8px] border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Pass
                        </span>
                      ) : passState === 'review' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-[8px] border border-amber-500/20">
                            <Star className="w-3 h-3" /> Xét chờ Review
                          </span>
                          <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-0.5 font-mono">{s.evaluation.reviewStatus || 'Cần duyệt'}</p>
                        </div>
                      ) : (
                        <div className="max-w-xs">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-[8px] border border-red-500/20">
                            <AlertTriangle className="w-3.5 h-3.5" /> Chưa đạt
                          </span>
                          <p className="mt-1 text-[10px] leading-tight text-[#404040]/60 dark:text-[#a1a1aa] whitespace-normal">
                            {s.evaluation.passChuanReasons.join(', ') || 'Điểm test dưới ngưỡng'}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isDropped ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-normal">
                          Không cần can thiệp
                        </span>
                      ) : (
                      <div className="inline-flex items-center gap-2">
                        {contacted && (
                          <span
                            className="text-emerald-600 dark:text-emerald-400 shrink-0"
                            title={`Đã xác nhận đã nhắn tại mốc ${checkpoint}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {trigger !== null ? (
                          <button
                            onClick={() => onOpenTrigger(trigger)}
                            className={`px-3 py-1.5 rounded-[8px] bg-transparent border font-semibold text-xs transition-colors inline-flex items-center gap-1.5 active:scale-95 ${TRIGGER_ACTION_CLASS[trigger]}`}
                          >
                            <MessageSquare className="w-3 h-3" /> {TRIGGER_SHORT_TITLE[trigger]}
                          </button>
                        ) : s.evaluation.isEligibleForReview ? (
                          <a
                            href="https://portal.izone.edu.vn"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-[8px] bg-transparent text-[#DB0829] border border-[#DB0829] hover:bg-[#DB0829] hover:text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 active:scale-95"
                          >
                            <Clock className="w-3 h-3" /> Duyệt trên Portal
                          </a>
                        ) : (
                          <span className="text-[#404040]/40 dark:text-[#52525b] text-xs font-mono">--</span>
                        )}
                      </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setExpandedStudentId(expandedStudentId === s.studentId ? null : s.studentId)}
                          className={`p-2 rounded-[8px] border transition-all ${
                            expandedStudentId === s.studentId 
                              ? 'bg-[#DB0829] text-white border-[#DB0829]' 
                              : 'bg-white dark:bg-[#27272a] text-[#404040]/50 dark:text-[#a1a1aa] border-[#f3f4f6] dark:border-[#3f3f46] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:border-[#e5e7eb] dark:hover:border-[#52525b]'
                          }`}
                          title="Xem lịch sử nhãn và xu hướng chi tiết"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {expandedStudentId === s.studentId && (
                      <tr>
                        <td colSpan={20} className="p-0 border-b border-[#f3f4f6] dark:border-[#3f3f46] bg-[#f3f4f6]/50 dark:bg-[#18181b]/50">
                          <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 space-y-4">
                                <h4 className="text-xs font-bold text-[#404040]/70 dark:text-[#a1a1aa] uppercase tracking-wider flex items-center gap-2">
                                  <History className="w-4 h-4 text-blue-500" />
                                  Lộ trình chuyển nhãn
                                </h4>
                                {(() => {
                                  const timeline = labelTimeline(s, labelEvents);
                                  const currentLabel = timeline.length > 0
                                    ? timeline[timeline.length - 1].label
                                    : s.labeling.currentLabel;
                                  const steps: { key: string; checkpoint: string; label: LabelCode; reason?: string }[] = [
                                    ...timeline,
                                    { key: 'current', checkpoint: 'Hiện tại', label: currentLabel },
                                  ];

                                  return (
                                    <>
                                      <div className="flex flex-wrap items-center gap-3">
                                        {steps.map((step, idx) => (
                                          <div key={step.key} className="flex items-center gap-3">
                                            <div className="flex flex-col items-center gap-1" title={step.reason}>
                                              <span className="text-[10px] text-[#404040]/50 dark:text-[#71717a] font-mono">{step.checkpoint}</span>
                                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${LABEL_BADGE_CLASS[step.label]}`}>
                                                {LABEL_TEXT[step.label]}
                                              </span>
                                            </div>
                                            {idx < steps.length - 1 && (
                                              <ChevronRight className="w-4 h-4 text-[#404040]/30 dark:text-[#52525b]" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      {steps.length === 1 && (
                                        <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] italic">
                                          Chưa có bài test nào để tính nhãn theo mốc.
                                        </p>
                                      )}
                                    </>
                                  );
                                })()}
                                <p className="text-[11px] text-[#404040]/50 dark:text-[#71717a] italic">
                                  Học viên có xu hướng {s.testPerformance.trendDirection === 'improving' ? 'cải thiện tích cực' : s.testPerformance.trendDirection === 'declining' ? 'sa sút nghiêm trọng' : 'duy trì nhãn ổn định'}.
                                </p>
                              </div>

                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-bold text-[#404040]/50 dark:text-[#71717a] uppercase tracking-wider text-center">Điểm Test</h4>
                                  <div className="h-20 w-full bg-white dark:bg-[#27272a] rounded-[12px] p-1 px-4 overflow-hidden border border-[#f3f4f6] dark:border-[#3f3f46]">
                                    <ResponsiveContainer width="100%" height="100%" debounce={200}>
                                      <LineChart data={sparkData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f3f4f6', fontSize: '10px' }} itemStyle={{ color: '#3b82f6' }} />
                                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}>
                                          <LabelList dataKey="score" position="top" offset={8} fontSize={9} className="fill-[#404040]/60 dark:fill-[#a1a1aa]" />
                                        </Line>
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                {habitMetrics.map((metric) => (
                                  <div key={metric.key} className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-[#404040]/50 dark:text-[#71717a] uppercase tracking-wider text-center">{metric.title}</h4>
                                    <div className="min-h-20 w-full bg-white dark:bg-[#27272a] rounded-[12px] px-4 py-3 border border-[#f3f4f6] dark:border-[#3f3f46] text-center space-y-1">
                                      <p className="font-mono text-lg font-extrabold text-[#404040] dark:text-[#e4e4e7]">
                                        {metric.percentage === null ? '—' : `${metric.percentage}%`}
                                      </p>
                                      <p className="text-[10px] text-[#404040]/60 dark:text-[#a1a1aa]">
                                        {metric.done ?? '—'}/{metric.total ?? '—'} {metric.unit}
                                        {metric.recordDate ? ` · dữ liệu ${metric.recordDate.split('-').reverse().join('/')}` : ' · chưa có ngày dữ liệu'}
                                      </p>
                                      {metric.hasWarning && (
                                        <p className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                                          {metric.warningMessage}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex flex-wrap items-center justify-between gap-4 text-xs text-[#404040]/60 dark:text-[#a1a1aa]">
        <div>
          Hiển thị <b className="text-[#404040] dark:text-[#e4e4e7]">{sortedStudents.length}</b> / <span className="text-[#404040] dark:text-[#e4e4e7]">{students.length}</span> học viên
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mức 1 · Nhắc chăm học (ĐH/BTVN &lt;90%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Mức 2 · Cần theo sát (nhãn Đỏ)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Mức 3 · Bàn lại lộ trình (nhãn Xám)</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đã liên hệ tại mốc {checkpoint}</span>
        </div>
      </div>
    </div>
  );
};

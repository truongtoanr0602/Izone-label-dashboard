import React, { useState } from 'react';
import { 
  Award, Clock, CheckCircle2, XCircle, AlertTriangle, 
  ShieldAlert
} from 'lucide-react';
import { MOCK_PENDING_REVIEWS } from '../../data/mockData';
import type { PendingReviewEnriched } from '../../data/mockData';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export const ReviewCenter: React.FC = () => {
  const [reviews, setReviews] = useState<PendingReviewEnriched[]>(MOCK_PENDING_REVIEWS);
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'Nhóm 1' | 'Nhóm 2' | 'overdue'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>({});
  const [teacherAttitude, setTeacherAttitude] = useState<Record<string, 'Có tiến bộ' | 'Không rõ' | 'Không'>>({});

  const filteredReviews = reviews.filter((r) => {
    if (selectedGroup === 'Nhóm 1') return r.qualification.passMemGroup === 'Nhóm 1';
    if (selectedGroup === 'Nhóm 2') return r.qualification.passMemGroup === 'Nhóm 2';
    if (selectedGroup === 'overdue') return r.workflow.isOverdue;
    return true; // 'all'
  });

  const handleQuickDecision = (reviewId: string, decision: 'Pass' | 'Fail', commentTemplate: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.reviewId === reviewId) {
          return {
            ...r,
            workflow: {
              ...r.workflow,
              status: decision === 'Pass' ? 'GV Đồng ý' : 'GV Từ chối',
              teacherDecision: decision,
              teacherComment: commentTemplate,
              confirmedAt: new Date().toISOString()
            }
          };
        }
        return r;
      })
    );

    setToastMsg(`✅ Đã ghi nhận quyết định "${decision === 'Pass' ? 'ĐỒNG Ý PASS' : 'TỪ CHỐI PASS'}" cho hồ sơ #${reviewId}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const pendingCount = reviews.filter((r) => r.workflow.status === 'Chờ GV' || r.workflow.status === 'Quá hạn → Lead').length;
  const overdueCount = reviews.filter((r) => r.workflow.isOverdue && (r.workflow.status === 'Chờ GV' || r.workflow.status === 'Quá hạn → Lead')).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-sm animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Review Center Banner & SLA Warning */}
      <div className="glass-panel rounded-2xl p-6 border border-[#DB0829]/40 bg-gradient-to-r from-[#DB0829]/20 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#DB0829]/20 text-[#DB0829] font-mono font-bold text-xs border border-[#DB0829]/30">
            <Award className="w-3.5 h-3.5" /> Decision Support System (Hỗ trợ ra quyết định)
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Xét duyệt Pass Mềm (Soft Pass Review Center)
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Học viên không đạt Pass chuẩn nhưng có tinh thần học tập tốt (Nhóm 1: ĐH 100%, BTVN 100% hoặc Nhóm 2: Test 55-60) sẽ được đưa vào đây. GVCN có thời hạn <b className="text-white">7 ngày (SLA)</b> để xác nhận Pass hay Từ chối.
          </p>
        </div>

        {/* SLA Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 shrink-0">
          <div className="text-center px-3 border-r border-slate-800">
            <p className="text-[10px] uppercase text-slate-400 font-bold">Chờ xử lý</p>
            <p className="text-2xl font-extrabold text-[#DB0829] font-mono">{pendingCount}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400 inline" /> Quá hạn SLA
            </p>
            <p className={`text-2xl font-extrabold font-mono ${overdueCount > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
              {overdueCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedGroup === 'all' ? 'bg-[#DB0829] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Tất cả hồ sơ ({reviews.length})
          </button>
          <button
            onClick={() => setSelectedGroup('Nhóm 1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedGroup === 'Nhóm 1' ? 'bg-[#DB0829] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Nhóm 1 (ĐH 100% + BTVN 100%)
          </button>
          <button
            onClick={() => setSelectedGroup('Nhóm 2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedGroup === 'Nhóm 2' ? 'bg-[#DB0829] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌟 Nhóm 2 (Test 55-60)
          </button>
          <button
            onClick={() => setSelectedGroup('overdue')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedGroup === 'overdue' ? 'bg-red-600 text-white shadow-md' : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            🚨 Quá hạn SLA ({overdueCount})
          </button>
        </div>

        <p className="text-xs text-slate-400 italic">
          💡 Quy tắc: Chỉ Đồng ý Pass nếu học viên có thái độ nghiêm túc và bài thi cuối khóa có tiến bộ rõ ràng.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((r) => {
          const isCompleted = r.workflow.status === 'GV Đồng ý' || r.workflow.status === 'GV Từ chối';
          const sparkData = r.qualification.scoreHistory.map((val, idx) => ({ name: `T${idx + 1}`, score: val }));

          return (
            <div
              key={r.reviewId}
              className={`glass-panel rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isCompleted
                  ? 'border-slate-800 bg-slate-900/40 opacity-80'
                  : r.workflow.isOverdue
                  ? 'border-red-500/50 bg-gradient-to-br from-red-950/20 via-slate-900/90 to-slate-900'
                  : 'border-slate-800 hover:border-[#DB0829]/50 bg-slate-900/80 shadow-xl'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DB0829] to-amber-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                    {r.student.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      {r.student.fullName}
                      <span className="text-xs font-mono text-slate-400">#{r.student.studentCode}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{r.classInfo.className}</span>
                      <span>•</span>
                      <span>GV: {r.classInfo.teacherName}</span>
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="text-right shrink-0">
                  {r.workflow.status === 'GV Đồng ý' ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ĐÃ DUYỆT PASS
                    </span>
                  ) : r.workflow.status === 'GV Từ chối' ? (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> ĐÃ TỪ CHỐI
                    </span>
                  ) : r.workflow.isOverdue ? (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs inline-flex items-center gap-1 animate-pulse shadow-md shadow-red-600/30">
                      <ShieldAlert className="w-3.5 h-3.5" /> QUÁ HẠN → LEAD
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> CHỜ GV DUYỆT
                    </span>
                  )}
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Deadline: {new Date(r.workflow.deadline).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Card Body: Qualification & Journey Timeline */}
              <div className="p-5 space-y-4">
                {/* Qualification Title Badge */}
                <div className="p-3 rounded-xl bg-[#DB0829]/15 border border-[#DB0829]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                    <Award className="w-4 h-4 text-[#DB0829] shrink-0" />
                    <span>{r.qualification.reasonTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#DB0829] text-white font-mono font-bold text-[11px]">
                    {r.qualification.passMemGroup}
                  </span>
                </div>

                {/* Stats & Mini Timeline Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-center border-r border-slate-800/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">TB Test</span>
                    <p className="text-lg font-extrabold font-mono text-slate-100 mt-0.5">{r.qualification.testAverage}</p>
                  </div>
                  <div className="text-center border-r border-slate-800/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Chuyên cần</span>
                    <p className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">{r.qualification.attendancePct}%</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Bài tập VN</span>
                    <p className="text-lg font-extrabold font-mono text-emerald-400 mt-0.5">{r.qualification.homeworkPct}%</p>
                  </div>
                </div>

                {/* Journey Timeline Chart (Expanded Full Height) */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span>📈 Lịch sử tiến độ thi qua từng bài (Student Journey Timeline):</span>
                    <span className="font-mono text-emerald-400 font-bold">● {r.qualification.trendDirection === 'improving' ? 'Xu hướng tiến bộ' : 'Duy trì ổn định'}</span>
                  </div>
                  <div className="h-44 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '12px' }}
                          labelFormatter={(l) => `Bài thi: ${l}`}
                        />
                        <Line type="monotone" dataKey="score" stroke="#DB0829" strokeWidth={3} dot={{ r: 5, fill: '#DB0829', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} name="Điểm số" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions & Teacher Notes */}
              <div className="p-5 bg-slate-950 border-t border-slate-800/80">
                {isCompleted ? (
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Quyết định: <b className={r.workflow.status === 'GV Đồng ý' ? 'text-emerald-400' : 'text-red-400'}>{r.workflow.teacherDecision}</b></span>
                    <span>Lý do: <i>"{r.workflow.teacherComment}"</i></span>
                  </div>
                ) : (
                  /* Action Area: Form */
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>📝 Nhận xét:</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Nhận xét của giáo viên (Không bắt buộc)..."
                        value={teacherNotes[r.reviewId] || ''}
                        onChange={(e) => setTeacherNotes((prev) => ({ ...prev, [r.reviewId]: e.target.value }))}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#DB0829] transition-all resize-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Thái độ học tập (Quyết định Pass/Fail):
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button
                          onClick={() => setTeacherAttitude(prev => ({ ...prev, [r.reviewId]: 'Có tiến bộ' }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            teacherAttitude[r.reviewId] === 'Có tiến bộ' 
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' 
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
                          }`}
                        >
                          Có tiến bộ
                        </button>
                        <button
                          onClick={() => setTeacherAttitude(prev => ({ ...prev, [r.reviewId]: 'Không rõ' }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            teacherAttitude[r.reviewId] === 'Không rõ' 
                              ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30' 
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'
                          }`}
                        >
                          Không rõ
                        </button>
                        <button
                          onClick={() => setTeacherAttitude(prev => ({ ...prev, [r.reviewId]: 'Không' }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            teacherAttitude[r.reviewId] === 'Không' 
                              ? 'bg-slate-600 text-white border-slate-500 shadow-md shadow-slate-600/30' 
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500/50 hover:bg-slate-800'
                          }`}
                        >
                          Không
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          const att = teacherAttitude[r.reviewId];
                          if (!att) {
                            alert('⚠️ Vui lòng chọn Thái độ học tập trước khi Gửi Quyết Định!');
                            return;
                          }
                          const note = teacherNotes[r.reviewId]?.trim() || 'Không có nhận xét';
                          const decision = att === 'Có tiến bộ' ? 'Pass' : 'Fail';
                          handleQuickDecision(r.reviewId, decision, `Thái độ: ${att} | Ghi chú: ${note}`);
                        }}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-2 mt-2"
                      >
                        Gửi Quyết Định (Trigger N8N)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

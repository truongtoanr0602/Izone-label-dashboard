import React, { useEffect, useState } from 'react';
import {
  X, Check, Copy, Send, MessageCircle, MessageSquare, TrendingUp, Compass, Settings, Plus, Pencil, Trash2,
} from 'lucide-react';
import type { ContactLog, ContactTrigger, StudentDetail } from '../../data/types';
import { closingContact, matchesTrigger } from '../../data/selectors';
import { LABEL_TEXT, TRIGGER_DONE_TEXT } from '../../data/labels';
import { buildZaloMessage } from '../../data/messageScripts';
import {
  getMetricPlaceholderWarning,
  getUnsupportedPlaceholders,
  renderMessageTemplate,
  TEMPLATE_VARIABLES,
  type MessageTemplate,
  type MessageTemplateInput,
} from '../../data/messageTemplates';
import { ContactTickButton } from '../common/ContactTickButton';

/**
 * Một modal cho cả ba luồng.
 *
 * Trước đây là ba component gần như giống hệt nhau (CallParentModal,
 * RelearnAdviceModal, ZaloRemindModal) chỉ khác bộ lọc, nội dung kịch bản và
 * màu. Khi nghiệp vụ chốt rằng GV không gọi phụ huynh mà chỉ nhắn Zalo cho học
 * viên, cả ba quy về đúng một thao tác — copy tin, mở Zalo, tick — nên giữ ba
 * bản sao chỉ là ba chỗ để chúng lệch nhau.
 */
const GROUP: Record<
  ContactTrigger,
  {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    /** Viền + nền của huy hiệu số lượng, theo mức ưu tiên. */
    accent: string;
    emptyText: string;
  }
> = {
  habit_reminder: {
    title: 'Mức 1 · Nhắc chăm học',
    subtitle: 'Đi học hoặc BTVN dưới 90% — chưa đủ điều kiện pass đầu ra. Nhắc nhở giải quyết được.',
    icon: <MessageSquare className="w-5 h-5" />,
    accent: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    emptyText: 'Tuyệt vời! Cả lớp đều đạt đi học và BTVN từ 90%.',
  },
  red_followup: {
    title: 'Mức 2 · Cần theo sát',
    subtitle: 'Nhãn Đỏ — TB test 45–59, dưới ngưỡng đạt nhưng còn cứu được. Tin nhắn động viên.',
    icon: <TrendingUp className="w-5 h-5" />,
    accent: 'bg-red-500/10 border-red-500/20 text-red-500',
    emptyText: 'Lớp không có học viên nào ở nhãn Đỏ.',
  },
  relearn_advice: {
    title: 'Mức 3 · Bàn lại lộ trình',
    subtitle: 'Nhãn Xám — TB test <45. Nhắc nhở không đủ; cần mở lời trao đổi về lộ trình học.',
    icon: <Compass className="w-5 h-5" />,
    accent: 'bg-slate-500/10 border-slate-500/25 text-slate-600 dark:text-slate-400',
    emptyText: 'Lớp không có học viên nào ở nhãn Xám.',
  },
};

interface ZaloRemindModalProps {
  /** `null` = đóng. Luồng đang mở quyết định bộ lọc, kịch bản và màu. */
  trigger: ContactTrigger | null;
  onClose: () => void;
  students: StudentDetail[];
  className: string;
  teacherName: string;
  contactLogs: ContactLog[];
  checkpoint: string;
  onMarkContacted: (trigger: ContactTrigger, student: StudentDetail) => void;
  onUndoContacted: (trigger: ContactTrigger, student: StudentDetail) => void;
  templates: MessageTemplate[];
  onCreateTemplate: (input: MessageTemplateInput) => Promise<void>;
  onUpdateTemplate: (templateId: number, input: Pick<MessageTemplateInput, 'name' | 'body'>) => Promise<void>;
  onDeleteTemplate: (templateId: number) => Promise<void>;
}

export const ZaloRemindModal: React.FC<ZaloRemindModalProps> = ({
  trigger,
  onClose,
  students,
  className,
  teacherName,
  contactLogs,
  checkpoint,
  onMarkContacted,
  onUndoContacted,
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | 'system'>('system');
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => {
    setSelectedTemplateId('system');
    setIsManagingTemplates(false);
    setEditingTemplateId(null);
    setTemplateError(null);
  }, [trigger]);

  if (trigger === null) return null;

  const group = GROUP[trigger];
  const matched = students.filter((s) => matchesTrigger(s, trigger));
  const triggerTemplates = templates.filter((template) => template.trigger === trigger);
  const selectedTemplate = selectedTemplateId === 'system'
    ? undefined
    : triggerTemplates.find((template) => template.templateId === selectedTemplateId);

  const messageFor = (student: StudentDetail) => selectedTemplate
    ? renderMessageTemplate(selectedTemplate.body, {
      studentName: student.fullName,
      className,
      teacherName,
      attendance: student.attendance.percentage,
      homework: student.homework.percentage,
      averageScore: student.testPerformance.averageScore,
    })
    : buildZaloMessage(trigger, student, teacherName, className);

  const handleCopy = (s: StudentDetail) => {
    navigator.clipboard.writeText(messageFor(s));
    setCopiedId(s.studentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewTemplate = () => {
    setEditingTemplateId(null);
    setDraftName('');
    setDraftBody('');
    setTemplateError(null);
  };

  const startEditingTemplate = (template: MessageTemplate) => {
    setEditingTemplateId(template.templateId);
    setDraftName(template.name);
    setDraftBody(template.body);
    setTemplateError(null);
  };

  const saveTemplate = async () => {
    const unknown = getUnsupportedPlaceholders(draftBody);
    if (unknown.length > 0) {
      setTemplateError(`Biến không được hỗ trợ: ${unknown.join(', ')}`);
      return;
    }
    setIsSavingTemplate(true);
    setTemplateError(null);
    try {
      if (editingTemplateId === null) {
        await onCreateTemplate({ name: draftName, trigger, body: draftBody });
      } else {
        await onUpdateTemplate(editingTemplateId, { name: draftName, body: draftBody });
      }
      setEditingTemplateId(null);
      setDraftName('');
      setDraftBody('');
    } catch (error) {
      console.error('Failed to save message template', error);
      setTemplateError('Không thể lưu mẫu lúc này. Vui lòng thử lại.');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const deleteTemplate = async (templateId: number) => {
    if (!window.confirm('Xóa template này? Thao tác không thể hoàn tác.')) return;
    try {
      await onDeleteTemplate(templateId);
      if (selectedTemplateId === templateId) setSelectedTemplateId('system');
      if (editingTemplateId === templateId) startNewTemplate();
    } catch (error) {
      console.error('Failed to delete message template', error);
      setTemplateError('Không thể xóa mẫu lúc này. Vui lòng thử lại.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-[16px] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)] overflow-hidden bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-[12px] border flex items-center justify-center shrink-0 ${group.accent}`}>
              {group.icon}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#404040] dark:text-[#e4e4e7] flex flex-wrap items-center gap-2">
                {group.title}
                <span className="text-xs font-mono text-[#404040]/60 dark:text-[#a1a1aa]">
                  {matched.length} Học viên
                </span>
              </h2>
              <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa]">{group.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[8px] text-[#404040]/50 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <section className="p-4 rounded-[12px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#404040] dark:text-[#e4e4e7]">Mẫu tin nhắn</p>
                <p className="text-[11px] text-[#404040]/60 dark:text-[#a1a1aa]">Chọn mẫu trước khi copy cho học viên.</p>
              </div>
              <button
                onClick={() => {
                  setIsManagingTemplates((current) => !current);
                  if (!isManagingTemplates) startNewTemplate();
                }}
                className="px-3 py-2 rounded-[8px] border border-[#e5e7eb] dark:border-[#52525b] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46]"
              >
                <Settings className="w-3.5 h-3.5" /> Quản lý mẫu
              </button>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value === 'system' ? 'system' : Number(event.target.value))}
              className="w-full px-3 py-2 rounded-[8px] border border-[#e5e7eb] dark:border-[#52525b] bg-white dark:bg-[#18181b] text-xs"
            >
              <option value="system">Mẫu hệ thống</option>
              {triggerTemplates.map((template) => (
                <option key={template.templateId} value={template.templateId}>{template.name}</option>
              ))}
            </select>

            {isManagingTemplates && (
              <div className="pt-3 border-t border-[#f3f4f6] dark:border-[#3f3f46] space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold">{editingTemplateId === null ? 'Tạo template mới' : 'Chỉnh sửa template'}</p>
                  <button onClick={startNewTemplate} className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Mẫu mới</button>
                </div>
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Tên mẫu, ví dụ: Nhắc BTVN thân thiện"
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#e5e7eb] dark:border-[#52525b] bg-white dark:bg-[#18181b] text-xs"
                />
                <textarea
                  value={draftBody}
                  onChange={(event) => setDraftBody(event.target.value)}
                  placeholder="{{ten}} ơi, ..."
                  maxLength={5000}
                  rows={6}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#e5e7eb] dark:border-[#52525b] bg-white dark:bg-[#18181b] text-xs leading-relaxed resize-y"
                />
                <div className="text-[11px] text-[#404040]/60 dark:text-[#a1a1aa] flex flex-wrap gap-x-3 gap-y-1">
                  {TEMPLATE_VARIABLES.map((variable) => <span key={variable.token}><b>{variable.token}</b> = {variable.label}</span>)}
                </div>
                {getMetricPlaceholderWarning(draftBody) && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">{getMetricPlaceholderWarning(draftBody)}</p>
                )}
                {templateError && <p className="text-[11px] text-red-600 dark:text-red-400">{templateError}</p>}
                <div className="flex justify-end">
                  <button
                    onClick={saveTemplate}
                    disabled={isSavingTemplate}
                    className="px-3 py-2 rounded-[8px] bg-[#DB0829] text-white text-xs font-semibold disabled:opacity-60"
                  >
                    {isSavingTemplate ? 'Đang lưu...' : 'Lưu template'}
                  </button>
                </div>
                {triggerTemplates.length > 0 && (
                  <div className="space-y-2">
                    {triggerTemplates.map((template) => (
                      <div key={template.templateId} className="flex items-center justify-between gap-3 p-2 rounded-[8px] bg-[#f3f4f6] dark:bg-[#18181b]">
                        <span className="text-xs font-medium truncate">{template.name}</span>
                        <span className="flex gap-2 shrink-0">
                          <button onClick={() => startEditingTemplate(template)} title="Sửa template" className="text-blue-600 dark:text-blue-400"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteTemplate(template.templateId)} title="Xóa template" className="text-red-600 dark:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
          {matched.length === 0 ? (
            <div className="text-center py-8 text-[#404040]/50 dark:text-[#71717a]">
              <Check className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-[#404040] dark:text-[#e4e4e7]">{group.emptyText}</p>
            </div>
          ) : (
            matched.map((s) => {
              const closedBy = closingContact(contactLogs, s.studentId, trigger, checkpoint);
              const contacted = closedBy?.trigger === trigger;
              const coveredByText =
                closedBy && !contacted ? TRIGGER_DONE_TEXT[closedBy.trigger] : undefined;

              return (
                <div
                  key={s.studentId}
                  className="p-4 rounded-[12px] bg-[#f3f4f6] dark:bg-[#18181b] border border-[#f3f4f6] dark:border-[#3f3f46] hover:border-[#e5e7eb] dark:hover:border-[#52525b] transition-all space-y-3"
                >
                  {/* Tên + chỉ số + kênh gửi */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#404040] dark:text-[#e4e4e7] flex flex-wrap items-center gap-2">
                        {s.fullName}
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#404040]/5 dark:bg-[#3f3f46] text-[#404040]/60 dark:text-[#a1a1aa] border border-[#e5e7eb] dark:border-[#52525b] font-semibold uppercase">
                          {LABEL_TEXT[s.labeling.currentLabel]}
                        </span>
                      </h4>
                      <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex flex-wrap items-center gap-2">
                        <span>ĐH: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.attendance.percentage === null ? '—' : `${s.attendance.percentage}%`}</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>BTVN: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.homework.percentage === null ? '—' : `${s.homework.percentage}%`}</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>TB Test: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.testPerformance.averageScore ?? '--'}</b></span>
                        <span className="text-[#404040]/30 dark:text-[#52525b]">•</span>
                        <span>Zalo: <b className="text-[#404040] dark:text-[#e4e4e7] font-mono">{s.phone}</b></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(s)}
                        className={`px-3 py-2 rounded-[8px] text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          copiedId === s.studentId
                            ? 'bg-transparent border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                            : 'bg-transparent border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95'
                        }`}
                      >
                        {copiedId === s.studentId ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Đã copy tin nhắn
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy tin nhắn
                          </>
                        )}
                      </button>
                      <a
                        href={`https://zalo.me/${s.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-[8px] bg-transparent border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Mở chat Zalo web với học viên"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/*
                    Hiện NGUYÊN VĂN tin sẽ được copy, không phải bản tóm tắt.
                    GV đang gửi chữ này cho một học sinh thật — họ phải đọc được
                    đúng thứ mình sắp gửi trước khi bấm, nhất là với nhóm Xám.
                  */}
                  <pre className="p-3 rounded-[8px] bg-white dark:bg-[#27272a] border border-[#f3f4f6] dark:border-[#3f3f46] text-[11px] leading-relaxed text-[#404040]/80 dark:text-[#a1a1aa] whitespace-pre-wrap font-sans border-l-2 border-l-blue-500">
                    {messageFor(s)}
                  </pre>

                  <div className="flex items-center justify-end border-t border-[#f3f4f6] dark:border-[#3f3f46] pt-3">
                    <ContactTickButton
                      contacted={contacted}
                      coveredByText={coveredByText}
                      checkpoint={checkpoint}
                      onMark={() => onMarkContacted(trigger, s)}
                      onUndo={() => onUndoContacted(trigger, s)}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f3f4f6] dark:bg-[#18181b] border-t border-[#f3f4f6] dark:border-[#3f3f46] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-[#475569] dark:text-[#a1a1aa]" />
            <b className="text-[#404040] dark:text-[#e4e4e7]">Lưu ý:</b> Gửi xong bấm "Đã liên hệ" — xác
            nhận gắn với mốc <b className="text-[#404040] dark:text-[#e4e4e7]">{checkpoint}</b>, sang bài
            test sau sẽ được hỏi lại.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[12px] bg-[#404040]/10 dark:bg-[#3f3f46] hover:bg-[#404040]/15 dark:hover:bg-[#52525b] text-[#404040] dark:text-[#e4e4e7] font-semibold text-xs transition-colors shrink-0"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};

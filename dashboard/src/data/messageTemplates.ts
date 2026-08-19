import type { ContactTrigger } from './types';

export interface MessageTemplate {
  templateId: number;
  name: string;
  trigger: ContactTrigger;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplateInput {
  name: string;
  trigger: ContactTrigger;
  body: string;
}

export interface MessageTemplateContext {
  studentName: string;
  className: string;
  teacherName: string;
  attendance: number | null;
  homework: number | null;
  averageScore: number | null;
}

export const TEMPLATE_VARIABLES = [
  { token: '{{ten}}', label: 'Họ và tên học viên' },
  { token: '{{lop}}', label: 'Tên lớp' },
  { token: '{{giao_vien}}', label: 'Tên giáo viên' },
  { token: '{{di_hoc}}', label: 'Tỷ lệ đi học' },
  { token: '{{btvn}}', label: 'Tỷ lệ BTVN' },
  { token: '{{diem_tb}}', label: 'Điểm trung bình test' },
] as const;

const SUPPORTED_TOKENS: Set<string> = new Set(TEMPLATE_VARIABLES.map((variable) => variable.token));
const PLACEHOLDER_PATTERN = /{{\s*[^{}]+\s*}}/g;

function metric(value: number | null): string {
  return value === null ? '—' : `${value}%`;
}

export function renderMessageTemplate(body: string, context: MessageTemplateContext): string {
  const values: Record<string, string> = {
    '{{ten}}': context.studentName,
    '{{lop}}': context.className,
    '{{giao_vien}}': context.teacherName,
    '{{di_hoc}}': metric(context.attendance),
    '{{btvn}}': metric(context.homework),
    '{{diem_tb}}': context.averageScore === null ? '—' : String(context.averageScore),
  };

  return body.replace(PLACEHOLDER_PATTERN, (token) => values[token] ?? token);
}

export function getUnsupportedPlaceholders(body: string): string[] {
  return [...new Set(body.match(PLACEHOLDER_PATTERN) ?? [])].filter(
    (token) => !SUPPORTED_TOKENS.has(token),
  );
}

export function getMetricPlaceholderWarning(body: string): string | null {
  const missing = ['{{di_hoc}}', '{{btvn}}'].filter((token) => !body.includes(token));
  if (missing.length === 0) return null;

  return `Mẫu chưa có ${missing.map((token) => (token === '{{di_hoc}}' ? 'ĐH' : 'BTVN')).join(' và ')}. Bạn vẫn có thể lưu, nhưng nên nêu số liệu để học viên hiểu rõ.`;
}

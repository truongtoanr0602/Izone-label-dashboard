import { describe, expect, it } from 'vitest';
import {
  getMetricPlaceholderWarning,
  getUnsupportedPlaceholders,
  renderMessageTemplate,
} from './messageTemplates';

describe('renderMessageTemplate', () => {
  it('replaces supported placeholders with the student context', () => {
    expect(
      renderMessageTemplate(
        '{{ten}} ơi, lớp {{lop}}: ĐH {{di_hoc}}, BTVN {{btvn}}, TB {{diem_tb}}. — {{giao_vien}}',
        {
          studentName: 'Nguyễn Đức Anh',
          className: 'IC2230',
          teacherName: 'Ngọc Anh',
          attendance: 92,
          homework: 88,
          averageScore: 63.5,
        },
      ),
    ).toBe('Nguyễn Đức Anh ơi, lớp IC2230: ĐH 92%, BTVN 88%, TB 63.5. — Ngọc Anh');
  });

  it('renders missing metrics as a dash rather than null text', () => {
    expect(
      renderMessageTemplate('{{ten}}: {{di_hoc}} / {{btvn}} / {{diem_tb}}', {
        studentName: 'Lê Minh',
        className: 'IC2230',
        teacherName: 'Ngọc Anh',
        attendance: null,
        homework: null,
        averageScore: null,
      }),
    ).toBe('Lê Minh: — / — / —');
  });
});

describe('template validation helpers', () => {
  it('finds unsupported placeholders before a template is saved', () => {
    expect(getUnsupportedPlaceholders('Chào {{ten}}, {{diem_moi}} nhé')).toEqual(['{{diem_moi}}']);
  });

  it('warns but does not reject a template that omits attendance or homework', () => {
    expect(getMetricPlaceholderWarning('Chào {{ten}}, cô muốn trao đổi về điểm {{diem_tb}}.')).toContain('ĐH');
  });
});

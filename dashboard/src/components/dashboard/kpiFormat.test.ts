import { describe, expect, it } from 'vitest';
import { formatAttritionNote, formatComparisonNote, formatDelta, formatPassNote, formatReportingNote, formatTestNote, formatValue, passTooltipCopy } from './kpiFormat';
import type { MetricDelta } from '../../data/selectors';

const delta = (over: Partial<MetricDelta> = {}): MetricDelta => ({
  value: 0,
  comparableClasses: 12,
  totalClasses: 15,
  ...over,
});

describe('passTooltipCopy', () => {
  it('describes test-only standard pass and only two soft-pass groups', () => {
    const copy = passTooltipCopy();

    expect(copy.standard).toContain('TB test ≥60');
    expect(copy.standard).not.toContain('Điểm danh');
    expect(copy.standard).not.toContain('BTVN');
    expect(copy.soft).toHaveLength(2);
    expect(copy.soft.join(' ')).not.toContain('Nhóm 3');
  });
});

describe('formatValue', () => {
  it('định dạng phần trăm một chữ số thập phân', () => {
    expect(formatValue(95.24, 'percent')).toBe('95.2%');
  });

  it('định dạng số đếm không thập phân', () => {
    expect(formatValue(4, 'count')).toBe('4');
  });

  it('hiện gạch ngang chứ KHÔNG hiện 0 khi chưa có dữ liệu', () => {
    expect(formatValue(null, 'percent')).toBe('—');
    expect(formatValue(null, 'count')).toBe('—');
  });
});

describe('formatDelta', () => {
  it('giảm ở chỉ số càng-cao-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: -2.1 }), true, 'percent');
    expect(result.text).toBe('▼2.1 %');
    expect(result.tone).toBe('down');
    expect(result.isGood).toBe(false);
  });

  it('tăng ở chỉ số càng-cao-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: 3.4 }), true, 'percent');
    expect(result.text).toBe('▲3.4 %');
    expect(result.isGood).toBe(true);
  });

  it('tăng ở chỉ số càng-thấp-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: 2 }), false, 'percent');
    expect(result.tone).toBe('up');
    expect(result.isGood).toBe(false);
  });

  it('giảm ở chỉ số càng-thấp-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: -3 }), false, 'percent');
    expect(result.text).toBe('▼3.0 %');
    expect(result.tone).toBe('down');
    expect(result.isGood).toBe(true);
  });

  it('không đổi thì trung tính', () => {
    const result = formatDelta(delta({ value: 0 }), true, 'percent');
    expect(result.text).toBe('không đổi');
    expect(result.tone).toBe('flat');
    expect(result.isGood).toBeNull();
  });

  it('không so sánh được thì nói rõ, không suy ra 0', () => {
    const result = formatDelta(delta({ value: null, comparableClasses: 0 }), true, 'percent');
    expect(result.text).toBe('chưa so sánh được');
    expect(result.tone).toBe('unknown');
    expect(result.isGood).toBeNull();
  });

  it('định dạng số HV với đơn vị count', () => {
    const result = formatDelta(delta({ value: 2.4 }), true, 'count');
    expect(result.text).toBe('▲2 HV');
    expect(result.isGood).toBe(true);
  });

  it('đếm SỰ KIỆN thì ghi "lượt", không ghi "HV"', () => {
    // Một HV đổi nhãn hai lần là hai lượt nhưng vẫn một người.
    const result = formatDelta(delta({ value: -7 }), true, 'event');
    expect(result.text).toBe('▼7 lượt');
    expect(result.tone).toBe('down');
  });
});

describe('formatComparisonNote', () => {
  it('nêu rõ thay đổi so với trung bình tháng trước', () => {
    expect(formatComparisonNote(delta({ totalClasses: 15 })))
      .toBe('thay đổi so với trung bình tháng trước');
  });

  it('nêu lý do khi không có lớp nào trong kỳ', () => {
    expect(formatComparisonNote(delta({ totalClasses: 0 })))
      .toBe('thay đổi: không có lớp nào trong kỳ');
  });

  it('luôn tự nói rõ nó mô tả DELTA, vì thẻ KPI hiện hai dòng mẫu số cạnh nhau', () => {
    // Dòng này nằm ngay dưới dòng mẫu số của giá trị lớn; thiếu chữ "thay đổi"
    // thì hai mẫu số khác tập lớp hiện ra như thể cùng một mẫu số.
    for (const d of [
      delta({ totalClasses: 10 }),
      delta({ totalClasses: 0 }),
    ]) {
      expect(formatComparisonNote(d)).toContain('thay đổi');
    }
  });
});

describe('formatAttritionNote', () => {
  it('tách tỷ lệ attrition khỏi số học viên bỏ học trong tháng', () => {
    expect(formatAttritionNote({ rate: 1.8, newDroppedStudents: 4 }))
      .toBe('Tỷ lệ attrition: 1.8%');
  });

  it('không biến thiếu mẫu số thành tỷ lệ 0%', () => {
    expect(formatAttritionNote({ rate: null, newDroppedStudents: 0 }))
      .toBe('Tỷ lệ attrition: chưa đủ dữ liệu');
  });
});

describe('formatReportingNote', () => {
  it('nói rõ số lớp báo cáo và số HV có dữ liệu', () => {
    expect(formatReportingNote({ classesReported: 17, totalClasses: 17, sampleSize: 228 }))
      .toBe('17/17 lớp · 228 HV có dữ liệu');
  });

  it('không giấu việc chưa lớp nào báo cáo', () => {
    expect(formatReportingNote({ classesReported: 0, totalClasses: 17, sampleSize: 0 }))
      .toBe('chưa lớp nào có dữ liệu');
  });
});

describe('formatTestNote', () => {
  it('đếm học viên đã thi, không đếm sĩ số', () => {
    expect(formatTestNote({ classesWithTests: 15, totalClasses: 17, sampleSize: 196 }))
      .toBe('15/17 lớp có test · 196 HV đã thi');
  });

  it('nói rõ khi chưa lớp nào thi', () => {
    expect(formatTestNote({ classesWithTests: 0, totalClasses: 17, sampleSize: 0 }))
      .toBe('chưa lớp nào có bài test');
  });
});

describe('formatPassNote', () => {
  it('shows the independent numerator over the tested-student denominator', () => {
    expect(formatPassNote({
      qualifiedStudents: 9,
      sampleSize: 40,
      classesWithTests: 15,
      totalClasses: 17,
    })).toBe('9/40 HV đã thi · 15/17 lớp có test');
  });

  it('does not invent a pass count when no class has a test', () => {
    expect(formatPassNote({
      qualifiedStudents: 0,
      sampleSize: 0,
      classesWithTests: 0,
      totalClasses: 17,
    })).toBe('chưa lớp nào có bài test');
  });
});

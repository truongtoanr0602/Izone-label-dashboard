import { describe, expect, it } from 'vitest';
import { formatAttritionNote, formatComparisonNote, formatDelta, formatValue } from './kpiFormat';
import type { MetricDelta } from '../../data/selectors';

const delta = (over: Partial<MetricDelta> = {}): MetricDelta => ({
  value: 0,
  comparableClasses: 12,
  totalClasses: 15,
  ...over,
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
    expect(result.text).toBe('▼2.1 điểm');
    expect(result.tone).toBe('down');
    expect(result.isGood).toBe(false);
  });

  it('tăng ở chỉ số càng-cao-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: 3.4 }), true, 'percent');
    expect(result.text).toBe('▲3.4 điểm');
    expect(result.isGood).toBe(true);
  });

  it('tăng ở chỉ số càng-thấp-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: 2 }), false, 'percent');
    expect(result.tone).toBe('up');
    expect(result.isGood).toBe(false);
  });

  it('giảm ở chỉ số càng-thấp-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: -3 }), false, 'percent');
    expect(result.text).toBe('▼3.0 điểm');
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
  it('nêu rõ mẫu số khi không phải mọi lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 12, totalClasses: 15 })))
      .toBe('thay đổi tính trên 12/15 lớp so sánh được');
  });

  it('nói gọn khi toàn bộ lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 15, totalClasses: 15 })))
      .toBe('thay đổi tính trên toàn bộ 15 lớp so sánh được');
  });

  it('nêu lý do khi không lớp nào so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 0, totalClasses: 15 })))
      .toBe('thay đổi: không có lớp nào so sánh được giữa hai kỳ');
  });

  it('luôn tự nói rõ nó mô tả DELTA, vì thẻ KPI hiện hai dòng mẫu số cạnh nhau', () => {
    // Dòng này nằm ngay dưới dòng mẫu số của giá trị lớn; thiếu chữ "thay đổi"
    // thì hai mẫu số khác tập lớp hiện ra như thể cùng một mẫu số.
    for (const d of [
      delta({ comparableClasses: 3, totalClasses: 10 }),
      delta({ comparableClasses: 10, totalClasses: 10 }),
      delta({ comparableClasses: 0, totalClasses: 10 }),
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

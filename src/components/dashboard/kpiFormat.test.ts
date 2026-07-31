import { describe, expect, it } from 'vitest';
import { formatComparisonNote, formatDelta, formatValue } from './kpiFormat';
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
    const result = formatDelta(delta({ value: -2.1 }), true);
    expect(result.text).toBe('▼2.1 điểm');
    expect(result.tone).toBe('down');
    expect(result.isGood).toBe(false);
  });

  it('tăng ở chỉ số càng-cao-càng-tốt là tốt', () => {
    const result = formatDelta(delta({ value: 3.4 }), true);
    expect(result.text).toBe('▲3.4 điểm');
    expect(result.isGood).toBe(true);
  });

  it('tăng ở chỉ số càng-thấp-càng-tốt là xấu', () => {
    const result = formatDelta(delta({ value: 2 }), false);
    expect(result.tone).toBe('up');
    expect(result.isGood).toBe(false);
  });

  it('không đổi thì trung tính', () => {
    const result = formatDelta(delta({ value: 0 }), true);
    expect(result.text).toBe('không đổi');
    expect(result.tone).toBe('flat');
    expect(result.isGood).toBeNull();
  });

  it('không so sánh được thì nói rõ, không suy ra 0', () => {
    const result = formatDelta(delta({ value: null, comparableClasses: 0 }), true);
    expect(result.text).toBe('chưa so sánh được');
    expect(result.tone).toBe('unknown');
    expect(result.isGood).toBeNull();
  });
});

describe('formatComparisonNote', () => {
  it('nêu rõ mẫu số khi không phải mọi lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 12, totalClasses: 15 })))
      .toBe('so sánh trên 12/15 lớp');
  });

  it('nói gọn khi toàn bộ lớp đều so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 15, totalClasses: 15 })))
      .toBe('so sánh trên toàn bộ 15 lớp');
  });

  it('nêu lý do khi không lớp nào so được', () => {
    expect(formatComparisonNote(delta({ comparableClasses: 0, totalClasses: 15 })))
      .toBe('không lớp nào có mặt ở cả hai kỳ');
  });
});

import { describe, expect, it } from 'vitest';
import { formatClassSchedule } from './scheduleFormat';

describe('formatClassSchedule', () => {
  it('formats and sorts a JSON-like weekday array', () => {
    expect(formatClassSchedule('[5,1]')).toBe('Thứ 2, Thứ 6');
  });

  it('formats comma-separated weekdays', () => {
    expect(formatClassSchedule('1,5')).toBe('Thứ 2, Thứ 6');
  });

  it('formats day 7 as Sunday', () => {
    expect(formatClassSchedule('[7]')).toBe('Chủ nhật');
  });

  it('formats legacy T-prefixed weekdays', () => {
    expect(formatClassSchedule('T2-T6')).toBe('Thứ 2, Thứ 6');
  });

  it('preserves an unrecognized schedule', () => {
    expect(formatClassSchedule('Ca tối')).toBe('Ca tối');
  });
});

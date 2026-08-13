import { describe, expect, it } from 'vitest';
import { buildMonthGrid, monthKey } from './monthYearPickerModel';

describe('monthYearPickerModel', () => {
  it('formats a zero-padded month key', () => {
    expect(monthKey(2026, 8)).toBe('2026-08');
    expect(monthKey(2025, 12)).toBe('2025-12');
  });

  it('marks the selected month and keeps past months enabled', () => {
    const months = buildMonthGrid(2026, '2026-07', '2026-08');

    expect(months).toHaveLength(12);
    expect(months[6]).toMatchObject({
      key: '2026-07',
      label: 'Tháng 7',
      selected: true,
      disabled: false,
    });
  });

  it('disables months after the current month', () => {
    const months = buildMonthGrid(2026, '2026-07', '2026-08');

    expect(months[7]).toMatchObject({ key: '2026-08', disabled: false });
    expect(months[8]).toMatchObject({ key: '2026-09', disabled: true });
  });

  it('keeps every month enabled in a past year', () => {
    expect(
      buildMonthGrid(2025, '2025-01', '2026-08').every(
        (month) => !month.disabled,
      ),
    ).toBe(true);
  });
});

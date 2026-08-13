import { emptyDashboardMetric, hasLeadPeriodData } from './period-data';

describe('hasLeadPeriodData', () => {
  it('returns false when all evidence belongs to an earlier month', () => {
    expect(
      hasLeadPeriodData(
        [{ snapshot_date: '2026-07-31' }],
        [{ record_date: '2026-07-31' }],
        '2026-08',
      ),
    ).toBe(false);
  });

  it('accepts snapshot or student evidence inside the selected month', () => {
    expect(
      hasLeadPeriodData([{ snapshot_date: '2026-08-01' }], [], '2026-08'),
    ).toBe(true);
    expect(
      hasLeadPeriodData([], [{ record_date: '2026-08-12' }], '2026-08'),
    ).toBe(true);
  });

  it('normalizes Date values returned by database clients', () => {
    expect(
      hasLeadPeriodData(
        [{ snapshot_date: new Date('2026-08-12T00:00:00.000Z') }],
        [],
        '2026-08',
      ),
    ).toBe(true);
  });
});

describe('emptyDashboardMetric', () => {
  it('uses null for unavailable values and zero only for sample counts', () => {
    expect(emptyDashboardMetric(17)).toEqual({
      value: null,
      baselineValue: null,
      delta: null,
      direction: 'unknown',
      sampleSize: 0,
      classesReported: 0,
      comparableClasses: 0,
      totalClasses: 17,
    });
  });
});

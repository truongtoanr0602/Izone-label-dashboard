import { selectLabelMetricRow } from './label-metric-selection';

describe('selectLabelMetricRow', () => {
  const rows = [
    {
      class_id: 1141,
      record_date: '2026-08-17',
      record_count: 1,
      label_red: 0,
      label_yellow: 0,
      label_no_data: 1,
    },
    {
      class_id: 1141,
      record_date: '2026-08-14',
      record_count: 10,
      label_red: 5,
      label_yellow: 4,
      label_no_data: 1,
    },
  ];

  it('prefers the newest row covering at least 80% of the active roster', () => {
    expect(selectLabelMetricRow(rows, 1141, '2026-08-24', 10)).toMatchObject({
      record_date: '2026-08-14',
      label_red: 5,
      label_yellow: 4,
    });
  });

  it('falls back to the highest-coverage row when none reaches 80%', () => {
    expect(selectLabelMetricRow(rows, 1141, '2026-08-24', 20)).toMatchObject({
      record_date: '2026-08-14',
    });
  });
});

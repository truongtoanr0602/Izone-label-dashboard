import { resolveCountMetric } from './student-metrics';

describe('resolveCountMetric', () => {
  it.each([
    [{ done: 0, total: 1, sourcePercentage: 0 }, 0],
    [{ done: 2, total: 3, sourcePercentage: 66.67 }, 66.7],
    [{ done: 19, total: 20, sourcePercentage: 95 }, 95],
  ])(
    'calculates the displayed percentage from authoritative counts',
    (input, expected) => {
      expect(resolveCountMetric(input)).toEqual({
        percentage: expected,
        sourceMismatch: false,
        invalidCounts: false,
      });
    },
  );

  it('returns no measurement when the denominator is zero', () => {
    expect(
      resolveCountMetric({ done: 0, total: 0, sourcePercentage: 100 }),
    ).toEqual({
      percentage: null,
      sourceMismatch: true,
      invalidCounts: false,
    });
  });

  it.each([
    { done: -1, total: 2, sourcePercentage: 0 },
    { done: 3, total: 2, sourcePercentage: 100 },
    { done: 1, total: -2, sourcePercentage: 50 },
  ])('rejects impossible count pairs', (input) => {
    expect(resolveCountMetric(input)).toEqual({
      percentage: null,
      sourceMismatch: false,
      invalidCounts: true,
    });
  });

  it('flags a source percentage that disagrees with the counts', () => {
    expect(
      resolveCountMetric({ done: 7, total: 7, sourcePercentage: 37.5 }),
    ).toEqual({
      percentage: 100,
      sourceMismatch: true,
      invalidCounts: false,
    });
  });
});

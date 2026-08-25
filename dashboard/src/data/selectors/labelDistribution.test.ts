import { describe, expect, it } from 'vitest';
import {
  aggregateContactCoverage,
  aggregateLabelDistribution,
  classesWithTestLabels,
  labelDistributionChartHeight,
} from './labelDistribution';

describe('classesWithTestLabels', () => {
  it('removes classes that have no yellow, red, or grey labels', () => {
    const classes = [
      { className: 'IC2271', labelDistribution: { yellow: 0, red: 0, grey: 0 } },
      { className: 'IC2208', labelDistribution: { yellow: 13, red: 0, grey: 1 } },
    ];

    expect(classesWithTestLabels(classes)).toEqual([classes[1]]);
  });

  it('keeps a class when any displayed label count is positive', () => {
    const classes = [
      { className: 'Yellow', labelDistribution: { yellow: 1, red: 0, grey: 0 } },
      { className: 'Red', labelDistribution: { yellow: 0, red: 1, grey: 0 } },
      { className: 'Grey', labelDistribution: { yellow: 0, red: 0, grey: 1 } },
    ];

    expect(classesWithTestLabels(classes)).toEqual(classes);
  });
});

describe('labelDistributionChartHeight', () => {
  it('keeps a readable minimum height for a short class list', () => {
    expect(labelDistributionChartHeight(3)).toBe(280);
  });

  it('allocates one 20px row per class when the list is long', () => {
    expect(labelDistributionChartHeight(20)).toBe(472);
  });
});

describe('aggregateLabelDistribution', () => {
  it('sums each displayed label across all classes', () => {
    const classes = [
      { labelDistribution: { yellow: 5, red: 1, grey: 2 } },
      { labelDistribution: { yellow: 2, red: 2, grey: 1 } },
    ];

    expect(aggregateLabelDistribution(classes)).toEqual({
      yellow: 7,
      red: 3,
      grey: 3,
    });
  });

  it('returns zero counts when no classes have label data', () => {
    expect(aggregateLabelDistribution([])).toEqual({
      yellow: 0,
      red: 0,
      grey: 0,
    });
  });
});

describe('aggregateContactCoverage', () => {
  it('calculates whole-block coverage from student counts across classes', () => {
    const classes = [
      { contactCoverage: { done: 3, total: 5, pct: 60 } },
      { contactCoverage: { done: 1, total: 3, pct: 33 } },
    ];

    expect(aggregateContactCoverage(classes)).toEqual({
      done: 4,
      total: 8,
      remaining: 4,
      pct: 50,
    });
  });

  it('does not invent a percentage when no students need contact', () => {
    expect(aggregateContactCoverage([
      { contactCoverage: { done: 0, total: 0, pct: null } },
    ])).toEqual({
      done: 0,
      total: 0,
      remaining: 0,
      pct: null,
    });
  });
});

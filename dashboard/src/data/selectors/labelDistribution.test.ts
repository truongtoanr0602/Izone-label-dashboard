import { describe, expect, it } from 'vitest';
import { classesWithTestLabels } from './labelDistribution';

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

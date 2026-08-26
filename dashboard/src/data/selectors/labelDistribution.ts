interface ClassLabelDistribution {
  labelDistribution: {
    yellow: number;
    red: number;
    grey: number;
  };
}

interface ClassContactCoverage {
  contactCoverage: {
    done: number;
    total: number;
  };
}

export function formatPieSlicePercent(percent: number): string {
  return percent < 0.05 ? '' : `${Math.round(percent * 100)}%`;
}

export function classesWithTestLabels<T extends ClassLabelDistribution>(
  classes: T[],
): T[] {
  return classes.filter(
    ({ labelDistribution }) =>
      labelDistribution.yellow +
        labelDistribution.red +
        labelDistribution.grey >
      0,
  );
}

export function labelDistributionChartHeight(classCount: number): number {
  return Math.max(280, classCount * 20 + 72);
}

export function aggregateLabelDistribution<T extends ClassLabelDistribution>(
  classes: T[],
): ClassLabelDistribution['labelDistribution'] {
  return classes.reduce(
    (total, { labelDistribution }) => ({
      yellow: total.yellow + labelDistribution.yellow,
      red: total.red + labelDistribution.red,
      grey: total.grey + labelDistribution.grey,
    }),
    { yellow: 0, red: 0, grey: 0 },
  );
}

export function aggregateContactCoverage<T extends ClassContactCoverage>(
  classes: T[],
): { done: number; total: number; remaining: number; pct: number | null } {
  const { done, total } = classes.reduce(
    (aggregate, { contactCoverage }) => ({
      done: aggregate.done + contactCoverage.done,
      total: aggregate.total + contactCoverage.total,
    }),
    { done: 0, total: 0 },
  );

  return {
    done,
    total,
    remaining: total - done,
    pct: total === 0 ? null : Math.round((done / total) * 100),
  };
}

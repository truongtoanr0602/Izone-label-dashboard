export interface CountMetricInput {
  done: number | null;
  total: number | null;
  sourcePercentage: number | null;
}

export interface ResolvedCountMetric {
  percentage: number | null;
  sourceMismatch: boolean;
  invalidCounts: boolean;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

export function resolveCountMetric(
  input: CountMetricInput,
): ResolvedCountMetric {
  const { done, total, sourcePercentage } = input;

  if (done === null || total === null) {
    return {
      percentage: null,
      sourceMismatch: sourcePercentage !== null,
      invalidCounts: false,
    };
  }

  if (done < 0 || total < 0 || done > total) {
    return {
      percentage: null,
      sourceMismatch: false,
      invalidCounts: true,
    };
  }

  const percentage = total === 0 ? null : round1((done / total) * 100);
  return {
    percentage,
    sourceMismatch:
      sourcePercentage !== null &&
      (percentage === null || Math.abs(sourcePercentage - percentage) > 0.1),
    invalidCounts: false,
  };
}

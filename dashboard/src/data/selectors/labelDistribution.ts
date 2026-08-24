interface ClassLabelDistribution {
  labelDistribution: {
    yellow: number;
    red: number;
    grey: number;
  };
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

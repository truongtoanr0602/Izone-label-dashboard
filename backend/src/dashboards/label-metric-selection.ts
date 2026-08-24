interface LabelMetricRow {
  class_id: number;
  record_date: string | Date;
  record_count: number;
}

export function selectLabelMetricRow<T extends LabelMetricRow>(
  rows: T[],
  classId: number,
  asOf: string,
  activeStudents: number,
): T | undefined {
  const candidates = rows.filter((row) => {
    const date =
      row.record_date instanceof Date
        ? row.record_date.toISOString().slice(0, 10)
        : String(row.record_date).slice(0, 10);
    return (
      Number(row.class_id) === classId &&
      date <= asOf &&
      Number(row.record_count) > 0
    );
  });
  const newestFirst = [...candidates].sort((left, right) =>
    String(right.record_date).localeCompare(String(left.record_date)),
  );
  const minimumCoverage = Math.max(0, activeStudents) * 0.8;
  const covered = newestFirst.find(
    (row) => Number(row.record_count) >= minimumCoverage,
  );
  if (covered) return covered;

  return newestFirst.sort((left, right) => {
    const coverageDelta =
      Number(right.record_count) - Number(left.record_count);
    return coverageDelta !== 0
      ? coverageDelta
      : String(right.record_date).localeCompare(String(left.record_date));
  })[0];
}

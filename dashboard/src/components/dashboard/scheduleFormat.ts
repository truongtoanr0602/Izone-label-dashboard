export function formatClassSchedule(schedule: string): string {
  const normalized = schedule.trim();
  if (/^T[2-8](?:\s*-\s*T[2-8])*$/.test(normalized)) {
    return [...new Set(normalized.match(/[2-8]/g)?.map(Number) ?? [])]
      .sort((left, right) => left - right)
      .map((day) => (day === 8 ? 'Chủ nhật' : `Thứ ${day}`))
      .join(', ');
  }

  const numericSchedule = normalized.match(/^\[?\s*([1-7](?:\s*,\s*[1-7])*)\s*\]?$/);
  if (!numericSchedule) return schedule;

  const weekdays = [...new Set(numericSchedule[1].split(',').map(Number))].sort(
    (left, right) => left - right,
  );

  return weekdays
    .map((day) => (day === 7 ? 'Chủ nhật' : `Thứ ${day + 1}`))
    .join(', ');
}

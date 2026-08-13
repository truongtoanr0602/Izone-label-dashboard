import type { ClassSummary } from '../../data/types';

export interface ClassCourseGroup {
  courseName: string;
  classes: ClassSummary[];
}

const collator = new Intl.Collator('vi', {
  numeric: true,
  sensitivity: 'base',
});

export function groupClassesByCourse(
  classes: ClassSummary[],
): ClassCourseGroup[] {
  const grouped = new Map<string, ClassSummary[]>();

  for (const item of classes) {
    const courseName = item.courseName.trim() || 'Khóa học khác';
    const group = grouped.get(courseName) ?? [];
    group.push(item);
    grouped.set(courseName, group);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => collator.compare(left, right))
    .map(([courseName, items]) => ({
      courseName,
      classes: [...items].sort((left, right) =>
        collator.compare(left.className, right.className),
      ),
    }));
}

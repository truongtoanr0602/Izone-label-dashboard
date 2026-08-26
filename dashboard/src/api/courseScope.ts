const COURSE_NAMES: Record<number, string> = {
  1: 'IELTS 0-3',
  2: 'IELTS 3-4',
  3: 'IELTS 4-5',
};

const KHOI_NAMES: Record<number, string> = {
  1: 'Khối 03',
  2: 'Khối 3-4',
  3: 'Khối 4-5',
};

export interface KhoiScope {
  khoiId: number;
  name: string;
}

export function courseName(courseId: number): string {
  return COURSE_NAMES[courseId] ?? `Khóa học ${courseId}`;
}

export function khoiName(khoiId: number): string {
  return KHOI_NAMES[khoiId] ?? `Khối ${khoiId}`;
}

export function selectInitialKhoiId(
  scopes: KhoiScope[],
  defaultKhoiId?: number,
): number | null {
  if (
    defaultKhoiId !== undefined &&
    scopes.some((scope) => scope.khoiId === defaultKhoiId)
  ) {
    return defaultKhoiId;
  }
  return scopes[0]?.khoiId ?? null;
}

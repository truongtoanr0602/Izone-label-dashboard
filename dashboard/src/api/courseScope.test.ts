import { describe, expect, it } from 'vitest';
import { courseName, khoiName, selectInitialKhoiId } from './courseScope';

describe('course scope labels', () => {
  it.each([
    [1, 'Khối 03', 'IELTS 0-3'],
    [2, 'Khối 3-4', 'IELTS 3-4'],
    [3, 'Khối 4-5', 'IELTS 4-5'],
  ])('maps id %i to its khoi and course labels', (id, expectedKhoi, expectedCourse) => {
    expect(khoiName(id)).toBe(expectedKhoi);
    expect(courseName(id)).toBe(expectedCourse);
  });
});

describe('selectInitialKhoiId', () => {
  const scopes = [
    { khoiId: 2, name: 'Khối 3-4' },
    { khoiId: 3, name: 'Khối 4-5' },
  ];

  it('uses the assigned default khoi', () => {
    expect(selectInitialKhoiId(scopes, 3)).toBe(3);
  });

  it('falls back to the first scope when the default is not assigned', () => {
    expect(selectInitialKhoiId(scopes, 1)).toBe(2);
  });

  it('returns null when the account has no khoi scope', () => {
    expect(selectInitialKhoiId([], 2)).toBeNull();
  });
});

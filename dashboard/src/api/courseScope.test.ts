import { describe, expect, it } from 'vitest';
import { courseName, khoiName } from './courseScope';

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

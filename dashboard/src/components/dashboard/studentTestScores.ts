import type { TestScore } from '../../data/types';

export function uniqueLogicalTestScores(scores: TestScore[]): TestScore[] {
  const seenNames = new Set<string>();

  return [...scores]
    .sort((a, b) => a.testOrder - b.testOrder)
    .filter((score) => {
      const normalizedName = score.testName.trim().toLocaleLowerCase('vi');
      const key = normalizedName || `test-order:${score.testOrder}`;
      if (seenNames.has(key)) return false;
      seenNames.add(key);
      return true;
    });
}

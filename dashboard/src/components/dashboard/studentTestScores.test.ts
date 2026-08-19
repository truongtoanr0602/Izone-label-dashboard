import { describe, expect, it } from 'vitest';
import type { TestScore } from '../../data/types';
import { uniqueLogicalTestScores } from './studentTestScores';

describe('uniqueLogicalTestScores', () => {
  it('collapses repeated logical tests even when they have different test orders', () => {
    const scores: TestScore[] = [
      { testOrder: 1, testName: 'Test 1', rawScore: 41.25, makeupScore: null, finalScore: 41.25, isMakeup: false },
      { testOrder: 2, testName: 'Test 2', rawScore: 62.75, makeupScore: null, finalScore: 62.75, isMakeup: false },
      { testOrder: 3, testName: 'Test 3', rawScore: 70.5, makeupScore: null, finalScore: 70.5, isMakeup: false },
      { testOrder: 4, testName: 'Test 1', rawScore: 41.25, makeupScore: null, finalScore: 41.25, isMakeup: false },
      { testOrder: 5, testName: 'Test 2', rawScore: 62.75, makeupScore: null, finalScore: 62.75, isMakeup: false },
      { testOrder: 6, testName: 'Test 3', rawScore: 70.5, makeupScore: null, finalScore: 70.5, isMakeup: false },
    ];

    expect(uniqueLogicalTestScores(scores).map(({ testOrder, testName, finalScore }) => ({
      testOrder,
      testName,
      finalScore,
    }))).toEqual([
      { testOrder: 1, testName: 'Test 1', finalScore: 41.25 },
      { testOrder: 2, testName: 'Test 2', finalScore: 62.75 },
      { testOrder: 3, testName: 'Test 3', finalScore: 70.5 },
    ]);
  });
});

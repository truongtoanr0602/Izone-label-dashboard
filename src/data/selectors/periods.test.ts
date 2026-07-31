import { describe, expect, it } from 'vitest';
import { MOCK_SNAPSHOTS } from '../mockData';

describe('ClassSnapshot.testsCompleted', () => {
  it('bắt đầu từ 0 và không bao giờ giảm theo tuần', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    expect(ic2174.length).toBeGreaterThan(0);
    expect(ic2174[0].testsCompleted).toBe(0);

    for (let i = 1; i < ic2174.length; i++) {
      expect(ic2174[i].testsCompleted).toBeGreaterThanOrEqual(ic2174[i - 1].testsCompleted);
    }
  });

  it('tăng đúng 1 ở tuần có mốc test', () => {
    const ic2174 = MOCK_SNAPSHOTS
      .filter((s) => s.className === 'IC2174')
      .sort((a, b) => a.weekIndex - b.weekIndex);

    for (let i = 1; i < ic2174.length; i++) {
      const delta = ic2174[i].testsCompleted - ic2174[i - 1].testsCompleted;
      expect(delta).toBe(ic2174[i].testCheckpoint === null ? 0 : 1);
    }
  });

  it('lớp chưa thi bài nào thì mọi ảnh chụp đều bằng 0', () => {
    const ic2215 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2215');
    expect(ic2215.length).toBeGreaterThan(0);
    expect(ic2215.every((s) => s.testsCompleted === 0)).toBe(true);
  });
});

describe('ClassSnapshot.droppedStudents', () => {
  it('có mặt ở mọi ảnh chụp và không âm', () => {
    expect(MOCK_SNAPSHOTS.every((s) => s.droppedStudents >= 0)).toBe(true);
  });

  it('IC2174 có HV bỏ học (ca biên đã dàn dựng trong bộ sinh)', () => {
    const ic2174 = MOCK_SNAPSHOTS.filter((s) => s.className === 'IC2174');
    expect(ic2174[0].droppedStudents).toBeGreaterThan(0);
  });
});

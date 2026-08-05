import { describe, expect, it } from 'vitest';
import { aggregateKhoi } from './aggregates';
import type { ClassSnapshot } from '../types';

function snap(over: Partial<ClassSnapshot>): ClassSnapshot {
  return {
    snapshotId: 's',
    classId: 1,
    className: 'C1',
    snapshotDate: '2026-07-27',
    weekIndex: 8,
    progressPct: 57,
    completedSessions: 16,
    totalSessions: 28,
    testCheckpoint: null,
    testsCompleted: 4,
    droppedStudents: 1,
    attendanceAvg: 90,
    homeworkAvg: 90,
    passChuanRate: 50,
    passMemRate: 60,
    labelCounts: { yellow: 10, red: 5, grey: 3, noData: 0 },
    riskPct: 44.4,
    activeStudents: 18,
    ...over,
  };
}

describe('aggregateKhoi', () => {
  it('lấy trung bình CÓ TRỌNG SỐ theo sĩ số, không phải trung bình của trung bình', () => {
    // Lớp 20 HV ở 100%, lớp 5 HV ở 50%.
    // Có trọng số: (100*20 + 50*5) / 25 = 90.  Trung bình của TB: (100+50)/2 = 75.
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 20, attendanceAvg: 100 }),
      snap({ classId: 2, activeStudents: 5, attendanceAvg: 50 }),
    ]);
    expect(result.attendanceAvg).toBe(90);
  });

  it('tính riskPct từ số HV thực, không phải trung bình các tỷ lệ lớp', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 20, labelCounts: { yellow: 10, red: 6, grey: 4, noData: 0 } }),
      snap({ classId: 2, activeStudents: 5, labelCounts: { yellow: 5, red: 0, grey: 0, noData: 0 } }),
    ]);
    // (6+4+0+0) / 25 = 40%
    expect(result.riskPct).toBe(40);
  });

  it('LOẠI lớp chưa có bài test nào ra khỏi tỷ lệ pass', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, testsCompleted: 4, passChuanRate: 60 }),
      snap({ classId: 2, activeStudents: 10, testsCompleted: 0, passChuanRate: 0 }),
    ]);
    // Chỉ lớp 1 được tính → 60, không phải 30.
    expect(result.passChuanRate).toBe(60);
    expect(result.classesWithTests).toBe(1);
  });

  it('trả về null cho tỷ lệ pass khi CHƯA lớp nào thi', () => {
    const result = aggregateKhoi([snap({ testsCompleted: 0, passChuanRate: 0 })]);
    expect(result.passChuanRate).toBeNull();
    expect(result.passMemRate).toBeNull();
  });

  it('bỏ qua lớp không còn HV active', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, attendanceAvg: 80 }),
      snap({ classId: 2, activeStudents: 0, attendanceAvg: 0 }),
    ]);
    expect(result.attendanceAvg).toBe(80);
    expect(result.activeStudents).toBe(10);
  });

  it('cộng dồn số HV bỏ học của mọi lớp, kể cả lớp không còn HV active', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 10, droppedStudents: 2 }),
      snap({ classId: 2, activeStudents: 0, droppedStudents: 3 }),
    ]);
    expect(result.droppedStudents).toBe(5);
  });

  it('không chia cho 0 khi danh sách rỗng', () => {
    const result = aggregateKhoi([]);
    expect(result.activeStudents).toBe(0);
    expect(result.droppedStudents).toBe(0);
    expect(result.passChuanRate).toBeNull();
  });

  it('trả null (KHÔNG phải 0) cho mọi trung bình khi không có HV để chia', () => {
    // Cả hàng KPI phải nói "chưa có dữ liệu" bằng MỘT cách duy nhất: gạch ngang.
    const result = aggregateKhoi([]);
    expect(result.attendanceAvg).toBeNull();
    expect(result.homeworkAvg).toBeNull();
    expect(result.riskPct).toBeNull();
    expect(result.passChuanRate).toBeNull();
    expect(result.passMemRate).toBeNull();
  });

  it('trả null khi mọi lớp đều không còn HV active', () => {
    const result = aggregateKhoi([
      snap({ classId: 1, activeStudents: 0, attendanceAvg: 0 }),
      snap({ classId: 2, activeStudents: 0, attendanceAvg: 0 }),
    ]);
    expect(result.attendanceAvg).toBeNull();
    expect(result.homeworkAvg).toBeNull();
    expect(result.riskPct).toBeNull();
    // Nhưng luỹ kế bỏ học vẫn tính được trên các lớp đó.
    expect(result.droppedStudents).toBe(2);
  });
});

import {
  contactCoverageByClass,
  type CoverageLog,
  type CoverageStudent,
} from './contact-coverage';

const student = (
  studentId: number,
  classId: number,
  messageTemplateKey: string | null,
  checkpoint = 'Test 3',
): CoverageStudent => ({ studentId, classId, messageTemplateKey, checkpoint });

const log = (
  studentId: number,
  classId: number,
  triggerType: string,
  checkpoint = 'Test 3',
): CoverageLog => ({ studentId, classId, triggerType, checkpoint });

describe('contactCoverageByClass', () => {
  it('đếm HV đang mở cảnh báo làm mẫu số, HV không cần hành động bị bỏ qua', () => {
    const result = contactCoverageByClass(
      [
        student(1, 100, 'habit_reminder'),
        student(2, 100, 'red_followup'),
        student(3, 100, null),
      ],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it('trả pct null khi lớp không có cảnh báo nào — khác hẳn 0%', () => {
    const result = contactCoverageByClass([student(1, 100, null)], []);

    expect(result.get(100)).toEqual({ done: 0, total: 0, pct: null });
  });

  it('không tính log của mốc test khác', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder', 'Test 3')],
      [log(1, 100, 'habit_reminder', 'Test 2')],
    );

    expect(result.get(100)).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('không tính log của luồng khác', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'red_followup')],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('nhiều log trùng một episode chỉ tính một lần', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder')],
      [log(1, 100, 'habit_reminder'), log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 1, pct: 100 });
  });

  it('tách độ phủ theo từng lớp', () => {
    const result = contactCoverageByClass(
      [student(1, 100, 'habit_reminder'), student(2, 200, 'habit_reminder')],
      [log(1, 100, 'habit_reminder')],
    );

    expect(result.get(100)).toEqual({ done: 1, total: 1, pct: 100 });
    expect(result.get(200)).toEqual({ done: 0, total: 1, pct: 0 });
  });
});

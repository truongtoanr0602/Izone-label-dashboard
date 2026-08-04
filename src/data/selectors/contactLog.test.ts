import { describe, expect, it } from 'vitest';
import {
  NO_CHECKPOINT,
  closingContact,
  contactCoverage,
  currentCheckpoint,
  episodeKey,
  isContacted,
  lastContact,
  openEpisodes,
  remainingCount,
} from './contactLog';
import type { ContactLog, LabelCode, StudentDetail, TestScore } from '../types';

function score(testOrder: number, finalScore: number | null): TestScore {
  return {
    testOrder,
    testName: `Test ${testOrder}`,
    rawScore: finalScore,
    makeupScore: null,
    finalScore,
    isMakeup: false,
  };
}

/** HV mặc định: sạch mọi cảnh báo — mỗi test tự bật đúng thứ nó cần. */
function student(
  studentId: number,
  over: {
    label?: LabelCode;
    attendance?: number;
    homework?: number;
    scores?: TestScore[];
    registrationStatus?: StudentDetail['registrationStatus'];
  } = {},
): StudentDetail {
  const label = over.label ?? 'yellow';
  const attendance = over.attendance ?? 95;
  const homework = over.homework ?? 95;

  return {
    studentId,
    studentCode: `HV${studentId}`,
    fullName: `Học viên ${studentId}`,
    phone: '0900000000',
    email: 'a@b.c',
    classId: 1,
    className: 'IC0001',
    registrationStatus: over.registrationStatus ?? 'active',
    admittedAt: '2026-01-01',
    targetOutputStatus: 'Chưa đạt',
    attendance: {
      percentage: attendance,
      presentSessions: 19,
      totalSessions: 20,
      isDroppingRecently: false,
    },
    homework: {
      percentage: homework,
      completedCount: 19,
      totalCount: 20,
      isDroppingRecently: false,
    },
    testPerformance: {
      testsTakenCount: over.scores?.filter((t) => t.finalScore !== null).length ?? 0,
      averageScore: null,
      lastScore: null,
      trendDirection: 'stable',
      scores: over.scores ?? [],
      isCheatingFlagged: false,
    },
    labeling: {
      currentLabel: label,
      previousLabel: label,
      benchmarkLabel: label,
      hasChangedRecently: false,
      changeDirection: 'same',
      lastCheckpoint: 'Test 1',
    },
    evaluation: {
      riskScore: 10,
      suggestedAction: 'none',
      passChuanStatus: 'Có khả năng pass',
      passChuanReasons: [],
      passMemStatus: '',
      passMemGroup: '',
      passMemLabel: '',
      isEligibleForReview: false,
      reviewStatus: '',
    },
    portalEvidence: {
      teacherFeedbackBtvn: '',
      teacherFeedbackOrientation: '',
      teacherNote: '',
    },
    updatedAt: '2026-08-04',
  };
}

function log(over: Partial<ContactLog> = {}): ContactLog {
  return {
    contactId: 'c1',
    studentId: 1,
    classId: 1,
    teacherId: 1,
    channel: 'call',
    trigger: 'urgent_call',
    checkpoint: 'Test 3',
    note: '',
    createdAt: '2026-08-01T10:00:00.000Z',
    ...over,
  };
}

describe('currentCheckpoint', () => {
  it('lấy bài test có thứ tự lớn nhất mà đã có điểm', () => {
    const students = [
      student(1, { scores: [score(1, 70), score(2, 65), score(3, null)] }),
      student(2, { scores: [score(1, 50), score(2, 40), score(3, 55)] }),
    ];
    expect(currentCheckpoint(students)).toBe('Test 3');
  });

  it('BỎ QUA bài đã lên lịch nhưng chưa ai có điểm', () => {
    // Cột Test 4 tồn tại trong schema nhưng finalScore null → lớp chưa thi bài
    // đó, nhãn chưa được tính lại, mọi cảnh báo đang mở vẫn thuộc Test 3.
    const students = [student(1, { scores: [score(3, 55), score(4, null)] })];
    expect(currentCheckpoint(students)).toBe('Test 3');
  });

  it('trả NO_CHECKPOINT khi lớp chưa thi bài nào', () => {
    expect(currentCheckpoint([student(1, { scores: [score(1, null)] })])).toBe(NO_CHECKPOINT);
    expect(currentCheckpoint([])).toBe(NO_CHECKPOINT);
  });
});

describe('openEpisodes', () => {
  it('một HV có thể mở nhiều episode cùng lúc', () => {
    // Điểm danh 70% → gọi gấp; BTVN 60% → nhắc BTVN. Đóng việc này không có
    // nghĩa là đã làm việc kia.
    const s = student(1, { attendance: 70, homework: 60 });
    expect(openEpisodes([s])).toEqual([
      { studentId: 1, trigger: 'urgent_call' },
      { studentId: 1, trigger: 'homework_reminder' },
    ]);
  });

  it('HV Xám đi học đều, nộp bài đủ VẪN mở một episode', () => {
    // Đây chính là ca trước đây rơi qua mọi kẽ hở: không gọi gấp, không nhắc
    // BTVN, ô hành động hiện "--".
    const s = student(1, { label: 'grey', attendance: 95, homework: 95 });
    expect(openEpisodes([s])).toEqual([{ studentId: 1, trigger: 'relearn_advice' }]);
  });

  it('HV Xám đã nghỉ học không còn mở episode nào', () => {
    const s = student(1, { label: 'grey', registrationStatus: 'dropped' });
    expect(openEpisodes([s])).toEqual([]);
  });

  it('HV sạch không mở episode nào', () => {
    expect(openEpisodes([student(1)])).toEqual([]);
  });
});

describe('isContacted', () => {
  it('tick ở CHECKPOINT CŨ không tính là đã liên hệ ở mốc hiện tại', () => {
    // Đây là toàn bộ lý do `checkpoint` nằm trong khoá episode: có bài test
    // mới thì cảnh báo phải nổi lại mà không cần ai đi reset cờ.
    const logs = [log({ checkpoint: 'Test 2' })];
    expect(isContacted(logs, 1, 'urgent_call', 'Test 3')).toBe(false);
    expect(isContacted(logs, 1, 'urgent_call', 'Test 2')).toBe(true);
  });

  it('nhật ký rỗng → chưa liên hệ', () => {
    expect(isContacted([], 1, 'urgent_call', 'Test 3')).toBe(false);
  });
});

describe('đóng hộ giữa các luồng (một chiều)', () => {
  it('gọi PH ĐÓNG HỘ việc nhắc BTVN ở cùng mốc', () => {
    // Kịch bản gọi PH đã nêu "BTVN <90%" — bắt GV nhắn Zalo nhắc nộp bài cho
    // chính HV vừa gọi là nói cùng một việc hai lần.
    const logs = [log({ trigger: 'urgent_call' })];
    expect(isContacted(logs, 1, 'homework_reminder', 'Test 3')).toBe(true);
  });

  it('nhắn BTVN KHÔNG đóng hộ việc gọi PH — chiều ngược lại phải chặn', () => {
    // Nếu để hai chiều, GV làm việc dễ rồi bỏ việc khó vẫn hiện 100% cho Lead.
    const logs = [log({ trigger: 'homework_reminder' })];
    expect(isContacted(logs, 1, 'urgent_call', 'Test 3')).toBe(false);
  });

  it('tư vấn học lại KHÔNG đóng hộ việc nhắc BTVN', () => {
    // Buổi tư vấn bàn về học lại/bảo lưu, không bàn về việc nộp bài — HV nhãn
    // Xám vẫn phải được nhắc BTVN như mọi HV khác.
    const logs = [log({ trigger: 'relearn_advice' })];
    expect(isContacted(logs, 1, 'homework_reminder', 'Test 3')).toBe(false);
  });

  it('đóng hộ KHÔNG vượt qua ranh giới checkpoint', () => {
    const logs = [log({ trigger: 'urgent_call', checkpoint: 'Test 2' })];
    expect(isContacted(logs, 1, 'homework_reminder', 'Test 3')).toBe(false);
  });

  it('closingContact ưu tiên lượt của CHÍNH luồng đó', () => {
    // GV vừa gọi PH vừa thật sự nhắn Zalo → giao diện phải hiện "đã nhắn" (có
    // nút hoàn tác), không phải "đã gọi PH nên khỏi nhắn".
    const logs = [
      log({ contactId: 'call', trigger: 'urgent_call' }),
      log({ contactId: 'zalo', trigger: 'homework_reminder' }),
    ];
    expect(closingContact(logs, 1, 'homework_reminder', 'Test 3')?.contactId).toBe('zalo');
  });

  it('closingContact trả lượt của luồng bao khi luồng đó chưa có lượt riêng', () => {
    const logs = [log({ contactId: 'call', trigger: 'urgent_call' })];
    expect(closingContact(logs, 1, 'homework_reminder', 'Test 3')?.trigger).toBe('urgent_call');
  });

  it('đóng hộ được tính vào độ phủ của Lead', () => {
    // HV ĐH 70% + BTVN 60% mở 2 episode; một cuộc gọi đóng cả hai → 100%.
    const students = [student(1, { attendance: 70, homework: 60 })];
    const logs = [log({ trigger: 'urgent_call' })];
    expect(contactCoverage(students, logs, 'Test 3')).toEqual({ done: 2, total: 2, pct: 100 });
  });

  it('đóng hộ làm giảm số việc còn lại của luồng BTVN', () => {
    const students = [student(1, { attendance: 70, homework: 60 })];
    const logs = [log({ trigger: 'urgent_call' })];
    expect(remainingCount(students, logs, 'homework_reminder', 'Test 3')).toBe(0);
    expect(remainingCount(students, logs, 'urgent_call', 'Test 3')).toBe(0);
  });
});

describe('lastContact', () => {
  it('lấy lượt gần nhất theo createdAt, không phụ thuộc thứ tự mảng', () => {
    const logs = [
      log({ contactId: 'a', createdAt: '2026-07-01T00:00:00.000Z' }),
      log({ contactId: 'b', createdAt: '2026-08-01T00:00:00.000Z' }),
      log({ contactId: 'c', createdAt: '2026-06-01T00:00:00.000Z' }),
    ];
    expect(lastContact(logs, 1, 'urgent_call')?.contactId).toBe('b');
  });

  it('trả null khi HV chưa từng được liên hệ vì lý do đó', () => {
    expect(lastContact([log()], 1, 'relearn_advice')).toBeNull();
  });
});

describe('contactCoverage', () => {
  it('đếm theo episode chứ không theo học viên', () => {
    // HV Xám + BTVN 60% mở 2 episode. Hai luồng này KHÔNG đóng hộ nhau, nên
    // đóng một cái phải ra 1/2 — không phải 1/1 chỉ vì "đã liên hệ bạn ấy rồi".
    const students = [student(1, { label: 'grey', homework: 60 })];
    const logs = [log({ studentId: 1, trigger: 'relearn_advice', checkpoint: 'Test 3' })];
    expect(contactCoverage(students, logs, 'Test 3')).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it('nhiều log trùng một episode chỉ tính một lần', () => {
    const students = [student(1, { attendance: 70 })];
    const logs = [
      log({ contactId: 'a', studentId: 1 }),
      log({ contactId: 'b', studentId: 1 }),
    ];
    expect(contactCoverage(students, logs, 'Test 3')).toEqual({ done: 1, total: 1, pct: 100 });
  });

  it('pct là NULL khi lớp không có cảnh báo nào — không phải 0%', () => {
    // Lớp khoẻ mạnh và lớp bỏ mặc toàn bộ cảnh báo phải hiện ra khác nhau.
    expect(contactCoverage([student(1)], [], 'Test 3')).toEqual({
      done: 0,
      total: 0,
      pct: null,
    });
  });

  it('nhật ký rỗng → 0%', () => {
    const students = [student(1, { attendance: 70 })];
    expect(contactCoverage(students, [], 'Test 3')).toEqual({ done: 0, total: 1, pct: 0 });
  });

  it('lớp chưa thi bài nào vẫn ghi nhận được tick', () => {
    const students = [student(1, { attendance: 70 })];
    const logs = [log({ checkpoint: NO_CHECKPOINT })];
    expect(contactCoverage(students, logs, NO_CHECKPOINT).pct).toBe(100);
  });
});

describe('remainingCount', () => {
  it('đếm đúng số việc còn lại của riêng một luồng', () => {
    const students = [
      student(1, { attendance: 70 }),
      student(2, { attendance: 70 }),
      student(3, { label: 'grey' }),
    ];
    const logs = [log({ studentId: 1, trigger: 'urgent_call', checkpoint: 'Test 3' })];
    expect(remainingCount(students, logs, 'urgent_call', 'Test 3')).toBe(1);
    expect(remainingCount(students, logs, 'relearn_advice', 'Test 3')).toBe(1);
  });
});

describe('episodeKey', () => {
  it('ba thành phần đều phân biệt được khoá', () => {
    expect(episodeKey(1, 'urgent_call', 'Test 3')).toBe('1|urgent_call|Test 3');
    expect(episodeKey(1, 'urgent_call', 'Test 3')).not.toBe(episodeKey(1, 'urgent_call', 'Test 2'));
    expect(episodeKey(1, 'urgent_call', 'Test 3')).not.toBe(
      episodeKey(1, 'homework_reminder', 'Test 3'),
    );
  });
});

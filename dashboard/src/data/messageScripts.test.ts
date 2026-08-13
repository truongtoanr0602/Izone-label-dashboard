import { describe, expect, it } from 'vitest';
import { buildZaloMessage } from './messageScripts';
import type { ContactTrigger, StudentDetail, TestScore } from './types';

const TRIGGERS: ContactTrigger[] = ['red_followup', 'relearn_advice', 'habit_reminder'];

function student(over: {
  attendance?: number;
  homework?: number;
  testsTaken?: number;
  average?: number | null;
} = {}): StudentDetail {
  const attendance = over.attendance ?? 72;
  const homework = over.homework ?? 65;
  const testsTaken = over.testsTaken ?? 4;
  const average = over.average === undefined ? 48.5 : over.average;

  return {
    studentId: 1,
    fullName: 'Nguyễn Văn A',
    phone: '0900000000',
    email: 'a@b.c',
    classId: 1,
    className: 'IC0001',
    registrationStatus: 'on_going',
    recordDate: '2026-08-12',
    admittedAt: '2026-01-01',
    targetOutputStatus: 'Chưa đạt',
    attendance: {
      percentage: attendance,
      presentSessions: 18,
      totalSessions: 25,
      isDroppingRecently: false,
    },
    homework: {
      percentage: homework,
      completedCount: 13,
      totalCount: 20,
      isDroppingRecently: false,
    },
    testPerformance: {
      testsTakenCount: testsTaken,
      averageScore: average,
      lastScore: average,
      trendDirection: 'declining',
      scores: [] as TestScore[],
      isCheatingFlagged: false,
    },
    labeling: {
      currentLabel: 'red',
      previousLabel: 'red',
      benchmarkLabel: 'red',
      hasChangedRecently: false,
      changeDirection: 'same',
      lastCheckpoint: 'Test 4',
    },
    dataQuality: { status: 'complete', warnings: [] },
    evaluation: {
      riskScore: 70,
      suggestedAction: 'none',
      passChuanStatus: 'Chưa đạt điều kiện pass',
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

describe('buildZaloMessage — ràng buộc chung cho mọi kịch bản', () => {
  it.each(TRIGGERS)('%s: xưng hô với HỌC VIÊN, không phải phụ huynh', (trigger) => {
    const msg = buildZaloMessage(trigger, student(), 'Ngọc Anh', 'IC2174');

    expect(msg).toContain('Chào em Nguyễn Văn A');
    // Thực tế GV nhắn Zalo cho HV, không gọi PH. Một kịch bản lỡ xưng hô với
    // phụ huynh sẽ được gửi thẳng cho học viên và đọc rất kỳ.
    expect(msg).not.toMatch(/anh\/chị|phụ huynh|gia đình|con của|cháu/i);
  });

  it.each(TRIGGERS)('%s: giữ nguyên tên GV và tên lớp', (trigger) => {
    const msg = buildZaloMessage(trigger, student(), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('Ngọc Anh');
    expect(msg).toContain('IC2174');
  });

  it.each(TRIGGERS)('%s: luôn nêu CẢ đi học lẫn BTVN kèm số cụ thể', (trigger) => {
    // Đây là điều kiện để tin của nhóm Đỏ/Xám đóng hộ được episode nhắc BTVN:
    // nếu một kịch bản quên nhắc bài tập thì luật đóng hộ thành ra nói dối.
    const msg = buildZaloMessage(trigger, student({ attendance: 72, homework: 65 }), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('72%');
    expect(msg).toContain('65%');
  });

  it('không in null% khi chỉ số hiện tại chưa có mẫu số', () => {
    const noMeasurement = student();
    noMeasurement.attendance = {
      percentage: null,
      presentSessions: 0,
      totalSessions: 0,
      isDroppingRecently: false,
    };
    noMeasurement.homework = {
      percentage: null,
      completedCount: 0,
      totalCount: 0,
      isDroppingRecently: false,
    };

    const msg = buildZaloMessage(
      'red_followup',
      noMeasurement,
      'Ngọc Anh',
      'IC2174',
    );

    expect(msg).toContain('Đi học: — (0/0 buổi)');
    expect(msg).toContain('BTVN: — (0/0 bài)');
    expect(msg).not.toContain('null%');
  });

  it('không biến số đếm nguồn bị thiếu thành 0/0', () => {
    const noSnapshot = student();
    noSnapshot.attendance = {
      percentage: null,
      presentSessions: null,
      totalSessions: null,
      isDroppingRecently: false,
    };
    noSnapshot.homework = {
      percentage: null,
      completedCount: null,
      totalCount: null,
      isDroppingRecently: false,
    };

    const msg = buildZaloMessage(
      'red_followup',
      noSnapshot,
      'Ngọc Anh',
      'IC2174',
    );

    expect(msg).toContain('Đi học: — (—/— buổi)');
    expect(msg).toContain('BTVN: — (—/— bài)');
    expect(msg).not.toContain('(0/0');
  });
});

describe('kịch bản nhóm Đỏ', () => {
  it('giọng động viên, nói rõ là còn kịp', () => {
    // Nhóm Đỏ là nhóm 50/50 — can thiệp có tác dụng thật, nên tin nhắn phải
    // nói cho em biết còn cứu được, không phải cảnh cáo.
    const msg = buildZaloMessage('red_followup', student(), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('còn kịp');
    expect(msg).not.toMatch(/cảnh báo|nghiêm khắc|vi phạm|kỷ luật/i);
  });

  it('có nêu điểm trung bình khi đã thi', () => {
    const msg = buildZaloMessage('red_followup', student({ testsTaken: 4, average: 48.5 }), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('48.5');
    expect(msg).toContain('4 bài test');
  });
});

describe('kịch bản nhóm Xám', () => {
  it('có mở lời trao đổi về lộ trình học', () => {
    const msg = buildZaloMessage('relearn_advice', student(), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('lộ trình');
  });

  it('KHÔNG dùng chữ khiến HV hiểu thành "cô khuyên em bỏ lớp"', () => {
    // Tin này gửi thẳng cho một học viên đang học kém. Chuyện học lại/bảo lưu
    // là để trao đổi trực tiếp, không phải kết luận trong một tin nhắn.
    const msg = buildZaloMessage('relearn_advice', student(), 'Ngọc Anh', 'IC2174');
    expect(msg).not.toMatch(/bỏ lớp|nghỉ học|bảo lưu|học lại|không đạt|trượt|kém/i);
  });

  it('quy trách nhiệm cho độ khó của lộ trình, không cho học viên', () => {
    const msg = buildZaloMessage('relearn_advice', student(), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('không phải do em không cố gắng');
  });
});

describe('kịch bản nhắc chăm học', () => {
  it('nêu đúng số buổi và số bài', () => {
    const msg = buildZaloMessage('habit_reminder', student(), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('18/25 buổi');
    expect(msg).toContain('13/20 bài');
  });

  it('NÓI RÕ ngưỡng 90%', () => {
    // Ngưỡng nhắc là 90 (điều kiện pass) chứ không phải 80 (ngưỡng cảnh báo).
    // Không nói ra con số thì một HV đang có BTVN 89% đọc xong sẽ không hiểu vì
    // sao mình bị nhắc khi nhìn vào thấy "gần đủ rồi".
    const msg = buildZaloMessage('habit_reminder', student({ homework: 89 }), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('90%');
    expect(msg).toContain('chuẩn đầu ra');
  });
});

describe('biên', () => {
  it('lớp chưa thi bài nào thì KHÔNG bịa ra dòng điểm', () => {
    // Thà thiếu một dòng còn hơn nói sai với học viên về điểm của chính bạn ấy.
    const msg = buildZaloMessage('red_followup', student({ testsTaken: 0, average: null }), 'Ngọc Anh', 'IC2174');
    expect(msg).not.toContain('Điểm TB');
    expect(msg).toContain('Đi học:');
  });

  it('HV đã đạt cả ĐH lẫn BTVN vẫn nhận được lời ghi nhận, không phải lời trách', () => {
    const msg = buildZaloMessage('red_followup', student({ attendance: 95, homework: 95 }), 'Ngọc Anh', 'IC2174');
    expect(msg).toContain('cô/thầy ghi nhận điều đó');
  });
});

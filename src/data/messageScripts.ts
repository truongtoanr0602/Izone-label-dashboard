import type { ContactTrigger, StudentDetail } from './types';

/**
 * Sinh tin nhắn Zalo GV gửi cho HỌC VIÊN.
 *
 * Tách thành module thuần, không phải nằm rải trong JSX của modal, vì đây là
 * chữ nghiệp vụ thật gửi tới người thật — nó cần được test (đủ số liệu chưa?
 * có lỡ lời không?) và cần sửa được ở một chỗ.
 *
 * Ba điều đã chốt với nghiệp vụ và ràng buộc mọi kịch bản dưới đây:
 *
 *  1. Người nhận là HỌC VIÊN, không phải phụ huynh. Thực tế GV không gọi phụ
 *     huynh — họ nhắn Zalo cho HV. Vì vậy toàn bộ xưng hô là "em", và không
 *     kịch bản nào được nói kiểu "nhờ gia đình nhắc nhở cháu".
 *  2. Giọng thân thiện, không hành chính. Đây là tin nhắn giữa cô/thầy và học
 *     trò, không phải công văn.
 *  3. MỌI kịch bản đều nêu cả đi học lẫn BTVN, kèm số cụ thể. Đây chính là lý
 *     do một tin nhắn của nhóm Đỏ/Xám đóng hộ được episode nhắc BTVN — nội
 *     dung đã bao trùm rồi.
 */

/** Ba dòng "nhịp tim" của học viên, dùng chung cho mọi kịch bản. */
function statsBlock(s: StudentDetail): string {
  const lines = [
    `• Đi học: ${s.attendance.percentage}% (${s.attendance.presentSessions}/${s.attendance.totalSessions} buổi)`,
    `• BTVN: ${s.homework.percentage}% (${s.homework.completedCount}/${s.homework.totalCount} bài)`,
  ];

  // Chưa thi bài nào thì KHÔNG bịa ra dòng điểm — thà thiếu còn hơn nói sai
  // với học viên về điểm số của chính bạn ấy.
  if (s.testPerformance.averageScore !== null && s.testPerformance.testsTakenCount > 0) {
    lines.push(
      `• Điểm TB ${s.testPerformance.testsTakenCount} bài test: ${s.testPerformance.averageScore}`,
    );
  }

  return lines.join('\n');
}

/**
 * Việc cần làm trước mắt, chọn theo chỉ số đang yếu nhất.
 *
 * Một lời nhắc chung chung kiểu "em cố gắng hơn nhé" thì HV đọc xong không
 * biết phải làm gì. Nêu đúng một việc cụ thể thì khác.
 */
function focusLine(s: StudentDetail): string {
  const lowAttendance = s.attendance.percentage < 90;
  const lowHomework = s.homework.percentage < 90;

  if (lowAttendance && lowHomework) {
    return 'Trước mắt em cố gắng đi học đều hơn và làm cho đủ bài tập nhé — hai cái này kéo lên là mọi thứ khác đỡ hẳn.';
  }
  if (lowAttendance) {
    return 'Em cố gắng đi học đều hơn nhé, nghỉ nhiều là hổng bài, học lại rất mệt.';
  }
  if (lowHomework) {
    return 'Em tranh thủ làm nốt mấy bài tập còn thiếu nhé, làm bài đều thì lên lớp nghe sẽ nhẹ hơn nhiều.';
  }
  return 'Em vẫn đi học đều và làm bài đầy đủ, cô/thầy ghi nhận điều đó — mình cùng giữ nhịp này nhé.';
}

function greeting(s: StudentDetail, teacherName: string, className: string): string {
  return `Chào em ${s.fullName}! Cô/Thầy ${teacherName} — GVCN lớp ${className} nhắn em một chút nha 😊`;
}

/**
 * Nhóm Đỏ: theo dữ liệu lịch sử đây là nhóm 50/50, can thiệp có tác dụng thật
 * (ĐH & BTVN > 90% → tỷ lệ đạt vượt 60%). Nên giọng phải là ĐỘNG VIÊN chứ
 * không phải cảnh cáo — nói cho em biết là còn kịp.
 */
function urgentMessage(s: StudentDetail, teacherName: string, className: string): string {
  return [
    greeting(s, teacherName, className),
    '',
    'Cô/Thầy vừa xem lại tình hình học của em:',
    statsBlock(s),
    '',
    // KHÔNG nói "mấy chỉ số này đang thấp": một HV vào nhóm này vì điểm test
    // có thể đang đi học 100% và nộp bài 89%, nói vậy là nói sai với chính bạn
    // ấy về số liệu bạn ấy nhìn thấy ngay phía trên. Câu chung chung ở đây, còn
    // `focusLine` mới gọi tên đúng phần cần cải thiện.
    'Em có vài phần cần cải thiện trước khi hết khoá, nhưng còn kịp hoàn toàn để kéo lên.',
    focusLine(s),
    '',
    'Có phần nào khó hay có việc gì khiến em chưa theo được thì cứ nhắn cho cô/thầy nhé, mình tìm cách gỡ cùng nhau 💪',
  ].join('\n');
}

/**
 * Nhóm Xám: TB test <45. Vừa nhắc ĐH/BTVN như mọi HV, VỪA mở lời về lộ trình
 * học — nhưng nhẹ, và tuyệt đối không dùng chữ "bỏ", "nghỉ học", "không đạt".
 *
 * Đây là tin nhắn gửi thẳng cho một đứa trẻ đang học kém. Câu chữ ở đây quy
 * trách nhiệm cho ĐỘ KHÓ của lộ trình, không quy cho học viên, và luôn kết
 * bằng một lời mời trao đổi chứ không phải một kết luận.
 */
function relearnMessage(s: StudentDetail, teacherName: string, className: string): string {
  return [
    greeting(s, teacherName, className),
    '',
    'Tình hình học của em hiện tại:',
    statsBlock(s),
    '',
    'Cô/Thầy thấy phần bài test của em đang hơi đuối so với nhịp chung của lớp. Cô/Thầy nghĩ không phải do em không cố gắng đâu, mà có thể tốc độ của lớp hiện tại đang hơi nhanh so với nền của em.',
    focusLine(s),
    '',
    'Hôm nào tiện em nhắn lại cho cô/thầy nhé, cô/thầy muốn trao đổi với em một chút về lộ trình học sao cho vừa sức và đỡ áp lực hơn. Không có gì nghiêm trọng đâu, cô/thầy chỉ muốn tìm cách phù hợp nhất cho em thôi 🌱',
  ].join('\n');
}

/** Nhóm chỉ hụt BTVN: ngắn gọn, nhắc đúng một việc. */
function homeworkMessage(s: StudentDetail, teacherName: string, className: string): string {
  return [
    greeting(s, teacherName, className),
    '',
    `BTVN của em đang là ${s.homework.percentage}% (${s.homework.completedCount}/${s.homework.totalCount} bài), còn thiếu ${Math.max(0, s.homework.totalCount - s.homework.completedCount)} bài đó em. Đi học thì em vẫn giữ được ${s.attendance.percentage}%, tốt lắm — chỉ còn phần bài tập nữa thôi.`,
    '',
    'Em tranh thủ hoàn thành nốt giúp cô/thầy nhé, làm bài đều thì lên lớp nghe sẽ nhẹ hơn nhiều. Bài nào khó cứ nhắn hỏi cô/thầy nha 💪',
  ].join('\n');
}

const BUILDERS: Record<
  ContactTrigger,
  (s: StudentDetail, teacherName: string, className: string) => string
> = {
  urgent_remind: urgentMessage,
  relearn_advice: relearnMessage,
  homework_reminder: homeworkMessage,
};

export function buildZaloMessage(
  trigger: ContactTrigger,
  s: StudentDetail,
  teacherName: string,
  className: string,
): string {
  return BUILDERS[trigger](s, teacherName, className);
}

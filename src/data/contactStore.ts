import { MOCK_CONTACT_LOGS } from './mockData';
import type { ContactChannel, ContactLog, ContactTrigger } from './types';

/**
 * ĐIỂM GHI DUY NHẤT của nhật ký liên hệ.
 *
 * Bản prototype này lưu vào `localStorage` để một buổi demo sống sót qua nút
 * F5. Toàn bộ mục đích của việc gom vào một file là: khi có backend thật, chỉ
 * ruột hai hàm dưới đây đổi thành lời gọi webhook n8n (`POST` một dòng vào
 * sheet `10_NhatKy_LienHe`) — không component nào phải sửa.
 *
 * TODO(backend): thay `persist` bằng `POST ${N8N_BASE}/contact-log`, và
 * `loadLogs` bằng `GET .../contact-log?classId=`. Giữ nguyên chữ ký hàm.
 *
 * Khoá có version trong tên: đổi hình dạng `ContactLog` mà không đổi khoá sẽ
 * khiến máy của người đã demo hôm trước đọc phải dữ liệu cũ và crash. Đã lên v2
 * khi `urgent_call` đổi tên thành `urgent_remind` — log cũ mang trigger không
 * còn tồn tại, giữ lại thì mọi episode nhóm Đỏ hiện sai trạng thái.
 */
const STORAGE_KEY = 'izone.contactLogs.v2';

function persist(logs: ContactLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // Chế độ riêng tư của trình duyệt hoặc hết quota. Mất khả năng lưu không
    // phải lý do để làm sập màn hình GV — phiên hiện tại vẫn chạy trên state.
  }
}

/**
 * Nhật ký đã lưu, hoặc dữ liệu nền nếu chưa có gì.
 *
 * Dữ liệu hỏng bị coi như chưa có: một chuỗi JSON lỗi thời từ bản trước không
 * được phép chặn người dùng vào ứng dụng.
 */
export function loadLogs(): ContactLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_CONTACT_LOGS;

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactLog[]) : MOCK_CONTACT_LOGS;
  } catch {
    return MOCK_CONTACT_LOGS;
  }
}

export interface NewContact {
  studentId: number;
  classId: number;
  teacherId: number;
  channel: ContactChannel;
  trigger: ContactTrigger;
  checkpoint: string;
}

/**
 * Ghi thêm một lượt liên hệ. APPEND-ONLY: không sửa, không ghi đè dòng cũ —
 * lịch sử là thứ duy nhất trả lời được câu "lần trước liên hệ khi nào".
 */
export function appendLog(logs: ContactLog[], contact: NewContact): ContactLog[] {
  const createdAt = new Date().toISOString();
  const next = [
    ...logs,
    {
      ...contact,
      contactId: `CT-${contact.studentId}-${contact.trigger}-${createdAt}`,
      note: '',
      createdAt,
    },
  ];

  persist(next);
  return next;
}

/**
 * Gỡ lượt liên hệ của một episode tại đúng mốc hiện tại — dành cho ca bấm nhầm.
 *
 * Cố tình KHÔNG đụng tới log ở các checkpoint khác: hoàn tác một cái tick vừa
 * bấm không được phép xoá lịch sử liên hệ của những mốc test trước.
 */
export function removeLog(
  logs: ContactLog[],
  studentId: number,
  trigger: ContactTrigger,
  checkpoint: string,
): ContactLog[] {
  const next = logs.filter(
    (l) => !(l.studentId === studentId && l.trigger === trigger && l.checkpoint === checkpoint),
  );

  persist(next);
  return next;
}

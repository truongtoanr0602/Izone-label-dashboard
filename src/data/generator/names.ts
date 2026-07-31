/**
 * Kho tên và thông tin liên hệ giả.
 *
 * Tên tiếng Việt giữ độ thật để demo có cảm giác đúng, nhưng SỐ ĐIỆN THOẠI và
 * EMAIL thì cố tình giả rõ ràng:
 *
 *   - điện thoại dùng dải 0900 000 xxx — cấu trúc hợp lệ nhưng không phải số
 *     đang lưu hành, nhìn là biết sinh tự động;
 *   - email dùng @example.com — tên miền được RFC 2606 dành riêng cho tài
 *     liệu, bảo đảm không bao giờ gửi tới người thật.
 *
 * Bắt buộc như vậy vì bản build deploy lên GitHub Pages là trang tĩnh công
 * khai, chưa có đăng nhập: bất cứ thứ gì nằm trong bundle đều đọc được từ
 * DevTools.
 */

export const FAMILY_NAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đinh', 'Trịnh',
] as const;

export const MIDDLE_NAMES = [
  'Thị', 'Văn', 'Minh', 'Thanh', 'Hoài', 'Ngọc', 'Quang', 'Thu',
  'Anh', 'Khánh', 'Gia', 'Bảo', 'Hải', 'Xuân', 'Đức', 'Phương',
] as const;

export const GIVEN_NAMES = [
  'An', 'Bình', 'Chi', 'Dũng', 'Duy', 'Giang', 'Hà', 'Hạnh',
  'Hiếu', 'Hoa', 'Huy', 'Khanh', 'Lâm', 'Linh', 'Long', 'Mai',
  'Nam', 'Nga', 'Ngân', 'Nhung', 'Phong', 'Quân', 'Quỳnh', 'Sơn',
  'Thảo', 'Thắng', 'Thuỷ', 'Trang', 'Trung', 'Tuấn', 'Vy', 'Yến',
] as const;

/** Một tên dài bất thường — để kiểm tra bố cục bảng không vỡ khi tên tràn. */
export const LONG_NAME_PROBE = 'Nguyễn Hoàng Phương Thảo Nguyên';

const FAKE_PHONE_PREFIX = '0900000';
const FAKE_EMAIL_DOMAIN = 'example.com';

/** 0900 000 xxx — dải không lưu hành, xem chú thích đầu file. */
export function fakePhone(seq: number): string {
  return FAKE_PHONE_PREFIX + String(seq % 1000).padStart(3, '0');
}

const DIACRITICS: Record<string, string> = {
  à: 'a', á: 'a', ạ: 'a', ả: 'a', ã: 'a', â: 'a', ầ: 'a', ấ: 'a', ậ: 'a', ẩ: 'a', ẫ: 'a',
  ă: 'a', ằ: 'a', ắ: 'a', ặ: 'a', ẳ: 'a', ẵ: 'a',
  è: 'e', é: 'e', ẹ: 'e', ẻ: 'e', ẽ: 'e', ê: 'e', ề: 'e', ế: 'e', ệ: 'e', ể: 'e', ễ: 'e',
  ì: 'i', í: 'i', ị: 'i', ỉ: 'i', ĩ: 'i',
  ò: 'o', ó: 'o', ọ: 'o', ỏ: 'o', õ: 'o', ô: 'o', ồ: 'o', ố: 'o', ộ: 'o', ổ: 'o', ỗ: 'o',
  ơ: 'o', ờ: 'o', ớ: 'o', ợ: 'o', ở: 'o', ỡ: 'o',
  ù: 'u', ú: 'u', ụ: 'u', ủ: 'u', ũ: 'u', ư: 'u', ừ: 'u', ứ: 'u', ự: 'u', ử: 'u', ữ: 'u',
  ỳ: 'y', ý: 'y', ỵ: 'y', ỷ: 'y', ỹ: 'y',
  đ: 'd',
};

export function toAscii(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => DIACRITICS[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]/g, '');
}

/** Ví dụ: "Nguyễn Thu Hà" + 18972 → nguyenthuha.18972@example.com */
export function fakeEmail(fullName: string, id: number): string {
  return `${toAscii(fullName)}.${id}@${FAKE_EMAIL_DOMAIN}`;
}

export function fakeTeacherEmail(fullName: string, id: number): string {
  const parts = fullName.split(' ');
  const given = toAscii(parts[parts.length - 1]);
  const initials = parts.slice(0, -1).map((p) => toAscii(p)[0]).join('');
  return `${given}.${initials}${id}@${FAKE_EMAIL_DOMAIN}`;
}

export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Bộ sinh số ngẫu nhiên có seed.
 *
 * Dùng thay cho Math.random() vì dữ liệu mock phải GIỐNG NHAU giữa các lần
 * tải trang. Nếu mỗi lần refresh ra một bộ số khác, thì mọi lỗi bố cục phát
 * hiện được sẽ không tái hiện lại được, và không ai dám tin con số nào trên
 * màn hình khi demo.
 */

/** mulberry32 — nhỏ, nhanh, phân phối đủ tốt cho dữ liệu demo. */
export function createRng(seed: number) {
  let state = seed >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    /** [0, 1) */
    next,

    /** Số thực trong [min, max). */
    float: (min: number, max: number): number => min + next() * (max - min),

    /** Số nguyên trong [min, max] — bao gồm cả hai đầu. */
    int: (min: number, max: number): number => Math.floor(min + next() * (max - min + 1)),

    /**
     * Xấp xỉ phân phối chuẩn bằng tổng 3 mẫu đều (định lý giới hạn trung tâm).
     *
     * Tổng 3 mẫu U(0,1) có trung bình 1.5 và độ lệch chuẩn 0.5, nên
     * (sum - 1.5) / 0.5 đã chuẩn hoá về sd = 1 — nhân thẳng với stdDev, không
     * kèm hệ số nào khác.
     */
    normal: (mean: number, stdDev: number): number => {
      const sum = next() + next() + next();
      return mean + ((sum - 1.5) / 0.5) * stdDev;
    },

    /** Trả về true với xác suất p. */
    chance: (p: number): boolean => next() < p,

    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)],

    /** Fisher–Yates trên bản sao — không đụng vào mảng gốc. */
    shuffle: <T>(items: readonly T[]): T[] => {
      const out = items.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}

export type Rng = ReturnType<typeof createRng>;

export { clamp, round1 } from '../number';

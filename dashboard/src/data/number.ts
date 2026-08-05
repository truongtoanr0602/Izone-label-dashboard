/** Tiện ích số dùng chung giữa bộ sinh dữ liệu mock và tầng selector. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const round1 = (value: number): number => Math.round(value * 10) / 10;

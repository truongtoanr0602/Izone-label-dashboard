import { useCallback, useEffect, useState } from 'react';

/**
 * Giữ một tham số đồng bộ với thanh địa chỉ.
 *
 * Nhờ vậy copy URL gửi đi là người nhận thấy đúng kỳ báo cáo mày đang xem — đây
 * là thứ thay thế việc xuất file (§4.3). Dùng replaceState để đổi kỳ không sinh
 * mục mới trong lịch sử trình duyệt.
 */
export function useUrlParam(
  name: string,
  fallback: string,
): [string, (next: string) => void] {
  const [value, setValue] = useState<string>(
    () => new URLSearchParams(window.location.search).get(name) ?? fallback,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (value === fallback) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [name, value, fallback]);

  const update = useCallback((next: string) => setValue(next), []);

  return [value, update];
}

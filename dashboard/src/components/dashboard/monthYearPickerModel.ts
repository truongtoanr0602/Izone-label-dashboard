export interface MonthOption {
  key: string;
  label: string;
  selected: boolean;
  disabled: boolean;
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function buildMonthGrid(
  year: number,
  selectedKey: string,
  currentKey: string,
): MonthOption[] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const key = monthKey(year, month);
    return {
      key,
      label: `Tháng ${month}`,
      selected: key === selectedKey,
      disabled: key > currentKey,
    };
  });
}

import React from 'react';
import {
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
export type TrendMetric = 'attendanceAvg' | 'homeworkAvg' | 'passChuanRate' | 'passMemRate';

/**
 * Một điểm trên trục thời gian.
 *
 * Giá trị `null` nghĩa là CHƯA XÁC ĐỊNH, không phải bằng 0 — recharts sẽ ngắt
 * đường ở đó. Không bật `connectNulls`.
 */
export interface TrendPoint {
  /** Ngày dạng ISO 'YYYY-MM-DD'. */
  date: string;
  testCheckpoint: string | null;
  attendanceAvg: number | null;
  homeworkAvg: number | null;
  passChuanRate: number | null;
  passMemRate: number | null;
}

export interface TrendSeries {
  key: TrendMetric;
  name: string;
  lightColor: string;
  darkColor: string;
}

interface TrendChartProps {
  title: string;
  subtitle: string;
  /** Chuỗi điểm theo thời gian. Sẽ được sắp theo ngày. */
  points: TrendPoint[];
  series: TrendSeries[];
  /** Thu hẹp trục Y để biến động nhỏ nhìn thấy được. */
  domain: [number, number];
  isDarkMode: boolean;
}

const DAY_MS = 86_400_000;

function formatTick(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  title,
  subtitle,
  points,
  series,
  domain,
  isDarkMode,
}) => {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));

  /*
   * Nhãn trực tiếp được nhét sẵn vào dữ liệu dưới khoá `<key>__label`.
   *
   * Đây không phải mẹo cho gọn: prop `formatter` của LabelList trong recharts 3
   * chỉ nhận một tham số (`LabelFormatter`), không nhận chỉ số phần tử, nên
   * không có cách nào từ trong formatter biết đang ở điểm nào. Đã kiểm chứng
   * bằng tsc: bản dùng formatter 3 tham số KHÔNG compile.
   *
   * Nhãn đặt ở điểm CUỐI CÙNG CÓ GIÁ TRỊ của từng chuỗi, không phải điểm cuối
   * của mảng — chuỗi kết thúc bằng null thì đường đã ngắt trước đó, đặt nhãn ở
   * cuối mảng sẽ thành nhãn treo lơ lửng không dính đường nào.
   */
  const lastValueIndex = new Map<TrendMetric, number>();
  for (const item of series) {
    let index = -1;
    sorted.forEach((point, i) => {
      if (point[item.key] !== null) index = i;
    });
    lastValueIndex.set(item.key, index);
  }

  const data = sorted.map((point, index) => {
    const row: Record<string, number | string | null> = {
      t: Date.parse(`${point.date}T00:00:00Z`),
      attendanceAvg: point.attendanceAvg,
      homeworkAvg: point.homeworkAvg,
      passChuanRate: point.passChuanRate,
      passMemRate: point.passMemRate,
    };
    for (const item of series) {
      row[`${item.key}__label`] = index === lastValueIndex.get(item.key) ? item.name : '';
    }
    return row;
  });

  // Mốc test là SỰ KIỆN — vẽ thành vạch dọc chú thích, không phải một ô trên trục.
  const testMarkers = sorted
    .filter((point) => point.testCheckpoint !== null)
    .map((point) => ({
      t: Date.parse(`${point.date}T00:00:00Z`),
      label: point.testCheckpoint as string,
    }));

  if (data.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] p-5">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">{title}</h3>
        <p className="text-xs text-[#404040]/50 dark:text-[#71717a] mt-6 text-center">
          Chưa có dữ liệu cho kỳ này.
        </p>
      </div>
    );
  }

  const axisColor = isDarkMode ? '#71717a' : '#9ca3af';

  return (
    <div className="rounded-[16px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] flex flex-col">
      <div className="bg-[#f3f4f6] dark:bg-[#18181b] border-b border-[#f3f4f6] dark:border-[#3f3f46] border-l-4 border-l-[#db0829] px-5 py-4 rounded-t-[16px]">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">{title}</h3>
        <p className="text-xs text-[#404040]/60 dark:text-[#a1a1aa] mt-1">{subtitle}</p>
      </div>

      <div className="h-64 w-full p-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 64, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3f3f46' : '#e5e7eb'} opacity={0.6} vertical={false} />
            <XAxis
              dataKey="t"
              type="number"
              scale="time"
              domain={['dataMin - ' + DAY_MS, 'dataMax + ' + DAY_MS]}
              tickFormatter={formatTick}
              stroke={axisColor}
              fontSize={11}
              tickMargin={10}
            />
            <YAxis stroke={axisColor} fontSize={11} domain={domain} width={40} />
            <Tooltip
              labelFormatter={(t) => new Date(Number(t)).toISOString().slice(0, 10)}
              contentStyle={{
                background: isDarkMode ? '#27272a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#3f3f46' : '#f3f4f6'}`,
                borderRadius: '12px',
                fontSize: '12px',
                color: isDarkMode ? '#e4e4e7' : '#404040',
              }}
            />

            {testMarkers.map((marker) => (
              <ReferenceLine
                key={marker.t}
                x={marker.t}
                stroke={axisColor}
                strokeDasharray="4 4"
              >
                <Label value={marker.label} position="top" fontSize={10} fill={axisColor} />
              </ReferenceLine>
            ))}

            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={isDarkMode ? s.darkColor : s.lightColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              >
                {/* Nhãn trực tiếp ở đầu mút — ràng buộc khả dụng, không được bỏ. */}
                <LabelList
                  dataKey={`${s.key}__label`}
                  position="right"
                  fontSize={10}
                  fill={isDarkMode ? s.darkColor : s.lightColor}
                />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

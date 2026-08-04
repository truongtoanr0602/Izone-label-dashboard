import React from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SectionHeader } from './SectionHeader';
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
  /**
   * Khoảng trục Y **tối thiểu**, không phải khoảng cố định.
   *
   * recharts chỉ NỚI RỘNG khoảng này để chứa hết dữ liệu, không bao giờ cắt bớt
   * (trừ khi bật `allowDataOverflow`, mà ở đây cố tình KHÔNG bật: cắt mất một
   * điểm dữ liệu trong buổi họp còn tệ hơn một trục hơi rộng). Nên hiểu prop này
   * là "đừng để trục hẹp hơn ngần này" — nó chống được trục tự co lại quanh dải
   * dữ liệu khiến biến động 1 điểm trông như sụp đổ, chứ nó KHÔNG ép được trục
   * hẹp hơn dữ liệu. Vì vậy giá trị truyền vào phải bao trọn dải thật của chỉ số
   * (tỷ lệ pass: 0–100), nếu không trục hiện ra sẽ khác con số ghi ở đây.
   */
  domain: [number, number];
  /**
   * Hiện `testCheckpoint` (dạng `"N lớp thi"`) kèm ngày trong tooltip.
   *
   * Đây là chú thích **cỡ mẫu**, không phải chú thích sự kiện: chỉ bật cho những
   * chỉ số mà mẫu số là "số lớp đã thi" — tỷ lệ pass 60% trên 1 lớp và trên 7
   * lớp là hai con số có độ tin cậy khác hẳn nhau, và biểu đồ không nói điều đó
   * ở chỗ nào khác. Với chỉ số vận hành (điểm danh, BTVN) thì mẫu số là toàn bộ
   * học viên đang học, không liên quan gì tới lịch thi, nên bật vào chỉ là số
   * lạc đề — để mặc định tắt.
   */
  showTestCountInTooltip?: boolean;
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
  showTestCountInTooltip = false,
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
      // Không phải dataKey của đường nào — chỉ để tooltip đọc lại số lớp đã thi.
      checkpointLabel: point.testCheckpoint,
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

  /*
   * KHÔNG vẽ vạch dọc đánh dấu tuần có bài test. Đã thử và đã bỏ, đừng thêm lại.
   *
   * Vạch mốc test có nghĩa ở cấp LỚP, nơi Test 1..6 bám vòng đời một lớp nên
   * thưa và tách bạch. Biểu đồ này ở cấp KHỐI, mà ở cấp khối thì 12/13 tuần đều
   * có ít nhất một lớp thi: một tín hiệu bật 92% thời gian không giải thích được
   * cú tụt nào của đường nào, nó chỉ chia nát vùng vẽ thành 12 khoang. Bản có
   * nhãn `<Label position="top">` còn tệ hơn — 12 nhãn ~55px chen trong ~450px
   * thành dải chữ nhòe ở mép trên.
   *
   * Thứ duy nhất còn giữ lại từ `testCheckpoint` là con số trong tooltip, và
   * giữ với tư cách CỠ MẪU chứ không phải mốc sự kiện — xem
   * `showTestCountInTooltip`.
   */

  if (data.length === 0) {
    return (
      <div className="rounded-[16px] bg-white dark:bg-[#27272a] p-5">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-[#e4e4e7]">{title}</h3>
        <p className="text-xs text-[#404040]/50 dark:text-[#71717a] mt-6 text-center">
          Chưa có dữ liệu cho kỳ này.
        </p>
      </div>
    );
  }

  const axisColor = isDarkMode ? '#71717a' : '#9ca3af';

  return (
    <div className="rounded-[16px] bg-white dark:bg-[#27272a] flex flex-col">
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="h-64 w-full p-5">
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
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
              labelFormatter={(t, payload) => {
                const date = new Date(Number(t)).toISOString().slice(0, 10);
                if (!showTestCountInTooltip) return date;
                // `payload` là các điểm của CÙNG một tuần, nên hàng nào cũng mang
                // đúng `checkpointLabel` đó; lấy hàng đầu tiên là đủ.
                const checkpoint = payload?.[0]?.payload?.checkpointLabel as string | null | undefined;
                return checkpoint ? `${date} · ${checkpoint}` : date;
              }}
              contentStyle={{
                background: isDarkMode ? '#27272a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#3f3f46' : '#f3f4f6'}`,
                borderRadius: '12px',
                fontSize: '12px',
                color: isDarkMode ? '#e4e4e7' : '#404040',
              }}
            />

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

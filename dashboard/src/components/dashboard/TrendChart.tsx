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
import {
  toTrendChartRows,
  type TrendChartRow,
  type TrendMetric,
  type WeeklyTrendPoint,
} from './trendChartModel';

export type { TrendMetric, WeeklyTrendPoint } from './trendChartModel';

export interface TrendSeries {
  key: TrendMetric;
  name: string;
  lightColor: string;
  darkColor: string;
}

interface TrendChartProps {
  title: string;
  subtitle: string;
  points: WeeklyTrendPoint[];
  series: TrendSeries[];
  domain: [number, number];
  showTestCountInTooltip?: boolean;
  isDarkMode: boolean;
}

function displayDate(iso: string | null): string {
  if (!iso) return 'chưa xác định';
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
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
  const data = toTrendChartRows(points);

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
              dataKey="weekLabel"
              type="category"
              stroke={axisColor}
              fontSize={11}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis stroke={axisColor} fontSize={11} domain={domain} width={40} />
            <Tooltip
              labelFormatter={(_label, payload) => {
                const row = payload?.[0]?.payload as TrendChartRow | undefined;
                if (!row) return '';
                return (
                  <div className="mb-1.5 space-y-0.5">
                    <div className="font-semibold">Tuần {row.weekLabel}</div>
                    <div>{row.classesReported} lớp báo cáo · {row.activeStudentSample} HV</div>
                    {showTestCountInTooltip && <div>{row.classesWithTests} lớp có test</div>}
                    <div>Dữ liệu mới nhất đến {displayDate(row.latestDataAsOf)}</div>
                  </div>
                );
              }}
              contentStyle={{
                background: isDarkMode ? '#27272a' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#3f3f46' : '#f3f4f6'}`,
                borderRadius: '12px',
                fontSize: '12px',
                color: isDarkMode ? '#e4e4e7' : '#404040',
              }}
            />

            {series.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={isDarkMode ? item.darkColor : item.lightColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                connectNulls={false}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={`${item.key}Label`}
                  position="right"
                  fontSize={10}
                  fill={isDarkMode ? item.darkColor : item.lightColor}
                />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

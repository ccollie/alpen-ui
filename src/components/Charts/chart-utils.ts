import { Dict } from '../../@types';
import { StatsGranularity, StatsSnapshot } from '../../api';
import { format } from 'date-fns';

export const LABELS = {
  percentiles: [
    { label: '50th Percentile', field: 'median' },
    { label: '90th Percentile', field: 'p90' },
    { label: '99th Percentile', field: 'p99' },
    { label: '99.5th Percentile', field: 'p995' },
  ],
  averages: [
    { label: 'Average', field: 'mean' },
    { label: 'Maximum', field: 'max' },
    { label: 'Minimum', field: 'min' },
  ],
};

export const CHART_LABELS = [
  { label: 'Average', field: 'mean' },
  { label: 'Median', field: 'median' },
  { label: '90th Percentile', field: 'p90' },
  { label: '99th Percentile', field: 'p99' },
];

const FieldNameMap: Dict<string> = {
  p90: '90th',
  p95: '95th',
  p99: '99th',
  p995: '99.5th',
};

export interface DataItem {
  [field: string]: string | number | number[] | null | undefined;
}

export interface IChartDataItem extends DataItem {
  start: number;
  end: number;
  value: number;
  metric: string;
  label: string;
}

export function getStatsChartData(
  data: StatsSnapshot[],
  keys: string[],
): IChartDataItem[] {
  let result: IChartDataItem[] = [];
  data.forEach((item) => {
    keys.forEach((metric) => {
      const value = (item as any)[metric];
      const start = +new Date(item.startTime);
      const end = +new Date(item.endTime);
      const label = FieldNameMap[metric] || metric;
      const dataPoint: IChartDataItem = {
        start,
        end,
        value,
        metric,
        label,
      };
      result.push(dataPoint);
    });
  });
  return result;
}

export enum SeriesType {
  Percentiles = 'percentiles',
  Averages = 'averages',
}

export const BackgroundColor = [
  '#e74c3c',
  '#f1c40f',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#95a5a6',
  '#34495e',
];

// https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
export const TimeAxisFormats: Record<StatsGranularity, string> = {
  [StatsGranularity.Minute]: 'HH:mm',
  [StatsGranularity.Hour]: 'HH aaaa',
  [StatsGranularity.Day]: 'eee dd',
  [StatsGranularity.Week]: 'MMM dd',
  [StatsGranularity.Month]: 'MMMM',
};

export function formatDate(
  date: Date | number,
  granularity?: StatsGranularity,
): string {
  const fmt = granularity ? TimeAxisFormats[granularity] : 'yyyy-MM-dd';
  return format(date, fmt);
}

export const TickValues: Record<StatsGranularity, string> = {
  [StatsGranularity.Minute]: 'every 5 seconds',
  [StatsGranularity.Hour]: 'every 1 minute',
  [StatsGranularity.Day]: 'every 1 hour',
  [StatsGranularity.Week]: 'every 2 hours',
  [StatsGranularity.Month]: 'every 1 day',
};

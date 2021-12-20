import { JobStatus } from '@/api';

export type OnPieClickCallback = (status: JobStatus, value?: number) => void;

export type PieChartDataProps = {
  height?: number;
  counts: { [key in JobStatus]: number };
  onClick?: OnPieClickCallback;
};

export const Colors = {
  [JobStatus.Waiting + '']: 'hsl(32, 70%, 50%)',
  [JobStatus.Active + '']: 'hsl(22, 70%, 50%)',
  [JobStatus.Completed + '']: 'hsl(132, 70%, 50%)',
  [JobStatus.Failed + '']: 'hsl(345, 70%, 50%)',
  [JobStatus.Paused + '']: 'hsl(345, 70%, 50%)',
  [JobStatus.Delayed + '']: 'hsl(292, 70%, 50%)',
};

export interface DataPoint {
  status: string;
  value: number;
  color?: string;
}

export function normalizeData(props: PieChartDataProps): DataPoint[] {
  const data: DataPoint[] = [];
  Object.entries(props.counts).forEach(([status, value]) => {
    const color = Colors[status];
    if (status === '__typename') return;
    data.push({
      status,
      value, //ts couldn't infer this
      color,
    });
  });
  return data;
}

export function arePropsEqual(
  a: PieChartDataProps,
  b: PieChartDataProps,
): boolean {
  if (a.height !== b.height) return false;
  if (a.onClick !== b.onClick) return false;
  const keys = Object.keys(Colors);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if ((a.counts as any)[k] !== (b.counts as any)[k]) return false;
  }
  return true;
}

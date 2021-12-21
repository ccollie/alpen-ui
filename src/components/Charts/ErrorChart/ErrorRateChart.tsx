import { TimeseriesChart, TimeseriesDatum } from '../TimeseriesChart';
import { toPrecision } from '@/lib';
import { ChartOptions } from 'billboard.js';
import React, { useCallback, useEffect, useState } from 'react';
import { StatsGranularity } from '@/api';

export interface ErrorDataItem {
  start: number;
  end: number;
  failed: number;
  completed: number;
}

interface ErrorChartProps {
  height?: number;
  width?: number;
  granularity?: StatsGranularity;
  data: ErrorDataItem[];
  type: 'line' | 'area';
  options?: Partial<ChartOptions>;
}

export function calcErrorPercentage(completed: number, failed: number): number {
  const count = completed + failed || 0;
  return (failed / count) * 100;
}

const ErrorRateChart: React.FC<ErrorChartProps> = (props) => {
  const {
    data = [],
    height = 400,
    width,
    granularity,
    type: chartType = 'line',
  } = props;

  type ChartData = {
    start: number;
    end: number;
    value: number;
    failed: number;
    completed: number;
  };

  const [errorCount, setErrorCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [errorPercentage, setErrorPercentage] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const accessor = useCallback(
    (d: ChartData): TimeseriesDatum | TimeseriesDatum[] => {
      const res: TimeseriesDatum = {
        ts: d.end,
        value: d.value,
        name: 'rate',
      };
      return res;
    },
    [],
  );

  function updateSeries() {
    const _data: ChartData[] = [];
    let totalFailures = 0;
    let totalCompleted = 0;
    data.map((item) => {
      totalCompleted += item.completed;
      totalFailures += item.failed;
      _data.push({
        ...item,
        value: calcErrorPercentage(item.completed, item.failed),
      });
    });
    setChartData(_data);
    setErrorCount(totalFailures);
    setCompletedCount(totalCompleted);
    setErrorPercentage(calcErrorPercentage(totalCompleted, totalFailures));
  }

  useEffect(updateSeries, [data]);

  const valueFormatter = useCallback(
    (value) => toPrecision(value, 1) + ' %',
    [],
  );

  return (
    <TimeseriesChart<ChartData>
      type={chartType}
      height={height}
      width={width}
      data={chartData}
      accessor={accessor}
      granularity={granularity}
      valueFormatter={valueFormatter}
      options={props.options}
    />
  );
};
export default ErrorRateChart;

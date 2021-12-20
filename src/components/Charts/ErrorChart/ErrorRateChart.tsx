import { toPrecision } from '@/lib';
import React, { useCallback, useEffect, useState } from 'react';
import { StatsGranularity } from '@/api';
import { formatDate } from '../chart-utils';
import { Chart, Area, Line } from 'bizcharts';

export interface ErrorDataItem {
  start: number;
  end: number;
  failed: number;
  completed: number;
}

interface ErrorChartProps {
  height?: number;
  granularity?: StatsGranularity;
  data: ErrorDataItem[];
}

export function calcErrorPercentage(completed: number, failed: number): number {
  const count = completed + failed || 0;
  return (failed / count) * 100;
}

const ErrorRateChart: React.FC<ErrorChartProps> = (props) => {
  const { data = [], height = 400, granularity } = props;

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

  const dateFormatter = useCallback(
    (date) => formatDate(date, granularity),
    [granularity],
  );

  const valueFormatter = useCallback(
    (value) => toPrecision(value, 1) + ' %',
    [],
  );

  const scale = {
    value: {
      nice: true,
      formatter: valueFormatter,
    },
    start: {
      alias: 'Time',
      type: 'time',
      formatter: dateFormatter,
      nice: false,
    },
  };

  return (
    <Chart scale={scale} height={height} data={chartData} autoFit>
      <Area position="start*value" color="#e74c3c" />
      <Line position="start*value" color="red" />
    </Chart>
  );
};
export default ErrorRateChart;

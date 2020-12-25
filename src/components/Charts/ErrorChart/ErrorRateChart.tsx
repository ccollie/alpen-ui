import React, { useCallback, useEffect, useState } from 'react';
import { StatsGranularity } from '../../../api';
import {
  BackgroundColor,
  formatDate,
  getStatsChartData,
  TickValues,
  TimeAxisFormats,
} from '../chart-utils';
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
  return failed / count;
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

  const dateFormatter = useCallback((date) => formatDate(date, granularity), [
    granularity,
  ]);

  const scale = {
    value: {
      nice: true,
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
      <Area position="start*value" />
      <Line position="start*value" />
    </Chart>
  );
};
export default ErrorRateChart;

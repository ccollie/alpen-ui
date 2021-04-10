import { StatsGranularity, StatsSnapshot } from '@/api';
import { formatDate, getStatsChartData } from '@/components/Charts/chart-utils';
import ms from 'ms';
import React, { useCallback, useMemo } from 'react';
import { AreaChart } from 'bizcharts';

interface ThroughputChartProps {
  height?: number;
  fields?: string[];
  granularity?: StatsGranularity;
  data?: StatsSnapshot[];
}

const ThroughputChart: React.FC<ThroughputChartProps> = (props) => {
  const {
    data = [],
    fields = ['mean', 'median', 'p90', 'p95'],
    height = 400,
    granularity,
  } = props;

  const dateFormatter = useCallback((date) => formatDate(date, granularity), [
    granularity,
  ]);

  const valueFormatter = useCallback((value) => ms(value), []);

  const chartData = useMemo(() => getStatsChartData(data, fields), [
    data,
    fields,
  ]);

  return (
    <AreaChart
      meta={{
        value: {
          formatter: valueFormatter,
        },
        start: {
          alias: 'Time',
          type: 'time',
          formatter: dateFormatter,
        },
      }}
      height={height}
      data={chartData}
      xField="start"
      yField="value"
      seriesField="metric"
      autoFit
    />
  );
};

export default ThroughputChart;

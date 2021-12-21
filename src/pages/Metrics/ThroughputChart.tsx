import { StatsGranularity, StatsSnapshot } from '@/api';
import { StatsLineChart } from '@/components';
import React from 'react';

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

  return (
    <StatsLineChart
      fields={fields}
      height={height}
      data={data}
      granularity={granularity}
    />
  );
};

export default ThroughputChart;

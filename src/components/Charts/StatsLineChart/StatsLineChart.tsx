import { StatsGranularity, StatsSnapshot } from '@/api';
import { TimeseriesChart, TimeseriesDatum } from '../TimeseriesChart';
import { ChartOptions } from 'billboard.js';
import ms from 'ms';
import React, { useCallback } from 'react';

interface StatsLineChartProps {
  height?: number;
  width?: number;
  fields?: Array<keyof StatsSnapshot>;
  granularity?: StatsGranularity;
  data?: StatsSnapshot[];
  type?: 'area' | 'line';
  options?: Partial<ChartOptions>;
}

const StatsLineChart: React.FC<StatsLineChartProps> = (props) => {
  const {
    data = [],
    fields = ['mean', 'median', 'p90', 'p95'],
    height,
    width,
    granularity,
    type: chartType = 'line',
  } = props;

  const valueFormatter = useCallback((value) => ms(value), []);

  const accessor = useCallback(
    (d: StatsSnapshot): TimeseriesDatum | TimeseriesDatum[] => {
      return fields.map((field) => {
        const res: TimeseriesDatum = {
          ts: d.endTime,
          value: d[field],
          name: field,
        };
        return res;
      });
    },
    [fields],
  );

  return (
    <TimeseriesChart<StatsSnapshot>
      type={chartType}
      height={height}
      width={width}
      data={data}
      accessor={accessor}
      granularity={granularity}
      valueFormatter={valueFormatter}
      options={props.options}
    />
  );
};

export default StatsLineChart;

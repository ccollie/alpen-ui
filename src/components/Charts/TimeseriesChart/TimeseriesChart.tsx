import { StatsGranularity } from '@/api';
import { DateFormats } from '@/components/Charts/common';
import { useUnmountEffect } from '@/hooks';
import { makeArray } from '@/lib';
import type { ChartOptions } from 'billboard.js';
import bb, { area, Chart, line, spline } from 'billboard.js';
import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { formatDate } from '../common/chart-utils';

export interface TimeseriesDatum {
  ts: number | Date;
  value: number;
  name: string;
}

export type TimeseriesAccessorFn<T> = (
  datum: T,
) => TimeseriesDatum | TimeseriesDatum[];

export interface TimeseriesChartProps<T> {
  height?: number;
  width?: number;
  granularity?: StatsGranularity;
  data: T[];
  accessor: TimeseriesAccessorFn<T>;
  valueFormatter?: (value: any) => string;
  type?: 'area' | 'line' | 'spline';
  options?: Partial<ChartOptions>;
}

function TimeseriesChart<T>(
  props: PropsWithChildren<TimeseriesChartProps<T>>,
): ReactElement<TimeseriesChartProps<T>> {
  const [chart, setChart] = useState<Chart>();
  const [chartData, setChartData] = useState<Map<string, TimeseriesDatum[]>>(
    new Map(),
  );
  const [data, setData] = useState<Record<string, number>[]>([]);
  const [chartElement, setChartElement] = useState<HTMLDivElement | null>(null);

  const {
    height,
    width,
    granularity,
    accessor,
    type: chartType = 'line',
  } = props;

  const dateFormatter = useCallback(
    (date) => formatDate(date, granularity),
    [granularity],
  );

  type ColumnTuple = [string, ...(number | string)[]];

  function compareItem(a: TimeseriesDatum, b: TimeseriesDatum): number {
    const aValue = a.ts instanceof Date ? a.ts.getTime() : a.ts;
    const bValue = b.ts instanceof Date ? b.ts.getTime() : b.ts;
    return aValue - bValue;
  }

  function transformData() {
    const res: TimeseriesDatum[] = [];
    const data: Record<string, number>[] = [];
    // map series names to sorted array of values
    const valueMap = new Map<string, TimeseriesDatum[]>();

    props.data.forEach((datum) => {
      const items = makeArray(accessor(datum));
      items.forEach((item) => {
        const row = {
          [item.name]: item.value,
        };
        data.push(row);
        let series = valueMap.get(item.name);
        if (!series) {
          series = [];
          valueMap.set(item.name, series);
        }
        series.push(item);
      });
      res.push(...items);
    });
    const keys = valueMap.keys();
    Array.from(keys).forEach((key) => {
      const series = valueMap.get(key) || [];
      series.sort(compareItem);
    });
    setChartData(valueMap);
    setData(data);
  }

  function getData(): Record<string, number>[] {
    const data: Array<{ [key: string]: number }> = [];
    chartData.forEach((items, key) => {
      items.forEach((item) => {
        const row = {
          [key]: item.value,
        };
        data.push(row);
      });
    });
    return data;
  }

  function getChartConfig(): ChartOptions {
    const fields = Array.from(chartData.keys());
    // assume all series have the same length
    const timestamps = (chartData.get(fields[0]) || []).map((x) => x.ts);

    const tickFormat = granularity ? DateFormats[granularity] : '%Y-%m-%d';
    const x: ColumnTuple = ['x', ...timestamps.map((ts) => dateFormatter(ts))];
    const columns: ColumnTuple[] = [x];
    chartData.forEach((values, key) => {
      const column = [key, ...values.map((x) => x.value)] as ColumnTuple;
      columns.push(column);
    });

    const baseOptions = props.options || {};

    let _type: any;
    switch (chartType) {
      case 'area':
        _type = area();
        break;
      case 'line':
        _type = line();
        break;
      case 'spline':
        _type = spline();
        break;
    }

    const config: ChartOptions = {
      ...baseOptions,
      data: {
        x: 'x',
        columns,
        type: _type,
      },
      size: {
        height,
        width,
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: tickFormat,
          },
        },
      },
    };
    if (props.valueFormatter) {
      config.axis = config.axis || {};
      config.axis.y = config.axis.y || {};
      config.axis.y = {
        ...config.axis.y,
        tick: {
          ...config.axis.y.tick,
          format: props.valueFormatter,
        },
      };
    }
    return config;
  }

  useEffect(() => {
    if (chartElement && !chart) {
      const config = getChartConfig();
      const chart = bb.generate({
        bindto: chartElement,
        ...config,
      });
      setChart(chart);
    }
  }, [chartElement, props, chart]);

  useEffect(transformData, [chart, props.data, props.accessor]);

  useEffect(() => {
    if (chart) {
      chart.load({ data });
    }
  }, [chart, data]);

  useUnmountEffect(() => {
    if (chart) {
      chart.destroy();
    }
  });

  const refCallback = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    setChartElement(node);
  }, []);

  return (
    <div
      className="line-chart"
      ref={refCallback}
      style={{
        width: props.width ?? width,
        height: props.height ?? height,
      }}
    />
  );
}

export { TimeseriesChart };

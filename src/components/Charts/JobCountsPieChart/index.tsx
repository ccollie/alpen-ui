import { arePropsEqual, PieChartDataProps } from './utils';
import { useUnmountEffect } from '@/hooks';
import bb, { Chart, donut } from 'billboard.js';
import type { ChartOptions, DataItem } from 'billboard.js';
import React, { useEffect, useRef, useState } from 'react';
import { JobStatus } from '@/api';
import { Empty, Space } from 'antd';

const JobCountsPieChart: React.FC<PieChartDataProps> = (props) => {
  const { height = 450 } = props;
  const [chart, setChart] = useState<Chart>();
  const [data, setData] = useState<Record<string, number>[]>();
  const [total, setTotal] = useState<number>(0);
  const [columns, setColumns] = useState<Array<[string, string | number]>>([]);
  const [title, setTitle] = useState<string | undefined>(props.title);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  type LoadFn = Chart['load'];
  type LoadArgs = Parameters<LoadFn>[0];

  function handleClick(d: DataItem, evt: any) {
    const status = evt.status as JobStatus;
    props.onClick && props.onClick(status, evt.value);
  }

  function updateDataInStore() {
    const data: Record<string, number>[] = [];
    const columns: Array<[string, string | number]> = [];
    let total = 0;
    Object.entries(props.counts).forEach(([status, value]) => {
      if (status === '__typename') return;
      data.push({
        [status]: value,
      });
      columns.push([status, value]);
      total += value;
    });
    let centerText = props.title ? props.title : `Total\n${total}`;
    setData(data);
    setTotal(total);
    setColumns(columns);
    setTitle(centerText);
  }

  useEffect(updateDataInStore, [props.counts]);

  function getChartConfig(): ChartOptions {
    return {
      bindto: element,
      data: {
        columns,
        type: donut(),
        onclick: handleClick,
      },
      donut: {
        title,
        label: {
          show: false,
        },
      },
      legend: {
        position: 'right',
      },
      size: {
        height: height,
      },
      color: {
        pattern: ['#F5222D', '#FAAD14', '#13C2C2', '#1890FF'],
      },
    };
  }

  function loadData(data: Partial<LoadArgs>) {
    if (!chart) {
      // eslint-disable-next-line no-console
      return console.error(
        'No chart is available to which data can be loaded. It may already have been destroyed, or has never been drawn.',
      );
    }

    chart.load(data);
  }

  const callbackRef = (node: HTMLDivElement) => {
    if (!node) return;
    setElement(node);
  };

  useEffect(() => {
    if (!element) {
      return;
    }
    if (chart) {
      chart.load({
        data,
      });
    } else {
      const config = getChartConfig();
      const chart = bb.generate({
        bindto: element,
        ...config,
      });
      setChart(chart);
    }
  }, [element, props, chart]);

  useUnmountEffect(() => {
    if (chart) {
      chart.destroy();
      setChart(undefined);
    }
  });

  return (
    <div
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: 'sans-serif',
        height: `${height}px`,
      }}
    >
      {total ? (
        <div ref={callbackRef} />
      ) : (
        <Space align="center" style={{ height: height }}>
          <Empty description={<span>No Jobs Available</span>} />
        </Space>
      )}
    </div>
  );
};

export default React.memo(JobCountsPieChart, arePropsEqual);

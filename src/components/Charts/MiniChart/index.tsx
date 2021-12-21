import { useUnmountEffect } from '@/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from '../index.less';
import bb, { bar, area, line, Chart as bbChart } from 'billboard.js';
// @ts-ignore
import Sparkline from 'billboard.js/dist/plugin/billboardjs-plugin-sparkline.js';

export interface MiniChartProps {
  color?: string;
  width?: number;
  height?: number;
  dimensionName?: string;
  data: {
    x: number | string;
    y: number;
  }[];
  forceFit?: boolean;
  style?: React.CSSProperties;
  type?: 'line' | 'area' | 'bar';
}

const MiniChart: React.FC<MiniChartProps> = (props) => {
  const [chart, setChart] = useState<bbChart>();
  const [chartData, setChartData] = useState<Record<string, number>[]>([]);
  const [chartElement, setChartElement] = useState<HTMLDivElement | null>(null);

  const {
    height = 150,
    forceFit = true,
    color = '#1890FF',
    data = [],
    type = 'line',
    dimensionName = 'data',
  } = props;

  const padding: [number, number, number, number] = [36, 5, 30, 5];

  useEffect(() => {
    const res = data.map((item) => {
      return {
        [dimensionName]: item.y,
      };
    });
    setChartData(res);
  }, [props.data]);

  function getChartOpts() {
    const x = ['x', ...data.map((item) => item.x)];
    const values = [dimensionName, ...data.map((item) => item.y)];
    let _type;
    switch (type) {
      case 'line':
        _type = line();
        break;
      case 'area':
        _type = area();
        break;
      case 'bar':
        _type = bar();
        break;
      default:
        _type = line();
        break;
    }
    return {
      data: {
        columns: [values],
      },
      type: _type,
      types: {
        [dimensionName]: _type,
      },
      plugins: [
        new Sparkline({
          selector: '.miniChart',
        }),
      ],
    };
  }

  useEffect(() => {
    if (!chartElement) {
      return;
    }
    const config = getChartOpts();
    if (chart) {
      chart.load({
        data: chartData,
      });
    } else {
      const chart = bb.generate({
        bindto: chartElement,
        ...config,
      });
      setChart(chart);
    }
  }, [chartElement, props, chart]);

  useUnmountEffect(() => {
    if (chart) {
      chart.destroy();
    }
  });

  const refCallback = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    setChartElement(node);
  }, []);

  // todo: skeleton
  return (
    <div className={styles.miniChart} style={{ height }}>
      <div className={styles.chartContent}>
        <AutoSizer>
          {({ width, height }) => (
            <div
              className="miniChart"
              ref={refCallback}
              style={{
                width: props.width ?? width,
                height: props.height ?? height,
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default MiniChart;

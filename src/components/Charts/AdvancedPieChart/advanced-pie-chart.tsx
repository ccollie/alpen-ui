import { DonutChart } from 'bizcharts';
import React, { ReactNode, useEffect, useState } from 'react';
import { isDate } from '@/lib';
import {
  calculateViewDimensions,
  ColorHelper,
  ColorMapper,
  CustomColor,
  DataItem,
  ViewDimensions,
} from '../common';
import './advanced-pie-chart.scss';
import AdvancedPieLegend from './advanced-pie-legend';

export interface AdvancedPieChartEventArgs {
  value: DataItem;
  entries: DataItem[];
}

interface AdvancedPieChartProps {
  scheme?: string;
  animations?: boolean;
  data?: DataItem[];
  label?: string;
  width?: number;
  height?: number;
  tooltipText?: ReactNode;
  tooltipDisabled?: boolean;
  activeEntries?: DataItem[];
  valueFormatter: (value: number) => any;
  nameFormatter: (value: string) => string;
  percentageFormatter: (value: number) => string;
  onSelect?: (event: AdvancedPieChartEventArgs) => void;
  onActivate?: (event: AdvancedPieChartEventArgs) => void;
  onDeactivate?: (event: AdvancedPieChartEventArgs) => void;
  customColors?: ColorMapper | CustomColor[];
}

const AdvancedPieChart: React.FC<AdvancedPieChartProps> = (props) => {
  const {
    data = [],
    width = 600,
    height = 400,
    tooltipDisabled = false,
    tooltipText,
    label = 'Total',
    scheme = 'fire',
    animations = true,
    onDeactivate,
    onActivate,
    onSelect,
    customColors,
  } = props;

  const [outerRadius, setOuterRadius] = useState(0.8);
  const [innerRadius, setInnerRadius] = useState(0);
  const [dims, setDims] = useState<ViewDimensions>();
  const [activeEntries, setActiveEntries] = useState<DataItem[]>(
    props.activeEntries || [],
  );
  const [domain, setDomain] = useState<any[]>([]);
  const [transform, setTransform] = useState('');
  const [legendWidth, setLegendWidth] = useState(0);
  const [colors, setColors] = useState<ColorHelper>();
  const [legendData, setLegendData] = useState<
    { name: string; value: number }[]
  >([]);
  const margin = [20, 20, 20, 20];

  useEffect(() => {
    const _d = calculateViewDimensions({
      width: (width * 4) / 12.0,
      height,
      margins: margin as number[],
    });

    setDims(_d);

    const xOffset = _d.width / 2;
    const yOffset = margin[0] + _d.height / 2;
    setLegendWidth(width - _d.width - margin[1]);

    setOuterRadius(Math.min(_d.width, _d.height) / 2.5);
    setInnerRadius(outerRadius * 0.75);
    setTransform(`translate(${xOffset} , ${yOffset})`);
  }, [width, height]);

  useEffect(() => {
    const l = data.map(({ name, value }) => {
      if (isDate(value)) {
        value = value.getTime();
      }
      return { name, value };
    });
    setLegendData(l);
    setDomain(data.map((d) => d.value));
  }, [data]);

  useEffect(() => {
    setColors(new ColorHelper(scheme, 'ordinal', domain, customColors));
  }, [scheme, domain, customColors]);

  function onClick(data: DataItem) {
    onSelect?.({ value: data, entries: activeEntries });
  }

  function getColor(datum: Record<string, any>): string {
    const val = datum['value'];
    return colors?.getColor(val);
  }

  function findItemIndex(item: DataItem, fromLegend = false): number {
    const _item = data.find((d) => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    if (!_item) return -1;

    return activeEntries.findIndex((d) => {
      return (
        d.name === _item.name &&
        d.value === _item.value &&
        d.series === _item.series
      );
    });
  }

  function handleActivate(item: DataItem, fromLegend = false) {
    const idx = findItemIndex(item, fromLegend);
    if (idx > -1) {
      return;
    }

    setActiveEntries([item, ...activeEntries]);
    onActivate?.({ value: item, entries: activeEntries });
  }

  function handleDeactivate(item: DataItem, fromLegend = false) {
    const idx = findItemIndex(item, fromLegend);
    if (idx > -1) {
      return;
    }
    setActiveEntries([...activeEntries.splice(idx, 1)]);

    onDeactivate?.({ value: item, entries: activeEntries });
  }

  const dimWidth = dims?.width ?? 0;
  const dimHeight = dims?.height ?? 0;

  const rest: Record<string, any> = Object.create(null);
  if (tooltipDisabled) {
    rest['toolbar'] = false;
  }
  return (
    <div style={{ width: width, height: height }}>
      <div
        className="advanced-pie chart"
        style={{ width: dimWidth, height: dimHeight }}
      >
        <DonutChart
          data={data}
          height={height}
          radius={outerRadius}
          innerRadius={innerRadius}
          padding="auto"
          autoFit
          angleField="value"
          colorField="status"
          color={getColor}
          label={{
            visible: !!label,
            type: 'outer-center',
          }}
          statistic={{
            title: {
              formatter: () => label,
            },
          }}
          {...rest}
        />
      </div>
      <div
        className="advanced-pie-legend-wrapper"
        style={{
          width: width - dimWidth,
          height,
        }}
      >
        <AdvancedPieLegend
          data={legendData}
          colors={colors}
          width={width - dimWidth - margin[1]}
          label={props.label}
          animations={animations}
          valueFormatter={props.valueFormatter}
          labelFormatter={props.nameFormatter}
          percentageFormatter={props.percentageFormatter}
          onSelect={onClick}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        />
      </div>
    </div>
  );
};

export default AdvancedPieChart;

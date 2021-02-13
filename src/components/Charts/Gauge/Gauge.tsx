import { ScaleLinear, scaleLinear } from 'd3-scale';
import React, { useEffect, useState } from 'react';
import { RadialBar } from '@ant-design/charts';
import {
  ColorHelper,
  ColorMapper,
  CustomColor,
  calculateViewDimensions,
  DataItem,
} from '../common';
import GaugeAxis from './GaugeAxis';
import './gauge.scss';

// @Component({
//   styleUrls: ["../common/base-chart.component.scss"]
// })

interface GaugeEventArgs {
  value: any;
  entries: any[];
}

interface GaugeProps {
  angleSpan?: number;
  scheme?: string;
  legend?: boolean;
  legendTitle?: string;
  legendPosition?: 'left' | 'right';
  min?: number;
  max?: number;
  bigSegments?: number;
  smallSegments?: number;
  showAxis?: boolean;
  startAngle?: number;
  showText?: boolean;
  data: any[];
  activeEntries?: any[];
  units?: string;
  textValue?: string;
  tooltipDisabled?: boolean;
  axisTickFormatter?: () => string;
  valueFormatter?: (value: any) => string;
  margin?: [number, number, number, number];
  width?: number;
  height?: number;
  autoFit?: boolean;
  customColors: CustomColor[] | ColorMapper;
  onSelect?: (data: DataItem) => void;
  onActivate?: (event: GaugeEventArgs) => void;
  onDeactivate?: (event: GaugeEventArgs) => void;
}

export type GaugeScaleFn = ScaleLinear<number, any>;
const DefaultValueScale: GaugeScaleFn = scaleLinear();

const Gauge: React.FC<GaugeProps> = (props) => {
  const {
    scheme = 'cool',
    legend = false,
    legendTitle = 'Legend',
    legendPosition = 'right',
    textValue,
    units,
    bigSegments = 10,
    smallSegments = 5,
    data = [],
    showAxis = true,
    axisTickFormatter,
    tooltipDisabled = false,
    showText = true,
    width = 400,
    height = 300,
    customColors,
    onActivate,
    onDeactivate,
    onSelect,
    valueFormatter,
    angleSpan: _angleSpan = 240,
    startAngle: _startAngle = -120,
    // Specify margins
  } = props;

  const [angleSpan] = useState(Math.min(_angleSpan, 360));
  const [startAngle, setStartAngle] = useState(_startAngle);
  const [outerRadius, setOuterRadius] = useState(0);
  const [min, setMin] = useState(props.min ?? 0);
  const [max, setMax] = useState(props.max ?? 100);
  const [rotation, setRotation] = useState('');
  const [transform, setTransform] = useState('');
  const [activeEntries, setActiveEntries] = useState<any[]>([]);
  const [valueScale, setValueScale] = useState<GaugeScaleFn>(DefaultValueScale);
  const [displayValue, setDisplayValue] = useState('');
  const [margin, setMargin] = useState<
    [number, number, number, number] | undefined
  >(props.margin);
  const [colors, setColors] = useState<ColorHelper>();
  const [valueDomain, setValueDomain] = useState<number[]>([0, 1]);

  useEffect(() => {
    const fn = scaleLinear().range([0, angleSpan]).nice().domain(valueDomain);
    setValueScale(fn);
  }, [angleSpan, valueDomain]);

  useEffect(() => {
    // make the starting angle positive
    setStartAngle(_startAngle);
    if (_startAngle < 0) {
      setStartAngle((_startAngle % 360) + 360);
    }
    setRotation(`rotate(${startAngle})`);
  }, [_startAngle]);

  useEffect(() => {
    if (!showAxis) {
      if (!props.margin) {
        setMargin([10, 20, 10, 20]);
      }
    } else {
      if (!props.margin) {
        setMargin([60, 100, 60, 100]);
      }
    }

    const dims = calculateViewDimensions({
      width,
      height,
      margins: margin as number[],
      showLegend: legend,
      legendPosition,
    });

    setOuterRadius(Math.min(dims.width, dims.height) / 2);

    const xOffset = (margin?.[3] || 0) + dims.width / 2;
    const yOffset = (margin?.[0] || 0) + dims.height / 2;

    setTransform(`translate(${xOffset}, ${yOffset})`);
  }, [showAxis, props.margin, legend, legendPosition]);

  useEffect(() => {
    const domain = getDomain();
    const _c = new ColorHelper(scheme, 'ordinal', domain, customColors);
    setColors(_c);
  }, [scheme, data]);

  function getDomain(): any[] {
    return data.map((d) => d.name);
  }

  function getColor(datum: Record<string, any>): string {
    const val = datum['value'];
    return colors?.getColor(val);
  }

  useEffect(() => {
    const values = data.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);

    if (props.min !== undefined) {
      setMin(Math.min(props.min, dataMin));
    } else {
      setMin(dataMin);
    }

    if (props.max !== undefined) {
      setMax(Math.max(props.max, dataMax));
    } else {
      setMax(dataMax);
    }

    setValueDomain([min, max]);
  }, [props.min, props.max, data]);

  useEffect(() => {
    let val: string;
    if (textValue && 0 !== textValue.length) {
      val = textValue.toLocaleString();
    } else {
      const value = data.map((d) => d.value).reduce((a, b) => a + b, 0);
      if (valueFormatter) {
        val = valueFormatter(value);
      }
      val = value.toLocaleString();
    }
    setDisplayValue(val);
  }, [valueFormatter, textValue, data]);

  function onClick(data: DataItem): void {
    onSelect?.(data);
  }

  function handleActivate(item: DataItem): void {
    const idx = activeEntries.find((d) => {
      return d.name === item.name && d.value === item.value;
    });
    if (idx > -1) {
      return;
    }

    setActiveEntries([item, ...activeEntries]);
    onActivate?.({ value: item, entries: activeEntries });
  }

  function handleDeactivate(item: DataItem): void {
    const idx = activeEntries.findIndex((d) => {
      return d.name === item.name && d.value === item.value;
    });

    setActiveEntries([...activeEntries.splice(idx, 1)]);

    onDeactivate?.({ value: item, entries: activeEntries });
  }

  function isActive(entry: DataItem): boolean {
    return !!activeEntries.find((d) => {
      return entry.name === d.name && entry.series === d.series;
    });
  }

  // todo: useRef
  const chartConfig = {
    width,
    height,
    data,
    xField: 'name',
    yField: 'value',
    maxAngle: Math.max(startAngle + angleSpan),
    radius: 0.8,
    innerRadius: 0.2,
    tooltip: {
      formatter: function formatter(datum: any) {
        return {
          name: 'value',
          value: datum.value,
        };
      },
    },
    colorField: 'value',
    color: getColor,
  };

  return (
    <div style={{ width, height }}>
      <g transform={transform} className="gauge chart">
        <g transform={rotation}></g>
        {showAxis && (
          <GaugeAxis
            bigSegments={bigSegments}
            smallSegments={smallSegments}
            radius={outerRadius}
            angleSpan={angleSpan}
            valueScale={valueScale}
            startAngle={startAngle}
            tickFormatter={axisTickFormatter}
          />
        )}
        <RadialBar {...chartConfig} />
        {showText && (
          <div>
            {displayValue} {units}
          </div>
        )}
      </g>
    </div>
  );
};

export default Gauge;

import classNames from 'classnames';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import React, { useEffect, useRef } from 'react';
import { usePrevious } from '@/hooks';
import { getColorRange } from './colorScale';

const maxXaxis = '40%';
const maxYaxis = '40%';
const DEFAULT_MAX_RADIUS = 125;

interface JobRateCircleChartProps {
  rate: number;
  errorPercentage: number;
  opacity?: number;
  height?: string | number;
  width?: string | number;
  maxRate?: number;
  maxRadius?: number;
}

export const errorColorRange = getColorRange(0, 100);

type BaseFn = (x: number) => string;

function getValue(fn: BaseFn, rate: number, max: any) {
  let val = fn(rate);
  if (parseInt(val) > parseInt(max)) {
    val = max;
  }
  return val;
}

function getAxisFunction(maxRate: number, maxAxis: string): BaseFn {
  return scaleLinear<string>().domain([0, maxRate]).range(['30%', maxAxis]);
}

const Identity: BaseFn = (x: number) => x + '%';

type MemoizedFunctions = {
  xAxis: BaseFn;
  yAxis: BaseFn;
  radius: BaseFn;
};

const RateCircleChart: React.FC<JobRateCircleChartProps> = (props) => {
  const {
    opacity = 0.5,
    errorPercentage = 0,
    height = '100%',
    width = '100%',
    maxRate = 0,
    rate = 0,
    maxRadius = DEFAULT_MAX_RADIUS,
    children,
  } = props;

  const functions = useRef<MemoizedFunctions>({
    xAxis: Identity,
    yAxis: Identity,
    radius: Identity,
  });

  useEffect(() => {
    functions.current.xAxis = getAxisFunction(maxRate, maxXaxis);
    functions.current.yAxis = getAxisFunction(maxRate, maxXaxis);
  }, [maxRate]);

  useEffect(() => {
    functions.current.radius = scaleSqrt<string>()
      .domain([0, maxRate])
      .range(['5', '' + maxRadius]);
  }, [maxRadius]);

  const xAxis = getValue(functions.current.xAxis, rate, maxXaxis);
  const yAxis = getValue(functions.current.yAxis, rate, maxYaxis);
  const radius = getValue(functions.current.radius, rate, maxRadius);
  const fill = errorColorRange(errorPercentage);
  const r = parseInt(radius);

  const prev = usePrevious(r);
  const diff = r - (prev ?? r);

  const clazz = classNames({
    'scale-up-center': diff > 0,
    'scale-down-center': diff < 0,
  });

  return (
    <svg viewBox="0 0 100 100" width={width} height={height}>
      <circle
        cx={xAxis}
        cy={yAxis}
        r={radius}
        fill={fill}
        opacity={opacity}
        className={clazz}
      >
        {children}
      </circle>
    </svg>
  );
};

export default RateCircleChart;

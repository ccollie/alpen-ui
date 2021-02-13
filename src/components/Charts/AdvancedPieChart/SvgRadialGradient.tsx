import React, { useEffect, useState } from 'react';

interface SvgRadialGradientProps {
  color: string;
  name?: string;
  startOpacity: number;
  endOpacity?: number;
  cx?: number;
  cy?: number;
  stops?: Stop[];
  [prop: string]: any;
}

interface Stop {
  offset: number;
  opacity: number;
  color: string;
}

const SvgRadialGradient: React.FC<SvgRadialGradientProps> = (props) => {
  const {
    color,
    name,
    startOpacity,
    endOpacity = 1,
    cx = 0,
    cy = 0,
    stops: stopsInput,
    ...rest
  } = props;

  const [r, setR] = useState('30%');
  const [stops, setStops] = useState<Stop[]>([]);
  const [stopsDefault, setStopsDefault] = useState<Stop[]>([]);

  useEffect(() => {
    setR('30%');
  });

  useEffect(() => {
    const val = [
      {
        offset: 0,
        color,
        opacity: startOpacity,
      },
      {
        offset: 100,
        color,
        opacity: endOpacity,
      },
    ];
    setStopsDefault(val);
  }, [startOpacity, endOpacity, color]);

  useEffect(() => {
    setStops(stopsInput || stopsDefault || []);
  }, [stopsInput, stopsDefault]);

  return (
    <radialGradient
      id={name}
      cx={cx}
      cy={cy}
      r={r}
      gradientUnits="userSpaceOnUse"
      {...rest}
    >
      {stops.map((stop) => (
        <stop
          offset={stop.offset + '%'}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </radialGradient>
  );
};

export default SvgRadialGradient;

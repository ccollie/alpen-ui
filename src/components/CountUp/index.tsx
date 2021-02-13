import React, { useCallback, useEffect, useState } from 'react';
import { count, decimalChecker } from './helper';

/**
 * Count up component
 *
 * Loosely inspired by:
 *  - https://github.com/izupet/angular2-counto
 *  - https://inorganik.github.io/countUp.js/
 *
 * @export
 * @class CountUpDirective
 */
interface CountUpProps {
  countDecimals?: number;
  countDuration?: number;
  countTo?: number;
  countFrom?: number;
  countPrefix?: string;
  countSuffix?: string;
  valueFormatter?: (value: number) => string;
  onCountChange?: (value: number, progress: number) => void;
  onCountFinish?: (value: number) => void;
  [prop: string]: any;
}

const CountUp: React.FC<CountUpProps> = (props) => {
  const {
    countDuration = 1,
    countPrefix = '',
    countSuffix = '',
    valueFormatter,
    ...rest
  } = props;

  const [countTo, setCountTo] = useState(props.countTo || 0);
  const [countFrom, setCountFrom] = useState(props.countFrom || 0);
  const [value, setValue] = useState('');
  const [countDecimals, setCountDecimals] = useState(props.countDecimals || 0);

  const defaultFormatter = (value: number) =>
    `${countPrefix}${value.toLocaleString()}${countSuffix}`;

  const formatter = useCallback(valueFormatter || defaultFormatter, [
    valueFormatter,
  ]);

  useEffect(start, [countTo, countFrom]);
  useEffect(() => {
    if (!countDecimals) {
      setCountDecimals(decimalChecker(countTo));
    }
  }, [countTo]);

  useEffect(() => {
    return stop;
  }, []);

  const [animationReq, setAnimationReq] = useState(0);

  function stop(): void {
    if (animationReq) {
      cancelAnimationFrame(animationReq);
      setAnimationReq(0);
    }
  }

  function start() {
    stop();

    const callback = (
      value: number,
      progress: number,
      timestamp: number,
      finished: boolean,
    ) => {
      setValue(formatter(value));
      if (!finished && props.onCountChange)
        props.onCountChange(value, progress);

      if (finished && props.onCountFinish) props.onCountFinish(value);
    };

    const req = count(
      countFrom,
      countTo,
      countDecimals,
      countDuration,
      callback,
    );
    setAnimationReq(req);
  }

  return <span {...rest}>{value}</span>;
};

export default CountUp;

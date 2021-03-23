// https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useInterval.js
import { useEffect, useState, useCallback, useRef } from 'react';
import Timeout = NodeJS.Timeout;

type Delay = number | null;
type TimerHandler = (...args: any[]) => void;

const defaultOptions = {
  cancelOnUnmount: true,
};

/**
 * An async-utility hook that accepts a callback function and a delay time (in milliseconds), then repeats the
 * execution of the given function by the defined milliseconds.
 */
const useInterval = (
  fn: TimerHandler,
  milliseconds: Delay,
  options = defaultOptions,
) => {
  const opts = { ...defaultOptions, ...(options || {}) };
  const timeout = useRef<Timeout>();
  const callback = useRef(fn);
  const [isCleared, setIsCleared] = useState(false);

  function setup() {
    if (typeof milliseconds === 'number') {
      timeout.current = setInterval(() => {
        callback.current();
      }, milliseconds);
    }
  }

  // the clear method
  const clear = useCallback(() => {
    if (timeout.current) {
      setIsCleared(true);
      clearInterval(timeout.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    setup();
    setIsCleared(false);
  }, []);

  // if the provided function changes, change its reference
  useEffect(() => {
    if (typeof fn === 'function') {
      callback.current = fn;
    }
  }, [fn]);

  // when the milliseconds change, reset the timeout
  useEffect(() => {
    reset();
    // cleanup previous interval
    return clear;
  }, [milliseconds]);

  // when component unmount clear the timeout
  useEffect(
    () => () => {
      if (opts.cancelOnUnmount) {
        clear();
      }
    },
    [],
  );

  return { isCleared, clear, reset };
};

export { useInterval };
export default useInterval;

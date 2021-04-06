// https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/useTimeout.js
import { useCallbackRef } from '@/hooks/use-callback-ref';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import { useEffect, useState, useCallback, useRef } from 'react';
import Timeout = NodeJS.Timeout;
type Delay = number | null;

type TimeoutHandler = (...args: any[]) => void;
const defaultOptions = {
  cancelOnUnmount: true,
};

/**
 * An async-utility hook that accepts a callback function and a delay time (in milliseconds), then delays the
 * execution of the given function by the defined time.
 */
const useTimeout = (
  fn: TimeoutHandler,
  milliseconds: Delay,
  options = defaultOptions,
) => {
  const opts = { ...defaultOptions, ...(options || {}) };
  const timeout = useRef<Timeout>();
  const callback = useCallbackRef(fn);
  const [isCleared, setIsCleared] = useState(false);

  // the clear method
  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      setIsCleared(true);
    }
  }, []);

  const start = useCallback(() => {
    if (typeof milliseconds === 'number') {
      timeout.current = setTimeout(() => {
        callback();
      }, milliseconds);
    }
  }, []);

  // when the milliseconds change, reset the timeout
  useEffect(() => {
    start();
    return clear;
  }, [milliseconds]);

  // when component unmount clear the timeout
  useUnmountEffect(() => {
    if (opts.cancelOnUnmount) {
      clear();
    }
  });

  return [isCleared, clear, start];
};

export { useTimeout };
export default useTimeout;

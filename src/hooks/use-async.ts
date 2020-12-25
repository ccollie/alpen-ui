import { useCallback, useEffect, useRef, useState } from 'react';

export enum AsyncState {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const useAsync = (
  asyncFunction: (...args: any[]) => any | void | Promise<void | any>,
) => {
  const [status, setStatus] = useState<AsyncState>(AsyncState.IDLE);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const unmounted = useRef(false);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    (...args: any[]) => {
      const mounted = !unmounted.current;

      if (mounted) {
        setStatus(AsyncState.PENDING);
        setLoading(true);
        setValue(null);
        setError(null);
      }

      return Promise.resolve(asyncFunction(...args))
        .then((response) => {
          if (mounted) {
            setValue(response);
            setStatus(AsyncState.SUCCESS);
          }
          return response;
        })
        .catch((error) => {
          if (mounted) {
            setError(error);
            setStatus(AsyncState.ERROR);
          }
        })
        .finally(() => {
          if (mounted) {
            setLoading(false);
            setCalled(true);
          }
        });
    },
    [asyncFunction],
  );

  useEffect(
    () => () => {
      unmounted.current = true;
    },
    [],
  );

  return { execute, status, loading, called, value, error };
};

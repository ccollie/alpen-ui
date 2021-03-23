// Source: chakra-ui
import React, { useLayoutEffect } from 'react';

/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
export function useCallbackRef<T extends (...args: any[]) => any>(
  fn: T | undefined,
): T {
  const ref = React.useRef(fn);

  useLayoutEffect(() => {
    ref.current = fn;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(((...args) => ref.current?.(...args)) as T, []);
}

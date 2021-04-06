import { useCallbackRef } from '@/hooks/use-callback-ref';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';
import debounce from 'lodash.debounce';

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

type Fn = (...args: any) => any;

export function useDebounceFn<T extends Fn>(fn: T, options?: DebounceOptions) {
  const callback = useCallbackRef(fn);

  const wait = options?.wait ?? 1000;
  const debounced = debounce(callback, wait, options);
  useUnmountEffect(debounced.cancel);

  return {
    run: (debounced as unknown) as T,
    cancel: debounced.cancel,
    flush: debounced.flush,
  };
}

export default useDebounceFn;

import { useEffect, EffectCallback, DependencyList, useState } from 'react';
import { DebounceOptions, useDebounceFn } from './use-debounce';
import { useUpdateEffect } from './use-update-effect';
import { useUnmountEffect } from './use-unmount-effect';

export function useDebounceEffect(
  effect: EffectCallback,
  deps?: DependencyList,
  options?: DebounceOptions,
) {
  const [flag, setFlag] = useState({});

  const { run, cancel } = useDebounceFn(() => {
    setFlag({});
  }, options);

  useEffect(() => {
    return run();
  }, deps);

  useUnmountEffect(cancel);

  useUpdateEffect(effect, [flag]);
}

export default useDebounceEffect;

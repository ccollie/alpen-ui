import { useEffect } from 'react';

type EffectFunction = (...args: any[]) => any | void;
// eslint-disable-next-line react-hooks/exhaustive-deps
const useEffectOnlyOnce = (func: EffectFunction, deps: any[] = []) =>
  useEffect(func, deps);

export default useEffectOnlyOnce;

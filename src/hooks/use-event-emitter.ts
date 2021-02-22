import { useState } from 'react';
import { EventEmitter, EventHandler, UnsubscribeFn } from '../lib';
import { useUnmountEffect } from './use-unmount-effect';

export function useEventEmitter() {
  const [cleanups, setCleanups] = useState<UnsubscribeFn[]>([]);

  useUnmountEffect(() => {
    cleanups.forEach((fn) => fn());
  });

  const subscribe = (event: string, handler: EventHandler) => {
    const cleanup = EventEmitter.subscribe(event, handler);
    setCleanups([cleanup, ...cleanups]);
  };

  const unsubscribe = (event: string, handler?: EventHandler) => {
    setCleanups(cleanups.filter((x) => x !== handler));
    EventEmitter.unsubscribe(event, handler);
  };

  const dispatch = (event: string, data?: any): void => {
    EventEmitter.dispatch(event, data);
  };

  return { subscribe, unsubscribe, dispatch };
}

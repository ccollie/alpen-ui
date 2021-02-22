export type EventHandler = (data: any) => void;
export type UnsubscribeFn = () => void;

const _events = new Map<string, EventHandler[]>();

const getHandlers = (key: string) => _events.get(key) ?? [];
const removeHandler = (key: string, handler?: EventHandler) => {
  const handlers = getHandlers(key).filter((x) => x !== handler);
  _events.set(key, handlers);
};

export const EventEmitter = {
  dispatch(event: string, data: any) {
    getHandlers(event).forEach((callback) => callback(data));
  },
  subscribe(event: string, callback: EventHandler): UnsubscribeFn {
    const handlers = [callback, ...getHandlers(event)];
    _events.set(event, handlers);
    return () => removeHandler(event, callback);
  },
  unsubscribe(event: string, handler?: EventHandler) {
    if (!handler) {
      _events.delete(event);
      return;
    }
    const handlers = getHandlers(event).filter((x) => x !== handler);
    _events.set(event, handlers);
  },
};

import createStore, { UseBoundStore } from 'zustand';

type TState<T = string> = {
  selected: Set<T>;
  addItem: (item: T) => void;
  toggleItem: (item: T) => void;
  setItems: (items: T[] | Set<T>) => void;
  removeItem: (item: T) => void;
  removeItems: (items: T[]) => void;
  clear: () => void;
};

export function createSelectedItemsStore<T>(): UseBoundStore<TState<T>> {
  return createStore<TState<T>>((set, get) => ({
    selected: new Set(),
    setItems: (items) =>
      set({
        selected: new Set(items),
      }),
    addItem: (item) =>
      set({
        selected: new Set(get().selected).add(item),
      }),
    toggleItem: (item) => {
      const { selected } = get();
      if (selected.has(item)) {
        selected.delete(item);
        set({ selected: new Set(selected) });
      } else {
        set({
          selected: new Set(selected).add(item),
        });
      }
    },
    removeItem: (item) => {
      const selected = new Set(get().selected);
      selected.delete(item);
      set({ selected });
    },
    removeItems: (items) => {
      const selected = new Set(get().selected);
      items.forEach((item) => selected.delete(item));
      set({ selected });
    },
    clear: () => {
      const { selected } = get();
      if (selected.size > 0) {
        set({
          selected: new Set(),
        });
      }
    },
  }));
}

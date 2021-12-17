import { QueueFilter, DefaultQueueFilter, isFilterEmpty } from '../filters';
import createStore from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageConfig } from '@/config/storage';
import { SortOrderEnum } from '@/api';

export type TQueueFiltersState = {
  hosts: Record<string, QueueFilter>;
  ensureHost: (id: string) => QueueFilter;
  removeHost: (id: string) => void;
  updateHostFilter: (id: string, update: Partial<QueueFilter>) => QueueFilter;
  excludeQueue: (hostId: string, queueId: string) => void;
  unexcludeQueue: (hostId: string, queueId: string) => void;
  selectQueue: (hostId: string, queueId: string) => void;
  unselectQueue: (hostId: string, queueId: string) => void;
  removeQueue: (hostId: string, queueId: string) => void;
  update: (hostId: string, filter: Partial<QueueFilter>) => void;
};

export const useQueueFiltersStore = createStore<TQueueFiltersState>(
  persist(
    (set, get) => ({
      hosts: Object.create(null),
      _findHost(hostId: string): QueueFilter {
        const hosts = get().hosts;
        return hosts[hostId];
      },
      ensureHost(hostId: string): QueueFilter {
        let hosts = get().hosts;
        let found = hosts[hostId];
        if (!found) {
          const filter: QueueFilter = {
            sortOrder: SortOrderEnum.Asc,
            sortBy: 'name',
            exclude: [],
            include: [],
          };
          const update = { ...hosts, [hostId]: filter };
          set({ hosts: update });
          hosts = get().hosts;
          found = hosts[hostId];
        }
        return found;
      },
      removeHost(id: string) {
        const { hosts } = get();
        if (!hosts[id]) return;
        const update = { ...hosts };
        delete update[id];
        set({ hosts: update });
      },
      updateHostFilter(id: string, update: Partial<QueueFilter>): QueueFilter {
        const hosts = get().hosts;
        const newItems = {
          ...hosts,
          [id]: {
            ...(hosts[id] ?? DefaultQueueFilter),
            ...update,
          },
        };
        set({ hosts: newItems });
        return newItems[id];
      },
      removeQueue(hostId: string, queueId: string) {
        const { ensureHost, updateHostFilter } = get();
        const host = ensureHost(hostId);
        const excluded = host.exclude ?? [];
        const included = host.include ?? [];
        updateHostFilter(hostId, {
          exclude: excluded.filter((x) => x !== queueId),
          include: included.filter((x) => x !== queueId),
        });
      },
      excludeQueue(hostId: string, queueId: string) {
        const { ensureHost, updateHostFilter } = get();
        const host = ensureHost(hostId);
        const excluded = host.exclude ?? [];
        const included = host.include ?? [];
        if (!excluded.includes(queueId)) {
          updateHostFilter(hostId, {
            exclude: [...excluded, queueId],
            include: included.filter((x) => x !== queueId),
          });
        }
      },
      selectQueue(hostId: string, queueId: string) {
        const { ensureHost, updateHostFilter } = get();
        const host = ensureHost(hostId);
        const included = host.include ?? [];
        const excluded = host.exclude ?? [];
        if (!included.includes(queueId)) {
          updateHostFilter(hostId, {
            include: [...included, queueId],
            exclude: excluded.filter((x) => x !== queueId),
          });
        }
      },
      unexcludeQueue(hostId: string, queueId: string) {
        const hosts = get().hosts;
        const host = hosts[hostId];
        if (!host) return;
        const excluded = host.exclude ?? [];
        const filtered = excluded.filter((x) => x !== queueId);
        if (excluded.length !== filtered.length) {
          get().updateHostFilter(hostId, { exclude: filtered });
        }
      },
      unselectQueue(hostId: string, queueId: string) {
        const { hosts, updateHostFilter } = get();
        const host = hosts[hostId];
        if (!host) return;
        const included = host.include ?? [];
        const filtered = included.filter((x) => x !== queueId);
        if (included.length !== filtered.length) {
          updateHostFilter(hostId, { include: filtered });
        } else {
          // not in the include list. add to excluded
          const excluded = host.exclude ?? [];
          if (!excluded.includes(queueId)) {
            updateHostFilter(hostId, { exclude: [...excluded, queueId] });
          }
        }
      },
      update(hostId: string, filter: Partial<QueueFilter>) {
        const { updateHostFilter } = get();
        updateHostFilter(hostId, filter);
      },
      isFilterEmpty(hostId: string) {
        const hosts = get().hosts;
        const filter = hosts[hostId];
        return isFilterEmpty(filter);
      },
    }),
    {
      name: `${StorageConfig.persistNs}queues-filter`,
    },
  ),
);

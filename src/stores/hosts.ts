import createStore from 'zustand';
import { computed } from 'zustand-middleware-computed-state';
import { Queue, QueueHost } from '@/api';

export type THostState = {
  hosts: QueueHost[];
  activeQueue: Queue | undefined;
  activeQueueId: string;
  setHosts: (hosts: QueueHost[]) => void;
  addHost: (item: QueueHost) => void;
  removeHost: (id: string) => void;
  findQueue: (id: string) => Queue | undefined;
  findHost: (id: string) => QueueHost | undefined;
  updateQueue: (
    id: string,
    update: Partial<Omit<Queue, 'id' | 'hostId'>>,
  ) => Queue;
  removeQueue(id: string): Queue;
  updateHost: (id: string, delta: Partial<Omit<QueueHost, 'id'>>) => void;
};

export const useHostsStore = createStore<THostState>(
  computed(
    (set, get) => ({
      hosts: [],
      activeQueue: undefined,
      activeQueueId: '',
      setHosts(hosts: QueueHost[]) {
        set({ hosts });
      },
      addHost(host: QueueHost) {
        const { hosts } = get();
        if (!hosts.find((x) => x.id === host.id)) {
          set({ hosts: [...hosts, host] });
        }
      },
      removeHost(id: string) {
        const { hosts } = get();
        const filtered = hosts.filter((x) => x.id !== id);
        if (filtered.length !== hosts.length) {
          set({ hosts: filtered });
        }
      },
      _findQueue(id: string): {
        queue: Queue | undefined;
        hostIndex: number;
        queueIndex: number;
      } {
        if (!id)
          return {
            queue: undefined,
            hostIndex: -1,
            queueIndex: -1,
          };
        const { hosts } = get();
        let queue: Queue | undefined;
        let queueIndex = -1;
        let hostIndex = -1;
        for (let i = 0; i < hosts.length && !queue; i++) {
          const host = hosts[i];
          queueIndex = host.queues?.findIndex((x) => x.id == id) ?? -1;
          if (queueIndex >= 0) {
            hostIndex = i;
            queue = host.queues[queueIndex];
          }
        }
        return {
          queue,
          queueIndex,
          hostIndex,
        };
      },
      findQueue(id: string): Queue | undefined {
        const { queue } = (get() as any)._findQueue(id);
        return queue;
      },
      removeQueue(id: string): Queue {
        const { hosts } = get();
        const { queue, hostIndex } = (get() as any)._findQueue(id);
        if (queue) {
          const host = hosts[hostIndex];
          const queues = [...host.queues].filter((x) => x.id !== id);
          const newHosts = [...hosts];
          newHosts[hostIndex] = {
            ...host,
            queues,
          };
          set({ hosts: newHosts });
        }
        return queue;
      },
      updateQueue(
        id: string,
        update: Partial<Omit<Queue, 'id' | 'hostId'>>,
      ): Queue {
        const { hosts } = get();
        const {
          queue: found,
          hostIndex,
          queueIndex,
        } = (get() as any)._findQueue(id);
        if (found) {
          const host = hosts[hostIndex];
          const queues = [...host.queues];
          queues[queueIndex] = {
            ...found,
            ...update,
          };
          const newHosts = [...hosts];
          newHosts[hostIndex] = {
            ...host,
            queues,
          };
          set({ hosts: newHosts });
        }
        return found;
      },
      findHost(id: string): QueueHost | undefined {
        const { hosts } = get();
        return hosts.find((x) => x.id === id);
      },
      updateHost(id: string, delta: Partial<Omit<QueueHost, 'id'>>) {
        const { hosts } = get();
        const idx = hosts.findIndex((x) => x.id === id);
        if (idx >= 0) {
          const h = [...hosts];
          h[idx] = {
            ...hosts[idx],
            ...delta,
          };
          set({ hosts: h });
        }
      },
    }),
    (state) => {
      const activeQueue = () => state.findQueue(state.activeQueueId);

      return {
        activeQueue,
      };
    },
  ),
);

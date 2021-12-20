import createStore from 'zustand';
import { computed } from 'zustand-middleware-computed-state';
import { Queue, QueueHost } from '@/api';

export type THostState = {
  hosts: QueueHost[];
  activeQueue: Queue | undefined;
  activeQueueId: string;
  setHosts: (hosts: QueueHost[]) => void;
  updateHosts: (hosts: QueueHost[]) => void;
  addHost: (item: QueueHost) => void;
  findHost: (id: string) => QueueHost | undefined;
  removeHost: (id: string) => void;
  addQueue(hostId: string, queue: Queue): boolean;
  findQueue: (id: string) => Queue | undefined;
  updateQueue: (
    id: string,
    update: Partial<Omit<Queue, 'id' | 'hostId'>>,
  ) => Queue;
  removeQueue(id: string): Queue;
  updateHost: (id: string, delta: Partial<Omit<QueueHost, 'id'>>) => boolean;
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
      _updateHostQueues(host: QueueHost, queues: Queue[]) {
        const { hosts } = get();
        const hostIndex = hosts.findIndex((x) => x.id === host.id);
        if (hostIndex >= 0) {
          const newHost = { ...hosts[hostIndex], queues };
          const newHosts = [...hosts];
          newHosts[hostIndex] = newHost;
          set({ hosts: newHosts });
        }
      },
      findQueue(id: string): Queue | undefined {
        const { queue } = (get() as any)._findQueue(id);
        return queue;
      },
      addQueue(hostId: string, queue: Queue): boolean {
        const { hosts } = get();
        const hostIndex = hosts.findIndex((x) => x.id === hostId);
        if (hostIndex < 0) return false;
        const host = hosts[hostIndex];
        const queues = host.queues || [];
        const current = queues.find((x) => x.id === queue.id);
        if (!current) {
          queues.push(queue);
          (get() as any)._updateHostQueues(host, queues);
        }
        return !current;
      },
      removeQueue(id: string): Queue {
        const { hosts } = get();
        const { queue, hostIndex } = (get() as any)._findQueue(id);
        if (queue) {
          const host = hosts[hostIndex];
          const queues = [...host.queues].filter((x) => x.id !== id);
          (get() as any)._updateHostQueues(host, queues);
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
          (get() as any)._updateHostQueues(host, queues);
        }
        return found;
      },
      findHost(id: string): QueueHost | undefined {
        const { hosts } = get();
        return hosts.find((x) => x.id === id);
      },
      updateHosts(hosts: QueueHost[]): void {
        const { hosts: current } = get();
        const newMap = new Map(hosts.map((x) => [x.id, x]));
        const update = {
          hosts: current.reduce((acc: QueueHost[], host) => {
            const modified = newMap.get(host.id);
            if (modified) {
              newMap.delete(host.id);
              return acc.concat({
                ...host,
                ...modified,
              });
            }
            return acc;
          }, []),
        };
        update.hosts = [...update.hosts, ...newMap.values()];
        set(update);
      },
      updateHost(id: string, delta: Partial<Omit<QueueHost, 'id'>>): boolean {
        const { hosts } = get();
        const idx = hosts.findIndex((x) => x.id === id);
        if (idx >= 0) {
          const h = [...hosts];
          h[idx] = {
            ...hosts[idx],
            ...delta,
          };
          set({ hosts: h });
          return true;
        }
        return false;
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

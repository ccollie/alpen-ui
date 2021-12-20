import { useHostsStore } from '@/stores/hosts';
import { QueueActions } from '@/@types';
import {
  deleteQueue,
  discoverQueues,
  drainQueue,
  pauseQueue,
  registerQueue,
  resumeQueue,
  unregisterQueue,
} from '@/api';

// move this to store ??
export function useQueueActions(): QueueActions {
  const hostsStore = useHostsStore();

  function register(hostId: string, prefix: string, name: string) {
    return registerQueue(hostId, prefix, name, true).then((queue) => {
      hostsStore.addQueue(hostId, queue);
      return queue;
    });
  }

  function handleDelete(queueId: string) {
    return deleteQueue(queueId).then((x) => {
      hostsStore.removeQueue(queueId);
      return x;
    });
  }

  return {
    pauseQueue,
    resumeQueue,
    drainQueue,
    deleteQueue: handleDelete,
    discoverQueues,
    registerQueue: register,
    unregisterQueue,
  };
}

import { useHostsStore } from '@/stores/hosts';
import { QueueActions } from '../@types/actions';
import {
  discoverQueues,
  pauseQueue,
  resumeQueue,
  drainQueue,
  deleteQueue,
  registerQueue,
  unregisterQueue,
} from '../api';

// move this to store ??
export function useQueueActions(): QueueActions {
  const hostsStore = useHostsStore();

  function register(hostId: string, prefix: string, name: string) {
    return registerQueue(hostId, prefix, name, true);
  }

  function handleDelete(queueId: string) {
    return deleteQueue(queueId).then((x) => {
      hostsStore.removeQueue(queueId);
      return x;
    });
  }

  const actions: QueueActions = {
    pauseQueue,
    resumeQueue,
    drainQueue,
    deleteQueue: handleDelete,
    discoverQueues,
    registerQueue: register,
    unregisterQueue,
  };

  return actions;
}

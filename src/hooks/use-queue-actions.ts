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
  function register(hostId: string, prefix: string, name: string) {
    return registerQueue(hostId, prefix, name, true);
  }

  const actions: QueueActions = {
    pauseQueue,
    resumeQueue,
    drainQueue,
    deleteQueue,
    discoverQueues,
    registerQueue: register,
    unregisterQueue,
  };

  return actions;
}

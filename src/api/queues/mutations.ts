import {
  CleanQueueDocument,
  CleanQueueMutation,
  DeleteJobSchemaDocument,
  DeleteJobSchemaMutation,
  DeleteQueueDocument,
  DeleteQueueMutation,
  DrainQueueDocument,
  DrainQueueMutation,
  GetHostsAndQueuesDocument,
  GetQueueByIdDocument,
  GetQueueJobCountsDocument,
  JobStatus,
  PauseQueueDocument,
  PauseQueueMutation,
  Queue,
  QueueFragmentDoc,
  ResumeQueueDocument,
  ResumeQueueMutation,
  UnregisterQueueDocument,
  UnregisterQueueMutation,
} from '../generated';
import { ApolloCache, ApolloError, FetchResult } from '@apollo/client';
import { client } from '../../providers/ApolloProvider';

export function updateCached<T>(
  cache: ApolloCache<T>,
  id: string,
  update: Record<string, any>,
): void {
  let queue;
  try {
    queue = cache.readQuery({
      query: GetQueueByIdDocument,
      variables: { id },
    });
  } catch {
    return;
  }

  const data = {
    __typename: 'Queue',
    ...update,
  };

  if (queue) {
    const cacheId = cache.identify({ __typename: 'Queue', id });
    cache.writeQuery({
      query: GetQueueByIdDocument,
      variables: { id },
      data,
    });
    cache.writeFragment({
      id: cacheId,
      fragment: QueueFragmentDoc,
      fragmentName: 'Queue',
      data,
      broadcast: true,
    });
  }
}

export function removeQueueFromCache<T = any>(
  cache: ApolloCache<T>,
  queueId: string,
): void {
  let hostId: string | null = null;
  try {
    const data = cache.readQuery({
      query: GetQueueByIdDocument,
      variables: { id: queueId },
    });
    const queue = data?.queue || null;
    hostId = queue?.id || null;
  } catch {
    return;
  }
  if (queueId) {
    cache.evict({
      id: cache.identify({ __typename: 'Queue', id: queueId }),
    });
  }
  if (hostId) {
    const idToRemove = '';
    cache.modify({
      id: cache.identify({ __typename: 'QueueHost', id: hostId }),
      fields: {
        queues(existingRefs: any[], { readField }) {
          return existingRefs.filter(
            (queueRef) => idToRemove !== readField('id', queueRef),
          );
        },
      },
    });
  }
}

export function addQueueToCache(cache: ApolloCache<any>, queue: Queue): void {
  // We use an update function here to write the
  // new value of the query.
  const existingItems = cache.readQuery({
    query: GetHostsAndQueuesDocument,
  });

  if (existingItems && queue && queue.hostId) {
    const oldValues = existingItems.hosts || [];
    // find the host it belongs to
    const host = oldValues.find((host) => host.id === queue.hostId);
    if (host) {
      cache.modify({
        id: cache.identify(host),
        fields: {
          queues(existingRefs: any[], { readField }) {
            return [...existingRefs, queue];
          },
        },
      });
    }
  }
}

export function pauseQueue(id: string): Promise<boolean> {
  return client
    .mutate({
      mutation: PauseQueueDocument,
      variables: { id },
      update: (cache: ApolloCache<PauseQueueMutation>, payload) => {
        const isPaused = !!payload.data?.queuePause.isPaused;
        updateCached(cache, id, { isPaused });
      },
      refetchQueries: [
        {
          query: GetQueueJobCountsDocument,
          variables: { id },
        },
      ],
    })
    .then((result) => {
      return !!result.data?.queuePause.isPaused;
    });
}

export const resumeQueue = (id: string): Promise<boolean> => {
  return client
    .mutate({
      mutation: ResumeQueueDocument,
      variables: { id },
      update: (cache: ApolloCache<ResumeQueueMutation>, result) => {
        const isPaused = !!result.data?.queueResume?.isPaused;
        updateCached(cache, id, { isPaused });
      },
      refetchQueries: [
        {
          query: GetQueueJobCountsDocument,
          variables: { id },
        },
      ],
    })
    .then((value) => {
      return !!value.data?.queueResume.isPaused;
    });
};

export const deleteQueue = (id: string): Promise<number> => {
  return client
    .mutate({
      mutation: DeleteQueueDocument,
      variables: { id },
      update: (cache, { data }) => {
        removeQueueFromCache(cache, id);
      },
    })
    .then((value: FetchResult<DeleteQueueMutation>) => {
      return value.data?.queueDelete.deletedKeys || 0;
    });
};

export const unregisterQueue = (id: string): Promise<boolean> => {
  return client
    .mutate({
      mutation: UnregisterQueueDocument,
      variables: {
        queueId: id,
      },
      update: (cache, { data }) => {
        removeQueueFromCache(cache, id);
      },
    })
    .then((value: FetchResult<UnregisterQueueMutation>) => {
      return !!value.data?.queueUnregister.isRemoved;
    });
};

export function cleanQueue(
  id: string,
  grace: number,
  limit?: number,
  status?: JobStatus,
): Promise<number> {
  const input = {
    id,
    grace,
    limit: limit || 0,
    status: status || JobStatus.Completed,
  };

  return client
    .mutate({
      mutation: CleanQueueDocument,
      variables: input,
    })
    .then((value: FetchResult<CleanQueueMutation>) => {
      return value.data?.queueClean?.count || 0;
    });
}

export function drainQueue(id: string, delayed?: boolean): Promise<Queue> {
  const input = {
    id,
    delayed: !!delayed,
  };

  return client
    .mutate({
      mutation: DrainQueueDocument,
      variables: input,
    })
    .then((value: FetchResult<DrainQueueMutation>) => {
      return value.data?.queueDrain.queue as Queue;
    });
}

export function deleteJobSchema(
  queueId: string,
  jobName: string,
): Promise<void> {
  return client
    .mutate({
      mutation: DeleteJobSchemaDocument,
      variables: {
        queueId,
        jobName,
      },
    })
    .then((result: FetchResult<DeleteJobSchemaMutation>) => {
      if (result.errors) {
        throw new ApolloError({
          graphQLErrors: result.errors,
        });
      }
    });
}

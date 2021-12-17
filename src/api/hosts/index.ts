import { ApolloError, FetchResult } from '@apollo/client';
import { client } from '@/providers/ApolloProvider';
import {
  DiscoverQueuesDocument,
  DiscoverQueuesPayload,
  GetHostChannelsDocument,
  GetHostQueuesDocument,
  GetHostsAndQueuesDocument,
  NotificationChannel,
  Queue,
  QueueHost,
  RegisterQueueDocument,
  RegisterQueueMutation,
} from '../generated';
import { addQueueToCache } from '../queues';

export function registerQueue(
  hostId: string,
  prefix: string,
  name: string,
  mustExist = true,
): Promise<Queue> {
  return client
    .mutate({
      mutation: RegisterQueueDocument,
      variables: {
        hostId,
        name,
        prefix,
        ...(mustExist && { checkExists: mustExist }),
      },
      update(cache, { data }) {
        const queue = data?.queueRegister;
        if (queue) {
          addQueueToCache(cache, queue as Queue);
        }
      },
    })
    .then((result: FetchResult<RegisterQueueMutation>) => {
      if (result.errors) {
        throw new ApolloError({
          graphQLErrors: result.errors,
        });
      }
      const queue = result?.data?.queueRegister || null;
      return queue as Queue;
    });
}

export function getHostQueues(hostId: string): Promise<Queue[]> {
  return client
    .query({
      query: GetHostQueuesDocument,
      variables: {
        id: hostId,
      },
    })
    .then((result) => {
      if (result.error) throw result.error;
      return (result.data?.host?.queues ?? []) as Queue[];
    });
}

export function discoverQueues(
  hostId: string,
  prefix?: string,
  unregisteredOnly?: boolean,
): Promise<DiscoverQueuesPayload[]> {
  return client
    .query({
      query: DiscoverQueuesDocument,
      variables: {
        hostId,
        prefix,
        unregisteredOnly,
      },
    })
    .then((result) => {
      if (result.error) throw result.error;
      return result.data?.host?.discoverQueues ?? [];
    });
}

export function getHostChannels(
  hostId: string,
): Promise<NotificationChannel[]> {
  return client
    .query({
      query: GetHostChannelsDocument,
      variables: {
        hostId,
      },
    })
    .then((result) => {
      if (result.error) throw result.error;
      return (result.data?.host?.channels ?? []) as NotificationChannel[];
    });
}

export function getHostData(): Promise<QueueHost[]> {
  return client
    .query({
      query: GetHostsAndQueuesDocument,
    })
    .then((result) => {
      if (result.error) throw result.error;
      return (result.data?.hosts ?? []) as QueueHost[];
    });
}

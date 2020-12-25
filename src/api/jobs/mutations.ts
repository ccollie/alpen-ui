import { FetchResult } from '@apollo/client';
import { client } from '../../providers/ApolloProvider';
import {
  BulkStatusItem,
  DeleteBulkJobsDocument,
  DeleteBulkJobsMutation,
  DeleteJobDocument,
  DeleteRepeatableJobByKeyDocument,
  DeleteRepeatableJobByKeyMutation,
  PromoteBulkJobsDocument,
  PromoteBulkJobsMutation,
  PromoteJobDocument,
  RetryBulkJobsDocument,
  RetryBulkJobsMutation,
  RetryJobDocument,
} from '../generated';

function evictJobs(queueId: string, ids: string[]): void {
  const cache = client.cache;
  cache.modify({
    id: cache.identify({
      __typename: 'Queue',
      id: queueId,
    }),
    fields: {
      jobs(existingRefs: any[], { readField }) {
        const items: any[] = existingRefs || [];
        return items.filter((item, index) => {
          const id = readField<string>('id', item) ?? '';
          return !ids.includes(id);
        });
      },
    },
  });
}

export async function deleteJob(queueId: string, jobId: string): Promise<void> {
  await client
    .mutate({
      variables: { queueId, jobId },
      mutation: DeleteJobDocument,
      update() {
        evictJobs(queueId, [jobId]);
      },
    })
    .then((value) => {
      if (value.errors) throw value.errors;
    });
}

export function bulkDeleteJobs(
  queueId: string,
  jobIds: string[],
): Promise<BulkStatusItem[]> {
  return client
    .mutate({
      variables: { queueId, jobIds },
      mutation: DeleteBulkJobsDocument,
    })
    .then((value: FetchResult<DeleteBulkJobsMutation>) => {
      const items = (value.data?.jobRemoveBulk?.status ||
        []) as BulkStatusItem[];
      const removed = items.filter((x) => x.success).map((x) => x.id);
      evictJobs(queueId, removed);
      return items;
    });
}

export async function retryJob(queueId: string, jobId: string): Promise<void> {
  await client.mutate({
    variables: { queueId, jobId },
    mutation: RetryJobDocument,
  });
}

export function bulkRetryJobs(
  queueId: string,
  jobIds: string[],
): Promise<BulkStatusItem[]> {
  return client
    .mutate({
      variables: { queueId, jobIds },
      mutation: RetryBulkJobsDocument,
    })
    .then((value: FetchResult<RetryBulkJobsMutation>) => {
      return (value.data?.jobRetryBulk?.status || []) as BulkStatusItem[];
    });
}

export async function promoteJob(
  queueId: string,
  jobId: string,
): Promise<void> {
  await client.mutate({
    variables: { queueId, jobId },
    mutation: PromoteJobDocument,
  });
}

export function bulkPromoteJobs(
  queueId: string,
  jobIds: string[],
): Promise<BulkStatusItem[]> {
  return client
    .mutate({
      variables: { queueId, jobIds },
      mutation: PromoteBulkJobsDocument,
    })
    .then((value: FetchResult<PromoteBulkJobsMutation>) => {
      return (value.data?.jobPromoteBulk?.status || []) as BulkStatusItem[];
    });
}

export function deleteRepeatableJobByKey(
  queueId: string,
  key: string,
): Promise<void> {
  return client
    .mutate({
      variables: { queueId, key },
      mutation: DeleteRepeatableJobByKeyDocument,
    })
    .then((value: FetchResult<DeleteRepeatableJobByKeyMutation>) => {
      if (value.errors) {
        throw new AggregateError(value.errors);
      }
    });
}

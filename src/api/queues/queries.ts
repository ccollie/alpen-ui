import {
  GetQueueByIdDocument,
  GetQueueByIdQuery,
  JobCounts,
  JobSchema,
  Queue,
} from '../generated';
import { client } from '../../providers/ApolloProvider';
import { ApolloError } from '@apollo/client';

export const getQueueById = (id: string): Promise<Queue> => {
  return client
    .query<GetQueueByIdQuery>({
      query: GetQueueByIdDocument,
      variables: { id },
    })
    .then((fetchResult) => {
      if (fetchResult?.error) {
        throw new ApolloError(fetchResult?.error);
      }
      return fetchResult?.data?.queue as Queue;
    });
};

const EmptyJobCounts: JobCounts = {
  completed: 0,
  active: 0,
  delayed: 0,
  failed: 0,
  waiting: 0,
  paused: 0,
};

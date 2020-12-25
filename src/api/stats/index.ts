import {
  GetQueueStatsDocument,
  GetQueueStatsQuery,
  StatsQueryInput,
  StatsSnapshot,
} from '../generated';
import { client } from '../../providers/ApolloProvider';
import { ApolloError } from '@apollo/client';

export const getQueueStats = (
  input: StatsQueryInput,
): Promise<StatsSnapshot[]> => {
  return client
    .query<GetQueueStatsQuery>({
      query: GetQueueStatsDocument,
      variables: { input },
    })
    .then((fetchResult) => {
      if (fetchResult?.error) {
        throw new ApolloError(fetchResult?.error);
      }
      return fetchResult?.data.queue?.stats as StatsSnapshot[];
    });
};

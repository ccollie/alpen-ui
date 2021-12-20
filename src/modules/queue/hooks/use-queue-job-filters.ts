import {
  CreateJobFilterDocument,
  DeleteJobFilterDocument,
  GetJobFiltersDocument,
  GetJobFiltersQuery,
  JobFilter,
  RetryBulkJobsMutation,
  UpdateJobFilterDocument,
} from '@/api';
import { randomId } from '@/lib';
import { ApolloError, FetchResult, useApolloClient } from '@apollo/client';
import { createLocalStorageStateHook } from 'use-local-storage-state';

export function useQueueJobFilters(queueId: string) {
  const client = useApolloClient();
  const key = `queries-${queueId}`;
  const useFn = createLocalStorageStateHook<JobFilter[]>(key, []);

  const [queries, setQueries] = useFn();

  function addQueryToHistory(expression: string): JobFilter {
    const found = queries.find((x) => x.expression === expression);
    if (found) return found;
    const newItem: JobFilter = {
      name: '',
      id: randomId(),
      expression,
      createdAt: new Date(),
    };
    const items = [newItem, ...queries];
    while (items.length > 20) items.pop();
    setQueries(items);
    return newItem;
  }

  function addFilterToHistory(filter: JobFilter) {
    const items = [filter, ...queries];
    while (items.length > 20) items.pop();
    setQueries(items);
  }

  function removeQueryFromHistory(id: string): boolean {
    const count = queries.length;
    setQueries(queries.filter((x) => x.id !== id));
    return count != queries.length;
  }

  function createJobFilter(
    name: string,
    expression: string,
  ): Promise<JobFilter> {
    return client
      .mutate({
        variables: { input: { queueId, name, expression } },
        mutation: CreateJobFilterDocument,
      })
      .then((value) => {
        if (value.errors) {
          // throw
        }
        return value.data?.queueJobFilterCreate as JobFilter;
      });
  }

  const getJobFilters = (ids?: string[]): Promise<JobFilter[]> => {
    return client
      .query<GetJobFiltersQuery>({
        query: GetJobFiltersDocument,
        variables: {
          queueId,
          ids,
        },
      })
      .then((fetchResult) => {
        if (fetchResult?.error) {
          throw new ApolloError(fetchResult?.error);
        }
        return fetchResult?.data?.queue?.jobFilters ?? [];
      });
  };

  const getFilterById = async (id: string): Promise<JobFilter | undefined> => {
    const filters = await getJobFilters([id]);
    return filters.length ? filters[0] : undefined;
  };

  const deleteFilterById = async (id: string): Promise<boolean> => {
    return client
      .mutate({
        variables: { input: { queueId, filterId: id } },
        mutation: DeleteJobFilterDocument,
      })
      .then((value) => {
        if (value.errors) {
          // throw
        }
        return !!value.data?.queueJobFilterDelete.isDeleted;
      });
  };

  function updateFilter(filter: JobFilter): Promise<boolean> {
    return client
      .mutate({
        variables: {
          input: {
            queueId,
            filterId: filter.id,
            expression: filter.expression,
          },
        },
        mutation: UpdateJobFilterDocument,
      })
      .then((value) => {
        if (value.errors) {
          // throw
        }
        return !!value.data?.queueJobFilterUpdate.isUpdated;
      });
  }

  return {
    addQueryToHistory,
    removeQueryFromHistory,
    addFilterToHistory,
    createJobFilter,
    updateFilter,
    getFilterById,
    deleteFilterById,
    getJobFilters,
    history: queries,
  };
}

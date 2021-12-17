import { HostQueuesDocument, HostQueuesQuery, Queue, QueueHost } from '@/api';
import { useInterval } from '@/hooks';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import {
  DefaultQueueFilter,
  filterQueues,
  filtersEqual,
  QueueFilter,
  sortQueues,
  useQueueFilterParams,
} from '@/modules/host';
import { useQueueFiltersStore } from '../store/queues-filter';
import shallow from 'zustand/shallow';

export interface HostData {
  name: string;
  host: QueueHost;
  queues: Queue[];
}

export const useHostQuery = (id: string, statsRange = 'last_hour') => {
  const [range] = useState(statsRange);
  const [hostData, setHostData] = useState<HostData | undefined>();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [error, setError] = useState<ApolloError | undefined>();
  const [host, setHost] = useState<QueueHost>();
  const [called, setCalled] = useState(false);
  const hostId = id;
  const filterStore = useQueueFiltersStore();

  const filterFromParams = useQueueFilterParams();
  const defaultFilter = {
    ...DefaultQueueFilter,
    ...filterFromParams,
  };

  const [
    updateFilterInStore,
    removeHost,
    excludeQueueInStore,
    unselectQueueInStore,
  ] = useQueueFiltersStore(
    (state) => [
      state.updateHostFilter,
      state.removeHost,
      state.excludeQueue,
      state.unselectQueue,
    ],
    shallow,
  );

  const filter: QueueFilter = useQueueFiltersStore(
    useCallback((state) => state.hosts[id] ?? defaultFilter, [id]),
    (old, newItem) => filtersEqual(old, newItem),
  );

  const [loadFn, { loading, data: _data }] = useLazyQuery(HostQueuesDocument, {
    variables: getVariables(),
    fetchPolicy: 'network-only',
    onCompleted(data) {
      updateState(data);
    },
  });

  const { clear: clearInterval, reset: resetInterval } = useInterval(
    refresh,
    5000,
    { immediate: false, cancelOnUnmount: true },
  );

  function refresh(): void {
    const variables = getVariables();
    loadFn({ variables });
  }

  function getVariables() {
    const variables = {
      id,
      range,
    };
    const { sortOrder, sortBy, ...rest } = filter;
    // @ts-ignore
    variables['filter'] = rest;
    return variables;
  }

  function handleSort() {
    const sorted = sortQueues(filter, queues);
    setQueues(sorted);
  }

  function updateState(data: HostQueuesQuery) {
    if (data) {
      setCalled(true);
      const host = (data.host || null) as QueueHost;
      let queues = (host?.queues ?? []) as Queue[];
      const name = host?.name || 'host';
      queues = sortQueues(filter, queues);
      setHost(host);
      setHostData({
        host,
        name,
        queues,
      });
      setQueues(queues);
    }
  }

  useEffect(() => {
    if (_data && !loading) {
      updateState(_data);
    }
  }, [_data, loading]);

  useEffect(() => {
    loadFn();
    return () => clearInterval();
  }, []);

  useEffect(handleSort, [filter.sortBy, filter.sortOrder]);

  useEffect(() => {
    // todo: debounce this ???
    // optimistic update
    const filtered = filterQueues(queues, filter);
    const sorted = sortQueues(filter, filtered);
    setQueues(sorted);

    resetInterval();
    refresh();
  }, [
    filter.prefix,
    filter.statuses,
    filter.search,
    range,
    filter.exclude,
    filter.include,
  ]);

  const updateFilter = useCallback((update: Partial<QueueFilter>) => {
    // shutup linter
    updateFilterInStore(id, update as Partial<QueueFilter>);
  }, []);

  function clearFilter() {
    removeHost(id);
    updateFilterInStore(id, DefaultQueueFilter);
  }

  function removeQueue(id: string) {
    const filtered = queues.filter((q) => q.id !== id);
    setQueues(filtered);
  }

  function excludeQueue(qid: string) {
    removeQueue(qid);
    excludeQueueInStore(hostId, qid);
  }

  function unselectQueue(qid: string) {
    // if we have an empty filter, add to the exclude list,
    // else remove it from the includeList
    if (filter.include?.includes(qid)) {
      unselectQueueInStore(hostId, qid);
    } else {
      excludeQueueInStore(hostId, qid);
    }
  }

  return {
    filter,
    updateFilter,
    refresh,
    removeQueue,
    excludeQueue,
    unselectQueue,
    host,
    queues,
    loading,
    called,
    error,
  };
};

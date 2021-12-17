import { QueueFilter } from '@/@types';
import {
  HostPageDocument,
  HostPageQueryVariables,
  Queue,
  QueueFilterStatus,
  QueueHost,
  SortOrderEnum,
  sortQueues,
} from '@/api';
import { useDebounceFn, useInterval, useUnmountEffect } from '@/hooks';
import { isEmpty } from '@/lib';
import { useHostsStore } from '@/stores/hosts';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';

export interface HostData {
  name: string;
  host: QueueHost;
  queues: Queue[];
}

export const useHostQuery = (
  id: string,
  statsRange = 'last_hour',
  filter?: QueueFilter,
) => {
  const [range, setRange] = useState(statsRange);
  const queueFilter = useRef<QueueFilter | undefined>(filter);
  const hostData = useRef<HostData | undefined>();
  const [error, setError] = useState<ApolloError | undefined>();
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const store = useHostsStore();

  const client = useApolloClient();

  function doSort() {
    if (hostData.current) {
      const { sortBy = 'name', sortOrder = SortOrderEnum.Asc } =
        queueFilter.current || {};
      const { queues } = hostData.current;
      hostData.current.queues = sortQueues(queues, sortBy, sortOrder);
    }
  }

  function getHostData(): Promise<void> {
    const variables: HostPageQueryVariables = {
      id,
      range,
    };
    if (queueFilter?.current && !isEmpty(queueFilter.current)) {
      const { sortOrder, sortBy, ...rest } = queueFilter.current;
      variables['filter'] = rest;
    }

    setLoading(true);
    return client
      .query({
        query: HostPageDocument,
        variables,
        fetchPolicy: 'network-only',
      })
      .then((result) => {
        setCalled(false);
        setLoading(false);
        setError(result.error);
        const host = (result.data?.host || null) as QueueHost;
        const queues = (host?.queues ?? []) as Queue[];
        const name = host?.name || 'host';
        const h = store.findHost(id);
        if (h) {
          store.updateHost(id, host);
        } else {
          store.addHost(host);
        }
        hostData.current = {
          host,
          name,
          queues,
        };
        doSort();
      });
  }

  const { run: fetch, cancel: cancelDebounce } = useDebounceFn(
    () => {
      return getHostData();
    },
    { wait: 80 },
  );

  useUnmountEffect(cancelDebounce);

  const { reset: resetInterval, clear: clearInterval } = useInterval(
    fetch,
    5000,
    { immediate: true },
  );

  const refresh = useCallback(() => {
    resetInterval();
    fetch().catch(console.log);
  }, []);

  function setFilter(filter: QueueFilter) {
    const sortChanged =
      !stringsEqual(queueFilter.current?.sortBy, filter.sortBy) ||
      !sortOrderEqual(queueFilter.current?.sortOrder, filter.sortOrder);

    const currentFilter = queueFilter.current;
    let changed: boolean;

    if (!currentFilter) {
      changed = true;
    } else {
      changed =
        !stringsEqual(currentFilter.prefix, filter.prefix) ||
        !stringsEqual(currentFilter.search, filter.search) ||
        !statusesEqual(currentFilter.statuses ?? [], filter.statuses);
    }

    if (changed) {
      queueFilter.current = {
        search: filter.search,
        prefix: filter.prefix,
        statuses: [...(filter.statuses || [])],
      };
      if (sortChanged && queueFilter.current) {
        queueFilter.current.sortBy = filter.sortBy;
        queueFilter.current.sortOrder = filter.sortOrder;
      }
      refresh();
    } else if (sortChanged) {
      const sortBy = filter.sortBy ?? 'name';
      const sortOrder = filter.sortOrder ?? SortOrderEnum.Asc;
      queueFilter.current = {
        ...(queueFilter.current || {}),
        sortBy,
        sortOrder,
      };
      doSort();
    }
  }

  function clearFilter() {
    const prev = queueFilter.current;
    queueFilter.current = undefined;
    if (prev !== undefined) refresh();
  }

  return {
    setFilter,
    clearFilter,
    refresh,
    called,
    data: hostData.current,
    loading,
    error,
  };
};

function stringsEqual(
  a: string | undefined | null,
  b: string | undefined | null,
): boolean {
  if (a === b) return true;
  return (a ?? '') === (b ?? '');
}

function sortOrderEqual(
  a: SortOrderEnum | undefined,
  b: SortOrderEnum | undefined,
): boolean {
  return a === b || (a ?? SortOrderEnum.Asc) === (b ?? SortOrderEnum.Asc);
}

function statusesEqual(
  a: QueueFilterStatus[] | undefined | null,
  b: QueueFilterStatus[] | undefined | null,
) {
  a = a || [];
  b = b || [];
  if (a.length !== b.length) return false;
  return a.every((status) => b?.includes(status));
}

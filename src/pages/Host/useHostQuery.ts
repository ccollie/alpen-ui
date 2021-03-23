import { QueueFilter } from '@/@types';
import { HostPageQueryDocument, Queue, QueueHost, SortOrderEnum } from '@/api';
import { useDebounceFn, useInterval, useUnmountEffect } from '@/hooks';
import { isEmpty } from '@/lib';
import { ApolloError, useApolloClient } from '@apollo/client';
import orderBy from 'lodash-es/orderBy';
import { useRef, useState } from 'react';

export interface HostData {
  name: string;
  host: QueueHost;
  queues: Queue[];
}

export const useHostQuery = (id: string, statsRange = 'last_hour') => {
  const [range, setRange] = useState(statsRange);
  const queueFilter = useRef<QueueFilter | undefined>();
  const hostData = useRef<HostData | undefined>();
  const [error, setError] = useState<ApolloError | undefined>();
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);

  const client = useApolloClient();

  function sortQueues(): void {
    // todo: filter and sort
    const { sortBy = 'name', sortOrder = SortOrderEnum.Asc } =
      queueFilter.current || {};
    const orders = [
      sortOrder == SortOrderEnum.Asc ? 'asc' : 'desc',
      ...(sortBy !== 'name' ? ['asc'] : []),
    ];
    const fields = [sortBy];
    // use name as a secondary
    if (sortBy !== 'name') {
      fields.push('name');
    }
    console.log('Sorting "' + fields.join(',') + ', ' + orders.join(', '));
    if (hostData.current) {
      hostData.current.queues = orderBy(
        hostData.current.queues,
        fields,
        // @ts-ignore
        orders,
      ) as Queue[];
    }
  }

  function getHostData(): Promise<void> {
    const variables = {
      id,
      range,
    };
    if (queueFilter?.current && !isEmpty(queueFilter.current)) {
      const { sortOrder, sortBy, ...rest } = queueFilter.current;
      // @ts-ignore
      variables['filter'] = rest;
    }

    setLoading(true);
    return client
      .query({
        query: HostPageQueryDocument,
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
        hostData.current = {
          host,
          name,
          queues,
        };
        sortQueues();
      });
  }

  const { run: fetch, cancel: cancelDebounce } = useDebounceFn(
    () => getHostData(),
    { wait: 100 },
  );

  useUnmountEffect(cancelDebounce);

  const { reset: resetInterval } = useInterval(fetch, 5000);

  function refresh() {
    resetInterval();
    fetch().then(console.log);
  }

  function setFilter(filter: QueueFilter) {
    const sortChanged =
      queueFilter.current?.sortBy != filter.sortBy ||
      queueFilter.current?.sortOrder != filter.sortOrder;

    const changed =
      !queueFilter.current ||
      queueFilter.current.isPaused !== filter.isPaused ||
      queueFilter.current.prefix !== filter.prefix ||
      queueFilter.current.isActive !== filter.isActive ||
      queueFilter.current.search !== filter.search;

    if (changed) {
      queueFilter.current = {
        search: filter.search,
        prefix: filter.prefix,
        isActive: filter.isActive ?? true,
        isPaused: filter.isPaused ?? true,
      };
      if (sortChanged && queueFilter.current) {
        queueFilter.current.sortBy = filter.sortBy;
        queueFilter.current.sortOrder = filter.sortOrder;
      }
      refresh();
    } else if (sortChanged) {
      queueFilter.current = {
        ...(queueFilter.current || {}),
        sortBy: filter.sortBy ?? 'name',
        sortOrder: filter.sortOrder,
      };
      sortQueues();
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

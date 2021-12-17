import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { HostsAndQueuesDocument, QueueHost } from '@/api';
import { useHostsStore } from '@/stores/hosts';

export const useHosts = () => {
  const hosts = useHostsStore((x) => x.hosts);
  const setHosts = useHostsStore((x) => x.setHosts);

  // todo: make pollInterval configurable
  const { data, loading } = useQuery(HostsAndQueuesDocument, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 15000,
  });

  useEffect(() => {
    data && setHosts(data.hosts as QueueHost[]);
  }, [data]);

  return {
    loading,
    hosts,
  };
};

import { Empty, PageHeader } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { DashboardPageDocument, QueueHost } from '../../api';
import { useQuery } from '@apollo/client';
import { HostCard } from '../../components';

const Dashboard: FC = () => {
  const [hosts, setHosts] = useState<QueueHost[]>([]);
  const [range, setRange] = useState('last_hour');

  // TODO: transition to useStore
  const { data, error, loading } = useQuery(DashboardPageDocument, {
    variables: { range },
    pollInterval: 25000,
  });

  useEffect(() => {
    if (data && !loading) {
      setHosts(data.hosts as QueueHost[]);
    }
  }, [data, loading]);

  return (
    <>
      <PageHeader title="Hosts" />
      {!hosts.length && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{
            height: 60,
          }}
          description={<span>No Hosts Configured</span>}
        />
      )}
      {hosts.map((host: QueueHost) => (
        <HostCard key={`hc-${host.id}`} host={host} />
      ))}
    </>
  );
};

export default Dashboard;

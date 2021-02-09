import React, { Fragment } from 'react';
import { Queue as AppQueue, GetQueueByIdDocument } from '../../api';
import QueueHeader from './QueueHeader';
import { Empty, Skeleton, Button, Result } from 'antd';
import { useParams, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client';

const Queue: React.FC = () => {
  const { queueId } = useParams();
  const { loading, data, error } = useQuery(GetQueueByIdDocument, {
    variables: { id: queueId },
  });

  const queue = data?.queue as AppQueue;
  if (loading) {
    return <Skeleton active loading={loading} />;
  }

  if (error) {
    return (
      <Result
        status="warning"
        title="Error fetching queue."
        extra={
          <Button type="primary" key="console">
            Go to Dashboard
          </Button>
        }
      />
    );
  }
  return (
    <Fragment>
      {queue ? (
        <>
          <QueueHeader queue={queue} />
          <div>
            <Outlet />
          </div>
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>No Queue Found With Id #{queueId}</span>}
        />
      )}
    </Fragment>
  );
};

export default Queue;

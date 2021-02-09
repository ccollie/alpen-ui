import { Button, PageHeader, Space, Tag } from 'antd';
import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { QueueFilter } from '../../@types/queue';
import { Queue, RedisInfo, HostPageQueryDocument, QueueHost } from '../../api';

import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { QueueFilterToolbar } from '../../components/QueueFilterToolbar';
import QueueCard from './QueueCard';
import { RedisStats } from '../../components';
import RedisIcon from '../../components/Icons/Redis';
import { PlusOutlined, CloudServerOutlined } from '@ant-design/icons';
import {
  useDisclosure,
  useNavigationUpdate,
  useQueueActions,
  useQueueFilterParams,
} from '../../hooks';
import RegisterQueueDialog from './RegisterQueueDialog';

const Host: React.FC = () => {
  const { hostId: id } = useParams();
  const [host, setHost] = useState<QueueHost | null>(null);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [name, setName] = useState('host');
  const [range, setRange] = useState('last_hour');
  const filter = useRef(useQueueFilterParams());
  let actions = useQueueActions();

  const {
    isOpen: isAddQueueOpen,
    onOpen: openAddDialog,
    onClose: closeAddDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const { isOpen: isRedisStatsOpen, onToggle: toggleRedisInfo } = useDisclosure(
    {
      defaultIsOpen: false,
    },
  );

  const updateNavigation = useNavigationUpdate();

  const { loading, data: hostData, error: hostError, called } = useQuery(
    HostPageQueryDocument,
    {
      variables: { id, range },
      pollInterval: 5000,
    },
  );

  useEffect(() => {
    if (hostData && !loading) {
      const _host = hostData?.host || null;
      setHost(_host as QueueHost);
      setName(_host?.name || 'host');
      updateQueues((_host?.queues ?? []) as Queue[]);
    }
  }, [loading, hostData]);

  function updateQueues(newItems: Queue[]): void {
    // todo: filter and sort
    setQueues(newItems);
  }

  function onQueueAdded(queue: Queue) {
    const newItems = [...queues, queue];
    updateQueues(newItems);
  }

  function handleDiscoverQueues() {
    return actions.discoverQueues(id);
  }

  function handleAddQueue(prefix: string, name: string): Promise<Queue> {
    return actions.registerQueue(id, prefix, name).then((queue) => {
      onQueueAdded(queue);
      return queue;
    });
  }

  function onQueueRemoved(id: string) {
    const newItems = queues.filter((q) => q.id !== id);
    updateQueues(newItems);
  }

  function handleRemoveQueue(id: string): Promise<boolean> {
    return actions.unregisterQueue(id).then((removed) => {
      if (removed) {
        onQueueRemoved(id);
      }
      return removed;
    });
  }

  async function handleDeleteQueue(id: string) {
    const count = await actions.deleteQueue(id);
    onQueueRemoved(id);
    return count;
  }

  async function handleDrainQueue(id: string, delayed?: boolean) {
    return actions.drainQueue(id, delayed);
    // todo: do something with the result
  }

  async function handlePauseQueue(id: string) {
    return actions.pauseQueue(id);
  }

  async function handleResumeQueue(id: string) {
    return actions.resumeQueue(id);
  }

  actions = {
    ...actions,
    deleteQueue: handleDeleteQueue,
    drainQueue: handleDrainQueue,
    pauseQueue: handlePauseQueue,
    resumeQueue: handleResumeQueue,
    unregisterQueue: handleRemoveQueue,
  };

  function Tags() {
    let color = 'blue';
    let state = 'Active';
    if (!host) {
      color = 'red';
      state = 'Unreachable';
    }
    return <Tag color={color}>{state}</Tag>;
  }

  const onFilterUpdate = useCallback(function onFilterUpdated(
    filter: QueueFilter,
  ) {
    console.log('Filter updated');
    updateNavigation({
      ...filter,
    });
  },
  []);

  const toolbar = (
    <Space key="header-toolbar">
      <QueueFilterToolbar
        filter={filter.current}
        onFilterUpdated={onFilterUpdate}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        key="add-queue-btn"
        onClick={openAddDialog}
      >
        Add Queue
      </Button>
      <RedisIcon
        size={24}
        onClick={toggleRedisInfo}
        style={{ marginTop: '5px', cursor: 'pointer' }}
      />
    </Space>
  );

  return (
    <Fragment>
      <div>
        <PageHeader
          title={name}
          ghost={true}
          tags={<Tags />}
          extra={[toolbar]}
          avatar={{
            icon: <CloudServerOutlined />,
          }}
        />
        {isRedisStatsOpen && <RedisStats stats={host?.redis as RedisInfo} />}
      </div>
      {hostError ? (
        <div>Error loading host #{id}</div>
      ) : (
        <Space size={[8, 4]} align="start" wrap>
          {queues.map((queue) => (
            <QueueCard
              key={`q-${queue.id}`}
              queue={queue}
              stats={queue.stats}
              statsSummary={queue.statsAggregate}
              actions={actions}
            />
          ))}
        </Space>
      )}
      <RegisterQueueDialog
        visible={isAddQueueOpen}
        loadQueues={handleDiscoverQueues}
        onAddQueue={handleAddQueue}
        onClose={closeAddDialog}
      />
    </Fragment>
  );
};

export default Host;

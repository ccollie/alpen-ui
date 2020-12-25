import React, { useEffect, useState } from 'react';
import { FaBolt, FaClock, FaCog, FaCogs, FaInbox } from 'react-icons/fa';
import { ImStatsDots } from 'react-icons/im';
import { Button, Typography, Space, PageHeader } from 'antd';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { QueueActions } from '../../@types/actions';
import { QueueMenu, QueueStateTag } from '../../components';
import { Queue } from '../../api';
import { useNavigate } from 'react-router';
import { useQueueActions } from '../../hooks';

const { Title } = Typography;

type QueueHeaderProps = {
  queue: Queue;
};

const QueueHeader: React.FC<QueueHeaderProps> = (props) => {
  const { queue } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const actions = useQueueActions();
  const [currentTab, setCurrentTab] = useState<string>('');

  function goBack(): void {
    navigate(`/hosts/${queue.hostId}`);
  }

  function handleRemoveQueue(id: string): Promise<boolean> {
    return actions.unregisterQueue(id).then((removed) => {
      if (removed) {
        goBack();
      }
      return removed;
    });
  }

  async function handleDeleteQueue(id: string) {
    const value = await actions.deleteQueue(id);
    goBack();
    return value;
    // todo: do something with the result
  }

  const queueActions: QueueActions = {
    ...actions,
    deleteQueue: handleDeleteQueue,
    unregisterQueue: handleRemoveQueue,
  };

  function getTab(): string {
    const path = location.pathname;
    const parts = path.split('/');
    return parts.length ? parts[parts.length - 1] : '';
  }

  useEffect(() => {
    setCurrentTab(getTab());
  }, [location.pathname]);

  function TitleCrumbs() {
    return (
      <Space>
        <Link to={`/hosts/${queue.hostId}`}>
          <Title level={3}>{queue.host}</Title>
        </Link>
        <span>/</span>
        <Title level={3}>{queue.name}</Title>
      </Space>
    );
  }

  function TabButton({
    name,
    label,
    icon,
  }: {
    label?: string;
    name: string;
    icon: React.ReactNode;
  }) {
    const isCurrent = currentTab === name;
    label = label || name;
    const stub = (label.charAt(0) + label.substring(1))
      .toLowerCase()
      .replace(' ', '-');

    return (
      <Button
        key={`q-hdr-tab-${name}`}
        icon={icon}
        type={isCurrent ? 'default' : 'link'}
      >
        <NavLink
          to={`/queues/${queue.id}/${stub}`}
          style={{ marginLeft: '3px' }}
          activeStyle={{
            fontWeight: 'bold',
          }}
        >
          {label || name}
        </NavLink>
      </Button>
    );
  }

  return (
    <div>
      <PageHeader
        title={<TitleCrumbs />}
        tags={<QueueStateTag queue={queue} />}
        extra={[
          <TabButton name="Metrics" icon={<ImStatsDots />} key="metrics" />,
          <TabButton name="Jobs" icon={<FaCog />} key="jobs" />,
          <TabButton
            name="scheduled-jobs"
            label="Scheduled Jobs"
            icon={<FaClock />}
            key="scheduled"
          />,
          <TabButton
            name="workers"
            label="Workers"
            icon={<FaCogs />}
            key="workers"
          />,
          <TabButton
            name="rules"
            label="Rules"
            icon={<FaBolt />}
            key="rules"
          />,
          <QueueMenu queue={queue} actions={queueActions} key="queue-menu" />,
        ]}
        avatar={{
          icon: <FaInbox />,
        }}
      >
        <span></span>
      </PageHeader>
    </div>
  );
};

export default QueueHeader;

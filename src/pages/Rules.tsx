import { PageHeader, Space, Typography } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button } from 'antd';
import { FaBolt, FaPlus } from 'react-icons/fa';
import { NotificationChannel, Queue } from '../api';
import { getHostChannels, getQueueById } from '../api';
import { useDisclosure } from '../hooks';
const { Title } = Typography;

const Rules: React.FC = () => {
  const { queueId } = useParams();
  const {
    isOpen: isAddRuleDialogOpen,
    onOpen: openAddRuleDialog,
    onClose: closeAddRuleDialog,
  } = useDisclosure();
  const [queue, setQueue] = useState<Queue>();
  const [channels, setChannels] = useState<NotificationChannel[]>();

  function loadQueue() {
    getQueueById(queueId).then((q) => {
      setQueue(q);
    });
  }

  useEffect(() => {
    loadQueue();
  }, [queueId]);

  useEffect(() => {
    getHostChannels(queueId).then(setChannels);
  }, [queueId]);

  if (!queue) {
    return <span>Rules: Nothing here Yet.</span>;
  }

  return (
    <Fragment>
      <PageHeader title="Rules">
        <div>
          <Space>
            <FaBolt /> <Title level={3}>Rules</Title>
          </Space>
          <Space>
            <Button icon={<FaPlus />} onClick={openAddRuleDialog}>
              Add Rule
            </Button>
          </Space>
        </div>
      </PageHeader>
    </Fragment>
  );
};

export default Rules;

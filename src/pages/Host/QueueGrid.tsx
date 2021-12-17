import { Space } from 'antd';
import React from 'react';
import { QueueActions } from '../../@types/actions';
import { Queue } from '@/api';
import QueueCard from './QueueCard';

interface QueueGridProps {
  hostId: string;
  queues: Queue[];
  actions: QueueActions;
}

const QueueGrid: React.FC<QueueGridProps> = (props) => {
  const { queues, actions } = props;

  return (
    <Space size={[8, 8]} wrap>
      {queues.map((queue) => (
        <QueueCard key={`q-${queue.id}`} queue={queue} actions={actions} />
      ))}
    </Space>
  );
};

export default QueueGrid;

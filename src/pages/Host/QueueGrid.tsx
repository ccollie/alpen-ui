import React from 'react';
import { QueueActions } from '@/@types';
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
    <div className="flex flex-wrap flex-start gap-2 gap-y-2">
      {queues.map((queue) => (
        <QueueCard key={`q-${queue.id}`} queue={queue} actions={actions} />
      ))}
    </div>
  );
};

export default QueueGrid;

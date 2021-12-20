import { Tag } from 'antd';
import { TagProps } from 'antd/es/tag';
import React from 'react';
import { Queue, QueueFragment, QueueHost } from '@/api';

interface QueueStateTagProps extends TagProps {
  queue: Queue | QueueFragment;
  host: QueueHost;
}

const HostStateTag: React.FC<QueueStateTagProps> = (props) => {
  const { queue, ...rest } = props;
  // todo: from theme
  let color = 'success';
  let state = 'Active';
  if (queue.isPaused) {
    color = 'warning';
    state = 'Paused';
  } else if (!queue.workerCount) {
    color = 'volcano';
    state = 'Inactive';
  }
  return (
    <Tag color={color} {...rest}>
      {state}
    </Tag>
  );
};

export default HostStateTag;

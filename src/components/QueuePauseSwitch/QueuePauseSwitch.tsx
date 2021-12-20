import { SwitchProps } from 'antd/lib/switch';
import React from 'react';
import { Queue, pauseQueue, resumeQueue } from '@/api';
import { Switch } from 'antd';

type QueuePauseSwitchOptions = SwitchProps & {
  color?: string;
  queue: Queue;
};

const QueuePauseSwitch: React.FC<QueuePauseSwitchOptions> = (props) => {
  const { queue, ...rest } = props;

  async function handleChange(evt: any) {
    if (!!evt.target.checked) {
      await resumeQueue(queue.id);
    } else {
      await pauseQueue(queue.id);
    }
  }

  const isPaused = !!queue?.isPaused;
  return (
    <Switch
      aria-label={`queue ${queue?.name} ${isPaused ? 'paused' : 'unpaused'}`}
      onChange={handleChange}
      defaultChecked={!isPaused}
      {...rest}
    />
  );
};

QueuePauseSwitch.defaultProps = {
  disabled: false,
  size: 'default',
};

export default QueuePauseSwitch;

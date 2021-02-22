import { DeleteTwoTone } from '@ant-design/icons';
import React from 'react';
import { ActionIcon } from '../ActionIcon';
import { PromoteIcon } from '../Icons/Promote';
import { RetryIcon } from '../Icons/Retry';
import { Space } from 'antd';
import { JobStatus } from '../../api';

interface JobActionsProps {
  status: JobStatus;
  actions: {
    promoteJob: () => Promise<void>;
    retryJob: () => Promise<void>;
    deleteJob: () => Promise<void>;
  };
}

interface ButtonType {
  title: string;
  Icon: React.ReactNode;
  actionKey: 'promoteJob' | 'deleteJob' | 'retryJob';
  danger: boolean | undefined;
}

const buttonTypes: Record<string, ButtonType> = {
  promote: {
    title: 'Promote',
    Icon: <PromoteIcon />,
    actionKey: 'promoteJob',
    danger: false,
  },
  clean: {
    title: 'Clean',
    Icon: <DeleteTwoTone twoToneColor="#eb2f96" />,
    actionKey: 'deleteJob',
    danger: true,
  },
  retry: {
    title: 'Retry',
    Icon: <RetryIcon />,
    actionKey: 'retryJob',
    danger: false,
  },
};

const statusToButtonsMap: Record<string, ButtonType[]> = {
  [JobStatus.Failed]: [buttonTypes.retry, buttonTypes.clean],
  [JobStatus.Delayed]: [buttonTypes.promote, buttonTypes.clean],
  [JobStatus.Completed]: [buttonTypes.clean],
  [JobStatus.Waiting]: [buttonTypes.clean],
};

export const JobActions = ({ actions, status }: JobActionsProps) => {
  const buttons = statusToButtonsMap[status];
  if (!buttons) {
    return null;
  }

  return (
    <Space>
      {buttons.map((type) => (
        <ActionIcon
          key={type.title}
          baseIcon={type.Icon}
          handler={actions[type.actionKey]}
        />
      ))}
    </Space>
  );
};

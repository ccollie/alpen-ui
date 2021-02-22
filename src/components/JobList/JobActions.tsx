import { Space, message } from 'antd';
import React from 'react';
import { SingleJobActions } from '../../@types';
import { Job, JobFragment, JobStatus, isJobFinished } from '../../api';
import { ActionIcon } from '../ActionIcon';
import { ArrowUpOutlined, RedoOutlined } from '@ant-design/icons';
import { TrashIcon } from '../Icons/Trash';

interface JobActionsProps {
  job: Job | JobFragment;
  actions: SingleJobActions;
  shouldConfirmDelete?: boolean;
}

export const JobActions: React.FC<JobActionsProps> = (props) => {
  const { job, actions } = props;
  const isFinished = isJobFinished(job);
  const isDelayed = job?.state === JobStatus.Delayed;

  function handleError(err: Error) {
    const msg = err.message;
    message.error(msg).then(() => {});
  }

  function handleDelete() {
    return actions
      .deleteJob(job.id)
      .then(() => message.success(`Job #${job.id} successfully deleted`))
      .catch(handleError);
  }

  function handlePromote(): Promise<void> {
    return actions
      .promoteJob(job.id)
      .then(() => message.success(`Job #${job.id} successfully promoted`))
      .catch(handleError);
  }

  function handleRetry(): Promise<void> {
    return actions
      .retryJob(job.id)
      .then(() => message.success(`Job #${job.id} is being retried`))
      .catch(handleError);
  }

  const ConfirmPrompt = 'Are you sure you want to delete this job?';
  const deleteProps = {
    confirmPrompt: !!props.shouldConfirmDelete ? ConfirmPrompt : undefined,
  };

  return (
    <Space className="actions">
      {isDelayed && (
        <ActionIcon baseIcon={<ArrowUpOutlined />} handler={handlePromote} />
      )}
      {isFinished && (
        <ActionIcon baseIcon={<RedoOutlined />} handler={handleRetry} />
      )}
      <ActionIcon
        baseIcon={<TrashIcon />}
        handler={handleDelete}
        {...deleteProps}
      />
    </Space>
  );
};

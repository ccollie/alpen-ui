import { removeTypename } from '@/lib';
import { Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useClipboard } from 'use-clipboard-copy';
import { SingleJobActions } from '../../@types';
import { Job, JobFragment, JobStatus, isJobFinished } from '../../api';
import { ActionIcon } from '../ActionIcon';
import { ArrowUpOutlined, CopyOutlined, RedoOutlined } from '@ant-design/icons';
import { TrashIcon } from '../Icons/Trash';

interface JobActionsProps {
  job: Job | JobFragment;
  status?: JobStatus;
  actions: SingleJobActions;
  shouldConfirmDelete?: boolean;
}

export const JobActions: React.FC<JobActionsProps> = (props) => {
  const { job, actions, status = props.job.state } = props;
  const [clipboardSupported, setClipboardSupported] = useState(true);
  const isFinished = isJobFinished(job);
  const isDelayed = status === JobStatus.Delayed;
  const shortDescription = `Job ${job.name}#${job.id}`;

  const clipboard = useClipboard({
    copiedTimeout: 600, // timeout duration in milliseconds
    onSuccess() {
      message.success(`${shortDescription} copied to clipboard`);
    },
    onError() {
      message.error(`Failed to copy ${shortDescription} to clipboard`);
    },
  });

  useEffect(() => {
    setClipboardSupported(clipboard.isSupported());
  }, []);

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

  async function handleCopy() {
    const data = removeTypename(job);
    const str = JSON.stringify(data);
    clipboard.copy(str);
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
      {clipboardSupported && (
        <ActionIcon baseIcon={<CopyOutlined />} handler={handleCopy} />
      )}
    </Space>
  );
};

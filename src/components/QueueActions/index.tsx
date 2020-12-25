import { ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React, { useState } from 'react';
import { QueueJobActions } from '../../@types/actions';
import { BulkStatusItem, JobStatus, Queue } from '../../api';
import { AsyncButton } from '../AsyncButton';
import { RetryIcon } from '../Icons/Retry';
import { TrashIcon } from '../Icons/Trash';

type BulkActionName = 'delete' | 'retry' | 'promote';

interface QueueActionProps {
  queue: Queue;
  actions: QueueJobActions;
  status: JobStatus;
  selectedIds: string[];
  onBulkAction: (action: BulkActionName, ids: string[]) => void;
}

const ACTIONABLE_STATUSES = [
  JobStatus.Failed,
  JobStatus.Delayed,
  JobStatus.Completed,
];

const isStatusActionable = (status: JobStatus): boolean =>
  ACTIONABLE_STATUSES.includes(status);

export const QueueActions: React.FC<QueueActionProps> = (props) => {
  const count = props.selectedIds.length;
  const { status, actions } = props;
  const canRetry =
    status === JobStatus.Failed || status === JobStatus.Completed;

  function retryAll() {}

  function cleanAll() {}

  const [selectedIds, setSelectedIds] = useState<string[]>(
    props.selectedIds || [],
  );

  function handleResult(action: BulkActionName, results: BulkStatusItem[]) {
    const items = results.filter((x) => x.success).map((x) => x.id);
    props.onBulkAction && props.onBulkAction(action, items);
  }

  function handleDelete() {
    return actions.bulkDeleteJobs(selectedIds).then((value) => {
      const remaining = value.filter((x) => !x.success).map((x) => x.id);
      setSelectedIds(remaining);
      handleResult('delete', value);
    });
  }

  function handleRetry() {
    if (status === JobStatus.Failed) {
    }
    return actions
      .bulkRetryJobs(selectedIds)
      .then((value) => handleResult('retry', value));
  }

  function handlePromote() {
    return actions
      .bulkPromoteJobs(selectedIds)
      .then((value) => handleResult('promote', value));
  }

  if (!isStatusActionable(status) && !count) {
    return null;
  }

  return (
    <Space>
      {status === JobStatus.Failed && count && (
        <AsyncButton icon={<RetryIcon />} onClick={handleRetry}>
          Retry {count}
        </AsyncButton>
      )}
      {status === JobStatus.Failed && (
        <AsyncButton icon={<RetryIcon />} onClick={retryAll}>
          Retry all
        </AsyncButton>
      )}
      {status === JobStatus.Delayed && (
        <AsyncButton
          icon={<ArrowUpOutlined />}
          onClick={handlePromote}
          disabled={!selectedIds.length}
          key="btn-promote-multi"
        >
          Promote
        </AsyncButton>
      )}
      <AsyncButton
        className="is-danger"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        disabled={!selectedIds.length}
      >
        Remove {count}
      </AsyncButton>
      <AsyncButton icon={<TrashIcon />} onClick={cleanAll} key="btn-clean-all">
        Clean
      </AsyncButton>
    </Space>
  );
};

import {
  ArrowUpOutlined,
  ClearOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { message, Button, Space } from 'antd';
import React, { Fragment } from 'react';
import { QueueJobActions } from '../../@types';
import { BulkStatusItem, JobStatus } from '../../api';
import { useDisclosure } from '../../hooks';
import { AsyncButton } from '../AsyncButton';
import { TrashIcon } from '../Icons/Trash';
import CleanJobsDialog from './CleanJobsDialog';

export type BulkActionType = 'delete' | 'retry' | 'promote' | 'clean';

const ActionPastTense: Record<BulkActionType, string> = {
  delete: 'deleted',
  retry: 'retried',
  promote: 'promoted',
  clean: 'cleared',
};

interface BulkJobActionsProps {
  status: JobStatus;
  selectedIds: string[];
  actions: QueueJobActions;
  onBulkAction?: (
    action: BulkActionType,
    ids: string[],
    count?: number,
  ) => void;
}

export const JobBulkActions: React.FC<BulkJobActionsProps> = (props) => {
  const { status, actions, selectedIds = [] } = props;
  const {
    isOpen: isCleanDialogOpen,
    onOpen: openCleanDialog,
    onClose: closeCleanDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  function getSuccessMessage(action: BulkActionType, count: number) {
    const verb = ActionPastTense[action];
    return `${count} ${status} jobs ${verb}`;
  }

  function handleResult(
    action: BulkActionType,
    results: BulkStatusItem[],
    count?: number,
  ) {
    const items = results.filter((x) => x.success).map((x) => x.id);
    count = count ?? items.length;
    const msg = getSuccessMessage(action, count);
    setTimeout(() => message.success(msg), 0);
    props.onBulkAction && props.onBulkAction(action, items, count);
  }

  function handleDelete() {
    return actions.bulkDeleteJobs(selectedIds).then((value) => {
      const remaining = value.filter((x) => !x.success).map((x) => x.id);
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

  function cleanJobs(
    status: JobStatus,
    grace?: number,
    limit?: number,
  ): Promise<void> {
    return actions
      .cleanJobs(status, grace, limit)
      .then((count) => handleResult('clean', [], count));
  }

  function validState(statuses: JobStatus[]): boolean {
    return !!selectedIds.length && statuses.includes(status);
  }

  const canClear = validState([JobStatus.Completed, JobStatus.Failed]);
  const canRetry = validState([JobStatus.Completed, JobStatus.Failed]);
  const canPromote = validState([JobStatus.Delayed]);

  return (
    <Fragment>
      <Space>
        <AsyncButton
          icon={<RedoOutlined />}
          onClick={handleRetry}
          disabled={!canRetry}
        >
          Retry
        </AsyncButton>

        <AsyncButton
          icon={<ArrowUpOutlined />}
          onClick={handlePromote}
          disabled={!canPromote}
        >
          Promote
        </AsyncButton>

        <AsyncButton
          danger
          icon={<TrashIcon />}
          onClick={handleDelete}
          disabled={!selectedIds.length}
        >
          Remove
        </AsyncButton>

        <Button
          danger
          icon={<ClearOutlined />}
          onClick={openCleanDialog}
          disabled={!canClear}
        >
          Clear
        </Button>
      </Space>
      <CleanJobsDialog
        status={status}
        isOpen={isCleanDialogOpen}
        onClose={closeCleanDialog}
        onCleanJobs={cleanJobs}
      />
    </Fragment>
  );
};

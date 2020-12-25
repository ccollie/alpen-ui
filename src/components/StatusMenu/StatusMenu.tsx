import cn from 'classnames';
import React from 'react';
import s from './StatusMenu.module.css';
import { JobCounts, JobStatus } from '../../api';

const STATUS_LIST = [
  JobStatus.Active,
  JobStatus.Waiting,
  JobStatus.Completed,
  JobStatus.Failed,
  JobStatus.Delayed,
  JobStatus.Paused,
];

const EmptyJobCounts = {
  [JobStatus.Active]: 0,
  [JobStatus.Waiting]: 0,
  [JobStatus.Completed]: 0,
  [JobStatus.Failed]: 0,
  [JobStatus.Delayed]: 0,
  [JobStatus.Paused]: 0,
};

const StatusMenu = ({
  counts,
  selectedStatus,
  onSelectStatus,
}: {
  counts?: JobCounts;
  selectedStatus: JobStatus;
  onSelectStatus: (status: JobStatus) => void | Promise<void>;
}) => {
  const _counts = counts || EmptyJobCounts;
  return (
    <div className={s.statusMenu}>
      {STATUS_LIST.map((status) => {
        const isActive = selectedStatus === status;
        const count = _counts[status];
        return (
          <button
            type="button"
            key={`sc-${status}`}
            onClick={() => onSelectStatus(status)}
            className={cn({ [s.active]: isActive })}
          >
            {status}
            {count > 0 && <span className={s.badge}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default StatusMenu;

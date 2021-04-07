import { ClockCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import { format, isToday } from 'date-fns';
import React, { Fragment } from 'react';
import { FaCalendarPlus } from 'react-icons/fa';
import { QueueJobActions } from '../../@types';
import {
  getJobDuration,
  getJobWaitTime,
  Job,
  JobFragment,
  JobStatus,
  normalizeJobName,
} from '../../api';
import { JobId, RelativeDateFormat } from '../../components';
import { JobActions } from '@/components/JobActions/JobActions';
import { formatDuration, parseDate, relativeFormat } from '../../lib/dates';
import { JobProgress } from './JobProgress';

const FIELDS = {
  [JobStatus.Active]: [
    'id',
    'name',
    'timestamp',
    'wait',
    'processedOn',
    'progress',
    'actions',
  ],
  [JobStatus.Completed]: [
    'id',
    'attemptsMade',
    'name',
    'finishedOn',
    'timestamp',
    'wait',
    'processedOn',
    'runtime',
    'actions',
  ],
  [JobStatus.Delayed]: [
    'id',
    'name',
    'attemptsMade',
    'timestamp',
    'nextRun',
    'actions',
  ],
  [JobStatus.Failed]: [
    'id',
    'attemptsMade',
    'name',
    'timestamp',
    'wait',
    'finishedOn',
    'runtime',
    'actions',
  ],
  [JobStatus.Paused]: [
    'id',
    'attemptsMade',
    'name',
    'timestamp',
    'processedOn',
    'actions',
  ],
  [JobStatus.Waiting]: ['id', 'name', 'timestamp', 'finishedOn', 'actions'],
};

const JobDate = ({ value }: { value: number | string }) => {
  if (!value) {
    return null;
  }

  const dt = parseDate(value);
  const _today = isToday(dt);
  const label = relativeFormat(dt);
  const time = format(dt, 'HH:mm:ss');
  const date = format(dt, 'MMM dd, yy');

  return (
    <Tooltip placement="top" title={label} aria-label={label}>
      {_today ? (
        <span>{time}</span>
      ) : (
        <Space direction="vertical">
          <span>{date}</span>
          <span>{time}</span>
        </Space>
      )}
    </Tooltip>
  );
};

const Duration = ({ job }: { job: Job | JobFragment }) => {
  const duration = getJobDuration(job);
  if (!duration) {
    return null;
  }

  return (
    <Fragment>
      <ClockCircleOutlined /> {formatDuration(duration)}
    </Fragment>
  );
};

const WaitTime = ({ job }: { job: Job | JobFragment }) => {
  const duration = getJobWaitTime(job);
  if (!duration) {
    return null;
  }

  return (
    <Fragment>
      <ClockCircleOutlined /> {formatDuration(duration)}
    </Fragment>
  );
};

const Attempts = ({ job }: { job: Job | JobFragment }) => {
  const total = job.opts?.attempts || 0;
  const value = `${job.attemptsMade + 1}` + (total ? `/${total}` : '');
  return job.attemptsMade > 0 ? <span>{value}</span> : null;
};

const DateTimeWidth = 80;

export type JobColumnType = ColumnType<Job | JobFragment>;

export function getColumns(
  status: JobStatus,
  actions: QueueJobActions,
): JobColumnType[] {
  const shouldConfirmDelete = [
    JobStatus.Active,
    JobStatus.Paused,
    JobStatus.Waiting,
  ].includes(status);
  const columns: JobColumnType[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '44px',
      key: 'job-id',
      ellipsis: true,
      render: (_, job) => <JobId id={job.id} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '105px',
      key: 'job-name',
      ellipsis: true,
      render: (_, job) => <Fragment>{normalizeJobName(job)}</Fragment>,
    },
    {
      title: 'Created',
      dataIndex: 'timestamp',
      width: DateTimeWidth,
      key: 'created',
      responsive: ['md'],
      render: (_, job) => <JobDate value={job.timestamp} />,
    },
    {
      title: 'Waited',
      dataIndex: 'processedOn',
      width: '55px',
      key: 'wait-time',
      render: (_, job) => <WaitTime job={job} key={`wait-${job.id}`} />,
    },
    {
      title: 'Started',
      dataIndex: 'processedOn',
      width: DateTimeWidth,
      key: 'started',
      responsive: ['md'],
      render: (_, job) => <JobDate value={job.processedOn} />,
    },
    {
      title: 'Completed',
      dataIndex: 'finishedOn',
      key: 'completed',
      width: DateTimeWidth,
      render: (_, job) => <JobDate value={job.finishedOn} />,
    },
    {
      title: 'Runtime',
      dataIndex: 'finishedOn',
      key: 'runtime',
      width: 60,
      render: (_, job) => <Duration job={job} key={`duration-${job.id}`} />,
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRun',
      key: 'next-run',
      width: DateTimeWidth,
      render: (_, job) => {
        const { timestamp = 0, delay = 0 } = job;
        const value = Number(timestamp) + Number(delay);
        if (!value) return <Fragment>{'--'}</Fragment>;
        return (
          <Fragment>
            <FaCalendarPlus />
            <RelativeDateFormat value={value} />
          </Fragment>
        );
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      align: 'left',
      width: '80px',
      key: 'progress',
      render: (_, job) => (
        <JobProgress value={job.progress || 0} size="small" />
      ),
    },
    {
      title: 'Attempts',
      dataIndex: 'attemptsMade',
      width: '42px',
      align: 'center',
      key: 'attemptsMade',
      responsive: ['md'],
      render: (_, job) => <Attempts job={job} />,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      key: 'actions',
      width: 50,
      render: (_, job) => (
        <JobActions
          job={job}
          actions={actions}
          shouldConfirmDelete={shouldConfirmDelete}
        />
      ),
    },
  ];

  return columns.filter((column) =>
    FIELDS[status].includes(String(column.dataIndex)),
  );
}

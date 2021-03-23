import React from 'react';
import { SingleJobActions } from '@/@types';
import { Details } from './Details/Details';
import { JobActions } from '../JobActions/JobActions';
import { Progress } from './Progress/Progress';
import { Timeline } from './Timeline/Timeline';
import { Job, JobFragment, JobStatus } from '../../api';
import { JobId } from '../JobId';
import s from './JobCard.module.css';

interface JobCardProps {
  job: Job | JobFragment;
  status: JobStatus;
  actions: SingleJobActions;
}

const JobCard = ({ job, status, actions }: JobCardProps) => {
  const { attemptsMade: attempts = 0 } = job;
  const id = job.id;

  const jobActions = {
    promoteJob: () => actions.promoteJob(id),
    retryJob: () => actions.retryJob(id),
    deleteJob: () => actions.deleteJob(id),
  };

  const getLogs = (start?: number, end?: number) =>
    actions.getJobLogs(id, start, end);

  return (
    <div className={s.card}>
      <div className={s.sideInfo}>
        <JobId id={job.id} />
        <Timeline job={job} status={status} />
      </div>
      <div className={s.contentWrapper}>
        <div className={s.title}>
          <h4>
            {job.name}
            {attempts > 0 && <span>attempt #{attempts + 1}</span>}
          </h4>
          <JobActions status={status} actions={jobActions} />
        </div>
        <div className={s.content}>
          <Details status={status} job={job} getJobLogs={getLogs} />
          {typeof job.progress === 'number' && (
            <Progress
              percentage={job.progress}
              status={status}
              className={s.progress}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;

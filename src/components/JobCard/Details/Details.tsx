import React from 'react';
import { Button } from '../Button/Button';
import s from './Details.module.css';
import { JobStatus, Job, JobLogs, JobFragment } from '../../../api';
import { useDetailsTabs } from '../../../hooks';

interface DetailsProps {
  job: Job | JobFragment;
  status: JobStatus;
  getJobLogs: (start?: number, end?: number) => Promise<JobLogs>;
}

export const Details = ({ status, job, getJobLogs }: DetailsProps) => {
  const { tabs, getTabContent } = useDetailsTabs(status, getJobLogs);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={s.details}>
      <ul className={s.tabActions}>
        {tabs.map((tab) => (
          <li key={tab.title}>
            <Button onClick={tab.select} isActive={tab.isActive}>
              {tab.title}
            </Button>
          </li>
        ))}
      </ul>
      <div className={s.tabContent}>{getTabContent(job)}</div>
    </div>
  );
};

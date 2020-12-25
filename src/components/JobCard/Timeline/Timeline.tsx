import { format, formatDistance, getYear, isToday, parseJSON } from 'date-fns';
import React from 'react';
import s from './Timeline.module.css';
import { Job, JobFragment, JobStatus } from '../../../api';

type TimeStamp = number | Date;

const formatDate = (ts: TimeStamp) => {
  if (isToday(ts)) {
    return format(ts, 'HH:mm:ss');
  }

  return getYear(ts) === getYear(new Date())
    ? format(ts, 'MM/dd HH:mm:ss')
    : format(ts, 'MM/dd/yyyy HH:mm:ss');
};

function parseDate(str: string): number {
  return parseJSON(str).getTime();
}

export const Timeline = function Timeline({
  job,
  status,
}: {
  job: Job | JobFragment;
  status: JobStatus;
}) {
  const timestamp = parseDate(job.timestamp);
  const finishedOn = parseDate(job.finishedOn);
  const processedOn = parseDate(job.processedOn);

  return (
    <div className={s.timelineWrapper}>
      <ul className={s.timeline}>
        <li>
          <small>Added at</small>
          <time>{formatDate(timestamp)}</time>
        </li>
        {!!job.delay && job.delay > 0 && status === JobStatus.Delayed && (
          <li>
            <small>Delayed for</small>
            <time>
              {formatDistance(timestamp, timestamp + job.delay, {
                includeSeconds: true,
              })}
            </time>
          </li>
        )}
        {!!job.processedOn && (
          <li>
            <small>
              {job.delay && job.delay > 0 ? 'delayed for ' : ''}
              {formatDistance(processedOn, timestamp, {
                includeSeconds: true,
              })}
            </small>
            <small>Process started at</small>
            <time>{formatDate(processedOn)}</time>
          </li>
        )}
        {!!job.finishedOn && (
          <li>
            <small>
              {formatDistance(finishedOn, processedOn, {
                includeSeconds: true,
              })}
            </small>
            <small>
              {status === JobStatus.Failed ? 'Failed' : 'Finished'} at
            </small>
            <time>{formatDate(finishedOn)}</time>
          </li>
        )}
      </ul>
    </div>
  );
};

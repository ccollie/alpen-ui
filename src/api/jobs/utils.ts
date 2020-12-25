import { Job, JobFragment, JobStatus, RepeatableJob } from '../generated';
import { parseJSON } from 'date-fns';

type PossiblyDate = Date | number | string | null;

function subtract(later: PossiblyDate, previous: PossiblyDate): number {
  let last = later ? parseJSON(later) : new Date();
  if (!previous) return 0;
  const first = parseJSON(previous);
  return last.getTime() - first.getTime();
}

export function isJobFinished(job: Job | JobFragment): boolean {
  if (!job) return false;
  if (job.state) {
    return [JobStatus.Completed, JobStatus.Failed].includes(job.state);
  }
  return (
    job.returnvalue !== undefined ||
    !!job.stacktrace?.length ||
    !!job.finishedOn
  );
}

export function normalizeJobName(
  job: Job | JobFragment | RepeatableJob,
): string {
  const name = job.name + '';
  return name.length === 0 || name === '__default__' ? '--' : name;
}

// Job display
export function getJobDuration(job: Job | JobFragment): number {
  if (job.finishedOn) {
    return subtract(job.finishedOn, job.processedOn);
  } else if (job.state === JobStatus.Active) {
    if (!job.processedOn) {
      const processedOn = parseJSON(job.processedOn);
      return Date.now() - processedOn.getTime();
    }
  }
  return 0;
}

export function getJobWaitTime(job: Job | JobFragment): number {
  const wait = subtract(job.processedOn, job.timestamp);
  return Math.min(wait, 0);
}

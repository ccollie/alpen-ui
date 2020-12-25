import { JobStatus } from '../generated';

export const EmptyJobCounts = {
  [JobStatus.Active]: 0,
  [JobStatus.Waiting]: 0,
  [JobStatus.Completed]: 0,
  [JobStatus.Failed]: 0,
  [JobStatus.Delayed]: 0,
  [JobStatus.Paused]: 0,
};

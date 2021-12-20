import { QueueJobActions } from '../@types/actions';
import {
  cleanQueue,
  bulkDeleteJobs,
  bulkRetryJobs,
  bulkPromoteJobs,
  deleteJob,
  promoteJob,
  retryJob,
  getJobs,
  getJobsByFilter,
  getJobLogs,
  JobStatus,
} from '@/api';

// move this to store ??
export function useJobActions(queueId: string): QueueJobActions {
  async function cleanJobs(
    status: JobStatus,
    grace = 0,
    limit?: number,
  ): Promise<number> {
    return cleanQueue(queueId, grace, limit, status);
  }

  const actions: QueueJobActions = {
    promoteJob: (id: string) => promoteJob(queueId, id),
    retryJob: (id: string) => retryJob(queueId, id),
    deleteJob: (id: string) => deleteJob(queueId, id),
    bulkDeleteJobs: (ids: string[]) => bulkDeleteJobs(queueId, ids),
    bulkRetryJobs: (ids: string[]) => bulkRetryJobs(queueId, ids),
    bulkPromoteJobs: (ids: string[]) => bulkPromoteJobs(queueId, ids),
    getJobLogs: (jobId: string, start?: number, end?: number) => {
      return getJobLogs(queueId, jobId, start, end);
    },
    cleanJobs,
    getJobs,
    getJobsByFilter,
  };

  return actions;
}

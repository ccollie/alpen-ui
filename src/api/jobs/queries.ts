import { ApolloQueryResult } from '@apollo/client';
import { client } from '../../providers/ApolloProvider';
import {
  GetJobLogsDocument,
  GetQueueJobsDocument,
  GetQueueJobsQuery,
  GetRepeatableJobsDocument,
  GetRepeatableJobsQuery,
  JobCounts,
  JobFragment,
  JobLogs,
  JobStatus,
  RepeatableJob,
  SortOrderEnum,
} from '../generated';

export function getJobs(
  queueId: string,
  status: JobStatus,
  page = 1,
  pageSize = 10,
  sortOrder: SortOrderEnum = SortOrderEnum.Desc,
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return client
    .query({
      query: GetQueueJobsDocument,
      variables: {
        id: queueId,
        status,
        offset,
        limit,
        sortOrder,
      },
      fetchPolicy: 'network-only',
    })
    .then((results: ApolloQueryResult<GetQueueJobsQuery>) => {
      // todo: handle error
      if (results.error) throw results.error;
      const base = results.data?.queue;
      const jobs = (base?.jobs || []) as JobFragment[];
      const counts = base?.jobCounts as JobCounts;
      return {
        jobs,
        counts,
      };
    });
}

export function getJobLogs(
  queueId: string,
  jobId: string,
  start = 0,
  end = -1,
): Promise<JobLogs> {
  return client
    .query({
      query: GetJobLogsDocument,
      variables: {
        queueId: queueId,
        id: jobId,
        start,
        end,
      },
    })
    .then((res) => {
      if (res.error) throw res.error;
      return res.data?.job.logs as JobLogs;
    });
}

export function getRepeatableJobs(queueId: string, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return client
    .query({
      query: GetRepeatableJobsDocument,
      variables: {
        id: queueId,
        offset,
        limit,
      },
    })
    .then((results: ApolloQueryResult<GetRepeatableJobsQuery>) => {
      // todo: handle error
      if (results.error) throw results.error;
      const base = results.data?.queue;
      const jobs = (base?.repeatableJobs || []) as RepeatableJob[];
      const count = base?.repeatableJobCount || 0;
      return {
        jobs,
        count,
      };
    });
}

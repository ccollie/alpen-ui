import {
  BulkStatusItem,
  DiscoverQueuesPayload,
  JobCounts,
  JobFragment,
  JobLogs,
  JobSchema,
  JobSearchInput,
  JobStatus,
  Queue,
  SortOrderEnum,
} from '../api';

export type JobAction = (id: string) => Promise<void>;
export type BulkJobAction = (ids: string[]) => Promise<BulkStatusItem[]>;

export interface SingleJobActions {
  getJobLogs: (jobId: string, start?: number, end?: number) => Promise<JobLogs>;
  promoteJob: JobAction;
  retryJob: JobAction;
  deleteJob: JobAction;
}

export interface BulkJobActions {
  bulkPromoteJobs: BulkJobAction;
  bulkRetryJobs: BulkJobAction;
  bulkDeleteJobs: BulkJobAction;
  cleanJobs: (
    status: JobStatus,
    grace?: number,
    limit?: number,
  ) => Promise<number>;
}

export interface FilteredJobsResult {
  jobs: JobFragment[];
  counts: JobCounts;
  current: number;
  total: number;
  cursor: string | undefined;
  hasNext: boolean;
}

export interface QueueJobActions extends SingleJobActions, BulkJobActions {
  getJobs: (
    queueId: string,
    status: JobStatus,
    page: number,
    pageSize: number,
    sortOrder?: SortOrderEnum,
  ) => Promise<{ jobs: JobFragment[]; counts: JobCounts }>;
  getJobsByFilter: (
    queueId: string,
    filter: JobSearchInput,
  ) => Promise<FilteredJobsResult>;
}

// todo: discover
export interface QueueActions {
  pauseQueue: (id: string) => Promise<boolean>;
  resumeQueue: (id: string) => Promise<boolean>;
  drainQueue: (id: string, delayed?: boolean) => Promise<any>;
  deleteQueue: (id: string) => Promise<number>;
  discoverQueues: (
    hostId: string,
    prefix?: string,
    unregisteredOnly?: boolean,
  ) => Promise<DiscoverQueuesPayload[]>;
  registerQueue: (
    hostId: string,
    prefix: string,
    name: string,
  ) => Promise<Queue>;
  unregisterQueue: (id: string) => Promise<boolean>;
}

export interface JobSchemaActions {
  getJobNames: () => Promise<string[]>;
  getSchema: (jobName: string) => Promise<JobSchema | null>;
  getSchemas: () => Promise<JobSchema[]>;
  setSchema: (jobName: string, schema: JobSchema) => Promise<JobSchema>;
  deleteSchema: (jobName: string) => Promise<void>;
  getJobOptionsSchema: () => Promise<Record<string, any>>;
}

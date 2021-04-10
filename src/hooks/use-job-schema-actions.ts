import { JobSchemaActions } from '../@types';
import {
  deleteJobSchema,
  getJobNames,
  getJobOptionsSchema,
  getJobSchema,
  getJobSchemas,
  JobSchema,
  setJobSchema,
} from '../api';

export function useJobSchemaActions(queueId: string): JobSchemaActions {
  return {
    deleteSchema(jobName: string): Promise<void> {
      return deleteJobSchema(queueId, jobName);
    },
    getJobNames(): Promise<string[]> {
      return getJobNames(queueId);
    },
    getJobOptionsSchema(): Promise<Record<string, any>> {
      return getJobOptionsSchema();
    },
    getSchema(jobName: string): Promise<JobSchema | null> {
      return getJobSchema(queueId, jobName);
    },
    getSchemas(): Promise<JobSchema[]> {
      return getJobSchemas(queueId);
    },
    setSchema(jobName: string, schema: JobSchema): Promise<JobSchema> {
      const opts = schema.defaultOpts ?? undefined;
      return setJobSchema(queueId, jobName, schema, opts);
    },
  };
}

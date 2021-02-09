import { JobSchemaActions } from '../@types';
import {
  deleteJobSchema,
  getJobNames,
  getJobOptionsSchema,
  getJobSchema,
  JobSchema,
  setJobSchema,
} from '../api';

export function useJobSchemaActions(queueId: string): JobSchemaActions {
  const actions: JobSchemaActions = {
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
    setSchema(jobName: string, schema: JobSchema): Promise<JobSchema> {
      const opts = schema.defaultOpts ?? undefined;
      return setJobSchema(queueId, jobName, schema, opts);
    },
  };

  return actions;
}

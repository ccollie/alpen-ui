import { JobStatus } from '@/api';

export type JobExportFormat = 'json' | 'csv';

export enum ExportStage {
  Initializing = 'Initializing',
  Fetching = 'Fetching',
  Saving = 'Saving',
  Finished = 'Finished',
}

export interface JobExportOptions {
  maxJobs?: number;
  status: JobStatus;
  format: JobExportFormat;
  filter?: string;
  fields: string[];
  filename: string;
  showHeaders?: boolean;
}

export const ExportMimeTypes: Record<JobExportFormat, string> = {
  json: 'application/json;charset=utf-8;',
  csv: 'text/csv', // according to wikipedia
};

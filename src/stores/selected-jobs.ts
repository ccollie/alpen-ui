import { createSelectedItemsStore } from './selected-items-factory';
import { Job, JobFragment } from '@/api';

type JobType = Job | JobFragment;

export const useSelectedJobsStore = createSelectedItemsStore<JobType>();

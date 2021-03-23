import { HostQueuesFilter, SortOrderEnum } from '../api';

export interface QueueFilter extends HostQueuesFilter {
  prefix?: string;
  sortBy?: string;
  sortOrder?: SortOrderEnum;
}

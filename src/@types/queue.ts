import { SortOrderEnum } from '../api';

export interface QueueFilter {
  prefix?: string;
  searchText?: string;
  active?: boolean;
  paused?: boolean;
  sortBy: string;
  sortOrder?: SortOrderEnum;
}

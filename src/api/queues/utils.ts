import { JobStatus, Queue, QueueHost, SortOrderEnum } from '@/api';
import orderBy from 'lodash-es/orderBy';

export const EmptyJobCounts = {
  [JobStatus.Active]: 0,
  [JobStatus.Waiting]: 0,
  [JobStatus.Completed]: 0,
  [JobStatus.Failed]: 0,
  [JobStatus.Delayed]: 0,
  [JobStatus.Paused]: 0,
};

export function sortQueues(
  queues: Queue[],
  sortBy = 'name',
  sortOrder = SortOrderEnum.Asc,
): Queue[] {
  const fields = [sortBy];
  const orders: Array<'asc' | 'desc'> = [
    sortOrder == SortOrderEnum.Asc ? 'asc' : 'desc',
  ];
  if (sortBy !== 'name') {
    orders.push('asc');
    // use name as a secondary
    fields.push('name');
  }
  return orderBy(queues, fields, orders) as Queue[];
}

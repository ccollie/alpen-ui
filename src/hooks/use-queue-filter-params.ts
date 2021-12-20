import { QueueFilterStatus, SortOrderEnum } from '@/api';
import { toBool } from '@/lib';
import { QueueFilter } from '@/modules/host';
import { useQueryString } from './index';

const defaultValues: QueueFilter = {
  sortOrder: SortOrderEnum.Asc,
  statuses: [],
  sortBy: 'name',
};

export function useQueueFilterParams(props?: QueueFilter): QueueFilter {
  props = props || defaultValues;

  const {
    active = props.statuses?.includes(QueueFilterStatus.Active),
    paused = props.statuses?.includes(QueueFilterStatus.Paused),
    sortBy = (props.sortBy = 'name'),
    sortOrder = props.sortOrder,
    searchText = undefined,
    prefix = undefined,
  } = useQueryString([
    'active',
    'paused',
    'prefix',
    'sortBy',
    'sortOrder',
    'searchText',
  ]);

  const order = ['asc', 'desc'].includes(sortOrder || '') ? sortOrder : 'asc';

  const result: QueueFilter = {
    sortBy: sortBy ?? 'name',
    statuses: [],
    sortOrder: order as QueueFilter['sortOrder'],
  };

  if (searchText && searchText !== 'undefined') result.search = searchText;
  if (prefix && prefix !== 'undefined') result.prefix = prefix;
  if (active !== undefined || toBool(active))
    result.statuses?.push(QueueFilterStatus.Active);
  if (paused !== undefined || toBool(paused))
    result.statuses?.push(QueueFilterStatus.Paused);
  return result;
}

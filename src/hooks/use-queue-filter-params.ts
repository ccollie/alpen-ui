import { QueueFilter } from '../@types/queue';
import { SortOrderEnum } from '../api';
import { toBool } from '../lib';
import { useQueryString } from './index';

const defaultValues: QueueFilter = {
  sortOrder: SortOrderEnum.Asc,
  sortBy: 'name',
};

export function useQueueFilterParams(props?: QueueFilter): QueueFilter {
  props = props || defaultValues;
  const {
    active = props.isActive,
    paused = props.isPaused,
    sortBy = props.sortBy,
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
    sortOrder: order as QueueFilter['sortOrder'],
  };

  if (searchText && searchText !== 'undefined') result.search = searchText;
  if (prefix && prefix !== 'undefined') result.prefix = prefix;
  if (active !== undefined) result.isActive = toBool(active);
  if (paused !== undefined) result.isPaused = toBool(paused);
  return result;
}

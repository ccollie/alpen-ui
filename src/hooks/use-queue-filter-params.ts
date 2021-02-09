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
    active = props.active,
    paused = props.paused,
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

  if (searchText) result.searchText = searchText;
  if (prefix) result.prefix = prefix;
  if (active !== undefined) result.active = toBool(active);
  if (paused !== undefined) result.paused = toBool(paused);
  return result;
}

import { QueueFilter } from '../@types/queue';
import { SortOrderEnum } from '../api';
import { toBool } from '../lib';
import { useQueryString } from './index';

const defaultValues: QueueFilter = {
  sortOrder: SortOrderEnum.Asc,
  active: true,
  paused: true,
  searchText: '',
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

  return {
    prefix: !prefix ? undefined : `${prefix}`,
    active: !active ? undefined : toBool(active),
    paused: !paused ? undefined : toBool(paused),
    sortBy: !sortBy ? 'name' : sortBy,
    searchText: !searchText ? undefined : `${searchText}`,
    sortOrder: order as QueueFilter['sortOrder'],
  };
}

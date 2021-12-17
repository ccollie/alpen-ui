import { QueueFilterStatus, SortOrderEnum } from '@/api';
import { useQueryString } from '@/hooks';
import { AllStatuses, normalizeFilter, QueueFilter } from '@/modules/host';
import { makeArray } from '@/lib';

const defaultValues: QueueFilter = {
  sortOrder: SortOrderEnum.Asc,
  sortBy: 'name',
};

export function useQueueFilterParams(props?: QueueFilter): QueueFilter {
  props = props || defaultValues;
  const {
    statuses = props.statuses,
    exclude = props.exclude ?? [],
    include = props.include ?? [],
    sortBy = props.sortBy,
    sortOrder = props.sortOrder,
    searchText = undefined,
    prefix = undefined,
  } = useQueryString([
    'statuses',
    'exclude',
    'include',
    'prefix',
    'sortBy',
    'sortOrder',
    'searchText',
  ]);

  const order = ['asc', 'desc'].includes(`${sortOrder || ''}`)
    ? `${sortOrder}`
    : 'asc';

  const result: QueueFilter = {
    sortBy: `${sortBy ?? 'name'}`,
    sortOrder: order as QueueFilter['sortOrder'],
  };

  if (searchText && searchText !== 'undefined') result.search = `${searchText}`;
  if (prefix && prefix !== 'undefined') result.prefix = `${prefix}`;
  if (statuses) {
    result.statuses = makeArray(statuses)
      .filter((s) => !!AllStatuses.find((status) => s === `${status}`))
      .map((x) => x as QueueFilterStatus);
  }
  if (exclude) {
    result.exclude = makeArray(exclude);
  }
  if (include) {
    result.include = makeArray(include);
  }
  return normalizeFilter(result);
}

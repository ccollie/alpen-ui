import { useQueryString } from './use-query-string';

const toInt = (value: string | null, defaultValue: number): number => {
  if (typeof value === 'string') {
    const intValue = parseInt(value, 10);
    return isNaN(intValue) ? defaultValue : intValue;
  }
  return defaultValue;
};

export enum PaginationSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

interface PaginationState {
  page: number;
  pageSize: number;
  sortBy?: string | null;
  sortOrder?: PaginationSortOrder | null;
}

const defaultValues: PaginationState = {
  page: 1,
  pageSize: 10,
  sortBy: null,
  sortOrder: null,
};

export function usePaginationQueryString(
  props?: PaginationState,
): PaginationState {
  const { page, pageSize, sortBy, sortOrder } = props || defaultValues;
  const {
    page: _page,
    pageSize: _perPage,
    sortBy: _sortBy = sortBy,
    sortOrder: _sortOrder = sortOrder,
  } = useQueryString(['page', 'pageSize', 'sortBy', 'sortOrder']);

  return {
    page: toInt(_page, page),
    pageSize: toInt(_perPage, pageSize),
    sortBy: _sortBy,
    sortOrder:
      _sortOrder === PaginationSortOrder.ASC ||
      _sortOrder === PaginationSortOrder.DESC
        ? (_sortOrder as PaginationSortOrder)
        : null,
  };
}

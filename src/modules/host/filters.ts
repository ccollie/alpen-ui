import {
  HostQueuesFilter,
  Maybe,
  Queue,
  QueueFilterStatus,
  SortOrderEnum,
} from '@/api';
import { escapeRegExp } from '@/lib';
import { SortAccessor, sorter, ValueType } from 'sorters';

export interface QueueFilter extends HostQueuesFilter {
  sortBy?: string;
  sortOrder?: SortOrderEnum;
}

export const DefaultQueueFilter: QueueFilter = {
  sortBy: 'name',
  sortOrder: SortOrderEnum.Asc,
  exclude: [],
  include: [],
};

export function isFilterEmpty(filter: HostQueuesFilter | undefined): boolean {
  if (!filter) return true;
  const { search, prefix, statuses, exclude = [], include = [] } = filter;
  return (
    !search &&
    !prefix &&
    exclude?.length === 0 &&
    include?.length === 0 &&
    (statuses?.length === 0 || statusesEqual(statuses ?? [], AllStatuses))
  );
}

export function filterQueues(queues: Queue[], filter?: QueueFilter): Queue[] {
  if (!filter) return queues;
  const { search, prefix, statuses = [], exclude = [], include = [] } = filter;
  const includeSet = new Set(include);
  const excludeSet = new Set(exclude);

  if (queues.length) {
    const checkPaused = statuses?.includes(QueueFilterStatus.Paused);
    const checkRunning = statuses?.includes(QueueFilterStatus.Running);
    const checkActive = statuses?.includes(QueueFilterStatus.Active);
    const checkInactive = statuses?.includes(QueueFilterStatus.Inactive);

    const regex = search ? new RegExp(escapeRegExp(search), 'i') : null;
    queues = queues.filter((q) => {
      let valid =
        (!include?.length || includeSet.has(q.id)) && !excludeSet.has(q.id);
      if (valid && prefix) {
        valid = q.prefix?.startsWith(prefix);
      }
      if (valid && regex) {
        valid = regex.test(q.name);
      }
      if (valid) {
        const active = !!q.workerCount;
        if (checkInactive && checkActive) {
          valid = true;
        } else if (checkInactive) {
          valid = !active;
        } else if (checkActive) {
          valid = active;
        }
      }
      if (valid) {
        if (checkPaused && checkRunning) {
          valid = true;
        } else if (checkPaused) {
          valid = q.isPaused;
        } else if (checkRunning) {
          valid = !q.isPaused;
        }
      }
      return valid;
    });
  }

  return queues;
}

function addSortSpec(
  spec: SortAccessor<Queue>[],
  field: string,
  descending: boolean,
) {
  const valueType = field === 'name' ? ValueType.String : ValueType.Number;
  const val = { value: field, descending, type: valueType };
  spec.push(val);
}

export function sortQueues(filter: QueueFilter, queues: Queue[]): Queue[] {
  if (queues.length) {
    const { sortBy = 'name', sortOrder = SortOrderEnum.Asc } = filter;
    const spec: SortAccessor<Queue>[] = [];

    addSortSpec(spec, sortBy, sortOrder === SortOrderEnum.Desc);
    // use name as a secondary
    if (sortBy !== 'name') {
      addSortSpec(spec, 'name', false);
    }
    const comparator = sorter(...spec);
    const sorted = [...queues];
    sorted.sort(comparator);
    return sorted;
  }
  return [];
}

export const AllStatuses = [
  QueueFilterStatus.Inactive,
  QueueFilterStatus.Active,
  QueueFilterStatus.Paused,
  QueueFilterStatus.Running,
];

export function statusesEqual(
  a: QueueFilterStatus[],
  b: QueueFilterStatus[],
): boolean {
  const a1 = new Set(a ?? AllStatuses);
  const b1 = new Set(b ?? AllStatuses);
  if (a1.size !== b1.size) return false;
  for (const x of a1) if (!b1.has(x)) return false;
  return true;
}

export function stringsEqual(
  a: string[] | undefined | null,
  b: string[] | undefined | null,
): boolean {
  const a1 = new Set(a ?? []);
  const b1 = new Set(b ?? []);
  if (a1.size !== b1.size) return false;
  for (const x of a1) if (!b1.has(x)) return false;
  return true;
}

export function normalizeFilter(filter: QueueFilter): QueueFilter {
  const result: QueueFilter = {
    sortOrder: filter.sortOrder || SortOrderEnum.Asc,
    sortBy: filter.sortBy || 'name',
    exclude: filter.exclude ?? [],
    include: filter.include ?? [],
  };
  if (filter.search) {
    result.search = filter.search;
  }
  if (filter.prefix) {
    result.prefix = filter.prefix;
  }
  if (!filter.statuses?.length) {
    result.statuses = [...AllStatuses];
  }
  return result;
}

export function stringEqual(
  a: Maybe<string> | undefined,
  b: Maybe<string> | undefined,
): boolean {
  if (!a && !b) return true;
  return a === b;
}

export function filtersEqual(a: QueueFilter, b: QueueFilter): boolean {
  a = normalizeFilter(a);
  b = normalizeFilter(b);
  return (
    statusesEqual(a.statuses ?? [], b.statuses ?? []) &&
    stringEqual(a.prefix, b.prefix) &&
    stringEqual(a.search, b.search) &&
    stringsEqual(a.exclude ?? [], b.exclude ?? []) &&
    stringsEqual(a.include ?? [], b.include ?? []) &&
    stringEqual(a.sortBy, b.sortBy) &&
    (a.sortOrder ?? SortOrderEnum.Asc) === (b.sortOrder ?? SortOrderEnum.Asc)
  );
}

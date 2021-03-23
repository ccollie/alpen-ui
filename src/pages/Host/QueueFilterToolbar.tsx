import { useWhyDidYouUpdate } from '@/hooks';
import { LightFilter, ProFormText } from '@ant-design/pro-form';
import { Checkbox, Form, Input, Space } from 'antd';
import React, { useCallback, useRef, ChangeEvent } from 'react';
import { QueueFilter } from '../../@types/queue';
import { Maybe, SortOrderEnum } from '../../api';
import SortSelect from './SortSelect';

interface FilterToolbarProps {
  defaultFilter: QueueFilter;
  onFilterUpdated: (filter: QueueFilter) => void | Promise<void>;
}

const QueueFilterToolbar: React.FC<FilterToolbarProps> = (props) => {
  const defaultValue = useRef<QueueFilter>(
    normalizeFilter(props.defaultFilter),
  );
  const filter = useRef<QueueFilter>(normalizeFilter(props.defaultFilter));

  useWhyDidYouUpdate('QueueFilterToolbar', props);

  const onChange = () => {
    if (props.onFilterUpdated && filter.current)
      return props.onFilterUpdated(filter.current);
  };

  const onSortChanged = useCallback(function onSortChanged(
    field: string,
    order: SortOrderEnum,
  ) {
    filter.current.sortBy = field;
    filter.current.sortOrder = order;
    return onChange();
  },
  []);

  const onSearchTextChange = useCallback(function onSearch(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    filter.current.search = e.currentTarget.value;
    return onChange();
  },
  []);

  const onPrefixTextChange = useCallback(function onSearch(
    e: ChangeEvent<HTMLInputElement>,
  ) {
    filter.current.prefix = e.currentTarget.value;
    return onChange();
  },
  []);

  function cycle(val: Maybe<boolean> | undefined) {
    if (val === undefined) return true;
    return val ? false : undefined;
  }

  const onActiveClick = useCallback(() => {
    filter.current.isActive = cycle(filter.current.isActive);
    return onChange();
  }, []);

  const onPausedClick = useCallback(() => {
    filter.current.isPaused = cycle(filter.current.isPaused);
    return onChange();
  }, []);

  function toBool(v: undefined): boolean | undefined {
    if (v === true) return true;
    if (v === false) return false;
    return undefined;
  }

  async function handleDropdownUpdate(values: Record<string, any>) {
    filter.current.isActive = toBool(values['active']);
    filter.current.isPaused = toBool(values['paused']);
    filter.current.prefix = values['prefix'] as string;
    await onChange();
  }

  function FilterDropdown() {
    const { isActive, isPaused, prefix } = filter.current;
    return (
      <LightFilter
        initialValues={{
          isActive,
          isPaused,
          prefix,
        }}
        collapse
        submitter={{
          // Configure the button text
          searchConfig: {
            resetText: 'Reset',
            submitText: 'Submit',
          },
        }}
        onFinish={handleDropdownUpdate}
      >
        <Form.Item
          label="Queue Prefix"
          tooltip="Queue prefix"
          labelAlign={'left'}
        >
          <Input
            placeholder="Prefix"
            allowClear={true}
            onChange={onPrefixTextChange}
          />
        </Form.Item>
        <Checkbox
          name="active"
          indeterminate={isActive === undefined}
          onClick={onActiveClick}
          checked={!!isActive}
        >
          Active
        </Checkbox>
        <Checkbox
          name="paused"
          indeterminate={isPaused === undefined}
          checked={!!isPaused}
          onClick={onPausedClick}
        >
          Paused
        </Checkbox>
      </LightFilter>
    );
  }

  const { sortBy, sortOrder, search } = filter.current;

  return (
    <Space>
      <Input
        placeholder="search text"
        allowClear
        onChange={onSearchTextChange}
        defaultValue={search ?? ''}
        style={{ width: 200 }}
      />
      <SortSelect
        sortField={sortBy}
        sortOrder={sortOrder}
        onSortChanged={onSortChanged}
      />
      <FilterDropdown />
    </Space>
  );
};

function normalizeFilter(filter: QueueFilter): QueueFilter {
  filter = filter ?? {
    sortOrder: SortOrderEnum.Asc,
  };
  const result: QueueFilter = {
    sortOrder: filter.sortOrder || SortOrderEnum.Asc,
    sortBy: filter.sortBy || 'name',
  };
  if (filter.search) {
    result.search = filter.search;
  }
  if (filter.prefix) {
    result.prefix = filter.prefix;
  }
  if (filter.isPaused !== undefined) {
    result.isPaused = filter.isPaused;
  }
  if (filter.isActive !== undefined) {
    result.isActive = filter.isActive;
  }
  return result;
}

function stringEqual(
  a: Maybe<string> | undefined,
  b: Maybe<string> | undefined,
): boolean {
  if (!a && !b) return true;
  return a === b;
}

function filtersEqual(a: QueueFilter, b: QueueFilter): boolean {
  a = normalizeFilter(a);
  b = normalizeFilter(b);
  return (
    a.isPaused === b.isPaused &&
    stringEqual(a.prefix, b.prefix) &&
    stringEqual(a.search, b.search) &&
    a.sortBy === b.sortBy &&
    a.sortOrder === b.sortOrder
  );
}

function arePropsEqual(a: FilterToolbarProps, b: FilterToolbarProps): boolean {
  return (
    filtersEqual(a.defaultFilter, b.defaultFilter) &&
    a.onFilterUpdated === b.onFilterUpdated
  );
}

export default React.memo(QueueFilterToolbar, arePropsEqual);

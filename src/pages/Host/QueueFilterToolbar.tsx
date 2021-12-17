import { useWhyDidYouUpdate } from '@/hooks';
import { LightFilter, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { Input, Space } from 'antd';
import React, { useCallback, useRef, ChangeEvent } from 'react';
import { QueueFilter } from '@/@types';
import { Maybe, SortOrderEnum } from '@/api';
import SortSelect from './SortSelect';

type TriStateValue = true | false | null | undefined;

interface FilterToolbarProps {
  defaultFilter: QueueFilter;
  onFilterUpdated: (filter: QueueFilter) => void | Promise<void>;
}

const QueueFilterToolbar: React.FC<FilterToolbarProps> = (props) => {
  const defaultValue = useRef<QueueFilter>(
    normalizeFilter(props.defaultFilter),
  );
  const filter = useRef<QueueFilter>(normalizeFilter(props.defaultFilter));
  const saveFilter = useRef<QueueFilter>({
    ...filter.current,
  });

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

  function toBool(v: undefined): boolean | undefined {
    if (v === true) return true;
    if (v === false) return false;
    return undefined;
  }

  function has(values: Record<string, any>, prop: string): boolean {
    return values.hasOwnProperty(prop);
  }

  function updateFromForm(values: Record<string, any>) {
    if (has(values, 'isActive'))
      filter.current.isActive = toBool(values['isActive']);
    if (has(values, 'isPaused'))
      filter.current.isPaused = toBool(values['isPaused']);
    if (has(values, 'prefix'))
      filter.current.prefix = values['prefix'] as string;
  }

  async function handleDropdownUpdate(values: Record<string, any>) {
    updateFromForm(values);
    saveFilter.current = { ...filter.current };
    console.log('Setting filter', filter.current);
    await onChange();
  }

  function handleReset() {
    filter.current = { ...saveFilter.current };
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
        title="Queue Filter"
        collapse
        submitter={{
          // Configure the button text
          searchConfig: {
            resetText: 'Reset',
            submitText: 'Submit',
          },
        }}
        onFinish={handleDropdownUpdate}
        onValuesChange={updateFromForm}
        onReset={handleReset}
        onAbort={(e) => handleReset()}
      >
        <ProFormText
          name="prefix"
          label="Queue Prefix"
          placeholder="Queue Prefix"
          allowClear={true}
          labelAlign="left"
        />
        <ProFormRadio.Group
          name="isActive"
          label="Active"
          tooltip="Show active/inactive queues"
          labelAlign="left"
          radioType="button"
          options={[
            {
              label: 'Active',
              value: true,
            },
            {
              label: 'Inactive',
              value: false,
            },
            {
              label: 'Both',
              value: '',
            },
          ]}
        />
        <ProFormRadio.Group
          name="isPaused"
          label="Paused"
          tooltip="Filter on queue paused status"
          labelAlign="left"
          radioType="button"
          options={[
            {
              label: 'Paused',
              value: true,
            },
            {
              label: 'Unpaused',
              value: false,
            },
            {
              label: 'Both',
              value: '',
            },
          ]}
        />
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

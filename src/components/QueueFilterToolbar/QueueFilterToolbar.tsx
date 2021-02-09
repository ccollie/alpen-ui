import { LightFilter, ProFormText } from '@ant-design/pro-form';
import { Checkbox, Input, Space } from 'antd';
import React, { useCallback, useRef } from 'react';
import { QueueFilter } from '../../@types/queue';
import { SortOrderEnum } from '../../api';
import { useWhyDidYouUpdate } from '../../hooks/use-why-update';
import SortSelect from './SortSelect';

const { Search } = Input;

interface FilterToolbarProps {
  filter: QueueFilter;
  onFilterUpdated: (filter: QueueFilter) => void | Promise<void>;
}

const QueueFilterToolbar: React.FC<FilterToolbarProps> = (props) => {
  const filter = useRef<QueueFilter>(normalizeFilter(props.filter));

  useWhyDidYouUpdate('QueueFilterToolbar', props);

  function cycle(val: boolean | undefined) {
    if (val === undefined) return true;
    return val ? false : undefined;
  }

  const onActiveClick = useCallback(() => {
    filter.current.active = cycle(filter.current.active);
  }, []);

  const onPausedClick = useCallback(() => {
    filter.current.paused = cycle(filter.current.paused);
  }, []);

  async function onChange() {
    if (props.onFilterUpdated) return props.onFilterUpdated(filter.current);
  }

  const onSortChanged = useCallback(function onSortChanged(
    field: string,
    order: SortOrderEnum,
  ) {
    console.log(field);
    filter.current.sortBy = field;
    filter.current.sortOrder = order;
    return onChange();
  },
  []);

  const onSearchTextChange = useCallback(function onSearch(value: string) {
    console.log(value);
    filter.current.searchText = value;
    return onChange();
  }, []);

  async function handleDropdownUpdate(values: Record<string, any>) {
    filter.current.active = values['active'] as boolean;
    filter.current.paused = values['paused'] as boolean;
    filter.current.prefix = values['prefix'] as string;
    await onChange();
  }

  function FilterDropdown() {
    const { active, paused, prefix } = filter.current;
    return (
      <LightFilter
        initialValues={{
          active,
          paused,
          prefix,
        }}
        submitter={{
          // Configure the button text
          searchConfig: {
            resetText: 'Reset',
            submitText: 'Submit',
          },
        }}
        collapse
        onFinish={handleDropdownUpdate}
      >
        <ProFormText
          width="md"
          name="prefix"
          label="Queue prefix"
          placeholder="Please enter a prefix"
        />
        <Checkbox
          name="active"
          indeterminate={active === undefined}
          onClick={onActiveClick}
          checked={active}
        >
          Active
        </Checkbox>
        <Checkbox
          name="paused"
          indeterminate={paused === undefined}
          checked={paused}
          onClick={onPausedClick}
        >
          Paused
        </Checkbox>
      </LightFilter>
    );
  }

  const { sortBy, sortOrder, searchText } = filter.current;

  return (
    <Space>
      <Search
        placeholder="input search text"
        allowClear
        onSearch={onSearchTextChange}
        value={searchText}
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
  if (filter.searchText) {
    result.searchText = filter.searchText;
  }
  if (filter.prefix) {
    result.prefix = filter.prefix;
  }
  if (filter.paused !== undefined) {
    result.paused = filter.paused;
  }
  if (filter.active !== undefined) {
    result.active = filter.active;
  }
  return result;
}

function stringEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a && !b) return true;
  return a === b;
}

function filtersEqual(a: QueueFilter, b: QueueFilter): boolean {
  a = normalizeFilter(a);
  b = normalizeFilter(b);
  return (
    a.paused === b.paused &&
    stringEqual(a.prefix, b.prefix) &&
    stringEqual(a.searchText, b.searchText) &&
    a.sortBy === b.sortBy &&
    a.sortOrder === b.sortOrder
  );
}

function arePropsEqual(a: FilterToolbarProps, b: FilterToolbarProps): boolean {
  return (
    filtersEqual(a.filter, b.filter) && a.onFilterUpdated === b.onFilterUpdated
  );
}

export default React.memo(QueueFilterToolbar, arePropsEqual);

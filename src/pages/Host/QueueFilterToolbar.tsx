import { QueueFilterStatus, SortOrderEnum } from '@/api';
import { useWhyDidYouUpdate } from '@/hooks';
import { filtersEqual, normalizeFilter, QueueFilter } from '@/modules/host';
import { LightFilter, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { Input, Space } from 'antd';
import React, { ChangeEvent, useCallback, useRef } from 'react';
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

  function addStatus(status: QueueFilterStatus) {
    const curr = filter.current;
    curr.statuses = curr.statuses || [];
    if (!curr.statuses.includes(status)) {
      curr.statuses.push(status);
    }
  }

  function removeStatus(status: QueueFilterStatus) {
    const curr = filter.current;
    curr.statuses = curr.statuses || [];
    const index = curr.statuses.indexOf(status);
    if (index >= 0) {
      curr.statuses.splice(index, 1);
    }
  }

  function updateFromForm(values: Record<string, any>) {
    if (has(values, 'isActive')) {
      const status = QueueFilterStatus.Active;
      if (toBool(values.isActive)) {
        addStatus(status);
      } else {
        removeStatus(status);
      }
    }
    if (has(values, 'isPaused')) {
      const status = QueueFilterStatus.Paused;
      if (toBool(values.isPaused)) {
        addStatus(status);
      } else {
        removeStatus(status);
      }
    }
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

  function hasStatus(status: QueueFilterStatus) {
    const curr = filter.current;
    if (!curr.statuses) return false;
    return curr.statuses.includes(status);
  }

  function FilterDropdown() {
    const isActive = hasStatus(QueueFilterStatus.Active);
    const isPaused = hasStatus(QueueFilterStatus.Paused);
    const prefix = filter.current.prefix;
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

function arePropsEqual(a: FilterToolbarProps, b: FilterToolbarProps): boolean {
  return (
    filtersEqual(a.defaultFilter, b.defaultFilter) &&
    a.onFilterUpdated === b.onFilterUpdated
  );
}

export default React.memo(QueueFilterToolbar, arePropsEqual);

import { useCallbackRef } from '@/hooks';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import React, { useState } from 'react';
import { SortOrderEnum } from '@/api';

const { Option } = Select;

// todo: error percentage/ error percentage then rate
const FIELDS = [
  'name',
  'mean',
  'median',
  '90th',
  '95th',
  '99th',
  'throughput',
  'error rate',
  'wait time',
];

const FieldMap: Record<string, string> = {
  mean: 'statsAggregate.mean',
  median: 'statsAggregate.median',
  '90th': 'statsAggregate.p90',
  '95th': 'statsAggregate.p95',
  '99th': 'statsAggregate.p99',
  throughput: 'throughput.m15Rate',
  'error rate': 'errorRate.m15Rate',
  'wait time': 'waitTimeAvg',
};

interface SortButtonProps {
  sortField?: string;
  sortOrder?: SortOrderEnum;
  onSortChanged: (field: string, sortOrder: SortOrderEnum) => void;
}

const SortSelect: React.FC<SortButtonProps> = (props) => {
  const {
    sortOrder: order = SortOrderEnum.Asc,
    sortField = 'name',
    onSortChanged,
  } = props;
  const [sortOrder, setSortOrder] = useState<SortOrderEnum>(order);
  const [field, setField] = useState(sortField);

  const onFieldSelected = useCallbackRef(() => {
    if (field) {
      const mapped = FieldMap[field] || field;
      onSortChanged(mapped, sortOrder);
    }
  });

  function sort(order: SortOrderEnum) {
    setSortOrder(order);
    onFieldSelected();
  }

  function toggle() {
    if (sortOrder === SortOrderEnum.Asc) {
      sort(SortOrderEnum.Desc);
    } else {
      sort(SortOrderEnum.Asc);
    }
  }

  function onUpdateField(value: string) {
    setField(value);
    onFieldSelected();
  }

  return (
    <Space size={1}>
      <Select
        onSelect={onUpdateField}
        placeholder="Sort"
        size="middle"
        defaultValue={field}
        style={{
          width: '100px',
        }}
      >
        {FIELDS.map((name, index) => (
          <Option value={name} key={`${index}`}>
            {name}
          </Option>
        ))}
      </Select>
      <Button
        onClick={toggle}
        defaultValue={sortOrder}
        icon={
          sortOrder === SortOrderEnum.Asc ? (
            <SortAscendingOutlined />
          ) : (
            <SortDescendingOutlined />
          )
        }
      />
    </Space>
  );
};

export default SortSelect;

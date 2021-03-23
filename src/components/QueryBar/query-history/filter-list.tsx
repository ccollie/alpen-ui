import { JobFilter } from '@/api';
import JobFilterCard from './job-filter-card';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Col, Row, Space, Empty } from 'antd';
import React from 'react';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export interface FavoritesListProps {
  data: JobFilter[];
  isLoading?: boolean;
  allowSearch?: boolean;
  view: string;
  onSelect: (filter: JobFilter) => void;
  onSave: (filter: JobFilter) => Promise<void>;
  onDelete: (filter: JobFilter) => Promise<void>;
}

const FilterList: React.FC<FavoritesListProps> = (props) => {
  const { isLoading = false, onSelect, onSave, onDelete, data } = props;

  function Items() {
    if (!data.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    return (
      <div>
        {data.map((filter) => (
          <JobFilterCard
            filter={filter}
            key={`fc-${filter.id}`}
            onFilterClick={onSelect}
            onDeleteClick={onDelete}
            onSaveFilter={onSave}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {isLoading ? (
          <Row>
            <Col>
              <Spin indicator={antIcon} />
            </Col>
          </Row>
        ) : (
          <Items />
        )}
      </Space>
    </>
  );
};

export default FilterList;

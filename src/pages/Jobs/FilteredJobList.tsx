import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Space, Table, TableProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { QueueJobActions } from '../../@types';
import { JobFragment, JobStatus } from '../../api';
import { usePaginationQueryString, useNavigationUpdate } from '../../hooks';

interface FilteredJobListProps {
  queueId: string;
  status: JobStatus;
  criteria?: string;
  pageSize?: number;
  actions: QueueJobActions;
  onClearSelections: () => void;
  extraProps: Partial<TableProps<JobFragment>>;
}

const FilteredJobList: React.FC<FilteredJobListProps> = (props) => {
  // eslint-disable-next-line prefer-const
  let { page, pageSize: _pageSize = 10 } = usePaginationQueryString();
  const {
    queueId,
    status,
    actions,
    criteria,
    pageSize = _pageSize,
    onClearSelections,
    extraProps,
  } = props;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [called, setCalled] = useState(false);
  const [data, setData] = useState<JobFragment[]>([]);
  const pagination = useRef<{
    page: number;
    pageSize: number;
    totalPages: number;
  }>({
    page,
    pageSize,
    totalPages: 0, // todo: read from ss
  });

  const [cursor, setCursor] = useState<string>();
  const [filter, setFilter] = useState<string>();
  const [hasNext, setHasNext] = useState<boolean>(false);

  const updateNavigation = useNavigationUpdate();

  useEffect(() => {
    if (cursor) {
      setHasNext(true);
    } else if (!criteria) {
      setHasNext(false);
    } else {
      const { page, totalPages } = pagination.current;
      setHasNext(page < totalPages);
    }
  }, [cursor, pagination.current]);

  useEffect(() => {
    pagination.current.totalPages = 0;
    pagination.current.page = 0;
    setCalled(false);
    if (criteria) {
      try {
        const t = JSON.parse(criteria);
        if (typeof t === 'object') {
          setFilter(filter);
        }
      } catch (e) {}
    } else {
      setFilter(undefined);
    }
  }, [criteria]);

  function updateNav() {
    let { page, pageSize } = pagination.current;
    if (page < 1) page = 1;
    updateNavigation({
      status,
      page,
      pageSize,
    });
  }

  function getSessionKey(suffix: string): string {
    const rest = cursor ? [cursor] : [];
    rest.push(suffix);
    return `FILTERED-JOBS-${queueId}:${rest.join(':')}`;
  }

  function clear() {
    setCursor(undefined);
    pagination.current.page = 1;
    pagination.current.pageSize = _pageSize;
    onClearSelections();
  }

  useEffect(() => {
    clear();
    // refresh
  }, [_pageSize]);

  function refresh() {
    if (called && !loading) {
      setRefreshing(true);
      fetchByCriteria();
    }
  }

  function fetchByCriteria(): void {
    setLoading(true);
    actions
      .getJobsByFilter(queueId, {
        status,
        count: pagination.current.pageSize,
        cursor,
        criteria: cursor ? undefined : filter,
      })
      .then(({ jobs, cursor: _cursor }) => {
        setData(jobs);
        setCalled(true);
        onClearSelections();
        // setExpandedRowKeys([]);
        if (_cursor !== cursor) {
          pagination.current.totalPages = 1;
          pagination.current.page = 1;
        } else {
          pagination.current.page = ++pagination.current.totalPages;
        }
        setCursor(_cursor ?? undefined);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  function getPageFromSession(index: number): void {
    if (index > 0) {
      const key = getSessionKey(`page:${index}`);
      const data = sessionStorage.getItem(key);
      if (data && data.length) {
        try {
          const items = JSON.parse(data);
          if (Array.isArray(items)) {
            setData(items as JobFragment[]);
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    setData([]);
  }

  function getPreviousPage() {
    const index = (pagination.current.page = Math.min(
      0,
      pagination.current.page--,
    ));
    getPageFromSession(index);
  }

  function getNextPage() {
    const { page, totalPages } = pagination.current;
    if (page === totalPages) {
      if (cursor) {
        fetchByCriteria();
      }
    }
    const index = (pagination.current.page = Math.max(totalPages, page + 1));
    return getPageFromSession(index);
  }

  return (
    <Space direction="vertical">
      <Table<JobFragment>
        dataSource={data}
        loading={loading && !refreshing}
        {...extraProps}
      />
      <Space>
        <Button
          disabled={pagination.current.page <= 1}
          icon={<LeftOutlined />}
          onClick={getPreviousPage}
        />
        {pagination.current.page}
        <Button
          disabled={!hasNext}
          icon={<RightOutlined />}
          onClick={getNextPage}
        />
      </Space>
    </Space>
  );
};

export default FilteredJobList;

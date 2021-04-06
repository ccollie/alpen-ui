import { JobCard } from '@/components';
import {
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
  TableOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, TableProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { QueueJobActions } from '../../@types';
import { JobFragment, JobStatus } from '../../api';
import {
  usePaginationQueryString,
  useNavigationUpdate,
  useWhyDidYouUpdate,
} from '../../hooks';
import './filtered-job-list.scss';

interface FilteredJobListProps {
  queueId: string;
  status: JobStatus;
  criteria?: string;
  pageSize?: number;
  actions: QueueJobActions;
  view?: 'list' | 'table' | 'card';
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

  useWhyDidYouUpdate('FilteredJobList', props);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [called, setCalled] = useState(false);
  const [data, setData] = useState<JobFragment[]>([]);
  const [view, setView] = useState(props.view ?? 'table');
  const pagination = useRef<{
    page: number;
    pageSize: number;
    totalPages: number;
    current: number;
    total: number;
    lastPage: number;
  }>({
    page,
    pageSize,
    current: 0,
    total: 0,
    lastPage: 0,
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
    setCalled(false);
    clearPagination();
    const f = props.criteria?.trim() ?? '';
    if (f) {
      setFilter(f);
    } else {
      setData([]);
      setFilter(undefined);
    }
  }, [props.criteria]);

  useEffect(() => {
    setCursor(undefined);
    clearPagination();
    if (filter) {
      fetchByCriteria();
    } else {
      setData([]);
    }
  }, [filter, status]);

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
    return `filtered-jobs-${queueId}:${rest.join(':')}`;
  }

  function clearPagination() {
    pagination.current.page = 0;
    pagination.current.lastPage = 0;
    pagination.current.pageSize = _pageSize;
    pagination.current.total = 0;
    pagination.current.current = 0;
    pagination.current.totalPages = 0;
  }

  function recalcPagination(current: number, total: number) {
    pagination.current.pageSize = _pageSize;
    pagination.current.total = total;
    pagination.current.current = current;
    pagination.current.totalPages =
      total === 0 ? 0 : Math.floor(total / _pageSize);
  }

  function clear() {
    setCursor(undefined);
    clearPagination();
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
      .then(({ jobs, cursor: _cursor, total, current }) => {
        setData(jobs);
        setCalled(true);
        onClearSelections();
        // setExpandedRowKeys([]);
        if (_cursor !== cursor) {
          clearPagination();
        }
        pagination.current.page++;
        pagination.current.lastPage++;
        recalcPagination(current, total);
        setCursor(_cursor ?? undefined);
        storePageInSession(pagination.current.page);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  function storePageInSession(index: number): void {
    if (index > 0) {
      const key = getSessionKey(`page:${index}`);
      if (data && data.length) {
        try {
          const items = JSON.stringify(data);
          sessionStorage.setItem(key, items);
        } catch (e) {
          console.log(e);
        }
      }
    }
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
    const index = (pagination.current.page = Math.max(
      0,
      pagination.current.page - 1,
    ));
    getPageFromSession(index);
    console.log('goto prev');
  }

  function getNextPage() {
    const { page, lastPage } = pagination.current;
    console.log('goto next, page = ' + page + ', lastPage = ' + lastPage);
    if (page === lastPage) {
      if (cursor) {
        // console.log('fetching next from cursor....');
        return fetchByCriteria();
      }
    }
    const index = (pagination.current.page = Math.min(lastPage, page + 1));
    return getPageFromSession(index);
  }

  function CardView() {
    return (
      <div className="filter-list-container">
        <div className="box inner">
          {data.map((job) => (
            <JobCard
              key={'card-' + job.id}
              job={job}
              status={status}
              actions={actions}
            />
          ))}
        </div>
      </div>
    );
  }

  function TableView() {
    return (
      <Table<JobFragment>
        dataSource={data}
        loading={loading && !refreshing}
        {...extraProps}
      />
    );
  }

  function Toolbar() {
    return (
      <Space>
        <Button
          size="small"
          disabled={data?.length == 0 || view === 'table'}
          icon={<TableOutlined />}
          onClick={showTable}
        />
        <Button
          size="small"
          disabled={data?.length == 0 || view === 'card'}
          icon={<IdcardOutlined />}
          onClick={showCards}
        />
        <Button
          size="small"
          disabled={pagination.current.page <= 1}
          icon={<LeftOutlined />}
          onClick={getPreviousPage}
        />
        {pagination.current.page}
        <Button
          size="small"
          disabled={!hasNext}
          icon={<RightOutlined />}
          onClick={getNextPage}
        />
        <Button
          size="small"
          disabled={!!cursor}
          loading={loading}
          icon={<ReloadOutlined />}
          onClick={refresh}
        />
      </Space>
    );
  }

  function showTable() {
    setView('table');
  }

  function showCards() {
    setView('card');
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Toolbar />
      {view === 'card' && <CardView />}
      {view === 'table' && <TableView />}
    </Space>
  );
};

export default FilteredJobList;

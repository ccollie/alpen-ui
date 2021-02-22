import { Space, Table, TableProps } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useRef, useState } from 'react';
import { QueueJobActions } from '../../@types';
import { EmptyJobCounts, JobCounts, JobFragment, JobStatus } from '../../api';
import {
  usePaginationQueryString,
  useInterval,
  useNavigationUpdate,
} from '../../hooks';
import { useWhyDidYouUpdate } from '../../hooks/use-why-update';
import {
  offBulkJobAction,
  offRefresh,
  onBulkJobAction,
  onRefresh,
  JOB_DELETED_EVENT,
  JOB_PROMOTED_EVENT,
  subscribe,
  unsubscribe,
} from './events';

interface JobListProps {
  queueId: string;
  status: JobStatus;
  actions: QueueJobActions;
  onClearSelections: () => void;
  extraProps: Partial<TableProps<JobFragment>>;
}

const JobList: React.FC<JobListProps> = (props) => {
  const { queueId, status, actions, extraProps, onClearSelections } = props;
  // eslint-disable-next-line prefer-const
  let { page, pageSize } = usePaginationQueryString();

  const [counts, setCounts] = useState<JobCounts>(EmptyJobCounts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [called, setCalled] = useState(false);
  const [data, setData] = useState<JobFragment[]>([]);
  const [total, setTotal] = useState(0);
  const [isManuallyRefreshed, setManuallyRefreshed] = useState(false);

  const pagination = useRef<{
    page: number;
    pageSize: number;
    total: number;
  }>({
    page,
    pageSize,
    total: 0,
  });

  useWhyDidYouUpdate('JobList', props);

  const updateNavigation = useNavigationUpdate();
  // const { subscribe } = useEventEmitter();
  //
  // subscribe(REFRESH_EVENT, refresh);

  function updateNav() {
    let { page, pageSize } = pagination.current;
    if (page < 1) page = 1;
    updateNavigation({
      status,
      page,
      pageSize,
    });
  }

  function handleTableChange(
    params: TablePaginationConfig,
    filters: any,
    sorter: any,
  ) {
    fetch(params.current, params.pageSize);
  }

  useEffect(fetch, [status, queueId]);

  useInterval(refresh, 5000);

  function refresh() {
    if (called && !loading && !isManuallyRefreshed) {
      setRefreshing(true);
      fetch();
    }
    setManuallyRefreshed(false);
  }

  function manualRefresh() {
    setManuallyRefreshed(true);
    setRefreshing(true);
    fetch();
  }

  function handleBulkAction(data: any) {
    manualRefresh();
  }

  useEffect(() => {
    onRefresh(manualRefresh);
    onBulkJobAction(handleBulkAction);
    subscribe(JOB_DELETED_EVENT, manualRefresh);
    return () => {
      offRefresh(manualRefresh);
      offBulkJobAction(handleBulkAction);
      unsubscribe(JOB_DELETED_EVENT, manualRefresh);
    };
  }, []);

  function fetch(pageNumber?: number, pageSize?: number): void {
    const { current } = pagination;

    pageSize = pageSize || current.pageSize;
    pageNumber = pageNumber || current.page || 1;

    setLoading(true);
    actions
      .getJobs(queueId, status, pageNumber, pageSize)
      .then(({ counts, jobs }) => {
        setCounts(counts);
        let _total = parseInt((counts as any)[status], 10);
        if (isNaN(_total)) _total = 0;
        setTotal(_total);
        setData(jobs);
        setCalled(true);
        if (pageSize !== current.pageSize || pageNumber !== current.page) {
          current.page = pageNumber || 1;
          current.pageSize = pageSize || 10;
          onClearSelections();
          // setExpandedRowKeys([]);
          updateNav();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
        setManuallyRefreshed(false);
      });
  }

  return (
    <div>
      <Space direction="vertical">
        <Table<JobFragment>
          dataSource={data}
          pagination={{
            current: pagination.current.page,
            pageSize: pagination.current.pageSize,
            total,
            responsive: true,
          }}
          loading={loading && !refreshing}
          onChange={handleTableChange}
          {...extraProps}
        />
      </Space>
    </div>
  );
};

export default JobList;

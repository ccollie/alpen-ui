import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  EmptyJobCounts,
  getJobs,
  JobCounts,
  JobFragment,
  JobStatus,
} from '../../api';
import { BulkActionType, JobBulkActions, StatusMenu } from '../../components';
import {
  usePaginationQueryString,
  useQueryString,
  useInterval,
  useNavigationUpdate,
  useJobActions,
  useDisclosure,
} from '../../hooks';
import { getColumns } from './columns';
import { JobListDetail } from './JobListDetail';
import JobSchemaDialog from './JobSchemaDialog';

const Jobs: React.FC = () => {
  const { queueId } = useParams();
  // eslint-disable-next-line prefer-const
  let { page, pageSize } = usePaginationQueryString();

  const { status: _status } = useQueryString(['status']);
  const [status, setStatus] = useState<JobStatus>(
    (_status || JobStatus.Active) as JobStatus,
  );

  const [counts, setCounts] = useState<JobCounts>(EmptyJobCounts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [called, setCalled] = useState(false);
  const [data, setData] = useState<JobFragment[]>([]);
  const [total, setTotal] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    [],
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pagination = useRef<{
    page: number;
    pageSize: number;
    total: number;
  }>({
    page,
    pageSize,
    total: 0,
  });

  const {
    isOpen: isSchemaDialogOpen,
    onOpen: openSchemaDialog,
    onClose: closeSchemaDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const updateNavigation = useNavigationUpdate();

  function updateNav() {
    let { page, pageSize } = pagination.current;
    if (page < 1) page = 1;
    updateNavigation({
      status,
      page,
      pageSize,
    });
  }

  function clearSelections() {
    setSelectedRowKeys([]);
    setSelectedIds([]);
  }

  function statusSelected(newStatus: JobStatus) {
    if (newStatus !== status) {
      setStatus(newStatus);
      pagination.current.page = 1;
      setExpandedRowKeys([]);
      clearSelections();
      updateNav();
    }
  }

  // Proxy actions so we can refresh list after update
  let _actions = useJobActions(queueId);
  const actions = useMemo(() => {
    _actions.promoteJob = (id: string) => {
      return _actions.promoteJob(id).then(refresh);
    };

    _actions.retryJob = (id: string) => {
      return _actions.retryJob(id).then(refresh);
    };

    _actions.deleteJob = (id: string) => {
      return _actions.deleteJob(id).then(refresh);
    };

    return _actions;
  }, [queueId]);

  const columns = useMemo(() => getColumns(status, actions), [status, actions]);

  function expandedRowRender(job: JobFragment) {
    const getLogs = (start: number, end: number) => {
      return actions.getJobLogs(job.id, start, end);
    };
    return (
      <JobListDetail
        key={`jr-${job.id}-detail`}
        job={job}
        getLogs={getLogs}
        status={status}
      />
    );
  }

  function onExpandedRowsChange(expandedRows: readonly React.Key[]): void {
    setExpandedRowKeys(expandedRows);
  }

  function onSelectChange(selected: React.Key[], selectedRows: JobFragment[]) {
    setSelectedRowKeys(selected);
    setSelectedIds(selected.map((val) => `${val}`));
  }

  const rowSelection = {
    columnWidth: '20px',
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  function handleTableChange(
    params: TablePaginationConfig,
    filters: any,
    sorter: any,
  ) {
    fetch(params.current, params.pageSize);
  }

  useEffect(fetch, [status]);

  useInterval(refresh, 5000);

  function refresh() {
    if (called && !loading) {
      setRefreshing(true);
      fetch();
    }
  }

  function fetch(pageNumber?: number, pageSize?: number): void {
    const { current } = pagination;

    pageSize = pageSize || current.pageSize;
    pageNumber = pageNumber || current.page || 1;

    setLoading(true);
    getJobs(queueId, status, pageNumber, pageSize)
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
          clearSelections();
          setExpandedRowKeys([]);
          updateNav();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  function onBulkAction(action: BulkActionType, ids: string[], count?: number) {
    if (count || 0) {
      refresh();
    }
  }

  return (
    <div>
      <span>
        <StatusMenu
          counts={counts}
          selectedStatus={status}
          onSelectStatus={statusSelected}
        />
        <Button onClick={openSchemaDialog}>Schemas</Button>
      </span>
      <Space direction="vertical">
        <span>
          <JobBulkActions
            status={status}
            selectedIds={selectedIds}
            actions={actions}
            onBulkAction={onBulkAction}
          />
          <Button icon={<PlusOutlined />}>Add</Button>
          <Button icon={<FilterOutlined />}></Button>
        </span>
        <Table<JobFragment>
          columns={columns}
          rowKey="id"
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpandedRowsChange,
            columnWidth: '16px',
          }}
          dataSource={data}
          pagination={{
            current: pagination.current.page,
            pageSize: pagination.current.pageSize,
            total,
            responsive: true,
          }}
          rowSelection={rowSelection}
          loading={loading && !refreshing}
          onChange={handleTableChange}
        />
      </Space>
      <JobSchemaDialog
        queueId={queueId}
        isOpen={isSchemaDialogOpen}
        onClose={closeSchemaDialog}
      />
    </div>
  );
};

export default Jobs;

import ExportJobsDialog from './ExportJobsDialog';
import {
  FilterOutlined,
  PlusOutlined,
  FilterTwoTone,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { Button, Col, Row, Space, Table } from 'antd';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  EmptyJobCounts,
  GetQueueJobCountsDocument,
  JobFragment,
  JobStatus,
} from '../../api';
import { isEmpty } from '../../lib';
import { JobBulkActions, StatusMenu, QueryBar } from '../../components';
import {
  usePaginationQueryString,
  useQueryString,
  useNavigationUpdate,
  useJobActions,
  useDisclosure,
} from '../../hooks';
import AddJobDialog from './AddJobDialog';
import { getColumns } from './columns';
import {
  emitJobEvent,
  emitRefresh,
  handleBulkAction,
  JOB_DELETED_EVENT,
  JOB_PROMOTED_EVENT,
  JOB_RETRIED_EVENT,
  offBulkJobAction,
  onBulkJobAction,
} from './events';
import JobList from './JobList';
import FilteredJobList from './FilteredJobList';
import { JobListDetail } from './JobListDetail';
import JobSchemaDialog from './JobSchemaDialog';

const Jobs: React.FC = () => {
  const { queueId } = useParams();

  const { status: _status, filter: defaultFilter } = useQueryString([
    'status',
    'filter',
  ]);
  const [status, setStatus] = useState<JobStatus>(
    (_status || JobStatus.Active) as JobStatus,
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    [],
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const items: string[] = [];
    const set = new Set(selectedRowKeys);
    setExpandedRowKeys(expandedRowKeys.filter((key) => !set.has(key)));
    selectedRowKeys.forEach((key) => {
      items.push(`${key}`);
    });
    setSelectedIds(items);
  }, [selectedRowKeys]);

  const { data: _jobCountData } = useQuery(GetQueueJobCountsDocument, {
    variables: { id: queueId },
    fetchPolicy: 'cache-first',
    pollInterval: 5000,
  });

  const [counts, setCounts] = useState(EmptyJobCounts);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const cnt = counts[status] || 0;
    setCurrentCount(cnt);
  }, [status, counts]);

  useEffect(() => {
    if (_jobCountData) {
      const _counts = _jobCountData.queue?.jobCounts ?? EmptyJobCounts;
      setCounts(_counts);
    }
  }, [_jobCountData]);

  const {
    isOpen: isSchemaDialogOpen,
    onClose: closeSchemaDialog,
    onToggle: toggleSchemaDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const {
    isOpen: isAddDialogOpen,
    onClose: closeAddDialog,
    onToggle: toggleAddDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const {
    isOpen: isExportDialogOpen,
    onClose: closeExportDialog,
    onOpen: openExportDialog,
    onToggle: toggleExportDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  const { isOpen: isFilterOpen, onToggle: toggleFilter } = useDisclosure({
    defaultIsOpen: false,
  });

  const [filter, setFilter] = useState<string>();

  const updateNavigation = useNavigationUpdate();
  const { page, pageSize = 10 } = usePaginationQueryString();

  const clearSelections = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedIds([]);
  }, []);

  function bulkActionHandler({
    action,
    ids,
  }: {
    action: string;
    ids: string[];
  }) {
    if (action === 'delete') {
      const set = new Set(ids);
      setSelectedRowKeys(
        selectedRowKeys.filter((key) => {
          return !set.has(`${key}`);
        }),
      );
    }
  }

  useEffect(() => {
    onBulkJobAction(bulkActionHandler);
    return () => {
      offBulkJobAction(bulkActionHandler);
    };
  }, []);

  function statusSelected(newStatus: JobStatus) {
    if (newStatus !== status) {
      setStatus(newStatus);
      setExpandedRowKeys([]);
      clearSelections();
      // updateNav();
    }
  }

  // Proxy actions so we can refresh list after update
  let _actions = useJobActions(queueId);

  const actions = useMemo(() => {
    const actions = { ..._actions };

    actions.promoteJob = (id: string) => {
      return _actions.promoteJob(id).then(() => {
        emitJobEvent(JOB_PROMOTED_EVENT, id, queueId);
      });
    };

    actions.retryJob = (id: string) => {
      return _actions.retryJob(id).then(() => {
        emitJobEvent(JOB_RETRIED_EVENT, id, queueId);
      });
    };

    actions.deleteJob = (id: string) => {
      return _actions.deleteJob(id).then(() => {
        emitJobEvent(JOB_DELETED_EVENT, id, queueId);
      });
    };

    return actions;
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
  }

  function refresh() {
    emitRefresh({ queueId });
  }

  const onFilterReset = useCallback(() => {
    setFilter(undefined);
  }, []);

  const onFilterApply = useCallback((filter: string) => {
    setFilter(filter);
  }, []);

  function FilterIcon() {
    if (isEmpty(filter) || !isFilterOpen) {
      return <FilterOutlined />;
    }
    return <FilterTwoTone />;
  }

  const tableProps = useMemo(
    () => ({
      columns,
      rowKey: 'id',
      expandable: {
        expandedRowRender,
        expandedRowKeys,
        onExpandedRowsChange,
        columnWidth: '16px',
      },
      rowSelection: {
        columnWidth: '20px',
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
          Table.SELECTION_ALL,
          Table.SELECTION_INVERT,
          Table.SELECTION_NONE,
        ],
      },
    }),
    [selectedRowKeys, expandedRowKeys, columns],
  );

  return (
    <div>
      <span>
        <StatusMenu
          counts={counts}
          selectedStatus={status}
          onSelectStatus={statusSelected}
        />
      </span>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row justify="end">
          <Col span={12}>
            <JobBulkActions
              status={status}
              selectedIds={selectedIds}
              actions={actions}
              onBulkAction={handleBulkAction}
            />
            <Button
              style={{ marginLeft: '10px' }}
              onClick={openExportDialog}
              disabled={!currentCount}
              icon={<CloudDownloadOutlined />}
            >
              Export
            </Button>
          </Col>
          <Col span={12}>
            <div
              style={{
                position: 'absolute',
                right: '5px',
              }}
            >
              <Button
                onClick={toggleSchemaDialog}
                disabled={isSchemaDialogOpen}
              >
                Schemas
              </Button>
              <Button icon={<PlusOutlined />} onClick={toggleAddDialog}>
                Add
              </Button>
              <Button icon={<FilterIcon />} onClick={toggleFilter} />
            </div>
          </Col>
        </Row>
        {isFilterOpen && (
          <div>
            <QueryBar
              queueId={queueId}
              defaultFilter={defaultFilter ?? undefined}
              onReset={onFilterReset}
              onApply={onFilterApply}
            />
          </div>
        )}
        {isFilterOpen && !!filter?.length ? (
          <FilteredJobList
            queueId={queueId}
            status={status}
            actions={actions}
            onClearSelections={clearSelections}
            criteria={filter}
            extraProps={tableProps}
          />
        ) : (
          <JobList
            queueId={queueId}
            status={status}
            actions={actions}
            onClearSelections={clearSelections}
            extraProps={tableProps}
          />
        )}
      </Space>
      {isSchemaDialogOpen && (
        <JobSchemaDialog
          queueId={queueId}
          isOpen={isSchemaDialogOpen}
          onClose={closeSchemaDialog}
        />
      )}
      {isAddDialogOpen && (
        <AddJobDialog
          queueId={queueId}
          isOpen={isAddDialogOpen}
          onClose={closeAddDialog}
        />
      )}
      {isExportDialogOpen && (
        <ExportJobsDialog
          queueId={queueId}
          onClose={closeExportDialog}
          status={status}
          visible={isExportDialogOpen}
          filter={filter || ''}
        />
      )}
    </div>
  );
};

export default Jobs;

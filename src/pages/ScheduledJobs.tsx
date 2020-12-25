import { DeleteOutlined } from '@ant-design/icons';
import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Space, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  RepeatableJob,
  getRepeatableJobs,
  normalizeJobName,
  deleteRepeatableJobByKey,
} from '../api';
import { useParams } from 'react-router';
import { ActionIcon, JobId } from '../components';
import { RelativeDateFormat } from '../components/RelativeDateFormat';
import { FaCalendar } from 'react-icons/fa';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatDate } from '../lib/dates';
import { parseJSON } from 'date-fns';
import {
  useInterval,
  useNavigationUpdate,
  usePaginationQueryString,
} from '../hooks';

const columns: ColumnsType<RepeatableJob> = [
  {
    title: 'Key',
    dataIndex: 'key',
    render: (key: string) => {
      return (
        <Tooltip arrowPointAtCenter title={key} aria-label={key}>
          <span>{key}</span>
        </Tooltip>
      );
    },
  },
  {
    title: 'Id',
    dataIndex: 'id',
    render: (id: string) => {
      if (!id) return null;
      return <JobId id={id} />;
    },
  },
  {
    title: 'Job Name',
    dataIndex: 'name',
    render: (_: string, job: RepeatableJob) => (
      <Fragment>{normalizeJobName(job)}</Fragment>
    ),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    render: (_, job: RepeatableJob) => {
      const val = _ ? parseJSON(_) : null;
      if (val) {
        return <RelativeDateFormat value={val} icon={<FaCalendar />} />;
      }
    },
  },
  {
    title: 'Cron',
    dataIndex: 'cron',
    render: (text: string, job: RepeatableJob) => (
      <Tooltip placement="top" arrowPointAtCenter title={job.descr}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Next',
    dataIndex: 'next',
    render: (text: string, job: RepeatableJob) => (
      <Space>
        <ClockCircleOutlined />
        {formatDate(new Date(job.next || 0))}
      </Space>
    ),
  },
  {
    title: 'Timezone',
    dataIndex: 'tz',
  },
];

type DeleteFunction = (key: string) => Promise<void>;

function DeleteIcon({
  jobKey,
  onDelete,
}: {
  jobKey: string;
  onDelete: DeleteFunction;
}) {
  const onClick = useCallback(() => onDelete(jobKey), [jobKey]);
  return (
    <ActionIcon
      key={`del-${jobKey}`}
      handler={onClick}
      confirmPrompt="Are you sure you want to delete this job?"
      baseIcon={<DeleteOutlined />}
    />
  );
}

function getColumns(onDelete: DeleteFunction): ColumnsType<RepeatableJob> {
  const cols = [...columns];
  cols.push({
    title: 'Actions',
    dataIndex: 'key',
    align: 'right',
    key: 'actions',
    width: 50,
    render: (_) => <DeleteIcon jobKey={_} onDelete={onDelete} />,
  });

  return cols;
}

export const ScheduledJobs: React.FC = () => {
  const { queueId } = useParams();
  // eslint-disable-next-line prefer-const
  let { page = 1, pageSize = 10 } = usePaginationQueryString();

  const [data, setData] = useState<RepeatableJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const pagination = useRef<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: page,
    pageSize,
    total: 0,
  });

  const updateNavigation = useNavigationUpdate();

  function handleDelete(key: string): Promise<void> {
    return deleteRepeatableJobByKey(queueId, key).then(() => {
      // todo: refresh
      fetch();
    });
  }

  const columns = useMemo(() => getColumns(handleDelete), [queueId]);

  function fetchJobs(pageNumber: number, pageSize: number): void {
    if (loading) return;
    const { current } = pagination;
    setLoading(true);
    getRepeatableJobs(queueId, pageNumber, pageSize)
      .then(({ count, jobs }) => {
        setCalled(true);
        setData(jobs);
        current.current = page;
        current.pageSize = pageSize;
        current.total = count;
        updateNavigation({ page: pageNumber, pageSize });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleTableChange(
    params: TablePaginationConfig,
    filters: any,
    sorter: any,
  ) {
    const pageSize = params.pageSize || pagination.current.pageSize;
    fetchJobs(params.current || pagination.current.current, pageSize);
  }

  function fetch() {
    const { current, pageSize } = pagination.current;
    if (!loading && called) {
      fetchJobs(current, pageSize);
    }
  }

  useEffect(() => {
    const { current, pageSize } = pagination.current;
    if (!loading) {
      fetchJobs(current, pageSize);
    }
  }, []);

  useInterval(fetch, 3000);

  return (
    <div>
      <Table<RepeatableJob>
        rowKey="key"
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={pagination.current}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ScheduledJobs;

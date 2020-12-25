import { ClockCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { parseJSON } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { QueueWorker, GetQueueWorkersDocument } from '../api';
import { RelativeDateFormat } from '../components/RelativeDateFormat';
import { formatDuration } from '../lib/dates';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';

const columns: ColumnsType<QueueWorker> = [
  {
    title: 'Id',
    dataIndex: 'id',
    render: (key: string) => {
      return (
        <Tooltip arrowPointAtCenter title={key} aria-label={key}>
          <span>{key}</span>
        </Tooltip>
      );
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Addr',
    dataIndex: 'addr',
  },
  {
    title: 'Started',
    dataIndex: 'endDate',
    render: (_: string, worker: QueueWorker) => {
      const value = worker.started;
      if (!value) return value;
      return (
        <RelativeDateFormat value={parseJSON(value)} icon={<FaCalendar />} />
      );
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    render: (text: string, worker: QueueWorker) => {
      const value = worker?.age;
      if (!value) return value;
      return formatDuration(value);
    },
  },
  {
    title: 'Idle',
    dataIndex: 'idle',
    render: (text: string, worker: QueueWorker) => {
      const value = worker?.idle;
      if (!value) return value;
      const val = formatDuration(value);
      return (
        <Space>
          <ClockCircleOutlined />
          <span>{val}</span>
        </Space>
      );
    },
  },
];

const Workers: React.FC = () => {
  const { queueId } = useParams();
  const [workers, setWorkers] = useState<QueueWorker[]>([]);

  const { loading, data, error } = useQuery(GetQueueWorkersDocument, {
    variables: { id: queueId },
    pollInterval: 5000,
  });

  useEffect(() => {
    if (data && !loading) {
      const _workers = (data?.queue?.workers || []) as QueueWorker[];
      setWorkers(_workers);
    }
  }, [data, loading]);

  return (
    <Table<QueueWorker>
      rowKey="id"
      columns={columns}
      dataSource={workers}
      loading={loading}
    />
  );
};

export default Workers;

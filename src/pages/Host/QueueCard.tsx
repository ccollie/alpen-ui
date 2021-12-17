import React, { useState, useEffect } from 'react';
import { Statistic, Space, Badge, Col, Row, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import { QueueActions } from '@/@types';
import { QueueMenu, QueueStateTag } from '../../components';

import prettyMilliseconds from 'pretty-ms';

import { JobCounts, Queue, StatsSnapshot } from '@/api';
import { useNavigate } from 'react-router-dom';
import { JobCountsPieChart, MiniArea } from '../../components/Charts';
import { BellOutlined } from '@ant-design/icons';
import { FaCogs } from 'react-icons/fa';
import { calcErrorPercentage } from '@/lib/stats';
const { Divider } = ProCard;

type QueueCardProps = {
  queue: Queue;
  stats?: StatsSnapshot[];
  statsSummary?: StatsSnapshot | null;
  onSelect?: (queue: Queue) => void;
  actions: QueueActions;
};

function statsFormatter(value: any) {
  const val = prettyMilliseconds(parseInt(value), { compact: false });
  return <Space>{val}</Space>;
}

function StatsCard({ stats }: { stats: StatsSnapshot }) {
  return (
    <ProCard.Group>
      <ProCard>
        <Statistic
          title="Median"
          value={stats.median}
          formatter={statsFormatter}
        />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic title="Mean" value={stats.mean} formatter={statsFormatter} />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic title="95th" value={stats.p95} formatter={statsFormatter} />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic title="99th" value={stats.p99} formatter={statsFormatter} />
      </ProCard>
    </ProCard.Group>
  );
}

function AlertCountIndicator({ count }: { count: number }) {
  return (
    <Badge count={count}>
      <Tooltip title="Alerts">
        <BellOutlined style={{ cursor: 'pointer' }} />
      </Tooltip>
    </Badge>
  );
}

const QueueCard: React.FC<QueueCardProps> = (props) => {
  const { queue, actions, stats = [], statsSummary } = props;

  const [errorPercentage, setErrorPercentage] = useState(0);

  const [chartData, setChartData] = useState<
    {
      x: number;
      y: number;
    }[]
  >([]);

  const [counts, setJobCounts] = useState<JobCounts>(
    queue.jobCounts || {
      completed: 0,
      failed: 0,
      delayed: 0,
      active: 0,
      waiting: 0,
      paused: 0,
    },
  );

  useEffect(() => {
    const data = (stats ?? []).map((val) => ({
      x: val.startTime,
      y: val.completed,
    }));
    setChartData(data);
  }, [stats]);

  useEffect(() => {
    if (statsSummary) {
      const percentage = calcErrorPercentage(statsSummary);
      setErrorPercentage(percentage);
    }
  }, [statsSummary]);

  const navigate = useNavigate();

  const selectQueue = () => navigate(`/queues/${queue.id}/jobs`);
  const gotoWorkers = () => navigate(`/queues/${queue.id}/workers`);

  const title = (
    <Space size={3}>
      <a onClick={selectQueue}>{queue?.name}</a>
      <QueueStateTag queue={queue} style={{ marginLeft: '2px' }} />
    </Space>
  );

  const headerActions = (
    <Space size={12} direction="horizontal">
      <Tooltip placement="bottom" title={`${queue?.workerCount ?? 0} workers`}>
        <FaCogs
          onClick={gotoWorkers}
          style={{ opacity: 0.5, marginTop: '5px', cursor: 'pointer' }}
        />
      </Tooltip>
      <AlertCountIndicator count={queue.ruleAlertCount ?? 0} />
      <QueueMenu queue={queue} actions={actions} />
    </Space>
  );

  return (
    <ProCard
      style={{ marginTop: 8 }}
      gutter={8}
      title={title}
      extra={headerActions}
    >
      <Row>
        <Col span={8}>
          <Statistic
            value={queue.throughput.m15Rate}
            title="Throughput"
            precision={1}
            suffix="/min"
          />
        </Col>
        <Col span={8}>
          <Statistic
            value={queue.errorRate.m15Rate}
            title="Errors"
            precision={1}
            suffix="/min"
          />
        </Col>
        <Col span={8}>
          <Statistic
            value={errorPercentage}
            title="Error %"
            precision={1}
            suffix="%"
          />
        </Col>
      </Row>
      <JobCountsPieChart counts={counts} height={300} />
      <div style={{ marginBottom: '8px' }}>
        <MiniArea height={45} color="#975FE4" data={chartData} />
      </div>
      {statsSummary && <StatsCard stats={statsSummary} />}
    </ProCard>
  );
};

export default QueueCard;

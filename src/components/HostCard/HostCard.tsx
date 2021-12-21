import { Col, Row, Space, Statistic } from 'antd';
import formatBytes from 'pretty-bytes';
import React, { ReactText, useCallback, useEffect, useState } from 'react';
import { EmptyJobCounts, JobCounts, QueueHost, StatsSnapshot } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useWhyDidYouUpdate } from '@/hooks';
import { calcErrorPercentage, calcJobRatePerUnit } from '@/lib/stats';
import { roundNumber } from '@/lib';
import { JobCountsPieChart, MiniChart } from '../Charts';
import { HostStateTag } from '../HostStateTag';

interface HostCardProps {
  host: QueueHost;
}

const HostCard: React.FC<HostCardProps> = (props) => {
  const { host } = props;
  const [hourStats, setHourStats] = useState<StatsSnapshot>();
  const [errorPercentage, setErrorPercentage] = useState(0);
  const [jobsPerMinute, setJobsPerMinute] = useState(0);

  useWhyDidYouUpdate('HostCard', host);
  const [chartData, setChartData] = useState<
    {
      x: number;
      y: number;
    }[]
  >([]);

  useEffect(() => {
    const data = (host.stats ?? []).map((val) => ({
      x: val.startTime,
      y: val.completed,
    }));
    setChartData(data);
  }, [host?.stats]);

  const navigate = useNavigate();
  const counts: JobCounts = {
    ...EmptyJobCounts,
    ...host.jobCounts,
  };

  let jobTotal = 0;
  for (const key in Object.keys(counts)) {
    const val = (counts as any)[key];
    if (typeof val === 'number') {
      jobTotal += val;
    }
  }

  function round(value: number): number {
    return parseFloat(roundNumber(value));
  }

  useEffect(() => {
    if (host.lastStatsSnapshot) {
      const stats = host.lastStatsSnapshot;
      const jobRate = calcJobRatePerUnit(stats, 'minute');
      setHourStats(stats);
      setErrorPercentage(round(100 * calcErrorPercentage(stats)));
      setJobsPerMinute(jobRate);
    }
  }, [host.lastStatsSnapshot]);

  const selectHost = useCallback(
    () => navigate(`/hosts/${host.id}`),
    [host.id],
  );

  function byteFormatter(value: ReactText) {
    const num: number = typeof value === 'string' ? parseInt(value) : value;
    const formatted = isNaN(num) ? '' : formatBytes(num);
    return <span>{formatted}</span>;
  }

  function StatsCard() {
    return (
      <div>
        <Row>
          <Col span={6}>
            <Statistic title="Queues" value={host.queueCount} />
          </Col>
          <Col span={6}>
            <Statistic title="Workers" value={host.workerCount} />
          </Col>
          <Col span={6}>
            <Statistic title="Clients" value={host.redis.connected_clients} />
          </Col>
          <Col span={6}>
            <Statistic
              title="Used Memory"
              value={host.redis.used_memory}
              formatter={byteFormatter}
            />
          </Col>
        </Row>
      </div>
    );
  }

  const title = (
    <Space size={3}>
      <a onClick={selectHost}>{host?.name}</a>
      <HostStateTag host={host} style={{ marginLeft: '2px' }} />
    </Space>
  );

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="w-full shadow" onClick={selectHost}>
          <div className="w-full h-64 border-b dark:bg-gray-800 bg-gray-100 dark:border-gray-700 border-gray-400 rounded-t">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center">
                <span className="text-lg font-semibold">{title}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{host.uri}</span>
              </div>
            </div>
            <JobCountsPieChart counts={counts} height={300} />
            ya
            <div style={{ marginBottom: '8px' }}>
              <MiniChart
                type="area"
                height={45}
                color="#975FE4"
                data={chartData}
              />
            </div>
          </div>
          <div className="w-full h-24 rounded-b dark:bg-gray-800 bg-white">
            <StatsCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default HostCard;

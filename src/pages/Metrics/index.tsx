import ProCard from '@ant-design/pro-card';
import { Col, Divider, Row, Space, Statistic } from 'antd';
import prettyMilliseconds from 'pretty-ms';
import React, { FC, useEffect, useState } from 'react';
import {
  QueueStatsPageQueryDocument,
  Queue,
  StatsGranularity,
  StatsSnapshot,
} from '../../api';
import { useParams } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import { RangePickerValue } from '../../components';
import { StatsLineChart } from '../../components/Charts';
import ErrorRateChart, {
  ErrorDataItem,
} from '../../components/Charts/ErrorChart/ErrorRateChart';
import TimeRangeToolbar, {
  RangeType,
} from '../../components/Charts/StatsLineChart/TimeRangeToolbar';
import { useInterval } from '../../hooks';
import { calcErrorPercentage } from '../../lib/stats';

const ChartHeight = '340px';

const RuntimeFields = ['mean', 'median', 'p90', 'p95', 'p99'];

function statsFormatter(value: any) {
  const val = prettyMilliseconds(parseInt(value), { compact: false });
  return <Space>{val}</Space>;
}

function getErrorChardData(snaps: StatsSnapshot[]): ErrorDataItem[] {
  return snaps.map((snap) => {
    return {
      start: +new Date(snap.startTime),
      end: +new Date(snap.endTime),
      failed: snap.failed,
      completed: snap.completed,
    };
  });
}

const POLL_INTERVAL = 60000;

const Metrics: FC = () => {
  const { queueId } = useParams();
  const [range, setRange] = useState('this_hour');
  const [queue, setQueue] = useState<Queue | null>(null);
  const [granularity, setGranularity] = useState(StatsGranularity.Minute);
  const [snapshots, setSnapshots] = useState<StatsSnapshot[]>([]);
  const [errorChartData, setErrorChartData] = useState<ErrorDataItem[]>([]);
  const [errorPercentage, setErrorPercentage] = useState(0);
  const [pollInterval, setPollInterval] = useState<number | null>(
    POLL_INTERVAL,
  );

  // todo: use actual date-times so we can cache results
  const [getData, { loading, data: queueData, called, error }] = useLazyQuery(
    QueueStatsPageQueryDocument,
    {
      fetchPolicy: 'network-only',
    },
  );

  function fetch() {
    getData({
      variables: {
        id: queueId,
        range,
        granularity,
      },
    });
  }

  useEffect(fetch, [queueId, range, granularity]);

  useEffect(() => {
    if (queueData && !loading) {
      setQueue((queueData?.queue as Queue) ?? null);
      setSnapshots(queue?.stats ?? []);
      setErrorChartData(getErrorChardData(snapshots));
      const summary = queueData?.queue?.statsAggregate;
      if (summary) {
        const perc = calcErrorPercentage(summary);
        setErrorPercentage(perc);
      }
    }
  }, [queueData, loading]);

  useInterval(() => {
    if (called && !loading) {
      fetch();
    }
  }, pollInterval);

  function onDateRangeChange(type: RangeType, dates: RangePickerValue) {
    console.log('type = ' + type);
    console.log(dates);
    const [start, end] = dates || [null, null];
    if (start && end) {
      const now = new Date();
      const interval = `${start.getTime()}-${end.getTime()}`;
      setRange(interval);
      setPollInterval(end < now ? null : POLL_INTERVAL);
      fetch();
    }
  }

  return (
    <>
      <ProCard.Group colSpan={24} direction="row" ghost>
        <ProCard>
          <Statistic
            title="Response - Mean"
            value={queue?.statsAggregate?.mean ?? 0}
            formatter={statsFormatter}
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            title="Response - 95th"
            value={queue?.statsAggregate?.p95 ?? 0}
            formatter={statsFormatter}
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            title="Throughput"
            value={queue?.throughput.m15Rate}
            precision={1}
            suffix="min"
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            title="Error Rate"
            value={queue?.errorRate.m15Rate}
            precision={1}
            suffix="min"
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            value={errorPercentage}
            title="Error %"
            precision={1}
            suffix="%"
          />
        </ProCard>
        <Divider type="vertical" />
        <ProCard>
          <Statistic
            title="Avg Wait Time"
            value={queue?.waitTimeAvg}
            formatter={statsFormatter}
          />
        </ProCard>
      </ProCard.Group>
      <Row gutter={24} style={{ marginBottom: '5px', marginTop: '5px' }}>
        <Col span={24}>
          <TimeRangeToolbar onRangeChange={onDateRangeChange} />
        </Col>
      </Row>
      <ProCard title="Runtime" loading={loading && !called}>
        <StatsLineChart
          height={300}
          granularity={granularity}
          fields={RuntimeFields}
          data={snapshots}
        />
      </ProCard>
      <Row gutter={8} style={{ marginTop: 4 }}>
        <Col span={12}>
          <ProCard title="Throughput">
            <StatsLineChart
              height={300}
              granularity={granularity}
              fields={['completed']}
              data={snapshots}
            />
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard title="Errors" loading={loading && !called}>
            <ErrorRateChart
              data={errorChartData}
              height={300}
              granularity={granularity}
            />
          </ProCard>
        </Col>
      </Row>
    </>
  );
};

export default Metrics;

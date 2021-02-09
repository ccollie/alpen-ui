import { DonutChart } from 'bizcharts';
import React, { useState } from 'react';
import { JobStatus } from '../../../api';
import { Empty, Space } from 'antd';

type PieChartDataProps = {
  height?: number;
  counts: { [key in JobStatus]: number };
  onClick?: (status: JobStatus, value?: number) => void;
};

const Colors = {
  [JobStatus.Waiting + '']: 'hsl(32, 70%, 50%)',
  [JobStatus.Active + '']: 'hsl(22, 70%, 50%)',
  [JobStatus.Completed + '']: 'hsl(132, 70%, 50%)',
  [JobStatus.Failed + '']: 'hsl(345, 70%, 50%)',
  [JobStatus.Paused + '']: 'hsl(345, 70%, 50%)',
  [JobStatus.Delayed + '']: 'hsl(292, 70%, 50%)',
};

interface DataPoint {
  status: string;
  value: number;
  color?: string;
}

function normalizeData(props: PieChartDataProps): DataPoint[] {
  const data: DataPoint[] = [];
  Object.entries(props.counts).forEach(([status, value]) => {
    const color = Colors[status];
    if (status === '__typename') return;
    data.push({
      status,
      value, //ts couldn't infer this
      color,
    });
  });
  return data;
}

function arePropsEqual(a: PieChartDataProps, b: PieChartDataProps): boolean {
  if (a.height !== b.height) return false;
  if (a.onClick !== b.onClick) return false;
  const keys = Object.keys(Colors);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if ((a.counts as any)[k] !== (b.counts as any)[k]) return false;
  }
  return true;
}

const JobCountsPieChart: React.FC<PieChartDataProps> = (props) => {
  const { height } = props;
  const [data, setData] = useState<DataPoint[]>(normalizeData(props));
  let total = data.reduce((result, point) => result + point.value, 0);

  function handleClick(evt: any) {
    const status = evt.status as JobStatus;
    props.onClick && props.onClick(status, evt.value);
  }

  return (
    <div
      style={{
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: 'sans-serif',
      }}
    >
      {total ? (
        <DonutChart
          data={data}
          height={height}
          radius={0.8}
          padding="auto"
          forceFit
          angleField="value"
          colorField="status"
          label={{
            visible: true,
            type: 'outer-center',
          }}
          statistic={{
            title: {
              formatter: () => 'Total',
            },
          }}
        />
      ) : (
        <Space align="center" style={{ height: height }}>
          <Empty description={<span>No Jobs Available</span>} />
        </Space>
      )}
    </div>
  );
};

export default React.memo(JobCountsPieChart, arePropsEqual);

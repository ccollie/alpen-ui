import { DonutChart } from 'bizcharts';
import React from 'react';
import { JobStatus } from '../../../api';
import { Empty } from 'antd';

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

const JobCountsPieChart: React.FC<PieChartDataProps> = (props) => {
  const { height } = props;
  let total = 0;
  const data: { status: string; value: number }[] = [];
  Object.entries(props.counts).forEach(([status, value]) => {
    const color = Colors[status];
    total += value;
    if (status === '__typename') return;
    data.push({
      status,
      value, //ts couldn't infer this
    });
  });

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
            visible: true,
            totalLabel: 'Total',
          }}
        />
      ) : (
        <Empty description={<span>No Jobs Available</span>} />
      )}
    </div>
  );
};

export default JobCountsPieChart;

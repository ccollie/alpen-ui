import {
  arePropsEqual,
  DataPoint,
  normalizeData,
  PieChartDataProps,
} from '@/components/Charts/JobCountsPieChart/utils';
import { DonutChart } from 'bizcharts';
import React, { useState } from 'react';
import { JobStatus } from '@/api';
import { Empty, Space } from 'antd';

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
          autoFit
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

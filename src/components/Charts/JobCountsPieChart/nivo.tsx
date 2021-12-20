import {
  arePropsEqual,
  Colors,
  OnPieClickCallback,
  PieChartDataProps,
} from './utils';
import React from 'react';
import styled from 'styled-components';
import { ResponsivePie } from '@nivo/pie';
import type { LegendProps } from '@nivo/legends';
import AutoSizer from 'react-virtualized-auto-sizer';

const margin = { top: 30, right: 200, bottom: 30, left: 30 };

const styles = {
  root: {
    fontFamily: 'consolas, sans-serif',
    width: 600,
    height: 600,
  },
  totalLabel: {
    fontSize: 24,
  },
};

const TextOverlay = styled.div`
  position: absolute;
  top: 0;
  right: ${margin.right};
  bottom: 0;
  left: ${margin.left};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 96px;
  color: #ffffff;
  text-align: center;
  // This is important to preserve the chart interactivity
  pointer-events: none;
`;
const theme = {
  background: '#222222',
  axis: {
    fontSize: '14px',
    tickColor: '#eee',
    ticks: {
      line: {
        stroke: '#555555',
      },
      text: {
        fill: '#ffffff',
      },
    },
    legend: {
      text: {
        fill: '#aaaaaa',
      },
    },
  },
  grid: {
    line: {
      stroke: '#555555',
    },
  },
};

const legends: LegendProps[] = [
  {
    anchor: 'right',
    direction: 'column',
    justify: false,
    translateX: 140,
    translateY: 0,
    itemsSpacing: 2,
    itemWidth: 100,
    itemHeight: 20,
    itemDirection: 'left-to-right',
    itemOpacity: 0.85,
    itemTextColor: '#ffffff',
    symbolSize: 20,
    effects: [
      {
        on: 'hover',
        style: {
          itemOpacity: 1,
        },
      },
    ],
  },
];

interface PieDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

function normalizeData(props: PieChartDataProps): PieDatum[] {
  const data: PieDatum[] = [];
  Object.entries(props.counts).forEach(([status, value]) => {
    const color = Colors[status];
    if (status === '__typename') return;
    data.push({
      id: `${status}`,
      label: status,
      value, //ts couldn't infer this
      color,
    });
  });
  return data;
}

interface PieProps {
  data: PieDatum[];
  total: number;
  onClick?: OnPieClickCallback;
}

const Pie: React.FC<PieProps> = (props) => {
  const { data, total, onClick } = props;
  return (
    <div style={{ flex: '1 1 auto' }}>
      <ResponsivePie
        margin={margin}
        data={data}
        innerRadius={0.8}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        theme={theme}
        legends={legends}
        activeInnerRadiusOffset={0.85}
      />
      <TextOverlay>
        <div>{total}</div>
        <div style={styles.totalLabel}>total jobs</div>
      </TextOverlay>
    </div>
  );
};

const JobCountsPieChart: React.FC<PieChartDataProps> = (props) => {
  const data = normalizeData(props);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={styles.root}>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          textAlign: 'center',
          minWidth: '400px',
        }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <div
              style={{
                flex: '1 1 auto',
                width: width,
                height: props.height ?? height,
              }}
            >
              <Pie data={data} total={total} onClick={props.onClick} />
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default React.memo(JobCountsPieChart, arePropsEqual);

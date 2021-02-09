import { Space, Statistic } from 'antd';
import ProCard from '@ant-design/pro-card';
import React, { ReactText } from 'react';
import { RedisInfo } from '../../api';
import { RedisLogo } from './RedisLogo';
import formatBytes from 'pretty-bytes';
const { Divider } = ProCard;

const getMemoryUsage = (
  usedMemory: number,
  totalSystemMemory: number,
): string => {
  if (!usedMemory) {
    return '-';
  }

  if (!totalSystemMemory) {
    return formatBytes(usedMemory);
  }

  return `${((usedMemory / totalSystemMemory) * 100).toFixed(2)}%`;
};

function byteFormatter(value: ReactText) {
  const num: number = typeof value === 'string' ? parseInt(value) : value;
  const formatted = isNaN(num) ? '' : formatBytes(num);
  return <span>{formatted}</span>;
}

interface RedisStatsProps {
  stats: Partial<RedisInfo>;
}

export const RedisStats: React.FC<RedisStatsProps> = ({ stats }) => {
  const {
    redis_version,
    used_memory = 0,
    total_system_memory = 0,
    mem_fragmentation_ratio,
    connected_clients,
    maxmemory = 0,
    blocked_clients,
  } = stats || {};

  const ratio = mem_fragmentation_ratio || 0;

  return (
    <ProCard.Group>
      <ProCard>
        <Space align="center">
          <RedisLogo />
        </Space>
      </ProCard>
      <ProCard>
        <Statistic title="Version" value={redis_version} />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic
          formatter={byteFormatter}
          value={total_system_memory}
          title="System Memory"
        />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic
          formatter={byteFormatter}
          value={used_memory}
          title="Used Memory"
        />
        <span>{getMemoryUsage(used_memory, total_system_memory)}</span>
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic
          value={ratio}
          title="Fragmentation"
          precision={2}
          suffix={'%'}
        />
      </ProCard>
      <Divider />
      <ProCard>
        <Statistic value={connected_clients} title="Clients" />
      </ProCard>
    </ProCard.Group>
  );
};

import React from 'react';
import { JobStatus } from '../../../api';
import { Progress as CircularProgress } from 'antd';

export const Progress = ({
  percentage,
  status,
}: {
  percentage: number;
  status: JobStatus;
  className?: string;
}) => {
  return (
    <CircularProgress
      type="circle"
      width={80}
      percent={percentage}
      status={JobStatus.Failed === status ? 'exception' : undefined}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}
    />
  );
};

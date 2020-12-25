import { Tag } from 'antd';
import { TagProps } from 'antd/es/tag';
import React from 'react';
import { QueueHost } from '../../api';

interface HostStateTagProps extends TagProps {
  host: QueueHost;
}

const HostStateTag: React.FC<HostStateTagProps> = (props) => {
  const { host, ...rest } = props;
  // todo: from theme
  let color = 'success';
  let state = 'Active';
  if (!host.workerCount) {
    color = 'volcano';
    state = 'Inactive';
  }
  return (
    <Tag color={color} {...rest}>
      {state}
    </Tag>
  );
};

export default HostStateTag;

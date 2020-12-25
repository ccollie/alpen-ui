import React from 'react';
import { Highlight } from '../../components/Highlight';
import { Progress, Popover } from 'antd';

interface JobProgressProps {
  value: Record<string, any> | number | string;
  size?: 'default' | 'small';
}

function ProgressPopover({
  value,
  maxLinkLen = 120,
}: {
  value: Record<string, any>;
  maxLinkLen?: number;
}) {
  const jsonString = JSON.stringify(value, null, 2);

  return (
    <Popover
      title="Progress"
      arrowPointAtCenter
      trigger="hover"
      placement="top"
      content={<Highlight language="json">{jsonString}</Highlight>}
    >
      Hover to see value
    </Popover>
  );
}

export const JobProgress: React.FC<JobProgressProps> = ({
  value,
  size = 'default',
}) => {
  switch (typeof value) {
    case 'object':
      return <ProgressPopover value={value} />;
    case 'number':
      if (value > 100) {
        return <div className="progress-wrapper">{value}</div>;
      }
      return (
        <div className="progress-wrapper">
          <Progress width={36} percent={value} size={size}>
            {value}%
          </Progress>
        </div>
      );
    case 'string':
      return <div className="progress-wrapper">{value}</div>;
    default:
      return <>--</>;
  }
};

export default JobProgress;

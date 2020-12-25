import { Tooltip } from 'antd';
import React from 'react';

interface JobIdProps {
  id: string;
  maxLen?: number;
}

const JobId: React.FC<JobIdProps> = ({ id, maxLen = 10 }) => {
  const _id = id || '';
  const displayShortId = id && String(id).length > maxLen;
  if (displayShortId) {
    const shortId = _id.substr(0, maxLen) + '...';
    return (
      <Tooltip placement="top" title={_id} aria-label={`job id ${_id}`}>
        <span>#{shortId}</span>
      </Tooltip>
    );
  }
  return <span>#{_id}</span>;
};

export default JobId;

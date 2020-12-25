import React from 'react';
import { Popover, Tooltip } from 'antd';

import { safeParse } from '../../lib';
import { Highlight } from '../Highlight';

interface ReturnValueCellProps {
  value: unknown;
  maxDisplayLen?: number;
}

const ReturnValue: React.FC<ReturnValueCellProps> = (props) => {
  const { maxDisplayLen = 0, value } = props;

  let res: string;
  let isObj = false;
  const type = typeof value;
  if (value === undefined) {
    res = '(None)';
  } else if (value === null) {
    res = 'null';
  } else if (type === 'string') {
    res = safeParse(value);
  } else if (type === 'object') {
    isObj = true;
    res = JSON.stringify(value, null, 2);
  } else {
    res = value + '';
  }

  if (isObj) {
    if (maxDisplayLen && res.length <= maxDisplayLen) {
      return <code>{res}</code>;
    }
    return (
      <Popover
        title="Return Value"
        trigger="hover"
        placement="top"
        arrowPointAtCenter
        content={<Highlight language="json">{res}</Highlight>}
      >
        value
      </Popover>
    );
  }
  if (maxDisplayLen && res.length <= maxDisplayLen) {
    const shortValue = res.substr(0, maxDisplayLen) + '...';
    return (
      <Tooltip placement="top" title={res} aria-label={`return value "${res}"`}>
        <span>{shortValue}</span>
      </Tooltip>
    );
  }
  return <div>{`${value}`}</div>;
};

export default ReturnValue;

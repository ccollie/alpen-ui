import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import { formatDate, relativeFormat } from '../../lib/dates';

interface RelativeDateFormatProps {
  value: number | Date | undefined;
  showZero?: boolean;
  icon?: JSX.Element;
}

const RelativeDateFormat: React.FC<RelativeDateFormatProps> = (props) => {
  const { value, icon, children } = props;

  if (!value) {
    return <span></span>;
  }

  const label = relativeFormat(value);

  /**
   * Passing the icon as prop or children should work
   */
  const element = icon || children;
  const _children = React.isValidElement(element)
    ? React.cloneElement(element as any, {
        focusable: false,
      })
    : null;

  return (
    <Fragment>
      {_children}
      <Tooltip placement="top" title={label} aria-label={label}>
        <span>{formatDate(value)}</span>
      </Tooltip>
    </Fragment>
  );
};

export default RelativeDateFormat;

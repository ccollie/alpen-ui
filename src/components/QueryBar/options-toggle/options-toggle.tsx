import React from 'react';
import classnames from 'classnames';
import { FaCaretDown, FaCaretRight } from "react-icons/fa";

import styles from './options-toggle.module.css';

interface ToggleProps {
  onToggle: () => void;
  className?: string;
  expanded: boolean;
}

const OptionsToggle: React.FC<ToggleProps> = (props) => {
  const { expanded, className = '' } = props;

  function onClick() {
    props.onToggle && props.onToggle();
  }

  const _className = classnames(
    'btn',
    'btn-default',
    'btn-xs',
    styles.component,
    { [ styles['is-open'] ]: expanded },
    className
  );

  return (
    <div
      className={_className}
      onClick={onClick}
      data-test-id="query-bar-options-toggle">
      {expanded ? (
        <FaCaretDown />
      ) : (
        <FaCaretRight />
      )}
      <span data-test-id="query-bar-options-toggle-text">Options</span>
    </div>
  )
};

export default OptionsToggle;
export { OptionsToggle };

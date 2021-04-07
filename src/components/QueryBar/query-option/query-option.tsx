import React from 'react';
import classnames from 'classnames';
import OptionEditor from '../option-editor';

import styles from './query-option.module.css';
import { OptionType } from '../constants';

interface QueryOptionProps {
  placeholder?: string;
  label: OptionType;
  link: string;
  inputType: 'numeric' | 'boolean' | 'document' | 'string';
  value: any;
  autoPopulated?: boolean;
  hasToggle?: boolean;
  hasError?: boolean;
  onChange?: (value: string, label: OptionType) => void;
  onApplyFilter?: () => void;
}

const QueryOption = (props: QueryOptionProps) => {
  const {
    label,
    inputType,
    hasError = false,
    value = '',
    autoPopulated = false,
  } = props;

  const _className = classnames(styles.component, {
    [styles['has-error']]: hasError,
  });

  function handleChange(value: string) {
    props.onChange && props.onChange(value, label);
  }

  function handleApply() {
    props.onApplyFilter && props.onApplyFilter();
  }

  return (
    <div className={_className} data-test-id="query-bar-option">
      <OptionEditor
        label={label}
        value={value}
        onChange={handleChange}
        onApply={handleApply}
        autoPopulated={autoPopulated}
      />
    </div>
  );
};

export default QueryOption;
export { QueryOption };

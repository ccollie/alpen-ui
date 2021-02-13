import React from 'react';
import classnames from 'classnames';
import InfoSprinkle from '../info-sprinkle';
import OptionEditor from '../option-editor';

import styles from './query-option.module.css';
import { AutocompleteField } from '../query-autocompleter';
import { OptionType } from '../constants';

interface QueryOptionProps {
  placeholder?: string;
  label: OptionType;
  link: string;
  inputType: 'numeric' | 'boolean' | 'document';
  value: any;
  autoPopulated?: boolean;
  hasToggle?: boolean;
  hasError?: boolean;
  onChange?: (value: string, label: OptionType) => void;
  onApplyFilter?: () => void;
  schemaFields?: AutocompleteField[];
}

const QueryOption = (props: QueryOptionProps) => {
  const {
    label,
    inputType,
    hasToggle = false,
    hasError = false,
    value = '',
    placeholder = '',
    autoPopulated = false,
    schemaFields = [],
  } = props;

  const isAutoComplete = ['filter', 'sort'].includes(label);
  const isBoolean = inputType === 'boolean';
  const isSimple = !isAutoComplete && !isBoolean;

  const _className = classnames(
    styles.component,
    { [styles[`is-${inputType}-type`]]: true },
    { [styles['has-error']]: hasError },
  );

  const innerClassName = classnames(
    styles.input,
    { [styles[`input-${label}`]]: label },
    { [styles[`input-${inputType}`]]: inputType },
    { [styles['has-toggle']]: hasToggle },
  );

  function _openLink(href: string) {
    window.open(href, '_new');
  }

  function handleChange(value: string) {
    props.onChange && props.onChange(value, label);
  }

  function handleApply() {
    props.onApplyFilter && props.onApplyFilter();
  }

  function handleChangeEvent(event: React.ChangeEvent<HTMLInputElement>) {
    handleChange(event.currentTarget.value);
  }

  return (
    <div className={_className} data-test-id="query-bar-option">
      <div
        className={classnames(styles.label)}
        data-test-id="query-bar-option-label"
      >
        <InfoSprinkle helpLink={props.link} onClickHandler={_openLink} />
        {label}
      </div>
      {isAutoComplete && (
        <OptionEditor
          label={label}
          value={value}
          onChange={handleChange}
          onApply={handleApply}
          autoPopulated={autoPopulated}
          schemaFields={schemaFields}
        />
      )}
      {isBoolean && (
        <input
          id={`querybar-option-input-${label}`}
          data-test-id="query-bar-option-input"
          className={innerClassName}
          type="checkbox"
          checked={value}
          onChange={handleChangeEvent}
        />
      )}
      {isSimple && (
        <input
          id={`querybar-option-input-${label}`}
          data-test-id="query-bar-option-input"
          className={innerClassName}
          type="text"
          value={value}
          onChange={handleChangeEvent}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default QueryOption;
export { QueryOption };

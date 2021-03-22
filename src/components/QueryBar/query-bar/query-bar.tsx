import { TextChangeEvent } from '@/components/CMEditor';
import { Button, Col, Form, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from 'react';
import classnames from 'classnames';
import { isEqual, isFunction } from 'lodash';
import { useWhyDidYouUpdate } from '../../../hooks';
import InfoSprinkle from '../info-sprinkle';
import OptionEditor from '../option-editor';
import styles from './query-bar.module.css';

import {
  DEFAULT_BUTTON_LABEL,
  DEFAULT_FILTER,
  DEFAULT_STATE,
  QueryState,
} from '../constants';
import { AutocompleteField } from '../query-autocompleter';
import { isFilterValid } from '../utils';

type Query = {
  filter: string;
  limit?: number;
};

type QueryKey = keyof Query;

interface QueryBarProps {
  filter?: string;
  limit?: number;
  autoPopulated?: boolean;
  buttonLabel?: string;
  onReset: () => void;
  onApply?: (filter: string, limit: number) => void;
  onChange?: (value: string, label: QueryKey) => void;
  schemaFields?: AutocompleteField[];
}

const QueryBar: React.FC<QueryBarProps> = (props) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [queryState, setQueryState] = useState(DEFAULT_STATE);
  const [isValid, setValid] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('');
  const [filterInput, setFilterInput] = useState<string>(
    props.filter ?? DEFAULT_FILTER,
  );
  const [filterValid, setFilterValid] = useState<boolean>(
    !filterInput || isFilterValid(filterInput),
  );
  const [filter, setFilter] = useState<string>(filterInput);
  const [isEmptyQuery, setIsEmptyQuery] = useState(true);
  const childRef = useRef();

  useWhyDidYouUpdate('QueryBar', props);

  useEffect(() => {
    // todo: validate
    setFilter(filterInput);
  }, [filterInput]);

  useEffect(() => {
    const input = filter;
    const mt = !(input && input.length);
    setIsEmptyQuery(mt);
  }, [filter]);

  const { schemaFields = [], buttonLabel = DEFAULT_BUTTON_LABEL } = props;

  /**
   * returns true if all components of the query are not false.
   * (note: they can return a value 0, which should not be interpreted as
   * false here.)
   *
   * @return {Boolean}  if the full query is valid.
   */
  function validateQuery() {
    return isFilterValid(filter);
  }

  /**
   * Sets `queryString` and `valid`, and if it is a valid input, also set `filter`,
   * `limit`.
   * If it is not a valid query, only set `valid` to `false`.
   * @param {String} input   the query string (i.e. manual user input)
   */
  function setQueryString(input: string): void {
    const toValidate = (input ?? '').trim();
    setIsEmptyQuery(toValidate.length === 0);
    const _valid = isFilterValid(toValidate);
    if (_valid) {
      setFilter(input ?? DEFAULT_FILTER);
    }
    setValid(_valid);
    setHasError(!_valid && !isEmptyQuery);
    console.log('here ' + input);
  }

  /**
   * dismiss current changes to the query and restore `{}` as the query.
   */
  function reset() {
    // if the current query is the same as the default, nothing happens
    if (isEqual(filter?.trim() ?? '', '')) {
      return;
    }

    // if the last executed query is the default query, we don't need to
    // change lastExecuteQuery and trigger a change in the QueryChangedStore.
    if (isEqual(lastExecutedQuery, '')) {
      setQueryString('');
      return;
    }

    // otherwise we do need to trigger and let all other
    // components in the app know about the change so they can re-render.
    if (isValid) {
      setValid(true);
      setFilter(DEFAULT_FILTER);
      setFilterInput(DEFAULT_FILTER);
    }
  }

  /**
   * apply the current (valid) query, and store it in `lastExecutedQuery`.
   */
  const handleApply = useCallback(() => {
    if (validateQuery()) {
      setValid(true);
      setQueryState(QueryState.APPLY_STATE);
      setLastExecutedQuery(filter);
      if (isFunction(props.onApply)) {
        props.onApply(filter, 10);
      }
    } else {
      setValid(false);
    }
  }, [props.onApply]);

  function onChange(value: string, isValid: boolean) {
    setFilterInput(value);
    setValid(isValid);
  }

  function onResetButtonClicked() {
    const { onReset } = props;
    reset();
    onReset?.();
  }

  function _queryHasChanges() {
    return !isEqual(filter, lastExecutedQuery);
  }

  function _onFocus() {
    setHasFocus(true);
  }

  function _onBlur() {
    setHasFocus(false);
  }

  function onApplyButtonClicked(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    // No evt when pressing enter from ACE.
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    handleApply();
  }

  function handleChange(evt: TextChangeEvent) {
    setFilterInput(evt.value);
  }

  function __onChange(evt: ChangeEvent<HTMLTextAreaElement>) {
    evt.preventDefault();
    setFilterInput(evt.target.value);
  }

  /**
   * renders the rows of the querybar component
   *
   * @return {Fragment} array of components, one for each row.
   */
  function FilterRow() {
    const _className = classnames(
      styles.component,
      { [styles[`is-string-type`]]: true },
      { [styles['has-error']]: hasError },
    );

    return (
      <div className={_className} key="query-bar-1">
        <div className={classnames(styles.label)} key="query-bar-option-label">
          <InfoSprinkle helpLink={'filter'} onClickHandler={() => {}} />
        </div>
        <OptionEditor
          key="filter-editor-3"
          value={filterInput}
          onChange={onChange}
          onApply={handleApply}
          autoPopulated={true}
          schemaFields={schemaFields}
        />
      </div>
    );
  }

  function DoForm() {
    return (
      <Form.Item
        key="form-item-1-1-2-1"
        name="name"
        label="Filter"
        rules={[{ message: 'Please enter job name' }]}
      >
        <TextArea
          key="ed25519A$"
          value={filter}
          onChange={__onChange}
          defaultValue={filterInput}
          placeholder="Filter"
          autoSize={{ minRows: 3, maxRows: 5 }}
          autoFocus={true}
        />
      </Form.Item>
    );
  }

  /**
   * Render Query Bar input form (just the input fields and buttons).
   *
   * @returns {React.Component} The Query Bar view.
   */
  function InputForm() {
    const _inputGroupClassName = classnames(styles['input-group'], {
      'has-error': hasError,
    });

    const applyDisabled = !isValid || isEmptyQuery;
    const resetDisabled = queryState !== QueryState.APPLY_STATE;

    const _queryOptionClassName = classnames(styles['option-container'], {
      [styles['has-focus']]: hasFocus,
      'has-error': hasError,
    });

    return (
      <div className={_inputGroupClassName} key="filter-level-1-1">
        <div
          className={_queryOptionClassName}
          onBlur={_onBlur}
          onFocus={_onFocus}
          key="filter-level-1-2"
        >
          <FilterRow />
        </div>
        <Space>
          <Button
            type="primary"
            size="small"
            id="query-bar-apply-filter-button"
            key="filter-apply-button"
            onClick={onApplyButtonClicked}
            disabled={applyDisabled}
          >
            {buttonLabel}
          </Button>
          <Button
            size="small"
            id="query-bar-reset-filter-button"
            key="filter-reset-button"
            disabled={resetDisabled}
            onClick={onResetButtonClicked}
          >
            Reset
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div className={classnames(styles.component)} key="filter-level">
      <div
        className={classnames(styles['input-container'])}
        key="filter-level-1"
      >
        <InputForm />
      </div>
    </div>
  );
};

export default QueryBar;
export { QueryBar };

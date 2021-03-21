import { Button, Space } from 'antd';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from 'react';
import classnames from 'classnames';
import { isEmpty, isEqual, isFunction } from 'lodash';
import { useWhyDidYouUpdate } from '../../../hooks';
import InfoSprinkle from '../info-sprinkle';
import OptionEditor from '../option-editor';
import styles from './query-bar.module.css';

import {
  DEFAULT_BUTTON_LABEL,
  DEFAULT_FILTER,
  DEFAULT_LIMIT,
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
   *
   * @param {String} label         Which part of the query, e.g. `filter`
   * @param {Object} input   the query string (i.e. manual user input)
   */
  function setQueryString(label: string, input: string): void {
    const toValidate = (input ?? '').trim();
    setIsEmptyQuery(toValidate.length === 0);
    const _valid = isFilterValid(toValidate);
    if (_valid) {
      setFilter(input ?? DEFAULT_FILTER);
    }
    setFilterInput(input);
    setValid(_valid);
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
      setQueryString('filter', '');
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

  function onChange(value: string, label: string) {
    setImmediate(() => setQueryString(label, value));
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

  /**
   * renders the rows of the querybar component
   *
   * @return {Fragment} array of components, one for each row.
   */
  function FilterRow() {
    const label = 'Filter';
    const hasError = !isEmptyQuery && !isValid;

    const _className = classnames(
      styles.component,
      { [styles[`is-string-type`]]: true },
      { [styles['has-error']]: hasError },
    );

    return (
      <div className={_className} data-test-id="query-bar-option">
        <div
          className={classnames(styles.label)}
          data-test-id="query-bar-option-label"
        >
          <InfoSprinkle helpLink={'filter'} onClickHandler={() => {}} />
          Filter
        </div>
        <OptionEditor
          label={'Filter'}
          value={filterInput}
          onChange={onChange}
          onApply={handleApply}
          autoPopulated={true}
          schemaFields={schemaFields}
        />
      </div>
    );
  }

  /**
   * Render Query Bar input form (just the input fields and buttons).
   *
   * @returns {React.Component} The Query Bar view.
   */
  function InputForm() {
    const _inputGroupClassName = classnames(styles['input-group'], {
      'has-error': !isValid && !isEmptyQuery,
    });

    const applyDisabled = !isValid || isEmptyQuery;
    const resetDisabled = queryState !== QueryState.APPLY_STATE;

    const _queryOptionClassName = classnames(styles['option-container'], {
      [styles['has-focus']]: hasFocus,
      'has-error': !isValid && !isEmptyQuery,
    });

    return (
      <div className={_inputGroupClassName}>
        <div
          onBlur={_onBlur}
          onFocus={_onFocus}
          className={_queryOptionClassName}
        >
          <FilterRow />
        </div>

        <Space>
          <Button
            type="primary"
            size="small"
            id="query-bar-apply-filter-button"
            key="apply-button"
            onClick={onApplyButtonClicked}
            disabled={applyDisabled}
          >
            {buttonLabel}
          </Button>
          <Button
            size="small"
            id="query-bar-reset-filter-button"
            key="reset-button"
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
    <div className={classnames(styles.component)}>
      <div className={classnames(styles['input-container'])}>
        <InputForm />
      </div>
    </div>
  );
};

export default QueryBar;
export { QueryBar };

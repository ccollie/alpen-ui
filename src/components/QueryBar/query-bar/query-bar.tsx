import { Button, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import {
  isArray,
  isBoolean,
  isEmpty,
  isEqual,
  isFunction,
  isString,
} from 'lodash';

import QueryOption from '../query-option';
import OptionsToggle from '../options-toggle';
import styles from './query-bar.module.css';

import {
  DEFAULT_FILTER,
  DEFAULT_LIMIT,
  DEFAULT_SAMPLE,
  DEFAULT_SAMPLE_SIZE,
  DEFAULT_STATE,
  QueryState,
} from '../constants';
import { AutocompleteField } from '../query-autocompleter';
import { stringify, isNumberValid, isFilterValid } from '../utils';

type Query = {
  filter: Record<string, any>;
  limit?: number;
};

type QueryKey = keyof Query;

const OPTION_DEFINITION: Record<QueryKey, any> = {
  filter: {
    type: 'document',
    placeholder: "{ field: 'value' }",
    link: 'https://docs.mongodb.com/compass/current/query/filter/',
  },
  limit: {
    type: 'numeric',
    placeholder: '0',
    link: 'https://docs.mongodb.com/manual/reference/method/cursor.limit/',
  },
};

/**
 * returns the default query with all the query properties.
 *
 * @return {Object}  new object consisting of all default values.
 */
function _getDefaultQuery(): Query {
  return {
    filter: DEFAULT_FILTER,
    limit: DEFAULT_LIMIT,
  };
}

interface QueryBarProps {
  filter: Record<string, any>;
  limit: number;
  sample?: boolean;
  autoPopulated?: boolean;
  buttonLabel?: string;
  layout?: Array<QueryKey | QueryKey[]>;
  expanded?: boolean;
  onReset: () => void;
  onApply?: (filter: string) => void;
  onChange?: (value: string, label: QueryKey) => void;
  schemaFields: AutocompleteField[];
}

const QueryBar: React.FC<QueryBarProps> = (props) => {
  type FieldMeta = {
    value: any;
    isValid: boolean;
    stringValue: string;
    isChanged: boolean;
  };
  type FieldMap = Record<QueryKey, FieldMeta>;

  const [hasFocus, setHasFocus] = useState(false);
  const [expanded, setExpanded] = useState(!!props.expanded);
  const [queryState, setQueryState] = useState(DEFAULT_STATE);
  const [valid, setValid] = useState(true);
  const [isEmptyQuery, setIsEmptyQuery] = useState(false);
  const [sample, setSample] = useState(props.sample ?? DEFAULT_SAMPLE);
  const lastExecutedQuery = useRef<Query>(_getDefaultQuery());

  const fieldMap = useRef<FieldMap>({
    filter: {
      value: { ...props.filter },
      isValid: true,
      stringValue: JSON.stringify(props.filter),
      isChanged: false,
    },
    limit: {
      isValid: true,
      value: props.limit,
      stringValue: props.limit.toString(),
      isChanged: false,
    },
  });

  useEffect(() => {
    if (sample) {
      // todo: only do this on first mount
      const map = fieldMap.current;
      if (isEmpty(map.filter)) {
        map.filter.stringValue = OPTION_DEFINITION['filter'].placeholder;
        map.filter.value = JSON.parse(map.filter.stringValue);
      }

      toggleSample(true);
    }
  }, [sample, props.filter, props.limit]);

  const Keys: QueryKey[] = ['filter', 'limit'];

  const {
    layout = ['filter', ['limit']],
    schemaFields = [],
    buttonLabel = 'Apply',
  } = props;
  const showToggle = layout.length > 1;

  // for multi-line layouts, the first option must be stand-alone
  if (showToggle && !isString(layout[0])) {
    throw new Error(
      `First item in multi-line layout must be single option, found ${layout[0]}`,
    );
  }

  function _isFieldValid(key: QueryKey): boolean {
    const meta = fieldMap.current[key];
    return meta.isValid;
  }

  /**
   * returns a clone of the current query.
   *
   * @return {Object}  clone of the query properties.
   */
  function cloneQuery(): Query {
    const map = fieldMap.current;
    const filter = map.filter;
    return {
      filter: isEmpty(filter.value) ? DEFAULT_FILTER : { ...map.filter.value },
      limit: map.limit.value,
    };
  }

  /**
   * returns true if all components of the query are not false.
   * (note: they can return a value 0, which should not be interpreted as
   * false here.)
   *
   * @return {Boolean}  if the full query is valid.
   */
  function validateQuery() {
    const map = fieldMap.current;
    return (
      isFilterValid(map.filter.stringValue) &&
      isNumberValid(map.limit.stringValue)
    );
  }

  /**
   * routes to the correct validation function.
   *
   * @param {String} label   one of `filter`, `limit`
   * @param {String} input   the input to validated
   *
   * @return {Boolean|String}   false if not valid, otherwise the potentially
   *                            cleaned-up string input.
   */
  function validateInput(label: QueryKey, input: string) {
    if (label === 'filter') {
      if (isFilterValid(input)) {
        return input;
      }
    }
    return isNumberValid(input);
  }

  /**
   * toggles between sampling on/off. Also can take a value to force sampling
   * to be on or off directly. When sampling is turned on and there is no limit
   * specified, set it to the DEFAULT_SAMPLE_SIZE.
   *
   * @param {Boolean} force   optional flag to force the sampling to be on or
   *                          off. If not specified, the value switches to its
   *                          opposite state.
   */
  function toggleSample(force?: boolean) {
    const _sample = isBoolean(force) ? force : !sample;
    const meta = fieldMap.current['limit'];
    if (_sample && meta.value === 0) {
      meta.value = DEFAULT_SAMPLE_SIZE;
      meta.stringValue = `${DEFAULT_SAMPLE_SIZE}`;
      meta.isValid = true;
    }
    setSample(_sample);
  }

  /**
   * set many/all properties of a query at once. The values are converted to
   * strings, and xxxString is set. The values are validated, and xxxValid is
   * set. the properties themselves are only set for valid values.
   *
   * If `query` is null or undefined, set the default options.
   *
   * @param {Object} newQuery   a query object with some or all query properties set.
   * @param {Boolean} autoPopulated_ - flag to indicate whether the query was auto-populated or not.
   */
  function setQuery(newQuery: Query | null, autoPopulated_ = false) {
    if (newQuery === undefined || newQuery === null) {
      newQuery = _getDefaultQuery();
    }

    // convert all query inputs into their string values and validate them
    const inputStrings: Record<QueryKey, string> = {
      filter: stringify(newQuery.filter),
      limit: `${newQuery.limit}`,
    };

    // store all keys for which the values are true
    Keys.forEach((key) => {
      const meta = fieldMap.current[key];
      const validated = validateInput(key, inputStrings[key]) !== false;

      if (validated) {
        meta.stringValue = inputStrings[key];
        meta.isValid = true;
        if (key === 'filter') {
          meta.value = isEmpty(newQuery?.filter) ? {} : { ...newQuery?.filter };
        } else if (key === 'limit') {
          meta.value = newQuery?.limit;
        }
      }
    });

    // determine if query is valid overall with these new values
    const _valid = Keys.every(_isFieldValid);

    setValid(_valid);
  }

  /**
   * Sets `queryString` and `valid`, and if it is a valid input, also set `filter`,
   * `limit`.
   * If it is not a valid query, only set `valid` to `false`.
   *
   * @param {String} label         Which part of the query, e.g. `filter`
   * @param {Object} input   the query string (i.e. manual user input)
   */
  function setQueryString(label: QueryKey, input: string): void {
    let empty: boolean = false;
    if (!input || !input.length) {
      input = '{}';
      empty = true;
    }
    const validatedInput = validateInput(label, input);

    const _valid = validatedInput !== false;
    const meta = fieldMap.current[label];
    switch (label) {
      case 'filter':
        if (_valid) {
          meta.value = JSON.parse(input);
        }
        break;
      case 'limit':
        if (_valid) {
          meta.value = parseInt(input);
        }
        break;
    }

    // if the input was validated, also set the corresponding state variable
    if (_valid) {
      meta.stringValue = input;
      setValid(empty || Keys.every(_isFieldValid));
    } else {
      setValid(_valid);
    }
    setIsEmptyQuery(empty);
  }

  /**
   * dismiss current changes to the query and restore `{}` as the query.
   */
  function reset() {
    const defaultQuery = _getDefaultQuery();
    // if the current query is the same as the default, nothing happens
    if (isEqual(cloneQuery(), defaultQuery)) {
      return;
    }

    // if the last executed query is the default query, we don't need to
    // change lastExecuteQuery and trigger a change in the QueryChangedStore.
    if (isEqual(lastExecutedQuery.current, defaultQuery)) {
      setQuery(null);
      return;
    }

    // otherwise we do need to trigger and let all other
    // components in the app know about the change so they can re-render.
    if (valid) {
      Keys.forEach((k) => {
        const meta = fieldMap.current[k];
        meta.isValid = true;
        meta.value = '';
        meta.stringValue = `${meta.value}`;
      });
      setValid(true);
      lastExecutedQuery.current.filter = DEFAULT_FILTER;
      lastExecutedQuery.current.limit = DEFAULT_LIMIT;
    }
  }

  /**
   * apply the current (valid) query, and store it in `lastExecutedQuery`.
   */
  function apply() {
    if (validateQuery()) {
      setValid(true);
      setQueryState(QueryState.APPLY_STATE);
      Object.assign(lastExecutedQuery.current, cloneQuery());
      if (isFunction(props.onApply)) {
        const filter = lastExecutedQuery.current.filter;
        const filterString = JSON.stringify(filter);
        props.onApply(filterString);
      }
    }
  }

  function onChange(value: string, label: QueryKey) {
    const type = OPTION_DEFINITION[label].type;
    if (['numeric', 'document'].includes(type)) {
      return setQueryString(label, value);
    }
  }

  function toggleExpand(): void {
    setExpanded(!expanded);
  }

  function onResetButtonClicked() {
    const { onReset } = props;
    reset();

    if (isFunction(onReset)) {
      onReset();
    }
  }

  function _queryHasChanges() {
    const toCompare = {
      filter: props.filter,
      limit: props.limit,
    };
    return !isEqual(toCompare, lastExecutedQuery.current);
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
    apply();
  }

  /**
   * renders a single query option, either as its own row, or as part of a
   * option group.
   *
   * @param {String} option       the option name to render
   * @param {Number} id           the option number
   * @param {Boolean} hasToggle   this option contains the expand toggle
   *
   * @return {Component}          the option component
   */
  function Option({
    option,
    id,
    hasToggle,
  }: {
    option: QueryKey;
    id: number;
    hasToggle: boolean;
  }) {
    const { autoPopulated = false } = props;

    const meta = fieldMap.current[option];

    const hasError = !meta.isValid;

    const { placeholder, link, type: inputType } = OPTION_DEFINITION[option];

    // checkbox options use the value directly, text inputs use the
    // `<option>String` prop.
    const value = inputType === 'boolean' ? meta.value : meta.stringValue;

    return (
      <QueryOption
        label={option}
        autoPopulated={autoPopulated}
        hasToggle={hasToggle}
        hasError={hasError}
        key={`query-option-${id}`}
        value={value}
        placeholder={placeholder}
        link={link}
        inputType={inputType}
        onChange={onChange}
        onApplyFilter={apply}
        schemaFields={schemaFields}
      />
    );
  }

  /**
   * renders a group of several query options, that are placed horizontally
   * in the same row.
   *
   * @param {Array} group   The group array, e.g. ['sort', 'limit']
   * @param {Number} id     The group number
   *
   * @returns {Component}   The group component
   */
  function OptionGroup({ group, id }: { group: QueryKey[]; id: number }) {
    return (
      <div
        className={classnames(styles['option-group'])}
        key={`option-group-${id}`}
      >
        {group.map((option, i) => (
          <Option
            option={option}
            id={i}
            hasToggle={false}
            key={`option-group-${i}`}
          />
        ))}
      </div>
    );
  }

  function OptionRow({ row, id }: { row: QueryKey | QueryKey[]; id: number }) {
    // only the first in multi-line options has the toggle
    const hasToggle = id === 0 && showToggle;
    const isGroup = isArray(row);

    return (
      <>
        {isGroup && (
          <OptionGroup
            group={row as QueryKey[]}
            id={id}
            key={'opt-row-' + id}
          />
        )}
        {!isGroup && (
          <Option
            option={row as QueryKey}
            id={id}
            hasToggle={hasToggle}
            key={'option-' + id}
          />
        )}
      </>
    );
  }

  /**
   * renders the rows of the querybar component
   *
   * @return {Fragment} array of components, one for each row.
   */
  function OptionRows() {
    if (!expanded) {
      return <OptionRow row={layout[0]} id={0} />;
    }

    return (
      <>
        {layout.map((row: QueryKey | QueryKey[], id: number) => (
          <OptionRow row={row} id={id} key={'opt-row-' + id} />
        ))}
      </>
    );
  }

  /**
   * Render Query Bar input form (just the input fields and buttons).
   *
   * @returns {React.Component} The Query Bar view.
   */
  function InputForm() {
    const _inputGroupClassName = classnames(styles['input-group'], {
      'has-error': !valid,
    });

    const applyDisabled = !valid;
    const resetDisabled = queryState !== QueryState.APPLY_STATE;

    const _queryOptionClassName = classnames(styles['option-container'], {
      [styles['has-focus']]: hasFocus,
    });

    return (
      <div className={_inputGroupClassName}>
        <div
          onBlur={_onBlur}
          onFocus={_onFocus}
          className={_queryOptionClassName}
        >
          <OptionRows />
          {showToggle && (
            <OptionsToggle expanded={expanded} onToggle={toggleExpand} />
          )}
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

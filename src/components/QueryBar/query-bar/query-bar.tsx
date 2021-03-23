import { EditorRef } from '@/components/QueryBar/option-editor/option-editor';
import { useQueueJobFilters } from '@/hooks/use-queue-job-filters';
import { Ace } from '@/lib/ace';
import { HistoryOutlined } from '@ant-design/icons';
import QueryHistoryDialog from '../query-history/query-history';
import { Button, Col, Row, Space } from 'antd';
import React, {
  useState,
  Fragment,
  useRef,
  RefAttributes,
  ForwardRefExoticComponent,
} from 'react';
import classnames from 'classnames';
import isEqual from 'lodash-es/isEqual';
import {
  useCallbackRef,
  useDisclosure,
  useWhyDidYouUpdate,
} from '../../../hooks';
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

// https://gist.github.com/Venryx/7cff24b17867da305fff12c6f8ef6f96
export type Handle<T> = T extends ForwardRefExoticComponent<
  RefAttributes<infer T2>
>
  ? T2
  : never;

interface QueryBarProps {
  queueId: string;
  defaultFilter?: string;
  autoPopulated?: boolean;
  buttonLabel?: string;
  onReset: () => void;
  onApply: (filter: string) => void;
  onChange?: (value: string) => void;
  schemaFields?: AutocompleteField[];
}

const QueryBar: React.FC<QueryBarProps> = (props) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [queryState, setQueryState] = useState(DEFAULT_STATE);
  const [isValid, setValid] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>(
    props.defaultFilter ?? DEFAULT_FILTER,
  );
  const [isEmptyQuery, setIsEmptyQuery] = useState(true);
  const [editor, setEditor] = useState<Ace.Editor>();
  let editorRef: EditorRef;

  const {
    isOpen: isHistoryDialogOpen,
    onClose: closeHistoryDialog,
    onToggle: toggleHistoryDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  useWhyDidYouUpdate('QueryBar', props);

  const { schemaFields = [], buttonLabel = DEFAULT_BUTTON_LABEL } = props;

  const { addQueryToHistory } = useQueueJobFilters(props.queueId);

  /**
   * returns true if all components of the query are not false.
   * (note: they can return a value 0, which should not be interpreted as
   * false here.)
   *
   * @return {Boolean}  if the full query is valid.
   */
  function validateQuery(val?: string) {
    return isFilterValid(val ?? filter);
  }

  /**
   * Sets `queryString` and `valid`, and if it is a valid input
   * If it is not a valid query, only set `valid` to `false`.
   * @param {String} input   the query string (i.e. manual user input)
   */
  function setQueryString(input: string): void {
    const toValidate = (input ?? '').trim();
    setIsEmptyQuery(toValidate.length === 0);
    if (isValid) {
      setFilter(input);
    }
    setHasError(!isValid && !isEmptyQuery);
    props.onChange?.(input);
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
    }
  }

  /**
   * apply the current (valid) query, and store it in `lastExecutedQuery`.
   */
  const applyFilter = useCallbackRef(() => {
    if (validateQuery()) {
      setValid(true);
      setQueryState(QueryState.APPLY_STATE);
      setLastExecutedQuery(filter);
      if (!isEmptyQuery) {
        addQueryToHistory(filter);
      }
      props.onApply?.(filter);
    } else {
      setValid(false);
    }
  });

  function handleApply(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // No evt when pressing enter from ACE.
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    applyFilter();
  }

  const onChange = useCallbackRef((value: string, isValid: boolean) => {
    setValid(isValid);
    setQueryString(value);
  });

  function onResetButtonClicked() {
    const { onReset } = props;
    editorRef.reset();
    reset();
    onReset?.();
  }

  function _onFocus() {
    setHasFocus(true);
  }

  function _onBlur() {
    setHasFocus(false);
  }

  function onFilterApply() {}

  function onFilterSelected({ expression }: { expression: string }) {
    editorRef?.setValue(expression);
    setQueryString(expression);
    closeHistoryDialog();
  }

  const onEditorMounted = useCallbackRef((editor: Ace.Editor) => {
    setEditor(editor);
  });

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
      // [styles['has-focus']]: hasFocus,
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
          <InputForm />
        </div>
      </div>
    );
  }

  const applyDisabled = !isValid || isEmptyQuery;
  const resetDisabled = queryState !== QueryState.APPLY_STATE;
  return (
    <Fragment>
      <div className={classnames(styles.component)} key="filter-level">
        <div
          className={classnames(styles['input-container'])}
          key="filter-level-1"
        >
          <Row>
            <Col flex="auto">
              <OptionEditor
                key="filter-editor-3"
                height="50px"
                width="98%"
                defaultValue={props.defaultFilter}
                onChange={onChange}
                onApply={applyFilter}
                autoPopulated={true}
                schemaFields={schemaFields}
                onMounted={onEditorMounted}
                ref={(r: Handle<typeof OptionEditor>) => {
                  editorRef = r;
                }}
              />
            </Col>

            <Col flex="none">
              <Space align="center">
                <Button
                  type="primary"
                  size="small"
                  id="query-bar-apply-filter-button"
                  key="filter-apply-button"
                  onClick={handleApply}
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
                <Button
                  size="small"
                  id="query-bar-extra-button"
                  key="filter-extra-button"
                  onClick={toggleHistoryDialog}
                  icon={<HistoryOutlined />}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </div>
      {isHistoryDialogOpen && (
        <QueryHistoryDialog
          queueId={props.queueId}
          isOpen={isHistoryDialogOpen}
          onClose={closeHistoryDialog}
          onFilterClick={onFilterSelected}
        />
      )}
    </Fragment>
  );
};

export default QueryBar;
export { QueryBar };

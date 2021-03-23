import { TypingResult } from '@/components/QueryBar/query-autocompleter/types';
import { useUpdateEffect } from '@/hooks';
import cn from 'classnames';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import overEvery from 'lodash-es/overEvery';
import React, { useCallback, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import HttpService from '../../../../../http/HttpService';
import ValidationLabels from '../../../../modals/ValidationLabels';
import ExpressionSuggester from './ExpressionSuggester';
import Position = AceAjax.Position;
import AceEditor, { getAceInstance } from '@/lib/ace';
import TokenIterator = AceAjax.TokenIterator;

//to reconsider
// - respect categories for global variables?
// - maybe ESC should be allowed to hide suggestions but leave modal open?

let inputExprIdCounter = 0;

const identifierRegexpsWithoutDot = [/[#a-zA-Z0-9-_]/];
const identifierRegexpsIncludingDot = [/[#a-zA-Z0-9-_.]/];

const humanReadableType = (typingResult: TypingResult): string =>
  typingResult?.display;

function isSpelTokenAllowed(iterator: TokenIterator, modeId: string): boolean {
  if (modeId === 'ace/mode/javascript') {
    const token = iterator.getCurrentToken();
    return token?.type !== 'string';
  }
  return true;
}

interface ExpressionSuggestProps {
  inputProps: Record<string, any>;
  processingType?: string;
  variableTypes?: Record<string, TypingResult>;
  isMarked?: boolean;
  validationLabelInfo?: string;
  showValidation?: string;
  dataResolved?: boolean;
  onChange?: (value: string) => void;
}

const ExpressionSuggest: React.FC<ExpressionSuggestProps> = (props) => {
  inputExprIdCounter += 1;
  const { isMarked, showValidation, inputProps } = props;
  const [value, setValue] = useState<string>();
  const [editorFocused, setEditorFocused] = useState<boolean>();
  const [id, setId] = useState(`inputExpr${inputExprIdCounter}`);
  const expressionSuggester = React.useRef(createExpressionSuggester());

  function createExpressionSuggester() {
    return new ExpressionSuggester(
      props.typesInformation,
      props.variableTypes,
      props.processingType,
      HttpService,
    );
  }

  useUpdateEffect(() => {
    props.onChange?.(value ?? '');
  }, [value]);

  const customAceEditorCompleter = {
    isTokenAllowed: overEvery([isSpelTokenAllowed]),
    getCompletions: (
      editor: any,
      session: any,
      caretPosition2d: Position,
      prefix: string,
      callback: Function,
    ) => {
      const completer = customAceEditorCompleter;
      const iterator = new TokenIterator(
        session,
        caretPosition2d.row,
        caretPosition2d.column,
      );
      if (!completer.isTokenAllowed(iterator, session.$modeId)) {
        callback();
      }

      expressionSuggester.current
        .suggestionsFor(value ?? '', caretPosition2d)
        .then((suggestions) => {
          // This trick enforce autocompletion to invoke getCompletions even if some result found before - in case if list of suggestions will change during typing
          editor.completer.activated = false;
          // We have dot in identifier pattern to enable live autocompletion after dots, but also we remove it from pattern just before callback, because
          // otherwise our results lists will be filtered out (because entries not matches '#full.property.path' but only 'path')
          completer.identifierRegexps = identifierRegexpsWithoutDot;
          try {
            callback(
              null,
              map(suggestions, (s) => {
                const methodName = s.methodName;
                const returnType = humanReadableType(s.refClazz);
                return {
                  name: methodName,
                  value: methodName,
                  score: 1,
                  meta: returnType,
                  description: s.description,
                  parameters: s.parameters,
                  returnType: returnType,
                };
              }),
            );
          } finally {
            completer.identifierRegexps = identifierRegexpsIncludingDot;
          }
        });
    },
    // We adds hash to identifier pattern to start suggestions just after hash is typed
    identifierRegexps: identifierRegexpsIncludingDot,
    getDocTooltip: (item) => {
      if (item.description || !isEmpty(item.parameters)) {
        const paramsSignature = item.parameters
          .map((p) => `${humanReadableType(p.refClazz)} ${p.name}`)
          .join(', ');
        const javaStyleSignature = `${item.returnType} ${item.name}(${paramsSignature})`;
        item.docHTML = ReactDOMServer.renderToStaticMarkup(
          <div className="function-docs">
            <b>{javaStyleSignature}</b>
            <hr />
            <p>{item.description}</p>
          </div>,
        );
      }
    },
  };

  const focus = useCallback(() => setEditorFocused(true), []);
  const unfocus = useCallback(() => setEditorFocused(false), []);

  return (
    <React.Fragment>
      <div
        className={cn([
          'row-ace-editor',
          showValidation &&
            !allValid(validators, [value]) &&
            'node-input-with-error',
          isMarked && 'marked',
          editorFocused && 'focused',
          inputProps.readOnly && 'read-only',
        ])}
      >
        <AceEditor
          value={value}
          onChange={setValue}
          onFocus={focus}
          onBlur={unfocus}
          options={inputProps}
          customAceEditorCompleter={customAceEditorCompleter}
        />
      </div>
      {showValidation && (
        <ValidationLabels
          validators={validators}
          values={[value]}
          validationLabelInfo={this.props.validationLabelInfo}
        />
      )}
    </React.Fragment>
  );
};

export default ExpressionSuggest;

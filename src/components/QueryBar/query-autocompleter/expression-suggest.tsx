import { Ace } from 'ace-builds';
import {
  TypingResult,
  TypedSuggestion,
  Variables,
  VariableDict,
} from './types';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ExpressionSuggester from './expression-suggester';
import Position = AceAjax.Position;

// to reconsider
// - respect categories for global variables?
// - maybe ESC should be allowed to hide suggestions but leave modal open?

const identifierRegexpsWithoutDot = [/[#a-zA-Z0-9-_]/];
const identifierRegexpsIncludingDot = [/[#a-zA-Z0-9-_.]/];

const humanReadableType = (typingResult: TypingResult | undefined): string =>
  typingResult?.display ?? '';

export function createExpressionSuggester(variableTypes?: VariableDict) {
  variableTypes = variableTypes || Variables;
  const suggester = new ExpressionSuggester(variableTypes);

  const customAceEditorCompleter = {
    getCompletions: (
      editor: any,
      session: Ace.EditSession,
      caretPosition2d: Position,
      prefix: string,
      callback: Ace.CompleterCallback,
    ) => {
      const completer = customAceEditorCompleter;

      suggester
        .suggestionsFor(prefix ?? '', caretPosition2d)
        .then((suggestions: TypedSuggestion[]) => {
          // This trick enforce autocompletion to invoke getCompletions even if some result found before - in case if list of suggestions will change during typing
          editor.completer.activated = false;
          // We have dot in identifier pattern to enable live autocompletion after dots, but also we remove it from pattern just before callback, because
          // otherwise our results lists will be filtered out (because entries not matches '#full.property.path' but only 'path')
          completer.identifierRegexps = identifierRegexpsWithoutDot;
          try {
            callback(
              null,
              suggestions.map((s) => {
                const name = s.name;
                const returnType = humanReadableType(s.refClazz);
                const params = s.params || [];
                return {
                  name,
                  value: name,
                  score: 1,
                  meta: returnType,
                  description: s.description,
                  params,
                  returnType,
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
    getDocTooltip: (item: Ace.Completion) => {
      const temp = item as any;
      if (
        temp.description ||
        (Array.isArray(temp.params) && temp.params.length)
      ) {
        const paramsSignature = temp.params
          .map((p: any) => `${humanReadableType(p.refClazz)} ${p.name}`)
          .join(', ');
        const signature = `${item.name}(${paramsSignature}): ${temp.returnType}`;
        temp.docHTML = ReactDOMServer.renderToStaticMarkup(
          <div className="function-docs">
            <b>{signature}</b>
            <hr />
            <p>{temp.description}</p>
          </div>,
        );
      }
    },
  };

  return customAceEditorCompleter;
}

export default createExpressionSuggester;

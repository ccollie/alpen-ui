import { keymap, highlightSpecialChars, drawSelection } from '@codemirror/view';
import { EditorState, Prec } from '@codemirror/state';
import { indentOnInput } from '@codemirror/language';
import { defaultKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { history, historyKeymap } from '@codemirror/history';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { commentKeymap } from '@codemirror/comment';
import { lintKeymap } from '@codemirror/lint';

export default [
  highlightSpecialChars(),
  history(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  Prec.fallback(defaultHighlightStyle),
  highlightSelectionMatches(),
  drawSelection(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...commentKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
];

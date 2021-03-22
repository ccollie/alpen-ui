import React, { useState, useEffect } from 'react';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { highlightActiveLine, EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/gutter';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import baseSetup from './codemirror-setup';

const DEFAULT_HEIGHT = '45px';
const DEFAULT_WIDTH = '100%';

export interface TextChangeEvent {
  value: string;
  cursor: number;
  history?: Record<string, any>;
}

export interface EditorFunctions {
  getCursor: () => number;
  setCursor: (pos: number) => void;
  getSelection: () => string;
  getValue: () => string;
  setValue: (value: string) => void;
  replaceSelection: (selection: string) => void;
  somethingSelected: () => void;
  getLine: (pos: number) => string;
  focus: () => void;
}

export interface EditorConfigOptions {
  lineWrapping?: boolean;
  lineHighlight?: boolean;
  lineNumbers?: boolean;
  language: 'javascript' | 'json' | 'markdown';
}

type CMEditorProps = {
  autoFocus?: boolean;
  height?: string | number;
  width?: string | number;
  name?: string;
  value?: string;
  theme?: 'dark' | 'light';
  onTextChange?: (event: TextChangeEvent) => void;
  onInit?: (editor: EditorFunctions) => void;
  config?: EditorConfigOptions;
};

const Index: React.FC<CMEditorProps> = (props) => {
  const {
    value = '',
    height = DEFAULT_HEIGHT,
    width = DEFAULT_WIDTH,
    config = {
      language: 'markdown',
      lineNumbers: false,
      lineWrapping: true,
    },
    theme = 'light',
    name = 'code-editor',
  } = props;
  const textareaNode = React.useRef<HTMLTextAreaElement | null>(null);
  const editorView = React.useRef<EditorView>();
  const editorFunctions = React.useRef<EditorFunctions>();
  const [edState, setEditorState] = useState<EditorState>();
  const [currentCursor, setCurrentCursor] = useState(0);
  const [initFinished, setInitFinished] = useState(false);
  const [editorValue, setEditorValue] = useState<string>(props.value ?? '');

  function setValue(text: string) {
    //
    // Since we are setting a whole new document, create new editor
    // states and views.
    //
    if (initFinished) {
      CreateEditorState(text);
    }
  }

  function handleFocusChanged() {
    if (edState) {
    }
  }

  function CreateEditorState(text: string) {
    //
    // Clear out the div element in case a previous editor was
    // created.
    //
    if (textareaNode.current) {
      textareaNode.current.innerHTML = '';
    }
    //
    // Setup the extensions array.
    //
    const exts = [
      ...baseSetup,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          props.onTextChange?.({
            value: getValue(),
            cursor: getCursor(),
            history: {},
          });
        } else if (update.focusChanged) {
          handleFocusChanged();
        } else if (update.selectionSet) {
        }
      }),
    ];

    if (theme === 'dark') {
      exts.push(oneDark);
    }
    //
    // Add extensions based on the configuration.
    //
    if (config.lineNumbers) {
      exts.push(lineNumbers());
    }
    switch (config.language) {
      case 'markdown':
        exts.push(markdown());
        break;
      case 'javascript':
        exts.push(javascript());
        break;
      case 'json':
        exts.push(json());
        break;
      default:
        exts.push(markdown());
        break;
    }
    if (config.lineWrapping) {
      exts.push(EditorView.lineWrapping);
    }
    if (config.lineHighlight) {
      exts.push(highlightActiveLine());
    }

    //
    // Create the editor state.
    //
    setEditorState(
      EditorState.create({
        doc: text,
        extensions: exts,
      }),
    );

    //
    // Create the editor View.
    //
    editorView.current = new EditorView({
      state: edState,
      parent: textareaNode.current as HTMLElement,
    });

    setInitFinished(true);
  }

  useEffect(() => {
    //
    // Create the editor.
    //
    CreateEditorState(value);
    //
    // Create the editor functions object.
    //
    editorFunctions.current = {
      getSelection,
      getValue,
      replaceSelection,
      somethingSelected,
      setCursor,
      getCursor,
      setValue,
      getLine,
      focus,
    };

    //
    // Give the parent the functions for interacting with the editor.
    //
    props?.onInit?.(editorFunctions.current);
    //
    // Make sure the editor is focused.
    //
    focus();
    //
    // Return a function to run to clean up after mounting.
    //
    return () => {
      // this function runs when the
      // component is destroyed
      editorView.current?.destroy();
      setEditorState(undefined);
      setInitFinished(false);
    };
  });

  useEffect(() => {
    const textArea = textareaNode.current;
    if (textArea) {
      textArea.innerText = value + '';
    }
  }, [value]);

  function getLine(pos: number) {
    if (typeof editorView !== 'undefined') {
      const result = '';
      return result;
    }
    return '';
  }

  function getSelection(): string {
    if (typeof edState !== 'undefined') {
      const selection = edState.selection;
      return edState.sliceDoc(selection.main.from, selection.main.to);
    }
    return '';
  }

  function replaceSelection(newText: string) {
    if (typeof edState !== 'undefined') {
      const transaction = edState.update({
        changes: [
          {
            from: edState.selection.main.from,
            to: edState.selection.main.to,
          },
          { from: 0, insert: newText },
        ],
      });
      editorView.current?.dispatch(transaction);
    }
  }

  function somethingSelected() {
    return edState?.selection.ranges.some((r) => !r.empty);
  }

  function setCursor(pos: number) {
    if (typeof editorView !== 'undefined') {
      setCurrentCursor(pos);
      editorView.current?.dispatch({ selection: { anchor: currentCursor } });
    }
  }
  function getCursor() {
    if (typeof edState !== 'undefined') {
      setCurrentCursor(edState?.selection.main.head);
      return currentCursor;
    } else {
      return 0;
    }
  }

  function getValue() {
    return edState?.doc.toString() ?? '';
  }

  function focus() {
    editorView.current?.focus();
  }

  return (
    <div className="wrapper" style={{ height: height, width: width }}>
      <textarea
        className="CMEditor"
        ref={textareaNode}
        name={name}
        defaultValue={value}
        autoComplete="off"
        autoFocus={!!props.autoFocus}
      />
    </div>
  );
};

export default Index;

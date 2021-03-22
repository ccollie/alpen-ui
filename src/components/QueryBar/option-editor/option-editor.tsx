import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';
import { useDebounceEffect, useWhyDidYouUpdate } from '../../../hooks';
import { parseExpression } from '../../../query-parser';
import { AutocompleteField, createCompleter } from '../query-autocompleter';
import styles from './option-editor.module.css';

const ace = getAceInstance();
const tools = ace.require('ace/ext/language_tools');

/**
 * Options for the ACE editor.
 */
const OPTIONS = {
  enableLiveAutocompletion: true,
  tabSize: 2,
  useSoftTabs: true,
  fontSize: 11,
  minLines: 1,
  maxLines: 10,
  highlightActiveLine: false,
  showPrintMargin: false,
  behavioursEnabled: true,
  showGutter: false,
  useWorker: false,
};

interface OptionEditorProps {
  label?: string;
  autoPopulated: boolean;
  value?: string;
  onChange: (value: string, isValid: boolean) => void;
  onApply: () => void;
  schemaFields?: AutocompleteField[];
  onMounted?: (editor: Ace.Editor) => void;
}

type EditorRef = {
  focus: () => void;
};

const OptionEditor: React.FC<OptionEditorProps> = forwardRef<
  EditorRef,
  OptionEditorProps
>((props, ref) => {
  const { schemaFields = [], value = '', label = 'filter' } = props;
  const [completer] = useState(() => createCompleter(schemaFields));
  const [edited, setEdited] = useState<string>(value);
  const [isValid, setValid] = useState<boolean>(true);
  const _editor = useRef<Ace.Editor>();

  useWhyDidYouUpdate('OptionEditor', props);

  function focusEditor() {
    _editor?.current?.focus();
  }

  useImperativeHandle(ref, () => ({
    focus() {
      focusEditor();
    },
  }));

  useEffect(() => {
    validateExpression(value);
  }, [value]);

  useDebounceEffect(
    () => {
      const trimmed = (edited ?? '').trim();
      if (trimmed.length) {
        validateExpression(trimmed);
      }
      props?.onChange(edited, isValid);
      // focusEditor();
    },
    [edited],
    { wait: 150 },
  );

  function handleApply() {
    props?.onApply();
  }

  function validateExpression(expr: string) {
    expr = (expr ?? '').trim();
    if (!expr.length) {
      setValid(true);
      return;
    }
    try {
      parseExpression(expr);
      setValid(true);
    } catch (e) {
      console.log(e);
      setValid(false);
    }
  }

  function onChangeQuery(newCode: string) {
    setEdited(newCode);
    const trimmed = (newCode ?? '').trim();
  }

  function onEditorLoaded(opts: Ace.Editor) {
    _editor.current = opts;
  }

  function onFocus() {
    tools.setCompleters([completer]);
  }

  const commands = [
    {
      name: 'executeQuery',
      bindKey: {
        win: 'Enter',
        mac: 'Enter',
      },
      exec: handleApply,
    },
  ];

  return (
    <AceEditor
      className={styles['option-editor']}
      mode="javascript"
      theme="xcode"
      width="80%"
      value={edited}
      onChange={onChangeQuery}
      editorProps={{ $blockScrolling: Infinity }}
      name={`query-bar-option-input-${label}`}
      key={`query-bar-option-editor-${label}`}
      setOptions={OPTIONS}
      onFocus={onFocus}
      onLoad={onEditorLoaded}
    />
  );
});

export default OptionEditor;

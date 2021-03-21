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
import {
  useDebounceFn,
  useUnmountEffect,
  useWhyDidYouUpdate,
} from '../../../hooks';
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
  label: string;
  autoPopulated: boolean;
  value?: string;
  onChange: (value: string, label: string) => void;
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
  const { schemaFields = [], value = '', label = '' } = props;
  const [completer] = useState(() => createCompleter(schemaFields));
  const [edited, setEdited] = useState<string>(value);
  const [isValid, setValid] = useState<boolean>(validateExpression(value));
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

  const { run: handleChange, cancel } = useDebounceFn(
    () => {
      const trimmed = (edited ?? '').trim();
      if (trimmed.length) {
        validateExpression(trimmed);
      }
      props?.onChange(edited, label);
      focusEditor();
    },
    { wait: 150 },
  );

  useUnmountEffect(cancel);

  function handleApply() {
    props?.onApply();
  }

  function validateExpression(expr: string) {
    expr = (expr ?? '').trim();
    if (!expr.length) return true;
    try {
      parseExpression(expr);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  function onChangeQuery(newCode: string) {
    setEdited(newCode);
    const trimmed = (newCode ?? '').trim();
    if (trimmed.length) {
    }
    handleChange();
    // props?.onChange(newCode, label);
    // focusEditor(); // HACK!!!
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
      setOptions={OPTIONS}
      onFocus={onFocus}
      onLoad={onEditorLoaded}
    />
  );
});

export default OptionEditor;

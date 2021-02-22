import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'mongodb-ace-mode';
import 'mongodb-ace-theme-query';
import { AutocompleteField, createCompleter } from '../query-autocompleter';
import { Ace } from 'ace-builds';
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
}

const OptionEditor: React.FC<OptionEditorProps> = (props) => {
  const { schemaFields = [], value = '', label = '' } = props;
  const [completer] = useState(() => createCompleter(schemaFields));
  const [edited, setEdited] = useState<string>(value);
  const _editor = useRef<Ace.Editor>();

  function handleApply() {
    props?.onApply();
  }

  function onChangeQuery(newCode: string) {
    setEdited(newCode);
    props?.onChange(newCode, label);
  }

  function onEditorLoaded(opts: Ace.Editor) {
    _editor.current = opts;
  }

  function onFocus() {
    tools.setCompleters([completer]);
  }

  useEffect(() => {
    if (_editor.current) {
      _editor.current.setValue(value);
      _editor.current.clearSelection();
    }
  }, [value, _editor.current]);

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
      mode="mongodb"
      theme="mongodb-query"
      width="80%"
      value={value}
      onChange={onChangeQuery}
      editorProps={{ $blockScrolling: Infinity }}
      commands={commands}
      name={`query-bar-option-input-${label}`}
      setOptions={OPTIONS}
      onFocus={onFocus}
      onLoad={onEditorLoaded}
    />
  );
};

export default OptionEditor;

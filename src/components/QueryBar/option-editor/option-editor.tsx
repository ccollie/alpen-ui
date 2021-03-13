import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-xcode';
import { useWhyDidYouUpdate } from '../../../hooks/use-why-update';
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
}

const OptionEditor: React.FC<OptionEditorProps> = forwardRef((props, ref) => {
  const { schemaFields = [], value = '', label = '' } = props;
  const [completer] = useState(() => createCompleter(schemaFields));
  const [edited, setEdited] = useState<string>(value);
  const _editor = useRef<Ace.Editor>();

  useWhyDidYouUpdate('OptionEditor', props);

  useImperativeHandle(ref, () => ({
    focus() {
      _editor?.current?.focus();
    },
  }));

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
      commands={commands}
      name={`query-bar-option-input-${label}`}
      setOptions={OPTIONS}
      onFocus={onFocus}
      onLoad={onEditorLoaded}
      debounceChangePeriod={150}
    />
  );
});

export default OptionEditor;

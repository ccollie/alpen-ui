import { createExpressionSuggester } from '../query-autocompleter/expression-suggest';
import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import AceEditor, { getTools, Ace, getThemeName } from '@/lib/ace';
import { useUpdateEffect, useWhyDidYouUpdate } from '@/hooks';
import { parseExpression } from '@/query-parser';
import styles from './option-editor.module.css';

const tools = getTools();

/**
 * Options for the ACE editor.
 */
const OPTIONS = {
  enableLiveAutocompletion: true,
  tabSize: 2,
  useSoftTabs: true,
  fontSize: 12,
  minLines: 2,
  maxLines: 10,
  highlightActiveLine: false,
  showPrintMargin: false,
  behavioursEnabled: true,
  showGutter: false,
  useWorker: false,
};

export interface EditorRef {
  getEditor: () => Ace.Editor | undefined;
  focus: () => void;
  setValue: (value: string) => void;
  reset: () => void;
}

interface OptionEditorProps {
  label?: string;
  autoPopulated: boolean;
  value?: string;
  defaultValue?: string;
  height?: string;
  width?: string;
  theme?: 'light' | 'dark';
  onChange: (value: string, isValid: boolean) => void;
  onApply?: () => void;
  onMounted?: (editor: Ace.Editor) => void;
}

const OptionEditor: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<OptionEditorProps> & React.RefAttributes<EditorRef>
> = forwardRef<EditorRef, OptionEditorProps>((props, ref) => {
  const {
    height = '45px',
    width = '100%',
    value,
    defaultValue,
    label = 'filter',
  } = props;
  const [completer] = useState(() => createExpressionSuggester());
  const [edited, setEdited] = useState<string | undefined>(
    value ?? defaultValue,
  );
  const [isValid, setValid] = useState<boolean>(true);
  const theme = getThemeName(props.theme);
  const _editor = useRef<Ace.Editor>();

  useWhyDidYouUpdate('OptionEditor', props);

  function focusEditor() {
    _editor?.current?.focus();
  }

  useImperativeHandle(ref, () => ({
    getEditor(): Ace.Editor | undefined {
      return _editor.current;
    },
    setValue(value: string): void {
      setEdited(value);
    },
    reset() {
      setEdited('');
    },
    focus() {
      focusEditor();
    },
  }));

  useEffect(() => {
    validateExpression(edited);
  }, [edited]);

  useUpdateEffect(() => {
    props?.onChange(edited ?? '', isValid);
  }, [edited]);

  function handleApply() {
    props.onApply?.();
  }

  function validateExpression(expr: string | undefined) {
    expr = (expr ?? '').trim();
    if (!expr.length) {
      setValid(true);
      return;
    }
    try {
      parseExpression(expr);
      setValid(true);
    } catch (e) {
      //console.log(e);
      setValid(false);
    }
  }

  function onChangeQuery(newCode: string) {
    setEdited(newCode);
    const trimmed = (newCode ?? '').trim();
  }

  function onEditorLoaded(opts: Ace.Editor) {
    _editor.current = opts;
    props.onMounted?.(opts);
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
      theme={theme}
      width={width}
      height={height}
      value={edited}
      defaultValue={defaultValue}
      onChange={onChangeQuery}
      commands={commands}
      editorProps={{ $blockScrolling: Infinity }}
      name={`query-bar-option-input-${label}`}
      key={`query-bar-option-editor-${label}`}
      setOptions={OPTIONS}
      onFocus={onFocus}
      onLoad={onEditorLoaded}
      debounceChangePeriod={120}
    />
  );
});

export default OptionEditor;

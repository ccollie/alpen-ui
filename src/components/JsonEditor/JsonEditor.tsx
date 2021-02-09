import { Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import AceEditor, { IMarker } from 'react-ace';
import { useWhyDidYouUpdate } from '../../hooks/use-why-update';
import { randomId } from '../../lib';
import { validate, validateSchema } from '../../lib/ajv';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const ace = require('ace-builds/src-min-noconflict/ace');
ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.6/src-noconflict/',
);
ace.config.setModuleUrl(
  'ace/mode/json_worker',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.6/src-noconflict/worker-json.js',
);

type JsonEditorProps = {
  id?: string;
  readOnly?: boolean;
  value: string | Record<string, any>;
  onChange?: (newValue: Record<string, any> | null) => void;
  theme?: string;
  schema?: Record<string, any> | undefined | null;
  [key: string]: any;
};

const defaultProps: JsonEditorProps = {
  value: '',
  theme: 'monokai',
  readOnly: false,
  id: randomId(),
};

export const JsonEditor: React.FC<JsonEditorProps> = (props) => {
  const _props = Object.assign({}, defaultProps, props);
  const { schema, theme, value, onChange, id } = _props;
  let { readOnly = false } = _props;
  const [hasSchema, setHasSchema] = useState(false);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [json, setJson] = useState<string>();

  // function createMarker(err: IOutputError): IMarker {
  //   const { start, end } = err;
  //   return {
  //     startRow: start.line,
  //     startCol: start.column,
  //     endRow: end?.line || err.start.line,
  //     endCol: end?.column || 2000,
  //     className: 'error_marker',
  //     type: 'text'
  //   };
  // }
  useWhyDidYouUpdate('jsonEditor', props);

  function handleChange(value: string) {
    let result: Record<string, any> | null = null;
    setMarkers([]);
    if (value && value.length) {
      try {
        result = JSON.parse(value);
        if (hasSchema) {
          const { valid, errors: _errors } = validate(
            schema as Record<string, any>,
            result,
          );
          if (!valid) {
            const errs: string[] = _errors.map(
              (err: { error: any }) => err.error,
            );
            setErrors(errs);
            // setMarkers(_errors.map(createMarker))
          }
        }
      } catch {
        setErrors(['Error parsing result as JSON']);
      }
    }
    onChange && onChange(result);
    setJson(value);
  }

  useEffect(() => {
    let _json: string;

    if (!value) {
      _json = '';
    } else if (typeof value === 'string') {
      _json = value;
    } else {
      _json = JSON.stringify(value, null, 2);
    }
    setJson(_json);
  }, [value]);

  if (schema && Object.values(schema).length > 0) {
    try {
      validateSchema(schema);
      setHasSchema(true);
    } catch {
      readOnly = true;
      console.log('[JsonEditor] invalid schema %O', schema);
      return null;
    }
  }

  return (
    <>
      <AceEditor
        mode="json"
        {...props}
        value={json}
        theme={theme}
        onChange={handleChange}
        name={id}
        readOnly={readOnly}
        debounceChangePeriod={380}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
        }}
        markers={markers}
      />
      {errors && errors.length && (
        <div>
          {errors.map((err) => (
            <Alert message={err} type="error" />
          ))}
        </div>
      )}
    </>
  );
};

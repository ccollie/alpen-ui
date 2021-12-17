// todo: dynamic import
import AceEditor, { IMarker } from 'react-ace';
import { Ace } from 'ace-builds';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/worker-json.js';

const getTools = () => {
  const ace = getAceInstance();
  return ace.require('ace/ext/language_tools');
};

function getThemeName(theme: 'dark' | 'light' = 'light'): string {
  return theme === 'dark' ? 'monokai' : 'xcode';
}
export { getAceInstance, getTools, Ace, getThemeName };
export default AceEditor;

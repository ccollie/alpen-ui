import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import diff from 'react-syntax-highlighter/dist/esm/languages/hljs/diff';
import darcula from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';
import { stacktraceJS } from './languages/stack-trace';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('diff', diff);
SyntaxHighlighter.registerLanguage('stacktrace', stacktraceJS);

type HighlighterProps = {
  language?: 'js' | 'json' | 'diff' | 'stacktrace';
  style?: any;
  [key: string]: any;
};

const Highlight: React.FC<HighlighterProps> = (props) => {
  const { language = 'json', style = darcula, ...rest } = props;

  return <SyntaxHighlighter language={language} style={style} {...rest} />;
};

export default Highlight;

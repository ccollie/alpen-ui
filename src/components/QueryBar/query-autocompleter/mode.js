/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define(function (require, exports, module) {
  const oop = require('../lib/oop');
  const DocCommentHighlightRules =
    require('./doc_comment_highlight_rules').DocCommentHighlightRules;
  const TextHighlightRules =
    require('./text_highlight_rules').TextHighlightRules;

  // TODO: Unicode escape sequences
  const identifierRe = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*';

  const ExpressionHighlightRules = function (options) {
    // see: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
    const keywordMapper = this.createKeywordMapper(
      {
        'variable.language':
          'Date|' + // Constructors
          'Error|RangeError|' + // Errors
          'decodeURI|encodeURI|isFinite|' + // Non-constructor functions
          'isNaN|parseFloat|parseInt|' +
          'JSON|Math|Date|' + // Other
          'this|', // Pseudo
        keyword: 'in|instanceof|typeof|escape|unescape',
        'storage.type': 'var|function',
        'constant.language': 'null|Infinity|NaN|undefined',
        'constant.language.boolean': 'true|false',
      },
      'identifier',
    );

    // keywords which can be followed by regular expressions
    const kwBeforeRe = 'in|instanceof|typeof';

    const escapedRe =
      '\\\\(?:x[0-9a-fA-F]{2}|' + // hex
      'u[0-9a-fA-F]{4}|' + // unicode
      'u{[0-9a-fA-F]{1,6}}|' + // es6 unicode
      '[0-2][0-7]{0,2}|' + // oct
      '3[0-7][0-7]?|' + // oct
      '[4-7][0-7]?|' + //oct
      '.)';
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
      no_regex: [
        DocCommentHighlightRules.getStartRule('doc-start'),
        comments('no_regex'),
        {
          token: 'string',
          regex: "'(?=.)",
          next: 'qstring',
        },
        {
          token: 'string',
          regex: '"(?=.)',
          next: 'qqstring',
        },
        {
          token: 'constant.numeric', // hexadecimal, octal and binary
          regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/,
        },
        {
          token: 'constant.numeric', // decimal integers and floats
          regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/,
        },
        {
          // Sound.prototype.play =
          token: [
            'storage.type',
            'punctuation.operator',
            'support.function',
            'punctuation.operator',
            'entity.name.function',
            'text',
            'keyword.operator',
          ],
          regex:
            '(' +
            identifierRe +
            ')(\\.)(prototype)(\\.)(' +
            identifierRe +
            ')(\\s*)(=)',
          next: 'function_arguments',
        },
        {
          // function myFunc(arg) { }
          token: [
            'storage.type',
            'text',
            'entity.name.function',
            'text',
            'paren.lparen',
          ],
          regex: '(function)(\\s+)(' + identifierRe + ')(\\s*)(\\()',
          next: 'function_arguments',
        },
        {
          token: 'keyword',
          regex: '(?:' + kwBeforeRe + ')\\b',
          next: 'start',
        },
        {
          token: ['support.constant'],
          regex: /that\b/,
        },
        {
          token: keywordMapper,
          regex: identifierRe,
        },
        {
          token: 'punctuation.operator',
          regex: /[.](?![.])/,
          next: 'property',
        },
        {
          token: 'storage.type',
          regex: /=>/,
          next: 'start',
        },
        {
          token: 'keyword.operator',
          regex:
            /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
          next: 'start',
        },
        {
          token: 'punctuation.operator',
          regex: /[?:,;.]/,
          next: 'start',
        },
        {
          token: 'paren.lparen',
          regex: /[\[({]/,
          next: 'start',
        },
        {
          token: 'paren.rparen',
          regex: /[\])}]/,
        },
        {
          token: 'comment',
          regex: /^#!.*$/,
        },
      ],
      property: [
        {
          token: 'text',
          regex: '\\s+',
        },
        {
          token: 'punctuation.operator',
          regex: /[.](?![.])/,
        },
        {
          token: 'support.function',
          regex:
            /(s(pli(?:ce|t)|qrt|lice)|c(?:har(?:CodeAt|At)|eil)|t(?:o(?:GMTString|String|U(?:TCString|pperCase)|LowerCase)|an)|i(?:s(?:NaN|Finite)|ndexOf)|u(?:n(?:shift|escape))|join|p(?:o(?:p|w)|ush|arse(?:Int|Float|Date)?)|e(?:scape|xp)|valueOf|UTC|f(?:i(?:nd|xed)|loor|romCharCode)|watch|lastIndexOf)|a(?:sin|cos|t(?:an(?:2)?)|r(?:ound|everse)|andom)|g(?:et(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear))|m(?:in|a(?:tch|x))\b(?=\()/,
        },
        {
          token: 'support.constant',
          regex:
            /(M(?:IN_VALUE|AX_VALUE)|SQRT(?:1_2|2)|i|NEGATIVE_INFINITY|u(?:n(?:iqueID|defined))|URLUnencoded|P(?:I|OSITIVE_INFINITY)|E|l(?:e(?:ngth|ft)|a(?:st(?:M(?:odified|atch)|Index)|yer(?:s|X)|nguage))|a(?:pp(?:Name|Version)|ll|r(?:ity|guments))|r(?:ight(?:Context)?)|global|x|m|L(?:N(?:10|2)|OG(?:10E|2E))|b)\b/,
        },
        {
          token: 'identifier',
          regex: identifierRe,
        },
        {
          regex: '',
          token: 'empty',
          next: 'no_regex',
        },
      ],
      // regular expressions are only allowed after certain tokens. This
      // makes sure we don't mix up regexps with the divison operator
      start: [
        DocCommentHighlightRules.getStartRule('doc-start'),
        comments('start'),
        {
          token: 'string.regexp',
          regex: '\\/',
          next: 'regex',
        },
        {
          token: 'text',
          regex: '\\s+|^$',
          next: 'start',
        },
        {
          // immediately return to the start mode without matching
          // anything
          token: 'empty',
          regex: '',
          next: 'no_regex',
        },
      ],
      regex: [
        {
          // escapes
          token: 'regexp.keyword.operator',
          regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)',
        },
        {
          // flag
          token: 'string.regexp',
          regex: '/[sxngimy]*',
          next: 'no_regex',
        },
        {
          // invalid operators
          token: 'invalid',
          regex: /{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/,
        },
        {
          // operators
          token: 'constant.language.escape',
          regex: /\(\?[:=!]|\)|{\d+\b,?\d*}|[+*]\?|[()$^+*?.]/,
        },
        {
          token: 'constant.language.delimiter',
          regex: /\|/,
        },
        {
          token: 'constant.language.escape',
          regex: /\[\^?/,
          next: 'regex_character_class',
        },
        {
          token: 'empty',
          regex: '$',
          next: 'no_regex',
        },
        {
          defaultToken: 'string.regexp',
        },
      ],
      regex_character_class: [
        {
          token: 'regexp.charclass.keyword.operator',
          regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)',
        },
        {
          token: 'constant.language.escape',
          regex: ']',
          next: 'regex',
        },
        {
          token: 'constant.language.escape',
          regex: '-',
        },
        {
          token: 'empty',
          regex: '$',
          next: 'no_regex',
        },
        {
          defaultToken: 'string.regexp.characterclass',
        },
      ],
      function_arguments: [
        {
          token: 'variable.parameter',
          regex: identifierRe,
        },
        {
          token: 'punctuation.operator',
          regex: '[, ]+',
        },
        {
          token: 'punctuation.operator',
          regex: '$',
        },
        {
          token: 'empty',
          regex: '',
          next: 'no_regex',
        },
      ],
      qqstring: [
        {
          token: 'constant.language.escape',
          regex: escapedRe,
        },
        {
          token: 'string',
          regex: '\\\\$',
          consumeLineEnd: true,
        },
        {
          token: 'string',
          regex: '"|$',
          next: 'no_regex',
        },
        {
          defaultToken: 'string',
        },
      ],
      qstring: [
        {
          token: 'constant.language.escape',
          regex: escapedRe,
        },
        {
          token: 'string',
          regex: '\\\\$',
          consumeLineEnd: true,
        },
        {
          token: 'string',
          regex: "'|$",
          next: 'no_regex',
        },
        {
          defaultToken: 'string',
        },
      ],
    };

    if (!options || !options.noES6) {
      this.$rules.no_regex.unshift(
        {
          regex: '[{}]',
          onMatch: function (val, state, stack) {
            this.next = val === '{' ? this.nextState : '';
            if (val === '{' && stack.length) {
              stack.unshift('start', state);
            } else if (val === '}' && stack.length) {
              stack.shift();
              this.next = stack.shift();
              if (this.next.indexOf('string') !== -1) return 'paren.quasi.end';
            }
            return val === '{' ? 'paren.lparen' : 'paren.rparen';
          },
          nextState: 'start',
        },
        {
          token: 'string.quasi.start',
          regex: /`/,
          push: [
            {
              token: 'constant.language.escape',
              regex: escapedRe,
            },
            {
              token: 'paren.quasi.start',
              regex: /\${/,
              push: 'start',
            },
            {
              token: 'string.quasi.end',
              regex: /`/,
              next: 'pop',
            },
            {
              defaultToken: 'string.quasi',
            },
          ],
        },
      );
    }

    this.embedRules(DocCommentHighlightRules, 'doc-', [
      DocCommentHighlightRules.getEndRule('no_regex'),
    ]);

    this.normalizeRules();
  };

  oop.inherits(ExpressionHighlightRules, TextHighlightRules);

  function comments(next) {
    return [
      {
        token: 'comment', // multi line comment
        regex: /\/\*/,
        next: [
          DocCommentHighlightRules.getTagRule(),
          { token: 'comment', regex: '\\*\\/', next: next || 'pop' },
          { defaultToken: 'comment', caseInsensitive: true },
        ],
      },
      {
        token: 'comment',
        regex: '\\/\\/',
        next: [
          DocCommentHighlightRules.getTagRule(),
          { token: 'comment', regex: '$|^', next: next || 'pop' },
          { defaultToken: 'comment', caseInsensitive: true },
        ],
      },
    ];
  }
  exports.ExpressionHighlightRules = ExpressionHighlightRules;
});

(function () {
  ace.require(['ace/mode/expr'], function (m) {
    if (typeof module == 'object' && typeof exports == 'object' && module) {
      module.exports = m;
    }
  });
})();

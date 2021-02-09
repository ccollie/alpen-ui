import { EXPRESSION_OPERATORS } from "./expression-operators";
import { CONVERSION_OPERATORS } from "./conversion-operators";
import { QUERY_OPERATORS } from './query-operators';
import { Ace } from 'ace-builds';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import { AutocompleteField } from "./autocompete-field";
import EditSession = Ace.EditSession;
import Editor = Ace.Editor;
import Completer = Ace.Completer;
import CompleterCallback = Ace.CompleterCallback;
import Point = Ace.Point;
const filter = require('./filter');
const ace = getAceInstance();
const tools = ace.require('ace/ext/language_tools');

/**
 * String token type.
 */
const STRING = 'string';

/**
 * The match completions.
 */
const MATCH_COMPLETIONS = [
  ...QUERY_OPERATORS, 
  ...EXPRESSION_OPERATORS,
  ...CONVERSION_OPERATORS
];

/**
 * Adds autocomplete suggestions for queries.
 */
class QueryAutoCompleter implements Completer {
  private readonly version: string;
  private fields: AutocompleteField[];
  private expressions: AutocompleteField[];
  private readonly textCompleter: any;

  /**
   * Instantiate a new completer.
   *
   * @param {String} version - The version.
   * @param {Completer} textCompleter - The fallback Ace text completer.
   * @param {Array} fields - The collection fields.
   */
  constructor(version: string, textCompleter: Completer, fields?: AutocompleteField[]) {
    this.version = version;
    this.textCompleter = textCompleter;
    this.fields = fields || [];
    this.expressions = MATCH_COMPLETIONS.concat(this.fields);
  }

  /**
   * Update the autocompleter with new fields.
   *
   * @param {Array} fields - The new fields.
   */
  update(fields: AutocompleteField[]) {
    this.fields = fields;
    this.expressions = MATCH_COMPLETIONS.concat(this.fields);
  }

  /**
   * Get the completion list for the provided params.
   *
   * @param {Editor} editor - The ACE editor.
   * @param {EditSession} session - The current editor session.
   * @param {Point} position - The cursor position.
   * @param {String} prefix - The string prefix to complete.
   * @param {Function} done - The done callback.
   *
   * @returns {Function} The completion function.
   */
  getCompletions(editor: Editor,
                 session: EditSession,
                 position: Point,
                 prefix: string,
                 done: CompleterCallback) {
    // Empty prefixes do not return results.
    if (prefix === '') return done(null, []);
    // If the current token is a string with single or double quotes, then
    // we want to use the local text completer instead of suggesting operators.
    // This is so we can suggest user variable names inside the pipeline that they
    // have already typed.
    const currentToken = session.getTokenAt(position.row, position.column);
    if (currentToken && currentToken.type === STRING) {
      return this.textCompleter.getCompletions(
        editor,
        session,
        position,
        prefix,
        done
      );
    }
    // If the current token is not a string, then we proceed as normal to suggest
    // operators to the user.
    done(null, filter(this.version, this.expressions, prefix));
  }

  static create(schemaFields: AutocompleteField[]): QueryAutoCompleter {
    const textCompleter = tools.textCompleter;
    return new QueryAutoCompleter('', textCompleter, schemaFields);
  }
}

export default QueryAutoCompleter;

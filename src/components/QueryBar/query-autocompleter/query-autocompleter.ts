import { EXPRESSION_OPERATORS } from './expression-operators';
import { CONVERSION_OPERATORS } from './conversion-operators';
import { QUERY_OPERATORS } from './query-operators';
import { getAceInstance } from 'react-ace/lib/editorOptions';
import { AutocompleteField } from './autocompete-field';
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
  ...CONVERSION_OPERATORS,
];

/**
 * Filter the entires based on the prefix.
 *
 * @param {String} version - The server version.
 * @param {Array} entries - The entries to filter.
 * @param {String} prefix - The prefix.
 *
 * @returns {Array} The matching entries.
 */
const filter = (
  version: string,
  entries: AutocompleteField[],
  prefix: string,
) => entries.filter((e) => !!e.name?.startsWith(prefix));

export function createCompleter(schemaFields?: AutocompleteField[]): Function {
  const fields = schemaFields || [];
  const expressions = MATCH_COMPLETIONS.concat(fields);

  const textCompleter = tools.textCompleter;
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
  return function (
    editor: any,
    session: any,
    position: any,
    prefix: string,
    done: Function,
  ) {
    // Empty prefixes do not return results.
    if (prefix === '') return done(null, []);
    // If the current token is a string with single or double quotes, then
    // we want to use the local text completer instead of suggesting operators.
    // This is so we can suggest user variable names inside the pipeline that they
    // have already typed.
    const currentToken = session.getTokenAt(position.row, position.column);
    if (currentToken && currentToken.type === STRING) {
      return textCompleter.getCompletions(
        editor,
        session,
        position,
        prefix,
        done,
      );
    }
    // If the current token is not a string, then we proceed as normal to suggest
    // operators to the user.
    done(null, filter('', expressions, prefix));
  };
}

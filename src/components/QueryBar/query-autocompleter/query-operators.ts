/**
 * The query operators.
 */
import { AutocompleteField } from './autocompete-field';

export const QUERY_OPERATORS: AutocompleteField[] = [
  {
    name: '$all',
    value: '$all',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
  {
    name: 'typeof',
    value: 'typeof',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
  {
    name: 'matches',
    value: 'matches',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
  {
    name: 'instanceof',
    value: 'instanceof',
    score: 1,
    meta: 'query',
    version: '3.6.0',
  },
  {
    name: 'in',
    value: 'in',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
  {
    name: 'or',
    value: 'or',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
  {
    name: 'slice',
    value: 'slice',
    score: 1,
    meta: 'query',
    version: '2.2.0',
  },
];

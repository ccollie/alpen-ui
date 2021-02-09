import { isEmpty } from 'lodash';
import { validateQuery } from '../../query-parser';

export function isNumberValid(input: string): number | boolean {
  if (isEmpty(input)) {
    return 0;
  }
  return /^\d+$/.test(input) ? parseInt(input, 10) : false;
}

export function stringify(obj: any): string {
  return JSON.stringify(obj)
    .replace(/ ?\n ? ?/g, '')
    .replace(/ {2,}/g, ' ');
}

export function isFilterValid(filter: string): boolean {
  return validateQuery(filter);
}

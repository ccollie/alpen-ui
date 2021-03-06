import { validateQuery } from '@/query-parser';

export function isNumberValid(input: string): number | boolean {
  if (!input) {
    return 0;
  }
  return /^\d+$/.test(input) ? parseInt(input, 10) : false;
}

export function isFilterValid(filter: string): boolean {
  return validateQuery(filter);
}

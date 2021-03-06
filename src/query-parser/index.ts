import { initExpressionOperators } from './expression';
import jsep from 'jsep';

let isInit = false;

function initIfNecessary() {
  if (!isInit) {
    isInit = true;
    initExpressionOperators();
  }
}

export function parseExpression(query: string): jsep.Expression {
  initIfNecessary();
  return jsep(query);
}

export function validateQuery(query: string): boolean {
  try {
    parseExpression(query);
    return true;
  } catch {
    return false;
  }
}

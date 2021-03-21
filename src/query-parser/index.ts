import { initExpressionOperators } from './expression';
import { initQueryOperators } from './query';
import jsep from 'jsep';

let isInit = false;

function initIfNecessary() {
  if (!isInit) {
    isInit = true;
    initExpressionOperators();
    initQueryOperators();
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

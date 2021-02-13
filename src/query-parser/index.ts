import mingo from 'mingo';
import { initExpressionOperators } from './expression';
import { initQueryOperators } from './query';
import { initAggregationOperators } from './aggregation';

let isInit = false;

function initIfNecessary() {
  if (!isInit) {
    isInit = true;
    initExpressionOperators();
    initQueryOperators();
    initAggregationOperators();
  }
}

export function validateQuery(query: string | Record<string, any>): boolean {
  let q: Record<string, any>;
  if (typeof query === 'string') {
    if (!query) return true;
    try {
      q = JSON.parse(query);
    } catch (e) {
      return false;
    }
  } else {
    q = query as Record<string, any>;
  }

  initIfNecessary();

  try {
    new mingo.Query(q);
    return true;
  } catch {
    return false;
  }
}

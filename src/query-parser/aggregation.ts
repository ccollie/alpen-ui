// NOTE: this code follows exactly the example found in the mingo repo. Their
// typings are the issue
// eslint-disable-file
// @ts-nocheck
// eslint-disable-file react-hooks/rules-of-hooks
import { useOperators, OperatorType } from 'mingo/core';
import { $avg, $min, $max, $sum } from 'mingo/operators/accumulator';

export function initAggregationOperators() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useOperators(OperatorType.ACCUMULATOR, {
    $avg,
    $min,
    $max,
    $sum,
  });
}

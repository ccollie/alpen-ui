// NOTE: this code follows exactly the example found in the mingo repo. Their
// typings are the issue
// eslint-disable-file
// @ts-nocheck
// eslint-disable-file react-hooks/rules-of-hooks
import { useOperators, OperatorType } from 'mingo/core';
import {
  $all,
  $and,
  $eq,
  $exists,
  $expr,
  $gt,
  $gte,
  $in,
  $lt,
  $lte,
  $ne,
  $mod,
  $nin,
  $nor,
  $not,
  $or,
  $size,
  $type,
} from 'mingo/operators/query';

export function initQueryOperators() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useOperators(OperatorType.QUERY, {
    $all,
    $and,
    $eq,
    $exists,
    $expr,
    $gt,
    $gte,
    $in,
    $lt,
    $lte,
    $ne,
    $mod,
    $nin,
    $nor,
    $not,
    $or,
    $size,
    $type,
  });
}

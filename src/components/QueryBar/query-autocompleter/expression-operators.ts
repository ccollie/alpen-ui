/**
 * The expression operators.
 */
export const EXPRESSION_OPERATORS = [
  {
    name: '$abs',
    value: '$abs',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$add',
    value: '$add',
    score: 1,
    meta: 'expr:arith',
    version: '2.2.0'
  },
  {
    name: '$allElementsTrue',
    value: '$allElementsTrue',
    score: 1,
    meta: 'expr:set',
    version: '2.6.0'
  },
  {
    name: '$and',
    value: '$and',
    score: 1,
    meta: 'expr:bool',
    version: '2.2.0'
  },
  {
    name: '$anyElementTrue',
    value: '$anyElementTrue',
    score: 1,
    meta: 'expr:set',
    version: '2.6.0'
  },
  {
    name: '$arrayElemAt',
    value: '$arrayElemAt',
    score: 1,
    meta: 'expr:array',
    version: '3.2.0'
  },
  {
    name: '$ceil',
    value: '$ceil',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$cmp',
    value: '$cmp',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$concat',
    value: '$concat',
    score: 1,
    meta: 'expr:string',
    version: '2.4.0'
  },
  {
    name: '$cond',
    value: '$cond',
    score: 1,
    meta: 'expr:cond',
    version: '2.6.0'
  },
  {
    name: '$divide',
    value: '$divide',
    score: 1,
    meta: 'expr:arith',
    version: '2.2.0'
  },
  {
    name: '$eq',
    value: '$eq',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$exp',
    value: '$exp',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$first',
    value: '$first',
    score: 1,
    meta: 'expr:array',
    version: '4.4.0'
  },
  {
    name: '$floor',
    value: '$floor',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$gt',
    value: '$gt',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$gte',
    value: '$gte',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$ifNull',
    value: '$ifNull',
    score: 1,
    meta: 'expr:cond',
    version: '2.2.0'
  },
  {
    name: '$in',
    value: '$in',
    score: 1,
    meta: 'expr:array',
    version: '3.4.0'
  },
  {
    name: '$indexOfArray',
    value: '$indexOfArray',
    score: 1,
    meta: 'expr:array',
    version: '3.4.0'
  },
  {
    name: '$indexOfBytes',
    value: '$indexOfBytes',
    score: 1,
    meta: 'expr:string',
    version: '3.4.0'
  },
  {
    name: '$isArray',
    value: '$isArray',
    score: 1,
    meta: 'expr:array',
    version: '3.2.0'
  },
  {
    name: '$isNumber',
    value: '$isNumber',
    score: 1,
    meta: 'expr:arith',
    version: '4.4.0'
  },
  {
    name: '$last',
    value: '$last',
    score: 1,
    meta: 'expr:array',
    version: '4.4.0'
  },
  {
    name: '$literal',
    value: '$literal',
    score: 1,
    meta: 'expr:literal',
    version: '2.6.0'
  },
  {
    name: '$lt',
    value: '$lt',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$lt',
    value: '$lte',
    score: 1,
    meta: 'expr:comp',
    version: '2.2.0'
  },
  {
    name: '$ln',
    value: '$ln',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$log',
    value: '$log',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$mod',
    value: '$mod',
    score: 1,
    meta: 'expr:arith',
    version: '2.2.0'
  },
  {
    name: '$multiply',
    value: '$multiply',
    score: 1,
    meta: 'expr:arith',
    version: '2.2.0'
  },
  {
    name: '$not',
    value: '$not',
    score: 1,
    meta: 'expr:bool',
    version: '2.2.0'
  },
  {
    name: '$or',
    value: '$or',
    score: 1,
    meta: 'expr:bool',
    version: '2.2.0'
  },
  {
    name: '$pow',
    value: '$pow',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$size',
    value: '$size',
    score: 1,
    meta: 'expr:array',
    version: '2.6.0'
  },
  {
    name: '$slice',
    value: '$slice',
    score: 1,
    meta: 'expr:array',
    version: '3.2.0'
  },
  {
    name: '$split',
    value: '$split',
    score: 1,
    meta: 'expr:string',
    version: '3.4.0'
  },
  {
    name: '$sqrt',
    value: '$sqrt',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$strcasecmp',
    value: '$strcasecmp',
    score: 1,
    meta: 'expr:string',
    version: '2.2.0'
  },
  {
    name: '$strLenBytes',
    value: '$strLenBytes',
    score: 1,
    meta: 'expr:string',
    version: '3.4.0'
  },
  {
    name: '$substr',
    value: '$substr',
    score: 1,
    meta: 'expr:string',
    version: '2.2.0',
    deprecated: '3.4.0',
    replacement: '$substrBytes'
  },
  {
    name: '$substrBytes',
    value: '$substrBytes',
    score: 1,
    meta: 'expr:string',
    version: '3.4.0'
  },
  {
    name: '$subtract',
    value: '$subtract',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$switch',
    value: '$switch',
    score: 1,
    meta: 'expr:cond',
    version: '3.4.0'
  },
  {
    name: '$toLower',
    value: '$toLower',
    score: 1,
    meta: 'expr:string',
    version: '2.2.0'
  },
  {
    name: '$toUpper',
    value: '$toUpper',
    score: 1,
    meta: 'expr:string',
    version: '2.2.0'
  },
  {
    name: '$trunc',
    value: '$trunc',
    score: 1,
    meta: 'expr:arith',
    version: '3.2.0'
  },
  {
    name: '$type',
    value: '$type',
    score: 1,
    meta: 'expr:type',
    version: '3.4.0'
  },
];
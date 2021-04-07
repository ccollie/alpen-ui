export type DefinitionType = 'method' | 'class' | 'dict' | 'union' | 'unknown';

interface TypingResultBase {
  readonly type: DefinitionType;
  display?: string;
  description?: string;
}

export interface TypeRef {
  refClazzName: string;
}

export type TypedClass = {
  refClazzName: string;
  params?: Array<TypingResult>;
};

export type MethodParameter = {
  name?: string;
  refClazzName: string;
  refClazz?: TypingResult;
};

export type TypedMethod = {
  methodName?: string;
  returnType: string;
  description?: string;
  refClazz?: TypingResult;
  params?: Array<MethodParameter>;
};

interface TypedField {
  refClazzName: string;
  refClazz?: TypedObject;
  description?: string;
}

export type TypedObject = TypingResultBase &
  TypedClass & {
    readonly type: 'class';
    fields: Record<string, TypedField>;
    methods: Record<string, TypedMethod>;
  };

export type TypedDict = TypingResultBase & {
  id: string;
  valueType: SingleTypingResult;
};

export type SingleTypingResult = TypingResultBase &
  (TypedObject | TypedDict | TypedClass);

export type UnknownTyping = TypingResultBase & {
  readonly type: 'unknown';
  params: Array<TypingResult>;
};

export type UnionTyping = TypingResultBase & {
  readonly type: 'union';
  union: Array<SingleTypingResult | TypeRef>;
  resolved?: TypedObject[];
};

export type TypingResult = UnknownTyping | SingleTypingResult | UnionTyping;

type SuggestionParameter = {
  name?: string;
  refClazz?: TypingResult;
};

export type TypedSuggestion = {
  name: string;
  description?: string;
  display?: string;
  refClazz?: TypingResult;
  params?: SuggestionParameter[];
};

export function isType(x: unknown, t: DefinitionType): boolean {
  return !!x && (x as TypingResultBase).type === t;
}

export function isUnionType(x: unknown): x is UnionTyping {
  return isType(x, 'union');
}

export function isMethodType(x: unknown): x is TypedMethod {
  return !!x && typeof (x as any).returnType === 'string';
}

export function isClassType(x: unknown): x is TypedObject {
  return isType(x, 'class');
}

const StringDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'string',
  fields: {
    length: { refClazzName: 'number', description: 'the length of the string' },
  },
  methods: {
    charAt: {
      returnType: 'string',
      description: 'return the character at a given position in a string.',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    concat: {
      returnType: 'string',
      description:
        'combines one or more strings(argv1,v2 etc) into this existing one.',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    toUpperCase: {
      returnType: 'string',
      description:
        'return the string with all of its characters converted to uppercase.',
    },
    toLowerCase: {
      returnType: 'string',
      description:
        'return the string with all of its characters converted to lowercase.',
    },
    includes: {
      returnType: 'string',
      description:
        'checks whether a string contains specified string or characters',
      params: [{ name: 'needle', refClazzName: 'string' }],
    },
    indexOf: {
      returnType: 'number',
      description:
        'returns the index of a substring in a string, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', refClazzName: 'string' },
        { name: 'start', refClazzName: 'number' },
      ],
    },
    lastIndexOf: {
      returnType: 'number',
      description:
        'returns the last index of a substring in a string, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', refClazzName: 'string' },
        { name: 'start', refClazzName: 'number' },
      ],
    },
    replace: {
      returnType: 'string',
      description: 'replaces a substring in a string',
      params: [
        { name: 'substr', refClazzName: 'string' },
        { name: 'replacement', refClazzName: 'string' },
      ],
    },
    startsWith: {
      returnType: 'string',
      description:
        'checks whether a string starts with specified string or characters',
      params: [{ name: 'needle', refClazzName: 'string' }],
    },
    strcasecmp: {
      returnType: 'string',
      description: 'compare with another string ignoring case',
      params: [{ name: 'needle', refClazzName: 'string' }],
    },
    endsWith: {
      returnType: 'string',
      description:
        'checks whether a string ends with specified string or characters',
      params: [{ name: 'needle', refClazzName: 'string' }],
    },
    substr: {
      returnType: 'string',
      description:
        'returns the characters in a string beginning at "start" and includes ' +
        'the specified number of characters specified by "length". If "length" ' +
        'is omitted, all characters up to the end of the string are returned.',
      params: [
        { name: 'start', refClazzName: 'number' },
        { name: 'length', refClazzName: 'number' },
      ],
    },
    substring: {
      returnType: 'string',
      description:
        'returns the characters in a string between “from” and “to” indexes, ' +
        'NOT including “to” itself. “To” is optional, and if omitted, up to ' +
        'the end of the string is assumed.',
      params: [
        { name: 'from', refClazzName: 'number' },
        { name: 'to', refClazzName: 'number' },
      ],
    },
    split: {
      returnType: 'string',
      description:
        'splits a string according to a delimiter, returning an array with each element. ' +
        'The optional “limit” is an integer that lets you specify the maximum number ' +
        'of elements to return..',
      params: [
        { name: 'delimiter', refClazzName: 'string' },
        { name: 'limit', refClazzName: 'number' },
      ],
    },
    slice: {
      returnType: 'string',
      description: 'extracts parts of a string',
      params: [
        { name: 'start', refClazzName: 'number' },
        { name: 'end', refClazzName: 'number' },
      ],
    },
    trim: {
      returnType: 'string',
      description: 'removes whitespace from both ends of a string',
    },
    trimStart: {
      returnType: 'string',
      description: 'removes whitespace from the start of a string',
    },
    trimEnd: {
      returnType: 'string',
      description: 'removes whitespace from the ends of a string',
    },
  },
};

const NumberDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'number',
  fields: {},
  methods: {
    toString: {
      returnType: 'string',
      description: 'return the value as a string.',
      params: [],
    },
  },
};

const BooleanDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'boolean',
  fields: {},
  methods: {
    toString: {
      returnType: 'string',
      description: 'return the value as a string.',
      params: [],
    },
  },
};

const ArrayDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'array',
  methods: {
    pop: {
      returnType: 'any',
      description: 'removes and returns the last element from an array',
    },
    push: {
      returnType: 'any',
      description:
        'adds one or more elements to the end of an array and returns the new length of the array.',
      params: [{ name: 'element', refClazzName: 'any' }],
    },
    concat: {
      returnType: 'array',
      description:
        'combines one or more elements(argv1,v2 etc) into this array.',
      params: [{ name: 'x', refClazzName: 'any' }],
    },
    join: {
      returnType: 'string',
      description: 'creates a string by concatenating all elements in an array',
      params: [{ name: 'glue', refClazzName: 'string' }],
    },
    shift: {
      returnType: 'any',
      description: 'removes and returns the first element from an array',
    },
    unshift: {
      returnType: 'array',
      description:
        'adds one or more elements to the beginning of an array and returns the array.',
    },
    keys: {
      returnType: 'array',
      description: 'return the keys for each index in the array',
    },
    includes: {
      returnType: 'boolean',
      description:
        'checks whether a string contains specified string or characters',
      params: [{ name: 'needle', refClazzName: 'string' }],
    },
    indexOf: {
      returnType: 'number',
      description:
        'returns the index of an element in an array, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', refClazzName: 'any' },
        { name: 'start', refClazzName: 'number' },
      ],
    },
    lastIndexOf: {
      returnType: 'number',
      description:
        'returns the last index of an element in an array, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', refClazzName: 'any' },
        { name: 'start', refClazzName: 'number' },
      ],
    },
    min: {
      returnType: 'number',
      description:
        'returns the minimum value of the numeric elements in the array',
    },
    max: {
      returnType: 'number',
      description:
        'returns the maximum value of the numeric elements in the array',
    },
    avg: {
      returnType: 'number',
      description:
        'returns the average value of the numeric elements in the array',
    },
  },
  fields: {
    length: { refClazzName: 'number', description: 'the length of the array' },
  },
};

const DateDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'Date',
  fields: {},
  methods: {
    getFullYear: {
      returnType: 'number',
    },
    getMonth: {
      returnType: 'number',
    },
    getDate: {
      returnType: 'number',
    },
    getDay: {
      returnType: 'number',
    },
    getHours: {
      returnType: 'number',
    },
    getMinutes: {
      returnType: 'number',
    },
    getSeconds: {
      returnType: 'number',
    },
    getMilliseconds: {
      returnType: 'number',
    },

    /////////////// UTC //////////////////
    getUTCFullYear: {
      returnType: 'number',
    },
    getUTCMonth: {
      returnType: 'number',
    },
    getUTCDate: {
      returnType: 'number',
    },
    getUTCDay: {
      returnType: 'number',
    },
    getUTCHours: {
      returnType: 'number',
    },
    getUTCMinutes: {
      returnType: 'number',
    },
    getUTCSeconds: {
      returnType: 'number',
    },
    getUTCMilliseconds: {
      returnType: 'number',
    },

    //////////////////////////////////

    getTime: {
      returnType: 'number',
    },
    getDayOfYear: {
      returnType: 'array',
      description:
        'adds one or more elements to the beginning of an array and returns the array.',
    },
    rfc3339: {
      returnType: 'string',
      description: 'return the date as a string in RFC3339 format',
    },
  },
};

const MathVarargParams = [
  { name: 'x0', refClazzName: 'number' },
  { name: 'x1', refClazzName: 'number' },
  { name: 'x2', refClazzName: 'number' },
  { name: 'x3', refClazzName: 'number' },
  { name: 'x4', refClazzName: 'number' },
  { name: 'x5', refClazzName: 'number' },
  { name: 'x6', refClazzName: 'number' },
  { name: 'x7', refClazzName: 'number' },
];

const MathGlobalDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'Math',
  fields: {
    PI: { refClazzName: 'number', description: '3.124...' },
  },
  methods: {
    abs: {
      returnType: 'number',
      description: 'return the absolute value of a number.',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    acos: {
      returnType: 'number',
      description: 'returns the arc cosine of the argument',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    atan: {
      returnType: 'number',
      description: 'return the arc tangent of the argument.',
    },
    ceil: {
      returnType: 'number',
    },
    cos: {
      returnType: 'number',
      description: 'returns the cosine of the argument',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    floor: {
      returnType: 'number',
      params: [{ name: 'n', refClazzName: 'number' }],
    },
    pow: {
      returnType: 'number',
      description: 'returns a number raised to a power',
      params: [
        { name: 'n', refClazzName: 'string' },
        { name: 'places', refClazzName: 'number' },
      ],
    },
    sin: {
      returnType: 'number',
      description: 'calculate the sin of a number',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    sqrt: {
      returnType: 'number',
      description: 'Calculates the square root of a number',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    tan: {
      returnType: 'number',
      description: 'calculate the tan of a number',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    log: {
      returnType: 'number',
      description: 'returns the log of a number',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    log10: {
      returnType: 'number',
      description: 'returns the log10 of a number',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    round: {
      returnType: 'number',
      description: 'rounds a number to a given number of decimal places',
      params: [
        { name: 'n', refClazzName: 'string' },
        { name: 'places', refClazzName: 'number' },
      ],
    },
    trunc: {
      returnType: 'number',
      description: 'truncates a number to a given number of decimal places',
      params: [
        { name: 'n', refClazzName: 'string' },
        { name: 'places', refClazzName: 'number' },
      ],
    },
    sign: {
      returnType: 'number',
      description:
        'returns the sign of a number: ' +
        '  -1 for numbers below zero, ' +
        '  1 for positive numbers, and ' +
        '  0 for zero',
      params: [{ name: 'x', refClazzName: 'number' }],
    },
    min: {
      returnType: 'array',
      description: 'returns the minimum of a series of numbers',
      params: MathVarargParams,
    },
    max: {
      returnType: 'array',
      description: 'returns the maximum of a series of numbers',
      params: MathVarargParams,
    },
    avg: {
      returnType: 'array',
      description: 'returns the average of a series of numbers',
      params: MathVarargParams,
    },
  },
};

const DateGlobal: TypedObject = {
  type: 'class',
  refClazzName: 'DateGlobal',
  fields: {},
  methods: {
    parse: {
      returnType: 'Date',
      params: [{ name: 'dateString', refClazzName: 'string' }],
    },
    UTC: {
      returnType: 'number',
      params: [
        { name: 'year', refClazzName: 'number' },
        { name: 'month', refClazzName: 'number' },
        { name: 'day', refClazzName: 'number' },
        { name: 'hour', refClazzName: 'number' },
        { name: 'minutes', refClazzName: 'number' },
        { name: 'seconds', refClazzName: 'number' },
        { name: 'milliseconds', refClazzName: 'number' },
      ],
    },
  },
};

const JSONGlobalDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'JSON',
  methods: {
    parse: {
      returnType: 'object',
      params: [{ name: 'str', refClazzName: 'string' }],
    },
    stringify: {
      returnType: 'string',
      description: 'converts an object to a string.',
      params: [{ name: 'obj', refClazzName: 'string' }],
    },
  },
  fields: {},
};

const JobDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'Job',
  fields: {
    id: { refClazzName: 'string', description: 'the job id' },
    name: { refClazzName: 'string', description: 'the job name' },
    timestamp: {
      refClazzName: 'number',
      description: 'the job creation timestamp',
    },
    processedOn: {
      refClazzName: 'number',
      description: 'timestamp when job started processing',
    },
    finishedOn: {
      refClazzName: 'number',
      description: 'timestamp when job finished processing',
    },
    latency: { refClazzName: 'number', description: 'the runtime of the job' },
    waitTime: {
      refClazzName: 'number',
      description: 'the length of the string',
    },
    attemptsMade: { refClazzName: 'number', description: 'job attempts' },
    stacktrace: { refClazzName: 'array' },
    progress: {
      refClazzName: 'number',
    },
    returnvalue: {
      refClazzName: 'any', // todo:
    },
    failedReason: {
      refClazzName: 'object',
    },
    data: {
      refClazzName: 'object',
    },
  },
  methods: {},
};

const JobRepeatOptions: TypedObject = {
  type: 'class',
  refClazzName: 'JobRepeatOptions',
  methods: {},
  fields: {
    tz: {
      refClazzName: 'string',
    },
    endDate: {
      refClazzName: 'number',
    },
    limit: {
      refClazzName: 'number',
    },
    count: {
      refClazzName: 'number',
    },
    prevMillis: {
      refClazzName: 'number',
    },
    jobId: {
      refClazzName: 'string',
    },
    startDate: {
      refClazzName: 'number',
    },
    cron: {
      refClazzName: 'string',
    },
    every: {
      refClazzName: 'string',
    },
  },
};

// const JobRemoveOptionDefinition: UnionTyping = {
//   type: 'union',
//   refClazzName: 'JobRemoveOption',
//   union: [{ refClazzName: 'boolean' }, { refClazzName: 'number' }],
// };

const JobOptionsDefinition: TypedObject = {
  type: 'class',
  refClazzName: 'JobOptions',
  methods: {},
  fields: {
    timestamp: {
      refClazzName: 'number',
    },
    priority: {
      refClazzName: 'number',
    },
    delay: {
      refClazzName: 'number',
    },
    attempts: {
      refClazzName: 'number',
      description:
        'The total number of attempts to try the job until it completes.',
    },
    lifo: {
      refClazzName: 'boolean',
      description:
        'if true, adds the job to the right of the queue instead of the left (default false)',
    },
    timeout: {
      refClazzName: 'number',
      description:
        // eslint-disable-next-line max-len
        'The number of milliseconds after which the job should be fail with a timeout error [optional]',
    },
    repeat: {
      refClazzName: 'JobRepeatOptions',
    },
    rateLimiterKey: {
      refClazzName: 'string',
    },
    jobId: {
      refClazzName: 'string',
      description: 'Overridden job ID.',
    },
    removeOnComplete: {
      refClazzName: 'boolean',
      description:
        'If true, removes the job when it successfully completes.' +
        '  A number specify the max amount of jobs to keep.' +
        '  Default behavior is to keep the job in the COMPLETED set.',
    },
    removeOnFail: {
      refClazzName: 'JobRemoveOption',
      description:
        'If true, removes the job when it fails after all attempts.' +
        '  A number specify the max amount of jobs to keep.' +
        '  Default behavior is to keep the job in the FAILED set.',
    }, //bool | int
    stackTraceLimit: {
      refClazzName: 'number',
      description:
        'Limits the amount of stack trace lines that will be recorded in the stacktrace.',
    },
  },
};

export const TypesInformation = [
  StringDefinition,
  BooleanDefinition,
  NumberDefinition,
  ArrayDefinition,
  DateDefinition,
  JobDefinition,
  JobOptionsDefinition,
  // JobRemoveOptionDefinition,
  JobRepeatOptions,
  MathGlobalDefinition,
  JSONGlobalDefinition,
  DateGlobal,
];

export const Functions: Record<string, TypedMethod> = {
  parseBoolean: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  parseDate: {
    returnType: 'Date',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  parseInt: {
    returnType: 'number',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  toString: {
    returnType: 'string',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  isString: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  isNumber: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  isArray: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  isEmpty: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  isNaN: {
    returnType: 'boolean',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  ms: {
    returnType: 'string',
    params: [{ name: 'value', refClazzName: 'any' }],
  },
  strcasecmp: {
    returnType: 'string',
    params: [
      { name: 'str1', refClazzName: 'string' },
      { name: 'str2', refClazzName: 'string' },
    ],
  },
};

export type VariableDict = Record<string, TypeRef | TypingResult>;

export const Variables: VariableDict = {
  job: {
    refClazzName: 'Job',
  },
  Math: { refClazzName: 'Math' },
  JSON: { refClazzName: 'JSON' },
  Date: { refClazzName: 'Date' },
};

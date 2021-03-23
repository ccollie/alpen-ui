export type DefinitionType = 'method' | 'class' | 'dict' | 'union' | 'unknown';

interface TypingResultBase {
  readonly type: DefinitionType;
  display: string;
}

export type TypedClass = {
  refClazzName: string;
  params: Array<TypingResult>;
};

export type TypedMethod = {
  readonly type: 'method';
  refClazzName: string;
  params: Array<TypingResult>;
};

export type TypedObject = TypingResultBase &
  TypedClass & {
    readonly type: 'class';
    fields: Record<string, TypingResult>;
    methods: Record<string, TypedMethod>;
  };

export type TypedDict = TypingResultBase & {
  id: string;
  valueType: SingleTypingResult;
};

export type TypedTaggedValue = (TypedObject | TypedDict | TypedClass) & {
  tag: string;
};

export type SingleTypingResult = TypingResultBase &
  (TypedObject | TypedDict | TypedTaggedValue | TypedClass);

export type UnknownTyping = TypingResultBase & {
  readonly type: 'unknown';
  params: Array<TypingResult>;
};

type UnionTyping = TypingResultBase & {
  readonly type: 'union';
  union: Array<SingleTypingResult>;
};

export function isType(x: unknown, t: DefinitionType): boolean {
  return !!x && (x as TypingResultBase).type === t;
}

export function isUnionType(x: unknown): x is UnionTyping {
  return isType(x, 'union');
}

export function isMethodType(x: unknown): x is TypedMethod {
  return isType(x, 'method');
}

export function isClassType(x: unknown): x is TypedObject {
  return isType(x, 'class');
}

export function isDictType(x: unknown): x is TypedDict {
  return isType(x, 'dict');
}

export type TypingResult = UnknownTyping | SingleTypingResult | UnionTyping;

export type TypingSuggestion = {
  value: string;
  refClazz: TypingResult;
};

export interface BaseDefinition {
  clazz: string;
  description?: string;
}

export interface ParamDefinition extends BaseDefinition {
  name?: string;
}

export interface MethodDefinition extends BaseDefinition {
  refClazz?: string;
  params?: ParamDefinition[];
}

export interface PropertyDefinition extends BaseDefinition {
  union?: BaseDefinition[];
}

export interface TypeInformation extends BaseDefinition {
  clazzName: string;
  methods?: Record<string, MethodDefinition>;
  fields?: Record<string, PropertyDefinition>;
  union?: BaseDefinition[];
  dict?: Record<string, BaseDefinition>;
}

const StringDefinition: TypeInformation = {
  clazz: 'string',
  clazzName: 'string',
  fields: {
    length: { clazz: 'number', description: 'the length of the string' },
  },
  methods: {
    charAt: {
      clazz: 'string',
      description: 'return the character at a given position in a string.',
      params: [{ name: 'x', clazz: 'number' }],
    },
    concat: {
      clazz: 'string',
      description:
        'combines one or more strings(argv1,v2 etc) into this existing one.',
      params: [{ name: 'x', clazz: 'number' }],
    },
    toUpperCase: {
      clazz: 'string',
      description:
        'return the string with all of its characters converted to uppercase.',
    },
    toLowerCase: {
      clazz: 'string',
      description:
        'return the string with all of its characters converted to lowercase.',
    },
    includes: {
      clazz: 'string',
      description:
        'checks whether a string contains specified string or characters',
      params: [{ name: 'needle', clazz: 'string' }],
    },
    indexOf: {
      clazz: 'number',
      description:
        'returns the index of a substring in a string, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', clazz: 'string' },
        { name: 'start', clazz: 'number' },
      ],
    },
    lastIndexOf: {
      clazz: 'number',
      description:
        'returns the last index of a substring in a string, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', clazz: 'string' },
        { name: 'start', clazz: 'number' },
      ],
    },
    replace: {
      clazz: 'string',
      description: 'replaces a substring in a string',
      params: [
        { name: 'substr', clazz: 'string' },
        { name: 'replacement', clazz: 'string' },
      ],
    },
    startsWith: {
      clazz: 'string',
      description:
        'checks whether a string starts with specified string or characters',
      params: [{ name: 'needle', clazz: 'string' }],
    },
    strcasecmp: {
      clazz: 'string',
      description: 'compare with another string ignoring case',
      params: [{ name: 'needle', clazz: 'string' }],
    },
    endsWith: {
      clazz: 'string',
      description:
        'checks whether a string ends with specified string or characters',
      params: [{ name: 'needle', clazz: 'string' }],
    },
    substr: {
      clazz: 'string',
      description:
        'returns the characters in a string beginning at "start" and includes ' +
        'the specified number of characters specified by "length". If "length" ' +
        'is omitted, all characters up to the end of the string are returned.',
      params: [
        { name: 'start', clazz: 'number' },
        { name: 'length', clazz: 'number' },
      ],
    },
    substring: {
      clazz: 'string',
      description:
        'returns the characters in a string between “from” and “to” indexes, ' +
        'NOT including “to” itself. “To” is optional, and if omitted, up to ' +
        'the end of the string is assumed.',
      params: [
        { name: 'from', clazz: 'number' },
        { name: 'to', clazz: 'number' },
      ],
    },
    split: {
      clazz: 'string',
      description:
        'splits a string according to a delimiter, returning an array with each element. ' +
        'The optional “limit” is an integer that lets you specify the maximum number ' +
        'of elements to return..',
      params: [
        { name: 'delimiter', clazz: 'string' },
        { name: 'limit', clazz: 'number' },
      ],
    },
    slice: {
      clazz: 'string',
      description: 'extracts parts of a string',
      params: [
        { name: 'start', clazz: 'number' },
        { name: 'end', clazz: 'number' },
      ],
    },
    trim: {
      clazz: 'string',
      description: 'removes whitespace from both ends of a string',
    },
    trimStart: {
      clazz: 'string',
      description: 'removes whitespace from the start of a string',
    },
    trimEnd: {
      clazz: 'string',
      description: 'removes whitespace from the ends of a string',
    },
  },
};

const ArrayDefinition: TypeInformation = {
  clazz: 'array',
  clazzName: 'array',
  methods: {
    pop: {
      clazz: 'any',
      description: 'removes and returns the last element from an array',
    },
    push: {
      clazz: 'any',
      description:
        'adds one or more elements to the end of an array and returns the new length of the array.',
      params: [{ name: 'element', clazz: 'any' }],
    },
    concat: {
      clazz: 'array',
      description:
        'combines one or more elements(argv1,v2 etc) into this array.',
      params: [{ name: 'x', clazz: 'any' }],
    },
    join: {
      clazz: 'string',
      description: 'creates a string by concatenating all elements in an array',
      params: [{ name: 'glue', clazz: 'string' }],
    },
    shift: {
      clazz: 'any',
      description: 'removes and returns the first element from an array',
    },
    unshift: {
      clazz: 'array',
      description:
        'adds one or more elements to the beginning of an array and returns the array.',
    },
    keys: {
      clazz: 'array',
      description: 'return the keys for each index in the array',
    },
    includes: {
      clazz: 'boolean',
      description:
        'checks whether a string contains specified string or characters',
      params: [{ name: 'needle', clazz: 'string' }],
    },
    indexOf: {
      clazz: 'number',
      description:
        'returns the index of an element in an array, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', clazz: 'any' },
        { name: 'start', clazz: 'number' },
      ],
    },
    lastIndexOf: {
      clazz: 'number',
      description:
        'returns the last index of an element in an array, optionally ' +
        'starting at "start"',
      params: [
        { name: 'needle', clazz: 'any' },
        { name: 'start', clazz: 'number' },
      ],
    },
    min: {
      clazz: 'number',
      description:
        'returns the minimum value of the numeric elements in the array',
    },
    max: {
      clazz: 'number',
      description:
        'returns the maximum value of the numeric elements in the array',
    },
    avg: {
      clazz: 'number',
      description:
        'returns the average value of the numeric elements in the array',
    },
  },
  fields: {
    length: { clazz: 'number', description: 'the length of the array' },
  },
};

const JobDefinition: TypeInformation = {
  clazz: 'Job',
  clazzName: 'Job',
  fields: {
    id: { clazz: 'string', description: 'the job id' },
    name: { clazz: 'string', description: 'the job name' },
    timestamp: { clazz: 'number', description: 'the job creation timestamp' },
    processedOn: {
      clazz: 'number',
      description: 'timestamp when job started processing',
    },
    finishedOn: {
      clazz: 'number',
      description: 'timestamp when job finished processing',
    },
    latency: { clazz: 'number', description: 'the runtime of the job' },
    waitTime: { clazz: 'number', description: 'the length of the string' },
    attemptsMade: { clazz: 'number', description: 'job attempts' },
    stacktrace: { clazz: 'array' },
    progress: {
      clazz: 'number',
    },
    returnvalue: {
      clazz: 'any', // todo:
    },
    failedReason: {
      clazz: 'object',
    },
    data: {
      clazz: 'object',
    },
  },
  methods: {},
};

const JobRepeatOptions: TypeInformation = {
  clazzName: 'JobRepeatOptions',
  clazz: 'JobRepeatOptions',
  fields: {
    tz: {
      clazz: 'string',
    },
    endDate: {
      clazz: 'number',
    },
    limit: {
      clazz: 'number',
    },
    count: {
      clazz: 'number',
    },
    prevMillis: {
      clazz: 'number',
    },
    jobId: {
      clazz: 'string',
    },
    startDate: {
      clazz: 'number',
    },
    cron: {
      clazz: 'string',
    },
    every: {
      clazz: 'string',
    },
  },
};

const JobRemoveOptionDefinition: TypeInformation = {
  clazz: 'JobRemoveOption',
  clazzName: 'JobRemoveOption',
  union: [{ clazz: 'boolean' }, { clazz: 'number' }],
};

const JobOptionsDefinition: TypeInformation = {
  clazzName: '',
  clazz: 'JobOptions',
  fields: {
    timestamp: {
      clazz: 'number',
    },
    priority: {
      clazz: 'number',
    },
    delay: {
      clazz: 'number',
    },
    attempts: {
      clazz: 'number',
      description:
        'The total number of attempts to try the job until it completes.',
    },
    lifo: {
      clazz: 'boolean',
      description:
        'if true, adds the job to the right of the queue instead of the left (default false)',
    },
    timeout: {
      clazz: 'number',
      description:
        // eslint-disable-next-line max-len
        'The number of milliseconds after which the job should be fail with a timeout error [optional]',
    },
    repeat: {
      clazz: 'JobRepeatOptions',
    },
    rateLimiterKey: {
      clazz: 'string',
    },
    jobId: {
      clazz: 'string',
      description: 'Overridden job ID.',
    },
    removeOnComplete: {
      clazz: 'JobRemoveOption',
      description:
        'If true, removes the job when it successfully completes.' +
        '  A number specify the max amount of jobs to keep.' +
        '  Default behavior is to keep the job in the COMPLETED set.',
    },
    removeOnFail: {
      clazz: 'JobRemoveOption',
      description:
        'If true, removes the job when it fails after all attempts.' +
        '  A number specify the max amount of jobs to keep.' +
        '  Default behavior is to keep the job in the FAILED set.',
    }, //bool | int
    stackTraceLimit: {
      clazz: 'number',
      description:
        'Limits the amount of stack trace lines that will be recorded in the stacktrace.',
    },
  },
};

export const typesInformation = [
  StringDefinition,
  ArrayDefinition,
  JobDefinition,
  JobOptionsDefinition,
  JobRemoveOptionDefinition,
  JobRepeatOptions,
  {
    clazzName: 'org.A',
    methods: {
      fooString: { refClazz: { refClazzName: 'java.lang.String' } },
      barB: { refClazz: { refClazzName: 'org.B' } },
    },
  },
  {
    clazzName: 'org.AA',
    methods: {
      fooString: { refClazz: { refClazzName: 'java.lang.String' } },
      barB: { refClazz: { refClazzName: 'org.C' } },
    },
  },
  {
    clazzName: 'org.WithList',
    methods: {
      listField: {
        refClazz: {
          refClazzName: 'java.util.List',
          params: [{ refClazzName: 'org.A' }],
        },
      },
    },
  },
  {
    clazzName: { refClazzName: 'java.util.LocalDateTime' },
    methods: {
      isBefore: {
        refClazz: { refClazzName: 'java.lang.Boolean' },
        params: { name: 'arg0', refClazz: 'java.util.LocalDateTime' },
      },
    },
  },
  {
    clazzName: { refClazzName: 'org.Util' },
    methods: { now: { refClazz: { refClazzName: 'java.util.LocalDateTime' } } },
  },
];

const variables = {
  input: { refClazzName: 'org.A' },
  other: { refClazzName: 'org.C' },
  ANOTHER: { refClazzName: 'org.A' },
  job: {
    refClazzName: 'Job',
  },
  listVar: { refClazzName: 'org.WithList' },
  util: { refClazzName: 'org.Util' },
  union: {
    union: [
      { refClazzName: 'org.A' },
      { refClazzName: 'org.B' },
      { refClazzName: 'org.AA' },
    ],
  },
  dict: {
    dict: {
      id: 'fooDict',
      valueType: { refClazzName: 'org.A' },
    },
  },
};

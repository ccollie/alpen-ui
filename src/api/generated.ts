import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { [key: string]: any };
  Date: any;
  /** The `JSONSchema` scalar type represents JSONSchema values as specified by https://json-schema.org/draft/2019-09/json-schema-validation.html. */
  JSONSchema: { [key: string]: any };
  /** Job process. Either a number (percentage) or user specified data */
  JobProgress: string | number | Record<string, any>;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** Specifies the number of jobs to keep after an operation (e.g. complete or fail).A bool(true) causes a job to be removed after the action */
  JobRemoveOption: boolean | number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: number;
  /** Specifies a duration in milliseconds - either as an int or a string specification e.g. "2 min", "3 hr" */
  Duration: string | number;
};

export type Query = {
  __typename?: 'Query';
  /** Get the list of aggregate types available for metrics */
  aggregates: Array<Maybe<AggregateInfo>>;
  /** Get general app info */
  appInfo: AppInfo;
  /** Get a queue by id */
  queue?: Maybe<Queue>;
  job: Job;
  /** Validate job data against a schema previously defined on a queue */
  jobDataValidate: JobDataValidatePayload;
  /** Validate BullMQ job options structure */
  jobOptionsValidate: ValidateJobOptionsPayload;
  /** Find a queue by name */
  findQueue?: Maybe<Queue>;
  /** Get a Host by id */
  host?: Maybe<QueueHost>;
  /** Get the list of hosts managed by the server instance */
  hosts: Array<QueueHost>;
  /** Get a Host by name */
  hostByName?: Maybe<QueueHost>;
  notificationChannel?: Maybe<NotificationChannel>;
  /** Get the list of metrics available */
  metrics: Array<MetricInfo>;
  /** Get a queue JobFilter by id */
  queueJobFilter?: Maybe<JobFilter>;
  /** Returns the JSON Schema for the BullMq JobOptions type */
  jobOptionsSchema: Scalars['JSONSchema'];
  rule?: Maybe<Rule>;
  ruleAlert?: Maybe<RuleAlert>;
  /** Get a JSONSchema document previously set for a job name on a queue */
  queueJobSchema?: Maybe<JobSchema>;
};


export type QueryQueueArgs = {
  id: Scalars['ID'];
};


export type QueryJobArgs = {
  queueId: Scalars['ID'];
  id: Scalars['ID'];
};


export type QueryJobDataValidateArgs = {
  input: JobDataValidateInput;
};


export type QueryJobOptionsValidateArgs = {
  input: JobOptionsInput;
};


export type QueryFindQueueArgs = {
  hostName: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  queueName: Scalars['String'];
};


export type QueryHostArgs = {
  id: Scalars['ID'];
};


export type QueryHostByNameArgs = {
  name: Scalars['String'];
};


export type QueryNotificationChannelArgs = {
  hostId: Scalars['ID'];
  id: Scalars['ID'];
};


export type QueryQueueJobFilterArgs = {
  input?: Maybe<QueueJobFilterInput>;
};


export type QueryRuleArgs = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
};


export type QueryRuleAlertArgs = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
  alertId: Scalars['ID'];
};


export type QueryQueueJobSchemaArgs = {
  input?: Maybe<QueueJobSchemaInput>;
};

export type AggregateInfo = {
  __typename?: 'AggregateInfo';
  key: Scalars['String'];
  description: Scalars['String'];
};

export type AppInfo = {
  __typename?: 'AppInfo';
  /** The server environment (development, production, etc) */
  env: Scalars['String'];
  /** The app title */
  title: Scalars['String'];
  brand?: Maybe<Scalars['String']>;
  /** The api version */
  version: Scalars['String'];
  author?: Maybe<Scalars['String']>;
};

export type Queue = {
  __typename?: 'Queue';
  id: Scalars['String'];
  prefix: Scalars['String'];
  name: Scalars['String'];
  /** Compute the histogram of job data. */
  histogram: HistogramPayload;
  host: Scalars['String'];
  hostId: Scalars['ID'];
  isPaused: Scalars['Boolean'];
  jobCounts: JobCounts;
  jobNames: Array<Scalars['String']>;
  jobFilters: Array<JobFilter>;
  /** Get JSONSchema documents and job defaults previously set for a job names on a queue */
  jobSchemas: Array<JobSchema>;
  /** Incrementally iterate over a list of jobs filtered by mongo-compatible query criteria */
  jobSearch: JobSearchPayload;
  /** Fetch jobs based on a previously stored filter */
  jobsByFilter: JobSearchPayload;
  /** Get the average runtime duration of completed jobs in the queue */
  jobDurationAvg: Scalars['Int'];
  /** Get the average memory used by jobs in the queue */
  jobMemoryAvg: Scalars['Int'];
  /** Gets the last recorded queue stats snapshot for a metric */
  lastStatsSnapshot?: Maybe<StatsSnapshot>;
  /** Returns the number of jobs waiting to be processed. */
  pendingJobCount: Scalars['Int'];
  /** Compute a percentile distribution. */
  percentileDistribution: PercentileDistribution;
  repeatableJobs: Array<RepeatableJob>;
  /** Returns the number of repeatable jobs */
  repeatableJobCount: Scalars['Int'];
  /** Returns the count of rule alerts associated with a Queue */
  ruleAlertCount: Scalars['Int'];
  /** Gets rule alerts associated with the queue */
  ruleAlerts: Array<RuleAlert>;
  jobs: Array<Job>;
  rules: Array<Rule>;
  /** Queries for queue stats snapshots within a range */
  stats: Array<StatsSnapshot>;
  /** Aggregates queue statistics within a range */
  statsAggregate?: Maybe<StatsSnapshot>;
  /** Gets the time range of recorded stats for a queue/host */
  statsDateRange?: Maybe<StatsSpanPayload>;
  /** Gets the current job Throughput rates based on an exponential moving average */
  throughput: Meter;
  /** Gets the current job Errors rates based on an exponential moving average */
  errorRate: Meter;
  /** Gets the current job ErrorPercentage rates based on an exponential moving average */
  errorPercentageRate: Meter;
  /** Get the average time a job spends in the queue before being processed */
  waitTimeAvg: Scalars['Int'];
  workers: Array<QueueWorker>;
  workerCount: Scalars['Int'];
};


export type QueueHistogramArgs = {
  input: HistogramInput;
};


export type QueueJobFiltersArgs = {
  ids?: Maybe<Array<Scalars['ID']>>;
};


export type QueueJobSchemasArgs = {
  jobNames?: Maybe<Array<Scalars['String']>>;
};


export type QueueJobSearchArgs = {
  filter: JobSearchInput;
};


export type QueueJobsByFilterArgs = {
  filter: JobsByFilterIdInput;
};


export type QueueJobDurationAvgArgs = {
  jobName?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueueJobMemoryAvgArgs = {
  jobName?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueueLastStatsSnapshotArgs = {
  input?: Maybe<StatsLatestInput>;
};


export type QueuePercentileDistributionArgs = {
  input: PercentileDistributionInput;
};


export type QueueRepeatableJobsArgs = {
  input?: Maybe<RepeatableJobsInput>;
};


export type QueueRuleAlertsArgs = {
  input?: Maybe<QueueRuleAlertsInput>;
};


export type QueueJobsArgs = {
  input?: Maybe<QueueJobsInput>;
};


export type QueueStatsArgs = {
  input: StatsQueryInput;
};


export type QueueStatsAggregateArgs = {
  input: StatsQueryInput;
};


export type QueueStatsDateRangeArgs = {
  input: StatsSpanInput;
};


export type QueueThroughputArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueErrorRateArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueErrorPercentageRateArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueWaitTimeAvgArgs = {
  jobName?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};


export type QueueWorkersArgs = {
  limit?: Maybe<Scalars['Int']>;
};

/** Records histogram binning data */
export type HistogramInput = {
  /** An optional job name to filter on */
  jobName?: Maybe<Scalars['String']>;
  /** The metric requested */
  metric?: Maybe<StatsMetricType>;
  /** Stats snapshot granularity */
  granularity: StatsGranularity;
  /** An expression specifying the range to query e.g. yesterday, last_7days */
  range: Scalars['String'];
  /** Generate a "nice" bin count */
  pretty?: Maybe<Scalars['Boolean']>;
  /** Optional number of bins to select. */
  binCount?: Maybe<Scalars['Int']>;
  /** Method used to compute histogram bin count */
  binMethod?: Maybe<HistogramBinningMethod>;
  /** Optional minimum value to include in counts */
  minValue?: Maybe<Scalars['Float']>;
  /** Optional maximum value to include in counts */
  maxValue?: Maybe<Scalars['Float']>;
};

export enum StatsMetricType {
  Latency = 'Latency',
  Wait = 'Wait'
}

export enum StatsGranularity {
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Month = 'month',
  Week = 'week'
}

/** The method used to calculate the optimal bin width (and consequently number of bins) for a histogram */
export enum HistogramBinningMethod {
  /** Maximum of the ‘Sturges’ and ‘Freedman’ estimators. Provides good all around performance. */
  Auto = 'Auto',
  /** Calculate the number of bins based on the Sturges method */
  Sturges = 'Sturges',
  /** Calculate the number of histogram bins based on Freedman-Diaconis method */
  Freedman = 'Freedman'
}

/** Records histogram binning data */
export type HistogramPayload = {
  __typename?: 'HistogramPayload';
  /** The total number of values. */
  total: Scalars['Int'];
  /** The minimum value in the data range. */
  min: Scalars['Float'];
  /** The maximum value in the data range. */
  max: Scalars['Float'];
  /** The width of the bins */
  binWidth: Scalars['Float'];
  bins: Array<Maybe<HistogramBin>>;
};

export type HistogramBin = {
  __typename?: 'HistogramBin';
  count: Scalars['Int'];
  /** Lower bound of the bin */
  x0: Scalars['Float'];
  /** Upper bound of the bin */
  x1: Scalars['Float'];
};

/** The count of jobs according to status */
export type JobCounts = {
  __typename?: 'JobCounts';
  completed: Scalars['Int'];
  failed: Scalars['Int'];
  delayed: Scalars['Int'];
  active: Scalars['Int'];
  waiting: Scalars['Int'];
  paused: Scalars['Int'];
};

/** Options for filtering queue jobs */
export type JobFilter = {
  __typename?: 'JobFilter';
  id: Scalars['ID'];
  /** A descriptive name of the filter */
  name: Scalars['String'];
  /** Optional job status to filter jobs by */
  status?: Maybe<JobStatus>;
  /** A mongo compatible query filter */
  expression?: Maybe<Scalars['JSONObject']>;
  /** The date this filter was created */
  createdAt?: Maybe<Scalars['Date']>;
};

export enum JobStatus {
  Completed = 'completed',
  Waiting = 'waiting',
  Active = 'active',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused'
}



/** Options for validating job data */
export type JobSchema = {
  __typename?: 'JobSchema';
  jobName: Scalars['String'];
  /** The JSON schema associated with the job name */
  schema?: Maybe<Scalars['JSONSchema']>;
  /** Default options for jobs off this type created through the API */
  defaultOpts?: Maybe<Scalars['JSONObject']>;
};


export type JobSearchInput = {
  /** Search for jobs having this status */
  status?: Maybe<JobStatus>;
  /** A mongo-compatible filter job filter */
  criteria?: Maybe<Scalars['JSONObject']>;
  /** The iterator cursor. Iteration starts when the cursor is set to null, and terminates when the cursor returned by the server is null */
  cursor?: Maybe<Scalars['String']>;
  /** The maximum number of jobs to return per iteration */
  count: Scalars['Int'];
};

export type JobSearchPayload = {
  __typename?: 'JobSearchPayload';
  cursor?: Maybe<Scalars['String']>;
  jobs: Array<Job>;
};

export type Job = {
  __typename?: 'Job';
  id: Scalars['ID'];
  name: Scalars['String'];
  data: Scalars['JSONObject'];
  progress?: Maybe<Scalars['JobProgress']>;
  delay: Scalars['Int'];
  timestamp: Scalars['Date'];
  attemptsMade: Scalars['Int'];
  failedReason?: Maybe<Scalars['JSON']>;
  stacktrace: Array<Scalars['String']>;
  returnvalue?: Maybe<Scalars['JSON']>;
  finishedOn?: Maybe<Scalars['Date']>;
  processedOn?: Maybe<Scalars['Date']>;
  opts: JobOptions;
  state: JobStatus;
  queueId: Scalars['String'];
  logs: JobLogs;
};


export type JobLogsArgs = {
  start?: Scalars['Int'];
  end?: Scalars['Int'];
};



export type JobOptions = {
  __typename?: 'JobOptions';
  timestamp?: Maybe<Scalars['Date']>;
  /** Ranges from 1 (highest priority) to MAX_INT  (lowest priority). Note that using priorities has a slight impact on performance, so do not use it if not required. */
  priority?: Maybe<Scalars['Int']>;
  /**
   * An amount of milliseconds to wait until this job can be processed. 
   * Note that for accurate delays, worker and producers should have their clocks synchronized.
   */
  delay?: Maybe<Scalars['Int']>;
  /** The total number of attempts to try the job until it completes. */
  attempts?: Maybe<Scalars['Int']>;
  /** Backoff setting for automatic retries if the job fails */
  backoff?: Maybe<Scalars['JSON']>;
  /** if true, adds the job to the right of the queue instead of the left (default false) */
  lifo?: Maybe<Scalars['Boolean']>;
  /** The number of milliseconds after which the job should be fail with a timeout error [optional] */
  timeout?: Maybe<Scalars['Int']>;
  /** Override the job ID - by default, the job ID is a unique integer, but you can use this setting to override it. If you use this option, it is up to you to ensure the jobId is unique. If you attempt to add a job with an id that already exists, it will not be added. */
  jobId?: Maybe<Scalars['String']>;
  /** If true, removes the job when it successfully completes.  A number specify the max amount of jobs to keep.  Default behavior is to keep the job in the COMPLETED set. */
  removeOnComplete?: Maybe<Scalars['JobRemoveOption']>;
  /** If true, removes the job when it fails after all attempts.  A number specify the max amount of jobs to keep.  Default behavior is to keep the job in the FAILED set. */
  removeOnFail?: Maybe<Scalars['JobRemoveOption']>;
  /** Limits the amount of stack trace lines that will be recorded in the stacktrace. */
  stackTraceLimit?: Maybe<Scalars['Int']>;
  /** Job repeat options */
  repeat?: Maybe<JobRepeatOptions>;
};


export type JobRepeatOptions = {
  __typename?: 'JobRepeatOptions';
  tz?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  limit?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  prevMillis?: Maybe<Scalars['Int']>;
  jobId?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Date']>;
  cron?: Maybe<Scalars['String']>;
  every?: Maybe<Scalars['String']>;
};

export type JobLogs = {
  __typename?: 'JobLogs';
  count: Scalars['Int'];
  items: Array<Scalars['String']>;
};

export type JobsByFilterIdInput = {
  /** The id of the filter */
  filterId: Scalars['ID'];
  /** The iterator cursor. Iteration starts when the cursor is set to 0, and terminates when the cursor returned by the server is 0 */
  cursor?: Maybe<Scalars['Int']>;
  /** The maximum number of jobs to return per iteration */
  count: Scalars['Int'];
};

/** Queue stats filter to getting latest snapshot. */
export type StatsLatestInput = {
  /** An optional job name to filter on */
  jobName?: Maybe<Scalars['String']>;
  /** The metric requested */
  metric?: Maybe<StatsMetricType>;
  /** Stats snapshot granularity */
  granularity?: Maybe<StatsGranularity>;
};

/** Queue job stats snapshot. */
export type StatsSnapshot = JobStatsInterface & {
  __typename?: 'StatsSnapshot';
  /** The sample size */
  count: Scalars['Int'];
  /** The number of failed jobs in the sample interval */
  failed: Scalars['Int'];
  /** The number of completed jobs in the sample interval */
  completed: Scalars['Int'];
  /** The start of the interval */
  startTime: Scalars['Date'];
  /** The end of the interval */
  endTime: Scalars['Date'];
  /** The average of values during the period */
  mean: Scalars['Float'];
  /** The standard deviation of the dataset over the sample period */
  stddev: Scalars['Float'];
  /** The minimum value in the data set */
  min: Scalars['Float'];
  /** The maximum value in the data set */
  max: Scalars['Float'];
  /** The median value of the data set */
  median: Scalars['Float'];
  /** The 25th percentile */
  p90: Scalars['Float'];
  /** The 95th percentile */
  p95: Scalars['Float'];
  /** The 99th percentile */
  p99: Scalars['Float'];
  /** The 99.5th percentile */
  p995: Scalars['Float'];
  /** The average rate of events over the entire lifetime of measurement (e.g., the total number of requests handled, divided by the number of seconds the process has been running), it doesn’t offer a sense of recency. */
  meanRate: Scalars['Float'];
  /** One minute exponentially weighted moving average */
  m1Rate: Scalars['Float'];
  /** Five minute exponentially weighted moving average */
  m5Rate: Scalars['Float'];
  /** Fifteen minute exponentially weighted moving average */
  m15Rate: Scalars['Float'];
};

/** Base implementation for job stats information. */
export type JobStatsInterface = {
  /** The sample size */
  count: Scalars['Int'];
  /** The number of failed jobs in the sample interval */
  failed: Scalars['Int'];
  /** The number of completed jobs in the sample interval */
  completed: Scalars['Int'];
  /** The start of the interval */
  startTime: Scalars['Date'];
  /** The end of the interval */
  endTime: Scalars['Date'];
};

/** Records histogram binning data */
export type PercentileDistributionInput = {
  /** An optional job name to filter on */
  jobName?: Maybe<Scalars['String']>;
  /** The metric requested */
  metric?: Maybe<StatsMetricType>;
  /** Stats snapshot granularity */
  granularity: StatsGranularity;
  /** An expression specifying the range to query e.g. yesterday, last_7days */
  range: Scalars['String'];
  /** The percentiles to get frequencies for */
  percentiles: Array<Scalars['Float']>;
};

/** Percentile distribution of metric values */
export type PercentileDistribution = {
  __typename?: 'PercentileDistribution';
  /** The total number of values. */
  totalCount: Scalars['Int'];
  /** The minimum value in the data range. */
  min: Scalars['Float'];
  /** The maximum value in the data range. */
  max: Scalars['Float'];
  percentiles: Array<Maybe<PercentileCount>>;
};

export type PercentileCount = {
  __typename?: 'PercentileCount';
  count: Scalars['Int'];
  /** The percentile value */
  value: Scalars['Float'];
};

export type RepeatableJobsInput = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<SortOrderEnum>;
};

export enum SortOrderEnum {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type RepeatableJob = {
  __typename?: 'RepeatableJob';
  key: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** Date when the repeat job should stop repeating (only with cron). */
  endDate?: Maybe<Scalars['Date']>;
  /** The timezone for the job */
  tz?: Maybe<Scalars['String']>;
  cron?: Maybe<Scalars['String']>;
  /** Human readable description of the cron expression */
  descr?: Maybe<Scalars['String']>;
  next?: Maybe<Scalars['Date']>;
};

/** Options for retrieving queue rule alerts */
export type QueueRuleAlertsInput = {
  /** Consider alerts starting on or after this date */
  startDate?: Maybe<Scalars['Date']>;
  /** Consider alerts ending on or before this date */
  endDate?: Maybe<Scalars['Date']>;
  /** The sort order of the results. Alerts are sorted by creation date. */
  sortOrder?: Maybe<SortOrderEnum>;
  /** The maximum number of alerts to return */
  limit: Scalars['Int'];
};

/** An event recording the occurrence of an rule violation or reset */
export type RuleAlert = {
  __typename?: 'RuleAlert';
  id: Scalars['ID'];
  /** The event that raised this alert */
  event: Scalars['String'];
  /** Timestamp of when this alert was raised */
  start: Scalars['DateTime'];
  /** Timestamp of when this alert was reset */
  end?: Maybe<Scalars['DateTime']>;
  /** The value of the alert threshold set in the rule’s alert conditions. */
  threshold: Scalars['Float'];
  /** The metric value that crossed the threshold. */
  value: Scalars['Float'];
  /** The metric value that reset the threshold. */
  resetValue?: Maybe<Scalars['Float']>;
  /** State that triggered alert */
  state?: Maybe<Scalars['JSONObject']>;
  /** The number of violations before this alert was generated */
  violations: Scalars['Int'];
  /** Optional rule specific data. Corresponds to Rule.payload */
  payload?: Maybe<Scalars['JSONObject']>;
  /** Error level */
  errorLevel?: Maybe<ErrorLevel>;
  /** A categorization of the severity of the rule type */
  severity?: Maybe<Severity>;
};


export enum ErrorLevel {
  Critical = 'CRITICAL',
  Warning = 'WARNING',
  None = 'NONE'
}

export enum Severity {
  Warning = 'WARNING',
  Critical = 'CRITICAL',
  Error = 'ERROR',
  Info = 'INFO'
}

export type QueueJobsInput = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  status?: Maybe<JobStatus>;
  sortOrder?: Maybe<SortOrderEnum>;
};

export type Rule = {
  __typename?: 'Rule';
  /** The rule id */
  id: Scalars['ID'];
  /** The names of the rule */
  name: Scalars['String'];
  /** A helpful description of the rule */
  description?: Maybe<Scalars['String']>;
  /** The rule creation timestamp */
  createdAt: Scalars['Date'];
  /** The timestamp of last update */
  updatedAt: Scalars['Date'];
  /** The current rule states */
  state?: Maybe<RuleState>;
  severity?: Maybe<Severity>;
  /** Is this rule active or not */
  isActive: Scalars['Boolean'];
  metric: RuleMetric;
  condition: RuleCondition;
  /** Optional text for message when an alert is raised. Markdown and handlebars supported */
  message?: Maybe<Scalars['String']>;
  /** channels for alert notifications. */
  channels: Array<Scalars['String']>;
  /** Optional data passed on to alerts */
  payload?: Maybe<Scalars['JSONObject']>;
  /** Options controlling the generation of events */
  options?: Maybe<RuleAlertOptions>;
  alerts: Array<Maybe<RuleAlert>>;
  /** The total number of alerts raised for this rule */
  alertCount: Scalars['Int'];
};


export type RuleAlertsArgs = {
  input: RuleAlertsInput;
};

export enum RuleState {
  Warning = 'WARNING',
  Normal = 'NORMAL',
  Error = 'ERROR',
  Muted = 'MUTED'
}

export type RuleMetric = {
  __typename?: 'RuleMetric';
  type: Scalars['String'];
  options?: Maybe<Scalars['JSONObject']>;
};

/** Describes a queue condition were monitoring. */
export type RuleCondition = {
  /** The value needed to trigger an error notification */
  errorThreshold: Scalars['Float'];
  /** The value needed to trigger an warning notification */
  warningThreshold?: Maybe<Scalars['Float']>;
};

/** Options for raising alerts for a Rule */
export type RuleAlertOptions = {
  __typename?: 'RuleAlertOptions';
  /** a timeout after startup (in ms) during which no alerts are raised, irrespective of the truthiness of the rule condition. */
  warmupWindow?: Maybe<Scalars['Duration']>;
  /** The minimum number of violations before an alert can be raised */
  minViolations?: Maybe<Scalars['Int']>;
  /**
   * The max number of alerts to receive per event trigger in case the condition is met.
   *  In this case the "event" is a single period between the rule VIOLATION and RESET states.
   */
  maxAlertsPerEvent?: Maybe<Scalars['Int']>;
  /**
   * Duration (ms) for which a metric is anomalous before triggering a violation.
   * After a rule violation is encountered, no alerts are dispatched until this period has passed. This is useful for events which are normally transient by may periodically persist longer than usual, or for not sending notifications out too quickly.
   */
  triggerWindow?: Maybe<Scalars['Duration']>;
  /** How long an anomalous metric must be normal before resetting an alert's states to NORMAL. In conjunction with "alertOnReset", this can be used to prevent a possible storm of notifications when a rule condition passes and fails in rapid succession ("flapping") */
  recoveryWindow?: Maybe<Scalars['Duration']>;
  /** If specified, the minimum time between alerts for the same incident */
  renotifyInterval?: Maybe<Scalars['Duration']>;
  /** Raise an alert after an event trigger when the situation returns to normal */
  alertOnReset?: Maybe<Scalars['Boolean']>;
};


export type RuleAlertsInput = {
  start?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['Int']>;
  sortOrder?: Maybe<SortOrderEnum>;
};

/** Queue stats filter. */
export type StatsQueryInput = {
  /** An optional job name to filter on */
  jobName?: Maybe<Scalars['String']>;
  /** The metric requested */
  metric?: Maybe<StatsMetricType>;
  /** Stats snapshot granularity */
  granularity: StatsGranularity;
  /** An expression specifying the range to query e.g. yesterday, last_7days */
  range: Scalars['String'];
};

export type StatsSpanInput = {
  /** The host/queue to query */
  id: Scalars['ID'];
  jobName?: Maybe<Scalars['String']>;
  granularity?: Maybe<StatsGranularity>;
};

export type StatsSpanPayload = {
  __typename?: 'StatsSpanPayload';
  start: Scalars['Date'];
  end: Scalars['Date'];
};

/** Queue stats rates filter. */
export type StatsRateQueryInput = {
  /** An optional job name to filter on */
  jobName?: Maybe<Scalars['String']>;
  /** Stats snapshot granularity */
  granularity: StatsGranularity;
  /** An expression specifying the range to query e.g. yesterday, last_7days */
  range: Scalars['String'];
};

/** Records the rate of events over an interval using an exponentially moving average */
export type Meter = {
  __typename?: 'Meter';
  /** The number of samples. */
  count: Scalars['Int'];
  /** The average rate since the meter was started. */
  meanRate: Scalars['Float'];
  /** The 1 minute average */
  m1Rate: Scalars['Float'];
  /** The 5 minute average */
  m5Rate: Scalars['Float'];
  /** The 15 minute average */
  m15Rate: Scalars['Float'];
};

export type QueueWorker = {
  __typename?: 'QueueWorker';
  id?: Maybe<Scalars['String']>;
  /** address of the client */
  addr: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  /** total duration of the connection (in seconds) */
  age: Scalars['Int'];
  /** Idle time of the connection (in seconds) */
  idle: Scalars['Int'];
  /** Date/time when the connection started */
  started?: Maybe<Scalars['DateTime']>;
  /** the current database number */
  db: Scalars['Int'];
  role?: Maybe<Scalars['String']>;
  sub: Scalars['Int'];
  multi: Scalars['Int'];
  qbuf: Scalars['Int'];
  qbufFree: Scalars['Int'];
  obl: Scalars['Int'];
  oll: Scalars['Int'];
  omem: Scalars['Int'];
};

export type JobDataValidateInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
  data?: Maybe<Scalars['JSONObject']>;
  opts?: Maybe<JobOptionsInput>;
};

export type JobOptionsInput = {
  timestamp?: Maybe<Scalars['Date']>;
  /** Ranges from 1 (highest priority) to MAX_INT  (lowest priority). Note that using priorities has a slight impact on performance, so do not use it if not required. */
  priority?: Maybe<Scalars['Int']>;
  /**
   * An amount of milliseconds to wait until this job can be processed. 
   * Note that for accurate delays, worker and producers should have their clocks synchronized.
   */
  delay?: Maybe<Scalars['Int']>;
  /** The total number of attempts to try the job until it completes. */
  attempts?: Maybe<Scalars['Int']>;
  /** Backoff setting for automatic retries if the job fails */
  backoff?: Maybe<Scalars['JSON']>;
  /** if true, adds the job to the right of the queue instead of the left (default false) */
  lifo?: Maybe<Scalars['Boolean']>;
  /** The number of milliseconds after which the job should be fail with a timeout error [optional] */
  timeout?: Maybe<Scalars['Int']>;
  /** Override the job ID - by default, the job ID is a unique integer, but you can use this setting to override it. If you use this option, it is up to you to ensure the jobId is unique. If you attempt to add a job with an id that already exists, it will not be added. */
  jobId?: Maybe<Scalars['String']>;
  /** If true, removes the job when it successfully completes.  A number specify the max amount of jobs to keep.  Default behavior is to keep the job in the COMPLETED set. */
  removeOnComplete?: Maybe<Scalars['JobRemoveOption']>;
  /** If true, removes the job when it fails after all attempts.  A number specify the max amount of jobs to keep.  Default behavior is to keep the job in the FAILED set. */
  removeOnFail?: Maybe<Scalars['JobRemoveOption']>;
  /** Limits the amount of stack trace lines that will be recorded in the stacktrace. */
  stackTraceLimit?: Maybe<Scalars['Int']>;
  repeat?: Maybe<JobRepeatOptionsCronInput>;
};

export type JobRepeatOptionsCronInput = {
  tz?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  limit?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  prevMillis?: Maybe<Scalars['Int']>;
  jobId?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Date']>;
  cron: Scalars['String'];
};

export type JobDataValidatePayload = {
  __typename?: 'JobDataValidatePayload';
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
};

export type ValidateJobOptionsPayload = {
  __typename?: 'ValidateJobOptionsPayload';
  isValid: Scalars['Boolean'];
  errors: Array<Scalars['String']>;
};

export type QueueHost = {
  __typename?: 'QueueHost';
  id: Scalars['ID'];
  /** The name of the host */
  name: Scalars['String'];
  /** An optional description of the host */
  description?: Maybe<Scalars['String']>;
  /** The queues registered for this host */
  queues: Array<Queue>;
  /** The count of queues registered for this host */
  queueCount: Scalars['Int'];
  /** Notification channels for alerts */
  channels: Array<NotificationChannel>;
  /** Discover Bull queues on the given host */
  discoverQueues: Array<DiscoverQueuesPayload>;
  /** Gets the current job ErrorPercentage rates for a host based on an exponential moving average */
  errorPercentageRate: Meter;
  /** Gets the current job Errors rates for a host based on an exponential moving average */
  errorRate: Meter;
  /** Compute the histogram of job data. */
  histogram: HistogramPayload;
  /** Get job counts for a host */
  jobCounts: JobCounts;
  /** Gets the last recorded queue stats snapshot for a metric */
  lastStatsSnapshot?: Maybe<StatsSnapshot>;
  /** Compute a percentile distribution. */
  percentileDistribution: PercentileDistribution;
  ping: PingPayload;
  redis: RedisInfo;
  /** Queries for queue stats snapshots within a range */
  stats: Array<StatsSnapshot>;
  /** Aggregates queue statistics within a range */
  statsAggregate?: Maybe<StatsSnapshot>;
  /** Gets the time range of recorded stats for a queue/host */
  statsDateRange?: Maybe<StatsSpanPayload>;
  /** Gets the current job Throughput rates for a host based on an exponential moving average */
  throughput: Meter;
  uri: Scalars['String'];
  /** Returns the number of workers associated with managed queues on this host */
  workerCount: Scalars['Int'];
  workers: Array<QueueWorker>;
};


export type QueueHostQueuesArgs = {
  filter?: Maybe<HostQueuesFilter>;
};


export type QueueHostDiscoverQueuesArgs = {
  prefix?: Maybe<Scalars['String']>;
  unregisteredOnly?: Maybe<Scalars['Boolean']>;
};


export type QueueHostErrorPercentageRateArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueHostErrorRateArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueHostHistogramArgs = {
  input: HistogramInput;
};


export type QueueHostLastStatsSnapshotArgs = {
  input?: Maybe<StatsLatestInput>;
};


export type QueueHostPercentileDistributionArgs = {
  input: PercentileDistributionInput;
};


export type QueueHostStatsArgs = {
  input: StatsQueryInput;
};


export type QueueHostStatsAggregateArgs = {
  input: StatsQueryInput;
};


export type QueueHostStatsDateRangeArgs = {
  input: StatsSpanInput;
};


export type QueueHostThroughputArgs = {
  input?: Maybe<StatsRateQueryInput>;
};


export type QueueHostWorkersArgs = {
  limit?: Maybe<Scalars['Int']>;
};

export type HostQueuesFilter = {
  /** Regex pattern for queue name matching */
  search?: Maybe<Scalars['String']>;
  /** Queue prefix */
  prefix?: Maybe<Scalars['String']>;
  /** Filter based on paused state */
  isPaused?: Maybe<Scalars['Boolean']>;
  /** Filter based on "active" status (true if the queue has at least one worker)  */
  isActive?: Maybe<Scalars['Boolean']>;
};

/** NotificationChannels provide a consistent ways for users to be notified about incidents. */
export type NotificationChannel = {
  id: Scalars['ID'];
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Timestamp of channel creation */
  createdAt?: Maybe<Scalars['Date']>;
  /** Timestamp of last channel update */
  updatedAt?: Maybe<Scalars['Date']>;
};

export type DiscoverQueuesPayload = {
  __typename?: 'DiscoverQueuesPayload';
  /** The queue name */
  name: Scalars['String'];
  /** The queue prefix */
  prefix: Scalars['String'];
};

export type PingPayload = {
  __typename?: 'PingPayload';
  latency: Scalars['Int'];
};

export type RedisInfo = {
  __typename?: 'RedisInfo';
  redis_version: Scalars['String'];
  tcp_port?: Maybe<Scalars['Int']>;
  uptime_in_seconds: Scalars['Int'];
  uptime_in_days: Scalars['Int'];
  connected_clients: Scalars['Int'];
  blocked_clients: Scalars['Int'];
  total_system_memory: Scalars['Int'];
  used_memory: Scalars['Int'];
  used_memory_peak: Scalars['Int'];
  used_memory_lua: Scalars['Int'];
  used_cpu_sys: Scalars['Float'];
  maxmemory: Scalars['Int'];
  number_of_cached_scripts: Scalars['Int'];
  instantaneous_ops_per_sec: Scalars['Int'];
  mem_fragmentation_ratio?: Maybe<Scalars['Float']>;
  role?: Maybe<Scalars['String']>;
};

export type MetricInfo = {
  __typename?: 'MetricInfo';
  key: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  category?: Maybe<MetricCategory>;
  type?: Maybe<MetricType>;
  unit?: Maybe<Scalars['String']>;
  isPolling: Scalars['Boolean'];
};

export enum MetricCategory {
  Host = 'HOST',
  Redis = 'REDIS',
  Queue = 'QUEUE'
}

export enum MetricType {
  Gauge = 'Gauge',
  Rate = 'Rate',
  Count = 'Count'
}

export type QueueJobFilterInput = {
  queueId: Scalars['ID'];
  fieldId: Scalars['ID'];
};

export type QueueJobSchemaInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  mailNotificationChannelAdd: MailNotificationChannel;
  slackNotificationChannelAdd: SlackNotificationChannel;
  /** Add a webhook notification channel */
  webhookNotificationChannelAdd: WebhookNotificationChannel;
  notificationChannelEnable: NotificationChannelEnablePayload;
  notificationChannelDisable: NotificationChannelDisablePayload;
  notificationChannelDelete: NotificationChannelDeletePayload;
  jobAdd: Job;
  jobAddBulk?: Maybe<JobAddBulkPayload>;
  jobAddCron: JobAddCronPayload;
  jobAddEvery: JobAddEveryPayload;
  jobDiscard: JobDiscardPayload;
  jobPromote: JobPromotePayload;
  jobRemove: JobRemovePayload;
  /** Bulk deletes a list of jobs by id */
  jobRemoveBulk?: Maybe<BulkJobActionPayload>;
  jobRetry: JobRetryPayload;
  jobUpdate: JobUpdatePayload;
  jobLogAdd: JobLogAddPayload;
  jobMoveToCompleted: JobMoveToCompletedPayload;
  /** Moves job from active to delayed. */
  jobMoveToDelayed: JobMoveToDelayedPayload;
  jobMoveToFailed: JobMoveToFailedPayload;
  /** Bulk promotes a list of jobs by id */
  jobPromoteBulk?: Maybe<BulkJobActionPayload>;
  /** Bulk retries a list of jobs by id */
  jobRetryBulk?: Maybe<BulkJobActionPayload>;
  repeatableJobRemoveByKey: RepeatableJobRemoveByKeyPayload;
  repeatableJobRemove: QueueRemoveRepeatablePayload;
  /** Remove all jobs created outside of a grace interval in milliseconds. You can clean the jobs with the following states: COMPLETED, wait (typo for WAITING), isActive, DELAYED, and FAILED. */
  queueClean: QueueCleanPayload;
  /** Drains the queue, i.e., removes all jobs that are waiting or delayed, but not active, completed or failed. */
  queueDrain: QueueDrainPayload;
  /**
   * Pause the queue.
   * 
   * A PAUSED queue will not process new jobs until resumed, but current jobs being processed will continue until they are finalized.
   */
  queuePause: QueuePausePayload;
  /** Resume a queue after being PAUSED. */
  queueResume: QueueResumePayload;
  queueDelete: QueueDeletePayload;
  /** Start tracking a queue */
  queueRegister: Queue;
  /** Stop tracking a queue */
  queueUnregister: QueueUnregisterPayload;
  /** Add a named job filter */
  queueJobFilterCreate: JobFilter;
  /** Associate a JSON schema with a job name on a queue */
  queueJobSchemaSet: JobSchema;
  /** Delete a schema associated with a job name on a queue */
  queueJobSchemaDelete: QueueJobSchemaDeletePayload;
  /** Delete a job filter */
  queueJobFilterDelete: QueueJobFilterDeletePayload;
  /** Delete all stats associated with a queue */
  queueStatsDelete: QueueStatsDeletePayload;
  /** Delete a rule alert */
  ruleAlertDelete: RuleAlertDeletePayload;
  /** Removes all alerts associated with a rule */
  ruleAlertClear: RuleAlertsClearPayload;
  /** Delete a rule */
  ruleDelete: RuleDeletePayload;
  /** Create a rule for a queue */
  ruleAdd: RuleAddPayload;
  /** Removes all alerts associated with a rule */
  ruleActivate: RuleActivatePayload;
  /** Removes all alerts associated with a rule */
  ruleDeactivate: RuleDeactivatePayload;
};


export type MutationMailNotificationChannelAddArgs = {
  input?: Maybe<MailNotificationChannelInput>;
};


export type MutationSlackNotificationChannelAddArgs = {
  input?: Maybe<SlackNotificationChannelInput>;
};


export type MutationWebhookNotificationChannelAddArgs = {
  input?: Maybe<WebhookNotificationChannelInput>;
};


export type MutationNotificationChannelEnableArgs = {
  hostId: Scalars['String'];
  channelId: Scalars['ID'];
};


export type MutationNotificationChannelDisableArgs = {
  hostId: Scalars['String'];
  channelId: Scalars['ID'];
};


export type MutationNotificationChannelDeleteArgs = {
  hostId: Scalars['String'];
  channelId: Scalars['ID'];
};


export type MutationJobAddArgs = {
  input?: Maybe<JobAddInput>;
};


export type MutationJobAddBulkArgs = {
  queueId: Scalars['String'];
  jobs: Array<Maybe<BulkJobItemInput>>;
};


export type MutationJobAddCronArgs = {
  input: JobAddCronInput;
};


export type MutationJobAddEveryArgs = {
  input?: Maybe<JobAddEveryInput>;
};


export type MutationJobDiscardArgs = {
  input: JobLocatorInput;
};


export type MutationJobPromoteArgs = {
  input: JobLocatorInput;
};


export type MutationJobRemoveArgs = {
  input: JobLocatorInput;
};


export type MutationJobRemoveBulkArgs = {
  input: BulkJobActionInput;
};


export type MutationJobRetryArgs = {
  input: JobLocatorInput;
};


export type MutationJobUpdateArgs = {
  input: JobUpdateInput;
};


export type MutationJobLogAddArgs = {
  queueId: Scalars['String'];
  id: Scalars['String'];
  row: Scalars['String'];
};


export type MutationJobMoveToCompletedArgs = {
  input: JobLocatorInput;
};


export type MutationJobMoveToDelayedArgs = {
  input?: Maybe<JobMoveToDelayedInput>;
};


export type MutationJobMoveToFailedArgs = {
  input?: Maybe<JobMoveToFailedInput>;
};


export type MutationJobPromoteBulkArgs = {
  input: BulkJobActionInput;
};


export type MutationJobRetryBulkArgs = {
  input: BulkJobActionInput;
};


export type MutationRepeatableJobRemoveByKeyArgs = {
  input: RepeatableJobRemoveByKeyInput;
};


export type MutationRepeatableJobRemoveArgs = {
  id: Scalars['ID'];
  jobName?: Maybe<Scalars['String']>;
  repeat: RepeatableJobRemoveOptions;
};


export type MutationQueueCleanArgs = {
  input: QueueCleanFilter;
};


export type MutationQueueDrainArgs = {
  id: Scalars['ID'];
  delayed?: Maybe<Scalars['Boolean']>;
};


export type MutationQueuePauseArgs = {
  id: Scalars['ID'];
};


export type MutationQueueResumeArgs = {
  id: Scalars['ID'];
};


export type MutationQueueDeleteArgs = {
  id: Scalars['ID'];
  options?: Maybe<QueueDeleteOptions>;
};


export type MutationQueueRegisterArgs = {
  input?: Maybe<RegisterQueueInput>;
};


export type MutationQueueUnregisterArgs = {
  id: Scalars['ID'];
};


export type MutationQueueJobFilterCreateArgs = {
  input: JobFilterInput;
};


export type MutationQueueJobSchemaSetArgs = {
  input: JobSchemaInput;
};


export type MutationQueueJobSchemaDeleteArgs = {
  input: QueueJobSchemaDeleteInput;
};


export type MutationQueueJobFilterDeleteArgs = {
  input: QueueJobFilterDeleteInput;
};


export type MutationQueueStatsDeleteArgs = {
  input: QueueStatsDeleteInput;
};


export type MutationRuleAlertDeleteArgs = {
  input: RuleAlertDeleteInput;
};


export type MutationRuleAlertClearArgs = {
  input: RuleAlertsClearInput;
};


export type MutationRuleDeleteArgs = {
  input: RuleDeleteInput;
};


export type MutationRuleAddArgs = {
  input: RuleAddInput;
};


export type MutationRuleActivateArgs = {
  input: RuleActivateInput;
};


export type MutationRuleDeactivateArgs = {
  input: RuleDeactivateInput;
};

export type MailNotificationChannelInput = {
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Emails of notification recipients */
  recipients: Array<Scalars['String']>;
  /** the host to add the channel to */
  hostId: Scalars['ID'];
};

/** A channel which sends notifications through email */
export type MailNotificationChannel = NotificationChannel & {
  __typename?: 'MailNotificationChannel';
  id: Scalars['ID'];
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Timestamp of channel creation */
  createdAt?: Maybe<Scalars['Date']>;
  /** Timestamp of last channel update */
  updatedAt?: Maybe<Scalars['Date']>;
  /** Emails of notification recipients */
  recipients: Array<Scalars['String']>;
};

export type SlackNotificationChannelInput = {
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** The slack webhook to post messages to */
  webhook: Scalars['String'];
  /** The slack webhook to post messages to */
  channel?: Maybe<Scalars['String']>;
  /** A valid slack auth token. Not needed if a webhook is specified */
  token?: Maybe<Scalars['String']>;
  /** the host to add the channel to */
  hostId: Scalars['ID'];
};

/** A channel which sends notifications through slack */
export type SlackNotificationChannel = NotificationChannel & {
  __typename?: 'SlackNotificationChannel';
  id: Scalars['ID'];
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Timestamp of channel creation */
  createdAt?: Maybe<Scalars['Date']>;
  /** Timestamp of last channel update */
  updatedAt?: Maybe<Scalars['Date']>;
  /** The slack webhook to post messages to */
  webhook: Scalars['String'];
  /** The slack webhook to post messages to */
  channel?: Maybe<Scalars['String']>;
  /** A valid slack auth token. Not needed if a webhook is specified */
  token?: Maybe<Scalars['String']>;
};

export type WebhookNotificationChannelInput = {
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Url to send data to */
  url: Scalars['String'];
  /** The HTTP method to use */
  method?: Maybe<HttpMethodEnum>;
  /** Optional request headers */
  headers?: Maybe<Scalars['JSONObject']>;
  /** Milliseconds to wait for the server to end the response before aborting the client. By default, there is no timeout. */
  timeout?: Maybe<Scalars['Duration']>;
  /** The number of times to retry the client */
  retry?: Maybe<Scalars['Int']>;
  /** Defines if redirect responses should be followed automatically. */
  followRedirect?: Maybe<Scalars['Boolean']>;
  /** Set this to true to allow sending body for the GET method. This option is only meant to interact with non-compliant servers when you have no other choice. */
  allowGetBody?: Maybe<Scalars['Boolean']>;
  /** Optional success http status codes. Defaults to http codes 200 - 206 */
  httpSuccessCodes?: Maybe<Array<Scalars['Int']>>;
  /** the host to add the channel to */
  hostId: Scalars['ID'];
};

export enum HttpMethodEnum {
  Get = 'GET',
  Post = 'POST'
}

/** A channel that posts notifications to a webhook */
export type WebhookNotificationChannel = NotificationChannel & {
  __typename?: 'WebhookNotificationChannel';
  id: Scalars['ID'];
  /** The type of the channel, e.g. slack, email, webhook etc */
  type: Scalars['String'];
  /** The name of the channel */
  name: Scalars['String'];
  /** Is the channel enabled ? */
  enabled: Scalars['Boolean'];
  /** Timestamp of channel creation */
  createdAt?: Maybe<Scalars['Date']>;
  /** Timestamp of last channel update */
  updatedAt?: Maybe<Scalars['Date']>;
  /** Url to send data to */
  url: Scalars['String'];
  /** The HTTP method to use */
  method?: Maybe<HttpMethodEnum>;
  /** Optional request headers */
  headers?: Maybe<Scalars['JSONObject']>;
  /** Milliseconds to wait for the server to end the response before aborting the client. By default, there is no timeout. */
  timeout?: Maybe<Scalars['Duration']>;
  /** The number of times to retry the client */
  retry?: Maybe<Scalars['Int']>;
  /** Defines if redirect responses should be followed automatically. */
  followRedirect?: Maybe<Scalars['Boolean']>;
  /** Set this to true to allow sending body for the GET method. This option is only meant to interact with non-compliant servers when you have no other choice. */
  allowGetBody?: Maybe<Scalars['Boolean']>;
  /** Optional success http status codes. Defaults to http codes 200 - 206 */
  httpSuccessCodes?: Maybe<Array<Scalars['Int']>>;
};

export type NotificationChannelEnablePayload = {
  __typename?: 'NotificationChannelEnablePayload';
  updated: Scalars['Boolean'];
};

export type NotificationChannelDisablePayload = {
  __typename?: 'NotificationChannelDisablePayload';
  updated: Scalars['Boolean'];
};

export type NotificationChannelDeletePayload = {
  __typename?: 'NotificationChannelDeletePayload';
  hostId: Scalars['String'];
  channelId: Scalars['ID'];
  deleted: Scalars['Boolean'];
};

export type JobAddInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
  data?: Maybe<Scalars['JSONObject']>;
  options?: Maybe<JobOptionsInput>;
};

export type BulkJobItemInput = {
  name: Scalars['String'];
  data: Scalars['JSONObject'];
  options?: Maybe<JobOptionsInput>;
};

export type JobAddBulkPayload = {
  __typename?: 'JobAddBulkPayload';
  jobs: Array<Maybe<Job>>;
};

export type JobAddCronInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['ID'];
  data?: Maybe<Scalars['JSONObject']>;
  options?: Maybe<JobOptionsInput>;
};

export type JobAddCronPayload = {
  __typename?: 'JobAddCronPayload';
  job?: Maybe<Job>;
};

export type JobAddEveryInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['ID'];
  data?: Maybe<Scalars['JSONObject']>;
  options?: Maybe<JobOptionsInput>;
};

export type JobAddEveryPayload = {
  __typename?: 'JobAddEveryPayload';
  job: Job;
};

export type JobLocatorInput = {
  queueId: Scalars['ID'];
  jobId: Scalars['ID'];
};

export type JobDiscardPayload = {
  __typename?: 'JobDiscardPayload';
  job: Job;
};

export type JobPromotePayload = {
  __typename?: 'JobPromotePayload';
  job: Job;
  queue: Queue;
};

export type JobRemovePayload = {
  __typename?: 'JobRemovePayload';
  queue: Queue;
  job: Job;
};

export type BulkJobActionInput = {
  queueId: Scalars['ID'];
  jobIds: Array<Scalars['ID']>;
};

export type BulkJobActionPayload = {
  __typename?: 'BulkJobActionPayload';
  queue: Queue;
  status: Array<Maybe<BulkStatusItem>>;
};

export type BulkStatusItem = {
  __typename?: 'BulkStatusItem';
  id: Scalars['ID'];
  success: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
};

export type JobRetryPayload = {
  __typename?: 'JobRetryPayload';
  job: Job;
  queue: Queue;
};

export type JobUpdateInput = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
  data: Scalars['JSONObject'];
};

export type JobUpdatePayload = {
  __typename?: 'JobUpdatePayload';
  job: Job;
};

export type JobLogAddPayload = {
  __typename?: 'JobLogAddPayload';
  /** The job id */
  id: Scalars['String'];
  /** The number of log entries after adding */
  count: Scalars['Int'];
  state?: Maybe<JobStatus>;
};

export type JobMoveToCompletedPayload = {
  __typename?: 'JobMoveToCompletedPayload';
  queue: Queue;
  job?: Maybe<Job>;
};

export type JobMoveToDelayedInput = {
  queueId: Scalars['ID'];
  jobId: Scalars['String'];
  /** The amount of time to delay execution (in ms) */
  delay?: Maybe<Scalars['Duration']>;
};

export type JobMoveToDelayedPayload = {
  __typename?: 'JobMoveToDelayedPayload';
  job: Job;
  delay: Scalars['Int'];
  /** Estimated date/time of execution */
  executeAt: Scalars['Date'];
};

export type JobMoveToFailedInput = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
  failedReason?: Maybe<Scalars['String']>;
};

export type JobMoveToFailedPayload = {
  __typename?: 'JobMoveToFailedPayload';
  job: Job;
  queue: Queue;
};

export type RepeatableJobRemoveByKeyInput = {
  queueId: Scalars['ID'];
  key: Scalars['String'];
};

export type RepeatableJobRemoveByKeyPayload = {
  __typename?: 'RepeatableJobRemoveByKeyPayload';
  key: Scalars['String'];
  queue?: Maybe<Queue>;
};

export type RepeatableJobRemoveOptions = {
  tz?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['Date']>;
  cron?: Maybe<Scalars['String']>;
  every?: Maybe<Scalars['String']>;
};

export type QueueRemoveRepeatablePayload = {
  __typename?: 'QueueRemoveRepeatablePayload';
  queue: Queue;
};

export type QueueCleanFilter = {
  id: Scalars['ID'];
  /** Grace period interval (ms). Jobs older this this will be removed.  */
  grace?: Maybe<Scalars['Duration']>;
  /** Status of the jobs to clean */
  status?: Maybe<JobStatus>;
  /** limit Maximum amount of jobs to clean per call. If not provided will clean all matching jobs. */
  limit?: Maybe<Scalars['Int']>;
};

export type QueueCleanPayload = {
  __typename?: 'QueueCleanPayload';
  /** The queue id */
  id: Scalars['ID'];
  /** Returns the number of affected jobs */
  count: Scalars['Int'];
  /** Returns a list of cleared job ids */
  jobIds?: Maybe<Array<Scalars['ID']>>;
};

export type QueueDrainPayload = {
  __typename?: 'QueueDrainPayload';
  queue: Queue;
};

export type QueuePausePayload = {
  __typename?: 'QueuePausePayload';
  queue: Queue;
  isPaused: Scalars['Boolean'];
};

export type QueueResumePayload = {
  __typename?: 'QueueResumePayload';
  queue: Queue;
  isPaused: Scalars['Boolean'];
};

export type QueueDeleteOptions = {
  checkExistence?: Maybe<Scalars['Boolean']>;
  checkActivity?: Maybe<Scalars['Boolean']>;
};

export type QueueDeletePayload = {
  __typename?: 'QueueDeletePayload';
  /** The id of the deleted queue */
  queueId: Scalars['ID'];
  /** The name of the deleted queue */
  queueName: Scalars['String'];
  /** The queue host */
  host: QueueHost;
  /** The number of keys deleted */
  deletedKeys: Scalars['Int'];
};

export type RegisterQueueInput = {
  hostId: Scalars['ID'];
  prefix?: Maybe<Scalars['String']>;
  /** the queue names */
  name: Scalars['String'];
  checkExists?: Maybe<Scalars['Boolean']>;
  trackMetrics?: Maybe<Scalars['Boolean']>;
};

export type QueueUnregisterPayload = {
  __typename?: 'QueueUnregisterPayload';
  host: QueueHost;
  queue: Queue;
  isRemoved: Scalars['Boolean'];
};

export type JobFilterInput = {
  queueId: Scalars['ID'];
  name: Scalars['String'];
  status?: Maybe<JobStatus>;
  expression: Scalars['JSONObject'];
};

export type JobSchemaInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
  schema: Scalars['JSONSchema'];
  defaultOpts?: Maybe<JobOptionsInput>;
};

export type QueueJobSchemaDeleteInput = {
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
};

export type QueueJobSchemaDeletePayload = {
  __typename?: 'QueueJobSchemaDeletePayload';
  jobName: Scalars['String'];
  queue: Queue;
};

export type QueueJobFilterDeleteInput = {
  queueId: Scalars['ID'];
  filterId: Scalars['ID'];
};

export type QueueJobFilterDeletePayload = {
  __typename?: 'QueueJobFilterDeletePayload';
  filterId: Scalars['String'];
  queue: Queue;
};

export type QueueStatsDeleteInput = {
  queueId: Scalars['ID'];
  /** Optional job name to delete stats for. If omitted, all queue stats are erased */
  jobName?: Maybe<Scalars['String']>;
  /** Optional stats granularity. If omitted, the entire range of data is deleted */
  granularity?: Maybe<StatsGranularity>;
};

export type QueueStatsDeletePayload = {
  __typename?: 'QueueStatsDeletePayload';
  isDeleted: Scalars['Boolean'];
  queue: Queue;
};

export type RuleAlertDeleteInput = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
  alertId: Scalars['ID'];
};

export type RuleAlertDeletePayload = {
  __typename?: 'RuleAlertDeletePayload';
  ruleId: Scalars['ID'];
  rule?: Maybe<Rule>;
};

export type RuleAlertsClearInput = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
};

export type RuleAlertsClearPayload = {
  __typename?: 'RuleAlertsClearPayload';
  /** The count of deleted alerts */
  deletedItems: Scalars['Int'];
  rule: Rule;
};

export type RuleDeleteInput = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
};

export type RuleDeletePayload = {
  __typename?: 'RuleDeletePayload';
  ruleId: Scalars['ID'];
  queueId: Scalars['ID'];
  isDeleted: Scalars['Boolean'];
};

export type RuleAddInput = {
  /** The names of the rule */
  name: Scalars['String'];
  /** A helpful description of the rule */
  description?: Maybe<Scalars['String']>;
  severity?: Maybe<Severity>;
  /** Is this rule active or not */
  isActive: Scalars['Boolean'];
  /** Optional text for message when an alert is raised. Markdown and handlebars supported */
  message?: Maybe<Scalars['String']>;
  /** channels for alert notifications. */
  channels: Array<Scalars['String']>;
  /** Optional data passed on to alerts */
  payload?: Maybe<Scalars['JSONObject']>;
  /** The total number of alerts raised for this rule */
  alertCount: Scalars['Int'];
  queueId: Scalars['ID'];
  metric?: Maybe<RuleMetricInput>;
  /** The rule condition */
  condition?: Maybe<Scalars['JSONObject']>;
  /** Options controlling the generation of events */
  options?: Maybe<RuleAlertOptionsInput>;
};

export type RuleMetricInput = {
  type: Scalars['String'];
  options?: Maybe<Scalars['JSONObject']>;
};

export type RuleAlertOptionsInput = {
  /** a timeout after startup (in ms) during which no alerts are raised, irrespective of the truthiness of the rule condition. */
  warmupWindow?: Maybe<Scalars['Duration']>;
  /** The minimum number of violations before an alert can be raised */
  minViolations?: Maybe<Scalars['Int']>;
  /**
   * The max number of alerts to receive per event trigger in case the condition is met.
   *  In this case the "event" is a single period between the rule VIOLATION and RESET states.
   */
  maxAlertsPerEvent?: Maybe<Scalars['Int']>;
  /**
   * Duration (ms) for which a metric is anomalous before triggering a violation.
   * After a rule violation is encountered, no alerts are dispatched until this period has passed. This is useful for events which are normally transient by may periodically persist longer than usual, or for not sending notifications out too quickly.
   */
  triggerWindow?: Maybe<Scalars['Duration']>;
  /** How long an anomalous metric must be normal before resetting an alert's states to NORMAL. In conjunction with "alertOnReset", this can be used to prevent a possible storm of notifications when a rule condition passes and fails in rapid succession ("flapping") */
  recoveryWindow?: Maybe<Scalars['Duration']>;
  /** If specified, the minimum time between alerts for the same incident */
  renotifyInterval?: Maybe<Scalars['Duration']>;
  /** Raise an alert after an event trigger when the situation returns to normal */
  alertOnReset?: Maybe<Scalars['Boolean']>;
};

export type RuleAddPayload = {
  __typename?: 'RuleAddPayload';
  rule: Rule;
  queue: Queue;
};

export type RuleActivateInput = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
};

export type RuleActivatePayload = {
  __typename?: 'RuleActivatePayload';
  isActive: Scalars['Boolean'];
  rule: Rule;
};

export type RuleDeactivateInput = {
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
};

export type RuleDeactivatePayload = {
  __typename?: 'RuleDeactivatePayload';
  isActive: Scalars['Boolean'];
  rule: Rule;
};

export type Subscription = {
  __typename?: 'Subscription';
  onNotificationChannelCreated: OnNotificationChannelCreatedPayload;
  onNotificationChannelDeleted: OnNotificationChannelDeletedPayload;
  /** Subscribe for updates in host statistical snapshots */
  onHostStatsUpdated: StatsSnapshot;
  onJobAdded: OnJobAddedPayload;
  onJobUpdated: OnJobUpdatedPayload;
  onJobProgress: OnJobProgressPayload;
  onJobRemoved: OnJobRemovedPayload;
  onJobLogAdded: OnJobLogAddedPayload;
  /** Returns job active events */
  obJobActive?: Maybe<OnJobStateChangePayload>;
  /** Returns job failed events */
  obJobFailed?: Maybe<OnJobStateChangePayload>;
  /** Returns job completed events */
  obJobCompleted?: Maybe<OnJobStateChangePayload>;
  /** Returns job stalled events */
  obJobStalled?: Maybe<OnJobStateChangePayload>;
  onJobDelayed: OnJobDelayedPayload;
  onQueuePaused: OnQueuePausedPayload;
  onQueueResumed: OnQueueResumedPayload;
  onQueueDeleted: OnQueueDeletedPayload;
  onQueueWorkersChanged: OnQueueWorkersChangedPayload;
  onQueueStateChanged: OnQueueStateChangedPayload;
  onQueueJobCountsChanged: OnQueueJobCountsChangedPayload;
  onQueueJobUpdates: OnQueueJobUpdatesPayload;
  /** Subscribe for updates in queue statistical snapshots */
  onQueueStatsUpdated: StatsSnapshot;
  onQueueRegistered: OnQueueRegisteredPayload;
  onQueueUnregistered: OnQueueUnregisteredPayload;
  /** Returns an updated count of workers assigned to a queue */
  onQueueWorkersCountChanged: OnQueueWorkersCountPayload;
  onRuleAlert: OnRuleAlertPayload;
};


export type SubscriptionOnNotificationChannelCreatedArgs = {
  hostId: Scalars['String'];
};


export type SubscriptionOnNotificationChannelDeletedArgs = {
  hostId: Scalars['String'];
};


export type SubscriptionOnHostStatsUpdatedArgs = {
  input: StatsUpdatedSubscriptionFilter;
};


export type SubscriptionOnJobAddedArgs = {
  queueId: Scalars['ID'];
};


export type SubscriptionOnJobUpdatedArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionOnJobProgressArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionOnJobRemovedArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionOnJobLogAddedArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionObJobActiveArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionObJobFailedArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionObJobCompletedArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionObJobStalledArgs = {
  queueId: Scalars['String'];
  jobId: Scalars['String'];
};


export type SubscriptionOnJobDelayedArgs = {
  prefix?: Scalars['String'];
  queueId: Scalars['ID'];
};


export type SubscriptionOnQueuePausedArgs = {
  queueId: Scalars['String'];
};


export type SubscriptionOnQueueResumedArgs = {
  queueId: Scalars['ID'];
};


export type SubscriptionOnQueueDeletedArgs = {
  hostId: Scalars['String'];
};


export type SubscriptionOnQueueWorkersChangedArgs = {
  queueId: Scalars['String'];
};


export type SubscriptionOnQueueStateChangedArgs = {
  queueId: Scalars['String'];
};


export type SubscriptionOnQueueJobCountsChangedArgs = {
  queueId: Scalars['String'];
};


export type SubscriptionOnQueueJobUpdatesArgs = {
  input: QueueJobUpdatesFilterInput;
};


export type SubscriptionOnQueueStatsUpdatedArgs = {
  input: StatsUpdatedSubscriptionFilter;
};


export type SubscriptionOnQueueRegisteredArgs = {
  hostId: Scalars['String'];
};


export type SubscriptionOnQueueUnregisteredArgs = {
  hostId: Scalars['String'];
};


export type SubscriptionOnQueueWorkersCountChangedArgs = {
  queueId: Scalars['String'];
};


export type SubscriptionOnRuleAlertArgs = {
  queueId: Scalars['ID'];
  ruleIds?: Maybe<Array<Scalars['String']>>;
};

export type OnNotificationChannelCreatedPayload = {
  __typename?: 'OnNotificationChannelCreatedPayload';
  hostId: Scalars['String'];
  channelId: Scalars['String'];
  channelName: Scalars['String'];
  channelType: Scalars['String'];
};

export type OnNotificationChannelDeletedPayload = {
  __typename?: 'OnNotificationChannelDeletedPayload';
  hostId: Scalars['String'];
  channelId: Scalars['String'];
  channelName: Scalars['String'];
  channelType: Scalars['String'];
};

/** Filtering options for stats subscriptions. */
export type StatsUpdatedSubscriptionFilter = {
  /** The id of the queue or host to subscribe to */
  id: Scalars['ID'];
  /** An optional job name for filtering */
  jobName?: Maybe<Scalars['String']>;
  /** The metric requested */
  metric?: Maybe<StatsMetricType>;
  /** Data granularity */
  granularity?: Maybe<StatsGranularity>;
};

export type OnJobAddedPayload = {
  __typename?: 'OnJobAddedPayload';
  jobId: Scalars['String'];
  jobName: Scalars['String'];
  queueId: Scalars['String'];
  queueName: Scalars['String'];
};

/** Holds the changes to the state of a job */
export type OnJobUpdatedPayload = {
  __typename?: 'OnJobUpdatedPayload';
  jobId: Scalars['String'];
  /** The event which triggered the update */
  event: Scalars['String'];
  timestamp: Scalars['Date'];
  /** updates in job state since the last event */
  delta?: Maybe<Scalars['JSONObject']>;
  job?: Maybe<Job>;
  /** The job's queue */
  queue: Queue;
};

export type OnJobProgressPayload = {
  __typename?: 'OnJobProgressPayload';
  job: Job;
  queue: Queue;
  queueId: Scalars['String'];
  jobId: Scalars['String'];
  progress?: Maybe<Scalars['JobProgress']>;
};

export type OnJobRemovedPayload = {
  __typename?: 'OnJobRemovedPayload';
  queue: Queue;
  jobId: Scalars['String'];
};

export type OnJobLogAddedPayload = {
  __typename?: 'OnJobLogAddedPayload';
  job: Job;
  queueId: Scalars['String'];
  jobId: Scalars['String'];
  /** The rows added to the job log */
  rows: Array<Scalars['String']>;
  /** The number of log lines after addition */
  count: Scalars['Int'];
};

export type OnJobStateChangePayload = {
  __typename?: 'OnJobStateChangePayload';
  job: Job;
  queue: Queue;
  jobId: Scalars['String'];
};

export type OnJobDelayedPayload = {
  __typename?: 'OnJobDelayedPayload';
  job?: Maybe<Job>;
  queue: Queue;
  jobId: Scalars['String'];
  queueName: Scalars['String'];
  delay?: Maybe<Scalars['Int']>;
};

export type OnQueuePausedPayload = {
  __typename?: 'OnQueuePausedPayload';
  queueId: Scalars['String'];
};

export type OnQueueResumedPayload = {
  __typename?: 'OnQueueResumedPayload';
  queueId: Scalars['String'];
};

export type OnQueueDeletedPayload = {
  __typename?: 'OnQueueDeletedPayload';
  /** The id of the deleted queue */
  queueId: Scalars['String'];
  /** The name of the deleted queue */
  queueName: Scalars['String'];
  /** The queue host id */
  hostId: Scalars['String'];
  /** The number of keys deleted */
  deletedKeys: Scalars['Int'];
};

/** Returns the list of added and removed workers related to a queue */
export type OnQueueWorkersChangedPayload = {
  __typename?: 'OnQueueWorkersChangedPayload';
  queueId: Scalars['String'];
  added: Array<QueueWorker>;
  removed: Array<QueueWorker>;
};

export type OnQueueStateChangedPayload = {
  __typename?: 'OnQueueStateChangedPayload';
  queueId: Scalars['String'];
  queueName: Scalars['String'];
  state: Scalars['String'];
};

export type OnQueueJobCountsChangedPayload = {
  __typename?: 'OnQueueJobCountsChangedPayload';
  queueId: Scalars['String'];
  delta?: Maybe<QueueJobCountDelta>;
};

export type QueueJobCountDelta = {
  __typename?: 'QueueJobCountDelta';
  completed?: Maybe<Scalars['Int']>;
  failed?: Maybe<Scalars['Int']>;
  delayed?: Maybe<Scalars['Int']>;
  active?: Maybe<Scalars['Int']>;
  waiting: Scalars['Int'];
};

export type QueueJobUpdatesFilterInput = {
  queueId: Scalars['ID'];
  /** The job names to filter for */
  names?: Maybe<Array<Scalars['String']>>;
  /** Only return updates for jobs with these states */
  states?: Maybe<Array<Maybe<JobStatus>>>;
};

export type OnQueueJobUpdatesPayload = {
  __typename?: 'OnQueueJobUpdatesPayload';
  queueId: Scalars['String'];
  changes: Array<JobUpdateDelta>;
};

export type JobUpdateDelta = {
  __typename?: 'JobUpdateDelta';
  id: Scalars['String'];
  delta: Scalars['JSONObject'];
};

export type OnQueueRegisteredPayload = {
  __typename?: 'OnQueueRegisteredPayload';
  hostId: Scalars['String'];
  queueId: Scalars['String'];
  queueName: Scalars['String'];
  prefix: Scalars['String'];
};

export type OnQueueUnregisteredPayload = {
  __typename?: 'OnQueueUnregisteredPayload';
  hostId: Scalars['String'];
  queueName: Scalars['String'];
  queueId: Scalars['String'];
  prefix: Scalars['String'];
};

export type OnQueueWorkersCountPayload = {
  __typename?: 'OnQueueWorkersCountPayload';
  queueId: Scalars['String'];
  workersCount: Scalars['Int'];
};

export type OnRuleAlertPayload = {
  __typename?: 'OnRuleAlertPayload';
  alert: RuleAlert;
};

/** A condition based on a simple threshold condition */
export type ChangeCondition = RuleCondition & {
  __typename?: 'ChangeCondition';
  /** The value needed to trigger an error notification */
  errorThreshold: Scalars['Float'];
  /** The value needed to trigger an warning notification */
  warningThreshold?: Maybe<Scalars['Float']>;
  /** The comparison operator */
  operator?: Maybe<RuleOperator>;
  /** The sliding window for metric measurement */
  timeWindow?: Maybe<Scalars['Duration']>;
  /** Lookback period (ms). How far back are we going to compare eg 1 hour means we're comparing now vs 1 hour ago */
  timeShift?: Maybe<Scalars['Duration']>;
  changeType?: Maybe<ChangeType>;
  aggregationType?: Maybe<ChangeAggregation>;
};

export enum RuleOperator {
  Gt = 'GT',
  Gte = 'GTE',
  Lt = 'LT',
  Lte = 'LTE',
  Eq = 'EQ',
  Ne = 'NE'
}

export enum ChangeType {
  Value = 'VALUE',
  Pct = 'PCT'
}

export enum ChangeAggregation {
  Avg = 'AVG',
  Max = 'MAX',
  Min = 'MIN',
  Sum = 'SUM',
  P90 = 'P90',
  P95 = 'P95',
  P99 = 'P99'
}

/** A condition based on deviations from a rolling average */
export type PeakCondition = RuleCondition & {
  __typename?: 'PeakCondition';
  /** Standard deviations at which to trigger an error notification. */
  errorThreshold: Scalars['Float'];
  /** Standard deviations at which to trigger an warning notification. */
  warningThreshold?: Maybe<Scalars['Float']>;
  /** Signal if peak is above the threshold, below the threshold or either */
  direction?: Maybe<PeakSignalDirection>;
  /** the influence (between 0 and 1) of new signals on the mean and standard deviation where 1 is normal influence, 0.5 is half */
  influence?: Maybe<Scalars['Float']>;
  /** The lag of the moving window (in milliseconds).  For example, a lag of 5000 will use the last 5 seconds of observationsto smooth the data. */
  lag?: Maybe<Scalars['Duration']>;
};

export enum PeakSignalDirection {
  Above = 'ABOVE',
  Below = 'BELOW',
  Both = 'BOTH'
}

/** A condition based on a simple threshold condition */
export type ThresholdCondition = RuleCondition & {
  __typename?: 'ThresholdCondition';
  /** The value needed to trigger an error notification */
  errorThreshold: Scalars['Float'];
  /** The value needed to trigger an warning notification */
  warningThreshold?: Maybe<Scalars['Float']>;
  /** The comparison operator */
  operator?: Maybe<RuleOperator>;
};

export type RedisStatsFragment = { __typename?: 'RedisInfo', redis_version: string, uptime_in_seconds: number, uptime_in_days: number, connected_clients: number, blocked_clients: number, total_system_memory: number, used_memory: number, used_memory_peak: number, used_memory_lua: number, used_cpu_sys: number, maxmemory: number, number_of_cached_scripts: number, instantaneous_ops_per_sec: number, mem_fragmentation_ratio?: Maybe<number>, role?: Maybe<string> };

export type HostFragment = { __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, uri: string, redis: (
    { __typename?: 'RedisInfo' }
    & RedisStatsFragment
  ), channels: Array<(
    { __typename?: 'MailNotificationChannel' }
    & NotificationChannel_MailNotificationChannel_Fragment
  ) | (
    { __typename?: 'SlackNotificationChannel' }
    & NotificationChannel_SlackNotificationChannel_Fragment
  ) | (
    { __typename?: 'WebhookNotificationChannel' }
    & NotificationChannel_WebhookNotificationChannel_Fragment
  )> };

export type GetAllHostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllHostsQuery = { __typename?: 'Query', hosts: Array<(
    { __typename?: 'QueueHost' }
    & HostFragment
  )> };

export type GetHostsAndQueuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHostsAndQueuesQuery = { __typename?: 'Query', hosts: Array<{ __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, uri: string, redis: (
      { __typename?: 'RedisInfo' }
      & RedisStatsFragment
    ), queues: Array<(
      { __typename?: 'Queue' }
      & QueueFragment
    )> }> };

export type GetHostByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetHostByIdQuery = { __typename?: 'Query', host?: Maybe<(
    { __typename?: 'QueueHost' }
    & HostFragment
  )> };

export type GetHostByIdFullQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetHostByIdFullQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, uri: string, redis: (
      { __typename?: 'RedisInfo' }
      & RedisStatsFragment
    ), queues: Array<(
      { __typename?: 'Queue' }
      & QueueFragment
    )> }> };

export type GetHostQueuesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetHostQueuesQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', id: string, queues: Array<(
      { __typename?: 'Queue' }
      & QueueFragment
    )> }> };

export type GetRedisStatsQueryVariables = Exact<{
  hostId: Scalars['ID'];
}>;


export type GetRedisStatsQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', id: string, redis: (
      { __typename?: 'RedisInfo' }
      & RedisStatsFragment
    ) }> };

export type DiscoverQueuesQueryVariables = Exact<{
  hostId: Scalars['ID'];
  prefix?: Maybe<Scalars['String']>;
  unregisteredOnly?: Maybe<Scalars['Boolean']>;
}>;


export type DiscoverQueuesQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', discoverQueues: Array<{ __typename?: 'DiscoverQueuesPayload', name: string, prefix: string }> }> };

export type RegisterQueueMutationVariables = Exact<{
  hostId: Scalars['ID'];
  name: Scalars['String'];
  prefix?: Maybe<Scalars['String']>;
  checkExists?: Maybe<Scalars['Boolean']>;
}>;


export type RegisterQueueMutation = { __typename?: 'Mutation', queueRegister: (
    { __typename: 'Queue' }
    & QueueFragment
  ) };

export type UnregisterQueueMutationVariables = Exact<{
  queueId: Scalars['ID'];
}>;


export type UnregisterQueueMutation = { __typename?: 'Mutation', queueUnregister: { __typename?: 'QueueUnregisterPayload', isRemoved: boolean, host: { __typename?: 'QueueHost', id: string } } };

export type GetQueueJobCountsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQueueJobCountsQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue', id: string }
    & JobCountsFragment
  )> };

export type GetQueueJobSchemasQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQueueJobSchemasQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', id: string, jobSchemas: Array<{ __typename?: 'JobSchema', jobName: string, schema?: Maybe<{ [key: string]: any }>, defaultOpts?: Maybe<{ [key: string]: any }> }> }> };

export type GetQueueJobsQueryVariables = Exact<{
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  status?: Maybe<JobStatus>;
  sortOrder?: Maybe<SortOrderEnum>;
}>;


export type GetQueueJobsQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue', id: string, jobs: Array<(
      { __typename?: 'Job' }
      & JobFragment
    )> }
    & JobCountsFragment
  )> };

export type GetJobsByFilterQueryVariables = Exact<{
  id: Scalars['ID'];
  status?: Maybe<JobStatus>;
  cursor?: Maybe<Scalars['String']>;
  criteria?: Maybe<Scalars['JSONObject']>;
  count?: Maybe<Scalars['Int']>;
}>;


export type GetJobsByFilterQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue', id: string, jobSearch: { __typename?: 'JobSearchPayload', cursor?: Maybe<string>, jobs: Array<(
        { __typename?: 'Job' }
        & JobFragment
      )> } }
    & JobCountsFragment
  )> };

export type GetRepeatableJobsQueryVariables = Exact<{
  id: Scalars['ID'];
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  sortOrder?: Maybe<SortOrderEnum>;
}>;


export type GetRepeatableJobsQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', id: string, repeatableJobCount: number, repeatableJobs: Array<(
      { __typename?: 'RepeatableJob' }
      & RepeatableJobFragment
    )> }> };

export type GetJobByIdQueryVariables = Exact<{
  queueId: Scalars['ID'];
  id: Scalars['ID'];
}>;


export type GetJobByIdQuery = { __typename?: 'Query', job: (
    { __typename?: 'Job' }
    & JobFragment
  ) };

export type GetJobLogsQueryVariables = Exact<{
  queueId: Scalars['ID'];
  id: Scalars['ID'];
  start?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['Int']>;
}>;


export type GetJobLogsQuery = { __typename?: 'Query', job: { __typename?: 'Job', logs: { __typename?: 'JobLogs', count: number, items: Array<string> } } };

export type AddJobMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
  data?: Maybe<Scalars['JSONObject']>;
  options?: Maybe<JobOptionsInput>;
}>;


export type AddJobMutation = { __typename?: 'Mutation', jobAdd: (
    { __typename?: 'Job' }
    & JobFragment
  ) };

export type DeleteJobMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobId: Scalars['ID'];
}>;


export type DeleteJobMutation = { __typename?: 'Mutation', jobRemove: { __typename?: 'JobRemovePayload', job: { __typename?: 'Job', id: string } } };

export type DeleteRepeatableJobByKeyMutationVariables = Exact<{
  queueId: Scalars['ID'];
  key: Scalars['String'];
}>;


export type DeleteRepeatableJobByKeyMutation = { __typename?: 'Mutation', repeatableJobRemoveByKey: { __typename?: 'RepeatableJobRemoveByKeyPayload', key: string } };

export type DeleteBulkJobsMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobIds: Array<Scalars['ID']>;
}>;


export type DeleteBulkJobsMutation = { __typename?: 'Mutation', jobRemoveBulk?: Maybe<{ __typename?: 'BulkJobActionPayload', status: Array<Maybe<{ __typename?: 'BulkStatusItem', id: string, success: boolean, reason?: Maybe<string> }>> }> };

export type RetryJobMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobId: Scalars['ID'];
}>;


export type RetryJobMutation = { __typename?: 'Mutation', jobRetry: { __typename?: 'JobRetryPayload', job: { __typename?: 'Job', id: string } } };

export type RetryBulkJobsMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobIds: Array<Scalars['ID']>;
}>;


export type RetryBulkJobsMutation = { __typename?: 'Mutation', jobRetryBulk?: Maybe<{ __typename?: 'BulkJobActionPayload', status: Array<Maybe<{ __typename?: 'BulkStatusItem', id: string, success: boolean, reason?: Maybe<string> }>> }> };

export type PromoteJobMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobId: Scalars['ID'];
}>;


export type PromoteJobMutation = { __typename?: 'Mutation', jobPromote: { __typename?: 'JobPromotePayload', job: { __typename?: 'Job', id: string, state: JobStatus } } };

export type PromoteBulkJobsMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobIds: Array<Scalars['ID']>;
}>;


export type PromoteBulkJobsMutation = { __typename?: 'Mutation', jobPromoteBulk?: Maybe<{ __typename?: 'BulkJobActionPayload', status: Array<Maybe<{ __typename?: 'BulkStatusItem', id: string, success: boolean, reason?: Maybe<string> }>> }> };

export type GetQueueByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQueueByIdQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue' }
    & QueueFragment
  )> };

export type GetQueueWorkersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQueueWorkersQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', id: string, workers: Array<{ __typename?: 'QueueWorker', id?: Maybe<string>, name?: Maybe<string>, addr: string, age: number, started?: Maybe<number>, idle: number, role?: Maybe<string>, db: number, omem: number }> }> };

export type PauseQueueMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PauseQueueMutation = { __typename?: 'Mutation', queuePause: { __typename?: 'QueuePausePayload', isPaused: boolean } };

export type ResumeQueueMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ResumeQueueMutation = { __typename?: 'Mutation', queueResume: { __typename?: 'QueueResumePayload', isPaused: boolean } };

export type GetQueueRulesQueryVariables = Exact<{
  queueId: Scalars['ID'];
}>;


export type GetQueueRulesQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', rules: Array<(
      { __typename?: 'Rule' }
      & RuleFragment
    )> }> };

export type DeleteQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  checkActivity?: Maybe<Scalars['Boolean']>;
}>;


export type DeleteQueueMutation = { __typename?: 'Mutation', queueDelete: { __typename?: 'QueueDeletePayload', deletedKeys: number } };

export type CleanQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  grace: Scalars['Duration'];
  limit?: Maybe<Scalars['Int']>;
  status?: Maybe<JobStatus>;
}>;


export type CleanQueueMutation = { __typename?: 'Mutation', queueClean: { __typename?: 'QueueCleanPayload', count: number } };

export type DrainQueueMutationVariables = Exact<{
  id: Scalars['ID'];
  delayed?: Maybe<Scalars['Boolean']>;
}>;


export type DrainQueueMutation = { __typename?: 'Mutation', queueDrain: { __typename?: 'QueueDrainPayload', queue: (
      { __typename?: 'Queue' }
      & QueueFragment
    ) } };

export type GetJobSchemaQueryVariables = Exact<{
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
}>;


export type GetJobSchemaQuery = { __typename?: 'Query', queueJobSchema?: Maybe<{ __typename?: 'JobSchema', jobName: string, schema?: Maybe<{ [key: string]: any }>, defaultOpts?: Maybe<{ [key: string]: any }> }> };

export type GetJobSchemasQueryVariables = Exact<{
  queueId: Scalars['ID'];
}>;


export type GetJobSchemasQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', jobSchemas: Array<{ __typename?: 'JobSchema', jobName: string, schema?: Maybe<{ [key: string]: any }>, defaultOpts?: Maybe<{ [key: string]: any }> }> }> };

export type SetJobSchemaMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
  schema: Scalars['JSONSchema'];
  defaultOpts?: Maybe<JobOptionsInput>;
}>;


export type SetJobSchemaMutation = { __typename?: 'Mutation', queueJobSchemaSet: { __typename?: 'JobSchema', jobName: string, schema?: Maybe<{ [key: string]: any }>, defaultOpts?: Maybe<{ [key: string]: any }> } };

export type DeleteJobSchemaMutationVariables = Exact<{
  queueId: Scalars['ID'];
  jobName: Scalars['String'];
}>;


export type DeleteJobSchemaMutation = { __typename?: 'Mutation', queueJobSchemaDelete: { __typename?: 'QueueJobSchemaDeletePayload', jobName: string } };

export type GetJobOptionsSchemaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetJobOptionsSchemaQuery = { __typename?: 'Query', jobOptionsSchema: { [key: string]: any } };

export type GetQueueJobsNamesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQueueJobsNamesQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', jobNames: Array<string> }> };

export type GetAppInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAppInfoQuery = { __typename?: 'Query', appInfo: { __typename?: 'AppInfo', env: string, title: string, version: string, brand?: Maybe<string>, author?: Maybe<string> } };

export type GetHostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHostsQuery = { __typename?: 'Query', hosts: Array<{ __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, uri: string, workerCount: number, queues: Array<{ __typename?: 'Queue', name: string, id: string, isPaused: boolean }> }> };

export type JobRepeatOptionsFragment = { __typename?: 'JobRepeatOptions', cron?: Maybe<string>, tz?: Maybe<string>, startDate?: Maybe<any>, endDate?: Maybe<any>, limit?: Maybe<number>, every?: Maybe<string>, jobId?: Maybe<string>, count?: Maybe<number> };

export type JobOptionsFragment = { __typename?: 'JobOptions', timestamp?: Maybe<any>, priority?: Maybe<number>, delay?: Maybe<number>, attempts?: Maybe<number>, backoff?: Maybe<any>, lifo?: Maybe<boolean>, timeout?: Maybe<number>, jobId?: Maybe<string>, removeOnComplete?: Maybe<boolean | number>, removeOnFail?: Maybe<boolean | number>, stackTraceLimit?: Maybe<number>, repeat?: Maybe<(
    { __typename?: 'JobRepeatOptions' }
    & JobRepeatOptionsFragment
  )> };

export type JobFragment = { __typename?: 'Job', id: string, queueId: string, timestamp: any, state: JobStatus, name: string, data: { [key: string]: any }, delay: number, progress?: Maybe<string | number | Record<string, any>>, attemptsMade: number, processedOn?: Maybe<any>, finishedOn?: Maybe<any>, failedReason?: Maybe<any>, stacktrace: Array<string>, returnvalue?: Maybe<any>, opts: (
    { __typename?: 'JobOptions' }
    & JobOptionsFragment
  ) };

export type RepeatableJobFragment = { __typename?: 'RepeatableJob', key: string, id?: Maybe<string>, name?: Maybe<string>, endDate?: Maybe<any>, tz?: Maybe<string>, cron?: Maybe<string>, next?: Maybe<any>, descr?: Maybe<string> };

export type MeterFragment = { __typename?: 'Meter', count: number, meanRate: number, m1Rate: number, m5Rate: number, m15Rate: number };

export type StatsSnapshotFragment = { __typename?: 'StatsSnapshot', count: number, failed: number, completed: number, startTime: any, endTime: any, stddev: number, mean: number, min: number, max: number, median: number, p90: number, p95: number, p99: number, p995: number, meanRate: number, m1Rate: number, m5Rate: number, m15Rate: number };

export type JobCountsFragment = { __typename?: 'Queue', jobCounts: { __typename?: 'JobCounts', active: number, failed: number, paused: number, completed: number, delayed: number, waiting: number } };

export type QueueFragment = (
  { __typename?: 'Queue', id: string, name: string, host: string, hostId: string, prefix: string, isPaused: boolean, repeatableJobCount: number, jobNames: Array<string>, workerCount: number }
  & JobCountsFragment
);

export type QueueWorkersFragment = { __typename?: 'Queue', workers: Array<{ __typename?: 'QueueWorker', id?: Maybe<string>, name?: Maybe<string>, addr: string, age: number, started?: Maybe<number>, idle: number, role?: Maybe<string>, db: number, omem: number }> };

export type RuleMetricFragment = { __typename?: 'RuleMetric', type: string, options?: Maybe<{ [key: string]: any }> };

export type RuleAlertOptionsFragment = { __typename?: 'RuleAlertOptions', triggerWindow?: Maybe<string | number>, minViolations?: Maybe<number>, maxAlertsPerEvent?: Maybe<number>, alertOnReset?: Maybe<boolean>, recoveryWindow?: Maybe<string | number>, renotifyInterval?: Maybe<string | number> };

export type RuleFragment = { __typename?: 'Rule', id: string, name: string, description?: Maybe<string>, createdAt: any, updatedAt: any, state?: Maybe<RuleState>, payload?: Maybe<{ [key: string]: any }>, channels: Array<string>, isActive: boolean, message?: Maybe<string>, alertCount: number, metric: (
    { __typename?: 'RuleMetric' }
    & RuleMetricFragment
  ), condition: { __typename?: 'ChangeCondition', changeType?: Maybe<ChangeType>, errorThreshold: number, warningThreshold?: Maybe<number>, operator?: Maybe<RuleOperator>, timeWindow?: Maybe<string | number>, timeShift?: Maybe<string | number>, aggregationType?: Maybe<ChangeAggregation> } | { __typename?: 'PeakCondition', errorThreshold: number, warningThreshold?: Maybe<number>, influence?: Maybe<number>, lag?: Maybe<string | number>, direction?: Maybe<PeakSignalDirection> } | { __typename?: 'ThresholdCondition', errorThreshold: number, warningThreshold?: Maybe<number>, operator?: Maybe<RuleOperator> }, options?: Maybe<(
    { __typename?: 'RuleAlertOptions' }
    & RuleAlertOptionsFragment
  )> };

type NotificationChannel_MailNotificationChannel_Fragment = { __typename?: 'MailNotificationChannel', recipients: Array<string>, id: string, type: string, name: string, enabled: boolean };

type NotificationChannel_SlackNotificationChannel_Fragment = { __typename?: 'SlackNotificationChannel', webhook: string, channel?: Maybe<string>, token?: Maybe<string>, id: string, type: string, name: string, enabled: boolean };

type NotificationChannel_WebhookNotificationChannel_Fragment = { __typename?: 'WebhookNotificationChannel', url: string, method?: Maybe<HttpMethodEnum>, headers?: Maybe<{ [key: string]: any }>, timeout?: Maybe<string | number>, retry?: Maybe<number>, followRedirect?: Maybe<boolean>, httpSuccessCodes?: Maybe<Array<number>>, id: string, type: string, name: string, enabled: boolean };

export type NotificationChannelFragment = NotificationChannel_MailNotificationChannel_Fragment | NotificationChannel_SlackNotificationChannel_Fragment | NotificationChannel_WebhookNotificationChannel_Fragment;

export type GetHostChannelsQueryVariables = Exact<{
  hostId: Scalars['ID'];
}>;


export type GetHostChannelsQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', channels: Array<(
      { __typename?: 'MailNotificationChannel' }
      & NotificationChannel_MailNotificationChannel_Fragment
    ) | (
      { __typename?: 'SlackNotificationChannel' }
      & NotificationChannel_SlackNotificationChannel_Fragment
    ) | (
      { __typename?: 'WebhookNotificationChannel' }
      & NotificationChannel_WebhookNotificationChannel_Fragment
    )> }> };

export type GetAvailableMetricsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableMetricsQuery = { __typename?: 'Query', metrics: Array<{ __typename?: 'MetricInfo', key: string, description?: Maybe<string>, unit?: Maybe<string>, category?: Maybe<MetricCategory>, isPolling: boolean }> };

export type GetAvailableAggregatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableAggregatesQuery = { __typename?: 'Query', aggregates: Array<Maybe<{ __typename?: 'AggregateInfo', key: string, description: string }>> };

export type GetRuleByIdQueryVariables = Exact<{
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
}>;


export type GetRuleByIdQuery = { __typename?: 'Query', rule?: Maybe<(
    { __typename?: 'Rule' }
    & RuleFragment
  )> };

export type CreateRuleMutationVariables = Exact<{
  input: RuleAddInput;
}>;


export type CreateRuleMutation = { __typename?: 'Mutation', ruleAdd: { __typename?: 'RuleAddPayload', rule: (
      { __typename?: 'Rule' }
      & RuleFragment
    ) } };

export type DeleteRuleMutationVariables = Exact<{
  queueId: Scalars['ID'];
  ruleId: Scalars['ID'];
}>;


export type DeleteRuleMutation = { __typename?: 'Mutation', ruleDelete: { __typename?: 'RuleDeletePayload', isDeleted: boolean } };

export type GetStatsSpanQueryVariables = Exact<{
  id: Scalars['ID'];
  input: StatsSpanInput;
}>;


export type GetStatsSpanQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', statsDateRange?: Maybe<{ __typename?: 'StatsSpanPayload', start: any, end: any }> }> };

export type GetQueueStatsQueryVariables = Exact<{
  id: Scalars['ID'];
  input: StatsQueryInput;
}>;


export type GetQueueStatsQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', stats: Array<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )> }> };

export type GetQueueStatsLatestQueryVariables = Exact<{
  id: Scalars['ID'];
  input: StatsLatestInput;
}>;


export type GetQueueStatsLatestQuery = { __typename?: 'Query', queue?: Maybe<{ __typename?: 'Queue', lastStatsSnapshot?: Maybe<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )> }> };

export type GetHostStatsLatestQueryVariables = Exact<{
  id: Scalars['ID'];
  input: StatsLatestInput;
}>;


export type GetHostStatsLatestQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', lastStatsSnapshot?: Maybe<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )> }> };

export type QueueStatsUpdatedSubscriptionVariables = Exact<{
  input: StatsUpdatedSubscriptionFilter;
}>;


export type QueueStatsUpdatedSubscription = { __typename?: 'Subscription', onQueueStatsUpdated: (
    { __typename?: 'StatsSnapshot' }
    & StatsSnapshotFragment
  ) };

export type HostStatsUpdatedSubscriptionVariables = Exact<{
  input: StatsUpdatedSubscriptionFilter;
}>;


export type HostStatsUpdatedSubscription = { __typename?: 'Subscription', onHostStatsUpdated: (
    { __typename?: 'StatsSnapshot' }
    & StatsSnapshotFragment
  ) };

export type DashboardPageQueryVariables = Exact<{
  range: Scalars['String'];
}>;


export type DashboardPageQuery = { __typename?: 'Query', hosts: Array<{ __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, uri: string, queueCount: number, workerCount: number, redis: { __typename?: 'RedisInfo', redis_version: string, uptime_in_seconds: number, connected_clients: number, blocked_clients: number, total_system_memory: number, used_memory: number, maxmemory: number }, jobCounts: { __typename?: 'JobCounts', active: number, failed: number, paused: number, completed: number, delayed: number, waiting: number }, stats: Array<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )>, lastStatsSnapshot?: Maybe<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )> }> };

export type HostPageQueryQueryVariables = Exact<{
  id: Scalars['ID'];
  range: Scalars['String'];
  filter?: Maybe<HostQueuesFilter>;
}>;


export type HostPageQueryQuery = { __typename?: 'Query', host?: Maybe<{ __typename?: 'QueueHost', id: string, name: string, description?: Maybe<string>, redis: (
      { __typename?: 'RedisInfo' }
      & RedisStatsFragment
    ), queues: Array<(
      { __typename?: 'Queue', id: string, name: string, isPaused: boolean, repeatableJobCount: number, workerCount: number, ruleAlertCount: number, waitTimeAvg: number, throughput: { __typename?: 'Meter', count: number, m1Rate: number, m5Rate: number, m15Rate: number }, errorRate: { __typename?: 'Meter', count: number, m1Rate: number, m5Rate: number, m15Rate: number }, stats: Array<(
        { __typename?: 'StatsSnapshot' }
        & StatsSnapshotFragment
      )>, statsAggregate?: Maybe<(
        { __typename?: 'StatsSnapshot' }
        & StatsSnapshotFragment
      )>, lastStatsSnapshot?: Maybe<(
        { __typename?: 'StatsSnapshot' }
        & StatsSnapshotFragment
      )> }
      & JobCountsFragment
    )> }> };

export type QueueSchemaQueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QueueSchemaQueryQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue', id: string, jobNames: Array<string>, jobSchemas: Array<{ __typename?: 'JobSchema', jobName: string, schema?: Maybe<{ [key: string]: any }>, defaultOpts?: Maybe<{ [key: string]: any }> }> }
    & JobCountsFragment
  )> };

export type QueueStatsPageQueryQueryVariables = Exact<{
  id: Scalars['ID'];
  range: Scalars['String'];
  granularity: StatsGranularity;
}>;


export type QueueStatsPageQueryQuery = { __typename?: 'Query', queue?: Maybe<(
    { __typename?: 'Queue', id: string, name: string, hostId: string, prefix: string, isPaused: boolean, jobNames: Array<string>, workerCount: number, ruleAlertCount: number, waitTimeAvg: number, throughput: { __typename?: 'Meter', m1Rate: number, m5Rate: number, m15Rate: number }, errorRate: { __typename?: 'Meter', m1Rate: number, m5Rate: number, m15Rate: number }, stats: Array<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )>, statsAggregate?: Maybe<(
      { __typename?: 'StatsSnapshot' }
      & StatsSnapshotFragment
    )> }
    & JobCountsFragment
  )> };

export const RedisStatsFragmentDoc: DocumentNode<RedisStatsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RedisStats"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RedisInfo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redis_version"}},{"kind":"Field","name":{"kind":"Name","value":"uptime_in_seconds"}},{"kind":"Field","name":{"kind":"Name","value":"uptime_in_days"}},{"kind":"Field","name":{"kind":"Name","value":"connected_clients"}},{"kind":"Field","name":{"kind":"Name","value":"blocked_clients"}},{"kind":"Field","name":{"kind":"Name","value":"total_system_memory"}},{"kind":"Field","name":{"kind":"Name","value":"used_memory"}},{"kind":"Field","name":{"kind":"Name","value":"used_memory_peak"}},{"kind":"Field","name":{"kind":"Name","value":"used_memory_lua"}},{"kind":"Field","name":{"kind":"Name","value":"used_cpu_sys"}},{"kind":"Field","name":{"kind":"Name","value":"maxmemory"}},{"kind":"Field","name":{"kind":"Name","value":"number_of_cached_scripts"}},{"kind":"Field","name":{"kind":"Name","value":"instantaneous_ops_per_sec"}},{"kind":"Field","name":{"kind":"Name","value":"mem_fragmentation_ratio"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]};
export const NotificationChannelFragmentDoc: DocumentNode<NotificationChannelFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationChannel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MailNotificationChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipients"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlackNotificationChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webhook"}},{"kind":"Field","name":{"kind":"Name","value":"channel"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebhookNotificationChannel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"headers"}},{"kind":"Field","name":{"kind":"Name","value":"timeout"}},{"kind":"Field","name":{"kind":"Name","value":"retry"}},{"kind":"Field","name":{"kind":"Name","value":"followRedirect"}},{"kind":"Field","name":{"kind":"Name","value":"httpSuccessCodes"}}]}}]}}]};
export const HostFragmentDoc: DocumentNode<HostFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Host"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"QueueHost"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RedisStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationChannel"}}]}}]}},...RedisStatsFragmentDoc.definitions,...NotificationChannelFragmentDoc.definitions]};
export const JobRepeatOptionsFragmentDoc: DocumentNode<JobRepeatOptionsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JobRepeatOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JobRepeatOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cron"}},{"kind":"Field","name":{"kind":"Name","value":"tz"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"every"}},{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]};
export const JobOptionsFragmentDoc: DocumentNode<JobOptionsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JobOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"JobOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"delay"}},{"kind":"Field","name":{"kind":"Name","value":"attempts"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobRepeatOptions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backoff"}},{"kind":"Field","name":{"kind":"Name","value":"lifo"}},{"kind":"Field","name":{"kind":"Name","value":"timeout"}},{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"removeOnComplete"}},{"kind":"Field","name":{"kind":"Name","value":"removeOnFail"}},{"kind":"Field","name":{"kind":"Name","value":"stackTraceLimit"}}]}},...JobRepeatOptionsFragmentDoc.definitions]};
export const JobFragmentDoc: DocumentNode<JobFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Job"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Job"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"queueId"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"opts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobOptions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delay"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"attemptsMade"}},{"kind":"Field","name":{"kind":"Name","value":"processedOn"}},{"kind":"Field","name":{"kind":"Name","value":"finishedOn"}},{"kind":"Field","name":{"kind":"Name","value":"failedReason"}},{"kind":"Field","name":{"kind":"Name","value":"stacktrace"}},{"kind":"Field","name":{"kind":"Name","value":"returnvalue"}}]}},...JobOptionsFragmentDoc.definitions]};
export const RepeatableJobFragmentDoc: DocumentNode<RepeatableJobFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RepeatableJob"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RepeatableJob"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"tz"}},{"kind":"Field","name":{"kind":"Name","value":"cron"}},{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"descr"}}]}}]};
export const MeterFragmentDoc: DocumentNode<MeterFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Meter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Meter"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"meanRate"}},{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}}]};
export const StatsSnapshotFragmentDoc: DocumentNode<StatsSnapshotFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StatsSnapshot"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StatsSnapshot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"failed"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"stddev"}},{"kind":"Field","name":{"kind":"Name","value":"mean"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"median"}},{"kind":"Field","name":{"kind":"Name","value":"p90"}},{"kind":"Field","name":{"kind":"Name","value":"p95"}},{"kind":"Field","name":{"kind":"Name","value":"p99"}},{"kind":"Field","name":{"kind":"Name","value":"p995"}},{"kind":"Field","name":{"kind":"Name","value":"meanRate"}},{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}}]};
export const JobCountsFragmentDoc: DocumentNode<JobCountsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"JobCounts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Queue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"failed"}},{"kind":"Field","name":{"kind":"Name","value":"paused"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}},{"kind":"Field","name":{"kind":"Name","value":"waiting"}}]}}]}}]};
export const QueueFragmentDoc: DocumentNode<QueueFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Queue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Queue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"host"}},{"kind":"Field","name":{"kind":"Name","value":"hostId"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}},{"kind":"Field","name":{"kind":"Name","value":"repeatableJobCount"}},{"kind":"Field","name":{"kind":"Name","value":"jobNames"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}}]}},...JobCountsFragmentDoc.definitions]};
export const QueueWorkersFragmentDoc: DocumentNode<QueueWorkersFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"QueueWorkers"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Queue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addr"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"idle"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"db"}},{"kind":"Field","name":{"kind":"Name","value":"omem"}}]}}]}}]};
export const RuleMetricFragmentDoc: DocumentNode<RuleMetricFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RuleMetric"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RuleMetric"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"options"}}]}}]};
export const RuleAlertOptionsFragmentDoc: DocumentNode<RuleAlertOptionsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RuleAlertOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RuleAlertOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"triggerWindow"}},{"kind":"Field","name":{"kind":"Name","value":"minViolations"}},{"kind":"Field","name":{"kind":"Name","value":"maxAlertsPerEvent"}},{"kind":"Field","name":{"kind":"Name","value":"alertOnReset"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryWindow"}},{"kind":"Field","name":{"kind":"Name","value":"renotifyInterval"}}]}}]};
export const RuleFragmentDoc: DocumentNode<RuleFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Rule"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Rule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"metric"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RuleMetric"}}]}},{"kind":"Field","name":{"kind":"Name","value":"condition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ThresholdCondition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"warningThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"operator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PeakCondition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"warningThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"influence"}},{"kind":"Field","name":{"kind":"Name","value":"lag"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeCondition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"errorThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"warningThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"operator"}},{"kind":"Field","name":{"kind":"Name","value":"timeWindow"}},{"kind":"Field","name":{"kind":"Name","value":"timeShift"}},{"kind":"Field","name":{"kind":"Name","value":"aggregationType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}},{"kind":"Field","name":{"kind":"Name","value":"channels"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RuleAlertOptions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alertCount"}}]}},...RuleMetricFragmentDoc.definitions,...RuleAlertOptionsFragmentDoc.definitions]};
export const GetAllHostsDocument: DocumentNode<GetAllHostsQuery, GetAllHostsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllHosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Host"}}]}}]}},...HostFragmentDoc.definitions]};
export const GetHostsAndQueuesDocument: DocumentNode<GetHostsAndQueuesQuery, GetHostsAndQueuesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHostsAndQueues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RedisStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}}]}},...RedisStatsFragmentDoc.definitions,...QueueFragmentDoc.definitions]};
export const GetHostByIdDocument: DocumentNode<GetHostByIdQuery, GetHostByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHostById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Host"}}]}}]}},...HostFragmentDoc.definitions]};
export const GetHostByIdFullDocument: DocumentNode<GetHostByIdFullQuery, GetHostByIdFullQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHostByIdFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RedisStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}}]}},...RedisStatsFragmentDoc.definitions,...QueueFragmentDoc.definitions]};
export const GetHostQueuesDocument: DocumentNode<GetHostQueuesQuery, GetHostQueuesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHostQueues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"queues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}}]}},...QueueFragmentDoc.definitions]};
export const GetRedisStatsDocument: DocumentNode<GetRedisStatsQuery, GetRedisStatsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRedisStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RedisStats"}}]}}]}}]}},...RedisStatsFragmentDoc.definitions]};
export const DiscoverQueuesDocument: DocumentNode<DiscoverQueuesQuery, DiscoverQueuesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"discoverQueues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unregisteredOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discoverQueues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}}},{"kind":"Argument","name":{"kind":"Name","value":"unregisteredOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unregisteredOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}}]}}]}}]}}]};
export const RegisterQueueDocument: DocumentNode<RegisterQueueMutation, RegisterQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkExists"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueRegister"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"hostId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"prefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prefix"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"checkExists"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkExists"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}},...QueueFragmentDoc.definitions]};
export const UnregisterQueueDocument: DocumentNode<UnregisterQueueMutation, UnregisterQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnregisterQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueUnregister"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isRemoved"}}]}}]}}]};
export const GetQueueJobCountsDocument: DocumentNode<GetQueueJobCountsQuery, GetQueueJobCountsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueJobCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}}]}}]}},...JobCountsFragmentDoc.definitions]};
export const GetQueueJobSchemasDocument: DocumentNode<GetQueueJobSchemasQuery, GetQueueJobSchemasQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueJobSchemas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"jobSchemas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}},{"kind":"Field","name":{"kind":"Name","value":"schema"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpts"}}]}}]}}]}}]};
export const GetQueueJobsDocument: DocumentNode<GetQueueJobsQuery, GetQueueJobsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrderEnum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"jobs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Job"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}}]}}]}},...JobFragmentDoc.definitions,...JobCountsFragmentDoc.definitions]};
export const GetJobsByFilterDocument: DocumentNode<GetJobsByFilterQuery, GetJobsByFilterQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobsByFilter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"criteria"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"jobSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"criteria"},"value":{"kind":"Variable","name":{"kind":"Name","value":"criteria"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"jobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Job"}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}}]}}]}},...JobFragmentDoc.definitions,...JobCountsFragmentDoc.definitions]};
export const GetRepeatableJobsDocument: DocumentNode<GetRepeatableJobsQuery, GetRepeatableJobsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRepeatableJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortOrderEnum"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"repeatableJobs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortOrder"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RepeatableJob"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableJobCount"}}]}}]}},...RepeatableJobFragmentDoc.definitions]};
export const GetJobByIdDocument: DocumentNode<GetJobByIdQuery, GetJobByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Job"}}]}}]}},...JobFragmentDoc.definitions]};
export const GetJobLogsDocument: DocumentNode<GetJobLogsQuery, GetJobLogsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"-1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"items"}}]}}]}}]}}]};
export const AddJobDocument: DocumentNode<AddJobMutation, AddJobMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobOptionsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Job"}}]}}]}},...JobFragmentDoc.definitions]};
export const DeleteJobDocument: DocumentNode<DeleteJobMutation, DeleteJobMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobRemove"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const DeleteRepeatableJobByKeyDocument: DocumentNode<DeleteRepeatableJobByKeyMutation, DeleteRepeatableJobByKeyMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRepeatableJobByKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repeatableJobRemoveByKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]};
export const DeleteBulkJobsDocument: DocumentNode<DeleteBulkJobsMutation, DeleteBulkJobsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBulkJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobRemoveBulk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]};
export const RetryJobDocument: DocumentNode<RetryJobMutation, RetryJobMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RetryJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobRetry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const RetryBulkJobsDocument: DocumentNode<RetryBulkJobsMutation, RetryBulkJobsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RetryBulkJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobRetryBulk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]};
export const PromoteJobDocument: DocumentNode<PromoteJobMutation, PromoteJobMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PromoteJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobPromote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]};
export const PromoteBulkJobsDocument: DocumentNode<PromoteBulkJobsMutation, PromoteBulkJobsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PromoteBulkJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobPromoteBulk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]};
export const GetQueueByIdDocument: DocumentNode<GetQueueByIdQuery, GetQueueByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}},...QueueFragmentDoc.definitions]};
export const GetQueueWorkersDocument: DocumentNode<GetQueueWorkersQuery, GetQueueWorkersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueWorkers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addr"}},{"kind":"Field","name":{"kind":"Name","value":"age"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"idle"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"db"}},{"kind":"Field","name":{"kind":"Name","value":"omem"}}]}}]}}]}}]};
export const PauseQueueDocument: DocumentNode<PauseQueueMutation, PauseQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PauseQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queuePause"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPaused"}}]}}]}}]};
export const ResumeQueueDocument: DocumentNode<ResumeQueueMutation, ResumeQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResumeQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueResume"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPaused"}}]}}]}}]};
export const GetQueueRulesDocument: DocumentNode<GetQueueRulesQuery, GetQueueRulesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueRules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Rule"}}]}}]}}]}},...RuleFragmentDoc.definitions]};
export const DeleteQueueDocument: DocumentNode<DeleteQueueMutation, DeleteQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkActivity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"checkActivity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkActivity"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedKeys"}}]}}]}}]};
export const CleanQueueDocument: DocumentNode<CleanQueueMutation, CleanQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CleanQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"grace"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Duration"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueClean"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"grace"},"value":{"kind":"Variable","name":{"kind":"Name","value":"grace"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]};
export const DrainQueueDocument: DocumentNode<DrainQueueMutation, DrainQueueMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DrainQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"delayed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueDrain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"delayed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"delayed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Queue"}}]}}]}}]}},...QueueFragmentDoc.definitions]};
export const GetJobSchemaDocument: DocumentNode<GetJobSchemaQuery, GetJobSchemaQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueJobSchema"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}},{"kind":"Field","name":{"kind":"Name","value":"schema"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpts"}}]}}]}}]};
export const GetJobSchemasDocument: DocumentNode<GetJobSchemasQuery, GetJobSchemasQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobSchemas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobSchemas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}},{"kind":"Field","name":{"kind":"Name","value":"schema"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpts"}}]}}]}}]}}]};
export const SetJobSchemaDocument: DocumentNode<SetJobSchemaMutation, SetJobSchemaMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetJobSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schema"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONSchema"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"defaultOpts"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobOptionsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueJobSchemaSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"schema"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schema"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"defaultOpts"},"value":{"kind":"Variable","name":{"kind":"Name","value":"defaultOpts"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}},{"kind":"Field","name":{"kind":"Name","value":"schema"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpts"}}]}}]}}]};
export const DeleteJobSchemaDocument: DocumentNode<DeleteJobSchemaMutation, DeleteJobSchemaMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteJobSchema"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queueJobSchemaDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"jobName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}}]}}]}}]};
export const GetJobOptionsSchemaDocument: DocumentNode<GetJobOptionsSchemaQuery, GetJobOptionsSchemaQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetJobOptionsSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobOptionsSchema"}}]}}]};
export const GetQueueJobsNamesDocument: DocumentNode<GetQueueJobsNamesQuery, GetQueueJobsNamesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueJobsNames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobNames"}}]}}]}}]};
export const GetAppInfoDocument: DocumentNode<GetAppInfoQuery, GetAppInfoQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAppInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"env"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"author"}}]}}]}}]};
export const GetHostsDocument: DocumentNode<GetHostsQuery, GetHostsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}},{"kind":"Field","name":{"kind":"Name","value":"queues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}}]}}]}}]}}]};
export const GetHostChannelsDocument: DocumentNode<GetHostChannelsQuery, GetHostChannelsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getHostChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationChannel"}}]}}]}}]}},...NotificationChannelFragmentDoc.definitions]};
export const GetAvailableMetricsDocument: DocumentNode<GetAvailableMetricsQuery, GetAvailableMetricsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAvailableMetrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"isPolling"}}]}}]}}]};
export const GetAvailableAggregatesDocument: DocumentNode<GetAvailableAggregatesQuery, GetAvailableAggregatesQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAvailableAggregates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]};
export const GetRuleByIdDocument: DocumentNode<GetRuleByIdQuery, GetRuleByIdQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRuleById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ruleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"Argument","name":{"kind":"Name","value":"ruleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ruleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Rule"}}]}}]}},...RuleFragmentDoc.definitions]};
export const CreateRuleDocument: DocumentNode<CreateRuleMutation, CreateRuleMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RuleAddInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ruleAdd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Rule"}}]}}]}}]}},...RuleFragmentDoc.definitions]};
export const DeleteRuleDocument: DocumentNode<DeleteRuleMutation, DeleteRuleMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ruleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ruleDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"queueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ruleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ruleId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isDeleted"}}]}}]}}]};
export const GetStatsSpanDocument: DocumentNode<GetStatsSpanQuery, GetStatsSpanQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatsSpan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsSpanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statsDateRange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}}]}}]}}]};
export const GetQueueStatsDocument: DocumentNode<GetQueueStatsQuery, GetQueueStatsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const GetQueueStatsLatestDocument: DocumentNode<GetQueueStatsLatestQuery, GetQueueStatsLatestQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQueueStatsLatest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsLatestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastStatsSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const GetHostStatsLatestDocument: DocumentNode<GetHostStatsLatestQuery, GetHostStatsLatestQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHostStatsLatest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsLatestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastStatsSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const QueueStatsUpdatedDocument: DocumentNode<QueueStatsUpdatedSubscription, QueueStatsUpdatedSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"QueueStatsUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsUpdatedSubscriptionFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onQueueStatsUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const HostStatsUpdatedDocument: DocumentNode<HostStatsUpdatedSubscription, HostStatsUpdatedSubscriptionVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"HostStatsUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsUpdatedSubscriptionFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onHostStatsUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const DashboardPageDocument: DocumentNode<DashboardPageQuery, DashboardPageQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"uri"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redis_version"}},{"kind":"Field","name":{"kind":"Name","value":"uptime_in_seconds"}},{"kind":"Field","name":{"kind":"Name","value":"connected_clients"}},{"kind":"Field","name":{"kind":"Name","value":"blocked_clients"}},{"kind":"Field","name":{"kind":"Name","value":"total_system_memory"}},{"kind":"Field","name":{"kind":"Name","value":"used_memory"}},{"kind":"Field","name":{"kind":"Name","value":"maxmemory"}}]}},{"kind":"Field","name":{"kind":"Name","value":"jobCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"failed"}},{"kind":"Field","name":{"kind":"Name","value":"paused"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"delayed"}},{"kind":"Field","name":{"kind":"Name","value":"waiting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queueCount"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"EnumValue","value":"minute"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatsSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"EnumValue","value":"minute"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}}]}}]}},...StatsSnapshotFragmentDoc.definitions]};
export const HostPageQueryDocument: DocumentNode<HostPageQueryQuery, HostPageQueryQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HostPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HostQueuesFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"host"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"redis"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RedisStats"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}},{"kind":"Field","name":{"kind":"Name","value":"repeatableJobCount"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}},{"kind":"Field","name":{"kind":"Name","value":"throughput"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errorRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ruleAlertCount"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"EnumValue","value":"minute"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"EnumValue","value":"minute"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastStatsSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"EnumValue","value":"minute"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitTimeAvg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"500"}}]}]}}]}}]}},...RedisStatsFragmentDoc.definitions,...JobCountsFragmentDoc.definitions,...StatsSnapshotFragmentDoc.definitions]};
export const QueueSchemaQueryDocument: DocumentNode<QueueSchemaQueryQuery, QueueSchemaQueryQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QueueSchemaQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"jobNames"}},{"kind":"Field","name":{"kind":"Name","value":"jobSchemas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobName"}},{"kind":"Field","name":{"kind":"Name","value":"schema"}},{"kind":"Field","name":{"kind":"Name","value":"defaultOpts"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}}]}}]}},...JobCountsFragmentDoc.definitions]};
export const QueueStatsPageQueryDocument: DocumentNode<QueueStatsPageQueryQuery, QueueStatsPageQueryQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"QueueStatsPageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"granularity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StatsGranularity"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"queue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hostId"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"JobCounts"}},{"kind":"Field","name":{"kind":"Name","value":"jobNames"}},{"kind":"Field","name":{"kind":"Name","value":"workerCount"}},{"kind":"Field","name":{"kind":"Name","value":"throughput"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errorRate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"m1Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m5Rate"}},{"kind":"Field","name":{"kind":"Name","value":"m15Rate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ruleAlertCount"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"granularity"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"statsAggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"granularity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"granularity"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StatsSnapshot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"waitTimeAvg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"500"}}]}]}}]}},...JobCountsFragmentDoc.definitions,...StatsSnapshotFragmentDoc.definitions]};
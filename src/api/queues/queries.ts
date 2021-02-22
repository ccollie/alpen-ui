import {
  GetJobOptionsSchemaDocument,
  GetJobOptionsSchemaQuery,
  GetJobSchemasDocument,
  GetJobSchemasQuery,
  GetQueueByIdDocument,
  GetQueueByIdQuery,
  GetQueueJobsNamesDocument,
  GetQueueJobsNamesQuery,
  JobSchema,
  Queue,
} from '../generated';
import { client } from '../../providers/ApolloProvider';
import { ApolloError } from '@apollo/client';

export const getQueueById = (id: string): Promise<Queue> => {
  return client
    .query<GetQueueByIdQuery>({
      query: GetQueueByIdDocument,
      variables: { id },
    })
    .then((fetchResult) => {
      if (fetchResult?.error) {
        throw new ApolloError(fetchResult?.error);
      }
      return fetchResult?.data?.queue as Queue;
    });
};

export const getJobNames = (id: string): Promise<string[]> => {
  return client
    .query<GetQueueJobsNamesQuery>({
      query: GetQueueJobsNamesDocument,
      variables: { id },
    })
    .then((fetchResult) => {
      if (fetchResult?.error) {
        throw new ApolloError(fetchResult?.error);
      }
      return fetchResult?.data?.queue?.jobNames ?? [];
    });
};

export const getJobSchemas = (id: string): Promise<JobSchema[]> => {
  return client
    .query<GetJobSchemasQuery>({
      query: GetJobSchemasDocument,
      variables: { queueId: id },
    })
    .then((fetchResult) => {
      if (fetchResult?.error) {
        throw new ApolloError(fetchResult?.error);
      }
      return fetchResult?.data?.queue?.jobSchemas ?? [];
    });
};

export const getJobOptionsSchema = (): Promise<Record<string, any>> => {
  return client
    .query<GetJobOptionsSchemaQuery>({
      query: GetJobOptionsSchemaDocument,
    })
    .then((result) => {
      if (result?.error) {
        throw new ApolloError(result?.error);
      }
      return result?.data?.jobOptionsSchema;
    });
};

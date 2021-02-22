import { BulkActionType } from '../../components';
import { EventEmitter, EventHandler, UnsubscribeFn } from '../../lib';

export const REFRESH_EVENT = 'JOB-LIST-REFRESH';
export const JOB_DELETED_EVENT = 'JOB-DELETED';
export const JOB_PROMOTED_EVENT = 'JOB-PROMOTED';
export const JOB_RETRIED_EVENT = 'JOB-RETRIED';
export const BULK_JOB_EVENT = 'BULK-JOB-ACTION-EVENT';
export const QUEUE_JOB_COUNT_UPDATED = 'QUEUE_JOB_COUNT_UPDATED';

function emit(evt: string, data?: any) {
  return EventEmitter.dispatch(evt, data);
}

export function subscribe(event: string, handler: EventHandler): UnsubscribeFn {
  return EventEmitter.subscribe(event, handler);
}

export function unsubscribe(event: string, handler: EventHandler) {
  EventEmitter.unsubscribe(event, handler);
}

export function onRefresh(handler: EventHandler): UnsubscribeFn {
  return subscribe(REFRESH_EVENT, handler);
}

export function offRefresh(handler: EventHandler): void {
  unsubscribe(REFRESH_EVENT, handler);
}

export function onJobDeleted(handler: EventHandler): UnsubscribeFn {
  return subscribe(JOB_DELETED_EVENT, handler);
}

export function offJobDeleted(handler: EventHandler) {
  unsubscribe(JOB_DELETED_EVENT, handler);
}

export function onBulkJobAction(handler: EventHandler): UnsubscribeFn {
  return subscribe(BULK_JOB_EVENT, handler);
}

export function offBulkJobAction(handler: EventHandler) {
  unsubscribe(BULK_JOB_EVENT, handler);
}

export function handleBulkAction(
  action: BulkActionType,
  ids: string[],
  count?: number,
) {
  if (count || 0) {
    emit(BULK_JOB_EVENT, { action, ids, count });
  }
}

export function emitRefresh(data?: any): void {
  emit(REFRESH_EVENT, data);
}

export function emitJobEvent(
  event: string,
  jobId: string,
  queueId: string,
): void {
  emit(event, { jobId, queueId });
}

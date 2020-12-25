import React, { useState } from 'react';
import { getJobs, JobFragment, JobStatus } from '../../api';

interface ListState {
  isLoading: boolean;
  called: boolean;
  error?: Error | undefined;
  data: JobFragment[];
}

interface JobQueryProps {
  queueId: string;
}

export function useJobQuery(props: JobQueryProps) {
  const { queueId } = props;

  const state = React.useRef<ListState>({
    isLoading: false,
    called: false,
    data: [],
  });
  const [_pageSize, _setPageSize] = useState(10);
  const [_pageNumber, _setPageNumber] = useState(1);
  const [_status, _setStatus] = useState(JobStatus.Active);

  function setStatus(newStatus: JobStatus) {
    if (newStatus !== _status) {
      _setStatus(newStatus);
      _setPageNumber(1);
      state.current.called = false;
    }
  }

  async function fetch(
    pageNumber?: number,
    pageSize?: number,
    status?: JobStatus,
  ): Promise<{
    data: JobFragment[];
    total: number;
  }> {
    state.current.isLoading = true;
    state.current.error = undefined;
    if (status) {
      setStatus(status);
    }
    status = status || _status;
    pageSize = pageSize || _pageSize;
    pageNumber = pageNumber || _pageNumber;
    let data: JobFragment[] = [];
    let total = 0;
    try {
      const { counts, jobs } = await getJobs(
        queueId,
        status,
        pageNumber,
        pageSize,
      );

      total = parseInt((counts as any)[status], 10);
      if (isNaN(total)) total = 0;

      state.current.called = true;
      _setPageSize(pageSize);
      _setPageNumber(pageNumber);
      _setStatus(status);
      state.current.data = data = jobs;
    } catch (err) {
      state.current.error = err;
      console.log(err);
    } finally {
      state.current.isLoading = false;
    }
    return { total, data };
  }

  return [fetch, state.current];
}

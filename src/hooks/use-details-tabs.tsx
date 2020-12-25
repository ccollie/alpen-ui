import { List } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FaNotEqual, FaSadTear } from 'react-icons/fa';
import { Job, JobFragment, JobLogs, JobStatus } from '../api';
import { Highlight } from '../components/Highlight';
import { hash, isString, safeParse } from '../lib';
import { useInterval } from './use-interval';

const regularItems = ['Data', 'Options', 'Logs'];
const ReturnValueTabName = 'Return Value';
const ErrorTabName = 'Error';

type EmptyMessageProps = {
  icon: React.ReactNode;
  message: string;
};

const EmptyMessage: React.FC<EmptyMessageProps> = ({ icon, message }) => {
  const style = {
    align: 'center',
    justify: 'center',
    verticalAlign: 'center',
    opacity: '25%',
  };
  return (
    <div style={style}>
      <div>
        <span>{icon}</span>
        <div>
          <pre>{message}</pre>
        </div>
      </div>
    </div>
  );
};

const Logs = ({
  job,
  status,
  fetchLogs,
}: {
  job: Job | JobFragment;
  status: JobStatus;
  fetchLogs: (start: number, end: number) => Promise<JobLogs>;
}) => {
  const [delay, setDelay] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const logLines = useRef<
    {
      text: string;
      id: number;
    }[]
  >([]);

  // todo: display in reverse ??
  function loadLogs() {
    setLoading(true);
    fetchLogs(startIndex, -1)
      .then((res) => {
        setStartIndex(startIndex + res.items.length);
        res.items.forEach((line) => {
          logLines.current.push({
            text: line,
            id: hash(line),
          });
        });
        setCalled(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(loadLogs, []);

  useEffect(() => {
    const state = job.state || status;
    setDelay(state === JobStatus.Active ? 3000 : null);
  }, [status, job.state]);

  useInterval(loadLogs, delay);

  if (!logLines.current.length && called) {
    return (
      <EmptyMessage
        icon={<FaSadTear />}
        message={`No logs found for job ${job.name + '#' + job.id}.`}
      />
    );
  }
  return (
    <div className="table-container">
      <List
        dataSource={logLines.current}
        loading={loading && !called}
        renderItem={(item: any) => (
          <List.Item key={item.id}>{item.text}</List.Item>
        )}
      />
    </div>
  );
};

interface ReturnValueProps {
  value: any;
}

const ReturnValue: React.FC<ReturnValueProps> = ({ value }) => {
  const hasValue = !(value === null || value === undefined);
  if (!hasValue) {
    value = {};
  } else if (isString(value)) {
    value = safeParse(value);
  }
  const isObj = typeof value === 'object';
  const code = isObj ? JSON.stringify(value, null, 2) : null;
  if (!hasValue)
    return (
      <EmptyMessage icon={<FaNotEqual />} message={'No results returned'} />
    );

  return (
    <>
      {isObj ? (
        <Highlight language="json">{code}</Highlight>
      ) : (
        <div>{value}</div>
      )}
    </>
  );
};

export type DetailTabInfo = {
  title: string;
  isActive: boolean;
  isDisabled: boolean;
  select: () => void;
};

export function useDetailsTabs(
  currentStatus: JobStatus,
  getLogs: (start: number, end: number) => Promise<JobLogs>,
) {
  const [tabs, updateTabs] = useState<string[]>([]);
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const selectedTab = tabs[selectedTabIdx];

  useEffect(() => {
    let newTabs: string[] = [];
    if (currentStatus === JobStatus.Completed) {
      newTabs = [ReturnValueTabName];
    } else if (currentStatus === JobStatus.Failed) {
      newTabs = [ErrorTabName];
    }
    updateTabs(newTabs.concat(regularItems));
  }, [currentStatus]);

  function getDisabled(title: string): boolean {
    if (title === ReturnValueTabName)
      return currentStatus !== JobStatus.Completed;
    if (title === ErrorTabName) return currentStatus !== JobStatus.Failed;
    return false;
  }

  return {
    tabs: tabs.map((title, index) => ({
      title,
      isDisabled: getDisabled(title),
      isActive: title === selectedTab,
      select: () => setSelectedTabIdx(index),
    })) as DetailTabInfo[],
    selectedTab,
    getTabContent: (job: Job | JobFragment) => {
      const { data, opts, failedReason, stacktrace } = job;
      switch (selectedTab) {
        case 'Data':
          return (
            <Highlight language="json">
              {JSON.stringify(data, null, 2)}
            </Highlight>
          );
        case 'Options':
          return (
            <Highlight language="json">
              {JSON.stringify(opts, null, 2)}
            </Highlight>
          );
        case 'Error':
          return (
            <>
              {!failedReason && <div className="error">{'NA'}</div>}
              <Highlight language="stacktrace" key="stacktrace">
                {stacktrace}
              </Highlight>
            </>
          );
        case 'Logs':
          return <Logs job={job} status={currentStatus} fetchLogs={getLogs} />;
        case 'Return Value': {
          return <ReturnValue value={job?.returnvalue} />;
        }
        default:
          return null;
      }
    },
  };
}

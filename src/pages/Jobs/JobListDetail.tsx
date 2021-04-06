import React from 'react';
import { useDetailsTabs } from '../../hooks';
import {
  FaDatabase,
  FaEquals,
  FaExclamation,
  FaList,
  FaSadTear,
  FaSlidersH,
} from 'react-icons/fa';
import { Job, JobFragment, JobLogs, JobStatus } from '../../api';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const TabNames = ['Error', 'Data', 'Options', 'Logs', 'Return Value'];
const Icons = [FaExclamation, FaDatabase, FaSlidersH, FaList, FaEquals];

function PaneIcon({ tabName }: { tabName: string }) {
  let Icon = FaSadTear;
  let i = TabNames.indexOf(tabName);
  if (i >= 0) Icon = Icons[i];
  const iconStyle = {
    marginRight: '3px',
  };
  return <Icon style={iconStyle} />;
}

type JobListDetailProps = {
  job: Job | JobFragment;
  status: JobStatus;
  isLoading?: boolean;
  getLogs: (start: number, end: number) => Promise<JobLogs>;
};

export const JobListDetail: React.FC<JobListDetailProps> = (props) => {
  const { job, status, getLogs } = props;
  const { tabs, selectedTab, getTabContent } = useDetailsTabs(status, getLogs);

  function onTabChange(activeKey: string): void {
    const tab = tabs.find((tab) => tab.title === activeKey);
    tab?.select();
  }

  return (
    <Tabs type="card" onChange={onTabChange}>
      {tabs.map((tab, index) => (
        <TabPane
          disabled={tab.isDisabled}
          tab={
            <span>
              {' '}
              <PaneIcon tabName={tab.title} /> {tab.title}
            </span>
          }
          key={tab.title}
        >
          <div>{tab.isActive ? getTabContent(job) : <span />}</div>
        </TabPane>
      ))}
    </Tabs>
  );
};

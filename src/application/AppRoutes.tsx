import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Host from '../pages/Host';
import Queue from '../pages/Queue';
import QueueJobs from '../pages/Jobs';
import Index from '../pages/Metrics';
import ScheduledJobs from '../pages/ScheduledJobs';
import Workers from '../pages/Workers';
import Rules from '../pages/Rules';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/hosts/:hostId" element={<Host />} />
      <Route path="/queues/:queueId" element={<Queue />}>
        <Route path="metrics" element={<Index />} />
        <Route path="jobs" element={<QueueJobs />} />
        <Route path="scheduled-jobs" element={<ScheduledJobs />} />
        <Route path="workers" element={<Workers />} />
        <Route path="rules" element={<Rules />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

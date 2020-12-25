import { JobStatus } from '../../api';
import { FaCheckCircle, FaExclamation } from 'react-icons/fa';
import React from 'react';

type FinishedIconProps = {
  status: JobStatus;
};

export const FinishedIcon: React.FC<FinishedIconProps> = ({ status }) => {
  return status === JobStatus.Completed ? <FaCheckCircle /> : <FaExclamation />;
};

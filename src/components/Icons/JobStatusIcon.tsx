import React from 'react';
import { JobStatus } from '../../api';
import {
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaCog,
  FaExclamationTriangle,
} from 'react-icons/fa';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface JobStatusIconProps {
  status?: JobStatus;
  size?: IconSize;
  text?: string;
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 64,
  xl: 128,
};

export const JobStatusIcon: React.FC<JobStatusIconProps> = (props) => {
  const { size = 'md', status = JobStatus.Waiting } = props;
  const style = Object.create(null);

  let klass = 'f-spinner';
  switch (status) {
    case JobStatus.Completed:
      klass = 'is-success';
      break;
    case JobStatus.Failed:
      klass = 'is-error';
      break;
    case JobStatus.Waiting:
      klass = 'is-warning';
      break;
  }

  const iconSize = sizeMap[size];

  function Icon({ text, status }: JobStatusIconProps) {
    switch (status) {
      case JobStatus.Waiting:
        return <FaClock size={iconSize} style={style} />;
      case JobStatus.Active:
        return <FaCog size={iconSize} style={style} />;
      case JobStatus.Delayed:
        return <FaCalendar size={iconSize} style={style} />;
      case JobStatus.Completed:
        return <FaCheckCircle size={iconSize} style={style} />;
      case JobStatus.Failed:
        return <FaExclamationTriangle size={iconSize} style={style} />;
      default:
        return null;
    }
  }

  return <Icon status={status} />;
};

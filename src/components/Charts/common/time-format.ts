import { StatsGranularity } from '@/api';
import { timeFormat } from 'd3-time-format';
import {
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeMonth,
  timeWeek,
  timeYear,
} from 'd3-time';

export const DateFormats: Record<StatsGranularity, string> = {
  [StatsGranularity.Minute]: '%I:%M',
  [StatsGranularity.Hour]: '%I %p',
  [StatsGranularity.Day]: '%a %d',
  [StatsGranularity.Week]: '%b %d',
  [StatsGranularity.Month]: '%B',
};

const formatMillisecond = timeFormat('.%L'),
  formatSecond = timeFormat(':%S'),
  formatMinute = timeFormat('%I:%M'),
  formatHour = timeFormat('%I %p'),
  formatDay = timeFormat('%a %d'),
  formatWeek = timeFormat('%b %d'),
  formatMonth = timeFormat('%B'),
  formatYear = timeFormat('%Y');

export function formatDate(date: Date | number) {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  return (
    timeSecond(date) < date
      ? formatMillisecond
      : timeMinute(date) < date
      ? formatSecond
      : timeHour(date) < date
      ? formatMinute
      : timeDay(date) < date
      ? formatHour
      : timeMonth(date) < date
      ? timeWeek(date) < date
        ? formatDay
        : formatWeek
      : timeYear(date) < date
      ? formatMonth
      : formatYear
  )(date);
}

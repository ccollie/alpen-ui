import { StatsGranularity } from '@/api';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
// make this part of a store
import locale from 'antd/es/date-picker/locale/en_US';
import addMilliseconds from 'date-fns/addMilliseconds';
import ms from 'ms';
import React, { useEffect, useState } from 'react';
import {
  endOf,
  ONE_DAY,
  ONE_HOUR,
  ONE_MONTH,
  ONE_WEEK,
  startOf,
} from '@/lib/dates';
import DatePicker from '../DatePicker';
import { RangePickerValue } from '@/components';

const { RangePicker } = DatePicker;
const { Option } = Select;

export type RangeType = 'hour' | 'day' | 'week' | 'month' | 'custom';

export interface TimeRangeToolbarOpts {
  rangeType?: RangeType;
  range?: RangePickerValue;
  minDate?: Date;
  onRangeChange: (
    type: RangeType,
    dates: RangePickerValue,
    granularity: StatsGranularity,
  ) => void;
}

const TimeRangeToolbar: React.FC<TimeRangeToolbarOpts> = (props) => {
  const [rangeType, setRangeType] = useState<RangeType>(
    (props.rangeType ?? 'hour') as RangeType,
  );
  const [range, setRange] = useState<RangePickerValue>([null, null]);
  const [dateValue, setDateValue] = useState<Date | undefined>(new Date());
  const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  const [prevDisabled, setPrevDisabled] = useState<boolean>(false);
  const [custom, setCustom] = useState(false);

  function getGranularity(): StatsGranularity {
    let type = rangeType;
    if (rangeType === 'custom') {
      const [start, end] = range || [null, null];
      if (start && end) {
        const diff = Math.abs(end.getTime() - start.getTime());
        if (diff >= ONE_MONTH) {
          type = 'month';
        } else if (diff >= ONE_WEEK) {
          type = 'week';
        } else if (diff >= ONE_DAY) {
          type = 'day';
        } else if (diff >= ONE_HOUR) {
          type = 'hour';
        } else {
          type = 'hour';
        }
      }
    }
    switch (type) {
      case 'month':
        return StatsGranularity.Day;
      case 'week':
        return StatsGranularity.Hour;
      case 'day':
        return StatsGranularity.Hour;
      case 'hour':
        return StatsGranularity.Minute;
    }
    return StatsGranularity.Minute;
  }

  function emitChange() {
    const granularity = getGranularity();
    props.onRangeChange?.(rangeType, range, granularity);
  }

  function _setRange(start: Date | null, end: Date | null) {
    const [oldStart, oldEnd] = range || [null, null];
    if (props.minDate) {
      if (start && start < props.minDate) start = props.minDate;
    }
    setNextDisabled(!!end && end > new Date());
    setRange([start, end]);
    setDateValue(start ?? undefined);
    if (start !== oldStart || end !== oldEnd) {
      emitChange();
    }
  }

  function handleRangeChange(
    dates: RangePickerValue,
    dateStrings: [string, string],
  ) {
    setRangeType('custom');
    const [start, end] = dates || [null, null];
    _setRange(start, end);
  }

  function handleDateChange(value: Date | null, dateString: string) {
    if (value) {
      value = startOf(value, rangeType);
      setDateValue(value);
      _setRange(value, endOf(value, rangeType));
    } else {
      _setRange(null, null);
      setDateValue(value ?? undefined);
    }
  }

  function updateRangeType(type: RangeType) {
    setRangeType(type);
    const pivot = getPivotDate();
    const start = startOf(pivot, rangeType);
    const end = endOf(pivot, rangeType);
    _setRange(start, end);
    const isCustom = !['day', 'week', 'month'].includes(rangeType);
    setCustom(isCustom);
  }

  function getMidnight(): Date {
    const now = new Date();
    return startOf(now, 'day');
  }

  function yesterday(): [Date, Date] {
    const end = addMilliseconds(getMidnight(), -1);
    const start = startOf(end, 'day');
    return [start, end];
  }

  function today(): [Date, Date] {
    const start = getMidnight();
    return [start, endOf(start, 'day')];
  }

  function PickerWithType({ type }: { type: RangeType }) {
    const now = new Date();
    switch (type) {
      case 'day':
        return (
          <DatePicker
            locale={locale}
            defaultValue={dateValue}
            onChange={handleDateChange}
          />
        );
      case 'week':
        return (
          <DatePicker
            locale={locale}
            defaultValue={dateValue}
            picker="week"
            onChange={handleDateChange}
          />
        );
      case 'month':
        return (
          <DatePicker
            locale={locale}
            picker="month"
            format="MMM - YYYY"
            defaultValue={dateValue}
            onChange={handleDateChange}
          />
        );
      default:
        return (
          <RangePicker
            locale={locale}
            defaultValue={range}
            showTime={{ format: 'HH:mm' }}
            onChange={handleRangeChange}
            style={{ width: 265 }}
            ranges={{
              Yesterday: yesterday(),
              Today: today(),
              'This Week': [startOf(now, 'week'), endOf(now, 'week')],
              'This Month': [startOf(now, 'month'), endOf(now, 'month')],
            }}
            showNow
            showHour
          />
        );
    }
  }

  useEffect(() => {
    updateRangeType(rangeType);
  }, [rangeType]);

  function getPivotDate(): Date {
    let pivot = new Date();
    if (range) {
      const [start, end] = range;
      if (start && end) {
        const diff = end.getTime() - start.getTime();
        pivot = addMilliseconds(start, diff / 2);
      } else {
        pivot = start || end || pivot;
      }
    }
    return pivot;
  }

  function incrementRange(direction: 'up' | 'down') {
    const interval = ms(`1 ${rangeType}`) * (direction === 'up' ? 1 : -1);
    let start = null,
      end = null;
    if (!custom) {
      // using datepicker rather than RangePicker
      start = dateValue || new Date();
    } else {
      if (range) {
        start = range[0];
        end = range[1];
      }
    }
    if (!start) {
      const pivot = getPivotDate();
      start = startOf(pivot, rangeType);
    }
    if (!end) {
      end = endOf(start, rangeType);
    }
    start = addMilliseconds(start, interval);
    end = addMilliseconds(end, interval);
    _setRange(start, end);
  }

  function next() {
    incrementRange('up');
  }

  function prev() {
    incrementRange('down');
  }

  return (
    <div>
      <Space>
        <Select value={rangeType} onChange={setRangeType}>
          <Option value="hour">Hour</Option>
          <Option value="day">Day</Option>
          <Option value="week">Week</Option>
          <Option value="month">Month</Option>
        </Select>
        <PickerWithType type={rangeType} />
        <Button
          icon={<LeftOutlined />}
          onClick={prev}
          disabled={prevDisabled}
        />
        <Button
          icon={<RightOutlined />}
          onClick={next}
          disabled={nextDisabled}
        />
      </Space>
    </div>
  );
};

export default TimeRangeToolbar;

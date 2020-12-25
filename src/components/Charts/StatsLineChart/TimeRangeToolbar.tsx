import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
import ms from 'ms';
import React, { useState } from 'react';
import { endOf, startOf } from '../../../lib/dates';
import DatePicker from '../../DatePicker';
import { RangePickerValue } from '../../RangePicker';
import addMilliseconds from 'date-fns/addMilliseconds';
const { RangePicker } = DatePicker;
const { Option } = Select;

export type RangeType = 'hour' | 'day' | 'week' | 'month' | 'custom';

export interface TimeRangeToolbarOpts {
  rangeType?: RangeType;
  range?: RangePickerValue;
  minDate?: Date;
  onRangeChange: (type: RangeType, dates: RangePickerValue) => void;
}

const TimeRangeToolbar: React.FC<TimeRangeToolbarOpts> = (props) => {
  const [rangeType, setRangeType] = useState<RangeType>(
    (props.rangeType ?? 'hour') as RangeType,
  );
  const [range, setRange] = useState<RangePickerValue>([null, null]);
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  const [prevDisabled, setPrevDisabled] = useState<boolean>(false);
  const [custom, setCustom] = useState(false);

  function emitChange() {
    props.onRangeChange && props.onRangeChange(rangeType, range);
  }

  function _setRange(start: Date | null, end: Date | null) {
    const [oldStart, oldEnd] = range || [null, null];
    if (props.minDate) {
      if (start && start < props.minDate) start = props.minDate;
    }
    setNextDisabled(!!end && end > new Date());
    setRange([start, end]);
    setDateValue(start);
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
    setDateValue(value);
    if (value) {
      value = startOf(value, rangeType);
      setDateValue(value);
      _setRange(value, endOf(value, rangeType));
    } else {
      _setRange(null, null);
    }
  }

  function updateRangeType(type: RangeType) {
    setRangeType(type);
    setCustom(false);
    const pivot = getPivotDate();
    const start = startOf(pivot, rangeType);
    const end = endOf(pivot, rangeType);
    _setRange(start, end);
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
    setCustom(false);
    switch (type) {
      case 'day':
        return <DatePicker value={dateValue} onChange={handleDateChange} />;
      case 'week':
        return (
          <DatePicker
            value={dateValue}
            picker="week"
            onChange={handleDateChange}
          />
        );
      case 'month':
        return (
          <DatePicker
            picker="month"
            format="MMM - YYYY"
            value={dateValue}
            onChange={handleDateChange}
          />
        );
      default:
        setCustom(true);
        return (
          <RangePicker
            value={range}
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
        <Select value={rangeType} onChange={updateRangeType}>
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

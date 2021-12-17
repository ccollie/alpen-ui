import createStore from 'zustand';
import { computed } from 'zustand-middleware-computed-state';
import { parseRelativeDate } from '@/lib/parse-relative-date';
import { toDate } from 'date-fns';

type DateLike = Date | string | number;

export type DurationRange = {
  start: DateLike;
  end: DateLike;
};

type THostState = {
  recentlyUsedRanges: DurationRange[];
  start: string;
  end: string;
  parsedStart: number;
  parsedEnd: number;
  updateRange: (start: DateLike, end: DateLike) => void;
};

function parse(d: DateLike): { stringValue: string; parsedValue: number } {
  let stringValue: string;
  let parsedValue: number;
  switch (typeof d) {
    case 'number':
      stringValue = toDate(d).toISOString();
      parsedValue = d;
      break;
    case 'string':
      stringValue = d;
      parsedValue = parseRelativeDate(d);
      break;
    default:
      parsedValue = d.valueOf();
      stringValue = d.toISOString();
      break;
  }
  return { stringValue, parsedValue };
}

const DEFAULT_START = 'now-1h';
const DEFAULT_END = 'now';

export const useDateRangeStore = createStore<THostState>(
  computed(
    (set, get) => ({
      start: DEFAULT_START,
      end: DEFAULT_END,
      parsedStart: parseRelativeDate(DEFAULT_START),
      parsedEnd: parseRelativeDate(DEFAULT_END),
      recentlyUsedRanges: [],
      updateRange(start: DateLike, end: DateLike) {
        const { recentlyUsedRanges } = get();
        const { parsedValue: _start, stringValue: _startString } = parse(start);
        const { parsedValue: _end, stringValue: _endString } = parse(end);
        if (_start < _end) {
          throw RangeError('Start should be before end');
        }

        const recents = recentlyUsedRanges.filter((range) => {
          const isDuplicate =
            range.start === _startString && range.end === _endString;
          return !isDuplicate;
        });

        recents.unshift({ start: _startString, end: _endString });
        if (recents.length > 10) {
          recents.pop();
        }

        set({
          start: _startString,
          end: _endString,
          parsedStart: _start,
          parsedEnd: _end,
          recentlyUsedRanges: recents,
        });
      },
    }),
    (state) => {
      const range = () => {
        const { parsedEnd, parsedStart } = state;
        return {
          start: parsedStart,
          end: parsedEnd,
        };
      };
      return {
        range: range(),
      };
    },
  ),
);

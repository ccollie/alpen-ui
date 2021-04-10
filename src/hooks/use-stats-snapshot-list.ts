import { StatsSnapshot } from '@/api';
import { useUpdateEffect } from '@/hooks/use-update-effect';
import { useRef, useState } from 'react';

export function useStatsSnapshotList(range: string, items: StatsSnapshot[]) {
  const snaps = useRef(items);
  const _range = useState(range);

  function arrayEqual(a1: StatsSnapshot[], a2: StatsSnapshot[]) {
    if (a1.length !== a2.length) return false;
    if (a1.length > 0) {
      if (a1[0].startTime !== a2[0].startTime) return false;
    }
    for (let i = 0; i < a1.length; i++) {
      if (a1[i].startTime !== a2[i].startTime) {
        return false;
      }
    }
    return true;
  }

  useUpdateEffect(() => {
    snaps.current = [];
  }, [_range]);

  function internalUpdate(items: StatsSnapshot[]): boolean {
    // TODO: Better more comprehensive check. For now, we simply check
    // both ends to make sure if we've changed
    const current = snaps.current;
    let oldLength = current.length;
    const newLength = items.length;
    if (oldLength === newLength) {
      if (oldLength === 0) return false;
      const lastIndex = items.length - 1;
      if (
        current[0].startTime === items[0].startTime &&
        current[lastIndex].endTime === items[lastIndex].startTime
      )
        return false;
    }
    if (newLength === 0) {
      if (oldLength !== 0) {
        current.splice(0, oldLength);
        return true;
      }
      return false;
    }
    if (oldLength == 0) {
      current.push(...items);
      return true;
    } else {
      const start = snaps.current[0].startTime;
      const ending = snaps.current[snaps.current.length - 1].endTime;
      const pre = items.filter((item) => item.endTime < start);
      const post = items.filter((item) => item.startTime > ending);
      current.unshift(...pre);
      current.push(...post);
      return oldLength !== current.length;
    }
  }

  function update(value: StatsSnapshot[]) {
    internalUpdate(value);
  }

  return {
    update,
    data: snaps.current,
  };
}

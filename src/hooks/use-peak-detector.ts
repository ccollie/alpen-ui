import { useRef, useState, useCallback } from 'react';
import {
  PeakDetector,
  PeakDetectorOptions,
  PeakSignal,
} from '@/lib/peak-detector';

export function usePeakDetector(options: PeakDetectorOptions) {
  const detector = useRef(new PeakDetector(options));
  const [signal, setSignal] = useState<PeakSignal>(PeakSignal.NONE);

  const update = useCallback(
    (value: number): PeakSignal => {
      const rev = detector.current.update(value);
      setSignal(rev);
      return signal;
    },
    [detector.current],
  );

  return {
    update,
    signal,
  };
}

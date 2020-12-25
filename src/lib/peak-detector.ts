import OnlineNormalEstimator from './online-normal-estimator';

const DEFAULT_THRESHOLD = 3.5;
const DEFAULT_LAG = 0;
const DEFAULT_INFLUENCE = 0.5;

export enum PeakSignal {
  NONE,
  ABOVE,
  BELOW = -1,
}

export interface PeakDetectorOptions {
  lag?: number;
  /** Deviations from the mean */
  threshold?: number;
  influence?: number;
}

const DefaultDetectorOptions: PeakDetectorOptions = {
  lag: DEFAULT_LAG,
  threshold: DEFAULT_THRESHOLD,
  influence: DEFAULT_INFLUENCE,
};

/**
 * "Smoothed zero-score algorithm" shamelessly copied from
 *  https://stackoverflow.com/a/22640362/6029703
 *  Uses a rolling mean and a rolling deviation (separate) to identify peaks in a vector
 *
 * @param lag - The lag time (in ms) of the moving window how much your data will be smoothed
 * and how adaptive the algorithm is to changes in the long-term average of the data.
 * @param threshold - The z-score at which the algorithm signals (i.e. how many standard deviations
 * away from the moving mean a peak (or signal) is)
 * @param influence - The influence (between 0 and 1) of new signals on the mean and standard
 * deviation (how much a peak (or signal) should affect other values near it)
 * @return - The signal
 */
export class PeakDetector {
  public readonly lag: number;
  public readonly threshold: number;
  public readonly influence: number;
  public signal = PeakSignal.NONE;
  private filteredY: number;
  private readonly lagEnd: number;
  private readonly stats: OnlineNormalEstimator;

  constructor(options: PeakDetectorOptions = DefaultDetectorOptions) {
    const {
      lag = DEFAULT_LAG,
      threshold = DEFAULT_THRESHOLD,
      influence = DEFAULT_INFLUENCE,
    } = options;
    this.lag = lag;
    this.threshold = threshold;
    this.influence = influence;
    this.filteredY = 1;
    this.lagEnd = Date.now() + this.lag;
    this.stats = new OnlineNormalEstimator();
  }

  get isInLagPeriod(): boolean {
    return Date.now() < this.lagEnd;
  }

  update(value: number): PeakSignal {
    const { threshold, influence, stats } = this;

    this.signal = PeakSignal.NONE;

    if (this.isInLagPeriod) {
      stats.add(value);
      return PeakSignal.NONE;
    }

    const mean = stats.mean;
    const std = stats.standardDeviation;

    const oldValue = this.filteredY;

    // todo: skip signaling if we go > this.lag since the last update

    if (stats.count && Math.abs(value - mean) > threshold * std) {
      this.signal = value > mean ? PeakSignal.ABOVE : PeakSignal.BELOW;
      this.filteredY = influence * value + (1 - influence) * this.filteredY;
    } else {
      this.filteredY = value;
    }

    stats.replace(oldValue, this.filteredY);

    return this.signal;
  }
}

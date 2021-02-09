
export enum QueryState {
  RESET_STATE = 'reset',
  APPLY_STATE = 'apply',
}

export const DEFAULT_FILTER = {};
export const DEFAULT_LIMIT = 0;
export const DEFAULT_SAMPLE = false;
export const DEFAULT_SAMPLE_SIZE = 1000;
export const DEFAULT_STATE: QueryState = QueryState.RESET_STATE;

export type OptionType = 'filter' | 'limit';

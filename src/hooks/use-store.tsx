import React, { useEffect, createContext, useContext } from 'react';
import { QueueActions } from '../@types/actions';
import {
  AppInfo,
  GetAppInfoDocument,
  GetHostsAndQueuesDocument,
  Queue,
  QueueHost,
} from '@/api';
import { useApolloClient } from '@apollo/client';
import { useQueueActions } from '@/modules/queue/hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Noop = () => {};

type State = {
  app: AppInfo;
  hosts: QueueHost[];
  selectedHost: QueueHost | null;
  selectedQueue: Queue | null;
  loading: boolean;
  setSelectedHost: (host: QueueHost | string | null) => void;
  setSelectedQueue: (queue: Queue | string | null) => void;
};

export interface Store {
  state: State;
  fetchHosts(): Promise<QueueHost[]>;
  actions: QueueActions;
}

const InitialState: State = {
  app: {
    env: 'dev',
    title: 'Toro',
    version: '0.1',
  },
  hosts: [],
  selectedHost: null,
  selectedQueue: null,
  loading: false,
  setSelectedHost: Noop,
  setSelectedQueue: Noop,
};

export const StateContext = createContext(InitialState);

interface Meta {
  refCount: number;
  timeout?: NodeJS.Timeout;
  hasLoaded: boolean;
  appInfoLoaded: boolean;
  loadingAppInfo: boolean;
  isLoading: boolean;
}

const MetaContext = createContext<Meta>({
  appInfoLoaded: false,
  hasLoaded: false,
  refCount: 0,
  timeout: undefined,
  loadingAppInfo: false,
  isLoading: false,
});

export const useStore = (): Store => {
  const actions = useQueueActions();
  const state = useContext(StateContext);
  const meta = useContext(MetaContext);

  if (!state) {
    throw new Error('useItemData must be used within a StoreProvider tag');
  }

  const client = useApolloClient();

  function loadAppInfo() {
    if (!meta.appInfoLoaded) {
      if (meta.loadingAppInfo) return;
      meta.loadingAppInfo = true;
      // state.loading = true;

      client
        .query({
          query: GetAppInfoDocument,
        })
        .then((result) => {
          if (result.error) throw result.error;
          if (result.data) {
            state.app = result.data?.appInfo as AppInfo;
          }
          meta.appInfoLoaded = true;
        })
        .finally(() => {
          meta.loadingAppInfo = false;
        });
    }
  }

  async function fetchHosts(): Promise<QueueHost[]> {
    if (!meta.hasLoaded) {
      state.loading = true;
    }
    try {
      const result = await client.query({
        query: GetHostsAndQueuesDocument,
      });
      if (result.error) throw result.error;
      state.hosts = (result.data?.hosts ?? []) as QueueHost[];
      meta.hasLoaded = true;
      return state.hosts;
    } catch (e) {
      // todo: toast
      console.log(e);
      throw e;
    } finally {
      state.loading = false;
    }
  }

  useEffect(() => {
    loadAppInfo();
  }, []);

  useEffect(() => {
    state.setSelectedHost(state.selectedHost);
  }, [state.hosts]);

  return {
    state,
    fetchHosts,
    actions,
  };
};

export const StoreProvider: React.FC = ({ children }) => {
  const state = useContext(StateContext);

  function findHost(host: QueueHost | string): QueueHost | null {
    const id = typeof host === 'string' ? host : host.id;
    const found = state.hosts?.find((x) => x.id === id);
    return found ?? null;
  }

  state.setSelectedHost = (host: QueueHost | string | null): void => {
    if (host === null) {
      state.selectedHost = null;
    } else {
      state.selectedHost = findHost(host);
    }
  };

  state.setSelectedQueue = (queue: Queue | string | null): void => {
    const id = typeof queue === 'string' ? queue : queue?.id;
    let host: QueueHost | null = null;
    let found: Queue | null = null;
    const hosts = state.hosts || [];
    for (let i = 0; i < hosts.length; i++) {
      host = hosts[i];
      const val = (host.queues || []).find((x) => x.id === id);
      if (val) {
        found = val;
        break;
      }
    }
    state.selectedQueue = found;
    if (found) state.selectedHost = host;
  };

  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};

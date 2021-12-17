import createStore from 'zustand';
import { persist } from 'zustand/middleware';
import { StorageConfig } from '@/config/storage';

export interface Theme {
  id: string;
  name: string;
  publicPath: string;
}

// This is supplied to the app as JSON by Webpack - see next.config.js
export interface ThemeConfig {
  availableThemes: Array<Theme>;
  copyConfig: Array<{
    from: string;
    to: string;
  }>;
}

// The config is generated during the build and made available in a JSON string.
export const themeConfig: ThemeConfig = JSON.parse(process.env.THEME_CONFIG!);

interface TState {
  theme: string;
  availableThemes: Theme[];
  isDarkMode: boolean;
  setTheme: (value: string) => void;
}

const DarkRegex = /dark/i;
export const DEFAULT_THEME = 'amsterdam_light';

export const useThemeStore = createStore<TState>(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      get isDarkMode(): boolean {
        return DarkRegex.test(get().theme ?? DEFAULT_THEME);
      },
      availableThemes: themeConfig.availableThemes,
      setTheme(theme: string) {
        const { availableThemes } = get();
        const found = availableThemes.find(x => x.id === theme);
        if (found) {
          set({ theme });
        }
      },
    }),
    {
      name: `${StorageConfig.persistNs}theme`,
    }
  )
);

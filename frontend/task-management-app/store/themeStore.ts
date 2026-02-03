import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_SCHEMES, DEFAULT_THEME, DEFAULT_MODE } from '../constants/theme';

export type ThemeScheme = keyof typeof THEME_SCHEMES;
export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textDark: string;
  placeholderText: string;
  background: string;
  cardBackground: string;
  inputBackground: string;
  border: string;
  white: string;
  black: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

interface ThemeState {
  scheme: ThemeScheme;
  mode: ThemeMode;
  colors: ThemeColors;
  
  setScheme: (scheme: ThemeScheme) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  getColors: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      scheme: DEFAULT_THEME as ThemeScheme,
      mode: DEFAULT_MODE as ThemeMode,
      colors: THEME_SCHEMES[DEFAULT_THEME][DEFAULT_MODE],
      
      setScheme: (scheme) => {
        const { mode } = get();
        const colors = THEME_SCHEMES[scheme][mode];
        set({ scheme, colors });
      },
      
      setMode: (mode) => {
        const { scheme } = get();
        const colors = THEME_SCHEMES[scheme][mode];
        set({ mode, colors });
      },
      
      toggleMode: () => {
        const { mode, scheme } = get();
        const newMode = mode === 'light' ? 'dark' : 'light';
        const colors = THEME_SCHEMES[scheme][newMode];
        set({ mode: newMode, colors });
      },
      
      getColors: () => {
        const { scheme, mode } = get();
        return THEME_SCHEMES[scheme][mode];
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
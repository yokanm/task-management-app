import { useThemeStore } from '../store/themeStore';

/**
 * Custom hook for accessing theme state and methods
 */
export function useTheme() {
  const {
    scheme,
    mode,
    colors,
    setScheme,
    setMode,
    toggleMode,
    getColors,
  } = useThemeStore();

  return {
    // Current theme state
    scheme,
    mode,
    colors,
    
    // Theme methods
    setScheme,
    setMode,
    toggleMode,
    getColors,
    
    // Helper booleans
    isDark: mode === 'dark',
    isLight: mode === 'light',
    
    // Scheme names
    isNature: scheme === 'nature',
    isRetro: scheme === 'retro',
    isOcean: scheme === 'ocean',
    isBlossom: scheme === 'blossom',
  };
}
/**
 * Theme Color Hook
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 *
 * Returns the appropriate color based on current theme
 */
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors | string
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme as 'light' | 'dark'];

  if (colorFromProps) {
    return colorFromProps;
  }

  // If Colors is split into light/dark, prefer that, otherwise look up top-level color
  const themeColors = (Colors as any)[theme];
  if (themeColors && themeColors[colorName]) {
    return themeColors[colorName];
  }

  return (Colors as any)[colorName];
}

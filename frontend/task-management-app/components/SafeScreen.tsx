import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface SafeScreenProps {
  children: React.ReactNode;
}

/**
 * SafeScreen
 * Wraps every screen with safe-area top padding and the current theme
 * background colour. Previously used a hardcoded `bg-orange-400` Tailwind
 * class which tinted the entire app orange — that is now removed.
 */
export default function SafeScreen({ children }: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
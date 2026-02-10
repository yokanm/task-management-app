import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

/**
 * AuthButton
 * Reusable button component for auth screens.
 * Supports primary, secondary, outline, and text variants.
 */
export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  style,
  disabled,
  ...props
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || isLoading;

  const getButtonStyle = (): ViewStyle => {
    if (isDisabled) {
      return {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        borderWidth: 1,
      };
    }

    switch (variant) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'secondary':
        return { backgroundColor: `${colors.primary}20` };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1.5,
        };
      case 'text':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = (): string => {
    if (isDisabled) return colors.textSecondary;

    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // always white on primary fill
      case 'secondary':
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'text' && styles.textVariant,
        getButtonStyle(),
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'text' && styles.textLabel,
            { color: getTextColor() },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  textVariant: {
    height: 'auto' as any,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLabel: {
    fontSize: 14,
  },
});
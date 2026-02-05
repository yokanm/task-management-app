import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '@/store/authStore';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  style,
  disabled,
  ...props
}) => {

  const {user, isLoading: isAuthLoading} = useAuthStore();
  const { colors } = useTheme();

  const getButtonStyle = () => {
    if (disabled || isLoading) {
      return {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: `${colors.primary}20`, // 20% opacity
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1.5,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    if (disabled || isLoading) {
      return { color: colors.textSecondary };
    }

    switch (variant) {
      case 'primary':
        return { color: colors.white };
      case 'secondary':
      case 'outline':
      case 'text':
        return { color: colors.primary };
      default:
        return { color: colors.white };
    }
  };

  return (
    <TouchableOpacity
      className={`h-14 rounded-xl justify-center items-center px-6 ${fullWidth ? 'w-full' : ''} ${variant === 'text' ? 'h-auto py-2' : ''}`}
      style={[getButtonStyle(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.black : colors.primary} />
      ) : (
        <Text 
          className={`text-base font-semibold ${variant === 'text' ? 'text-sm' : ''}`}
          style={getTextStyle()}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
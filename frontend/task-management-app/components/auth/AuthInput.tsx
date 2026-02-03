import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface AuthInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  ...props
}) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text 
          className="text-sm font-semibold mb-1"
          style={{ color: colors.textPrimary }}
        >
          {label}
        </Text>
      )}
      
      <View 
        className="flex-row items-center rounded-xl px-4 h-14 border"
        style={{
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : isFocused ? colors.primary : 'transparent',
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}
        
        <TextInput
          className="flex-1 text-base h-full"
          style={{ color: colors.textPrimary }}
          placeholderTextColor={colors.placeholderText}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-1"
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text 
          className="text-xs mt-1 ml-1"
          style={{ color: colors.error }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { authAPI } from '../../services/api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { registerSchema, type RegisterInput } from '../../utils/validationSchemas';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormValidation<RegisterInput>({
    schema: registerSchema,
    onSubmit: async (data) => {
      try {
        await authAPI.register({
          username: data.username,
          email: data.email,
          password: data.password,
        });

        Alert.alert(
          'Success!',
          'Your account has been created successfully. Please sign in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ]
        );
      } catch (error: any) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        Alert.alert('Registration Failed', errorMessage);
      }
    },
    mode: 'onChange',
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 px-8 pt-8 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text 
            className="text-3xl font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Create Account
          </Text>
          <Text 
            className="text-base"
            style={{ color: colors.textSecondary }}
          >
            Sign up to get started
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <AuthInput
            label="Username"
            placeholder="Choose a username"
            value={values.username || ''}
            onChangeText={(text) => handleChange('username', text)}
            onBlur={() => handleBlur('username')}
            error={errors.username}
            icon="person-outline"
            autoCapitalize="none"
            autoComplete="username"
          />

          <AuthInput
            label="Email"
            placeholder="Enter your email"
            value={values.email || ''}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            placeholder="Create a password"
            value={values.password || ''}
            onChangeText={(text) => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password-new"
          />

          <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={values.confirmPassword || ''}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password-new"
          />

          {/* Password Requirements */}
          <View 
            className="p-3 rounded-lg mb-4"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <Text 
              className="text-xs font-semibold mb-1"
              style={{ color: colors.textSecondary }}
            >
              Password must contain:
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              • At least 8 characters
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              • One uppercase letter (A-Z)
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              • One lowercase letter (a-z)
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              • One number (0-9)
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              • One special character (!@#$%^&*)
            </Text>
          </View>

          {/* Terms and Conditions */}
          <View className="mb-6">
            <Text className="text-sm text-center leading-5" style={{ color: colors.textSecondary }}>
              By signing up, you agree to our{' '}
              <Text className="font-medium" style={{ color: colors.primary }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text className="font-medium" style={{ color: colors.primary }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <AuthButton
            title="Sign Up"
            onPress={handleSubmit}
            isLoading={isSubmitting}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <Text className="text-sm mx-4" style={{ color: colors.textSecondary }}>
              OR
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </View>

          {/* Social Sign Up */}
          <AuthButton
            title="Sign Up with Google"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Google Sign Up will be available soon')}
          />
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center items-center mt-auto">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
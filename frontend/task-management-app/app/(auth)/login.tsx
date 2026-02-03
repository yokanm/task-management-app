import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginSchema, type LoginInput } from '../../utils/validationSchemas';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setUser, setTokens, setLoading } = useAuthStore();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormValidation<LoginInput>({
    schema: loginSchema,
    onSubmit: async (data) => {
      setLoading(true);
      
      try {
        const response = await authAPI.login(data);
        const { user, accessToken, refreshToken } = response.data;

        setUser(user);
        setTokens(accessToken, refreshToken);
        
        // Navigation will be handled by root layout
        // router.replace('/(tabs)');
      } catch (error: any) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        Alert.alert('Login Failed', errorMessage);
      } finally {
        setLoading(false);
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
        className="flex-1 px-8 pt-12 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-10">
          <Text 
            className="text-3xl font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Welcome Back!
          </Text>
          <Text 
            className="text-base"
            style={{ color: colors.textSecondary }}
          >
            Sign in to continue to your account
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
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
            placeholder="Enter your password"
            value={values.password || ''}
            onChangeText={(text) => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password"
          />

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-6">
            <Text 
              className="text-sm font-medium"
              style={{ color: colors.primary }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <AuthButton
            title="Sign In"
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

          {/* Social Sign In */}
          <AuthButton
            title="Sign In with Google"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Google Sign In will be available soon')}
          />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mt-auto">
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-base font-semibold" style={{ color: colors.primary }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
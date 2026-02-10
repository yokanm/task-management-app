import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { loginSchema } from '../../validation/auth.validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    // Validate with Zod
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    const response = await login(email, password);
    
    if (!response.success) {
      Alert.alert('Login Failed', response.error || 'Invalid credentials');
    } else {
      router.replace('/(tabs)');
    }
  };

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

        <View className="mb-8">
          <AuthInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password"
          />

          <TouchableOpacity className="self-end mb-6">
            <Text 
              className="text-sm font-medium"
              style={{ color: colors.primary }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AuthButton
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
          />

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <Text className="text-sm mx-4" style={{ color: colors.textSecondary }}>
              OR
            </Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </View>

          <AuthButton
            title="Sign In with Google"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Google Sign In will be available soon')}
          />
        </View>

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
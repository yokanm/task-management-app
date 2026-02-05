import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { useAuthStore } from '@/store/authStore';
import { registerSchema } from '@/validation/auth.validation';

export default function Register() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    

    const router = useRouter();
    const { colors } = useTheme();
    const { register, isLoading } = useAuthStore();

    const handleRegister = async () => {
        // Validate with Zod
        const result = registerSchema.safeParse({ username: userName, email, password });
        
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((error) => {
                if (error.path[0]) fieldErrors[error.path[0] as string] = error.message;
            });
            setErrors(fieldErrors);
            return;
        }
        
        // Clear errors and submit
        setErrors({});
        const response = await register(userName, email, password);
        
        if (!response.success) {
            Alert.alert('Registration Failed', response.error || 'Something went wrong');
        } else {
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        }
      
      // 
    }

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
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
            }}
            // onBlur={() => handleBlur('username')}
            error={errors.username}
            icon="person-outline"
            autoCapitalize="none"
            autoComplete="username"
          />

          <AuthInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            // onBlur={() => handleBlur('email')}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            // onBlur={() => handleBlur('password')}
            error={errors.password}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password-new"
          />

          {/* <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={isSetPasswordVisible.toString()}
            onChangeText={(text) => setIsPasswordVisible(text)}
            // onBlur={() => handleBlur('confirmPassword')}
            // error={errors.confirmPassword}
            icon="lock-closed-outline"
            isPassword
            autoCapitalize="none"
            autoComplete="password-new"
          /> */}
         
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
            onPress={handleRegister}
            disabled={isLoading}
            
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
  )
}
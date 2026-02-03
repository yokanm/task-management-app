import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, hasSeenOnboarding } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else if (hasSeenOnboarding) {
        router.replace('/(auth)/sign-in');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasSeenOnboarding]);

  return (
    <View 
      className="flex-1 justify-between items-center py-12"
      style={{ backgroundColor: colors.primary }}
    >
      {/* Logo/Brand */}
      <View className="flex-1 justify-center items-center">
        <View 
          className="w-24 h-24 rounded-full justify-center items-center mb-6 shadow-lg"
          style={{ 
            backgroundColor: colors.white,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text 
            className="text-4xl font-bold"
            style={{ color: colors.primary }}
          >
            TM
          </Text>
        </View>
        <Text 
          className="text-3xl font-bold mb-1"
          style={{ color: colors.white }}
        >
          Task Manager
        </Text>
        <Text 
          className="text-base opacity-90"
          style={{ color: colors.white }}
        >
          Organize. Prioritize. Achieve.
        </Text>
      </View>

      {/* Loading indicator */}
      <View className="mb-8">
        <ActivityIndicator size="large" color={colors.white} />
      </View>

      {/* Footer */}
      <View className="items-center">
        <Text 
          className="text-sm opacity-70"
          style={{ color: colors.white }}
        >
          © 2026 Task Manager
        </Text>
      </View>
    </View>
  );
}
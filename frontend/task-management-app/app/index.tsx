import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';
import './globals.css';

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding, checkAuth, isCheckingAuth } = useAuthStore();
  const { colors } = useTheme();

  useEffect(() => {
    // Load auth state from AsyncStorage on mount
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors?.background || '#fff' 
      }}>
        <ActivityIndicator size="large" color={colors?.primary || '#4CAF50'} />
      </View>
    );
  }

  // Determine initial route based on auth state
  if (isAuthenticated()) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}

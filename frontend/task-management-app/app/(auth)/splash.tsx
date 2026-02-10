import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function SplashScreen() {
  const { isAuthenticated, hasSeenOnboarding } = useAuthStore();

  // Splash screen just redirects based on auth state
  // The actual navigation is handled by the root index
  if (isAuthenticated()) {
    return <Redirect href="/(tabs)" />;
  }

  if (hasSeenOnboarding) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
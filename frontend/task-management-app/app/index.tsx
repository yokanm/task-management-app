
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import './globals.css';

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding } = useAuthStore();
  

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
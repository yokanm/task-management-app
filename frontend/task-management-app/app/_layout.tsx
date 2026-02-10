import SafeScreen from '@/components/SafeScreen';
import { useAuthStore } from '@/store/authStore';

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect} from 'react';
import { StatusBar} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, hasSeenOnboarding, isCheckingAuth } = useAuthStore();
  
 

    useEffect(() => {
    // Don't navigate while checking auth
    if (isCheckingAuth) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const authenticated = isAuthenticated();

    // Only navigate if we're not already in the correct group
    if (!authenticated) {
      if (inTabsGroup) {
        // User logged out, redirect to auth
        if (!hasSeenOnboarding) {
          router.replace('/(auth)/onboarding');
        } else {
          router.replace('/(auth)/login');
        }
      }
    } else {
      if (inAuthGroup) {
        // User logged in, redirect to tabs
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated(), hasSeenOnboarding, segments, isCheckingAuth]);
  

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </SafeAreaProvider>
  );
}
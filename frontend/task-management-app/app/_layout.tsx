import SafeScreen from '@/components/SafeScreen';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, token } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUser && storedToken) {
          useAuthStore.setState({
            user: JSON.parse(storedUser),
            token: storedToken,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isAuthenticated = !!user && !!token;

    setTimeout(() => {
      if (isAuthenticated) {
        // User is logged in
        if (!inTabsGroup) {
          router.replace('/(tabs)');
        }
      } else {
        // User is not logged in
        if (!inAuthGroup) {
          router.replace('/(auth)/onboarding');
        }
      }
    }, 100);
  }, [isReady, user, token, segments]);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </SafeScreen>
      </SafeAreaProvider>
    );
  }

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
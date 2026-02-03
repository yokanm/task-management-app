import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  logout: () => void;
  setLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasSeenOnboarding: false,
      
      // Actions
      setUser: (user) =>
        set({ user, isAuthenticated: true }),
      
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      
      setHasSeenOnboarding: (value) =>
        set({ hasSeenOnboarding: value }),
      
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      
      setLoading: (value) =>
        set({ isLoading: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
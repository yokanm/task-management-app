import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// ── Constants ────────────────────────────────────────────────────────────────
const API_BASE_URL =
  'https://unrepeatable-squarrose-leanna.ngrok-free.dev/api/v1';

const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

// ── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthState {
  user: User | null;
  /** Access token stored in Zustand memory for in-session requests */
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean;
  hasSeenOnboarding: boolean;

  /** Returns true when both user and token are present */
  isAuthenticated: () => boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;

  login: (email: string, password: string) => Promise<AuthResponse>;

  /** Restores auth state from AsyncStorage on app launch */
  checkAuth: () => Promise<void>;

  /** Clears local state AND invalidates the refresh token on the server */
  logout: () => Promise<void>;

  setHasSeenOnboarding: (value: boolean) => Promise<void>;
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isCheckingAuth: true,
  hasSeenOnboarding: false,

  isAuthenticated: () => {
    const { user, token } = get();
    return !!(user && token);
  },

  // ── Register ───────────────────────────────────────────────────────────
  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: COMMON_HEADERS,
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Registration failed';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      const token: string = data.token;

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', token);

      set({ token, user: data.user, isLoading: false, error: null });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Network error. Please try again.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // ── Login ──────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: COMMON_HEADERS,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Login failed';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      // Backend returns both `accessToken` and `token` (from generateToken)
      const token: string = data.accessToken || data.token;

      if (!token) {
        const errorMsg = 'Login failed: no token received from server';
        set({ isLoading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', token);
      // Persist refresh token for future token-refresh calls
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }

      set({ token, user: data.user, isLoading: false, error: null });
      return { success: true };
    } catch (error: any) {
      const errorMsg = error?.message || 'Network error. Please try again.';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // ── Check auth on app launch ───────────────────────────────────────────
  checkAuth: async () => {
    try {
      const [tokenRaw, userJson, onboardingRaw] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('hasSeenOnboarding'),
      ]);

      const user: User | null = userJson ? JSON.parse(userJson) : null;
      const hasSeenOnboarding = onboardingRaw === 'true';

      set({ token: tokenRaw, user, hasSeenOnboarding });
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ── Logout ─────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      // Attempt to invalidate the refresh token on the server so it cannot
      // be reused. We fire-and-forget — local state is always cleared even
      // if the network call fails.
      const token = get().token ?? (await AsyncStorage.getItem('token'));
      if (token) {
        fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { ...COMMON_HEADERS, Authorization: `Bearer ${token}` },
        }).catch(() => {
          // Intentionally ignored — logout is best-effort on the network
        });
      }
    } finally {
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('refreshToken'),
      ]);

      set({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  },

  // ── Onboarding flag ────────────────────────────────────────────────────
  setHasSeenOnboarding: async (value) => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', String(value));
      set({ hasSeenOnboarding: value });
    } catch (error) {
      console.error('Error persisting onboarding status:', error);
    }
  },
}));
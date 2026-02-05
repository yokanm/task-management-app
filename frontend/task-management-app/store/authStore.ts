import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
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
    token: string | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;

    register: (
    username: string,
    email: string,
    password: string
    ) => Promise<AuthResponse>;
    
    login: (email: string, password: string) => Promise<AuthResponse>;

    logout: () => Promise<void>;
    
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    success: false,
    


    register: async (
        username: string,
        email: string,
        password: string
    ) => {

        set({ isLoading: true, error: null,success: false });
        try {
            const response = await fetch("http://192.168.1.108:4000/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            })
            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error || data.message || "Registration failed";
                set({ isLoading: false, error: errorMsg });
                return { success: false, error: errorMsg };
            }
           

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);
            
            set({
                token: data.token,
                user: data.user,
                isLoading: false,
                error: null,
                success: true
            });
            return { success: true };
            
        }catch (error:string | any) {
            const errorMessage = error?.message || 'Network error. Please try again.';
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },
    
    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await fetch("http://192.168.1.108:4000/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error || data.message || "Login failed";
                set({ isLoading: false, error: errorMsg });
                return { success: false, error: errorMsg };
            }

            // Save user and token
            set({ 
                user: data.user,
                token: data.accessToken,
                isLoading: false, 
                error: null 
            });
            return { success: true };
            
        } catch (error: any) {
            const errorMsg = error?.message || 'Network error. Please try again.';
            set({ isLoading: false, error: errorMsg });
            return { success: false, error: errorMsg };
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
            set({
                user: null,
                token: null,
                isLoading: false,
                error: null,
                success: false
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },
}));
    


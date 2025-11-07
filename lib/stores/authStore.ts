import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '../api/services/auth.service';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login({ email, password });

                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        toast.success('Login successful!');
                    } else {
                        throw new Error(response.message || 'Login failed');
                    }
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                    throw error;
                }
            },

            register: async (email, password, name) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register({ email, password, name });

                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        toast.success('Registration successful!');
                    } else {
                        throw new Error(response.message || 'Registration failed');
                    }
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
                    set({ error: errorMessage, isLoading: false });
                    toast.error(errorMessage);
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.logout();
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                    toast.success('Logged out successfully');
                } catch (error: any) {
                    console.error('Logout error:', error);
                    // Clear state even if API call fails
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            fetchCurrentUser: async () => {
                set({ isLoading: true });
                try {
                    const response = await authService.getCurrentUser();

                    if (response.success && response.data) {
                        set({
                            user: response.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                } catch (error: any) {
                    // Silently handle 401 errors (user not logged in)
                    if (error.response?.status === 401) {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    } else {
                        console.error('Fetch current user error:', error);
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

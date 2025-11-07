import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function useAuth() {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        fetchCurrentUser,
        clearError,
    } = useAuthStore();

    // Fetch current user on mount
    useEffect(() => {
        if (!user && !isLoading) {
            fetchCurrentUser();
        }
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
    };
}

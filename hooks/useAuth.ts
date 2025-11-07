import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export function useAuth() {
    const pathname = usePathname();
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

    // Only fetch current user if not on public pages
    useEffect(() => {
        const publicPages = ['/login', '/register'];
        const isPublicPage = publicPages.includes(pathname || '');

        if (!user && !isLoading && !isPublicPage) {
            fetchCurrentUser();
        }
    }, [pathname, user, isLoading, fetchCurrentUser]);

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

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for authentication management with automatic timing controls
 */
export function useAuth() {
    const location = useLocation();
    const {
        isAuthenticated,
        user,
        isLoading,
        isCheckingAuth,
        error,
        lastAuthCheck,
        authCheckInterval,
        checkAuth,
        signIn,
        signUp,
        signOut,
        verifyEmail,
        refreshToken,
        shouldCheckAuth,
        clearError,
    } = useAuthStore();

    // Check if current route is an auth route (where we don't want to check auth)
    const isAuthRoute = location.pathname.startsWith('/auth/');

    // Auto-check authentication on mount and when needed (but not on auth pages)
    useEffect(() => {
        // Skip auth check if we're on an auth page
        if (isAuthRoute) return;

        // Only check if not authenticated and enough time has passed
        if (!isAuthenticated && shouldCheckAuth()) {
            checkAuth();
        }
    }, [isAuthenticated, shouldCheckAuth, checkAuth, isAuthRoute]);

    // Set up periodic auth check (every 45 minutes) - but not on auth pages
    useEffect(() => {
        if (!isAuthenticated || isAuthRoute) return;

        const interval = setInterval(() => {
            if (shouldCheckAuth()) {
                checkAuth();
            }
        }, authCheckInterval);

        return () => clearInterval(interval);
    }, [isAuthenticated, shouldCheckAuth, checkAuth, authCheckInterval, isAuthRoute]);

    // Force auth check (useful for manual refresh)
    const forceAuthCheck = useCallback(() => {
        checkAuth(true);
    }, [checkAuth]);

    // Get time until next auth check
    const getTimeUntilNextCheck = useCallback(() => {
        if (!lastAuthCheck) return 0;
        const timePassed = Date.now() - lastAuthCheck;
        return Math.max(0, authCheckInterval - timePassed);
    }, [lastAuthCheck, authCheckInterval]);

    // Check if auth is stale (close to expiration)
    const isAuthStale = useCallback(() => {
        const timeUntilNext = getTimeUntilNextCheck();
        // Consider stale if less than 5 minutes until next check
        return timeUntilNext < 5 * 60 * 1000;
    }, [getTimeUntilNextCheck]);

    return {
        // State
        isAuthenticated,
        user,
        isLoading,
        isCheckingAuth,
        error,

        // Computed values
        isAuthStale: isAuthStale(),
        timeUntilNextCheck: getTimeUntilNextCheck(),

        // Actions
        signIn,
        signUp,
        signOut,
        verifyEmail,
        refreshToken,
        forceAuthCheck,
        clearError,
    };
}

/**
 * Hook for components that need to ensure authentication
 */
export function useRequireAuth() {
    const { isAuthenticated, isCheckingAuth, user } = useAuth();

    return {
        isAuthenticated,
        isCheckingAuth,
        user,
        isVerified: user?.isVerified ?? false,
    };
}

/**
 * Hook for components that should redirect authenticated users
 */
export function useRedirectIfAuthenticated() {
    const { isAuthenticated, user } = useAuth();

    return {
        shouldRedirect: isAuthenticated && user?.isVerified,
    };
}

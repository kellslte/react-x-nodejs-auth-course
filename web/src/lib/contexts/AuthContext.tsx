import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuthStore } from '@/store/authStore';

interface AuthContextType {
    isInitialized: boolean;
    shouldCheckAuth: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isInitialized: false,
    shouldCheckAuth: false,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * AuthProvider that intelligently manages when to check authentication
 * Only checks auth on protected routes, not on auth pages
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated, shouldCheckAuth, checkAuth, isCheckingAuth } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    // Determine if current route needs authentication checking
    const isAuthRoute = location.pathname.startsWith('/auth/');
    const isProtectedRoute = location.pathname === '/' || location.pathname.startsWith('/dashboard');
    const needsAuthCheck = !isAuthRoute && (isProtectedRoute || !isInitialized);

    // Check authentication only when needed
    useEffect(() => {
        if (!needsAuthCheck || isCheckingAuth) return;

        // Only check if not authenticated and enough time has passed
        if (!isAuthenticated && shouldCheckAuth()) {
            checkAuth().finally(() => {
                setIsInitialized(true);
            });
        } else {
            setIsInitialized(true);
        }
    }, [needsAuthCheck, isAuthenticated, shouldCheckAuth, checkAuth, isCheckingAuth]);

    // Set up periodic auth check only for authenticated users on protected routes
    useEffect(() => {
        if (!isAuthenticated || isAuthRoute || !isProtectedRoute) return;

        const interval = setInterval(() => {
            if (shouldCheckAuth()) {
                checkAuth();
            }
        }, 45 * 60 * 1000); // 45 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated, isAuthRoute, isProtectedRoute, shouldCheckAuth, checkAuth]);

    const contextValue: AuthContextType = {
        isInitialized,
        shouldCheckAuth: needsAuthCheck,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

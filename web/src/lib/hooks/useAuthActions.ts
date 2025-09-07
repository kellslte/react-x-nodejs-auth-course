import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { 
    SignUpFormData, 
    SignInFormData, 
    ApiError, 
    ForgotPasswordFormData,
    ResetPasswordFormData
} from '@/lib/types';

/**
 * Hook for auth pages that only provides auth actions without triggering checks
 * This prevents unnecessary authentication checks on sign-in/sign-up pages
 */
export function useAuthActions() {
    const {
        signIn,
        signUp,
        signOut,
        verifyEmail,
        refreshToken,
        isLoading,
        error,
        clearError,
        forgotPassword,
        resetPassword,
    } = useAuthStore();

    // Wrapped sign in with error handling
    const handleSignIn = useCallback(async (credentials: SignInFormData) => {
        try {
            await signIn(credentials);
            return { success: true };
        } catch (error) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.message || 'Sign in failed'
            };
        }
    }, [signIn]);

    // Wrapped sign up with error handling
    const handleSignUp = useCallback(async (credentials: SignUpFormData) => {
        try {
            await signUp(credentials);
            return { success: true };
        } catch (error) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.message || 'Sign up failed'
            };
        }
    }, [signUp]);

    // Wrapped sign out with error handling
    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: true }; // Always consider sign out successful
        }
    }, [signOut]);

    // Wrapped email verification with error handling
    const handleVerifyEmail = useCallback(async (token: string) => {
        try {
            const success = await verifyEmail(token);
            return { success };
        } catch (error) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.message || 'Email verification failed'
            };
        }
    }, [verifyEmail]);

    // Wrapped forgot password with error handling
    const handleForgotPassword = useCallback(async (data: ForgotPasswordFormData) => {
        try {
            const response = await forgotPassword(data);
            return { success: response.success, message: response.message };
        } catch (error) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.message || 'Forgot password failed'
            };
        }
    }, [forgotPassword]);

    // Wrapped reset password with error handling
    const handleResetPassword = useCallback(async (token: string, data: ResetPasswordFormData) => {
        try {
            const response = await resetPassword(token, data);
            return { success: response.success, message: response.message };
        } catch (error) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.message || 'Reset password failed'
            };
        }
    }, [resetPassword]);

    return {
        // Actions
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        verifyEmail: handleVerifyEmail,
        forgotPassword: handleForgotPassword,
        resetPassword: handleResetPassword,
        refreshToken,
        clearError,

        // State
        isLoading,
        error,
    };
}

/**
 * Hook for checking if user is already authenticated (without triggering checks)
 * Useful for redirecting authenticated users away from auth pages
 */
export function useAuthStatus() {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    return {
        isAuthenticated,
        user,
        isCheckingAuth,
        isVerified: user?.isVerified ?? false,
    };
}

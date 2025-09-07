import { create } from 'zustand'
import type { User, SignUpFormData, SignInFormData, ApiError, ForgotPasswordFormData, ResetPasswordFormData } from '@/lib/types'
import { apiService } from '@/lib/api'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface AuthStore {
    isAuthenticated: boolean
    user: User | null
    error: string | null
    isLoading: boolean
    isCheckingAuth: boolean
    lastAuthCheck: number | null
    authCheckInterval: number

    // Actions
    setUser: (user: User | null) => void
    setError: (error: string | null) => void
    setLoading: (loading: boolean) => void
    clearError: () => void
    setLastAuthCheck: (timestamp: number) => void

    // Auth methods
    signUp: (credentials: SignUpFormData) => Promise<void>
    signIn: (credentials: SignInFormData) => Promise<void>
    signOut: () => Promise<void>
    checkAuth: (force?: boolean) => Promise<void>
    refreshToken: () => Promise<boolean>
    verifyEmail: (token: string) => Promise<boolean>
    shouldCheckAuth: () => boolean
    forgotPassword: (data: ForgotPasswordFormData) => Promise<{
        success: boolean
        message: string
    }>
    resetPassword: (token: string, data: ResetPasswordFormData) => Promise<{
        success: boolean
        message: string
    }>
}

export const useAuthStore = create<AuthStore>()(
    devtools(persist((set, get) => ({
        isAuthenticated: false,
        user: null,
        error: null,
        isLoading: false,
        isCheckingAuth: true,
        lastAuthCheck: null,
        authCheckInterval: 45 * 60 * 1000, // 45 minutes in milliseconds

        // Basic setters
        setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
        setError: (error: string | null) => set({ error }),
        setLoading: (isLoading: boolean) => set({ isLoading }),
        clearError: () => set({ error: null }),
        setLastAuthCheck: (timestamp: number) => set({ lastAuthCheck: timestamp }),

        // Check if auth should be checked based on timing
        shouldCheckAuth: () => {
            const { lastAuthCheck, authCheckInterval } = get();
            if (!lastAuthCheck) return true;
            return Date.now() - lastAuthCheck > authCheckInterval;
        },

        // Sign Up
        signUp: async (credentials: SignUpFormData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await apiService.auth.register({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                });

                console.log(response, 'The register user response');

                if (response.success && response.data?.user) {
                    set({
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                        lastAuthCheck: Date.now()
                    });
                }
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    error: apiError.message || 'Registration failed',
                    isLoading: false
                });
            }
        },

        // Sign In
        signIn: async (credentials: SignInFormData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await apiService.auth.login(credentials);

                if (response.success && response.data?.user) {
                    set({
                        user: response.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                        lastAuthCheck: Date.now()
                    });
                }
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    error: apiError.message || 'Login failed',
                    isLoading: false
                });
            }
        },

        // Sign Out
        signOut: async () => {
            set({ isLoading: true, error: null });
            try {
                await apiService.auth.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        },

        // Check Authentication Status
        checkAuth: async (force: boolean = false) => {
            const { shouldCheckAuth, isCheckingAuth } = get();

            // Skip if already checking or if not enough time has passed (unless forced)
            if (isCheckingAuth || (!force && !shouldCheckAuth())) {
                return;
            }

            set({ isCheckingAuth: true, error: null });
            try {
                const response = await apiService.auth.getProfile();

                if (response.success && response.data?.user) {
                    set({
                        user: response.data.user,
                        isAuthenticated: true,
                        isCheckingAuth: false,
                        lastAuthCheck: Date.now()
                    });
                } else {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isCheckingAuth: false,
                        lastAuthCheck: Date.now()
                    });
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                set({
                    user: null,
                    isAuthenticated: false,
                    isCheckingAuth: false,
                    lastAuthCheck: Date.now()
                });
            }
        },

        // Refresh Token
        refreshToken: async () => {
            try {
                const response = await apiService.auth.refreshToken();
                return response.success;
            } catch (error) {
                console.error('Token refresh failed:', error);
                // If refresh fails, sign out the user
                get().signOut();
                return false;
            }
        },

        // Verify Email
        verifyEmail: async (token: string) => {
            set({ isLoading: true, error: null });
            try {
                const response = await apiService.auth.verifyEmail(token);
                return response.success;
            }
            catch (error) {
                const apiError = error as ApiError;
                set({
                    error: apiError.message || 'Email verification failed',
                    isLoading: false
                });
                return false;
            }
            finally {
                set({ isLoading: false });
            }
        },

        // Forgot Password
        forgotPassword: async (data: ForgotPasswordFormData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await apiService.auth.forgotPassword(data);
                console.log(response, 'The forgot password response');
                set({ isLoading: false });
                return {
                    success: response.success,
                    message: response.message
                };
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    error: apiError.message || 'Forgot password failed',
                    isLoading: false
                });
                return {
                    success: false,
                    message: apiError.message || 'Forgot password failed'
                }
            }
        },

        // Reset Password
        resetPassword: async (token: string, data: ResetPasswordFormData) => {
            set({ isLoading: true, error: null });
            try {
                const response = await apiService.auth.resetPassword(token, data);
                set({ isLoading: false });
                return {
                    success: response.success,
                    message: response.message
                };
            } catch (error) {
                const apiError = error as ApiError;
                set({
                    error: apiError.message || 'Reset password failed',
                    isLoading: false
                });
                return {
                    success: false,
                    message: apiError.message || 'Reset password failed'
                };
            }
            finally {
                set({ isLoading: false });
            }
        }
    }), { name: 'auth-store', storage: createJSONStorage(() => localStorage) }))
)
import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios';
import type { ApiResponse, ApiError } from './types';
import { config } from './config';

// API Configuration
const API_BASE_URL = config.API_URL;

// Auth Enpoints
const authEndpoints = config.ENDPOINTS.AUTH;
const usersEndpoints = config.ENDPOINTS.USERS;

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: config.REQUEST.TIMEOUT,
    withCredentials: true, // Important for cookie-based authentication
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add any request modifications here
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling responses and errors
api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Success response
        console.log(`Response from ${response.config.url}:`, response.data);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const refreshResponse = await api.post(authEndpoints.REFRESH);

                if (refreshResponse.data.success) {
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                console.error('Token refresh failed:', refreshError);
                // You can dispatch a logout action here or redirect to login
                window.location.href = '/auth/signin';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const apiError: ApiError = {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred',
            error: error.response?.data?.error || error.message,
            timestamp: error.response?.data?.timestamp || new Date().toISOString(),
            path: error.response?.data?.path,
            method: error.response?.data?.method,
        };

        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);

// API Service Functions
export const apiService = {
    // Auth endpoints
    auth: {
        // Register user
        register: async (data: {
            name: string;
            email: string;
            password: string;
        }) => {
            const response = await api.post<ApiResponse>(authEndpoints.REGISTER, data);
            return response.data;
        },

        // Login user
        login: async (data: { email: string; password: string }) => {
            const response = await api.post<ApiResponse>(authEndpoints.LOGIN, data);
            return response.data;
        },

        // Logout user
        logout: async () => {
            const response = await api.post<ApiResponse>(authEndpoints.LOGOUT);
            return response.data;
        },

        // Get current user profile
        getProfile: async () => {
            const response = await api.get<ApiResponse>(authEndpoints.PROFILE);
            return response.data;
        },

        // Refresh token
        refreshToken: async () => {
            const response = await api.post<ApiResponse>(authEndpoints.REFRESH);
            return response.data;
        },

        // Forgot password
        forgotPassword: async (data: { email: string }) => {
            const response = await api.post<ApiResponse>(authEndpoints.FORGOT_PASSWORD, data);
            return response.data;
        },

        // Reset password
        resetPassword: async (token: string, data: { newPassword: string, confirmPassword: string }) => {
            const response = await api.post<ApiResponse>(`${authEndpoints.RESET_PASSWORD}/${token}`, data);
            return response.data;
        },

        // Verify email
        verifyEmail: async (token: string) => {
            const response = await api.get<ApiResponse>(`${authEndpoints.VERIFY_EMAIL}/${token}`);
            return response.data;
        },

        // Resend email verification
        resendEmailVerification: async (data: { email: string }) => {
            const response = await api.post<ApiResponse>(authEndpoints.RESEND_EMAIL_VERIFICATION, data);
            return response.data;
        },
    },

    // User endpoints
    users: {
        // Get all users (admin only)
        getAll: async () => {
            const response = await api.get<ApiResponse>(usersEndpoints.BASE);
            return response.data;
        },

        // Get user by ID
        getById: async (id: string) => {
            const response = await api.get<ApiResponse>(`${usersEndpoints.BASE}/${id}`);
            return response.data;
        },

        // Update user
        update: async (id: string, data: { name?: string; email?: string; password?: string }) => {
            const response = await api.put<ApiResponse>(`${usersEndpoints.BASE}/${id}`, data);
            return response.data;
        },

        // Delete user
        delete: async (id: string) => {
            const response = await api.delete<ApiResponse>(`${usersEndpoints.BASE}/${id}`);
            return response.data;
        },

        // Change password
        changePassword: async (data: {
            currentPassword: string;
            newPassword: string;
        }) => {
            const response = await api.post<ApiResponse>(usersEndpoints.CHANGE_PASSWORD, data);
            return response.data;
        },
    },

    // Health check
    health: async () => {
        const response = await api.get<ApiResponse>(config.ENDPOINTS.HEALTH);
        return response.data;
    },
};

// Export the configured axios instance for custom requests
export default api;

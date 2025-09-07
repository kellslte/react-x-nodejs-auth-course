import { useState, useCallback } from 'react';
import { apiService } from '../api';
import type { ApiResponse, ApiError } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response.data;
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message || 'Request failed',
        });
        return null;
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError.message || 'An unexpected error occurred',
      });
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common operations
export const useAuth = () => {
  const signUp = useApi(apiService.auth.register);
  const signIn = useApi(apiService.auth.login);
  const signOut = useApi(apiService.auth.logout);
  const getProfile = useApi(apiService.auth.getProfile);
  const forgotPassword = useApi(apiService.auth.forgotPassword);
  const resetPassword = useApi(apiService.auth.resetPassword);
  const verifyEmail = useApi(apiService.auth.verifyEmail);

  return {
    signUp,
    signIn,
    signOut,
    getProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
};

export const useUsers = () => {
  const getAllUsers = useApi(apiService.users.getAll);
  const getUserById = useApi(apiService.users.getById);
  const updateUser = useApi(apiService.users.update);
  const deleteUser = useApi(apiService.users.delete);
  const changePassword = useApi(apiService.users.changePassword);

  return {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
  };
};

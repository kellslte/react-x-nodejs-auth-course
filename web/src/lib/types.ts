export interface User {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

// Auth Types
export interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormData {
    email: string;
    password: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Auth Response Types
export interface AuthResponse {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    emailVerificationToken?: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

// Error Types
export interface ApiError {
    success: false;
    message: string;
    error: string;
    timestamp: string;
    path?: string;
    method?: string;
}
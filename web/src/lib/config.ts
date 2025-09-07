// Environment Configuration
export const config = {
    // API Configuration
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:32190/api/v1',

    // Application Configuration
    APP_NAME: import.meta.env.VITE_APP_NAME || 'React Auth Course',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Environment
    NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,

    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            PROFILE: '/auth/me',
            REFRESH: '/auth/refresh-token',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            VERIFY_EMAIL: '/auth/verify-email',
            RESEND_EMAIL_VERIFICATION: '/auth/resend-email-verification',
        },
        USERS: {
            BASE: '/users',
            CHANGE_PASSWORD: '/users/change-password',
        },
        HEALTH: '/health',
    },

    // Request Configuration
    REQUEST: {
        TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 second
    },

    // Cookie Configuration
    COOKIES: {
        ACCESS_TOKEN: 'accessToken',
        REFRESH_TOKEN: 'refreshToken',
    },
} as const;

export default config;

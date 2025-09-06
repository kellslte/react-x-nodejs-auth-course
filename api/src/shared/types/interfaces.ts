// Email template data interfaces
export interface VerificationEmailData {
    email: string;
    token: string;
    baseUrl: string;
}

export interface PasswordResetEmailData {
    email: string;
    token: string;
    baseUrl: string;
}

export interface PasswordResetSuccessEmailData {
    email: string;
}

export interface WelcomeEmailData {
    email: string;
    name: string;
    baseUrl: string;
}

export type MailTemplateData = VerificationEmailData | PasswordResetEmailData | WelcomeEmailData | PasswordResetSuccessEmailData;

// Mail template constants
export const MailTemplates = {
    VERIFICATION: {
        subject: 'Verify your email',
        to: '{{email}}',
        token: '{{token}}',
        baseUrl: '{{baseUrl}}',
    },
    PASSWORD_RESET: {
        subject: 'Reset your password',
        to: '{{email}}',
        token: '{{token}}',
        baseUrl: '{{baseUrl}}',
    },
    WELCOME: {
        subject: 'Welcome to our platform',
        to: '{{email}}',
        name: '{{name}}',
        baseUrl: '{{baseUrl}}',
    },
    PASSWORD_RESET_SUCCESS: {
        subject: 'Password reset successful',
        to: '{{email}}',
    }
} as const;

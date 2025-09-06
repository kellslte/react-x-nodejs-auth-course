export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface AuthenticatedUser {
    sub: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
}

export interface AuthRequest extends Request {
    user: AuthenticatedUser;
}

export interface AppConfig {
    port: number;
    nodeEnv: string;
    corsOrigin: string;
    logLevel: string;
    baseUrl: string;
}

export interface DatabaseConfig {
    mongodbUri: string;
    mongodbDatabaseName: string;
    databaseConnectionLimit: number;
    databaseConnectionIdleTimeout: number;
}

export interface EmailConfig {
    mailToken: string;
    mailTestInboxId?: number;
    mailAccountId?: number;
    mailBulk: boolean;
    mailSandbox: boolean;
    from: string;
    name: string;
}

export interface JwtConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: string;
}

export interface CookieConfig {
    cookieSecret: string;
    cookieHttpOnly: boolean;
    cookieSecure: boolean;
    cookieSameSite: string;
    cookieMaxAge: number;
}

export interface AppConfiguration {
    app: AppConfig;
    database: DatabaseConfig;
    email: EmailConfig;
    jwt: JwtConfig;
    cookie: CookieConfig;
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

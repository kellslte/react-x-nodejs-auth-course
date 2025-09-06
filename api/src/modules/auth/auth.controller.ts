import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { CookieService } from '../../shared/services/cookie.service';
import type { ApiResponse, AuthRequest } from '../../shared/types';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<void> {
        try {
            // Check if request body is empty
            if (!registerDto || Object.keys(registerDto).length === 0) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Request body is required',
                    error: 'Request body cannot be empty',
                    timestamp: new Date().toISOString(),
                };
                res.status(400).json(response);
                return;
            }

            const response = await this.authService.register(registerDto);

            res.json(response);
        } catch (error) {
            const response: ApiResponse = {
                success: false,
                message: 'Internal server error',
                error: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
            };
            res.status(500).json(response);
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
        try {
            // Check if request body is empty
            if (!loginDto || Object.keys(loginDto).length === 0) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Request body is required',
                    error: 'Request body cannot be empty',
                    timestamp: new Date().toISOString(),
                };
                res.status(400).json(response);
                return;
            }

            const response = await this.authService.login(loginDto);

            // Set cookies using the cookie service
            this.cookieService.setRefreshTokenCookie(res, response.data.refreshToken);
            this.cookieService.setAccessTokenCookie(res, response.data.accessToken);

            res.json({
                success: response.success,
                message: response.message,
                data: {
                    user: response.data.user
                },
                timestamp: response.timestamp,
            });
        } catch (error) {
            const response: ApiResponse = {
                success: false,
                message: 'Internal server error',
                error: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
            };
            res.status(500).json(response);
        }
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password/:token')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Param('token') token: string,
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<ApiResponse> {
        console.log(resetPasswordDto, 'The reset password dto');
        return this.authService.resetPassword(token, resetPasswordDto);
    }

    @Get('me')
    @UseGuards(CookieAuthGuard)
    async getProfile(@Request() req: AuthRequest): Promise<ApiResponse> {
        return this.authService.getProfile(req.user.sub);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res() res: Response): Promise<void> {
        // Clear authentication cookies
        this.cookieService.clearAuthCookies(res);

        const response: ApiResponse = {
            success: true,
            message: 'Logged out successfully',
            timestamp: new Date().toISOString(),
        };

        res.json(response);
    }

    @Get('verify-email/:token')
    async verifyEmail(@Param('token') token: string): Promise<ApiResponse> {
        return this.authService.verifyEmail(token);
    }

    @Post('refresh-token')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Request() req: any, @Res() res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                const response: ApiResponse = {
                    success: false,
                    message: 'Refresh token not found',
                    error: 'Refresh token is required',
                    timestamp: new Date().toISOString(),
                };
                res.status(401).json(response);
                return;
            }

            const response = await this.authService.refreshToken(refreshToken);

            // Set new cookies
            this.cookieService.setRefreshTokenCookie(res, response.data.refreshToken);
            this.cookieService.setAccessTokenCookie(res, response.data.accessToken);

            const { success, message, timestamp } = response;

            res.json({
                success,
                message,
                timestamp,
            });
        } catch (error) {
            const response: ApiResponse = {
                success: false,
                message: 'Token refresh failed',
                error: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
            };
            res.status(401).json(response);
        }
    }
}

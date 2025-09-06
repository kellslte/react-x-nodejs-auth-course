import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '../../shared/services/jwt.service';
import { MailService } from '../../shared/services/mail/mail.service';
import { UserUtilsService } from '../../shared/services/user-utils.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponse } from '../../shared/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService,
        private userUtilsService: UserUtilsService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<ApiResponse> {
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Create new user
        const user = await this.usersService.create(registerDto);

        // Generate email verification token if email verification is required
        let emailVerificationToken: string | undefined;
        if (!user.isVerified) {
            emailVerificationToken = this.userUtilsService.generateVerificationToken();
            user.verificationToken = emailVerificationToken;
            user.verificationTokenExpiresAt = this.userUtilsService.getTokenExpirationTime(24);
            await user.save();

            await this.mailService.sendVerificationEmail({
                email: user.email,
                token: emailVerificationToken,
                baseUrl: this.configService.getOrThrow<string>('app.frontendUrl'),
            });
        }

        const response: ApiResponse = {
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toJSON(),
                ...(emailVerificationToken && { emailVerificationToken }),
            },
            timestamp: new Date().toISOString(),
        };

        return response;
    }

    async login(loginDto: LoginDto): Promise<ApiResponse> {
        // Find user with password
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await this.userUtilsService.comparePassword(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Update last login
        await this.usersService.updateLastLogin((user._id as any).toString());

        // Generate tokens
        const { accessToken, refreshToken, expiresIn } = this.jwtService.generateTokenPair({
            id: (user._id as any).toString(),
            email: user.email,
            name: user.name,
        });

        return {
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(),
                accessToken,
                refreshToken,
                expiresIn,
            },
            timestamp: new Date().toISOString(),
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ApiResponse> {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);

        if (!user) {
            // Return success even if user doesn't exist for security
            return {
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
                timestamp: new Date().toISOString(),
            };
        }

        // Generate password reset token
        const resetToken = this.userUtilsService.generatePasswordResetToken();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = this.userUtilsService.getTokenExpirationTime(1);
        await user.save();

        console.log(resetToken, 'The reset token');
        console.log(user.email, 'The user email');
        console.log(this.configService.getOrThrow<string>('app.frontendUrl'), 'The frontend url');

        // In a real application, you would send this token via email
        await this.mailService.sendPasswordResetEmail({
            email: user.email,
            token: resetToken,
            baseUrl: this.configService.getOrThrow<string>('app.frontendUrl'),
        });
        
        return {
            success: true,
            message: 'Password reset link has been sent to your email',
            timestamp: new Date().toISOString(),
        };
    }

    async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<ApiResponse> {
        const user = await this.usersService.resetPassword(token, resetPasswordDto.newPassword);

        await this.mailService.sendPasswordResetSuccessEmail({
            email: user.email
        });

        return {
            success: true,
            message: 'Password has been reset successfully',
            timestamp: new Date().toISOString(),
        };
    }

    async getProfile(userId: string): Promise<ApiResponse> {
        const user = await this.usersService.findOne(userId);

        return {
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: user.toJSON(),
            },
            timestamp: new Date().toISOString(),
        };
    }

    async verifyEmail(token: string): Promise<ApiResponse> {
        await this.usersService.verifyEmail(token);

        return {
            success: true,
            message: 'Email verified successfully',
            timestamp: new Date().toISOString(),
        };
    }

    async refreshToken(refreshToken: string): Promise<ApiResponse> {
        try {
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            const user = await this.usersService.findByEmail(payload.email);

            if (!user) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const { accessToken, refreshToken: newRefreshToken, expiresIn } = this.jwtService.generateTokenPair({
                id: (user._id as any).toString(),
                email: user.email,
                name: user.name,
            });

            return {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken,
                    refreshToken: newRefreshToken,
                    expiresIn,
                },
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}

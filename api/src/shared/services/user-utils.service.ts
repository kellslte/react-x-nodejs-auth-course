import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class UserUtilsService {
    /**
     * Compare a candidate password with a hashed password
     */
    async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(candidatePassword, hashedPassword);
        } catch (error) {
            throw new Error('Password comparison failed');
        }
    }

    /**
     * Generate a verification token
     */
    generateVerificationToken(): string {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        return token;
    }

    /**
     * Generate a password reset token
     */
    generatePasswordResetToken(): string {
        const token = crypto.randomBytes(32).toString('hex');
        return token;
    }

    /**
     * Generate a 6-digit numeric token
     */
    generateNumericToken(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Hash a password
     */
    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(12);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    }

    /**
     * Clean user object by removing sensitive fields
     */
    cleanUserObject(user: any): any {
        const { password, resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, __v, ...safeRet } = user;
        return safeRet;
    }

    /**
     * Calculate token expiration time
     */
    getTokenExpirationTime(hours: number = 24): Date {
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
}

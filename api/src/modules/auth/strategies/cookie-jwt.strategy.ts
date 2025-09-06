import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '../../../shared/services/jwt.service';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUser } from '../../../shared/types';

@Injectable()
export class CookieJwtStrategy extends PassportStrategy(Strategy, 'cookie-jwt') {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
        });
    }

    async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
        try {
            // Verify the token is still valid
            const user = await this.usersService.findByEmail(payload.email);

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (!user.isVerified) {
                throw new UnauthorizedException('Email not verified');
            }

            return {
                sub: (user._id as any).toString(),
                email: user.email,
                name: user.name,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

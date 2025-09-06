import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../../shared/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.jwtSecret'),
        });
    }

    async validate(payload: any): Promise<AuthenticatedUser> {
        if (!payload.sub || !payload.email || !payload.name) {
            throw new UnauthorizedException('Invalid token payload');
        }

        return {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            iat: payload.iat,
            exp: payload.exp,
        };
    }
}

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtService } from '../../../shared/services/jwt.service';

@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie-jwt') {
    constructor(
        private jwtService: JwtService,
    ) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.accessToken;

        // Check if access token exists in cookies
        if (!token) {
            throw new UnauthorizedException('Access token not found in cookies');
        }
        
        try {
            const payload = this.jwtService.verifyAccessToken(token);
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('Invalid or expired token');
        }
        return user;
    }
}

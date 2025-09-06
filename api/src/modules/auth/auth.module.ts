import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CookieJwtStrategy } from './strategies/cookie-jwt.strategy';
import { JwtService } from '../../shared/services/jwt.service';
import { CookieService } from '../../shared/services/cookie.service';
import { MailService } from '../../shared/services/mail/mail.service';
import { UserUtilsService } from '../../shared/services/user-utils.service';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.jwtSecret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwt.jwtExpiresIn'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, CookieJwtStrategy, JwtService, CookieService, MailService, UserUtilsService],
    exports: [AuthService, JwtService, CookieService],
})
export class AuthModule { }

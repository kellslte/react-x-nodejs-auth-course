import { Injectable } from '@nestjs/common';
import {
    VerificationEmailData,
    PasswordResetEmailData,
    WelcomeEmailData,
    PasswordResetSuccessEmailData,
    MailTemplates
} from '../../types/interfaces';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    async sendVerificationEmail(data: VerificationEmailData): Promise<void> {

        await this.mailerService.sendMail({
            to: data.email,
            subject: MailTemplates.VERIFICATION.subject,
            template: 'verify-email.hbs',
            context: data,
        });
    }

    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
        await this.mailerService.sendMail({
            to: data.email,
            subject: MailTemplates.PASSWORD_RESET.subject,
            template: 'password-reset.hbs',
            context: data,
        });
    }

    async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
        await this.mailerService.sendMail({
            to: data.email,
            subject: MailTemplates.WELCOME.subject,
            template: 'welcome-email.hbs',
            context: data,
        });
    }

   async sendPasswordResetSuccessEmail(data: PasswordResetSuccessEmailData): Promise<void> {
        await this.mailerService.sendMail({
            to: data.email,
            subject: MailTemplates.PASSWORD_RESET_SUCCESS.subject,
            template: 'password-reset-success.hbs',
            context: data,
        });
    }
}


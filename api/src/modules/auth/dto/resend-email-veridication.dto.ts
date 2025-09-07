import { IsEmail } from "class-validator";

export class ResendEmailVerificationDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;
}
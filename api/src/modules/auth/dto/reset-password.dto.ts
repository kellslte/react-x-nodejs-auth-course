import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { IsEqualTo } from '../../../shared/decorators/is-equal-to.decorator';


export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'New Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @IsEqualTo('newPassword', { message: 'New Password and Confirm Password do not match' })
    @MinLength(8, { message: 'Confirm Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    confirmPassword: string;
}

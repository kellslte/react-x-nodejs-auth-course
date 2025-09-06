import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { IsEqualTo } from '../../../shared/decorators/is-equal-to.decorator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEqualTo('newPassword', { message: 'New password and confirm password do not match' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  confirmPassword: string;
}

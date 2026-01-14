import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnglishName } from 'src/common/validators/name.validator';
import { UserConstants } from 'src/common/validators/constants';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';

export class CreateUserDto {
  @ApiProperty({ description: `User's first name`, minLength: UserConstants.NAME_MIN_LENGTH, maxLength: UserConstants.NAME_MAX_LENGTH, example: 'Valerii' })
  @ToOptionalTrimmedString()
  @IsEnglishName(false)
  firstName!: string;

  @ApiPropertyOptional({ description: `User's second name`, minLength: UserConstants.NAME_MIN_LENGTH, maxLength: UserConstants.NAME_MAX_LENGTH, example: 'Velychko' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsEnglishName(true, true)
  secondName?: string | null;

  @ApiProperty({ description: `User's last name`, minLength: UserConstants.NAME_MIN_LENGTH, maxLength: UserConstants.NAME_MAX_LENGTH, example: 'Valeriiovych' })
  @ToOptionalTrimmedString()
  @IsEnglishName(false)
  lastName!: string;

  @ApiProperty({ description: `User's email`, minLength: UserConstants.EMAIL_MIN_LENGTH, maxLength: UserConstants.EMAIL_MAX_LENGTH, example: 'valerii.velychko@example.com' })
  @ToOptionalTrimmedString()
  @IsEmail(false)
  email!: string;

  @ApiPropertyOptional({ description: `Precomputed password hash or placeholder for external authentication`, example: '__external_auth__', maxLength: UserConstants.PASSWORD_HASH_MAX_LENGTH })
  @IsOptional()
  @IsString()
  @MaxLength(UserConstants.PASSWORD_HASH_MAX_LENGTH)
  passwordHash?: string;

  @ApiPropertyOptional({ description: `User's status`, enum: IdentityUserStatus, default: IdentityUserStatus.ACTIVE, example: IdentityUserStatus.ACTIVE })
  @IsOptional()
  @ToOptionalEnum(IdentityUserStatus)
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ description: `Position ID`, type: Number, example: 1 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  positionId?: number | null;

  @ApiPropertyOptional({ description: `Team ID`, type: Number, example: 10 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  teamId?: number | null;

  @ApiPropertyOptional({ description: `Manager ID`, type: Number, example: 2 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  managerId?: number | null;
}

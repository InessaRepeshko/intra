import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnglishName } from 'src/common/validators/name.validator';
import { USER_CONSTRAINTS } from '@intra/shared-kernel';
import { IdentityStatus } from '@intra/shared-kernel';

export class CreateUserDto {
  @ApiProperty({ description: `User's first name`, minLength: USER_CONSTRAINTS.NAME.LENGTH.MIN, maxLength: USER_CONSTRAINTS.NAME.LENGTH.MAX, example: 'Valerii' })
  @ToOptionalTrimmedString()
  @IsEnglishName(false)
  firstName!: string;

  @ApiPropertyOptional({ description: `User's second name`, minLength: USER_CONSTRAINTS.NAME.LENGTH.MIN, maxLength: USER_CONSTRAINTS.NAME.LENGTH.MAX, example: 'Velychko' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsEnglishName(true, true)
  secondName?: string | null;

  @ApiProperty({ description: `User's last name`, minLength: USER_CONSTRAINTS.NAME.LENGTH.MIN, maxLength: USER_CONSTRAINTS.NAME.LENGTH.MAX, example: 'Valeriiovych' })
  @ToOptionalTrimmedString()
  @IsEnglishName(false)
  lastName!: string;

  @ApiProperty({ description: `User's email`, minLength: USER_CONSTRAINTS.EMAIL.LENGTH.MIN, maxLength: USER_CONSTRAINTS.EMAIL.LENGTH.MAX, example: 'valerii.velychko@example.com' })
  @ToOptionalTrimmedString()
  @IsEmail(false)
  email!: string;

  @ApiPropertyOptional({ description: `Precomputed password hash or placeholder for external authentication`, example: '__external_auth__', maxLength: USER_CONSTRAINTS.PASSWORD_HASH.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MaxLength(USER_CONSTRAINTS.PASSWORD_HASH.LENGTH.MAX)
  passwordHash?: string;

  @ApiPropertyOptional({ description: `User's status`, enum: IdentityStatus, default: IdentityStatus.ACTIVE, example: IdentityStatus.ACTIVE })
  @IsOptional()
  @ToOptionalEnum(IdentityStatus)
  @IsEnum(IdentityStatus)
  status?: IdentityStatus;

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

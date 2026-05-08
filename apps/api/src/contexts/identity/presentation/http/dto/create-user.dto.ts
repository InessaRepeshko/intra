<<<<<<< HEAD
import {
    IdentityRole,
    IdentityStatus,
    USER_CONSTRAINTS,
} from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    ToOptionalEnum,
    ToOptionalInt,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnglishName } from 'src/common/validators/name.validator';

export class CreateUserDto {
    @ApiProperty({
        description: `User's first name`,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
        example: 'Valerii',
        type: 'string',
    })
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @IsEnglishName(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)
    firstName!: string;

    @ApiPropertyOptional({
        description: `User's second name`,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
        example: 'Valeriiovych',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @IsEnglishName(true, true)
    @IsString()
    @MinLength(USER_CONSTRAINTS.NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)
    secondName?: string;

    @ApiProperty({
        description: `User's last name`,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
        example: 'Velychko',
        type: 'string',
    })
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @IsEnglishName(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)
    lastName!: string;

    @ApiPropertyOptional({
        description: `User's full name`,
        minimum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
        example: 'Valerii Velychko',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @IsEnglishName(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    fullName?: string;

    @ApiProperty({
        description: `User's email`,
        minimum: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
        example: 'valerii.velychko@example.com',
        type: 'string',
    })
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
        max: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
    })
    @IsEmail(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.EMAIL.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.EMAIL.LENGTH.MAX)
    email!: string;

    @ApiPropertyOptional({
        description: `User's avatar URL from external provider (Google)`,
        example: 'https://lh3.googleusercontent.com/a/ACg8oc...',
        type: 'string',
    })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @ApiPropertyOptional({
        description: `User's status`,
        enum: IdentityStatus,
        default: IdentityStatus.ACTIVE,
        example: IdentityStatus.ACTIVE,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalEnum(IdentityStatus)
    @IsEnum(IdentityStatus)
    status?: IdentityStatus;

    @ApiPropertyOptional({
        description: `Position ID`,
        type: 'number',
        example: 1,
        nullable: true,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    positionId?: number | null;

    @ApiPropertyOptional({
        description: `Team ID`,
        type: 'number',
        example: 10,
        nullable: true,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    teamId?: number | null;

    @ApiPropertyOptional({
        description: `Manager ID`,
        type: 'number',
        example: 2,
        nullable: true,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    managerId?: number | null;

    @ApiPropertyOptional({
        description: `User's roles`,
        type: 'string',
        isArray: true,
        example: [IdentityRole.MANAGER],
    })
    @IsArray()
    @IsOptional()
    @IsEnum(IdentityRole, { each: true })
    roles?: IdentityRole[];
}
=======
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
>>>>>>> origin/main

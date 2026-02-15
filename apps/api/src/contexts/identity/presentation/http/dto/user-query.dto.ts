<<<<<<< HEAD
import {
    IdentityRole,
    IdentityStatus,
    SortDirection,
    USER_CONSTRAINTS,
    UserSortField,
} from '@intra/shared-kernel';
import { ApiPropertyOptional } from '@nestjs/swagger';
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
    ToOptionalIntArray,
    ToOptionalTrimmedString,
} from 'src/common/transforms/query-sanitize.transform';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnglishName } from 'src/common/validators/name.validator';

export class UserQueryDto {
    @ApiPropertyOptional({
        description: `Search by first name or last name or email (contains, case insensitive)`,
        minimum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
        example: 'Valerii',
    })
    @IsOptional()
    @ToOptionalTrimmedString()
    @IsString()
    @MinLength(USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX)
    search?: string;

    @ApiPropertyOptional({
        description: `User's first name (contains, case insensitive)`,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
        example: 'Valerii',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @IsEnglishName(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)
    firstName?: string;

    @ApiPropertyOptional({
        description: `User's second name (contains, case insensitive)`,
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

    @ApiPropertyOptional({
        description: `User's last name (contains, case insensitive)`,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
        example: 'Velychko',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        max: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @IsEnglishName(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.NAME.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)
    lastName?: string;

    @ApiPropertyOptional({
        description: `User's full name (contains, case insensitive)`,
        minimum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
        example: 'Valerii Valeriiovych Velychko',
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

    @ApiPropertyOptional({
        description: `User's email`,
        minimum: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
        example: 'valerii.velychko@example.com',
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
        max: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
    })
    @IsEmail(false)
    @IsString()
    @MinLength(USER_CONSTRAINTS.EMAIL.LENGTH.MIN)
    @MaxLength(USER_CONSTRAINTS.EMAIL.LENGTH.MAX)
    email?: string;

    @ApiPropertyOptional({
        description: `User's status`,
        enum: IdentityStatus,
        default: IdentityStatus.ACTIVE,
        example: IdentityStatus.ACTIVE,
    })
    @IsOptional()
    @ToOptionalEnum(IdentityStatus)
    @IsEnum(IdentityStatus)
    status?: IdentityStatus;

    @ApiPropertyOptional({ description: `Team ID`, type: 'number', example: 1 })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    teamId?: number;

    @ApiPropertyOptional({
        description: `Position ID`,
        type: 'number',
        example: 1,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    positionId?: number;

    @ApiPropertyOptional({
        description: `Manager ID`,
        type: 'number',
        example: 1,
    })
    @IsOptional()
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @IsPositive()
    managerId?: number;

    @ApiPropertyOptional({
        description: `User's roles`,
        enum: IdentityRole,
        example: [IdentityRole.EMPLOYEE, IdentityRole.HR],
        type: [String],
    })
    @ToOptionalIntArray()
    @IsOptional()
    @IsArray()
    @IsEnum(IdentityRole, { each: true })
    roles?: IdentityRole[];

    @ApiPropertyOptional({
        description: 'Sorting field',
        enum: UserSortField,
        default: UserSortField.ID,
        example: UserSortField.LAST_NAME,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalEnum(UserSortField)
    @IsEnum(UserSortField)
    sortBy?: UserSortField;

    @ApiPropertyOptional({
        description: 'Sorting direction',
        enum: SortDirection,
        default: SortDirection.ASC,
        example: SortDirection.DESC,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalEnum(SortDirection)
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
}
=======
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';
import { UserSortField } from '../../../application/ports/user.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { UserConstants } from 'src/common/validators/constants';

export class UserQueryDto {
  @ApiPropertyOptional({ description: `Search by first name or last name or email`, minLength: UserConstants.NAME_MIN_LENGTH, maxLength: UserConstants.NAME_MAX_LENGTH, example: 'Valerii' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(UserConstants.NAME_MIN_LENGTH)
  @MaxLength(UserConstants.NAME_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: `User's status`, enum: IdentityUserStatus, default: IdentityUserStatus.ACTIVE, example: IdentityUserStatus.ACTIVE })
  @IsOptional()
  @ToOptionalEnum(IdentityUserStatus)
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ description: `Team ID`, type: Number, example: 1 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  teamId?: number;

  @ApiPropertyOptional({ description: `Position ID`, type: Number, example: 1 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  positionId?: number;

  @ApiPropertyOptional({ description: `Manager ID`, type: Number, example: 1 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  managerId?: number;

  @ApiPropertyOptional({ description: 'Sorting field', enum: UserSortField, default: UserSortField.ID, example: UserSortField.LAST_NAME })
  @IsOptional()
  @ToOptionalEnum(UserSortField)
  @IsEnum(UserSortField)
  sortBy?: UserSortField;

  @ApiPropertyOptional({ description: 'Sorting direction', enum: SortDirection, default: SortDirection.ASC, example: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
>>>>>>> origin/main

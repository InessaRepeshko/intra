import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { IdentityStatus } from '../../../domain/enums/identity-status.enum';
import { UserSortField } from '../../../application/ports/user.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { UserConstants } from 'src/common/constants/index';

export class UserQueryDto {
  @ApiPropertyOptional({ description: `Search by first name or last name or email`, minLength: UserConstants.NAME_MIN_LENGTH, maxLength: UserConstants.NAME_MAX_LENGTH, example: 'Valerii' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(UserConstants.NAME_MIN_LENGTH)
  @MaxLength(UserConstants.NAME_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: `User's status`, enum: IdentityStatus, default: IdentityStatus.ACTIVE, example: IdentityStatus.ACTIVE })
  @IsOptional()
  @ToOptionalEnum(IdentityStatus)
  @IsEnum(IdentityStatus)
  status?: IdentityStatus;

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

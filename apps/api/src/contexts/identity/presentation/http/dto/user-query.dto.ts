import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'src/common/validators/email.validator';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';
import { UserSortField } from '../../../application/ports/user.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { UserConstants } from 'src/common/validators/constants';

class UserQueryBase {}

export class UserQueryDto extends WithPagination(UserQueryBase) {
  @ApiPropertyOptional({ description: `Search by first name/last name/email`, maxLength: 100 })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(UserConstants.EMAIL_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: `User's email`, example: 'valerii.velychko@example.com' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsEmail(true)
  email?: string;

  @ApiPropertyOptional({ enum: IdentityUserStatus, description: `User's status` })
  @IsOptional()
  @ToOptionalEnum(IdentityUserStatus)
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ type: Number, description: `Team ID` })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  teamId?: number;

  @ApiPropertyOptional({ type: Number, description: `Position ID` })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  positionId?: number;

  @ApiPropertyOptional({ type: Number, description: `Manager ID` })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @IsPositive()
  managerId?: number;

  @ApiPropertyOptional({ enum: UserSortField, description: `Sorting field`, default: UserSortField.CREATED_AT })
  @IsOptional()
  @ToOptionalEnum(UserSortField)
  @IsEnum(UserSortField)
  sortBy?: UserSortField;

  @ApiPropertyOptional({ enum: SortDirection, description: `Sorting direction`, default: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { UsersStatus } from '../../../../domain/user/users-status.enum';
import { UserSortField } from '../../../../domain/user/user-sort-field.enum';
import { SortDirection } from '../../../../domain/user/sort-direction.enum';
import { UserConstants } from 'src/common/validators/constants';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class UserFilterDto {
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @Length(UserConstants.EMAIL_MIN_LENGTH, UserConstants.EMAIL_MAX_LENGTH)
  @ApiProperty({
    required: false,
    description: 'Filter users by email (contains, case-insensitive)',
    type: 'string',
    nullable: false,
    example: 'john.smith',
  })
  email?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search by full name or email (contains, case-insensitive)',
    type: 'string',
    nullable: false,
    example: 'smith',
  })
  search?: string;

  @ToOptionalEnum(UsersStatus)
  @IsOptional()
  @IsEnum(UsersStatus)
  @ApiProperty({
    required: false,
    description: 'Filter users by status',
    enum: UsersStatus,
    example: UsersStatus.ACTIVE,
  })
  status?: UsersStatus;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter users by teamId',
    type: 'number',
    example: 1,
  })
  teamId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter users by positionId',
    type: 'number',
    example: 1,
  })
  positionId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter users by managerId',
    type: 'number',
    example: 1,
    nullable: true,
  })
  managerId?: number;

  @ToOptionalEnum(UserSortField)
  @IsOptional()
  @IsEnum(UserSortField)
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: UserSortField,
    example: UserSortField.LAST_NAME,
  })
  sortBy?: UserSortField;

  @ToOptionalEnum(SortDirection)
  @IsOptional()
  @IsEnum(SortDirection)
  @ApiProperty({
    required: false,
    description: 'Sort direction',
    enum: SortDirection,
    example: SortDirection.ASC,
    default: SortDirection.ASC,
  })
  sortDirection?: SortDirection;
}



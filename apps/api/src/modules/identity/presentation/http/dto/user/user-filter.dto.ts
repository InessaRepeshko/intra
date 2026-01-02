import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, IsInt, Min } from 'class-validator';
import { UsersStatus } from '../../../../domain/user/users-status.enum';
import { UserConstants } from 'src/common/validators/constants';

export class UserFilterDto {
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search by first name or last name or email (contains, case-insensitive)',
    type: 'string',
    nullable: false,
    example: 'smith',
  })
  search?: string;

  @IsOptional()
  @IsEnum(UsersStatus)
  @ApiProperty({
    required: false,
    description: 'Filter users by status',
    enum: UsersStatus,
    example: UsersStatus.ACTIVE,
  })
  status?: UsersStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter users by teamId',
    type: 'number',
    example: 1,
  })
  teamId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter users by positionId',
    type: 'number',
    example: 1,
  })
  positionId?: number;

  @IsOptional()
  @Type(() => Number)
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
}



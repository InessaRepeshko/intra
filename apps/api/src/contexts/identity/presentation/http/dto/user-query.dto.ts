import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';
import { UserSortField } from '../../../application/ports/user.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class UserQueryDto {
  @ApiPropertyOptional({ description: `Search by first name/last name/email`, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ description: `User's email`, example: 'valerii.velychko@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ enum: IdentityUserStatus, description: `User's status` })
  @IsOptional()
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ type: Number, description: `Team ID` })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  teamId?: number;

  @ApiPropertyOptional({ type: Number, description: `Position ID` })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  positionId?: number;

  @ApiPropertyOptional({ type: Number, description: `Manager ID` })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  managerId?: number;

  @ApiPropertyOptional({ type: Number, description: `Skip how many elements`, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ type: Number, description: `Return how many elements`, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({ enum: UserSortField, description: `Sorting field`, default: UserSortField.CREATED_AT })
  @IsOptional()
  @IsEnum(UserSortField)
  sortBy?: UserSortField;

  @ApiPropertyOptional({ enum: SortDirection, description: `Sorting direction`, default: SortDirection.DESC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

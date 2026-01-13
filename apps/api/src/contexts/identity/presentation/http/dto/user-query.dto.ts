import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';
import { UserSortField } from '../../../application/ports/user.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class UserQueryDto {
  @ApiPropertyOptional({ description: 'Пошук по імені/прізвищу/email', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ description: 'Email користувача', example: 'ivan@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ enum: IdentityUserStatus, description: 'Статус користувача' })
  @IsOptional()
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ type: Number, description: 'Команда' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  teamId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Посада' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  positionId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Менеджер' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  managerId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Скільки елементів пропустити', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ type: Number, description: 'Скільки елементів повернути', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({ enum: UserSortField, description: 'Поле сортування', default: UserSortField.CREATED_AT })
  @IsOptional()
  @IsEnum(UserSortField)
  sortBy?: UserSortField;

  @ApiPropertyOptional({ enum: SortDirection, description: 'Напрям сортування', default: SortDirection.DESC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

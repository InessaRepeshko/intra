import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { TeamSortField } from '../../../../application/ports/team.repository.port';

export class TeamQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or description', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;

  @ApiPropertyOptional({ type: Number, description: 'Id of team leader' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  headId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Number of items to skip', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ type: Number, description: 'Number of items to return', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({ enum: TeamSortField, default: TeamSortField.CREATED_AT })
  @IsOptional()
  @IsEnum(TeamSortField)
  sortBy?: TeamSortField;

  @ApiPropertyOptional({ enum: SortDirection, default: SortDirection.DESC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

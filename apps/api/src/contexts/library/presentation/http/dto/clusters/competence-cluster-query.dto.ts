import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CompetenceClusterSortField } from 'src/contexts/library/application/ports/competence-cluster.repository.port';

export class CompetenceClusterQueryDto {
  @ApiPropertyOptional({ description: 'Filter by competence id', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  competenceId?: number;

  @ApiPropertyOptional({ description: 'Filter by cycle id', example: 3, nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number | null;

  @ApiPropertyOptional({ enum: CompetenceClusterSortField, example: CompetenceClusterSortField.CREATED_AT })
  @IsOptional()
  @IsEnum(CompetenceClusterSortField)
  sortBy?: CompetenceClusterSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.ASC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}


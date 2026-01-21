import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from '../../../../../../../../../packages/shared-kernel/src/common/enums/sort-direction.enum';
import { CompetenceSortField } from 'src/contexts/library/application/ports/competence.repository.port';

export class CompetenceQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or code', example: 'Engineering' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CompetenceSortField, example: CompetenceSortField.TITLE })
  @IsOptional()
  @IsEnum(CompetenceSortField)
  sortBy?: CompetenceSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.ASC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}


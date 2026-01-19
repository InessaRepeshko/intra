import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CycleStage } from 'src/contexts/performance/domain/cycle-stage.enum';
import { Feedback360CycleSortField } from 'src/contexts/performance/application/ports/feedback360-cycle.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class CycleQueryDto {
  @ApiPropertyOptional({ example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  hrId?: number;

  @ApiPropertyOptional({ enum: CycleStage, example: CycleStage.ACTIVE })
  @IsOptional()
  @IsEnum(CycleStage)
  stage?: CycleStage;

  @ApiPropertyOptional({ example: true })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Search by name/description', example: 'Q1' })
  @ToOptionalTrimmedString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: Feedback360CycleSortField, example: Feedback360CycleSortField.START_DATE })
  @ToOptionalEnum(Feedback360CycleSortField)
  @IsOptional()
  sortBy?: Feedback360CycleSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}

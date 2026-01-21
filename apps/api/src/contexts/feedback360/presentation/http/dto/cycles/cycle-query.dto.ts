import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { CYCLE_CONSTANTS } from 'src/common/constants/cycle.constraints';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CycleStage } from 'src/contexts/feedback360/domain/enums/cycle-stage.enum';
import { CycleSortField } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { SortDirection } from '../../../../../../../../../packages/shared-kernel/src/common/enums/sort-direction.enum';

export class CycleQueryDto {
  @ApiPropertyOptional({ example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  hrId?: number;

  @ApiPropertyOptional({ example: 5, default: CYCLE_CONSTANTS.ANONYMITY_THRESHOLD.MIN })
  @ToOptionalInt({ min: CYCLE_CONSTANTS.ANONYMITY_THRESHOLD.MIN })
  @IsOptional()
  @IsInt()
  minRespondentsThreshold?: number;

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

  @ApiPropertyOptional({ enum: CycleSortField, example: CycleSortField.START_DATE })
  @ToOptionalEnum(CycleSortField)
  @IsOptional()
  sortBy?: CycleSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { Feedback360Stage } from 'src/contexts/performance/domain/feedback360-stage.enum';
import { Feedback360SortField } from 'src/contexts/performance/application/ports/feedback360.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class FeedbackQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number;

  @ApiPropertyOptional({ example: 5 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  rateeId?: number;

  @ApiPropertyOptional({ example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  hrId?: number;

  @ApiPropertyOptional({ example: 3 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  positionId?: number;

  @ApiPropertyOptional({ enum: Feedback360Stage })
  @IsOptional()
  @IsEnum(Feedback360Stage)
  stage?: Feedback360Stage;

  @ApiPropertyOptional({ enum: Feedback360SortField, example: Feedback360SortField.CREATED_AT })
  @ToOptionalEnum(Feedback360SortField)
  @IsOptional()
  sortBy?: Feedback360SortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}

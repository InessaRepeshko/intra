import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { ReviewStage } from 'src/contexts/feedback360/domain/enums/review-stage.enum';
import { ReviewSortField } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { SortDirection } from '@intra/shared-kernel';

export class ReviewQueryDto {
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

  @ApiPropertyOptional({ enum: ReviewStage })
  @IsOptional()
  @IsEnum(ReviewStage)
  stage?: ReviewStage;

  @ApiPropertyOptional({ enum: ReviewSortField, example: ReviewSortField.CREATED_AT })
  @ToOptionalEnum(ReviewSortField)
  @IsOptional()
  sortBy?: ReviewSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}

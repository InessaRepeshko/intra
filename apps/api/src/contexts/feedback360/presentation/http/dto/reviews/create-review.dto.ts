import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ReviewStage } from 'src/contexts/feedback360/domain/enums/review-stage.enum';

export class CreateReviewDto {
  @ApiProperty({ example: 10, description: 'Who we are evaluating' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateeId!: number;

  @ApiPropertyOptional({ description: 'Comment of the evaluated' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
  rateeNote?: string;

  @ApiProperty({ example: 3, description: 'Position of the evaluated' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  positionId!: number;

  @ApiProperty({ example: 2, description: 'HR, responsible for the process' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  hrId!: number;

  @ApiPropertyOptional({ description: 'HR comment' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
  hrNote?: string;

  @ApiPropertyOptional({ example: 1, description: 'Attached cycle' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number;

  @ApiPropertyOptional({ enum: ReviewStage, example: ReviewStage.VERIFICATION_BY_HR })
  @IsOptional()
  @IsEnum(ReviewStage)
  stage?: ReviewStage;
}

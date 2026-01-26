import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ReviewStage } from '@intra/shared-kernel';

export class CreateReviewDto {
  @ApiProperty({ example: 10, description: 'Ratee id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateeId!: number;

  @ApiProperty({ example: 3, description: 'Ratee position id', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateePositionId!: number;

  @ApiProperty({ example: 'Senior Engineer', description: 'Ratee position title', type: 'string', required: true, minLength: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MIN, maxLength: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MAX })
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MAX)
  rateePositionTitle!: string;

  @ApiProperty({ example: 2, description: 'HR, responsible for the process', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  hrId!: number;

  @ApiPropertyOptional({ example: 'Completion of probationary period', description: 'HR note', type: 'string', required: false, minLength: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN, maxLength: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN, max: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN)
  @MaxLength(REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX)
  hrNote?: string;

  @ApiPropertyOptional({ example: 5, description: 'Team id', type: 'number', required: false })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ example: 'Engineering team', description: 'Team title', type: 'string', required: false, minLength: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, maxLength: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  teamTitle?: string;

  @ApiPropertyOptional({ example: 12, description: 'Ratee manager', type: 'number', required: false })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  managerId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Attached cycle', type: 'number', required: false })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number;

  @ApiPropertyOptional({ enum: ReviewStage, example: ReviewStage.VERIFICATION_BY_HR, description: 'Review stage', type: 'string', required: false })
  @ToOptionalEnum(ReviewStage)
  @IsOptional()
  @IsEnum(ReviewStage)
  stage?: ReviewStage;
}

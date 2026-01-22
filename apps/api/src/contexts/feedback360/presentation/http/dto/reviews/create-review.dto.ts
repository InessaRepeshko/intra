import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ReviewStage } from '@intra/shared-kernel';

export class CreateReviewDto {
  @ApiProperty({ example: 10, description: 'Who we are evaluating' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateeId!: number;

  @ApiProperty({ example: 3, description: 'Position of the evaluated' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateePositionId!: number;

  @ApiProperty({ example: 'Senior Engineer', description: 'Назва посади оцінюваного' })
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(1)
  @MaxLength(REVIEW_CONSTRAINTS.NOTE.LENGTH.MAX)
  rateePositionTitle!: string;

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

  @ApiPropertyOptional({ example: 5, description: 'ІД команди' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({ example: 'Platform', description: 'Назва команди' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  teamTitle?: string;

  @ApiPropertyOptional({ example: 12, description: 'Менеджер оцінюваного' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  managerId?: number;

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

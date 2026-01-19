import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { Feedback360Stage } from 'src/contexts/performance/domain/feedback360-stage.enum';

export class CreateFeedbackDto {
  @ApiProperty({ example: 10, description: 'Who we are evaluating' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateeId!: number;

  @ApiPropertyOptional({ description: 'Comment of the evaluated' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
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
  @MaxLength(1000)
  hrNote?: string;

  @ApiPropertyOptional({ example: 1, description: 'Attached cycle' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number;

  @ApiPropertyOptional({ enum: Feedback360Stage, example: Feedback360Stage.VERIFICATION_BY_HR })
  @IsOptional()
  @IsEnum(Feedback360Stage)
  stage?: Feedback360Stage;
}

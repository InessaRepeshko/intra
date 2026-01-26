import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { CYCLE_CONSTRAINTS } from '@intra/shared-kernel';
import { ToOptionalBool, ToOptionalDate, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CycleStage, isAnonymityThresholdMet } from '@intra/shared-kernel';

export class CreateCycleDto {
  @ApiProperty({ example: 'Q1 2025', description: 'Cycle name (contains, case-insensitive)', type: 'string', minLength: CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN, maxLength: CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX, required: true })
  @ToOptionalTrimmedString({ min: CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN, max: CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX })
  @IsString()
  @IsNotEmpty()
  @MinLength(CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiPropertyOptional({ example: 'First 360 cycle for 2025', description: 'Description (contains, case-insensitive)', type: 'string', minLength: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, maxLength: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, required: false })
  @ToOptionalTrimmedString({ min: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, max: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string;

  @ApiProperty({ example: 2, description: 'HR responsible for the cycle', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  hrId!: number;

  @ApiPropertyOptional({ example: 5, description: 'Minimum number of respondents', default: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN, type: 'number', required: false })
  @ToOptionalInt({ min: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN })
  @IsInt()
  @Min(CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN)
  @ValidateIf((t) => isAnonymityThresholdMet(t, CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN))
  minRespondentsThreshold?: number;

  @ApiPropertyOptional({ enum: CycleStage, example: CycleStage.NEW, description: 'Cycle stage', default: CycleStage.NEW, type: 'string', required: false })
  @IsOptional()
  @IsEnum(CycleStage)
  stage?: CycleStage;

  @ApiPropertyOptional({ example: true, description: 'Is active cycle', default: true, type: 'boolean', required: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Start date', type: 'string', format: 'date-time', required: true })
  @ToOptionalDate()
  @IsDate()
  startDate!: Date;

  @ApiPropertyOptional({ example: '2025-01-10T00:00:00.000Z', description: 'Review deadline', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  reviewDeadline?: Date;

  @ApiPropertyOptional({ example: '2025-01-15T00:00:00.000Z', description: 'Approval deadline', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  approvalDeadline?: Date;

  @ApiPropertyOptional({ example: '2025-01-20T00:00:00.000Z', description: 'Response deadline', type: 'string', format: 'date-time', required: false })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  responseDeadline?: Date;

  @ApiProperty({ example: '2025-02-01T00:00:00.000Z', description: 'End date', type: 'string', format: 'date-time', required: true })
  @ToOptionalDate()
  @IsDate()
  endDate!: Date;
}

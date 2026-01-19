import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalDate, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CycleStage } from 'src/contexts/performance/domain/enum/cycle-stage.enum';

export class CreateCycleDto {
  @ApiProperty({ example: 'Q1 2025', description: 'Cycle name' })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'First 360 cycle for the team', description: 'Description' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2, description: 'HR, responsible for the cycle' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  hrId!: number;

  @ApiPropertyOptional({ enum: CycleStage, example: CycleStage.NEW, default: CycleStage.NEW })
  @IsOptional()
  @IsEnum(CycleStage)
  stage?: CycleStage;

  @ApiPropertyOptional({ example: true, default: true })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: String, example: '2025-01-01T00:00:00.000Z' })
  @ToOptionalDate()
  @IsDate()
  startDate!: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-10T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  reviewDeadline?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-15T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  approvalDeadline?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-01-20T00:00:00.000Z' })
  @ToOptionalDate()
  @IsOptional()
  @IsDate()
  surveyDeadline?: Date;

  @ApiProperty({ type: String, example: '2025-02-01T00:00:00.000Z' })
  @ToOptionalDate()
  @IsDate()
  endDate!: Date;
}

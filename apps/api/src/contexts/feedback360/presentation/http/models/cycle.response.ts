import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CYCLE_CONSTRAINTS } from '@intra/shared-kernel';
import { CycleStage } from '@intra/shared-kernel';

export class CycleResponse {
  @ApiProperty({ example: 1, description: 'Cycle id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Q1 2025', description: 'Cycle title', type: 'string', required: true, minimum: CYCLE_CONSTRAINTS.TITLE.LENGTH.MIN, maximum: CYCLE_CONSTRAINTS.TITLE.LENGTH.MAX })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ example: 'First cycle', description: 'Cycle description', type: 'string', required: false, nullable: true, minimum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, maximum: CYCLE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @Expose()
  description?: string | null;

  @ApiProperty({ example: 2, description: 'HR id', type: 'number', required: true })
  @Expose()
  hrId!: number;

  @ApiProperty({ example: 5, default: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN, description: 'Minimum number of respondents', type: 'number', required: true, minimum: CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN })
  @Expose()
  minRespondentsThreshold!: number;

  @ApiProperty({ enum: CycleStage, example: CycleStage.NEW, description: 'Cycle stage', type: 'string', required: true })
  @Expose()
  stage!: CycleStage;

  @ApiProperty({ example: true, description: 'Cycle is active', type: 'boolean', required: true })
  @Expose()
  isActive!: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle start date', type: 'string', format: 'date-time', required: true })
  @Expose()
  startDate!: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle review deadline', type: 'string', format: 'date-time', required: false, nullable: true })
  @Expose()
  reviewDeadline?: Date | null;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle approval deadline', type: 'string', format: 'date-time', required: false, nullable: true })
  @Expose()
  approvalDeadline?: Date | null;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle response deadline', type: 'string', format: 'date-time', required: false, nullable: true })
  @Expose()
  responseDeadline?: Date | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle end date', type: 'string', format: 'date-time', required: true })
  @Expose()
  endDate!: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Cycle updated at', type: 'string', format: 'date-time', required: false })
  @Expose()
  updatedAt?: Date;
}


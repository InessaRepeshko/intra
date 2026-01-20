import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CYCLE_CONSTANTS } from 'src/common/constants/cycle.constants';
import { CycleStage } from '../../../domain/enums/cycle-stage.enum';

export class CycleResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Q1 2025' })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ example: 'First cycle' })
  @Expose()
  description?: string | null;

  @ApiProperty({ example: 2 })
  @Expose()
  hrId!: number;

  @ApiProperty({ example: 5, default: CYCLE_CONSTANTS.ANONYMITY_THRESHOLD.MIN })
  @Expose()
  minRespondentsThreshold!: number;

  @ApiProperty({ enum: CycleStage, example: CycleStage.NEW })
  @Expose()
  stage!: CycleStage;

  @ApiProperty({ example: true })
  @Expose()
  isActive!: boolean;

  @ApiProperty({ type: String })
  @Expose()
  startDate!: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  reviewDeadline?: Date | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  approvalDeadline?: Date | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  responseDeadline?: Date | null;

  @ApiProperty({ type: String })
  @Expose()
  endDate!: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  updatedAt?: Date;
}


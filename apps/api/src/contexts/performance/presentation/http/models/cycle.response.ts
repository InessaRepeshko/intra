import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CycleStage } from '../../../domain/enum/cycle-stage.enum';

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
  surveyDeadline?: Date | null;

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


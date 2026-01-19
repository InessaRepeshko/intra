import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Feedback360Stage } from '../../../domain/enum/feedback360-stage.enum';

export class FeedbackResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  rateeId!: number;

  @ApiPropertyOptional({ example: 'Comment of the evaluated' })
  @Expose()
  rateeNote?: string | null;

  @ApiProperty({ example: 3 })
  @Expose()
  positionId!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  hrId!: number;

  @ApiPropertyOptional({ example: 'HR comment' })
  @Expose()
  hrNote?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @Expose()
  cycleId?: number | null;

  @ApiProperty({ enum: Feedback360Stage, example: Feedback360Stage.VERIFICATION_BY_HR })
  @Expose()
  stage!: Feedback360Stage;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  updatedAt?: Date;
}

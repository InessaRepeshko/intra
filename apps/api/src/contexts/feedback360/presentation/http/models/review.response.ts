import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ReviewStage } from '@intra/shared-kernel';

export class ReviewResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  rateeId!: number;

  @ApiProperty({ example: 3 })
  @Expose()
  rateePositionId!: number;

  @ApiProperty({ example: 'Senior Engineer' })
  @Expose()
  rateePositionTitle!: string;

  @ApiProperty({ example: 2 })
  @Expose()
  hrId!: number;

  @ApiPropertyOptional({ example: 'HR comment' })
  @Expose()
  hrNote?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @Expose()
  cycleId?: number | null;

  @ApiPropertyOptional({ example: 2 })
  @Expose()
  teamId?: number | null;

  @ApiPropertyOptional({ example: 'Platform team' })
  @Expose()
  teamTitle?: string | null;

  @ApiPropertyOptional({ example: 5 })
  @Expose()
  managerId?: number | null;

  @ApiProperty({ enum: ReviewStage, example: ReviewStage.VERIFICATION_BY_HR })
  @Expose()
  stage!: ReviewStage;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  updatedAt?: Date;
}

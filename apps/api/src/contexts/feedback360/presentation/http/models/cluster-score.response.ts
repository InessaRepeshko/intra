import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CLUSTER_SCORE_CONSTRAINTS } from '@intra/shared-kernel';

export class ClusterScoreResponse {
  @ApiProperty({ example: 1, description: 'Cluster score id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiPropertyOptional({ example: 1, description: 'Cycle id', type: 'number', required: false, nullable: true })
  @Expose()
  cycleId?: number | null;

  @ApiProperty({ example: 3, description: 'Cluster id', type: 'number', required: true })
  @Expose()
  clusterId!: number;

  @ApiProperty({ example: 7, description: 'Ratee id', type: 'number', required: true })
  @Expose()
  rateeId!: number;

  @ApiProperty({ example: 2, description: 'Review id', type: 'number', required: true })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 4.3, description: 'Cluster score', type: 'number', required: true, minimum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MIN, maximum: CLUSTER_SCORE_CONSTRAINTS.SCORE.MAX })
  @Expose()
  score!: number;

  @ApiProperty({ example: 5, description: 'Number of answers this score is based on', type: 'number', required: true, minimum: CLUSTER_SCORE_CONSTRAINTS.ANSWER_COUNT.MIN })
  @Expose()
  answersCount!: number;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Updated at', type: 'string', format: 'date-time', required: false })
  @Expose()
  updatedAt?: Date;
}

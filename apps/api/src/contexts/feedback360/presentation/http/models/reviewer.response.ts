import { REVIEW_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewerResponse {
  @ApiProperty({ example: 1, description: 'Reviewer id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2, description: 'Review id', type: 'number', required: true })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 4, description: 'Reviewer id', type: 'number', required: true })
  @Expose()
  reviewerId!: number;

  @ApiProperty({ example: 3, description: 'Position id', type: 'number', required: true })
  @Expose()
  positionId!: number;

  @ApiProperty({ example: 'Tech Lead', description: 'Position title', type: 'string', required: true, minimum: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MAX })
  @Expose()
  positionTitle!: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;
}

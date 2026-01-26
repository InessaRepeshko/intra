import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { REVIEW_CONSTRAINTS, ReviewStage } from '@intra/shared-kernel';

export class ReviewResponse {
  @ApiProperty({ example: 1, description: 'Review id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 10, description: 'Ratee id', type: 'number', required: true })
  @Expose()
  rateeId!: number;

  @ApiProperty({ example: 3, description: 'Ratee position id', type: 'number', required: true })
  @Expose()
  rateePositionId!: number;

  @ApiProperty({ example: 'Senior Engineer', description: 'Ratee position title', type: 'string', required: true, minimum: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.RATEE_POSITION_TITLE.LENGTH.MAX })
  @Expose()
  rateePositionTitle!: string;

  @ApiProperty({ example: 2, description: 'HR id', type: 'number', required: true })
  @Expose()
  hrId!: number;

  @ApiPropertyOptional({ example: 'HR comment', description: 'HR note', type: 'string', required: false, nullable: true, minimum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX })
  @Expose()
  hrNote?: string | null;

  @ApiPropertyOptional({ example: 2, description: 'Team id', type: 'number', required: false, nullable: true })
  @Expose()
  teamId?: number | null;

  @ApiPropertyOptional({ example: 'Platform team', description: 'Team title', type: 'string', required: false, nullable: true, minimum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, maximum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
  @Expose()
  teamTitle?: string | null;

  @ApiPropertyOptional({ example: 5, description: 'Manager id', type: 'number', required: false, nullable: true })
  @Expose()
  managerId?: number | null;

  @ApiPropertyOptional({ example: 1, description: 'Cycle id', type: 'number', required: false, nullable: true })
  @Expose()
  cycleId?: number | null;

  @ApiProperty({ enum: ReviewStage, example: ReviewStage.VERIFICATION_BY_HR, description: 'Review stage', type: 'string', required: true })
  @Expose()
  stage!: ReviewStage;

  @ApiPropertyOptional({ example: 1, description: 'Report id', type: 'number', required: false, nullable: true })
  @Expose()
  reportId?: number | null;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Updated at', type: 'string', format: 'date-time', required: false })
  @Expose()
  updatedAt?: Date;
}

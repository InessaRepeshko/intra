import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { REVIEWER_CONSTRAINTS, ReviewerDto } from '@intra/shared-kernel';

export class ReviewerResponse implements ReviewerDto {
  @ApiProperty({ example: 1, description: 'Reviewer id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2, description: 'Review id', type: 'number', required: true })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 4, description: 'Reviewer id', type: 'number', required: true })
  @Expose()
  reviewerId!: number;

  @ApiProperty({ example: 'Ivanna Bulava', description: 'Reviewer full name', type: 'string', required: true, minimum: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MIN, maximum: REVIEWER_CONSTRAINTS.FULL_NAME.LENGTH.MAX })
  @Expose()
  fullName!: string;

  @ApiProperty({ example: 3, description: 'Position id', type: 'number', required: true })
  @Expose()
  positionId!: number;

  @ApiProperty({ example: 'Tech Lead', description: 'Position title', type: 'string', required: true, minimum: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN, maximum: REVIEWER_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX })
  @Expose()
  positionTitle!: string;

  @ApiProperty({ example: 5, description: 'Team id', type: 'number', required: false, nullable: true })
  @Expose()
  teamId?: number | null;

  @ApiProperty({ example: 'Engineering team', description: 'Team title', type: 'string', required: false, nullable: true, minimum: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN, maximum: REVIEWER_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX })
  @Expose()
  teamTitle?: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time' })
  @Expose()
  createdAt!: Date;
}

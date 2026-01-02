import { ApiProperty } from '@nestjs/swagger';
import { Feedback360ReviewerRelation } from '../../models/feedback360-reviewer-relation.entity';

export class Feedback360ReviewerRelationsPageDto {
  @ApiProperty({ type: () => [Feedback360ReviewerRelation] })
  items: Feedback360ReviewerRelation[];

  @ApiProperty({ type: 'number', description: 'Number of relations in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of relations matching the filter', example: 10 })
  total: number;
}



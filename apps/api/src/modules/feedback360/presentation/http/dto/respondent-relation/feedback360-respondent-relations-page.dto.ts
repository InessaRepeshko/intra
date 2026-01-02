import { ApiProperty } from '@nestjs/swagger';
import { Feedback360RespondentRelation } from '../../models/feedback360-respondent-relation.entity';

export class Feedback360RespondentRelationsPageDto {
  @ApiProperty({ type: () => [Feedback360RespondentRelation] })
  items: Feedback360RespondentRelation[];

  @ApiProperty({ type: 'number', description: 'Number of relations in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of relations matching the filter', example: 10 })
  total: number;
}



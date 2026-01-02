import { ApiProperty } from '@nestjs/swagger';
import { Feedback360 } from '../models/feedback360.entity';

export class Feedback360PageDto {
  @ApiProperty({ type: () => [Feedback360] })
  items: Feedback360[];

  @ApiProperty({ type: 'number', description: 'Number of feedback360 records in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of feedback360 records matching the filter', example: 10 })
  total: number;
}



import { ApiProperty } from '@nestjs/swagger';
import { Feedback360Cycle } from '../../models/feedback360-cycle.entity';

export class Feedback360CyclesPageDto {
  @ApiProperty({ type: () => [Feedback360Cycle] })
  items: Feedback360Cycle[];

  @ApiProperty({ type: 'number', description: 'Number of cycles in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of cycles matching the filter', example: 10 })
  total: number;
}



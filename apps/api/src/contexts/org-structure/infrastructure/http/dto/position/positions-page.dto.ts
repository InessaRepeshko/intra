import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../../models/position.entity';

export class PositionsPageDto {
  @ApiProperty({ type: () => [Position] })
  items: Position[];

  @ApiProperty({ type: 'number', description: 'Number of positions in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of positions matching the filter', example: 10 })
  total: number;
}


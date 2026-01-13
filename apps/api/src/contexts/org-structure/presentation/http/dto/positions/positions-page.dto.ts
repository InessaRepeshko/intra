import { ApiProperty } from '@nestjs/swagger';
import { PositionResponse } from '../../models/position.response';

export class PositionsPageDto {
  @ApiProperty({ type: [PositionResponse] })
  items!: PositionResponse[];

  @ApiProperty({ description: 'Number of items in response', example: 10 })
  count!: number;

  @ApiProperty({ description: 'Total number of records', example: 100 })
  total!: number;
}

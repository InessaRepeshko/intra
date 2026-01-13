import { ApiProperty } from '@nestjs/swagger';
import { TeamResponse } from '../../models/team.response';

export class TeamsPageDto {
  @ApiProperty({ type: [TeamResponse] })
  items!: TeamResponse[];

  @ApiProperty({ description: 'Number of items in response', example: 10 })
  count!: number;

  @ApiProperty({ description: 'Total number of records', example: 100 })
  total!: number;
}

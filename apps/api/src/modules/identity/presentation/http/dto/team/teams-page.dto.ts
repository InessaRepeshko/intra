import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../../models/team.entity';

export class TeamsPageDto {
  @ApiProperty({ type: () => [Team] })
  items: Team[];

  @ApiProperty({ type: 'number', description: 'Number of teams in current page', example: 1 })
  count: number;

  @ApiProperty({ type: 'number', description: 'Total number of teams matching the filter', example: 10 })
  total: number;
}



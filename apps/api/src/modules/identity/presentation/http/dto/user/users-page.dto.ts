import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../models/user.entity';

export class UsersPageDto {
  @ApiProperty({ type: () => [User] })
  items: User[];

  @ApiProperty({
    type: 'number',
    description: 'Number of users in current page',
    example: 1,
  })
  count: number;

  @ApiProperty({
    type: 'number',
    description: 'Total number of users matching the filter',
    example: 10,
  })
  total: number;
}



import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../models/user.response';

export class UsersPageDto {
  @ApiProperty({ type: [UserResponse] })
  items!: UserResponse[];

  @ApiProperty({ description: 'Number of elements in response', example: 10 })
  count!: number;

  @ApiProperty({ description: 'Total number of records', example: 100 })
  total!: number;
}

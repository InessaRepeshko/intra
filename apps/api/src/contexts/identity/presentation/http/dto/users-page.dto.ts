import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../models/user.response';

export class UsersPageDto {
  @ApiProperty({ type: [UserResponse] })
  items!: UserResponse[];

  @ApiProperty({ description: 'Кількість елементів у відповіді', example: 10 })
  count!: number;

  @ApiProperty({ description: 'Загальна кількість записів', example: 100 })
  total!: number;
}

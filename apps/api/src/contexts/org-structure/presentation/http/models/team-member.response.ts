import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponse } from 'src/contexts/identity/presentation/http/models/user.response';

export class TeamMemberResponse {
  @ApiProperty({ example: 101 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 3 })
  @Expose()
  teamId!: number;

  @ApiProperty({ example: 42 })
  @Expose()
  userId!: number;

  @ApiProperty({ example: false })
  @Expose()
  isPrimary!: boolean;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: () => UserResponse, required: false })
  @Expose()
  @Type(() => UserResponse)
  user?: UserResponse;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponse } from 'src/contexts/identity/presentation/http/models/user.response';

export class TeamMemberResponse {
  @ApiProperty({ example: 101, type: 'number', description: 'Team member id' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 3, type: 'number', description: 'Team id' })
  @Expose()
  teamId!: number;

  @ApiProperty({ example: 42, type: 'number', description: 'Member id' })
  @Expose()
  memberId!: number;

  @ApiProperty({ example: false, type: 'boolean', description: 'Is primary member' })
  @Expose()
  isPrimary!: boolean;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2024-01-02T10:00:00.000Z', description: 'Team member created at' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: () => UserResponse, required: false, description: 'User data' })
  @Expose()
  @Type(() => UserResponse)
  user?: UserResponse;
}
